<script lang="ts">
    import { getPreloaderState } from '$lib/data/stores/preloadStore.svelte';
    import { preloader } from '$lib/attachments/gsap/preloader';

    let preloaderVisible: boolean = $state<boolean>(true);
    const preloaderState = getPreloaderState();

    function portal(node: HTMLElement) {
        const host = document.body;
        host.appendChild(node);

        return {
            destroy() {
                if (host.contains(node)) host.removeChild(node);
            },
        };
    }

    function handlePreloaderComplete() {
        preloaderVisible = false;
        preloaderState.done = true;
    }
</script>

{#if preloaderVisible}
    <div
        use:portal
        {@attach preloader({ onComplete: handlePreloaderComplete })}
        class="preloader"
        id="preloader"
    >
        {#each Array(10) as _, i}
            <div class="preloader-line"></div>
        {/each}
    </div>
{/if}

<style>
    .preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;

        transform: translateZ(0);
        isolation: isolate;
        background: var(--clr-dark-500, #fff);

        & .preloader-line {
            flex: 1;
            height: 100vh;
            background-color: var(--clr-dark-400);
            transform-origin: right;
        }
    }
</style>
