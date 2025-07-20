<script lang="ts">
  export let currentPage: number;
  export let totalPages: number;
</script>
<div class="flex items-center justify-center gap-2 mt-12">
  {#if currentPage > 1}
    <a href={currentPage > 2 ? `/?page=${currentPage - 1}` : '/'} class="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-600">&laquo; Sebelumnya</a>
  {/if}
  {#each Array(totalPages) as _, i}
    {@const page = i + 1}
    <a href={page === 1 ? '/' : `/?page=${page}`} class="px-4 py-2 rounded-md text-sm font-medium" class:bg-cyan-600={currentPage === page} class:text-white={currentPage === page} class:bg-gray-200={currentPage !== page} class:dark:bg-slate-700={currentPage !== page}>{page}</a>
  {/each}
  {#if currentPage < totalPages}
    <a href={`/?page=${currentPage + 1}`} class="px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-600">Berikutnya &raquo;</a>
  {/if}
</div>