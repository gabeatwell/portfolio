import {
    Object3D,
    Vector3,
    Mesh,
    BoxGeometry,
    MeshStandardMaterial,
    SphereGeometry,
    Color,
} from 'three';
import type { ModelSize } from '../FPSModelLoader';
import type { World } from '../../shooter/world';
import { EnemyFSM, EnemyState } from './EnemyStateMachine';
import { AIPerception } from './AIPerception';
import {
    EnemyArchetype,
    ARCHETYPE_CONFIGS,
    type ArchetypeConfig,
} from './EnemyArchetypes';
import {
    findPath,
    worldToCell,
    cellToWorld,
    type Cell,
} from './FPSPathfinding';

export class FPSEnemy extends Object3D {
    // ─── Public state (read by manager / combat) ─────────────
    readonly archetype: EnemyArchetype;
    private config: ArchetypeConfig;

    // ─── Core systems ────────────────────────────────────────
    readonly fsm: EnemyFSM;
    readonly perception: AIPerception;

    // ─── Combat stats ────────────────────────────────────────
    private health: number;
    readonly maxHealth: number;
    private shootCooldown: number = 0;
    private ammo: number | null = 10;

    // ─── Movement ────────────────────────────────────────────
    private facingDirection: Vector3 = new Vector3(0, 0, 1);
    private moveTarget: Vector3 | null = null;

    // ─── Pathfinding ─────────────────────────────────────────
    private currentPath: Cell[] = [];
    private pathIndex: number = 0;
    private pathRecalcTimer: number = 0;
    private readonly pathRecalcInterval: number = 0.4; // seconds

    // ─── Patrol ──────────────────────────────────────────────
    private patrolWaypoints: Vector3[] = [];
    private patrolIndex: number = 0;

    // ─── Flank ───────────────────────────────────────────────
    private flankDirection: number = 1; // 1 = left, -1 = right
    /** Per-enemy random phase offset so enemies don't strafe in sync */
    private strafePhase: number = 0;

    // ─── Patrol dwell ─────────────────────────────────────────
    /** Time (seconds) spent waiting at the current patrol waypoint */
    private patrolDwellTimer: number = 0;
    /** Duration (seconds) to wait at this patrol waypoint before moving on */
    private patrolDwellDuration: number = 0;

    // ─── Dodge / evade ────────────────────────────────────────
    /** Cooldown until next dodge burst can trigger */
    private dodgeCooldownTimer: number = 0;
    /** Whether the enemy is currently in a dodge burst */
    private isDodging: boolean = false;
    /** Remaining time of the current dodge burst */
    private dodgeBurstTimer: number = 0;
    /** Direction vector of the current dodge */
    private dodgeDir: Vector3 = new Vector3();

    // ─── Spawn idle ──────────────────────────────────────────
    /** Timestamp when this enemy was created — blocks perception briefly */
    private spawnTime: number = 0;
    /** Duration (seconds) before the enemy becomes fully active */
    private readonly spawnIdleDuration: number = 0.8;

    // ─── Visual (box fallback) ────────────────────────────────
    private body: Mesh | null = null;
    private head: Mesh | null = null;
    private readonly originalBodyColor: number = 0;
    private readonly originalHeadColor: number = 0;
    private flashTimer: number = 0;
    private readonly flashDuration: number = 0.08;

    // ─── Visual (GLTF model) ─────────────────────────────────
    /** Root of the cloned GLTF model (if using model instead of box/head) */
    private modelRoot: Object3D | null = null;
    /** Cached mesh children of the model for hit-flash traversal */
    private modelMeshes: { mesh: Mesh; originalColor: number }[] = [];

    // ─── Death ────────────────────────────────────────────────
    private deathTimer: number = 0;
    private readonly deathDuration: number = 1.0;
    private dead: boolean = false;

    // ─── Dependencies ────────────────────────────────────────
    private world: World;
    private player: Object3D;
    /** Buildings group — used for LOS raycasting */
    private obstacles: Object3D[] = [];

    // ─── Boss flag ──────────────────────────────────────────
    /** If true, this enemy is a boss — bigger, glowier, mini-boss fight */
    readonly isBoss: boolean = false;

    // ─── Hitbox ─────────────────────────────────────────────
    /** Hit detection sphere radius — scales with boss size */
    private readonly hitboxRadius: number;

    // ─── Id ──────────────────────────────────────────────────
    readonly enemyId: number;
    private static nextEnemyId = 0;

    // ─── Hit callback ────────────────────────────────────────
    onHit: ((enemy: FPSEnemy) => void) | null = null;
    /** Squad order from manager */
    squadOrder: string | null = null;
    /**
     * Static Y-rotation offset to correct each GLTF model's intrinsic facing.
     * Added to the player-facing angle so the model's front ends up toward the player.
     */
    private modelRotationOffset: number = 0;

