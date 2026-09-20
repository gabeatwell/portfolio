<script lang="ts">
    let { open = $bindable(false), ariaLabel = 'menu' } = $props();
</script>

<button
    class="hamburger"
    class:open
    onclick={() => (open = !open)}
    aria-label={ariaLabel}
    aria-expanded={open}
    aria-controls="mobile-menu"
>
    <input
        type="checkbox"
        id="burger-toggle"
        class="visually-hidden burger-checkbox"
        bind:checked={open}
    />
    <span class="bars">
        <span class="bar bar-1"></span>
        <span class="bar bar-2"></span>
    </span>
</button>

<style>
    .hamburger {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        background: transparent;
        border: none;
        cursor: pointer;
        z-index: 10;
        margin-bottom: 2em;
        margin-left: 1em;
        position: relative;
        padding: 0;
        pointer-events: auto;

        @media (width >= 755px) {
            opacity: 0;
            display: none;
        }

        & .bars {
            display: flex;
            flex-direction: column;
            width: 2.5em;
            height: 2rem;
            position: relative;
            margin-top: 1.3em;

            & .bar {
                width: 100%;
                height: 0.3rem;
                background-color: var(--clr-light-500);
                border-radius: 2px;
                transition:
                    transform 0.35s ease,
                    width 0.35s ease;
                transform-origin: center center;
                position: absolute;
            }

            & .bar-1 {
                width: 2.8em;
                transform: translateY(-0.35rem);
            }

            & .bar-2 {
                width: 2em;
                transform: translateY(0.35rem);
            }
        }

        &.open {
            padding-bottom: 0.5rem;

            .bar-1 {
                transform: translateY(0) rotate(45deg);
                width: 2.2em;
            }

            .bar-2 {
                transform: translateY(0) rotate(-45deg);
                width: 2.2em;
            }
        }

        &:hover:not(.open) {
            .bar {
                background-color: var(--clr-accent, var(--clr-light-500));
            }
        }

        @media (width >= 755px) {
            opacity: 0;
        }
    }
</style>
