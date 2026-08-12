<script lang="ts">
    import { goto } from '$app/navigation';
    import { useSound } from '$lib/data/stores/sounds/uiSounds.svelte';

    const { playSoundAsync: playHoverSound } = useSound(
        '/sounds/foley-switch.wav',
    );

    function navigateValue(value: string) {
        if (value === 'hire') {
            goto('/hire');
        } else if (value === 'contact') {
            goto('/contact');
        }
    }

    function handleSelect(event: Event) {
        const value = (event.target as HTMLSelectElement).value;
        if (!value) return;
        navigateValue(value);
    }
</script>

<select onchange={handleSelect} onclick={playHoverSound}>
    <option value="" disabled selected hidden>Connect</option>
    <option value="hire"><span>Hire Me</span></option>
    <option value="contact"><span>Contact</span></option>
</select>

<style>
    select,
    ::picker(select) {
        appearance: base-select;

        &::picker-icon {
            display: none;
        }
    }

    ::picker(select) {
        background: var(--clr-dark-400);
        border: none;
        box-shadow: none;
        overflow: visible;
    }

    select {
        background:
            repeating-radial-gradient(
                ellipse at 50% 50%,
                color-mix(in oklch, var(--clr-light-500) 8%, transparent) 0
                    0.75em,
                transparent 0.15em 1.5em
            ),
            var(--clr-dark-500);

        backdrop-filter: blur(12px) saturate(180%);
        border: 1px solid var(--clr-light-500);
        color: var(--clr-light-500);
        max-inline-size: fit-content;
        font-family: var(--bronova-bold);
        font-size: clamp(var(--sm), 1.1vw, var(--h5));
        letter-spacing: 1px;
        margin: 0.1em 0 0 0;
        transition: none;

        & option {
            color: var(--clr-light-500);

            &:hover {
                text-decoration: line-through;
                text-decoration-thickness: 1px;
            }

            &::checkmark {
                content: '→';
                display: inline-block;
                color: var(--clr-light-400);
                animation: slideIn 0.3s ease-out;

                -webkit-text-stroke: 0.15em currentColor;
            }
        }
    }

    @keyframes slideIn {
        from {
            transform: translateX(-0.75em);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
</style>
