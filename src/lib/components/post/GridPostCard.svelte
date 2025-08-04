<script lang="ts">
  import type { Post } from '$lib/types';
  export let post: Post;
  const category = post.categories?.[0];
</script>

<div class="block group bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
  <a href={`/${category?.slug}/${post.slug}`}>
    <div class="aspect-video overflow-hidden">
      <img 
        src={post.featuredImage?.url_placeholder || '/default-image.png'}
        srcset={`
          ${post.featuredImage?.url_thumb} 300w,
          ${post.featuredImage?.url_small} 500w,
          ${post.featuredImage?.url_medium} 768w
        `}
        sizes="
          (max-width: 639px) 45vw,
          (max-width: 1023px) 30vw,
          175px
        "
        alt={post.title} 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        width="300" height="169"
      />
    </div>
  </a>
  <div class="p-3">
    {#if category}
      <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span class="font-semibold text-cyan-700 dark:text-cyan-400 uppercase">{category.name}</span>
      </div>
    {/if}
    <a href={`/${category?.slug}/${post.slug}`}>
      <h3 class="h-16 text-base font-bold text-gray-800 dark:text-gray-200 leading-tight group-hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors line-clamp-3">
        {post.title}
      </h3>
    </a>
  </div>
</div>