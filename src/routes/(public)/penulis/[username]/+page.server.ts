import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    // Terapkan ISR untuk cache selama 1 jam
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=3600' });

    const author = await db.user.findUnique({
        where: { username: params.username },
        include: {
            posts: {
                where: { published: true },
                include: {
                    featuredImage: true,
                    categories: { take: 1, select: { name: true, slug: true } }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!author) {
        throw error(404, 'Penulis tidak ditemukan.');
    }

    // Hapus password hash sebelum mengirim data ke frontend
    const { passwordHash, ...safeAuthor } = author;

    return {
        author: safeAuthor,
        posts: author.posts
    };
};