export function createRng(seed: number): () => number {
    let s = seed | 0;
    return () => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function pick<T>(rng: () => number, items: T[]): T {
    return items[Math.floor(rng() * items.length)];
}

export function range(rng: () => number, min: number, max: number): number {
    return min + rng() * (max - min);
}
