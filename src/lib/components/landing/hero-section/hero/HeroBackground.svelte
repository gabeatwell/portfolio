<script lang="ts">
    import UltraA from '../../logos/UltraA.svelte';

    interface Particles {
        id: number;
        x: number;
        y: number;
        size: number;
        duration: number;
        delay: number;
    }

    interface Props {
        selectedBg: number | boolean;
        mounted: boolean;
        particles: Particles[];
    }

    let { selectedBg, mounted, particles }: Props = $props();

    const Tunnel = () => import('$lib/threejs/tunnel/Tunnel.svelte');
    const Ribbon = () => import('$lib/threejs/ribbon/Ribbons.svelte');
</script>

<div class="background-wrapper" aria-hidden="true">
    {#if selectedBg === true}
        <div class="gradient-bg"></div>

        {#if mounted}
            {#each particles as particle (particle.id)}
                <div
                    class="particle"
                    aria-hidden="true"
                    style="
                        left: {particle.x}px;
                        top: {particle.y}px;
                        width: {particle.size}px;
                        height: {particle.size}px;
                        animation-duration: {particle.duration}s;
                        animation-delay: {particle.delay}s;
                    "
                ></div>
            {/each}
        {/if}

        <svg class="shape circle" aria-hidden="true" viewBox="0 0 100 100">
            <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                // stroke="var(--clr-light-500)"
                stroke-width="2"
                opacity="0.3"
            />
        </svg>

        <svg class="shape star" aria-hidden="true" viewBox="0 0 100 100">
            <polygon
                points="50,5 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35"
                fill="transparent"
                // stroke="var(--clr-light-500)"
                stroke-width="2"
                opacity="0.3"
            />
        </svg>

        <UltraA class="ultra-gradient" />
        <div class="shape big-circle" aria-hidden="true"></div>
    {:else if selectedBg === 1}
        {#await Tunnel() then module}
            {@const Comp = module.default}
            <Comp />
        {/await}
    {:else if selectedBg === 2}
        {#await Ribbon() then module}
            {@const Comp = module.default}
            <Comp />
        {/await}
    {/if}
</div>

<style>
    .background-wrapper {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;

        & .gradient-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            background: var(--clr-hero-gradient);
            opacity: 0.85;
            animation: gradientShift 50s ease-out infinite;
        }

        & .particle {
            position: absolute;
            background: var(--clr-gray-500);
            border-radius: 50%;
            pointer-events: none;
            animation: float linear infinite;
        }

        & .shape {
            position: absolute;
            border-radius: 30%;
            opacity: 0.2;
            animation: shapeFloat 20s ease-out infinite;

            @media (width <= 500px) {
                opacity: 0.3;
            }

            &.circle {
                top: 7.5%;
                left: 10%;
                width: 10vw;
                height: 10vw;
                animation: blink 5s ease-in-out infinite;
                animation-delay: 0s;
                stroke: var(--clr-light-500);

                @media (width <= 768px) {
                    top: 8%;
                    left: 7%;
                    width: 20vw;
                    height: 20vw;
                    stroke-width: 8;
                    opacity: 0.4;
                }
            }

            &.star {
                top: 15%;
                right: 5%;
                width: 30vw;
                height: 30vw;
                animation-delay: 2s;
                transform: rotate(35deg);
                stroke: var(--clr-light-500);
            }

            &.big-circle {
                top: 70%;
                right: 2%;
                width: 50vw;
                height: 50vw;
                background: linear-gradient(
                    90deg,
                    var(--clr-blue-500) 40%,
                    transparent 60%
                );
                animation-delay: 0s;
                border-radius: 50%;

                @media (width <= 768px) {
                    top: 18%;
                    left: 5%;
                    background: linear-gradient(
                        45deg,
                        transparent 40%,
                        var(--clr-blue-500) 60%
                    );
                }
            }
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .background-wrapper {
            & .gradient-bg {
                animation: none;
            }

            & .particle {
                animation: none;
                opacity: 0;
            }

            & .shape {
                animation: none;
            }
        }
    }
</style>
