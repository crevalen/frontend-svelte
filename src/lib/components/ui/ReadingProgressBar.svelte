<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment'; 

  let scrollPercentage = 0;

  function handleScroll() {
    const scrollTop = window.scrollY;
   const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollPercentage = (scrollTop / docHeight) * 100;
 }

  onMount(() => {
    if (browser) {
      window.addEventListener('scroll', handleScroll);
    }
  });
 onDestroy(() => {
    if (browser) {
      window.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<div class="fixed top-0 left-0 w-full h-1.5 z-50 mix-blend-difference">
  <div
    class="h-full bg-white transition-all duration-150 ease-linear"
    style="width: {scrollPercentage}%;"
 ></div>
</div>