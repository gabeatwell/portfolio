<script lang="ts">
    import { getBreakpoints } from '#lib/data/stores/breakpoints.svelte.js';
    import { onNavigate } from '$app/navigation';

    const breakpoints = getBreakpoints();

    onNavigate((navigation) => {
        if (navigation.shallow) return;
        if (!document.startViewTransition) return;
        if (breakpoints.isReduced) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>
