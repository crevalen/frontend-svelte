<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
  export let post: any;
  const category = post.categories?.[0];
</script>

<div class="block group bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
  <a href={`/${category?.slug}/${post.slug}`}>
    <div class="aspect-video overflow-hidden">
      <img src={post.featuredImage?.url} alt={post.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
  </a>
  <div class="p-3">
    <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
      {#if category}<span class="font-semibold text-cyan-700 dark:text-cyan-400 uppercase">{category.name}</span>{/if}
    </div>
    <a href={`/${category?.slug}/${post.slug}`}>
      <h3 class="h-16 text-base font-bold text-gray-800 dark:text-gray-200 leading-tight group-hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors line-clamp-3">
        {post.title}
      </h3>
    </a>
  </div>
</div>