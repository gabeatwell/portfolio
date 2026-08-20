<script lang="ts">
    import { laptopReveal } from '$lib/attachments/gsap/laptopReveal';
    import type { Component, Snippet } from 'svelte';

    let Hero = $state<Component<any> | null>(null);
    let { children } = $props();

    $effect(() => {
        import('$lib/components/landing/hero-section/hero/Hero.svelte').then(
            (module) => {
                Hero = module.default;
            },
        );
    });
</script>

<section class="intro" {@attach laptopReveal}>
    <video
        src="/videos/LaptopB.mp4"
        id="laptopVideo"
        muted
        playsinline
        preload="auto"
    ></video>

    <div class="screen-content">
        <div class="website-preview">
            {#if Hero}
                <Hero cssBg={'random'} />
            {/if}
        </div>
    </div>

    <div class="real-content">
        {@render children?.()}
    </div>
</section>

<style>
    .intro {
        position: relative;
        height: 100vh;
        overflow: hidden;

        & video {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 2;
        }

        & .screen-content {
            position: absolute;
            z-index: 3;
            transform-origin: center center;
            overflow: hidden;
            visibility: hidden;

            width: 400px;
            height: 250px;
        }

        & .website-preview {
            width: 100%;
            height: 100%;
        }

        & .real-content {
            background: var(--clr-dark-500);
            position: relative;
            z-index: 2;
        }
    }
</style>
