<script lang="ts">
    type Segment = { text: string; link?: string };

    interface Props {
        mainTitle?: string;
        mainSubTitle?: string;
        subtitle?: string[];
        text?: (string | Segment[])[];
        indent?: boolean;
    }

    let {
        mainTitle,
        mainSubTitle,
        subtitle = [],
        text = [],
        indent = false,
    }: Props = $props();

    const paragraphs = $derived(
        text.map((p) => (typeof p === 'string' ? [{ text: p }] : p)),
    );
    const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
</script>

<div class="biography-wrapper">
    {#if mainTitle || mainSubTitle}
        <header class="intro">
            {#if mainTitle}
                <h2>{mainTitle}</h2>
            {/if}

            {#if mainSubTitle}
                <p>{mainSubTitle}</p>
            {/if}
        </header>
    {/if}

    <p class="fallback-note">
        Your browser doesn't yet support CSS scroll-driven animations (<code
            >animation-timeline</code
        >), so you're seeing the static fallback text instead of the live
        effect. Try the current version of Chrome, Edge or Safari.
    </p>

    {#each paragraphs as passage, i (i)}
        <section class="passage">
            <p class="desc">{subtitle[i] ?? ''}</p>

            <p class="split">
                {#each passage as seg, si (si)}
                    {#if seg.link}
                        <a
                            href={seg.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="bio-link"
                        >
                            {#each words(seg.text) as word, wi (wi)}
                                <span class="word">{word}</span>
                            {/each}
                        </a>{' '}
                    {:else}
                        {#each words(seg.text) as word, wi (wi)}
                            <span class="word">{word}</span>{' '}
                        {/each}
                    {/if}
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

    .biography-wrapper {
        margin-inline: auto;
        max-inline-size: 95vw;
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
        margin-bottom: 3vh;
        user-select: none;
        padding-inline: 1rem;

        @media (width <= 768px) {
            padding-inline: 0;
        }

        &:first-of-type p.split {
            text-indent: 1rem;
        }

        & p.desc {
            --muted: var(--clr-blue-500);
            color: var(--muted);
            font-family: var(--serif);
            font-size: clamp(var(--h5), 3.2vw, var(--h2));
            font-weight: 800;
            letter-spacing: -1px;
            margin: 0;
            padding: 0;
            text-transform: uppercase;
        }

        & p.split {
            max-inline-size: 100%;
            margin-inline: auto;
            font-size: clamp(var(--h6), 1.5vw, var(--h4));
            font-weight: 500;
            line-height: 1.5;
            z-index: 7;
            color: var(--clr-light-500);
            text-align: start;
            margin-bottom: 0;

            transform: translateY(30px) skewX(-3deg);
            opacity: 0;
            animation: fadeInUp linear both;
            animation-timeline: view();
            animation-range: entry 0% cover 50%;

            @media (width >= 990px) {
                max-inline-size: 100%;
                line-height: 1.75;
            }

            @media (width <= 768px) {
                min-inline-size: 96vw;
                margin-inline: 0;
            }

            @media (prefers-reduced-motion: reduce) {
                animation: none;
                opacity: 1;
                transform: none;
            }
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

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0) skewX(0);
        }
    }
</style>
