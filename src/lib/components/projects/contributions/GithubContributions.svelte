<script lang="ts">
    import {
        type ContributionDay,
        type ContributionsData,
        type MobileTooltip,
        getCurrentDimensions,
        getMonthPositions,
        getTotalWidth,
        DAYS,
        DAY_INDICES,
        getContributionLevel,
        formatDate,
        getContributionText,
        clampTooltipPosition,
        useResizeObserver,
        useClickOutsideTooltip,
        useScrollReset,
        useTooltipViewportClamp,
    } from './contributions.svelte';

    let { contributions = null }: { contributions?: ContributionsData | null } =
        $props();
    let totalContributions = $derived(contributions?.totalContributions || 0);
    let weeks = $derived(contributions?.weeks ?? []);
    let yearRange = $derived.by(() => {
        if (weeks.length === 0) return '';
        const firstDate = weeks[0]?.contributionDays[0]?.date;
        const lastWeek = weeks[weeks.length - 1];
        const lastDate =
            lastWeek?.contributionDays[lastWeek.contributionDays.length - 1]
                ?.date;
        if (!firstDate || !lastDate) return '';
        const startYear = firstDate.split('-')[0];
        const endYear = lastDate.split('-')[0];
        return startYear === endYear ? startYear : `${startYear}-${endYear}`;
    });

    let isSmallContainer = $state(false);
    let containerEl = $state<HTMLElement | null>(null);
    let wrapperEl = $state<HTMLElement | null>(null);
    let calendarEl = $state<HTMLElement | null>(null);
    let mobileTooltip = $state<MobileTooltip>({
        visible: false,
        x: 0,
        y: 0,
        content: '',
        date: '',
    });
    let announcement = $state('');

    let dimensions = $derived(getCurrentDimensions(isSmallContainer));
    let monthPositions = $derived(getMonthPositions(weeks, isSmallContainer));
    let totalWidth = $derived(getTotalWidth(weeks, isSmallContainer));

    function handleDayTouch(event: Event, day: ContributionDay) {
        announcement = `${day.contributionCount} ${getContributionText(day.contributionCount)} on ${formatDate(day.date)}`;

        event.preventDefault();
        event.stopPropagation();

        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const containerRect = containerEl!.getBoundingClientRect();
        const calRect = calendarEl!.getBoundingClientRect();

        const x = rect.left + rect.width / 2 - calRect.left;
        const y = rect.bottom - calRect.top + 8;
        const pos = clampTooltipPosition(x, y, calRect.width);

        mobileTooltip = {
            visible: true,
            ...pos,
            content: `${day.contributionCount} ${getContributionText(day.contributionCount)}`,
            date: formatDate(day.date),
        };

        setTimeout(() => {
            if (mobileTooltip.visible) {
                mobileTooltip = { ...mobileTooltip, visible: false };
            }
        }, 3000);
    }

    function handleDayKeydown(
        event: KeyboardEvent,
        day: ContributionDay,
        weekIndex: number,
        dayIndex: number,
    ) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleDayTouch(event, day);
            return;
        }

        if (
            !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
                event.key,
            )
        )
            return;
        event.preventDefault();

        const moves: Record<string, [number, number]> = {
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
        };
        const [dw, dd] = moves[event.key];
        const maxWeek = weeks.length - 1;
        const newWeek = Math.max(0, Math.min(maxWeek, weekIndex + dw));
        const newDay = Math.max(0, Math.min(6, dayIndex + dd));

        const el = document.querySelector(
            `[data-week="${newWeek}"][data-day="${newDay}"]`,
        ) as HTMLElement;
        el?.focus();
    }

    const dayTooltip = (day: ContributionDay) =>
        `${day.contributionCount} ${getContributionText(day.contributionCount)} on ${formatDate(day.date)}`;

    useResizeObserver(
        () => containerEl,
        (v) => (isSmallContainer = v),
    );

    useClickOutsideTooltip(
        () => isSmallContainer,
        () => mobileTooltip.visible,
        () => (mobileTooltip = { ...mobileTooltip, visible: false }),
    );

    useScrollReset(
        () => isSmallContainer,
        () => wrapperEl,
    );

    useTooltipViewportClamp(
        () => calendarEl,
        () => mobileTooltip,
        (x, y) => (mobileTooltip = { ...mobileTooltip, x, y }),
    );
</script>

