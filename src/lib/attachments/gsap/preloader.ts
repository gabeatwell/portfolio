import { gsap } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

interface PreloaderOptions {
    /** Called when the preloader finishes (immediately if reduced motion is on). */
    onComplete?: () => void;
}

export function preloader(
    options: PreloaderOptions = {},
): Attachment<HTMLElement> {
    return (node: HTMLElement) => {
        const lines = Array.from(
            node.querySelectorAll<HTMLElement>('.preloader-line'),
        );

        if (lines.length !== 10) return;

        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: reduce)', () => {
            gsap.set(lines, { scaleX: 0 });
            gsap.set(node, { opacity: 0, pointerEvents: 'none' });

            // matchMedia callbacks fire synchronously on add(), so defer the
            // state mutation out of the mount/attach phase
            queueMicrotask(() => options.onComplete?.());
        });

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const tl = gsap.timeline();

            tl.to(lines, {
                duration: 1.3,
                scaleX: 0,
                transformOrigin: 'right',
                stagger: 0.1,
                ease: 'power3.inOut',
            });

            tl.to(
                node,
                {
                    duration: 0.5,
                    opacity: 0,
                    pointerEvents: 'none',
                    onComplete: () => options.onComplete?.(),
                },
                '-=0.3',
            );
        });

        return () => mm.revert();
    };
}
