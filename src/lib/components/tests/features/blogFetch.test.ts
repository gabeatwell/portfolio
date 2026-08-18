import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPostMd, API_BASE } from '$lib/data/blog/fetchMD.server';

describe('fetchPostMd', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('returns the markdown body on a 200 response', async () => {
        const fakeMd = `---
title: Test Post
---
# Hello

This is the body.`;

        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(fakeMd, { status: 200 }),
        );

        const result = await fetchPostMd('5');
        expect(result).toBe(fakeMd);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`${API_BASE}/api/md/5`);
    });

    it('returns null when the API returns 404', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('Not Found', { status: 404 }),
        );

        const result = await fetchPostMd('999');
        expect(result).toBeNull();
    });

    it('returns null on a network error (fetch throws)', async () => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(
            new Error('Network failure'),
        );

        const result = await fetchPostMd('5');
        expect(result).toBeNull();
    });

    it('returns null on a 500 server error', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response('Internal Server Error', { status: 500 }),
        );

        const result = await fetchPostMd('5');
        expect(result).toBeNull();
    });

    it('uses the correct API_BASE URL', () => {
        expect(API_BASE).toBe('https://blog-backend-kgtm.onrender.com');
    });
});
