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
      <div class="flex space-x-4 mt-4 sm:mt-0">
       <a href="https://x.com/crevalens" aria-label="Twitter" class="hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
        </a>
        <a href="https://facebook.com/crevalens" aria-label="Facebook" class="hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"/></svg>
        </a>
        <a href="https://www.threads.com/@aldysm15" aria-label="Threads" class="hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/></svg>
        </a>
        <a href="https://flipboard.com/@Crevalen" aria-label="Flipboard" class="hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path d="M0 0v32h32V0H0zm19 13h-6v6h-6v6H7V7h18v6z"/></svg>
        </a>

      </div>
    </div>
  </div>
</footer>