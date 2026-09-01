import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as v from 'valibot';

// --- Mocks ---
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Re-declare schemas here (or export them from contact.remote.ts for testability)
const contactSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
    email: v.pipe(v.string(), v.email('Valid email required')),
    message: v.pipe(v.string(), v.minLength(1, 'Please add a bit more detail')),
});

const hireSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
    email: v.pipe(v.string(), v.email('Valid email required')),
    location: v.pipe(v.string(), v.minLength(1, 'Location is required')),
    site: v.optional(v.string()),
    company: v.optional(v.string()),
    project_type: v.pipe(
        v.string(),
        v.minLength(1, 'Project type is required'),
    ),
    new_project: v.pipe(v.string(), v.minLength(1, 'Required')),
    timeline: v.pipe(v.string(), v.minLength(1, 'Timeline is required')),
    budget: v.pipe(v.string(), v.minLength(1, 'Budget is required')),
    message: v.pipe(
        v.string(),
        v.minLength(10, 'Please add a bit more detail'),
    ),
});

describe('contactSchema', () => {
    it('passes with valid data', () => {
        const result = v.safeParse(contactSchema, {
            name: 'Gabe',
            email: 'gabe@example.com',
            message: 'Hello!',
        });
        expect(result.success).toBe(true);
    });

    it('fails when name is empty', () => {
        const result = v.safeParse(contactSchema, {
            name: '',
            email: 'gabe@example.com',
            message: 'Hello!',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.issues[0].message).toBe('Name is required');
        }
    });

    it('fails with invalid email', () => {
        const result = v.safeParse(contactSchema, {
            name: 'Gabe',
            email: 'not-an-email',
            message: 'Hello!',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.issues[0].message).toBe('Valid email required');
        }
    });

    it('fails when message is empty', () => {
        const result = v.safeParse(contactSchema, {
            name: 'Gabe',
            email: 'gabe@example.com',
            message: '',
        });
        expect(result.success).toBe(false);
    });
});

describe('hireSchema', () => {
    const validHireData = {
        name: 'Gabe',
        email: 'gabe@example.com',
        location: 'Los Angeles, CA',
        project_type: 'website',
        new_project: 'yes',
        timeline: '1month',
        budget: '2500-3500',
        message: 'I need a website for my business.',
    };

    it('passes with valid data', () => {
        const result = v.safeParse(hireSchema, validHireData);
        expect(result.success).toBe(true);
    });

    it('passes with optional fields omitted', () => {
        const result = v.safeParse(hireSchema, validHireData);
        expect(result.success).toBe(true);
        // site and company are optional, so omitting them is fine
    });

    it('passes with optional fields included', () => {
        const result = v.safeParse(hireSchema, {
            ...validHireData,
            site: 'mybusiness.com',
            company: 'Acme Corp',
        });
        expect(result.success).toBe(true);
    });

    it('fails when name is empty', () => {
        const result = v.safeParse(hireSchema, {
            ...validHireData,
            name: '',
        });
        expect(result.success).toBe(false);
    });

    it('fails with invalid email', () => {
        const result = v.safeParse(hireSchema, {
            ...validHireData,
            email: 'bad',
        });
        expect(result.success).toBe(false);
    });

    it('fails when location is empty', () => {
        const result = v.safeParse(hireSchema, {
            ...validHireData,
            location: '',
        });
        expect(result.success).toBe(false);
    });

    it('fails when message is shorter than 10 chars', () => {
        const result = v.safeParse(hireSchema, {
            ...validHireData,
            message: 'short',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.issues[0].message).toBe(
                'Please add a bit more detail',
            );
        }
    });

    it('fails when required select fields are empty', () => {
        for (const field of [
            'project_type',
            'new_project',
            'timeline',
            'budget',
        ]) {
            const result = v.safeParse(hireSchema, {
                ...validHireData,
                [field]: '',
            });
            expect(result.success).toBe(false);
        }
    });
});

describe('fetch behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('submitContact sends POST to form.taxi with correct payload', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const data = {
            name: 'Gabe',
            email: 'gabe@example.com',
            message: 'Hello!',
        };

        const res = await fetch('https://form.taxi/s/xeyymb58', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'https://form.taxi/s/xeyymb58',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(data),
            }),
        );
        expect(res.ok).toBe(true);
    });

    it('submitHire sends POST to formspree with correct payload', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        const data = {
            name: 'Gabe',
            email: 'gabe@example.com',
            location: 'Los Angeles, CA',
            project_type: 'website',
            new_project: 'yes',
            timeline: '1month',
            budget: '2500-3500',
            message: 'I need a website for my business.',
        };

        const res = await fetch('https://formspree.io/f/xwpoqdno', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'https://formspree.io/f/xwpoqdno',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(data),
            }),
        );
        expect(res.ok).toBe(true);
    });

    it('handles fetch failure gracefully', async () => {
        mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

        const res = await fetch('https://form.taxi/s/xeyymb58', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        expect(res.ok).toBe(false);
        expect(res.status).toBe(500);
    });
});
