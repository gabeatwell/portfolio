import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function tileIntro(onDone: () => void): Attachment<HTMLElement> {
    return (node) => {
        const mm = gsap.matchMedia();
        const tiles = Array.from(
            node.querySelectorAll<HTMLDivElement>('.tile'),
        );
        const order = shuffle(
            Array.from({ length: tiles.length }, (_, i) => i),
        );
        const nodes = order.map((i) => tiles[i]).filter(Boolean);

        mm.add('(prefers-reduced-motion: reduce)', () => {
            gsap.set(tiles, { opacity: 0 });
            onDone();
        });

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const ctx = gsap.context(() => {
                gsap.to(nodes, {
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    onComplete: onDone,
                });
            }, node);

            return () => ctx.revert();
        });

        return () => mm.revert();
    };
}
