import { browser } from '$app/env';

type Breakpoint = 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'reduced';

let breakpoint = $state<Breakpoint>('desktop');
let initialized = false;
let isStandalone = $state(false);
let isLandscape = $state(false);

export function getBreakpoints() {
    if (!initialized && browser) {
        const queries = {
            mobile: window.matchMedia('(max-width: 767px)'),
            tablet: window.matchMedia(
                '(min-width: 768px) and (max-width: 1023px)',
            ),
            laptop: window.matchMedia(
                '(min-width: 1024px) and (max-width: 1279px)',
            ),
            desktop: window.matchMedia('(min-width: 1280px)'),
            reduced: window.matchMedia('(prefers-reduced-motion: reduce)'),
            standalone: window.matchMedia('(display-mode: standalone)'),
            landscape: window.matchMedia('(orientation: landscape)'),
        } as const;

        const update = () => {
            isStandalone = queries.standalone.matches;
            isLandscape = queries.landscape.matches;

            if (queries.reduced.matches) breakpoint = 'reduced';
            else if (queries.mobile.matches) breakpoint = 'mobile';
            else if (queries.tablet.matches) breakpoint = 'tablet';
            else if (queries.laptop.matches) breakpoint = 'laptop';
            else breakpoint = 'desktop';
        };

        update();
        for (const query of Object.values(queries)) {
            query.addEventListener('change', update);
        }

        initialized = true;
    }

    return {
        get isMobile() {
            return breakpoint === 'mobile';
        },
        get isTablet() {
            return breakpoint === 'tablet';
        },
        get isLaptop() {
            return breakpoint === 'laptop';
        },
        get isDesktop() {
            return breakpoint === 'desktop';
        },
        get isReduced() {
            return breakpoint === 'reduced';
        },
        get isStandalone() {
            return isStandalone;
        },
        get isLandscape() {
            return isLandscape;
        },
        get value() {
            return breakpoint;
        },
    };
}
