import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, fetch }) => {
  // 1. Tangkap hasil dari ketiga panggilan API
  const [pagesRes, settingsRes, popularRes] = await Promise.all([
    fetch('https://cms-kustom.vercel.app/api/pages'),
    fetch('https://cms-kustom.vercel.app/api/settings/public'),
    fetch('https://cms-kustom.vercel.app/api/posts/popular')
  ]);

  const pages = pagesRes.ok ? await pagesRes.json() : [];
  const settings = settingsRes.ok ? await settingsRes.json() : {};
  
  // 2. Proses hasil dari API postingan populer
  const popularPosts = popularRes.ok ? await popularRes.json() : [];

  return {
    url: url.pathname,
    pages,
    settings,
    popularPosts, // 3. Kirim data popularPosts ke halaman
  };
};