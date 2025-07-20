<script lang="ts">
  // Komponen ini menerima 'data' sebagai properti (prop)
  // Kita beri nilai default untuk berjaga-jaga jika data tidak ada
  export let data = {
    title: 'Judul Default Modern',
    subtitle: 'Ini adalah subtitel default. Ganti dengan data dari CMS Anda untuk pengalaman yang lebih dinamis dan menarik.'
  };
</script>

<section class="container mx-auto px-6 py-24 text-center">
  <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
    <span class="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
      {data.title}
    </span>
  </h1>
  <p class="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-8">
    {data.subtitle}
  </p>
  <div class="flex justify-center space-x-4">
    <a href="#posts" class="px-8 py-3 bg-cyan-500 rounded-md hover:bg-cyan-600 transition-all duration-300 font-semibold text-white shadow-lg shadow-cyan-500/20">
      Lihat Artikel
    </a>
    <a href="/about" class="px-8 py-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-300 font-semibold text-white">
      Tentang Saya
    </a>
  </div>
</section>