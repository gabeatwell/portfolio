<script lang="ts">
    import type { Attachment } from 'svelte/attachments';

    interface Props {
        src: string;
        alt: string;
        width?: string;
        height?: string;
        scaleY?: string;
        aspectRatio?: string;
        style?: string;
        class?: string;
        viewTransitionName?: string;
        viewTransitionClass?: string;
    }

    let {
        src,
        alt,
        width,
        height,
        scaleY,
        aspectRatio,
        style,
        class: className,
        viewTransitionName,
        viewTransitionClass,
    }: Props = $props();

    let imageError = $state(false);
    let isSmallScreen = $state(false);

    let computedHeight = $derived.by(() => {
        if (height) return height;
        if (width && aspectRatio) {
            const [w, h] = aspectRatio.split('/').map(Number);
            if (w && h) {
                return Math.round((Number(width) * h) / w);
            }
        }
        return undefined;
    });

    let inlineStyles = $derived.by(() => {
        const parts: string[] = [];

        if (aspectRatio) parts.push(`aspect-ratio: ${aspectRatio}`);
        if (viewTransitionName)
            parts.push(`view-transition-name: ${viewTransitionName}`);
        if (scaleY) {
            const value = isSmallScreen ? '1.3' : scaleY;
            parts.push(`transform: scaleY(${value})`);
        }
        if (style) parts.push(style);

        return parts.join('; ');
    });

    // tracks viewport size for responsive scaleY
    const trackSmallScreen: Attachment = () => {
        const mq = window.matchMedia('(width <= 768px)');
        isSmallScreen = mq.matches;

        const handler = (e: MediaQueryListEvent) => {
            isSmallScreen = e.matches;
        };
        mq.addEventListener('change', handler);

        return () => mq.removeEventListener('change', handler);
    };

    // applies view-transition-class when the prop changes
    const applyViewTransitionClass: Attachment<HTMLElement> = (node) => {
        if (viewTransitionClass) {
            node.style.setProperty(
                'view-transition-class',
                viewTransitionClass,
            );
            node.setAttribute('view-transition-class', viewTransitionClass);
        } else {
            node.style.removeProperty('view-transition-class');
            node.removeAttribute('view-transition-class');
        }
    };
</script>

<div class="image-container" {@attach trackSmallScreen}>
    <img
        {src}
        {alt}
        {width}
        class={className}
        height={computedHeight}
        style={inlineStyles}
        class:hidden={imageError}
        class:has-width={!!width}
        loading="lazy"
        {@attach applyViewTransitionClass}
        onerror={() => {
            imageError = true;
        }}
    />

    {#if imageError}
        <div class="error-message">
            We failed to load the image of '{alt}' 😵‍💫
        </div>
    {/if}
</div>

<style>
    .image-container {
        position: relative;
        display: flex;
        align-items: center;

        &:focus {
            outline: 1px solid var(--clr-light-500);
            background: transparent;
            box-shadow: none;
        }

        & img {
            max-inline-size: 100%;
            block-size: auto;
            object-fit: contain;
            border-radius: var(--radius);
            z-index: 20;
            margin-inline: auto;
            display: block;
            pointer-events: none;
            opacity: 1;

            &:focus,
            &:focus-within {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
                box-shadow: none;
            }

            &:not(.has-width) {
                inline-size: 100%;
            }

            &.hidden {
                display: none;
            }
        }

        & .error-message {
            position: absolute;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: var(--clr-dark-500);
            border: 1px solid var(--clr-light-500);
            color: var(--clr-light-500);
            white-space: pre-wrap;
            padding: 1em;
            pointer-events: none;
            z-index: 1;
            font-weight: bold;
            font-size: clamp(var(--xs), 1vw, var(--h6));
            border-radius: var(--radius);
            white-space: normal;
            box-sizing: border-box;

            @media (width <= 500px) {
                padding: 0.25em;
                inline-size: 40vw;
            }
        }
    }
</style>
