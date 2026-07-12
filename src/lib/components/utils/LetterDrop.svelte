<script lang="ts">
    import { gsap } from '$lib/data/gsap';
    import { fade } from 'svelte/transition';

    let duration = $state<number>(300);

    $effect(() => {
        const letters = gsap.utils.toArray('.animated-letter');
        const drop = gsap.utils.toArray('.drop');

        gsap.set(letters, {
            scale: 1,
            autoAlpha: 1,
        });

        gsap.set(drop, {
            scale: 0,
            autoAlpha: 0,
        });

        gsap.to(drop, {
            scale: 1,
            transformOrigin: '50% 50%',
            autoAlpha: 1,
            duration: 1.5,
            delay: 0.5,
            ease: 'sine.out',
            stagger: {
                each: 0.25,
                from: 'edges',
            },
        });

        return () => {
            gsap.killTweensOf(letters);
            gsap.killTweensOf(drop);
        };
    });
</script>

<h1 class="animated-text" transition:fade={{ duration: duration }}>
    <div class="tilt">
        <span class="animated-letter drop">a</span>
        <span class="animated-letter drop">b</span>
        <span class="animated-letter drop">o</span>
        <span class="animated-letter drop">u</span>
        <span class="animated-letter drop">t</span>
    </div>

    <span class="animated-letter space"></span>

    <span class="animated-letter">m</span>
    <span class="animated-letter">e</span>
</h1>

<style>
    .animated-text {
        font-family: var(--anta);
        font-size: clamp(2rem, 9vw, 20rem);
        color: var(--blue);
        mix-blend-mode: lighten;
        text-align: center;
        margin-bottom: 15%;
        .animated-letter {
            display: inline-block;
        }

        .space {
            width: 3.5rem;

            @media (width <= 768px) {
                width: 1.5rem;
            }
        }

        .tilt {
            transform: rotate(-10deg);
            font-size: clamp(2.3rem, 15vw, 20rem);
            display: inline-block;
            text-shadow: 0px 0px 5px var(--dark-gray);
            filter: drop-shadow(0px 0px 0.5rem var(--smoke));
        }

        @media (width <= 768px) {
            font-weight: 400;
        }
    }
</style>
