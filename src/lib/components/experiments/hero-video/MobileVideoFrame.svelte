<script lang="ts">
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';
    import { goto } from '$app/navigation';
    import { gsap, SplitText } from '$lib/data/gsap';

    interface Props {
        firstTitle?: string;
        secondTitle?: string;
        videoSrc?: string;
        videos?: string[];
    }

    let {
        firstTitle = '',
        secondTitle = '',
        videoSrc = '',
        videos = [],
    }: Props = $props();
    let currentVideoIndex = $state(0);
    let activeVideoSrc = $state('');
    let isMobile = $state(false);

    const breakpoints = getBreakpoints();

    $effect.pre(() => {
        const abortController = new AbortController();

        // mobile check
        const checkMobile = () => {
            isMobile = breakpoints.isMobile;
        };
        checkMobile();

        window.addEventListener('resize', checkMobile, {
            signal: abortController.signal,
        });

        return () => {
            abortController.abort();
        };
    });

    $effect(() => {
        activeVideoSrc = videoSrc;
    });

    function handleVideoSwitch() {
        if (videos.length > 0) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * videos.length);
            } while (newIndex === currentVideoIndex && videos.length > 1);

            currentVideoIndex = newIndex;
            activeVideoSrc = videos[currentVideoIndex];
        }
    }

    function link() {
        goto('/projects');
    }

    function splitTitleIntoWords(text: string) {
        return text.split(' ').map((word) => ({ word }));
    }
    let words = $derived(splitTitleIntoWords(firstTitle));

    // gsap
    $effect(() => {
        const textContent = document.querySelector('.text-content');
        const smartphone = document.querySelector('.smartphone');

        let splitTitle = SplitText.create(
            textContent?.querySelector('h2') as Element,
            {
                type: 'chars',
            },
        );

        if (!textContent || !smartphone) return;

        const tl = gsap.timeline();

        tl.fromTo(
            textContent,
            { autoAlpha: 0 },
            {
                autoAlpha: 1,
                duration: 2,
                ease: 'power2.out',
            },
        )
            .fromTo(
                smartphone,
                { rotation: -180, autoAlpha: 0, scale: 1.5 },
                {
                    rotation: 0,
                    autoAlpha: 1,
                    scale: 1,
                    duration: 2.25,
                    ease: 'power2.out',
                },
                '<',
            )
            .fromTo(
                splitTitle.chars,
                { rotationX: -90, autoAlpha: 0 },
                {
                    rotationX: 0,
                    autoAlpha: 1,
                    duration: 2,
                    ease: 'back.out',
                    letterSpacing: 'clamp(1px, 2vw, 9px)',
                    stagger: {
                        amount: 0.5,
                        from: 'center',
                    },
                },
                '<',
            );

        // const devTools = GSDevTools.create();

        return () => {
            tl.kill();
            // devTools?.kill();
        };
    });
</script>

<div class="background-image">
    <img
        src="https://cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@main/images/mobile-hands.webp"
        alt=""
    />
</div>

<div class="all-content">
    <div class="smartphone">
        <div class="content">
            <video
                src={activeVideoSrc}
                autoplay
                muted
                loop
                playsinline
                style="inline-size: 100%; block-size: 100%; border: none; display: block;"
            ></video>
        </div>

        <button
            class="video-switch"
            onclick={handleVideoSwitch}
            aria-label="switch video"
        ></button>
    </div>

    <div class="text-content">
        <h2 class="title">
            <span>{firstTitle}</span>
            <span>{secondTitle}</span>
        </h2>

        <h3 class="subtitle">perfect for smartphones</h3>

        <h4 class="directions">
            click the button on the smartphone to change videos
        </h4>

        <button class="cta" onclick={link}>learn more</button>
    </div>
</div>

