<script lang="ts">
    import { getPosts } from './data.remote';
    import SEO from '$lib/data/SEO.svelte';

    let posts = await getPosts();
</script>

<SEO
    title="Blog - Learn Three.js"
    description="Learn Three.js with Gabriel Atwell's blog"
    keywords="three.js blog, three.js tutorial, web development, gabe atwell blog, gabe three.js blog"
/>

<h1 class="blog-title">
    Learn <span style="view-transition-name: three-heading;">Three.js</span>
</h1>

<aside class="examples-link">
    <a href="/blog/three-components">
        <h2 class="examples">examples</h2>
    </a>
</aside>

<div class="post-grid">
    {#each posts as post, index (post.id)}
        <section class="complete-post">
            {#if post.image}
                <a href="/blog/{post.id}">
                    <img
                        class="post-image"
                        src={post.image}
                        alt=""
                        style="view-transition-name: blog-image-{post.id};"
                    />
                </a>
            {/if}

            <div class="title-wrapper">
                <p class="post-index">{index + 1}</p>
                <h2 class="title">
                    <a href="/blog/{post.id}">{post.title}</a>
                </h2>
            </div>

            <p class="subtitle">{post.subtitle}</p>
        </section>
    {/each}
</div>

<style>
    .complete-post {
        border: 1px solid var(--clr-light-500);
        border-radius: var(--radius);
        padding: 0 0.05em;

        & .title {
            font-family: var(--bronova-bold);
            font-weight: 800;
            color: var(--clr-gray-700);
        }

        & .subtitle {
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 1.15vw, var(--h5));
            font-weight: 400;
            color: var(--clr-light-400);
        }

        & .post-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }
    }

    .blog-title {
        margin-top: 2em;
        font-family: var(--bronova-bold);
        font-size: clamp(var(--h3), 5vw, var(--lg));
        font-weight: 700;
        letter-spacing: -0.0075em;
        color: var(--clr-gray-600);
        margin-top: 1.75em;
        padding: 0;

        @media (width <= 980px) {
            margin-top: 2.2em;
        }
        @media (width <= 800px) {
            margin-top: 3em;
        }
    }

    .post-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1em;
        padding: 1em 5em;

        @media (width <= 768px) {
            padding: 1em 0;
            gap: 0;
            margin: 0;
            padding: 0;
        }

        & section {
            background: transparent;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 0.05em;
            padding: 0;
            position: relative;

            & .title {
                font-family: var(--thunder);
                font-size: clamp(var(--h4), 2vw, var(--h2));
                font-weight: 800;
                text-transform: uppercase;
                margin-bottom: 0;

                @media (width <= 768px) {
                    margin-top: 0.75em;
                }
            }

            & .post-index {
                position: absolute;
                inset: 0;
                transform: translateY(29%);
                display: flex;
                justify-content: center;
                align-items: center;
                pointer-events: none;
                margin: 0;

                font-family: var(--ultra);
                font-size: clamp(5rem, 7vw, 8rem);
                color: var(--clr-dark-500);
                text-shadow:
                    0 0 1px var(--clr-dark-500),
                    -1px -1px 0 var(--clr-light-500),
                    1px -1px 0 var(--clr-light-500),
                    -1px 1px 0 var(--clr-light-500),
                    1px 1px 0 var(--clr-light-500),
                    -1px 0 0 var(--clr-light-500),
                    1px 0 0 var(--clr-light-500),
                    0 -1px 0 var(--clr-light-500),
                    0 1px 0 var(--clr-light-500);
                opacity: 0.125;

                @media (width <= 768px) {
                    transform: translateY(37%);
                }
            }

            & .subtitle {
                margin-block: 0;

                @media (width <= 768px) {
                    margin-bottom: 0.05em;
                }
            }

            & a {
                text-decoration: none;
                color: var(--clr-green-500);

                &:focus,
                &:focus-visible {
                    box-shadow: none;
                    background-color: transparent;
                }
            }
        }
    }

    .examples-link {
        block-size: fit-content;
        inline-size: 30vw;
        position: absolute;
        top: 9em;
        right: 1em;

        @media (width <= 1100px) {
            top: 6em;
            /* right: auto; */
        }

        @media (width <= 768px) {
            position: static;
            inline-size: auto;
            text-align: center;
            top: auto;
            right: auto;
            margin-top: -3em;
        }

        & a {
            text-decoration: none;
        }

        & .examples {
            font-family: var(--thunder);
            font-size: clamp(var(--h1), 10vw, var(--xl));
            font-weight: 700;
            transform: rotate(15deg);
            letter-spacing: -0.025em;
            color: var(--clr-blue-500);
            text-shadow:
                0 0 1px var(--clr-dark-500),
                -2px -2px 0 var(--clr-dark-400),
                2px -2px 0 var(--clr-dark-400),
                -2px 2px 0 var(--clr-dark-400),
                2px 2px 0 var(--clr-dark-400),
                -2px 0 0 var(--clr-dark-400),
                2px 0 0 var(--clr-dark-400),
                0 -2px 0 var(--clr-dark-400),
                0 2px 0 var(--clr-dark-400);
            text-wrap: nowrap;
            margin: 0;
            padding: 0;
            text-transform: uppercase;
            transition: opacity 0.3s ease-in-out;
            opacity: 0.85;

            @media (width <= 768px) {
                scale: 0.8;
                margin: 1.5em 0 0.75em 0;
                letter-spacing: 0;
            }

            &:hover {
                opacity: 1;
            }
        }
    }

    ::view-transition-group(three-heading) {
        animation-duration: 0.6s;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(::view-transition-new(three-heading)) {
        animation-duration: 0.4s;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>
