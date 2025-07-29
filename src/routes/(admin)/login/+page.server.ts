// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { verifyPassword, createSession } from '$lib/server/auth';


const MAX_ATTEMPTS_USER = 5;
const MAX_ATTEMPTS_IP = 100;
const BLOCK_WINDOW_MS = 60 * 60 * 1000; // 1 jam

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
		const ip = event.getClientAddress?.() || '0.0.0.0';

		if (typeof username !== 'string' || username.trim().length < 3) {
			return fail(400, { error: 'Username tidak valid' });
		}
		if (typeof password !== 'string' || password.trim().length < 6) {
			return fail(400, { error: 'Password tidak valid' });
		}

		
		const recentIpAttempts = await db.loginAttempt.count({
			where: {
				ip,
				createdAt: { gte: new Date(Date.now() - BLOCK_WINDOW_MS) }
			}
		});
		if (recentIpAttempts >= MAX_ATTEMPTS_IP) {
			return fail(429, { error: 'Terlalu banyak percobaan login dari IP ini. Coba lagi nanti.' });
		}

		
		const user = await db.user.findUnique({ where: { username } });
		if (!user) {
			await db.loginAttempt.create({ data: { ip, success: false } });
			return fail(400, { error: 'Username atau password salah' });
		}

		
		const recentUserAttempts = await db.loginAttempt.count({
			where: {
				userId: user.id,
				success: false,
				createdAt: { gte: new Date(Date.now() - BLOCK_WINDOW_MS) }
			}
		});
		if (recentUserAttempts >= MAX_ATTEMPTS_USER) {
			return fail(429, { error: 'Terlalu banyak percobaan login gagal. Tunggu beberapa saat.' });
		}

		
		const validPassword = await verifyPassword(user.passwordHash, password);
		if (!validPassword) {
			await db.loginAttempt.create({ data: { userId: user.id, ip, success: false } });
			return fail(400, { error: 'Username atau password salah' });
		}

		
		await db.loginAttempt.create({ data: { userId: user.id, ip, success: true } });

		const userAgent = event.request.headers.get('user-agent') || '';
		const rawToken = await createSession(user.id, userAgent, ip);

		event.cookies.set('session', rawToken, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(302, '/admin');
	}
};
