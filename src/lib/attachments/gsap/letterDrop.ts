import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export function letterDrop(): Attachment<HTMLElement> {
    return (node: HTMLElement) => {
        const letters = Array.from(node.querySelectorAll('.animated-letter'));
        const drop = Array.from(node.querySelectorAll('.drop'));

        gsap.set(letters, { scale: 1, autoAlpha: 1 });
        gsap.set(drop, { scale: 0, autoAlpha: 0 });

        gsap.to(drop, {
            scale: 1,
            transformOrigin: '50% 50%',
            autoAlpha: 1,
            duration: 1.5,
            delay: 0.5,
            ease: 'sine.out',
            stagger: { each: 0.25, from: 'edges' },
        });

        return () => {
            gsap.killTweensOf(letters);
            gsap.killTweensOf(drop);
        };
    };
}
