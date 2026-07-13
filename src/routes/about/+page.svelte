<script lang="ts">
    import SEO from '$lib/data/SEO.svelte';
    import bio from '$lib/components/about/bio.json';
    import Button from '$lib/components/layout/Button.svelte';
    import Grid from '$lib/components/about/Grid.svelte';
    import Bento from '$lib/components/about/Bento.svelte';
    import AboutHero from '$lib/components/about/about-hero/AboutHero.svelte';
    import Skills from '$lib/components/about/Skills.svelte';
    import Slider from '$lib/components/about/Slider.svelte';
    import PWAInstall from '$lib/components/about/pwa-popovers/PWAInstall.svelte';
    import PWAVideo from '$lib/components/about/pwa-popovers/PWAVideo.svelte';

    import { gsap, ScrollTrigger } from '$lib/data/gsap';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';

    const breakpoints = getBreakpoints();

    // gsap scroll
    $effect(() => {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const isMobile = breakpoints.isMobile;
            const container = document.querySelector('.biography');
            const targets = gsap.utils.toArray(
                '.biography .bio-paragraph, .biography .three-button, .biography [data-flex-container]',
            );
            const startPoint = isMobile ? 'top 55%' : 'top 90%';

            if (!targets.length) return;

            gsap.set(targets, { opacity: 0, y: 30 });

            const scrollFade = gsap.to(targets, {
                opacity: 1,
                y: 0,
                ease: 'power2.out',
                duration: 2,
                stagger: 0.5,
                scrollTrigger: {
                    trigger: container,
                    start: startPoint,
                    scrub: 1,
                },
            });

            return () => {
                scrollFade?.kill();
                ScrollTrigger.getAll().forEach((t) => t.kill());
            };
        });

        return () => mm.revert();
    });
</script>

<SEO
    title="About Gabe"
    description="All about Gabriel Atwell"
    keywords="about gabe, about gabriel, gabe's bio"
/>

<div class="about-me" aria-label="bio">
    <section class="about-section">
        <article id="bio">
            <div class="hero-section">
                <AboutHero title="Gabe" viewTransitionName="about-heading" />
            </div>

            <div class="biography" aria-label="bio">
                {#each bio as paragraph}
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    <p class="bio-paragraph indent">{@html paragraph.text}</p>
                {/each}

                <article
                    class="three-article"
                    aria-label="bio"
                    data-three-section
                >
                    {#if breakpoints.isDesktop}
                        <p class="bio-paragraph" data-desktop>
                            If you want to see stuff I've been working on, when
                            you load a page press tab twice. a button should
                            appear that says "<span>experiments</span>".
                        </p>
                    {/if}
                </article>

                <p class="bio-paragraph indent">
                    Please note: This is a <span>pwa</span> (progressive web app)
                    so you can install it on your device if you want to! This makes
                    your website able to be used on any device.. mobile, tablet, laptop,
                    and desktop. It's like having a mobile app that is not made with
                    native technologies! There is also offline capabilities, so if
                    your internet goes out, you can still access the site because
                    your device downloads and caches the whole site!
                </p>

                <div data-flex-container>
                    <PWAInstall
                        title="How to install the PWA"
                        popoverTitle="How to install the PWA:"
                        text="It works on Android and iPhone. If you're using an iPhone device, you have to tap the share icon in the Safari browser and choose the 'Add to Home Screen' option.. that's the only way to save a pwa on an iOS device. On an iMac, follow the same steps using Safari but choose 'Add to Dock' instead."
                        text2="If you're on an Android device you should see an install button on the bottom-right of the screen. If you press it, an installation prompt should appear. The prompt will only appear after some user interactions (clicks)."
                        text3="Other than mobile devices, you should see the install button (on tablet, laptop, desktop). If you are having any issues or you have any questions, please feel free to contact me!"
                    /> <span>and</span>
                    <PWAVideo
                        title="Watch: Building a PWA with Svelte"
                        videoSrc="https://www.youtube-nocookie.com/embed/_wiOcdEVgks"
                    />
                </div>
            </div>

            {#if breakpoints.isDesktop}
                <Slider />
            {:else}
                <Skills />
            {/if}

            <Grid leftTitle="Frontend" rightTitle="Design Based" />

            <Bento />
        </article>
    </section>
</div>

<style>
    :root {
        --100: 100%;
    }

    .about-me {
        inline-size: var(--100);
        margin-inline: auto;
        padding-top: 0;

        & .about-section {
            display: block;
            margin-inline: auto;
            text-align: center;
            inline-size: var(--100);
            color: var(--clr-light-500);
            margin-top: 0;

            @media (width >= 990px) {
                display: block;
                inline-size: var(--100);
                margin-inline: auto;
            }

            & article {
                font-size: clamp(var(--xs), 2vw, var(--sm));
                inline-size: var(--100);
                margin-inline: auto;
                background-color: transparent;
                box-shadow: none;
                color: var(--clr-light-500);
                margin-bottom: 0;

                @media (width >= 990px) {
                    inline-size: var(--100);
                    margin-inline: auto;
                }

                &#bio {
                    margin-top: -5em;
                }
            }

            & .biography {
                color: var(--white);
                position: relative;
                opacity: 1;

                @media (width >= 990px) {
                    margin-bottom: -5rem;
                }

                & .indent {
                    text-indent: 2em;
                }

                & .three-article {
                    margin-inline: auto;
                    margin-block: 2.5em;

                    padding: 0;
                    inline-size: fit-content;
                    color: var(--clr-light-500);
                    font-size: clamp(var(--xs), 2vw, var(--sm));

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1em;

                    @media (width <= 768px) {
                        margin-block: 3em;
                    }
                }

                & [data-three-section] {
                    inline-size: 80vw;
                    margin-inline: auto;
                }

                & .bio-paragraph {
                    opacity: 0;
                    will-change: transform, opacity;

                    max-inline-size: var(--100);
                    margin-inline: auto;
                    font-size: clamp(var(--h6), 1.5vw, var(--h4));
                    font-weight: 500;
                    line-height: 1.5;
                    z-index: 7;
                    color: var(--clr-light-500);
                    text-align: start;
                    margin-bottom: 0;

                    @media (width >= 990px) {
                        max-inline-size: 98%;
                        line-height: 1.75;
                    }

                    /* &:not([data-three-desc]) {
                        @media (width <= 768px) {
                            inline-size: 100vw;
                        }
                    } */

                    & span {
                        font-weight: 800;
                        letter-spacing: 1px;
                        color: var(--clr-light-350);
                    }

                    &[data-desktop] {
                        inline-size: 85%;
                    }
                }

                & [data-flex-container] {
                    display: flex;
                    justify-content: flex-start;
                    gap: 0.75em;
                    padding-left: calc(5em - 1rem);

                    @media (width <= 768px) {
                        padding-left: 0;
                        justify-content: center;
                    }

                    & span {
                        color: var(--clr-light-500);
                        padding-top: 0.25rem;

                        @media (width <= 768px) {
                            padding-top: 0.5rem;
                        }

                        @media (width <= 500px) {
                            padding-top: 2rem;
                        }
                    }
                }
            }
        }

        & p {
            text-align: start;
            color: var(--clr-light-500);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .about-me .about-section .biography .bio-paragraph {
            opacity: 1;
            transform: none;
        }
    }
</style>
