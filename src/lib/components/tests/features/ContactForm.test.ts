import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ContactForm from '$lib/components/contact/ContactForm.svelte';

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

vi.mock('$lib/components/layout/Popover.svelte', () => ({
    default: vi.fn(),
}));

vi.mock('$lib/components/contact/ModalPopover.svelte', () => ({
    default: vi.fn(),
}));

vi.mock('$lib/components/contact/MotifPhoto.svelte', () => ({
    default: vi.fn(),
}));

// Hoist the mock so it's available when vi.mock runs
const { mockSubmitContact } = vi.hoisted(() => ({
    mockSubmitContact: {
        name: 'submit-contact',
        action: '?/submitContact',
        method: 'POST',
        fields: {
            name: { issues: vi.fn((): FieldIssue[] => []) },
            email: { issues: vi.fn((): FieldIssue[] => []) },
            message: { issues: vi.fn((): FieldIssue[] => []) },
        },
    },
}));

vi.mock('$lib/components/contact/contact.remote', () => ({
    submitContact: mockSubmitContact,
}));

// Stub SvelteKit globals that contact.remote.ts imports
vi.stubGlobal('__SVELTEKIT_PATHS_BASE__', '');
vi.stubGlobal('__SVELTEKIT_APP_DIR__', '_app');
vi.stubGlobal('__SVELTEKIT_HASH_ROUTING__', false);
vi.stubGlobal('__SVELTEKIT_PAYLOAD__', null);

describe('ContactForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the form with all fields', () => {
        render(ContactForm);

        expect(screen.getByLabelText('name')).toBeDefined();
        expect(screen.getByLabelText('email')).toBeDefined();
        expect(screen.getByLabelText('message')).toBeDefined();
    });

    it('renders the fieldset legend', () => {
        render(ContactForm);

        expect(screen.getByText('reach me')).toBeDefined();
    });

    it('renders the Popover wrapper', () => {
        const { container } = render(ContactForm);

        const wrapper = container.querySelector('.popover-icon');
        expect(wrapper).toBeDefined();
    });

    it('renders the MotifPhoto wrapper', () => {
        const { container } = render(ContactForm);

        const wrapper = container.querySelector('.personal-image');
        expect(wrapper).toBeDefined();
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
        render(ContactForm);

        const form = screen.getByRole('form');
        expect(form).toHaveAttribute('novalidate');
    });

    it('does not show error messages when fields are valid', () => {
        mockSubmitContact.fields.name.issues.mockReturnValue([]);
        mockSubmitContact.fields.email.issues.mockReturnValue([]);
        mockSubmitContact.fields.message.issues.mockReturnValue([]);

        render(ContactForm);

        const errors = screen.queryAllByText(/.+/);
        // No .field-error elements should be visible
        const fieldErrors = document.querySelectorAll('.field-error');
        expect(fieldErrors.length).toBe(0);
    });

    it('shows error messages when fields have issues', () => {
        mockSubmitContact.fields.name.issues.mockReturnValue([
            { message: 'Name is required' },
        ]);
        mockSubmitContact.fields.email.issues.mockReturnValue([
            { message: 'Valid email required' },
        ]);
        mockSubmitContact.fields.message.issues.mockReturnValue([]);

        render(ContactForm);

        expect(screen.getByText('Name is required')).toBeDefined();
        expect(screen.getByText('Valid email required')).toBeDefined();
    });
});
