/**
 * Plain-text extraction for word counting (handles simple HTML-ish tags, not full DOM).
 */
export function stripToPlainText(raw: string | null | undefined): string {
  if (raw == null) return "";
  let s = String(raw);
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/&nbsp;/gi, " ");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/** Word count for English-like prose (splits on whitespace). */
export function countWords(text: string | null | undefined): number {
  const t = stripToPlainText(text);
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}
