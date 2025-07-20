import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { marked } from 'marked';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=300' });

    const post = await db.post.findFirst({
        where: { slug: params.slug, published: true },
        include: { author: { select: { username: true, displayName: true, avatarUrl: true } }, featuredImage: true, ogImage: true, categories: { take: 1 }, tags: true }
    });

    if (!post) throw error(404, 'Postingan tidak ditemukan');

    const [comments, relatedPosts, settings, popularPosts] = await Promise.all([
        db.comment.findMany({ where: { postId: post.id, isApproved: true, parentId: null }, include: { replies: true }, orderBy: { createdAt: 'asc' } }),
        db.post.findMany({ where: { published: true, id: { not: post.id }, categories: { some: { id: post.categories[0]?.id } } }, select: { slug: true, title: true, publishedAt: true, featuredImage: { select: { url: true } }, categories: { select: { slug: true, name: true }, take: 1 } }, take: 4 }),
        db.setting.findMany({ where: { key: { in: ['site_title', 'post_title_template', 'publisher_name', 'publisher_logo_url'] } } }),
        db.post.findMany({ where: { published: true }, orderBy: { viewCount: 'desc' }, take: 5, select: { title: true, slug: true, publishedAt: true, featuredImage: { select: { url: true } }, categories: { select: { name: true, slug: true }, take: 1 } } })
    ]);

    const contentHtml = await marked.parse(post.content);
    const settingsMap = settings.reduce((acc: any, setting: { key: any; value: any; }) => ({...acc, [setting.key]: setting.value}), {});
    const finalUrl = `${PUBLIC_SITE_URL}/${post.categories[0]?.slug || 'blog'}/${post.slug}`;
    const finalTitle = settingsMap.post_title_template?.replace('%post_title%', post.title).replace('%site_title%', settingsMap.site_title) || `${post.title} | ${settingsMap.site_title}`;
    const finalDescription = post.metaDescription || contentHtml.substring(0, 160).replace(/<[^>]*>/g, '');

    return {
        post: { ...post, content: contentHtml },
        meta: { title: finalTitle, description: finalDescription, ogTitle: post.ogTitle || finalTitle, ogDescription: post.ogDescription || finalDescription, ogImage: post.ogImage?.url || post.featuredImage?.url || '', canonical: post.canonicalUrl || finalUrl, robots: `${post.noIndex ? 'noindex' : 'index'},${post.noFollow ? 'nofollow' : 'follow'}` },
        jsonLd: { /* ... logika JSON-LD ... */ },
        comments,
        relatedPosts,
        popularPosts
    };
};