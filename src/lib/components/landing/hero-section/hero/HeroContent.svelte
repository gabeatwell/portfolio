<script lang="ts">
    import { heroContentState } from './contentFunctions.svelte';
    import { heroContentStats } from '#lib/attachments/gsap/heroContentStats.js';
    import HeroButton from '../hero/HeroButton.svelte';
    import projects from '#lib/components/projects/projects.json';
    import ProjectsGrid from '../../ProjectsGrid.svelte';
    import HeroTitle from './HeroTitle.svelte';

    let { selectedBg = 0 as number | boolean } = $props();
    let isTunnel = $derived(selectedBg === 1);
    let isRibbon = $derived(selectedBg === 2);

    $effect(() => {
        heroContentState.animateTitle();
    });
</script>

<section aria-label="Introduction and portfolio overview" class="hero-content">
    <HeroTitle />

    <div
        class="content-wrapper"
        class:show={heroContentState.showContent}
        aria-live="polite"
    >
        <p
            class="summary indent"
            class:tunnel={isTunnel}
            class:ribbon={isRibbon}
        >
            I am a frontend developer who loves to create beautiful and
            functional websites. This website showcases my skills with some
            projects that I created. If you have any questions, feel free to
            contact me.. <br /><br /> I look forward to hearing from you so we can
            discuss your goals for your online needs!
        </p>

        <ProjectsGrid {projects} />

        <nav class="button-container" aria-label="Primary navigation">
            <HeroButton href="/projects" title="Creations" />
        </nav>

        <!-- stats -->
        <section
            aria-labelledby="stats-heading"
            class="stats-section"
            {@attach heroContentStats}
        >
            <h2 id="stats-heading" class="visually-hidden">
                Portfolio Statistics
            </h2>

            <dl class="stats-container">
                <div class="stat-item a">
                    <dt class="visually-hidden">Work approach</dt>
                    <dd class="stat-number" aria-label="100% custom">
                        <span class="stat-value">100%</span>
                        <span
                            class="stat-label"
                            class:tunnel={isTunnel}
                            class:ribbon={isRibbon}
                        >
                            Custom
                        </span>
                    </dd>
                </div>

                <div class="stat-item b">
                    <dt class="visually-hidden">Project delivery timeframe</dt>
                    <dd class="stat-number" aria-label="Fast">
                        <span class="stat-value">Fast</span>
                        <span
                            class="stat-label"
                            class:tunnel={isTunnel}
                            class:ribbon={isRibbon}
                        >
                            Delivery
                        </span>
                    </dd>
                </div>

                <div class="stat-item c">
                    <dt class="visually-hidden">Responsive design approach</dt>
                    <dd class="stat-number" aria-label="Fully responsive">
                        <span class="stat-value">Fully</span>
                        <span
                            class="stat-label"
                            class:tunnel={isTunnel}
                            class:ribbon={isRibbon}
                        >
                            Responsive
                        </span>
                    </dd>
                </div>
            </dl>
        </section>
    </div>
</section>

<style>
    .hero-content {
        position: relative;
        z-index: 1;
        width: 100%;
        max-inline-size: 1200px;
        padding: calc(var(--space-md) + 0.8rem);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        min-height: 80vh;

        @media (height <= 700px) {
            min-height: auto;
        }

        @media (width <= 768px) {
            padding: calc(var(--space-md) - 0.2rem);
        }

        & .content-wrapper {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.15s ease-out;

            @media (prefers-reduced-motion: reduce) {
                transform: none;
                transition: opacity 0.3s ease-out;
            }

            &.show {
                opacity: 1;
                transform: translateY(0);

                @media (prefers-reduced-motion: reduce) {
                    transform: none;
                }
            }

            & .summary {
                font-family: var(--bronova);
                font-size: clamp(var(--sm), 1.25vw, var(--h3));
                font-weight: 300;
                text-align: start;
                letter-spacing: 1px;
                line-height: 1.6;
                color: var(--clr-light-500);
                inline-size: clamp(300px, 65vw, 1300px);
                margin: 0 auto 3rem auto;
                user-select: none;

                background: rgba(0, 0, 0, 0.71);
                background: var(--clr-dark-500);
                padding: var(--padding-button);
                border: 1px solid var(--clr-gray-500-fade);
                border-radius: var(--radius);

                @media (width >= 990px) {
                    letter-spacing: 2px;
                }

                &.tunnel {
                    color: var(--fg);
                }

                &.ribbon {
                    background: rgba(0, 0, 0, 0.71);
                    background: var(--clr-dark-500);
                    padding: var(--padding-button-lg);
                    border: 1px solid var(--clr-gray-500-fade);
                    border-radius: var(--radius);
                    color: var(--clr-light-500);
                }
            }

            & .button-container {
                display: flex;
                gap: 1.5rem;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                margin-bottom: 3rem;
            }

            & .stats-section {
                margin-top: 2rem;

                & .stats-container {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                    list-style: none;
                    margin: 0;
                    padding: 0;

                    & .stat-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: calc(var(--space-md) - 0.2rem);
                        background: var(--clr-dark-500-fade);
                        border-radius: 12px;
                        backdrop-filter: blur(10px);
                        border: 2px solid var(--clr-gray-500-fade);
                        transition: all 0.3s ease;

                        &.a {
                            opacity: 0;
                            transform: translateX(-50px);
                        }
                        &.b {
                            opacity: 0;
                            transform: scale(1.5);
                        }
                        &.c {
                            opacity: 0;
                            transform: translateX(50px);
                        }

                        @media (prefers-reduced-motion: reduce) {
                            transition: none;
                        }

                        &:hover,
                        &:focus-within {
                            transform: translateY(-5px);
                            background: var(--clr-dark-500);
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

                            @media (prefers-reduced-motion: reduce) {
                                transform: none;
                            }
                        }

                        & .stat-number {
                            display: flex;
                            flex-direction: column;
                            align-items: center;

                            font-family: var(--ultra);
                            font-size: clamp(var(--h6), 3vw, var(--h2));
                            color: var(--clr-dark-500);
                            text-shadow:
                                0 0 3px var(--clr-light-500),
                                0 0 4px var(--clr-light-500),
                                0 0 5px var(--clr-light-500);
                            margin: 0;
                        }

                        & .stat-label {
                            font-family: var(--bronova);
                            font-size: clamp(var(--sm), 2.75vw, var(--h3));
                            color: var(--clr-light-500);
                            text-shadow:
                                0 0 3px var(--clr-dark-500),
                                0 0 4px var(--clr-dark-500),
                                0 0 5px var(--clr-dark-500);
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            margin-top: 0.5rem;
                            margin-bottom: 0;
                            font-weight: 600;

                            &.tunnel {
                                color: var(--clr-light-500);
                            }

                            &.ribbon {
                                color: var(--clr-light-500);
                            }
                        }
                    }
                }
            }
        }
    }

    /* tablet & mobile */
    @media (width <= 768px) {
        .hero-content {
            & .content-wrapper {
                & .stats-container {
                    gap: 1.5rem;

                    & .stat-item {
                        padding: calc(var(--space-md) - 0.45rem);
                    }
                }
            }
        }
    }

    :global(html:not(.js)) .content-wrapper {
        opacity: 1;
        transform: none;
    }

    :global(html:not(.js)) .stat-item.a,
    :global(html:not(.js)) .stat-item.b,
    :global(html:not(.js)) .stat-item.c {
        opacity: 1;
        transform: none;
    }
</style>
