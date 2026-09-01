import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import HireForm from '$lib/components/contact/HireForm.svelte';

interface FieldIssue {
    message: string;
}

// Mock child components
vi.mock('$lib/components/contact/SubmitButton.svelte', () => ({
    default: vi.fn(),
}));
vi.mock('$lib/components/utils/A11yAnnouncer.svelte', () => ({
    default: vi.fn(),
}));

// Hoist the mock so it's available when vi.mock runs
const { mockSubmitHire } = vi.hoisted(() => ({
    mockSubmitHire: {
        name: 'submit-hire',
        action: '?/submitHire',
        method: 'POST',
        fields: {
            name: { issues: vi.fn((): FieldIssue[] => []) },
            email: { issues: vi.fn((): FieldIssue[] => []) },
            location: { issues: vi.fn((): FieldIssue[] => []) },
            project_type: { issues: vi.fn((): FieldIssue[] => []) },
            new_project: { issues: vi.fn((): FieldIssue[] => []) },
            timeline: { issues: vi.fn((): FieldIssue[] => []) },
            budget: { issues: vi.fn((): FieldIssue[] => []) },
            message: { issues: vi.fn((): FieldIssue[] => []) },
        },
    },
}));

vi.mock('$lib/components/contact/contact.remote', () => ({
    submitHire: mockSubmitHire,
}));

// Mock ResizeObserver (not available in jsdom)
class MockResizeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

// Stub SvelteKit globals that contact.remote.ts imports
vi.stubGlobal('__SVELTEKIT_PATHS_BASE__', '');
vi.stubGlobal('__SVELTEKIT_APP_DIR__', '_app');
vi.stubGlobal('__SVELTEKIT_HASH_ROUTING__', false);
vi.stubGlobal('__SVELTEKIT_PAYLOAD__', null);

describe('HireForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form with all required fields', () => {
        render(HireForm);

        expect(screen.getByPlaceholderText('Your name')).toBeDefined();
        expect(
            screen.getByPlaceholderText('your.email@example.com'),
        ).toBeDefined();
        expect(
            screen.getByPlaceholderText('(e.g: Los Angeles, CA.)'),
        ).toBeDefined();
        expect(
            screen.getByPlaceholderText('(e.g: if-applicable.com)'),
        ).toBeDefined();
        expect(
            screen.getByPlaceholderText('Your company (optional)'),
        ).toBeDefined();
        expect(
            screen.getByPlaceholderText('Tell me about your project...'),
        ).toBeDefined();
    });

    it('renders all select dropdowns with correct options', () => {
        render(HireForm);

        const projectType = screen.getByDisplayValue('Select a project type');
        expect(projectType).toBeDefined();

        const newProject = screen.getByDisplayValue(
            'Is this new or a rebrand?',
        );
        expect(newProject).toBeDefined();

        const timeline = screen.getByDisplayValue('What is your timeline?');
        expect(timeline).toBeDefined();

        const budget = screen.getByDisplayValue('What is your budget?');
        expect(budget).toBeDefined();
    });

    it('renders project type options', () => {
        render(HireForm);

        expect(screen.getByText('Website Design')).toBeDefined();
        expect(screen.getByText('Website Development')).toBeDefined();
        expect(screen.getByText('Web Application')).toBeDefined();
        expect(screen.getByText('E-commerce')).toBeDefined();
    });

    it('renders timeline options', () => {
        render(HireForm);

        expect(screen.getByText('Within a month')).toBeDefined();
        expect(screen.getByText('Within 2 months')).toBeDefined();
    });

    it('renders budget options', () => {
        render(HireForm);

        expect(screen.getByText('Less than $1,500')).toBeDefined();
        expect(screen.getByText('$10,000+')).toBeDefined();
    });

    it('renders the datalist for locations', () => {
        render(HireForm);

        const datalist = document.getElementById('locations');
        expect(datalist).toBeDefined();

        const options = datalist!.querySelectorAll('option');
        const values = Array.from(options).map((opt) =>
            opt.getAttribute('value'),
        );
        expect(values).toContain('Los Angeles, CA');
        expect(values).toContain('Las Vegas, NV.');
    });

    it('renders the datalist for companies', () => {
        render(HireForm);

        const datalist = document.getElementById('companies');
        expect(datalist).toBeDefined();

        const options = datalist!.querySelectorAll('option');
        const values = Array.from(options).map((opt) =>
            opt.getAttribute('value'),
        );
        expect(values).toContain('Startup');
        expect(values).toContain('Freelancer');
    });

    it('renders the "* = required" legend', () => {
        render(HireForm);

        expect(screen.getByText('* = required')).toBeDefined();
    });

    it('has the correct form grid structure', () => {
        const { container } = render(HireForm);

        const formGrids = container.querySelectorAll('.form-grid');
        expect(formGrids.length).toBe(2);
    });

    it('does not show errors initially', () => {
        render(HireForm);

        const fieldErrors = document.querySelectorAll('.field-error');
        expect(fieldErrors.length).toBe(0);
    });

    it('shows errors when remote form reports issues', () => {
        mockSubmitHire.fields.name.issues.mockReturnValue([
            { message: 'Name is required' },
        ]);
        mockSubmitHire.fields.email.issues.mockReturnValue([
            { message: 'Valid email required' },
        ]);
        mockSubmitHire.fields.location.issues.mockReturnValue([]);
        mockSubmitHire.fields.project_type.issues.mockReturnValue([
            { message: 'Project type is required' },
        ]);
        mockSubmitHire.fields.new_project.issues.mockReturnValue([]);
        mockSubmitHire.fields.timeline.issues.mockReturnValue([]);
        mockSubmitHire.fields.budget.issues.mockReturnValue([]);
        mockSubmitHire.fields.message.issues.mockReturnValue([]);

        render(HireForm);

        expect(screen.getByText('Name is required')).toBeDefined();
        expect(screen.getByText('Valid email required')).toBeDefined();
        expect(screen.getByText('Project type is required')).toBeDefined();
    });

    it('renders the anchor element for CSS anchor positioning', () => {
        const { container } = render(HireForm);

        const anchor = container.querySelector('.anchor');
        expect(anchor).toBeDefined();
    });
});
