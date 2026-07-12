<script lang="ts">
    import { gsap } from '$lib/data/gsap';

    interface Props {
        src: string;
        alt: string;
        text: string;
    }

    let { src, alt, text }: Props = $props();

    let imageContainer = $state<HTMLDivElement>();

    $effect(() => {
        const imageContainer: HTMLElement | null =
            document.querySelector('.image-container');
        const img = document.querySelector('.image-container img');
        const h1 = document.querySelector('h1');
        const abortController = new AbortController();

        if (!imageContainer || !img) return;

        gsap.set(img, { y: -50 });

        const handleMouseEnter = () => {
            gsap.to(img, { y: 0, duration: 0.75, ease: 'none' });
        };

        const handleMouseLeave = () => {
            gsap.to(img, {
                y: -50,
                duration: 0.75,
                borderTop: 0,
                ease: 'none',
            });
        };

        imageContainer.addEventListener('mouseenter', handleMouseEnter, {
            signal: abortController.signal,
        });
        imageContainer.addEventListener('mouseleave', handleMouseLeave, {
            signal: abortController.signal,
        });

        let mm = gsap.matchMedia();

        mm.add('(max-inline-size: 768px)', () => {
            gsap.set(h1, { yPercent: -50, fontWeight: 900 });

            const handleMobileMouseEnter = () => {
                gsap.to(img, { y: -10, duration: 0.75, ease: 'none' });
            };

            imageContainer.addEventListener(
                'mouseenter',
                handleMobileMouseEnter,
                {
                    signal: abortController.signal,
                },
            );
        });

        return () => {
            abortController.abort();
            mm.kill();
            gsap.killTweensOf([img, h1]);
        };
    });
</script>

<div class="image-container" bind:this={imageContainer}>
    <img {src} {alt} loading="lazy" />

    <h1>{text}</h1>
</div>

<style>
    .image-container {
        position: relative;
        width: calc(fit-content + 10%);
        height: 5in;
        background: var(--dark-blue);
        border-radius: 15px;
        margin: 5% 0 3% 0;
        padding: 2rem;

        & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 2;
            border-radius: 10px;
        }

        h1 {
            position: absolute;
            top: 96%;
            left: 50%;
            transform: translate(-50%, -96%);
            letter-spacing: 3px;
            font-family: var(--bronova);
            font-size: clamp(var(--h6), 2vw, var(--h3));
            font-weight: 700;
            color: var(--purple);
            text-wrap: nowrap;
        }
    }

    @media (max-inline-size: 768px) {
        .image-container {
            width: 90%;
            height: 75%;
            margin-top: 20%;
            margin-bottom: -5%;

            h1 {
                letter-spacing: 0;
                text-align: center;
            }
        }
    }
</style>
