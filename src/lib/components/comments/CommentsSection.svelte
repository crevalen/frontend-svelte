<script lang="ts">
  import { writable } from 'svelte/store';
  import { slide } from 'svelte/transition';
  import Comment from './Comment.svelte';
  import CommentForm from './CommentForm.svelte';

  export let initialComments: any[] = [];
  export let postSlug: string;

  const comments = writable(initialComments);

  async function refetchComments() {
    const response = await fetch(`https://cms-kustom.vercel.app/api/comments/${postSlug}`);
    if (response.ok) {
      const newComments = await response.json();
      comments.set(newComments);
    }
  }
</script>

<section class="mt-12 py-8 border-t border-gray-200">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">
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
      <p class="text-gray-500">Jadilah yang pertama berkomentar!</p>
    {/if}
  </div>

  <div>
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Tinggalkan Komentar</h3>
    <CommentForm postSlug={postSlug} on:commentPosted={refetchComments} />
  </div>
</section>