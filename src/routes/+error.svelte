<script lang="ts">
 import { page } from '$app/stores';
 import StylishSearchForm from '$lib/components/ui/StylishSearchForm.svelte';
</script>

<svelte:head>
 <title>{$page.status}: {$page.error?.message}</title>
</svelte:head>

<div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 md:px-12">
 <div class="max-w-lg">
  <h1 class="text-6xl sm:text-8xl font-extrabold tracking-tight text-cyan-600 dark:text-cyan-400 mb-4">
   {$page.status}
  </h1>

  <p class="mt-4 text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300">
   {#if $page.status === 404}
    Oops! Halaman tidak ditemukan.
   {:else}
    Terjadi Kesalahan.
   {/if}
  </p>
  <p class="mt-2 text-gray-500 dark:text-gray-400">
   {#if $page.status === 404}
    Mungkin URL yang Anda masukkan salah atau halaman tersebut telah dipindahkan.
   {:else}
    {$page.error?.message}
   {/if}
  </p>

  <div class="mt-8">
   <StylishSearchForm />
  </div>

  <a href="/" class="inline-block mt-8 text-cyan-600 dark:text-cyan-400 hover:underline">
   Kembali ke Beranda
  </a>
 </div>
</div>