import { gsap, MorphSVGPlugin } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export function gabeMorph(onComplete?: () => void): Attachment<HTMLElement> {
    return (node: HTMLElement) => {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            // Convert source shapes to paths (no-op if already converted on re-run)
            const shapes = node.querySelectorAll(
                '#sourceSVG rect, #sourceSVG circle, #sourceSVG polygon',
            );
            if (shapes.length)
                MorphSVGPlugin.convertToPath(Array.from(shapes) as any[]);

            // Anchor points for clean morphs
            gsap.set(node.querySelectorAll('#square1, #G'), {
                transformOrigin: 'center center',
            });
            gsap.set(node.querySelectorAll('#circle, #A'), {
                transformOrigin: 'center center',
            });
            gsap.set(node.querySelectorAll('#triangle, #B'), {
                transformOrigin: 'center center',
            });
            gsap.set(node.querySelectorAll('#square2, #E'), {
                transformOrigin: 'center center',
            });

            const square1 = node.querySelector('#square1');
            const circle = node.querySelector('#circle');
            const triangle = node.querySelector('#triangle');
            const square2 = node.querySelector('#square2');
            const G = node.querySelector('#G');
            const A = node.querySelector('#A');
            const B = node.querySelector('#B');
            const E = node.querySelector('#E');

            if (
                !square1 ||
                !circle ||
                !triangle ||
                !square2 ||
                !G ||
                !A ||
                !B ||
                !E
            )
                return;

            const tl = gsap.timeline({
                defaults: { duration: 3, ease: 'power2.out' },
                delay: 3,
                onComplete: () => onComplete?.(),
            });

            tl.to(square1, { morphSVG: G } as gsap.TweenVars)
                .to(circle, { morphSVG: A } as gsap.TweenVars, 0)
                .to(triangle, { morphSVG: B } as gsap.TweenVars, 0)
                .to(square2, { morphSVG: E } as gsap.TweenVars, 0);
        });

        return () => mm.revert();
    };
}
