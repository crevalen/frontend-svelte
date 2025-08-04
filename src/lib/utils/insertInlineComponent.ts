export function insertHTMLIntoMiddle(content: string, htmlToInsert: string): string {
  const clean = content.trim();
  const half = Math.floor(clean.length / 2);
  return clean.slice(0, half) + htmlToInsert + clean.slice(half);
}
