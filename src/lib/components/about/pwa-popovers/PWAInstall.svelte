<script lang="ts">
    interface Props {
        title: string;
        text: string;
        text2: string;
        text3: string;
    }

    let { title, text, text2, text3 }: Props = $props();

    const id = `popover-${Math.random().toString(36).slice(2, 11)}`;
</script>

<section class="instruction-popover" aria-label="pwa instructions">
    <button type="button" popovertarget={id}>
        <span class="pwa-title">{title}</span>
    </button>

    <div {id} popover="auto">
        <p><span class="pwa-title">{title}</span></p>
        <p class="indent" data-content>{text}</p>
        <p class="indent" data-content>{text2}</p>
        <p class="indent" data-content>{text3}</p>

        <button
            data-close
            type="button"
            popovertarget={id}
            popovertargetaction="hide"
            aria-label="close popover"
        >
            <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M8.00191 9.41621C7.61138 9.02569 7.61138 8.39252 8.00191 8.002C8.39243 7.61147 9.0256 7.61147 9.41612 8.002L12.0057 10.5916L14.5896 8.00771C14.9801 7.61719 15.6133 7.61719 16.0038 8.00771C16.3943 8.39824 16.3943 9.0314 16.0038 9.42193L13.4199 12.0058L16.0039 14.5897C16.3944 14.9803 16.3944 15.6134 16.0039 16.004C15.6133 16.3945 14.9802 16.3945 14.5896 16.004L12.0057 13.42L9.42192 16.0038C9.03139 16.3943 8.39823 16.3943 8.00771 16.0038C7.61718 15.6133 7.61718 14.9801 8.00771 14.5896L10.5915 12.0058L8.00191 9.41621Z"
                    fill="var(--clr-fail-500)"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"
                    fill="var(--clr-fail-500)"
                />
            </svg>
        </button>
    </div>
</section>

<style>
    .instruction-popover {
        display: inline-block;
        position: relative;
        anchor-name: --instruction-popover;

        & [data-content] {
            text-align: start;
        }

        & button {
            background-color: transparent;
            filter: brightness(1);
            color: var(--clr-green-500);
            width: fit-content;
            font-family: var(--bronova);
            font-size: clamp(var(--h6), 1.5vw, var(--h4));
            font-weight: 600;
            margin: 0;
            padding: 0;
            border: none;
            cursor: pointer;
            transition: scale 0.15s ease-out;

            &:not(:hover) {
                opacity: 0.85;
            }

            &:active {
                scale: 0.95;
            }

            &:focus {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
                padding: 0.1em 0.2em;
            }

            & .pwa-title {
                view-transition-name: pwa-title;
            }
        }

        div {
            & [data-close] {
                position: absolute;
                top: 1em;
                right: 1em;

                @media (width <= 768px) {
                    top: 0.1em;
                    right: 0.1em;
                }

                background: transparent;
                border: none;
                color: var(--clr-fail-500);
                font-family: var(--bronova-bold);
                font-size: clamp(var(--h5), 1.5vw, var(--h3));
                font-weight: 700;
                cursor: pointer;

                & svg {
                    inline-size: clamp(1.5em, 3vw, 2.5rem);
                    block-size: clamp(1.5em, 3vw, 2.5rem);
                }

                &:focus,
                &:focus-visible {
                    outline: 1px solid var(--clr-light-500);
                }
            }
        }

        &:has([popover]:popover-open) button .pwa-title {
            view-transition-name: none;
        }

        [popover]:popover-open .pwa-title {
            view-transition-name: pwa-title;
            color: var(--clr-green-500);
            font-size: clamp(var(--h5), 1.5vw, var(--h3));
        }

        & [popover] {
            margin-inline: auto;
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 5vw, var(--h3));
            letter-spacing: 2px;
            padding: var(--padding-button-lg);
            color: var(--clr-light-500);
            width: 80%;
            overflow-y: auto;

            @media (width < 500px) {
                letter-spacing: 1px;
                max-height: 70vh;
            }
        }
    }

    [popover] {
        border: 3px solid var(--clr-gray-700);
        border-radius: 0.5rem;
        box-shadow: var(--blackest) 0px 20px 25px -5px;
        padding: var(--padding-button-lg);
        transform-origin: top center;

        position: fixed;
        inset: 0;
        margin: auto;
        inline-size: 100%;
        max-inline-size: 65%;

        /* close state */
        display: none;
        opacity: 0;
        transform: scale(0);
        overlay: none;

        transition:
            opacity 0.5s allow-discrete,
            display 0.5s allow-discrete,
            transform 0.75s allow-discrete,
            overlay 0.5s allow-discrete;
    }

    /* open state */
    [popover]:popover-open {
        display: block;
        opacity: 1;
        transform: scale(1);
        overlay: auto;
    }

    /* --- entry animation --- */
    @starting-style {
        [popover]:popover-open {
            opacity: 0;
            transform: scale(0);
        }
    }

    /* backdrop */
    [popover]::backdrop {
        background-color: rgb(0 0 0 / 0%);
        transition:
            display 0.5s allow-discrete,
            overlay 0.5s allow-discrete,
            background-color 0.5s ease-out;
    }

    [popover]:popover-open::backdrop {
        background-color: rgb(0 0 0 / 50%);
    }

    @starting-style {
        [popover]:popover-open::backdrop {
            background-color: rgb(0 0 0 / 0%);
        }
    }
</style>
