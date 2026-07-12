<script lang="ts">
    import { createPopoverState } from './projectSummaryFunctions.svelte';

    interface Props {
        popoverTitle: string;
        title: string;
        summary: string;
        index?: number;
    }

    interface PopoverState {
        popoverElement: HTMLElement | null;
        showPopover: () => void;
        hidePopover: () => void;
        cancelHide: () => void;
        closePopover: () => void;
    }

    let { popoverTitle, title, summary, index = 0 }: Props = $props();

    const popover: PopoverState = createPopoverState();
</script>

<section class="summary-popover" aria-label="pwa summary">
    <button
        type="button"
        onmouseenter={popover.showPopover}
        onmouseleave={popover.hidePopover}
        onfocus={popover.showPopover}
        onblur={popover.hidePopover}
        class="summary-button"
    >
        <span
            class="summary-title"
            style="view-transition-name: summary-title-{index};">{title}</span
        >
    </button>

    <div
        popover="manual"
        bind:this={popover.popoverElement}
        data-summary-content
        onmouseenter={popover.cancelHide}
        onmouseleave={popover.hidePopover}
        role="dialog"
        tabindex="0"
    >
        <div class="popover-inner">
            <div data-summary-text>
                <p>About <span class="pwa-title">{popoverTitle}</span></p>
                <p>{summary}</p>
            </div>
        </div>

        <button
            data-close
            onclick={popover.closePopover}
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
    .summary-popover {
        display: inline-block;
        margin-inline: auto;
        pointer-events: auto;
        margin-bottom: 0;

        &:focus-visible {
            outline: 1px solid var(--clr-light-500);
            background: transparent;
        }

        & .summary-button {
            margin: 0;
            padding: 0;
            color: var(--clr-pale-700);
        }

        & [data-close] {
            position: absolute;
            bottom: 0.5em;
            right: 0.75em;
            inset-inline-start: auto;
            inset-block-start: auto;

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

            @supports (inset-block-start: anchor(top)) {
                position: absolute;
                position-anchor: --close;
                top: calc(anchor(top) - 11em);
                right: calc(anchor(end) - 1em);
            }
        }

        & [data-summary-content] {
            min-inline-size: 40%;

            & .popover-inner {
                position: relative;

                anchor-name: --close;
            }

            & [data-summary-text] {
                margin-top: 2.5rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
        }

        & p {
            font-weight: 600;

            & .pwa-title {
                color: var(--clr-blue-350);
                font-family: var(--bronova-bold);
                font-size: clamp(var(--h6), 2.5vw, var(--h3));

                font-weight: 900;
            }

            &:first-of-type {
                color: var(--clr-light-500);
                font-weight: 200;
                font-size: clamp(var(--sm), 1.25vw, var(--h5));
            }

            &:last-of-type {
                color: var(--light-gray);
                font-size: clamp(var(--sm), 1.25vw, var(--h5));
            }
        }

        & button {
            background-color: transparent;
            color: var(--clr-blue-400);
            filter: brightness(1);
            inline-size: fit-content;
            font-family: var(--bronova);
            font-size: clamp(var(--h6), 1.5vw, var(--h4));
            font-weight: 600;
            margin: 0;
            padding: 0.25rem 1rem;
            cursor: pointer;
            text-wrap: pretty;
            border: none;
            transition: scale 0.15s ease-out;

            &:not(:hover) {
                opacity: 0.85;
            }

            &:active {
                scale: 0.95;
            }
        }

        & [popover] {
            margin-inline: auto;
            margin-block: auto;
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 5vw, var(--h3));
            letter-spacing: 2px;
            padding: clamp(1rem, 2vw, 2.25rem) clamp(1.5rem, 2vw, 2.75rem);
            color: var(--clr-light-500);
            max-inline-size: 40%;
            overflow-y: auto;
            border: 1px solid var(--clr-gray-700);

            @media (width < 500px) {
                letter-spacing: 1px;
                max-height: 70vh;
            }
        }
    }

    [popover] {
        border-radius: var(--radius);
        padding: 1rem 1.5rem;
        display: none;
        opacity: 0;
        transform: translateY(-5rem);
        transition: all 0.5s allow-discrete;
    }

    [popover]:popover-open {
        display: block;
        opacity: 1;
        transform: translateY(0);
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
    }

    @starting-style {
        [popover]:popover-open::backdrop {
            background-color: rgb(0 0 0 / 0%);
        }
    }
</style>
