import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/svelte';
import { SvelteComponent } from 'svelte';
import { renderComponent } from '$lib/data/component-tester';
import Project from '$lib/components/projects/Project.svelte';

const TestedProject = Project as unknown as typeof SvelteComponent;

const baseProps = {
    title: 'My Portfolio Project',
    description: 'Built with SvelteKit',
    href: '/projects/my-portfolio',
    img: {
        src: 'https://example.com/project.webp',
        srcset: 'https://example.com/project.webp 1x',
        sizes: '(max-width: 768px) 100vw, 50vw',
    },
};

const renderProject = (props: Record<string, unknown> = {}) =>
    renderComponent(TestedProject, { ...baseProps, ...props });

describe('Project Component', () => {
    it('renders without crashing', () => {
        renderProject();
        expect(document.body.firstElementChild).not.toBeNull();
    });

    it('renders project content from props', () => {
        renderProject();

        expect(
            screen.getByRole('heading', { level: 3, name: baseProps.title }),
        ).not.toBeNull();

        expect(
            document.querySelector('.description-title')?.textContent,
        ).toContain(baseProps.description);
    });

    it('renders project link container and image', () => {
        renderProject();

        const link = document.querySelector('a.project-link');
        expect(link).not.toBeNull();
        expect(link?.getAttribute('aria-label')).toContain(baseProps.title);

        const image = document.querySelector('.project-image');
        expect(image).not.toBeNull();
        expect(image?.getAttribute('src')).toBe(baseProps.img.src);
    });
});
