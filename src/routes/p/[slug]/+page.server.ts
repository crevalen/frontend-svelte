import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const response = await fetch(`https://cms-kustom.vercel.app/api/pages/${params.slug}`);
    if (!response.ok) {
      throw error(response.status, 'Halaman tidak ditemukan.');
    }
    const pageData = await response.json();
    return { page: pageData };
  } catch (e: any) {
    throw error(e.status || 500, e.body?.message || 'Gagal memuat halaman.');
  }
};