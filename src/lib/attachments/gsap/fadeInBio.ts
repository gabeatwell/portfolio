import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export function fadeInBio(isMobile: boolean): Attachment {
    return (node) => {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const targets = gsap.utils.toArray<HTMLElement>(
                '.bio-paragraph, .three-button, [data-flex-container]',
                node,
            );
            if (!targets.length) return;

            gsap.set(targets, { opacity: 0, y: 30 });

            gsap.to(targets, {
                opacity: 1,
                y: 0,
                ease: 'power2.out',
                duration: 2,
                stagger: 0.5,
                scrollTrigger: {
                    trigger: node,
                    start: isMobile ? 'top 55%' : 'top 90%',
                    scrub: 1,
                },
            });
        });

        return () => mm.revert();
    };
}
