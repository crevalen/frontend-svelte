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
  class="fixed bottom-5 left-1/2 z-[99] w-[calc(100%-2.5rem)] max-w-4xl -translate-x-1/2"
>
  <div class="rounded-lg bg-white p-5 shadow-xl shadow-slate-900/10">
    <div class="flex flex-col items-center gap-4 text-center md:flex-row md:gap-6 md:text-left">
      <div class="flex flex-grow items-center gap-4">
        <div class="hidden flex-shrink-0 text-slate-500 md:block">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-8 w-8">
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634Zm-8.468 5.25c.108.215.395.634.936.634.54 0 .828-.419.936-.634a1.96 1.96 0 0 0 .189-.866c0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex-grow">
          <h3 class="font-semibold text-slate-800">Persetujuan Cookie</h3>
          <p class="mt-1 text-sm text-slate-600">
            Situs ini menggunakan cookie untuk fungsionalitas dan analitik. Lihat
            <a
              href="/p/kebijakan-privasi"
              class="font-medium text-slate-900 underline decoration-slate-900/50 transition hover:decoration-slate-900"
            >
              Kebijakan Privasi
            </a>
            kami.
          </p>
        </div>
      </div>

      <div class="flex w-full flex-shrink-0 gap-3 md:w-auto">
        <button
          on:click={reject}
          class="cursor-pointer w-full rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200"
        >
          Tolak
        </button>
        <button
          on:click={accept}
          class="cursor-pointer w-full rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 active:scale-95"
        >
          Setuju
        </button>
      </div>
    </div>
  </div>
</div>