import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import axios from 'axios'; // <-- 1. Impor axios

const db = new PrismaClient();

async function downloadImage(rawUrl: string): Promise<Buffer> {
  try {
    const encodedUrl = encodeURI(rawUrl);

    // --- PERBAIKAN: Ganti fetch dengan axios ---
    const response = await axios.get(encodedUrl, {
      responseType: 'arraybuffer', // 2. Minta data sebagai buffer
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    // --- SELESAI PERBAIKAN ---

    return response.data; // 3. Buffer ada di response.data
  } catch (err: any) {
    throw new Error(`Gagal mengunduh dengan axios: ${rawUrl} - Pesan: ${err.message}`);
  }
}

// --- Sisa dari file ini tidak ada perubahan sama sekali ---
async function processAndUpload(buffer: Buffer, key: string, width: number, quality: number) {
  const resizedBuffer = await sharp(buffer)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
  return put(key, resizedBuffer, { access: 'public', contentType: 'image/webp' });
}

async function migrateImages() {
  console.log('🚀 Memulai migrasi gambar dari R2 ke Vercel Blob...');
  const allMedia = await db.media.findMany();
  console.log(`✅ Ditemukan ${allMedia.length} media untuk dimigrasi.`);
  let successCount = 0;
  let errorCount = 0;

  for (const media of allMedia) {
    if (media.url.includes('vercel-storage.com')) {
      console.log(`⏩ Melewati ${media.key} (sudah di Vercel Blob).`);
      continue;
    }
    console.log(`----------------------------------------`);
    console.log(`🔄 Memproses: ${media.key}`);
    try {
      const imageBuffer = await downloadImage(media.url);
      console.log('   - Gambar berhasil diunduh dari R2.');
      const keyPrefix = media.key;
      const sizes = {
        large: { width: 1200, quality: 80, key: `${keyPrefix}-large.webp` },
        medium: { width: 768, quality: 75, key: `${keyPrefix}-medium.webp` },
        thumb: { width: 300, quality: 70, key: `${keyPrefix}-thumb.webp` },
        placeholder: { width: 20, quality: 20, key: `${keyPrefix}-placeholder.webp` }
      };
      const [largeBlob, mediumBlob, thumbBlob, placeholderBlob] = await Promise.all([
        processAndUpload(imageBuffer, sizes.large.key, sizes.large.width, sizes.large.quality),
        processAndUpload(imageBuffer, sizes.medium.key, sizes.medium.width, sizes.medium.quality),
        processAndUpload(imageBuffer, sizes.thumb.key, sizes.thumb.width, sizes.thumb.quality),
        processAndUpload(imageBuffer, sizes.placeholder.key, sizes.placeholder.width, sizes.placeholder.quality)
      ]);
      console.log('   - Semua ukuran berhasil diunggah ke Vercel Blob.');
      await db.media.update({
        where: { id: media.id },
        data: {
          url: largeBlob.url,
          url_medium: mediumBlob.url,
          url_thumb: thumbBlob.url,
          url_placeholder: placeholderBlob.url
        }
      });
      console.log('   - Database berhasil diperbarui.');
      successCount++;
    } catch (error) {
      console.error(`❌ Gagal memproses ${media.key}:`, (error as Error).message);
      errorCount++;
    }
  }

  console.log('----------------------------------------');
  console.log('🏁 Migrasi Selesai!');
  console.log(`👍 Berhasil: ${successCount}`);
  console.log(`👎 Gagal: ${errorCount}`);
}

migrateImages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });