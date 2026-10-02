<script lang="ts">
    import { untrack } from 'svelte';
    import type { Snippet } from 'svelte';

    type DebugCategory =
        | 'events'
        | 'installation'
        | 'userChoice'
        | 'lifecycle'
        | 'state'
        | 'network'
        | 'performance'
        | 'error'
        | 'warning'
        | 'info';

    type DebugConfig = { enabled: boolean } & {
        [key in DebugCategory]?: boolean;
    };

    type DebugFunction = (
        category: DebugCategory,
        message: string,
        data?: unknown,
    ) => void;

    type DebuggerAPI = {
        enable: (targetCategories?: DebugCategory[]) => void;
        disable: () => void;
        status: () => void;
        toggle: (category: DebugCategory) => void;
    };

    interface Props {
        namespace?: string;
        categories?: DebugCategory[];
        children: Snippet<[{ debug: DebugFunction; isEnabled: boolean }]>;
    }

    let {
        namespace = 'Component',
        categories = [],
        children,
    }: Props = $props();

    const initial: DebugConfig = { enabled: false };
    for (const cat of untrack(() => categories)) {
        initial[cat] = false;
    }

    let debugConfig = $state<DebugConfig>(initial);

    const categoryEmojis: Record<DebugCategory, string> = {
        events: '📡',
        installation: '⬇️',
        userChoice: '👤',
        lifecycle: '🔄',
        state: '📊',
        network: '🌐',
        performance: '⚡',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
    };

    $effect(() => {
        if (typeof window !== 'undefined') {
            const debugKey = `${namespace.toLowerCase()}Debug`;
            (window as unknown as Window & Record<string, DebuggerAPI>)[
                debugKey
            ] = {
                enable: (targetCategories = []) => {
                    debugConfig.enabled = true;
                    if (targetCategories.length === 0) {
                        Object.keys(debugConfig).forEach((key) => {
                            if (key !== 'enabled')
                                debugConfig[key as DebugCategory] = true;
                        });
                    } else {
                        targetCategories.forEach((cat) => {
                            if (cat in debugConfig) debugConfig[cat] = true;
                        });
                    }
                    console.log(`🐛 ${namespace} debug enabled:`, debugConfig);
                },
                disable: () => {
                    Object.keys(debugConfig).forEach(
                        (key) => (debugConfig[key as DebugCategory] = false),
                    );
                    console.log(`🐛 ${namespace} debug disabled`);
                },
                status: () =>
                    console.log(`🐛 ${namespace} debug config:`, debugConfig),
                toggle: (category: DebugCategory) => {
                    if (category in debugConfig) {
                        debugConfig[category] = !debugConfig[category];
                        console.log(
                            `🐛 ${namespace} [${category}] toggled:`,
                            debugConfig[category],
                        );
                    }
                },
            };
        }
    });

    const debug: DebugFunction = (category, message, data = null) => {
        if (!debugConfig.enabled || !debugConfig[category]) return;

        const emoji = categoryEmojis[category];
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];

        console.group(`${emoji} ${namespace} [${category}] ${timestamp}`);
        console.log(message);
        if (data !== null) {
            console.log('Data:', data);
        }
        console.groupEnd();
    };
</script>

{@render children({ debug, isEnabled: debugConfig.enabled })}
