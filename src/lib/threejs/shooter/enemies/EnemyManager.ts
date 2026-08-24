import { Object3D, Vector3, Scene } from 'three';
import { Enemy } from './Enemy';
import type { Player } from '../players/Player';
import type { World } from '../world';
import type { Projectile } from '../combat/Projectile';
import { AudioManager } from '../actions/AudioManager';

export interface SpawnConfig {
    maxAlive: number;
    cooldownMax: number;
    spawnRadius: { min: number; max: number };
    enemyTypes: {
        type: string;
        weight: number;
        health: number;
        speed: number;
    }[];
}

const DEFAULT_SPAWN_CONFIG: SpawnConfig = {
    maxAlive: 3,
    cooldownMax: 3,
    spawnRadius: { min: 6, max: 10 },
    enemyTypes: [{ type: 'basic', weight: 1, health: 3, speed: 2 }],
};

export class EnemyManager extends Object3D {
    private enemies: Enemy[] = [];
    private player: Player;
    private world: World;
    private scene: Scene;
    private spawnCooldown: number = 0;
    private spawnCooldownMax: number = 3; // seconds between spawns
    private maxEnemies: number = 3;
    private totalEnemiesSpawned: number = 0;
    private onEnemyKilled: (() => void) | null = null;
    private audioManager: AudioManager;
    private audioReady: boolean = false;
    private spawnConfig: SpawnConfig;

    constructor(
        player: Player,
        world: World,
        scene: Scene,
        spawnConfig?: SpawnConfig,
    ) {
        super();
        this.player = player;
        this.world = world;
        this.scene = scene;
        this.audioManager = new AudioManager();
        this.initializeAudio();
        this.spawnConfig = spawnConfig ?? DEFAULT_SPAWN_CONFIG;
        this.maxEnemies = this.spawnConfig.maxAlive;
        this.spawnCooldownMax = this.spawnConfig.cooldownMax;
    }

    private async initializeAudio(): Promise<void> {
        try {
            await this.audioManager.initialize();
            await this.audioManager.loadSound(
                'enemyShoot',
                'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/sounds/enemy-shot.mp3',
            );
            this.audioReady = true;
        } catch (error) {
            console.warn('Failed to initialize audio:', error);
        }
    }

    private getRandomSpawnPosition(): Vector3 {
        const angle = Math.random() * Math.PI * 2;
        const { min, max } = this.spawnConfig.spawnRadius;
        const distance = min + Math.random() * (max - min);
        let x = this.player.position.x + Math.cos(angle) * distance;
        let z = this.player.position.z + Math.sin(angle) * distance;

        x = Math.max(2, Math.min(49, x));
        z = Math.max(2, Math.min(49, z));

        return new Vector3(x, 0.5, z);
    }

    private isValidSpawnPosition(pos: Vector3): boolean {
        if (!this.world?.buildingCells) {
            return true; // Allow spawning if buildingCells not initialized yet
        }

        const cellKey = `${Math.floor(pos.x)},${Math.floor(pos.z)}`;
        return !this.world.buildingCells.has(cellKey);
    }

    private selectEnemyType(): string {
        const types = this.spawnConfig.enemyTypes;
        const totalWeight = types.reduce((sum, t) => sum + t.weight, 0);
        let roll = Math.random() * totalWeight;

        for (const t of types) {
            roll -= t.weight;
            if (roll <= 0) return t.type;
        }
        return types[0].type;
    }

    spawnEnemy(position: Vector3, type?: string): Enemy {
        const typeConfig = type
            ? this.spawnConfig.enemyTypes.find((t) => t.type === type)
            : undefined;
        const enemy = new Enemy(
            position.clone(),
            this.world,
            this.player,
            typeConfig
                ? { health: typeConfig.health, speed: typeConfig.speed }
                : undefined,
        );

        this.enemies.push(enemy);
        this.scene.add(enemy);
        this.totalEnemiesSpawned++;
        return enemy;
    }

    spawnFromLevelConfig(
        spawns: { x: number; z: number; type: string }[],
    ): void {
        for (const sp of spawns) {
            const pos = new Vector3(sp.x, 0.5, sp.z);
            if (this.isValidSpawnPosition(pos)) {
                this.spawnEnemy(pos, sp.type);
            }
        }
    }

    getMaxEnemies(): number {
        return this.maxEnemies;
    }

    update(dt: number): void {
        // update existing enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];

            if (!enemy.isAlive()) {
                // remove dead enemies
                this.scene.remove(enemy);
                enemy.dispose();
                this.enemies.splice(i, 1);

                this.onEnemyKilled?.();
                console.log('Enemy killed, callback triggered');
            } else {
                enemy.update();
            }
        }

        // spawn new enemies
        if (this.enemies.length < this.maxEnemies) {
            this.spawnCooldown -= dt;

            if (this.spawnCooldown <= 0) {
                for (let attempts = 0; attempts < 5; attempts++) {
                    const spawnPos = this.getRandomSpawnPosition();
                    if (this.isValidSpawnPosition(spawnPos)) {
                        const type = this.selectEnemyType();
                        this.spawnEnemy(spawnPos, type);
                        break;
                    }
                }
                this.spawnCooldown = this.spawnCooldownMax;
            }
        }
    }

    checkProjectileCollisions(projectiles: Projectile[]): void {
        for (const enemy of this.enemies) {
            const hitRadius = enemy.getHitboxRadius();

            for (let i = projectiles.length - 1; i >= 0; i--) {
                const projectile = projectiles[i];
                const dist = enemy.position.distanceTo(projectile.position);

                if (dist < hitRadius) {
                    enemy.takeDamage(1);
                    // Properly clean up projectile from scene
                    this.scene.remove(projectile);
                    projectile.dispose();
                    projectiles.splice(i, 1);
                    break; // Only one hit per projectile
                }
            }
        }
    }

    getEnemyProjectiles(): { position: Vector3; direction: Vector3 }[] {
        const projectiles: { position: Vector3; direction: Vector3 }[] = [];

        for (const enemy of this.enemies) {
            if (enemy.canShoot()) {
                enemy.shoot();

                if (this.audioReady) {
                    this.audioManager.playSound('enemyShoot', 0.3);
                }

                const dir = enemy.getFacingDirection(); // returns a clone
                const pos = enemy.position
                    .clone()
                    .add(dir.clone().multiplyScalar(0.5));
                projectiles.push({
                    position: pos,
                    direction: dir,
                });
            }
        }

        return projectiles;
    }

    getEnemies(): Enemy[] {
        return this.enemies;
    }

    setOnEnemyKilled(callback: () => void): void {
        this.onEnemyKilled = callback;
    }

    getKillCount(): number {
        return this.totalEnemiesSpawned - this.enemies.length;
    }

    getTotalEnemiesSpawned(): number {
        return this.totalEnemiesSpawned;
    }

    getEnemyCount(): number {
        return this.enemies.length;
    }

    dispose(): void {
        for (const enemy of this.enemies) {
            this.scene.remove(enemy);
            enemy.dispose();
        }
        this.enemies = [];
        this.audioManager.dispose();
    }
}
