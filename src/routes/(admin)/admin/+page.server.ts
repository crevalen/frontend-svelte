import { db } from '$lib/server/db';
import redis from '$lib/server/redis';
import type { PageServerLoad } from './$types';

const STATS_CACHE_KEY = 'dashboard:stats';
const POPULAR_POSTS_CACHE_KEY = 'dashboard:popular_posts';
const CACHE_TTL_SECONDS = 600; 

export const load: PageServerLoad = async ({ locals }) => {
	const [cachedStats, cachedPopularPosts] = await redis.mget(
		STATS_CACHE_KEY,
		POPULAR_POSTS_CACHE_KEY
	);

	let stats;
	let popularPosts;

	
	if (typeof cachedStats === 'string') {
		stats = JSON.parse(cachedStats);
	} else {
		const [postStats, categoryCount, tagCount, totalComments, pendingComments] =
			await Promise.all([
				db.post.aggregate({
					where: { authorId: locals.user?.id },
					_count: { id: true },
					_sum: { viewCount: true }
				}),
				db.category.count(),
				db.tag.count(),
				db.comment.count(),
				db.comment.count({ where: { isApproved: false } })
			]);

		stats = {
			posts: postStats._count.id,
			views: postStats._sum.viewCount ?? 0,
			categories: categoryCount,
			tags: tagCount,
			comments: totalComments,
			pendingComments: pendingComments
		};
		await redis.set(STATS_CACHE_KEY, JSON.stringify(stats), { ex: CACHE_TTL_SECONDS });
	}

	if (typeof cachedPopularPosts === 'string') {
		popularPosts = JSON.parse(cachedPopularPosts);
	} else {
		popularPosts = await db.post.findMany({
			where: { authorId: locals.user?.id },
			orderBy: { viewCount: 'desc' },
			take: 5,
			select: {
				title: true,
				slug: true,
				viewCount: true
			}
		});
		await redis.set(POPULAR_POSTS_CACHE_KEY, JSON.stringify(popularPosts), {
			ex: CACHE_TTL_SECONDS
		});
	}

	return {
		user: locals.user,
		stats,
		popularPosts
	};
};
