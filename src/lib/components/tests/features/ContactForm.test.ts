import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ContactForm from '#lib/components/contact/forms/ContactForm.svelte';

interface FieldIssue {
    message: string;
}

// The object the component reads: `{...submitContact}` spread +
// `submitContact.fields.<name>.issues()`. Declared via vi.hoisted so it
// exists when vi.mock's factory runs.
const { mockSubmitContact } = vi.hoisted(() => ({
    mockSubmitContact: {
        method: 'POST',
        action: '?/submitContact',
        pending: false,
        error: null,
        fields: {
            name: { issues: vi.fn((): FieldIssue[] | undefined => []) },
            email: { issues: vi.fn((): FieldIssue[] | undefined => []) },
            message: { issues: vi.fn((): FieldIssue[] | undefined => []) },
        },
    },
}));

// One mock, for the exact specifier the component imports. The real remote
// module cannot load under Vitest (vite-plugin-sveltekit-remote throws
// without a SvelteKit build context), so it must be stubbed.
vi.mock('#routes/contact.remote', () => ({
    submitContact: mockSubmitContact,
}));

function setIssues(field: 'name' | 'email' | 'message', issues: FieldIssue[]) {
    mockSubmitContact.fields[field].issues.mockReturnValue(issues);
}

describe('ContactForm', () => {
    beforeEach(() => {
        // explicit defaults every test — vi.clearAllMocks() does NOT reset
        // mockReturnValue, so without this, issue mocks leak across tests
        setIssues('name', []);
        setIssues('email', []);
        setIssues('message', []);
    });

    it('renders the form with all fields', () => {
        render(ContactForm);

        expect(screen.getByLabelText('name')).toBeInTheDocument();
        expect(screen.getByLabelText('email')).toBeInTheDocument();
        expect(screen.getByLabelText('message')).toBeInTheDocument();
    });

    it('renders the fieldset legend', () => {
        render(ContactForm);

        expect(screen.getByText('reach me')).toBeInTheDocument();
    });

    it('renders the Popover wrapper', () => {
        const { container } = render(ContactForm);

        expect(container.querySelector('.popover-icon')).toBeInTheDocument();
    });

    it('renders the MotifPhoto wrapper', () => {
        const { container } = render(ContactForm);

        expect(container.querySelector('.personal-image')).toBeInTheDocument();
    });

    it('has correct input attributes', () => {
        render(ContactForm);

        const nameInput = screen.getByLabelText('name');
        expect(nameInput).toHaveAttribute('type', 'text');
        expect(nameInput).toHaveAttribute('autocomplete', 'name');
        expect(nameInput).toHaveAttribute('required');

        const emailInput = screen.getByLabelText('email');
        expect(emailInput).toHaveAttribute('type', 'email');
        expect(emailInput).toHaveAttribute('autocomplete', 'email');
        expect(emailInput).toHaveAttribute('required');

        const messageInput = screen.getByLabelText('message');
        expect(messageInput.tagName).toBe('TEXTAREA');
        expect(messageInput).toHaveAttribute('required');
        expect(messageInput).toHaveAttribute('rows', '5');
    });

    it('has novalidate on the form', () => {
        const { container } = render(ContactForm);

        // the <form> has no accessible name, so getByRole('form') can't
        // match it — query the element directly
        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();
        expect(form).toHaveAttribute('novalidate');
    });

    it('does not show error messages when fields are valid', () => {
        render(ContactForm);

        expect(document.querySelectorAll('.field-error')).toHaveLength(0);
    });

    it('shows error messages when fields have issues', () => {
        setIssues('name', [{ message: 'Name is required' }]);
        setIssues('email', [{ message: 'Valid email required' }]);

        render(ContactForm);

        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Valid email required')).toBeInTheDocument();
    });
});
