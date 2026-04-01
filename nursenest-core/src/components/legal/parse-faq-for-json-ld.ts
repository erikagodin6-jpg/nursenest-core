import type { FaqJsonLdItem } from "@/components/seo/faq-json-ld";

/** Parses FAQ markdown with ## question lines into JSON-LD items. */
export function parseFaqMarkdownForJsonLd(markdown: string): FaqJsonLdItem[] {
  const chunks = markdown.replace(/\r\n/g, "\n").split(/^## /gm);
  const items: FaqJsonLdItem[] = [];
  for (const chunk of chunks) {
    const t = chunk.trim();
    if (!t || t.startsWith("# ")) continue;
    const nl = t.indexOf("\n");
    if (nl === -1) continue;
    const question = t.slice(0, nl).trim();
    const answer = t
      .slice(nl + 1)
      .trim()
      .replace(/\n+/g, " ");
    if (question && answer) items.push({ question, answer });
  }
  return items;
}
