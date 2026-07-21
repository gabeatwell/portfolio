import {
    Group,
    Mesh,
    MeshStandardMaterial,
    Color,
    Object3D,
    Box3,
    Vector3,
} from 'three';

const COLORS = [
    new Color('#4a4a5a'),
    new Color('#5a4a4a'),
    new Color('#4a5a4a'),
    new Color('#6a5a4a'),
    new Color('#4a4a6a'),
    new Color('#5a5a5a'),
];

export class FPSBuilding {
    /**
     * Create buildings from pre-loaded GLTF model scenes.
     * Each building is a randomly-picked model clone, placed at a valid cell.
     *
     * @param width          World width in cells
     * @param height         World height in cells
     * @param count          Number of buildings to place
     * @param occupiedCells  Set updated with cells each building occupies
     * @param models         Pre-loaded GLTF scenes for buildings
     */
    static createBuildings(
        width: number,
        height: number,
        count: number,
        occupiedCells: Set<string>,
        models: Object3D[],
    ): Group {
        const group = new Group();
        const padding = 3;
        const buildingSpacing = 4;
        const placed = new Set<string>();

        // Pre-compute bounding-box size for each building model
        const modelSizes = models.map((m) => {
            const bbox = new Box3().setFromObject(m);
            const size = bbox.getSize(new Vector3());
            return { w: size.x || 2, d: size.z || 2 };
        });

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

            // Randomly pick a building model and clone it
            const modelIdx = Math.floor(Math.random() * models.length);
            const model = models[modelIdx].clone(true);
            const srcSize = modelSizes[modelIdx];

            // Per-model target footprint: convenience store ~5-7, apartment block ~8-11
            const targetFootprint =
                modelIdx === 0 ? 5 + Math.random() * 2 : 8 + Math.random() * 3;
            const scale = targetFootprint / Math.max(srcSize.w, srcSize.d, 0.1);
            model.scale.setScalar(scale);

            // Stretch convenience stores vertically so they're taller
            if (modelIdx === 0) {
                model.scale.y *= 1.6;
            }

            model.position.set(cellX, 0, cellZ);
            model.rotation.y = Math.random() * Math.PI * 2;

            // Apply a subtle warmth/hue push via emissive instead of crushing colors
            const tint = COLORS[Math.floor(Math.random() * COLORS.length)];
            model.traverse((child) => {
                if ((child as Mesh).isMesh) {
                    const mesh = child as Mesh;
                    const mat = mesh.material as MeshStandardMaterial;
                    if (mat) {
                        // Mix the original color with the tint instead of multiplying
                        mat.color.lerp(tint, 0.35);
                        mat.roughness = 0.6;
                        mat.metalness = 0.15;
                    }
                }
            });

            group.add(model);
            placed.add(cellKey);

            // Mark occupied cells based on scaled footprint
            const scaledW = srcSize.w * scale;
            const scaledD = srcSize.d * scale;
            const halfW = scaledW / 2;
            const halfD = scaledD / 2;
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
