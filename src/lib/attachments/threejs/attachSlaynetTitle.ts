import type { Attachment } from 'svelte/attachments';

/** Hides nav/footer/select and locks body scroll in landscape. */
export const attachSlaynetTitle: Attachment = () => {
    const update = () => {
        const isLandscape = window.innerWidth > window.innerHeight;
        const nav = document.querySelector('nav') as HTMLElement | null;
        const select = document.querySelector('.select') as HTMLElement | null;
        const footer = document.querySelector('footer') as HTMLElement | null;
        const body = document.body;
        const html = document.documentElement;

        for (const el of [nav, select, footer]) {
            if (el) el.style.display = isLandscape ? 'none' : '';
        }

        if (isLandscape) {
            body.style.overflow = 'hidden';
            body.style.width = '100vw';
            body.style.height = '100vh';
            body.style.margin = '0';
            body.style.padding = '0';
            html.style.overflow = 'hidden';
            html.style.width = '100vw';
            html.style.height = '100vh';
            html.style.margin = '0';
            html.style.padding = '0';
        } else {
            body.style.overflow = '';
            body.style.width = '';
            body.style.height = '';
            body.style.margin = '';
            body.style.padding = '';
            html.style.overflow = '';
            html.style.width = '';
            html.style.height = '';
            html.style.margin = '';
            html.style.padding = '';
        }
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
        window.removeEventListener('resize', update);
        window.removeEventListener('orientationchange', update);

        const nav = document.querySelector('nav') as HTMLElement | null;
        const select = document.querySelector('.select') as HTMLElement | null;
        const footer = document.querySelector('footer') as HTMLElement | null;
        for (const el of [nav, select, footer]) {
            if (el) el.style.display = '';
        }
        document.body.style.overflow = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.margin = '';
        document.body.style.padding = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.width = '';
        document.documentElement.style.height = '';
        document.documentElement.style.margin = '';
        document.documentElement.style.padding = '';
    };
};
