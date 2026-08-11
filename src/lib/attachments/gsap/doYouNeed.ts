import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export const animateDoYouNeed: Attachment = (node) => {
    const subtitle = node.querySelector<HTMLElement>('.subtitle');
    const charEls = node.querySelectorAll<HTMLElement>('.char');

    if (!subtitle || !charEls.length) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(subtitle, { autoAlpha: 0, y: 75 });
        gsap.set(charEls, { scaleY: 1.5 });

        mm.add('(max-width: 768px)', () => {
            gsap.set(charEls, { scaleY: 1.75 });
        });

        const tl = gsap.timeline();
        tl.to(subtitle, {
            autoAlpha: 0.75,
            y: 0,
            duration: 1.5,
            ease: 'power2.out',
        }).fromTo(
            charEls,
            { x: '150%', opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 3,
                ease: 'circ.out',
                stagger: 0.5,
            },
            '-=0.5',
        );

        return () => tl.kill();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(subtitle, { autoAlpha: 0.75, y: 0 });
        gsap.set(charEls, { scaleY: 1, x: 0, opacity: 1 });
    });

    return () => mm.revert();
};
