import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { marked } from 'marked';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=3600' });

    // Ambil data halaman dan pengaturan situs secara bersamaan
    const [page, settings] = await Promise.all([
        db.page.findFirst({
            where: { slug: params.slug, published: true }
        }),
        db.setting.findMany({
            where: { key: { in: ['site_title', 'publisher_name', 'publisher_logo_url'] } }
        })
    ]);

    if (!page) {
        throw error(404, 'Halaman tidak ditemukan.');
    }

    const settingsMap = settings.reduce((acc: any, setting) => ({...acc, [setting.key]: setting.value}), {});
    const contentHtml = await marked.parse(page.content);

    // --- Logika Meta & JSON-LD yang Diperkaya ---
    const finalUrl = `${PUBLIC_SITE_URL}/p/${page.slug}`;
    const siteTitle = settingsMap.site_title || 'Crevalen.xyz';
    const finalTitle = `${page.metaTitle || page.title} | ${siteTitle}`;
    const finalDescription = page.metaDescription || contentHtml.substring(0, 160).replace(/<[^>]*>/g, '');

    const meta = {
        title: finalTitle,
        description: finalDescription,
        ogTitle: finalTitle,
        ogDescription: finalDescription,
        canonical: finalUrl
    };

    // PERBAIKAN: Tambahkan properti 'publisher' dan 'datePublished'
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': page.schemaType || 'WebPage',
        headline: finalTitle,
        description: finalDescription,
        url: finalUrl,
        datePublished: page.createdAt.toISOString(),
        dateModified: page.updatedAt.toISOString(),
        publisher: {
            '@type': 'Organization',
            name: settingsMap.publisher_name || siteTitle,
            logo: {
                '@type': 'ImageObject',
                url: settingsMap.publisher_logo_url || ''
            }
        },
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