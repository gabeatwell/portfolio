declare module '*.md' {
    const component: any;
    export default component;
}

declare module '$env/static/private' {
    export const GITHUB_TOKEN: string;
    export const GITHUB_USERNAME: string;
}

declare module '$env/dynamic/private' {
    export const env: Record<string, string | undefined>;
}