<section
    class="github-contributions"
    aria-label="GitHub Contributions Calendar"
    bind:this={containerEl}
>
    <div class="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
    </div>

    <header class="contributions-header">
        <h2>GitHub Contributions</h2>
        <h3>{yearRange}</h3>

        <div class="visually-hidden">
            Navigate through the contribution calendar using tab to move through
            days. Use arrow keys for more precise navigation. Press Enter or
            Space to get detailed information about a specific day.
        </div>

        <p class="total-contributions">
            {totalContributions}
            {getContributionText(totalContributions)} this year
        </p>
    </header>

    {#if weeks.length > 0}
        <div class="calendar-container" bind:this={calendarEl}>
            {#if mobileTooltip.visible && isSmallContainer}
                <div
                    class="mobile-tooltip"
                    style="left: {mobileTooltip.x}px; top: {mobileTooltip.y}px;"
                    role="tooltip"
                    aria-live="polite"
                    id="mobile-tooltip"
                >
                    <div class="tooltip-content">
                        {mobileTooltip.content}
                    </div>
                    <div class="tooltip-date">{mobileTooltip.date}</div>
                </div>
            {/if}

            <div class="calendar-svg-wrapper" bind:this={wrapperEl}>
                <svg
                    width={totalWidth}
                    height={dimensions.monthLabelHeight + dimensions.gridHeight}
                    class="contributions-svg"
                    role="img"
                    aria-labelledby="contributions-title"
                    aria-describedby="contributions-desc"
                >
                    <title id="contributions-title"
                        >GitHub Contributions Calendar</title
                    >
                    <desc id="contributions-desc">
                        A calendar showing daily GitHub contributions over the
                        past year. Each square represents a day, with darker
                        colors indicating more contributions. Navigate with tab
                        and enter keys to explore individual days.
                    </desc>

                    <!-- Month labels -->
                    <g role="group" aria-label="Month labels">
                        {#each monthPositions as month}
                            <text
                                x={month.x}
                                y={isSmallContainer ? 12 : 15}
                                class="month-label"
                                text-anchor="start"
                            >
                                {month.name}
                            </text>
                        {/each}
                    </g>

                    <!-- Day labels -->
                    <g role="group" aria-label="Day labels">
                        {#each DAYS as day, i}
                            <text
                                x={dimensions.dayLabelWidth - 5}
                                y={dimensions.monthLabelHeight +
                                    DAY_INDICES[i] *
                                        (dimensions.cellSize +
                                            dimensions.cellGap) +
                                    dimensions.cellSize / 2 +
                                    4}
                                class="day-label"
                                text-anchor="end"
                            >
                                {day}
                            </text>
                        {/each}
                    </g>

                    <!-- Contribution grid -->
                    <g role="group" aria-label="Daily contributions grid">
                        {#each weeks as week, weekIndex}
                            {#each week.contributionDays as day, dayIndex}
                                <rect
                                    x={dimensions.dayLabelWidth +
                                        weekIndex *
                                            (dimensions.cellSize +
                                                dimensions.cellGap)}
                                    y={dimensions.monthLabelHeight +
                                        dayIndex *
                                            (dimensions.cellSize +
                                                dimensions.cellGap)}
                                    width={dimensions.cellSize}
                                    height={dimensions.cellSize}
                                    rx={isSmallContainer ? '1' : '2'}
                                    class="contribution-day {getContributionLevel(
                                        day.contributionCount,
                                    )}"
                                    data-count={day.contributionCount}
                                    data-date={day.date}
                                    data-week={weekIndex}
                                    data-day={dayIndex}
                                    onclick={(e) => handleDayTouch(e, day)}
                                    onpointerdown={(e) =>
                                        handleDayTouch(e, day)}
                                    onkeydown={(e) =>
                                        handleDayKeydown(
                                            e,
                                            day,
                                            weekIndex,
                                            dayIndex,
                                        )}
                                    role="button"
                                    tabindex="0"
                                    aria-label="{day.contributionCount} {getContributionText(
                                        day.contributionCount,
                                    )} on {formatDate(day.date)}"
                                    aria-describedby="legend-desc"
                                >
                                    <title>{dayTooltip(day)}</title>
                                </rect>
                            {/each}
                        {/each}
                    </g>
                </svg>
            </div>

            <div
                class="legend"
                role="img"
                aria-labelledby="legend-title"
                aria-describedby="legend-desc"
            >
                <div id="legend-title" class="visually-hidden">
                    Contribution levels legend
                </div>
                <div id="legend-desc" class="visually-hidden">
                    Legend showing contribution intensity levels from none to
                    very high, represented by color intensity from light to dark
                    green.
                </div>
                <span class="legend-text" aria-hidden="true">Less</span>
                <div
                    class="legend-squares"
                    role="group"
                    aria-label="Contribution level indicators"
                >
                    <div
                        class="legend-square none"
                        role="img"
                        aria-label="No contributions level"
                        title="No contributions"
                    ></div>
                    <div
                        class="legend-square low"
                        role="img"
                        aria-label="Low contributions level: 1-3"
                        title="1-3 contributions"
                    ></div>
                    <div
                        class="legend-square medium"
                        role="img"
                        aria-label="Medium contributions level: 4-6"
                        title="4-6 contributions"
                    ></div>
                    <div
                        class="legend-square high"
                        role="img"
                        aria-label="High contributions level: 7-9"
                        title="7-9 contributions"
                    ></div>
                    <div
                        class="legend-square very-high"
                        role="img"
                        aria-label="Very high contributions level: 10+"
                        title="10+ contributions"
                    ></div>
                </div>
                <span class="legend-text" aria-hidden="true">More</span>
            </div>
        </div>
    {:else}
        <p>No contributions available.</p>
    {/if}
</section>

<style>
    .github-contributions {
        max-inline-size: 900px;
        margin: 0;
        margin-inline: auto;
        padding: 2rem 1rem;
        font-family: var(--bronova);
        display: flex;
        flex-direction: column;
        align-items: center;

        container-type: inline-size;
        container-name: github-contributions;

        & .contributions-header {
            margin-bottom: 2rem;

            & h2 {
                font-family: var(--bronova-bold);
                font-size: clamp(var(--sm), 2vw, var(--h4));
                font-weight: 700;
                color: var(--clr-light-500);
                margin-bottom: -0.2em;
                text-transform: lowercase;
                letter-spacing: 0.5px;
            }

            & h3 {
                font-family: var(--bronova);
                font-size: clamp(var(--sm), 1.25vw, var(--h5));
                font-weight: 600;
                color: var(--clr-gray-600);
                margin-bottom: 0.5rem;
                text-transform: lowercase;
                letter-spacing: 0.5px;
            }
        }

        & .total-contributions {
            font-size: clamp(var(--xs), 1.25vw, var(--sm));
            color: var(--clr-gray-700);
            opacity: 0.7;
            margin: 0;
            font-weight: 400;

            &.loading {
                opacity: 0.5;
            }

            &.error {
                color: #ff6b6b;
                opacity: 0.8;
            }
        }

        & .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
            width: 100%;
        }

        & .calendar-container {
            min-width: 50vw;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            border-radius: 8px;
            position: relative;

            & .mobile-tooltip {
                position: absolute;
                background: var(--clr-light-500);
                color: var(--clr-bg);
                padding: 0.5rem 0.75rem;
                border-radius: 6px;
                font-size: 0.75rem;
                font-family: var(--bronova);
                pointer-events: none;
                z-index: 1000;
                transform: translateX(-50%);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: tooltipFadeIn 0.2s ease-out;

                & .tooltip-content {
                    font-weight: 600;
                    margin-bottom: 0.125rem;
                }

                & .tooltip-date {
                    font-size: 0.65rem;
                    opacity: 0.9;
                    font-weight: 400;
                }
            }

            @container github-contributions (width <= 767px) {
                padding: 1rem;
                gap: 0.75rem;
            }

            @container github-contributions (width <= 500px) {
                min-width: 99%;
                padding: 0.5rem;
            }

            & .calendar-svg-wrapper {
                overflow-x: auto;
                overflow-y: visible;
                width: 100%;
                display: flex;
                justify-content: flex-start;
                scroll-behavior: smooth;

                &::-webkit-scrollbar {
                    height: 6px;
                }

                &::-webkit-scrollbar-track {
                    background: transparent;
                }

                &::-webkit-scrollbar-thumb {
                    background: var(--clr-light-500);
                    opacity: 0.3;
                    border-radius: 3px;
                }

                & .contributions-svg {
                    min-width: max-content;
                    font-family: var(--bronova);
                    max-inline-size: 100%;
                    height: auto;

                    @container github-contributions (width <= 800px) {
                        transform: scale(0.9);
                        transform-origin: center;
                    }

                    @container github-contributions (width <= 700px) {
                        transform: scale(0.8);
                        transform-origin: center;
                    }

                    @container github-contributions (width <= 600px) {
                        transform: scale(0.7);
                        transform-origin: center;
                    }

                    @container github-contributions (width <= 500px) {
                        transform: scale(0.6);
                        transform-origin: center;
                    }

                    @container github-contributions (width <= 400px) {
                        transform: scale(0.5);
                        transform-origin: center;
                    }

                    @container github-contributions (width <= 320px) {
                        transform: scale(0.45);
                        transform-origin: center;
                    }

                    & .month-label {
                        font-size: 1.1rem;
                        fill: var(--clr-light-500);
                        opacity: 0.7;
                        font-weight: 400;
                    }

                    & .day-label {
                        font-size: 0.9rem;
                        fill: var(--clr-light-500);
                        opacity: 0.7;
                        font-weight: 400;
                    }

                    & .contribution-day {
                        transition: all 0.2s ease;
                        cursor: pointer;

                        &:hover {
                            stroke: var(--clr-light-500);
                            stroke-width: 1px;
                            opacity: 0.8;
                        }

                        @container github-contributions (width <= 600px) {
                            & title {
                                display: none;
                            }
                        }

                        &.none {
                            fill: var(--clr-gray-700);
                        }

                        &.low {
                            fill: #0e4429;
                        }

                        &.medium {
                            fill: #006d32;
                        }

                        &.high {
                            fill: #26a641;
                        }

                        &.very-high {
                            fill: #39d353;
                        }

                        &:focus-visible {
                            outline: 3px solid var(--clr-light-500);
                            outline-offset: 2px;
                            stroke: var(--clr-light-500);
                            stroke-width: 2px;
                        }
                    }
                }
            }

            & .legend {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 0.5rem;
                font-size: clamp(var(--xs), 2vw, var(--sm));
                color: var(--clr-light-500);
                opacity: 0.6;
                margin-top: 1rem;
                font-weight: 400;

                & .legend-squares {
                    display: flex;
                    gap: 2px;
                    margin: 0 0.5rem;

                    & .legend-square {
                        width: 0.75rem;
                        height: 0.75rem;
                        border-radius: 2px;
                        border: none;

                        &.none {
                            background-color: var(--clr-gray-700, #ebedf0);
                        }

                        &.low {
                            background-color: #0e4429;
                        }

                        &.medium {
                            background-color: #006d32;
                        }

                        &.high {
                            background-color: #26a641;
                        }

                        &.very-high {
                            background-color: #39d353;
                        }
                    }
                }
            }
        }
    }

    :global(body.dark) .contribution-day.none {
        fill: var(--clr-dark-500);
    }

    :global(body.dark) .legend-square.none {
        background-color: var(--clr-dark-500);
    }

    @container github-contributions (width >= 600px) {
        .contribution-day:hover {
            stroke-width: 2px;
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes tooltipFadeIn {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
        }
        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @container github-contributions (width <= 600px) {
        .github-contributions {
            padding: 1rem 0.5rem;

            & .calendar-container {
                & .calendar-svg-wrapper {
                    & .contributions-svg {
                        transform: none !important;

                        & .month-label {
                            font-size: 1rem;
                        }

                        & .day-label {
                            font-size: 0.8rem;
                        }

                        & .contribution-day {
                            &:hover {
                                stroke-width: 1px;
                            }
                        }
                    }
                }

                & .legend {
                    font-size: 0.75rem;
                    gap: 0.375rem;
                    margin-top: 0.75rem;

                    & .legend-squares {
                        gap: 2px;

                        & .legend-square {
                            width: 0.65rem;
                            height: 0.65rem;
                            border-radius: 1px;
                        }
                    }
                }
            }
        }
    }

    @container github-contributions (width <= 400px) {
        .github-contributions {
            & .calendar-container {
                min-width: 100vw;

                & .legend {
                    font-size: 0.65rem;

                    & .legend-squares {
                        & .legend-square {
                            width: 0.6rem;
                            height: 0.6rem;
                        }
                    }
                }

                & .calendar-svg-wrapper {
                    & .contributions-svg {
                        & .month-label {
                            font-size: 0.9rem;
                        }

                        & .day-label {
                            font-size: 0.7rem;
                        }
                    }
                }
            }
        }
    }
</style>
