<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let postSlug: string;
  export let parentId: string | null = null;
  export let onCancel: (() => void) | null = null;

  let authorName = '';
  let authorEmail = '';
  let content = '';
  let isLoading = false;
  let message = '';
  let messageType: 'success' | 'error' = 'success';

  const dispatch = createEventDispatcher();

  async function handleSubmit() {
    if (!content || !authorName || !authorEmail) {
      message = 'Nama, Email, dan Komentar wajib diisi.';
      messageType = 'error';
      return;
    }
    isLoading = true;
    message = '';

    const response = await fetch(`/api/comments/${postSlug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, authorName, authorEmail, parentId })
    });

    const result = await response.json();
    isLoading = false;

    if (response.ok) {
      message = result.message;
      messageType = 'success';
      authorName = '';
      authorEmail = '';
      content = '';
      dispatch('commentPosted');
    } else {
      message = result.message || 'Gagal mengirim komentar.';
      messageType = 'error';
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  {#if message}
    <div class="p-3 rounded-md text-sm" class:bg-green-100={messageType === 'success'} class:text-green-800={messageType === 'success'} class:bg-red-100={messageType === 'error'} class:text-red-800={messageType === 'error'}>
      {message}
    </div>
  {/if}

  <textarea 
    bind:value={content} 
    rows="4" 
    placeholder="Tulis komentar Anda..." 
    class="w-full p-3 border rounded-md transition bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
  ></textarea>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input type="text" bind:value={authorName} placeholder="Nama Anda" class="w-full p-3 border rounded-md transition bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
    <input type="email" bind:value={authorEmail} placeholder="Email Anda (tidak akan dipublikasikan)" class="w-full p-3 border rounded-md transition bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
  </div>

  <div class="flex items-center gap-4">
    <button type="submit" disabled={isLoading} class="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 disabled:bg-gray-400 transition-colors">
      {isLoading ? 'Mengirim...' : 'Kirim Komentar'}
    </button>
    {#if onCancel}
      <button type="button" on:click={onCancel} class="text-sm text-gray-600 hover:text-gray-900">Batal</button>
    {/if}
  </div>
</form>