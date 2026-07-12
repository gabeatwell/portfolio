<script lang="ts">
    import CSS from './css.md';
    import GSAP from './gsap.md';
    import SEO from '$lib/data/SEO.svelte';
    import Card from '$lib/components/learn/advanced-page/Card.svelte';
    import TableOfContents from '$lib/components/learn/advanced-page/TableOfContents.svelte';
    import GabeMorph from '$lib/components/learn/advanced-page/GabeMorph.svelte';
    import BackToTop from '$lib/components/learn/advanced-page/BackToTop.svelte';
    import ViewTransitionImage from '$lib/components/layout/view-transitions/ViewTransitionImage.svelte';
    import { gsap, ScrollTrigger } from '$lib/data/gsap';
    import Popover from '$lib/components/layout/Popover.svelte';
    import Preloader from '$lib/components/learn/advanced-page/Preloader.svelte';

    import CopyButton from '$lib/components/learn/CopyButton.svelte';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';
    import { sanitizeAndHighlight } from '$lib/components/utils/highlight';

    let postHtml = $state<string>('');
    let sanitizeHtml = $state<string>('');

    let mounted = $state<boolean>(false);

    const breakpoints = getBreakpoints();

    $effect(() => {
        let canceled = $state(false);

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                if (!canceled) mounted = true;
            });
            return () => {
                canceled = true;
            };
        } else {
            mounted = true;
        }
    });

    // gsap
    $effect(() => {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: reduce)', () => {
            if (breakpoints.isReduced) {
                gsap.set('.content p, pre', { opacity: 1, x: 0 });
            }
        });

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            if (!mounted) return;

            if (breakpoints.isReduced) return;

            gsap.registerPlugin(ScrollTrigger);

            const ctx = gsap.context(() => {
                const paragraphs = document.querySelectorAll('.content p');
                const codeBlocks = document.querySelectorAll('pre');

                codeBlocks.forEach((pre) => {
                    const code = pre.querySelector('code');
                    const targets = code ? [pre, code] : pre;

                    gsap.fromTo(
                        targets,
                        {
                            x: 100,
                            opacity: 0,
                        },
                        {
                            x: 0,
                            opacity: 1,
                            duration: 1,
                            overflow: 'hidden',
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: pre,
                                start: 'top center+=450',
                            },
                        },
                    );
                });

                paragraphs.forEach((para) => {
                    gsap.fromTo(
                        para,
                        {
                            x: -100,
                            opacity: 0,
                        },
                        {
                            x: 0,
                            opacity: 1,
                            duration: 1,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: para,
                                start: 'top center+=450',
                            },
                        },
                    );
                });
            });

            return () => {
                ctx.revert();
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
                mm.revert();
            };
        });
    });

    // highlight.js
    $effect(() => {
        async function updateHighlight() {
            sanitizeHtml = await sanitizeAndHighlight(postHtml);
        }
        updateHighlight();
    });
</script>

<svelte:head>
    <meta name="view-transition" content="same-origin" />
</svelte:head>

<SEO
    title="Web Animation Techniques"
    description="Web techniques"
    keywords="animation techniques, web techniques for animation"
    type="article"
/>

<Preloader />

<section class="table-and-logo" id="top">
    <div class="popover-morph">
        <GabeMorph />

        {#if !breakpoints.isMobile}
            <Popover
                title=""
                text="click the arrow button on the left to open the table of contents."
            />
        {/if}
    </div>

    <TableOfContents sideBar={true} />
</section>

<article class="code-blocks">
    {@html sanitizeHtml}
</article>

<!-- for pre/code blocks -->
<CopyButton />

<section class="topics" class:mounted>
    <div class="css">
        <div class="tech-stack-logo">
            <div class="aside-links">
                <ViewTransitionImage
                    src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/CSS-Purple.webp"
                    alt="new css logo"
                    transitionName="css-image"
                />

                <a
                    href="/learn/posts/drawing-app"
                    aria-label="drawing app"
                    class="drawing-app-link"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        ><path
                            d="M416.9 85.2L372 130.1L509.9 268L554.8 223.1C568.4 209.6 576 191.2 576 172C576 152.8 568.4 134.4 554.8 120.9L519.1 85.2C505.6 71.6 487.2 64 468 64C448.8 64 430.4 71.6 416.9 85.2zM338.1 164L122.9 379.1C112.2 389.8 104.4 403.2 100.3 417.8L64.9 545.6C62.6 553.9 64.9 562.9 71.1 569C77.3 575.1 86.2 577.5 94.5 575.2L222.3 539.7C236.9 535.6 250.2 527.9 261 517.1L476 301.9L338.1 164z"
                        /></svg
                    >
                </a>
            </div>

            <CSS aria-label="css" />
        </div>
    </div>

    <div class="gsap">
        <ViewTransitionImage
            src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/GSAP-Dark.svg"
            alt="greensock animation platform"
            transitionName="gsap-image"
        />

        <GSAP aria-label="greensock" />
    </div>

    <article class="developer-card">
        <Card
            src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/blueTriangle.webp"
            alt="a logo that says atwell developer"
            href="/projects"
            title="web design + development"
            desc="Trying to make the internet look better.. one website at a time."
            button="Projects"
        />
    </article>

    <div class="top-button">
        <BackToTop />
    </div>
</section>

<style>
    .table-and-logo {
        padding-top: 5em;

        & .popover-morph {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2em;

            @media (width <= 768px) {
                flex-direction: column;
                gap: 0;
            }
        }
    }

    .code-blocks {
        background: transparent;
        box-shadow: none;
    }

    .topics {
        margin: 0;

        & .tech-stack-logo {
            & .aside-links {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 13em;

                @media (width <= 768px) {
                    flex-direction: column;
                    gap: 1em;
                }

                & .drawing-app-link {
                    margin-bottom: 3em;

                    svg {
                        inline-size: clamp(5em, 8vw, 15em);
                        block-size: clamp(5em, 8vw, 15em);
                        fill: var(--clr-dark-400);
                        stroke: var(--clr-success-500);
                        stroke-width: 25;

                        @media (width <= 768px) {
                            stroke-width: 30;
                        }
                    }

                    &:focus,
                    &:focus-within {
                        outline: 1px solid var(--clr-light-500);
                        outline-offset: 5px;
                        background-color: transparent;
                        box-shadow: none;
                    }
                }
            }
        }

        &.mounted {
            opacity: 1;
            scale: 1;
        }

        & .top-button {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0;
            margin: 0;

            & :global(.back-button) {
                margin-top: 1em;
                margin-bottom: 0;
            }

            @media (width <= 500px) {
                gap: 1em;
                margin-top: 3em;
            }
        }

        & .developer-card {
            display: flex;
            justify-content: center;
            background: transparent;
            box-shadow: none;
        }

        & .gsap {
            position: relative;
            contain: layout;
        }
    }

    :global(::view-transition-old(css-image)),
    :global(::view-transition-new(css-image)),
    :global(::view-transition-old(gsap-image)),
    :global(::view-transition-new(gsap-image)) {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(::view-transition-old(css-image)),
    :global(::view-transition-old(gsap-image)) {
        animation: scale-down 0.25s ease forwards;
    }

    :global(::view-transition-new(css-image)),
    :global(::view-transition-new(gsap-image)) {
        animation: scale-up 0.25s ease forwards;
    }
</style>
