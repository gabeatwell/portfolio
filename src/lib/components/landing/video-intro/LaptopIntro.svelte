<script lang="ts">
    import { laptopScene } from '$lib/components/landing/video-intro/laptopReveal';
    import type { Attachment } from 'svelte/attachments';
    import type { Snippet } from 'svelte';

    let {
        children,
        onComplete,
    }: { children?: Snippet; onComplete: () => void } = $props();

    const intro: Attachment<HTMLElement> = (node) =>
        laptopScene(node, onComplete);
</script>

<section class="intro" {@attach intro}>
    <div class="screen-content">
        <h1>scroll down</h1>
        {@render children?.()}
    </div>
</section>

<style>
    h1 {
        font-family: var(--ultra);
        font-size: clamp(var(--lg), 3vw, var(--h3));
        letter-spacing: 1px;

        color: var(--clr-success-500);
        background: transparent;
        margin: 0;
    }
    .intro {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;

        & .screen-content {
            width: 1280px;
            height: 800px;
            overflow: hidden;
            background: transparent;
            border-radius: var(--radius);
            /* background-color: var(--clr-light-400); */
        }
    }
</style>
