<script lang="ts">
    interface Props {
        mainTitle: string;
        mainSubTitle: string;
        subtitle?: string[];
        text?: string[];
    }

    let { mainTitle, mainSubTitle, subtitle = [], text = [] }: Props = $props();
</script>

<div class="progress-track">
    <div class="progress-fill"></div>
</div>

<div class="sheet">
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
            <p class="chapter">{subtitle[i] ?? ''}</p>
            <p class="split">
                {#each passage.split(/\s+/) as word, wi (wi)}
                    <span
                        class="word"
                        style={`animation-range: entry ${[0, 6, 12, 3, 9][wi % 5]}% cover ${[32, 40, 48, 36, 44][wi % 5]}%`}
                        >{word}</span
                    >
                {/each}
            </p>
        </section>
    {/each}
</div>

<style>
    :root {
        --accent: #3348ff;
        --accent-dim: #3348ff53;
        --bg: var(--clr-dark-500);
        --muted: var(--clr-gray-700);
        --text: var(--clr-light-500);
    }

    .progress-track {
        background-color: var(--muted);
        bottom: 12vh;
        left: 28px;
        opacity: 0.35;
        position: fixed;
        top: 12vh;
        inline-size: 2px;
        z-index: 10;

        @media (width < 640px) {
            display: none;
        }

        & .progress-fill {
            animation: fill-progress linear forwards;
            animation-timeline: scroll(root);
            background-color: var(--accent);
            height: 100%;
            transform: scaleY(0);
            transform-origin: top;
            inline-size: 100%;
        }
    }

    @keyframes fill-progress {
        from {
            transform: scaleY(0);
        }
        to {
            transform: scaleY(1);
        }
    }

    .sheet {
        margin-inline: auto;
        max-inline-size: 95vw;
        padding: 5em clamp(12vh, 28px, 40vh);
    }

    .intro {
        margin-bottom: 50vh;

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
            letter-spacing: -0.02em;
            line-height: 0.98;
            margin: 0 0 1.6rem;
            inline-size: 80%;
            margin-inline: auto;
            padding-top: 0.5em;
        }

        & p {
            color: var(--clr-gray-700);
            display: none;
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 1.2vw, var(--h5));
            line-height: 1.7;
            max-inline-size: 40ch;
            padding-left: 10em;
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

        & .chapter {
            border-top: 1px solid var(--muted);
            color: var(--muted);
            font-family: var(--bronova-bold);
            font-size: clamp(var(--sm), 1vw, var(--h5));
            letter-spacing: 0.14em;
            margin: 0 0 1.4rem;
            padding-top: 0.8rem;
            text-transform: uppercase;
        }

        & p {
            font-family: var(--bronova);
            font-size: clamp(var(--h6), 3.4vw, var(--h3));
            line-height: 1.35;
            margin: 0 0 1.6em;

            max-inline-size: 80vw;
            inline-size: 100%;
        }
    }

    .word {
        animation-duration: 1ms;
        animation-fill-mode: both;
        animation-name: focus-word;
        animation-timeline: view();
        animation-timing-function: linear;
        display: inline-block;
        will-change: font-variation-settings, color, opacity, transform;
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
            transform: skewX(-10deg) translateY(0.12em);
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

        .progress-fill {
            animation: none;
            transform: scaleY(1);
        }
    }
</style>
