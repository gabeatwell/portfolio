import {
    Group,
    Mesh,
    MeshStandardMaterial,
    Color,
    Object3D,
    Box3,
    Vector3,
} from 'three';
import { createRng, range, pick } from '../procedural/seededRng';

export interface BuildingLayoutOptions {
    width: number;
    height: number;
    count: number;
    seed: number;
    occupiedCells: Set<string>;
    models: Object3D[];
    excludeCells?: Set<string>;
    /** 0 = sparse open, 1 = dense city blocks */
    density?: number;
}

const COLORS = [
    new Color('#4a4a5a'),
    new Color('#5a4a4a'),
    new Color('#4a5a4a'),
    new Color('#6a5a4a'),
    new Color('#4a4a6a'),
    new Color('#5a5a5a'),
];

export class FPSBuilding {
    static createBuildings(opts: BuildingLayoutOptions): Group {
        const {
            width,
            height,
            count,
            seed,
            occupiedCells,
            models,
            excludeCells,
            density = 0.55,
        } = opts;

        const rng = createRng(seed);
        const group = new Group();
        const padding = 3;
        const buildingSpacing = density > 0.7 ? 3 : 5;
        const placed = new Set<string>();

        // pre-compute model sizes
        const modelSizes = models.map((m) => {
            const bbox = new Box3().setFromObject(m);
            const size = bbox.getSize(new Vector3());
            return { w: size.x || 2, d: size.z || 2 };
        });

        // layout strategy
        const numClusters = Math.max(
            2,
            Math.floor(count / 3) + Math.floor(rng() * 2),
        );
        const clusterCenters: { x: number; z: number }[] = [];

        for (let c = 0; c < numClusters; c++) {
            clusterCenters.push({
                x: range(rng, padding + 5, width - padding - 5),
                z: range(rng, padding + 5, height - padding - 5),
            });
        }

        let placedCount = 0;
        let attempts = 0;
        const maxAttempts = count * 40;

        while (placedCount < count && attempts < maxAttempts) {
            attempts++;

            // prefer placing near a cluster center most of the time
            let cellX: number, cellZ: number;
            if (rng() < 0.75 && clusterCenters.length) {
                const center = pick(rng, clusterCenters);
                const spread = range(rng, 3, 9);
                cellX = Math.floor(center.x + range(rng, -spread, spread));
                cellZ = Math.floor(center.z + range(rng, -spread, spread));
            } else {
                // occasional free-floating building
                cellX = Math.floor(range(rng, padding, width - padding));
                cellZ = Math.floor(range(rng, padding, height - padding));
            }

            // clamp
            cellX = Math.max(padding, Math.min(width - padding - 1, cellX));
            cellZ = Math.max(padding, Math.min(height - padding - 1, cellZ));

            const cellKey = `${cellX},${cellZ}`;
            if (placed.has(cellKey)) continue;
            if (this.isNearExisting(cellX, cellZ, placed, buildingSpacing))
                continue;

            const modelIdx = Math.floor(rng() * models.length);
            const srcSize = modelSizes[modelIdx];

            // size variation by model type
            const targetFootprint =
                modelIdx === 0 ? range(rng, 4.5, 7) : range(rng, 7, 11);
            const scale = targetFootprint / Math.max(srcSize.w, srcSize.d, 0.1);

            const scaledW = srcSize.w * scale;
            const scaledD = srcSize.d * scale;
            const colStart = Math.floor(cellX - scaledW / 2);
            const colEnd = Math.floor(cellX + scaledW / 2);
            const rowStart = Math.floor(cellZ - scaledD / 2);
            const rowEnd = Math.floor(cellZ + scaledD / 2);

            // Exclusion zone check (player spawn)
            let excluded = false;
            if (excludeCells) {
                for (let col = colStart; col <= colEnd && !excluded; col++) {
                    for (
                        let row = rowStart;
                        row <= rowEnd && !excluded;
                        row++
                    ) {
                        if (excludeCells.has(`${col},${row}`)) excluded = true;
                    }
                }
            }
            if (excluded) continue;

            // Place the building
            const model = models[modelIdx].clone(true);
            model.scale.setScalar(scale);
            if (modelIdx === 0) model.scale.y *= 1.5 + rng() * 0.4; // taller convenience stores

            model.position.set(cellX, 0, cellZ);
            // Prefer axis-aligned or 90° rotations for a more "city block" feel
            model.rotation.y = pick(rng, [
                0,
                Math.PI / 2,
                Math.PI,
                (3 * Math.PI) / 2,
            ]);

            const tint = pick(rng, COLORS);
            model.traverse((child) => {
                if ((child as Mesh).isMesh) {
                    const mesh = child as Mesh;
                    const mat = mesh.material as MeshStandardMaterial;
                    if (mat) {
                        mat.color.lerp(tint, 0.3);
                        mat.roughness = 0.55 + rng() * 0.25;
                        mat.metalness = 0.1 + rng() * 0.2;
                    }
                }
            });

            group.add(model);
            placed.add(cellKey);
            placedCount++;

            // Mark occupied cells
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
