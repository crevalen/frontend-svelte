import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q') || '';
    let posts = [];

    if (query) {
        posts = await db.post.findMany({
            where: {
                published: true,
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { tags: { some: { name: { contains: query, mode: 'insensitive' } } } }
                ]
            },
            include: {
                featuredImage: true,
                categories: { select: { slug: true, name: true }, take: 1 }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    return {
        query,
        posts
    };
};