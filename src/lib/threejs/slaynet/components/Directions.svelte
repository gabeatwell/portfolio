<script lang="ts">
    let { showDirections = $bindable(false) } = $props();
</script>

<button
    class="directions-toggle"
    onclick={() => (showDirections = !showDirections)}
    aria-label="Toggle directions"
    aria-expanded={showDirections}
>
    directions
</button>

{#if showDirections}
    <div class="game-directions">
        <button
            class="close-directions"
            onclick={() => (showDirections = false)}
            aria-label="Close directions"
        >
            ×
        </button>

        <div class="directions">
            <h2>directions</h2>

            <ul>
                <li>Move = W, A, S, D</li>
                <li>Fire = space bar</li>
                <li>Orbit controls = letter "r"</li>
                <li>Regenerate level = letter "l"</li>
            </ul>

            <h3>
                you only get 10 bullets to start, you get more when you kill an
                enemy.
            </h3>
        </div>
    </div>
{/if}

<style>
    .directions-toggle {
        position: fixed;
        bottom: 0;
        right: 1rem;
        inline-size: fit-content;
        block-size: fit-content;
        border-radius: var(--radius);
        background: var(--clr-dark-400);
        color: var(--clr-light-500);
        font-family: var(--bronova-bold);
        font-size: clamp(var(--xs), 1.2vw, var(--h5));
        opacity: 0.8;
        border: 2px solid var(--clr-dark-500);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 100;

        @media (width <= 768px) {
            display: flex;
        }

        &:hover {
            transform: scale(1.1);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .game-directions {
        position: fixed;
        bottom: 1em;
        right: 1em;
        background: var(--clr-dark-400);
        padding: 0.5rem 1rem;
        border: 1px solid var(--clr-dark-500);
        border-radius: var(--radius);
        z-index: 100;
        max-inline-size: 30vw;
        opacity: 1;

        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;

        @media (width <= 768px) {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--clr-dark-400);
            border: 1px solid var(--clr-dark-500);
            border-radius: var(--radius);
            padding: 0.2rem 0.75rem;
            z-index: 150;
            min-inline-size: 85vw;
            max-height: 60vh;
            overflow-y: auto;
        }

        & h2 {
            color: var(--clr-light-500);
            font-family: var(--bronova);
            font-size: clamp(var(--xs), 1.2vw, var(--h5));
            font-weight: 500;
            margin: 0;
            text-transform: uppercase;
            text-align: center;

            @media (width <= 768px) {
                font-size: var(--h5);
                margin: 0 0 1rem 0;
            }
        }

        & h3 {
            color: var(--clr-light-500);
            font-family: var(--bronova);
            font-size: clamp(var(--xs), 1vw, var(--h6));
            font-weight: 300;
            margin: 0;
            text-align: center;

            @media (width <= 768px) {
                font-size: var(--h6);
                margin: 0 0 1rem 0;
            }
        }

        & li {
            color: var(--clr-light-500);
            font-family: var(--bronova);
            font-size: clamp(var(--xxs), 1.1vw, var(--sm));
            font-weight: 400;
            margin: 0;
            text-align: center;

            @media (width <= 768px) {
                font-size: var(--sm);
            }
        }
    }

    .close-directions {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.8);
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease;

        &:hover {
            color: white;
        }
    }

    .directions {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
</style>
