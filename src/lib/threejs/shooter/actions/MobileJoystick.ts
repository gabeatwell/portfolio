import { Vector3, Object3D } from 'three';
import type { HumanPlayer } from '../players/HumanPlayer';
import type { World } from '../world';

export class MobileJoystick {
    private player: HumanPlayer;
    private world: World;
    private joystickElement: HTMLElement | null = null;
    private joystickActive = false;
    private joystickX = 0;
    private joystickY = 0;
    private moveSpeed: number = 5; // units per second
    private lastFrameTime: number = performance.now();
    private abortController = new AbortController();

    private handleTouchStart: (e: TouchEvent) => void;
    private handleTouchMove: (e: TouchEvent) => void;
    private handleTouchEnd: (e: TouchEvent) => void;

    constructor(
        player: HumanPlayer,
        world: World,
        joystickElement: HTMLElement,
    ) {
        this.player = player;
        this.world = world;
        this.joystickElement = joystickElement;

        this.handleTouchStart = (e: TouchEvent) => this.onTouchStart(e);
        this.handleTouchMove = (e: TouchEvent) => this.onTouchMove(e);
        this.handleTouchEnd = (e: TouchEvent) => this.onTouchEnd(e);

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.joystickElement?.addEventListener(
            'touchstart',
            this.handleTouchStart,
            {
                passive: false,
                signal: this.abortController.signal,
            },
        );
        this.joystickElement?.addEventListener(
            'touchmove',
            this.handleTouchMove,
            {
                passive: false,
                signal: this.abortController.signal,
            },
        );
        this.joystickElement?.addEventListener(
            'touchend',
            this.handleTouchEnd,
            {
                passive: false,
                signal: this.abortController.signal,
            },
        );

        // prevent touch events
        document.addEventListener(
            'touchmove',
            (e: TouchEvent) => {
                if (this.joystickActive) {
                    e.preventDefault();
                }
            },
            { passive: false, signal: this.abortController.signal },
        );
    }

    private onTouchStart(e: TouchEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.joystickActive = true;
        this.updateJoystick(e);
    }

    private onTouchMove(e: TouchEvent): void {
        e.preventDefault();
        e.stopPropagation();
        if (!this.joystickActive) return;
        this.updateJoystick(e);
    }

    private onTouchEnd(e: TouchEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.joystickActive = false;
        this.joystickX = 0;
        this.joystickY = 0;
    }

    private updateJoystick(e: TouchEvent): void {
        if (!this.joystickElement || !e.touches.length) return;

        const touch = e.touches[0];
        const rect = this.joystickElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radius = rect.width / 2;

        let x = touch.clientX - centerX;
        let y = touch.clientY - centerY;
        const distance = Math.hypot(x, y);

        if (distance > radius) {
            x = (x / distance) * radius;
            y = (y / distance) * radius;
        }

        this.joystickX = x / radius;
        this.joystickY = y / radius;

        const direction = new Vector3(
            this.joystickX,
            0,
            this.joystickY,
        ).normalize();
        if (direction.length() > 0.1) {
            // update facing direction
            const playerWithFacing = this.player as unknown as {
                facingDirection: Vector3;
                model: Object3D | null;
                position: Vector3;
            };

            playerWithFacing.facingDirection.copy(direction);

            // rotate model to face direction
            if (playerWithFacing.model) {
                playerWithFacing.model.rotation.y = Math.atan2(
                    direction.x,
                    direction.z,
                );
            }

            // move player with slide-style collision detection
            const now = performance.now();
            const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000);
            this.lastFrameTime = now;

            const step = this.moveSpeed * dt;
            const desiredX = playerWithFacing.position.x + direction.x * step;
            const desiredZ = playerWithFacing.position.z + direction.z * step;

            // get valid position with sliding collision
            const validPos = this.getValidPosition(
                playerWithFacing.position.x,
                playerWithFacing.position.z,
                desiredX,
                desiredZ,
            );

            playerWithFacing.position.x = validPos.x;
            playerWithFacing.position.z = validPos.z;
            playerWithFacing.position.y = 0.5;

            // clamp to world bounds
            playerWithFacing.position.x = Math.max(
                0.5,
                Math.min(this.world.width - 0.5, playerWithFacing.position.x),
            );
            playerWithFacing.position.z = Math.max(
                0.5,
                Math.min(this.world.height - 0.5, playerWithFacing.position.z),
            );
        }
    }

    private isBlockedPosition(x: number, z: number): boolean {
        // check world bounds
        if (x < 0 || x > this.world.width || z < 0 || z > this.world.height) {
            return true;
        }
        const cell = { x: Math.floor(x), z: Math.floor(z) };

        const cellsToCheck = [
            // center and orthogonal neighbors
            `${cell.x},${cell.z}`,
            `${cell.x + 1},${cell.z}`,
            `${cell.x - 1},${cell.z}`,
            `${cell.x},${cell.z + 1}`,
            `${cell.x},${cell.z - 1}`,
            // diagonal neighbors
            `${cell.x + 1},${cell.z + 1}`,
            `${cell.x + 1},${cell.z - 1}`,
            `${cell.x - 1},${cell.z + 1}`,
            `${cell.x - 1},${cell.z - 1}`,
        ];

        for (const checkKey of cellsToCheck) {
            if (this.world.buildingCells.has(checkKey)) {
                // Only block if player would be within 0.1 units of obstacle
                const cellParts = checkKey.split(',').map(Number);
                const cellX = cellParts[0];
                const cellZ = cellParts[1];
                const distToCell = Math.hypot(
                    x - (cellX + 0.5),
                    z - (cellZ + 0.5),
                );
                if (distToCell < 0.1) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * slide-style collision detection: allows sliding along surfaces
     * tries full diagonal movement first, then slides along individual axes
     */
    private getValidPosition(
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

    getJoystickX(): number {
        return this.joystickX;
    }

    getJoystickY(): number {
        return this.joystickY;
    }

    dispose(): void {
        this.abortController.abort();
    }
}
