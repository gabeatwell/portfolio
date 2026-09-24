<script lang="ts">
    import '../app.css';
    import '@picocss/pico/css/pico.min.css';
    import type { Snippet } from 'svelte';
    import { createLoadingContext } from '$lib/data/context/loading.svelte';
    import { createThemeContext } from '$lib/data/context/theme.svelte';
    import NavBar from '$lib/components/navigation/NavBar.svelte';
    import Footer from '$lib/components/navigation/Footer.svelte';
    import Loading from '$lib/components/layout/loading/Loading.svelte';
    import TestLink from '$lib/components/navigation/TestLink.svelte';
    import SkipLink from '$lib/components/navigation/SkipLink.svelte';
    import ViewTransition from '$lib/components/layout/view-transitions/ViewTransition.svelte';
    import PullToRefresh from '$lib/data/PullToRefresh.svelte';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
    const loading = createLoadingContext();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const theme = createThemeContext();
    let SkipLinkComponent = $state<any>(null);
    let TestLinkComponent = $state<any>(null);
    let mounted = $state(false);

    // service worker
    $effect(() => {
        if (typeof window === 'undefined') return;

        const abortController = new AbortController();
        let heartbeat: ReturnType<typeof setInterval> | undefined;

        // The worker stays dormant (pure network passthrough, nothing
        // precached) until a page with running JavaScript identifies itself.
        function reportJsActive() {
            navigator.serviceWorker.controller?.postMessage({
                type: 'JS_ENABLED',
            });
        }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener(
                'controllerchange',
                reportJsActive,
                { signal: abortController.signal },
            );
            navigator.serviceWorker.ready.then(reportJsActive, () => {
                /* no controller yet: `controllerchange` covers it */
            });

            // Heartbeat. Keeps the worker awake while JS is really running; if
            // JavaScript is switched off the pings stop and the worker falls
            // back to dormant (network-only) after its TTL expires.
            heartbeat = setInterval(reportJsActive, 60_000);
            document.addEventListener(
                'visibilitychange',
                () => {
                    if (!document.hidden) reportJsActive();
                },
                { signal: abortController.signal },
            );

            navigator.serviceWorker
                .register('/service-worker.js', { type: 'module' })
                .then((registration) => {
                    registration.addEventListener(
                        'updatefound',
                        () => {
                            const newWorker = registration.installing;
                            if (newWorker) {
                                newWorker.addEventListener(
                                    'statechange',
                                    () => {
                                        if (
                                            newWorker &&
                                            newWorker.state === 'installed' &&
                                            navigator.serviceWorker.controller
                                        ) {
                                            newWorker.postMessage({
                                                type: 'SKIP_WAITING',
                                            });
                                        }
                                    },
                                    { signal: abortController.signal },
                                );
                            }
                        },
                        { signal: abortController.signal },
                    );
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }

        return () => {
            clearInterval(heartbeat);
            abortController.abort();
        };
    });

    $effect(() => {
        mounted = true;
        if (typeof window !== 'undefined') {
            loading.isLoaded = true;
        }
    });
</script>

<svelte:head>
    <meta name="color-scheme" content="light dark" />
</svelte:head>

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
