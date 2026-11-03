<script lang="ts">
    import Heading from '#lib/components/layout/titles/Heading.svelte';
    import images from '#lib/components/photos/images.json';
    import {
        masonryState,
        openPopover,
        closePopover,
        handleImageError,
        handleImageLoad,
    } from './masonryFunctions.svelte';

    let popoverElement: HTMLElement | null = $state(null);
</script>

<Heading title="snapshots" title2="snapshots" />

<section>
    <div class="masonry">
        {#each images as img, i}
            <button
                type="button"
                class="cv-auto"
                style="animation-delay: {i * 0.2}s;"
                onclick={() => openPopover(popoverElement, img)}
            >
                <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    style="--alt-text: '{img.alt}'"
                    class:error={masonryState.imageErrors.includes(img.src)}
                    onerror={(e) => handleImageError(e, img.src)}
                />
            </button>
        {/each}
    </div>
</section>

<!-- enlarged image -->
<div
    id="image-popover"
    bind:this={popoverElement}
    popover="auto"
    class:open={masonryState.isOpen}
>
    {#if masonryState.selectedImage}
        <button
            type="button"
            onclick={() => closePopover(popoverElement)}
            style="padding: 0; background: none; border: none; cursor: pointer;"
        >
            <img
                src={masonryState.selectedImage.src}
                alt={masonryState.selectedImage.alt}
                onload={(e) => handleImageLoad(e)}
                loading="lazy"
            />
        </button>
    {/if}
</div>

<style>
    :root {
        --100: 100%;
        --animation-duration: 0.75s;
        --stagger-delay: 0.75s;
        --subtle-rgb: 40, 40, 40;
    }

    section {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 0;
        width: 100%;
        margin: 0;

        & .masonry {
            columns: 1;
            column-gap: 0;
            margin: 0.5rem;
            margin-top: 1rem;
            padding: 0;
            width: 100%;

            /* Medium screens (2 columns) */
            @media (width >= 768px) {
                columns: 2;
                margin: 5em;
            }

            /* Desktop (3 columns) */
            @media (width >= 1024px) {
                columns: 3;
                margin: 10em;
            }

            & button {
                display: block;
                width: 100%;
                padding: 0;
                margin: 0;
                border: none;
                background: none;
                cursor: pointer;
                line-height: 0;
                font-size: 0;
                animation: fadeIn var(--animation-duration) ease-out forwards;
                opacity: 0;
                overflow: clip;

                &:focus-visible {
                    border: none;
                    outline: none;
                    box-shadow: none;
                }
            }

            & img {
                width: 100%;
                height: auto;
                aspect-ratio: auto;
                padding: 0;
                margin: 0;
                display: block;
                transform: scale(1);
                transition: transform 0.3s ease-out;
                cursor: pointer;
                border: none;
                outline: none;
                position: relative;

                &::after {
                    content: "We failed to load the image of '" var(--alt-text)
                        "'";
                    position: absolute;
                    inset: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    background: var(--clr-dark-500);
                    color: var(--clr-light-500);
                    white-space: normal;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    hyphens: auto;
                    padding: 1em;
                    pointer-events: none;
                    z-index: 1;
                    font-style: normal;
                    font-size: clamp(var(--xs), 1vw, var(--h5));
                    border-radius: var(--radius);
                    box-sizing: border-box;
                    opacity: 1;
                    line-height: 1.4;
                    max-inline-size: 100%;
                }

                &:not(.error)::after {
                    display: none;
                }
            }
        }
    }

    /* Popover styles */
    #image-popover {
        padding: 0;
        background: transparent;
        transform: scale(0.9);
        opacity: 0;
        border: none;
        border-radius: 0;
        transition:
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.3s ease-out;
        margin: auto;
        inset: 0;

        &.open {
            transform: scale(1);
            opacity: 1;
        }

        & img {
            cursor: pointer;
            box-shadow: 0 0 10px var(--clr-dark-500);
            border: 2px solid var(--clr-light-500);
            border-radius: var(--radius);
            display: block;
        }

        &::backdrop {
            background: radial-gradient(
                circle,
                rgba(0, 0, 0, 0.2) 0%,
                rgba(0, 0, 0, 0.8) 100%
            );
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity 0.3s ease-out;
        }

        &.open::backdrop {
            opacity: 1;
        }
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>
