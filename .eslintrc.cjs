module.exports = {
    root: true,
    extends: ['eslint:recommended'],
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['**/*.svelte'],
            parser: 'svelte-eslint-parser',
            extends: [
                'plugin:svelte/recommended',
                'plugin:@typescript-eslint/recommended',
            ],
            parserOptions: {
                parser: {
                    ts: '@typescript-eslint/parser',
                    js: 'espree',
                },
                sourceType: 'module',
                ecmaVersion: 'latest',
                extraFileExtensions: ['.svelte'],
            },
            globals: {
                $state: 'readonly',
                $derived: 'readonly',
                $effect: 'readonly',
                $props: 'readonly',
                $bindable: 'readonly',
                $inspect: 'readonly',
                $host: 'readonly',
            },
            rules: {
                // core no-undef is not TS-aware and causes false positives
                'no-undef': 'off',
            },
        },
        {
            files: ['**/*.{ts,tsx}'],
            parser: '@typescript-eslint/parser',
            extends: ['plugin:@typescript-eslint/recommended'],
            rules: {
                'no-undef': 'off',
            },
        },
    ],
};
