import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export function fadeInProject(index = 0): Attachment {
    return (node) => {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.set(node, { opacity: 0, y: 30 });

            gsap.to(node, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.15, // cascade: 0, .15, .3, .45...
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: node,
                    start: 'top 80%',
                    once: true,
                },
            });
        });

        return () => mm.revert();
    };
}
