<script lang="ts">
  import type { PageData } from './$types';
  import FeaturedPostCard from '$lib/components/post/FeaturedPostCard.svelte';
  import PopularPosts from '$lib/components/sidebar/PopularPosts.svelte';
  import GridPostCard from '$lib/components/post/GridPostCard.svelte';
  import ListPostCard from '$lib/components/post/ListPostCard.svelte';
  import Pagination from '$lib/components/post/Pagination.svelte';
  import StoryFeaturedCard from '$lib/components/post/StoryFeaturedCard.svelte';

  export let data: PageData;
  $: homepageData = data.homepageData;
</script>

<svelte:head>
  <title>{data.settings?.site_title || 'Crevalen'}</title>
  <meta name="description" content={data.settings?.site_description} />
</svelte:head>

<div class="container max-w-[1100px] mx-auto px-4 py-8 space-y-16">
  {#if homepageData}
    
    {#if homepageData.pagination.currentPage === 1}
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          {#if homepageData.featuredPost}
            <FeaturedPostCard post={homepageData.featuredPost} />
          {/if}
        </div>
        <div>
          <PopularPosts posts={homepageData.popularPosts} />
        </div>
      </section>

      <section>
        <div class="flex justify-between items-center mb-4 border-b-2 border-cyan-600 pb-2">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">Tips</h2>
          <a href="/kategori/tips" class="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">Lihat Semua &rarr;</a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {#each homepageData.gridPosts as post}
            <GridPostCard {post} />
          {/each}
        </div>
      </section>
      
      {#if homepageData.storyPosts.length > 0}
      <section>
        <div class="flex justify-between items-center mb-4 border-b-2 border-fuchsia-600 pb-2">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">Story</h2>
          <a href="/kategori/story" class="text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-400 hover:underline">Lihat Semua &rarr;</a>
        </div>
        <div class="space-y-6">
          <StoryFeaturedCard post={homepageData.storyPosts[0]} />
          {#if homepageData.storyPosts.length > 1}
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {#each homepageData.storyPosts.slice(1, 4) as post}
              <GridPostCard {post} />
            {/each}
          </div>
          {/if}
        </div>
      </section>
      {/if}
    {/if}

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <div class="lg:col-span-2">
  <div class="flex justify-between items-center mb-6 border-b-2 border-gray-400 dark:border-gray-600 pb-2">
   <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Artikel Terbaru</h2>
  </div>
  <div class="divide-y divide-gray-200 dark:divide-slate-700/50">
    {#each homepageData.paginatedPosts as post (post.id)}
      <div class="py-8">
        <ListPostCard {post} />
      </div>
    {/each}
  </div>
  {#if homepageData.pagination.totalPages > 1}
    <Pagination currentPage={homepageData.pagination.currentPage} totalPages={homepageData.pagination.totalPages} />
  {/if}
</div>

      <div class="lg:col-span-1">
        <div class="sticky top-24">
          <div class="flex items-center justify-center h-96 bg-gray-100 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700">
            <span class="text-gray-400">Slot Iklan Adsense</span>
          </div>
        </div>
      </div>
    </section>

  {:else}
   <p class="text-center text-gray-500">Gagal memuat data halaman utama.</p>
  {/if}
</div>