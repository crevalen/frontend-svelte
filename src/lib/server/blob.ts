import { put, del } from '@vercel/blob'; // <-- Impor fungsi 'del'
import { db } from './db';
import sharp from 'sharp';

/**
 * Mengunggah gambar ke Vercel Blob, membuat berbagai ukuran,
 * dan menyimpannya ke database.
 */
export async function uploadImage(file: File, altText?: string) {
	const imageBuffer = Buffer.from(await file.arrayBuffer());
	const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
	const keyPrefix = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9-]/g, '-')}`;

	const sizes = {
		large: { width: 1200, quality: 80, key: `${keyPrefix}-large.webp` },
		medium: { width: 768, quality: 75, key: `${keyPrefix}-medium.webp` },
		thumb: { width: 300, quality: 70, key: `${keyPrefix}-thumb.webp` },
		placeholder: { width: 20, quality: 20, key: `${keyPrefix}-placeholder.webp` }
	};

	try {
		const [largeBlob, mediumBlob, thumbBlob, placeholderBlob] = await Promise.all(
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

/**
 * Menghapus semua ukuran gambar yang terkait dengan satu key dari Vercel Blob.
 * @param keyPrefix - Key dasar dari media (tanpa suffix -large.webp, dll.)
 */
export async function deleteImage(keyPrefix: string) {
	const urlsToDelete = [
		`${keyPrefix}-large.webp`,
		`${keyPrefix}-medium.webp`,
		`${keyPrefix}-thumb.webp`,
		`${keyPrefix}-placeholder.webp`
	];

	try {
		await del(urlsToDelete); // Hapus semua file sekaligus
		return { success: true };
	} catch (err) {
		console.error("Image deletion from Vercel Blob failed:", err);
		throw new Error('Gagal menghapus file dari Vercel Blob.');
	}
}