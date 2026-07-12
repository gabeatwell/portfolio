<script lang="ts">
    import { gsap } from '$lib/data/gsap';
    import { getPreloaderState } from '$lib/data/stores/preloadStore.svelte';

    let preloaderVisible: boolean = $state<boolean>(true);
    let preloaderElement = $state<HTMLElement>();
    let lines = $state<HTMLElement[]>([]);
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

    // gsap
    $effect(() => {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: reduce)', () => {
            gsap.set('.preloader', {
                zIndex: 2147483647,
            });

            const validLines = lines.filter(
                (line) => line !== undefined && line !== null,
            );

            if (validLines.length !== 10 || !preloaderElement) return;

            gsap.set(validLines, { scaleX: 0 });
            gsap.set(preloaderElement, { opacity: 0, pointerEvents: 'none' });

            preloaderVisible = false;
            preloaderState.done = true;

            return () => {
                // cleanup
            };
        });

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.set('.preloader', {
                zIndex: 2147483647,
            });

            const validLines = lines.filter(
                (line) => line !== undefined && line !== null,
            );
            if (validLines.length !== 10 || !preloaderElement) return;

            const tl = gsap.timeline();

            // each line from right to left
            tl.to(validLines, {
                duration: 1.3,
                scaleX: 0,
                transformOrigin: 'right',
                stagger: 0.1,
                ease: 'power3.inOut',
            });

            // fade out the entire preloader
            tl.to(
                preloaderElement,
                {
                    duration: 0.5,
                    opacity: 0,
                    pointerEvents: 'none',
                    onComplete: () => {
                        preloaderVisible = false;
                        preloaderState.done = true;
                    },
                },
                '-=0.3',
            );

            return () => {
                tl.kill();
            };
        });

        return () => mm.revert();
    });
</script>

{#if preloaderVisible}
    <div
        use:portal
        bind:this={preloaderElement}
        class="preloader"
        id="preloader"
    >
        {#each Array(10) as _, i}
            <div bind:this={lines[i]} class="preloader-line"></div>
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
