<script lang="ts">
  import PostCard from '$lib/components/ui/PostCard.svelte';
  export let data;

  $: category = data.category;
  $: posts = data.posts;
</script>

<svelte:head>
  <title>Kategori: {category.name}</title>
  <meta name="description" content={`Daftar semua artikel dalam kategori ${category.name}`} />
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <div class="text-center mb-12">
    <p class="text-cyan-600 dark:text-cyan-400 font-semibold">Arsip Kategori</p>
    <h1 class="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-gray-100">
      {category.name}
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
      Belum ada postingan di kategori ini.
    </p>
  {/if}
</div>