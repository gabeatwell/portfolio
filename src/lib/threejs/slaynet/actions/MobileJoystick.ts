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
    private moveSpeed = 5; // units per second
    private moveDirection = new Vector3(0, 0, 0);
    private moveStrength = 0;
    private playerRadius = 0.5;
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
        this.lastFrameTime = performance.now();
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
        this.moveDirection.set(0, 0, 0);
        this.moveStrength = 0;
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

        const magnitude = Math.hypot(this.joystickX, this.joystickY);
        if (magnitude > 0.1) {
            this.moveDirection.set(
                this.joystickX / magnitude,
                0,
                this.joystickY / magnitude,
            );
            this.moveStrength = Math.min(1, magnitude); // optional analog
        } else {
            this.moveDirection.set(0, 0, 0);
            this.moveStrength = 0;
        }
    }

    private isBlockedPosition(x: number, z: number): boolean {
        // check world bounds
        if (x < 0 || x > this.world.width || z < 0 || z > this.world.height) {
            return true;
        }

        const checkRadius = this.playerRadius + 0.2;
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
                const distToCell = Math.hypot(
                    x - (cell.x + 0.5),
                    z - (cell.z + 0.5),
                );
                if (distToCell < this.playerRadius + 0.5) {
                    return true;
                }
            }
        }
        return false;
    }

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

    update(): void {
        if (this.moveDirection.length() === 0) return;

        const now = performance.now();
        const dt = Math.min(0.05, (now - this.lastFrameTime) / 1000);
        this.lastFrameTime = now;

        // use moveStrength for analog, or just: this.moveSpeed * dt
        const step = this.moveSpeed * this.moveStrength * dt;

        const desiredX = this.player.position.x + this.moveDirection.x * step;
        const desiredZ = this.player.position.z + this.moveDirection.z * step;

        const validPos = this.getValidPosition(
            this.player.position.x,
            this.player.position.z,
            desiredX,
            desiredZ,
        );

        this.player.position.x = validPos.x;
        this.player.position.z = validPos.z;
        this.player.position.y = 0.5;

        // clamp (match keyboard style if you prefer)
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

        // facing + model rotation (moved here from updateJoystick)
        const playerWithFacing = this.player as unknown as {
            facingDirection: Vector3;
            model: Object3D | null;
        };
        playerWithFacing.facingDirection.copy(this.moveDirection);
        if (playerWithFacing.model) {
            playerWithFacing.model.rotation.y = Math.atan2(
                this.moveDirection.x,
                this.moveDirection.z,
            );
        }
    }
}
