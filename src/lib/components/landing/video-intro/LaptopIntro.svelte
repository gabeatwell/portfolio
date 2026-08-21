<script lang="ts">
    import { laptopScene } from '$lib/components/landing/video-intro/laptopReveal';

    let { children } = $props();
</script>

<section class="intro" {@attach laptopScene}>
    <div class="screen-content">
        {@render children?.()}
    </div>
</section>

<style>
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
