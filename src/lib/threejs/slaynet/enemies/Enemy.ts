import { Object3D, Vector3, Raycaster } from 'three';
import { GameObject } from '../objects/GameObject';
import type { World } from '../world';
import type { Player } from '../players/Player';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface EnemyConfig {
    health: number;
    speed: number;
}

const loader = new GLTFLoader();
loader.setResourcePath(
    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/glb/',
);

export class Enemy extends GameObject {
    protected world: World;
    protected player: Player;
    protected health: number = 5;
    protected maxHealth: number = 5;
    protected moveSpeed: number = 2;
    protected detectionRange: number = 15;
    protected shootCooldown: number = 0;
    protected shootCooldownMax: number = 2; // seconds between shots
    protected lastTick: number = performance.now();
    protected facingDirection: Vector3 = new Vector3(0, 0, 1);
    protected targetDirection: Vector3 = new Vector3();
    protected model: Object3D | null = null;
    protected hitboxRadius: number = 0.9;
    private raycaster = new Raycaster();
    // small offset to avoid z-fighting; reduce so enemies sit near surface
    private heightOffset = 0.05;
    // ammo for enemy (null = unlimited)
    private ammo: number | null = 10;

    constructor(
        position: Vector3,
        world: World,
        player: Player,
        config?: EnemyConfig,
    ) {
        super(new Vector3(5.5, 0.5, 5.5));

        this.world = world;
        this.player = player;
        this.position.copy(position);

        this.maxHealth = config?.health ?? 3;
        this.health = this.maxHealth;
        this.moveSpeed = config?.speed ?? 2;

        // align initial Y to terrain
        const origin = new Vector3(this.position.x, 100, this.position.z);
        const dir = new Vector3(0, -1, 0);
        this.raycaster.set(origin, dir);
        const intersects = this.raycaster.intersectObject(this.world, true);
        if (intersects.length > 0)
            this.position.y = intersects[0].point.y + this.heightOffset;

        loader.load(
            '/threejayess/models/computerman.glb',
            (gltf: GLTF) => {
                const model = gltf.scene;
                this.model = model;
                model.scale.multiplyScalar(0.2);

                this.add(model);
            },
            undefined,
            (error) => {
                console.error('Error loading enemy model:', error);
            },
        );
    }

    takeDamage(amount: number = 1): void {
        this.health -= amount;
    }

    isAlive(): boolean {
        return this.health > 0;
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

    private isBlockedPosition(x: number, z: number): boolean {
        if (!this.world?.buildingCells) {
            return false;
        }

        const cellKey = `${Math.floor(x)},${Math.floor(z)}`;
        return this.world.buildingCells.has(cellKey);
    }

    private clampToWorldBounds(): void {
        this.position.x = Math.max(
            0.5,
            Math.min(this.world.width - 0.5, this.position.x),
        );
        this.position.z = Math.max(
            0.5,
            Math.min(this.world.height - 0.5, this.position.z),
        );
    }

    update(): void {
        const now = performance.now();
        const dt = Math.min(0.05, (now - this.lastTick) / 1000);
        this.lastTick = now;

        // calculate direction to player
        const dx = this.player.position.x - this.position.x;
        const dz = this.player.position.z - this.position.z;
        const dist = Math.hypot(dx, dz);

        // update facing direction
        if (dist > 0) {
            this.facingDirection.set(dx, 0, dz).normalize();
            this.targetDirection.copy(this.facingDirection);
        }

        // move towards player if in range and not too close
        if (dist > 1.5 && dist < this.detectionRange) {
            const step = this.moveSpeed * dt;
            const nextX = this.position.x + (dx / dist) * step;
            const nextZ = this.position.z + (dz / dist) * step;

            if (!this.isBlockedPosition(nextX, nextZ)) {
                this.position.x = nextX;
                this.position.z = nextZ;
                // sample terrain height at new position
                const origin2 = new Vector3(
                    this.position.x,
                    100,
                    this.position.z,
                );
                const dir2 = new Vector3(0, -1, 0);
                this.raycaster.set(origin2, dir2);
                const ints = this.raycaster.intersectObject(this.world, true);
                this.position.y =
                    ints.length > 0 ? ints[0].point.y + this.heightOffset : 0.5;
            }
        }

        // clamp to world bounds
        this.clampToWorldBounds();

        // update shoot cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown -= dt;
        }

        if (this.model) {
            this.model.rotation.y = Math.atan2(
                this.facingDirection.x,
                this.facingDirection.z,
            );
        }
    }

    canShoot(): boolean {
        const dist = this.position.distanceTo(this.player.position);
        if (this.ammo !== null && this.ammo <= 0) return false;
        return (
            this.shootCooldown <= 0 &&
            dist < this.detectionRange &&
            this.isAlive()
        );
    }

    shoot(): void {
        if (this.canShoot()) {
            this.shootCooldown = this.shootCooldownMax;
            if (this.ammo !== null) this.ammo -= 1;
        }
    }

    getAmmo(): number | null {
        return this.ammo;
    }

    setAmmo(n: number | null): void {
        this.ammo = n;
    }

    override dispose(): void {
        super.dispose();
    }
}
