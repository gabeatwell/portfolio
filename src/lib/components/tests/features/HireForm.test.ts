import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import HireForm from '#lib/components/contact/forms/HireForm.svelte';

type FieldIssue = { message: string };

const HIRE_FIELDS = [
    'name',
    'email',
    'location',
    'site',
    'company',
    'project_type',
    'new_project',
    'timeline',
    'budget',
    'message',
] as const;

type HireField = (typeof HIRE_FIELDS)[number];

type MockField = { issues: () => FieldIssue[] | undefined };
type MockForm = {
    method: string;
    action: string;
    pending: boolean;
    error: null;
    fields: Record<HireField, MockField>;
};

// Everything the mock needs is built inside vi.hoisted, so `fields` is fully
// populated before any hoisted vi.mock factory (or the component) reads it.
const { mockSubmitHire } = vi.hoisted(() => {
    const fields = {} as Record<HireField, MockField>;
    for (const key of [
        'name',
        'email',
        'location',
        'site',
        'company',
        'project_type',
        'new_project',
        'timeline',
        'budget',
        'message',
    ] as const) {
        fields[key] = { issues: () => [] };
    }

    return {
        mockSubmitHire: {
            method: 'POST',
            action: '?/submitHire',
            pending: false,
            error: null,
            fields,
        } satisfies MockForm,
    };
});

vi.mock('#routes/contact.remote', () => ({
    submitHire: mockSubmitHire,
}));

function setIssues(field: HireField, issues: FieldIssue[]) {
    mockSubmitHire.fields[field].issues = vi.fn(() => issues);
}

describe('HireForm', () => {
    beforeEach(() => {
        for (const key of HIRE_FIELDS) setIssues(key, []);
    });

    it('renders the form with all fields', () => {
        const { container } = render(HireForm);

        for (const name of ['name', 'email', 'location', 'message']) {
            expect(
                container.querySelector(`[name="${name}"]`),
                `missing field: ${name}`,
            ).toBeInTheDocument();
        }
    });

    it('has novalidate on the form', () => {
        const { container } = render(HireForm);

        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
        expect(form).toHaveAttribute('novalidate');
    });

    it('does not show error messages when fields are valid', () => {
        render(HireForm);

        expect(document.querySelectorAll('.field-error')).toHaveLength(0);
    });

    it('shows error messages when fields have issues', () => {
        setIssues('location', [{ message: 'Location is required' }]);
        setIssues('budget', [{ message: 'Budget is required' }]);

        render(HireForm);

        expect(screen.getByText('Location is required')).toBeInTheDocument();
        expect(screen.getByText('Budget is required')).toBeInTheDocument();
    });
});
