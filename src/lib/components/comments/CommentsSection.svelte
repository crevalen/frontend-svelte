<script lang="ts">
  import { writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import Comment from './Comment.svelte';
  import CommentForm from './CommentForm.svelte';

  export let initialComments: any[] = [];
  export let postSlug: string;

  const comments = writable(initialComments);

  async function refetchComments() {
    // PERBAIKAN: Hapus URL absolut, gunakan path relatif
    const response = await fetch(`/api/comments/${postSlug}`);
    if (response.ok) {
      const newComments = await response.json();
      comments.set(newComments);
    }
  }
</script>

<section class="mt-12">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
    {$comments.length} Komentar
  </h2>
  <div class="space-y-8 mb-10">
    {#if $comments.length > 0}
      {#each $comments as comment (comment.id)}
        <div in:slide|local>
          <Comment {comment} {postSlug} on:commentPosted={refetchComments} />
        </div>
      {/each}
    {:else}
      <p class="text-gray-500 dark:text-gray-400">Jadilah yang pertama berkomentar!</p>
    {/if}
  </div>
  <div>
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Tinggalkan Komentar</h3>
    <CommentForm postSlug={postSlug} on:commentPosted={refetchComments} />
  </div>
</section>