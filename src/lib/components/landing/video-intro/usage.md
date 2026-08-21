# How to use LaptopIntro

```svelte
<script lang="ts">
    import LaptopIntro from '$lib/components/landing/video-intro/LaptopIntro.svelte';
</script>

<LaptopIntro
    image="/images/laptop-screen.png"
    onComplete={() => console.log('intro done')}
/>
```

The `image` prop is the screenshot shown on the laptop's screen. It's loaded as a **WebGL texture** and mapped directly onto the screen mesh of the 3D model — no iframe, no DOM compositing.

> **Why a texture instead of an iframe?** Originally this used an `<iframe>` (or CSS3D DOM content) composited into the 3D scene, which caused heavy GPU load, WebGL context loss, and a fragile screen-positioning race in production. A texture mapped to the screen mesh is a single renderer, no DOM compositing, and is reliable.

The image should match the screen's aspect ratio (16:10 — the model's screen is 1280×800). The screen mesh is found automatically by matching its aspect ratio, so the model can be re-exported without breaking.
