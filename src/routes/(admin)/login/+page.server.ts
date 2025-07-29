// src/routes/login/+page.server.ts

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { verifyPassword, createSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, '/admin');
    }
};

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        // Validasi input
        if (typeof username !== 'string' || username.trim().length < 3) {
            return fail(400, { error: 'Username tidak valid' });
        }
        if (typeof password !== 'string' || password.trim().length < 6) {
            return fail(400, { error: 'Password tidak valid' });
        }

        // Cari user
        const user = await db.user.findUnique({
            where: { username }
        });

        if (!user) {
            return fail(400, { error: 'Username atau password salah' });
        }

        // Verifikasi password
        const validPassword = await verifyPassword(user.passwordHash, password);
        if (!validPassword) {
            return fail(400, { error: 'Username atau password salah' });
        }

        // Ambil user-agent & IP
        const userAgent = event.request.headers.get('user-agent') || '';
        const ip =
            event.getClientAddress?.() ||
            event.request.headers.get('x-forwarded-for') ||
            '0.0.0.0';

        // Buat session aman (mengembalikan raw token, DB hanya menyimpan hash)
        const rawToken = await createSession(user.id, userAgent, ip);

        // Simpan cookie HttpOnly aman
        event.cookies.set('session', rawToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30 // 30 hari
        });

        throw redirect(302, '/admin');
    }
};
