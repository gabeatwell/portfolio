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
    title="Handcrafted Frontend Experiences"
    description="Gabriel Atwell's Portfolio"
    keywords="gabriel atwell, gabe atwell, atwell, atwell dev, atwell.dev, atwell ui, atwell ui design, gabeatwell, Las Vegas web design, Las Vegas UI designer, Las Vegas frontend developer, website designer Las Vegas, web designer Las Vegas, custom web design Las Vegas, Svelte developer Las Vegas, GSAP developer Las Vegas, Three.js developer Las Vegas, frontend developer Las Vegas, GSAP animation developer Las Vegas, custom animated websites Las Vegas, Handcrafted frontend experiences"
/>

{#if Hero && TeethIntro}
    <TeethIntro>
        <Hero cssBg={'random'} />
    </TeethIntro>
{/if}
