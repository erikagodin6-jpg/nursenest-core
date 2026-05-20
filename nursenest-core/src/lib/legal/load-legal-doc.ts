import { readFile } from "fs/promises";
import path from "path";

const LEGAL_CONTENT_DIR = path.join(process.cwd(), "content", "legal");

export type LegalDocId =
  | "terms-of-service"
  | "privacy-policy"
  | "subscription-refund-policy"
  | "acceptable-use-policy"
  | "educational-disclaimer"
  | "editorial-policy"
  | "content-review-policy"
  | "faq"
  | "contact";

/**
 * Loads markdown from `content/legal/{id}.md` (server-only).
 * Optional `content/legal/{id}-part2.md` is appended for very long documents.
 */
export async function loadLegalMarkdownDoc(id: LegalDocId): Promise<string> {
  const primary = path.join(LEGAL_CONTENT_DIR, `${id}.md`);
  let text = await readFile(primary, "utf8");
  const secondary = path.join(LEGAL_CONTENT_DIR, `${id}-part2.md`);
  try {
    text += await readFile(secondary, "utf8");
  } catch {
    /* optional */
  }
  return text;
}