<style>
    .background-image {
        position: fixed;
        top: 0;
        left: 0;
        inline-size: 100%;
        block-size: auto;
        overflow: hidden;
        z-index: 0;
        pointer-events: none;

        & img {
            inline-size: 100%;
            block-size: 100%;
            object-fit: cover;
            display: block;
            filter: brightness(0.5);
            /* transform: rotate(14deg) scale(3); */
            opacity: 0.2;
        }
    }

    .all-content {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1em;
        user-select: none;
    }

    .smartphone {
        position: relative;
        inline-size: clamp(280px, 90vw, 360px);
        aspect-ratio: 9 / 16;
        margin: auto;
        margin-top: 10em;
        border: clamp(8px, 4vw, 16px) solid var(--clr-light-400);
        border-top-width: clamp(30px, 8vh, 60px);
        border-bottom-width: clamp(30px, 8vh, 60px);
        border-radius: clamp(20px, 5vw, 36px);
        opacity: 0;

        &::before {
            content: '';
            display: block;
            inline-size: clamp(40px, 10vw, 60px);
            block-size: clamp(3px, 0.5vh, 5px);
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #333;
            border-radius: 10px;
        }

        & .content {
            inline-size: 100%;
            block-size: 100%;
            background: #fff;

            & video {
                inline-size: 100%;
                block-size: 100%;
                display: block;
                object-fit: cover;
            }
        }
    }

    .video-switch {
        inline-size: clamp(25px, 6vw, 35px);
        block-size: clamp(25px, 6vw, 35px);
        position: absolute;
        bottom: -85px;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #333;
        border-radius: 50%;
        cursor: pointer;
        padding: 0;
        transition: background 0.2s ease;

        @media (width <= 768px) {
            bottom: -65px;
        }

        &:hover {
            background: #555;
        }

        &:active {
            transform: translate(-50%, -50%) scale(0.95);
        }
    }

    .text-content {
        display: grid;
        align-items: center;
        grid-template-columns: repeat(minmax(0, 1fr), 2);
        grid-template-areas:
            'title title'
            /* '. subtitle' */
            'directions directions'
            /* 'cta .'; */;
        block-size: 30vh;
        gap: 1em;
        margin-right: 10vw;

        @media (width <= 768px) {
            grid-template-columns: 1fr;
            grid-template-areas:
                'title'
                'subtitle'
                'directions'
                'cta';
            text-align: center;
            margin: 0;
        }

        & .title {
            font-family: var(--ultra);
            font-size: clamp(var(--h5), 4vw, var(--lg));
            margin: 0;
            padding: 0;
            grid-area: title;
            transform: scaleY(2.5);
            line-height: 1;
            anchor-name: --subtitle;

            color: var(--clr-dark-500);
            text-shadow:
                0 0 1px var(--clr-dark-500),
                -1px -1px 0 var(--clr-blue-350),
                1px -1px 0 var(--clr-blue-350),
                -1px 1px 0 var(--clr-blue-350),
                1px 1px 0 var(--clr-blue-350),
                -1px 0 0 var(--clr-blue-350),
                1px 0 0 var(--clr-blue-350),
                0 -1px 0 var(--clr-blue-350),
                0 1px 0 var(--clr-blue-350);

            @media (width <= 768px) {
                letter-spacing: 1px;
                margin-inline: auto;
            }

            & span {
                @media (width <= 768px) {
                    display: block;
                }
            }
        }

        & .subtitle {
            color: var(--clr-blue-400);
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 1.2vw, var(--h4));
            font-weight: 300;
            margin: 4em 0 0.125em 0;
            padding: 0;

            position: absolute;
            position-anchor: --subtitle;
            top: calc(anchor(top) + 3em);
            left: calc(anchor(right) - 15em);
            anchor-name: --desc;
        }

        & .directions {
            color: var(--clr-light-400);
            font-family: var(--bronova);
            font-size: clamp(var(--xs), 1vw, var(--h5));
            font-weight: 400;
            letter-spacing: 2px;
            transform: scaleY(1.75);
            margin: 1em 0;
            padding: 0;
            grid-area: directions;

            anchor-name: --button;
        }

        & .cta {
            font-family: var(--mono);
            font-size: clamp(var(--sm), 1.25vw, var(--h2));
            border: 1px solid var(--clr-blue-350);
            background: transparent;
            color: var(--clr-blue-350);
            border-radius: var(--radius);
            cursor: pointer;
            margin: 0;
            margin-left: 2em;
            padding: clamp(0.2em, 1.2vw, 0.4em) clamp(0.4em, 2vw, 0.8em);
            inline-size: clamp(80px, 15vw, 200px);
            block-size: clamp(2em, 4vh, 3em);
            overflow: hidden;
            text-overflow: ellipsis;
            position: absolute;
            position-anchor: --button;
            top: calc(anchor(top) + 3em);
            left: calc(anchor(left) + 2em);

            @media (width <= 925px) {
                line-height: 0.75;
            }
        }
    }
</style>
