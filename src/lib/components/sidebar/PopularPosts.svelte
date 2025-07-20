<script lang="ts">
  import { formatDate } from '$lib/utils/formatters';
  export let posts: any[] = [];
</script>

<div class="bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
  <div class="bg-slate-900 p-4 text-center">
    <h3 class="text-lg font-bold text-white tracking-wider">
      TRENDING
    </h3>
  </div>

  <div class="p-4">
    <ul class="space-y-4">
      {#each posts as post, i (post.slug)}
        {@const category = post.categories?.[0]}
        <li class="border-b border-gray-100 dark:border-slate-700/50 pb-4 last:border-b-0 last:pb-0">
          
          <div class="flex items-start gap-4">
            <div class="text-xl font-bold text-gray-300 dark:text-slate-600 pt-1">{i + 1}.</div>
            
            <img src={post.featuredImage?.url} alt={post.title} class="w-16 h-16 object-cover flex-shrink-0" />

            <div class="flex-grow">
              <a href={`/${category.slug}/${post.slug}`} class="block text-base font-bold text-gray-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors leading-tight">
                {post.title}
              </a>
              <div class="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                {#if category}
                  <a href={`/kategori/${category.slug}`} class="font-medium text-cyan-700 dark:text-cyan-400 uppercase hover:underline">
                    {category.name}
                  </a>
                {/if}
                <span class="mx-2">•</span>
                <time>{formatDate(post.publishedAt)}</time>
              </div>
            </div>
          </div>

        </li>
      {/each}
    </ul>
  </div>
</div>