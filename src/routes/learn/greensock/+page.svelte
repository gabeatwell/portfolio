<script lang="ts">
    import SEO from '$lib/data/SEO.svelte';
    import Title from '$lib/components/layout/titles/Title.svelte';
    import Button from '$lib/components/layout/Button.svelte';
    import Iframe from '$lib/components/learn/pages/Iframe.svelte';
    import Learn from '$lib/components/learn/pages/Learn.svelte';
    import Details from '$lib/components/learn/pages/Details.svelte';

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
    description="web animations"
    keywords="GSAP, greensock animation platform, web animation, greensock how to"
/>

<section class="learn-gsap">
    <div class="content">
        <div class="title-spacing">
            <Title
                img="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/GSAP-Dark.svg"
                width="50vw"
                title="Greensock Animation Platform"
                scaleY={2.8}
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
        & .title-spacing {
            margin-top: 5em;
            margin-bottom: 0;

            @media (width <= 768px) {
                margin-top: 0;
                margin-bottom: 6em;
            }
        }

        & .gsap-details {
            & .center-detail {
                max-inline-size: 90vw;
                margin-inline: auto;
                margin-top: calc(-1 * 8em);

                :global(details) {
                    position: relative;
                    border: none;
                    outline: none;
                    -webkit-appearance: none;
                    appearance: none;
                    overflow: clip;
                    padding: 1rem;
                    inline-size: 100ch;

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
                    border-color: var(--clr-gray-700);

                    @media (width <= 768px) {
                        color: var(--clr-blue-500);
                        border-color: var(--clr-gray-700);
                    }
                }

                :global(.text) {
                    color: var(--clr-light-500);
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
