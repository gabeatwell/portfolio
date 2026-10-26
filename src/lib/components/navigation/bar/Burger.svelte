<script lang="ts">
    import { beforeNavigate } from '$app/navigation';

    let { open = $bindable(false), ariaLabel = 'toggle menu' } = $props();

    beforeNavigate(({ shallow }) => {
        if (shallow) return;

        open = false;
    });

    function trapEscape(el: HTMLInputElement) {
        const onkey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                open = false;
                el.focus();
            }
        };
        window.addEventListener('keydown', onkey);
        return () => window.removeEventListener('keydown', onkey);
    }
</script>

<label class="hamburger" class:open>
    <input
        type="checkbox"
        class="nav-toggle"
        bind:checked={open}
        aria-label={ariaLabel}
        aria-controls="mobile-menu"
        {@attach trapEscape}
    />

    <span class="bars" aria-hidden="true">
        <span class="bar bar-1"></span>
        <span class="bar bar-2"></span>
    </span>
</label>

<style>
    .hamburger {
        @media (width >= 769px) {
            display: none;
        }

        &:has(.nav-toggle:focus-visible) {
            outline: 2px solid var(--clr-light-500);
            outline-offset: 4px;
            border-radius: 4px;
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

        /* Open state */
        &:has(.nav-toggle:checked) {
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

        & .nav-toggle {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
            opacity: 0;
        }
    }
</style>
