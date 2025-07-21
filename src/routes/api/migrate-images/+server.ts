import { MIGRATE_SECRET } from '$env/static/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types'; // Error ini akan hilang setelah restart server

import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import axios from 'axios';

const db = new PrismaClient();

async function downloadImage(rawUrl: string): Promise<Buffer> {
	try {
		const encodedUrl = encodeURI(rawUrl);
		const response = await axios.get(encodedUrl, {
			responseType: 'arraybuffer',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});
		return response.data;
	} catch (err: any) {
		throw new Error(`Gagal mengunduh dengan axios: ${rawUrl} - Pesan: ${err.message}`);
	}
}

async function processAndUpload(buffer: Buffer, key: string, width: number, quality: number) {
	const resizedBuffer = await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality }).toBuffer();
	return put(key, resizedBuffer, { access: 'public', contentType: 'image/webp' });
}

export const GET: RequestHandler = async ({ url }) => { // Tipe 'url' sudah benar di sini
	const secret = url.searchParams.get('secret');
	if (secret !== MIGRATE_SECRET) {
		throw error(401, 'Unauthorized');
	}

	console.log('🚀 Memulai migrasi gambar dari Vercel Server...');
	const allMedia = await db.media.findMany();
	let successCount = 0;
	let errorCount = 0;

	for (const media of allMedia) {
		if (media.url.includes('vercel-storage.com')) continue;

		try {
			const imageBuffer = await downloadImage(media.url);
			const keyPrefix = media.key;
			const sizes = {
				large: { width: 1200, key: `${keyPrefix}-large.webp` },
				medium: { width: 768, key: `${keyPrefix}-medium.webp` },
				thumb: { width: 300, key: `${keyPrefix}-thumb.webp` },
				placeholder: { width: 20, key: `${keyPrefix}-placeholder.webp` }
			};
			const [large, medium, thumb, placeholder] = await Promise.all([
				processAndUpload(imageBuffer, sizes.large.key, 1200, 80),
				processAndUpload(imageBuffer, sizes.medium.key, 768, 75),
				processAndUpload(imageBuffer, sizes.thumb.key, 300, 70),
				processAndUpload(imageBuffer, sizes.placeholder.key, 20, 20)
			]);
			await db.media.update({ where: { id: media.id }, data: { url: large.url, url_medium: medium.url, url_thumb: thumb.url, url_placeholder: placeholder.url } });
			successCount++;
		} catch (e) {
			console.error(`Gagal memproses ${media.key}:`, (e as Error).message);
			errorCount++;
		}
	}

	const report = `🏁 Migrasi Selesai! Berhasil: ${successCount}, Gagal: ${errorCount}`;
	console.log(report);
	return json({ message: report });
};