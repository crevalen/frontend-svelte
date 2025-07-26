// src/routes/admin/settings/general/+page.server.ts

import { db } from '$lib/server/db';
import redis from '$lib/server/redis';
import { error, fail, redirect } from '@sveltejs/kit'; 
import { uploadImage } from '$lib/server/blob';
import type { Actions, PageServerLoad } from './$types';
import { revalidateFrontendPath } from '$lib/server/revalidate';


const settingKeys = [
	'site_favicon_url',
	'site_logo_url',
	'publisher_logo_url',
	'gsc_verification_code',
	'bing_verification_code',
	'yandex_verification_code',
	'ga4_id',
	'custom_head_script',
	'custom_footer_script'
];

const CACHE_KEY = 'settings:general';
const CACHE_TTL_SECONDS = 86400; 

export const load: PageServerLoad = async () => {
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
		// --- PERBAIKAN UTAMA DI SINI ---
		// Jika cachedData sudah berupa objek, gunakan langsung.
		// Jika masih berupa string, baru kita parse.
		const settings = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
		return { settings };
		// --- SELESAI PERBAIKAN ---
	}

    const settings = await db.setting.findMany({ where: { key: { in: settingKeys } } });
    const settingsMap = settings.reduce((acc: Record<string, string>, setting) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {});

    await redis.set(CACHE_KEY, JSON.stringify(settingsMap), { ex: CACHE_TTL_SECONDS });

    return { settings: settingsMap };
};


export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const settingOps = [];

		for (const key of settingKeys) {
			const value = formData.get(key);

			
			if (value instanceof File && value.size > 0) {
				try {
					const newImage = await uploadImage(value);
					settingOps.push(
						db.setting.upsert({
							where: { key },
							update: { value: newImage.url },
							create: { key, value: newImage.url }
						})
					);
				} catch {
					
					console.error(`Gagal meng-upload file untuk ${key}`);
				}
			} else if (typeof value === 'string') {
				
				settingOps.push(
					db.setting.upsert({
						where: { key },
						update: { value },
						create: { key, value }
					})
				);
			}
		}

		try {
            await db.$transaction(settingOps);
            await redis.del(CACHE_KEY);
            await revalidateFrontendPath('/');
        } catch {
            return fail(500, { success: false, message: 'Gagal menyimpan pengaturan.' });
        }
        return { success: true, message: 'Pengaturan berhasil diperbarui!' };
    }
};