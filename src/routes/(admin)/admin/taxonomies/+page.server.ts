import { db } from '$lib/server/db';
import redis from '$lib/server/redis';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const CATEGORIES_CACHE_KEY = 'taxonomies:categories';
const TAGS_CACHE_KEY = 'taxonomies:tags';
const STATS_CACHE_KEY = 'dashboard:stats';
const CACHE_TTL_SECONDS = 3600; 

export const load: PageServerLoad = async () => {
	const [cachedCategories, cachedTags] = await redis.mget(CATEGORIES_CACHE_KEY, TAGS_CACHE_KEY);

	const categories = typeof cachedCategories === 'string'
  ? JSON.parse(cachedCategories)
  : await db.category.findMany({ orderBy: { name: 'asc' } });
	const tags = typeof cachedTags === 'string'
  ? JSON.parse(cachedTags)
  : await db.tag.findMany({ orderBy: { name: 'asc' } });

	// Menggunakan sintaks yang benar untuk redis.set dengan opsi expiration
	if (!cachedCategories) {
		await redis.set(CATEGORIES_CACHE_KEY, JSON.stringify(categories), { ex: CACHE_TTL_SECONDS });
	}
	if (!cachedTags) {
		await redis.set(TAGS_CACHE_KEY, JSON.stringify(tags), { ex: CACHE_TTL_SECONDS });
	}

	return { categories, tags };
};

export const actions: Actions = {
	createCategory: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		if (!name || name.length < 2) {
			return fail(400, { error: 'Nama kategori tidak valid.' });
		}
		const slug = name.toLowerCase().replace(/\s+/g, '-');

		try {
			await db.category.create({ data: { name, slug } });
			await redis.del(CATEGORIES_CACHE_KEY, STATS_CACHE_KEY);
		} catch {
			return fail(500, { error: 'Gagal membuat kategori, mungkin sudah ada.' });
		}
		return { success: true };
	},
	createTag: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		if (!name || name.length < 2) {
			return fail(400, { error: 'Nama tag tidak valid.' });
		}
		const slug = name.toLowerCase().replace(/\s+/g, '-');

		try {
			await db.tag.create({ data: { name, slug } });
			await redis.del(TAGS_CACHE_KEY, STATS_CACHE_KEY);
		} catch {
			return fail(500, { error: 'Gagal membuat tag, mungkin sudah ada.' });
		}
		return { success: true };
	},
	deleteCategory: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		try {
			await db.category.delete({ where: { id } });
			await redis.del(CATEGORIES_CACHE_KEY, STATS_CACHE_KEY);
		} catch {
			return fail(500, { message: 'Gagal menghapus kategori.' });
		}
		return { success: true };
	},
	deleteTag: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		try {
			await db.tag.delete({ where: { id } });
			await redis.del(TAGS_CACHE_KEY, STATS_CACHE_KEY);
		} catch {
			return fail(500, { message: 'Gagal menghapus tag.' });
		}
		return { success: true };
	}
};