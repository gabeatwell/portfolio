# How to use LaptopIntro

```svelte
<script lang="ts">
    import LaptopIntro from '$lib/components/landing/video-intro/LaptopIntro.svelte';
</script>

<LaptopIntro>
    <iframe
        src="/projects/utils/laptop-screen"
        title="laptop screen"
        loading="lazy"
        style="width:100%; height:100%; border:none;"
    ></iframe>
</LaptopIntro>
```

You use an `iframe` inside of `<LaptopIntro>` so the screen of the laptop points to an actual page.

For this project I created a page with just the main page ("/") content on a dark background in the `/projects/utils/laptop-screen` route. I made this page so there's no heavy animations so the iframe works.
