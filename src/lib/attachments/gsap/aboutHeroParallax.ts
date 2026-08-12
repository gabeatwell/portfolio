import type { Attachment } from 'svelte/attachments';

type Speeds = { background?: number; middle?: number; foreground?: number };

export function aboutHeroParallax(
    speeds: Speeds = { background: 0.1, middle: 0.3, foreground: 0.5 },
    reducedMotion = false,
): Attachment {
    return (node) => {
        if (reducedMotion) return;

        const layers = {
            background: node.querySelector<HTMLElement>('.layer.background'),
            middle: node.querySelector<HTMLElement>('.layer.middle'),
            foreground: node.querySelector<HTMLElement>('.layer.foreground'),
        };

        const ac = new AbortController();
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const y = window.scrollY;
                if (layers.background)
                    layers.background.style.transform = `translateY(${y * (speeds.background ?? 0.1)}px)`;
                if (layers.middle)
                    layers.middle.style.transform = `translateY(${y * (speeds.middle ?? 0.3)}px)`;
                if (layers.foreground)
                    layers.foreground.style.transform = `translateY(${y * (speeds.foreground ?? 0.5)}px)`;
                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, {
            passive: true,
            signal: ac.signal,
        });
        onScroll();

        return () => ac.abort();
    };
}
