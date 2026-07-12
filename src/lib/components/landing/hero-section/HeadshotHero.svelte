<script lang="ts">
    import { gsap, SplitText } from '$lib/data/gsap';
    import { goto } from '$app/navigation';

    interface Props {
        title: String;
        cssBg?: boolean | number | 'random';
        text: string;
        cta: string;
        bgImage?: string;
        link?: string | { href: string; target?: string };
    }

    let { title, cssBg = false, text, cta, bgImage, link }: Props = $props();
    let heroText = $state<HTMLElement | null>(null);
    let maskActive = $state(true);

    function handleClick() {
        if (!link) return;
        const url = typeof link === 'string' ? link : link.href;
        goto(url);
    }

    function handleTextScroll() {
        if (!heroText) return;

        const { scrollTop, scrollHeight, clientHeight } = heroText;
        maskActive = scrollTop + clientHeight < scrollHeight - 5;
    }

    $effect(() => {
        gsap.registerPlugin(SplitText);

        const split = new SplitText('.hero-title', { type: 'chars' });

        const tl = gsap.timeline();

        tl.from(split.chars, {
            opacity: 0,
            scale: 0.5,
            stagger: {
                each: 0.1,
                from: 'random',
            },
            ease: 'power2.out',
        });

        tl.to(split.chars, {
            letterSpacing: '0.15em',
            scaleY: 1.75,
        });

        return () => {
            tl.kill();
            split.revert();
        };
    });
</script>

<article role="banner" aria-label="hero section">
    <div class="bg-image-wrapper" style="shape-outside: url({bgImage});">
        <img src={bgImage} alt="background headshot" class="bg-image" />
    </div>

    <section class="hero-content" aria-label="hero content">
        <header class="title-wrapper">
            <h1 class="hero-title">{title}</h1>

            <p
                class="hero-text"
                class:masked={maskActive}
                bind:this={heroText}
                onscroll={handleTextScroll}
            >
                {text}
            </p>
        </header>

        <button class="hero-cta" onclick={handleClick}>{cta}</button>
    </section>
</article>

<style>
    article {
        display: flow-root;
        box-shadow: none;
        background: transparent;
        min-block-size: 100vh;
        inline-size: 100%;
        margin-block-start: 15em;
        padding: 0;

        & .bg-image-wrapper {
            float: left;
            max-inline-size: 45%;
            inline-size: auto;
            block-size: 70vh;
            margin-inline-start: 5vw;
            margin-right: 3em;
            shape-outside: url('');
            shape-margin: 0.75em;
            shape-image-threshold: 0.5;
            position: relative;
            z-index: 0;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                inline-size: 100%;
                block-size: 50%;
                background: linear-gradient(
                    to bottom,
                    transparent 0%,
                    var(--clr-dark-500) 75%
                );
                pointer-events: none;
            }

            & .bg-image {
                display: block;
                max-inline-size: 100%;
                inline-size: auto;
                block-size: 100%;
                object-fit: contain;
                object-position: left center;
                opacity: 0.25;

                @media (width <= 768px) {
                    margin-top: 5em;
                }
            }
        }

        & .hero-content {
            position: relative;
            min-block-size: 100vh;
            z-index: 1;
            padding-bottom: 2em;

            & .title-wrapper {
                user-select: none;

                & .hero-title {
                    font-family: var(--mono);
                    font-size: clamp(var(--h4), 4vw, var(--lg));
                    font-weight: 700;
                    line-height: 1.1;
                    color: var(--clr-warning-500);
                    transform: scaleX(1.2) scaleY(1.75);

                    @media (width <= 768px) {
                        transform: scaleX(1) scaleY(1.25);
                    }
                }

                & .hero-text {
                    text-align: left;
                    font-family: var(--bronova);
                    font-size: clamp(var(--sm), 1.5vw, var(--h4));
                    color: var(--clr-gray-600);
                    padding-inline-end: 4.75em;
                    margin-top: 1em;
                    margin-left: 2em;
                    transform: translateX(4em) translateY(2.75em);

                    @media (width <= 500px) {
                        overflow-y: auto;
                        block-size: 30ch;

                        &.masked {
                            mask-image: linear-gradient(
                                to bottom,
                                black 79%,
                                transparent 100%
                            );
                        }
                    }
                }
            }

            & .hero-cta {
                background-color: transparent;
                color: var(--clr-dark-500);
                text-shadow:
                    0 0 1px var(--clr-light-500),
                    -2px -2px 0 var(--clr-light-350),
                    2px -2px 0 var(--clr-light-350),
                    -2px 2px 0 var(--clr-light-350),
                    2px 2px 0 var(--clr-light-350),
                    -2px 0 0 var(--clr-light-350),
                    2px 0 0 var(--clr-light-350),
                    0 -2px 0 var(--clr-light-350),
                    0 2px 0 var(--clr-light-350);
                border: 1px solid var(--clr-light-500);
                outline: 3px solid var(--clr-light-500);
                outline-offset: -7px;
                cursor: pointer;
                letter-spacing: 2px;
                border-radius: var(--radius);
                transition:
                    outline-offset 300ms ease-out,
                    opacity 300ms ease-out,
                    scale 0.15s ease-out;

                font-family: var(--bronova-bold);
                font-size: clamp(var(--sm), 1.5vw, var(--h5));
                inline-size: fit-content;
                margin-block-start: 2em;
                display: inline-block;
                transform: translateX(6em) translateY(1.5em);

                &:hover {
                    outline-offset: 0px;
                }

                @media (width <= 768px) {
                    min-inline-size: 7.5em;
                }
            }
        }
    }
</style>
