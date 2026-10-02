import { getPost } from '../data.remote';
import type { Post } from '#lib/data/blog/parseMD.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({
    params,
}): Promise<{ post: Post | null }> => {
    const post = await getPost(Number(params.id));
    return { post };
};
