<script lang="ts">
    import { page } from '$app/state';
    let { open = $bindable(false), ariaLabel = 'menu' } = $props();

    $effect(() => {
        page.url.pathname;
        open = false;
    });

    $effect(() => {
        if (!open) return;
        const onkey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                open = false;
                document.getElementById('nav-toggle')?.focus();
            }
        };
        window.addEventListener('keydown', onkey);
        return () => window.removeEventListener('keydown', onkey);
    });
</script>

<input
    type="checkbox"
    id="nav-toggle"
    class="nav-toggle"
    bind:checked={open}
    aria-label={ariaLabel}
    aria-controls="mobile-menu"
/>
<label for="nav-toggle" class="hamburger" aria-hidden="true">
    <span class="bars">
        <span class="bar bar-1"></span>
        <span class="bar bar-2"></span>
    </span>
</label>

<style>
    .nav-toggle {
        position: fixed;
        top: 0;
        left: 0;
        width: 1px;
        height: 1px;
        margin: 0;
        appearance: none;
        opacity: 0;
        pointer-events: none;

        &:not(:checked) + .hamburger:hover .bar {
            background: var(--clr-light-500);
        }

        &:checked + .hamburger {
            padding-bottom: 0.5rem;

            & .bar-1 {
                width: 2.2em;
                transform: translateY(0) rotate(45deg);
            }

            & .bar-2 {
                width: 2.2em;
                transform: translateY(0) rotate(-45deg);
            }
        }
    }

    .hamburger {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        background: transparent;
        border: none;
        cursor: pointer;
        z-index: 10;
        margin-bottom: 2em;
        margin-left: 1em;
        position: relative;
        padding: 0;
        pointer-events: auto;

        @media (width >= 755px) {
            display: none;
        }

        & .bars {
            display: flex;
            flex-direction: column;
            width: 2.5em;
            height: 2rem;
            position: relative;
            margin-top: 1.3em;

            & .bar {
                width: 100%;
                height: 0.3rem;
                background-color: var(--clr-light-500);
                border-radius: 2px;
                transition:
                    transform 0.35s ease,
                    width 0.35s ease;
                transform-origin: center center;
                position: absolute;
            }

            & .bar-1 {
                width: 2.8em;
                transform: translateY(-0.35rem);
            }

            & .bar-2 {
                width: 2em;
                transform: translateY(0.35rem);
            }
        }

        @media (width >= 755px) {
            opacity: 0;
        }
    }
</style>
