<script lang="ts">
  import type { Post } from '$lib/types';
  export let posts: Post[] = [];
</script>

{#if posts.length > 0}
  <div class="my-8 not-prose relative p-5 border border-cyan-200/40 dark:border-cyan-400/20 rounded-md">
    <!-- Decorative Corners -->
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <!-- Top Left -->
      <div class="absolute top-0 left-0 h-12 w-12 border-l-4 border-t-4 border-cyan-500 dark:border-cyan-400 rounded-tl-sm"></div>
      <!-- Bottom Right -->
      <div class="absolute bottom-0 right-0 h-12 w-12 border-r-4 border-b-4 border-cyan-500 dark:border-cyan-400 rounded-br-sm"></div>
    </div>

    <!-- Header -->
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2 relative z-10">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-600 dark:text-cyan-400">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      Baca Juga:
    </h3>

    <!-- Post List -->
    <div class="flex flex-col gap-4 relative z-10">
      {#each posts as post}
        {@const category = post.categories?.[0]}
        <a 
          href={`/${category?.slug || 'artikel'}/${post.slug}`} 
          class="group flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200"
        >
          <div class="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-700">
            <img 
              src={post.featuredImage?.url_thumb || '/default-image.png'}
              alt={post.title}
              class="lazy-image w-full h-full object-cover"
              loading="lazy"
              width="64" height="64"
            />
          </div>
          <div class="flex-grow">
            <h4 class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight line-clamp-2">
              {post.title}
            </h4>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}
