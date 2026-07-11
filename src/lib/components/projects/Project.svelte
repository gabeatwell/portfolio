<script lang="ts">
    import ProjectSummary from './ProjectSummary.svelte';

    export const prerender = false;

    interface Props {
        title: string;
        img: {
            src: string;
            srcset?: string;
            sizes?: string;
        };
        url: string;
        description: string;
        summary: string;
        index?: number;
        hasBorder?: boolean;
    }

    let {
        title,
        img,
        url,
        description,
        summary,
        index = 0,
        hasBorder = true,
    }: Props = $props();
</script>

<section class="project-card" class:no-border={!hasBorder}>
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        class="project-link"
        aria-label="View {title} project - made with {description}"
    >
        <img
            class="project-image"
            src={img.src}
            srcset={img.srcset}
            sizes={img.sizes}
            alt="Screenshot of {title} project"
            style="--alt-text: '{title} project';"
            loading="lazy"
        />

        <span class="description" aria-hidden="true"
            >made with <span class="description-title">{description}</span
            ></span
        >
    </a>

    <a href={url} target="_blank" rel="noopener noreferrer" class="title-link">
        <h3 class="project-title">{title}</h3>
    </a>

    <div class="summary-wrapper">
        <ProjectSummary
            popoverTitle={title}
            title="About {title}"
            {summary}
            {index}
        />
    </div>
</section>

<style>
    :root {
        --100: 100%;
    }

    .project-card {
        block-size: auto;
        border: 2px solid var(--clr-gray-700);
        border-radius: 1em 1em var(--radius) var(--radius);
        will-change: opacity, transform;
        display: flex;
        flex-direction: column;
        gap: 0;

        @media (width <= 768px) {
            border: none;
        }

        &.no-border {
            border: none;
        }

        & .summary-wrapper {
            display: flex;
            justify-content: center;
            inline-size: 100%;
            pointer-events: auto;
        }

        & .title-link {
            pointer-events: auto;
            text-decoration: none;

            &:focus,
            &:focus-visible {
                outline: 1px solid var(--clr-light-500);
                outline-offset: 2px;
                box-shadow: none;
                background-color: transparent;
            }

            & .project-title {
                font-family: var(--ultra);
                font-size: clamp(var(--h4), 2.75vw, var(--h3));
                font-weight: 600;
                text-align: center;
                letter-spacing: 0px;
                text-transform: uppercase;
                text-decoration: none;
                padding: 0;
                margin: 0;
                color: var(--clr-dark-500);
                text-shadow:
                    0 0 1px var(--clr-dark-500),
                    -3px -3px 0 var(--clr-light-500),
                    3px -3px 0 var(--clr-light-500),
                    -3px 3px 0 var(--clr-light-500),
                    3px 3px 0 var(--clr-light-500),
                    -3px 0 0 var(--clr-light-500),
                    3px 0 0 var(--clr-light-500),
                    0 -3px 0 var(--clr-light-500),
                    0 3px 0 var(--clr-light-500);
                transition: scale 0.15s ease-out;
                text-wrap: pretty;

                @media (width >= 990px) {
                    text-wrap: balance;
                }

                @media (width <= 768px) {
                    margin-top: 1em;

                    text-shadow:
                        0 0 1px var(--clr-dark-500),
                        -2px -2px 0 var(--clr-light-500),
                        2px -2px 0 var(--clr-light-500),
                        -2px 2px 0 var(--clr-light-500),
                        2px 2px 0 var(--clr-light-500),
                        -2px 0 0 var(--clr-light-500),
                        2px 0 0 var(--clr-light-500),
                        0 -2px 0 var(--clr-light-500),
                        0 2px 0 var(--clr-light-500);
                }

                &:active {
                    scale: 0.95;
                }
            }
        }

        & .project-link {
            border: none;
            display: flex;
            flex-direction: column;
            flex-basis: 50%;
            justify-content: center;
            align-items: center;
            margin-inline: auto;
            inline-size: fit-content;
            transition: all 0.35s;
            background-color: transparent;
            cursor: pointer;
            touch-action: manipulation;
            text-decoration: none;
            pointer-events: auto;
            user-select: none;
            touch-action: manipulation;
            z-index: 200;

            position: relative;

            @media (width >= 768px) {
                & img:hover {
                    transition: scale 0.25s ease;
                }

                & .description {
                    inline-size: 80%;
                }
            }

            @media (width >= 990px) {
                padding: 2rem;
                flex-basis: var(--100);

                & .description {
                    inline-size: 100%;
                }
            }

            &:focus {
                outline: 1px solid var(--clr-light-500);
                background: transparent;
                box-shadow: none;
            }

            & .project-image {
                inline-size: 100vw;
                block-size: auto;
                border-radius: var(--radius);
                max-inline-size: var(--100);
                transition: scale 0.25s ease-out;
                border: 1px solid var(--clr-light-500);
                padding: 0.2vw;
                position: relative;
                margin: 0;
                object-fit: cover;

                anchor-name: --project-image;

                &:hover ~ .description {
                    visibility: visible;
                    opacity: 1;
                    pointer-events: auto;
                }

                &:hover {
                    filter: blur(1px) brightness(0.75);
                }

                &:active {
                    scale: 0.95;
                }
            }

            & .description {
                inline-size: fit-content;
                visibility: hidden;
                opacity: 0;
                background-color: var(--clr-light-500);
                color: var(--clr-dark-500);
                text-align: center;
                border: 1px solid var(--clr-dark-500);
                border-radius: var(--radius);
                padding: 5px 1em;
                font-family: var(--bronova);
                font-size: clamp(var(--sm), 1.15vw, var(--h5));
                font-weight: 400;
                margin-inline: auto;
                transition: all 0.25s ease-out;
                text-transform: lowercase;
                pointer-events: none;
                z-index: 10;

                position: absolute;
                position-anchor: --project-image;
                top: anchor(bottom);
                left: anchor(center);
                transform: translateX(-50%);

                & .description-title {
                    font-family: var(--bronova-bold);
                }
            }
        }
    }
</style>
