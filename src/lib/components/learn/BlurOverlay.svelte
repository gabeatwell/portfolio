<script lang="ts">
    import { tick } from 'svelte';
    import { gsap } from '$lib/data/gsap';

    let element = $state<HTMLElement | undefined>();
    let active = $state(true);

    // grid
    const COLS = 4;
    const ROWS = 4;
    const TILE_COUNT = COLS * ROWS;
    let tileElements = $state<HTMLDivElement[]>([]);

    function shuffle(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    $effect(() => {
        const mm = gsap.matchMedia();

        if (!element || !active) return;

        tileElements = new Array(TILE_COUNT);

        const order = shuffle(Array.from({ length: TILE_COUNT }, (_, i) => i));
        let cleanup: (() => void) | null = null;

        mm.add('(prefers-reduced-motion: reduce)', () => {
            tick().then(() => {
                tileElements = Array.from(
                    element!.querySelectorAll<HTMLDivElement>('.tile'),
                );
                gsap.set(tileElements, { opacity: 0 });
                active = false;
            });

            return () => {
                // cleanup
            };
        });

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            tick().then(() => {
                tileElements = Array.from(
                    element!.querySelectorAll<HTMLDivElement>('.tile'),
                );

                const nodes = order.map((i) => tileElements[i]).filter(Boolean);

                const ctx = gsap.context(() => {
                    gsap.to(nodes, {
                        opacity: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power2.out',
                        onComplete: () => {
                            active = false;
                        },
                    });
                }, element);

                cleanup = () => ctx.revert();
            });

            return () => {
                if (cleanup) cleanup();
            };
        });

        return () => mm.revert();
    });
</script>

{#if active}
    <div class="blur-overlay" bind:this={element}>
        {#each Array(TILE_COUNT) as _, i}
            <div class="tile" data-idx={i} aria-hidden="true"></div>
        {/each}
    </div>
{/if}

<style>
    .blur-overlay {
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
