// rewrite the CDN ref in every source file - Walks every .svelte/.ts/.js/.md/.css/.html/.json file under src/ and replaces the ref part of cdn.jsdelivr.net/gh/gabeatwell/portfolio-assets@<ref>/… with the argument you pass. That’s the bulk @main → @assets-1 migration you ran.. Only touches src/ — not static/, docs/, or the scripts themselves

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ref = process.argv[2];
if (!ref) throw new Error('usage: node scripts/pin-assets.js <sha-or-tag>');

const roots = ['src'];
const exts = /\.(svelte|ts|js|md|css|html|json)$/;

async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(path);
        else if (exts.test(entry.name)) yield path;
    }
}

let changed = 0;
for (const root of roots) {
    for await (const file of walk(root)) {
        const source = await readFile(file, 'utf8');
        const next = source.replace(
            /(portfolio-assets@)[\w.-]+(?=\/)/g,
            `$1${ref}`,
        );
        if (next !== source) {
            await writeFile(file, next);
            changed++;
        }
    }
}
console.log(`pinned ${changed} file(s) to @${ref}`);
