<script lang="ts">
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';
    import HeroBackground from './HeroBackground.svelte';
    import HeroContent from './HeroContent.svelte';

    type RandomCssBg = boolean | number | 'random';

    interface Particle {
        id: number;
        x: number;
        y: number;
        size: number;
        duration: number;
        delay: number;
    }

    interface Props {
        cssBg?: RandomCssBg;
    }

    function getRandomBackground(): number | boolean {
        if (typeof window === 'undefined') return false;

        const options: (number | boolean)[] = [true, 1, 2];
        const keys = options;
        const seenRaw = sessionStorage.getItem('seenBackgrounds');
        let seen: (number | boolean)[] = seenRaw ? JSON.parse(seenRaw) : [];

        if (seen.length >= keys.length) {
            seen = [];
        }

        const remaining = keys.filter((k) => !seen.includes(k));
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        seen.push(pick);
        sessionStorage.setItem('seenBackgrounds', JSON.stringify(seen));

        return pick;
    }

    let particles = $state<Particle[]>([]);
    let { cssBg = false }: Props = $props();
    let selectedBg = $derived(
        cssBg === 'random' ? getRandomBackground() : cssBg,
    );
    let mounted = $state<boolean>(false);

    const breakpoints = getBreakpoints();

    $effect(() => {
        mounted = true;

        const prefersReducedMotion = breakpoints.isReduced;

        // particle
        if (!prefersReducedMotion) {
            particles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 4 + 1,
                duration: Math.random() * 20 + 10,
                delay: Math.random() * 5,
            }));
        }
    });

    $effect(() => {
        if (selectedBg === 1) {
            document.documentElement.classList.add('tunnel-active');
        } else {
            document.documentElement.classList.remove('tunnel-active');
        }
    });
</script>

<article role="banner" aria-label="Hero section">
    <HeroBackground {selectedBg} {mounted} {particles} />

    <HeroContent {selectedBg} />
</article>

<style>
    article {
        position: relative;
        min-block-size: 100svh;
        height: auto;
        overflow: clip;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 5rem 0 0 0;
        margin-top: 1.75em;
        font-size: clamp(var(--h6), 4vw, var(--h1));
        background-color: transparent;
        box-shadow: none;

        @media (height <= 768px) {
            min-height: auto;
            height: auto;
            padding: 1em 0 0 0;
            margin-top: 3.5em;
        }
    }

    @keyframes gradientShift {
        0% {
            background: linear-gradient(
                135deg,
                rgba(23, 38, 44, 0.95) 0%,
                rgba(30, 60, 80, 0.9) 30%,
                rgba(45, 85, 120, 0.85) 60%,
                rgba(20, 40, 60, 0.95) 100%
            );
        }
        25% {
            background: linear-gradient(
                135deg,
                rgba(26, 44, 54, 0.95) 0%,
                rgba(35, 65, 90, 0.9) 30%,
                rgba(40, 80, 115, 0.85) 60%,
                rgba(25, 45, 65, 0.95) 100%
            );
        }
        50% {
            background: linear-gradient(
                135deg,
                rgba(30, 50, 70, 0.95) 0%,
                rgba(40, 70, 100, 0.9) 30%,
                rgba(25, 45, 65, 0.85) 60%,
                rgba(35, 55, 75, 0.95) 100%
            );
        }
        75% {
            background: linear-gradient(
                135deg,
                rgba(27, 44, 57, 0.95) 0%,
                rgba(35, 65, 90, 0.9) 30%,
                rgba(35, 65, 95, 0.85) 60%,
                rgba(28, 48, 68, 0.95) 100%
            );
        }
        100% {
            background: linear-gradient(
                135deg,
                rgba(23, 38, 44, 0.95) 0%,
                rgba(30, 60, 80, 0.9) 30%,
                rgba(45, 85, 120, 0.85) 60%,
                rgba(20, 40, 60, 0.95) 100%
            );
        }
    }

    @keyframes float {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(180deg);
            opacity: 0;
        }
    }

    @keyframes shapeFloat {
        0%,
        100% {
            transform: translateY(0) rotate(0deg);
        }
        33% {
            transform: translateY(-20px) rotate(120deg);
        }
        66% {
            transform: translateY(10px) rotate(240deg);
        }
    }

    @keyframes blink {
        0%,
        50% {
            opacity: 0.1;
        }
        51%,
        100% {
            opacity: 0;
        }
    }
</style>