    constructor(
        position: Vector3,
        world: World,
        player: Object3D,
        archetype: EnemyArchetype = EnemyArchetype.Grunt,
        obstacles: Object3D[] = [],
        isBoss: boolean = false,
        /** Pre-loaded GLTF scene for normal enemies */
        private enemyModel?: Object3D,
        /** Pre-loaded GLTF scene for the boss (Bob the Tomato) */
        private bossModel?: Object3D,
        private enemySize?: ModelSize,
        private bossSize?: ModelSize,
    ) {
        super();
        this.enemyId = FPSEnemy.nextEnemyId++;
        this.world = world;
        this.player = player;
        this.archetype = archetype;
        this.config = ARCHETYPE_CONFIGS[archetype];
        this.obstacles = obstacles;
        this.isBoss = isBoss;

        // Boss gets bonus HP on top of archetype base
        const bossHpBonus = isBoss ? 10 : 0;

        // Hitbox scales with boss size
        this.hitboxRadius = isBoss ? 1.8 : 0.9;

        // Stats from archetype config
        this.health = this.config.health + bossHpBonus;
        this.maxHealth = this.config.health + bossHpBonus;
        this.originalBodyColor = this.config.color;
        this.originalHeadColor = this.config.headColor;

        this.position.copy(position);
        this.position.y = 0.5;

        // Initialize player position tracking to prevent hearing spike on first frame
        this.lastPlayerPos.copy(this.player.position);

        // ─── Meshes or GLTF Model ───────────────────────────
        const bossScale = isBoss ? 2.0 : 1.0;

        if (isBoss && this.bossModel) {
            // Use Bob the Tomato for the boss — scale to 2.4 units tall
            this.modelRoot = this.bossModel.clone(true);
            const bossH = this.bossSize?.height ?? 1;
            this.modelRoot.scale.setScalar(2.4 / bossH);
            this.modelRoot.traverse((child) => {
                if ((child as Mesh).isMesh) {
                    const m = child as Mesh;
                    const mat = m.material as MeshStandardMaterial;
                    if (mat) {
                        mat.emissive = new Color(0xff4400);
                        mat.emissiveIntensity = 0.6;
                        this.modelMeshes.push({
                            mesh: m,
                            originalColor: mat.color.getHex(),
                        });
                    }
                }
            });
            this.modelRotationOffset = Math.PI / 4; // model faces 45° to the left
            this.add(this.modelRoot);
        } else if (this.enemyModel) {
            // Use Minecraft avatar for normal enemies — scale to 1.2 units tall
            this.modelRoot = this.enemyModel.clone(true);
            const enemyH = this.enemySize?.height ?? 1;
            this.modelRoot.scale.setScalar(1.2 / enemyH);
            this.modelRoot.traverse((child) => {
                if ((child as Mesh).isMesh) {
                    const m = child as Mesh;
                    const mat = m.material as MeshStandardMaterial;
                    if (mat) {
                        this.modelMeshes.push({
                            mesh: m,
                            originalColor: mat.color.getHex(),
                        });
                    }
                }
            });
            this.modelRotationOffset = Math.PI; // reverse facing — model's front is -Z
            this.add(this.modelRoot);
        } else {
            // Fallback: create box + sphere meshes
            const bodyGeo = new BoxGeometry(
                0.8 * bossScale,
                1.2 * bossScale,
                0.8 * bossScale,
            );
            const bodyMat = new MeshStandardMaterial({
                color: this.config.color,
                emissive: isBoss ? new Color(0xff4400) : undefined,
                emissiveIntensity: isBoss ? 0.6 : 0,
            });
            this.body = new Mesh(bodyGeo, bodyMat);
            this.body.position.y = 0.6 * bossScale;
            this.add(this.body);

            const headGeo = new SphereGeometry(0.35 * bossScale, 8, 8);
            const headMat = new MeshStandardMaterial({
                color: this.config.headColor,
                emissive: isBoss ? new Color(0xff4400) : undefined,
                emissiveIntensity: isBoss ? 0.4 : 0,
            });
            this.head = new Mesh(headGeo, headMat);
            this.head.position.y = 1.3 * bossScale;
            this.add(this.head);
        }

        // ─── Patrol waypoints ────────────────────────────────
        this.generatePatrolRoute(position);

        // ─── Flank direction & strafe phase ────────────────
        this.flankDirection = Math.random() > 0.5 ? 1 : -1;
        this.strafePhase = Math.random() * Math.PI * 2;

        // ─── Spawn idle timer ────────────────────────────────
        this.spawnTime = performance.now();

        // ─── Perception ──────────────────────────────────────
        this.perception = new AIPerception();
        this.perception.setObstacles(this.obstacles);

        // ─── FSM ─────────────────────────────────────────────
        this.fsm = new EnemyFSM(EnemyState.Patrol, {
            [EnemyState.Idle]: this.makeIdleHandlers(),
            [EnemyState.Patrol]: this.makePatrolHandlers(),
            [EnemyState.Alert]: this.makeAlertHandlers(),
            [EnemyState.Chase]: this.makeChaseHandlers(),
            [EnemyState.Attack]: this.makeAttackHandlers(),
            [EnemyState.Flank]: this.makeFlankHandlers(),
            [EnemyState.Retreat]: this.makeRetreatHandlers(),
            [EnemyState.Search]: this.makeSearchHandlers(),
        });
    }

    // ════════════════════════════════════════════════════════════
    //  PUBLIC API
    // ════════════════════════════════════════════════════════════

