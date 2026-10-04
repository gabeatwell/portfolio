<script lang="ts">
    interface Props {
        isMobile: boolean;
        onPause: () => void;
        onResume: () => void;
    }

    let {
        isMobile = false,
        onPause = () => {},
        onResume = () => {},
    }: Props = $props();

    let showing = $state(false);
    let orientationListener: (() => void) | null = null;
    let navHidden = $state(false);
    let footerHidden = $state(false);
    let wasShowing = $state(false);

    const abortController = new AbortController();
    const hiddenSelects: HTMLElement[] = [];

    function updateForOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isLandscape = !isPortrait;

        const nav = document.querySelector('nav') as HTMLElement | null;
        const footer = document.querySelector('footer') as HTMLElement | null;
        const select = document.querySelector('select') as HTMLElement | null;
        const joystick = document.querySelector(
            '.mobile-joystick',
        ) as HTMLElement | null;
        const body = document.body;
        const html = document.documentElement;

        if (isLandscape && isMobile) {
            // hide UI
            if (nav) {
                nav.style.display = 'none';
                navHidden = true;
            }
            if (footer) {
                footer.style.display = 'none';
                footerHidden = true;
            }
            if (joystick) joystick.classList.add('compact');

            // force fullscreen
            body.style.overflow = 'hidden';
            body.style.width = '100vw';
            body.style.height = '100vh';
            body.style.margin = '0';
            body.style.padding = '0';
            html.style.overflow = 'hidden';
            html.style.width = '100vw';
            html.style.height = '100vh';
            html.style.margin = '0';
            html.style.padding = '0';

            // hide select elements to prevent native pickers
            const selectors = Array.from(
                document.querySelectorAll<HTMLElement>(
                    'select, .route-select, [data-route-select]',
                ),
            );

            for (const el of selectors) {
                if (!hiddenSelects.includes(el)) {
                    hiddenSelects.push(el);
                    el.style.display = 'none';
                }
            }

            showing = false;
            return;
        }

        // restore in portrait
        if (nav && navHidden) {
            nav.style.display = '';
            navHidden = false;
        }
        if (footer && footerHidden) {
            footer.style.display = '';
            footerHidden = false;
        }
        if (joystick) joystick.classList.remove('compact');

        // restore body styles
        body.style.overflow = '';
        body.style.width = '';
        body.style.height = '';
        body.style.margin = '';
        body.style.padding = '';
        html.style.overflow = '';
        html.style.width = '';
        html.style.height = '';
        html.style.margin = '';
        html.style.padding = '';

        while (hiddenSelects.length) {
            const el = hiddenSelects.pop();
            if (el) el.style.display = '';
        }

        showing = isMobile && isPortrait;
    }

    // landscape orientation
    $effect(() => {
        updateForOrientation();

        window.addEventListener('orientationchange', updateForOrientation, {
            signal: abortController.signal,
        });
        window.addEventListener('resize', updateForOrientation, {
            signal: abortController.signal,
        });

        if ((screen as any).orientation?.addEventListener) {
            orientationListener = updateForOrientation;
            (screen as any).orientation.addEventListener(
                'change',
                orientationListener,
                { signal: abortController.signal },
            );
        }

        return () => {
            abortController.abort();

            if (
                orientationListener &&
                (screen as any).orientation?.removeEventListener
            ) {
                (screen as any).orientation.removeEventListener(
                    'change',
                    orientationListener,
                );
                orientationListener = null;
            }

            // Restore on unmount
            const nav = document.querySelector('nav') as HTMLElement | null;
            const footer = document.querySelector(
                'footer',
            ) as HTMLElement | null;
            const body = document.body;
            const html = document.documentElement;

            if (nav) nav.style.display = '';
            if (footer) footer.style.display = '';

            body.style.overflow = '';
            body.style.width = '';
            body.style.height = '';
            body.style.margin = '';
            body.style.padding = '';
            html.style.overflow = '';
            html.style.width = '';
            html.style.height = '';
            html.style.margin = '';
            html.style.padding = '';

            while (hiddenSelects.length) {
                const el = hiddenSelects.pop();
                if (el) el.style.display = '';
            }
        };
    });

    $effect(() => {
        // notify for pause/resume
        if (showing && !wasShowing) {
            onPause();
            wasShowing = true;
        } else if (!showing && wasShowing) {
            onResume();
            wasShowing = false;
        }
    });
</script>

<style>
    :global(.mobile-joystick.compact) {
        transform-origin: left bottom;
        transform: scale(0.7);
        opacity: 0.95;
        transition: transform 160ms ease;
    }

    :global(.mobile-joystick.compact .joystick-base) {
        inline-size: 5.2em;
        block-size: 5.2em;
    }

    :global(.mobile-joystick.compact .joystick-stick) {
        inline-size: 2.8em;
        block-size: 2.8em;
    }
</style>
