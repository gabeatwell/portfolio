import type { World } from '../world';
import type { Player } from '../players/Player';
import {
    findPathAStar,
    worldToCell,
    cellToWorld,
} from '../players/pathfinding';
import { Action } from './Action';
import type { PlayerInputHandler } from '../players/PlayerInputHandler';
import { Vector3 } from 'three';

export class MovementAction extends Action {
    handlePointerDown(event: PointerEvent): void {
        const handler = this.inputHandler as PlayerInputHandler & {
            handlePointerDown?: (event: PointerEvent) => void;
        };

        handler.handlePointerDown?.(event);
        void this.perform();
    }

    handleTouchStart(event: TouchEvent): void {
        event.preventDefault();

        const handler = this.inputHandler as PlayerInputHandler & {
            handleTouchStart?: (event: TouchEvent) => void;
        };

        handler.handleTouchStart?.(event);
        void this.perform();
    }

    private inputHandler: PlayerInputHandler;
    private player: Player;
    private world: World;

    constructor(
        player: Player,
        inputHandler: PlayerInputHandler,
        world: World,
    ) {
        super(player);
        this.player = player;
        this.inputHandler = inputHandler;
        this.world = world;
    }

    async perform(): Promise<void> {
        const targetSquare = await this.inputHandler.getTargetSquare();
        if (targetSquare) {
            this.setPathToWorldPoint(targetSquare);
        }
    }

    private setPathToWorldPoint(worldPoint: Vector3): void {
        const start = worldToCell(
            this.player.position.x,
            this.player.position.z,
        );
        const end = worldToCell(worldPoint.x, worldPoint.z);
        const cellPath = findPathAStar(start, end, this.world);

        const worldPath = cellPath.slice(1).map((cell) => {
            const p = cellToWorld(cell);
            return new Vector3(p.x, 0.5, p.z);
        });

        this.player.setPath(worldPath);
    }
}
