import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { uploadImage } from '$lib/server/blob';
import { Prisma } from '@prisma/client';
import { sendNotificationToAll } from '$lib/server/notifications';
import { revalidateFrontendPath } from '$lib/server/revalidate';

export const load: PageServerLoad = async () => {
	const allCategories = await db.category.findMany({ orderBy: { name: 'asc' } });
	const allTags = await db.tag.findMany({ orderBy: { name: 'asc' } });
	return { allCategories, allTags };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
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
			const categoryConnectOrCreate = categoryNames.map((name) => ({ where: { name }, create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') } }));
			const tagConnectOrCreate = tagNames.map((name) => ({ where: { name }, create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') } }));

			const newPost = await db.post.create({
				data: {
					title, slug, content, metaTitle, metaDescription, focusKeyword,
					published,
					// ## PERBAIKAN 1: Logika publishedAt yang lebih akurat ##
					publishedAt: published ? (publishedAtString ? new Date(publishedAtString) : new Date()) : null,
					authorId: locals.user.id,
					featuredImageId: featuredImageId,
					categories: { connectOrCreate: categoryConnectOrCreate },
					tags: { connectOrCreate: tagConnectOrCreate }
				},
				include: {
					featuredImage: true,
					categories: true
				}
			});

			if (newPost.published) {
				await sendNotificationToAll(newPost);
				
				// ## PERBAIKAN 2: Revalidasi yang lebih lengkap ##
				await Promise.all([
					revalidateFrontendPath('/'), // Revalidasi Homepage
					revalidateFrontendPath(`/kategori/${newPost.categories[0]?.slug}`), // Revalidasi halaman kategori
					revalidateFrontendPath(`/${newPost.categories[0]?.slug}/${newPost.slug}`) // Revalidasi halaman post itu sendiri
				]);
			}

		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				return fail(400, { error: `Slug "${slug}" sudah digunakan.` });
			}
			return fail(500, { error: 'Gagal menyimpan postingan.' });
		}
		
		// ## PERBAIKAN 3: Menggunakan 'return redirect' yang lebih aman ##
		return redirect(302, `/admin/posts`);
	}
};