import type { BlogPublishingRelatedPost } from "@/lib/blog/blog-publishing-package";

const MAX_RELATED = 6;

/**
 * Filters persisted `publishingPackage.relatedBlogPosts` so RN-focused posts do not surface
 * PN/REx-PN slugs as “related reading”, and allied posts stay within the same coarse bucket when detectable.
 */
export function filterRelatedBlogReadingForParentExam(
  parentExam: string | null | undefined,
  related: BlogPublishingRelatedPost[],
): BlogPublishingRelatedPost[] {
  const ex = (parentExam ?? "").trim().toUpperCase();
  const isRnNclex = ex.includes("NCLEX-RN") || ex.includes("NCLEX RN") || (ex.includes("RN") && !ex.includes("REX") && !ex.includes("NP"));
  const isPnRex = ex.includes("REX") || ex.includes("REX-PN") || ex.includes("NCLEX-PN") || ex.includes("PN");
  const isMlt = ex.includes("MLT") || ex.includes("LAB");
  const isParamedic = ex.includes("PARAMEDIC");

  const out: BlogPublishingRelatedPost[] = [];
  const seen = new Set<string>();
  for (const r of related) {
    const slug = r.slug.trim().toLowerCase();
    const title = r.title.trim().toLowerCase();
    if (!slug || seen.has(slug)) continue;
    if (isRnNclex) {
      if (slug.includes("rex-pn") || slug.includes("nclex-pn") || slug.includes("/rpn/")) continue;
      if (title.includes("rex-pn") || title.includes("nclex-pn")) continue;
    }
    if (isPnRex) {
      if (slug.includes("nclex-rn") && !slug.includes("pn")) continue;
    }
    if (isMlt) {
      if (slug.includes("paramedic") || title.includes("paramedic")) continue;
    }
    if (isParamedic) {
      if (slug.includes("mlt") || title.includes("medical laboratory")) continue;
    }
    seen.add(slug);
    out.push(r);
    if (out.length >= MAX_RELATED) break;
  }
  return out;
}
