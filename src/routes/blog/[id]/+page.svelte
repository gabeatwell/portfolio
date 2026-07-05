<script lang="ts">
    import '../blog.global.css';
    import { marked } from 'marked';
    import DOMPurify from 'isomorphic-dompurify';
    import Avatar2 from '$lib/components/blog/ProfilePic.svelte';
    import SEO from '$lib/data/SEO.svelte';

    let { data } = $props();
    let post = $derived(data.post);

    let formattedDate = $derived(
        post?.date
            ? new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              })
            : '',
    );

    let sanitizedHtml = $derived(
        post?.content &&
            DOMPurify.sanitize(
                marked.parse(post.content, { async: false }) as string,
            ),
    );

    let renderedHtml = $derived(
        sanitizedHtml && addHtmlTransitionName(sanitizedHtml, post!.id),
    );

    function addHtmlTransitionName(html: string, postId: number): string {
        return html.replace(
            'img',
            `img style="view-transition-name: blog-image-${postId};"`,
        );
    }
</script>

<SEO
    title={post?.title ?? 'Blog Post'}
    description={post?.subtitle ?? "Read more on Gabriel Atwell's blog"}
    image={post?.image}
    type="article"
/>

{#if post}
    <section class="blog-post">
        <div class="author-row">
            <Avatar2 />

            <div class="post-description">
                <p class="name">gabe atwell</p>

                {#if formattedDate}
                    <time class="date">{formattedDate}</time>
                {/if}
            </div>
        </div>

        <div class="post-content">
            {@html renderedHtml}
        </div>
    </section>

    <a class="go-back" href="/blog">go back</a>
{:else}
    <p class="not-found">Post not found..</p>
{/if}

<style>
    .blog-post {
        max-inline-size: 60vw;
        margin: 5em auto;
        padding: 2em;

        @media (width <= 768px) {
            max-inline-size: 100vw;
            margin: 2em auto;
        }
    }

    .post-content {
        inline-size: 100%;
        line-height: 1.7;

        & :global(pre code) {
            background: var(--clr-dark-500);
            border: 1px solid var(--clr-light-350);
            color: var(--clr-light-500);
            font-family: var(--mono);
            font-size: 0.8rem;
            inline-size: fit-content;
        }

        & :global(code) {
            background: var(--clr-dark-500);
            color: var(--clr-light-500);
            font-family: var(--mono);
            font-size: 0.8rem;
            inline-size: fit-content;
        }

        & :global(h3) {
            color: var(--clr-gray-700);
        }
    }

    .go-back {
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

        anchor-name: --back;

        &:focus,
        &:focus-visible {
            background-color: transparent;
            box-shadow: none;
            outline: 1px solid var(--clr-light-500);
        }
    }

    .author-row {
        margin-inline: auto;
        inline-size: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.75em;
        margin-bottom: 3em;

        & .post-description {
            display: flex;
            gap: 1em;
            margin-top: 5em;
            margin-left: 1em;

            @media (width <= 990px) {
                margin-top: 7em;
            }

            @media (width <= 768px) {
                flex-direction: column;
                gap: 0;
                margin-top: 8em;
            }

            & .name {
                color: var(--clr-light-500);
                font-family: var(--bronova-bold);
                font-size: clamp(var(--sm), 1.5vw, var(--h4));
                font-weight: 400;
                letter-spacing: 0.08em;
                opacity: 0.7;
                white-space: nowrap;
            }

            & .date {
                color: var(--clr-light-400);
                font-family: var(--mono);
                font-size: clamp(var(--xs), 1.25vw, var(--h4));
                opacity: 0.7;
                white-space: nowrap;

                @media (width <= 768px) {
                    margin-top: -1.5em;
                }
            }
        }
    }

    .not-found {
        text-align: center;
        font-family: var(--thunder);
        font-size: clamp(var(--sm), 1.52vw, var(--h4));
        font-weight: 700;
        color: var(--clr-gray-500);
    }
</style>
