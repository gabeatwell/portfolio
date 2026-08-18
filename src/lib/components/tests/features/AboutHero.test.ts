import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/svelte';
import { SvelteComponent } from 'svelte';
import { renderComponent } from '$lib/data/component-tester';
import AboutHero from '$lib/components/about/about-hero/AboutHero.svelte';

const TestedAboutHero = AboutHero as unknown as typeof SvelteComponent;
const renderAboutHero = (props: Record<string, unknown> = {}) =>
    renderComponent(TestedAboutHero, props);

describe('AboutHero Component', () => {
    it('renders the About heading with accessible name', () => {
        renderAboutHero();

        const heading = screen.getByRole('heading', { name: 'About' });
        expect(heading).not.toBeNull();
        expect(heading.getAttribute('id')).toBe('title');
    });

    it('renders the parallax wrapper', () => {
        renderAboutHero();

        const wrapper = document.querySelector('.parallax-wrapper');
        expect(wrapper).not.toBeNull();
    });

    it('renders all three parallax layers', () => {
        renderAboutHero();

        expect(document.querySelector('.layer.background')).not.toBeNull();
        expect(document.querySelector('.layer.middle')).not.toBeNull();
        expect(document.querySelector('.layer.foreground')).not.toBeNull();
    });

    it('applies background images to parallax layers', () => {
        renderAboutHero();

        const layers = document.querySelectorAll('.parallax-wrapper .layer');
        expect(layers.length).toBe(3);

        layers.forEach((layer) => {
            expect((layer as HTMLElement).style.backgroundImage).toContain(
                'url(',
            );
        });
    });
});
