import { describe, it, expect } from 'vitest';
import { setupRibbons } from '../../../threejs/ribbon/threejs.svelte';

describe('Ribbon setup', () => {
    it('returns a cleanup function', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupRibbons(canvas);
        expect(cleanup).toBeInstanceOf(Function);
    });

    it('creates a renderer on the canvas', () => {
        const canvas = document.createElement('canvas');
        setupRibbons(canvas);
        expect(canvas.width).toBeGreaterThan(0);
    });

    it('cleanup can be called without throwing', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupRibbons(canvas);
        expect(cleanup).toBeDefined();
        expect(() => cleanup!()).not.toThrow();
    });

    it('returns undefined if canvas is null', () => {
        // @ts-expect-error
        expect(setupRibbons(null)).toBeUndefined();
    });
});
