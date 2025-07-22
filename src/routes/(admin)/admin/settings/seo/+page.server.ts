// src/routes/admin/settings/seo/+page.server.ts

import { db } from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Setting } from '@prisma/client';
import { revalidateFrontendPath } from '$lib/server/revalidate';

const settingKeys = ['site_title', 'site_description', 'post_title_template','publisher_name',
	'publisher_logo_url'];

export const load: PageServerLoad = async () => {
	const settings = await db.setting.findMany({
		where: { key: { in: settingKeys } }
	});

	// Perbaikan: Menambahkan tipe data eksplisit pada fungsi reduce
	const settingsMap = settings.reduce(
		(acc: Record<string, string>, setting: Setting) => {
			acc[setting.key] = setting.value;
			return acc;
		},
		{}
	);

	return { settings: settingsMap };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const settingsToUpdate = [];

		for (const key of settingKeys) {
			const value = formData.get(key) as string;
			settingsToUpdate.push(
				db.setting.upsert({
					where: { key },
					update: { value },
					create: { key, value }
				})
			);
		}

		try {
			await db.$transaction(settingsToUpdate);
		// --- TAMBAHAN BARU DI SINI ---
			// 2. Panggil revalidate setelah berhasil menyimpan
			await revalidateFrontendPath('/');
			// --- SELESAI TAMBAHAN ---

		} catch {
			return { success: false, message: 'Gagal menyimpan pengaturan.' };
		}

		return redirect(302, `/admin/settings`);
	}
};