import { copyFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(
    root,
    '.svelte-kit',
    'output',
    'prerendered',
    'pages',
    '404.html',
);
const dest = resolve(root, '.svelte-kit', 'cloudflare', '404.html');

if (existsSync(src)) {
    copyFileSync(src, dest);
    console.log('✓ Copied prerendered 404.html → cloudflare output');
} else {
    console.warn('⚠ Prerendered 404.html not found at', src);
}
