<script lang="ts">
    let { size = 120, duration = 6, tilt = 55, imageUrl = '' } = $props();

    const orbitRadius = size * 0.7;
    const moonSize = size * 0.28;
</script>

<div
    class="orbit-logo"
    style="
    --planet: {size}px;
    --moon: {moonSize}px;
    --orbit-radius: {orbitRadius}px;
    --system: {orbitRadius * 2 + moonSize}px;
    --duration: {duration}s;
    --tilt: {tilt}deg;
  "
>
    <div class="system">
        {#if imageUrl}
            <img src={imageUrl} alt="" class="planet-img" />
        {:else}
            <div class="planet"></div>
        {/if}

        <div class="orbit">
            <div class="moon"></div>
        </div>
    </div>
</div>

<style>
    .orbit-logo {
        width: var(--system);
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        perspective: calc(var(--system) * 2.5);

        & .system {
            position: relative;
            width: var(--system);
            height: var(--system);
            transform-style: preserve-3d;

            & .planet-img {
                position: absolute;
                top: 50%;
                left: 50%;
                width: var(--planet);
                aspect-ratio: 1;
                border-radius: 50%;
                translate: -50% -50%;
                object-fit: cover;
            }

            & .planet {
                position: absolute;
                top: 50%;
                left: 50%;
                width: var(--planet);
                aspect-ratio: 1;
                border-radius: 50%;
                translate: -50% -50%;
                background: radial-gradient(
                    circle at 35% 30%,
                    var(--clr-success-500),
                    var(--clr-blue-500)
                );
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
            }

            & .orbit {
                position: absolute;
                inset: 0;
                transform-style: preserve-3d;
                animation: spin var(--duration) linear infinite;

                & .moon {
                    position: absolute;
                    top: calc(50% - var(--moon) / 2);
                    left: calc(50% + var(--orbit-radius) - var(--moon) / 2);
                    width: var(--moon);
                    aspect-ratio: 1;
                    border-radius: 50%;
                    background: var(--clr-light-500-fade);
                    background: oklch(from var(--clr-success-500) 0.35 c h / 1);
                    box-shadow: inset calc(var(--moon) * -0.2) 0 0
                        oklch(0% 0 0 / 0.25);
                    animation: counter-spin var(--duration) linear infinite;
                }
            }
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .orbit {
            animation: none;
            transform: rotateX(var(--tilt)) rotateZ(40deg);
        }
        .moon {
            animation: none;
            transform: rotateZ(-40deg) rotateX(calc(var(--tilt) * -1));
        }
    }

    @keyframes spin {
        from {
            transform: rotateX(var(--tilt)) rotateZ(0turn);
        }
        to {
            transform: rotateX(var(--tilt)) rotateZ(1turn);
        }
    }

    @keyframes counter-spin {
        from {
            transform: rotateZ(0turn) rotateX(calc(var(--tilt) * -1));
        }
        to {
            transform: rotateZ(-1turn) rotateX(calc(var(--tilt) * -1));
        }
    }
</style>
