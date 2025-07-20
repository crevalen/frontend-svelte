<script lang="ts">
  let searchTerm = '';
</script>

<form action="/search" method="GET" class="relative group">
  <input
    type="search"
    name="q"
    bind:value={searchTerm}
    placeholder="Cari artikel..."
    class="w-40 sm:w-56 bg-gray-100 dark:bg-slate-700/50 text-gray-800 dark:text-white rounded-full pl-10 pr-4 py-1.5 text-sm 
           transition-all duration-300 ease-in-out 
           focus:w-56 sm:focus:w-72 
           focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
  />
  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21l-4.3-4.3"/></svg>
  </div>
</form>