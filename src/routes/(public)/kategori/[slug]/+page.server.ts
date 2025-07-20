import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    // Tambahkan header cache untuk ISR (cache 5 menit)
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=300' });
    const category = await db.category.findUnique({
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

    if (!category) {
        throw error(404, 'Kategori tidak ditemukan.');
    }

    return {
        category: category,
        posts: category.posts || []
    };
};