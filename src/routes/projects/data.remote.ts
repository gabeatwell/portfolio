import { prerender } from '$app/server';
import { generateFallbackData } from '$lib/components/projects/contributions/githubContributions';
import { GITHUB_TOKEN, GITHUB_USERNAME } from '$env/static/private';

export const getContributions = prerender(async () => {
    try {
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

        const to = new Date();
        const from = new Date();
        from.setFullYear(to.getFullYear() - 1);
        from.setDate(from.getDate() - 7);

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: {
                    username: GITHUB_USERNAME,
                    from: from.toISOString(),
                    to: to.toISOString(),
                },
            }),
        });

        if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL Errors:', JSON.stringify(data.errors));
            throw new Error('GraphQL query failed');
        }

        const calendar =
            data.data.user.contributionsCollection.contributionCalendar;

        return {
            success: true,
            totalContributions: calendar.totalContributions,
            weeks: calendar.weeks,
        };
    } catch (error) {
        console.error('Error fetching contributions:', error);
        return generateFallbackData();
    }
});
