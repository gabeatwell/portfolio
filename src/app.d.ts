declare module '*.md' {
    const component: any;
    export default component;
}

declare module '$env/dynamic/private' {
    export const env: Record<string, string | undefined>;
}

declare namespace App {
    interface Platform {
        env: {
            GITHUB_TOKEN?: string;
            GITHUB_USERNAME?: string;
        };
    }
}
