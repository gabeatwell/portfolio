import { Object3D, Vector3 } from 'three';

export class FPSPlayer extends Object3D {
    /** The direction the camera is looking — synced each frame by FPSGame */
    readonly facingDirection: Vector3 = new Vector3(0, 0, -1);

    getHitboxRadius(): number {
        return 0.7;
    }

    getFacingDirection(): Vector3 {
        return this.facingDirection.clone();
    }

    update(): void {
        // All movement is handled by FPSGame.animate()
    }
}
