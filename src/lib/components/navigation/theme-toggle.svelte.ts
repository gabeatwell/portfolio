interface ThemeToggleOptions {
    storageKey?: string;
    onAnnounce?: (message: string) => void;
    onSound?: () => void;
}

export function ThemeToggle({
    storageKey = 'theme',
    onAnnounce,
    onSound,
}: ThemeToggleOptions = {}) {
    return (node: HTMLElement) => {
        const input = node as HTMLInputElement;
        const label = document.querySelector<HTMLLabelElement>(
            `label[for="${input.id}"]`,
        );

        const sync = () => {
            const theme = input.checked ? 'dark' : 'light';
            try {
                localStorage.setItem(storageKey, theme);
            } catch {
                /* private mode etc. */
            }
            document.documentElement.dataset.theme = theme;
        };

        const announce = () => {
            onAnnounce?.(
                `Switched to ${input.checked ? 'dark' : 'light'} theme`,
            );
        };

        // restore preference at mount (replaces the $effect)
        const stored = localStorage.getItem(storageKey);
        input.checked =
            stored !== null
                ? stored === 'dark'
                : window.matchMedia('(prefers-color-scheme: dark)').matches;
        sync();

        function onclick(e: MouseEvent) {
            onSound?.();

            if (!document.startViewTransition) return;
            e.preventDefault();

            const isMobile = window.innerWidth <= 768;
            let x: number, y: number;
            if (isMobile || !label) {
                x = window.innerWidth / 2;
                y = window.innerHeight / 5;
            } else {
                const rect = label.getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2;
            }

            const root = document.documentElement;
            root.style.setProperty('--x', `${x}px`);
            root.style.setProperty('--y', `${y}px`);
            root.style.viewTransitionName = 'changing-theme';

            document
                .startViewTransition(() => {
                    input.checked = !input.checked;
                    sync();
                    announce();
                })
                .finished.finally(() => {
                    root.style.viewTransitionName = '';
                });
        }

        function onchange() {
            sync();
            announce();
        }

        node.addEventListener('click', onclick);
        node.addEventListener('change', onchange);

        return () => {
            node.removeEventListener('click', onclick);
            node.removeEventListener('change', onchange);
        };
    };
}
