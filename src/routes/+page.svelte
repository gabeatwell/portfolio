<script lang="ts">
    import { tick, type Component } from 'svelte';
    import SEO from '#lib/data/SEO.svelte';
    import Hero from '#lib/components/landing/hero-section/hero/Hero.svelte';
    import HeroContent from '#lib/components/landing/hero-section/hero/HeroContent.svelte';
    import { browser } from '$app/env';
    import {
        hasPlayedThisSession,
        markPlayedThisSession,
    } from '#lib/data/session.ts';

    type IntroProps = {
        image: string;
        onComplete: () => void;
        title?: string;
    };

    type IntroModule = { default: Component<IntroProps> };

    const INTRO_KEY = 'langing-intro';
    let Intro = $state<Component<any> | null>(null);
    let showHero = $state(hasPlayedThisSession(INTRO_KEY));
    let isOffline = $state(false);

    $effect(() => {
        if (showHero) return;

        import('#lib/components/landing/scroll-intro/LaptopIntro.svelte')
            .then((module) => {
                Intro = (module as IntroModule).default;
            })
            .catch(() => {
                /* isOffline branch already shows the hero */
            });
    });

    $effect(() => {
        const set = () => (isOffline = !navigator.onLine);
        set();
        window.addEventListener('online', set);
        window.addEventListener('offline', set);
        return () => {
            window.removeEventListener('online', set);
            window.removeEventListener('offline', set);
        };
    });
</script>

<SEO
    title="Gabe Atwell - Designer & Developer"
    description="Gabe Atwell is a Las Vegas designer & frontend developer creating handcrafted interfaces, animations, and 3D experiences with SvelteKit, GSAP, and Three.js."
    keywords="gabe atwell, gabriel atwell, designer developer, frontend developer, web designer Las Vegas, Las Vegas web design, UI designer Las Vegas, Svelte developer, GSAP developer, Three.js developer, handcrafted frontend, custom web design Las Vegas, atwell.dev"
/>

{#if !browser || isOffline}
    <div class="ssr-hero-wrapper" role="banner" aria-label="hero section">
        <HeroContent selectedBg={false} />
    </div>
{:else}
    <!-- ts version -->
    {#if showHero}
        <Hero cssBg={'random'} />
    {:else if Intro}
        <Intro
            image="/images/website.webp"
            title="Enter Site"
            onComplete={async () => {
                markPlayedThisSession(INTRO_KEY);
                showHero = true;
                await tick();
                window.scrollTo(0, 0);
            }}
        />
    {/if}
{/if}

<style>
    .ssr-hero-wrapper {
        position: relative;
        min-block-size: 100svh;
        height: auto;
        overflow: clip;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 5rem 0 0 0;
        margin-top: 1.75em;
        font-size: clamp(var(--h6), 4vw, var(--h1));
        background-color: transparent;

        @media (height <= 768px) {
            min-height: auto;
            height: auto;
            padding: 1em 0 0 0;
            margin-top: 3.5em;
        }
    }
</style>
