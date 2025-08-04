<script lang="ts">
  import { onMount, tick } from 'svelte';
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
  import { Icon } from '@steeze-ui/svelte-icon';
  import { ChevronRight } from '@steeze-ui/heroicons';

  export let data: PageData;
  $: ({ post, meta, jsonLd, comments, relatedPosts, popularPosts } = data);
  $: readTime = post.content ? calculateReadTime(post.content) : 0;
  $: category = post.categories?.[0];

  let headings: { id: string; text: string; level: 'h2' | 'h3' }[] = [];
  let showToc = false;

  let resizeTimeout: NodeJS.Timeout;

  // --- START MODIFIED CODE ---
  // Variabel ini tidak lagi diperlukan karena kita akan menargetkan semua paragraf
  // let justifiedParagraphs: NodeListOf<HTMLParagraphElement> | undefined;

  function debouncedResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      handleResponsiveAlignment();
    }, 150);
  }

  function handleResponsiveAlignment() {
    if (!browser) return;
    const isMobile = window.innerWidth < 1024;
    const articleContent = document.querySelector('#article-content');
    if (!articleContent) return;

    // Target semua paragraf di dalam artikel, terlepas dari inline style
    const paragraphs = articleContent.querySelectorAll('p'); 

    paragraphs.forEach((p) => {
      p.style.textAlign = isMobile ? 'left' : 'justify';
    });
  }
  // --- END MODIFIED CODE ---

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

  
  async function runClientSideLogic() {
    if (!browser) return;
    await tick(); 
    window.requestAnimationFrame(() => {
      generateToc();
      
      handleResponsiveAlignment(); // Panggil di sini juga
    });
  }

  onMount(() => {
    runClientSideLogic();
    window.addEventListener('resize', debouncedResize);
    const timer = setTimeout(() => {
      fetch(`/api/posts/${post.slug}/view`, { method: 'POST' });
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', debouncedResize);
    };
  });
  afterNavigate(() => {
    // justifiedParagraphs = undefined; // Tidak lagi diperlukan
    runClientSideLogic();
  });
  function getSafeSchemaString() {
    if (!post) return '';
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: PUBLIC_SITE_URL },
        ...(category
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: category.name,
                item: `${PUBLIC_SITE_URL}/kategori/${category.slug}`,
              },
            ]
          : []),
        { '@type': 'ListItem', position: category ? 3 : 2, name: post.title },
      ],
    };
    const schemas = [jsonLd, breadcrumbSchema].filter(Boolean);
    const safeSchemaString = JSON.stringify([jsonLd, breadcrumbSchema].filter(Boolean))
      .replace(/</g, '\\u003c');
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
  <meta name="fediverse:creator" content="@crevalen@mastodon.social">
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.ogTitle} />
  <meta name="twitter:description" content={meta.ogDescription} />
  <meta name="twitter:image" content={meta.ogImage} />

  {@html `<script type="application/ld+json">${safeSchemaString}</script>`}
</svelte:head>

<div class="py-8 sm:py-12">
  <div class="container max-w-[1100px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[2fr_320px] gap-10">

    <main>
      <article>
        <nav class="text-md text-slate-700 dark:text-gray-400 mb-5" aria-label="Breadcrumb">
          <ol class="list-none p-0 flex items-center flex-wrap">
            <li>
              <a href="/" class="hover:text-cyan-600 dark:hover:text-cyan-400">Beranda</a>
            </li>
            {#if category}
              <li class="flex items-center">
                <Icon src={ChevronRight} theme="mini" class="h-5 w-5 mx-1 text-slate-700" />
                <a href={`/kategori/${category.slug}`} class="hover:text-cyan-600 dark:hover:text-cyan-400">
                  {category.name}
                </a>
              </li>
            {/if}
          </ol>
        </nav>

        <h1 class="text-3xl md:text-4xl font-bold leading-tight tracking-tighter text-gray-900 dark:text-gray-100 mb-6">{post.title}</h1>

        <div class="flex flex-wrap items-center text-slate-800 dark:text-white text-sm mb-6 border-y border-gray-200 dark:border-gray-700 py-3 gap-x-4 gap-y-2">
          <a href={`/penulis/${post.author.username}`} class="flex items-center gap-2 group">
            <img 
              src={post.author.avatarUrl || '/default-avatar.png'} 
              alt={post.author.displayName} 
              class="w-8 h-8 rounded-full"
              loading="lazy"
              decoding="async"
            />
            <span class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {post.author.displayName}
            </span>
          </a>
          <div class="flex items-center gap-4">
            <span class="hidden sm:inline">|</span>
            {#if post.publishedAt}
              <time datetime={new Date(post.publishedAt).toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            {/if}
            {#if readTime > 0}<span class="hidden sm:inline">|</span><span>{readTime} menit baca</span>{/if}
          </div>
        </div>

        {#if post.featuredImage}
          <figure class="w-full mb-8">
            <img
              src={post.featuredImage.url}
              alt={post.title}
              width="1200"
              height="720"
              loading="eager"
              fetchpriority="high"
              class="w-full h-auto" 
              srcset={`
                ${post.featuredImage.url_thumb} 300w, 
                ${post.featuredImage.url_medium} 768w, 
                ${post.featuredImage.url} 1200w
              `}
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </figure>
        {/if}

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

        <div id="article-content" class="prose lg:prose-lg dark:prose-invert max-w-none">
          {@html post.content || ''}
        </div>
      </article>

      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50 space-y-8">
        <div class="flex flex-wrap justify-between items-center gap-6">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-semibold text-slate-800 dark:text-white">Tags:</span>
            {#if post.tags && post.tags.length > 0}
              {#each post.tags as tag}
                <a href={`/tag/${tag.slug}`} class="px-3 py-1 bg-blue-600 dark:bg-slate-700 text-slate-50 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-blue-600 dark:hover:bg-slate-600 transition-colors">{tag.name}</a>
              {/each}
            {/if}
          </div>
          <SocialShare url={meta.canonical} title={meta.title} />
        </div>
        
        {#if relatedPosts && relatedPosts.length > 0}
          <div class="mt-16">
            <div class="relative text-center mb-8">
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                <div class="w-full border-t border-gray-200 dark:border-slate-700"></div>
              </div>
              <div class="relative flex justify-center">
                <h3 class="bg-slate-50 dark:bg-slate-900 px-4 text-2xl font-bold text-gray-800 dark:text-gray-200 tracking-tight">
                  Artikel Terkait Lainnya
                </h3>
              </div>
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

    <aside class="hidden lg:block h-fit lg:sticky lg:top-24 w-[320px]">
      <PopularPosts posts={popularPosts} />
    </aside>
  </div>
</div>

{#if relatedPosts && relatedPosts.length > 0}
  <div id="inline-related-container" style="display: none;">
    <RelatedArticles posts={relatedPosts.slice(0, 3)} />
  </div>
{/if}