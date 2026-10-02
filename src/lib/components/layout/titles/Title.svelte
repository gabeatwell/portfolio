<script lang="ts">
    import { browser } from '$app/env';
    import DOMPurify from 'dompurify';

    interface Props {
        title: string;
        title2?: string;
        img?: string;
        width?: string;
        svg?: string;
        viewTransitionName?: string;
        viewTransitionClass?: string;
        scaleY?: number;
    }

    let {
        title,
        title2,
        img,
        width,
        svg,
        viewTransitionName,
        viewTransitionClass = 'slide-transition',
        scaleY = 1,
    }: Props = $props();

    let transitionName = $derived(viewTransitionName || 'page-title');

    let svgElement = $derived.by(() => {
        if (!svg) return '';

        const svgTagMatch = svg.match(/<svg[^>]*>/);
        if (!svgTagMatch) return svg;
        const svgTag = svgTagMatch[0];

        const attrs =
            'class="title exclude-transition" id="title"' +
            ` style="view-transition-name: ${transitionName};"` +
            ` view-transition-class="${viewTransitionClass}"` +
            ' aria-label="' +
            title +
            '"' +
            (width
                ? ' width="' +
                  (width.match(/^\d+$/) ? width + 'px' : width) +
                  '"'
                : '');

        const newSvgTag = svgTag.replace('<svg', `<svg ${attrs}`);
        const sanitized = svg.replace(svgTag, newSvgTag);

        if (!browser) return sanitized;

        return DOMPurify.sanitize(sanitized, {
            ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'g', 'defs', 'use'],
            KEEP_CONTENT: true,
        });
    });
</script>

<div class="title-wrapper">
    {#if img}
        <img
            class="image-title exclude-transition"
            id="image-title"
            src={img}
            alt={title}
            style="width: {width}; view-transition-name: {transitionName};  transform: scaleY({scaleY});"
            style:view-transition-class={viewTransitionClass}
            loading="lazy"
        />
    {:else if svg}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html svgElement}
    {:else}
        <div
            class="title-container"
            style="view-transition-name: {transitionName};
            style:view-transition-class: {viewTransitionClass};"
        >
            <h1
                class="text-title title-main exclude-transition"
                id="title"
                aria-label={title}
            >
                {title}
            </h1>
            {#if title2}
                <h1
                    class="text-title title-overlay exclude-transition"
                    aria-label={title2}
                >
                    {title2}
                </h1>
            {/if}
        </div>
    {/if}
</div>

<style>
    * {
        position: relative;
    }

    @media (width >= 300px) {
        .title-wrapper {
            padding-top: 5em;

            @media (width <= 768px) {
                padding-top: 2.5em;
            }
        }

        .title-container {
            position: relative;
            text-align: center;
            margin-top: 5rem;
            view-timeline-name: page-title;

            @media (width >= 740px) {
                margin: 2rem auto;
            }
        }

        .text-title {
            font-family: var(--ultra);
            font-size: clamp(var(--h2), 11vw, 18rem);
            letter-spacing: -1px;
            text-transform: uppercase;
            font-kerning: none;
            color: var(--clr-light-500);
            padding: 0 1em;

            @media (width >= 990px) {
                font-weight: 800;
            }

            &.title-main {
                -webkit-text-stroke: 3px var(--clr-light-500);
                text-shadow: none;

                @media (width <= 768px) {
                    -webkit-text-stroke: 1px var(--clr-dark-500);
                    text-shadow:
                        0 0 1px var(--clr-light-500),
                        -1px -1px 0 var(--clr-dark-500),
                        1px -1px 0 var(--clr-dark-500),
                        -1px 1px 0 var(--clr-dark-500),
                        1px 1px 0 var(--clr-dark-500),
                        -1px 0 0 var(--clr-dark-500),
                        1px 0 0 var(--clr-dark-500),
                        0 -1px 0 var(--clr-dark-500),
                        0 1px 0 var(--clr-dark-500);
                }
            }

            &.title-overlay {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -48%);
                color: var(--clr-light-500);
                -webkit-text-stroke: 5px var(--clr-dark-500);
                text-shadow: none;

                @media (width <= 768px) {
                    -webkit-text-stroke: 1px var(--clr-dark-500);
                    transform: translate(-50%, -43.5%);
                    text-shadow:
                        0 0 1px var(--clr-light-500),
                        -2px -2px 0 var(--clr-dark-500),
                        2px -2px 0 var(--clr-dark-500),
                        -2px 2px 0 var(--clr-dark-500),
                        2px 2px 0 var(--clr-dark-500),
                        -2px 0 0 var(--clr-dark-500),
                        2px 0 0 var(--clr-dark-500),
                        0 -2px 0 var(--clr-dark-500),
                        0 2px 0 var(--clr-dark-500);
                }
            }
        }

        .image-title {
            display: block;
            margin-inline: auto;
            max-inline-size: 75%;
            height: auto;
            text-shadow: none;
            text-transform: none;
            letter-spacing: normal;
            font-kerning: auto;
            color: initial;

            @media (width <= 768px) {
                margin-bottom: -4em;
            }
        }

        #title {
            font-kerning: none;
        }
    }

    :global {
        ::view-transition-old(.slide-transition),
        ::view-transition-new(.slide-transition) {
            animation: none;
            mix-blend-mode: normal;
        }

        ::view-transition-old(.slide-transition) {
            animation: slide-out var(--title-transition-duration) ease-out
                forwards;
        }

        ::view-transition-new(.slide-transition) {
            animation: slide-in var(--title-transition-duration) ease-out
                forwards;
        }

        ::view-transition-old(.sveltekit-logo-transition),
        ::view-transition-new(.sveltekit-logo-transition) {
            animation: none;
            mix-blend-mode: normal;
        }
        ::view-transition-old(.sveltekit-logo-transition) {
            animation: slide-out 50ms ease-out forwards;
        }
        ::view-transition-new(.sveltekit-logo-transition) {
            animation: slide-in 100ms ease-out forwards;
        }
    }

    @keyframes slide-out {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100px);
        }
    }

    @keyframes slide-in {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
</style>
