import { tick } from 'svelte';

type Theme = 'dark' | 'light';

interface ThemeToggleOptions {
    isDark: () => boolean;
    onChange: (theme: Theme) => void;
    onBegin?: () => void;
    onEnd?: () => void;
    onAnnounce?: (message: string) => void;
    onSound?: () => void;
}

export function ThemeToggle({
    isDark,
    onChange,
    onBegin,
    onEnd,
    onAnnounce,
    onSound,
}: ThemeToggleOptions) {
    return (node: HTMLElement) => {
        const input = node as HTMLInputElement;
        const label = document.querySelector<HTMLLabelElement>(
            `label[for="${input.id}"]`,
        );
        const root = document.documentElement;

        const paintCheckbox = () => {
            input.checked = root.dataset.theme === 'dark';
        };

        function circleOrigin() {
            const w = innerWidth;
            const h = innerHeight;
            let x: number;
            let y: number;

            if (!label || w <= 768) {
                x = w / 2;
                y = h / 5;
            } else {
                const r = label.getBoundingClientRect();
                x = r.left + r.width / 2;
                y = r.top + r.height / 2;
            }

            const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));

            root.style.setProperty('--x', `${x}px`);
            root.style.setProperty('--y', `${y}px`);
            root.style.setProperty('--r', `${Math.ceil(radius)}px`);
        }

        async function onclick(e: MouseEvent) {
            e.preventDefault(); // state decides `checked`, never the DOM
            void onSound?.();

            const next: Theme = isDark() ? 'light' : 'dark';
            const run = async () => {
                onChange(next);
                await tick(); // flush the context's $effect inside the transition
                onAnnounce?.(`Switched to ${next} theme`);
            };

            if (!document.startViewTransition) return run();

            onBegin?.();
            await tick();

            circleOrigin();
            root.classList.add('theme-transitioning');

            const vt = document.startViewTransition(run);
            const done = () => {
                root.classList.remove('theme-transitioning');
                onEnd?.();
            };
            vt.finished.finally(done);
            vt.ready.catch(done);
        }

        // reflect theme changes made anywhere else (keyboard shortcut, etc.)
        paintCheckbox();
        const observer = new MutationObserver(paintCheckbox);
        observer.observe(root, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        node.addEventListener('click', onclick);

        return () => {
            observer.disconnect();
            node.removeEventListener('click', onclick);
        };
    };
}
