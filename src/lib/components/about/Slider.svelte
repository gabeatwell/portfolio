<script lang="ts">
    import { browser } from '$app/environment';
    import Image from '$lib/components/layout/Image.svelte';
    import skills from '$lib/components/about/skills.json';
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte';

    type Skill = {
        alt: string;
        href: string;
        svg?: string;
        src?: string;
    };
    const typedSkills: Skill[] = skills;

    let isPaused = $state(false);

    const duplicatedSkills = [...typedSkills, ...typedSkills];

    const breakpoints = getBreakpoints();
    let duration = $derived(
        breakpoints.isReduced ? '120s' : breakpoints.isMobile ? '30s' : '50s',
    );
</script>

<div class="slider-wrapper">
    <div
        class="slider"
        class:paused={isPaused}
        onmouseenter={() => (isPaused = true)}
        onmouseleave={() => (isPaused = false)}
        role="region"
        aria-label="skills-carousel"
    >
        <div class="slider-track" style="animation-duration: {duration};">
            {#each duplicatedSkills as skill, i (i)}
                <a
                    href={skill.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="slide"
                    aria-label={skill.alt}
                >
                    {#if skill.svg}
                        <div class="icon">
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            {@html skill.svg}
                        </div>
                    {:else if skill.src}
                        <div class="icon">
                            <Image
                                src={skill.src}
                                alt={skill.alt}
                                aspectRatio="1/1"
                                style="width: 100%; height: 100%;"
                            />
                        </div>
                    {/if}
                </a>
            {/each}
        </div>
    </div>
</div>

<style>
    .slider-wrapper {
        max-inline-size: 90vw;
        inline-size: 100%;
        overflow: clip;
        background-color: transparent;
        padding: 2em 0;
        position: relative;
        margin-inline: auto;
        margin-block: 5em;
        margin-top: 7em;
        z-index: 5;

        @media (width <= 768px) {
            inline-size: 90%;
            padding: 3em 0;
            margin-block: 3em;
        }

        &::before,
        &::after {
            content: '';
            position: absolute;
            top: 0;
            inline-size: 100px;
            block-size: 100%;
            z-index: 2;
            pointer-events: none;
        }

        &::before {
            left: 0;
        }

        &::after {
            right: 0;
        }

        & .slider {
            width: 100%;
            position: relative;

            &.paused .slider-track {
                animation-play-state: paused;
            }

            & .slider-track {
                display: flex;
                will-change: transform;
                animation: scroll 75s linear infinite;

                & .slide {
                    flex-shrink: 0;
                    inline-size: 100px;
                    block-size: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-inline: 1.5em;
                    box-sizing: content-box;
                    transition: transform 0.3s ease;

                    &:focus {
                        outline: 1px solid var(--clr-light-500);
                        background: transparent;
                        box-shadow: none;
                    }

                    &:hover {
                        transform: scale(1.15);
                    }

                    &:nth-child(odd):hover {
                        rotate: -5deg;
                    }

                    &:nth-child(even):hover {
                        rotate: 5deg;
                    }

                    @media (width <= 768px) {
                        width: 80px;
                        height: 80px;
                    }

                    & .icon {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        filter: grayscale(20%);
                        transition: filter 0.3s ease;

                        &:hover {
                            filter: grayscale(0%);
                        }

                        &:active {
                            scale: 0.95;
                        }
                    }
                }
            }
        }
    }

    @keyframes scroll {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }
</style>
