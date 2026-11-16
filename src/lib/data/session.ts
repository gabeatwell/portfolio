import { browser } from '$app/env';

const PREFIX = 'portfolio:animation';

export function playOncePerSession(key: string): boolean {
    if (!browser) return true;

    try {
        const storageKey = PREFIX + key;
        if (sessionStorage.getItem(storageKey) !== null) return false;
        sessionStorage.setItem(storageKey, '1');
        return true;
    } catch {
        return true;
    }
}

export function hasPlayedThisSession(key: string): boolean {
    if (!browser) return false;

    try {
        return sessionStorage.getItem(PREFIX + key) !== null;
    } catch {
        return false;
    }
}

export function markPlayedThisSession(key: string): void {
    if (!browser) return;

    try {
        sessionStorage.setItem(PREFIX + key, '1');
    } catch {
        // animation will replay
    }
}
