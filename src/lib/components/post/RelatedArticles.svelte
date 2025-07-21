<script lang="ts">
  import { lazyload } from "$lib/actions/lazyload";

  export let posts: any[] = [];
</script>

{#if posts.length > 0}
  <div class="my-8 p-4 bg-slate-50 rounded-lg not-prose border-l-4 border-cyan-500">
    <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      Baca Juga:
    </h3>
    <ul class="space-y-2">
      {#each posts as post}
        {@const category = post.categories?.[0]}
        <li>
          <a href={`/${category?.slug || 'artikel'}/${post.slug}`} class="flex items-center group gap-4 p-2 rounded-md hover:bg-slate-100 transition-colors">
            <img 
  src={post.featuredImage?.url_placeholder || '/default-image.png'} 
  use:lazyload={post.featuredImage?.url}
  alt={post.title} 
  class="lazy-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  width="300" height="169"
/>
            <span class="font-semibold text-gray-700 group-hover:text-cyan-600 text-base">
              {post.title}
            </span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}