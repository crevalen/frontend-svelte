<script lang="ts">
  import type { Post } from '$lib/types';
  export let posts: Post[] = [];
</script>

{#if posts.length > 0}
  <div class="my-8 not-prose relative p-5">
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute top-0 left-0 h-8 w-8 border-l-2 border-t-2 border-cyan-500"></div>
      <div class="absolute bottom-0 right-0 h-8 w-8 border-r-2 border-b-2 border-cyan-500"></div>
    </div>
    
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2 relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      Baca Juga:
    </h3>
    
    <div class="flex flex-col gap-4 relative">
      {#each posts as post}
        {@const category = post.categories?.[0]}
        <a 
          href={`/${category?.slug || 'artikel'}/${post.slug}`} 
          class="group flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200"
        >
          <div class="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
            <img 
              src={post.featuredImage?.url_thumb || '/default-image.png'}
              alt={post.title}
              class="lazy-image w-full h-full object-cover"
              loading="lazy"
              width="64" height="64"
            />
          </div>
          <div class="flex-grow">
            <h4 class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors leading-tight line-clamp-2">
              {post.title}
            </h4>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}