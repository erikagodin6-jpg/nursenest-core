/** Root layout applies `template: "%s | NurseNest"` — page-level titles must not include this suffix. */
export const MARKETING_TITLE_BRAND_SUFFIX = "| NurseNest";

/**
 * Strip trailing (and repeated) `| NurseNest` so the global metadata template applies once.
 * Also removes a leading `NurseNest |` prefix when pages were authored with full branded titles.
 */
export function normalizeMarketingPageTitle(title: string): string {
  let t = title.trim();
  while (t.endsWith(MARKETING_TITLE_BRAND_SUFFIX)) {
    t = t.slice(0, -MARKETING_TITLE_BRAND_SUFFIX.length).trimEnd();
  }
  const leadingBrand = /^NurseNest\s*\|\s*/i;
  if (leadingBrand.test(t)) {
    t = t.replace(leadingBrand, "").trimEnd();
  }
  return t;
}
