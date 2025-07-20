import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  try {
    // Panggil API yang sudah ada di CMS untuk mengambil data kategori beserta postingannya
    const response = await fetch(`https://cms-kustom.vercel.app/api/posts/kategori/${params.slug}`);

    if (!response.ok) {
      throw error(response.status, 'Kategori tidak ditemukan.');
    }

    const data = await response.json();
    
    // Kirim data (yang berisi info kategori dan array postingan) ke halaman
    return {
      category: data, // Objek 'category' berisi nama, slug, dll.
      posts: data.posts || [] // Array 'posts' berisi semua postingan di kategori itu
    };

  } catch (e: any) {
    if (e.status) {
      throw error(e.status, e.body.message);
    }
    throw error(500, 'Gagal terhubung ke server.');
  }
};