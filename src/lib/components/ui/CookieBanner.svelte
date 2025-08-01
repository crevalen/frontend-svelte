<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  function accept() {
    dispatch('accept');
  }

  function reject() {
    dispatch('reject');
  }
</script>

<div
  in:fly={{ y: 20, duration: 400, delay: 300 }}
  class="fixed bottom-6 right-6 z-[99] max-w-md"
>
  <div
    class="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 p-5 shadow-lg backdrop-blur-lg"
  >
    <div class="flex flex-col gap-4">
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white">Persetujuan Cookie</h3>
        <p class="mt-1 text-sm text-slate-700 dark:text-slate-300">
          Situs ini menggunakan cookie untuk fungsionalitas dan analitik. Lihat 
          <a href="/p/kebijakan-privasi" class="font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
            Kebijakan Privasi
          </a> kami.
        </p>
      </div>
      <div class="flex w-full items-center gap-3">
        <button
          on:click={reject}
          class="w-full px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
        >
          Tolak
        </button>
        <button
          on:click={accept}
          class="w-full px-5 py-2 rounded-lg text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 active:scale-95 transition-all"
        >
          Setuju
        </button>
      </div>
    </div>
  </div>
</div>