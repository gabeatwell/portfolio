import { prerender } from '$app/server';
import * as v from 'valibot';

interface Post {
    id: number;
    title: string;
    subtitle?: string;
    image?: string;
    date: string;
    content: string;
}

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

export const getPosts = prerender(async (): Promise<Post[]> => {
    const modules = import.meta.glob('/src/content/go/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
    });

    const posts: Post[] = Object.entries(modules)
        .map(([path, content]): Post | null => {
            const id = Number(path.match(/(\d+)\.md$/)?.[1]);
            if (isNaN(id)) return null;

            const rawContent = content as string;
            const { data, content: body } = parseFrontmatter(rawContent);
            const title = data.title ?? extractTitle(body) ?? `Post ${id}`;
            const subtitle = data.subtitle ?? extractSubtitle(body) ?? '';
            const image = data.image ?? extractImage(body);
            const date = data.date ?? `Post ${id}`;

            return {
                id,
                title,
                subtitle,
                image,
                date,
                content: body.slice(0, 200) + '…',
            };
        })
        .filter((p): p is Post => p !== null);

    return posts.sort((a, b) => a.id - b.id);
});

export const getPost = prerender(
    v.number(),
    async (id): Promise<Post | null> => {
        const modules = import.meta.glob('/src/content/go/*.md', {
            query: '?raw',
            import: 'default',
            eager: true,
        });

        const filePath = Object.keys(modules).find((p) =>
            p.endsWith(`/${id}.md`),
        );
        if (!filePath) return null;

        const rawContent = modules[filePath] as string;
        const { data, content } = parseFrontmatter(rawContent);
        const title = data.title ?? extractTitle(content) ?? `Post ${id}`;
        const date = data.date ?? `Post ${id}`;

        return { id: Number(id), title, date, content };
    },
);
