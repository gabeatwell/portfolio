/**
 * Offline availability checks for runtime-cached assets.
 *
 * Heavy payloads (`.glb`/`.gltf` models, HDR environment maps, and anything
 * under `/threejayess/`) are deliberately left out of the service worker's
 * precache list — see `src/service-worker/index.ts` — because downloading all
 * of them on install would flood the network. They are cached at runtime
 * instead, so a scene only works offline after it has been visited online.
 */

/** True when the service worker already holds a copy of this URL. */
async function isAssetCached(url: string): Promise<boolean> {
    // `ignoreVary` matches how the worker looks assets up: build assets are
    // stored from requests without an `Origin` header but re-requested with
    // one, which would otherwise look like a miss.
    const cached = await caches.match(url, { ignoreVary: true });
    return Boolean(cached);
}

/**
 * True when every URL can be served without a connection. A single missing
 * URL would fail to load offline and leave the scene half-rendered, so this
 * is all-or-nothing.
 */
export async function areAssetsAvailableOffline(
    urls: readonly string[],
): Promise<boolean> {
    if (urls.length === 0) return true;

    // No Cache API (insecure context, private mode, unsupported browser) means
    // no service worker, therefore no offline copy of these assets.
    if (!('caches' in globalThis)) return false;

    try {
        const cached = await Promise.all(urls.map(isAssetCached));
        return cached.every(Boolean);
    } catch {
        // `caches.match` can reject in some private modes — treat that as
        // "not available" so the notice is shown instead of a broken scene.
        return false;
    }
}
