import { Object3D, Vector3, Scene } from 'three';
import { gsap } from '$lib/data/gsap';
import { Projectile } from './Projectile';
import type { Player } from '../players/Player';
import type { EnemyManager } from '../enemies/EnemyManager';
import { AudioManager } from '../actions/AudioManager';

export class CombatManager extends Object3D {
    private projectiles: Projectile[] = [];
    private enemyProjectiles: Projectile[] = [];
    private player: Player;
    private scene: Scene;
    private enemyManager: EnemyManager | null = null;
    private shotCooldown: number = 0;
    private cooldownDuration: number = 0.2; // seconds between shots
    private lastShotTime: number = 0;
    private playerHealth: number = 10;
    private maxPlayerHealth: number = 10;
    // Player ammo (null = unlimited)
    private playerAmmo: number | null = null;
    /** How far enemy projectiles can travel before expiring */
    private enemyProjectileRange: number = 30;
    private knockbackTimeline: gsap.core.Timeline | null = null;
    private paused: boolean = false;
    private audioManager: AudioManager;
    private audioReady: boolean = false;

    constructor(player: Player, scene: Scene) {
        super();
        this.player = player;
        this.scene = scene;
        this.audioManager = new AudioManager();
        this.initializeAudio();
    }

    setEnemyManager(enemyManager: EnemyManager): void {
        this.enemyManager = enemyManager;
    }

    canShoot(): boolean {
        const now = performance.now() / 1000;
        if (this.playerAmmo !== null && this.playerAmmo <= 0) return false;
        return now - this.lastShotTime >= this.cooldownDuration;
    }

    private async initializeAudio(): Promise<void> {
        try {
            await this.audioManager.initialize();
            await this.audioManager.loadSound(
                'playerShoot',
                'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/sounds/retro-lazer.wav',
            );
            this.audioReady = true;
        } catch (error) {
            console.warn('Failed to initialize audio:', error);
        }
    }

    shoot(shootDirection: Vector3, origin?: Vector3): Projectile | null {
        if (!this.canShoot()) return null;
        // consume ammo when tracked
        if (this.playerAmmo !== null) {
            if (this.playerAmmo <= 0) return null;
            this.playerAmmo -= 1;
        }

        const startPos = origin
            ? origin.clone()
            : this.player.position
                  .clone()
                  .add(shootDirection.clone().normalize().multiplyScalar(0.5));

        // Player projectiles need longer range to reach distant enemies
        const projRange = origin ? 15 : 5;
        const projectile = new Projectile(startPos, shootDirection, projRange);
        this.projectiles.push(projectile);
        this.scene.add(projectile);

        this.lastShotTime = performance.now() / 1000;

        if (this.audioReady) {
            this.audioManager.playSound('playerShoot', 0.5);
        }

        return projectile;
    }

    private checkCollisions(): void {
        // hitting enemies
        if (this.enemyManager) {
            this.enemyManager.checkProjectileCollisions(this.projectiles);
        }

        // hitting player
        const playerRadius = this.player.getHitboxRadius();

        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.enemyProjectiles[i];
            const dist = this.player.position.distanceTo(projectile.position);

            if (dist < playerRadius) {
                // knockback direction
                const knockbackDirection = this.player.position
                    .clone()
                    .sub(projectile.position)
                    .normalize();
                const knockbackDistance = 0.5;
                const targetX =
                    this.player.position.x +
                    knockbackDirection.x * knockbackDistance;
                const targetZ =
                    this.player.position.z +
                    knockbackDirection.z * knockbackDistance;

                // clamp to world bounds
                const clampedX = Math.max(0.5, Math.min(29.5, targetX));
                const clampedZ = Math.max(0.5, Math.min(29.5, targetZ));
                // this.player.position.x = clampedX;
                // this.player.position.z = clampedZ;
                // this.player.position.y = 0.5;

                if (this.knockbackTimeline) {
                    this.knockbackTimeline.kill();
                }

                // initial position for animation
                const startPos = {
                    x: this.player.position.x,
                    z: this.player.position.z,
                };

                this.knockbackTimeline = gsap.timeline();
                this.knockbackTimeline.to(
                    startPos,
                    {
                        x: clampedX,
                        z: clampedZ,
                        duration: 0.3,
                        ease: 'back.out',
                        onUpdate: () => {
                            this.player.position.x = startPos.x;
                            this.player.position.z = startPos.z;
                            this.player.position.y = 0.5;
                        },
                    },
                    0,
                );

                this.takeDamage(1);
                this.scene.remove(projectile);
                projectile.dispose();
                this.enemyProjectiles.splice(i, 1);
            }
        }
    }

    update(dt: number): void {
        if (this.paused) return;

        // update player projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            const isAlive = projectile.update(dt);

            if (!isAlive) {
                // Remove dead projectile
                this.scene.remove(projectile);
                projectile.dispose();
                this.projectiles.splice(i, 1);
            }
        }

        // update enemy projectiles
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.enemyProjectiles[i];
            const isAlive = projectile.update(dt);

            if (!isAlive) {
                // remove dead projectile
                this.scene.remove(projectile);
                projectile.dispose();
                this.enemyProjectiles.splice(i, 1);
            }
        }

        // get new enemy projectiles
        if (this.enemyManager) {
            const newEnemyProjectiles = this.enemyManager.getEnemyProjectiles();
            for (const proj of newEnemyProjectiles) {
                const projectile = new Projectile(
                    proj.position,
                    proj.direction,
                    this.enemyProjectileRange,
                );
                this.enemyProjectiles.push(projectile);
                this.scene.add(projectile);
            }
        }

        this.checkCollisions();
    }

    setPaused(paused: boolean): void {
        this.paused = paused;
    }

    getPlayerHealth(): number {
        return this.playerHealth;
    }

    getMaxPlayerHealth(): number {
        return this.maxPlayerHealth;
    }

    // ammo accessors
    setPlayerAmmo(amount: number | null): void {
        this.playerAmmo = amount;
    }

    getPlayerAmmo(): number | null {
        return this.playerAmmo;
    }

    takeDamage(amount: number = 1): void {
        this.playerHealth -= amount;
    }

    isPlayerAlive(): boolean {
        return this.playerHealth > 0;
    }

    getProjectiles(): Projectile[] {
        return this.projectiles;
    }

    dispose(): void {
        if (this.knockbackTimeline) {
            this.knockbackTimeline.kill();
        }

        for (const projectile of this.projectiles) {
            this.scene.remove(projectile);
            projectile.dispose();
        }

        for (const projectile of this.enemyProjectiles) {
            this.scene.remove(projectile);
            projectile.dispose();
        }

        this.projectiles = [];
        this.enemyProjectiles = [];
        this.audioManager.dispose();
    }
}
