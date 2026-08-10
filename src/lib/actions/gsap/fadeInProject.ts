import { gsap } from '$lib/data/gsap';
import type { Action } from 'svelte/action';

export const fadeInProject: Action<HTMLElement, number> = (node, index = 0) => {
    const mm = gsap.matchMedia();

    const setup = () => {
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
    };

    setup();

    return {
        update(nextIndex) {
            if (nextIndex === index) return;
            index = nextIndex;
            mm.revert();
            setup();
        },
        destroy() {
            mm.revert();
        },
    };
};
