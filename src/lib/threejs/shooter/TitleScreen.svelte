<script lang="ts">
    import { attachSlaynetTitle } from '$lib/attachments/threejs/attachSlaynetTitle';

    interface Props {
        onStart: () => void;
    }

    let { onStart }: Props = $props();
</script>

<div class="title-screen" {@attach attachSlaynetTitle}>
    <div class="content">
        <h1 class="title">SLAYNET</h1>
        <div class="tagline">Kill the putahmen</div>
        <button class="start-button" onclick={onStart} ontouchstart={onStart}>
            Start
        </button>
        <div class="controls-hint">
            <ul>
                <li>Move = W, A, S, D</li>
                <li>Fire = space bar</li>
                <li>Orbit controls = letter "r"</li>
            </ul>
        </div>
    </div>
</div>

<style>
    .title-screen {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--clr-dark-400);
        z-index: 300;
        font-family: var(--bronova);

        & .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            text-align: center;

            @media (orientation: landscape) and (max-height: 500px) {
                gap: 0.25rem;
                padding: 0.5rem;
            }

            & .title {
                font-family: var(--ultra);
                font-size: clamp(4rem, 20vw, 13rem);
                margin: 0;
                text-transform: uppercase;
                letter-spacing: -0.15em;
                color: var(--clr-dark-500);
                text-shadow:
                    0 0 2px var(--clr-dark-500),
                    -3px -3px 0 var(--clr-warning-500),
                    3px -3px 0 var(--clr-warning-500),
                    -3px 3px 0 var(--clr-warning-500),
                    3px 3px 0 var(--clr-warning-500);

                @media (width <= 768px) {
                    margin-top: 3em;
                }

                @media (orientation: landscape) and (max-height: 500px) {
                    font-size: clamp(2.5rem, 10vh, 5rem);
                    margin-top: 0;
                    display: none;
                }
            }

            & .tagline {
                font-size: clamp(var(--sm), 1.5vw, var(--h3));
                opacity: 0.6;
                color: var(--clr-light-500);
                letter-spacing: 0.3em;
                text-transform: uppercase;

                @media (orientation: landscape) and (max-height: 500px) {
                    font-size: var(--xs);
                    display: none;
                }
            }

            & .start-button {
                background: transparent;
                inline-size: fit-content;
                color: var(--clr-light-500);
                border: 2px solid var(--clr-light-500);
                border-radius: 0.5rem;
                padding: 1rem 3rem;
                font-family: var(--bronova, sans-serif);
                font-size: clamp(var(--h5, 1.2rem), 3vw, var(--h4, 1.5rem));
                font-weight: 700;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                transition: all 0.3s ease;
                margin: 1rem 0 0 0;

                @media (orientation: landscape) and (max-height: 500px) {
                    padding: 0.5rem 1.5rem;
                    font-size: var(--sm);
                    margin: 0.25rem 0 0 0;
                }

                &:hover {
                    background: var(--clr-light-500);
                    color: var(--clr-dark-500, #0a0a0a);
                }

                &:active {
                    transform: scale(0.97);
                }
            }

            & .controls-hint {
                margin-top: 2rem;
                opacity: 0.4;
                font-size: clamp(var(--xs, 0.75rem), 1.5vw, var(--sm, 0.9rem));
                color: var(--clr-light-500);

                @media (orientation: landscape) and (max-height: 500px) {
                    margin-top: 0.25rem;
                    font-size: var(--xxs);
                    display: none;
                }

                & ul {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0;
                    margin: 0;
                    padding: 0;
                    list-style-type: none;

                    @media (width <= 768px) {
                        margin: 0 0 2em 0;
                    }

                    @media (orientation: landscape) and (max-height: 500px) {
                        margin: 0;
                        flex-direction: row;
                        gap: 0.5rem;
                        display: none;
                    }
                }
            }
        }
    }
</style>
