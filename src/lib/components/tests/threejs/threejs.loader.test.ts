import {
    describe,
    it,
    expect,
    vi,
    beforeAll,
    afterAll,
    beforeEach,
    afterEach,
} from 'vitest';
import { setupLoader } from '../../../threejs/loader/threejs.svelte';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Group } from 'three';

describe('Loader setup', () => {
    let loadingBar: HTMLElement;
    let point0: HTMLElement;

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

    beforeEach(() => {
        // The loader queries a .loading-bar element from the DOM
        loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        document.body.appendChild(loadingBar);

        // The loader queries a .point-0 element for the tick animation
        point0 = document.createElement('div');
        point0.className = 'point-0';
        document.body.appendChild(point0);
    });

    afterEach(() => {
        loadingBar.remove();
        point0.remove();
    });

    it('returns a cleanup function', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupLoader(canvas);
        expect(cleanup).toBeDefined();
    });

    it('creates a renderer on the canvas', () => {
        const canvas = document.createElement('canvas');
        setupLoader(canvas);
        expect(canvas.width).toBeGreaterThan(0);
    });

    it('cleanup can be called without throwing', () => {
        const canvas = document.createElement('canvas');
        const cleanup = setupLoader(canvas);
        expect(typeof cleanup).toBe('function');
        expect(() => (cleanup as () => void)?.()).not.toThrow();
    });

    it('throws if canvas is null', () => {
        // @ts-expect-error
        expect(() => setupLoader(null)).toThrow('Canvas element not found');
    });
});
