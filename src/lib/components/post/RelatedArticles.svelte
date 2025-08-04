<script lang="ts">
  import { lazyload } from "$lib/actions/lazyload";
  import type { Post } from '$lib/types';
  export let posts: Post[] = [];
</script>

{#if posts.length > 0}
  <div class="my-8 not-prose">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      Baca Juga:
    </h3>
    
    <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {#each posts as post}
        {@const category = post.categories?.[0]}
        
        <a 
          href={`/${category?.slug || 'artikel'}/${post.slug}`} 
          class="block w-48 flex-shrink-0 rounded-lg shadow-md bg-white dark:bg-slate-800/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div class="aspect-video overflow-hidden rounded-t-lg">
            <img 
              src={post.featuredImage?.url_placeholder || '/default-image.png'} 
              use:lazyload={post.featuredImage?.url_thumb}
              alt={post.title}
              class="lazy-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              width="300" height="169"
            />
          </div>
          <div class="p-3">
            <h4 class="h-12 text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight line-clamp-2">
              {post.title}
            </h4>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}

<style>
  /* Utility to hide the scrollbar for a cleaner look */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
</style>