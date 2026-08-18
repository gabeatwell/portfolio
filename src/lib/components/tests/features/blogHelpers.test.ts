import { describe, it, expect } from 'vitest';

function parseFrontmatter(file: string) {
    const match = file.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return { data: {}, content: file };

    const frontmatter = match[1];
    const content = match[2];
    const data: Record<string, string> = {};
    for (const line of frontmatter.split('\n')) {
        const [key, ...rest] = line.split(':');
        if (key) data[key.trim()] = rest.join(':').trim();
    }
    return { data, content };
}

function extractTitle(content: string): string | undefined {
    const match = content.match(/^#\s+(.+)$/m);
    return match?.[1];
}

function extractSubtitle(content: string): string | undefined {
    const match = content.match(/^##\s+(.+)$/m);
    return match?.[1];
}

function extractImage(content: string): string | undefined {
    const match = content.match(/!\[.*?\]\((.+?)\)/);
    return match?.[1];
}

describe('parseFrontmatter', () => {
    it('parses frontmatter and content', () => {
        const md = `---
title: Hello
subtitle: World
---
# Heading

Content here.`;

        const { data, content } = parseFrontmatter(md);
        expect(data.title).toBe('Hello');
        expect(data.subtitle).toBe('World');
        expect(content).toContain('# Heading');
    });

    it('returns full content when no frontmatter', () => {
        const md = '# Just a title\n\nBody text.';
        const { data, content } = parseFrontmatter(md);
        expect(data).toEqual({});
        expect(content).toBe(md);
    });

    it('handles keys with colons in values', () => {
        const md = `---
title: My Blog: Part 1
---
Content.`;
        const { data } = parseFrontmatter(md);
        expect(data.title).toBe('My Blog: Part 1');
    });

    it('handles missing content after frontmatter', () => {
        const md = `---
title: Empty
---
`;
        const { data, content } = parseFrontmatter(md);
        expect(data.title).toBe('Empty');
        expect(content).toBe('');
    });
});

describe('extractTitle', () => {
    it('extracts h1 from markdown', () => {
        expect(extractTitle('# Hello World')).toBe('Hello World');
    });

    it('returns undefined when no h1', () => {
        expect(extractTitle('## Subtitle only')).toBeUndefined();
    });
});

describe('extractSubtitle', () => {
    it('extracts h2 from markdown', () => {
        expect(extractSubtitle('## How to install')).toBe('How to install');
    });
});

describe('extractImage', () => {
    it('extracts first image from markdown', () => {
        const md = 'Text ![alt](https://example.com/image.png) more text';
        expect(extractImage(md)).toBe('https://example.com/image.png');
    });

    it('returns undefined when no image', () => {
        expect(extractImage('# No images here')).toBeUndefined();
    });
});
