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
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12"/></svg>', 
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, 
      color: 'bg-[#1877F2] hover:bg-[#166fe5]' 
    },
    { 
      name: 'X (Twitter)', 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h4.6l5.2 7.6L18.2 3H21l-7.1 9.9L21 21h-4.6l-5.4-7.9L5.4 21H3l7.5-10.3z"/></svg>', 
      href: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, 
      color: 'bg-[#000000] hover:bg-[#222]' 
    },
    { 
      name: 'WhatsApp', 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.6 13.6c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 .9s-.5 0-.8-.4c-.3-.3-1.3-1.1-2.5-2.2-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.2-.7.2-.2.5-.6.7-.8.2-.3.3-.5.5-.8.2-.3.1-.5 0-.8-.1-.3-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.6s1.2 3 1.4 3.2c.2.3 2.3 3.5 5.6 4.9.8.3 1.5.5 2 .6.8.2 1.5.2 2.1.1.6-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.3 1.2 4.7L2 22l5.4-1.2c1.3.7 2.8 1.1 4.6 1.1 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>', 
      href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, 
      color: 'bg-[#25D366] hover:bg-[#1ebe57]' 
    },
    { 
      name: 'LinkedIn', 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-9.5 14v-6H7v6zM7 9h.02a1 1 0 1 0-.02 0zm9 8v-3.5c0-2-1-3-2.3-3a2 2 0 0 0-1.7.9V11H10v6h2v-3.5a1 1 0 0 1 2-.5V17z"/></svg>', 
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, 
      color: 'bg-[#0A66C2] hover:bg-[#095ab0]' 
    },
    { 
      name: 'Threads', 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 2c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8zm-.5 3c-2.5 0-4.5 1.8-4.5 4.1 0 1.5.8 2.7 2 3.3l-.7 1.3c-.6-.3-1.6-1.1-1.6-1.1s.2 1.8 2.2 2.9c-.6.8-1.6 1.3-2.9 1.3-.3 0-.6 0-.9-.1.8 1.3 2.2 2.2 3.9 2.2 2.5 0 4.5-1.8 4.5-4.1 0-1.5-.8-2.7-2-3.3l.7-1.3c.6.3 1.6 1.1 1.6 1.1s-.2-1.8-2.2-2.9c.6-.8 1.6-1.3 2.9-1.3.3 0 .6 0 .9.1-.8-1.3-2.2-2.2-3.9-2.2z"/></svg>', 
      href: `https://www.threads.net/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, 
      color: 'bg-[#000000] hover:bg-[#222]' 
    },
    { 
      name: 'Tumblr', 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14.6 15.3c-.4.2-.8.3-1.2.3-.5 0-.9-.1-1.2-.4-.3-.2-.5-.5-.6-.9-.1-.3-.1-.9-.1-1.8v-3.2h3.1V6H11V3.5l-2.4.8V6H6v3.3h2.6V15c0 1.3.3 2.3.9 3 .7.9 1.9 1.4 3.6 1.4 1 0 1.9-.2 2.8-.6z"/></svg>', 
      href: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, 
      color: 'bg-[#36465D] hover:bg-[#2f3d52]' 
    },
    { 
      name: 'Flipboard', 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M0 0v32h32V0zm25.6 12.8h-6.4v6.4h-6.4v6.4H6.4V6.4h19.2z"/></svg>', 
      href: `https://share.flipboard.com/bookmarklet/popout?v=2&title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, 
      color: 'bg-[#E12828] hover:bg-[#c92424]' 
    },
  ];
</script>

<div class="flex items-center gap-3">
  <span class="text-sm font-semibold text-gray-600">Bagikan:</span>
  <div class="flex items-center space-x-2">
    {#each platforms as platform}
      <a 
        href={platform.href} 
        target="_blank" 
        rel="noopener noreferrer" 
        title="Bagikan ke {platform.name}"
        class="w-9 h-9 flex items-center justify-center rounded-full text-white transform hover:-translate-y-1 transition-all duration-300 {platform.color}"
      >
        <div class="w-5 h-5">{@html platform.icon}</div>
      </a>
    {/each}

    <!-- Tombol Copy Link -->
    <button 
      on:click={copyLink} 
      class="w-9 h-9 flex items-center justify-center rounded-full bg-gray-500 hover:bg-gray-600 text-white transform hover:-translate-y-1 transition-all duration-300"
      title="Salin Link"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
    </button>

    {#if copied}
      <span class="text-xs text-green-600 font-medium">Link disalin!</span>
    {/if}
  </div>
</div>
