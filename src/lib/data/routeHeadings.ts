const headings: Record<string, string> = {
    '/': 'Home',
    '/about': 'About',
    '/projects': 'Projects',
    '/photos': 'Photos',
    '/experiments': 'Experiments',
    '/learn': 'Learn',
    '/learn/sveltekit': 'SvelteKit',
    '/learn/greensock': 'GreenSock',
    '/learn/advanced': 'Advanced',
    '/learn/advanced/drawing-app': 'Drawing app',
    '/threejs-blog': 'Three.js blog',
    '/threejs-blog/three-components': 'Three.js components',
    '/go-blog': 'Go blog',
    '/contact': 'Contact',
    '/contact/hire': 'Hire me',
    '/contact/success': 'Message sent',
    '/404': 'Page not found',
};

const patterns: [RegExp, string][] = [
    [/^\/threejs-blog\/[^/]+$/, 'Three.js example'],
    [/^\/go-blog\/[^/]+$/, 'Go article'],
];

export function headingFor(pathname: string): string | undefined {
    const path = pathname === '/' ? pathname : pathname.replace(/\/$/, '');
    const found = headings[path] ?? patterns.find(([re]) => re.test(path))?.[1];
    if (import.meta.env.DEV && !found) {
        console.warn(`[routeHeadings] no heading for "${path}"`);
    }
    return found;
}
