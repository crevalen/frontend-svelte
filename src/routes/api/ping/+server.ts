// src/routes/api/ping/+server.ts
import { db } from '$lib/server/db'; 
import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    
    await db.$queryRaw`SELECT 1`;

    return json({ status: 'ok', message: 'Supabase pinged successfully' });
  } catch (error) {
    console.error('Ping error:', error);
    return json({ status: 'error', message: 'Failed to ping Supabase' }, { status: 500 });
  }
}
