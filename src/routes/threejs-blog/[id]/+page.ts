import { getPost } from '../data.remote';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const post = await getPost(Number(params.id));
    return { post };
};
