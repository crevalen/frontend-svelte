<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  const dispatch = createEventDispatcher();
function handleResponse(accepted: boolean) {
    dispatch(accepted ? 'accept' : 'reject');
}
</script>

<div
  transition:fly={{ x: -20, duration: 400, delay: 300 }}
  class="fixed top-4 left-4 z-50 w-[calc(100%-2rem)] max-w-xs"
>
  <div class="border border-slate-200 bg-white p-5">
    <h3 class="text-base font-semibold text-gray-800">Jangan lewatkan update terbaru</h3>
    <p class="mt-2 text-sm text-slate-600">
      Aktifkan notifikasi untuk menerima artikel langsung di perangkat Anda. Kami tidak akan
      mengirim spam.
    </p>

    <div class="mt-4 flex gap-2">
      <button
        on:click={() => handleResponse(true)}
        class="w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-black transition-colors active:scale-95"
      >
        Aktifkan
      </button>
      <button
        on:click={() => handleResponse(false)}
       class="w-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
      >
        Nanti Saja
      </button>
    </div>
  </div>
</div>