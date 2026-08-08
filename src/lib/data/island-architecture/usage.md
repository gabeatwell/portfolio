# USAGE

```ts
// +page.svelte (src/routes/blog/+page.svelte)
<script lang="ts">
  import Isle from '$lib/data/island-architecture/Isle.svelte';
</script>

<Isle
    component={() => import('./HeavyMap.svelte')}
    when="visible"
    rootMargin="400px"
>
    <p>Loading map…</p>
</Isle>
```

## CSR configuration

Island components require a client to hydrate. If you need a fully static route, set `csr = false` **in that route's `+page.ts`** — never in a layout that contains interactive components:

```ts
// +page.ts — route-level only
export const csr = false;
```

> **Warning:** `csr = false` disables hydration for the _entire_ route, not just the island. Server `load` functions (`+page.server.ts`) stop running, nothing else on the page becomes interactive (nav, theme toggle, analytics), and `Isle`'s own `onMount` never fires — so the island itself can't mount. For a blog that needs server functions, keep the default CSR enabled and let the island defer only the heavy widget.

## Remote Functions (server-only logic)

SvelteKit automatically splits server and client code. Any module imported from `$lib/server/*` or a `.server.ts` file **never ships to the browser** — the compiler generates an RPC stub (a `fetch` call), so the code runs on the server but is called from the island as if it were local.

### Rules

1. **Import server modules inside the island chunk, never in `Isle.svelte`.** `Isle.svelte` is statically imported, so anything it imports loads on the initial page — defeating lazy loading.

    ```ts
    // ✅ inside the lazily-loaded component
    import { getPost } from '$lib/server/posts';

    // ❌ in Isle.svelte — runs on every page load
    import { getPost } from '$lib/server/posts';
    ```

2. **Never pass secrets as `props`.** Props serialize into the client bundle. Fetch data server-side; pass only what's safe to render.

    ```ts
    // ❌ apiKey leaks into the client bundle
    <Isle component={() => import('./Post.svelte')} props={{ apiKey }} />
    ```

3. **For page-level data, prefer a `+page.server.ts` load function.** It runs on the server, is cached by SvelteKit, and results arrive as serializable props.

    ```ts
    // +page.server.ts
    export const load = async ({ params }) => {
        const post = await getPost(params.slug);
        return { post }; // must be JSON-serializable
    };
    ```

### Example: comments island with remote functions

```svelte
<!-- Comments.svelte — the lazily loaded chunk -->
<script lang="ts">
    import { getComments } from '$lib/server/comments';

    let { postId } = $props();
    let comments = $state<Comment[]>([]);
    let error = $state<string | null>(null);

    $effect(() => {
        getComments(postId)
            .then((data) => (comments = data))
            .catch(() => (error = 'Could not load comments.'));
    });
</script>

{#if error}
    <p>{error}</p>
{:else if comments.length === 0}
    <p>No comments yet.</p>
{:else}
    <ul>
        {#each comments as comment}
            <li>{comment.author}: {comment.text}</li>
        {/each}
    </ul>
{/if}
```

```svelte
<!-- In +page.svelte -->
<Isle
    component={() => import('./Comments.svelte')}
    props={{ postId }}
    when="visible"
>
    <p>Comments load when you scroll to them.</p>
</Isle>
```

### Errors

Server-call failures surface **inside the island component** — they don't trigger the `Isle` fallback, which only covers _chunk-load_ failures. Always catch errors in your island:

```ts
try {
    const data = await getComments(postId);
    comments = data;
} catch (err) {
    error = 'Could not load comments.';
}
```
