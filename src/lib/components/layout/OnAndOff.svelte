<script lang="ts">
    interface Props {
        checked?: boolean;
        disabled?: boolean;
        size?: 'small' | 'medium' | 'large';
        label?: string;
        onToggle?: (checked: boolean) => void;
    }

    let {
        checked = $bindable(false),
        disabled = false,
        size = 'medium',
        label = '',
        onToggle = () => {},
    }: Props = $props();

    function handleToggle() {
        if (!disabled) {
            checked = !checked;
            onToggle(checked);
        }
    }
</script>

<div class="toggle-wrapper" class:disabled>
    {#if label}
        <label for="toggle" class:checked>{label}</label>
    {/if}

    <button
        id="toggle"
        class="toggle-switch {size}"
        class:checked
        class:disabled
        {disabled}
        onclick={handleToggle}
        aria-pressed={checked}
        aria-label={label || (checked ? 'Turn off' : 'Turn on')}
    >
        <span class="toggle-text on">ON</span>
        <span class="toggle-text off">OFF</span>
        <span class="toggle-slider"></span>
    </button>
</div>

<style>
    .toggle-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        & label {
            font-family: var(--bronova, sans-serif);
            font-size: clamp(var(--sm), 1.1vw, var(--h5));
            font-weight: 600;
            color: var(--clr-light-500);
            letter-spacing: 2px;
            cursor: pointer;
            margin-bottom: 0.8rem;
            transition: color 0.3s ease;

            &.checked {
                color: var(--clr-blue-500);
            }
        }

        &.disabled label {
            cursor: not-allowed;

            &.checked {
                color: var(--clr-gray-500-fade, #ccc);
            }
        }
    }

    .toggle-switch {
        position: relative;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        border-radius: 50px;
        background-color: var(--clr-gray-500-fade, #ccc);
        transition: background-color 0.3s ease;
        outline: none;

        &:focus-visible {
            outline: 2px solid var(--clr-blue-500, #007bff);
            outline-offset: 2px;
        }

        &.checked {
            background-color: var(--clr-blue-500, #007bff);
        }

        &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        &.small {
            width: 36px;
            height: 20px;

            & .toggle-slider {
                width: 16px;
                height: 16px;
            }

            & .toggle-text {
                font-size: 6px;
                letter-spacing: 0.5px;
            }

            &.checked .toggle-slider {
                transform: translateX(14px);
            }
        }

        &.medium {
            width: 50px;
            height: 28px;

            & .toggle-slider {
                width: 24px;
                height: 24px;
            }

            & .toggle-text {
                font-size: 7px;
                letter-spacing: 0.8px;
            }

            &.checked .toggle-slider {
                transform: translateX(20px);
            }
        }

        &.large {
            width: 64px;
            height: 36px;

            & .toggle-slider {
                width: 32px;
                height: 32px;
            }

            & .toggle-text {
                font-size: 8px;
                letter-spacing: 1px;
            }

            &.checked .toggle-slider {
                transform: translateX(26px);
            }
        }
    }

    .toggle-text {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-family: var(--bronova);
        font-size: clamp(var(--xs), 1.1vw, var(--sm));
        font-weight: 200;
        color: var(--clr-dark-500);
        pointer-events: none;
        transition: opacity 0.3s ease;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

        &.on {
            left: 6px;
            opacity: 0;
        }

        &.off {
            right: 6px;
            opacity: 1;
        }
    }

    .toggle-switch.checked {
        & .toggle-text.on {
            opacity: 1;
        }

        & .toggle-text.off {
            opacity: 0;
        }
    }

    .toggle-slider {
        position: absolute;
        top: 2px;
        left: 2px;
        background-color: white;
        border-radius: 50%;
        transition: transform 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        z-index: 1;
    }
</style>
