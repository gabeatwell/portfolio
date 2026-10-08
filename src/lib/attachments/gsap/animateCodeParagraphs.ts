import type { Attachment } from 'svelte/attachments';
import { gsap } from '#lib/data/gsap.js';

export const animateCodeParagraphs: Attachment<HTMLElement> = (root) => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
            root.querySelectorAll('.content p, pre, .code-block-wrapper'),
            {
                opacity: 1,
                x: 0,
            },
        );
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
        root.querySelectorAll('pre').forEach((pre) => {
            const wrapper = pre.closest('.code-block-wrapper');
            const code = pre.querySelector('code');
            const targets = wrapper
                ? code
                    ? [wrapper, code]
                    : wrapper
                : code
                  ? [pre, code]
                  : pre;

            gsap.fromTo(
                targets,
                { x: 100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: wrapper ?? pre,
                        start: 'top center+=450',
                    },
                },
            );

            const button = wrapper?.querySelector('.copy-button');
            if (button) {
                gsap.fromTo(
                    button,
                    { x: 100, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: wrapper ?? pre,
                            start: 'top center+=450',
                        },
                    },
                );
            }
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
    });

    return () => mm.revert();
};
