import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export function panelSlider(onComplete: () => void): Attachment {
    return (node) => {
        const sections = Array.from(
            node.querySelectorAll<HTMLElement>('.section'),
        );
        if (!sections.length) return;

        gsap.set(sections, { yPercent: 0 });

        const tweens = sections.map((section, i) => {
            const randomDelay = 0.3 + Math.random() * 0.5;

            return gsap.to(section, {
                yPercent: -100,
                duration: 1,
                delay: randomDelay,
                ease: 'back.in(1.55)',
                onComplete: () => {
                    if (i === sections.length - 1) onComplete();
                },
            });
        });

        return () => tweens.forEach((t) => t.kill());
    };
}
