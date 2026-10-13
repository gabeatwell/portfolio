import { browser } from '$app/env';

export function prefersReducedMotion() {
    let matches = $state(false);

    $effect(() => {
        if (!browser) return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        matches = mq.matches;
        const onChange = (e: MediaQueryListEvent) => (matches = e.matches);
        mq.addEventListener('change', onChange);
    });

    return () => matches;
}
