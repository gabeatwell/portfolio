<script lang="ts">
    import Image from '$lib/components/layout/Image.svelte';
    import { gsap } from '$lib/data/gsap';

    interface Props {
        src: string;
        alt: string;
        width?: number;
        scale?: number;
    }

    let { src, alt, width, scale }: Props = $props();

    $effect(() => {
        const tween = gsap.from('.imgClass', {
            display: 'block',
            duration: 3,
            scale: scale,
            opacity: 0,
            ease: 'power2.out',
            stagger: 0.5,
        });

        return () => {
            tween.kill();
        };
    });
</script>

<section>
    <div class="imgClass">
        <Image {src} {alt} width={width?.toString()} aspectRatio="16/9" />
    </div>
</section>

<style>
    section {
        position: relative;
    }
</style>
