<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { PageData } from './$types';
  import { PUBLIC_SITE_URL } from '$env/static/public';
  import { HTML } from 'svelte-html';

  // Impor Komponen
  import SocialShare from '$lib/components/post/SocialShare.svelte';
  import CommentsSection from '$lib/components/comments/CommentsSection.svelte';
  import RelatedArticles from '$lib/components/post/RelatedArticles.svelte';
  import SmallPostCard from '$lib/components/post/SmallPostCard.svelte';
  import PopularPosts from '$lib/components/sidebar/PopularPosts.svelte';
  import TableOfContents from '$lib/components/ui/TableOfContents.svelte';
  import { slide } from 'svelte/transition';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ChevronRight } from '@steeze-ui/heroicons';
  import { formatDate, calculateReadTime } from '$lib/utils/formatters';

  export let data: PageData;
  $: ({ post, meta, jsonLd, comments, relatedPosts, popularPosts } = data);
  $: readTime = post.content ? calculateReadTime(post.content) : 0;
  $: category = post.categories?.[0];

  let headings: { id: string; text: string; level: 'h2' | 'h3' }[] = [];
  let showToc = false;

  function generateToc() {
    if (!browser || !post.content) return;
    const articleContent = document.querySelector('#article-content');
    if (!articleContent) return;
    const headingElements = articleContent.querySelectorAll('h2, h3');
    const newHeadings: typeof headings = [];
    headingElements.forEach((el, i) => {
      const text = el.textContent || '';
      if (!el.id) {
        el.id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${i}`;
      }
      newHeadings.push({ id: el.id, text, level: el.nodeName.toLowerCase() as 'h2' | 'h3' });
    });
    headings = newHeadings;
  }

  onMount(() => {
    // Jalankan fungsi yang hanya bisa berjalan di client setelah komponen terpasang
    generateToc();

    // Kirim 'view' setelah 5 detik
    const timer = setTimeout(() => {
      fetch(`/api/posts/${post.slug}/view`, { method: 'POST' });
    }, 5000);

    return () => clearTimeout(timer);
  });
  
  // Fungsi untuk membuat JSON-LD Schema
  function getSafeSchemaString() {
    if (!post) return '';
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: PUBLIC_SITE_URL },
        ...(category
          ? [{ '@type': 'ListItem', position: 2, name: category.name, item: `${PUBLIC_SITE_URL}/kategori/${category.slug}` }]
          : []),
        { '@type': 'ListItem', position: category ? 3 : 2, name: post.title },
      ],
    };
    const schemas = [jsonLd, breadcrumbSchema].filter(Boolean);
    return JSON.stringify(schemas).replace(/</g, '\\u003c');
  }

  $: safeSchemaString = getSafeSchemaString();
</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
  <link rel="canonical" href={meta.canonical} />
  <meta name="robots" content={meta.robots} />
  <meta property="og:title" content={meta.ogTitle} />
  <meta property="og:description" content={meta.ogDescription} />
  <meta property="og:image" content={meta.ogImage} />
  <meta property="og:url" content={meta.canonical} />
  <meta property="og:type" content="article" />
  {@html `<script type="application/ld+json">${safeSchemaString}</script>`}
</svelte:head>

<div class="py-8 sm:py-12">
  <div class="container max-w-[1100px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
    <main>
      <article>
        <nav class="text-sm text-slate-700 dark:text-gray-400 mb-5" aria-label="Breadcrumb">
          <ol class="list-none p-0 flex items-center flex-wrap">
            <li><a href="/" class="hover:text-cyan-600 dark:hover:text-cyan-400">Beranda</a></li>
            {#if category}
              <li class="flex items-center">
                <Icon src={ChevronRight} theme="mini" class="h-5 w-5 mx-1" />
                <a href={`/kategori/${category.slug}`} class="hover:text-cyan-600 dark:hover:text-cyan-400">{category.name}</a>
              </li>
            {/if}
          </ol>
        </nav>

        <h1 class="text-3xl md:text-4xl font-bold leading-tight tracking-tighter text-gray-900 dark:text-gray-100 mb-6">{post.title}</h1>
        <div class="flex flex-wrap items-center text-sm mb-6 border-y border-gray-200 dark:border-gray-700 py-3 gap-x-4 gap-y-2">
           </div>

        {#if post.featuredImage}
          <figure class="w-full mb-8">
            <img src={post.featuredImage.url} alt={post.title} width="1200" height="720" loading="eager" fetchpriority="high" class="w-full h-auto" 
              srcset={`
                ${post.featuredImage.url_thumb} 300w, 
                ${post.featuredImage.url_small} 500w,
                ${post.featuredImage.url_medium} 768w, 
                ${post.featuredImage.url} 1200w
              `}
              sizes="(max-width: 767px) 90vw, (max-width: 1100px) 65vw, 695px"
            />
          </figure>
        {/if}
        
        {#if headings.length > 1}
          <div class="my-8 border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
            <button on:click={() => showToc = !showToc} class="flex items-center justify-between w-full p-4 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-expanded={showToc}>
              <span class="flex items-center gap-2">Daftar Isi</span>
              <svg class="w-5 h-5 transition-transform duration-300" class:rotate-180={!showToc} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9l6 6l6-6"/></svg>
            </button>
            {#if showToc}
              <div transition:slide={{ duration: 300 }} class="border-t border-gray-200 dark:border-slate-700">
                <TableOfContents {headings} />
              </div>
            {/if}
          </div>
        {/if}

        <div id="article-content" class="prose lg:prose-lg dark:prose-invert max-w-none">
          <HTML
            source={post.content || ''}
            components={{ 'related-articles-placeholder': RelatedArticles }}
            componentsProps={{ 'related-articles-placeholder': { posts: relatedPosts.slice(0, 3) } }}
          />
        </div>
      </article>

      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50 space-y-8">
        <div class="flex flex-wrap justify-between items-center gap-6">
          <SocialShare url={meta.canonical} title={meta.title} />
        </div>
        
        {#if relatedPosts && relatedPosts.length > 0}
          <div class="mt-16">
            <h3 class="text-2xl font-bold text-center mb-8">Artikel Terkait Lainnya</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {#each relatedPosts as related}
                <SmallPostCard post={related} />
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="mt-12">
        <CommentsSection initialComments={comments} postSlug={post.slug} />
      </div>
    </main>

    <aside class="hidden lg:block h-fit lg:sticky lg:top-24 w-[320px]">
      <PopularPosts posts={popularPosts} />
    </aside>
  </div>
</div>