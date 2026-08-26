import { Vector3, Object3D } from 'three';
import type { Player } from '../players/Player';
import type { World } from '../world';

export class KeyboardMovement {
    private player: Player;
    private world: World;
    private dom: HTMLElement;
    private moveSpeed: number = 5; // units per second
    private keysPressed: Set<string> = new Set();
    private moveDirection: Vector3 = new Vector3(0, 0, 0);
    private lastTick: number = performance.now();
    private playerRadius: number = 0.5;

    private handleKeyDown: (event: KeyboardEvent) => void;
    private handleKeyUp: (event: KeyboardEvent) => void;

    constructor(player: Player, world: World, dom: HTMLElement) {
        this.player = player;
        this.world = world;
        this.dom = dom;

        this.handleKeyDown = (event: KeyboardEvent) => this.onKeyDown(event);
        this.handleKeyUp = (event: KeyboardEvent) => this.onKeyUp(event);

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    private onKeyDown(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) {
            event.preventDefault();
            this.keysPressed.add(key);
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) {
            this.keysPressed.delete(key);
        }
    }

    private updateMoveDirection(): void {
        this.moveDirection.set(0, 0, 0);

        // up (towards negative Z on screen)
        if (this.keysPressed.has('w')) {
            this.moveDirection.z -= 1;
        }
        // down (towards positive Z on screen)
        if (this.keysPressed.has('s')) {
            this.moveDirection.z += 1;
        }
        // right (towards positive X)
        if (this.keysPressed.has('d')) {
            this.moveDirection.x += 1;
        }
        // left (towards negative X)
        if (this.keysPressed.has('a')) {
            this.moveDirection.x -= 1;
        }

        // normalize for diagonal movement
        if (this.moveDirection.length() > 0) {
            this.moveDirection.normalize();
        }
    }

    private isBlockedPosition(x: number, z: number): boolean {
        if (!this.world?.buildingCells) {
            return false;
        }

        const checkRadius = this.playerRadius + 0.2; // add buffer zone
        const cellsToCheck = [
            { x: Math.floor(x), z: Math.floor(z) },
            { x: Math.floor(x + checkRadius), z: Math.floor(z) },
            { x: Math.floor(x - checkRadius), z: Math.floor(z) },
            { x: Math.floor(x), z: Math.floor(z + checkRadius) },
            { x: Math.floor(x), z: Math.floor(z - checkRadius) },
            { x: Math.floor(x + checkRadius), z: Math.floor(z + checkRadius) },
            { x: Math.floor(x + checkRadius), z: Math.floor(z - checkRadius) },
            { x: Math.floor(x - checkRadius), z: Math.floor(z + checkRadius) },
            { x: Math.floor(x - checkRadius), z: Math.floor(z - checkRadius) },
        ];

        for (const cell of cellsToCheck) {
            const cellKey = `${cell.x},${cell.z}`;
            if (this.world.buildingCells.has(cellKey)) {
                // Calculate distance from player to cell center
                const cellCenterX = cell.x + 0.5;
                const cellCenterZ = cell.z + 0.5;
                const distToCell = Math.hypot(x - cellCenterX, z - cellCenterZ);

                // Block if closer than collision threshold
                if (distToCell < this.playerRadius + 0.5) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Slide-style collision detection: allows sliding along surfaces
     * Tries full diagonal movement first, then slides along individual axes
     */
    private getValidPosition(
        currentX: number,
        currentZ: number,
        desiredX: number,
        desiredZ: number,
    ): { x: number; z: number } {
        //  full diagonal movement
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

    update(): void {
        const now = performance.now();
        const dt = Math.min(0.05, (now - this.lastTick) / 1000);
        this.lastTick = now;

        this.updateMoveDirection();

        // move if there's a direction and keys are pressed
        if (this.moveDirection.length() > 0) {
            const step = this.moveSpeed * dt;
            const desiredX =
                this.player.position.x + this.moveDirection.x * step;
            const desiredZ =
                this.player.position.z + this.moveDirection.z * step;

            // slide-style collision detection
            const validPos = this.getValidPosition(
                this.player.position.x,
                this.player.position.z,
                desiredX,
                desiredZ,
            );

            this.player.position.x = validPos.x;
            this.player.position.z = validPos.z;
            this.player.position.y = 0.5;

            // clamp to world bounds
            this.player.position.x = Math.max(
                this.playerRadius,
                Math.min(
                    this.world.width - this.playerRadius,
                    this.player.position.x,
                ),
            );
            this.player.position.z = Math.max(
                this.playerRadius,
                Math.min(
                    this.world.height - this.playerRadius,
                    this.player.position.z,
                ),
            );

            // update facing direction
            const playerWithFacing = this.player as unknown as {
                facingDirection: Vector3;
                model: Object3D | null;
            };
            playerWithFacing.facingDirection.copy(this.moveDirection);

            // rotate model to face direction
            if (playerWithFacing.model) {
                playerWithFacing.model.rotation.y = Math.atan2(
                    this.moveDirection.x,
                    this.moveDirection.z,
                );
            }
        }
    }

    dispose(): void {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.keysPressed.clear();
    }
}
