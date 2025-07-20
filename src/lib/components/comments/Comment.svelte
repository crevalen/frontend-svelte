<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { formatDate } from '$lib/utils/formatters';
  import CommentForm from './CommentForm.svelte';

  export let comment: any;
  export let postSlug: string;

  let showReplyForm = false;
  const dispatch = createEventDispatcher();

  // Daftar gaya avatar dari DiceBear
  const avatarStyles = [
    'miniavs',      // Gaya minimalis
    'adventurer',   // Gaya fantasi
    'bottts',       // Gaya robot
    'pixel-art',    // Gaya pixel
    'identicon',    // Gaya grafis geometris
    'notionists'    // Gaya ilustrasi
  ];

  // Pilih gaya avatar secara konsisten berdasarkan nama penulis
  // Ini memastikan satu penulis akan selalu punya gaya avatar yang sama
  const styleIndex = (comment.authorName.charCodeAt(0) + comment.authorName.length) % avatarStyles.length;
  const avatarStyle = avatarStyles[styleIndex];

  // Buat URL avatar yang unik untuk setiap penulis
  const avatarUrl = `https://api.dicebear.com/8.x/${avatarStyle}/svg?seed=${encodeURIComponent(comment.authorName)}`;

  function handleCommentPosted() {
    showReplyForm = false;
    dispatch('commentPosted');
  }
</script>

<article class="flex space-x-4">
  <div class="flex-shrink-0">
    <img src={avatarUrl} alt={comment.authorName} class="w-10 h-10 rounded-full bg-gray-100" />
  </div>
  <div class="flex-grow">
    <div class="flex items-center space-x-2">
      <span class="font-bold text-gray-800">{comment.authorName}</span>
      <span class="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
    </div>
    <div class="prose prose-sm max-w-none text-gray-700 mt-1">
      <p>{comment.content}</p>
    </div>
    <button on:click={() => showReplyForm = !showReplyForm} class="text-sm font-semibold text-cyan-600 hover:text-cyan-800 mt-2">
      Balas
    </button>

    {#if showReplyForm}
      <div class="mt-4">
        <CommentForm 
          postSlug={postSlug} 
          parentId={comment.id} 
          on:commentPosted={handleCommentPosted}
          onCancel={() => showReplyForm = false}
        />
      </div>
    {/if}

    {#if comment.replies && comment.replies.length > 0}
      <div class="mt-6 space-y-6 border-l-2 border-gray-200 pl-6">
        {#each comment.replies as reply}
          <svelte:self comment={reply} postSlug={postSlug} on:commentPosted />
        {/each}
      </div>
    {/if}
  </div>
</article>