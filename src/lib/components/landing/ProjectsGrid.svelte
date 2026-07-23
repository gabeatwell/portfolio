<script lang="ts">
    interface Props {
        projects?: {
            url: string;
            img: { src: string; srcset?: string; sizes?: string };
            title: string;
        }[];
    }

    let { projects = [] }: Props = $props();
</script>

<section class="projects-grid">
    {#each projects as project}
        <a href={project.url} class="project-card">
            <img
                src={project.img.src}
                srcset={project.img.srcset}
                sizes={project.img.sizes}
                alt={project.title}
                loading="lazy"
            />

            <div class="overlay">
                <p>{project.title}</p>
            </div>
        </a>
    {/each}
</section>

<style>
    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 0.2rem 0.1rem;

        @media (width <= 500px) {
            gap: 0.1rem;
            margin-bottom: 3em;
        }

        /* desktop row centering */
        @media (width >= 1100px) {
            grid-template-columns: repeat(4, 1fr);

            & .project-card:nth-child(5) {
                grid-column: 2;
            }
            & .project-card:nth-child(6) {
                grid-column: 3;
            }
        }

        & .project-card {
            display: block;
            position: relative;
            overflow: clip;

            & img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                border: 1px solid var(--clr-light-500);
                transition:
                    filter 0.3s ease,
                    scale 0.3s ease;
            }

            & .overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                overflow: clip;

                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;

                opacity: 0;
                transform: translateX(-100%);
                transition:
                    transform 0.4s ease,
                    opacity 0.4s ease;

                & p {
                    color: var(--clr-blue-350);
                    font-family: var(--bronova);
                    font-size: clamp(var(--h6), 1.1vw, var(--h4));
                    font-weight: 700;
                    text-align: center;
                    line-height: 1.1;
                    margin-top: 1.5em;
                }
            }

            &:hover .overlay,
            &:focus .overlay {
                opacity: 1;
                transform: translateX(0);
            }

            &:hover img,
            &:focus img {
                filter: blur(2px);
                scale: 1.05;
            }
        }
    }
</style>
