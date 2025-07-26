<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  function accept() {
    dispatch('accept');
  }
</script>

<div
  in:fly={{ y: 50, x: 50, duration: 500, delay: 300 }}
  class="fixed bottom-6 right-6 z-[99] max-w-sm"
>
  <div
    class="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 p-6 shadow-2xl shadow-cyan-500/20 backdrop-blur-lg"
  >
    <div class="flex flex-col gap-y-4">
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0">
          <svg
            class="h-10 w-10 text-cyan-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M21.59 11.59l-2.03-2.03a1.011 1.011 0 00-1.42 0l-2.58 2.58a1 1 0 000 1.41l2.58 2.58a1 1 0 001.42 0l2.03-2.03a1.004 1.004 0 000-1.42zm-3.03 5.03a1 1 0 00-1.41 0l-2.58 2.58a1 1 0 000 1.41l2.03 2.03a1 1 0 001.41 0l2.58-2.58a1 1 0 000-1.41zM8.99 2.41a1.004 1.004 0 000 1.42l2.58 2.58a1 1 0 001.42 0l2.03-2.03a1 1 0 000-1.41l-2.03-2.03a1 1 0 00-1.41 0zM11.58 18l-2.58 2.58a1 1 0 01-1.41 0l-2.03-2.03a1.004 1.004 0 010-1.42l2.03-2.03a1 1 0 011.41 0zM4.53 8.06a1 1 0 00-1.42 0L1.08 10.1a1.004 1.004 0 000 1.42l2.03 2.03a1 1 0 001.42 0l2.58-2.58a1 1 0 000-1.41z"
            ></path>
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 dark:text-gray-100">Persetujuan Cookie</h3>
          <p class="text-xs text-slate-600 dark:text-slate-400">Kami menggunakan cookie untuk meningkatkan pengalaman Anda.</p>
        </div>
      </div>

      <p class="text-sm text-gray-700 dark:text-gray-300">
        Website ini menggunakan cookie untuk memastikan Anda mendapatkan pengalaman terbaik. Anda bisa mempelajari lebih lanjut di halaman
        <a href="/p/kebijakan-privasi" class="font-medium text-cyan-600 dark:text-cyan-400 hover:underline">
          Kebijakan Privasi
        </a>
        kami.
      </p>

      <button
        on:click={accept}
        class="group inline-flex w-full items-center justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-cyan-700 active:scale-95 disabled:bg-gray-400"
      >
        Mengerti & Setuju
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
        >
          <path
            fill-rule="evenodd"
            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
            clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  </div>
</div>