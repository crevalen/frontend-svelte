import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const response = await fetch(`https://cms-kustom.vercel.app/api/tags/${params.slug}`);

		if (!response.ok) {
			throw error(response.status, 'Tag tidak ditemukan.');
		}

		const data = await response.json();
		
		return {
			tag: data,
			posts: data.posts || []
		};

	} catch (e: any) {
		if (e.status) {
			throw error(e.status, e.body.message);
		}
		throw error(500, 'Gagal terhubung ke server.');
	}
};