    takeDamage(amount: number = 1): void {
        if (!this.isAlive()) return;
        this.health -= amount;
        this.flashTimer = this.flashDuration;

        // Flash white on hit (model meshes or box body)
        if (this.modelMeshes.length > 0) {
            for (const entry of this.modelMeshes) {
                (entry.mesh.material as MeshStandardMaterial).color.setHex(
                    0xffffff,
                );
            }
        } else if (this.body) {
            (this.body.material as MeshStandardMaterial).color.setHex(0xffffff);
        }

        this.onHit?.(this);

        if (!this.isAlive()) {
            this.die();
        }
    }

    isAlive(): boolean {
        return this.health > 0;
    }

    isDead(): boolean {
        return this.dead;
    }

    getHealth(): number {
        return this.health;
    }

    getMaxHealth(): number {
        return this.maxHealth;
    }

    getFacingDirection(): Vector3 {
        return this.facingDirection.clone();
    }

    getHitboxRadius(): number {
        return this.hitboxRadius;
    }

    canShoot(): boolean {
        if (this.config.meleeOnly) return false;
        const dist = this.position.distanceTo(this.player.position);
        if (this.ammo !== null && this.ammo <= 0) return false;
        return (
            this.shootCooldown <= 0 &&
            dist < this.config.attackRange &&
            this.isAlive()
        );
    }

    shoot(): void {
        if (this.canShoot()) {
            this.shootCooldown = this.isBoss
                ? Math.max(0.6, this.config.shootCooldown * 0.5)
                : this.config.shootCooldown;
            if (this.ammo !== null) this.ammo -= 1;
        }
    }

    /** Melee attack — returns true if player is in melee range */
    canMelee(): boolean {
        if (!this.config.meleeOnly) return false;
        const dist = this.position.distanceTo(this.player.position);
        return dist < this.config.attackRange && this.isAlive();
    }

    getAmmo(): number | null {
        return this.ammo;
    }

    setAmmo(n: number | null): void {
        this.ammo = n;
    }

    getShootCooldown(): number {
        return this.shootCooldown;
    }

    doMeleeDamage(): number {
        return this.config.damage;
    }

    /** Damage per shot — doubled for the boss */
    getShotDamage(): number {
        return this.isBoss ? this.config.damage * 2 : this.config.damage;
    }

    /** Rebuild obstacle list when buildings change */
    setObstacles(obstacles: Object3D[]): void {
        this.obstacles = obstacles;
        this.perception.setObstacles(obstacles);
    }

    // ════════════════════════════════════════════════════════════
    //  UPDATE
    // ════════════════════════════════════════════════════════════

    update(dt: number = 1 / 60): void {
        // Death animation
        if (this.dead) {
            this.deathTimer -= dt;
            this.position.y =
                -0.5 + (this.deathTimer / this.deathDuration) * 0.5;
            if (this.deathTimer <= 0) {
                this.visible = false;
            }
            return;
        }

        // ─── Spawn idle ──────────────────────────────────
        // Newly-spawned enemies are dazed for ~0.8 s so they don't
        // instantly swarm the player or start doing their patrol circle.
        const elapsed = (performance.now() - this.spawnTime) / 1000;
        if (elapsed < this.spawnIdleDuration) {
            this.fsm.current = EnemyState.Patrol;
            this.fsm.elapsed = 999;
            return;
        }

        // Update perception
        const playerSpeed = this.calcPlayerSpeed();
        this.perception.update(
            this.position,
            this.player.position,
            playerSpeed,
            dt,
        );

        // Update cooldowns
        if (this.shootCooldown > 0) this.shootCooldown -= dt;
        if (this.flashTimer > 0) {
            this.flashTimer -= dt;
            if (this.flashTimer <= 0) {
                if (this.modelMeshes.length > 0) {
                    for (const entry of this.modelMeshes) {
                        (
                            entry.mesh.material as MeshStandardMaterial
                        ).color.setHex(entry.originalColor);
                    }
                } else if (this.body) {
                    (this.body.material as MeshStandardMaterial).color.setHex(
                        this.originalBodyColor,
                    );
                }
            }
        }

        // Update pathfinding timer
        this.pathRecalcTimer -= dt;

        // FSM update
        this.fsm.update(dt);
    }

    /** Rough player speed estimate from position delta */
    private lastPlayerPos: Vector3 = new Vector3();
    private calcPlayerSpeed(): number {
        const now = this.player.position.clone();
        const dist = now.distanceTo(this.lastPlayerPos);
        this.lastPlayerPos.copy(now);
        return dist * 60; // approximate per-second speed
    }

    // ════════════════════════════════════════════════════════════
    //  FSM HANDLER BUILDERS
    //  Each returns StateHandlers for the FSM.
    // ════════════════════════════════════════════════════════════

    private makeIdleHandlers() {
        const self = this;
        let lookAngle = 0;
        return {
            onEnter: () => {
                lookAngle = Math.random() * Math.PI * 2;
                self.moveTarget = null;
            },
            onUpdate: (_dt: number) => {
                // Slow head turning
                lookAngle += _dt * 0.5;
                self.setFacingRotation(lookAngle);
                self.facingDirection.set(
                    Math.sin(lookAngle),
                    0,
                    Math.cos(lookAngle),
                );
            },
            transitions: [
                {
                    to: EnemyState.Alert,
                    condition: () => self.perception.isAlerted(),
                    priority: 2,
                },
                {
                    to: EnemyState.Patrol,
                    condition: () => self.fsm.elapsed > 3 + Math.random() * 2,
                    priority: 1,
                },
            ],
        };
    }

