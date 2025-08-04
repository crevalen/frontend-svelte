// src/routes/api/notifications/send/+server.ts

import { json, type RequestHandler } from '@sveltejs/kit'; 
import { Receiver } from '@upstash/qstash';
import { db } from '$lib/server/db';
import { sendNotificationToAll } from '$lib/server/notifications';
import {
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY
} from '$env/static/private';

const receiver = new Receiver({
    currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
    nextSigningKey: QSTASH_NEXT_SIGNING_KEY,
});

// Tipe RequestHandler sekarang diimpor langsung dari @sveltejs/kit
export const POST: RequestHandler = async ({ request }) => {
    // **PERBAIKAN 2**: Ekstrak signature dari header secara manual
    const signature = request.headers.get("Upstash-Signature");
    if (!signature) {
        return json({ error: "Missing signature" }, { status: 401 });
    }

    const body = await request.text(); // Ambil body sebagai teks mentah

    // Verifikasi menggunakan body mentah dan signature
    const isValid = await receiver.verify({
        body: body,
        signature: signature,
    }).catch(err => {
        console.error("Gagal memverifikasi request QStash:", err);
        return false;
    });

    if (!isValid) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    // Jika valid, lanjutkan proses
    try {
        const { postId } = JSON.parse(body); // Parse body setelah diverifikasi

        if (!postId) {
            return json({ error: "postId is required" }, { status: 400 });
        }
        
        const post = await db.post.findUnique({
            where: { id: postId },
            include: { categories: true, featuredImage: true }
        });

        if (!post) {
            return json({ error: "Post not found" }, { status: 404 });
        }
        
        await sendNotificationToAll(post);

        return json({ success: true, message: `Notifications triggered for post: ${post.id}` });

    } catch (error) {
        console.error("Gagal memproses notifikasi:", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
};