declare module '*.md' {
    const component: any;
    export default component;
}

declare namespace App {
    interface Platform {
        env: {
            GITHUB_TOKEN?: string;
            GITHUB_USERNAME?: string;
        };
    }
}
