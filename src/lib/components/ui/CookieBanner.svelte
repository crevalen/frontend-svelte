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
  class="fixed bottom-4 right-4 z-[99] w-[calc(100%-2rem)] max-w-sm"
>
  <div class="border border-slate-200 bg-white p-4">
    <div class="flex flex-col gap-3">
      <div>
        <h3 class="font-semibold text-gray-800">Persetujuan Cookie</h3>
        <p class="mt-1 text-sm text-slate-600">
          Situs ini menggunakan cookie untuk meningkatkan fungsionalitas dan analitik. Lihat
         <a href="/p/kebijakan-privasi" class="font-medium text-cyan-600 hover:underline">
            Kebijakan Privasi
          </a>
          kami.
       </p>
      </div>
      <div class="flex w-full items-center gap-2">
        <button
          on:click={reject}
          class="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          Tolak
        </button>
        <button
          on:click={accept}
         class="w-full px-5 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 active:scale-95 transition-all"
        >
          Setuju
        </button>
      </div>
    </div>
  </div>
</div>