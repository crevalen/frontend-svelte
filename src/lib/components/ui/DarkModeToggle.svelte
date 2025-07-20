<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { fly } from 'svelte/transition';

  function toggleTheme() {
    // Memanggil fungsi update dari store untuk mengubah tema
    theme.update(current => (current === 'light' ? 'dark' : 'light'));
  }
</script>

<button
  on:click={toggleTheme}
  class="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:bg-slate-700 transition-colors"
  aria-label="Toggle Dark Mode"
>
  {#if $theme === 'light'}
    <div in:fly={{ y: -10, duration: 200 }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93l1.41 1.41"/><path d="m17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66l-1.41 1.41"/><path d="m19.07 4.93l-1.41 1.41"/></svg>
    </div>
  {:else}
    <div in:fly={{ y: 10, duration: 200 }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9z"/></svg>
    </div>
  {/if}
</button>