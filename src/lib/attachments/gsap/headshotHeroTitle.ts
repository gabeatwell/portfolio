import { gsap, SplitText } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export const animateHeadshotTitle: Attachment = (node) => {
    const split = new SplitText(node, { type: 'chars' });

    const tl = gsap.timeline();

    tl.from(split.chars, {
        opacity: 0,
        scale: 0.5,
        stagger: {
            each: 0.1,
            from: 'random',
        },
        ease: 'power2.out',
    });

    tl.to(split.chars, {
        letterSpacing: '0.15em',
        scaleY: 1.75,
    });

    return () => {
        tl.kill();
        split.revert();
    };
};
