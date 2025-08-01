<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  function handleResponse(accepted: boolean) {
    dispatch(accepted ? 'accept' : 'reject');
  }
</script>

<div
  transition:fade={{ duration: 300 }}
  class="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
  aria-hidden="true"
  on:click={() => handleResponse(false)}
></div>

<div
  transition:fly={{ y: -20, duration: 400, delay: 100 }}
  class="fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
>
  <div class="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-6 shadow-xl">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      Jangan lewatkan update terbaru
    </h3>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
      Aktifkan notifikasi untuk menerima artikel langsung di perangkat Anda. Kami tidak akan mengirim spam.
    </p>
    
    <div class="mt-5 flex gap-3">
      <button
        on:click={() => handleResponse(true)}
        class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 active:scale-95 transition-all"
      >
        Aktifkan Notifikasi
      </button>
      <button
        on:click={() => handleResponse(false)}
        class="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
      >
        Nanti Saja
      </button>
    </div>
  </div>
</div>