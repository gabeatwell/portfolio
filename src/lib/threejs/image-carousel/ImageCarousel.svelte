<script lang="ts">
    import { initCarousel } from './threejs.svelte';
    import LandscapeMobile from '../shooter/components/LandscapeMobile.svelte';

    // eslint-disable-next-line no-unassigned-vars
    let isMobile = $state(
        typeof window !== 'undefined' &&
            ('ontouchstart' in window || navigator.maxTouchPoints > 0),
    );
</script>

<LandscapeMobile {isMobile} onPause={() => {}} onResume={() => {}} />

<h2 class:hidden={isMobile}>drag the images to move</h2>
<canvas {@attach initCarousel} class="canvas"></canvas>

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
