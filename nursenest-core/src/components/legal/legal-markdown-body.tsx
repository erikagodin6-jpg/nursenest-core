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
            <h2 key={i} id={id} className="nn-marketing-h3 mt-10 scroll-mt-24 first:mt-0">
              {title}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h1 key={i} className="nn-marketing-h1">
              {block.slice(2).trim()}
            </h1>
          );
        }
        return (
          <p key={i} className="nn-marketing-body-sm mb-4 text-[var(--palette-text)]">
            {block}
          </p>
        );
      })}
    </div>
  );
}
