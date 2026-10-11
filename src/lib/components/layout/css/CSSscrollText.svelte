<script lang="ts">
    interface Props {
        mainTitle: string;
        mainSubTitle?: string;
        subtitle?: string[];
        text?: string[];
    }

    let { mainTitle, mainSubTitle, subtitle = [], text = [] }: Props = $props();
</script>

<div class="titles">
    <header class="intro">
        <h2>{mainTitle}</h2>
        <p>{mainSubTitle}</p>
    </header>

    <p class="fallback-note">
        Your browser doesn't yet support CSS scroll-driven animations (<code
            >animation-timeline</code
        >), so you're seeing the static fallback text instead of the live
        effect. Try the current version of Chrome, Edge or Safari.
    </p>

    {#each text as passage, i (i)}
        <section class="passage">
            <p class="desc">{subtitle[i] ?? ''}</p>
            <p class="split">
                {#each passage.trim().split(/\s+/) as word}
                    <span class="word">{word}</span>{' '}
                {/each}
            </p>
        </section>
    {/each}
</div>

<style>
    :root {
        --accent: var(--clr-warning-500);
        --bg: var(--clr-dark-500);
        --muted: var(--clr-gray-700);
        --text: var(--clr-light-500);
    }

    @keyframes fill-progress {
        from {
            transform: scaleY(0);
        }
        to {
            transform: scaleY(1);
        }
    }

    .titles {
        margin-inline: auto;
        max-inline-size: 95vw;
        padding: 5em clamp(1.5rem, 7vw, 12rem);
        overflow-x: clip;
    }

    .intro {
        margin-bottom: 10vh;
        display: flex;
        flex-direction: column;
        gap: clamp(1rem, 2vw, 2rem);
        align-items: center;

        & h2 {
            color: var(--clr-dark-500);
            text-shadow:
                0 0 1px var(--clr-light-500),
                -1px -1px 0 var(--clr-warning-500),
                1px -1px 0 var(--clr-warning-500),
                -1px 1px 0 var(--clr-warning-500),
                1px 1px 0 var(--clr-warning-500),
                -1px 0 0 var(--clr-warning-500),
                1px 0 0 var(--clr-warning-500),
                0 -1px 0 var(--clr-warning-500),
                0 1px 0 var(--clr-warning-500);
            font-family: var(--ultra);
            font-size: clamp(2.6rem, 8vw, 5.4rem);
            font-variation-settings:
                'wght' 780,
                'opsz' 144,
                'SOFT' 0,
                'WONK' 0;
            line-height: 0.98;
            margin: 0 0 1.6rem;
            inline-size: 80%;
            margin-inline: auto;
            padding-top: 0.5em;
            letter-spacing: -12px;

            @media (width <= 768px) {
                letter-spacing: -8px;
            }
        }

        & p {
            color: var(--clr-gray-700);
            display: none;
            font-family: var(--thunder);
            font-size: clamp(var(--sm), 1.7vw, var(--h4));
            font-weight: 400;
            line-height: 1.7;
            max-inline-size: 40ch;
            margin-inline-end: -3em;
            margin-block-start: -2.5em;
        }

        @supports (animation-timeline: view()) {
            p {
                display: block;
            }
        }
    }

    .fallback-note {
        background-color: var(--clr-dark-500);
        border: 1px solid #e2c877;
        border-radius: 4px;
        display: none;
        font-family: var(--mono);
        font-size: var(--h5);
        line-height: 1.5;
        margin: 0 0 3rem;
        padding: 0.9rem 1.1rem;

        @supports not (animation-timeline: view()) {
            display: block;
        }
    }

    section.passage {
        margin-bottom: 16vh;
        user-select: none;

        & .desc {
            --muted: var(--clr-blue-500);
            border-top: 3px solid var(--clr-light-300);
            color: var(--muted);
            font-family: var(--serif);
            font-size: clamp(var(--h5), 3.2vw, var(--h2));
            font-weight: 800;
            letter-spacing: -1px;
            margin: 0 0 1.4rem;
            padding-top: 0.8rem;
            text-transform: uppercase;
        }

        & p {
            font-family: var(--bronova);
            font-size: clamp(var(--h6), 1.5vw, var(--h4));
            font-weight: 200;
            line-height: 1.35;
            margin: 0 0 1.6em;

            max-inline-size: min(60ch, 100%);
            margin-inline: 0;
        }
    }

    .word {
        display: inline-block;

        --entry: 0%;
        --cover: 32%;

        animation: focus-word;
        animation-duration: 1ms;
        animation-timing-function: linear;
        animation-fill-mode: both;
        animation-timeline: view();
        animation-range: entry var(--entry) cover var(--cover);

        &:nth-child(5n + 2) {
            --entry: 6%;
            --cover: 40%;
        }
        &:nth-child(5n + 3) {
            --entry: 12%;
            --cover: 48%;
        }
        &:nth-child(5n + 4) {
            --entry: 18%;
            --cover: 36%;
        }
        &:nth-child(5n + 5) {
            --entry: 29%;
            --cover: 44%;
        }
    }

    @keyframes focus-word {
        0% {
            color: var(--muted);
            font-variation-settings:
                'wght' 140,
                'opsz' 9,
                'SOFT' 100,
                'WONK' 1;
            opacity: 0.3;
            transform: skewX(-10deg) translateY(0.8em);
        }
        100% {
            color: var(--text);
            font-variation-settings:
                'wght' 650,
                'opsz' 40,
                'SOFT' 0,
                'WONK' 0;
            opacity: 1;
            transform: skewX(0deg) translateY(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .word {
            animation: none;
            color: var(--text);
            font-variation-settings:
                'wght' 500,
                'opsz' 30,
                'SOFT' 20,
                'WONK' 0;
            opacity: 1;
            transform: none;
        }
    }
</style>
