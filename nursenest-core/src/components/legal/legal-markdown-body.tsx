import { slugifyLegalHeading } from "@/lib/legal/slugify-heading";

function splitBlocks(md: string): string[] {
  return md
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
}

/**
 * Minimal markdown: `#` / `##` headings and paragraphs (no lists/lists rendered as paragraphs).
 */
export function LegalMarkdownBody({ markdown }: { markdown: string }) {
  const blocks = splitBlocks(markdown);
  return (
    <div className="legal-markdown prose prose-neutral max-w-none dark:prose-invert">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          const title = block.slice(3).trim();
          const id = slugifyLegalHeading(title);
          return (
            <h2 key={i} id={id} className="mt-10 scroll-mt-24 text-xl font-bold text-[var(--theme-heading-text)] first:mt-0">
              {title}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h1 key={i} className="text-3xl font-bold text-[var(--theme-heading-text)]">
              {block.slice(2).trim()}
            </h1>
          );
        }
        return (
          <p key={i} className="mb-4 leading-relaxed text-[var(--theme-body-text)]">
            {block}
          </p>
        );
      })}
    </div>
  );
}
