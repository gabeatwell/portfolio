<script lang="ts">
    interface Props {
        title: string;
        popoverTitle: string;
        text: string;
        text2: string;
        text3: string;
    }

    let { title, popoverTitle, text, text2, text3 }: Props = $props();

    const id = `popover-${Math.random().toString(36).slice(2, 11)}`;

    let popoverElement: HTMLElement | null = $state(null);

    function openPopover(): void {
        if (!popoverElement) return;

        if (!document.startViewTransition) {
            popoverElement.showPopover();
            return;
        }

        document.startViewTransition(() => {
            popoverElement!.showPopover();
        });
    }
</script>

<section class="instruction-popover" aria-label="pwa instructions">
    <button type="button" onclick={openPopover}>
        <span class="pwa-title">{title}</span>
    </button>

    <div {id} popover="auto" bind:this={popoverElement}>
        <p><span class="pwa-title">{title}</span></p>
        <p data-content>{text}</p>
        <p data-content>{text2}</p>
        <p data-content>{text3}</p>
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
            }

            & .pwa-title {
                view-transition-name: pwa-title;
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
            padding: clamp(1rem, 2vw, 2.25rem) clamp(1.5rem, 2vw, 2.75rem);
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
        padding: 1rem 1.5rem;
        transform-origin: center center;

        position: fixed;
        inset-inline: 0;
        margin-inline: auto;
        top: 5em;
        inline-size: 80%;

        /* close state */
        display: none;
        opacity: 0;
        transform: translateY(2rem);
        scale: 0;
        overlay: none;

        transition:
            opacity 0.5s allow-discrete,
            transform 0.5s allow-discrete,
            display 0.5s allow-discrete,
            scale 0.5s allow-discrete,
            overlay 0.5s allow-discrete;
    }

    /* open state */
    [popover]:popover-open {
        display: block;
        opacity: 1;
        scale: 1;
        transform: translateY(0);
        overlay: auto;
    }

    /* --- entry animation --- */
    @starting-style {
        [popover]:popover-open {
            opacity: 0;
            scale: 0;
            transform: translateY(2rem);
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

    /* title transition */
    ::view-transition-group(pwa-title) {
        animation-duration: 0.5s;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    ::view-transition-old(pwa-title),
    ::view-transition-new(pwa-title) {
        mix-blend-mode: normal;
    }
</style>
