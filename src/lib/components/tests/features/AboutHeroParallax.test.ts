import { describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/svelte';
import { SvelteComponent } from 'svelte';
import { renderComponent } from '$lib/data/component-tester';
import AboutHeroParallax from '$lib/components/about/about-hero/AboutHeroParallax.svelte';

const TestedAboutHeroParallax =
    AboutHeroParallax as unknown as typeof SvelteComponent;

const renderAboutHeroParallax = (props: Record<string, unknown> = {}) =>
    renderComponent(TestedAboutHeroParallax, props);

const setScroll = (y: number) => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
    Object.defineProperty(window, 'pageYOffset', {
        value: y,
        configurable: true,
    });
    window.dispatchEvent(new Event('scroll'));
};

describe('AboutHeroParallax Component', () => {
    beforeEach(() => {
        setScroll(0);
    });

    it('renders parallax wrapper and layers', () => {
        renderAboutHeroParallax();

        expect(document.querySelector('.parallax-wrapper')).not.toBeNull();
        expect(document.querySelector('.layer.background')).not.toBeNull();
        expect(document.querySelector('.layer.middle')).not.toBeNull();
        expect(document.querySelector('.layer.foreground')).not.toBeNull();
    });

    it('updates layer transform/styles when the page scrolls', async () => {
        renderAboutHeroParallax();

        const bg = document.querySelector(
            '.layer.background',
        ) as HTMLElement | null;
        const middle = document.querySelector(
            '.layer.middle',
        ) as HTMLElement | null;
        const fg = document.querySelector(
            '.layer.foreground',
        ) as HTMLElement | null;

        expect(bg).not.toBeNull();
        expect(middle).not.toBeNull();
        expect(fg).not.toBeNull();

        const before = [bg!, middle!, fg!].map((el) => el.style.transform);

        setScroll(220);

        await waitFor(() => {
            const after = [bg!, middle!, fg!].map((el) => el.style.transform);
            const changed = after.some((value, i) => value !== before[i]);
            expect(changed).toBe(true);
        });
    });

    it('removes scroll side-effects after unmount', () => {
        const { unmount } = renderAboutHeroParallax();

        unmount();

        expect(() => setScroll(300)).not.toThrow();
    });
});
