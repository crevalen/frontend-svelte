<script lang="ts">
  export let data;
  $: page = data.page;
</script>

<svelte:head>
  <title>{page.title}</title>
  <meta name="description" content={page.metaDescription || `Halaman ${page.title}`} />
</svelte:head>

<div class="container max-w-[900px] mx-auto px-4 py-16 sm:py-20">
  <article>
    <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 text-center">
      {page.title}
    </h1>

    <div class="prose prose-lg dark:prose-invert max-w-none">
      {@html page.content}
    </div>
  </article>
</div>