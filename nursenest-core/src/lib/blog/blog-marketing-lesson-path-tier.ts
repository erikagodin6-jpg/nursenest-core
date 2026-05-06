/**
 * Drop curated lesson paths that clearly belong to a different marketing exam bucket than the post.
 * Used for public blog auto-links + related-lesson footers (defense-in-depth on top of allowlists).
 */
export function filterMarketingLessonPathsForBlogExam(exam: string | null | undefined, paths: string[]): string[] {
  const ex = (exam ?? "").trim().toUpperCase();
  const isRnNclex = ex.includes("NCLEX-RN") || ex.includes("NCLEX RN") || (ex.includes("RN") && !ex.includes("REX") && !ex.includes("NP"));
  const isPnRex = ex.includes("REX") || ex.includes("REX-PN") || ex.includes("NCLEX-PN");

  return paths.filter((raw) => {
    const p = raw.trim().toLowerCase();
    if (!p.startsWith("/")) return false;
    if (isRnNclex) {
      if (p.includes("/rpn/") || p.includes("rex-pn") || p.includes("nclex-pn")) return false;
    }
    if (isPnRex) {
      if (p.includes("/rn/") && p.includes("nclex-rn") && !p.includes("pn")) return false;
    }
    return true;
  });
}
