<script lang="ts">
    interface Props {
        leftTitle: string;
        rightTitle: string;
    }

    let { leftTitle, rightTitle }: Props = $props();
</script>

<section class="grid" data-grid-wrapper aria-label="bio">
    <article class="grid-card right">
        <h2 class="card-title" data-title-left>{leftTitle}</h2>

        <p data-description-right>
            The path that Gabe has chosen is the frontend path. One of his main
            interests is animations, especially animations on the web. Turning a
            website from being a static site to a dynamic site is what he thinks
            makes your website look a million times better, if you do it right.
        </p>
    </article>

    <article class="grid-card left">
        <h2 class="card-title" data-title-right>{rightTitle}</h2>

        <p data-description-left>
            A clean, crisp design is what Gabe tries to excel at. Visual
            hierarchy, whitespace, colors, typography, scaling, and contrast is
            what he knows best. These topics are the main key to make your
            website designs look professional and appealing to the eye.
        </p>
    </article>
</section>

<style>
    .grid-card {
        display: inline-block;
        margin: 0;
        padding: 1rem 2rem;
        background-color: hsla(0, 0%, 26%, 0.25);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(4px);
        border: 2px solid var(--clr-light-500);
        border-radius: var(--radius);

        @media (max-width: 989px) {
            padding: 0.5rem;
        }

        & .card-title {
            font-family: var(--ultra);
            font-size: clamp(var(--h3), 4.5vw, var(--xxl));
            font-weight: 400;
            text-shadow: 0 0 5px 3px var(--clr-gray-700);
            mix-blend-mode: difference;
            letter-spacing: -1px;
            color: var(--clr-dark-500);
            text-shadow:
                0 0 1px var(--clr-dark-500),
                -3px -3px 0 var(--clr-light-500),
                3px -3px 0 var(--clr-light-500),
                -3px 3px 0 var(--clr-light-500),
                3px 3px 0 var(--clr-light-500),
                -3px 0 0 var(--clr-light-500),
                3px 0 0 var(--clr-light-500),
                0 -3px 0 var(--clr-light-500),
                0 3px 0 var(--clr-light-500);

            @media (max-width: 768px) {
                font-weight: 600;
                text-shadow:
                    0 0 1px var(--clr-dark-500),
                    -2px -2px 0 var(--clr-light-500),
                    2px -2px 0 var(--clr-light-500),
                    -2px 2px 0 var(--clr-light-500),
                    2px 2px 0 var(--clr-light-500),
                    -2px 0 0 var(--clr-light-500),
                    2px 0 0 var(--clr-light-500),
                    0 -2px 0 var(--clr-light-500),
                    0 2px 0 var(--clr-light-500);
            }
        }

        & [data-description-left],
        & [data-description-right] {
            line-height: 1.35;
            text-align: start;
            font-size: clamp(var(--h6), 1.5vw, var(--h3));
            color: var(--clr-light-500);
            margin-top: -1rem;
            hyphens: auto;
            letter-spacing: 0px;
            text-wrap: pretty;
        }

        & [data-description-right] {
            text-align: end;
        }

        &.left {
            box-shadow: -7px 7px 0 var(--clr-light-500);
        }

        &.right {
            box-shadow: 7px 7px 0 var(--clr-light-500);
        }
    }

    .grid[data-grid-wrapper] {
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        grid-template-rows: auto;
        gap: 3rem;

        @media (max-width: 989px) {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .right {
            text-align: end;
            line-height: 1.5;
        }

        .left {
            text-align: start;
            line-height: 1.5;
        }
    }

    .left,
    .right {
        line-height: 1.5;

        [data-title-left] {
            text-align: end;
        }

        [data-title-right] {
            text-align: start;
        }
    }
</style>
