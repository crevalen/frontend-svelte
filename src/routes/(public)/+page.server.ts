import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import he from 'he';
// PERBAIKAN: Hapus 'json' dari import ini karena tidak digunakan
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = 10;
    
    try {
        const [ featuredPost, popularPosts, gridPosts, storyPosts, totalPosts, paginatedPosts ] = await Promise.all([
            db.post.findFirst({ where: { published: true }, orderBy: { createdAt: 'desc' }, include: { categories: { take: 1 }, featuredImage: true } }),
            db.post.findMany({ where: { published: true }, orderBy: { viewCount: 'desc' }, take: 5, include: { categories: { take: 1 }, featuredImage: true } }),
            db.post.findMany({ where: { published: true, categories: { some: { slug: 'tips' } } }, orderBy: { createdAt: 'desc' }, take: 6, include: { categories: { take: 1 }, featuredImage: true } }),
            db.post.findMany({ where: { published: true, categories: { some: { slug: 'story' } } }, orderBy: { createdAt: 'desc' }, take: 4, include: { categories: { take: 1 }, featuredImage: true } }),
            db.post.count({ where: { published: true } }),
            db.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, include: { categories: { take: 1 }, author: true, featuredImage: true } })
        ]);

        if (!featuredPost) {
            return { homepageData: { featuredPost: null, popularPosts: [], gridPosts: [], storyPosts: [], paginatedPosts: [], pagination: { currentPage: page, totalPages: 0 } } };
        }

        const plainTextContent = featuredPost.content.replace(/<[^>]*>/g, '');
        const decodedText = he.decode(plainTextContent);
        const excerpt = decodedText.substring(0, 150) + '...';
        const totalPages = Math.ceil(totalPosts / limit);
        
        // PERBAIKAN: Langsung return objek, tanpa dibungkus 'json()'
        return {
            homepageData: {
                featuredPost: { ...featuredPost, excerpt },
                popularPosts,
                gridPosts,
                storyPosts,
                paginatedPosts,
                pagination: { currentPage: page, totalPages }
            }
        };
    } catch (e) {
        console.error("Error fetching homepage data:", e);
        throw error(500, "Gagal terhubung ke server.");
    }
};