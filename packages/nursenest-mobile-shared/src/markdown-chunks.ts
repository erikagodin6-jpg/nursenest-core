/**
 * Lightweight chunking for long section bodies — avoids mounting huge Text trees at once.
 * Not a full markdown parser; pairs with native `Text` rendering of plain paragraphs.
 */

export const DEFAULT_MARKDOWN_CHUNK_CHARS = 2800;

export function splitMarkdownBodyIntoChunks(body: string, maxChars: number = DEFAULT_MARKDOWN_CHUNK_CHARS): string[] {
  const text = body ?? "";
  if (text.length <= maxChars) return text.length ? [text] : [];

  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(text.length, i + maxChars);
    if (end < text.length) {
      const slice = text.slice(i, end);
      const breakPref = slice.lastIndexOf("\n\n");
      if (breakPref > maxChars * 0.4) {
        end = i + breakPref + 2;
      }
    }
    const piece = text.slice(i, end).trim();
    if (piece.length) chunks.push(piece);
    i = end;
  }
  return chunks;
}
