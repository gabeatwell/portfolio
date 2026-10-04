/**
 * A* pathfinding for the FPS game mode.
 * Uses buildingCells as obstacles instead of the shooter's tree/rock/bush cells.
 */
import type { World } from '../../shooter/world';

export interface Cell {
    x: number;
    z: number;
}

interface AStarNode {
    key: string;
    cell: Cell;
    g: number;
    h: number;
    f: number;
    parent: AStarNode | null;
}

const keyOf = (c: Cell) => `${c.x},${c.z}`;
const manhattan = (a: Cell, b: Cell) =>
    Math.abs(a.x - b.x) + Math.abs(a.z - b.z);

const inBounds = (c: Cell, world: World) =>
    c.x >= 0 &&
    c.z >= 0 &&
    c.x < Math.floor(world.width) &&
    c.z < Math.floor(world.height);

const isBlocked = (c: Cell, world: World) => world.buildingCells.has(keyOf(c));

const neighbors4 = (c: Cell): Cell[] => [
    { x: c.x + 1, z: c.z },
    { x: c.x - 1, z: c.z },
    { x: c.x, z: c.z + 1 },
    { x: c.x, z: c.z - 1 },
];

export function worldToCell(x: number, z: number): Cell {
    return { x: Math.floor(x), z: Math.floor(z) };
}

export function cellToWorld(cell: Cell): { x: number; z: number } {
    return { x: cell.x + 0.5, z: cell.z + 0.5 };
}

/**
 * A* pathfinder. Returns array of cells from start to end (inclusive).
 * Returns empty array if no path exists or if the end cell is blocked.
 */
export function findPath(start: Cell, end: Cell, world: World): Cell[] {
    if (!inBounds(start, world) || !inBounds(end, world)) return [];
    if (isBlocked(end, world)) {
        // Try to find the nearest unblocked cell to the target
        const alternatives: Cell[] = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                if (dx === 0 && dz === 0) continue;
                const alt: Cell = { x: end.x + dx, z: end.z + dz };
                if (inBounds(alt, world) && !isBlocked(alt, world)) {
                    alternatives.push(alt);
                }
            }
        }
        if (alternatives.length === 0) return [];
        // Pick the closest alternative to the original end
        alternatives.sort((a, b) => manhattan(a, start) - manhattan(b, start));
        return findPath(start, alternatives[0], world);
    }
    if (start.x === end.x && start.z === end.z) return [start];

    const open = new Map<string, AStarNode>();
    const closed = new Set<string>();

    const startNode: AStarNode = {
        key: keyOf(start),
        cell: start,
        g: 0,
        h: manhattan(start, end),
        f: manhattan(start, end),
        parent: null,
    };
    open.set(startNode.key, startNode);

    while (open.size > 0) {
        let current: AStarNode | null = null;
        for (const n of open.values()) {
            if (
                !current ||
                n.f < current.f ||
                (n.f === current.f && n.h < current.h)
            )
                current = n;
        }
        if (!current) break;

        open.delete(current.key);
        closed.add(current.key);

        if (current.cell.x === end.x && current.cell.z === end.z) {
            const path: Cell[] = [];
            let node: AStarNode | null = current;
            while (node) {
                path.push(node.cell);
                node = node.parent;
            }
            path.reverse();
            return path;
        }

        for (const next of neighbors4(current.cell)) {
            const nKey = keyOf(next);
            if (
                !inBounds(next, world) ||
                isBlocked(next, world) ||
                closed.has(nKey)
            )
                continue;

            const g = current.g + 1;
            const existing = open.get(nKey);
            if (!existing || g < existing.g) {
                const h = manhattan(next, end);
                open.set(nKey, {
                    key: nKey,
                    cell: next,
                    g,
                    h,
                    f: g + h,
                    parent: current,
                });
            }
        }
    }

    return [];
}
