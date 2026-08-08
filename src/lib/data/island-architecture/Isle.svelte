<script lang="ts">
    import { onMount, type Component, mount, unmount } from 'svelte';

    type When = 'load' | 'idle' | 'visible' | 'media' | 'interaction';

    interface Props {
        /** Lazy loader — dynamic import gives you real code splitting */
        component: () => Promise<Component<any> | { default: Component<any> }>;
        props?: Record<string, unknown>;
        when?: When;
        rootMargin?: string;
        /** Required when when="media" */
        mediaQuery?: string;
        children?: import('svelte').Snippet;
    }

    let {
        component: load,
        props = {},
        when = 'load',
        rootMargin = '200px',
        mediaQuery,
        children,
    }: Props = $props();

    let element: HTMLDivElement | undefined = $state();
    let mounted = $state(false);
    let cancel = false;
    let instance: Record<string, any> | undefined;

    onMount(() => {
        if (!element) return;

        const run = async () => {
            if (mounted || cancel || !element) return;
            mounted = true;

            try {
                const mod = await load();
                if (cancel || !element) return;
                const Comp = 'default' in mod ? mod.default : mod;

                element.replaceChildren();
                instance = mount(Comp, { target: element, props });
            } catch (err) {
                mounted = false;
                console.error('[Isle] failed to load island', err);
            }
        };

        const cleanup: (() => void)[] = [];

        switch (when) {
            case 'load':
                run();
                break;
            case 'idle': {
                if ('requestIdleCallback' in window) {
                    const id = requestIdleCallback(() => run());
                    cleanup.push(() => cancelIdleCallback(id));
                } else {
                    const t = setTimeout(run, 200);
                    cleanup.push(() => clearTimeout(t));
                }
                break;
            }
            case 'visible': {
                const io = new IntersectionObserver(
                    (entries) => {
                        if (entries.some((entry) => entry.isIntersecting)) {
                            io.disconnect();
                            run();
                        }
                    },
                    { rootMargin },
                );
                io.observe(element);
                cleanup.push(() => io.disconnect());
                break;
            }
            case 'media': {
                if (mediaQuery) {
                    const mql = window.matchMedia(mediaQuery);
                    const check = () => mql.matches && run();
                    check();
                    mql.addEventListener('change', check);
                    cleanup.push(() =>
                        mql.removeEventListener('change', check),
                    );
                }
                break;
            }
            case 'interaction': {
                const on = () => {
                    element?.removeEventListener('pointerdown', on);
                    element?.removeEventListener('focusin', on);
                    run();
                };
                element.addEventListener('pointerdown', on);
                element.addEventListener('focusin', on);
                cleanup.push(() => {
                    element?.removeEventListener('pointerdown', on);
                    element?.removeEventListener('focusin', on);
                });
                break;
            }
        }

        // 3) cleanup on unmount
        return () => {
            cancel = true;
            cleanup.forEach((fn) => fn());
            if (instance) unmount(instance);
        };
    });
</script>

<div bind:this={element}>
    {#if !mounted && children}
        {@render children()}
    {/if}
</div>
