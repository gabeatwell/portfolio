// src/lib/attachments/gsap/animateCodeParagraphs.ts
import type { Attachment } from 'svelte/attachments';
import { gsap } from '$lib/data/gsap';

export const animateCodeParagraphs: Attachment<HTMLElement> = (root) => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(root.querySelectorAll('.content p, pre'), {
            opacity: 1,
            x: 0,
        });
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
        const ctx = gsap.context(() => {
            root.querySelectorAll('pre').forEach((pre) => {
                const code = pre.querySelector('code');
                const targets = code ? [pre, code] : pre;

                gsap.fromTo(
                    targets,
                    { x: 100, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        overflow: 'hidden',
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: pre,
                            start: 'top center+=450',
                        },
                    },
                );
            });

            root.querySelectorAll('.content p').forEach((para) => {
                gsap.fromTo(
                    para,
                    { x: -100, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: para,
                            start: 'top center+=450',
                        },
                    },
                );
            });
        }, root);
    });

    return () => mm.revert();
};
