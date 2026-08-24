import type { SpawnPoint } from './levelGenerator';

export interface ArenaPreset {
    name: string;
    offset: { x: number; z: number };
    spawnPositions: { x: number; z: number }[];
    spawns: { type: SpawnPoint['type'] }[];
}

export const ARENA_PRESETS: ArenaPreset[] = [
    {
        name: 'open-plaza',
        offset: { x: 25, z: 25 },
        spawnPositions: [
            { x: 10, z: 10 },
            { x: -10, z: 10 },
            { x: 10, z: -10 },
            { x: -10, z: -10 },
            { x: 0, z: 12 },
            { x: 0, z: -12 },
        ],
        spawns: [
            { type: 'basic' },
            { type: 'basic' },
            { type: 'basic' },
            { type: 'ranged' },
            { type: 'ranged' },
            { type: 'tank' },
        ],
    },
    {
        name: 'alley-ambush',
        offset: { x: 25, z: 25 },
        spawnPositions: [
            { x: -8, z: 0 },
            { x: -4, z: 3 },
            { x: -4, z: -3 },
            { x: 4, z: 2 },
            { x: 4, z: -2 },
            { x: 8, z: 0 },
            { x: 0, z: 8 },
            { x: 0, z: -8 },
        ],
        spawns: [
            { type: 'basic' },
            { type: 'basic' },
            { type: 'basic' },
            { type: 'basic' },
            { type: 'ranged' },
            { type: 'ranged' },
            { type: 'tank' },
            { type: 'tank' },
        ],
    },
];
