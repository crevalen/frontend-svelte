<script lang="ts">
  import PostCard from '$lib/components/ui/PostCard.svelte';
  import type { PageData } from './$types'; // <-- Tambahkan import ini

  export let data: PageData; // <-- Terapkan tipe PageData di sini

  $: query = data.query;
  $: posts = data.posts;
</script>

<svelte:head>
  <title>Hasil pencarian untuk: "{query}"</title>
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <div class="text-center mb-12">
    <p class="text-gray-600 dark:text-gray-400">Hasil Pencarian untuk:</p>
    <h1 class="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-gray-100 mt-1">
      "{query}"
    </h1>
  </div>

  {#if posts && posts.length > 0}
    <p class="text-center text-gray-500 dark:text-gray-400 mb-8">
      Menemukan {posts.length} artikel yang relevan.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each posts as post (post.slug)}
        <PostCard {post} />
      {/each}
    </div>
  {:else if query}
    <p class="text-center text-gray-500 dark:text-gray-400">
      Maaf, tidak ada hasil yang ditemukan untuk pencarian Anda.
    </p>
  {:else}
     <p class="text-center text-gray-500 dark:text-gray-400">
      Silakan masukkan kata kunci di form pencarian.
    </p>
  {/if}
</div>