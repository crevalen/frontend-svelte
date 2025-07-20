<script lang="ts">
  import PostCard from '$lib/components/ui/PostCard.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: tag = data.tag;
  $: posts = data.posts;
</script>

<svelte:head>
  <title>Postingan dengan Tag: {tag.name}</title>
  <meta name="description" content={`Daftar semua artikel dengan tag ${tag.name}`} />
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <div class="text-center mb-12">
    <p class="text-gray-600 dark:text-gray-400 font-semibold">Postingan dengan Tag:</p>
    <h1 class="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-gray-100">
      "{tag.name}"
    </h1>
  </div>

  {#if posts && posts.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each posts as post (post.slug)}
        <PostCard {post} />
      {/each}
    </div>
  {:else}
    <p class="text-center text-gray-500 dark:text-gray-400">
      Belum ada postingan dengan tag ini.
    </p>
  {/if}
</div>