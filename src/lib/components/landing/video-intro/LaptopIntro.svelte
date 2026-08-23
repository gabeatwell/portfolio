<script lang="ts">
    import { laptopScene } from '$lib/components/landing/video-intro/laptopReveal';
    import type { Attachment } from 'svelte/attachments';

    let { image, onComplete }: { image: string; onComplete: () => void } =
        $props();

    const intro: Attachment<HTMLElement> = (node) =>
        laptopScene(node, onComplete, image);
</script>

<section class="intro" {@attach intro}>
    <div class="icon" style="anchor-name: --icon-anchor">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <title>what to do</title>
            <path
                d="M320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM288 224C288 206.3 302.3 192 320 192C337.7 192 352 206.3 352 224C352 241.7 337.7 256 320 256C302.3 256 288 241.7 288 224zM280 288L328 288C341.3 288 352 298.7 352 312L352 400L360 400C373.3 400 384 410.7 384 424C384 437.3 373.3 448 360 448L280 448C266.7 448 256 437.3 256 424C256 410.7 266.7 400 280 400L304 400L304 336L280 336C266.7 336 256 325.3 256 312C256 298.7 266.7 288 280 288z"
                fill="var(--clr-light-500)"
            /></svg
        >

        <div class="tooltip"><h1>scroll down</h1></div>
    </div>
</section>

<style>
    .intro {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: auto 1fr;

        & h1 {
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 1.1vw, var(--h4));
            letter-spacing: -1px;
            margin: 0;
            color: var(--clr-dark-500);
            text-align: center;
        }

        & .icon {
            position: absolute;
            top: 10em;
            left: 50%;
            transform: translateX(-50%);

            anchor-name: --icon-anchor;
            cursor: pointer;

            & svg {
                inline-size: 3.5em;
                block-size: 3.5em;

                @media (width <= 1085px) {
                    inline-size: 3em;
                    block-size: 3em;
                }

                @media (width <= 768px) {
                    inline-size: 2em;
                    block-size: 2em;
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
                padding: 0.25em 0.75em;
                border-radius: var(--radius);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                display: none;
                z-index: 10;
                white-space: nowrap;
            }

            &:hover .tooltip {
                display: block;
            }
        }
    }
</style>
