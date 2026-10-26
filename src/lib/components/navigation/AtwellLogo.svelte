<script lang="ts">
    import { useSound } from '#lib/data/stores/sounds/uiSounds.svelte.js';

    interface Props {
        title: string;
        current?: boolean;
    }

    let { title, current = false }: Props = $props();

    const { playSoundAsync: playHoverSound } = useSound(
        '/sounds/ui_bubble.wav',
    );

    function handlePointerEnter() {
        void playHoverSound();
    }
</script>

<a
    href="/"
    aria-label="atwell - Go to homepage"
    aria-current={current ? 'page' : undefined}
    data-navigation-logo
    onclick={handlePointerEnter}
>
    <div class="atwell-logo">
        <div class="atwell" aria-hidden="true">
            <div class="atwell-top">{title}</div>
            <div class="atwell-bottom">{title}</div>
        </div>
    </div>
</a>

<style>
    [data-navigation-logo] {
        user-select: none;

        display: inline-flex;
        align-items: center;
        border-radius: 0.25rem;

        &:focus-visible,
        &:focus {
            outline: 2px solid var(--clr-light-500-fade);
            outline-offset: 3px;
            background: transparent;
            box-shadow: none;
        }

        &:focus:not(:focus-visible) {
            outline: none;
        }

        & .atwell-logo {
            text-align: center;
            background-color: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: scale 0.15s ease-out;

            @media (width <= 500px) {
                margin-left: 1em;
            }

            &:active {
                scale: 0.95;
            }

            & .atwell {
                --top-left: 55%;
                --top-right: 40%;
                --bottom-left: 57%;
                --bottom-right: 42%;
                font-family: var(--bronova-bold);
                font-size: clamp(var(--h2), 10vw, var(--lg));
                color: var(--clr-dark-500);
                text-shadow:
                    0 0 1px var(--clr-dark-500),
                    -3px -3px 0 var(--clr-light-500-fade),
                    3px -3px 0 var(--clr-light-500-fade),
                    -3px 3px 0 var(--clr-light-500-fade),
                    3px 3px 0 var(--clr-light-500-fade),
                    -3px 0 0 var(--clr-light-500-fade),
                    3px 0 0 var(--clr-light-500-fade),
                    0 -3px 0 var(--clr-light-500-fade),
                    0 3px 0 var(--clr-light-500-fade);
                display: grid;

                @media (width <= 768px) {
                    text-shadow:
                        0 0 1px var(--clr-dark-500),
                        -2px -2px 0 var(--clr-light-500-fade),
                        2px -2px 0 var(--clr-light-500-fade),
                        -2px 2px 0 var(--clr-light-500-fade),
                        2px 2px 0 var(--clr-light-500-fade),
                        -2px 0 0 var(--clr-light-500-fade),
                        2px 0 0 var(--clr-light-500-fade),
                        0 -2px 0 var(--clr-light-500-fade),
                        0 2px 0 var(--clr-light-500-fade);
                    margin-right: 0.3em;
                }

                & .atwell-top {
                    grid-column: 1 / 1;
                    grid-row: 1 / 1;
                    translate: 1px 0;
                    clip-path: polygon(
                        0 0,
                        100% 0,
                        100% var(--top-right),
                        0 var(--top-left)
                    );
                }

                & .atwell-bottom {
                    grid-column: 1 / 1;
                    grid-row: 1 / 1;
                    translate: 2px 0;
                    clip-path: polygon(
                        0 var(--bottom-left),
                        100% var(--bottom-right),
                        100% 100%,
                        0 100%
                    );
                }
            }
        }
    }

    @keyframes slideRight {
        to {
            translate: 10px 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        [data-navigation-logo] .atwell-logo {
            transition: none;
        }
        [data-navigation-logo] .atwell-logo:active {
            scale: 1;
        }
    }
</style>
