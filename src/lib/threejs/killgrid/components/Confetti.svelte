<script lang="ts">
    interface Props {
        active: boolean;
        color: 'green' | 'red';
    }

    let { active, color }: Props = $props();

    let particles: {
        id: number;
        x: number;
        delay: number;
        size: number;
        drift: number;
        spin: number;
    }[] = $state([]);

    $effect(() => {
        if (active) {
            particles = Array.from({ length: 60 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 2,
                size: 6 + Math.random() * 8,
                drift: (Math.random() - 0.5) * 4,
                spin: Math.random() * 720 - 360,
            }));
        } else {
            particles = [];
        }
    });
</script>

{#if active}
    <div class="confetti-container">
        {#each particles as p (p.id)}
            <div
                class="particle {color}"
                style="left: {p.x}%; animation-delay: {p.delay}s; width: {p.size}px; height: {p.size *
                    0.6}px; --drift: {p.drift}px; --spin: {p.spin}deg;"
            ></div>
        {/each}
    </div>
{/if}

<style>
    .confetti-container {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 300;
        overflow: hidden;
    }

    .particle {
        position: absolute;
        top: -10px;
        border-radius: 2px;
        opacity: 0.9;
        animation: fall 3s ease-in forwards;
    }

    .particle.green {
        background: var(--clr-success-500, #2ecc71);
    }

    .particle.red {
        background: var(--clr-fail-500, #e74c3c);
    }

    @keyframes fall {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) translateX(var(--drift))
                rotate(var(--spin));
            opacity: 0;
        }
    }
</style>
