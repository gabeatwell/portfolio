import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export const imageFrame: Attachment = (node) => {
    const img = node.querySelector('img');
    const h1 = node.querySelector('h1');
    if (!img) return;

    const ac = new AbortController();
    const mm = gsap.matchMedia();

    gsap.set(img, { y: -50 });

    node.addEventListener(
        'mouseenter',
        () => gsap.to(img, { y: 0, duration: 0.75, ease: 'none' }),
        { signal: ac.signal },
    );
    node.addEventListener(
        'mouseleave',
        () =>
            gsap.to(img, {
                y: -50,
                duration: 0.75,
                borderTop: 0,
                ease: 'none',
            }),
        { signal: ac.signal },
    );

    mm.add('(max-inline-size: 768px)', () => {
        if (h1) gsap.set(h1, { yPercent: -50, fontWeight: 900 });

        node.addEventListener(
            'mouseenter',
            () => gsap.to(img, { y: -10, duration: 0.75, ease: 'none' }),
            { signal: ac.signal },
        );
    });

    return () => {
        ac.abort();
        mm.kill();
        gsap.killTweensOf([img, h1].filter(Boolean));
    };
};
