/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];
const CACHEABLE_ASSETS = ASSETS.filter(
    (asset) => !asset.endsWith('/.gitkeep') && !asset.endsWith('/.DS_Store'),
);

/**
 * Heavy payloads (3D models, HDR/EXR environment maps) are never precached —
 * they are hundreds of megabytes and would flood the network on install.
 * They still get cached at runtime the first time a page actually needs them.
 */
const HEAVY_ASSET = /^\/threejayess\/|\.(?:glb|gltf|exr|hdr|mp4|webm|zip)$/i;
const PRECACHEABLE_ASSETS = CACHEABLE_ASSETS.filter(
    (asset) => !HEAVY_ASSET.test(asset),
);

const sw = self as unknown as ServiceWorkerGlobalScope;

/**
 * The worker is dormant unless a page has told us JavaScript is running.
 *
 * A service worker cannot detect "JavaScript disabled" about its clients — it
 * runs in its own context, so a worker installed by an earlier JS-enabled
 * visit keeps intercepting fetches even after JS is switched off. Instead of
 * guessing, the page reports an active JS session (`JS_ENABLED`, refreshed by
 * a heartbeat) and we stamp the time. Once the heartbeat stops — because
 * JavaScript was switched off — the stamp goes stale within `ACTIVE_TTL` and
 * the worker passes every request straight to the network, behaving exactly as
 * if it were not installed: no precaching, no cache reads, no cache writes.
 */
const ACTIVE_TTL = 5 * 60 * 1000;
const STATE_CACHE = 'sw-js-state';
// `Cache.put` only accepts http(s) keys
const STAMP_URL = '/_app/sw-js-active';

/**
 * The stamp lives in a Cache API entry: service workers have no `localStorage`
 * (no DOM access), and this survives worker eviction between page loads.
 */
async function readStamp(): Promise<number> {
    try {
        const cache = await caches.open(STATE_CACHE);
        const match = await cache.match(STAMP_URL);
        return match ? Number(await match.text()) || 0 : 0;
    } catch {
        return 0;
    }
}

async function isJsActive(): Promise<boolean> {
    return Date.now() - (await readStamp()) < ACTIVE_TTL;
}

async function markJsActive(): Promise<void> {
    const cache = await caches.open(STATE_CACHE);
    await cache.put(STAMP_URL, new Response(String(Date.now())));
}

/** Precaches the light asset bundle at most once per build version. */
let precachedVersion: string | null = null;

async function precache(): Promise<void> {
    if (precachedVersion === version) return;
    precachedVersion = version;

    const cache = await caches.open(CACHE);
    await Promise.allSettled(
        PRECACHEABLE_ASSETS.map(async (asset) => {
            try {
                // Cheap no-op across worker restarts: only fetch what is missing.
                if (await cache.match(asset)) return;
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

async function precacheIfActive(): Promise<void> {
    if (await isJsActive()) await precache();
}

/**
 * Self-removal. A page with JavaScript disabled cannot call `unregister()` —
 * there is no declarative or header-based way to drop a worker — so the worker
 * retires *itself* once the heartbeat has been missing long enough to conclude
 * JS is off for real. The next JS-enabled visit re-registers it from
 * `+layout.svelte`, so it comes straight back.
 *
 * Only ever retires a worker that was activated at least once (a stamp exists);
 * a freshly installed worker on a first-ever load may not have received its
 * heartbeat yet, and must not be torn down mid-load.
 */
const RETIRE_AFTER = 60 * 60 * 1000;

async function retireIfAbandoned(): Promise<void> {
    const last = await readStamp();
    if (!last || Date.now() - last < RETIRE_AFTER) return;

    // `getRegistration()` exists on the worker scope but is missing from the
    // installed webworker lib typing, so declare just that member.
    const scope = sw as ServiceWorkerGlobalScope & {
        getRegistration(): Promise<ServiceWorkerRegistration | undefined>;
    };
    const registration = await scope.getRegistration();
    if (!registration) return;

    // Drop the cached bytes too, then detach and unregister.
    for (const key of await caches.keys()) {
        await caches.delete(key);
    }
    await sw.skipWaiting();
    await registration.unregister();
}

// install service worker - cache build assets then activate
sw.addEventListener('install', (event: ExtendableEvent) => {
    // A fresh install triggered by a no-JS client never precaches: the page
    // cannot send `JS_ENABLED`, so there is nothing proving JS is available.
    event.waitUntil(precacheIfActive());
});

// activate service worker
sw.addEventListener('activate', (event: ExtendableEvent) => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            // Keep the JS-session stamp; it is not versioned build data.
            if (key !== CACHE && key !== STATE_CACHE) {
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
        // Dormant: no page has reported a live JS session, so this request goes
        // to the network untouched — no cache read, no cache write, no
        // precached bulk download. A no-JS visitor is served exactly as if no
        // worker were installed at all.
        if (!(await isJsActive())) {
            // Navigations are where we learn the client is really JS-free, so
            // that is when the worker considers retiring itself.
            const accept = event.request.headers.get('accept') || '';
            if (
                event.request.mode === 'navigate' ||
                accept.includes('text/html')
            ) {
                event.waitUntil(retireIfAbandoned());
            }

            return fetch(event.request);
        }

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
    if (!event.data) return;

    if (event.data.type === 'SKIP_WAITING') {
        sw.skipWaiting();
    }

    // The page proved JavaScript is running: stamp the session and make sure
    // the light asset bundle is cached (idempotent per build version).
    if (event.data.type === 'JS_ENABLED') {
        event.waitUntil(markJsActive().then(precache));
    }
});
