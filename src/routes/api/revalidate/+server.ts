import { REVALIDATE_TOKEN } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { path, token } = await request.json();

        // 1. Verifikasi token internal Anda (sudah benar)
        if (token !== REVALIDATE_TOKEN) {
            throw error(401, 'Token revalidasi tidak valid.');
        }
        if (!path || typeof path !== 'string') {
            throw error(400, 'Path tidak valid.');
        }

        // 2. Panggil Vercel ISR Webhook yang benar
        console.log(`Mencoba revalidasi untuk path: ${path}`);
        
        // Vercel menggunakan metode GET untuk webhook revalidasi path-based
        // dan token rahasianya dikirim sebagai query parameter 'secret'.
        const revalidateResponse = await fetch(
            `https://www.crevalen.xyz/api/revalidate?secret=${REVALIDATE_TOKEN}&path=${path}`,
            {
                method: 'GET'
            }
        );

        if (!revalidateResponse.ok) {
            const errorBody = await revalidateResponse.json();
            console.error('Vercel Revalidation Webhook gagal:', errorBody);
            throw error(500, `Vercel Webhook gagal: ${errorBody.message}`);
        }

        const responseData = await revalidateResponse.json();
        console.log(`Respon revalidasi dari Vercel:`, responseData);

        return json({ revalidated: true, path, vercelResponse: responseData });

    } catch (err: any) {
        console.error('Terjadi error saat proses revalidasi:', err);
        if (err.status) {
            throw err;
        }
        throw error(500, 'Proses revalidasi gagal total.');
    }
};