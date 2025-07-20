<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  export let isOpen = false;
  export let menuItems: string[] = [];
</script>

{#if isOpen}
  <div
    transition:fade={{ duration: 300 }}
    on:click={() => (isOpen = false)}
    on:keydown
    class="fixed inset-0 bg-black/50 z-[90]"
    aria-hidden="true"
  ></div>

  <div
    transition:fly={{ x: '-100%', duration: 300 }}
    class="fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 shadow-xl z-[99] p-6"
  >
    <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Menu</h3>
    <nav class="flex flex-col space-y-4">
      {#each menuItems as item}
        <a 
          href="/kategori/{item.toLowerCase()}" 
          class="px-3 py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md"
          on:click={() => (isOpen = false)}
        >
          {item}
        </a>
      {/each}
    </nav>
  </div>
{/if}