/**
 * FPS-specific combat system.
 *
 * Responsibilities:
 * - Player shooting (hitscan raycast + visual projectile)
 * - Enemy projectile tracking and collision vs player
 * - Player health & ammo management
 * - Knockback effects (via velocity, no GSAP dependency)
 * - Hit flash feedback
 *
 * Designed to replace the shooter's CombatManager in the FPS game mode.
 */
import { Object3D, Vector3, Scene, Raycaster, Sphere } from 'three';
import { Projectile } from '../../slaynet/combat/Projectile';
import type { FPSEnemyManager } from '../enemy/FPSEnemyManager';
import type { FPSPlayer } from '../player/FPSPlayer';
import { AudioManager } from '../../slaynet/actions/AudioManager';
import { FPSAmmoBrick } from './FPSAmmoBricks';

export class FPSCombatManager extends Object3D {
    // --- Projectiles ---
    private playerProjectiles: Projectile[] = [];
    private enemyProjectiles: Projectile[] = [];

    // --- Ammo Bricks ---
    private ammoBricks: FPSAmmoBrick[] = [];

    // --- Dependencies ---
    private player: FPSPlayer;
    private scene: Scene;
    private enemyManager: FPSEnemyManager | null = null;

    // --- Player stats ---
    private playerHealth: number = 10;
    private maxPlayerHealth: number = 10;
    private playerAmmo: number | null = 50;

    // --- Shooting ---
    private shotCooldown: number = 0.2;
    private lastShotTime: number = 0;
    private enemyProjectileRange: number = 30;

    // --- Audio ---
    private audioManager: AudioManager;
    private audioReady: boolean = false;

    // --- Knockback ---
    private knockbackVelocity: Vector3 = new Vector3();
    private knockbackDuration: number = 0;
    private groundLevel: number = 0;

    // --- Projectile damage map (safe, no cast needed) ---
    private projDamageMap: Map<Projectile, number> = new Map();

    // --- Hit flash ---
    private flashTimer: number = 0;
    private flashDuration: number = 0.1;

    // --- State ---
    private paused: boolean = false;
    private onHealthChanged: (() => void) | null = null;

    constructor(player: FPSPlayer, scene: Scene) {
        super();
        this.player = player;
        this.scene = scene;
        this.audioManager = new AudioManager();
        this.initializeAudio();
    }

    // ─── Setup ────────────────────────────────────────────────

    setEnemyManager(manager: FPSEnemyManager): void {
        this.enemyManager = manager;
    }

    addAmmoBrick(brick: FPSAmmoBrick): void {
        this.ammoBricks.push(brick);
    }

    setOnHealthChanged(cb: () => void): void {
        this.onHealthChanged = cb;
    }

    setPaused(p: boolean): void {
        this.paused = p;
    }

    private async initializeAudio(): Promise<void> {
        try {
            await this.audioManager.initialize();
            await Promise.all([
                this.audioManager.loadSound(
                    'playerShoot',
                    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/sounds/retro-lazer.wav',
                ),
                this.audioManager.loadSound(
                    'playerHit',
                    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/sounds/enemy-shot.mp3',
                ),
            ]);
            this.audioReady = true;
        } catch (error) {
            console.warn('Failed to initialize audio:', error);
        }
    }

    // ─── Player Shooting ──────────────────────────────────────

    canShoot(): boolean {
        const now = performance.now() / 1000;
        if (this.playerAmmo !== null && this.playerAmmo <= 0) return false;
        return now - this.lastShotTime >= this.shotCooldown;
    }

    /**
     * Player fires their weapon.
     * 1. Hitscan check against all enemies.
     * 2. Visual projectile spawned.
     * Returns the projectile for visual sync (or null if can't shoot).
     */
    shoot(direction: Vector3, origin: Vector3): Projectile | null {
        if (!this.canShoot()) return null;

        this.lastShotTime = performance.now() / 1000;

        if (this.playerAmmo !== null) {
            if (this.playerAmmo <= 0) return null;
            this.playerAmmo -= 1;
        }

        // 1. Hitscan raycast against enemies
        if (this.enemyManager) {
            const raycaster = new Raycaster(origin, direction.normalize());
            raycaster.far = 30;
            const enemies = this.enemyManager.getEnemies();
            let closestDist = Infinity;
            let closestEnemy: (typeof enemies)[number] | null = null;

            for (const enemy of enemies) {
                const sphere = new Sphere(
                    enemy.position,
                    enemy.getHitboxRadius(),
                );
                const hit = raycaster.ray.intersectsSphere(sphere);
                if (hit) {
                    const d = enemy.position.distanceTo(origin);
                    if (d < closestDist) {
                        closestDist = d;
                        closestEnemy = enemy;
                    }
                }
            }

            if (closestEnemy) {
                closestEnemy.takeDamage(1);
                this.flashTimer = this.flashDuration;
            }
        }

        // 2. Visual projectile
        const projectile = new Projectile(origin, direction, 15);
        projectile.setAppearance(4, 0xcccccc, 0xcccccc, 1);
        this.playerProjectiles.push(projectile);
        this.scene.add(projectile);

        if (this.audioReady) {
            this.audioManager.playSound('playerShoot', 0.5);
        }

        return projectile;
    }

