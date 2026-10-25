<script lang="ts">
    import { tick, type Component } from 'svelte';
    import SEO from '#lib/data/SEO.svelte';
    import Hero from '#lib/components/landing/hero-section/hero/Hero.svelte';
    import HeroContent from '#lib/components/landing/hero-section/hero/HeroContent.svelte';
    import { browser } from '$app/env';

    type SvelteModule = { default: Component };

    let Intro = $state<Component<any> | null>(null);
    let showHero = $state(false);
    let isOffline = $state(false);

    $effect(() => {
        import('#lib/components/landing/scroll-intro/LaptopIntro.svelte')
            .then((module) => {
                Intro = (module as SvelteModule).default;
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
    title="Handcrafted Frontend Experiences"
    description="Gabriel Atwell's Portfolio - it shows his skills in building interfaces, making 3d animations, and telling stories."
    keywords="gabriel atwell, gabe atwell, atwell, atwell dev, atwell.dev, atwell ui, atwell ui design, gabeatwell, Las Vegas web design, Las Vegas UI designer, Las Vegas frontend developer, website designer Las Vegas, web designer Las Vegas, custom web design Las Vegas, Svelte developer Las Vegas, GSAP developer Las Vegas, Three.js developer Las Vegas, frontend developer Las Vegas, GSAP animation developer Las Vegas, custom animated websites Las Vegas, Handcrafted frontend experiences"
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
            onComplete={async () => {
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
