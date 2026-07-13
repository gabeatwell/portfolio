<script lang="ts">
    import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte.js';
    import { gsap, ScrollTrigger } from '$lib/data/gsap';
    import { beforeNavigate } from '$app/navigation';
    import Testimonial from '$lib/components/projects/Testimonial.svelte';
    import projects from '$lib/components/projects/projects.json';
    import testimonials from '$lib/components/projects/testimonials.json';
    import SEO from '$lib/data/SEO.svelte';
    import GithubContributions from '$lib/components/projects/contributions/GithubContributions.svelte';
    import Heading from '$lib/components/layout/titles/Heading.svelte';
    import { getContributions } from './data.remote';

    let contributions = await getContributions();

    let ProjectComponent:
        | typeof import('$lib/components/projects/Project.svelte').default
        | null = $state<
        typeof import('$lib/components/projects/Project.svelte').default | null
    >(null);
    let showProjects = $state<boolean>(false);
    let isNavigating = $state<boolean>(false);
    let prefersReducedMotion = $state<boolean>(false);
    const breakpoints = getBreakpoints();

    function getTestimonialForProject(projectIndex: number) {
        return testimonials.find((t) => t.projectIndex === projectIndex);
    }

    beforeNavigate(() => {
        isNavigating = true;
    });

    // load project component with a slight delay
    $effect(() => {
        if (isNavigating) return;

        let cancelled = false;

        const loadProject = async () => {
            const module =
                await import('$lib/components/projects/Project.svelte');
            if (!cancelled && !isNavigating) {
                ProjectComponent = module.default;
                showProjects = true;
            }
        };

        const timer = setTimeout(loadProject, 100);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    });

    // GSAP scroll effect
    $effect(() => {
        const mm = gsap.matchMedia();

        if (!showProjects || breakpoints.isReduced) return;

        mm.add('(prefers-reduced-motion: reduce)', () => {
            gsap.set('.wholeProject', {
                opacity: 1,
                y: 0,
                clearProps: 'transform',
            });
        });

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

            if (prefersReducedMotion) {
                gsap.set('.wholeProject', {
                    opacity: 1,
                    y: 0,
                    clearProps: 'transform',
                });
                return;
            }

            gsap.set('.wholeProject', { opacity: 0, y: 30 });

            ScrollTrigger.batch('.wholeProject', {
                onEnter: (batch) => {
                    gsap.to(batch, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.3,
                        ease: 'power2.out',
                    });
                },
                start: 'top 80%',
                once: true,
            });

            return () => {
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            };
        });

        return () => mm.revert();
    });
</script>

<SEO
    title="Websites I've Created"
    description="Work Gabe has done"
    keywords="gabe atwell's projects, gabriel atwell's projects, gabe's work, gabriel's work, projects"
/>

