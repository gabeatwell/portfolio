import { Group, Mesh, BoxGeometry, MeshStandardMaterial, Vector3 } from 'three';
import type { Player } from '../players/Player';

export class Health extends Group {
    private rotationSpeed: number = 2;
    private bobOffset: number = 0;
    private bobSpeed: number = 2;
    private bobAmount: number = 0.15;
    private baseY: number = 0.5;
    private healAmount: number = 0.15; // 15% of max health

    constructor(position: Vector3) {
        super();

        const redColor = 0xff3333;
        const emissiveColor = 0xaa0000;

        const healthMat = new MeshStandardMaterial({
            color: redColor,
            emissive: emissiveColor,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.2,
        });

        // Vertical bar of the plus
        const vertical = new Mesh(new BoxGeometry(0.2, 0.6, 0.2), healthMat);

        // Horizontal bar of the plus
        const horizontal = new Mesh(new BoxGeometry(0.6, 0.2, 0.2), healthMat);

        this.add(vertical);
        this.add(horizontal);

        this.position.copy(position);
        this.position.y = this.baseY;
        this.bobOffset = Math.random() * Math.PI * 2; // random start phase
    }

    update(dt: number): void {
        // spin
        this.rotation.y += this.rotationSpeed * dt;

        // bob up and down
        this.bobOffset += this.bobSpeed * dt;
        this.position.y =
            this.baseY + Math.sin(this.bobOffset) * this.bobAmount;
    }

    canCollect(player: Player, collectRadius: number = 1.0): boolean {
        return this.position.distanceTo(player.position) < collectRadius;
    }

    getHealAmount(maxHealth: number): number {
        return Math.floor(maxHealth * this.healAmount);
    }

    dispose(): void {
        this.children.forEach((child) => {
            if (child instanceof Mesh) {
                child.geometry.dispose();
                if (child.material instanceof MeshStandardMaterial) {
                    child.material.dispose();
                }
            }
        });
        this.clear();
    }
}
