<script lang="ts">
    interface Props {
        title: string;
        text: string;
    }

    let { title, text }: Props = $props();
</script>

<section class="popover-button" aria-label="Popover button">
    <button class="popover-icon" popovertarget="popover"
        >{title}
        <span class="visually-hidden">Open popover</span>

        <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12.0009 5C13.4331 5 14.8066 5.50571 15.8193 6.40589C16.832 7.30606 17.4009 8.52696 17.4009 9.8C17.4009 11.7691 17.846 13.2436 18.4232 14.3279C19.1606 15.7133 19.5293 16.406 19.5088 16.5642C19.4849 16.7489 19.4544 16.7997 19.3026 16.9075C19.1725 17 18.5254 17 17.2311 17H6.77066C5.47638 17 4.82925 17 4.69916 16.9075C4.54741 16.7997 4.51692 16.7489 4.493 16.5642C4.47249 16.406 4.8412 15.7133 5.57863 14.3279C6.1558 13.2436 6.60089 11.7691 6.60089 9.8C6.60089 8.52696 7.16982 7.30606 8.18251 6.40589C9.19521 5.50571 10.5687 5 12.0009 5ZM12.0009 5V3M9.35489 20C10.0611 20.6233 10.9888 21.0016 12.0049 21.0016C13.0209 21.0016 13.9486 20.6233 14.6549 20"
                stroke="var(--clr-light-500)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    </button>

    <div popover id="popover" aria-labelledby="popover">
        {text}
    </div>
</section>

<style>
    .popover-button {
        align-content: center;
        margin: 1rem 0 0 0;

        &:focus-visible {
            outline: 1px solid var(--clr-light-500);
            background: transparent;
        }

        .popover-icon {
            anchor-name: --popover-anchor;
            background-color: transparent;
            color: var(--clr-light-500);
            inline-size: fit-content;
            font-family: var(--bronova);
            border-radius: 6px;
            letter-spacing: 3px;
            padding: 0.75rem 1.15rem;
            border: none;
            outline: none;
            text-transform: uppercase;
            transition: scale 0.15s ease-out;

            & svg {
                font-size: clamp(var(--h2), 4vw, var(--xxl));
                fill: transparent;
                stroke-width: calc(5px + 1vw);
                inline-size: clamp(1.5em, 4vw, 5em);
                block-size: clamp(1.5em, 4vw, 5em);

                @media (width <= 768px) {
                    stroke-width: calc(5px + 5vw);
                }

                & path {
                    stroke: var(--clr-warning-500);
                    stroke-width: 1.5;
                }
            }

            &:hover {
                animation: wiggle 1s ease-out infinite;
            }

            &:focus,
            &:focus-visible {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
            }

            &:active {
                scale: 0.95;
            }

            @media (width <= 500px) {
                letter-spacing: 1px;
            }
        }

        #popover {
            --clr-light-500-fade: oklch(from var(--clr-light-500) l c h / 0.35);
            border: 2px solid var(--clr-light-500-fade);
            font-family: var(--bronova);
            font-size: clamp(var(--xs), 1.25vw, var(--h5));
            font-weight: 400;
            letter-spacing: 2px;
            padding: var(--padding-modal);
            color: var(--clr-light-500);
            background-color: var(--clr-dark-500);
            inline-size: 50vw;

            @media (width <= 768px) {
                min-inline-size: 70vw;
                margin-right: 1em;
                letter-spacing: 1px;
            }
        }
    }

    [popover] {
        position: fixed;
        position-anchor: --popover-anchor;
        position-area: top center;
        position-try-fallbacks: --below, flip-inline;
        position-try-order: most-block-size;
        margin: 0;
        margin-block-end: 0.75rem;
        max-inline-size: 90vw;
        inline-size: fit-content;

        border-radius: 0.25rem;
        box-shadow: var(--blackest) 0px 20px 25px -5px;
        padding: var(--padding-modal);

        /* grows out of the button edge it's tethered to */
        transform-origin: center bottom;

        opacity: 0;
        scale: 0.9;
        transition:
            opacity 0.3s ease-in,
            scale 0.3s ease-in,
            overlay 0.3s allow-discrete,
            display 0.3s allow-discrete;

        @media (width <= 1100px) {
            max-inline-size: 75vw;
        }
        @media (width <= 768px) {
            min-inline-size: 85vw;
        }
        @media (width <= 500px) {
            max-inline-size: 95vw;
        }
    }

    /* fallback: sits below the button -> grows from its top edge */
    @position-try --below {
        position-area: bottom center;
        margin-block: 0.75rem 0;
        transform-origin: center top;
    }

    [popover]:popover-open {
        opacity: 1;
        scale: 1;
        transition:
            opacity 0.3s ease-out,
            scale 0.3s ease-out;
    }

    @starting-style {
        [popover]:popover-open {
            opacity: 0;
            scale: 0.9;
        }
    }

    [popover]::backdrop {
        background-color: rgb(0 0 0 / 0%);
        transition:
            display 0.5s allow-discrete,
            overlay 0.5s allow-discrete,
            background-color 0.5s;
    }

    [popover]:popover-open::backdrop {
        background-color: rgb(0 0 0 / 50%);
        box-shadow: none;
    }

    @starting-style {
        [popover]:popover-open::backdrop {
            background-color: rgb(0 0 0 / 0%);
        }
    }

    @keyframes wiggle {
        0% {
            rotate: 0deg;
            translate: 0 0;
        }
        25% {
            rotate: -2deg;
            translate: -5px 0;
        }
        80% {
            rotate: 2deg;
            translate: 5px 0;
        }
    }
</style>
