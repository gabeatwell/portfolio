<script lang="ts">
    import type { Component } from 'svelte';
    import SEO from '$lib/data/SEO.svelte';

    let Hero = $state<Component | null>(null);
    let ContentLoaded = $state<Component | null>(null);
    let loaded = $state<boolean>(false);

    $effect(() => {
        if (!loaded) {
            loaded = true;

            import('$lib/components/landing/hero-section/hero/Hero.svelte').then(
                (module) => {
                    Hero = module.default;
                },
            );
            import('$lib/components/landing/hero-section/ContentLoaded.svelte').then(
                (module) => {
                    ContentLoaded = module.default;
                },
            );
        }
    });
</script>

<SEO
    title="Welcome to Gabe Atwell's Portfolio"
    description="Gabriel Atwell's Portfolio"
    keywords="gabriel atwell frontend developer, gabe atwell frontend developer, gabriel atwell web designer, gabe atwell web designer, atwell design, atwell ui, atwell dev, atwell.dev gabriel atwell portfolio, gabe atwell portfolio, las vegas web designer, las vegas web developer, responsive website development, user-centered ui/ux design, custom web design services, las vegas custom web design, las vegas responsive web design, las vegas user-centered design, las vegas ui/ux design, las vegas website development, las vegas web development services, las vegas frontend development, las vegas frontend developer, las vegas web designer and developer, atwell, gabe"
/>

{#if Hero}
    <Hero cssBg={'random'} />
{/if}

{#if ContentLoaded}
    <ContentLoaded />
{/if}
