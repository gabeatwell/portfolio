import { describe, it, expect, vi, beforeEach } from 'vitest';

// mock $app/environment — browser must be true for initialization to happen
vi.mock('$app/environment', () => ({
    browser: true,
}));

describe('getBreakpoints', () => {
    // mutable state to control what matchMedia returns per query
    const queryMatches = new Map<string, boolean>();
    const changeListeners: Array<() => void> = [];

    beforeEach(() => {
        // wipe module cache so getBreakpoints() re-runs initialization fresh
        vi.resetModules();
        queryMatches.clear();
        changeListeners.length = 0;

        window.matchMedia = vi.fn().mockImplementation((query: string) => {
            if (!queryMatches.has(query)) {
                queryMatches.set(query, false);
            }

            return {
                get matches() {
                    return queryMatches.get(query) ?? false;
                },
                media: query,
                onchange: null,
                addEventListener: (_event: string, cb: () => void) => {
                    changeListeners.push(cb);
                },
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            } as unknown as MediaQueryList;
        });
    });

    it('returns "desktop" when no other breakpoint matches', async () => {
        const { getBreakpoints } =
            await import('$lib/data/stores/breakpoints.svelte');
        const bp = getBreakpoints();

        expect(bp.value).toBe('desktop');
        expect(bp.isDesktop).toBe(true);
        expect(bp.isMobile).toBe(false);
        expect(bp.isTablet).toBe(false);
        expect(bp.isLaptop).toBe(false);
        expect(bp.isReduced).toBe(false);
    });

    it('returns "mobile" when the mobile query matches', async () => {
        queryMatches.set('(max-width: 767px)', true);

        const { getBreakpoints } =
            await import('$lib/data/stores/breakpoints.svelte');
        const bp = getBreakpoints();

        expect(bp.value).toBe('mobile');
        expect(bp.isMobile).toBe(true);
        expect(bp.isDesktop).toBe(false);
    });

    it('returns "tablet" when the tablet query matches', async () => {
        queryMatches.set('(min-width: 768px) and (max-width: 1023px)', true);

        const { getBreakpoints } =
            await import('$lib/data/stores/breakpoints.svelte');
        const bp = getBreakpoints();

        expect(bp.value).toBe('tablet');
        expect(bp.isTablet).toBe(true);
        expect(bp.isMobile).toBe(false);
    });

    it('returns "laptop" when the laptop query matches', async () => {
        queryMatches.set('(min-width: 1024px) and (max-width: 1279px)', true);

        const { getBreakpoints } =
            await import('$lib/data/stores/breakpoints.svelte');
        const bp = getBreakpoints();

        expect(bp.value).toBe('laptop');
        expect(bp.isLaptop).toBe(true);
        expect(bp.isTablet).toBe(false);
    });

    it('returns "reduced" when prefers-reduced-motion: reduce matches — takes priority over others', async () => {
        // even when mobile also matches, reduced wins
        queryMatches.set('(prefers-reduced-motion: reduce)', true);
        queryMatches.set('(max-width: 767px)', true);

        const { getBreakpoints } =
            await import('$lib/data/stores/breakpoints.svelte');
        const bp = getBreakpoints();

        expect(bp.value).toBe('reduced');
        expect(bp.isReduced).toBe(true);
        expect(bp.isMobile).toBe(false);
    });

    it('tracks standalone mode from display-mode query', async () => {
        queryMatches.set('(display-mode: standalone)', true);

        const { getBreakpoints } =
            await import('$lib/data/stores/breakpoints.svelte');
        const bp = getBreakpoints();

        expect(bp.isStandalone).toBe(true);
    });

    it('tracks landscape from orientation query', async () => {
        queryMatches.set('(orientation: landscape)', true);

        const { getBreakpoints } =
            await import('$lib/data/stores/breakpoints.svelte');
        const bp = getBreakpoints();

        expect(bp.isLandscape).toBe(true);
    });

    it('re-evaluates when a media query change event fires', async () => {
        // Start as desktop
        const { getBreakpoints } =
            await import('$lib/data/stores/breakpoints.svelte');
        const bp = getBreakpoints();
        expect(bp.value).toBe('desktop');

        // Simulate the mobile query now matching
        queryMatches.set('(max-width: 767px)', true);
        for (const listener of changeListeners) {
            listener();
        }

        expect(bp.value).toBe('mobile');
        expect(bp.isMobile).toBe(true);
        expect(bp.isDesktop).toBe(false);
    });

    it('initializes matchMedia only once across multiple getBreakpoints() calls', async () => {
        const { getBreakpoints } =
            await import('$lib/data/stores/breakpoints.svelte');

        // first call — 7 matchMedia calls for the 7 queries
        getBreakpoints();

        const callsAfterFirst = (window.matchMedia as any).mock.calls.length;
        expect(callsAfterFirst).toBe(7); // sanity check: all 7 queries created

        // second call — should NOT re-initialize
        getBreakpoints();

        const callsAfterSecond = (window.matchMedia as any).mock.calls.length;
        expect(callsAfterSecond).toBe(7); // still 7 — no additional calls
    });
});
