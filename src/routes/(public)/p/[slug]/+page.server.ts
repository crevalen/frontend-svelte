import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { marked } from 'marked';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=3600' });

    const [page, settings] = await Promise.all([
        db.page.findFirst({
            where: { slug: params.slug, published: true }
        }),
        db.setting.findMany({
            where: { key: { in: ['site_title'] } }
        })
    ]);

    if (!page) {
        throw error(404, 'Halaman tidak ditemukan.');
    }

    const settingsMap = settings.reduce((acc: any, setting) => ({...acc, [setting.key]: setting.value}), {});
    const contentHtml = await marked.parse(page.content);

    // --- Logika Meta & JSON-LD Dinamis untuk Halaman ---
    const finalUrl = `${PUBLIC_SITE_URL}/p/${page.slug}`;
    const finalTitle = `${page.metaTitle || page.title} | ${settingsMap.site_title || ''}`;
    const finalDescription = page.metaDescription || contentHtml.substring(0, 160).replace(/<[^>]*>/g, '');

    const meta = {
        title: finalTitle,
        description: finalDescription,
        ogTitle: finalTitle,
        ogDescription: finalDescription,
        canonical: finalUrl
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': page.schemaType || 'WebPage',
        headline: finalTitle,
        description: finalDescription,
        url: finalUrl,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': finalUrl
        }
    };

    return {
        page: { ...page, content: contentHtml },
        meta,
        jsonLd
    };
};