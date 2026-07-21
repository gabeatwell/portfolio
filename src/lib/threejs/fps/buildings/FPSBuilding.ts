import { Group, Mesh, BoxGeometry, MeshStandardMaterial, Color } from 'three';

const COLORS = [
    new Color('#4a4a5a'),
    new Color('#5a4a4a'),
    new Color('#4a5a4a'),
    new Color('#6a5a4a'),
    new Color('#4a4a6a'),
    new Color('#5a5a5a'),
];

export class FPSBuilding {
    static async createBuildings(
        width: number,
        height: number,
        count: number,
        occupiedCells: Set<string>,
    ): Promise<Group> {
        const group = new Group();
        const padding = 3;
        const buildingSpacing = 4;
        const placed = new Set<string>();

        for (let i = 0; i < count; i++) {
            let cellX: number, cellZ: number, cellKey: string;
            let attempts = 0;

            do {
                cellX =
                    Math.floor(Math.random() * (width - padding * 2)) + padding;
                cellZ =
                    Math.floor(Math.random() * (height - padding * 2)) +
                    padding;
                cellKey = `${cellX},${cellZ}`;
                attempts++;
            } while (
                (placed.has(cellKey) ||
                    this.isNearExisting(
                        cellX,
                        cellZ,
                        placed,
                        buildingSpacing,
                    )) &&
                attempts < 100
            );

            if (attempts >= 100) continue;

            const w = 1.5 + Math.random() * 2;
            const h = 2 + Math.random() * 4;
            const d = 1.5 + Math.random() * 2;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            const geo = new BoxGeometry(w, h, d);
            const mat = new MeshStandardMaterial({
                color,
                roughness: 0.8,
                metalness: 0.1,
            });
            const mesh = new Mesh(geo, mat);
            mesh.position.set(cellX, h / 2, cellZ);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);

            placed.add(cellKey);

            // Mark only cells that the building geometry actually covers
            const halfW = w / 2;
            const halfD = d / 2;
            const colStart = Math.floor(cellX - halfW);
            const colEnd = Math.floor(cellX + halfW);
            const rowStart = Math.floor(cellZ - halfD);
            const rowEnd = Math.floor(cellZ + halfD);
            for (let col = colStart; col <= colEnd; col++) {
                for (let row = rowStart; row <= rowEnd; row++) {
                    occupiedCells.add(`${col},${row}`);
                }
            }
        }

        return group;
    }

    private static isNearExisting(
        x: number,
        z: number,
        placed: Set<string>,
        spacing: number,
    ): boolean {
        for (let dx = -spacing; dx <= spacing; dx++) {
            for (let dz = -spacing; dz <= spacing; dz++) {
                if (placed.has(`${x + dx},${z + dz}`)) return true;
            }
        }
        return false;
    }
}
