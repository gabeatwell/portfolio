<script lang="ts">
    import { setupTunnel } from './threejs.svelte';
</script>

<canvas class="webgl" {@attach setupTunnel}></canvas>

<style>
    .webgl {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        min-height: 100vh;
        max-inline-size: 100vw;
        display: block;
        background: transparent;
    }
</style>
