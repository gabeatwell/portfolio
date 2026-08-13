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
    shareFallback = $state(false);
    shareClicked = $state(
        typeof localStorage !== 'undefined'
            ? localStorage.getItem('pwa-instructions-shown') === 'true'
            : false,
    );

    constructor() {
        // detect iOS
        $effect(() => {
            const ua = window.navigator.userAgent;
            const isAppleMobile = /iphone|ipad|ipod/i.test(ua);
            const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
            const isMacSafari = /macintosh/i.test(ua) && isSafari;
            this.isIOS =
                (isAppleMobile &&
                    !('MSStream' in window) &&
                    !this.#breakpoints.isStandalone) ||
                isMacSafari;
        });

        // pwa install prompt for non-iOS
        $effect(() => {
            const abortController = new AbortController();

            if (this.isIOS) return;

            const handleBeforeInstallPrompt = (event: Event) => {
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
        this.#deferredPrompt = null;
        this.isInstallable = false;
        setTimeout(() => (this.installStatus = ''), 3000);
    };

    shareApp = () => {
        this.shareFallback = true;
        this.shareClicked = true;
        localStorage.setItem('pwa-instructions-shown', 'true');
    };

    closeFallback = () => {
        this.shareFallback = false;
    };
}
