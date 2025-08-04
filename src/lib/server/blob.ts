import { put, del } from '@vercel/blob';
import { db } from './db';
import sharp from 'sharp';

export async function uploadImage(file: File, altText?: string) {
	const imageBuffer = Buffer.from(await file.arrayBuffer());
	const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
	const keyPrefix = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9-]/g, '-')}`;

    // ## PERUBAHAN 1: Tambahkan ukuran 'small' dan sesuaikan kualitas ##
	const sizes = {
		large: { width: 1200, quality: 75, key: `${keyPrefix}-large.webp` },
		medium: { width: 768, quality: 70, key: `${keyPrefix}-medium.webp` },
		small: { width: 500, quality: 65, key: `${keyPrefix}-small.webp` }, // <-- UKURAN BARU
		thumb: { width: 300, quality: 60, key: `${keyPrefix}-thumb.webp` },
		placeholder: { width: 20, quality: 20, key: `${keyPrefix}-placeholder.webp` }
	};

	try {
		const [largeBlob, mediumBlob, smallBlob, thumbBlob, placeholderBlob] = await Promise.all(
			Object.values(sizes).map(async (sizeInfo) => {
				const resizedBuffer = await sharp(imageBuffer)
					.resize({ width: sizeInfo.width, withoutEnlargement: true })
					.webp({ quality: sizeInfo.quality })
					.toBuffer();
				return put(sizeInfo.key, resizedBuffer, { access: 'public', contentType: 'image/webp' });
			})
		);

		const newMedia = await db.media.create({
			data: {
				key: keyPrefix,
				url: largeBlob.url,
				url_medium: mediumBlob.url,
				url_small: smallBlob.url, // <-- Simpan URL baru ke DB
				url_thumb: thumbBlob.url,
				url_placeholder: placeholderBlob.url,
				size: file.size,
				fileType: 'image/webp',
				altText: altText || originalName
			}
		});

		return newMedia;
	} catch (err) {
		console.error("Image upload to Vercel Blob failed:", err);
		throw new Error('Gagal memproses dan meng-upload gambar.');
	}
}

export async function deleteImage(keyPrefix: string) {
    // ## PERUBAHAN 2: Tambahkan 'small' saat menghapus ##
	const urlsToDelete = [
		`${keyPrefix}-large.webp`,
		`${keyPrefix}-medium.webp`,
		`${keyPrefix}-small.webp`, // <-- Hapus juga ukuran small
		`${keyPrefix}-thumb.webp`,
		`${keyPrefix}-placeholder.webp`
	];

	try {
		await del(urlsToDelete);
		return { success: true };
	} catch (err) {
		console.error("Image deletion from Vercel Blob failed:", err);
		throw new Error('Gagal menghapus file dari Vercel Blob.');
	}
}