<div class="projects">
    <Heading
        title="builds"
        title2="builds"
        viewTransitionName="build-heading"
        popoverText="Hover over the project image to reveal the tech stack I used on the project 👍🏻"
    />

    <section class="github-section">
        <div class="contribution-container">
            {#if contributions}
                <GithubContributions {contributions} />
            {:else}
                <div
                    class="github-skeleton"
                    aria-label="Loading GitHub contributions"
                >
                    <div class="skeleton-header">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-subtitle"></div>
                    </div>
                    <div class="skeleton-chart"></div>
                    <div class="skeleton-legend"></div>
                </div>
            {/if}
        </div>
    </section>

    <section class="bevel-border">
        {#if showProjects && ProjectComponent}
            {#each projects as project (project.index)}
                {@const testimonial = getTestimonialForProject(project.index)}

                <div class="wholeProject">
                    <ProjectComponent {...project} hasBorder={false} />

                    {#if testimonial}
                        <Testimonial
                            name={testimonial.name}
                            title={testimonial.title}
                            testimonial={testimonial.testimonial}
                            rating={Number(testimonial.rating)}
                            avatar={testimonial.avatar}
                            index={project.index}
                        />
                    {/if}
                </div>
            {/each}
        {/if}
    </section>
</div>

<style>
    :root {
        --100: 100%;
    }

    .github-section {
        padding: 2rem 1rem;
        margin: 2rem 0;
        background: transparent;
        border-radius: 12px;
        min-height: 300px;

        @media (width <= 768px) {
            margin: 1rem;
            padding: 1rem;
            min-height: 250px;
        }

        & .contribution-container {
            max-inline-size: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        & .github-skeleton {
            opacity: 0.6;
            animation: pulse 2s ease-out infinite alternate;

            & .skeleton-header {
                margin-bottom: 2rem;

                & .skeleton-title {
                    height: 2rem;
                    width: 200px;
                    background: var(--clr-light-500);
                    opacity: 0.3;
                    border-radius: 4px;
                    margin: 0 auto 0.5rem;
                }

                & .skeleton-subtitle {
                    height: 1rem;
                    width: 150px;
                    background: var(--clr-light-500);
                    opacity: 0.2;
                    border-radius: 4px;
                    margin: 0 auto;
                }
            }

            & .skeleton-chart {
                height: 150px;
                background: var(--clr-light-500);
                opacity: 0.1;
                border-radius: 8px;
                margin-bottom: 1rem;
            }

            & .skeleton-legend {
                height: 20px;
                width: 200px;
                background: var(--clr-light-500);
                opacity: 0.1;
                border-radius: 4px;
                margin: 0 auto;
            }
        }
    }

    .projects {
        background: linear-gradient(
            to bottom,
            oklch(from var(--clr-gray-700) 0.35 c h) 0%,
            var(--clr-dark-500) 12%,
            var(--clr-dark-500) 100%
        );

        & .bevel-border {
            position: relative;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            place-items: center;
            padding: 2rem;
            margin: 0;

            @media (width <= 500px) {
                padding: 2em 0;
                grid-template-columns: 1fr;
            }

            &:before {
                content: '';
                position: absolute;
                inset: 0;
                background: var(--clr-gray-700);
                clip-path: polygon(
                    0 40px,
                    40px 0,
                    calc(100% - 40px) 0,
                    100% 40px,
                    100% calc(100% - 40px),
                    calc(100% - 40px) 100%,
                    40px 100%,
                    0 calc(100% - 40px),
                    0 40px,
                    5px calc(40px + 1.03px),
                    5px calc(100% - 40px - 1.03px),
                    calc(40px + 1.03px) calc(100% - 5px),
                    calc(100% - 40px - 1.03px) calc(100% - 5px),
                    calc(100% - 5px) calc(100% - 40px - 1.03px),
                    calc(100% - 5px) calc(40px + 1.03px),
                    calc(100% - 40px - 1.03px) 5px,
                    calc(40px + 1.03px) 5px,
                    5px calc(40px + 1.03px)
                );
            }

            & .wholeProject {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 0.25rem;
                border-radius: var(--radius);
                will-change: opacity, transform;
                margin-bottom: 1em;
                padding: 1em 0 0.5em 0;

                @media (width <= 768px) {
                    margin: 0.5rem;
                    margin-bottom: 1.5em;
                    padding: 0.25 0;
                }
            }
        }
    }

    @keyframes pulse {
        0% {
            opacity: 0.4;
        }
        100% {
            opacity: 0.6;
        }
    }

    @keyframes slide-out {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-100px);
        }
    }

    @keyframes slide-in {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    ::view-transition-old(build-heading) {
        opacity: 0;
    }

    ::view-transition-group(build-heading) {
        animation-duration: var(--link-transition-duration);
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (width <= 768px) {
        ::view-transition-old(build-heading) {
            animation: slide-out var(--title-transition-duration) ease-out
                forwards;
            opacity: 1;
        }

        ::view-transition-new(build-heading) {
            animation: slide-in var(--title-transition-duration) ease-out
                forwards;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .github-skeleton {
            animation: none;
        }

        ::view-transition-group(build-heading),
        ::view-transition-old(build-heading),
        ::view-transition-new(build-heading) {
            animation: none;
        }
    }
</style>
