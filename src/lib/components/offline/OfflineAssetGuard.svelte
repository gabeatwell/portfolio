<script lang="ts">
    import { areAssetsAvailableOffline } from '#lib/data/assetAvailability.ts';
    import type { Snippet } from 'svelte';

    interface Props {
        assets: readonly string[];
        title?: string;
        message?: string;
        children: Snippet;
    }

    let {
        assets,
        title = 'This scene needs internet connection.',
        message = "Its 3D assets aren't saved on the device yet. Connect to the internet",
        children,
    }: Props = $props();

    type Status = 'ready' | 'checking' | 'blocked';

    // SSR has no network state - default to renderering children there.
    let online = $state(
        typeof window === 'undefined' ? true : navigator.onLine,
    );
    let status = $state<Status>(
        typeof window !== 'undefined' && !navigator.onLine
            ? 'checking'
            : 'ready',
    );
    let retry = $state(0);

    $effect(() => {
        void retry;

        if (online || assets.length === 0) {
            status = 'ready';
            return;
        }

        let cancelled = false;
        status = 'checking';

        void areAssetsAvailableOffline(assets).then((available) => {
            if (!cancelled) status = available ? 'ready' : 'blocked';
        });

        return () => {
            cancelled = true;
        };
    });
</script>

<svelte:window
    ononline={() => (online = true)}
    onoffline={() => (online = false)}
/>

{#if status === 'ready'}
    {@render children()}
{:else if status === 'blocked'}
    <div class="offline-assets" role="status" aria-live="polite">
        <p class="offline-assets-title">{title}</p>
        <p class="offline-assets-body">{message}</p>

        <button
            class="offline-assets-retry"
            type="button"
            onclick={() => (retry += 1)}>Try Again</button
        >
    </div>
{/if}

<style>
    .offline-assets {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm);
        max-inline-size: 46ch;
        padding: var(--space-md);
        text-align: center;
        font-family: var(--bronova);

        .offline-assets-title {
            font-size: clamp(var(--h4), 2vw, var(--h2));
            font-weight: 700;
            line-height: 1.2;
            color: var(--clr-light-500);
            text-transform: lowercase;
        }

        .offline-assets-body {
            font-size: clamp(var(--sm), 1.25vw, var(--h5));
            font-weight: 500;
            line-height: 1.5;
            color: var(--clr-light-500-fade);
        }

        .offline-assets-retry {
            margin-block-start: var(--space-xxs);
            padding: var(--padding-button);
            border: 1px solid var(--clr-light-500-fade);
            border-radius: 9999px;
            corner-shape: squircle;
            background: transparent;
            color: var(--clr-light-500);
            font-family: var(--bronova);
            font-size: clamp(var(--sm), 1.1vw, var(--h5));
            font-weight: 600;
            cursor: pointer;
            transition:
                background-color 0.25s ease,
                color 0.25s ease;

            &:hover,
            &:focus-visible {
                background-color: var(--clr-light-500);
                color: var(--clr-dark-500);
            }
        }
    }
</style>
