import { getPost } from '../blog.remote';

export async function load({ params }) {
    const post = await getPost(Number(params.id));
    return { post };
}
