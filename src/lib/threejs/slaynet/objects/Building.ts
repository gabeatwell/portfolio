import { Group, type Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const buildingA = '/threejayess/models/large_building_a.glb';
const buildingB = '/threejayess/models/large_building_b.glb';

export class Building {
    private static loader = new GLTFLoader();
    private static modelCache: Map<string, Object3D> = new Map();

    static async loadModel(url: string): Promise<Object3D> {
        if (this.modelCache.has(url)) {
            return this.modelCache.get(url)!.clone();
        }

        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (gltf) => {
                    this.modelCache.set(url, gltf.scene.clone());
                    resolve(gltf.scene);
                },
                undefined,
                reject,
            );
        });
    }

    static async createBuildings(
        width: number,
        height: number,
        count: number,
        occupiedCells: Set<string>,
    ): Promise<Group> {
        const group = new Group();
        const models = [buildingA, buildingB];
        const padding = 3;
        const buildingSpacing = 4;
        const placedBuildings = new Set<string>();

        for (let i = 0; i < count; i++) {
            let cellX: number;
            let cellZ: number;
            let cellKey: string;
            let attempts = 0;
            const maxAttempts = 100;

            // find unoccupied cell with spacing
            do {
                cellX =
                    Math.floor(Math.random() * (width - padding * 2)) + padding;
                cellZ =
                    Math.floor(Math.random() * (height - padding * 2)) +
                    padding;
                cellKey = `${cellX},${cellZ}`;
                attempts++;
            } while (
                (placedBuildings.has(cellKey) ||
                    this.isNearExistingBuilding(
                        cellX,
                        cellZ,
                        placedBuildings,
                        buildingSpacing,
                    )) &&
                attempts < maxAttempts
            );

            if (attempts >= maxAttempts) continue;

            try {
                const modelUrl =
                    models[Math.floor(Math.random() * models.length)];
                const building = await this.loadModel(modelUrl);

                building.position.set(cellX, 0, cellZ);

                let buildingRadius: number;
                if (modelUrl === buildingA) {
                    building.scale.multiplyScalar(2);
                    buildingRadius = 2.2;
                } else {
                    building.scale.multiplyScalar(3.2);
                    buildingRadius = 2.6;
                }

                group.add(building);
                placedBuildings.add(cellKey);

                this.markBuildingCells(
                    cellX,
                    cellZ,
                    buildingRadius,
                    occupiedCells,
                );

                console.log(`Building placed at (${cellX}, ${cellZ})`);
            } catch (error) {
                console.error(`Failed to load building model: ${error}`);
            }
        }

        return group;
    }

    private static markBuildingCells(
        centerX: number,
        centerZ: number,
        radius: number,
        occupiedCells: Set<string>,
    ): void {
        // Mark all cells within the building's radius
        const radiusCeil = Math.ceil(radius);
        for (let dx = -radiusCeil; dx <= radiusCeil; dx++) {
            for (let dz = -radiusCeil; dz <= radiusCeil; dz++) {
                const cellX = centerX + dx;
                const cellZ = centerZ + dz;
                // Only mark if within radius distance
                const dist = Math.hypot(dx, dz);
                if (dist <= radius) {
                    occupiedCells.add(`${cellX},${cellZ}`);
                }
            }
        }
    }

    private static isNearExistingBuilding(
        x: number,
        z: number,
        placedBuildings: Set<string>,
        spacing: number,
    ): boolean {
        // Check if position is too close to any existing building
        for (let dx = -spacing; dx <= spacing; dx++) {
            for (let dz = -spacing; dz <= spacing; dz++) {
                const key = `${x + dx},${z + dz}`;
                if (placedBuildings.has(key)) {
                    return true;
                }
            }
        }
        return false;
    }
}
