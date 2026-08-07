# USAGE

|----------------------------------------|
|---------------| USAGE |-----------|
|----------------------------------------|

```javascript
// +page.svelte (src/routes/blog/+page.svelte)
<script lang="ts">
  import Island from '$lib/Island.svelte';
  import Counter from '$lib/Counter.svelte';
  import Chart from '$lib/Chart.svelte';
</script>

<article>Static content stays pure HTML…</article>

<Island component={Counter} props={{ start: 10 }} when="load">
  <p>0</p>
</Island>

<Island component={Chart} when="visible" rootMargin="100px">
  <div class="chart-skeleton"></div>
</Island>

// +page.ts (src/routes/blog/+page.ts)
export const csr = false;
// You must set csr = false on the route (or a parent layout). The Island component only controls when and what mounts inside that static page.
// to use, put export const csr = false in a +page.ts or +layout.ts
```
