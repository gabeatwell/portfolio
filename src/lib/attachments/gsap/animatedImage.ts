import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export function animatedImage(scale?: number): Attachment<HTMLElement> {
    return (node: HTMLElement) => {
        const tween = gsap.from(node.querySelector('.imgClass'), {
            display: 'block',
            duration: 3,
            scale: scale ?? 1, // falls back to 1 if undefined — matches gsap's default
            opacity: 0,
            ease: 'power2.out',
            stagger: 0.5,
        });

        return () => tween.kill();
    };
}
