import { sequence } from '@sveltejs/kit/hooks';
import { validateSession } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
    // Gunakan nama cookie konsisten dengan login endpoint
    const rawToken = event.cookies.get('session');

    if (rawToken) {
        // Ambil user-agent & IP
        const userAgent = event.request.headers.get('user-agent') || '';
        const ip = event.getClientAddress(); // SvelteKit 1.0+, otomatis ambil IP

        // Validasi session
        const { user, session } = await validateSession(rawToken, userAgent, ip);
        event.locals.user = user;
        event.locals.session = session;
    } else {
        event.locals.user = null;
        event.locals.session = null;
    }

    return resolve(event);
};

const handleCors: Handle = async ({ event, resolve }) => {
    const allowedOrigins = ['http://localhost:5173', 'https://www.crevalen.xyz'];
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