import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export const heroContentStats: Attachment = (node) => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: node,
                start: 'top center+=375',
            },
        });

        tl.fromTo(
            node.querySelector('.stat-item.a'),
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35 },
            0,
        );
        tl.fromTo(
            node.querySelector('.stat-item.b'),
            { scale: 1.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5 },
            0,
        );
        tl.fromTo(
            node.querySelector('.stat-item.c'),
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5 },
            0,
        );

        return () => tl.kill();
    });

    return () => mm.revert();
};
