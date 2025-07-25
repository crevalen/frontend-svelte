// src/routes/admin/settings/seo/+page.server.ts

import { db } from '$lib/server/db';
import redis from '$lib/server/redis';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { revalidateFrontendPath } from '$lib/server/revalidate';
import type { Setting } from '@prisma/client';


const settingKeys = ['site_title', 'site_description', 'post_title_template','publisher_name',
	'publisher_logo_url'];
const CACHE_KEY = 'settings:seo';
const CACHE_TTL_SECONDS = 86400; 

export const load: PageServerLoad = async () => {
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
        return { settings: JSON.parse(cachedData as string) };
    }

    const settings = await db.setting.findMany({ where: { key: { in: settingKeys } } });
    const settingsMap = settings.reduce((acc: Record<string, string>, setting: Setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {});

    await redis.set(CACHE_KEY, JSON.stringify(settingsMap), { ex: CACHE_TTL_SECONDS });
    
    return { settings: settingsMap };
};


export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const settingsToUpdate = [];

		for (const key of settingKeys) {
			const raw = formData.get(key);
			const value = typeof raw === 'string' ? raw.trim() : '';

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
            await redis.del(CACHE_KEY);
            await revalidateFrontendPath('/');
        } catch {
            return fail(500, { success: false, message: 'Gagal menyimpan pengaturan.' });
        }
        return { success: true, message: 'Pengaturan berhasil diperbarui!' };
    }
};