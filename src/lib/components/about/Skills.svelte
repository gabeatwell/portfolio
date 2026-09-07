<script lang="ts">
    import { browser } from '$app/environment';
    import skills from '$lib/components/about/skills.json';
    import DOMPurify from 'dompurify';

    function sanitizeSVG(svg: string) {
        if (!browser) return svg;

        return DOMPurify.sanitize(svg, {
            ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'g', 'defs', 'use'],
            KEEP_CONTENT: true,
        });
    }
</script>

<section class="skills-container">
    <div class="skills-inner" aria-label="skills">
        <ul class="skills">
            {#each skills as skill}
                <li>
                    <a
                        href={skill.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="{skill.alt} link"
                    >
                        <div class="icons">
                            {#if skill.svg}
                                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                                {@html sanitizeSVG(skill.svg)}
                            {/if}
                        </div>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</section>

<style>
    .skills-container {
        min-height: 50vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 10em;

        @media (width >= 768px) and (width <= 990px) {
            padding-top: 3em;
            margin-top: -15em;
            margin-bottom: -10em;
        }

        @media (width <= 768px) {
            margin-block: -2em;
            padding-inline: 1rem;
        }
    }

    .skills-inner {
        border: none;
        display: grid;
        gap: 1em;
        width: 100%;
        place-items: center;
        margin-top: 2em;

        .skills {
            --skills-gap: 1.4em 1.8em;
            display: grid;
            grid-template-columns: repeat(3, minmax(100px, 1fr));
            gap: var(--skills-gap);
            align-items: center;
            justify-content: center;
            width: min(40%, 800px);
            margin-inline: auto;

            @media (width <= 768px) {
                grid-template-columns: repeat(2, 1fr);
                width: min(90%, 600px);
                margin: 2em 0 4em 0;
            }

            @media (width <= 500px) {
                width: 90%;
            }

            & .icons {
                padding: 0.25rem;
                padding: var(--space-xxxs);
                inline-size: clamp(20vw, 6.5vw, 200px);
                block-size: clamp(20vw, 6.5vw, 200px);
                margin-bottom: 1em;

                @media (width <= 768px) {
                    grid-template-columns: repeat(2, 1fr);
                }

                &:focus {
                    outline: 1px solid var(--clr-light-500);
                    background: transparent;
                    box-shadow: none;
                }

                &:hover {
                    transform: scale(1.1);
                    transition: transform 0.25s ease-out;
                }

                &:nth-child(odd):hover {
                    rotate: -5deg;
                    transition: rotate 0.15s ease-out;
                }

                &:nth-child(even):hover {
                    rotate: 5deg;
                    transition: rotate 0.15s ease-out;
                }

                &:active {
                    scale: 0.95;
                }
            }

            & li {
                list-style: none;
                width: 75%;
                margin-inline: auto;

                @media (width <= 768px) {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }

        @media (width <= 768px) {
            .skills {
                grid-template-columns: repeat(2, 1fr);
                width: min(80%, 600px);

                & li {
                    width: 100%;
                }
            }
        }

        @media (width <= 500px) {
            .skills {
                grid-template-columns: repeat(2, 1fr);
                width: 90;
                margin-left: 0;
                margin-inline: auto;

                & li {
                    width: 100%;
                }

                & .icons {
                    scale: 1.2;
                }
            }
        }
    }
</style>
