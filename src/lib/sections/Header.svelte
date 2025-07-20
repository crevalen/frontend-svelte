<script lang="ts">
  import DarkModeToggle from '$lib/components/ui/DarkModeToggle.svelte';
  import SearchForm from '$lib/components/ui/SearchForm.svelte';
  import SearchPopup from '$lib/components/ui/SearchPopup.svelte';
  import MobileNav from '$lib/components/ui/MobileNav.svelte';

  export let siteLogoUrl: string | undefined;
  export let siteTitle: string | undefined = 'MySite';

  const menuItems = ['Berita', 'Tips', 'Story', 'Trading', 'Investasi', 'Kripto'];
  let logoSize = 'h-9';

  let isSearchOpen = false;
  let isMobileNavOpen = false;
</script>

<header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between py-3">
      
      <div class="flex items-center gap-6">
        <a href="/" aria-label="Beranda">
          {#if siteLogoUrl}
            <img src={siteLogoUrl} alt="{siteTitle || 'Logo Situs'}" class="{logoSize} w-auto" />
          {:else}
            <span class="text-xl font-bold tracking-tighter text-gray-800 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              {siteTitle || 'MySite.'}
            </span>
          {/if}
        </a>
        <div class="hidden lg:block">
          <SearchForm />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <nav class="hidden lg:flex items-center gap-1">
          {#each menuItems as item}
            <a href={item === 'Beranda' ? '/' : `/kategori/${item.toLowerCase()}`} class="px-3 py-2 text-sm font-medium hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors rounded-md">
              {item}
            </a>
          {/each}
        </nav>
        
        <div class="hidden lg:block w-px h-6 bg-gray-200 dark:bg-slate-700 mx-2"></div>

        <DarkModeToggle />

        <div class="flex lg:hidden items-center">
          <button on:click={() => (isSearchOpen = true)} class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800" aria-label="Buka pencarian">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21l-4.3-4.3"/></svg>
          </button>
          <button on:click={() => (isMobileNavOpen = true)} class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800" aria-label="Buka menu">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</header>

<SearchPopup bind:isOpen={isSearchOpen} />
<MobileNav bind:isOpen={isMobileNavOpen} {menuItems} />