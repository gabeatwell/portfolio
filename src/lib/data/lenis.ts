import Lenis from 'lenis';
import { ScrollTrigger } from '#lib/data/gsap.js';

export const lenisStore = { current: undefined as Lenis | undefined };

export function createLenis() {
    const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        autoResize: true,
    });
    lenisStore.current = lenis;

    const vv = window.visualViewport;
    let lastHeight = window.innerHeight;
    const onViewportResize = () => {
        if (Math.abs(window.innerHeight - lastHeight) < 2) return;
        lastHeight = window.innerHeight;
        ScrollTrigger.refresh();
    };
    vv?.addEventListener('resize', onViewportResize);

    const originalDestroy = lenis.destroy.bind(lenis);
    lenis.destroy = () => {
        vv?.removeEventListener('resize', onViewportResize);
        originalDestroy();
    };

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
