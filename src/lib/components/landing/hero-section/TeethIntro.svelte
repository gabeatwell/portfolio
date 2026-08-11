<script lang="ts">
    import type { Snippet } from 'svelte';
    import { gsap } from '$lib/data/gsap';
    import type { Attachment } from 'svelte/attachments';

    let {
        children = (() => {}) as unknown as Snippet,
    }: { children?: Snippet } = $props();

    let done = $state(false);

    const teethIntro: Attachment<SVGSVGElement> = (teeth) => {
        // prefers-reduced-motion: skip the intro entirely
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            done = true;
            return;
        }

        const root = teeth.closest('.teeth-intro') as HTMLElement | null;
        if (!root) return;
        const topTeeth = gsap.utils.toArray<SVGRectElement>(
            '.top-tooth',
            teeth,
        );
        const bottomTeeth = gsap.utils.toArray<SVGRectElement>(
            '.bottom-tooth',
            teeth,
        );
        if (!topTeeth.length || !bottomTeeth.length) return;

        const hero = root.querySelector<HTMLElement>('.hero-stack');
        if (!hero) return;

        const timeline = gsap.timeline();

        // 1. top teeth slide up off-screen
        timeline.to(
            topTeeth,
            {
                attr: { y: -50 },
                duration: 1.5,
                ease: 'sine.inOut',
                stagger: { each: 0.15, from: 'center', ease: 'none' },
            },
            0,
        );

        // 2. bottom teeth slide down off-screen
        timeline.to(
            bottomTeeth,
            {
                attr: { y: 100 },
                duration: 1.5,
                ease: 'sine.inOut',
                stagger: { each: 0.15, from: 'center', ease: 'none' },
            },
            0,
        );

        // 3. hero dollies out from behind the teeth
        timeline.from(hero, { scale: 1.1, duration: timeline.duration() }, 0);

        // 4. unmount the teeth once the reveal is complete
        timeline.add(() => {
            done = true;
        });

        return () => timeline.kill();
    };
</script>

<div class="teeth-intro" class:clipped={!done}>
    <div class="hero-stack">
        {@render children()}
    </div>

    {#if !done}
        <svg
            class="teeth"
            {@attach teethIntro}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <!-- Top half: 5 teeth covering the top half, slide up to reveal -->
            <rect class="top-tooth" x="0" y="0" width="20" height="50" />
            <rect class="top-tooth" x="20" y="0" width="20" height="50" />
            <rect class="top-tooth" x="40" y="0" width="20" height="50" />
            <rect class="top-tooth" x="60" y="0" width="20" height="50" />
            <rect class="top-tooth" x="80" y="0" width="20" height="50" />
            <!-- Bottom half: mirrored teeth, slide down to reveal -->
            <rect class="bottom-tooth" x="0" y="50" width="20" height="50" />
            <rect class="bottom-tooth" x="20" y="50" width="20" height="50" />
            <rect class="bottom-tooth" x="40" y="50" width="20" height="50" />
            <rect class="bottom-tooth" x="60" y="50" width="20" height="50" />
            <rect class="bottom-tooth" x="80" y="50" width="20" height="50" />
        </svg>
    {/if}
</div>

<style>
    .teeth-intro {
        position: relative;
    }

    /* During the intro the hero is locked to the viewport so the teeth
       cover exactly what's on screen. The lock is released once the
       intro completes. */
    .teeth-intro.clipped {
        height: 100vh;
        overflow: hidden;
    }

    .hero-stack {
        position: relative;
        will-change: transform;
    }

    /* The teeth are a full-size overlay drawn in front of the hero —
       recolor the rects freely without touching the hero behind. */
    .teeth {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        pointer-events: none;

        & rect {
            fill: var(--clr-light-500);
            stroke: var(--clr-dark-500);
            stroke-width: 0.2;
        }
    }
</style>
