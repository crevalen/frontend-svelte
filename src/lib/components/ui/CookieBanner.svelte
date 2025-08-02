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
  class="fixed bottom-4 left-1/2 z-[99] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2"
>
  <div class="rounded-md border border-slate-200 bg-white p-4 shadow-lg">
    <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div class="flex-grow">
        <h3 class="font-semibold text-gray-800">Persetujuan Cookie</h3>
        <p class="mt-1 text-sm text-slate-600">
          Situs ini menggunakan cookie untuk meningkatkan fungsionalitas dan analitik. Lihat
          <a href="/p/kebijakan-privasi" class="font-medium text-cyan-600 hover:underline">
            Kebijakan Privasi
          </a>
          kami.
        </p>
      </div>

      <div class="flex flex-shrink-0 items-center gap-2">
        <button
          on:click={reject}
          class="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          Tolak
        </button>
        <button
          on:click={accept}
          class="rounded-md bg-gray-800 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-gray-900 active:scale-95"
        >
          Setuju
        </button>
      </div>
    </div>
  </div>
</div>