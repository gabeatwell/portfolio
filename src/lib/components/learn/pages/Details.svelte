<script lang="ts">
    import './details-globals.css';
    import { sanitize, detailsAccordion } from './detailsFunctions.svelte';

    interface Item {
        summary: string;
        content: string;
    }

    interface Props {
        items: Item[];
    }

    let { items = [] }: Props = $props();

    $effect(() => {
        detailsAccordion.init(items.length);
    });
</script>

{#if items && items.length > 0}
    {#each items as item, index}
        <div
            class="details-custom animate-in"
            style="--anim-delay: {index * 0.5}s; visibility: hidden;"
        >
            <button
                class="summary-custom outline contrast spacing"
                onclick={() => detailsAccordion.toggle(index)}
                onkeydown={(e) => detailsAccordion.handleKeydown(e, index)}
                aria-expanded={detailsAccordion.openStates[index]}
                aria-controls="content-{index}"
            >
                <span class="margin"><b>{item.summary}</b></span>

                <span
                    class="arrow"
                    class:rotated={detailsAccordion.openStates[index]}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                    >
                        <path
                            d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"
                            fill="var(--clr-blue-500)"
                        />
                    </svg>
                </span>
            </button>

            <div
                id="content-{index}"
                class="text"
                class:open={detailsAccordion.openStates[index]}
                style="color: var(--clr-gray-600);"
            >
                {@html sanitize(item.content)}
            </div>
        </div>
    {/each}
{:else}
    <p>No details available</p>
{/if}

<style>
    :root {
        --100: 100%;
        interpolate-size: allow-keywords;
    }

    .animate-in {
        animation: fadeInUp 1s ease forwards;
        animation-delay: var(--anim-delay, 0s);
    }

    .details-custom {
        max-inline-size: 90vw;
        margin-inline: auto;
        position: relative;
        border: none;
        outline: none;
        overflow: clip;
        padding: 1rem;
        inline-size: 100ch;

        & .summary-custom {
            color: var(--clr-blue-350);
            cursor: pointer;
            font-weight: 600;
            background: var(--clr-dark-500);
            inline-size: 100%;
            text-align: start;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 2px solid var(--clr-gray-700);

            &:focus-visible {
                outline: none;
                box-shadow: none;
            }

            & .arrow {
                font-size: 0.8em;
                transition: transform 0.2s;
                transform: rotate(0deg);
                background: none;
                border: none;
                outline: none;
                -webkit-appearance: none;
                appearance: none;
                padding: 0;
                margin: 0;
                border-radius: 0;
                box-shadow: none;
                flex-shrink: 0;

                &.rotated {
                    transform: rotate(90deg);
                }

                & svg {
                    width: clamp(1em, 1.3vw, 2em);
                    height: clamp(1em, 1.3vw, 2em);
                }
            }
        }

        & .text {
            line-height: 1.6;
            opacity: 0;
            block-size: 0;
            overflow-y: clip;
            padding: 0 0.75em;
            color: var(--clr-gray-600);
            transition:
                opacity 1s,
                block-size 1s;

            &.open {
                opacity: 1;
                block-size: auto;
            }
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(100px);
            visibility: hidden;
        }
        to {
            opacity: 1;
            transform: translateY(0);
            visibility: visible;
        }
    }
</style>
