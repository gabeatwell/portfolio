<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { browser } from '$app/environment';
    import { gsap } from '$lib/data/gsap';

    interface Props {
        text?: string;
        fontSize?: string;
        fontWeight?: number;
        letterSpacing?: string;
        lineHeight?: number;
        intensity?: number;
        amplitude?: number;
        centerOffset?: number;
        pace?: number;
        enter?: number;
        hold?: number;
        exit?: number;
        pause?: number;
        loop?: boolean;
        frontColor?: string;
        backColor?: string;
        backFontOpacity?: number;
        showBackFont?: boolean;
        showLive?: boolean;
        liveOnTop?: boolean;
        liveVisibleAtHome?: boolean;
    }

    let {
        text = 'atwell',
        fontSize = 'clamp(var(--h4), 20vw, var(--xxxl))',
        fontWeight = 800,
        letterSpacing = '-0.02em',
        lineHeight = 1,
        intensity = 0.64,
        amplitude = 64,
        centerOffset = 22,
        pace = 2, // per-segment frame delay
        enter = 40, // frames for enter phase
        hold = 5, // frames for hold phase
        exit = 36, // frames for exit phase
        pause = 24, // frames for pause phase
        loop = true,
        frontColor = 'var(--clr-light-500)',
        backColor = '#aaa',
        backFontOpacity = 0.2,
        showBackFont = true,
        showLive = true,
        liveOnTop = true,
        liveVisibleAtHome = true,
    }: Props = $props();

    let segments = $derived(
        [
            ...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(
                text,
            ),
        ].map((s) => s.segment),
    );
    let segmentCount = $derived(segments.length);

    let containerEl: HTMLElement | undefined = $state();
    let segmentRefs: HTMLElement[] = [];
    let yOffsets = $derived(
        segments.map((_, i) => {
            const centerIdx = (segmentCount - 1) / 2;
            const dist =
                centerIdx === 0 ? 0 : Math.abs(i - centerIdx) / centerIdx;
            const dir = i % 2 === 0 ? 1 : -1;

            return (amplitude + dist * centerOffset) * intensity * dir;
        }),
    );

    onMount(() => {
        if (!browser) return;

        let tl: gsap.core.Timeline | undefined;

        tick().then(() => {
            if (segmentRefs.length !== segmentCount || !containerEl) return;

            const f = (frames: number) => frames / 60;

            const timeline = gsap.timeline({
                paused: false,
                repeat: loop ? -1 : 0,
                yoyo: true,
            });
            tl = timeline;

            // const targets = segmentRefs.filter(Boolean);
            const centerIdx = (segmentCount - 1) / 2;

            segmentRefs.filter(Boolean).forEach((el, i) => {
                if (!el) return;

                const dist = Math.abs(i - centerIdx) / centerIdx;
                const dir = i % 2 === 0 ? 1 : -1;
                const offset =
                    (amplitude + dist * centerOffset) * intensity * dir;
                const stagger = Math.abs(i - centerIdx) * f(pace);

                // Animate to center — yoyo handles the return
                timeline.to(
                    el,
                    {
                        y: 0,
                        ease: 'power2.inOut',
                        duration: f(enter),
                    },
                    stagger,
                );
            });

            // Add a hold at center + hold at fanned-out using timeline total duration
            if (hold > 0 || pause > 0) {
                const totalAnimDuration =
                    f(enter) + Math.abs(segmentCount - 1) * f(pace);
                // Pause at peak (center) — yoyo will reverse after this
                tl.to({}, { duration: f(hold) }, totalAnimDuration)
                    // Pause at bottom (fanned out) — after yoyo reverses
                    .to(
                        {},
                        { duration: f(pause) },
                        `+=${totalAnimDuration + f(hold)}`,
                    );
            }
        });

        return () => {
            tl?.kill();
        };
    });
</script>

<section class="vertical-text-wrapper">
    <!-- ghost bg -->
    {#if showBackFont}
        <div
            class="ghost-layer"
            class:live-on-top={liveOnTop}
            style="font-size: {fontSize}; font-weight: {fontWeight}; letter-spacing: {letterSpacing}; line-height: {lineHeight}; opacity: {backFontOpacity}; color: {backColor};"
            aria-hidden="true"
        >
            {#each segments as segment}
                <span class="segment">{segment}</span>
            {/each}
        </div>
    {/if}

    <!-- main -->
    {#if showLive}
        <div
            bind:this={containerEl}
            class="live-layer"
            class:live-on-top={liveOnTop}
            style="font-size: {fontSize}; font-weight: {fontWeight}; letter-spacing: {letterSpacing}; line-height: {lineHeight}; color: {frontColor};"
        >
            {#each segments as segment, i}
                <span
                    bind:this={segmentRefs[i]}
                    class="segment"
                    style="display: inline-block; transform: translateY({yOffsets[
                        i
                    ]}px);">{segment}</span
                >
            {/each}
        </div>
    {/if}
</section>

<style>
    .vertical-text-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        overflow: hidden;

        & .ghost-layer,
        & .live-layer {
            position: absolute;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            user-select: none;
        }

        & .live-layer {
            z-index: 2;
        }

        & .ghost-layer {
            z-index: 1;
            pointer-events: none;
        }

        & .live-on-top {
            z-index: 2;
        }

        & .segment {
            display: inline-block;
            white-space: pre;
        }
    }
</style>
