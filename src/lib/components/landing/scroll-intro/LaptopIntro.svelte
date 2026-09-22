<script lang="ts">
    import { laptopScene } from '$lib/components/landing/scroll-intro/laptopReveal';
    import type { Attachment } from 'svelte/attachments';
    import { onMount } from 'svelte';

    let { image, onComplete }: { image: string; onComplete: () => void } =
        $props();

    const intro: Attachment<HTMLElement> = (node) =>
        laptopScene(node, onComplete, image);

    onMount(() => {
        document.documentElement.classList.add('dark-intro-page');
        return () =>
            document.documentElement.classList.remove('dark-intro-page');
    });
</script>

<section class="intro" {@attach intro}>
    <div class="welcome-title">
        <!-- <h2></h2> -->
    </div>

    <!-- <div class="icon" style="anchor-name: --icon-anchor">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <title>what to do</title>
            <path
                d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"
                fill="var(--clr-light-500)"
            /></svg
        >

        <div class="tooltip"><h2>scroll down</h2></div> -->
    <!-- </div> -->
</section>

<style>
    .intro {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;

        background-image: url('https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/abstract-bg3a.webp');
        background-repeat: no-repeat;
        background-size: cover;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto 1fr;

        /* & h2 {
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 1.1vw, var(--h4));
            letter-spacing: -1px;
            margin: 0;
            color: var(--clr-light-400);
            text-align: center;
        } */

        /* & .icon {
            position: absolute;
            position-anchor: --welcome-title;
            top: calc(anchor(top) + 8em);
            left: anchor(center);
            transform: translateX(-50%);
            z-index: 3;

            anchor-name: --icon-anchor;
            cursor: pointer;

            @media (width >= 400px) and (width <= 768px) {
                top: calc(anchor(top) + 5.5em);
                left: calc(anchor(center) - 13em);
            }
            @media (width <= 399px) {
                top: calc(anchor(top) + 8em);
            }

            & svg {
                --clr-light-500: oklch(9.693% 0.00001 271.152 / 0.902);
                inline-size: 4.5em;
                block-size: 4.5em;
                fill: var(--clr-light-500);

                @media (width <= 1085px) {
                    inline-size: 3em;
                    block-size: 3em;
                }

                @media (width <= 768px) {
                    --clr-light-500: oklch(78.025% 0.00111 12.77 / 0.902);
                    inline-size: 3em;
                    block-size: 3em;
                }
            }

            & .tooltip {
                position: absolute;
                position-anchor: --icon-anchor;
                top: anchor(bottom);
                left: anchor(center);
                transform: translateX(-30%);

                @media (width <= 768px) {
                    transform: translateX(-35%);
                }

                background-color: var(--clr-gray-600);
                padding: var(--padding-input);
                border-radius: var(--radius);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                display: none;
                z-index: 10;
                white-space: nowrap;
            }

            &:hover .tooltip {
                display: block;
            }
        } */

        & .welcome-title {
            grid-column: 1 / -1;
            grid-row: 1 / 2;
            display: flex;
            justify-content: center;
            align-items: center;

            anchor-name: --welcome-title;

            /* & h2 {
                color: var(--clr-dark-500);
                text-align: center;
                text-transform: uppercase;
                letter-spacing: -1px;
                font-family: var(--thunder);
                font-size: clamp(var(--lg), 15vw, var(--xxl));
                text-shadow: 5px 7px 10px var(--clr-gray-600);
                letter-spacing: -1px;
                margin: 0;
                margin: 0.75em 0 0 0;

                @media (width <= 768px) {
                    --clr-dark-500: oklch(78.025% 0.00111 12.77 / 0.902);
                    text-shadow: 5px 8px 10px var(--clr-gray-600);
                    margin: 1.1em 0 0 0;
                }
            } */
        }
    }

    :global(html.dark-intro-page nav.navigation .nav-link) {
        --clr-light-500: #0a0a0a;
        --clr-light-400: rgba(10, 10, 10, 0.9);
    }
    :global(html.dark-intro-page nav.navigation .mobile .nav-link) {
        --clr-light-500: oklch(94.395% 0.00537 16.154);
        --clr-light-400: oklch(74.395% 0.00537 16.154);
    }
</style>
