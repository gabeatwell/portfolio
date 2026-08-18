import { prerender } from '$app/server';
import * as v from 'valibot';
import { buildPost, type Post } from '$lib/data/blog/parseMD';

export const getPosts = prerender(async (): Promise<Post[]> => {
    const modules = import.meta.glob('/src/content/threejs/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
    });

    const posts: Post[] = Object.entries(modules)
        .map(([path, content]): Post | null => {
            const id = Number(path.match(/(\d+)\.md$/)?.[1]);
            if (isNaN(id)) return null;
            return buildPost(id, content as string);
        })
        .filter((p): p is Post => p !== null);

    return posts.sort((a, b) => a.id - b.id);
});

export const getPost = prerender(
    v.number(),
    async (id): Promise<Post | null> => {
        const modules = import.meta.glob('/src/content/threejs/*.md', {
            query: '?raw',
            import: 'default',
            eager: true,
        });

        const filePath = Object.keys(modules).find((p) =>
            p.endsWith(`/${id}.md`),
        );
        if (!filePath) return null;

        return buildPost(Number(id), modules[filePath] as string, false);
    },
);
