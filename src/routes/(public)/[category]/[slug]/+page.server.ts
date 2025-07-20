import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { marked } from 'marked';
import { PUBLIC_SITE_URL } from '$env/static/public';

// Anda bisa pindahkan interface ini ke file app.d.ts agar lebih rapi
interface JsonLdSchema {
	'@context': string;
	'@type': string;
	headline: string;
	description: string;
	image?: string;
	datePublished: string;
	dateModified: string;
	author: { '@type': 'Person'; name: string };
	publisher: { '@type': 'Organization'; name: string; logo: { '@type': 'ImageObject'; url: string } };
	mainEntityOfPage: { '@type': 'WebPage'; '@id': string };
	mainEntity?: {
		'@type': 'Question';
		name: string;
		acceptedAnswer: {
			'@type': 'Answer';
			text: string;
		};
	}[];
}

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=300' });

    try {
        // 1. Ambil Data Post Utama & Relasinya
        const post = await db.post.findFirst({
            where: { slug: params.slug, published: true },
            include: {
                author: { select: { username: true, displayName: true, avatarUrl: true } },
                featuredImage: true,
                ogImage: true,
                categories: { take: 1 },
                tags: true
            }
        });

        if (!post) {
            throw error(404, 'Postingan tidak ditemukan');
        }

        // 2. Ambil Data Tambahan
        const [comments, relatedPosts, settings, popularPosts] = await Promise.all([
            db.comment.findMany({ where: { postId: post.id, isApproved: true, parentId: null }, include: { replies: true }, orderBy: { createdAt: 'asc' } }),
            db.post.findMany({
                where: { published: true, id: { not: post.id }, categories: { some: { id: post.categories[0]?.id } } },
                select: { slug: true, title: true, publishedAt: true, featuredImage: { select: { url: true } }, categories: { select: { slug: true, name: true }, take: 1 } },
                take: 4
            }),
            db.setting.findMany({ where: { key: { in: ['site_title', 'post_title_template', 'publisher_name', 'publisher_logo_url'] } } }),
            db.post.findMany({ where: { published: true }, orderBy: { viewCount: 'desc' }, take: 5, select: { title: true, slug: true, publishedAt: true, featuredImage: { select: { url: true } }, categories: { select: { name: true, slug: true }, take: 1 } } })
        ]);
        
        // 3. Proses Semua Data (Konten, Meta, JSON-LD)
        const contentHtml = await marked.parse(post.content);
        const settingsMap = settings.reduce((acc: any, setting: {key: string, value: string}) => ({...acc, [setting.key]: setting.value}), {});
        
        const finalUrl = `${PUBLIC_SITE_URL}/${post.categories[0]?.slug || 'blog'}/${post.slug}`;
        const siteTitle = settingsMap.site_title || 'Blog';
        const titleTemplate = settingsMap.post_title_template || '%post_title% | %site_title%';
        const finalTitle = post.metaTitle || titleTemplate.replace('%post_title%', post.title).replace('%site_title%', siteTitle);
        const finalDescription = post.metaDescription || contentHtml.substring(0, 160).replace(/<[^>]*>/g, '');

        const meta = {
            title: finalTitle,
            description: finalDescription,
            ogTitle: post.ogTitle || finalTitle,
            ogDescription: post.ogDescription || finalDescription,
            ogImage: post.ogImage?.url || post.featuredImage?.url || '',
            canonical: post.canonicalUrl || finalUrl,
            robots: `${post.noIndex ? 'noindex' : 'index'},${post.noFollow ? 'nofollow' : 'follow'}`
        };

        const schemaType = post.schemaType || 'BlogPosting';
        const jsonLd: JsonLdSchema = {
            '@context': 'https://schema.org',
            '@type': schemaType,
            headline: post.metaTitle || post.title,
            description: finalDescription,
            image: post.featuredImage?.url || '',
            datePublished: post.createdAt.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            author: { '@type': 'Person', name: post.author.displayName || post.author.username },
            publisher: {
                '@type': 'Organization',
                name: settingsMap.publisher_name || siteTitle,
                logo: { '@type': 'ImageObject', url: settingsMap.publisher_logo_url || '' }
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': finalUrl }
        };

        if (schemaType === 'FAQPage') {
            const faqPairs = contentHtml.match(/<h2>(.*?)<\/h2>([\s\S]*?)(?=(<h2>|$))/g) || [];
            jsonLd.mainEntity = faqPairs.map((pair) => {
                const questionMatch = pair.match(/<h2>(.*?)<\/h2>/);
                const answerMatch = pair.replace(/<h2>.*?<\/h2>/, '').trim();
                return {
                    '@type': 'Question',
                    name: questionMatch ? questionMatch[1] : '',
                    acceptedAnswer: { '@type': 'Answer', text: answerMatch.replace(/<[^>]*>/g, '') }
                };
            });
        }
        
        // 4. Return Semua Data dalam Satu Objek
        return {
            post: { ...post, content: contentHtml },
            meta,
            jsonLd,
            comments,
            relatedPosts,
            popularPosts
        };

    } catch (e) {
        console.error(`Gagal memuat data untuk slug ${params.slug}:`, e);
        throw error(500, 'Gagal terhubung ke server.');
    }
};