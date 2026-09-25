import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte.js';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'install-prompt-dismissed';

let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
if (typeof window !== 'undefined') {
    window.addEventListener(
        'beforeinstallprompt',
        (e) => {
            e.preventDefault();
            deferredPrompt = e as BeforeInstallPromptEvent;
        },
        { once: true },
    );
}

export class InstallButtonController {
    #breakpoints = getBreakpoints();
    #statusTimer: ReturnType<typeof setTimeout> | undefined;

    installStatus = $state('');
    isIOS = $state(false);
    isMacSafari = $state(false);
    shareFallback = $state(false);
    shareClicked = $state(false);

    get isInstallable() {
        return !this.isIOS && !this.dismissed && deferredPrompt !== null;
    }

    dismissed = $state(
        typeof sessionStorage !== 'undefined' &&
            sessionStorage.getItem(DISMISSED_KEY) === 'true',
    );

    constructor() {
        // detect iOS vs macOs safari
        $effect(() => {
            const params = new URLSearchParams(window.location.search);
            const forced = import.meta.env.DEV
                ? (params.get('device') ?? params.get('ua'))
                : null;
            const ua =
                forced === 'mac'
                    ? 'macintosh safari'
                    : forced === 'ios'
                      ? 'iphone safari'
                      : (forced ?? window.navigator.userAgent);

            const isAppleMobile = /iphone|ipad|ipod/i.test(ua);
            const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
            this.isMacSafari = /macintosh/i.test(ua) && isSafari;
            this.isIOS =
                (isAppleMobile &&
                    !('MSStream' in window) &&
                    !this.#breakpoints.isStandalone) ||
                this.isMacSafari;
        });

        $effect(() => {
            const onInstalled = () => {
                this.dismissed = true;
                sessionStorage.setItem(DISMISSED_KEY, 'true');
                this.installStatus = 'App installed successfully';
            };
            window.addEventListener('appinstalled', onInstalled);
            return () =>
                window.removeEventListener('appinstalled', onInstalled);
        });

        $effect(() => () => clearTimeout(this.#statusTimer));
    }

    #dismiss() {
        this.dismissed = true;
        sessionStorage.setItem(DISMISSED_KEY, 'true');
        this.shareFallback = false;
        this.shareClicked = false;
        this.installStatus = '';
    }

    installApp = async () => {
        if (!deferredPrompt) return;
        this.installStatus = 'Installing app...';
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        this.installStatus =
            outcome === 'accepted'
                ? 'Installation accepted'
                : 'Installation declined';
        deferredPrompt = null;
        if (outcome === 'dismissed') this.#dismiss();

        clearTimeout(this.#statusTimer);
        this.#statusTimer = setTimeout(() => (this.installStatus = ''), 3000);
    };

    shareApp = () => {
        this.shareFallback = true;
        this.shareClicked = true;
    };

    closeFallback = () => this.#dismiss();
}
