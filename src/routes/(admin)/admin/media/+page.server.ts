import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';

// --- PERBAIKAN: Impor uploadImage dan deleteImage dari blob.ts ---
import { uploadImage, deleteImage } from '$lib/server/blob'; 

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
        const altText = formData.get('altText') as string;

        if (!image || image.size === 0) {
            return fail(400, { success: false, message: 'Silakan pilih file untuk di-upload.' });
        }
        try {
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
        const title = formData.get('title') as string;
        const caption = formData.get('caption') as string;
        const filename = formData.get('filename') as string;

        if (!id) return fail(400, { success: false, message: 'ID file tidak valid.' });
        
        try {
            await db.media.update({ 
                where: { id }, 
                data: { 
                    altText,
                    title,
                    caption,
                    filename
                } 
            });
        } catch {
            return fail(500, { success: false, message: 'Gagal memperbarui detail media.' });
        }
        return { success: true, message: 'Detail media berhasil disimpan.' };
    },

    deleteFile: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const key = formData.get('key') as string;

        if (!id || !key) return fail(400, { success: false, message: 'ID atau Key file tidak valid.' });
        try {
            // Panggil deleteImage dari blob.ts, lalu hapus dari DB
            await Promise.all([
                deleteImage(key), 
                db.media.delete({ where: { id } })
            ]);
        } catch {
            return fail(500, { success: false, message: 'Gagal menghapus file.' });
        }
        return { success: true, message: 'File dihapus.' };
    }
};