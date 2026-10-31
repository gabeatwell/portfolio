<script lang="ts">
    import { setupTitleText } from './examplesTitle';

    let { text = 'Examples' }: { text?: string } = $props();
</script>

<canvas
    class="title-canvas"
    aria-label={text}
    {@attach setupTitleText({ text })}
></canvas>

<style>
    .title-canvas {
        display: block;
        inline-size: min(92vw, 990px);
        block-size: clamp(180px, 34svh, 408px);
    }
</style>
