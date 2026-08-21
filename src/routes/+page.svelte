<script lang="ts">
    import type { Component } from 'svelte';
    import SEO from '$lib/data/SEO.svelte';

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

            isTeeth = Math.random() < 0.5;
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
    });
</script>

<SEO
    title="Handcrafted Frontend Experiences"
    description="Gabriel Atwell's Portfolio"
    keywords="gabriel atwell, gabe atwell, atwell, atwell dev, atwell.dev, atwell ui, atwell ui design, gabeatwell, Las Vegas web design, Las Vegas UI designer, Las Vegas frontend developer, website designer Las Vegas, web designer Las Vegas, custom web design Las Vegas, Svelte developer Las Vegas, GSAP developer Las Vegas, Three.js developer Las Vegas, frontend developer Las Vegas, GSAP animation developer Las Vegas, custom animated websites Las Vegas, Handcrafted frontend experiences"
/>

{#if showHero}
    {#if Hero}
        <Hero cssBg={'random'} />
    {/if}
{:else if Intro}
    <Intro
        onComplete={() => {
            showHero = true;
            window.scrollTo(0, 0);
        }}
    >
        {#if isTeeth}
            {#if Hero}
                <Hero cssBg={'random'} />
            {/if}
        {:else}
            <img
                src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/website.webp"
                alt="Preview of the atwell.dev homepage"
                draggable="false"
                style="width:100%; height:100%; object-fit:cover;"
            />
        {/if}
    </Intro>
{/if}
