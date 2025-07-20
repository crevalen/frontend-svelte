import { db } from '$lib/server/db';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const posts = await db.post.findMany({ where: { published: true }, include: { categories: { take: 1 } } });
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${posts.map(post => `
            <url>
                <loc>${PUBLIC_SITE_URL}/${post.categories[0]?.slug || 'artikel'}/${post.slug}</loc>
                <lastmod>${post.updatedAt.toISOString()}</lastmod>
            </url>
        `).join('')}
    </urlset>`;
    return new Response(xml.trim(), { headers: { 'Content-Type': 'application/xml' } });
};