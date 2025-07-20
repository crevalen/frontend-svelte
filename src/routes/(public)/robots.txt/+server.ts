import { db } from '$lib/server/db';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const setting = await db.setting.findUnique({
		where: { key: 'robots_txt_content' }
	});
	
	const defaultContent = 
`User-agent: *
Allow: /
Disallow: /search
		  /admin

Sitemap: ${PUBLIC_SITE_URL}/sitemap.xml`;

	const content = setting?.value || defaultContent;

	return new Response(content.trim(), {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
};