<script lang="ts">
    import A11yAnnouncer from '$lib/components/utils/A11yAnnouncer.svelte';
    import { useTheme } from '$lib/data/context/theme.svelte';
    import { useSound } from '$lib/data/stores/sounds/uiSounds.svelte';

    const theme = useTheme();
    let themeStatus = $state<string>('');
    let buttonElement = $state<HTMLButtonElement>();

    function toggle() {
        const isMobile = window.innerWidth <= 768;
        let x: number, y: number;

        if (isMobile) {
            x = window.innerWidth / 2;
            y = window.innerHeight / 5;
        } else {
            // desktop
            if (!buttonElement) return;
            const rect = buttonElement.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }

        document.documentElement.style.setProperty('--x', `${x}px`);
        document.documentElement.style.setProperty('--y', `${y}px`);

        if (typeof (document as any).startViewTransition === 'function') {
            document.documentElement.style.viewTransitionName =
                'changing-theme';

            document.startViewTransition(() => {
                const newTheme = theme.toggle();
                themeStatus = `Switched to ${newTheme} theme`;
                setTimeout(() => {
                    themeStatus = '';
                }, 2000);
            });
        } else {
            // fallback for older browsers
            const newTheme = theme.toggle();

            try {
                document.documentElement.setAttribute('data-theme', newTheme);
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.colorScheme = 'dark';

                    // force key CSS variables for older browsers
                    document.documentElement.style.setProperty(
                        '--clr-dark-500',
                        '#111111',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-light-500',
                        '#f7f7f7',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-dark-400',
                        'rgba(255,255,255,0.06)',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-hero-text',
                        '#cccccc',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-blue-350',
                        '#4a90e2',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-blue-500',
                        '#4a90e2',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-btn-900',
                        '#ffffff',
                    );
                } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';

                    // restore light variables (match :root defaults)
                    document.documentElement.style.setProperty(
                        '--clr-dark-500',
                        '#f7f7f7',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-light-500',
                        '#111111',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-dark-400',
                        'rgba(0, 0, 0, 0.2)',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-hero-text',
                        '#666666',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-blue-350',
                        '#172b59',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-blue-500',
                        '#0f2246',
                    );
                    document.documentElement.style.setProperty(
                        '--clr-btn-900',
                        '#111111',
                    );
                }
            } catch (e) {
                console.error('Failed to toggle theme:', e);
            }

            themeStatus = `Switched to ${newTheme} theme`;
            setTimeout(() => {
                themeStatus = '';
            }, 2000);
        }
    }

    const { playSoundAsync: playHoverSound } = useSound(
        '/sounds/ui_bubble.wav',
    );

    async function handleClick() {
        await playHoverSound();
        toggle();
    }
</script>

<A11yAnnouncer message={themeStatus} />

<button
    bind:this={buttonElement}
    onclick={handleClick}
    type="button"
    role="switch"
    aria-label="Toggle between light and dark theme"
    aria-checked={theme.isLight}
    style="position: relative; touch-action: manipulation; pointer-events: auto;"
    data-debug="theme-toggle"
>
    {#if theme.isLight}
        <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style="width: 2.2em; height: 2.2em; pointer-events: none;"
        >
            <title>Switch to Dark Mode</title>
            <path
                d="M13 6V3M18.5 12V7M14.5 4.5H11.5M21 9.5H16M15.5548 16.8151C16.7829 16.8151 17.9493 16.5506 19 16.0754C17.6867 18.9794 14.7642 21 11.3698 21C6.74731 21 3 17.2527 3 12.6302C3 9.23576 5.02061 6.31331 7.92462 5C7.44944 6.05072 7.18492 7.21708 7.18492 8.44523C7.18492 13.0678 10.9322 16.8151 15.5548 16.8151Z"
                stroke="var(--clr-light-500)"
                fill="var(--clr-moon-500)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    {:else}
        <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style="width: 2.2em; height: 2.2em; pointer-events: none;"
        >
            <title>Switch to Light Mode</title>
            <path
                d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                fill="var(--clr-dark-400)"
                stroke="var(--clr-sun-500)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    {/if}
</button>

<style>
    button {
        background: transparent;
        border: none;
        border-radius: 5px;
        color: var(--clr-light-500);
        font-size: clamp(1.5rem, 2vw, 2.25rem);
        letter-spacing: 3px;
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        z-index: 15;
        outline: none;
        cursor: pointer;
        padding: calc(var(--space-md) - 0.45rem);
        max-inline-size: 3em;
        max-block-size: 2.2em;
        /* margin: 0; */
        will-change: transform, opacity;
        transition: all 0.15s ease-out;

        &:hover {
            text-shadow: 0 0 1px var(--smoke);
        }

        &:active {
            background: inherit;
            color: var(--clr-light-500);
            scale: 0.95;
        }

        &:focus,
        &:focus-visible {
            outline: 1px solid var(--clr-light-500);
            /* outline-offset: 3px 0; */
            background: transparent;
            box-shadow: none;
            /* margin-bottom: 2px; */
        }

        & svg {
            font-weight: 800;

            @media (width >= 750px) {
                padding-top: 0.3rem;
            }

            @media (width >= 990px) {
                padding-top: 0.5rem;
            }
        }
    }

    ::view-transition-old(changing-theme) {
        animation: none;

        will-change: clip-path, transform;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
    }

    ::view-transition-new(changing-theme) {
        animation: circle-theme-transition 0.55s linear forwards;
        clip-path: circle(0% at var(--x) var(--y));

        will-change: clip-path, transform;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
    }

    @keyframes circle-theme-transition {
        to {
            clip-path: circle(150vmax at var(--x) var(--y));
        }
    }
</style>
