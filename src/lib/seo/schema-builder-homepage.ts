import { PUBLIC_SITE_URL } from '$env/static/public';

type Post = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  schemaType?: string;
  categories: { slug: string }[];
  author?: { displayName: string; username?: string };
  featuredImage?: { url: string };
};

export function buildHomepageSchema({
  popularPosts,
  gridPosts,
  storyPosts
}: {
  popularPosts: Post[];
  gridPosts: Post[];
  storyPosts: Post[];
}) {
  const getSchemaType = (post: Post) => post.schemaType || 'BlogPosting';

  function createItemListSchema(name: string, posts: Post[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name,
      itemListOrder: 'http://schema.org/ItemListOrderDescending',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': getSchemaType(post),
          name: post.title,
          headline: post.title,
          url: `${PUBLIC_SITE_URL}/${post.categories?.[0]?.slug ?? 'post'}/${post.slug}`,
          author: post.author?.displayName
            ? {
                '@type': 'Person',
                name: post.author.displayName
              }
            : undefined,
          image: post.featuredImage?.url
            ? {
                '@type': 'ImageObject',
                url: post.featuredImage.url
              }
            : undefined,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          description: post.excerpt,
          publisher: {
            '@id': `${PUBLIC_SITE_URL}/#organization`
          },
          inLanguage: 'id'
        }
      }))
    };
  }

  function createArticleSchemas(posts: Post[]) {
    return posts.map((post) => ({
      '@context': 'https://schema.org',
      '@type': getSchemaType(post),
      headline: post.title,
      name: post.title,
      url: `${PUBLIC_SITE_URL}/${post.categories?.[0]?.slug ?? 'post'}/${post.slug}`,
      author: post.author?.displayName
        ? {
            '@type': 'Person',
            name: post.author.displayName,
            url: `${PUBLIC_SITE_URL}/penulis/${post.author.username}`
          }
        : undefined,
      image: post.featuredImage?.url
        ? {
            '@type': 'ImageObject',
            url: post.featuredImage.url
          }
        : undefined,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      description: post.excerpt,
      publisher: {
        '@id': `${PUBLIC_SITE_URL}/#organization`
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${PUBLIC_SITE_URL}/${post.categories?.[0]?.slug ?? 'post'}/${post.slug}`
      },
      inLanguage: 'id'
    }));
  }

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${PUBLIC_SITE_URL}/#organization`,
          name: 'Crevalen',
          url: PUBLIC_SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${PUBLIC_SITE_URL}/publisher.png`
          },
          sameAs: [
            'https://web.facebook.com/crevalens',
            'https://x.com/crevalens',
            'https://www.instagram.com/crevalens/',
            'https://www.threads.com/@crevalens'
          ],
          description:
            'Crevalen memberikan edukasi finansial, tips keuangan pribadi, dan panduan investasi untuk membantu Anda mengelola uang dan meraih kebebasan finansial.'
        },
        {
          '@type': 'WebSite',
          '@id': `${PUBLIC_SITE_URL}/#website`,
          url: PUBLIC_SITE_URL,
          name: 'Crevalen',
          publisher: {
            '@id': `${PUBLIC_SITE_URL}/#organization`
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${PUBLIC_SITE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${PUBLIC_SITE_URL}/#webpage`,
          url: PUBLIC_SITE_URL,
          name: 'Crevalen - Edukasi Finansial & Investasi',
          inLanguage: 'id',
          isPartOf: {
            '@id': `${PUBLIC_SITE_URL}/#website`
          },
          about: {
            '@id': `${PUBLIC_SITE_URL}/#organization`
          },
          description:
            'Crevalen memberikan edukasi finansial, tips keuangan pribadi, dan panduan investasi untuk membantu Anda mengelola uang dan meraih kebebasan finansial.'
        }
      ]
    },

    createItemListSchema('Artikel Populer di Crevalen', popularPosts),
    createItemListSchema('Tips Keuangan Terbaru', gridPosts),
    createItemListSchema('Kisah & Cerita Finansial', storyPosts),

    ...createArticleSchemas([...popularPosts, ...gridPosts, ...storyPosts])
  ];

  return schemas;
}
