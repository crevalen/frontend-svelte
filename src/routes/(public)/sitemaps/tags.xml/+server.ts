import { db } from '$lib/server/db';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const tags = await db.tag.findMany();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${tags.map((tag: { slug: any; updatedAt: { toISOString: () => any; }; }) => `
            <url>
                <loc>${PUBLIC_SITE_URL}/tag/${tag.slug}</loc>
                <lastmod>${tag.updatedAt.toISOString()}</lastmod>
            </url>
        `).join('')}
    </urlset>`;
    return new Response(xml.trim(), { headers: { 'Content-Type': 'application/xml' } });
};