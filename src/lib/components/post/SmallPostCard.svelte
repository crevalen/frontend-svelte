<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
  import { lazyload } from '$lib/actions/lazyload';

  export let post: {
    slug: string;
    title: string;
    publishedAt: Date | string | null;
    featuredImage?: { url: string; url_placeholder?: string; } | null;
    categories?: { slug: string; name: string }[];
  };
  
  const category = post.categories?.[0];
  const categorySlug = category?.slug || 'tanpa-kategori';
  const placeholderSrc = post.featuredImage?.url_placeholder || '/default-image.png';
  const highResSrc = post.featuredImage?.url || '/default-image.png';
</script>

<a href={`/${categorySlug}/${post.slug}`} class="block group flex items-center gap-4">
  <div class="w-24 h-24 flex-shrink-0 overflow-hidden">
    <img 
      src={placeholderSrc}
      use:lazyload={highResSrc}
      alt="" 
      class="lazy-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      width="100" height="100"
    />
  </div>
  <div class="flex-grow">
    <h4 class="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors leading-tight line-clamp-2">
      {post.title}
    </h4>
    <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
      {#if category}
        <span class="font-medium text-cyan-700 dark:text-cyan-400 uppercase">{category.name}</span>
        <span class="mx-1.5">•</span>
      {/if}
      {#if post.publishedAt}
        <time>{formatDate(post.publishedAt)}</time>
      {/if}
    </div>
  </div>
</a>