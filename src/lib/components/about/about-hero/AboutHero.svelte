<script lang="ts">
    import { gsap, ScrollTrigger, SplitText } from '$lib/data/gsap';
    import AboutHeroParallax from './AboutHeroParallax.svelte';

    interface Props {
        alt?: string;
        title: string;
        viewTransitionName?: string;
    }

    let { title, viewTransitionName }: Props = $props();

    function titleRotate() {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: reduce)', () => {
            // If the user prefers reduced motion, skip the animation
            return () => {};
        });

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const split = new SplitText('#title', { type: 'chars' });
            const titleElement = document.getElementById('title');
            const isMobile = window.innerWidth <= 768;

            // initial animation
            gsap.from(split.chars, {
                opacity: 0,
                yPercent: -40,
                duration: 1,
                ease: 'power2.out',
                stagger: {
                    each: 0.2,
                    from: 'random',
                    amount: 0.5,
                },
            });

            // 3d rotation on scroll
            if (!isMobile) {
                split.chars.forEach((char, index) => {
                    gsap.to(char, {
                        scrollTrigger: {
                            trigger: titleElement,
                            start: `top ${70 - index * 2.75}%`,
                            end: `bottom ${70 - index * 2.75}%`,
                            scrub: 1,
                        },
                        rotationX: 360,
                        transformOrigin: 'center center',
                        ease: 'none',
                    });
                });
            }

            return () => {
                gsap.killTweensOf(split.chars);
                gsap.killTweensOf(titleElement);
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
                split.revert();
            };
        });

        return () => mm.revert();
    }

    $effect(() => {
        titleRotate();
    });
</script>

<div class="about-hero-image">
    <AboutHeroParallax />

    <h1 id="title">
        <span
            style:view-transition-name={viewTransitionName}
            style:view-transition-class="heading-transition">About</span
        >
        {title}
    </h1>
</div>

<style>
    .about-hero-image {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: calc(-50vw + 50%);
        inline-size: 100vw;
        padding-top: 0;
        aspect-ratio: 21 / 9;
        contain: layout;
        margin-top: clamp(-5vh, -18vh, -15vh);

        @media (width <= 768px) {
            min-block-size: 30vh;
        }
        @media (width <= 500px) {
            min-block-size: 50vh;
            margin-top: 4em;
        }

        & #title {
            margin-top: -1.2em;
            text-shadow: 0 0 5px var(--smoke);
            font-family: var(--ultra);
            font-size: clamp(var(--h2), 8vw, var(--xxxl));
            font-weight: 700;
            letter-spacing: -1px;
            color: var(--clr-dark-500);
            text-shadow:
                0 0 1px var(--clr-dark-500),
                -5px -5px 0 var(--clr-light-500),
                5px -5px 0 var(--clr-light-500),
                -5px 5px 0 var(--clr-light-500),
                5px 5px 0 var(--clr-light-500),
                -5px 0 0 var(--clr-light-500),
                5px 0 0 var(--clr-light-500),
                0 -5px 0 var(--clr-light-500),
                0 5px 0 var(--clr-light-500);

            @media (width >= 768px) {
                :global(& .char) {
                    display: inline-block;
                    transform-style: preserve-3d;
                    perspective: 1000px;
                }
            }

            @media (width <= 1300px) {
                mix-blend-mode: normal;
            }

            @media (width <= 768px) {
                text-shadow:
                    0 0 1px var(--clr-dark-500),
                    -2px -2px 0 var(--clr-light-500),
                    2px -2px 0 var(--clr-light-500),
                    -2px 2px 0 var(--clr-light-500),
                    2px 2px 0 var(--clr-light-500),
                    -2px 0 0 var(--clr-light-500),
                    2px 0 0 var(--clr-light-500),
                    0 -2px 0 var(--clr-light-500),
                    0 2px 0 var(--clr-light-500);
            }
        }
    }

    @keyframes title {
        0% {
            opacity: 0;
            translate: 0 -2em;
        }
        55% {
            opacity: 0;
        }
        100% {
            opacity: 1;
            translate: 0 0;
        }
    }

    ::view-transition-old(.heading-transition) {
        opacity: 0;
    }

    ::view-transition-group(.heading-transition) {
        animation-duration: var(--link-transition-duration);
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (width <= 768px) {
        ::view-transition-old(.heading-transition) {
            animation: none;
            opacity: 1;
        }

        ::view-transition-new(.heading-transition) {
            animation: none;
        }
    }
</style>
