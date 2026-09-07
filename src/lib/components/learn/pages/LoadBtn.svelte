<script lang="ts">
    import A11yAnnouncer from '$lib/components/utils/A11yAnnouncer.svelte';

    interface Props {
        loading: string;
        submit: string;
        href: string;
        delay: number;
    }

    let { loading, submit, href, delay }: Props = $props();
    let statusMessage = $state<string>('');

    type ButtonState = 'idle' | 'sending' | 'done';
    let currentState = $state<ButtonState>('idle');

    let label = $derived.by(() => {
        if (currentState === 'idle') return submit;
        if (currentState === 'sending') return `${loading} `;
        return '✓ done!';
    });

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        if (currentState !== 'idle') return;

        currentState = 'sending';
        statusMessage = `Loading ${submit}...`;

        await new Promise((resolve) => setTimeout(resolve, delay));

        currentState = 'done';
        statusMessage = `${submit} loaded successfully`;

        const screenWidth = window.innerWidth;

        await new Promise((resolve) => setTimeout(resolve, 800));

        if (screenWidth <= 500) {
            window.location.href = href;
        } else {
            window.open(href, '_blank', 'noopener,noreferrer');
        }

        setTimeout(() => {
            statusMessage = '';
        }, 1000);
    };

    function setState(newState: ButtonState) {
        if (!document.startViewTransition) {
            currentState = newState;
        } else {
            document.startViewTransition(() => {
                currentState = newState;
            });
        }
    }

    $effect(() => {
        if (currentState !== 'done') return;

        const timer = setTimeout(() => {
            setState('idle');
            statusMessage = '';
        }, 5000);

        return () => clearTimeout(timer);
    });
</script>

<A11yAnnouncer message={statusMessage} />

<a
    {href}
    onclick={handleSubmit}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Visit {submit} (opens in new tab)"
    class="loading-button"
    class:sending={currentState === 'sending'}
    class:done={currentState === 'done'}
    aria-live="polite"
>
    <span class="loading-text">{label}</span>

    {#if currentState === 'sending'}
        <div class="spinner"></div>
    {/if}
</a>

<style>
    a.loading-button {
        position: relative;
        width: fit-content;
        border: 1px solid var(--clr-light-500);
        border-radius: var(--radius);
        outline: 2px solid var(--clr-light-500);
        outline-offset: -7px;
        padding: var(--padding-button);
        color: var(--clr-light-500);
        background-color: var(--clr-dark-500);
        font-family: var(--bronova);
        font-size: clamp(var(--h6), 1.5vw, var(--h3));
        font-weight: 600;
        cursor: pointer;
        user-select: none;
        margin-inline: auto;
        margin-bottom: 1rem;
        transition:
            outline-offset 300ms ease-out,
            opacity 300ms ease-out,
            filter 300ms ease-out,
            scale 0.15s ease-out;
        display: flex;
        align-items: center;
        gap: 0.5em;
        letter-spacing: 1px;
        text-decoration: none;
        z-index: 10;

        &:not(:hover) {
            filter: opacity(0.85);
        }

        @media (width <= 768px) {
            font-weight: 700;
        }

        &:active {
            scale: 0.95;
        }

        &:hover {
            opacity: 1;
            outline-offset: 0px;
        }

        &:focus-visible {
            outline: 1px solid var(--clr-light-500);
        }

        & .loading-text {
            grid-area: stack;
        }

        & .spinner {
            width: 1.5rem;
            height: 1.5rem;
            border: 2px solid var(--clr-light-500);
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
            grid-area: stack;
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
