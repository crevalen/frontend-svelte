<script lang="ts">
  import type { PageData } from './$types';
  import ListPostCard from '$lib/components/post/ListPostCard.svelte';

  export let data: PageData;
  $: author = data.author;
  $: posts = data.posts;
</script>

<svelte:head>
  <title>Artikel oleh {author.displayName || author.username} - {data.settings?.site_title}</title>
  <meta name="description" content="Kumpulan artikel yang ditulis oleh {author.displayName || author.username}. {author.bio || ''}" />
</svelte:head>

<div class="container max-w-[1100px] mx-auto px-4 py-12">
  
  <header class="mb-12 text-center">
    <img 
      src={author.avatarUrl || '/default-avatar.png'} 
      alt={author.displayName || author.username}
      class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white dark:border-slate-700 shadow-lg"
    />
    <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
      {author.displayName || author.username}
    </h1>
    <p class="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
      {author.bio || 'Penulis di Crevalen.xyz'}
    </p>
  </header>

  <div class="divide-y divide-gray-200 dark:divide-slate-700/50">
    {#each posts as post (post.id)}
      <div class="py-8">
        <ListPostCard {post} />
      </div>
    {:else}
      <p class="text-center text-gray-500 py-12">
        {author.displayName || author.username} belum memiliki postingan yang dipublikasikan.
      </p>
    {/each}
  </div>
  
</div>