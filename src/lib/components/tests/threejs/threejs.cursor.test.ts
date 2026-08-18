import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupCursorScene } from '../../../threejs/cursor/threejs.svelte';

describe('CursorScene setup', () => {
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        canvas = document.createElement('canvas');
    });

    afterEach(() => {
        // Clean up any extra canvases that may have been appended to body
        document.body.querySelectorAll('canvas').forEach((el) => el.remove());
    });

    it('returns a cleanup function', () => {
        const cleanup = setupCursorScene(canvas);
        expect(cleanup).toBeInstanceOf(Function);
    });

    it('creates a displacement canvas and appends it to the body', () => {
        setupCursorScene(canvas);
        const displacementCanvas = document.querySelector(
            'canvas[style*="position: fixed"]',
        );
        expect(displacementCanvas).not.toBeNull();
    });

    it('cleanup removes the displacement canvas from the DOM', () => {
        const cleanup = setupCursorScene(canvas);
        cleanup?.();
        const displacementCanvas = document.querySelector(
            'canvas[style*="position: fixed"]',
        );
        expect(displacementCanvas).toBeNull();
    });

    it('cleanup can be called without throwing', () => {
        const cleanup = setupCursorScene(canvas);
        expect(() => cleanup?.()).not.toThrow();
    });
});
