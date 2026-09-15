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
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>Switch to Dark Mode</title>
            <path
                d="M13 6V3M18.5 12V7M14.5 4.5H11.5M21 9.5H16M15.5548 16.8151C16.7829 16.8151 17.9493 16.5506 19 16.0754C17.6867 18.9794 14.7642 21 11.3698 21C6.74731 21 3 17.2527 3 12.6302C3 9.23576 5.02061 6.31331 7.92462 5C7.44944 6.05072 7.18492 7.21708 7.18492 8.44523C7.18492 13.0678 10.9322 16.8151 15.5548 16.8151Z"
                stroke="var(--clr-moon-500)"
            />
        </svg>
    {:else}
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>Switch to Light Mode</title>
            <path
                d="M15 12C15 13.6569 13.6569 15 12 15C10.3432 15 9.00004 13.6569 9.00004 12C9.00004 10.3432 10.3432 9.00004 12 9.00004C13.6569 9.00004 15 10.3432 15 12Z"
                stroke="var(--clr-sun-500"
            />
            <path
                d="M7.64338 5.18899L7.56701 6.10541C7.52707 6.58478 7.50709 6.82447 7.40373 7.01167C7.31261 7.1767 7.1767 7.31261 7.01167 7.40373C6.82447 7.50709 6.58477 7.52707 6.10541 7.56701L5.18898 7.64338C4.16259 7.72892 3.6494 7.77168 3.39642 8.00615C3.17627 8.21018 3.05941 8.50232 3.07812 8.8019C3.09961 9.14615 3.44174 9.53105 4.126 10.3008L4.69153 10.9371C5.02586 11.3132 5.19302 11.5012 5.2565 11.7135C5.31243 11.9004 5.31243 12.0997 5.2565 12.2866C5.19302 12.4988 5.02586 12.6869 4.69153 13.063L4.126 13.6992C3.44174 14.469 3.09961 14.8539 3.07812 15.1982C3.05941 15.4978 3.17627 15.7899 3.39642 15.9939C3.6494 16.2284 4.16259 16.2712 5.18899 16.3567L6.10541 16.4331C6.58478 16.473 6.82446 16.493 7.01167 16.5964C7.1767 16.6875 7.31261 16.8234 7.40373 16.9884C7.50709 17.1756 7.52707 17.4153 7.56701 17.8947L7.64338 18.8111C7.72892 19.8375 7.77168 20.3507 8.00615 20.6037C8.21018 20.8238 8.50232 20.9407 8.8019 20.922C9.14615 20.9005 9.53105 20.5583 10.3008 19.8741L10.9371 19.3085C11.3132 18.9742 11.5012 18.8071 11.7135 18.7436C11.9004 18.6876 12.0997 18.6876 12.2866 18.7436C12.4988 18.8071 12.6869 18.9742 13.063 19.3085L13.6992 19.8741C14.469 20.5583 14.8539 20.9005 15.1982 20.922C15.4978 20.9407 15.7899 20.8238 15.9939 20.6037C16.2284 20.3507 16.2712 19.8375 16.3567 18.8111L16.4331 17.8947C16.473 17.4153 16.493 17.1756 16.5964 16.9884C16.6875 16.8234 16.8234 16.6875 16.9884 16.5964C17.1756 16.493 17.4153 16.473 17.8947 16.4331L18.8111 16.3567C19.8375 16.2712 20.3507 16.2284 20.6037 15.9939C20.8238 15.7899 20.9407 15.4978 20.922 15.1982C20.9005 14.8539 20.5583 14.469 19.8741 13.6992L19.3085 13.063C18.9742 12.6869 18.8071 12.4988 18.7436 12.2866C18.6876 12.0997 18.6876 11.9004 18.7436 11.7135C18.8071 11.5012 18.9742 11.3132 19.3085 10.9371L19.8741 10.3008C20.5583 9.53105 20.9005 9.14615 20.922 8.8019C20.9407 8.50232 20.8238 8.21018 20.6037 8.00615C20.3507 7.77168 19.8375 7.72892 18.8111 7.64338L17.8947 7.56701C17.4153 7.52707 17.1756 7.50709 16.9884 7.40373C16.8234 7.31261 16.6875 7.1767 16.5964 7.01167C16.493 6.82446 16.473 6.58478 16.4331 6.10541L16.3567 5.18898C16.2712 4.16259 16.2284 3.6494 15.9939 3.39642C15.7899 3.17627 15.4978 3.05941 15.1982 3.07812C14.8539 3.09961 14.469 3.44174 13.6992 4.126L13.063 4.69153C12.6869 5.02586 12.4988 5.19302 12.2866 5.2565C12.0997 5.31243 11.9004 5.31243 11.7135 5.2565C11.5012 5.19302 11.3132 5.02586 10.9371 4.69153L10.3008 4.126C9.53105 3.44174 9.14615 3.09961 8.8019 3.07812C8.50232 3.05941 8.21018 3.17627 8.00615 3.39642C7.77168 3.6494 7.72892 4.16259 7.64338 5.18899Z"
                stroke="var(--clr-sun-500)"
            />
        </svg>
    {/if}
</button>

<style>
    button {
        inline-size: 2em;
        block-size: 2em;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 5px;
        color: var(--clr-light-500);
        font-size: clamp(1.5rem, 2vw, 2.25rem);
        letter-spacing: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 15;
        outline: none;
        cursor: pointer;
        margin: 0;
        will-change: transform, opacity;
        transition:
            scale 0.15s ease-out,
            color 0.15s ease-out;

        @media (width <= 768px) {
            inline-size: 2em;
            block-size: 2em;
        }

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
            background: transparent;
            box-shadow: none;
        }

        & svg {
            inline-size: 100%;
            block-size: 100%;
            flex-shrink: 0;
            transform: translateY(-3px);
            stroke-width: 1.1;
            stroke-linecap: round;
            stroke-linejoin: round;

            @media (width <= 768px) {
                transform: translateY(-5px);
                stroke-width: 1.25;
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
