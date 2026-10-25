<script lang="ts">
    import { useSound } from '#lib/data/stores/sounds/uiSounds.svelte.js';
    import projects from '#lib/components/projects/projects.json';

    interface DropdownLink {
        label: string;
        href: string;
    }

    interface Props {
        title: string;
        href?: string;
        index?: number;
        type?: 'links' | 'image' | 'iframe' | 'projects';
        links?: { label: string; href: string }[];
        imageSrc?: string;
        imageAlt?: string;
        iframeSrc?: string;
        panelOffset?: string;
    }

    let {
        title,
        href = '#',
        index = 0,
        type = 'links',
        links = [],
        imageSrc,
        imageAlt = '',
        iframeSrc,
        panelOffset = '1em',
    }: Props = $props();

    const { playSoundAsync: playHoverSound } = useSound(
        '/sounds/foley-bubble.wav',
    );
    let isReverse = $derived(index % 2 === 1);
    // svelte-ignore state_referenced_locally
    const anchorName = `--nav-dropdown-${title.toLowerCase().replace(/\s+/g, '-')}`;
</script>

<li class="nav-dropdown-item">
    <a
        {href}
        class="nav-link"
        data-reverse={isReverse}
        style:--anchor={anchorName}
        onmouseenter={playHoverSound}
    >
        <span>{title}</span>
    </a>

    <div
        class="dropdown-panel"
        style:--anchor={anchorName}
        style:--panel-offset={panelOffset}
        data-type={type}
    >
        {#if type === 'projects'}
            <div class="projects-grid">
                {#each projects as project}
                    <a
                        href={project.url}
                        class="project-card"
                        target="_blank"
                        rel="noopener"
                    >
                        <div class="project-img-wrap">
                            <img
                                src={project.img.src}
                                srcset={project.img.srcset}
                                sizes={project.img.sizes ?? '180px'}
                                alt={project.title}
                                loading="lazy"
                            />
                        </div>
                        <span class="project-title">{project.title}</span>
                    </a>
                {/each}
            </div>
        {:else if type === 'links' && links.length}
            <ul class="dropdown-links">
                {#each links as link}
                    <li>
                        <a href={link.href} class="dropdown-link"
                            >{link.label}</a
                        >
                    </li>
                {/each}
            </ul>
        {:else if type === 'image' && imageSrc}
            <img src={imageSrc} alt={imageAlt} class="dropdown-image" />
        {:else if type === 'iframe' && iframeSrc}
            <iframe
                src={iframeSrc}
                {title}
                class="dropdown-iframe"
                loading="lazy"
            ></iframe>
        {/if}
    </div>
</li>

<style>
    .nav-dropdown-item {
        position: relative;
        list-style: none;

        &:hover .dropdown-panel,
        &:focus-within .dropdown-panel {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            pointer-events: auto;
        }
    }

    .nav-link {
        --clr-light-500-fade: oklch(from var(--clr-light-500) l c h / 0.85);
        font-family: var(--bronova);
        font-size: clamp(var(--h6), 1.25vw, var(--h4));
        font-weight: 900;
        letter-spacing: 1px;
        color: var(--clr-light-500-fade);
        background-color: transparent;
        position: relative;
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.55rem;
        border-radius: var(--radius);
        isolation: isolate;
        overflow: clip;
        opacity: 1;
        transition:
            opacity 0.15s ease-out,
            color 0.15s ease-out;
        will-change: opacity;
        text-decoration: none;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: -1;
            background: color-mix(
                in oklch,
                var(--clr-light-500) 15%,
                transparent
            );
            transform: translateY(-110%) skewY(2deg);
            transform-origin: bottom;
            transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
            will-change: transform;
        }

        &::after {
            content: '';
            position: absolute;
            left: 0.55rem;
            right: 0.55rem;
            bottom: 0.3rem;
            height: 0.1em;
            background: currentColor;
            transform: scaleX(0);
            transform-origin: left center;
            transition: transform 0.28s ease-out;
            will-change: transform;
        }

        &[data-reverse='true']::after {
            transform-origin: right center;
        }

        &:focus-visible,
        &:focus {
            background: transparent;
            outline: 2px solid var(--clr-dark-500-fade);
            outline-offset: 1px 2px;
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover::before,
            &:focus-visible::before {
                transform: translateY(0) skewY(0deg);
            }

            &:hover::after,
            &:focus-visible::after {
                transform: scaleX(1);
            }
        }
    }

    .dropdown-panel {
        position: absolute;
        top: 100%;
        left: 0;
        /* min-inline-size: 220px; */
        margin-block-start: 0.5rem;
        padding: 0.75rem;
        background: var(--clr-dark-500);
        border: 1px solid var(--clr-light-500);
        border-radius: var(--radius);
        box-shadow: 0 8px 24px oklch(from var(--clr-light-500) 0.3 c h / 0.15);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-6px);
        transition:
            opacity 0.22s ease,
            visibility 0.22s ease,
            transform 0.22s ease;
        pointer-events: none;
        z-index: 100;

        inline-size: max-content;
        max-inline-size: min(90vw, 820px);
        max-block-size: min(70vh, 560px);
        overflow-y: auto;
        overflow-x: hidden;

        @media (width <= 990px) {
            display: none;
        }

        .dropdown-links {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;

            & .dropdown-link {
                display: block;
                padding: 0.4rem 0.6rem;
                color: var(--clr-light-500);
                font-family: var(--bronova);
                font-weight: 700;
                text-decoration: none;
                border-radius: calc(var(--radius) - 2px);
                transition: background 0.15s ease;

                &:hover,
                &:focus-visible {
                    background: color-mix(
                        in oklch,
                        var(--clr-light-500) 12%,
                        transparent
                    );
                }
            }
        }

        .dropdown-image {
            display: block;
            max-inline-size: 280px;
            border-radius: calc(var(--radius) - 2px);
        }

        .dropdown-iframe {
            inline-size: 320px;
            block-size: 200px;
            border: none;
            border-radius: calc(var(--radius) - 2px);
        }
    }

    .projects-grid {
        display: grid;
        gap: clamp(0.6rem, 1.2vw, 1rem);

        grid-template-columns: repeat(auto-fit, minmax(min(140px, 100%), 1fr));
        min-inline-size: min(500px, 80vw);
        max-inline-size: 400px;

        @media (width <= 768px) {
            grid-template-columns: repeat(2, 1fr);
        }
        @media (width >= 768px) {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }

        & .project-card {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            text-decoration: none;
            color: var(--clr-light-500);
            border-radius: calc(var(--radius) - 2px);
            overflow: hidden;
            transition:
                transform 0.25s ease,
                opacity 0.25s ease;
            min-inline-size: 0;

            & .project-img-wrap {
                aspect-ratio: 5 / 4;
                overflow: hidden;
                border-radius: calc(var(--radius) - 2px);
                max-inline-size: 7em;
                background: color-mix(
                    in oklch,
                    var(--clr-light-500) 8%,
                    transparent
                );

                & img {
                    inline-size: 100%;
                    block-size: 100%;
                    object-fit: cover;
                    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
            }

            & .project-title {
                font-family: var(--bronova);
                font-size: clamp(0.75rem, 0.9vw, 0.9rem);
                font-weight: 700;
                letter-spacing: 0.02em;
                text-transform: lowercase;
                padding-inline: 0.1rem;
                line-height: 1.25;

                display: -webkit-box;
                line-clamp: 2;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        }
    }

    @media (hover: hover) and (pointer: fine) {
        .project-card:hover {
            transform: translateY(-3px);
        }
        .project-card:hover .project-img-wrap img {
            transform: scale(1.06);
        }
    }

    @supports (anchor-name: --test) {
        .nav-link {
            anchor-name: var(--anchor);
        }

        .dropdown-panel {
            top: auto;
            left: auto;

            position: absolute;
            position-anchor: var(--anchor);
            position-area: bottom span-right;
            /* precise alternative: inset-block-start: anchor(end); / inset-inline-start: anchor(start); */
            position-try-fallbacks:
                flip-block,
                flip-inline,
                flip-block flip-inline;

            margin-block-start: var(--panel-offset, 1em);
        }
    }
</style>
