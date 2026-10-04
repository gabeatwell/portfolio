import type { World } from '../../shooter/world';
import { createRng, range } from './seededRng';
import { Group, Object3D } from 'three';
import { FPSBuilding } from '../buildings/FPSBuilding';

export interface SpawnPoint {
    x: number;
    z: number;
    type: 'basic' | 'ranged' | 'tank' | 'rusher' | 'sniper';
}

export interface LevelConfig {
    seed: number;
    buildings: Group;
    spawnPoints: SpawnPoint[];
    density: number;
    playerSpawn: { x: number; z: number };
}

export interface GenerateLevelOptions {
    world: World;
    width: number;
    depth: number;
    models: Object3D[];
    seed?: number;
    buildingCount?: number;
    density?: number; // 0–1
    playerSpawn?: { x: number; z: number };
}

export function generateLevel(opts: GenerateLevelOptions): LevelConfig {
    const {
        world,
        width,
        depth,
        models,
        seed = Date.now(),
        buildingCount = 8,
        density = 0.55,
    } = opts;

    const rng = createRng(seed);

    // clear previous building cells
    world.buildingCells.clear();

    // 1. generate buildings
    const buildings = FPSBuilding.createBuildings({
        width,
        height: depth,
        count: buildingCount,
        seed, // same seed drives both buildings and later spawns
        occupiedCells: world.buildingCells,
        models,
        density,
    });

    // 2. generate spawn points that avoid buildings + player start
    const playerSpawn = findFreeSpawn(world, width, depth, rng, 4);
    const spawnPoints: SpawnPoint[] = [];
    const enemyCount = 4 + Math.floor(rng() * 4); // 4–7
    const safeRadius = 9;

    for (let i = 0; i < enemyCount; i++) {
        let x = 0,
            z = 0;
        let attempts = 0;
        do {
            x = range(rng, 3, width - 3);
            z = range(rng, 3, depth - 3);
            attempts++;
        } while (
            (isInsideBuilding(world, x, z) ||
                dist(x, z, playerSpawn.x, playerSpawn.z) < safeRadius) &&
            attempts < 60
        );

        const roll = rng();
        let type: SpawnPoint['type'] = 'basic';
        if (roll < 0.4) type = 'basic';
        else if (roll < 0.65) type = 'ranged';
        else if (roll < 0.8) type = 'rusher';
        else if (roll < 0.92) type = 'sniper';
        else type = 'tank';

        spawnPoints.push({ x, z, type });
    }

    return {
        seed,
        buildings,
        spawnPoints,
        density,
        playerSpawn,
    };
}

function findFreeSpawn(
    world: World,
    width: number,
    depth: number,
    rng: () => number,
    clearRadius = 3,
): { x: number; z: number } {
    const padding = 4;
    let attempts = 0;

    while (attempts < 80) {
        attempts++;
        const x = range(rng, padding, width - padding);
        const z = range(rng, padding, depth - padding);

        if (isAreaClear(world, x, z, clearRadius)) {
            return { x, z };
        }
    }

    // fallback: center of the map
    return { x: width / 2, z: depth / 2 };
}

function isAreaClear(
    world: World,
    x: number,
    z: number,
    radius: number,
): boolean {
    if (!world.buildingCells) return true;
    const r = Math.ceil(radius);
    for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
            if (Math.hypot(dx, dz) > radius) continue;
            if (
                world.buildingCells.has(
                    `${Math.floor(x + dx)},${Math.floor(z + dz)}`,
                )
            ) {
                return false;
            }
        }
    }
    return true;
}

function isInsideBuilding(world: World, x: number, z: number): boolean {
    if (!world?.buildingCells) return false;
    return world.buildingCells.has(`${Math.floor(x)},${Math.floor(z)}`);
}

function dist(x1: number, z1: number, x2: number, z2: number): number {
    return Math.hypot(x1 - x2, z1 - z2);
}
