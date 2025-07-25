import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import redis from '$lib/server/redis';

// Definisikan kunci cache yang unik untuk data layout
const LAYOUT_PAGES_CACHE_KEY = 'layout:pages';
const LAYOUT_SETTINGS_CACHE_KEY = 'layout:settings';
const LAYOUT_POPULAR_CACHE_KEY = 'layout:popular_posts';
const CACHE_TTL_SECONDS = 3600; // Cache data selama 1 jam

export const load: LayoutServerLoad = async ({ url }) => {
	// Gunakan try...catch untuk menangani kemungkinan error koneksi database
	try {
		// Ambil data dari cache terlebih dahulu secara bersamaan
		const [cachedPages, cachedSettings, cachedPopularPosts] = await redis.mget(
			LAYOUT_PAGES_CACHE_KEY,
			LAYOUT_SETTINGS_CACHE_KEY,
			LAYOUT_POPULAR_CACHE_KEY
		);

		// Proses data 'pages'
		const pages = typeof cachedPages === 'string'
			? JSON.parse(cachedPages)
			: await db.page.findMany({
					where: { published: true },
					select: { title: true, slug: true },
					orderBy: { createdAt: 'asc' }
			  });

		// Proses data 'settings'
		const settingsResult = typeof cachedSettings === 'string' ? JSON.parse(cachedSettings) : await db.setting.findMany();

		// Proses data 'popularPosts'
		const popularPosts = typeof cachedPopularPosts === 'string'
			? JSON.parse(cachedPopularPosts)
			: await db.post.findMany({
					where: { published: true },
					orderBy: { viewCount: 'desc' },
					take: 5,
					select: {
						title: true,
						slug: true,
						publishedAt: true,
						featuredImage: { select: { url: true } },
						categories: { select: { name: true, slug: true }, take: 1 }
					}
			  });

		// Simpan data ke cache jika sebelumnya tidak ada (cache miss)
		if (!cachedPages) {
			await redis.set(LAYOUT_PAGES_CACHE_KEY, JSON.stringify(pages), { ex: CACHE_TTL_SECONDS });
		}
		if (!cachedSettings) {
			await redis.set(LAYOUT_SETTINGS_CACHE_KEY, JSON.stringify(settingsResult), {
				ex: CACHE_TTL_SECONDS
			});
		}
		if (!cachedPopularPosts) {
			await redis.set(LAYOUT_POPULAR_CACHE_KEY, JSON.stringify(popularPosts), {
				ex: CACHE_TTL_SECONDS
			});
		}

		// Ubah array settings menjadi objek (map) untuk kemudahan akses
		const settingsMap = settingsResult.reduce(
			(acc: any, setting: { key: string | number; value: any }) => {
				acc[setting.key] = setting.value;
				return acc;
			},
			{}
		);

		return {
			url: url.pathname,
			pages,
			settings: settingsMap,
			popularPosts
		};
	} catch (e) {
		// Jika terjadi error saat mengambil data layout (misal: DB mati),
		// log error di server dan kirim status 503 ke SvelteKit.
		// Ini akan membuat SvelteKit dapat merender halaman +error.svelte kustom Anda.
		console.error('Gagal memuat data layout:', e);
		throw error(503, 'Layanan tidak tersedia saat ini');
	}
};