import { PUBLIC_FRONTEND_URL } from '$env/static/public'; 
import { REVALIDATE_TOKEN } from '$env/static/private';

export async function revalidateFrontendPath(path: string) {
  if (!PUBLIC_FRONTEND_URL) {
    console.warn('PUBLIC_FRONTEND_URL tidak diatur, revalidasi dilewati.');
    return;
  }
  try {
    await fetch(`${PUBLIC_FRONTEND_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, token: REVALIDATE_TOKEN })
    });
    console.log(`Permintaan revalidasi dikirim untuk: ${path}`);
  } catch (err) {
    console.error(`Gagal memanggil API revalidate untuk ${path}:`, err);
  }
}