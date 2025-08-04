import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import redis from '$lib/server/redis';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { buildSchema } from '$lib/server/schema-builder';

const getCacheKey = (slug: string) => `post-public:${slug}`;
const CACHE_TTL_SECONDS = 3600; 


export const load: PageServerLoad = async ({ params, setHeaders }) => {
    if (!params.slug) {
        throw error(404, 'Halaman tidak ditemukan.');
    }
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=300' });

    const cacheKey = getCacheKey(params.slug);

     try {
        const cachedData = await redis.get(cacheKey);
        if (typeof cachedData === 'string') {
            return JSON.parse(cachedData); 
        }

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
            
            // ## PERBAIKAN UNTUK RELATED POSTS ##
            db.post.findMany({
                where: { published: true, id: { not: post.id }, categories: { some: { id: post.categories[0]?.id } } },
                select: { 
                    slug: true, 
                    title: true, 
                    categories: { select: { slug: true, name: true }, take: 1 },
                    // Ambil URL gambar yang dibutuhkan oleh komponen SmallPostCard
                    featuredImage: { 
                        select: { 
                            url_placeholder: true,
                            url_thumb: true 
                        } 
                    } 
                },
                take: 4
            }),
            
            db.setting.findMany({ where: { key: { in: ['site_title', 'post_title_template', 'publisher_name', 'publisher_logo_url'] } } }),

            // ## PERBAIKAN UNTUK POPULAR POSTS ##
            db.post.findMany({ 
                where: { published: true }, 
                orderBy: { viewCount: 'desc' }, 
                take: 5, 
                select: { 
                    title: true, 
                    slug: true, 
                    publishedAt: true, 
                    categories: { select: { name: true, slug: true }, take: 1 },
                    // Ambil URL gambar yang dibutuhkan oleh komponen PopularPosts
                    featuredImage: { 
                        select: { 
                            url_placeholder: true,
                            url_thumb: true
                        } 
                    }
                } 
            })
        ]);
        
        
        
        const settingsMap = settings.reduce((acc: any, setting: {key: string, value: string}) => ({...acc, [setting.key]: setting.value}), {});
        
        const finalUrl = `${PUBLIC_SITE_URL}/${post.categories[0]?.slug || 'blog'}/${post.slug}`;
        const siteTitle = settingsMap.site_title || 'Blog';
        const titleTemplate = settingsMap.post_title_template || '%post_title% | %site_title%';
        const finalTitle = post.metaTitle || titleTemplate.replace('%post_title%', post.title).replace('%site_title%', siteTitle);
        const finalDescription = post.metaDescription || post.content.substring(0, 160).replace(/<[^>]*>/g, '');

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
        const jsonLd = buildSchema(post, meta, settingsMap, post.content);
        
        const dataToCache = {
            post: { ...post, content: post.content },
            meta,
            jsonLd,
            comments,
            relatedPosts,
            popularPosts
        };

        // 4. Simpan hasil lengkap ke Redis
        await redis.set(cacheKey, JSON.stringify(dataToCache), { ex: CACHE_TTL_SECONDS });
        
        return dataToCache;

    } catch (e) {
        console.error(`Gagal memuat data untuk slug ${params.slug}:`, e);
        throw error(500, 'Gagal terhubung ke server.');
    }
};