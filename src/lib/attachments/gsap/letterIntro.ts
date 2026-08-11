import { gsap, SplitText } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export const letterIntro: Attachment = (node) => {
    const h1 = node.querySelector('h1');
    if (!h1) return;

    const split = new SplitText(h1, { type: 'chars' });
    const chars = split.chars;

    gsap.set(chars, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
    });

    const tl = gsap.timeline();

    chars.forEach((char) => {
        tl.to(char, {
            opacity: 1,
            duration: 0.3,
            ease: 'circ.out',
        }).to(char, { opacity: 0, duration: 0.3, ease: 'circ.in' }, '+=0.8');
    });

    tl.to(
        node.querySelector('.full-image'),
        {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
        },
        '+=1',
    );

    return () => {
        split.revert();
        tl.kill();
    };
};
