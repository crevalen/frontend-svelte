<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
  import { lazyload } from '$lib/actions/lazyload';

  export let post: {
    slug: string;
    title: string;
    publishedAt: Date | string | null;
    featuredImage?: {
      url: string;
      url_placeholder?: string;
    } | null;
    categories?: { slug: string; name: string }[];
  };
  
  const category = post.categories?.[0];
  const categorySlug = category?.slug || 'tanpa-kategori';

  // --- PERBAIKAN 1: URL gambar yang aman dengan fallback ---
  const placeholderSrc = post.featuredImage?.url_placeholder || '/default-image.png';
  const highResSrc = post.featuredImage?.url || '/default-image.png';
</script>

<a href={`/${categorySlug}/${post.slug}`} class="group bg-white dark:bg-slate-800/50 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-slate-700 h-full flex flex-col">
  
  <div class="aspect-video overflow-hidden">
    <img 
      src={placeholderSrc} 
      use:lazyload={highResSrc}
      alt="" 
      class="lazy-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      width="300" height="169"
    />
  </div>
  
  <div class="p-5 flex flex-col flex-grow">
    <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
      {#if category}
        <span class="font-semibold text-cyan-700 dark:text-cyan-400 uppercase">{category.name}</span>
      {/if}
      <span class="mx-2">•</span>

      {#if post.publishedAt}
        <time datetime={new Date(post.publishedAt).toISOString()}>
          {formatDate(post.publishedAt)}
        </time>
      {/if}
    </div>

    <h3 class="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex-grow">
      {post.title}
    </h3>
  </div>
</a>