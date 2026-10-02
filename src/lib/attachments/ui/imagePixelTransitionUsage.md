# usage

```svelte
<script lang="ts">
    import { pixelTransition } from '#lib/attachments/ui/imagePixelTransition.js';
</script>

<div class="spacer">scroll ↓</div>

<!-- 1. attached straight to the img -->
<img
    {@attach pixelTransition({ scroll: { color: 'var(--clr-light-500)' } })}
    src="https://images.pexels.com/photos/39419712/pexels-photo-39419712.jpeg"
    alt="direct attach test"
    crossorigin="anonymous"
/>

<!-- 2. attached to a wrapper -->
<div class="wrap-test">
    <img
        {@attach pixelTransition({ scroll: { band: 0.4, spread: 6 } })}
        src="https://images.pexels.com/photos/39419712/pexels-photo-39419712.jpeg"
        alt="wrapper test"
        crossorigin="anonymous"
    />
</div>

<!-- 3. no image at all → palette/fillColor + stroke path -->
<div
    class="flat"
    {@attach pixelTransition({
        scroll: { color: 'var(--clr-gray-700)', stroke: 'var(--clr-dark-500)' },
    })}
></div>

<div class="spacer"></div>

<style>
    .spacer {
        block-size: 100vh;
        display: grid;
        place-items: center;
        background: #000;
        color: #fff;
    }
    img {
        display: block;
        inline-size: 100%;
        block-size: auto;
    }
    .wrap-test {
        overflow: hidden;
    }
    .flat {
        block-size: 80vh;
        background: var(--clr-light-400);
    }
</style>
```
