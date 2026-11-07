<script lang="ts">
    import { laptopScene } from '#lib/components/landing/scroll-intro/laptopReveal.js';
    import type { Attachment } from 'svelte/attachments';
    import { prefersReducedMotion } from '#lib/data/reduced-motion.svelte.ts';
    import Hero from '#lib/components/landing/hero-section/hero/Hero.svelte';
    import { getBreakpoints } from '#lib/data/stores/breakpoints.svelte.ts';

    let {
        image,
        onComplete,
        title,
    }: { image: string; onComplete: () => void; title: string } = $props();
    let reduce = prefersReducedMotion();
    let skipped = false;

    const breakpoints = getBreakpoints();
    const showSkipButton = $derived(
        breakpoints.isMobile || breakpoints.isTablet,
    );

    function skip() {
        if (skipped) return;
        skipped = true;
        onComplete();
    }

    const intro: Attachment<HTMLElement> = (node) =>
        laptopScene(node, onComplete, image);

    $effect(() => {
        if (reduce()) return;

        document.documentElement.classList.add('dark-intro-page');
        return () =>
            document.documentElement.classList.remove('dark-intro-page');
    });

    // skip intro
    $effect(() => {
        if (reduce()) return;

        const onKeydown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') skip();
        };

        window.addEventListener('keydown', onKeydown);
        return () => window.removeEventListener('keydown', onKeydown);
    });
</script>

{#if reduce()}
    <Hero />
{:else}
    <section class="intro" {@attach intro}>
        {#if showSkipButton}
            <button class="skip-button" onclick={skip}>{title}</button>
        {:else}
            <div class="welcome-title">
                <p class="skip-hint">Press <kbd>Esc</kbd> to skip</p>
            </div>
        {/if}
    </section>
{/if}

<style>
    :global(html.dark-intro-page nav.navigation) {
        display: none;
    }

    .intro {
        position: relative;
        inline-size: 100%;
        block-size: 100vh;
        block-size: 100dvh;
        overflow: hidden;

        background-image: url('https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@assets-1/images/abstract-bg3a.webp');
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

            & .skip-hint {
                color: var(--clr-dark-500);
                font-family: var(--thunder);
                font-size: clamp(var(--h5), 2.3vw, var(--h4));
                font-weight: 200;
                text-transform: uppercase;

                display: inline-flex;
                align-items: center;
                gap: 0.45em;
                margin: 0;

                & kbd {
                    font: inherit;
                    text-transform: none;
                    padding: 0.15em 0.25em;
                    border: 1px solid oklch(1 0 0 / 90%);
                    border-block-end-width: 2px;
                    border-radius: 0.35em;
                    background-color: oklch(1 0 0 / 30%);
                    color: inherit;
                }
            }
        }

        & .skip-button {
            --clr-light-500-fade: oklch(from var(--clr-light-500) l c h / 0.43);
            position: absolute;
            z-index: 3;
            inset-inline: 0;
            inset-block-start: calc(1.25em + env(safe-area-inset-top, 0px));
            margin-inline: auto;
            inline-size: fit-content;

            display: inline-flex;
            justify-content: center;
            align-items: center;
            min-inline-size: 2.75rem;
            min-block-size: 2.75rem;
            padding: var(--padding-button);

            border: 1px solid var(--clr-dark-500);
            background: var(--clr-light-500-fade);
            font: inherit;
            font-size: clamp(var(--sm), 0.9vw, var(--h6));
            font-weight: 500;
            cursor: pointer;
            touch-action: manipulation;
            transition:
                background-color 180ms ease,
                border-color 180ms ease,
                transform 120ms ease;

            &:active {
                transform: scale(0.97);
                text-decoration: underline;
            }

            &:focus-visible {
                outline: 2px solid var(--clr-light-500);
                outline-offset: 3px;
            }
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
