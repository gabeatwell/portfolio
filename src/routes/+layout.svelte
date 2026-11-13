<script lang="ts">
    import '../app.css';
    import '@anyblades/blades';
    import '../override.css';
    import NavBar from '#lib/components/navigation/bar/NavBar.svelte';
    import Footer from '#lib/components/navigation/footer/Footer.svelte';
    import Loading from '#lib/components/layout/loading/Loading.svelte';
    import TestLink from '#lib/components/navigation/TestLink.svelte';
    import SkipLink from '#lib/components/navigation/SkipLink.svelte';
    import ViewTransition from '#lib/components/layout/view-transitions/ViewTransition.svelte';
    import PullToRefresh from '#lib/data/PullToRefresh.svelte';

    import type { Snippet } from 'svelte';
    import { createLoadingContext } from '#lib/data/context/loading.svelte.js';
    import { createThemeContext } from '#lib/data/context/theme.svelte.js';
    import { afterNavigate } from '$app/navigation';
    import { createLenis, destroyLenis, resetScroll } from '#lib/data/lenis.js';
    import { browser } from '$app/env';
    import { gsap, ScrollTrigger } from '#lib/data/gsap.js';
    import { headingFor } from '#lib/data/routeHeadings.js';
    import { page } from '$app/state';
    import { initServiceWorker } from '#lib/data/serviceWorker.svelte';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
    const loading = createLoadingContext();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = createThemeContext();
    const heading = $derived(headingFor(page.url.pathname) ?? 'atwell');
    let mounted = $state(false);

    initServiceWorker();

    $effect(() => {
        mounted = true;
        if (typeof window !== 'undefined') {
            loading.isLoaded = true;
        }
    });

    // lenis
    $effect(() => {
        if (!browser) return;

        const lenis = createLenis();
        lenis.on('scroll', ScrollTrigger.update);

        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            lenis.destroy();
        };
    });

    afterNavigate(({ shallow }) => {
        if (shallow) return;

        return resetScroll();
    });
</script>

<svelte:head><meta name="color-scheme" content="light dark" /></svelte:head>

<PullToRefresh />
<ViewTransition />
<SkipLink />
<TestLink title="experiments" />

<!-- loading animation -->
{#if mounted && !loading.isLoaded}
    <Loading />
{/if}

<NavBar />
<main tabindex="-1">
    <h1 class="visually-hidden">{heading}</h1>

    <div id="main-content" tabindex="-1">
        {@render children()}
    </div>
</main>
<Footer />

<style>
    :global(body) {
        inline-size: 100%;
        block-size: 100%;
        min-block-size: 100svh;
    }

    main {
        min-block-size: 100svh;
        inline-size: 100%;
        block-size: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        overflow-x: clip;
        opacity: 1;
        transition: opacity 0.3s ease-out;
    }

    #main-content {
        /* min-height: calc(100vh - 120px); */
        flex: 1;
        will-change: auto;
    }
</style>
