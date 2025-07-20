export function lazyload(node: HTMLImageElement, src: string) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      node.src = src; // Ganti src dengan gambar asli
      node.classList.add('loaded'); // Tambahkan kelas untuk transisi fade-in
      observer.disconnect();
    }
  });

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}