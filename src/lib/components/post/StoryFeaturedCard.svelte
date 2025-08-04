<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
  import type { Post } from '$lib/types';
  export let post: Post;
  const category = post.categories?.[0];
</script>

<a href={`/${category?.slug}/${post.slug}`} class="group grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
  <div class="md:order-2">
    <div class="aspect-video overflow-hidden">
      <img 
        src={post.featuredImage?.url_thumb || '/default-image.png'}
        srcset={`
          ${post.featuredImage?.url_thumb} 300w,
          ${post.featuredImage?.url_medium} 768w
        `}
        sizes="(max-width: 767px) 90vw, 50vw"
        alt={post.title} 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        width="300" height="169"
      />
    </div>
  </div>
  <div class="md:order-1">
    {#if category}
      <span class="text-sm font-semibold text-cyan-700 dark:text-cyan-400 uppercase">{category.name}</span>
    {/if}
    <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2 group-hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">{post.title}</h2>
    {#if post.publishedAt}
      <time class="text-sm text-gray-500 dark:text-gray-400 mt-2 block">{formatDate(post.publishedAt)}</time>
    {/if}
  </div>
</a>