<script lang="ts">
    import { laptopScene } from '$lib/components/landing/video-intro/laptopReveal';
    import type { Attachment } from 'svelte/attachments';

    let { image, onComplete }: { image: string; onComplete: () => void } =
        $props();

    const intro: Attachment<HTMLElement> = (node) =>
        laptopScene(node, onComplete, image);
</script>

<section class="intro" {@attach intro}>
    <h1>scroll down</h1>
</section>

<style>
    .intro {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: relative;

        & h1 {
            font-family: var(--thunder);
            font-size: clamp(var(--h4), 3vw, var(--h3));
            letter-spacing: -1px;
            text-transform: uppercase;

            color: var(--clr-gray-500);
            -webkit-text-stroke: 1px var(--clr-light-400);
            opacity: 0.35;
            background: transparent;
            margin: 0;
            z-index: 0;

            position: absolute;
            top: 5em;
            left: 50%;
            transform: translateX(-50%) scaleY(2);
        }
    }
</style>
