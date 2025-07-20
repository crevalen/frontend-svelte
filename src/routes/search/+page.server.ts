import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const query = url.searchParams.get('q') || '';
	let posts = [];

	if (query) {
		try {
			const response = await fetch(`https://cms-kustom.vercel.app/api/search?q=${encodeURIComponent(query)}`);
			if (response.ok) {
				const data = await response.json();
				posts = data.posts;
			}
		} catch (e) {
			console.error("Gagal melakukan pencarian:", e);
		}
	}

	return {
		query,
		posts
	};
};