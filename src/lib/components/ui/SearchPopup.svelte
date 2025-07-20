<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import StylishSearchForm from './StylishSearchForm.svelte';

  export let isOpen = false;
</script>

{#if isOpen}
  <div
    transition:fade={{ duration: 200 }}
    on:click={() => (isOpen = false)}
    on:keydown
    class="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90]"
    aria-hidden="true"
  ></div>

  <div
    transition:fly={{ y: -50, duration: 300 }}
    class="fixed top-0 left-0 right-0 z-[99] p-4"
  >
    <div class="container mx-auto max-w-lg">
      <StylishSearchForm />
    </div>
  </div>
{/if}