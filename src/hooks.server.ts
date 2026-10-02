import type { Handle } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Handle Chrome DevTools requests that cause 404 errors
    if (event.url.pathname.startsWith('/.well-known/')) {
        return new Response('', { status: 204 });
    }

    // Redirect /about/hero to /about since that's not directly linked in navigation
    if (event.url.pathname === '/about/hero') {
        return new Response(null, {
            status: 301,
            headers: {
                location: '/about',
            },
        });
    }

    // Handle trailing slashes - redirect to no trailing slash except for root
    if (event.url.pathname !== '/' && event.url.pathname.endsWith('/')) {
        const redirectPath = event.url.pathname.slice(0, -1);
        return new Response(null, {
            status: 301,
            headers: {
                location: redirectPath + event.url.search,
            },
        });
    }

    // honeypot + timing gate
    const SPAM_TRAP = new Set(['submitContact', 'submitHire']);

    if (event.request.method === 'POST') {
        let actionName = '';
        for (const [key, value] of event.url.searchParams) {
            if (key === '/remote') actionName = value.split('/').pop() ?? '';
            else if (key.startsWith('/')) actionName = key.slice(1);
        }

        if (SPAM_TRAP.has(actionName)) {
            const fd = await event.request.clone().formData();

            const gotcha = (fd.get('_gotcha') as string | null)?.trim();
            const ts = Number(fd.get('ts'));

            const too_fast = !ts || Date.now() - ts < 3000;
            const too_old = ts && Date.now() - ts > 7 * 24 * 60 * 60 * 1000; // no replays

            if (gotcha || too_fast || too_old) {
                redirect(303, '/contact/success');
            }
        }
    }

    const response = await resolve(event);

    // Add SEO-friendly headers
    response.headers.set(
        'X-Robots-Tag',
        'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    );

    // HSTS - force HTTPS
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload',
    );

    // Consolidated cache control for static assets
    if (
        event.url.pathname.startsWith('/static/') ||
        event.url.pathname.match(
            /\.(js|css|png|jpg|jpeg|gif|webp|svg|woff|woff2)$/,
        )
    ) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable',
        );
    }

    // Cache API routes aggressively
    if (event.url.pathname.startsWith('/api/')) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=3600, s-maxage=3600',
        ); // 1 hour
    }

    return response;
};
