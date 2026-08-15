<script lang="ts">
    import { attachMobileLandscape } from '$lib/attachments/threejs/attachMobileLandscape';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';
    import { setupPostProcess } from './threejs.svelte';

    const breakpoints = getBreakpoints();
</script>

<canvas
    class="webgl"
    {@attach setupPostProcess}
    {@attach attachMobileLandscape({
        isLandscapeMobile: breakpoints.isLandscape && breakpoints.isMobile,
    })}
></canvas>

<style>
    .webgl {
        position: fixed;
        top: 0;
        left: 0;
        outline: none;
    }
</style>