    private makePatrolHandlers() {
        const self = this;
        return {
            onEnter: () => {
                self.pickNextPatrolPoint();
            },
            onUpdate: (_dt: number) => {
                if (self.moveTarget === null) {
                    // At a waypoint — dwell before moving on
                    self.patrolDwellTimer += _dt;
                    if (self.patrolDwellTimer >= self.patrolDwellDuration) {
                        self.pickNextPatrolPoint();
                    }
                    // Slow head look-around while dwelling
                    const lookAngle = Math.sin(performance.now() * 0.002) * 0.5;
                    self.setFacingRotation(lookAngle);
                } else {
                    self.moveTowardTarget(self.config.moveSpeed, _dt);
                }
            },
            transitions: [
                {
                    to: EnemyState.Alert,
                    condition: () => self.perception.isAlerted(),
                    priority: 2,
                },
                {
                    to: EnemyState.Idle,
                    condition: () =>
                        self.moveTarget === null &&
                        self.patrolDwellTimer >= self.patrolDwellDuration &&
                        self.fsm.elapsed > 1,
                    priority: 1,
                },
            ],
        };
    }

    private makeAlertHandlers() {
        const self = this;
        return {
            onEnter: () => {
                self.moveTarget =
                    self.perception.lastKnownPosition?.clone() ?? null;
            },
            onUpdate: (_dt: number) => {
                if (self.moveTarget) {
                    self.moveTowardTarget(self.config.moveSpeed * 1.2, _dt);
                }
            },
            transitions: [
                {
                    to: EnemyState.Chase,
                    condition: () => self.perception.isFullyAware(),
                    priority: 3,
                },
                {
                    to: EnemyState.Search,
                    condition: () =>
                        !self.perception.isAlerted() && self.fsm.elapsed > 2,
                    priority: 1,
                },
                {
                    to: EnemyState.Chase,
                    condition: () =>
                        self.perception.canSeePlayer &&
                        self.perception.awareness >= 40,
                    priority: 2,
                },
            ],
        };
    }

    private makeChaseHandlers() {
        const self = this;
        return {
            onEnter: () => {
                self.recalcPathToPlayer();
            },
            onUpdate: (_dt: number) => {
                // Recalc path periodically
                if (self.pathRecalcTimer <= 0) {
                    self.recalcPathToPlayer();
                }

                // ─── Archetype-specific chase behavior ────────
                if (self.archetype === EnemyArchetype.Rusher) {
                    // Rushers: sprint directly at player when close enough
                    const dist = self.position.distanceTo(self.player.position);
                    if (dist < 15) {
                        // Direct sprint — ignore pathfinding
                        const toPlayer = new Vector3().subVectors(
                            self.player.position,
                            self.position,
                        );
                        toPlayer.y = 0;
                        toPlayer.normalize();
                        const speed = self.config.moveSpeed * 1.5;
                        const tx = self.position.x + toPlayer.x * speed * _dt;
                        const tz = self.position.z + toPlayer.z * speed * _dt;
                        if (!self.isBlockedPosition(tx, tz)) {
                            self.position.x = tx;
                            self.position.z = tz;
                        }
                        self.clampToWorldBounds();
                        self.facingDirection.copy(toPlayer);
                        self.setFacingRotation(
                            Math.atan2(toPlayer.x, toPlayer.z),
                        );
                        return;
                    }
                    // Far away: use pathfinding but faster
                    self.followPath(self.config.moveSpeed * 1.5, _dt);
                } else if (
                    self.squadOrder === 'flank_left' ||
                    self.squadOrder === 'flank_right'
                ) {
                    // Squad flanking: pathfind to a point beside the player
                    const toPlayer = new Vector3().subVectors(
                        self.player.position,
                        self.position,
                    );
                    toPlayer.y = 0;
                    toPlayer.normalize();
                    const flankDir = new Vector3(-toPlayer.z, 0, toPlayer.x);
                    const side = self.squadOrder === 'flank_left' ? -1 : 1;
                    const offset = 6;
                    const flankTarget = self.player.position
                        .clone()
                        .add(flankDir.multiplyScalar(offset * side))
                        .add(toPlayer.multiplyScalar(3));
                    flankTarget.x = Math.max(1, Math.min(48, flankTarget.x));
                    flankTarget.z = Math.max(1, Math.min(48, flankTarget.z));
                    // Path toward flank target
                    if (self.pathRecalcTimer <= 0) {
                        self.recalcPathTo(flankTarget.x, flankTarget.z);
                    }
                    self.followPath(self.config.moveSpeed * 1.2, _dt);
                } else if (self.archetype === EnemyArchetype.Sniper) {
                    // Snipers: maintain distance — don't chase into close range
                    const dist = self.position.distanceTo(self.player.position);
                    if (dist < 15) {
                        // Stop chasing, strafe and face player from range
                        self.facePlayer();
                        self.strafe(_dt, 0.5);
                        return;
                    }
                    self.followPath(self.config.moveSpeed * 1.2, _dt);
                } else {
                    // Standard chase
                    self.followPath(self.config.moveSpeed * 1.3, _dt);
                }
            },
            transitions: [
                {
                    to: EnemyState.Attack,
                    condition: () => {
                        const d = self.position.distanceTo(
                            self.player.position,
                        );
                        return (
                            d <= self.config.attackRange &&
                            self.perception.canSeePlayer
                        );
                    },
                    priority: 3,
                },
                {
                    to: EnemyState.Search,
                    condition: () =>
                        !self.perception.canSeePlayer && self.fsm.elapsed > 1.5,
                    priority: 2,
                },
                {
                    to: EnemyState.Flank,
                    condition: () => {
                        if (
                            self.archetype === EnemyArchetype.Tank ||
                            self.archetype === EnemyArchetype.Rusher ||
                            self.archetype === EnemyArchetype.Sniper
                        )
                            return false;
                        // Squad flanking orders trigger flank state
                        const squadTriggersFlank =
                            self.squadOrder === 'flank_left' ||
                            self.squadOrder === 'flank_right';
                        return (
                            self.perception.canSeePlayer &&
                            self.fsm.elapsed > 2 &&
                            (Math.random() < self.config.flankChance ||
                                squadTriggersFlank)
                        );
                    },
                    priority: 1,
                },
            ],
        };
    }