    // ─── Damage / Health ─────────────────────────────────────

    takeDamage(amount: number, fromDirection?: Vector3): void {
        this.playerHealth = Math.max(0, this.playerHealth - amount);

        if (this.audioReady) {
            this.audioManager.playSound('playerHit', 0.5);
        }

        // Knockback (horizontal only — no y lift so player stays grounded)
        if (fromDirection) {
            this.knockbackVelocity.copy(fromDirection).multiplyScalar(4);
            this.knockbackVelocity.y = 0;
            this.knockbackDuration = 0.35;
        }

        this.onHealthChanged?.();
    }

    heal(amount: number): void {
        this.playerHealth = Math.min(
            this.maxPlayerHealth,
            this.playerHealth + amount,
        );
        this.onHealthChanged?.();
    }

    // ─── Update Loop ──────────────────────────────────────────

    update(dt: number): void {
        if (this.paused) return;

        // Update projectiles
        this.updateProjectileList(this.playerProjectiles, dt);
        this.updateProjectileList(this.enemyProjectiles, dt);

        // Spawn new enemy projectiles
        if (this.enemyManager) {
            const newProjs = this.enemyManager.getEnemyProjectiles();
            for (const p of newProjs) {
                const proj = new Projectile(
                    p.position,
                    p.direction,
                    this.enemyProjectileRange,
                );
                this.projDamageMap.set(proj, p.damage);
                this.enemyProjectiles.push(proj);
                this.scene.add(proj);
            }
        }

        // Collision: enemy projectiles → player
        this.checkEnemyProjectileCollisions();

        // Knockback (horizontal only — y is always clamped to ground)
        if (this.knockbackDuration > 0) {
            this.knockbackDuration -= dt;
            const kb = this.knockbackVelocity.clone().multiplyScalar(dt);
            this.player.position.x += kb.x;
            this.player.position.z += kb.z;
            this.player.position.y = this.groundLevel;
            this.knockbackVelocity.multiplyScalar(0.85);
            // Clamp to world
            this.player.position.x = Math.max(
                0.5,
                Math.min(49.5, this.player.position.x),
            );
            this.player.position.z = Math.max(
                0.5,
                Math.min(49.5, this.player.position.z),
            );
        }

        // Hit flash timer
        if (this.flashTimer > 0) {
            this.flashTimer -= dt;
        }

        // ─── Ammo brick pickup ──────────────────────────────
        for (let i = this.ammoBricks.length - 1; i >= 0; i--) {
            const brick = this.ammoBricks[i];
            brick.update(dt);
            if (brick.tryCollect(this.player.position)) {
                if (this.playerAmmo !== null) {
                    this.playerAmmo += brick.getAmmoAmount();
                }
                this.scene.remove(brick);
                brick.dispose();
                this.ammoBricks.splice(i, 1);
            }
        }
    }

    private updateProjectileList(list: Projectile[], dt: number): void {
        for (let i = list.length - 1; i >= 0; i--) {
            if (!list[i].update(dt)) {
                this.scene.remove(list[i]);
                this.projDamageMap.delete(list[i]);
                list[i].dispose();
                list.splice(i, 1);
            }
        }
    }

    private checkEnemyProjectileCollisions(): void {
        const playerRadius = this.player.getHitboxRadius?.() ?? 0.7;
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const proj = this.enemyProjectiles[i];
            if (this.player.position.distanceTo(proj.position) < playerRadius) {
                const dir = this.player.position
                    .clone()
                    .sub(proj.position)
                    .normalize();
                const dmg = this.projDamageMap.get(proj) ?? 1;
                this.takeDamage(dmg, dir);
                this.projDamageMap.delete(proj);
                this.scene.remove(proj);
                proj.dispose();
                this.enemyProjectiles.splice(i, 1);
            }
        }
    }

    /** Access to hit flash state for the HUD */
    isHitFlashActive(): boolean {
        return this.flashTimer > 0;
    }

    // ─── Getters / Setters ────────────────────────────────────

    getPlayerHealth(): number {
        return this.playerHealth;
    }
    getMaxPlayerHealth(): number {
        return this.maxPlayerHealth;
    }
    setPlayerHealth(h: number): void {
        this.playerHealth = h;
    }
    getPlayerAmmo(): number | null {
        return this.playerAmmo;
    }
    setPlayerAmmo(n: number | null): void {
        this.playerAmmo = n;
    }

    // ─── Cleanup ──────────────────────────────────────────────

    dispose(): void {
        for (const p of this.playerProjectiles) {
            this.scene.remove(p);
            p.dispose();
        }
        for (const p of this.enemyProjectiles) {
            this.scene.remove(p);
            this.projDamageMap.delete(p);
            p.dispose();
        }
        this.playerProjectiles = [];
        this.enemyProjectiles = [];
        this.projDamageMap.clear();
        for (const brick of this.ammoBricks) {
            this.scene.remove(brick);
            brick.dispose();
        }
        this.ammoBricks = [];
        this.audioManager.dispose();
    }
}
