<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  function accept() {
    dispatch('accept');
  }
</script>

<div
  in:fly={{ y: 20, duration: 500, delay: 300 }}
  class="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-4xl z-50"
>
  <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-200 dark:border-slate-700 shadow-2xl p-4">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      
      <p class="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
        Website ini menggunakan cookie untuk memastikan Anda mendapatkan pengalaman terbaik.
        <a href="/p/kebijakan-privasi" class="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
          Kebijakan Privasi
        </a>
      </p>
      
      <button 
        on:click={accept}
        class="px-6 py-2 bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors flex-shrink-0"
      >
        Mengerti & Setuju
      </button>

    </div>
  </div>
</div>