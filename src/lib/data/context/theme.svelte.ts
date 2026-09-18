import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';

const THEME_KEY = Symbol('theme');

type Theme = 'dark' | 'light';

export interface ThemeContext {
    readonly current: Theme;
    readonly isDark: boolean;
    readonly isLight: boolean;
    toggle(): Theme;
    set(value: Theme): void;
}

export function createThemeContext(): ThemeContext {
    const initialTheme: Theme = browser
        ? (localStorage.getItem('theme') as Theme) || 'dark'
        : 'dark';
    let theme = $state<Theme>(initialTheme);

    $effect(() => {
        if (browser) {
            document.documentElement.setAttribute('data-theme', theme);
            document.documentElement.style.colorScheme = theme;
        }
    });

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
        toggle() {
            theme = theme === 'dark' ? 'light' : 'dark';
            if (browser) {
                localStorage.setItem('theme', theme);
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.style.colorScheme = theme;
            }
            return theme;
        },
        set(value: Theme) {
            theme = value;
            if (browser) {
                localStorage.setItem('theme', theme);
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.style.colorScheme = theme;
            }
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
