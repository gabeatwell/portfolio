<script lang="ts">
    import { tileIntro } from '$lib/attachments/gsap/tileIntro';

    let active = $state(true);
    const TILE_COUNT = 16;
</script>

{#if active}
    <div class="tile-intro" {@attach tileIntro(() => (active = false))}>
        {#each Array(TILE_COUNT) as _, i}
            <div class="tile" data-idx={i} aria-hidden="true"></div>
        {/each}
    </div>
{/if}

<style>
    .tile-intro {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 100;
        pointer-events: auto;

        display: grid;
        grid-template-columns: repeat(4, 25vw);
        grid-template-rows: repeat(4, 25vh);
        overflow: hidden;

        & .tile {
            inline-size: 25vw;
            block-size: 25vh;
            backdrop-filter: blur(10px);
            background: var(--clr-dark-200);
            box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.7);
            opacity: 1;
            will-change: opacity;
        }
    }
</style>
