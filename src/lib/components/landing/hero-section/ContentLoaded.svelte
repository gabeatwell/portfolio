<script lang="ts">
    import { gsap } from '$lib/data/gsap';

    let sections = $state<HTMLElement[]>([]);
    let loader = $state<HTMLElement | null>(null);
    let done = $state(false);

    $effect(() => {
        if (!sections.length || !loader) return;

        gsap.set(sections, { yPercent: 0 });

        sections.forEach((section) => {
            const randomDelay = 0.3 + Math.random() * 0.5;

            gsap.to(section, {
                yPercent: -100,
                duration: 1,
                delay: randomDelay,
                ease: 'back.in(1.55)',
                onComplete: () => {
                    if (section === sections[sections.length - 1]) {
                        done = true;
                    }
                },
            });
        });
    });
</script>

{#if !done}
    <main class="content-loader" bind:this={loader} aria-hidden="true">
        {#each ['A', 'B', 'C', 'D'] as _, i}
            <div class="section" bind:this={sections[i]}></div>
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
