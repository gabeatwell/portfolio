import type { Attachment } from 'svelte/attachments';

export type ChromeOptions = {
    /** landscape && mobile breakpoints store */
    isLandscapeMobile: boolean;
    /** true = always hide footer (Cursor only) */
    hideFooterAlways?: boolean;
    /** hide nav/select/footer when landscape mobile (default true) */
    hideOnLandscapeMobile?: boolean;
    /** FPS/Shooter title: lock body scroll in landscape */
    lockBodyOnLandscape?: boolean;
    /** also toggle overflow on .hero-content (Hero only) */
    heroContent?: boolean;
    navSelector?: string; // default '.navigation'
};

export function attachMobileLandscape(opts: ChromeOptions): Attachment {
    const {
        isLandscapeMobile,
        hideFooterAlways = false,
        hideOnLandscapeMobile = true,
        lockBodyOnLandscape = false,
        heroContent = false,
        navSelector = '.navigation',
    } = opts;

    return () => {
        const nav = document.querySelector(navSelector) as HTMLElement | null;
        const footer = document.querySelector('footer') as HTMLElement | null;
        const select = document.querySelector('.select') as HTMLElement | null;
        const hero = heroContent
            ? (document.querySelector('.hero-content') as HTMLElement | null)
            : null;

        const hideChrome = hideOnLandscapeMobile && isLandscapeMobile;

        if (footer) {
            footer.style.display = hideFooterAlways || hideChrome ? 'none' : '';
        }
        if (nav) nav.style.display = hideChrome ? 'none' : '';
        if (select) select.style.display = hideChrome ? 'none' : '';
        if (hero) hero.style.overflowY = hideChrome ? 'auto' : '';

        if (lockBodyOnLandscape) {
            const isLandscape = window.innerWidth > window.innerHeight;
            const body = document.body;
            const html = document.documentElement;
            if (isLandscape) {
                body.style.overflow = 'hidden';
                body.style.width = '100vw';
                body.style.height = '100vh';
                html.style.overflow = 'hidden';
                html.style.width = '100vw';
                html.style.height = '100vh';
            }
        }

        return () => {
            if (footer) footer.style.display = '';
            if (nav) nav.style.display = '';
            if (select) select.style.display = '';
            if (hero) hero.style.overflowY = '';
            if (lockBodyOnLandscape) {
                document.body.style.overflow = '';
                document.body.style.width = '';
                document.body.style.height = '';
                document.documentElement.style.overflow = '';
                document.documentElement.style.width = '';
                document.documentElement.style.height = '';
            }
        };
    };
}
