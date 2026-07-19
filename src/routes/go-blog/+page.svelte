<script lang="ts">
    import { getPosts } from './data.remote';
    import SEO from '$lib/data/SEO.svelte';

    let posts = await getPosts();
</script>

<SEO
    title="Blog - Learn Go"
    description="Learn Go-lang"
    keywords="go blog, go tutorial, go-lang blog, gabe atwell blog, gabe go blog"
/>

<h1 class="blog-title">
    Learn <span>Go</span>
</h1>

<aside class="toc">
    <h2 class="title">table of contents</h2>

    <ul>
        {#each posts as post, index (post.id)}
            <li>
                <a
                    href="/go-blog/{post.id}"
                    style="view-transition-name: go-title-{post.id}"
                    >{post.title}</a
                >
            </li>
        {/each}
    </ul>
</aside>

<style>
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

    .toc {
        text-align: center;

        ul {
            display: grid;
            grid-auto-flow: column;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(4, auto);

            @media (width <= 768px) {
                grid-template-columns: 1fr;
                grid-template-rows: auto;
                grid-auto-flow: row;
            }

            li {
                a {
                    text-shadow: none;
                    text-decoration: none;
                    color: var(--clr-blue-300);
                    font-family: var(--bronova);
                    font-size: clamp(var(--sm), 1.52vw, var(--h2));
                    font-weight: 500;
                    inline-size: fit-content;
                    display: block;
                    text-align: center;
                    margin-inline: auto;

                    &:focus,
                    &:focus-visible {
                        background-color: transparent;
                        box-shadow: none;
                        outline: none;
                    }
                }
            }
        }
    }
</style>
