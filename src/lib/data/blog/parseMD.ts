export interface Post {
    id: number;
    title: string;
    subtitle?: string;
    image?: string;
    date: string;
    content: string;
}

export function parseFrontmatter(file: string) {
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

export function extractTitle(content: string): string | undefined {
    const match = content.match(/^#\s+(.+)$/m);
    return match?.[1];
}

export function extractSubtitle(content: string): string | undefined {
    const match = content.match(/^##\s+(.+)$/m);
    return match?.[1];
}

export function extractImage(content: string): string | undefined {
    const match = content.match(/!\[.*?\]\((.+?)\)/);
    return match?.[1];
}

export function buildPost(
    id: number,
    rawContent: string,
    truncate = true,
): Post {
    const { data, content } = parseFrontmatter(rawContent);
    const title = data.title ?? extractTitle(content) ?? `Post ${id}`;
    const subtitle = data.subtitle ?? extractSubtitle(content) ?? '';
    const image = data.image ?? extractImage(content);
    const date = data.date ?? `Post ${id}`;
    return {
        id,
        title,
        subtitle,
        image,
        date,
        content: truncate ? content.slice(0, 200) + '…' : content,
    };
}
