import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('getPreloaderState', () => {
    let preloaderState: ReturnType<
        (typeof import('$lib/data/stores/preloadStore.svelte'))['getPreloaderState']
    >;

    beforeEach(async () => {
        // fresh import each test so module state resets
        vi.resetModules();
        const { getPreloaderState } =
            await import('$lib/data/stores/preloadStore.svelte');
        preloaderState = getPreloaderState();
    });

    it('starts with done as false', () => {
        expect(preloaderState.done).toBe(false);
    });

    it('can set done to true', () => {
        preloaderState.done = true;
        expect(preloaderState.done).toBe(true);
    });

    it('can set done back to false after being true', () => {
        preloaderState.done = true;
        preloaderState.done = false;
        expect(preloaderState.done).toBe(false);
    });

    it('shares state across multiple getPreloaderState() calls', async () => {
        const { getPreloaderState } =
            await import('$lib/data/stores/preloadStore.svelte');
        const anotherRef = getPreloaderState();

        preloaderState.done = true;
        expect(anotherRef.done).toBe(true);
    });
});
