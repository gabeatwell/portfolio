import { browser } from '$app/env';
import { useSound } from '#lib/data/stores/sounds/uiSounds.svelte.js';

function createSoundStore() {
    let isMobile = $state(false);
    let isInitialized = $state(false);

    const { playSoundAsync } = useSound('/sounds/ui_bubble.wav');

    $effect(() => {
        if (!browser) return;

        isMobile = window.matchMedia('(hover: none)').matches;
        isInitialized = true;
    });

    async function handleUiSound() {
        if (!isInitialized) return;

        await playSoundAsync();
    }

    return {
        get isMobile() {
            return isMobile;
        },
        get isInitialized() {
            return isInitialized;
        },
        handleUiSound,
    };
}

export const soundStore = createSoundStore();
