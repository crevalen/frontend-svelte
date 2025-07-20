<script lang="ts">
  import { onMount} from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';
  import type { PageData } from './$types';
  import { PUBLIC_SITE_URL } from '$env/static/public';
  import SocialShare from '$lib/components/post/SocialShare.svelte';
  import { formatDate, calculateReadTime } from '$lib/utils/formatters';
  import CommentsSection from '$lib/components/comments/CommentsSection.svelte';
  import RelatedArticles from '$lib/components/post/RelatedArticles.svelte';
  import SmallPostCard from '$lib/components/post/SmallPostCard.svelte';
  import PopularPosts from '$lib/components/sidebar/PopularPosts.svelte';
  import TableOfContents from '$lib/components/ui/TableOfContents.svelte';
  import { slide } from 'svelte/transition';
 
  export let data: PageData;

  // Variabel Reaktif
  $: ({ post, meta, jsonLd, comments, relatedPosts, popularPosts } = data);
  $: readTime = post.content ? calculateReadTime(post.content) : 0;
  $: category = post.categories?.[0];

  // State & Logika UI
  let headings: { id: string; text: string; level: 'h2' | 'h3' }[] = [];
  let showToc = false;

  // --- FUNGSI-FUNGSI YANG DIKEMBALIKAN ---
  function generateToc() {
    if (!browser || !post.content) return;
    const articleContent = document.querySelector('#article-content');
    if (!articleContent) return;
    const headingElements = articleContent.querySelectorAll(':scope > h2, :scope > h3');
    const newHeadings: typeof headings = [];
    headingElements.forEach((el, i) => {
      const text = el.textContent || '';
      let id = el.id;
      if (!id) {
        id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        el.id = `${id}-${i}`;
      }
      newHeadings.push({ id: el.id, text, level: el.nodeName.toLowerCase() as 'h2' | 'h3' });
    });
    headings = newHeadings;
  }
  
  function insertRelatedArticles() {
    const articleContent = document.querySelector('#article-content');
    const inlineRelatedContainer = document.querySelector('#inline-related-container');
    if (inlineRelatedContainer && inlineRelatedContainer.parentElement !== document.body) {
      document.body.appendChild(inlineRelatedContainer);
      (inlineRelatedContainer as HTMLElement).style.display = 'none';
    }
    if (!articleContent || !inlineRelatedContainer) return;
    const paragraphs = articleContent.querySelectorAll('p');
    if (paragraphs.length > 3) {
      paragraphs[3].after(inlineRelatedContainer);
      (inlineRelatedContainer as HTMLElement).style.display = 'block';
    }
  }
  // --- SELESAI FUNGSI YANG DIKEMBALIKAN ---

  function runClientSideLogic() {
    generateToc();
    insertRelatedArticles();
  }

  onMount(() => {
    runClientSideLogic();
    const timer = setTimeout(() => {
      fetch(`/api/posts/${post.slug}/view`, { method: 'POST' });
    }, 5000);
    return () => clearTimeout(timer);
  });
  afterNavigate(runClientSideLogic);

  // --- MENGGUNAKAN KEMBALI METODE safeSchemaString ---
  $: safeSchemaString = (() => {
    if (!post) return ''; // Pengaman jika post belum ada
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: PUBLIC_SITE_URL },
        ...(category ? [{ '@type': 'ListItem', position: 2, name: category.name, item: `${PUBLIC_SITE_URL}/kategori/${category.slug}`}] : []),
        { '@type': 'ListItem', position: category ? 3 : 2, name: post.title }
      ]
    };
    const schemas = [jsonLd, breadcrumbSchema].filter(Boolean);
    // Ganti karakter '<' agar tidak mengganggu parser HTML
    return JSON.stringify(schemas).replace(/</g, '\\u003c');
  })();
  // --- SELESAI ---

</script>

<svelte:head>
  {#if safeSchemaString}
    <script type="application/ld+json">{@html safeSchemaString}</script>
  {/if}
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
  <link rel="canonical" href={meta.canonical} />
  <meta name="robots" content={meta.robots} />

  <meta property="og:title" content={meta.ogTitle} />
  <meta property="og:description" content={meta.ogDescription} />
  <meta property="og:image" content={meta.ogImage} />
  <meta property="og:url" content={meta.canonical} />
  <meta property="og:type" content="article" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.ogTitle} />
  <meta name="twitter:description" content={meta.ogDescription} />
  <meta name="twitter:image" content={meta.ogImage} />

  <script type="application/ld+json" id="schema-ld-json"></script>
  
