<script lang="ts">
    import type { Component } from 'svelte';
    import SEO from '$lib/data/SEO.svelte';

    let Hero = $state<Component<any> | null>(null);
    // let PanelSlider = $state<Component<any> | null>(null);
    let TeethIntro = $state<Component<any> | null>(null);
    let loaded = $state<boolean>(false);

    $effect(() => {
        if (!loaded) {
            loaded = true;

            import('$lib/components/landing/hero-section/hero/Hero.svelte').then(
                (module) => {
                    Hero = module.default;
                },
            );
            // import('$lib/components/landing/hero-section/PanelSlider.svelte').then(
            //     (module) => {
            //         PanelSlider = module.default;
            //     },
            // );
            import('$lib/components/landing/hero-section/TeethIntro.svelte').then(
                (module) => {
                    TeethIntro = module.default;
                },
            );
        }
    });
</script>

<SEO
    title="Welcome to Gabe Atwell's Portfolio"
    description="Gabriel Atwell's Portfolio"
    keywords="gabriel atwell, gabe atwell, web designer,atwell design, atwell ui, atwell dev, gabe atwell portfolio, las vegas web designer, las vegas web developer, atwell ui/ux design, custom web design services, las vegas custom web design, las vegas ui/ux design, las vegas website development, atwell, gabe"
/>

{#if Hero && TeethIntro}
    <TeethIntro>
        <Hero cssBg={'random'} />
    </TeethIntro>
{/if}
