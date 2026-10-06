import { form } from '$app/server';
import { redirect, error } from '@sveltejs/kit';
import { contactSchema, hireSchema } from '#lib/data/contact/schema';

function spamBot(data: {
    _gotcha?: string;
    ts?: string;
    name?: string;
    email?: string;
    message?: string;
}) {
    // 1. honeypot
    if (data._gotcha && data._gotcha.trim() !== '') return true;

    // 2. time trap
    const MIN_MS = 3000;
    const started = Number(data.ts);
    if (!started || Number.isNaN(started) || Date.now() - started < MIN_MS) {
        return true;
    }

    // 3. catches the spam just received
    const haystack =
        `${data.name ?? ''} ${data.email ?? ''} ${data.message ?? ''}`.toLowerCase();
    const patterns = [
        /functional-test/,
        /qa-no-reply/,
        /please ignore/,
        /automated functional/,
        /example\.com$/,
        /test[-_]?city/,
        /ref-\d+/,
    ];
    if (patterns.some((p) => p.test(haystack))) return true;

    return false;
}

export const submitContact = form(contactSchema, async (data) => {
    // fake success so the bot thinks it worked
    if (spamBot(data)) {
        redirect(303, '/contact/success');
    }

    const res = await fetch('https://formspree.io/f/xjyvrrle', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Origin: 'https://atwell.dev',
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
    // fake success so the bot thinks it worked
    if (spamBot(data)) {
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
