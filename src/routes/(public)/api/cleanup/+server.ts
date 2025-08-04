// File: src/routes/api/cleanup/+server.ts
import redis from '$lib/server/redis';
import { json } from '@sveltejs/kit';

export async function GET() {
    const keyToDelete = 'homepage:data:page:1';
    try {
        await redis.del(keyToDelete);
        console.log(`Cache key '${keyToDelete}' berhasil dihapus.`);
        return json({ success: true, message: `Cache key '${keyToDelete}' berhasil dihapus.` });
    } catch (e: any) {
        console.error(`Gagal menghapus cache key '${keyToDelete}':`, e);
        return json({ success: false, message: 'Gagal menghapus cache.', error: e.message }, { status: 500 });
    }
}