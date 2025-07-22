<script lang="ts">
  import type { PageData } from './$types';

 export let data: PageData;
  $: page = data.page;
  $: meta = data.meta;
  $: jsonLd = data.jsonLd;

  
  $: safeSchemaString = jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : '';
</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
  <link rel="canonical" href={meta.canonical} />

  <meta property="og:title" content={meta.ogTitle} />
  <meta property="og:description" content={meta.ogDescription} />
  <meta property="og:url" content={meta.canonical} />
  <meta property="og:type" content="website" />

  {@html `<script type="application/ld+json">${safeSchemaString}</script>`}
</svelte:head>

<div class="container max-w-4xl mx-auto px-4 py-16 sm:py-20">
  <article>
    <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 text-center">
      {page.title}
    </h1>
    <div class="prose prose-lg dark:prose-invert max-w-none">
      {@html page.content}
    </div>
  </article>
</div>