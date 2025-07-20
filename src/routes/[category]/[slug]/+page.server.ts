// Di dalam proyek FRONTEND: src/routes/[category]/[slug]/+page.server.ts

import { PUBLIC_CMS_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
	// Atur header cache
	setHeaders({
		'Cache-Control': 'public, max-age=0, s-maxage=300' // cache selama 5 menit
	});

	try {
		// Cukup satu panggilan ke API "super" kita
		const response = await fetch(`${PUBLIC_CMS_URL}/api/render/post/${params.slug}`);

		if (!response.ok) {
			throw error(response.status, 'Postingan tidak ditemukan.');
		}

		// Langsung return semua data yang sudah digabungkan dari API
		const allData = await response.json();
		return allData;
		
	} catch (e) {
		console.error(`Gagal memuat data untuk slug ${params.slug}:`, e);
		throw error(500, 'Gagal terhubung ke server CMS.');
	}
};