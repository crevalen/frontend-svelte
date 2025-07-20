import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		// 1. Ambil konten robots.txt dari API CMS Anda
		const response = await fetch('https://cms-kustom.vercel.app/api/robots.txt');

		if (!response.ok) {
			// Jika API CMS error, kembalikan response error agar kita tahu
			console.error('CMS API for robots.txt failed:', response.statusText);
			return new Response('Error fetching robots.txt from CMS', { status: 500 });
		}

		// 2. Ambil kontennya sebagai teks biasa
		const content = await response.text();

		// 3. Kembalikan konten tersebut dengan header yang benar
		return new Response(content, {
			headers: {
				'Content-Type': 'text/plain'
			}
		});
	} catch (e) {
		console.error("Failed to proxy robots.txt:", e);
		return new Response('Server error while fetching robots.txt', { status: 500 });
	}
};