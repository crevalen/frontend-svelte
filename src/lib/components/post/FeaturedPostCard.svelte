<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
import { lazyload } from '$lib/actions/lazyload';
  export let post: any;
  const category = post.categories?.[0];
</script>

<div class="relative group shadow-lg">
  <a href={`/${category?.slug}/${post.slug}`} class="block">
    <div class="aspect-w-16 aspect-h-9">
      <img 
  src={post.featuredImage?.url_placeholder || '/default-image.png'} 
  use:lazyload={post.featuredImage?.url}
  alt={post.title} 
  class="lazy-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  fetchpriority="high"
  width="300" height="169"
/>
    </div>
  </a>

  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] bg-white dark:bg-slate-800 p-5 shadow-2xl transform transition-transform duration-300 group-hover:translate-y-[-0.5rem] translate-y-1/2">
    {#if category}
      <a href={`/kategori/${category.slug}`} class="text-sm font-semibold text-cyan-700 dark:text-cyan-400 uppercase hover:underline">{category.name}</a>
    {/if}
    <a href={`/${category?.slug}/${post.slug}`}>
      <h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors leading-tight">{post.title}</h2>
    </a>
    <p class="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
      {post.excerpt}
    </p>
  </div>
</div>