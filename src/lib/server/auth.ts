// src/lib/server/auth.ts

import { db } from './db';
import { TimeSpan, createDate } from 'oslo';
import { randomBytes, createHash } from 'crypto';
import { Argon2id } from 'oslo/password';

// Konstanta
const SESSION_TTL = new TimeSpan(30, 'd'); // 30 hari
const argon2id = new Argon2id();
const LOGIN_ATTEMPT_LIMIT = 5; // max attempt per 15 menit

// --- UTILITAS ---
function hashToken(token: string) {
	return createHash('sha256').update(token).digest('hex');
}

function getExpiryDate() {
	return createDate(SESSION_TTL);
}

// --- MANAJEMEN SESI ---

/**
 * Membuat sesi baru untuk pengguna.
 */
export async function createSession(userId: string, userAgent: string, ip: string) {
	await db.session.deleteMany({
		where: { userId, expiresAt: { lt: new Date() } }
	});

	const rawToken = randomBytes(64).toString('hex'); // 512-bit entropy
	const tokenHash = hashToken(rawToken);

	await db.session.create({
		data: {
			id: tokenHash,
			userId,
			expiresAt: getExpiryDate(),
			userAgent,
			ip
		}
	});

	// Token mentah hanya dikirim via cookie aman
	return rawToken;
}

/**
 * Validasi sesi + rolling expiration.
 */
export async function validateSession(rawToken: string, currentUA: string, currentIP: string) {
	if (!rawToken) return { user: null, session: null };

	const tokenHash = hashToken(rawToken);

	const session = await db.session.findUnique({
		where: { id: tokenHash },
		include: { user: { select: { id: true, username: true } } }
	});

	if (!session || !session.user) return { user: null, session: null };

	// Cek expiry
	if (session.expiresAt < new Date()) {
		await db.session.delete({ where: { id: tokenHash } });
		return { user: null, session: null };
	}

	// Bind ke User-Agent/IP
	if (session.userAgent !== currentUA || session.ip !== currentIP) {
		await db.session.delete({ where: { id: tokenHash } });
		return { user: null, session: null };
	}

	// Rolling expiration
	const newExpiry = getExpiryDate();
	await db.session.update({
		where: { id: tokenHash },
		data: { expiresAt: newExpiry }
	});

	return { user: session.user, session: { id: tokenHash, userId: session.userId, expiresAt: newExpiry } };
}

/**
 * Logout sesi tertentu.
 */
export async function invalidateSession(rawToken: string) {
	const tokenHash = hashToken(rawToken);
	await db.session.deleteMany({ where: { id: tokenHash } });
}

/**
 * Hapus semua sesi milik user (misalnya setelah reset password).
 */
export async function invalidateAllSessions(userId: string) {
	await db.session.deleteMany({ where: { userId } });
}

// --- MANAJEMEN PASSWORD ---

export async function hashPassword(password: string) {
	return await argon2id.hash(password);
}

export async function verifyPassword(hash: string, password: string) {
	return await argon2id.verify(hash, password);
}

// --- RATE LIMIT LOGIN (basic) ---
export async function registerLoginAttempt(userId: string) {
	const now = new Date();
	await db.loginAttempt.create({ data: { userId, createdAt: now } });
}

export async function isLoginBlocked(userId: string) {
	const cutoff = new Date(Date.now() - 15 * 60 * 1000); // 15 menit
	const attempts = await db.loginAttempt.count({
		where: { userId, createdAt: { gte: cutoff } }
	});
	return attempts >= LOGIN_ATTEMPT_LIMIT;
}

/**
 * ⚠️ CATATAN PENTING:
 * Saat mengirim cookie sesi, gunakan opsi:
 * - HttpOnly: true
 * - Secure: true
 * - SameSite: 'Strict'
 * - maxAge: 30 hari
 * dan gunakan header `Set-Cookie` dengan `rawToken`.
 */
