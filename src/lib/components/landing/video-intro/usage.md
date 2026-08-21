# How to use LaptopIntro

```svelte
<script lang="ts">
    import LaptopIntro from '$lib/components/landing/video-intro/LaptopIntro.svelte';
</script>

<LaptopIntro onComplete={() => console.log('intro done')}>
    <img
        src="/images/laptop-screen.png"
        alt="Preview of the atwell.dev homepage"
        draggable="false"
        style="width:100%; height:100%; object-fit:cover;"
    />
</LaptopIntro>
```

You put the screen content inside of `<LaptopIntro>` as children. The screen of the laptop is a static image (`https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/website.webp`).

> **Why a static image?** Originally this used an `<iframe>` pointing at a live page, but compositing an animated page inside the CSS3D-transformed screen caused heavy GPU load and WebGL context loss. A static screenshot avoids that entirely.
