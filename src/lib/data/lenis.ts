import Lenis from 'lenis';

export const lenisStore = { current: undefined as Lenis | undefined };

export function createLenis() {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    lenisStore.current = lenis;
    return lenis;
}

export function destroyLenis() {
    lenisStore.current?.destroy();
    lenisStore.current = undefined;
}

export function resetScroll() {
    if (location.hash) return;
    window.scrollTo(0, 0);
    lenisStore.current?.scrollTo(0, { immediate: true });
}
