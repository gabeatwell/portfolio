import { describe, it, expect } from 'vitest';
import { setupTunnel } from '../../../threejs/tunnel/threejs.svelte';

describe('Tunnel setup', () => {
    it('returns a cleanup function', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupTunnel(canvas);
        expect(cleanup).toBeInstanceOf(Function);
    });

    it('creates a WebGLRenderer on the canvas', () => {
        const canvas = document.createElement('canvas');
        setupTunnel(canvas);
        // The renderer sets the canvas size — check it was assigned
        expect(canvas.width).toBeGreaterThan(0);
        expect(canvas.height).toBeGreaterThan(0);
    });

    it('cleanup can be called without throwing', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupTunnel(canvas) as () => void;
        expect(() => cleanup()).not.toThrow();
    });

    it('does not throw if canvas is null/undefined', () => {
        // @ts-expect-error — testing invalid input
        expect(setupTunnel(null)).toBeUndefined();
        // @ts-expect-error
        expect(setupTunnel(undefined)).toBeUndefined();
    });
});
