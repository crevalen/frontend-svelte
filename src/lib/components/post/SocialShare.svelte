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
      icon: '<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" class="w-6 h-6 invert" alt="Facebook"/>',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-[#1877F2] hover:bg-[#166fe5]'
    },
    { 
      name: 'X (Twitter)', 
      icon: '<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" class="w-6 h-6 invert" alt="X"/>',
      href: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'bg-[#000000] hover:bg-[#222]'
    },
    { 
      name: 'WhatsApp',
      icon: '<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" class="w-6 h-6 invert" alt="WhatsApp"/>',
      href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      color: 'bg-[#25D366] hover:bg-[#1ebe57]'
    },
    { 
      name: 'LinkedIn',
      icon: '<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" class="w-6 h-6 invert" alt="LinkedIn"/>',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'bg-[#0A66C2] hover:bg-[#095ab0]'
    },
    { 
      name: 'Threads',
      icon: '<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/threads.svg" class="w-6 h-6 invert" alt="Threads"/>',
      href: `https://www.threads.net/intent/post?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`,
      color: 'bg-[#000000] hover:bg-[#222]'
    },
    { 
      name: 'Tumblr',
      icon: '<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tumblr.svg" class="w-6 h-6 invert" alt="Tumblr"/>',
      href: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: 'bg-[#36465D] hover:bg-[#2f3d52]'
    },
    { 
      name: 'Flipboard',
      icon: '<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/flipboard.svg" class="w-6 h-6 invert" alt="Flipboard"/>',
      href: `https://share.flipboard.com/bookmarklet/popout?v=2&title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'bg-[#E12828] hover:bg-[#c92424]'
    },
  ];
</script>

<div class="flex items-center gap-3">
  <span class="text-sm font-semibold text-gray-700">Bagikan:</span>
  <div class="flex flex-wrap items-center gap-2">
    {#each platforms as platform}
      <a 
        href={platform.href} 
        target="_blank" 
        rel="noopener noreferrer" 
        title="Bagikan ke {platform.name}"
        class="w-11 h-11 flex items-center justify-center rounded-lg text-white shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300 {platform.color}"
      >
        {@html platform.icon}
      </a>
    {/each}

    <!-- Tombol Copy Link Modern -->
    <button 
      on:click={copyLink} 
      class="w-11 h-11 flex items-center justify-center rounded-lg bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
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
  img.invert {
    filter: brightness(0) invert(1);
  }
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
