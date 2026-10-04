import { BufferGeometry, Material, Mesh, Vector3 } from 'three';
import { worldToCell } from '../players/pathfinding';

export class GameObject extends Mesh {
    coords: Vector3;

    constructor(
        coords: Vector3,
        geometry?: BufferGeometry,
        material?: Material,
    ) {
        super(geometry, material);
        this.coords = coords;
    }

    /**
     * get the grid cell this object occupies
     */
    getCell() {
        return worldToCell(this.position.x, this.position.z);
    }

    /**
     * check if this object is at a specific world position
     */
    isAtPosition(x: number, z: number): boolean {
        return (
            Math.abs(this.position.x - x) < 0.1 &&
            Math.abs(this.position.z - z) < 0.1
        );
    }

    /**
     * get distance to another game object
     */
    distanceTo(other: GameObject): number {
        return this.position.distanceTo(other.position);
    }

    /**
     * cleanup resources
     */
    dispose(): void {
        this.geometry?.dispose();
        if (Array.isArray(this.material)) {
            this.material.forEach((m) => m.dispose());
        } else {
            this.material?.dispose();
        }
    }
}
