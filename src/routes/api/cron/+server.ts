import { db } from '$lib/server/db'; 
import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export async function GET({ request }) {
  const authHeader = request.headers.get('Authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expected) {
    throw error(401, 'Unauthorized');
  }

  try {
    
    await db.$queryRaw`SELECT 1`;
    return json({ status: 'ok', message: 'Supabase pinged successfully' });
  } catch (err) {
    console.error('Cron ping error:', err);
    return json({ status: 'error', message: 'Ping failed' }, { status: 500 });
  }
}