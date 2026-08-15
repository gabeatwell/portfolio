<script lang="ts">
    import { attachMobileLandscape } from '$lib/attachments/threejs/attachMobileLandscape';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte.js';
    import { setupLoader } from './threejs.svelte';

    let loadingComplete = $state<boolean>(false);
    const breakpoints = getBreakpoints();
</script>

<canvas
    class="webgl"
    {@attach setupLoader}
    {@attach attachMobileLandscape({
        isLandscapeMobile: breakpoints.isLandscape && breakpoints.isMobile,
    })}
></canvas>

<div class="loading-overlay">
    <section class="loading-bar"></section>
</div>

<div class="point point-0">
    <div class="content">
        <h2 class="label" class:visible={loadingComplete}>What am I?</h2>

        <p class="text">A mechanical shark on a movie set for the moon.</p>
    </div>
</div>

<style>
    :global(body.loading-complete .loading-overlay) {
        opacity: 0;
        pointer-events: none;
        transition: opacity 3s ease;
    }

    .webgl {
        position: fixed;
        top: 0;
        left: 0;
        outline: 0;
    }

    .loading-overlay {
        position: fixed;
        inset: 0;
        background-color: var(--clr-dark-500);
        z-index: 200;
        pointer-events: none;

        & .loading-bar {
            position: absolute;
            top: 50%;
            width: 100%;
            height: 1.5em;
            background-color: var(--clr-gray-600);
            transform: scaleX(0);
            transition: transform 0.5s ease;
            transform-origin: top left;
            border-radius: 1vw;
            will-change: transform;
        }
    }

    .point {
        position: absolute;
        top: 50%;
        left: 50%;

        @media (width >= 768px) {
            top: 35%;
        }

        @media (width <= 768px) {
            top: 70%;
        }

        & .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            & .label {
                inline-size: clamp(150px, 15vw, 300px);
                block-size: fit-content;
                border-radius: var(--radius);
                background-color: var(--clr-dark-500);
                border: 1px solid var(--clr-light-500);
                color: var(--clr-gray-600);
                font-family: var(--bronova-bold);
                font-size: clamp(var(--sm), 2vw, var(--h2));
                text-align: center;
                line-height: 1.2;
                cursor: help;
                user-select: none;

                visibility: hidden;

                &.visible {
                    visibility: visible;
                }

                &:hover + .text {
                    opacity: 1;
                }
            }

            & .text {
                inline-size: clamp(150px, 15vw, 300px);
                block-size: fit-content;
                border-radius: var(--radius);
                background-color: var(--clr-dark-500);
                color: var(--clr-gray-700);
                font-family: var(--bronova);
                font-size: clamp(var(--xs), 1.2vw, var(--h4));
                font-weight: 100;
                text-align: center;
                padding: 1em;
                line-height: 1;
                margin-top: -2em;
                opacity: 0;
                transition: opacity 0.4s ease-in-out;
            }
        }
    }
</style>
