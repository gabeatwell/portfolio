<script lang="ts">
    import { onMount, type Component } from 'svelte';

    type When = 'load' | 'idle' | 'visible';

    interface Props {
        /** Svelte component constructor to mount */
        component: Component<any>;
        /** Props passed to the component */
        props?: Record<string, unknown>;
        /** When to hydrate */
        when?: When;
        /** IntersectionObserver rootMargin when when="visible" */
        rootMargin?: string;
        children?: import('svelte').Snippet;
    }

    let {
        component,
        props = {},
        when = 'load',
        rootMargin = '200px',
        children,
    }: Props = $props();

    let element: HTMLDivElement | undefined = $state();
    let mounted = false;

    onMount(() => {
        if (!element) return;

        const run = async () => {
            if (mounted || !element) return;
            mounted = true;

            const { mount } = await import('svelte');
            mount(component, {
                target: element,
                props,
            });
        };

        if (when === 'load') {
            run();
            return;
        }

        if (when === 'idle') {
            if ('requestIdleCallback' in window) {
                const id = requestIdleCallback(() => run());
                return () => cancelIdleCallback(id);
            }
            const t = setTimeout(run, 1);
            return () => clearTimeout(t);
        }

        if (when === 'visible') {
            const io = new IntersectionObserver(
                (entries) => {
                    if (entries.some((e) => e.isIntersecting)) {
                        io.disconnect();
                        run();
                    }
                },
                { rootMargin },
            );
            io.observe(element);
            return () => io.disconnect();
        }
    });
</script>

<div bind:this={element}>
    {#if children}
        {@render children()}
    {/if}
</div>
