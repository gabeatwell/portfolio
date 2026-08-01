<script lang="ts">
    import type { Snippet } from 'svelte';
    import { gsap } from '$lib/data/gsap';

    let {
        children = (() => {}) as unknown as Snippet,
    }: { children?: Snippet } = $props();

    let mask = $state<SVGSVGElement | null>(null);
    let done = $state(false);

    $effect(() => {
        if (!mask) return;

        // prefers-reduced-motion: skip the intro entirely
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            done = true;
            return;
        }

        // bars inside the clipPath — top half and mirrored bottom half
        const topBars = gsap.utils.toArray<SVGRectElement>('.top-bar', mask);
        const bottomBars = gsap.utils.toArray<SVGRectElement>(
            '.bottom-bar',
            mask,
        );
        if (!topBars.length || !bottomBars.length) return;

        const timeline = gsap.timeline();

        // 1. top bars grow upward from the center line, middle column outward
        timeline.to(
            topBars,
            {
                attr: { y: 0, height: 0.5 },
                duration: 1.5,
                ease: 'sine.inOut',
                stagger: { each: 0.15, from: 'center', ease: 'none' },
            },
            0,
        );

        // 2. bottom bars grow downward from the center line (mirrored)
        timeline.to(
            bottomBars,
            {
                attr: { y: 0.5, height: 0.5 },
                duration: 1.5,
                ease: 'sine.inOut',
                stagger: { each: 0.15, from: 'center', ease: 'none' },
            },
            0,
        );

        // 3. hero dollies out from behind the bars
        timeline.from(
            '.hero-stack',
            { scale: 1.1, duration: timeline.duration() },
            0,
        );

        // 3. release the clip so the hero renders unclipped
        timeline.add(() => {
            done = true;
        });

        return () => {
            timeline.kill();
        };
    });
</script>

<div class="hero-stack" class:clipped={!done}>
    {@render children()}
</div>

<svg
    class="hero-mask"
    bind:this={mask}
    width="0"
    height="0"
    viewBox="0 0 1 1"
    aria-hidden="true"
>
    <defs>
        <clipPath id="barsClip" clipPathUnits="objectBoundingBox">
            <!-- Top half: 5 bars anchored at the center line (y=0.5), growing upward -->
            <rect class="top-bar" x="0.00" y="0.5" width="0.20" height="0" />
            <rect class="top-bar" x="0.20" y="0.5" width="0.20" height="0" />
            <rect class="top-bar" x="0.40" y="0.5" width="0.20" height="0" />
            <rect class="top-bar" x="0.60" y="0.5" width="0.20" height="0" />
            <rect class="top-bar" x="0.80" y="0.5" width="0.20" height="0" />
            <!-- Bottom half: mirrored bars, growing downward -->
            <rect class="bottom-bar" x="0.00" y="0.5" width="0.20" height="0" />
            <rect class="bottom-bar" x="0.20" y="0.5" width="0.20" height="0" />
            <rect class="bottom-bar" x="0.40" y="0.5" width="0.20" height="0" />
            <rect class="bottom-bar" x="0.60" y="0.5" width="0.20" height="0" />
            <rect class="bottom-bar" x="0.80" y="0.5" width="0.20" height="0" />
        </clipPath>
    </defs>
</svg>

<style>
    .hero-stack {
        position: relative;
        will-change: transform;
    }

    /* During the intro the hero is constrained to the viewport so the mask's
       center line (y=0.5) lands on the horizontal center of the screen — the
       top bars grow up from mid-screen and the bottom bars grow down, both
       visible. The mask reveals the hero itself (no overlay). */
    .hero-stack.clipped {
        height: 100vh;
        overflow: hidden;
        clip-path: url(#barsClip);
    }

    /* The mask SVG is invisible — only its clipPath geometry is used */
    .hero-mask {
        position: absolute;
        overflow: hidden;
        pointer-events: none;

        & rect {
            fill: var(--clr-dark-200);
        }
    }
</style>
