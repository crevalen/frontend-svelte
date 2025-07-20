import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ url }) => {
  const [pages, settings, popularPosts] = await Promise.all([
    db.page.findMany({
      where: { published: true },
      select: { title: true, slug: true },
      orderBy: { createdAt: 'asc' }
    }),
    db.setting.findMany(), // Mengambil semua setting
    db.post.findMany({
      where: { published: true },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: {
        title: true,
        slug: true,
        publishedAt: true,
        featuredImage: { select: { url: true } },
        categories: { select: { name: true, slug: true }, take: 1 }
      }
    })
  ]);

  const settingsMap = settings.reduce((acc: any, setting: { key: string | number; value: any; }) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});

  return {
    url: url.pathname,
    pages,
    settings: settingsMap,
    popularPosts,
  };
};