<script lang="ts">
    import SEO from '$lib/data/SEO.svelte';

    const componentMap: Record<
        number,
        { load: () => Promise<any>; props?: Record<string, any> }
    > = {
        1: {
            load: () =>
                import('$lib/components/landing/hero-section/HeadshotHero.svelte'),
            props: {
                title: 'gabe atwell',
                cta: 'Creations',
                bgImage:
                    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/headshot-noBG_a.webp',
                text: 'I am a frontend developer who loves to create beautiful and functional websites. This website showcases my skills with some projects that I created. If you have any questions, feel free to contact me.. I look forward to hearing from you so we can discuss your goals for your online needs!',
                link: '/contact',
            },
        },
        2: {
            load: () =>
                import('$lib/components/experiments/hero-video/HeroVideo.svelte'),
            props: {
                videoSrc:
                    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/videos/Street-Video.mp4',
                title: 'component test',
                subtitle:
                    'This is a subtitle for the hero section. It can be a bit longer to provide more context about the content.',
                ctaText: 'Learn More',
            },
        },
        3: {
            load: () =>
                import('$lib/components/experiments/stretch/VerticalStretch.svelte'),
            props: {
                firstWord: 'testing',
                titleLetters: ['m', 'a', 'g', 'i', 'c'],
                firstMessage: "i'm testing out some",
                secondMessage: 'new layout stuff',
            },
        },
        4: {
            load: () =>
                import('$lib/components/experiments/hero-video/MobileVideoFrame.svelte'),
            props: {
                videoSrc:
                    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/videos/Waves-Crashing.mp4',
                videos: [
                    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/videos/Waves-Crashing.mp4',
                    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/videos/Street-Video.mp4',
                    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/videos/Web-Code.mp4',
                    'https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/videos/Html-Code.mp4',
                ],
                firstTitle: 'mobile',
                secondTitle: 'video',
            },
        },
        5: {
            load: () =>
                import('$lib/components/experiments/navigation/NewNav.svelte'),
        },
        6: {
            load: () =>
                import('$lib/components/experiments/image-zoom/ImageZoom.svelte'),
        },
        7: {
            load: () =>
                import('$lib/components/experiments/huge-text-intro/HugeTextIntro.svelte'),
        },
        8: {
            load: () =>
                import('$lib/components/experiments/huge-text-intro/LetterIntro.svelte'),
        },
        9: {
            load: () =>
                import('$lib/components/experiments/vertical-text/VerticalText.svelte'),
        },
        10: {
            load: () => import('$lib/components/photos/DialogVT.svelte'),
        },
    };

    const sortedKeys = Object.keys(componentMap)
        .map(Number)
        .sort((a, b) => a - b);
    let currentIndex = $state(1);
    let Component = $state<any>(null);
    let componentProps = $state<Record<string, any>>({});

    function goNext() {
        const pos = sortedKeys.indexOf(currentIndex);
        const nextPos = (pos + 1) % sortedKeys.length;
        currentIndex = sortedKeys[nextPos];
    }

    function goPrev() {
        const pos = sortedKeys.indexOf(currentIndex);
        const nextPos = (pos - 1 + sortedKeys.length) % sortedKeys.length;
        currentIndex = sortedKeys[nextPos];
    }

    $effect(() => {
        const key = currentIndex;
        const entry = componentMap[key];
        if (!entry) return;

        let cancelled = false;

        entry.load().then((module) => {
            if (!cancelled) {
                Component = module.default;
                componentProps = entry.props ?? {};
            }
        });

        return () => {
            cancelled = true;
        };
    });

    $effect(() => {
        const ac = new AbortController();

        function handleKeydown(event: KeyboardEvent) {
            if (event.key === 'ArrowRight') {
                goNext();
            } else if (event.key === 'ArrowLeft') {
                goPrev();
            }

            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            )
                return;
        }

        window.addEventListener('keydown', handleKeydown, {
            signal: ac.signal,
        });

        return () => {
            ac.abort();
        };
    });
</script>

<SEO
    title="Frontend Experiments"
    description="Explore Gabriel Atwell's interactive web experiments"
    keywords="three.js experiments, web development experiments, creative coding, gabe atwell, gabe experiments"
/>

{#key currentIndex}
    {#if Component}
        <Component {...componentProps} />
    {/if}
{/key}

<div class="nav">
    <button onclick={goPrev} aria-label="previous">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <title>previous</title><path
                d="M41.4 342.6C28.9 330.1 28.9 309.8 41.4 297.3L169.4 169.3C178.6 160.1 192.3 157.4 204.3 162.4C216.3 167.4 224 179.1 224 192L224 256L560 256C586.5 256 608 277.5 608 304L608 336C608 362.5 586.5 384 560 384L224 384L224 448C224 460.9 216.2 472.6 204.2 477.6C192.2 482.6 178.5 479.8 169.3 470.7L41.3 342.7z"
            /></svg
        >
    </button>

    <button onclick={goNext} aria-label="next">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
            ><title>next</title><path
                d="M598.6 297.4C611.1 309.9 611.1 330.2 598.6 342.7L470.6 470.7C461.4 479.9 447.7 482.6 435.7 477.6C423.7 472.6 416 460.9 416 448L416 384L80 384C53.5 384 32 362.5 32 336L32 304C32 277.5 53.5 256 80 256L416 256L416 192C416 179.1 423.8 167.4 435.8 162.4C447.8 157.4 461.5 160.2 470.7 169.3L598.7 297.3z"
            /></svg
        >
    </button>
</div>

<style>
    .nav {
        position: fixed;
        bottom: 1em;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 5em;
        background-color: transparent;
        color: var(--clr-light-500);
        padding: 0.5em 0.75em;
        border-radius: var(--radius);
        z-index: 300;

        & button {
            background: transparent;
            color: inherit;
            padding: 0.3rem 1rem;
            cursor: pointer;
            pointer-events: auto;
            border: 1px solid var(--clr-light-500);

            &:focus,
            &:focus-visible {
                outline: 2px solid var(--clr-light-500);
                outline-offset: -5px;
                border: none;
                box-shadow: none;
            }

            & svg {
                inline-size: 3em;
                fill: none;
                stroke: var(--clr-light-500);
                stroke-width: 30;

                &:hover {
                    stroke: var(--clr-light-400);
                }
            }
        }
    }
</style>
