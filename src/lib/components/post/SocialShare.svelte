<script lang="ts">
  export let url: string;
  export let title: string;

  let copied = false;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error("Gagal menyalin link:", err);
    }
  };

  const platforms = [
    { 
      name: 'Facebook', 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12A10 10 0 1 0 10.6 22v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12z"/></svg>',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-[#1877F2] hover:bg-[#166fe5]'
    },
    { 
      name: 'X (Twitter)', 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h4.6l5.2 7.6L18.2 3H21l-7.1 9.9L21 21h-4.6l-5.4-7.9L5.4 21H3l7.5-10.3z"/></svg>',
      href: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'bg-[#000000] hover:bg-[#222]'
    },
    { 
      name: 'WhatsApp',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.7 14.7L2 22l5.5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.5-1 1-1.5 1.2-.4.2-.9.3-1.4.2-.8 0-1.5-.3-2.1-.6-1.2-.6-2.2-1.5-3.1-2.5a8.8 8.8 0 0 1-1.9-3c-.1-.5 0-1 .2-1.4.2-.5.7-1.3 1.2-1.5.3-.1.6-.1.9 0 .3.1.7 1.1.8 1.4.1.2.1.3 0 .5s-.3.4-.4.6c-.1.1-.2.2-.2.3 0 .2.2.5.3.7.5.8 1.1 1.4 1.9 1.9.3.2.6.3.8.2.2-.1.3-.2.4-.3.1-.1.2-.2.3-.3.1-.1.2-.2.4-.1s1 .5 1.4.7c.1.1.3.1.4.2 0 .1 0 .3-.1.5z"/></svg>',
      href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      color: 'bg-[#25D366] hover:bg-[#1ebe57]'
    },
    { 
      name: 'LinkedIn',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-9.5 14v-6H7v6zM7 9h.02a1 1 0 1 0-.02 0zm9 8v-3.5c0-2-1-3-2.3-3a2 2 0 0 0-1.7.9V11H10v6h2v-3.5a1 1 0 0 1 2-.5V17z"/></svg>',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'bg-[#0A66C2] hover:bg-[#095ab0]'
    },
  ];
</script>

<div class="flex items-center gap-3">
  <span class="text-sm font-semibold text-gray-700">Bagikan:</span>
  <div class="flex items-center gap-2">
    {#each platforms as platform}
      <a 
        href={platform.href} 
        target="_blank" 
        rel="noopener noreferrer" 
        title="Bagikan ke {platform.name}"
        class="w-10 h-10 flex items-center justify-center rounded-xl text-white shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 {platform.color}"
      >
        <div class="w-6 h-6">{@html platform.icon}</div>
      </a>
    {/each}

    <!-- Tombol Copy Link Modern -->
    <button 
      on:click={copyLink} 
      class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
      title="Salin Link"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
    </button>

    {#if copied}
      <span class="text-xs text-green-600 font-medium animate-fade-in">Link disalin!</span>
    {/if}
  </div>
</div>

<style>
  .animate-fade-in {
    animation: fadeInOut 2s ease-in-out;
  }
  @keyframes fadeInOut {
    0% { opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; }
  }
</style>
