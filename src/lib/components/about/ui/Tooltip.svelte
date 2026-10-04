<script lang="ts">
    interface Props {
        title: string;
        hover: string;
    }
    let { title, hover }: Props = $props();

    function handleTooltipClick(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
</script>

<section class="tooltip-container" aria-label="tooltip container">
    <button
        type="button"
        class="tooltip-trigger"
        onclick={handleTooltipClick}
        ontouchstart={handleTooltipClick}
        aria-label="Show tooltip"
    >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 530">
            <title>Attention!</title>
            <path
                d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"
            />
        </svg>
    </button>

    <div class="tooltip tooltip-top">{hover}</div>
</section>

<style>
    .tooltip-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &:hover .tooltip {
            opacity: 1;
            visibility: visible;
            animation: fadeIn 0.25s forwards;
        }

        & .tooltip-trigger {
            background: none;
            border: none;
            outline: none;
            cursor: pointer;
            margin-inline: auto;
            padding: 0.5rem 1rem;
            border-radius: 12px;
            font-family: var(--ultra);
            font-size: clamp(var(--h2), 2vw, var(--xl));
            font-weight: 600;
            margin-top: 15%;
            transition: 300ms ease;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;

            & svg {
                fill: var(--clr-blue-500);
                stroke: var(--clr-light-500);
                stroke-width: calc(5px + 1vw);
                width: clamp(1.2em, 5vw, 3em);
                height: clamp(1.2em, 5vw, 3em);
                overflow: visible;
                pointer-events: none;

                @media (width <= 768px) {
                    stroke-width: calc(5px + 5vw);
                }
            }

            &:hover {
                filter: drop-shadow(0 0 25px var(--clr-blue-350));
            }
        }

        & .tooltip {
            position: absolute;
            background-color: var(--clr-dark-500);
            color: var(-clr-main);
            font-size: clamp(var(--sm), 1.5vw, var(--h6));
            padding: calc(var(--space-md) - 0.7rem);
            box-shadow: 0 0 3px var(--clr-blue-500);
            border-radius: 16px;
            max-inline-size: 200px;
            width: fit-content;
            z-index: 10;
            opacity: 0;
            visibility: hidden;
            transition: all 1s ease;

            &::after {
                content: '';
                position: absolute;
                border-style: solid;
                border-width: 5px;
            }
        }

        & .tooltip-top {
            min-width: 160px;
            bottom: calc(100% + 5px);
            left: 50%;
            transform: translateX(-50%);
            transition: transform 0.25s ease;

            @media (width <= 768px) {
                transform: translateX(-60%);
            }

            &::after {
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-color: var(--clr-gray-700) transparent transparent
                    transparent;

                @media (width <= 768px) {
                    left: 60%;
                }
            }
        }

        @media (width <= 500px) {
            padding: 1.5rem;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
