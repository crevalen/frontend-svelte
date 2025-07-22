import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { Prisma, PageSchemaType } from '@prisma/client'; 
import { revalidateFrontendPath } from '$lib/server/revalidate'; 

export const load: PageServerLoad = async () => {
	// 3. Kirim daftar tipe skema ke form
	return {
		schemaTypes: Object.values(PageSchemaType)
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData) as Record<string, any>; // Gunakan 'any' untuk checkbox

		try {
			const newPage = await db.page.create({
				data: {
					title: data.title,
					slug: data.slug,
					content: data.content,
					published: data.published === 'on',
					metaTitle: data.metaTitle,
					metaDescription: data.metaDescription,
					// 4. Pastikan schemaType dikonversi ke enum yang benar
					schemaType: data.schemaType as PageSchemaType
				}
			});

			// 5. Picu revalidate jika halaman dipublikasikan
			if (newPage.published) {
				await revalidateFrontendPath(`/p/${newPage.slug}`);
			}

		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				return fail(400, { error: `Slug "${data.slug}" sudah digunakan.` });
			}
			return fail(500, { error: 'Gagal menyimpan halaman.' });
		}
		
		// 6. Gunakan 'return redirect' yang lebih aman
		return redirect(302, `/admin/pages`);
	}
};