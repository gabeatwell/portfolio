<script lang="ts">
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';
    import { setupEnvironment } from './threejs.svelte';

    const breakpoints = getBreakpoints();

    $effect(() => {
        const nav = document.querySelector('.navigation') as HTMLElement | null;
        const select = document.querySelector('.select') as HTMLElement | null;
        const footer = document.querySelector('footer') as HTMLElement | null;
        const isLandscapeMobile =
            breakpoints.isLandscape && breakpoints.isMobile;

        if (nav) nav.style.display = isLandscapeMobile ? 'none' : '';
        if (select) select.style.display = isLandscapeMobile ? 'none' : '';
        if (footer) footer.style.display = isLandscapeMobile ? 'none' : '';

        return () => {
            if (nav) nav.style.display = '';
            if (select) select.style.display = '';
            if (footer) footer.style.display = '';
        };
    });
</script>

<canvas class="webgl" {@attach setupEnvironment}></canvas>

<style>
    .webgl {
        position: fixed;
        top: 0;
        left: 0;
        outline: none;
    }
</style>
