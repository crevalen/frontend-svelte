import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import redis from '$lib/server/redis';
import { db } from '$lib/server/db';
import { uploadImage } from '$lib/server/blob';
import { Prisma, SchemaType } from '@prisma/client';
import { QSTASH_TOKEN } from '$env/static/private'; 
import { revalidateFrontendPath } from '$lib/server/revalidate';

const CATEGORIES_CACHE_KEY = 'taxonomies:categories';
const TAGS_CACHE_KEY = 'taxonomies:tags';

export const load: PageServerLoad = async () => {
	// 1. Coba ambil daftar kategori dan tag dari Redis
	const [cachedCategories, cachedTags] = await redis.mget(CATEGORIES_CACHE_KEY, TAGS_CACHE_KEY);

	// 2. Jika tidak ada di cache, baru ambil dari DB
	const allCategories = typeof cachedCategories === 'string'
		? JSON.parse(cachedCategories)
		: await db.category.findMany({ orderBy: { name: 'asc' } });
	const allTags = typeof cachedTags === 'string'
		? JSON.parse(cachedTags)
		: await db.tag.findMany({ orderBy: { name: 'asc' } });

	// Jika cache kosong, kita tidak perlu set di sini karena sudah ditangani di halaman taksonomi.
	// Halaman ini hanya bertugas membaca.

	return {
		allCategories,
		allTags,
		schemaTypes: Object.values(SchemaType)
	};
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		if (!locals.user) throw redirect(302, '/login');

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const slug = formData.get('slug') as string;
		const content = formData.get('content') as string;
		const published = formData.get('published') === 'on';
		const publishedAtString = formData.get('publishedAt') as string;
		const metaTitle = formData.get('metaTitle') as string;
		const metaDescription = formData.get('metaDescription') as string;
		const focusKeyword = formData.get('focusKeyword') as string;
		const image = formData.get('imageUrl') as File;
		const imageAltText = formData.get('imageAltText') as string;
		const categoryNames = (formData.get('categories') as string)?.split(',').filter(Boolean).map((s) => s.trim());
		const tagNames = (formData.get('tags') as string)?.split(',').filter(Boolean).map((s) => s.trim());
		
		let featuredImageId: string | undefined = undefined;
		if (image?.size > 0) {
			try {
				const newImage = await uploadImage(image, imageAltText);
				featuredImageId = newImage.id;
			} catch {
				return fail(500, { error: 'Gagal meng-upload gambar.' });
			}
		}

		if (!title || title.length < 3) return fail(400, { error: 'Judul tidak valid.' });
		if (!slug || !/^[a-z0-9-]+$/.test(slug)) return fail(400, { error: 'Slug tidak valid.' });

		try {
			let featuredImageId: string | undefined = undefined;
			if (image?.size > 0) {
				const newImage = await uploadImage(image, imageAltText);
				featuredImageId = newImage.id;
			}

			// Langkah 2: Proses Kategori & Tag secara terpisah dan aman
			const categoryUpserts = categoryNames.map((name) =>
				db.category.upsert({
					where: { name },
					update: {},
					create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') }
				})
			);
			const tagUpserts = tagNames.map((name) =>
				db.tag.upsert({
					where: { name },
					update: {},
					create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') }
				})
			);
            
            // Jalankan semua operasi upsert dan kumpulkan hasilnya
			const resultingCategories = await Promise.all(categoryUpserts);
			const resultingTags = await Promise.all(tagUpserts);
			
			const newPost = await db.post.create({
				data: {
					title, slug, content, metaTitle, metaDescription, focusKeyword,
					published,
					// ## PERBAIKAN 1: Logika publishedAt yang lebih akurat ##
					publishedAt: published ? (publishedAtString ? new Date(publishedAtString) : new Date()) : null,
					authorId: locals.user.id,
					featuredImageId: featuredImageId,
					categories: {
						connect: resultingCategories.map((cat) => ({ id: cat.id }))
					},
					tags: {
						connect: resultingTags.map((tag) => ({ id: tag.id }))
					}
				},
				include: { categories: true, featuredImage: true }
			});

			await redis.del('dashboard:stats', 'dashboard:popular_posts');
			if (newPost.published) {
				await fetch('https://qstash.upstash.io/v2/publish/new-posts', {
                    method: 'POST',
                    headers: {
                        // Otorisasi menggunakan token Anda
                        'Authorization': `Bearer ${QSTASH_TOKEN}`,
                        // Tentukan topik. 'new-posts' adalah nama yang akan kita buat di Upstash
                        'Upstash-Topic': 'new-posts',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        postId: newPost.id // Kirim data minimal yang diperlukan
                    })
                });

				
				// ## PERBAIKAN 2: Revalidasi yang lebih lengkap ##
				await Promise.all([
					revalidateFrontendPath('/'), // Revalidasi Homepage
					revalidateFrontendPath(`/kategori/${newPost.categories[0]?.slug}`), // Revalidasi halaman kategori
					revalidateFrontendPath(`/${newPost.categories[0]?.slug}/${newPost.slug}`) // Revalidasi halaman post itu sendiri
				]);
			}

		} catch (e) {
			console.error("GAGAL MENYIMPAN POSTINGAN:", e); 
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				return fail(400, { error: `Slug "${slug}" sudah digunakan.` });
			}
			// Berikan pesan error yang lebih umum tapi jelas
			return fail(500, { error: 'Terjadi kesalahan internal saat menyimpan postingan. Silakan coba lagi.' });
		}

		return redirect(302, `/admin/posts`);
	}
};