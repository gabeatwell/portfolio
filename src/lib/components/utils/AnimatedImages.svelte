<script lang="ts">
    import Image from '$lib/components/layout/Image.svelte';
    import { animatedImage } from '$lib/attachments/gsap/animatedImage';

    interface Props {
        src: string;
        alt: string;
        width?: number;
        scale?: number;
    }

    let { src, alt, width, scale }: Props = $props();
</script>

<section {@attach animatedImage(scale)}>
    <div class="imgClass">
        <Image {src} {alt} width={width?.toString()} aspectRatio="16/9" />
    </div>
</section>

<style>
    section {
        position: relative;
    }
</style>
