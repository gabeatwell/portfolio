<script lang="ts">
    import { setupRibbons } from './threejs.svelte';
</script>

<canvas class="ribbons" {@attach setupRibbons} aria-hidden="true"></canvas>

<style>
    .ribbons {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 0;
        inline-size: 100vw;
        block-size: 100vh;
        background: var(--clr-dark-500);
    }
</style>
