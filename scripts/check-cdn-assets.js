import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const URL_RE = /https:\/\/cdn\.jsdelivr\.net\/[^\s'"()<>]+/g;
const exts = /\.(svelte|ts|js|md|css|html|json)$/;

async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(path);
        else if (exts.test(entry.name)) yield path;
    }
}
const urls = new Set();
for await (const file of walk('src')) {
    for (const match of (await readFile(file, 'utf8')).matchAll(URL_RE)) {
        urls.add(match[0].replace(/[.,;]$/, ''));
    }
}

// Base/placeholder URLs like `.../images` or `.../three@` aren't real files.
const isFileUrl = (url) => /\.[a-z0-9]{2,5}$/i.test(url);
const targets = [...urls].filter(isFileUrl);

let failed = 0;
await Promise.all(
    targets.map(async (url) => {
        const res = await fetch(url, { method: 'HEAD' }).catch(() => null);
        if (!res?.ok) {
            failed++;
            console.error(`✗ ${res?.status ?? 'network error'} ${url}`);
        }
    }),
);

console.log(
    `checked ${targets.length} of ${urls.size} URL(s), ${failed} failed`,
);
if (failed) process.exit(1);
