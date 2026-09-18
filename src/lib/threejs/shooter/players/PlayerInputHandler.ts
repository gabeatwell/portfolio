import {
    Vector3,
    Raycaster,
    Vector2,
    PerspectiveCamera,
    Object3D,
} from 'three';
import type { GameObject } from '../objects/GameObject';
import type { Action } from '../actions/Action';
import type { World } from '../world';
// import { worldToCell, findPathAStar } from './pathfinding';

export class PlayerInputHandler {
    private targetSquareResolver: ((value: Vector3 | null) => void) | null =
        null;
    private targetObjectResolver: ((value: GameObject | null) => void) | null =
        null;
    private actionResolver: ((value: Action) => void) | null = null;

    private raycaster = new Raycaster();
    private pointer = new Vector2();
    private camera: PerspectiveCamera;
    private terrain: Object3D;
    private dom: HTMLElement;
    private world: World;

    constructor(
        camera: PerspectiveCamera,
        terrain: Object3D,
        world: World,
        dom: HTMLElement,
    ) {
        this.camera = camera;
        this.terrain = terrain;
        this.world = world;
        this.dom = dom;
    }

    async getTargetSquare(): Promise<Vector3 | null> {
        return new Promise((resolve) => {
            const handlePointerDown = (event: PointerEvent) => {
                this.performRaycast(event.clientX, event.clientY, resolve);
                this.dom.removeEventListener('pointerdown', handlePointerDown);
            };

            const handleTouchStart = (event: TouchEvent) => {
                if (event.touches.length > 0) {
                    const touch = event.touches[0];
                    this.performRaycast(touch.clientX, touch.clientY, resolve);
                    this.dom.removeEventListener(
                        'touchstart',
                        handleTouchStart,
                    );
                }
            };

            this.dom.addEventListener('pointerdown', handlePointerDown);
            this.dom.addEventListener('touchstart', handleTouchStart, {
                passive: false,
            });

            this.targetSquareResolver = resolve;
        });
    }

    private performRaycast(
        clientX: number,
        clientY: number,
        resolve: (value: Vector3 | null) => void,
    ): void {
        const rect = this.dom.getBoundingClientRect();
        this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObject(this.terrain, true);
        if (intersects.length === 0) {
            resolve(null);
            return;
        }

        resolve(intersects[0].point);
    }

    async getTargetObject(): Promise<GameObject | null> {
        return new Promise((resolve) => {
            this.targetObjectResolver = resolve;
        });
    }

    async requestAction(): Promise<Action> {
        return new Promise((resolve) => {
            this.actionResolver = resolve;
        });
    }

    selectTargetObject(obj: GameObject | null): void {
        this.targetObjectResolver?.(obj);
        this.targetObjectResolver = null;
    }

    performAction(action: Action): void {
        this.actionResolver?.(action);
        this.actionResolver = null;
    }
}
