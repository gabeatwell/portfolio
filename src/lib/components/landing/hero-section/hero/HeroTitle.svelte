<script lang="ts">
    import { heroContentState } from './contentFunctions.svelte';
    import HandDrawnUnderline from './HandDrawnUnderline.svelte';

    interface Props {
        primaryTitle?: string;
        secondaryTitle?: string;
    }

    let {
        primaryTitle = 'Gabe Atwell',
        secondaryTitle = 'Designer & Developer',
    }: Props = $props();
</script>

<header class="title-container">
    <h1 class="hero-title glitch">
        <!-- primary line -->
        <span class="word first-line">
            {#each heroContentState.getWordChars(0).chars as char, charIndex}
                <span class="char" style="--i: {charIndex}">{char}</span>
            {/each}

            <span class="char space">&nbsp;</span>

            {#each heroContentState.getWordChars(1).chars as char, charIndex}
                <span
                    class="char"
                    style="--i: {heroContentState.getWordChars(0).chars.length +
                        1 +
                        charIndex}">{char}</span
                >
            {/each}

            <span class="underline-wrapper">
                <HandDrawnUnderline width={100} height={50} />
            </span>
        </span>

        <!-- secondary line -->
        <span class="word second-line">
            {#each heroContentState.secondaryText.split('') as char, charIndex}
                <span class="char" style="--i: {12 + charIndex}"
                    >{char === ' ' ? '\u00A0' : char}</span
                >
            {/each}
        </span>
    </h1>
</header>

<style>
    .title-container {
        margin-bottom: 2rem;

        @media (width <= 768px) {
            margin-block: 1rem;
        }

        & .hero-title {
            font-family: var(--ultra);
            font-size: clamp(var(--h3), 7vw, var(--xxl));
            font-weight: 900;
            color: var(--clr-dark-500);
            filter: drop-shadow(0 0 5px var(--clr-light-500));
            line-height: 1;
            margin: 0;
            margin-bottom: 0.2em;
            word-wrap: normal;
            overflow-wrap: break-word;
            hyphens: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            user-select: none;

            @media (height <= 768px) {
                line-height: 1.1;
                margin-bottom: 1em;
            }

            & .first-line {
                font-family: var(--thunder);
                font-size: clamp(var(--h2), 7vw, var(--xxl));
                font-weight: 700;
                color: var(--clr-dark-500);
                filter: drop-shadow(0 0 5px var(--clr-light-500));
                display: inline-block;
                transform: scaleX(1.7) scaleY(2);
                text-transform: uppercase;
                letter-spacing: -0.0195em;

                @media (width <= 768px) {
                    transform: scaleX(1.3) scaleY(1.4);
                }
            }

            & .second-line {
                font-family: var(--ultra);
                font-size: clamp(var(--h6), 4.2vw, var(--h2));
                font-weight: 700;
                letter-spacing: 0.03em;
                margin-top: 0.1em;
                display: block;
            }

            & .underline-wrapper {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-top: -0.8em;
                margin-left: 0.75em;
                transform: scaleX(1.4);
            }
        }
    }
</style>
