import { Vector3, Object3D, Raycaster } from 'three';
import type { World } from '../world';
import { GameObject } from '../objects/GameObject';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export class Player extends GameObject {
    protected path: Vector3[] = [];
    protected moveSpeed = 3;
    protected lastTick = performance.now();
    protected world: World;
    protected facingDirection: Vector3 = new Vector3(0, 0, 1);
    protected model: Object3D | null = null;
    protected hitboxRadius: number = 0.7;
    private raycaster = new Raycaster();
    private heightOffset: number;

    private findSafeSpawnPosition(): Vector3 {
        const preferred = [
            new Vector3(5.5, 0.5, 5.5),
            new Vector3(2.5, 0.5, 2.5),
            new Vector3(10.5, 0.5, 10.5),
            new Vector3(2.5, 0.5, 10.5),
            new Vector3(10.5, 0.5, 2.5),
        ];

        for (const pos of preferred) {
            if (!this.isSpawnBlocked(pos.x, pos.z)) {
                return pos;
            }
        }

        for (let x = 1.5; x < this.world.width - 1; x += 1) {
            for (let z = 1.5; z < this.world.height - 1; z += 1) {
                if (!this.isSpawnBlocked(x, z)) {
                    return new Vector3(x, 0.5, z);
                }
            }
        }

        return new Vector3(5.5, 0.5, 5.5);
    }

    private isSpawnBlocked(x: number, z: number): boolean {
        const checkRadius = 1.5;
        const step = 0.5;
        for (let dx = -checkRadius; dx <= checkRadius; dx += step) {
            for (let dz = -checkRadius; dz <= checkRadius; dz += step) {
                const cx = Math.floor(x + dx);
                const cz = Math.floor(z + dz);
                if (this.world.buildingCells.has(`${cx},${cz}`)) return true;
            }
        }
        return false;
    }

    constructor(world: World) {
        super(new Vector3(5.5, 0.5, 5.5));

        this.world = world;

        const safeSpawn = this.findSafeSpawnPosition();
        this.position.copy(safeSpawn);

        const cols = Math.max(1, Math.floor(this.world.width));
        const segment = this.world.width / cols;
        this.heightOffset = 0.25 * segment;

        const h = this.getTerrainHeightAt(this.position.x, this.position.z);
        if (h !== null) this.position.y = h + this.heightOffset;

        loader.load('/threejayess/models/gunner.glb', (gltf: GLTF) => {
            const model = gltf.scene;
            this.model = model;
            // align model so its base sits at the object's origin (terrain level)
            model.position.set(0, 0.2, 0);
            model.scale.multiplyScalar(0.8);

            this.add(model);
        });
    }

    protected isBlockedPosition(x: number, z: number): boolean {
        const cx = Math.floor(x);
        const cz = Math.floor(z);
        return this.world.buildingCells.has(`${cx},${cz}`);
    }

    /**
     * Slide-style collision detection: allows sliding along surfaces
     * Tries full diagonal movement first, then slides along individual axes
     */
    protected getValidPosition(
        currentX: number,
        currentZ: number,
        desiredX: number,
        desiredZ: number,
    ): { x: number; z: number } {
        // full diagonal movement
        if (!this.isBlockedPosition(desiredX, desiredZ)) {
            return { x: desiredX, z: desiredZ };
        }

        // sliding along X axis only
        if (!this.isBlockedPosition(desiredX, currentZ)) {
            return { x: desiredX, z: currentZ };
        }

        // sliding along Z axis only
        if (!this.isBlockedPosition(currentX, desiredZ)) {
            return { x: currentX, z: desiredZ };
        }

        // cannot move - stay in place
        return { x: currentX, z: currentZ };
    }

    protected clampToWorldBounds(): void {
        this.position.x = Math.max(
            0.5,
            Math.min(this.world.width - 0.5, this.position.x),
        );
        this.position.z = Math.max(
            0.5,
            Math.min(this.world.height - 0.5, this.position.z),
        );
    }

    protected movePath(target: Vector3, dt: number): boolean {
        const dx = target.x - this.position.x;
        const dz = target.z - this.position.z;
        const dist = Math.hypot(dx, dz);
        const step = this.moveSpeed * dt;

        if (dist <= step) {
            if (!this.isBlockedPosition(target.x, target.z)) {
                const h = this.getTerrainHeightAt(target.x, target.z);
                const y = h !== null ? h + this.heightOffset : 0.5;
                this.position.set(target.x, y, target.z);
            }
            this.clampToWorldBounds();
            this.path.shift();
            return true;
        } else {
            const nextX = this.position.x + (dx / dist) * step;
            const nextZ = this.position.z + (dz / dist) * step;

            // slide-style collision detection
            const validPos = this.getValidPosition(
                this.position.x,
                this.position.z,
                nextX,
                nextZ,
            );

            // update facing direction based on movement
            this.facingDirection.set(dx, 0, dz).normalize();

            this.position.x = validPos.x;
            this.position.z = validPos.z;
            const h = this.getTerrainHeightAt(this.position.x, this.position.z);
            this.position.y = h !== null ? h + this.heightOffset : 0.5;
            this.clampToWorldBounds();
            return false;
        }
    }

    private getTerrainHeightAt(x: number, z: number): number | null {
        // raycast down from above in world coordinates
        const origin = new Vector3(x, 100, z);
        const dir = new Vector3(0, -1, 0);
        this.raycaster.set(origin, dir);
        const intersects = this.raycaster.intersectObject(this.world, true);
        if (intersects.length > 0) return intersects[0].point.y;
        return null;
    }

    update(): void {
        if (this.path.length === 0) return;

        const now = performance.now();
        const dt = Math.min(0.05, (now - this.lastTick) / 1000);
        this.lastTick = now;

        const target = this.path[0];
        this.movePath(target, dt);

        if (this.model) {
            this.model.rotation.y = Math.atan2(
                this.facingDirection.x,
                this.facingDirection.z,
            );
        }
    }

    private updateFacingDirection(target: Vector3): void {
        const dx = target.x - this.position.x;
        const dz = target.z - this.position.z;
        const dist = Math.hypot(dx, dz);

        if (dist > 0) {
            this.facingDirection.set(dx, 0, dz).normalize();

            // rotate model immediately
            if (this.model) {
                this.model.rotation.y = Math.atan2(
                    this.facingDirection.x,
                    this.facingDirection.z,
                );
            }
        }
    }

    setPath(newPath: Vector3[]): void {
        this.path = newPath;
        this.lastTick = performance.now();

        if (newPath.length > 0) {
            this.updateFacingDirection(newPath[0]);
        }
    }

    moveInDirection(direction: Vector3): void {
        // call this from keyboard input handlers
        this.updateFacingDirection(this.position.clone().add(direction));
    }

    getFacingDirection(): Vector3 {
        return this.facingDirection.clone();
    }

    getHitboxRadius(): number {
        return this.hitboxRadius;
    }

    override dispose(): void {
        super.dispose();
    }
}
