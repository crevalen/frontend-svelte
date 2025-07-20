<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  function handleResponse(accepted: boolean) {
    if (accepted) {
      dispatch('accept');
    } else {
      dispatch('reject');
    }
  }
</script>

<div
  transition:fade={{ duration: 300 }}
  class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
  aria-hidden="true"
></div>

<div
  transition:fly={{ y: -20, duration: 400, delay: 200 }}
  class="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm z-[99]"
>
  <div class="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-2xl border-t-2 border-cyan-500 p-6 pt-12 text-center">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div class="w-16 h-16 flex items-center justify-center bg-white dark:bg-slate-700 rounded-full shadow-lg animate-wiggle">
        <svg class="w-8 h-8 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
      </div>
    </div>

    <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
      Jangan Ketinggalan Info!
    </h3>
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
      Aktifkan notifikasi untuk mendapatkan update artikel terbaru langsung dari kami.
    </p>

    <div class="flex items-center justify-center gap-4 mt-6">
      <button 
        on:click={() => handleResponse(false)}
        class="px-5 py-2 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
      >
        Lain Kali
      </button>
      <button 
        on:click={() => handleResponse(true)}
        class="px-5 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-md hover:bg-cyan-700 transition-all duration-200 transform active:scale-95"
      >
        Ya, Aktifkan
      </button>
    </div>
  </div>
</div>