import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export const animateLearnHeading: Attachment = (node) => {
    const left = node.querySelector('.left-word');
    const right = node.querySelector('.right-word');
    const middle = node.querySelector('.middle-word');

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    gsap.set([left, right], { y: 40 });

    tl.from(
        left,
        {
            opacity: 0,
            x: -100,
            duration: 2,
            ease: 'power3',
        },
        0,
    );
    tl.from(
        right,
        {
            opacity: 0,
            x: 100,
            duration: 2,
            ease: 'power3',
        },
        '<',
    ).fromTo(
        middle,
        { opacity: 0, scale: 0 },
        {
            opacity: 0.65,
            scale: 2,
            duration: 1,
            ease: 'circ',
            stagger: 0.25,
        },
        '<',
    );

    return () => tl.kill();
};
