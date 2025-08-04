export function insertRelatedAfterParagraph(
  content: string,
  htmlToInsert: string,
  paragraphIndex: number
): string {
  const paragraphs = content.split(/(<\/p>)/i); // pecah dengan tag penutup <p>

  if (paragraphs.length < 2) {
    // fallback: sisipkan di akhir jika tidak ada paragraf
    return content + htmlToInsert;
  }

  const result: string[] = [];
  let count = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    result.push(paragraphs[i]);

    // hanya hitung tag </p> sebagai akhir paragraf
    if (paragraphs[i].toLowerCase() === '</p>') {
      count++;
      if (count === paragraphIndex) {
        result.push(htmlToInsert);
      }
    }
  }

  // Jika jumlah paragraf kurang dari yang diminta, tambahkan di akhir
  if (count < paragraphIndex) {
    result.push(htmlToInsert);
  }

  return result.join('');
}
