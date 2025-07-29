<script lang="ts">
  // Anda bisa membuat daftar ini dinamis dari CMS nanti jika perlu
  const kategoriLinks = [
    { name: 'Tips', href: '/kategori/tips' },
    { name: 'Kripto', href: '/kategori/kripto' },
    { name: 'Investasi', href: '/kategori/investasi' }
  ];
  const halamanLinks = [
    { name: 'Tentang Kami', href: '/p/tentang-kami' },
    { name: 'Kontak', href: '/p/kontak' },
    { name: 'Kebijakan Privasi', href: '/p/kebijakan-privasi' }
  ];
</script>

<footer class="bg-slate-900 text-slate-400">
  <div class="container max-w-[1100px] mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      
      <div class="md:col-span-2">
        <a href="/" class="text-2xl font-bold text-white">Crevalen</a>
        <p class="mt-4 text-sm max-w-md">
          Platform edukasi finansial modern yang membahas tuntas seputar investasi, trading, saham, dan aset kripto.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-white tracking-wider uppercase">Kategori</h3>
        <ul class="mt-4 space-y-2">
          {#each kategoriLinks as link}
            <li><a href={link.href} class="hover:text-white transition-colors">{link.name}</a></li>
          {/each}
        </ul>
      </div>
      
      <div>
        <h3 class="font-semibold text-white tracking-wider uppercase">Halaman</h3>
        <ul class="mt-4 space-y-2">
          {#each halamanLinks as link}
            <li><a href={link.href} class="hover:text-white transition-colors">{link.name}</a></li>
          {/each}
        </ul>
      </div>
    </div>

    <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center">
      <p class="text-sm">
        &copy; {new Date().getFullYear()} Crevalen. All Rights Reserved.
      </p>
      <div class="flex space-x-3 mt-4 sm:mt-0">
  <a href="https://x.com/crevalens" aria-label="Twitter (X)"
     class="group w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#1D9BF0]/20 transition-all">
    <svg class="w-5 h-5 text-slate-300 group-hover:text-[#1D9BF0] transition-colors" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h4.6l5.2 7.6L18.2 3H21l-7.1 9.9L21 21h-4.6l-5.4-7.9L5.4 21H3l7.5-10.3z"/>
    </svg>
  </a>

  <a href="https://facebook.com/crevalens" aria-label="Facebook"
     class="group w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#1877F2]/20 transition-all">
    <svg class="w-5 h-5 text-slate-300 group-hover:text-[#1877F2] transition-colors" 
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"/>
    </svg>
  </a>

  <a href="https://www.threads.net/@crevalens" aria-label="Threads"
     class="group w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/20 transition-all">
    <svg class="w-5 h-5 text-slate-300 group-hover:text-white transition-colors"
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  </a>

  <a href="https://flipboard.com/@Crevalen" aria-label="Flipboard"
     class="group w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#E12828]/20 transition-all">
    <svg class="w-5 h-5 text-slate-300 group-hover:text-[#E12828] transition-colors"
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor">
      <path d="M0 0v32h32V0H0zm19 13h-6v6h-6v6H7V7h18v6z"/>
    </svg>
  </a>
</div>

    </div>
  </div>
<nav>
    <a rel="me" href="https://mastodon.social/@crevalen" class="text-blue-500 hover:underline">
      Mastodon
    </a>
  </nav>
</footer>