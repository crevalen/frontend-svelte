<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
import { lazyload } from '$lib/actions/lazyload';

  export let post: {
    slug: string;
    title: string;
    publishedAt: Date | string | null; // <-- Izinkan tipe Date & null
    featuredImage?: { url: string } | null; // <-- Izinkan null
    categories?: { slug: string; name: string }[];
  };
  
  const category = post.categories?.[0];
  const categorySlug = category?.slug || 'tanpa-kategori';
</script>

<a href={`/${categorySlug}/${post.slug}`} class="block group">
  <div class="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-3">
    <img 
  src={post.featuredImage?.url_placeholder || '/default-image.png'} 
  use:lazyload={post.featuredImage?.url}
  alt={post.title} 
  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  width="300" height="169"
/>
  </div>
  
  <h4 class="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight line-clamp-2">
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
</a>