<script lang="ts">
    import { aboutHeroParallax } from '$lib/attachments/gsap/aboutHeroParallax';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';

    const breakpoints = getBreakpoints();
</script>

<section
    class="parallax-wrapper"
    {@attach aboutHeroParallax(undefined, breakpoints.isReduced)}
>
    <div
        class="layer background"
        style="background-image: url('https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/svelte-magick_background.webp');"
    ></div>

    <div
        class="layer middle"
        style="background-image: url('https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/svelte-magick_middle.webp');"
    ></div>

    <div
        class="layer foreground"
        style="background-image: url('https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/svelte-magick_foreground.webp');"
    ></div>
</section>

<style>
    .parallax-wrapper {
        position: relative;
        inline-size: 100%;
        block-size: 100vh;
        overflow: clip;
        mask: linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 60%, transparent);

        & .layer {
            position: absolute;
            inset: 0;
            inline-size: 100%;
            block-size: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            will-change: transform;
            pointer-events: none;

            &.background {
                z-index: 1;
            }
            &.middle {
                z-index: 2;
            }
            &.foreground {
                z-index: 3;
            }
        }
    }
</style>
