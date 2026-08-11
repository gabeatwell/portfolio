<script lang="ts">
    import { panelSlider } from '$lib/attachments/gsap/panelSlider';

    let done = $state(false);
</script>

{#if !done}
    <main
        class="content-loader"
        {@attach panelSlider(() => (done = true))}
        aria-hidden="true"
    >
        {#each ['A', 'B', 'C', 'D'] as _, i}
            <div class="section"></div>
        {/each}
    </main>
{/if}

<style>
    .content-loader {
        position: fixed;
        inset: 0;
        display: flex;
        z-index: 200;
        pointer-events: none;
        overflow: hidden;

        & .section {
            inline-size: 25vw;
            block-size: 100vh;
            background-color: var(--clr-dark-500);
            overflow: hidden;
            flex-shrink: 0;
            border: 2px solid var(--clr-light-500);
        }
    }
</style>
