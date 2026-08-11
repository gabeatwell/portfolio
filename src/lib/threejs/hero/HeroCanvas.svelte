<script lang="ts">
    import HeroTitle from '$lib/components/landing/hero-section/hero/HeroTitle.svelte';
    import Button from '$lib/components/layout/Button.svelte';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';
    import { setupHeroCanvas } from './threejs.svelte';

    const breakpoints = getBreakpoints();

    $effect(() => {
        const footer = document.querySelector('footer') as HTMLElement | null;
        const nav = document.querySelector('.navigation') as HTMLElement | null;
        const select = document.querySelector('.select') as HTMLElement | null;
        const heroContent = document.querySelector(
            '.hero-content',
        ) as HTMLElement | null;
        const isLandscapeMobile =
            breakpoints.isLandscape && breakpoints.isMobile;

        if (nav) nav.style.display = isLandscapeMobile ? 'none' : '';
        if (select) select.style.display = isLandscapeMobile ? 'none' : '';
        if (footer) footer.style.display = isLandscapeMobile ? 'none' : '';
        if (heroContent)
            heroContent.style.overflowY = isLandscapeMobile ? 'auto' : '';

        return () => {
            if (footer) footer.style.display = '';
            if (nav) nav.style.display = '';
            if (select) select.style.display = '';
            if (heroContent) heroContent.style.overflowY = '';
        };
    });
</script>

<canvas class="webgl" aria-label="hero" {@attach setupHeroCanvas}></canvas>

<section aria-label="hero" class="hero-content">
    <HeroTitle title="Frontend Crafted Web Experiences" />

    <h4 class="summary">
        I am a frontend developer who loves to create beautiful and functional
        websites. This website showcases my skills with some projects that I
        created. I look forward to hearing from you so we can discuss your goals
        for your online needs!
    </h4>

    <div class="button-wrapper">
        <Button href="/projects" title="Creations" />
    </div>
</section>

<style>
    .webgl {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        min-block-size: 100svh;
        max-inline-size: 100vw;
        display: block;
        background: transparent;
    }

    .hero-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 100%;
        max-inline-size: 1200px;
        padding: 2rem;
        min-height: 60vh;
        backdrop-filter: blur(1px);
        border-radius: 12px;
        margin-top: 2.5em;
        user-select: none;

        @media (width <= 768px) {
            padding: 1rem;
            min-height: 50vh;
        }

        & > * {
            contain: layout;
        }

        & :global(h1) {
            min-height: 3rem;
        }

        & :global(button) {
            min-height: 2.5rem;
            min-width: 8rem;
        }

        & .summary {
            color: var(--clr-light-500);
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 2vw, var(--h5));
            font-weight: 400;
            line-height: 1.6;
            letter-spacing: 1px;
            max-inline-size: 600px;
            margin: 1.5rem auto;
            text-align: start;
            min-height: 3rem;

            @media (width >= 990px) {
                letter-spacing: 2px;
                max-inline-size: 90%;
            }

            @media (width <= 768px) {
                text-align: center;
                font-size: clamp(var(--xs), 4vw, var(--sm));
            }
        }

        & .button-wrapper {
            margin-top: 2rem;
            min-height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .hero-content {
            backdrop-filter: none;
            transition: none;
        }
    }

    @media (orientation: landscape) and (max-width: 767px) {
        .hero-content {
            overflow-y: auto !important;
            max-block-size: 100vh;
        }
    }
</style>
