import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export function parallax(): Attachment<HTMLElement> {
    return (node: HTMLElement) => {
        // gsap.context scopes all string selectors to `node`
        const ctx = gsap.context(() => {
            gsap.from('.parallax-image', {
                scrollTrigger: {
                    trigger: '.sticky-wrapper',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                    pin: true,
                },
                x: 100,
                yPercent: 50,
                scale: 3,
                ease: 'none',
            });
        }, node);

        return () => ctx.revert();
    };
}
