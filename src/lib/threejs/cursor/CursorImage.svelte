<script lang="ts">
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte.js';
    import { setupCursorScene } from './threejs.svelte';
    import { attachMobileLandscape } from '$lib/attachments/threejs/attachMobileLandscape';

    const breakpoints = getBreakpoints();
</script>

<canvas
    {@attach setupCursorScene}
    {@attach attachMobileLandscape({
        isLandscapeMobile: breakpoints.isLandscape && breakpoints.isMobile,
        hideFooterAlways: true,
    })}
    class="webgl"
></canvas>

<style>
    .webgl {
        position: fixed;
        top: 0;
        left: 0;
        outline: none;
    }
</style>
