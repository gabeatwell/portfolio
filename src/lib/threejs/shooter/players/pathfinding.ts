import type { World } from '../world';

export type Cell = { x: number; z: number };

type Node = {
    key: string;
    cell: Cell;
    g: number;
    h: number;
    f: number;
    parent: Node | null;
};

const keyOf = (cell: Cell) => `${cell.x},${cell.z}`;
const manhattan = (a: Cell, b: Cell) =>
    Math.abs(a.x - b.x) + Math.abs(a.z - b.z);

const inBounds = (c: Cell, world: World) =>
    c.x >= 0 &&
    c.z >= 0 &&
    c.x < Math.floor(world.width) &&
    c.z < Math.floor(world.height);
const isBlocking = (c: Cell, world: World) => {
    const key = keyOf(c);
    return world.buildingCells.has(key);
};

const neighbors4 = (c: Cell): Cell[] => [
    { x: c.x + 1, z: c.z },
    { x: c.x - 1, z: c.z },
    { x: c.x, z: c.z + 1 },
    { x: c.x, z: c.z - 1 },
];

const reconstructPath = (node: Node): Cell[] => {
    const path: Cell[] = [];
    let current: Node | null = node;
    while (current) {
        path.push(current.cell);
        current = current.parent;
    }
    path.reverse();
    return path;
};

export function worldToCell(x: number, z: number): Cell {
    return { x: Math.floor(x), z: Math.floor(z) };
}

export function cellToWorld(cell: Cell) {
    return { x: cell.x + 0.5, z: cell.z + 0.5 };
}

export function findPathAStar(start: Cell, end: Cell, world: World): Cell[] {
    if (!inBounds(start, world) || !inBounds(end, world)) return [];
    if (isBlocking(end, world)) return [];
    if (start.x === end.x && start.z === end.z) return [start];

    const open = new Map<string, Node>();
    const closed = new Set<string>();

    const startNode: Node = {
        key: keyOf(start),
        cell: start,
        g: 0,
        h: manhattan(start, end),
        f: manhattan(start, end),
        parent: null,
    };

    open.set(startNode.key, startNode);

    while (open.size > 0) {
        let current: Node | null = null;
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
            return reconstructPath(current);
        }

        for (const nextCell of neighbors4(current.cell)) {
            const nextKey = keyOf(nextCell);
            if (
                !inBounds(nextCell, world) ||
                isBlocking(nextCell, world) ||
                closed.has(nextKey)
            )
                continue;

            const tentativeG = current.g + 1;
            const existing = open.get(nextKey);

            if (!existing || tentativeG < existing.g) {
                const h = manhattan(nextCell, end);
                open.set(nextKey, {
                    key: nextKey,
                    cell: nextCell,
                    g: tentativeG,
                    h,
                    f: tentativeG + h,
                    parent: current,
                });
            }
        }
    }

    return [];
}