    private makeAttackHandlers() {
        const self = this;
        return {
            onEnter: () => {
                self.facePlayer();
            },
            onUpdate: (_dt: number) => {
                // Archetype-specific attack movement
                if (self.archetype === EnemyArchetype.Sniper) {
                    // Snipers backpedal when player gets close
                    const dist = self.position.distanceTo(self.player.position);
                    if (dist < 10) {
                        const away = new Vector3().subVectors(
                            self.position,
                            self.player.position,
                        );
                        away.y = 0;
                        away.normalize();
                        const speed = self.config.moveSpeed * 0.6;
                        const tx = self.position.x + away.x * speed * _dt;
                        const tz = self.position.z + away.z * speed * _dt;
                        if (!self.isBlockedPosition(tx, tz)) {
                            self.position.x = tx;
                            self.position.z = tz;
                        }
                        self.clampToWorldBounds();
                    }
                    self.strafe(_dt, 0.8);
                } else if (self.archetype === EnemyArchetype.Tank) {
                    // Tanks slowly advance while attacking
                    const toPlayer = new Vector3().subVectors(
                        self.player.position,
                        self.position,
                    );
                    toPlayer.y = 0;
                    toPlayer.normalize();
                    const advanceSpeed = 0.5;
                    const tx =
                        self.position.x + toPlayer.x * advanceSpeed * _dt;
                    const tz =
                        self.position.z + toPlayer.z * advanceSpeed * _dt;
                    if (!self.isBlockedPosition(tx, tz)) {
                        self.position.x = tx;
                        self.position.z = tz;
                    }
                    self.clampToWorldBounds();
                    self.strafe(_dt, 0.5);
                } else if (self.archetype === EnemyArchetype.Rusher) {
                    // Rushers circle aggressively at melee range
                    self.strafe(_dt, 1.5);
                } else {
                    // Standard strafe + dodge for Grunts and others
                    self.strafe(_dt, self.getStrafeMultiplier());
                    self.updateDodge(_dt);
                }
                self.facePlayer();

                // Shooting is handled by the manager's getEnemyProjectiles()
                // which calls enemy.shoot() — do NOT call it here or the
                // cooldown will already be active when the manager checks.
            },
            transitions: [
                {
                    to: EnemyState.Retreat,
                    condition: () => {
                        // Tanks and Rushers never retreat
                        if (
                            self.archetype === EnemyArchetype.Tank ||
                            self.archetype === EnemyArchetype.Rusher
                        )
                            return false;
                        // Snipers retreat more readily
                        const hpPct = self.health / self.maxHealth;
                        const retreatThreshold =
                            self.archetype === EnemyArchetype.Sniper
                                ? 0.5
                                : 0.3;
                        return (
                            hpPct < retreatThreshold &&
                            Math.random() < self.config.retreatChance
                        );
                    },
                    priority: 4,
                },
                {
                    to: EnemyState.Chase,
                    condition: () => {
                        const d = self.position.distanceTo(
                            self.player.position,
                        );
                        // Snipers re-chase at wider range
                        const rangeMul =
                            self.archetype === EnemyArchetype.Sniper
                                ? 0.8
                                : 1.3;
                        return d > self.config.attackRange * rangeMul;
                    },
                    priority: 3,
                },
                {
                    to: EnemyState.Flank,
                    condition: () => {
                        if (
                            self.archetype === EnemyArchetype.Tank ||
                            self.archetype === EnemyArchetype.Sniper
                        )
                            return false;
                        // Consume squad order: flanking orders increase flank chance
                        const squadBonus =
                            self.squadOrder === 'flank_left' ||
                            self.squadOrder === 'flank_right'
                                ? 0.5
                                : 0;
                        return (
                            self.fsm.elapsed > 2.5 &&
                            Math.random() <
                                self.config.flankChance * 1.5 + squadBonus
                        );
                    },
                    priority: 2,
                },
            ],
        };
    }

