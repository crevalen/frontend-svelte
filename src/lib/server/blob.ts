import { put } from '@vercel/blob';
import { db } from './db';
import sharp from 'sharp';

/**
 * Mengunggah gambar ke Vercel Blob, membuat 3 ukuran (large, medium, thumb),
 * mengonversinya ke format WebP, dan menyimpan semua URL ke database.
 * @param file File gambar yang akan diunggah
 * @param altText Teks alternatif untuk gambar
 */
export async function uploadImage(file: File, altText?: string) {
	const imageBuffer = Buffer.from(await file.arrayBuffer());
	const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
	const keyPrefix = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9-]/g, '-')}`;

	const sizes = {
		large: { width: 1200, quality: 80, key: `${keyPrefix}-large.webp` },
		medium: { width: 768, quality: 75, key: `${keyPrefix}-medium.webp` },
		thumb: { width: 300, quality: 70, key: `${keyPrefix}-thumb.webp` }
	};

	try {
		// Proses dan unggah semua ukuran secara paralel
		const [largeBlob, mediumBlob, thumbBlob] = await Promise.all(
			Object.values(sizes).map(async (sizeInfo) => {
				const resizedBuffer = await sharp(imageBuffer)
					.resize({ width: sizeInfo.width, withoutEnlargement: true })
					.webp({ quality: sizeInfo.quality })
					.toBuffer();

				return put(sizeInfo.key, resizedBuffer, {
					access: 'public',
					contentType: 'image/webp'
				});
			})
		);

		// Simpan semua URL dari hasil upload ke database
		const newMedia = await db.media.create({
			data: {
				key: keyPrefix,
				url: largeBlob.url,
				url_medium: mediumBlob.url,
				url_thumb: thumbBlob.url,
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

// Anda bisa menambahkan fungsi deleteImage di sini nanti jika perlu