import { PUBLIC_SITE_URL } from '$env/static/public';

// Fungsi ini akan berisi logika untuk membuat skema JSON-LD yang lengkap dan SEO-friendly
export function buildSchema(post: any, meta: any, settingsMap: any, contentHtml: string) {
	const finalUrl = meta.canonical;

	// Bersihkan tag HTML untuk teks murni
	const plainText = contentHtml.replace(/<[^>]*>/g, '').trim();
	const wordCount = plainText.split(/\s+/).filter(Boolean).length;

	// Buat array keyword jika tersedia
	const keywords = post.tags?.length ? post.tags.map((tag: any) => tag.name).join(', ') : undefined;

	const baseSchema: any = {
		'@context': 'https://schema.org',
		'@type': post.schemaType || 'BlogPosting',
		headline: meta.ogTitle?.slice(0, 110),
		description: meta.ogDescription,
		image: {
  			'@type': 'ImageObject',
  			url: meta.ogImage,
  			width: 1200, 
  			height: 720  
},
		datePublished: new Date(post.publishedAt || post.createdAt).toISOString(),
		dateModified: new Date(post.updatedAt).toISOString(),
		wordCount,
		author: {
			'@type': 'Person',
			name: post.author?.displayName || post.author?.username || 'Redaksi',
			url: `${PUBLIC_SITE_URL}/penulis/${post.author?.username}`
		},
		publisher: {
			'@type': 'Organization',
			name: settingsMap.publisher_name || settingsMap.site_title || 'Crevalen',
			url: `${PUBLIC_SITE_URL}`,
			logo: {
				'@type': 'ImageObject',
				// Prioritaskan logo publisher, lalu logo situs, baru OG image
				url: settingsMap.publisher_logo_url || 'https://www.crevalen.xyz/publisher.png',
				width: 600,
  				height: 60


			}
		},
		mainEntityOfPage: {
  		'@type': 'WebPage',
  		'@id': finalUrl,
  		url: finalUrl,
		name: meta.ogTitle
}
	};

	// Tambahkan field spesifik berdasarkan tipe skema
	switch (baseSchema['@type']) {
		case 'NewsArticle':
			return {
				...baseSchema,
				dateline: new Date(post.publishedAt || post.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric'
                }),
				articleSection: post.categories[0]?.name || 'Berita',
				keywords
			};

		case 'Article':
		case 'BlogPosting':
			return {
				...baseSchema,
				articleSection: post.categories[0]?.name || 'Artikel',
				keywords,
				articleBody: plainText
			};

		case 'FAQPage':
			const faqPairs =
				contentHtml.match(/<h2>(.*?)<\/h2>([\s\S]*?)(?=(<h2>|$))/g) || [];
			return {
				...baseSchema,
				mainEntity: faqPairs.map((pair) => {
					const questionMatch = pair.match(/<h2>(.*?)<\/h2>/);
					const answerMatch = pair.replace(/<h2>.*?<\/h2>/, '').trim();
					return {
						'@type': 'Question',
						name: questionMatch ? questionMatch[1].trim() : '',
						acceptedAnswer: {
							'@type': 'Answer',
							text: answerMatch.replace(/<[^>]*>/g, '').trim()
						}
					};
				})
			};

		default:
			return baseSchema;
	}
}