<script lang="ts">
    import Confetti from './Confetti.svelte';

    interface Props {
        isGameOver?: boolean;
        won?: boolean;
        countdown?: number;
    }

    let { isGameOver = false, won = false, countdown = 5 }: Props = $props();
</script>

{#if isGameOver}
    <Confetti active={isGameOver} color={won ? 'green' : 'red'} />

    <div class="game-over-overlay">
        <div class="game-over-container">
            {#if won}
                <div class="won">
                    <h1>VICTORY!</h1>
                </div>
            {:else}
                <div class="lost">
                    <h1>GAME OVER</h1>
                    <p>You were defeated...</p>
                </div>
            {/if}
            <p class="countdown">Restarting in {countdown}s...</p>
        </div>
    </div>
{/if}

<style>
    .game-over-overlay {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        backdrop-filter: blur(7px);
        pointer-events: none;

        & .game-over-container {
            background: var(--clr-dark-500);
            border: 3px solid var(--clr-dark-400);
            border-radius: var(--radius);
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            animation: scale-up 0.5s
                linear(
                    0,
                    0.577 4.9%,
                    1.001 10.3%,
                    1.273 16.2%,
                    1.359 19.5%,
                    1.411 23%,
                    1.428 25.4%,
                    1.433 27.9%,
                    1.407 33.6%,
                    1.353 38.9%,
                    1.144 56.3%,
                    1.088 62.4%,
                    1.048 68.5%,
                    1.023 74.4%,
                    1.008 80.9%,
                    1
                );

            & .won {
                & h1 {
                    font-family: var(--bronova-bold);
                    font-size: clamp(var(--h4), 5vw, var(--h2));
                    margin: 0 0 0.5rem 0;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-weight: 900;
                    color: var(--clr-dark-500);
                    text-shadow:
                        0 0 1px var(--clr-dark-500),
                        -4px -4px 0 var(--clr-success-500),
                        4px -4px 0 var(--clr-success-500),
                        -4px 4px 0 var(--clr-success-500),
                        4px 4px 0 var(--clr-success-500),
                        -4px 0 0 var(--clr-success-500),
                        4px 0 0 var(--clr-success-500),
                        0 -4px 0 var(--clr-success-500),
                        0 4px 0 var(--clr-success-500);
                }
            }

            & .lost {
                & h1 {
                    font-family: var(--bronova-bold);
                    font-size: clamp(var(--h4), 5vw, var(--h2));
                    margin: 0 0 0.5rem 0;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-weight: 900;
                    color: var(--clr-dark-500);
                    text-shadow:
                        0 0 1px var(--clr-dark-500),
                        -4px -4px 0 var(--clr-fail-500),
                        4px -4px 0 var(--clr-fail-500),
                        -4px 4px 0 var(--clr-fail-500),
                        4px 4px 0 var(--clr-fail-500),
                        -4px 0 0 var(--clr-fail-500),
                        4px 0 0 var(--clr-fail-500),
                        0 -4px 0 var(--clr-fail-500),
                        0 4px 0 var(--clr-fail-500);
                }
            }
        }
    }

    p {
        color: var(--clr-light-500);
        font-family: var(--bronova);
        font-size: clamp(var(--sm), 2.5vw, var(--h5));
        font-weight: 500;
        margin: 0;
    }

    .countdown {
        margin-top: 1.5rem;
        opacity: 0.7;
        font-size: clamp(var(--xs), 2vw, var(--sm));
    }

    @keyframes scale-up {
        from {
            transform: scale(0);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
</style>
