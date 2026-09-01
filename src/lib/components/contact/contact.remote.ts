import { form } from '$app/server';
import { redirect, error } from '@sveltejs/kit';
import * as v from 'valibot';

const contactSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
    email: v.pipe(v.string(), v.email('Valid email required')),
    message: v.pipe(v.string(), v.minLength(1, 'Please add a bit more detail')),
});

const hireSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
    email: v.pipe(v.string(), v.email('Valid email required')),
    location: v.pipe(v.string(), v.minLength(1, 'Location is required')),
    site: v.optional(v.string()), // current "Website" field name
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

export const submitContact = form(contactSchema, async (data) => {
    const res = await fetch('https://form.taxi/s/xeyymb58', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Origin: 'https://atwell.dev', // satisfy provider domain check
            Referer: 'https://atwell.dev/contact',
            'User-Agent': 'Mozilla/5.0 (compatible; atwell.dev form)',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        error(res.status, 'Submission failed. Please try again.');
    }

    redirect(303, '/contact/success');
});

export const submitHire = form(hireSchema, async (data) => {
    const res = await fetch('https://formspree.io/f/xwpoqdno', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Origin: 'https://atwell.dev', // satisfy provider domain check
            Referer: 'https://atwell.dev/contact',
            'User-Agent': 'Mozilla/5.0 (compatible; atwell.dev form)',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        error(res.status, 'Submission failed. Please try again.');
    }

    // submission accepted
    redirect(303, '/contact/success');
});
