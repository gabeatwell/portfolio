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
        margin: 0;

        &:focus-visible {
            outline: 1px solid var(--clr-light-500);
            background: transparent;
        }

        .popover-icon {
            background-color: transparent;
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
            /* max-inline-size: 85vw; */
            /* inline-size: 100%; */
            margin-inline: auto;
            margin-block: 5em;
            font-family: var(--bronova);
            font-size: clamp(var(--xs), 1.25vw, var(--h5));
            font-weight: 400;
            letter-spacing: 2px;
            padding: clamp(1rem, 2vw, 2.25rem) clamp(1.5rem, 2vw, 2.75rem);
            color: var(--clr-light-500);
            background-color: var(--clr-dark-500);

            @media (width < 500px) {
                letter-spacing: 1px;
            }
        }
    }

    [popover] {
        position: fixed;
        top: 30%;
        left: 0;
        right: 0;
        margin-inline: auto;
        inline-size: fit-content;

        border: 3px solid var(--clr-gray-700);
        border-radius: 0.5rem;
        box-shadow: var(--blackest) 0px 20px 25px -5px;
        padding: 1rem 1.5rem;

        opacity: 0;
        transform: translateY(2rem);
        transition:
            opacity 0.4s ease-in,
            transform 0.4s ease-in,
            display 0.4s allow-discrete;

        max-inline-size: 65vw;
        @media (width <= 1100px) {
            max-inline-size: 75vw;
        }
        @media (width <= 768px) {
            max-inline-size: 85vw;
        }
        @media (width <= 500px) {
            max-inline-size: 95vw;
        }
    }

    [popover]:popover-open {
        opacity: 1;
        transform: translateY(0);
        transition:
            opacity 0.4s ease-out,
            transform 0.4s ease-out;
    }

    @starting-style {
        [popover]:popover-open {
            display: block;
            opacity: 0;
            transform: translateY(2rem);
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
