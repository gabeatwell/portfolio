import { form } from '$app/server';
import { redirect, error } from '@sveltejs/kit';
import * as v from 'valibot';

const contactSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
    email: v.pipe(v.string(), v.email('Valid email required')),
    message: v.pipe(v.string(), v.minLength(1, 'Please add a bit more detail')),
    _gotcha: v.optional(v.string()), // honeypot
    ts: v.optional(v.string()),
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
    _gotcha: v.optional(v.string()), // honeypot
    ts: v.optional(v.string()),
});

export const submitContact = form(contactSchema, async (data) => {
    // reject early if honeypot is filled
    if (data._gotcha && data._gotcha.trim() !== '') {
        redirect(303, '/contact/success');
    }

    const res = await fetch('https://formspree.io/f/xjyvrrle', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Origin: 'https://atwell.dev', // satisfy provider domain check
            Referer: 'https://atwell.dev/contact',
        },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message,
            _replyto: data.email,
            _subject: `Contact from ${data.name}`,
            _gotcha: data._gotcha ?? '',
        }),
    });

    if (!res.ok) {
        console.error('formspree said:', res.status, await res.text());
        error(res.status, 'Submission failed. Please try again.');
    }

    redirect(303, '/contact/success');
});

export const submitHire = form(hireSchema, async (data) => {
    // reject early if honeypot is filled
    if (data._gotcha && data._gotcha.trim() !== '') {
        redirect(303, '/contact/success');
    }

    const res = await fetch('https://formspree.io/f/xwpoqdno', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Origin: 'https://atwell.dev',
            Referer: 'https://atwell.dev/hire', // fixed
        },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            location: data.location,
            site: data.site ?? '',
            company: data.company ?? '',
            project_type: data.project_type,
            new_project: data.new_project,
            timeline: data.timeline,
            budget: data.budget,
            message: data.message,
            _replyto: data.email,
            _subject: `Hire inquiry from ${data.name}`,
            _gotcha: data._gotcha ?? '',
        }),
    });

    if (!res.ok) {
        console.error('formspree said:', res.status, await res.text());
        error(res.status, 'Submission failed. Please try again.');
    }

    redirect(303, '/contact/success');
});
