// src/lib/utils/formatters.ts

/**
 * Memformat tanggal dari string atau objek Date ke format Indonesia.
 */
export function formatDate(dateInput: string | Date): string {
  // Ubah input menjadi objek Date, tidak peduli format aslinya
  const date = new Date(dateInput);
  
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Menghitung estimasi waktu baca dari sebuah teks.
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const textOnly = content.replace(/<[^>]+>/g, ' ');
  const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes > 0 ? minutes : 1;
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}