import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=3600' });

    const author = await db.user.findUnique({
        where: { username: params.username },
        include: {
            posts: {
                where: { published: true },
                include: {
                    featuredImage: true,
                    categories: { take: 1, select: { name: true, slug: true } },
                    // --- PERBAIKAN DI SINI: Sertakan data penulis ---
                    author: {
                        select: {
                            displayName: true,
                            username: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!author) {
        throw error(404, 'Penulis tidak ditemukan.');
    }

    const { passwordHash, ...safeAuthor } = author;

    return {
        author: safeAuthor,
        posts: author.posts
    };
};