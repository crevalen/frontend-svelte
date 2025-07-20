import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const page = url.searchParams.get('page') ?? '1';
	
	try {
		const response = await fetch(`https://cms-kustom.vercel.app/api/render/homepage?page=${page}`);
		if (!response.ok) {
			console.error("Failed to fetch homepage data:", response.statusText);
			return { homepageData: null };
		}
		const homepageData = await response.json();
		return { homepageData };
	} catch (e) {
		console.error("Error fetching homepage data:", e);
		return { homepageData: null };
	}
};