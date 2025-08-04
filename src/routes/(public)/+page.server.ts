import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import redis from '$lib/server/redis';
import he from 'he';

// --- Mengadopsi pola dari kode Anda ---
const getCacheKey = (page: number) => `homepage:data:page:${page}`;
const CACHE_TTL_SECONDS = 300; // Cache untuk 5 menit di homepage

export const load: PageServerLoad = async ({ url, setHeaders }) => {
    // 1. Tetap gunakan cache Vercel ISR untuk HTML
    // Ini akan menyimpan file HTML statis di Edge selama 5 menit
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=300' });

    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = 10;
    const cacheKey = getCacheKey(page);

    try {
        // 2. Coba ambil data dari Redis
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            // Jika ada, langsung kembalikan data dari cache
            return JSON.parse(cachedData); 
        }

        // 3. Jika tidak ada di cache, lakukan query ke database
        const totalPosts = await db.post.count({ where: { published: true } });
        const totalPages = Math.ceil(totalPosts / limit);

        const paginatedPosts = await db.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: { categories: { take: 1 }, author: true, featuredImage: true }
        });

        // Objek untuk menampung semua data
        let homepageData;

        if (page > 1) {
            // Jika halaman lebih dari 1, hanya kirim data paginasi
            homepageData = {
                featuredPost: null,
                popularPosts: [],
                gridPosts: [],
                storyPosts: [],
                paginatedPosts,
                pagination: { currentPage: page, totalPages }
            };
        } else {
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
                return { homepageData: { featuredPost: null, popularPosts: [], gridPosts: [], storyPosts: [], paginatedPosts: [], pagination: { currentPage: page, totalPages: 0 } } };
            }

            const plainTextContent = featuredPost.content.replace(/<[^>]*>/g, '');
            const decodedText = he.decode(plainTextContent);
            const excerpt = decodedText.substring(0, 150) + '...';

            homepageData = {
                featuredPost: { ...featuredPost, excerpt },
                popularPosts,
                gridPosts,
                storyPosts,
                paginatedPosts,
                pagination: { currentPage: page, totalPages }
            };
        }
        
        const dataToCache = { homepageData };

        // 4. Simpan hasil lengkap ke Redis menggunakan sintaks Anda
        await redis.set(cacheKey, JSON.stringify(dataToCache), { ex: CACHE_TTL_SECONDS });
        
        return dataToCache;

    } catch (e) {
        console.error(`Gagal memuat data untuk homepage halaman ${page}:`, e);
        throw error(500, 'Gagal terhubung ke server.');
    }
};