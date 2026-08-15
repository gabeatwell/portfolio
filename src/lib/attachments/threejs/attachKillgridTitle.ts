import type { Attachment } from 'svelte/attachments';

export const attachKillgridTitle: Attachment = () => {
    const update = () => {
        const isLandscape = window.innerWidth > window.innerHeight;
        const body = document.body;
        const html = document.documentElement;
        const nav = document.querySelector('nav') as HTMLElement | null;
        const footer = document.querySelector('footer') as HTMLElement | null;

        // mobile portrait: hide nav/footer on title
        if (!isLandscape && window.innerWidth <= 768) {
            if (nav) nav.style.display = 'none';
            if (footer) footer.style.display = 'none';
        } else if (!isLandscape) {
            if (nav) nav.style.display = '';
            if (footer) footer.style.display = '';
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
        const footer = document.querySelector('footer') as HTMLElement | null;
        if (nav) nav.style.display = '';
        if (footer) footer.style.display = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
    };
};
