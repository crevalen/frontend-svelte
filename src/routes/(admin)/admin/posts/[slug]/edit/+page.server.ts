import { db } from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { Prisma, SchemaType } from '@prisma/client';
import { revalidateFrontendPath } from '$lib/server/revalidate';
import { uploadImage } from '$lib/server/blob';

export const load: PageServerLoad = async ({ params, locals }) => {
	const post = await db.post.findUnique({
		where: { slug: params.slug },
		include: { categories: true, tags: true, featuredImage: true }
	});

	if (!post) throw error(404, 'Postingan tidak ditemukan');
	if (post.authorId !== locals.user?.id) throw error(403, 'Akses ditolak');

	const allCategories = await db.category.findMany({ orderBy: { name: 'asc' } });
	const allTags = await db.tag.findMany({ orderBy: { name: 'asc' } });

	return {
		post: {
			...post,
			featuredImageUrl: (post as any).featuredImage?.url
		},
		allCategories,
		allTags,
	        schemaTypes: Object.values(SchemaType)
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const { slug: oldSlug } = params;
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const newSlug = formData.get('slug') as string;
		const content = formData.get('content') as string;
		const published = formData.get('published') === 'on';
		const metaTitle = formData.get('metaTitle') as string;
		const metaDescription = formData.get('metaDescription') as string;
		const focusKeyword = formData.get('focusKeyword') as string;
		const image = formData.get('imageUrl') as File;
		const imageAltText = formData.get('imageAltText') as string;
		const categoryNames = (formData.get('categories') as string)?.split(',').filter(Boolean).map(s => s.trim());
		const tagNames = (formData.get('tags') as string)?.split(',').filter(Boolean).map(s => s.trim());
		const schemaType = formData.get('schemaType') as string;
		const ogTitle = formData.get('ogTitle') as string;
		const ogDescription = formData.get('ogDescription') as string;
		const canonicalUrl = formData.get('canonicalUrl') as string;
		const noIndex = formData.get('noIndex') === 'on';
		const noFollow = formData.get('noFollow') === 'on';
		const ogImageFile = formData.get('ogImage') as File;

		if (!title) return fail(400, { error: 'Judul tidak valid.' });
		if (!newSlug || !/^[a-z0-9-]+$/.test(newSlug)) return fail(400, { error: 'Slug tidak valid.' });

		try {
			const categoryUpserts = categoryNames.map((name) =>
				db.category.upsert({ where: { name }, update: {}, create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') } })
			);
			const tagUpserts = tagNames.map((name) =>
				db.tag.upsert({ where: { name }, update: {}, create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') } })
			);
			
			const newCategories = await Promise.all(categoryUpserts);
			const newTags = await Promise.all(tagUpserts);

			const dataToUpdate: Prisma.PostUpdateInput = {
				title, slug: newSlug, content, published, metaTitle, metaDescription,focusKeyword,
				categories: { set: newCategories.map(cat => ({ id: cat.id })) },
				tags: { set: newTags.map(tag => ({ id: tag.id })) },
				ogTitle,
				ogDescription,
				canonicalUrl,
				schemaType,
				noIndex,
				noFollow,
			};

			if (image?.size > 0) {
				const newImage = await uploadImage(image, imageAltText);
				dataToUpdate.featuredImage = { connect: { id: newImage.id } };
			}

			if (ogImageFile?.size > 0) {
				const newOgImage = await uploadImage(ogImageFile);
				dataToUpdate.ogImage = { connect: { id: newOgImage.id } };
			}

			const updatedPost = await db.post.update({
				where: { slug: oldSlug, authorId: locals.user?.id },
				data: dataToUpdate,
				include: {
					categories: true // Kita butuh ini untuk revalidasi
				}
			});

			// --- LOGIKA REVALIDASI YANG SUDAH DISEMPURNAKAN ---
			const pathsToRevalidate = new Set<string>();
			pathsToRevalidate.add('/'); // 1. Selalu revalidasi homepage

			// 2. Revalidasi semua halaman kategori (future-proof untuk multi-kategori)
			if (updatedPost.categories) {
				updatedPost.categories.forEach(cat => {
					pathsToRevalidate.add(`/kategori/${cat.slug}`);
				});
			}

			// 3. Revalidasi path artikel yang baru
			if (updatedPost.categories && updatedPost.categories[0]) {
				pathsToRevalidate.add(`/${updatedPost.categories[0].slug}/${updatedPost.slug}`);
			}
			
			// 4. Revalidasi path artikel yang LAMA jika slug berubah
			if (oldSlug !== newSlug && updatedPost.categories && updatedPost.categories[0]) {
				pathsToRevalidate.add(`/${updatedPost.categories[0].slug}/${oldSlug}`);
			}
			
			// 5. Jalankan semua revalidasi secara efisien
			await Promise.all(
				Array.from(pathsToRevalidate).map(path => revalidateFrontendPath(path))
			);
			// --- SELESAI ---

		} catch (e) {
			console.error(e);
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				return fail(400, { error: `Slug "${newSlug}" sudah digunakan.` });
			}
			return fail(500, { error: 'Gagal memperbarui postingan.', success: false });
		}
		
		return { success: true, message: 'Postingan berhasil diperbarui!' };
	}
};