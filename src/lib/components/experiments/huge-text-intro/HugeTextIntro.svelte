<script lang="ts">
    import { gsap, ScrollTrigger } from '$lib/data/gsap';

    let words = $state([
        { text: 'My', dataText: 'and', active: false, done: false },
        { text: 'name', dataText: 'i', active: false, done: false },
        { text: 'is', dataText: 'am', active: false, done: false },
        { text: 'gabe', dataText: 'cool', active: false, done: false },
    ]);
    let introElement: HTMLElement | undefined = $state();
    let wordsWrapper: HTMLElement | undefined = $state();

    function handleMouseEnter(index: number) {
        words[index].active = true;
    }

    function handleMouseLeave(index: number) {
        words[index].active = false;
    }

    function scrollText() {
        const wrapper = wordsWrapper;
        if (!wrapper) return;

        const subWords = document.querySelectorAll<HTMLElement>('.sub-word');
        if (!subWords.length) return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.set(subWords, { scale: 0, y: 20 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: 'top center-=150',
                end: `+=${window.innerHeight * 1.5}`,
                scrub: true,
                pin: true,
                pinSpacing: true,
            },
        });

        tl.to(
            subWords,
            {
                scale: 1,
                opacity: 1,
                stagger: 0.2,
                duration: 1,
                ease: 'back.out',
            },
            0,
        );

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }

    // gsap
    $effect(() => {
        scrollText();
    });
</script>

<section class="title-intro" bind:this={introElement}>
    <div class="words-wrapper" bind:this={wordsWrapper}>
        {#each words as word, i (i)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="word"
                class:active={word.active}
                class:done={word.done}
                data-text={word.dataText}
                onmouseenter={() => handleMouseEnter(i)}
                onmouseleave={() => handleMouseLeave(i)}
            >
                <span class="word-inner">{word.text}</span>
                <span class="sub-word" aria-hidden="true">{word.dataText}</span>
            </div>
        {/each}
    </div>
</section>

<h2>scroll down 👇🏻</h2>

<style>
    .title-intro {
        line-height: 0.88;
        letter-spacing: -0.045em;
        font-weight: 700;
        text-transform: uppercase;
        /* color: var(--clr-light-500); */
        margin-top: clamp(3em, 8.5vw, 10.5em);
        block-size: 250vh;
        anchor-name: --text;

        & .words-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: center;
            align-items: center;
            width: fit-content;
        }

        & .word {
            display: inline-block;
            position: relative;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            font-family: var(--thunder);
            font-size: clamp(4.5rem, 11vw, 9.5rem);
            font-size: 20vw;
            font-weight: 800;
            transform: scaleY(1.3);
            margin-right: clamp(1rem, 1.5vw, 5rem);

            & .word-inner {
                display: inline-block;
                color: var(--clr-dark-200);
                text-shadow:
                    0 0 1px var(--clr-light-500),
                    -3px -3px 0 var(--clr-success-500),
                    3px -3px 0 var(--clr-success-500),
                    -3px 3px 0 var(--clr-success-500),
                    3px 3px 0 var(--clr-success-500),
                    -3px 0 0 var(--clr-success-500),
                    3px 0 0 var(--clr-success-500),
                    0 -3px 0 var(--clr-success-500),
                    0 3px 0 var(--clr-success-500);
            }

            & .sub-word {
                -webkit-text-stroke: 2px var(--clr-light-350);
                position: absolute;
                inset: 0;
                display: grid;
                place-items: center;
                color: var(--clr-fail-500);
                opacity: 0;
                transform: translateY(20px) scale(0);
                font-family: var(--ultra);
                font-size: 4vw;
                pointer-events: none;
                transform-origin: center;
            }

            &:hover .sub-word,
            &.active .sub-word,
            &.done .sub-word {
                transform: translateY(0) scale(1);
            }
        }
    }

    h2 {
        font-family: var(--thunder);
        font-size: clamp(1.3rem, 2.5vw, 2.9rem);
        text-align: center;

        position: absolute;
        position-anchor: --text;
        top: calc(anchor(top) + 0.5em);
        left: calc(anchor(center) - 3em);
    }
</style>
