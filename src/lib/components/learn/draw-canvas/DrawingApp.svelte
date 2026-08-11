<script lang="ts">
    import { onMount } from 'svelte';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';
    import { useCanvasDrawing } from '$lib/attachments/drawingCanvas/useCanvasDrawing';
    import {
        draw,
        stopDrawing,
        undo,
        clearCanvas,
        drawState,
    } from './drawFunctions.svelte';

    let mouseX = $state(0);
    let mouseY = $state(0);
    let isOnCanvas = $state(false);

    const breakpoints = getBreakpoints();

    function handlePointerMove(e: PointerEvent) {
        const rect = (
            e.currentTarget as HTMLCanvasElement
        ).getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        draw(e);
    }

    onMount(() => {
        const footer = document.querySelector('footer') as HTMLElement | null;

        if (footer) footer.style.display = 'none';

        return () => {
            if (footer) footer.style.display = '';
        };
    });
</script>

<div id="toolbar">
    <button
        id="btn-pencil"
        class:active={!drawState.isEraser}
        onclick={() => (drawState.isEraser = false)}
        aria-label="draw"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
            ><path
                d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"
                fill="var(--clr-warning-500)"
            /></svg
        >
    </button>

    <button
        id="btn-eraser"
        class:active={drawState.isEraser}
        onclick={() => (drawState.isEraser = true)}
        aria-label="erase"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
            ><path
                d="M210.5 480L333.5 480L398.8 414.7L225.3 241.2L98.6 367.9L210.6 479.9zM256 544L210.5 544C193.5 544 177.2 537.3 165.2 525.3L49 409C38.1 398.1 32 383.4 32 368C32 352.6 38.1 337.9 49 327L295 81C305.9 70.1 320.6 64 336 64C351.4 64 366.1 70.1 377 81L559 263C569.9 273.9 576 288.6 576 304C576 319.4 569.9 334.1 559 345L424 480L544 480C561.7 480 576 494.3 576 512C576 529.7 561.7 544 544 544L256 544z"
                fill="var(--clr-fail-500)"
            /></svg
        >
    </button>

    <label
        >Color:
        <input
            type="color"
            id="color-picker"
            bind:value={drawState.currentColor}
            style="background-color: {drawState.currentColor}"
        /></label
    >

    {#if breakpoints.isMobile}
        <label
            >Size: <select id="size-select" bind:value={drawState.currentSize}>
                <option value={2}>XS</option>
                <option value={6}>S</option>
                <option value={12}>M</option>
                <option value={24}>L</option>
                <option value={48}>XL</option>
                <option value={100}>XXL</option>
            </select></label
        >
    {:else}
        <label
            >Size: <input
                type="range"
                id="size-slider"
                min="1"
                max="100"
                value={drawState.currentSize}
                oninput={(e) =>
                    (drawState.currentSize = Number(e.currentTarget.value))}
            /></label
        >
    {/if}

    <button id="btn-clear" onclick={clearCanvas}>Clear</button>
    <button id="btn-undo" onclick={undo}>Undo</button>
</div>

<div id="canvas-container">
    <div id="canvas-background"></div>

    <canvas
        id="canvas"
        {@attach useCanvasDrawing}
        onpointermove={handlePointerMove}
        onpointerenter={() => (isOnCanvas = true)}
        onpointerleave={() => {
            isOnCanvas = false;
            stopDrawing();
        }}
    ></canvas>

    {#if drawState.isEraser && isOnCanvas}
        <div
            id="eraser-cursor"
            style="
                width: {drawState.currentSize}px;
                height: {drawState.currentSize}px;
                left: {mouseX}px;
                top: {mouseY}px;
            "
        ></div>
    {/if}

    {#if !drawState.isEraser && isOnCanvas}
        <div
            id="draw-cursor"
            style="
                width: {drawState.currentSize}px;
                height: {drawState.currentSize}px;
                left: {mouseX}px;
                top: {mouseY}px;
            "
        ></div>
    {/if}
</div>

<style>
    #toolbar {
        position: fixed;
        bottom: 2em;
        left: 50%;
        transform: translateX(-50%);
        inline-size: fit-content;
        block-size: 5em;
        background-color: transparent;
        color: var(--clr-light-500);
        padding: 1em;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        display: flex;
        align-items: center;
        gap: 1em;
        z-index: 50;

        @media (width <= 768px) {
            bottom: unset;
            top: calc(50% + (70vh - 5em) / 2 - 2em + 1.5em);
            gap: 0.5em;
            inline-size: 20em;
            block-size: auto;
            margin-inline: auto;
        }

        & button,
        & input[type='color'],
        & input[type='range'] {
            cursor: pointer;
            padding: 0.5em 0.75em;
            border: none;
            border-radius: var(--radius);
            color: var(--clr-light-500);
            inline-size: fit-content;
            block-size: auto;

            @media (width <= 768px) {
                padding: 0.4em 0.5em;
                font-size: 0.8rem;
            }
        }

        & input[type='color'] {
            min-inline-size: 3em;
            min-block-size: 2em;
        }

        & #size-slider {
            max-inline-size: 7em;
        }

        & button {
            background-color: rgba(0, 0, 0, 0.75);
            color: rgba(155, 155, 155, 1);

            & svg {
                inline-size: clamp(1.25em, 1.2vw, 1.5em);
                block-size: clamp(1.25em, 1.2vw, 1.5em);
            }

            &.active {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }

        & label {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        & input,
        & button {
            outline: 1px solid var(--clr-light-400);
        }
    }

    #canvas-container {
        background: transparent;
        border: 3px solid var(--clr-light-400);
        border-radius: var(--radius);
        outline: 1px solid var(--clr-light-400);
        outline-offset: 5px;
        overflow: hidden;
        z-index: 5;

        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        max-inline-size: 100vw;
        max-block-size: 100vh;
        margin-top: 6.5em;

        inline-size: 100%;
        block-size: 100%;

        @media (width <= 768px) {
            margin-top: 4em;
            border: 1px solid var(--clr-light-400);
        }

        & #canvas-background {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 1);
            z-index: -1;
        }

        & #canvas {
            cursor: none;
        }
    }

    #eraser-cursor {
        position: absolute;
        background-color: rgb(236, 151, 194);
        border-radius: var(--radius) 25%;
        pointer-events: none;
        translate: -50% -50%;
        z-index: 10;
    }

    #draw-cursor {
        position: absolute;
        border: 2px dashed var(--clr-light-500);
        border-radius: 50%;
        pointer-events: none;
        translate: -50% -50%;
        z-index: 10;
    }
</style>
