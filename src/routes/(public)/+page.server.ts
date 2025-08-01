// src/routes/+page.server.ts

import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import he from 'he';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = 10;

    try {
        const totalPosts = await db.post.count({ where: { published: true } });
        const totalPages = Math.ceil(totalPosts / limit);

        const paginatedPosts = await db.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: { categories: { take: 1 }, author: true, featuredImage: true }
        });

        // Jika halaman lebih dari 1, hanya kirim data paginasi
        if (page > 1) {
            return {
                homepageData: {
                    featuredPost: null,
                    popularPosts: [],
                    gridPosts: [],
                    storyPosts: [],
                    paginatedPosts,
                    pagination: { currentPage: page, totalPages }
                }
            };
        }

        // Jika halaman 1, ambil semua data seperti sebelumnya
        const [ featuredPost, popularPosts, gridPosts, storyPosts ] = await Promise.all([
            db.post.findFirst({
                where: { published: true },
                orderBy: { createdAt: 'desc' },
                include: { categories: { take: 1 }, featuredImage: true }
            }),
            db.post.findMany({
                where: { published: true },
                orderBy: { viewCount: 'desc' },
                take: 5,
                include: { categories: { take: 1 }, featuredImage: true }
            }),
            db.post.findMany({
                where: { published: true, categories: { some: { slug: 'tips' } } },
                orderBy: { createdAt: 'desc' },
                take: 6,
                include: { categories: { take: 1 }, featuredImage: true }
            }),
            db.post.findMany({
                where: { published: true, categories: { some: { slug: 'story' } } },
                orderBy: { createdAt: 'desc' },
                take: 4,
                include: { categories: { take: 1 }, featuredImage: true }
            })
        ]);

        if (!featuredPost) {
             // Fallback jika tidak ada post sama sekali
            return { homepageData: { featuredPost: null, popularPosts: [], gridPosts: [], storyPosts: [], paginatedPosts: [], pagination: { currentPage: page, totalPages: 0 } } };
        }

        const plainTextContent = featuredPost.content.replace(/<[^>]*>/g, '');
        const decodedText = he.decode(plainTextContent);
        const excerpt = decodedText.substring(0, 150) + '...';

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