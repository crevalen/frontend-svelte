import { PUBLIC_SITE_URL } from '$env/static/public';

export function buildSchema(post: any, meta: any, settingsMap: any, contentHtml: string) {
	const finalUrl = meta.canonical;

	const plainText = contentHtml.replace(/<[^>]*>/g, '').trim();
	const wordCount = plainText.split(/\s+/).filter(Boolean).length;
	const keywords = post.tags?.length ? post.tags.map((tag: any) => tag.name).join(', ') : undefined;
	const articleCategory = post.categories?.[0]?.name || 'Artikel';

	const baseSchema: any = {
		'@context': 'https://schema.org',
		'@type': post.schemaType || 'BlogPosting',
		headline: meta.ogTitle, 
		description: meta.ogDescription,
		image: {
			'@type': 'ImageObject',
			url: meta.ogImage,
			width: 1200,
			height: 720
		},
		author: {
			'@type': 'Person',
			name: post.author?.displayName || post.author?.username || 'Redaksi',
			url: `${PUBLIC_SITE_URL}/penulis/${post.author?.username}`
		},
		
		publisher: {
			'@type': 'Organization',
			name: settingsMap.publisher_name || settingsMap.site_title || 'Crevalen',
			url: PUBLIC_SITE_URL,
			logo: {
				'@type': 'ImageObject',
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
		},
		inLanguage: 'id',
		isAccessibleForFree: true,
		datePublished: new Date(post.publishedAt || post.createdAt).toISOString(),
		dateModified: new Date(post.updatedAt || post.publishedAt).toISOString(),
		wordCount,
		articleSection: articleCategory,
		keywords,
		identifier: {
			'@type': 'PropertyValue',
			propertyID: 'slug',
			value: post.slug
		},
		articleBody: plainText
	};

	// Tipe khusus: NewsArticle
	if (baseSchema['@type'] === 'NewsArticle') {
		baseSchema.thumbnailUrl = meta.ogImage;
		baseSchema.genre = articleCategory;
		baseSchema.dateline = new Date(post.publishedAt || post.createdAt).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// Tipe khusus: FAQPage
	if (baseSchema['@type'] === 'FAQPage') {
		const faqPairs = contentHtml.match(/<h2>(.*?)<\/h2>([\s\S]*?)(?=(<h2>|$))/g) || [];
		baseSchema.mainEntity = faqPairs.map((pair) => {
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
		});
	}

	return baseSchema;
}
