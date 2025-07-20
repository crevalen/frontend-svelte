<script lang="ts">
  import { slide } from 'svelte/transition';
  
  // Menerima daftar judul dari halaman postingan
  export let headings: { id: string; text: string; level: 'h2' | 'h3' }[] = [];
</script>

<div 
  transition:slide={{ duration: 300 }}
  class="border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 my-8"
>
  <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Daftar Isi</h2>
  <ul class="space-y-2">
    {#each headings as heading}
      <li>
        <a 
          href="#{heading.id}" 
          class="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          class:pl-4={heading.level === 'h3'}
        >
          {heading.text}
        </a>
      </li>
    {/each}
  </ul>
</div>