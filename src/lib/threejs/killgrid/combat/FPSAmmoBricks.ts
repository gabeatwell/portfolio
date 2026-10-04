import {
    Object3D,
    Vector3,
    Shape,
    ExtrudeGeometry,
    Mesh,
    MeshStandardMaterial,
    DoubleSide,
} from 'three';

/**
 * A collectible ammo brick that gives the player 10 ammo when picked up.
 * Rendered as a rotating purple triangle that hovers above the ground.
 * Spawns every 3 enemy kills at the location of the 3rd kill.
 */
export class FPSAmmoBrick extends Object3D {
    private mesh: Mesh;
    private _collected: boolean = false;
    private _ammoAmount: number = 10;
    private pickupRadius: number = 1.5;
    private hoverPhase: number = Math.random() * Math.PI * 2;
    private rotationSpeed: number = 2 + Math.random() * 1;
    private floatSpeed: number = 2 + Math.random() * 0.5;
    private baseY: number;

    constructor(position: Vector3) {
        super();
        this.position.copy(position);
        this.baseY = 0.6;
        this.position.y = this.baseY;

        // ─── 3D purple triangular prism ────────────────────
        const shape = new Shape();
        shape.moveTo(0, 0.5);
        shape.lineTo(-0.4, -0.35);
        shape.lineTo(0.4, -0.35);
        shape.closePath();

        const extrudeSettings = {
            depth: 0.3,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.03,
            bevelSegments: 2,
        };

        const geometry = new ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();

        const material = new MeshStandardMaterial({
            color: 0xaa44ff,
            emissive: 0xaa44ff,
            emissiveIntensity: 0.5,
            metalness: 0.2,
            roughness: 0.3,
            side: DoubleSide,
        });

        this.mesh = new Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.add(this.mesh);
    }

    get collected(): boolean {
        return this._collected;
    }

    update(dt: number): void {
        if (this._collected) return;

        this.hoverPhase += dt * this.floatSpeed;
        this.position.y = this.baseY + Math.sin(this.hoverPhase) * 0.25;
        this.rotation.y += dt * this.rotationSpeed;
        this.rotation.x = Math.sin(this.hoverPhase * 0.5) * 0.1;
    }

    /** Check if the player is close enough to pick this brick up. Returns true if collected. */
    tryCollect(playerPosition: Vector3): boolean {
        if (this._collected) return false;

        const dist = this.position.distanceTo(playerPosition);
        if (dist < this.pickupRadius) {
            this._collected = true;
            return true;
        }
        return false;
    }

    getAmmoAmount(): number {
        return this._ammoAmount;
    }

    dispose(): void {
        this.mesh.geometry.dispose();
        if (Array.isArray(this.mesh.material)) {
            this.mesh.material.forEach((m) => m.dispose());
        } else {
            this.mesh.material.dispose();
        }
    }
}
