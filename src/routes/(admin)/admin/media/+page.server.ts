import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';

// --- PERUBAHAN UTAMA DI SINI ---
// Impor fungsi upload dari file Vercel Blob yang baru
import { uploadImage } from '$lib/server/blob'; 
// Impor fungsi delete lama (jika masih diperlukan untuk file lama)
import { deleteImage as deleteImageFromR2 } from '$lib/server/r2'; 
// --- SELESAI PERUBAHAN ---

export const load: PageServerLoad = async () => {
    const media = await db.media.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return { media };
};

export const actions: Actions = {
    uploadFile: async ({ request }) => {
        const formData = await request.formData();
        const image = formData.get('image') as File;
        // Ambil alt text saat upload
        const altText = formData.get('altText') as string;

        if (!image || image.size === 0) {
            return fail(400, { success: false, message: 'Silakan pilih file untuk di-upload.' });
        }
        try {
            // Panggil fungsi uploadImage yang baru dengan altText
            await uploadImage(image, altText);
        } catch {
            return fail(500, { success: false, message: 'Gagal meng-upload gambar.' });
        }
        return { success: true, message: 'Upload berhasil!' };
    },

    editFile: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const altText = formData.get('altText') as string;

        if (!id) return fail(400, { success: false, message: 'ID file tidak valid.' });
        try {
            await db.media.update({ where: { id }, data: { altText } });
        } catch {
            return fail(500, { success: false, message: 'Gagal memperbarui alt text.' });
        }
        return { success: true, message: 'Alt text disimpan.' };
    },

    deleteFile: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const key = formData.get('key') as string;

        if (!id || !key) return fail(400, { success: false, message: 'ID atau Key file tidak valid.' });
        try {
            // Catatan: Fungsi deleteImage saat ini masih mengarah ke R2.
            // Anda perlu membuat fungsi delete baru untuk Vercel Blob jika ingin menghapus file yang diunggah ke sana.
            await Promise.all([
                deleteImageFromR2(key), // Hati-hati, ini untuk file lama di R2
                db.media.delete({ where: { id } })
            ]);
        } catch {
            return fail(500, { success: false, message: 'Gagal menghapus file.' });
        }
        return { success: true, message: 'File dihapus.' };
    }
};