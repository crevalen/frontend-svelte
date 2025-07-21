import { REVALIDATE_TOKEN, VERCEL_ACCESS_TOKEN, VERCEL_PROJECT_ID } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { path, token } = await request.json();

        if (token !== REVALIDATE_TOKEN) {
            throw error(401, 'Invalid revalidation token');
        }
        if (!path || typeof path !== 'string') {
            throw error(400, 'Invalid path provided');
        }

        // Panggil API Vercel untuk Revalidasi
        const revalidateResponse = await fetch(
            `https://api.vercel.com/v1/revalidate?path=${encodeURIComponent(path)}&teamId=${process.env.VERCEL_TEAM_ID || ''}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${VERCEL_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    projectIds: [VERCEL_PROJECT_ID]
                })
            }
        );

        if (!revalidateResponse.ok) {
            const errorBody = await revalidateResponse.json();
            console.error('Vercel Revalidation API gagal:', errorBody);
            throw error(500, `Vercel Revalidation API gagal: ${errorBody.error.message}`);
        }

        return json({ revalidated: true, path });

    } catch (err: any) {
        console.error('Revalidation error:', err);
        if (err.status) { throw err; }
        throw error(500, 'Revalidation failed');
    }
};