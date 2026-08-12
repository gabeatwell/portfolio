import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export function starMorph(): Attachment<HTMLElement> {
    return (node: HTMLElement) => {
        const tl = gsap.timeline();

        tl.to('.shape1', {
            duration: 0.75,
            morphSVG: '.shape2',
            transformOrigin: '50% 50%',
            onComplete: () => {
                gsap.delayedCall(0.55, () => {
                    node.style.display = 'none';
                });
            },
        });

        return () => tl.kill();
    };
}
