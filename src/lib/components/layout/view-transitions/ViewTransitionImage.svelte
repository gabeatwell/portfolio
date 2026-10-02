<script lang="ts">
    import { browser } from '$app/env';
    import { getPreloaderState } from '#lib/data/stores/preloadStore.svelte.js';

    interface Props {
        src: string;
        alt: string;
        transitionName?: string;
    }

    let { src, alt, transitionName = 'expandable-image' }: Props = $props();

    let expanded = $state(false);
    let isSVG = $derived(src?.endsWith('.svg'));

    const preloaderState = getPreloaderState();
    let ready = $derived(preloaderState.done);

    let supportedViewTransitions = $derived(
        browser &&
            typeof document !== 'undefined' &&
            'startViewTransition' in document,
    );

    function toggleExpand() {
        if (supportedViewTransitions) {
            document.startViewTransition(() => {
                expanded = !expanded;
            });
        } else {
            expanded = !expanded;
        }
    }
</script>

<section class:expanded class:hidden={!ready}>
    <button type="button" onclick={toggleExpand} class="img-button">
        <img
            src={src}
            alt={alt}
            style="view-transition-name: {transitionName};"
            class:svg={isSVG}
            loading="lazy"
        />
    </button>
</section>

<style>
    :global(.expanded) {
        --view-transition-offset: -20em;
        --view-transition-offset-mobile: -18em;
    }

    section {
        cursor: pointer;
        width: fit-content;
        z-index: 50;

        &.hidden {
            visibility: hidden;
        }

        & .img-button {
            padding: 0;
            border: none;
            background: none;
            cursor: pointer;
            width: fit-content;
            display: block;

            &:focus,
            &:focus-visible,
            &:active {
                outline: none;
                box-shadow: none;
            }

            & img {
                object-fit: contain;
                width: 500px;
                outline: none;
                -webkit-user-drag: none;
                user-select: none;

                &.svg {
                    object-fit: contain;
                }
            }
        }

        &:not(.expanded) .img-button img {
            object-fit: contain;

            @media (width <= 768px) {
                width: 60vw;
                height: auto;
            }

            &.svg {
                object-fit: contain;
            }
        }
    }

    .expanded {
        width: fit-content;

        & .img-button {
            z-index: 60;

            & img {
                width: min(90vw, 1200px);
                height: auto;
                max-height: 85vh;

                @media (width <= 768px) {
                    width: 90vw;
                    max-height: 80dvh;
                }

                &.svg {
                    filter: brightness(1.1);
                }
            }
        }
    }
</style>
