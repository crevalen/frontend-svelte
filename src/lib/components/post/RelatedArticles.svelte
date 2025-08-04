<script lang="ts">
  import { lazyload } from "$lib/actions/lazyload";
  import type { Post } from '$lib/types';
  export let posts: Post[] = [];
</script>

{#if posts.length > 0}
  <div class="my-8 not-prose rounded-lg bg-slate-100 dark:bg-slate-800/50 p-5 border-t-2 border-cyan-500 shadow-sm">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      Baca Juga:
    </h3>
    
    <div class="flex flex-col gap-4">
      {#each posts as post}
        {@const category = post.categories?.[0]}
        <a 
          href={`/${category?.slug || 'artikel'}/${post.slug}`} 
          class="group flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/50 transition-colors duration-200"
        >
          <div class="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
            <img 
              src={post.featuredImage?.url_placeholder || '/default-image.png'} 
              use:lazyload={post.featuredImage?.url_thumb}
              alt={post.title}
              class="lazy-image w-full h-full object-cover"
              width="80" height="80"
            />
          </div>
          <div class="flex-grow">
            {#if category}
              <span class="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">{category.name}</span>
            {/if}
            <h4 class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors leading-tight line-clamp-2">
              {post.title}
            </h4>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}