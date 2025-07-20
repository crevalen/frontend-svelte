<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment'; // <-- Impor 'browser'

  let scrollPercentage = 0;

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollPercentage = (scrollTop / docHeight) * 100;
  }

  onMount(() => {
    // Hanya tambahkan event listener jika kode berjalan di browser
    if (browser) {
      window.addEventListener('scroll', handleScroll);
    }
  });

  onDestroy(() => {
    // Hanya hapus event listener jika kode berjalan di browser
    if (browser) {
      window.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<div class="fixed top-0 left-0 w-full h-1 z-50">
  <div 
    class="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-100 ease-linear" 
    style="width: {scrollPercentage}%;"
  ></div>
</div>