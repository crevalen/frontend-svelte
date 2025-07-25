import { db } from '$lib/server/db';
import redis from '$lib/server/redis'; // <-- Impor Redis
import type { Actions, PageServerLoad } from './$types';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const posts = await db.post.findMany({
		where: {
			authorId: locals.user?.id
		},
		select: {
			id: true,
			title: true,
			slug: true,
			published: true,
			updatedAt: true,
			author: { select: { username: true } },
			categories: { select: { name: true } },
			tags: { select: { name: true } }
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return { posts };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string') {
			return fail(400, { message: 'ID tidak valid' });
		}

		const post = await db.post.findUnique({
			where: { id }
		});

		if (!post) {
			return fail(404, { message: 'Postingan tidak ditemukan' });
		}

		if (post.authorId !== locals.user?.id) {
			throw error(403, 'Anda tidak memiliki izin untuk menghapus postingan ini');
		}

		await db.post.delete({
			where: { id }
		});

		// --- INVALIDASI CACHE SAAT HAPUS ---
		const adminCacheKey = `post:${post.slug}`;
		const publicCacheKey = `post-public:${post.slug}`;

	await redis.del(
    adminCacheKey, 
    publicCacheKey, 
    'dashboard:stats', 
    'dashboard:popular_posts'
);
// --- SELESAI ---

		return { success: true };
	}
};