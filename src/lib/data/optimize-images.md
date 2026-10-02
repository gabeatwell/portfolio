# from component

call the remote function (e.g., in src/lib/components/Example.svelte).

```svelte
<script>
	import { optimizeImages } from '#lib/data/optimize-images.server.js';

	let result = $state(null);

	async function handleOptimize() {
		result = await optimizeImages('svelteCode.webp');
	}
</script>

<button onclick={handleOptimize}>Optimize Image</button>
{#if result}
	<p>{result.success ? 'Optimized!' : result.error}</p>
{/if}
```

## Integration

Add this to a page server (e.g., src/routes/projects/+page.server.js) if needed for page-specific logic, but the above works globally.

### Build/run

The function runs server-side when called. Test in dev mode. If you need batch processing, loop over ALLOWED_IMAGES in the component.
