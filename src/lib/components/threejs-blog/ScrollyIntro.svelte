<script lang="ts">
    import { setupScrollyIntro } from './scrollyIntro';

    let { oncomplete }: { oncomplete?: () => void } = $props();
</script>

<section class="scrolly">
    <div class="stage">
        <canvas
            class="webgl"
            aria-hidden="true"
            {@attach setupScrollyIntro({ oncomplete })}
        ></canvas>
    </div>

    <div class="chapters">
        <p class="chapter">scroll down to see</p>
        <p class="chapter">examples i made</p>
    </div>
</section>

<style>
    .scrolly {
        position: relative;

        .stage {
            position: sticky;
            inset-block-start: 0;
            block-size: 100svh;
            background: radial-gradient(
                ellipse at 50% 45%,
                color-mix(in oklab, var(--accent) 10%, transparent),
                transparent 70%
            );

            & .webgl {
                display: block;
                inline-size: 100%;
                block-size: 100%;
            }
        }

        .chapters {
            position: relative;
            margin-block-start: -100svh;
            pointer-events: none;

            .chapter {
                --chapter-shift: 0svh;
                --chapter-skew: 0deg display: grid;
                place-content: center;
                block-size: 100svh;
                margin: 0;
                padding-inline: 1.5rem;
                font-family: var(--ultra);
                font-size: clamp(1.75rem, 6vw, 4rem);
                font-weight: 700;
                line-height: 1.05;
                text-align: center;
                text-wrap: balance;
                color: var(--clr-dark-500);
                text-shadow:
                    0 0 1px var(--clr-light-500),
                    -3px -3px 0 var(--clr-btn-700),
                    3px -3px 0 var(--clr-btn-700),
                    -3px 3px 0 var(--clr-btn-700),
                    3px 3px 0 var(--clr-btn-700),
                    -3px 0 0 var(--clr-btn-700),
                    3px 0 0 var(--clr-btn-700),
                    0 -3px 0 var(--clr-btn-700),
                    0 3px 0 var(--clr-btn-700);

                translate: 0 var(--chapter-shift);
                transform: skewY(var(--chapter-skew));

                animation: reveal 1ms linear both;
                animation-timeline: view();
                animation-range: entry 10% entry 100%;

                &:nth-child(1) {
                    --chapter-shift: -20svh;
                    --chapter-skew: -6deg;
                }

                &:nth-child(2) {
                    --chapter-shift: 10svh;
                    --chapter-skew: 5deg;
                }
            }
        }
    }

    @keyframes reveal {
        from {
            opacity: 0;
            translate: 0 calc(var(--chapter-shift) + 3rem);
            transform: skewY(var(--chapter-skew));
        }
        to {
            opacity: 1;
            translate: 0 var(--chapter-shift);
            transform: skewY(var(--chapter-skew));
        }
    }

    @supports not (animation-timeline: view()) {
        .chapter {
            animation: none;
            opacity: 1;
            translate: 0 var(--chapter-shift);
            transform: skewY(var(--chapter-skew));
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .chapter {
            animation: none;
        }
    }
</style>
