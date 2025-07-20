import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } from '$env/static/private';
import { PUBLIC_R2_URL } from '$env/static/public';
import sharp from 'sharp';
import { db } from './db';

const S3 = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY }
});

/**
 * Mengunggah gambar, membuat 3 ukuran (large, medium, thumb),
 * mengonversinya ke format WebP, dan menyimpan semua URL ke database.
 * @param file File gambar yang akan diunggah
 * @param altText Teks alternatif untuk gambar
 */
export async function uploadImage(file: File, altText?: string) {
	const imageBuffer = Buffer.from(await file.arrayBuffer());
	const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
	const keyPrefix = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9-]/g, '-')}`;

	// Definisikan ukuran-ukuran yang kita inginkan
	const sizes = {
		large: { width: 1200, key: `${keyPrefix}-large.webp` },
		medium: { width: 768, key: `${keyPrefix}-medium.webp` },
		thumb: { width: 300, key: `${keyPrefix}-thumb.webp` }
	};

	try {
		// Proses dan unggah semua ukuran secara paralel untuk efisiensi
		await Promise.all(
			Object.values(sizes).map(async (sizeInfo) => {
				const resizedBuffer = await sharp(imageBuffer)
					.resize({ width: sizeInfo.width, withoutEnlargement: true }) // Resize gambar
					.webp({ quality: 80 }) // Konversi ke WebP dengan kualitas 80%
					.toBuffer();

				const command = new PutObjectCommand({
					Bucket: R2_BUCKET_NAME,
					Key: sizeInfo.key,
					Body: resizedBuffer,
					ContentType: 'image/webp'
				});
				await S3.send(command);
			})
		);

		// Simpan semua URL ke dalam satu record di database
		const newMedia = await db.media.create({
			data: {
				key: keyPrefix, // Simpan key prefix sebagai referensi utama
				url: `${PUBLIC_R2_URL}/${sizes.large.key}`,
				url_medium: `${PUBLIC_R2_URL}/${sizes.medium.key}`,
				url_thumb: `${PUBLIC_R2_URL}/${sizes.thumb.key}`,
				size: file.size, // Ukuran file asli untuk referensi
				fileType: 'image/webp',
				altText: altText && altText.length > 0 ? altText : originalName
			}
		});

		return newMedia;

	} catch (err) {
		console.error("Image upload failed:", err);
		throw new Error('Gagal memproses dan meng-upload gambar.');
	}
}

/**
 * Menghapus sebuah file dari R2.
 * Catatan: Fungsi ini perlu diperbarui jika Anda ingin menghapus semua ukuran gambar sekaligus.
 * Saat ini, ia hanya akan menghapus satu file berdasarkan key yang diberikan.
 * @param key Key dari file yang akan dihapus
 */
export async function deleteImage(key: string) {
	const command = new DeleteObjectCommand({
		Bucket: R2_BUCKET_NAME,
		Key: key
	});
	try {
		await S3.send(command);
		return { success: true };
	} catch {
		throw new Error('Gagal menghapus file.');
	}
}