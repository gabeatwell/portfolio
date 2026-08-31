import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const NO_CACHE = {
    'Cache-Control': 'no-store, max-age=0, must-revalidate',
} as const;

export const prerender = false;

export const GET: RequestHandler = async ({ platform }) => {
    // cloudflare pages runtime bindings
    const env = platform?.env as
        | { GITHUB_TOKEN?: string; GITHUB_USERNAME?: string }
        | undefined;
    const token = env?.GITHUB_TOKEN;
    const username = env?.GITHUB_USERNAME;

    if (!token || !username) {
        return json(
            {
                success: false,
                error: 'Missing GITHUB_TOKEN or GITHUB_USERNAME at runtime',
            },
            { headers: NO_CACHE },
        );
    }

    try {
        // same graphQL query as data.remote.ts
        const query = `
            query($username: String!, $from: DateTime!, $to: DateTime!) {
                user(login: $username) {
                    contributionsCollection(from: $from, to: $to) {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                    color
                                }
                            }
                        }
                    }
                }
            }
        `;

        // date range (last year)
        const to = new Date();
        const from = new Date();
        from.setFullYear(to.getFullYear() - 1);

        const response = await fetch(
            `https://api.github.com/graphql?t=${Date.now()}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'atwell-dev-portfolio',
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        username,
                        from: from.toISOString(),
                        to: to.toISOString(),
                    },
                }),
            },
        );

        if (!response.ok) {
            return json({
                success: false,
                error: `GitHub API ${response.status}`,
            });
        }

        const data = await response.json();
        if (data.errors) {
            return json({ success: false, error: 'GraphQL failed' });
        }

        const calendar =
            data.data.user.contributionsCollection.contributionCalendar;

        return json(
            {
                success: true,
                weeks: calendar.weeks,
                totalContributions: calendar.totalContributions,
                source: 'live',
            },
            { headers: NO_CACHE },
        );
    } catch (error) {
        console.error('Contributions API failed:', error);

        return json(
            {
                success: false,
                weeks: [],
                totalContributions: 0,
                source: 'error',
            },
            { headers: NO_CACHE },
        );
    }
};
