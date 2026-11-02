import { describe, it, expect, afterEach, vi } from 'vitest';
import { areAssetsAvailableOffline } from '#lib/data/assetAvailability.ts';

describe('areAssetsAvailableOffline', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns true when there is nothing to load', async () => {
        expect(await areAssetsAvailableOffline([])).toBe(true);
    });

    it('returns true when every asset is cached', async () => {
        vi.stubGlobal('caches', {
            match: vi.fn(async () => new Response('cached')),
        });

        await expect(
            areAssetsAvailableOffline(['/a.glb', '/b.webp']),
        ).resolves.toBe(true);
    });

    it('returns false when any asset is missing', async () => {
        vi.stubGlobal('caches', {
            match: vi.fn(async (url: string) =>
                url === '/a.glb' ? new Response('cached') : undefined,
            ),
        });

        await expect(
            areAssetsAvailableOffline(['/a.glb', '/b.webp']),
        ).resolves.toBe(false);
    });

    it('returns false when the Cache API is unavailable', async () => {
        vi.stubGlobal('caches', undefined);
        await expect(areAssetsAvailableOffline(['/a.glb'])).resolves.toBe(
            false,
        );
    });
});
