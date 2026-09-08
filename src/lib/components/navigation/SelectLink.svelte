<script lang="ts">
    import { useSound } from '$lib/data/stores/sounds/uiSounds.svelte';

    const { playSoundAsync: playHoverSound } = useSound(
        '/sounds/foley-bubble.wav',
    );
</script>

<div class="connect-select">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="select-wrapper" onmouseenter={playHoverSound}>
        <span class="select-trigger">Connect</span>

        <div class="select-options">
            <a href="/hire" class="select-option">
                <span class="option-text">Hire Me</span>
            </a>

            <a href="/contact" class="select-option">
                <span class="option-text">Contact</span>
            </a>
        </div>
    </div>
</div>

<style>
    .connect-select {
        display: none;
    }

    .select-wrapper {
        position: relative;
        appearance: none;
        background:
            repeating-radial-gradient(
                ellipse at 50% 50%,
                color-mix(in oklch, var(--clr-light-500) 8%, transparent) 0
                    0.75em,
                transparent 0.15em 1.5em
            ),
            var(--clr-dark-500);
        backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid var(--clr-light-500);
        color: var(--clr-light-500);
        font-family: var(--bronova-bold);
        font-size: clamp(var(--sm), 1.1vw, var(--h5));
        letter-spacing: 1px;
        padding: var(--padding-button-lg);
        cursor: pointer;
        max-inline-size: fit-content;
        margin: 0.1em 0 0 0;

        &:hover .select-options,
        &:focus-within .select-options {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        & .select-trigger {
            pointer-events: none;
        }

        & .select-options {
            position: absolute;
            top: 100%;
            left: 0;
            min-inline-size: 100%;
            background: var(--clr-dark-400);
            border: none;
            box-shadow: none;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-4px);
            transition:
                opacity 0.2s ease-out,
                visibility 0.2s ease-out,
                transform 0.2s ease-out;
            z-index: 100;

            & .select-option {
                display: block;
                color: var(--clr-blue-400);
                text-decoration: none;
                padding: var(--padding-button-lg);
                white-space: nowrap;
                transition: background 0.15s ease-out;

                &:hover {
                    text-decoration: line-through;
                    text-decoration-thickness: 1px;
                }

                &:focus {
                    outline: 1px solid var(--clr-light-500);
                    background: transparent;
                    box-shadow: none;
                }
            }
        }
    }

    /* show on desktop, hide on mobile */
    @media (width > 768px) {
        .connect-select {
            display: block;
        }
    }
</style>
