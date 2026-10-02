import { getContext, setContext } from 'svelte';
import { browser } from '$app/env';

const THEME_KEY = Symbol('theme');

type Theme = 'dark' | 'light';

export interface ThemeContext {
    readonly current: Theme;
    readonly isDark: boolean;
    readonly isLight: boolean;
    readonly isTransitioning: boolean;
    beginTransition(): void;
    endTransition(): void;
    toggle(): Theme;
    set(value: Theme): void;
}

export function createThemeContext(): ThemeContext {
    const initialTheme: Theme = browser
        ? document.documentElement.dataset.theme === 'light'
            ? 'light'
            : 'dark'
        : 'dark';

    let theme = $state<Theme>(initialTheme);

    $effect(() => {
        if (!browser) return;
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem('theme', theme);
        } catch {
            /* private mode */
        }
    });

    let isWiping = $state(false);
    const context: ThemeContext = {
        get current() {
            return theme;
        },
        get isDark() {
            return theme === 'dark';
        },
        get isLight() {
            return theme === 'light';
        },
        get isTransitioning() {
            return isWiping;
        },
        beginTransition() {
            isWiping = true;
        },
        endTransition() {
            isWiping = false;
        },
        toggle() {
            theme = theme === 'dark' ? 'light' : 'dark';
            return theme;
        },
        set(value: Theme) {
            theme = value;
        },
    };

    setContext(THEME_KEY, context);
    return context;
}

export function useTheme(): ThemeContext {
    const ctx = getContext<ThemeContext>(THEME_KEY);
    if (!ctx) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return ctx;
}
