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
    h1 {
        font-family: var(--ultra);
        font-size: clamp(var(--h4), 3vw, var(--h3));
        letter-spacing: 1px;

        color: var(--clr-success-500);
        background: transparent;
        margin: 0;
        z-index: 0;

        position: absolute;
        top: 5em;
        left: 50%;
        transform: translateX(-50%);
    }
    .intro {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        position: relative;
    }
</style>
