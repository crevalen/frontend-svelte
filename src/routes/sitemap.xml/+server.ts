import { PUBLIC_CMS_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	// 1. Ambil sitemap dari CMS
	const response = await fetch(`${PUBLIC_CMS_URL}/sitemap.xml`);

	// 2. Ambil konten XML-nya
	const sitemapXml = await response.text();

	// 3. Tampilkan kembali dengan header yang benar
	return new Response(sitemapXml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600' // Cache selama 1 jam
		}
	});
};