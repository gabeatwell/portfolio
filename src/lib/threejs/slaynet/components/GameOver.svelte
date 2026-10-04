<script lang="ts">
    import { AudioManager } from '../actions/AudioManager';

    interface Props {
        isGameOver?: boolean;
        onRestart: () => void;
        won?: boolean;
    }

    let { isGameOver = false, onRestart, won = false }: Props = $props();
    let isClosing = $state(false);
    let audioManager = $state<AudioManager | null>(null);

    $effect(() => {
        if (!audioManager) {
            const manager = new AudioManager();
            audioManager = manager;

            manager.initialize().then(() => {
                manager.loadSound('buttonClick', '/sounds/game_select.wav');
                manager.loadSound('gameOverOpen', '/sounds/ui_bubble.wav');
            });
        }
    });

    $effect(() => {
        if (isGameOver && audioManager && !isClosing) {
            audioManager.playSound('gameOverOpen', 0.6);
        }
    });

    $effect(() => {
        if (isGameOver) {
            isClosing = false;
        }
    });

    function handleRestart(): void {
        audioManager?.playSound('buttonClick', 0.75);
        isClosing = true;
        setTimeout(() => {
            onRestart();
        }, 600);
    }
</script>

{#if isGameOver && !isClosing}
    <div class="game-over-overlay">
        <div class="game-over-container" class:closing={isClosing}>
            {#if won}
                <div class="won">
                    <h1>VICTORY!</h1>
                    <p>You have killed the computer men!</p>
                    <button class="restart-button" onclick={handleRestart}
                        >Play Again</button
                    >
                </div>
            {:else}
                <div class="lost">
                    <h1>GAME OVER</h1>
                    <p>You were defeated...</p>
                    <button class="restart-button" onclick={handleRestart}
                        >Restart</button
                    >
                </div>
            {/if}
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

        & .game-over-container {
            background: var(--clr-dark-500);
            border: 3px solid var(--clr-dark-400);
            border-radius: 1rem;
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

            &.closing {
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
                    )
                    reverse;
            }

            & .won {
                h1 {
                    font-family: var(--bronova-bold);
                    font-size: clamp(var(--h4), 5vw, var(--h2));
                    margin: 0 0 1rem 0;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-weight: 900;
                    color: var(--clr-dark-500);
                    text-shadow:
                        0 0 1px var(--clr-dark-500),
                        -2px -2px 0 var(--clr-success-500),
                        2px -2px 0 var(--clr-success-500),
                        -2px 2px 0 var(--clr-success-500),
                        2px 2px 0 var(--clr-success-500),
                        -2px 0 0 var(--clr-success-500),
                        2px 0 0 var(--clr-success-500),
                        0 -2px 0 var(--clr-success-500),
                        0 2px 0 var(--clr-success-500);
                }
            }

            & .lost {
                & h1 {
                    font-family: var(--bronova-bold);
                    font-size: clamp(var(--h4), 5vw, var(--h2));
                    margin: 0 0 1rem 0;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-weight: 900;
                    color: var(--clr-dark-500);
                    text-shadow:
                        0 0 1px var(--clr-dark-500),
                        -2px -2px 0 var(--clr-fail-500),
                        2px -2px 0 var(--clr-fail-500),
                        -2px 2px 0 var(--clr-fail-500),
                        2px 2px 0 var(--clr-fail-500),
                        -2px 0 0 var(--clr-fail-500),
                        2px 0 0 var(--clr-fail-500),
                        0 -2px 0 var(--clr-fail-500),
                        0 2px 0 var(--clr-fail-500);
                }
            }
        }
    }

    p {
        color: var(--clr-light-500);
        font-family: var(--bronova);
        font-size: clamp(var(--sm), 2.5vw, var(--h5));
        font-weight: 500;
        margin: 0 0 2rem 0;
    }

    .restart-button {
        background: transparent;
        color: var(--clr-light-500);
        border: 2px solid var(--clr-light-500-fade);
        border-radius: 0.5rem;
        padding: 1rem 2rem;
        font-family: var(--bronova);
        font-size: clamp(var(--sm), 3vw, var(--h5));
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.1em;

        &:active {
            transform: scale(0.98);
        }
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
