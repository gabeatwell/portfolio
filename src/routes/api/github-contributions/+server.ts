import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = async ({ platform }) => {
    // cloudflare pages runtime bindings
    const env = platform?.env as
        | { GITHUB_TOKEN?: string; GITHUB_USERNAME?: string }
        | undefined;
    const token = env?.GITHUB_TOKEN;
    const username = env?.GITHUB_USERNAME;

    if (!token || !username) {
        return json({
            success: false,
            error: 'Missing GITHUB_TOKEN or GITHUB_USERNAME at runtime',
        });
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

        const response = await fetch('https://api.github.com/graphql', {
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
        });

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

        return json({
            success: true,
            totalContributions: calendar.totalContributions,
            weeks: calendar.weeks,
            source: 'live',
        });
    } catch (error) {
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
