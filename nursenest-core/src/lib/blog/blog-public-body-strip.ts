/**
 * Removes duplicate editorial blocks from public blog HTML when the same content
 * is rendered from structured fields (faqBlock, apaReferences) elsewhere on the page.
 */

import { blogBodyEmbedsDuplicateFaqModule } from "@/lib/blog/blog-content-quality-gate";

/**
 * Strip trailing / embedded FAQ and References sections from article body HTML
 * when structured modules render them below the prose column.
 */
export function stripDuplicateStructuredModulesFromPublicBlogBodyHtml(
  html: string,
  opts: { hasStructuredFaq: boolean; hasStructuredReferences: boolean },
): string {
  let out = html;
  if (opts.hasStructuredFaq && blogBodyEmbedsDuplicateFaqModule(out)) {
    out = out.replace(
      /<h2\b[^>]*>\s*(Frequently\s+asked\s+questions|FAQs?)\s*<\/h2>[\s\S]*?(?=<h2\b|$)/gi,
      "",
    );
  }
  if (opts.hasStructuredReferences) {
    out = out.replace(/<h2\b[^>]*>\s*References(?:\s*\([^)]*\))?\s*<\/h2>[\s\S]*$/i, "");
  }
  return out.trim();
}
