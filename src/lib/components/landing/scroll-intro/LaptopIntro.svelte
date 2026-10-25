<script lang="ts">
    import { laptopScene } from '#lib/components/landing/scroll-intro/laptopReveal.js';
    import type { Attachment } from 'svelte/attachments';
    import { prefersReducedMotion } from '#lib/data/reduced-motion.svelte.ts';
    import Hero from '#lib/components/landing/hero-section/hero/Hero.svelte';

    let { image, onComplete }: { image: string; onComplete: () => void } =
        $props();
    let reduce = prefersReducedMotion();

    const intro: Attachment<HTMLElement> = (node) =>
        laptopScene(node, onComplete, image);

    $effect(() => {
        if (reduce()) return;

        document.documentElement.classList.add('dark-intro-page');
        return () =>
            document.documentElement.classList.remove('dark-intro-page');
    });
</script>

{#if reduce()}
    <Hero />
{:else}
    <section class="intro" {@attach intro}>
        <div class="welcome-title">
            <!-- <h2></h2> -->
        </div>
    </section>
{/if}

<style>
    :global(html.dark-intro-page nav.navigation) {
        display: none;
    }

    .intro {
        position: relative;
        width: 100%;
        height: 100vh;
        height: 100dvh;
        overflow: hidden;

        background-image: url('https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/abstract-bg3a.webp');
        background-repeat: no-repeat;
        background-size: cover;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto 1fr;

        & .welcome-title {
            grid-column: 1 / -1;
            grid-row: 1 / 2;
            display: flex;
            justify-content: center;
            align-items: center;

            anchor-name: --welcome-title;
        }
    }

    :global(html.dark-intro-page nav.navigation .nav-link) {
        --clr-light-500: #0a0a0a;
        --clr-light-400: rgba(10, 10, 10, 0.9);
    }
    :global(html.dark-intro-page nav.navigation .mobile .nav-link) {
        --clr-light-500: oklch(94.395% 0.00537 16.154);
        --clr-light-400: oklch(74.395% 0.00537 16.154);
    }
</style>
