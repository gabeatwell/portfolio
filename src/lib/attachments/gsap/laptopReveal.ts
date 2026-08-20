import { gsap, ScrollTrigger } from '$lib/data/gsap';

gsap.registerPlugin(ScrollTrigger);

export function laptopReveal(node: HTMLElement) {
    const video = node.querySelector('video') as HTMLVideoElement | null;
    const screenContent = node.querySelector(
        '.screen-content',
    ) as HTMLElement | null;

    if (!video || !screenContent) return;

    let ctx: gsap.Context | undefined;

    const setup = () => {
        video.pause();
        video.currentTime = 0;

        gsap.set(screenContent, {
            scale: 0.41, // same values as your fromTo
            xPercent: -50,
            yPercent: -50,
            left: '50%',
            top: '44%',
            width: '1050px',
            height: '660px',
            borderRadius: '10px',
            overflow: 'hidden',
            // visibility: 'visible',
            outline: '3px solid red',
            background: 'rgba(255,0,0,0.25)',
        });

        ctx = gsap.context(() => {
            // proxy
            const proxy = { time: 0 };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: node,
                    start: 'top top',
                    end: '+=250%', // total scroll distance
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    markers: true,
                },
            });

            // phase 1
            tl.to(proxy, {
                time: video.duration,
                ease: 'none',
                duration: 0.6,
                onUpdate: () => {
                    video.currentTime = proxy.time;
                },
            });

            // phase 2
            gsap.fromTo(
                screenContent,
                {
                    // locked to screen
                    scale: 0.41, // adjust to match laptop
                    xPercent: -50,
                    yPercent: -50,
                    left: '50%',
                    top: '44%', // adjust to sit on screen
                    width: '1200px',
                    height: '750px',
                    borderRadius: '8px',
                },
                {
                    // full viewport
                    scale: 1,
                    xPercent: 0,
                    yPercent: 0,
                    left: '0%',
                    top: '0%',
                    width: '100vw',
                    height: '100vh',
                    borderRadius: '0px',
                    opacity: 1,
                    ease: 'power1.inOut',
                    duration: 0.4,
                },
            );
        }, node);

        requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    if (video.readyState >= 1) {
        setup();
    } else {
        video.addEventListener('loadedmetadata', setup, { once: true });
    }

    return () => {
        ctx?.revert();
    };
}
