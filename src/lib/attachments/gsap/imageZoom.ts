import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export const imageZoom: Attachment = (node) => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: node,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1,
            markers: true,
        },
    });

    const overlay = node.querySelector('.overlay-text');
    const titleStart = node.querySelector('.title-start');
    const titleEnd = node.querySelector('.title-end');
    const img = node.querySelector('img');
    const hero = node.querySelector('.section.hero');
    const desc = node.querySelector('.desc');

    tl.set(overlay, { xPercent: -50, yPercent: -50, opacity: 0 });
    tl.set(titleStart, { xPercent: -100, opacity: 0 });
    tl.set(titleEnd, { xPercent: 100, opacity: 0 });

    tl.to(img, {
        scale: 2,
        z: 350,
        transformOrigin: 'center center',
        ease: 'power1.inOut',
    });

    tl.to(hero, {
        scale: 1.1,
        transformOrigin: 'center center',
        ease: 'power1.inOut',
    });

    tl.to(overlay, { opacity: 1, ease: 'power1.out' }, '>-0.3');

    tl.to([titleStart, titleEnd], {
        xPercent: 0,
        opacity: 1,
        ease: 'power1.in',
    });

    tl.from(desc, { opacity: 0 }, '+=0.2');

    return () => tl.revert();
};
