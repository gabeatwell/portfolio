<script lang="ts">
    import { browser } from '$app/environment';
    import type { Component } from 'svelte';
    import SEO from '$lib/data/SEO.svelte';
    import HeroContent from '$lib/components/landing/hero-section/hero/HeroContent.svelte';

    type SvelteModule = { default: Component };

    let Intro = $state<Component<any> | null>(null);
    let Hero = $state<Component<any> | null>(null);
    let isTeeth = $state(false);
    let showHero = $state(false);
    let loaded = $state<boolean>(false);

    const intros = import.meta.glob([
        '/src/lib/components/landing/hero-section/TeethIntro.svelte',
        '/src/lib/components/landing/video-intro/LaptopIntro.svelte',
    ]);

    $effect(() => {
        if (!loaded) {
            loaded = true;

            isTeeth = Math.random() < 0.75;
            const path = isTeeth
                ? '/src/lib/components/landing/hero-section/TeethIntro.svelte'
                : '/src/lib/components/landing/video-intro/LaptopIntro.svelte';

            intros[path]().then((module) => {
                Intro = (module as SvelteModule).default;
            });
        }
    });

    // load Hero when TeethIntro is chosen, or after the laptop intro completes
    $effect(() => {
        if ((isTeeth || showHero) && !Hero) {
            import('$lib/components/landing/hero-section/hero/Hero.svelte').then(
                (module) => {
                    Hero = (module as SvelteModule).default;
                },
            );
        }

        if (showHero) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => window.scrollTo(0, 0));
            });
        }
    });
</script>

<SEO
    title="Handcrafted Frontend Experiences"
    description="Gabriel Atwell's Portfolio"
    keywords="gabriel atwell, gabe atwell, atwell, atwell dev, atwell.dev, atwell ui, atwell ui design, gabeatwell, Las Vegas web design, Las Vegas UI designer, Las Vegas frontend developer, website designer Las Vegas, web designer Las Vegas, custom web design Las Vegas, Svelte developer Las Vegas, GSAP developer Las Vegas, Three.js developer Las Vegas, frontend developer Las Vegas, GSAP animation developer Las Vegas, custom animated websites Las Vegas, Handcrafted frontend experiences"
/>

<!-- static version -->
{#if !browser}
    <div class="ssr-hero-wrapper" role="banner" aria-label="hero section">
        <HeroContent selectedBg={false} />
    </div>
{/if}

<!-- js version -->
{#if showHero}
    {#if Hero}
        <Hero cssBg={'random'} />
    {/if}
{:else if Intro}
    {#if isTeeth}
        <Intro
            onComplete={() => {
                showHero = true;
                window.scrollTo(0, 0);
            }}
        >
            {#if Hero}
                <Hero cssBg={'random'} />
            {/if}
        </Intro>
    {:else}
        <Intro
            image="/images/website.webp"
            onComplete={() => {
                showHero = true;
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
