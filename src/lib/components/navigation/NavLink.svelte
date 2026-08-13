<script lang="ts">
    import { page } from '$app/state';
    import { useSound } from '$lib/data/stores/sounds/uiSounds.svelte';

    interface Props {
        href: string;
        title: string;
        index?: number;
        onclick?: (event: MouseEvent) => void;
        viewTransitionName?: string;
    }
    let {
        href,
        title,
        index = 0,
        viewTransitionName = undefined,
        onclick,
    }: Props = $props();

    const { playSoundAsync: playHoverSound } = useSound(
        '/sounds/foley-bubble.wav',
    );

    // only apply view-transition-name when NOT on the target page
    let shouldTransition = $derived(
        viewTransitionName && page.url.pathname !== href,
    );
    let isReverse = $derived(index % 2 === 1);

    async function handleClick(event: MouseEvent) {
        await playHoverSound();
        onclick?.(event);
    }
</script>

<a class="nav-link" {href} onclick={handleClick} data-reverse={isReverse}
    ><span
        style={shouldTransition
            ? `view-transition-name: ${viewTransitionName};`
            : ''}>{title}</span
    >
</a>

<style>
    .nav-link {
        font-family: var(--bronova-bold);
        font-size: clamp(var(--h6), 1.25vw, var(--h5));
        font-weight: 900;
        letter-spacing: 2px;
        color: var(--clr-light-500);
        background-color: transparent;
        transition: opacity 0.15s ease-out;
        pointer-events: auto;
        mix-blend-mode: difference;

        position: relative;
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.55rem;
        border-radius: var(--radius);
        isolation: isolate;
        overflow: clip;
        opacity: 1;
        transition:
            opacity 0.15s ease-out,
            color 0.15s ease-out;
        will-change: opacity;

        @media (width >= 300px) and (width <= 750px) {
            mix-blend-mode: normal;
        }

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: -1;
            background: color-mix(
                in oklch,
                var(--clr-light-500) 15%,
                transparent
            );
            transform: translateY(-110%) skewY(2deg);
            transform-origin: bottom;
            transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
            will-change: transform;
        }

        &::after {
            content: '';
            position: absolute;
            left: 0.55rem;
            right: 0.55rem;
            bottom: 0.3rem;
            height: 0.1em;
            background: currentColor;
            transform: scaleX(0);
            transform-origin: left center;
            transition: transform 0.28s ease-out;
            will-change: transform;
        }

        &[data-reverse='true']::after {
            transform-origin: right center;
        }

        &:focus-visible {
            background: transparent;
            outline: 1px solid var(--clr-light-500);
            outline-offset: 1px 2px;
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover::before,
            &:focus-visible::before {
                transform: translateY(0) skewY(0deg);
            }

            &:hover::after,
            &:focus-visible::after {
                transform: scaleX(1);
            }
        }
    }
</style>
