import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import redis from '$lib/server/redis';
import he from 'he';

const getCacheKey = (page: number) => `homepage:data:page:${page}`;
const CACHE_TTL_SECONDS = 300;

export const load: PageServerLoad = async ({ url, setHeaders }) => {
    setHeaders({ 'Cache-Control': 'public, max-age=0, s-maxage=300' });

    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = 10;
    const cacheKey = getCacheKey(page);

    // 1. Coba ambil data dari Redis
    const cachedData = await redis.get(cacheKey);

    if (typeof cachedData === 'string') {
        try {
            // ## PERBAIKAN UTAMA ADA DI SINI ##
            // Coba parse data. Jika berhasil, kembalikan.
            return JSON.parse(cachedData);
        } catch (e) {
            // JIKA GAGAL, berarti cache rusak. Jangan panik.
            console.warn(
                `Cache untuk homepage (key: ${cacheKey}) terdeteksi rusak. Cache akan dihapus dan data akan dimuat ulang dari database.`
            );
            // Hapus kunci yang rusak agar tidak menyebabkan error lagi di masa depan.
            await redis.del(cacheKey);
            // Setelah dihapus, biarkan kode melanjutkan ke langkah berikutnya seolah-olah cache tidak ada.
        }
    }

    // Kode akan sampai di sini jika:
    // a) Cache tidak ada (cache miss).
    // b) Cache ada tapi rusak (dan sekarang sudah dihapus).
    try {
        console.log(`Memuat data homepage dari database untuk halaman ${page}...`);

        const totalPosts = await db.post.count({ where: { published: true } });
        const totalPages = Math.ceil(totalPosts / limit);

        const paginatedPosts = await db.post.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: { categories: { take: 1 }, author: true, featuredImage: true }
        });

        let homepageData;

        if (page > 1) {
            homepageData = {
                featuredPost: null,
                popularPosts: [],
                gridPosts: [],
                storyPosts: [],
                paginatedPosts,
                pagination: { currentPage: page, totalPages }
            };
        } else {
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

        // Simpan data yang baru dan bersih ke Redis
        await redis.set(cacheKey, JSON.stringify(dataToCache), { ex: CACHE_TTL_SECONDS });
        
        return dataToCache;

    } catch (e) {
        console.error(`Gagal memuat data homepage dari database:`, e);
        throw error(500, 'Gagal terhubung ke server.');
    }
};