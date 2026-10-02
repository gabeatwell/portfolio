import { form } from '$app/server';
import { redirect, error } from '@sveltejs/kit';
import { contactSchema, hireSchema } from '#lib/data/contact/schema';

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
