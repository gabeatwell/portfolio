<script lang="ts">
    import SEO from '#lib/data/SEO.svelte';
    import Title from '#lib/components/layout/titles/Title.svelte';
    import Button from '#lib/components/layout/buttons/Button.svelte';
    import Iframe from '#lib/components/learn/pages/Iframe.svelte';
    import Learn from '#lib/components/learn/pages/Learn.svelte';
    import Details from '#lib/components/learn/pages/Details.svelte';

    interface DetailsItem {
        summary: string;
        content: string;
    }

    interface Props {
        data: {
            greensockDetails: DetailsItem[];
        };
    }

    let { data }: Props = $props();
</script>

<SEO
    title="Web animations with GSAP"
    description="Learn the basics of Greensock Animation Platform"
    keywords="GSAP, greensock animation platform, web animation, greensock how to"
/>

<section class="learn-gsap">
    <div class="content">
        <div class="title-band">
            <Title
                img="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@assets-1/images/GSAP-Dark.svg"
                width="min(50vw, 41svh, 26rem)"
                ratio={82 / 30}
                scaleX={1.8}
                scaleY={4.2}
                title="Greensock Animation Platform"
                viewTransitionName="gsap-logo"
            />
        </div>

        <main class="gsap-details">
            <div class="center-detail">
                <Details items={data.greensockDetails} />
            </div>

            <Iframe
                src="https://www.youtube-nocookie.com/embed/AW1yfBKRMKc"
                title="YouTube video player"
            />

            <Learn href="https://greensock.com/resources" title="greensock" />

            <div class="back-button">
                <Button href="/learn" title="Back" />
            </div>
        </main>
    </div>
</section>

<style>
    :root {
        --100: 100%;
        interpolate-size: allow-keywords;
    }

    .learn-gsap {
        & .title-band {
            block-size: var(--learn-band);
            display: grid;
            place-items: center;
        }

        & .gsap-details {
            position: relative;
            z-index: 10;

            & .center-detail {
                max-inline-size: min(100ch, 90vw);
                margin-inline: auto;
                margin-top: calc(var(--learn-tuck) * -1);

                :global(details) {
                    position: relative;
                    border: none;
                    outline: none;
                    -webkit-appearance: none;
                    appearance: none;
                    padding: 1rem;
                    inline-size: min(100ch, 100%);

                    &::details-content {
                        opacity: 0;
                        block-size: 0;
                        overflow-y: clip;
                        transition:
                            content-visibility 1s allow-discrete,
                            opacity 1s,
                            block-size 1s;
                    }

                    &[open]::details-content {
                        opacity: 1;
                        block-size: auto;
                    }
                }

                :global(summary) {
                    color: var(--clr-blue-500);

                    @media (width <= 768px) {
                        color: var(--clr-blue-500);
                    }
                }

                :global(.image-container img) {
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    height: auto;
                }

                :global(.image-container) {
                    margin: 1rem 0;
                    text-align: center;
                }
            }

            & .back-button {
                text-align: center;
            }
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(100px);
            visibility: hidden;
        }
        to {
            opacity: 1;
            transform: translateY(0);
            visibility: visible;
        }
    }
</style>
