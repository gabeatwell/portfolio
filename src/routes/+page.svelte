<script lang="ts">
    import { browser } from '$app/environment';
    import { tick, type Component } from 'svelte';
    import SEO from '$lib/data/SEO.svelte';
    import Hero from '$lib/components/landing/hero-section/hero/Hero.svelte';
    import HeroContent from '$lib/components/landing/hero-section/hero/HeroContent.svelte';

    type SvelteModule = { default: Component };

    let Intro = $state<Component<any> | null>(null);
    let showHero = $state(false);

    $effect(() => {
        import('$lib/components/landing/scroll-intro/LaptopIntro.svelte').then(
            (module) => {
                Intro = (module as SvelteModule).default;
            },
        );
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

<!-- ts version -->
{#if showHero}
    {#if Hero}
        <Hero cssBg={'random'} />
    {/if}
{:else if Intro}
    <Intro
        image="/images/website.webp"
        onComplete={async () => {
            showHero = true;
            await tick();
            window.scrollTo(0, 0);
        }}
    />
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