    private makeFlankHandlers() {
        const self = this;
        return {
            onEnter: () => {
                // Use squad order to pick flank side
                if (self.squadOrder === 'flank_left') {
                    self.flankDirection = -1;
                } else if (self.squadOrder === 'flank_right') {
                    self.flankDirection = 1;
                }
                self.calculateFlankPosition();
            },
            onUpdate: (_dt: number) => {
                if (self.moveTarget) {
                    self.moveTowardTarget(self.config.moveSpeed * 1.2, _dt);
                }
                self.facePlayer();
            },
            transitions: [
                {
                    to: EnemyState.Attack,
                    condition: () => {
                        const d = self.position.distanceTo(
                            self.player.position,
                        );
                        return (
                            d <= self.config.attackRange &&
                            self.fsm.elapsed > 0.5
                        );
                    },
                    priority: 3,
                },
                {
                    to: EnemyState.Chase,
                    condition: () =>
                        self.moveTarget === null || self.fsm.elapsed > 3,
                    priority: 2,
                },
            ],
        };
    }

    private makeRetreatHandlers() {
        const self = this;
        return {
            onEnter: () => {
                self.calculateRetreatPosition();
            },
            onUpdate: (_dt: number) => {
                if (self.moveTarget) {
                    self.moveTowardTarget(self.config.moveSpeed * 1.5, _dt);
                }
            },
            transitions: [
                {
                    to: EnemyState.Chase,
                    condition: () => {
                        const d = self.position.distanceTo(
                            self.player.position,
                        );
                        return d > 12 || self.fsm.elapsed > 3;
                    },
                    priority: 2,
                },
                {
                    to: EnemyState.Attack,
                    condition: () =>
                        self.perception.canSeePlayer &&
                        self.position.distanceTo(self.player.position) <=
                            self.config.attackRange,
                    priority: 1,
                },
            ],
        };
    }

    private makeSearchHandlers() {
        const self = this;
        return {
            onEnter: () => {
                self.moveTarget =
                    self.perception.lastKnownPosition?.clone() ?? null;
            },
            onUpdate: (_dt: number) => {
                if (self.moveTarget) {
                    self.moveTowardTarget(self.config.moveSpeed, _dt);
                }
            },
            transitions: [
                {
                    to: EnemyState.Chase,
                    condition: () => self.perception.canSeePlayer,
                    priority: 3,
                },
                {
                    to: EnemyState.Patrol,
                    condition: () =>
                        self.fsm.elapsed > 5 || !self.perception.isAlerted(),
                    priority: 2,
                },
                {
                    to: EnemyState.Alert,
                    condition: () =>
                        self.perception.isAlerted() && self.fsm.elapsed > 1,
                    priority: 1,
                },
            ],
        };
    }

    // ════════════════════════════════════════════════════════════
    //  MOVEMENT HELPERS
    // ════════════════════════════════════════════════════════════

    /** Move directly toward moveTarget at given speed */
    private moveTowardTarget(speed: number, dt: number): void {
        if (!this.moveTarget) return;

        const dx = this.moveTarget.x - this.position.x;
        const dz = this.moveTarget.z - this.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 0.3) {
            this.moveTarget = null;
            return;
        }

        const step = speed * dt;
        const nextX = this.position.x + (dx / dist) * step;
        const nextZ = this.position.z + (dz / dist) * step;

        if (!this.isBlockedPosition(nextX, nextZ)) {
            this.position.x = nextX;
            this.position.z = nextZ;
        }

        // Update facing direction
        this.facingDirection.set(dx, 0, dz).normalize();
        this.setFacingRotation(
            Math.atan2(this.facingDirection.x, this.facingDirection.z),
        );

