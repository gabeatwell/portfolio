import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import { defineConfig } from 'vite';

const mdsvexOptions = {
    extensions: ['.md', '.svx'],
};

export default defineConfig({
    plugins: [
        sveltekit({
            adapter: adapter({
                routes: {
                    include: ['/threejs-blog/three-components'],
                    exclude: [
                        '/_app/*',
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
            // svelte preprocess config
            extensions: ['.svelte', '.md', '.svx'],
            preprocess: [mdsvex(mdsvexOptions)],
            // vite-plugin-svelte options
            vitePlugin: {
                inspector: {
                    toggleButtonPos: 'bottom-left',
                    toggleKeyCombo: 'alt-x',
                    showToggleButton: 'always',
                },
            },
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
        https: false,
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
                            test: /[\\/]node_modules[\\/](svelte|@sveltejs)[\\/]/,
                            name: 'svelte',
                        },
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
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest-setup.ts'],
        deps: {
            inline: ['three'],
        },
    },
});
