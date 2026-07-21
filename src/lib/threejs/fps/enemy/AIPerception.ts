/**
 * AI Perception system.
 * Each enemy gets a perception instance that tracks:
 * - Line-of-sight to player (raycast against buildings / world meshes)
 * - Awareness level (0-100) that builds up and decays
 * - Last known player position (for searching)
 * - "Hearing" — nearby sounds trigger awareness even without LOS
 */
import { Vector3, Raycaster, Object3D } from 'three';

export interface PerceptionResult {
    canSeePlayer: boolean;
    awareness: number;
    lastKnownPosition: Vector3 | null;
    playerDistance: number;
    playerDirection: Vector3;
}

export class AIPerception {
    /** Current awareness level 0-100 */
    awareness: number = 0;
    /** Where we last saw the player */
    lastKnownPosition: Vector3 | null = null;
    /** Whether the player was visible on the most recent check */
    canSeePlayer: boolean = false;
    /** How far the player was last checked */
    lastPlayerDistance: number = Infinity;

    /** Max awareness range */
    private maxAwareness: number = 100;
    /** How fast awareness builds when player is visible (per second) */
    private sightGain: number = 30;
    /** How fast awareness builds from nearby sounds (per second) */
    private hearingGain: number = 15;
    /** How fast awareness decays when player is not detectable (per second) */
    private decayRate: number = 15;
    /** Below this awareness, enemies forget the player's last position */
    private forgetThreshold: number = 5;

    private raycaster: Raycaster = new Raycaster();
    /** Cached obstacle list — updated when buildings change */
    private obstacles: Object3D[] = [];

    constructor() {}

    /** Set the obstacle geometry for line-of-sight checks (buildings, world) */
    setObstacles(objects: Object3D[]): void {
        this.obstacles = objects;
    }

    /**
     * Call each frame. Updates awareness, LOS, and last known position.
     * @param enemyPosition  World position of the enemy's eyes
     * @param playerPosition World position of the player
     * @param playerSpeed    Current speed of the player (for hearing)
     * @param dt             Delta time in seconds
     */
    update(
        enemyPosition: Vector3,
        playerPosition: Vector3,
        playerSpeed: number = 0,
        dt: number,
    ): PerceptionResult {
        const dir = new Vector3().subVectors(playerPosition, enemyPosition);
        this.lastPlayerDistance = dir.length();
        dir.normalize();

        // --- Line-of-sight check ---
        this.canSeePlayer = this.hasLineOfSight(enemyPosition, playerPosition);

        // --- Update awareness ---
        if (this.canSeePlayer) {
            // Sight: faster gain when player is closer
            const distanceFactor = Math.max(
                0.2,
                1 - this.lastPlayerDistance / 25,
            );
            this.awareness = Math.min(
                this.maxAwareness,
                this.awareness + this.sightGain * distanceFactor * dt,
            );
            this.lastKnownPosition = playerPosition.clone();
        } else if (playerSpeed > 1.5 && this.lastPlayerDistance < 8) {
            // Hearing: player is moving fast enough and nearby
            this.awareness = Math.min(
                this.maxAwareness,
                this.awareness + this.hearingGain * dt,
            );
            if (!this.lastKnownPosition) {
                this.lastKnownPosition = playerPosition.clone();
            }
        } else {
            // Decay
            this.awareness = Math.max(0, this.awareness - this.decayRate * dt);
            if (this.awareness < this.forgetThreshold) {
                this.lastKnownPosition = null;
            }
        }

        return {
            canSeePlayer: this.canSeePlayer,
            awareness: this.awareness,
            lastKnownPosition: this.lastKnownPosition,
            playerDistance: this.lastPlayerDistance,
            playerDirection: dir,
        };
    }

    /** Raycast check: is there a clear line from enemy eyes to player? */
    private hasLineOfSight(
        enemyPosition: Vector3,
        playerPosition: Vector3,
    ): boolean {
        const origin = enemyPosition.clone().add(new Vector3(0, 1, 0)); // eye height
        const direction = new Vector3().subVectors(playerPosition, origin);
        const distance = direction.length();

        // Max detection range check
        if (distance > 25) return false;

        direction.normalize();
        this.raycaster.set(origin, direction);
        this.raycaster.far = distance + 0.5;

        if (this.obstacles.length === 0) return true;

        const hits = this.raycaster.intersectObjects(this.obstacles, true);
        for (const hit of hits) {
            // Ignore hits on the enemy itself or the player
            if (hit.distance < 0.5) continue;
            if (hit.distance < distance) return false; // blocked by obstacle
        }

        return true;
    }

    /** Is the enemy alerted enough to act? */
    isAlerted(): boolean {
        return this.awareness >= 30;
    }

    /** Is the enemy fully aware of the player? */
    isFullyAware(): boolean {
        return this.awareness >= 70;
    }

    /** Reset perception (e.g., on respawn) */
    reset(): void {
        this.awareness = 0;
        this.lastKnownPosition = null;
        this.canSeePlayer = false;
        this.lastPlayerDistance = Infinity;
    }
}