</svelte:head>

<div class="py-8 sm:py-12">
  <div class="container max-w-[1100px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 lg:gap-x-12">
    
    <main class="lg:col-span-2">
      <article>
        <nav class="text-sm text-gray-500 dark:text-gray-400 mb-5" aria-label="Breadcrumb">
          <ol class="list-none p-0 flex items-center flex-wrap">
            <li><a href="/" class="hover:text-cyan-600 dark:hover:text-cyan-400">Beranda</a><span class="mx-2">/</span></li>
            {#if category}
              <li><a href={`/kategori/${category.slug}`} class="hover:text-cyan-600 dark:hover:text-cyan-400">{category.name}</a><span class="mx-2">/</span></li>
            {/if}
            <li class="text-gray-700 dark:text-gray-300 truncate max-w-full">{post.title}</li>
          </ol>
        </nav>

        <h1 class="text-3xl md:text-4xl font-extrabold leading-tight tracking-tighter text-gray-900 dark:text-gray-100 mb-6">{post.title}</h1>

        <div class="flex flex-wrap items-center text-gray-600 dark:text-gray-400 text-sm mb-6 border-y border-gray-200 dark:border-gray-700 py-3 gap-x-4 gap-y-2">
          <div class="flex items-center gap-2">
            <img src={post.author.avatarUrl || '/default-avatar.png'} alt={post.author.displayName} class="w-8 h-8 rounded-full" />
            <span class="font-semibold text-gray-800 dark:text-gray-200">{post.author.displayName}</span>
          </div>
           <div class="flex items-center gap-4">
            <span class="hidden sm:inline">•</span>
            {#if post.publishedAt}
              <time datetime={new Date(post.publishedAt).toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            {/if}
            {#if readTime > 0}<span class="hidden sm:inline">•</span><span>{readTime} menit baca</span>{/if}
          </div>
        </div>
        
       

        {#if post.featuredImage}<figure class="my-6"><img src={post.featuredImage.url} alt={post.title} class="w-full h-auto object-cover" /></figure>{/if}
        {#if headings.length > 1}
  <div class="my-8 border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-lg overflow-hidden">
    <button
      on:click={() => showToc = !showToc}
      class="flex items-center justify-between w-full p-4 font-semibold text-gray-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-expanded={showToc}
    >
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-cyan-600 dark:text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h12"/></svg>
        <span>Daftar Isi</span>
      </div>
      <svg class="w-5 h-5 transition-transform duration-300" class:rotate-180={!showToc} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9l6 6l6-6"/></svg>
    </button>
    
    {#if showToc}
      <div transition:slide={{ duration: 300 }} class="border-t border-gray-200 dark:border-slate-700">
        <TableOfContents {headings} />
      </div>
    {/if}
  </div>
{/if}
        <div id="article-content" class="prose prose-base lg:prose-lg max-w-none dark:prose-invert">
          {@html post.content || ''}
        </div>
      </article>

      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50 space-y-8">
        <div class="flex flex-wrap justify-between items-center gap-6">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">Tags:</span>
            {#if post.tags && post.tags.length > 0}
              {#each post.tags as tag}
                <a href={`/tag/${tag.slug}`} class="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-full text-xs font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">{tag.name}</a>
              {/each}
            {/if}
          </div>
          <SocialShare url={meta.canonical} title={meta.title} />
        </div>
        
        {#if relatedPosts && relatedPosts.length > 0}
          <div>
            <div class="text-center mb-8">
              <h3 class="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Artikel Terkait Lainnya</h3>
              <div class="mt-2 h-1 w-16 bg-cyan-500 mx-auto"></div>
            </div>
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

    <aside class="hidden lg:block lg:col-span-1 h-fit lg:sticky lg:top-24">
      <PopularPosts posts={popularPosts} />
    </aside>
  </div>
</div>

{#if relatedPosts && relatedPosts.length > 0}
  <div id="inline-related-container" style="display: none;">
    <RelatedArticles posts={relatedPosts.slice(0, 3)} />
  </div>
{/if}