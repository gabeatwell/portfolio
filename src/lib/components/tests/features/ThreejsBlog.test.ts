import { describe, it, expect } from 'vitest';
import {
    parseFrontmatter,
    extractTitle,
    extractSubtitle,
    extractImage,
    buildPost,
} from '$lib/data/blog/parseMD';

const samplePost = `---
title: My Three.js Post
subtitle: A cool subtitle
date: 2026-07-19
---
# My Three.js Post

This is the body content with an image ![alt](https://example.com/img.png).
`;

describe('buildPost', () => {
    it('builds a post from raw markdown', () => {
        const post = buildPost(1, samplePost);
        expect(post.id).toBe(1);
        expect(post.title).toBe('My Three.js Post');
        expect(post.subtitle).toBe('A cool subtitle');
        expect(post.date).toBe('2026-07-19');
        expect(post.image).toBe('https://example.com/img.png');
        expect(post.content).toContain('This is the body content');
    });

    it('truncates content to 200 chars with an ellipsis', () => {
        const prefix = '# T\n\n';
        const longBody = 'x'.repeat(500);
        const post = buildPost(1, prefix + longBody);

        // prefix (5 chars) + 195 x's = 200, then ellipsis
        expect(post.content).toBe(prefix + 'x'.repeat(195) + '…');
        expect(post.content.length).toBe(201);
    });

    it('does not truncate when truncate=false (single post view)', () => {
        const post = buildPost(1, '# T\n\n' + 'x'.repeat(500), false);
        expect(post.content.length).toBeGreaterThan(201);
    });

    it('falls back to extracting title from h1 when no frontmatter title', () => {
        const post = buildPost(1, '# Just an h1 title\n\nSome content.');
        expect(post.title).toBe('Just an h1 title');
    });

    it('falls back to a default title and date when absent', () => {
        const post = buildPost(7, '# Body only\n\nNo frontmatter here.');
        expect(post.title).toBe('Body only');
        expect(post.date).toBe('Post 7');
    });

    it('handles frontmatter keys with colons in values', () => {
        const post = buildPost(
            1,
            `---
title: My Blog: Part 1
date: 2026-01-01
---
# My Blog: Part 1
`,
        );
        expect(post.title).toBe('My Blog: Part 1');
    });
});

describe('parseFrontmatter', () => {
    it('parses frontmatter and content', () => {
        const { data, content } = parseFrontmatter(samplePost);
        expect(data.title).toBe('My Three.js Post');
        expect(content).toContain('# My Three.js Post');
    });

    it('returns full content when no frontmatter', () => {
        const md = '# Just a title\n\nBody text.';
        const { data, content } = parseFrontmatter(md);
        expect(data).toEqual({});
        expect(content).toBe(md);
    });
});

describe('extractTitle / extractSubtitle / extractImage', () => {
    it('extracts h1, h2, and first image', () => {
        expect(extractTitle('# Hello World')).toBe('Hello World');
        expect(extractSubtitle('## How to install')).toBe('How to install');
        expect(
            extractImage('Text ![alt](https://example.com/img.png) more'),
        ).toBe('https://example.com/img.png');
    });

    it('returns undefined when not found', () => {
        expect(extractTitle('## Subtitle only')).toBeUndefined();
        expect(extractImage('# No images here')).toBeUndefined();
    });
});
