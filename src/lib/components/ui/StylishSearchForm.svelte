<script lang="ts">
 let searchTerm = '';
</script>

<form action="/search" method="GET" class="w-full">
 <div class="relative rounded-full shadow-md transition-shadow hover:shadow-lg focus-within:shadow-lg">
  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
   <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
  </div>
  <input
   type="search"
   id="search-input"
   class="block w-full p-3.5 pl-10 text-sm text-gray-900 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full focus:ring-cyan-500 focus:border-cyan-500 outline-none"
   placeholder="Cari di situs ini..."
   bind:value={searchTerm}
   required
  />
 </div>
</form>