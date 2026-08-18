import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { setupPostProcess } from '../../../threejs/post-processing/threejs.svelte';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Group } from 'three';

describe('PostProcess setup', () => {
    beforeAll(() => {
        // Prevent GLTFLoader from making actual network requests in tests
        vi.spyOn(GLTFLoader.prototype, 'load').mockImplementation(
            (_url: any, onLoad: any) => {
                const mockScene = new Group();
                onLoad?.({ scene: mockScene });
                return undefined as any;
            },
        );
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });
    it('returns a cleanup function', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupPostProcess(canvas);
        expect(cleanup).toBeInstanceOf(Function);
    });

    it('creates a renderer on the canvas', () => {
        const canvas = document.createElement('canvas');
        setupPostProcess(canvas);
        expect(canvas.width).toBeGreaterThan(0);
    });

    it('cleanup can be called without throwing', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupPostProcess(canvas);
        expect(() => cleanup?.()).not.toThrow();
    });
});
