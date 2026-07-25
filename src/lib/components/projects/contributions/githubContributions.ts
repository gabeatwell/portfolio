interface ContributionDay {
    date: string;
    contributionCount: number;
    color: string;
}

interface Week {
    contributionDays: ContributionDay[];
}

export const CELL_SIZE = 17;
export const CELL_GAP = 5;
export const DAYS_IN_WEEK = 7;
export const GRID_HEIGHT = DAYS_IN_WEEK * (CELL_SIZE + CELL_GAP) - CELL_GAP;
export const MONTH_LABEL_HEIGHT = 20;
export const DAY_LABEL_WIDTH = 50;
export const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
export const DAYS = ['Mon', 'Wed', 'Fri'];
export const DAY_INDICES = [1, 3, 5];
export const MOBILE_CELL_SIZE = 14.5;
export const MOBILE_CELL_GAP = 5;
export const MOBILE_GRID_HEIGHT =
    DAYS_IN_WEEK * (MOBILE_CELL_SIZE + MOBILE_CELL_GAP) - MOBILE_CELL_GAP;
export const MOBILE_MONTH_LABEL_HEIGHT = 16;
export const MOBILE_DAY_LABEL_WIDTH = 30;

export function getContributionColor(count: number): string {
    if (count === 0) return '#ebedf0';
    if (count <= 3) return '#9be9a8';
    if (count <= 6) return '#40c463';
    if (count <= 9) return '#30a14e';
    return '#216e39';
}

export function getContributionLevel(count: number): string {
    if (count === 0) return 'none';
    if (count <= 3) return 'low';
    if (count <= 6) return 'medium';
    if (count <= 9) return 'high';
    return 'very-high';
}

export function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function getContributionText(count: number): string {
    return count === 1 ? 'contribution' : 'contributions';
}

export function generateFallbackData() {
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
                    date: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
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

    const totalContributions = weeks.reduce(
        (total, week) =>
            total +
            week.contributionDays.reduce(
                (weekTotal, day) => weekTotal + day.contributionCount,
                0,
            ),
        0,
    );

    return { weeks, totalContributions };
}
