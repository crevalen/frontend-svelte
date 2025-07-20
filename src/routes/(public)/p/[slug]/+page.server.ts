import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
    const page = await db.page.findFirst({
        where: { slug: params.slug, published: true }
    });

    if (!page) {
        throw error(404, 'Halaman tidak ditemukan.');
    }

    const contentHtml = await marked.parse(page.content);

    return {
        page: { ...page, content: contentHtml }
    };
};