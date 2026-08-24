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
}

function isInsideBuilding(world: World, x: number, z: number): boolean {
    if (!world?.buildingCells) return false;
    const cellKey = `${Math.floor(x)},${Math.floor(z)}`;
    return world.buildingCells.has(cellKey);
}

function distFromPlayer(x: number, z: number, px: number, pz: number): number {
    return Math.sqrt((x - px) ** 2 + (z - pz) ** 2);
}

export function generateLevelConfig(
    world: World,
    bounds: { width: number; depth: number },
    seed?: number,
): LevelConfig {
    const rng = createRng(seed ?? Date.now());

    if (rng() < 0.5) {
        const preset = ARENA_PRESETS[Math.floor(rng() * ARENA_PRESETS.length)];
        return {
            spawnPoints: preset.spawnPositions.map((pos, i) => ({
                x: pos.x + bounds.width / 2,
                z: pos.z + bounds.depth / 2,
                type: preset.spawns[i]?.type ?? 'basic',
            })),
            arenaBounds: {
                minX: 0,
                maxX: bounds.width,
                minZ: 0,
                maxZ: bounds.depth,
            },
        };
    }

    const safeRadius = 8;
    const playerStartX = 5; // matches HumanPlayer start position
    const playerStartZ = 5;
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
                distFromPlayer(x, z, playerStartX, playerStartZ) <
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
    };
}
