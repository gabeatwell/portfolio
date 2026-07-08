<script lang="ts">
    import gsap from 'gsap';
    import { tick } from 'svelte';

    interface Props {
        text: string;
        span: string;
    }

    let { text, span }: Props = $props();

    let dynamicAriaLabel = $derived(`${text} ${span}`);
    let chars = $derived(span.split(''));
    let subtitleElement = $state<HTMLElement | null>(null);
    let charElements = $state<HTMLElement[]>([]);

    // gsap
    $effect(() => {
        if (chars.length === 0) return;
        const mm = gsap.matchMedia();

        tick().then(() => {
            if (!subtitleElement || !charElements.length) return;

            mm.add('(prefers-reduced-motion: no-preference)', () => {
                gsap.set(subtitleElement, { autoAlpha: 0, y: 75 });
                gsap.set(charElements, { scaleY: 1.5 });

                mm.add('(max-width: 768px)', () => {
                    gsap.set(charElements, { scaleY: 1.75 });
                });

                const tl = gsap.timeline();
                tl.to(subtitleElement, {
                    autoAlpha: 0.75,
                    y: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                }).fromTo(
                    charElements,
                    { x: '150%', opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 3,
                        ease: 'circ.out',
                        stagger: 0.5,
                    },
                    '-=0.5',
                );

                return () => tl.kill();
            });

            mm.add('(prefers-reduced-motion: reduce)', () => {
                gsap.set(subtitleElement, { autoAlpha: 0.75, y: 0 });
                gsap.set(charElements, { scaleY: 1, x: 0, opacity: 1 });
            });
        });

        return () => mm.revert();
    });
</script>

<section class="animated-text" aria-label={dynamicAriaLabel}>
    <h1 class="sentence">
        <span class="subtitle" bind:this={subtitleElement}>{text}</span>

        <a href="/threejs-blog/three-components">
            <span class="bigWord">
                {#each chars as char, i}
                    <span class="char" bind:this={charElements[i]}>{char}</span>
                {/each}
            </span>
        </a>
    </h1>
</section>

<style>
    .animated-text {
        padding-top: 10em;
        user-select: none;

        @media (width <= 768px) {
            margin-top: -15%;
        }

        .sentence {
            font-family: var(--bronova);
            font-size: clamp(1.25rem, 2.25vw, 10rem);
            font-weight: 100;
            text-align: center;
            margin: 0;
            padding: 2rem;

            @media (width <= 768px) {
                margin-top: 7%;
            }

            .bigWord {
                inline-size: 100%;
                font-family: var(--ultra);
                font-size: clamp(
                    calc(var(--lg) - 0.35em),
                    15vw + 0.05em,
                    22.5rem
                );
                text-wrap: nowrap;
                display: block;
                letter-spacing: 1px;
                line-height: 1.2;

                @media (width <= 768px) {
                    margin-top: 2%;
                }

                .char {
                    display: inline-block;
                    background-image: url('https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/gray-wood.webp');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: transparent;
                }
            }

            & .subtitle {
                display: inline-block;
                font-family: var(--bronova);
                font-weight: 300;
                color: oklch(from var(--clr-light-500) 0.7 c h);
            }
        }
    }

    .sentence,
    .bigWord {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
