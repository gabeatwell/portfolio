import { gsap, SplitText } from '$lib/data/gsap';
import type { Attachment } from 'svelte/attachments';

export const mobileVideo: Attachment = (_node) => {
    let cleanup: (() => void) | null = null;

    const initAnimation = () => {
        if (cleanup) return; // Already initialized

        const textContent = _node.querySelector('.text-content');
        const smartphone = _node.querySelector('.smartphone');

        if (!textContent || !smartphone) return;

        try {
            const splitTitle = SplitText.create(
                textContent.querySelector('h2') as Element,
                { type: 'chars' },
            );

            const tl = gsap.timeline();

            tl.fromTo(
                textContent,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 2, ease: 'power2.out' },
            )
                .fromTo(
                    smartphone,
                    { rotation: -180, autoAlpha: 0, scale: 1.5 },
                    {
                        rotation: 0,
                        autoAlpha: 1,
                        scale: 1,
                        duration: 2.25,
                        ease: 'power2.out',
                    },
                    '<',
                )
                .fromTo(
                    splitTitle.chars,
                    { rotationX: -90, autoAlpha: 0 },
                    {
                        rotationX: 0,
                        autoAlpha: 1,
                        duration: 2,
                        ease: 'back.out',
                        letterSpacing: 'clamp(1px, 2vw, 9px)',
                        stagger: { amount: 0.5, from: 'center' },
                    },
                    '<',
                );

            cleanup = () => {
                tl.kill();
            };
        } catch (error) {
            console.error('GSAP setup failed:', error);
        }
    };

    const observer = new MutationObserver(() => {
        initAnimation();
        observer.disconnect();
    });

    observer.observe(_node, { childList: true, subtree: true });

    initAnimation();

    return () => {
        observer.disconnect();
        if (cleanup) {
            cleanup();
        }
    };
};
