import { sequence } from '@sveltejs/kit/hooks';
import { validateSession } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

// Handler untuk Autentikasi Admin
const handleAuth: Handle = async ({ event, resolve }) => {
   const sessionId = event.cookies.get('session_id');
   if (sessionId) {
       const { user, session } = await validateSession(sessionId);
       event.locals.user = user;
       event.locals.session = session;
   }
   return resolve(event);
};

// Handler untuk CORS (masih dibutuhkan untuk view counter, dll)
const handleCors: Handle = async ({ event, resolve }) => {
   const allowedOrigins = ['http://localhost:5173', 'https://www.crevalen.xyz']; // Tambahkan domain lain jika perlu
   const origin = event.request.headers.get('Origin');

   if (event.request.method === 'OPTIONS') {
       if (origin && allowedOrigins.includes(origin)) {
           return new Response(null, {
               headers: {
                   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                   'Access-Control-Allow-Origin': origin,
                   'Access-Control-Allow-Headers': 'Content-Type'
               }
           });
       }
   }

   const response = await resolve(event);
   if (origin && allowedOrigins.includes(origin)) {
       response.headers.set('Access-Control-Allow-Origin', origin);
   }
   return response;
};

export const handle = sequence(handleAuth, handleCors);