import { db } from '$lib/server/db';
import { PUBLIC_SITE_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const settings = await db.setting.findMany({
        where: { key: { in: ['site_title', 'site_description'] } }
    });
    const settingsMap = settings.reduce((acc: any, setting: { key: any; value: any; }) => ({...acc, [setting.key]: setting.value}), {});

    const posts = await db.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 15,
        include: { categories: { take: 1 } }
    });

    const body = render(settingsMap, posts);

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600' // Cache selama 1 jam
        }
    });
};

// Fungsi untuk membuat string XML
const render = (settings: any, posts: any[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${settings.site_title}</title>
<description>${settings.site_description}</description>
<link>${PUBLIC_SITE_URL}</link>
<atom:link href="${PUBLIC_SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${posts.map(post => `
    <item>
    <title><![CDATA[${post.title}]]></title>
    <description><![CDATA[${post.metaDescription || ''}]]></description>
    <link>${PUBLIC_SITE_URL}/${post.categories[0]?.slug || 'artikel'}/${post.slug}</link>
    <guid isPermaLink="true">${PUBLIC_SITE_URL}/${post.categories[0]?.slug || 'artikel'}/${post.slug}</guid>
    <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
    </item>
`).join('')}
</channel>
</rss>
`;