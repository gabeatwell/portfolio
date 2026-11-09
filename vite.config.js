import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vitest/config';

const mdsvexOptions = { extensions: ['.md', '.svx'] };

const DEV_SERVICE_WORKER = `
const FLAG_CACHE = 'dev-sw-reset';
const FLAG_URL = '/__reset__';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const flags = await caches.open(FLAG_CACHE);
        const alreadyReset = await flags.match(FLAG_URL);

        const keys = await caches.keys();
        await Promise.all(
            keys.filter((key) => key !== FLAG_CACHE).map((key) => caches.delete(key)),
        );

        await self.registration.unregister();

        if (!alreadyReset) {
            await flags.put(FLAG_URL, new Response('1'));
            const clients = await self.clients.matchAll({ type: 'window' });
            await Promise.all(
                clients.map((client) => client.navigate(client.url).catch(() => {})),
            );
        }
    })());
});
`;

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 * @param {(err?: unknown) => void} next
 */
function serveDevServiceWorker(req, res, next) {
    if (req.url?.split('?')[0] !== '/service-worker.js') {
        next();
        return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(DEV_SERVICE_WORKER);
}

/**
 * @param {import('vite').ViteDevServer} server
 */
function configureDevServiceWorker(server) {
    server.middlewares.use(serveDevServiceWorker);
}

/**
 * @returns {import('vite').Plugin}
 */
function devServiceWorker() {
    return {
        name: 'dev-self-destruct-service-worker',
        apply: 'serve',
        configureServer: configureDevServiceWorker,
    };
}

export default defineConfig({
    plugins: [
        devServiceWorker(),
        sveltekit({
            adapter: adapter({
                routes: {
                    include: ['/*'],
                    exclude: [
                        '/_app/immutable/*',
                        '/_app/version.json',
                        '/.well-known/*',
                        '/favicon.*',
                        '/fonts/*',
                        '/manifest.json',
                        '/robots.txt',
                        '/service-worker.js',
                        '/sitemap.xml',
                        '/threejayess/*',
                    ],
                },
            }),
            compilerOptions: {
                experimental: {
                    async: true,
                },
            },
            experimental: {
                remoteFunctions: true,
            },
            inspector: {
                toggleButtonPos: 'bottom-left',
                toggleKeyCombo: 'alt-x',
                showToggleButton: 'always',
            },
            // svelte preprocess config
            extensions: ['.svelte', '.md', '.svx'],
            // mdsvex@0.11 declares `filename: string` (required) while Svelte
            // passes `filename?: string`, so its return type is incompatible.
            preprocess: [mdsvex(mdsvexOptions)],
            // vite-plugin-svelte options

            // kit specific
            prerender: {
                handleHttpError: ({ status, path, referrer, message }) => {
                    if (status === 404) {
                        console.warn(
                            `Prerendering warning: ${status} ${path} (linked from ${referrer})`,
                        );
                        return;
                    }
                    throw new Error(message);
                },
                handleUnseenRoutes: 'warn',
                concurrency: 10,
            },
        }),
        svelteTesting(),
    ],
    server: {
        port: 5173,
        host: 'localhost',
        open: true,
    },
    build: {
        sourcemap: true,
        chunkSizeWarningLimit: 750,
        rolldownOptions: {
            treeshake: true,
            output: {
                codeSplitting: {
                    groups: [
                        {
                            test: /[\\/]node_modules[\\/]three[\\/]/,
                            name: 'three',
                        },
                        {
                            test: /[\\/]node_modules[\\/]gsap[\\/]/,
                            name: 'gsap',
                        },
                    ],
                },
            },
        },
        minify: 'terser',
        cssCodeSplit: true,
        cssMinify: 'lightningcss',
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest-setup.ts'],
        server: {
            deps: {
                inline: ['three'],
            },
        },
    },
});
