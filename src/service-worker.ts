/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];
const CACHEABLE_ASSETS = ASSETS.filter(
    (asset) => !asset.endsWith('/.gitkeep') && !asset.endsWith('/.DS_Store'),
);

const sw = self as unknown as ServiceWorkerGlobalScope;

// Install service worker
sw.addEventListener('install', (event: ExtendableEvent) => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await Promise.allSettled(
            CACHEABLE_ASSETS.map(async (asset) => {
                try {
                    await cache.add(asset);
                } catch (error) {
                    console.warn(
                        '[service-worker] failed to cache asset',
                        asset,
                        error,
                    );
                }
            }),
        );
    }

    event.waitUntil(addFilesToCache());
    // Skip waiting so this SW activates immediately
    sw.skipWaiting();
});

// Activate service worker
sw.addEventListener('activate', (event: ExtendableEvent) => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) {
                await caches.delete(key);
            }
        }
    }

    async function claimClients() {
        await sw.clients.claim();
    }

    event.waitUntil(Promise.all([deleteOldCaches(), claimClients()]));
});

// fetch events
sw.addEventListener('fetch', (event: FetchEvent) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    const isCrossOrigin = url.origin !== sw.location.origin;

    // Don't let the SW handle API requests — let them go to the network
    if (url.pathname.startsWith('/api/')) {
        return;
    }
    const isCloudflareAnalytics =
        url.hostname.endsWith('cloudflareinsights.com') ||
        url.pathname.includes('beacon.min.js') ||
        url.pathname.startsWith('/cdn-cgi/');

    if (isCrossOrigin || isCloudflareAnalytics) {
        return;
    }

    async function respond(): Promise<Response> {
        const cache = await caches.open(CACHE);

        // Navigation requests: prefer network (fresh HTML/CSS), fallback to cache
        const acceptHeader = event.request.headers.get('accept') || '';
        const isNavigation =
            event.request.mode === 'navigate' ||
            acceptHeader.includes('text/html');
        if (isNavigation) {
            try {
                const response = await fetch(event.request);
                const isHttp =
                    url.protocol === 'http:' || url.protocol === 'https:';
                const isSuccess = response && response.status === 200;
                if (isHttp && isSuccess) {
                    cache.put(event.request, response.clone());
                }

                return response;
            } catch {
                const fallback =
                    (await cache.match('/')) ||
                    (await cache.match('/index.html'));
                if (fallback) return fallback;
            }
        }

        // For static JS/CSS assets prefer network (keep styles/scripts fresh), fallback to cache
        const isStaticScriptOrStyle = /\.(?:css|js|mjs)$/i.test(url.pathname);
        if (isStaticScriptOrStyle && ASSETS.includes(url.pathname)) {
            try {
                const response = await fetch(event.request);
                const isHttp =
                    url.protocol === 'http:' || url.protocol === 'https:';
                const isSuccess = response && response.status === 200;
                if (isHttp && isSuccess) {
                    cache.put(event.request, response.clone());
                }

                return response;
            } catch {
                const cachedResponse = await cache.match(event.request);
                if (cachedResponse) return cachedResponse;
            }
        }

        // Serve other build files from cache first (images, fonts, etc.) for performance
        if (ASSETS.includes(url.pathname)) {
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        // Try network first
        try {
            const response = await fetch(event.request);
            const isHttp =
                url.protocol === 'http:' || url.protocol === 'https:';
            const isSuccess = response.status === 200;

            if (isHttp && isSuccess) {
                cache.put(event.request, response.clone());
            }

            return response;
        } catch {
            // Cache fallback
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        return new Response('Not found', { status: 404 });
    }

    event.respondWith(respond());
});

// Listen for messages (e.g., skip waiting)
sw.addEventListener('message', (event: ExtendableMessageEvent) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        sw.skipWaiting();
    }
});
