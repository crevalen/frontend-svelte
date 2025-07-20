<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
import { lazyload } from '$lib/actions/lazyload';
  export let post: any;
  const category = post.categories?.[0];
</script>

<a href={`/${category?.slug}/${post.slug}`} class="group grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 items-center">
  <div class="col-span-1 aspect-video overflow-hidden">
    <img 
  src={post.featuredImage?.url_placeholder || '/default-image.png'} 
  use:lazyload={post.featuredImage?.url}
  alt={post.title} 
  class="lazy-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  width="300" height="169"
/>
  </div>
  <div class="col-span-2 sm:col-span-3">
    {#if category}
      <span class="text-sm font-semibold text-cyan-700 dark:text-cyan-400 uppercase">{category.name}</span>
    {/if}
    <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{post.title}</h2>
    <div class="flex items-center flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
      <span>Oleh {post.author.displayName}</span>
      <span>•</span>
      <time>{formatDate(post.publishedAt)}</time>
    </div>
  </div>
</a>