<script lang="ts">
    import { setupScrollyIntro } from './scrollyIntro';
</script>

<section class="scrolly">
    <div class="stage">
        <canvas class="webgl" aria-hidden="true" {@attach setupScrollyIntro}
        ></canvas>
    </div>

    <article class="chapter">
        <h2>once upon a time</h2>
    </article>
    <article class="chapter">
        <h2>there was a blog</h2>
    </article>
    <article class="chapter">
        <h2>that taught three.js</h2>
    </article>
</section>

<style>
    .scrolly {
        position: relative;

        .stage {
            position: sticky;
            inset-block-start: 0;
            block-size: 100svh;

            & .webgl {
                display: block;
                inline-size: 100%;
                block-size: 100%;
            }
        }

        .chapter {
            display: grid;
            place-content: center;
            block-size: 100svh;
            padding-inline: 1.5rem;
            text-align: center;

            animation: reveal 1ms linear;
            animation-timeline: view();
            animation-range: entry 20% cover 55%;
        }
    }

    @keyframes reveal {
        from {
            opacity: 0;
            transform: translateY(3rem);
        }
        to {
            opacity: 1;
            transform: none;
        }
    }

    @supports not (animation-timeline: view()) {
        .chapter {
            animation: none;
            opacity: 1;
            transform: none;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .chapter {
            animation: none;
        }
    }
</style>
