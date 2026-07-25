// Ambient declaration for private env vars used during prerendering.
// This supplements .svelte-kit/ambient.d.ts which is occasionally
// missed by the TS language server due to tsconfig excludes.

declare module '$env/static/private' {
    export const GITHUB_TOKEN: string;
    export const GITHUB_USERNAME: string;
}
