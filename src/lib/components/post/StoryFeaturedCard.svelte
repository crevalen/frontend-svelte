<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
  import { lazyload } from '$lib/actions/lazyload';
  export let post: any;
  const category = post.categories?.[0];
</script>

<a href={`/${category?.slug}/${post.slug}`} class="group grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
  <div class="md:order-2">
    <div class="aspect-video overflow-hidden">
      <img 
  src={post.featuredImage?.url_placeholder || '/default-image.png'} 
  use:lazyload={post.featuredImage?.url}
  alt={post.title} 
  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  width="300" height="169"
/>
    </div>
  </div>
  <div class="md:order-1">
    {#if category}
      <span class="text-sm font-semibold text-cyan-700 dark:text-cyan-400 uppercase">{category.name}</span>
    {/if}
    <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2 group-hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">{post.title}</h2>
    <time class="text-sm text-gray-500 dark:text-gray-400 mt-2 block">{formatDate(post.publishedAt)}</time>
  </div>
</a>