import { describe, it, expect, beforeAll } from 'vitest';
import { setupHeroCanvas } from '../../../threejs/hero/threejs.svelte';

describe('HeroCanvas setup', () => {
    beforeAll(() => {
        // requestIdleCallback may not exist in jsdom
        if (!globalThis.requestIdleCallback) {
            globalThis.requestIdleCallback = (cb: IdleRequestCallback) =>
                setTimeout(
                    () => cb({ didTimeout: false, timeRemaining: () => 0 }),
                    1,
                ) as unknown as number;
        }
    });

    it('returns a cleanup function', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupHeroCanvas(canvas);
        expect(cleanup).toBeInstanceOf(Function);
    });

    it('creates a renderer and attaches it to the canvas', () => {
        const canvas = document.createElement('canvas');
        setupHeroCanvas(canvas);
        expect(canvas.width).toBeGreaterThan(0);
    });

    it('cleanup can be called without throwing', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupHeroCanvas(canvas);
        expect(cleanup).toBeInstanceOf(Function);
        expect(() => (cleanup as () => void)()).not.toThrow();
    });
});
