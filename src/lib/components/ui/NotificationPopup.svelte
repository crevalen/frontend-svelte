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
  class="fixed top-4 left-4 z-50 w-[calc(100%-2rem)] max-w-sm"
>
  <div class="flex items-start gap-3 rounded-lg bg-white p-4 shadow-xl shadow-slate-900/10">
    
    <div class="flex-shrink-0 text-slate-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-6 w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    </div>

    <div class="flex-grow">
      <h3 class="text-sm font-bold text-slate-800">Jangan Lewatkan Update Terbaru</h3>
      <p class="mt-0.5 text-sm text-slate-600">
        Aktifkan notifikasi untuk menerima artikel terbaru.
      </p>

      <div class="mt-4 flex gap-2">
        <button
          on:click={() => handleResponse(true)}
          class="cursor-pointer w-full rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-slate-700 active:scale-95"
        >
          Aktifkan
        </button>
        <button
          on:click={() => handleResponse(false)}
          class="cursor-pointer w-full rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          Nanti Saja
        </button>
      </div>
    </div>
  </div>
</div>