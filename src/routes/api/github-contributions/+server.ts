import { GITHUB_TOKEN, GITHUB_USERNAME } from '$env/static/private';
import { json } from '@sveltejs/kit';

interface ContributionDay {
    date: string;
    contributionCount: number;
    color: string;
}

interface Week {
    contributionDays: ContributionDay[];
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch }) {
    try {
        // graphql query to get contribution data
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
        from.setDate(from.getDate() - 7);

        const variables = {
            username: GITHUB_USERNAME,
            from: from.toISOString(),
            to: to.toISOString(),
        };

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        if (!response.ok) {
            console.error(
                'GitHub API Error:',
                response.status,
                response.statusText,
            );
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL Errors:', data.errors);
            throw new Error('GraphQL query failed');
        }

        const contributionCalendar =
            data.data.user.contributionsCollection.contributionCalendar;

        // debug
        const lastWeek =
            contributionCalendar.weeks[contributionCalendar.weeks.length - 1];
        console.log('Last week data:', JSON.stringify(lastWeek));

        return json(
            {
                success: true,
                totalContributions: contributionCalendar.totalContributions,
                weeks: contributionCalendar.weeks,
            },
            {
                headers: {
                    // browser: 30minutes - cdn: 6hour
                    'Cache-Control':
                        'public, max-age=1800, s-maxage=21600, stale-while-revalidate=300',
                },
            },
        );
    } catch (error) {
        console.error('Error fetching GitHub contributions:', error);

        // Use fallback data on error
        const fallback = generateFallbackData();
        return json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'An unknown error occurred',
                fallback: true,
                totalContributions: fallback.totalContributions,
                weeks: fallback.weeks,
            },
            {
                status: 500, // Explicit error status
                headers: {
                    'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Still cache fallback to avoid repeated failures
                },
            },
        );
    }
}

// fallback data
function generateFallbackData() {
    const weeks: Week[] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let currentDate = new Date(startDate);

    while (currentDate <= today) {
        const week: Week = { contributionDays: [] };

        for (let i = 0; i < 7; i++) {
            if (currentDate <= today) {
                let contributionCount = 0;
                const dayOfWeek = currentDate.getDay();
                const random = Math.random();

                if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                    if (random < 0.7)
                        contributionCount = Math.floor(Math.random() * 8) + 1;
                } else {
                    if (random < 0.4)
                        contributionCount = Math.floor(Math.random() * 4) + 1;
                }

                if (random > 0.95)
                    contributionCount = Math.floor(Math.random() * 15) + 10;

                week.contributionDays.push({
                    date: currentDate.toISOString().split('T')[0],
                    contributionCount,
                    color: getContributionColor(contributionCount),
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (week.contributionDays.length > 0) {
            weeks.push(week);
        }
    }

    return {
        totalContributions: weeks.reduce(
            (total, week) =>
                total +
                week.contributionDays.reduce(
                    (weekTotal, day) => weekTotal + day.contributionCount,
                    0,
                ),
            0,
        ),
        weeks,
    };
}

function getContributionColor(count: number): string {
    if (count === 0) return '#ebedf0';
    if (count <= 3) return '#9be9a8';
    if (count <= 6) return '#40c463';
    if (count <= 9) return '#30a14e';
    return '#216e39';
}
