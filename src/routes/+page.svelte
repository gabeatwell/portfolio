<script lang="ts">
    import type { Component } from 'svelte';
    import SEO from '$lib/data/SEO.svelte';

    type SvelteModule = { default: Component };

    let Intro = $state<Component<any> | null>(null);
    let Hero = $state<Component<any> | null>(null);
    let isTeeth = $state(false);
    let showHero = $state(false);
    let loaded = $state<boolean>(false);
    let enhanced = $state(false);

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

        if (Intro || Hero) enhanced = true;
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
{#if !enhanced}
    <section class="ssr-fallback" aria-label="Introduction">
        <h1>Handcrafted Frontend Experiences</h1>
        <p>
            I am a frontend developer who loves to create beautiful and
            functional websites. This site showcases projects and experiments.
        </p>

        <nav class="ssr-nav">
            <a href="/about">About</a>
            <a href="/projects">Builds</a>
            <a href="/learn">Learn</a>
            <a href="/contact">Contact</a>
        </nav>
    </section>
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
    .ssr-fallback {
        padding: 4rem 1.5rem;
        text-align: center;
        max-inline-size: 60vw;
        margin-inline: auto;

        & h1 {
            font-family: var(--ultra);
            font-size: clamp(var(--h4), 9vw, var(--xl));
            color: #eee;
            margin-bottom: 1rem;
            line-height: 1;
            margin-top: 1em;
            margin-bottom: 0.5em;
        }

        & p {
            color: #aeaeae;
            font-family: var(--bronova);
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        & .ssr-nav {
            & a {
                color: #7a6425;
                text-decoration: none;
                font-family: var(--bronova-bold);
                font-size: clamp(var(--h6), 4vw, var(--h4));
                font-weight: 500;

                &:hover {
                    text-decoration: underline;
                    text-underline-offset: 0.25rem;
                }
            }
        }
    }
</style>
