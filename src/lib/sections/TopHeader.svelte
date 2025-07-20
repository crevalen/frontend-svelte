<script lang="ts">
  import { browser } from '$app/environment';

  // Ambil daftar halaman dari API saat komponen pertama kali dimuat
  export let pages: { slug: string, title: string }[] = [];

  let currentDate = '';
  if (browser) {
    currentDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<div class="bg-cyan-800 text-white text-sm hidden md:block">
  <div class="container mx-auto px-4 flex justify-between items-center h-10">
    <span>{currentDate}</span>

    <nav class="flex items-center gap-x-6">
      {#each pages as page}
        <a href="/p/{page.slug}" class="hover:text-cyan-200 transition-colors">
          {page.title}
        </a>
      {/each}
    </nav>
  </div>
</div>