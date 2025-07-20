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
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.12 2.342c-2.26.263-4.14.86-5.65 2.233C6.73 6.09 6.2 8.35 6.2 11.41v.83c0 .88-.03 1.6-.1 2.13-.07.53-.17.92-.3 1.17-.13.25-.3.4-.5.45-.2.05-.45 0-.75-.15l-.6-.3c-.25-.15-.45-.25-.6-.3l-1.35-.65c-.2-.1-.35-.05-.45.1s-.15.35-.15.55v.9c.1.15.25.25.45.3l1.35.65c.2.1.4.2.6.3l.6.3c.3.15.6.2.9.2.95 0 1.7-.266 2.25-.8.55-.534.82-1.3.82-2.3v-.68c0-.3-.02-.633-.05-1s-.05-.7-.05-1v-1.2c0-2.8.43-4.9 1.3-6.3.87-1.4 2.2-2.1 4-2.1.8 0 1.52.12 2.15.35.63.23 1.17.62 1.6 1.15.43.53.65 1.15.65 1.85s-.22 1.3-.65 1.85c-.43.53-1 .92-1.8 1.15-.7.2-1.5.17-2.4-.1-.9-.27-1.7-.7-2.4-1.25-.7-.55-1.2-1.25-1.5-2.1-.2-.6-.2-1.25-.05-1.95.1-.45.3-.85.55-1.2.25-.35.5-.6.75-.75s.5-.25.75-.25.5.05.75.25c.25.2.5.45.75.75.25.3.45.65.6.95.15.3.2.65.2 1s-.07 1.25-.2 1.85c-.13.6-.35 1.15-.65 1.65-.3.5-.7.9-1.2 1.2-.5.3-1.05.5-1.65.6-.6.1-1.2.1-1.8.05l-1-.1v-2.1c.45.05.88.08 1.3.08.85 0 1.6-.17 2.25-.5.65-.33 1.15-.8 1.5-1.4.35-.6.52-1.3.52-2.1s-.17-1.5-.52-2.1c-.35-.6-.85-1.05-1.5-1.35s-1.4-.45-2.25-.45c-1.55 0-2.8.433-3.75 1.3-1 .867-1.5 2.1-1.5 3.7v1.25c0 .35.02.733.05 1.15.03.417.05.8.05 1.15v.65c0 1.2-.3 2.15-.9 2.85s-1.4.95-2.4.8c-.35-.05-.65-.2-.9-.4L3.8 18.3c-.2-.1-.35-.2-.45-.3l-1.35-.65c-.2-.1-.35-.15-.45-.15-.15 0-.27.05-.35.15s-.15.25-.15.45v.9c.1.15.25.25.45.3l1.35.65c.2.1.4.2.6.3l.6.3c.3.15.6.2.9.2.95 0 1.7-.267 2.25-.8.55-.533.82-1.3.82-2.3v-.68c0-.3-.02-.633-.05-1s-.05-.7-.05-1v-1.2c0-2.8.43-4.9 1.3-6.3.87-1.4 2.2-2.1 4-2.1.8 0 1.52.12 2.15.35.63.23 1.17.62 1.6 1.15.43.53.65 1.15.65 1.85s-.22 1.3-.65 1.85c-.43.53-1 .92-1.8 1.15-.7.2-1.5.17-2.4-.1-.9-.27-1.7-.7-2.4-1.25-.7-.55-1.2-1.25-1.5-2.1-.2-.6-.2-1.25-.05-1.95.1-.45.3-.85.55-1.2.25-.35.5-.6.75-.75s.5-.25.75-.25.5.05.75.25c.25.2.5.45.75.75.25.3.45.65.6.95.15.3.2.65.2 1s-.07 1.25-.2 1.85c-.13.6-.35 1.15-.65 1.65-.3.5-.7.9-1.2 1.2-.5.3-1.05.5-1.65.6-.6.1-1.2.1-1.8.05l-1-.1v-2.1c.45.05.88.08 1.3.08.85 0 1.6-.17 2.25-.5.65-.33 1.15-.8 1.5-1.4.35-.6.52-1.3.52-2.1s-.17-1.5-.52-2.1c-.35-.6-.85-1.05-1.5-1.35s-1.4-.45-2.25-.45c-1.55 0-2.8.433-3.75 1.3-1 .867-1.5 2.1-1.5 3.7v1.25c0 .35.02.733.05 1.15.03.417.05.8.05 1.15v.65c0 1.2-.3 2.15-.9 2.85s-1.4.95-2.4.8z"/></svg>
        </a>
        <a href="https://flipboard.com/@Crevalen" aria-label="Flipboard" class="hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M0 0v24h24V0zm22.5 22.5h-21v-21h21zM5.25 5.25h9v13.5h-9zm11.25 0h2.25v2.25h-2.25zm0 4.5h2.25v2.25h-2.25zm0 4.5h2.25v2.25h-2.25z"/></svg>
        </a>

      </div>
    </div>
  </div>
</footer>