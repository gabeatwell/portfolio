/// <reference lib="webworker" />

import { immutable, assets, prerendered } from '$app/manifest';
import { version } from '$app/env';

const CACHE = `cache-${version}`;
// Manifest paths arrive without a leading slash (`_app/immutable/...`), while
// `new URL(request.url).pathname` always has one — normalize so both compare.
/**
 * Routes with `prerender = false` have no HTML in the build, so the manifest
 * can't precache them. `cache.add` fetches them from the live server at
 * install time and stores an offline snapshot instead — the shell renders
 * offline; genuinely server-only content (form submits, live API data) still
 * needs a connection and degrades to the error UI.
 */
const EXTRA_ROUTES = [
    '/learn/advanced',
    '/contact',
    '/contact/success',
    '/contact/hire',
    '/threejs-blog/three-components',
];

const ASSETS = [
    '/',
    '/index.html',
    ...EXTRA_ROUTES,
    ...[...immutable, ...assets, ...prerendered].map((a) =>
        a.path.startsWith('/') ? a.path : `/${a.path}`,
    ),
];

/**
 * Cross-origin media/fonts (the jsdelivr `portfolio-assets` CDN) are worth
 * runtime-caching: the site's imagery is off-origin, so without this, an
 * offline visit shows a text-only page. Analytics beacons stay untouched.
 */
const CACHEABLE_CROSS_ORIGIN = /\.(?:png|jpe?g|webp|avif|gif|svg|woff2?)$/i;
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
 *
 * Exception: navigation requests always try the cache first so offline
 * cold-starts (especially on iOS) work correctly.
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

    // Cacheable cross-origin media/fonts (jsdelivr imagery) still need to
    // reach the handler below; only beacons/other cross-origin traffic bypasses.
    const isCloudflareAnalytics =
        url.hostname.endsWith('cloudflareinsights.com') ||
        url.pathname.includes('beacon.min.js') ||
        url.pathname.startsWith('/cdn-cgi/');

    if (isCloudflareAnalytics) {
        return;
    }

    if (isCrossOrigin && !CACHEABLE_CROSS_ORIGIN.test(url.pathname)) {
        return;
    }

    async function respond(): Promise<Response> {
        const jsActive = await isJsActive();
        const cache = await caches.open(CACHE);

        const acceptHeader = event.request.headers.get('accept') || '';
        const isNavigation =
            event.request.mode === 'navigate' ||
            acceptHeader.includes('text/html');

        // ---------- Navigation requests (offline-first priority) ----------
        // Always try the cache for navigations so cold-start offline works on iOS,
        // even if the JS heartbeat is missing or stale.
        if (isNavigation) {
            // Try exact match first. `ignoreVary` is required: build assets
            // are stored with `Vary: Origin` (from precache fetches that send
            // no Origin header), while the browser's CORS-mode stylesheet/
            // script requests do send one — without this those lookups
            // silently miss and offline navigations 404 their own CSS/JS.
            const cached = await cache.match(event.request, {
                ignoreVary: true,
            });

            if (jsActive) {
                // Stale-while-revalidate when we know JS is alive
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
                    // fall through to fallbacks
                }
            } else if (cached) {
                // Offline + no recent heartbeat → still serve the cached page
                return cached;
            }

            // Fallbacks
            const fallback =
                (await cache.match('/')) || (await cache.match('/index.html'));

            if (fallback) return fallback;

            // Last-resort offline page (keeps Safari from showing its native error)
            return new Response(
                `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Offline</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 2rem;
      text-align: center;
      background: #0a0a0a;
      color: #f5f5f5;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { opacity: 0.7; margin-bottom: 1.5rem; }
    button {
      background: #fff;
      color: #000;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-size: 1rem;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>You’re offline</h1>
  <p>This page isn’t available right now.</p>
  <button onclick="location.reload()">Try again</button>
</body>
</html>`,
                {
                    status: 503,
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                },
            );
        }

        // ---------- Non-navigation requests ----------
        // keep the original dormant behavior when JS is inactive
        if (!jsActive) {
            // Consider retiring the worker if the JS heartbeat has been gone long enough.
            // (Navigations are already handled above, so we no longer need the mode check.)
            event.waitUntil(retireIfAbandoned());
            return fetch(event.request);
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
                const cachedResponse = await cache.match(event.request, {
                    ignoreVary: true,
                });
                if (cachedResponse) return cachedResponse;
            }
        }

        // other build files from cache first (images, fonts, etc.) for performance
        if (ASSETS.includes(url.pathname)) {
            const cachedResponse = await cache.match(event.request, {
                ignoreVary: true,
            });
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        // cross-origin media (jsdelivr images/fonts): cache-first, then
        // network. Opaque `no-cors` responses have status 0, so the
        // generic `status === 200` check below would never store them.
        if (isCrossOrigin && CACHEABLE_CROSS_ORIGIN.test(url.pathname)) {
            const cachedResponse = await cache.match(event.request, {
                ignoreVary: true,
            });
            if (cachedResponse) return cachedResponse;

            try {
                const response = await fetch(event.request);
                if (response.ok || response.type === 'opaque') {
                    cache.put(event.request, response.clone()).catch(
                        () => {},
                    );
                }
                return response;
            } catch {
                const late = await cache.match(event.request, {
                    ignoreVary: true,
                });
                if (late) return late;
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
            const cachedResponse = await cache.match(event.request, {
                ignoreVary: true,
            });
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
