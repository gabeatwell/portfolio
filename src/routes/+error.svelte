<script>
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';
    import {
        DEFAULT_DURATION,
        DEFAULT_DELAY,
    } from '$lib/data/context/animationTimings.svelte';
    import SEO from '$lib/data/SEO.svelte';
    import Image from '$lib/components/layout/Image.svelte';

    $effect(() => {
        console.log(`There is a ${page.status} error!`);
    });
</script>

<SEO
    title="There's been an error!"
    description="You've encountered an error!"
    keywords="error, gabe's error page"
/>

<div
    aria-label="error"
    transition:fade={{ delay: DEFAULT_DELAY, duration: DEFAULT_DURATION }}
>
    <div class="error">
        <div class="image">
            <Image
                src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/error.webp"
                alt="an error has occurred"
                width="300"
                aspectRatio="1/1"
            />
        </div>

        <h2 class="subtitle">You have encountered an error</h2>

        <h1 class="status">{page.status}</h1>

        <p class="message">{page.error?.message}</p>
    </div>
</div>

<style>
    div {
        padding: 1rem 1.5rem;
        height: 80vh;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        & .error {
            inline-size: 100%;
            margin-top: clamp(5em, 5vh, 10em);

            display: flex;
            flex-direction: column;
            gap: 1em;

            anchor-name: --error;

            @media (width <= 768px) {
                transform: translateX(-12%);
            }

            & .status {
                font-family: var(--ultra);
                font-size: clamp(var(--h5), 40vw, var(--xxxxl));
                font-weight: 900;
                -webkit-text-stroke: 5px var(--clr-success-500);
                margin-inline: auto;
                text-align: center;
                color: lightblue;
                font-family: var(--ultra);
                letter-spacing: 7px;
                text-wrap: balance;
                z-index: 5;

                anchor-name: --status;
            }

            & .subtitle {
                font-family: var(--bronova);
                font-size: clamp(var(--h6), 1.25vw, var(--xl));
                font-weight: 600;
                margin-inline: auto;
                margin-block: 0;
                text-align: center;
                color: var(--clr-light-500);
                font-family: var(--bronova);
                letter-spacing: 5px;
                text-wrap: balance;
                line-height: 1.1;

                @media (width <= 768px) {
                    transform: translateX(15%);
                    letter-spacing: 0;
                }
            }

            & .message {
                font-family: var(--bronova);
                font-size: clamp(var(--h5), 3vw, var(--h3));
                font-weight: 400;
                letter-spacing: 5px;
                line-height: 1.1;
                text-align: start;
                padding: var(--padding-button-lg);
                color: var(--clr-light-500);
                text-shadow: 0 0 8px var(--clr-dark-500);
                text-align: center;
                text-wrap: none;
                z-index: 6;

                position: absolute;
                position-anchor: --status;
                top: anchor(center);
                left: anchor(center);
                transform: translate(-50%, -50%);

                @media (width <= 768px) {
                    text-shadow: 0 0 5px var(--clr-dark-500);
                }
            }

            & .image {
                inline-size: clamp(300px, 28vw, 400px);

                position: absolute;
                position-anchor: --status;
                top: anchor(center);
                left: anchor(center);
                transform: translate(-50%, -50%);

                z-index: 4;

                @media (width <= 768px) {
                    left: calc(anchor(center) - 0.25em);
                }
            }
        }
    }
</style>
