import { db } from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PageSchemaType, Prisma } from '@prisma/client'; 

export const load: PageServerLoad = async ({ params }) => {
	const page = await db.page.findUnique({ where: { slug: params.slug } });
	if (!page) throw error(404, 'Halaman tidak ditemukan');
	return { page, schemaTypes: Object.values(PageSchemaType) };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData) as Record<string, any>; // Gunakan 'any' agar bisa menangani checkbox
		try {
			await db.page.update({
				where: { slug: params.slug },
				data: {
					title: data.title,
					slug: data.slug,
					content: data.content,
					published: data.published === 'on',
					metaTitle: data.metaTitle,
					metaDescription: data.metaDescription,
					// Pastikan schemaType dikonversi ke enum yang benar
					schemaType: data.schemaType as PageSchemaType
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				return fail(400, { error: `Slug "${data.slug}" sudah digunakan.` });
			}
			console.error(e);
			return fail(500, { error: 'Gagal memperbarui halaman.' });
		}
		
		// 2. Ganti 'throw' menjadi 'return'
		return redirect(302, `/admin/pages`);
	}
};