import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
    const tag = await db.tag.findUnique({
        where: { slug: params.slug },
        include: {
            posts: {
                where: { published: true },
                include: {
                    featuredImage: true,
                    categories: { select: { slug: true, name: true }, take: 1 }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!tag) {
        throw error(404, 'Tag tidak ditemukan.');
    }

    return {
        tag: tag,
        posts: tag.posts || []
    };
};