import { getBreakpoints } from '$lib/data/stores/breakpoints.svelte.js';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export class InstallButtonController {
    #deferredPrompt: BeforeInstallPromptEvent | null = null;
    #breakpoints = getBreakpoints();

    isInstallable = $state(false);
    installStatus = $state('');
    isIOS = $state(false);
    isMacSafari = $state(false);
    shareFallback = $state(false);
    shareClicked = $state(false);
    promptDismissed = $state(
        typeof sessionStorage !== 'undefined' &&
            sessionStorage.getItem('pwa-prompt-dismissed') === 'true',
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
            const isMac = /macintosh/i.test(ua) && isSafari;

            this.isIOS =
                (isAppleMobile &&
                    !('MSStream' in window) &&
                    !this.#breakpoints.isStandalone) ||
                isMac;
            this.isMacSafari = isMac;
        });

        // pwa install prompt for non-iOS
        $effect(() => {
            const ios = this.isIOS;
            if (ios) return;
            const abortController = new AbortController();

            if (this.isIOS) return;

            const handleBeforeInstallPrompt = (event: Event) => {
                if (this.promptDismissed) return;
                this.#deferredPrompt = event as BeforeInstallPromptEvent;
                this.isInstallable = true;
                this.installStatus = 'App can now be installed';
            };

            const handleAppInstalled = () => {
                this.isInstallable = false;
                this.installStatus = 'App installed successfully';
            };

            window.addEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt,
                {
                    signal: abortController.signal,
                },
            );
            window.addEventListener('appinstalled', handleAppInstalled, {
                signal: abortController.signal,
            });

            return () => abortController.abort();
        });
    }

    installApp = async () => {
        if (!this.#deferredPrompt) return;
        this.installStatus = 'Installing app...';
        this.#deferredPrompt.prompt();

        const choiceResult = await this.#deferredPrompt.userChoice;
        this.installStatus =
            choiceResult.outcome === 'accepted'
                ? 'Installation accepted'
                : 'Installation declined';
        if (choiceResult.outcome === 'dismissed') {
            this.promptDismissed = true;
            sessionStorage.setItem('pwa-prompt-dismissed', 'true');
        }

        this.#deferredPrompt = null;
        this.isInstallable = false;
        setTimeout(() => (this.installStatus = ''), 3000);
    };

    shareApp = () => {
        this.shareFallback = true;
        this.shareClicked = true;
    };

    closeFallback = () => {
        this.shareFallback = false;
        this.shareClicked = false;
    };
}
