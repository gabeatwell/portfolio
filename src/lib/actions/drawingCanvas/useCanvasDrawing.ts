import type { Action } from 'svelte/action';
import {
    initCanvas,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    clearCanvas,
} from '../../components/learn/draw-canvas/drawFunctions.svelte';

export const useCanvasDrawing: Action<HTMLCanvasElement> = (node) => {
    const ac = new AbortController();

    initCanvas(node);

    // mouse (pointer events unify mouse + pen)
    node.addEventListener('pointerdown', startDrawing as EventListener, {
        signal: ac.signal,
    });
    node.addEventListener('pointerup', stopDrawing as EventListener, {
        signal: ac.signal,
    });
    node.addEventListener('pointerleave', stopDrawing as EventListener, {
        signal: ac.signal,
    });

    // touch (needs preventDefault, passive: false)
    node.addEventListener(
        'touchstart',
        (e: TouchEvent) => {
            e.preventDefault();
            startDrawing(e);
        },
        { passive: false, signal: ac.signal } as AddEventListenerOptions,
    );
    node.addEventListener(
        'touchmove',
        (e: TouchEvent) => {
            e.preventDefault();
            draw(e);
        },
        { passive: false, signal: ac.signal } as AddEventListenerOptions,
    );
    node.addEventListener(
        'touchend',
        (e: TouchEvent) => {
            e.preventDefault();
            stopDrawing();
        },
        { passive: false, signal: ac.signal } as AddEventListenerOptions,
    );

    // keyboard shortcuts (window-level)
    const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'z' && e.ctrlKey) {
            e.preventDefault();
            undo();
        }
        if (e.key === 'Delete' || e.key === 'Backspace') clearCanvas();
    };
    window.addEventListener('keydown', handleKeyDown, { signal: ac.signal });

    return {
        destroy: () => ac.abort(), // runs on node destroy — same cleanup as before
    };
};
