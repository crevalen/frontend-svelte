<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  function handleResponse(accepted: boolean) {
    dispatch(accepted ? 'accept' : 'reject');
  }
</script>

<!-- BACKDROP -->
<div
  transition:fade={{ duration: 300 }}
  class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
  aria-hidden="true"
></div>

<!-- NOTIFICATION CARD -->
<div
  transition:fly={{ y: -10, duration: 300, delay: 100 }}
  class="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
>
  <div class="rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-gray-200 dark:border-slate-700 p-6 text-center transition-all">
    
    <!-- TITLE -->
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      Aktifkan Notifikasi?
    </h3>
    
    <!-- DESCRIPTION -->
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
      Dapatkan update artikel terbaru langsung ke perangkatmu. Kami tidak akan spam.
    </p>

    <!-- ACTION BUTTONS -->
    <div class="mt-5 flex justify-center gap-4">
      <button
        on:click={() => handleResponse(false)}
        class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition"
      >
        Nanti Saja
      </button>
      <button
        on:click={() => handleResponse(true)}
        class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-md transition-colors"
      >
        Aktifkan
      </button>
    </div>
  </div>
</div>
