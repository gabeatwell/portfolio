import { dev } from '$app/env';

export function initServiceWorker(): void {
    $effect(() => {
        if (!('serviceWorker' in navigator)) return;

        if (dev) {
            void (async () => {
                const registrations =
                    await navigator.serviceWorker.getRegistrations();
                if (registrations.length === 0) return;

                await Promise.all(
                    registrations.map((registration) =>
                        registration.unregister(),
                    ),
                );

                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map((key) => caches.delete(key)));
                }

                // An unregistered worker keeps controlling this document
                // until the next navigation.
                const guard = 'dev:sw-unregistered';
                if (
                    navigator.serviceWorker.controller &&
                    !sessionStorage.getItem(guard)
                ) {
                    sessionStorage.setItem(guard, '1');
                    location.reload();
                }
            })();

            return;
        }

        const abortController = new AbortController();
        let heartbeat: ReturnType<typeof setInterval> | undefined;

        // The worker stays dormant (pure network passthrough, nothing
        // precached) until a page with running JavaScript identifies itself.
        function reportJsActive() {
            navigator.serviceWorker.controller?.postMessage({
                type: 'JS_ENABLED',
            });
        }

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

        return () => {
            clearInterval(heartbeat);
            abortController.abort();
        };
    });
}
