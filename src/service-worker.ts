/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];
const CACHEABLE_ASSETS = ASSETS.filter(
    (asset) => !asset.endsWith('/.gitkeep') && !asset.endsWith('/.DS_Store'),
);

const sw = self as unknown as ServiceWorkerGlobalScope;

// install service worker - cache build assets then activate
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
});

// activate service worker
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

    // let the API requests go to the network
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

        const acceptHeader = event.request.headers.get('accept') || '';
        const isNavigation =
            event.request.mode === 'navigate' ||
            acceptHeader.includes('text/html');

        // navigation stale while revalidate
        // serve cache page instantly - refresh in bg
        if (isNavigation) {
            const cached = await cache.match(event.request);
            const freshening = fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                })
                .catch(() => null);

            if (cached) return cached;

            try {
                const response = await freshening;
                if (response) return response;
            } catch {
                // fall through
            }

            const fallback =
                (await cache.match('/')) || (await cache.match('/index.html'));
            if (fallback) return fallback;

            return new Response('Offline', { status: 503 });
        }

        // static JS/CSS: prefer network (keep styles/scripts fresh), fallback to cache
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

        // other build files from cache first (images, fonts, etc.) for performance
        if (ASSETS.includes(url.pathname)) {
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        // everything else network first, cache fallback
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
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        return new Response('Not found', { status: 404 });
    }

    event.respondWith(respond());
});

// listen for messages (e.g., skip waiting)
sw.addEventListener('message', (event: ExtendableMessageEvent) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        sw.skipWaiting();
    }
});