        this.clampToWorldBounds();
    }

    /** Follow the A* path */
    private followPath(speed: number, dt: number): void {
        if (
            this.currentPath.length === 0 ||
            this.pathIndex >= this.currentPath.length
        ) {
            return;
        }

        const target = this.currentPath[this.pathIndex];
        const worldPos = cellToWorld(target);
        const dx = worldPos.x - this.position.x;
        const dz = worldPos.z - this.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 0.3) {
            this.pathIndex++;
            if (this.pathIndex >= this.currentPath.length) {
                this.currentPath = [];
                return;
            }
        }

        const step = speed * dt;
        const nextX = this.position.x + (dx / dist) * step;
        const nextZ = this.position.z + (dz / dist) * step;

        if (!this.isBlockedPosition(nextX, nextZ)) {
            this.position.x = nextX;
            this.position.z = nextZ;
        }

        this.facingDirection.set(dx, 0, dz).normalize();
        this.setFacingRotation(
            Math.atan2(this.facingDirection.x, this.facingDirection.z),
        );

        this.clampToWorldBounds();
    }

    /** Strafe perpendicular to the player (attack movement) */
    private strafe(dt: number, speedMultiplier: number = 1): void {
        const toPlayer = new Vector3().subVectors(
            this.player.position,
            this.position,
        );
        toPlayer.y = 0;
        toPlayer.normalize();

        // Perpendicular vector (left of player view)
        const strafeDir = new Vector3(-toPlayer.z, 0, toPlayer.x);
        // Oscillate back and forth with wider amplitude (per-enemy phase)
        const offset =
            Math.sin(performance.now() * 0.004 + this.strafePhase) *
            this.flankDirection;
        // Wider lateral movement: 4 units/s base, scaled by archetype
        const step = offset * dt * 4 * speedMultiplier;
        const targetX = this.position.x + strafeDir.x * step;
        const targetZ = this.position.z + strafeDir.z * step;

        if (!this.isBlockedPosition(targetX, targetZ)) {
            this.position.x = targetX;
            this.position.z = targetZ;
        }
        this.clampToWorldBounds();
    }

    /**
     * Dodge burst system: enemies occasionally burst left/right/back
     * to evade player shots. Called during Attack state alongside strafe.
     */
    private updateDodge(dt: number): void {
        this.dodgeCooldownTimer -= dt;

        if (this.isDodging) {
            // Currently in a dodge burst — apply movement
            this.dodgeBurstTimer -= dt;
            const speed = this.config.moveSpeed * 2.5;
            const targetX = this.position.x + this.dodgeDir.x * speed * dt;
            const targetZ = this.position.z + this.dodgeDir.z * speed * dt;
            if (!this.isBlockedPosition(targetX, targetZ)) {
                this.position.x = targetX;
                this.position.z = targetZ;
            }
            this.clampToWorldBounds();

            if (this.dodgeBurstTimer <= 0) {
                this.isDodging = false;
                this.dodgeCooldownTimer = 0.8 + Math.random() * 1.2;
            }
        } else if (this.dodgeCooldownTimer <= 0 && Math.random() < 0.015) {
            // ~0.9 times/sec at 60fps — trigger a dodge
            this.triggerDodge();
        }
    }

    /** Pick a dodge direction and start the burst */
    private triggerDodge(): void {
        const toPlayer = new Vector3().subVectors(
            this.player.position,
            this.position,
        );
        toPlayer.y = 0;
        toPlayer.normalize();
        const strafeDir = new Vector3(-toPlayer.z, 0, toPlayer.x);

        const roll = Math.random();
        if (roll < 0.35) {
            // Dodge left
            this.dodgeDir.copy(strafeDir).multiplyScalar(-this.flankDirection);
        } else if (roll < 0.7) {
            // Dodge right
            this.dodgeDir.copy(strafeDir).multiplyScalar(this.flankDirection);
        } else {
            // Dodge backward
            this.dodgeDir.copy(toPlayer).multiplyScalar(-1);
        }

        this.isDodging = true;
        this.dodgeBurstTimer = 0.15 + Math.random() * 0.2;
    }

    /** Archetype-specific strafe speed multiplier for attack movement */
    private getStrafeMultiplier(): number {
        switch (this.archetype) {
            case EnemyArchetype.Flanker:
                return 2.5;
            case EnemyArchetype.Tank:
                return 0.5;
            case EnemyArchetype.Rusher:
                return 0.2;
            default:
                return 1;
        }
    }

    /** Set the Y rotation on either the model root or box body */
    private setFacingRotation(y: number): void {
        if (this.modelRoot) {
            this.modelRoot.rotation.y = y + this.modelRotationOffset;
        } else if (this.body) {
            this.body.rotation.y = y;
        }
    }

    private facePlayer(): void {
        const dx = this.player.position.x - this.position.x;
        const dz = this.player.position.z - this.position.z;
        if (Math.hypot(dx, dz) > 0) {
            this.facingDirection.set(dx, 0, dz).normalize();
            this.setFacingRotation(
                Math.atan2(this.facingDirection.x, this.facingDirection.z),
            );
        }
    }

    // ════════════════════════════════════════════════════════════
    //  PATHFINDING
    // ════════════════════════════════════════════════════════════

    private recalcPathToPlayer(): void {
        const start = worldToCell(this.position.x, this.position.z);
        const end = worldToCell(this.player.position.x, this.player.position.z);
        this.currentPath = findPath(start, end, this.world);
        this.pathIndex = 0;
        this.pathRecalcTimer = this.pathRecalcInterval;
    }

    recalcPathTo(targetWorldX: number, targetWorldZ: number): void {
        const start = worldToCell(this.position.x, this.position.z);
        const end = worldToCell(targetWorldX, targetWorldZ);
        this.currentPath = findPath(start, end, this.world);
        this.pathIndex = 0;
    }

    // ════════════════════════════════════════════════════════════
    //  PATROL
    // ════════════════════════════════════════════════════════════

    private generatePatrolRoute(origin: Vector3): void {
        this.patrolWaypoints = [];
        const count = 3 + Math.floor(Math.random() * 3); // 3-5 waypoints
        for (let i = 0; i < count; i++) {
            // Random angles so patrol routes aren't circular
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 8; // 5-13 units
            const x = Math.max(
                1,
                Math.min(48, origin.x + Math.cos(angle) * radius),
            );
            const z = Math.max(
                1,
                Math.min(48, origin.z + Math.sin(angle) * radius),
            );
            // Skip waypoints that land inside buildings
            const cellKey = `${Math.floor(x)},${Math.floor(z)}`;
            if (this.world?.buildingCells?.has(cellKey)) continue;
            this.patrolWaypoints.push(new Vector3(x, 0.5, z));
        }
        // Fallback: if all waypoints were blocked, add the origin
        if (this.patrolWaypoints.length === 0) {
            this.patrolWaypoints.push(origin.clone());
        }
        this.patrolIndex = Math.floor(
            Math.random() * this.patrolWaypoints.length,
        );
    }

    private pickNextPatrolPoint(): void {
        if (this.patrolWaypoints.length === 0) {
            this.moveTarget = null;
            return;
        }
        this.moveTarget = this.patrolWaypoints[this.patrolIndex].clone();
        this.patrolIndex = (this.patrolIndex + 1) % this.patrolWaypoints.length;
        // Set a random dwell time at the next waypoint (1-3 seconds)
        this.patrolDwellDuration = 1 + Math.random() * 2;
        this.patrolDwellTimer = 0;
    }

    // ════════════════════════════════════════════════════════════
    //  TACTICAL POSITIONING
    // ════════════════════════════════════════════════════════════

    private calculateFlankPosition(): void {
        const toPlayer = new Vector3().subVectors(
            this.player.position,
            this.position,
        );
        toPlayer.y = 0;
        toPlayer.normalize();

        // Perpendicular to the direction from player to enemy
        const flankDir = new Vector3(-toPlayer.z, 0, toPlayer.x).multiplyScalar(
            this.flankDirection,
        );

        const desiredPos = this.player.position
            .clone()
            .add(flankDir.multiplyScalar(5 + Math.random() * 3))
            .add(toPlayer.multiplyScalar(4));

        desiredPos.x = Math.max(1, Math.min(48, desiredPos.x));
        desiredPos.z = Math.max(1, Math.min(48, desiredPos.z));

        // Use pathfinding to get there
        const start = worldToCell(this.position.x, this.position.z);
        const end = worldToCell(desiredPos.x, desiredPos.z);
        this.currentPath = findPath(start, end, this.world);
        this.pathIndex = 0;

        // If pathfinding fails, just move directly
        if (this.currentPath.length === 0) {
            this.moveTarget = desiredPos;
        } else {
            this.moveTarget = null; // using path instead
        }
    }

    private calculateRetreatPosition(): void {
        // Retreat in the opposite direction from the player
        const away = new Vector3().subVectors(
            this.position,
            this.player.position,
        );
        away.y = 0;
        away.normalize();

        // Try to find cover (a building to hide behind)
        const retreatPos = this.position
            .clone()
            .add(away.multiplyScalar(6 + Math.random() * 4));
        retreatPos.x = Math.max(1, Math.min(48, retreatPos.x));
        retreatPos.z = Math.max(1, Math.min(48, retreatPos.z));

        this.moveTarget = retreatPos;
    }

    // ════════════════════════════════════════════════════════════
    //  DEATH
    // ════════════════════════════════════════════════════════════

    private die(): void {
        this.dead = true;
        this.deathTimer = this.deathDuration;
        // Tilt the model or body over
        if (this.modelRoot) {
            this.modelRoot.rotation.x = Math.PI / 2;
        } else {
            if (this.body) this.body.rotation.x = Math.PI / 2;
            if (this.head) this.head.rotation.x = Math.PI / 2;
        }
    }

    // ════════════════════════════════════════════════════════════
    //  HELPERS
    // ════════════════════════════════════════════════════════════

    private isBlockedPosition(x: number, z: number): boolean {
        if (!this.world?.buildingCells) return false;
        // Check all cells within the enemy's hitbox radius
        const r = Math.ceil(this.hitboxRadius);
        for (let dx = -r; dx <= r; dx++) {
            for (let dz = -r; dz <= r; dz++) {
                if (Math.hypot(dx, dz) > this.hitboxRadius) continue;
                if (
                    this.world.buildingCells.has(
                        `${Math.floor(x + dx)},${Math.floor(z + dz)}`,
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    private clampToWorldBounds(): void {
        this.position.x = Math.max(0.5, Math.min(49.5, this.position.x));
        this.position.z = Math.max(0.5, Math.min(49.5, this.position.z));
    }

    // ════════════════════════════════════════════════════════════
    //  CLEANUP
    // ════════════════════════════════════════════════════════════

    dispose(): void {
        if (this.modelRoot) {
            this.modelRoot.traverse((child) => {
                if ((child as Mesh).isMesh) {
                    const m = child as Mesh;
                    m.geometry?.dispose();
                    if (m.material) {
                        if (Array.isArray(m.material)) {
                            m.material.forEach((mat) => mat.dispose());
                        } else {
                            m.material.dispose();
                        }
                    }
                }
            });
        } else {
            if (this.body) {
                this.body.geometry.dispose();
                (this.body.material as MeshStandardMaterial).dispose();
            }
            if (this.head) {
                this.head.geometry.dispose();
                (this.head.material as MeshStandardMaterial).dispose();
            }
        }
    }
}
