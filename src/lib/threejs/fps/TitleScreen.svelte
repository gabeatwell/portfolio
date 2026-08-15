<script lang="ts">
    import { attachKillgridTitle } from '$lib/attachments/threejs/attachKillgridTitle';

    interface Props {
        onStart: () => void;
    }

    let { onStart }: Props = $props();
</script>

<div class="title-screen" {@attach attachKillgridTitle}>
    <div class="content">
        <h1 class="title">KILLGRID</h1>

        <div class="tagline">Survive the grid</div>

        <button class="start-button" onclick={onStart} ontouchstart={onStart}>
            Start
        </button>

        <div class="controls-hint">
            <p>WASD to move &middot; Click to shoot</p>
            <p>SPACE to jump &middot; SHIFT to run</p>
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
        background: var(--clr-dark-500, #0a0a0a);
        z-index: 300;
        font-family: var(--bronova, sans-serif);

        & .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            text-align: center;

            @media (width <= 768px) {
                margin-top: 5em;
            }

            & .title {
                font-family: var(--thunder);
                font-size: clamp(5rem, 20vw, 13rem);
                margin: 0;
                text-transform: uppercase;
                font-style: italic;
                letter-spacing: 0.15em;
                color: var(--clr-dark-500, #0a0a0a);
                text-shadow:
                    0 0 2px var(--clr-light-500, #fff),
                    -3px -3px 0 var(--clr-fail-500, #e74c3c),
                    3px -3px 0 var(--clr-fail-500, #e74c3c),
                    -3px 3px 0 var(--clr-fail-500, #e74c3c),
                    3px 3px 0 var(--clr-fail-500, #e74c3c);
            }

            & .tagline {
                font-size: clamp(var(--h5, 1.2rem), 2.5vw, var(--h3, 1.8rem));
                opacity: 0.6;
                color: var(--clr-light-500, #fff);
                letter-spacing: 0.3em;
                text-transform: uppercase;
            }

            & .start-button {
                background: transparent;
                color: var(--clr-light-500, #fff);
                border: 2px solid var(--clr-light-500, #fff);
                border-radius: 0.5rem;
                padding: 1rem 3rem;
                font-family: var(--bronova, sans-serif);
                font-size: clamp(var(--h5, 1.2rem), 3vw, var(--h4, 1.5rem));
                font-weight: 700;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                transition: all 0.3s ease;
                margin-top: 1rem;

                &:hover {
                    background: var(--clr-light-500, #fff);
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
                color: var(--clr-light-500, #fff);

                @media (width <= 768px) {
                    margin-top: -2.5em;
                }

                & p {
                    margin: 0.2rem 0;
                }
            }
        }
    }
</style>
