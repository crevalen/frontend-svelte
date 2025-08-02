import { PUBLIC_SITE_URL } from '$env/static/public';

type Post = {
  slug: string;
  title: string;
  categories: { slug: string }[];
  author?: { displayName: string };
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
          '@type': 'Article',
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
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${PUBLIC_SITE_URL}/`
          }
        }
      }))
    };
  }

  // Artikel individual untuk SEO optimal
  function createArticleSchemas(posts: Post[]) {
    return posts.map((post) => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      name: post.title,
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
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${PUBLIC_SITE_URL}/`
      }
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

    // ItemList (daftar artikel)
    createItemListSchema('Artikel Populer di Crevalen', popularPosts),
    createItemListSchema('Tips Keuangan Terbaru', gridPosts),
    createItemListSchema('Kisah & Cerita Finansial', storyPosts),

    // Article (per artikel utama untuk SEO maksimal)
    ...createArticleSchemas([...popularPosts, ...gridPosts, ...storyPosts])
  ];

  return schemas;
}
