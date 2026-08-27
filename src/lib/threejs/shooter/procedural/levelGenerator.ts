import type { World } from '../world';
import { createRng, range } from './seededRng';
import { ARENA_PRESETS } from './arenaPresets';

export interface SpawnPoint {
    x: number;
    z: number;
    type: 'basic' | 'ranged' | 'tank';
}

export interface LevelConfig {
    spawnPoints: SpawnPoint[];
    arenaBounds: { minX: number; maxX: number; minZ: number; maxZ: number };
    playerSpawn: { x: number; z: number };
    seed: number;
}

function isInsideBuilding(world: World, x: number, z: number): boolean {
    if (!world?.buildingCells) return false;
    const cellKey = `${Math.floor(x)},${Math.floor(z)}`;
    return world.buildingCells.has(cellKey);
}

function distFromPlayer(x: number, z: number, px: number, pz: number): number {
    return Math.sqrt((x - px) ** 2 + (z - pz) ** 2);
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

export function generateLevelConfig(
    world: World,
    bounds: { width: number; depth: number },
    seed?: number,
): LevelConfig {
    const actualSeed = seed ?? Date.now();
    const rng = createRng(actualSeed);

    // random player spawn
    const playerSpawn = findFreeSpawn(world, bounds.width, bounds.depth, rng);

    if (rng() < 0.5) {
        const preset = ARENA_PRESETS[Math.floor(rng() * ARENA_PRESETS.length)];
        const spawnPoints: SpawnPoint[] = preset.spawnPositions.map(
            (pos, i) => ({
                x: pos.x + bounds.width / 2,
                z: pos.z + bounds.depth / 2,
                type: preset.spawns[i]?.type ?? 'basic',
            }),
        );

        return {
            spawnPoints,
            arenaBounds: {
                minX: 0,
                maxX: bounds.width,
                minZ: 0,
                maxZ: bounds.depth,
            },
            playerSpawn,
            seed: actualSeed,
        };
    }

    const safeRadius = 8;
    const spawnPoints: SpawnPoint[] = [];
    const enemyCount = 3 + Math.floor(rng() * 3);

    for (let i = 0; i < enemyCount; i++) {
        let x: number, z: number;
        let attempts = 0;
        do {
            x = rng() * bounds.width;
            z = rng() * bounds.depth;
            attempts++;
        } while (
            (isInsideBuilding(world, x, z) ||
                distFromPlayer(x, z, playerSpawn.x, playerSpawn.z) <
                    safeRadius) &&
            attempts < 50
        );

        const roll = rng();
        const type = roll < 0.5 ? 'basic' : roll < 0.8 ? 'ranged' : 'tank';
        spawnPoints.push({ x, z, type });
    }

    return {
        spawnPoints,
        arenaBounds: {
            minX: 0,
            maxX: bounds.width,
            minZ: 0,
            maxZ: bounds.depth,
        },
        playerSpawn,
        seed: actualSeed,
    };
}
