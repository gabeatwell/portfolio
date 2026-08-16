<script lang="ts">
    import { attachMobileLandscape } from '$lib/attachments/threejs/attachMobileLandscape';
    import { initCarousel } from './threejs.svelte';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';

    const breakpoints = getBreakpoints();
</script>

<h2>drag the images to move</h2>
<canvas
    {@attach initCarousel}
    {@attach attachMobileLandscape({
        isLandscapeMobile: breakpoints.isLandscape && breakpoints.isMobile,
    })}
    class="canvas"
></canvas>

<style>
    canvas {
        display: block;
        inline-size: 100%;
        block-size: 100%;
        anchor-name: --canvas;
    }

    h2 {
        text-align: center;
        color: var(--clr-light-500);
        margin: 0;
        padding: 0;
        transform: rotate(-90deg);

        position: absolute;
        position-anchor: --canvas;
        left: calc(anchor(left) - 5em);

        @media (width <= 768px) {
            transform: rotate(0deg) translateX(-50%);
            left: 50%;
            bottom: calc(anchor(bottom) + 3em);
        }

        @media (width <= 500px) {
            transform: rotate(0deg) translateX(-50%);
            /* left: 50%; */
            bottom: calc(anchor(bottom) + 2em);
            line-height: 1;
            inline-size: 85%;
        }

        &.hidden {
            @media (orientation: landscape) and (pointer: coarse) {
                display: none;
            }
        }
    }
</style>
