/**
 * Shared manifest integrity checks for regional nursing blog manifests (scripts only; not bundled).
 */
export type ManifestEntryLike = {
  slug: string;
  title: string;
  language?: string;
  primaryKeyword?: string;
  category?: string;
  intentType?: string;
  status?: string;
};

export type ManifestIntegrityResult = {
  fileLabel: string;
  entryCount: number;
  duplicateSlugs: string[];
  duplicateTitles: [string, string[]][];
  langDistribution: Record<string, number>;
  missingFields: { slug: string; missing: string[] }[];
};

const DEFAULT_REQUIRED: (keyof ManifestEntryLike)[] = ["slug", "title", "language", "primaryKeyword", "category"];

export function validateManifestEntries(
  entries: ManifestEntryLike[],
  fileLabel: string,
  required: (keyof ManifestEntryLike)[] = DEFAULT_REQUIRED,
): ManifestIntegrityResult {
  const slugCounts = new Map<string, string[]>();
  const titleCounts = new Map<string, string[]>();
  const langDistribution: Record<string, number> = {};
  const missingFields: { slug: string; missing: string[] }[] = [];

  for (const e of entries) {
    const miss: string[] = [];
    for (const k of required) {
      const v = e[k];
      if (v === undefined || v === null || (typeof v === "string" && !String(v).trim())) {
        miss.push(String(k));
      }
    }
    if (miss.length) missingFields.push({ slug: e.slug || "(no slug)", missing: miss });

    const lang = e.language ?? "unknown";
    langDistribution[lang] = (langDistribution[lang] ?? 0) + 1;

    const sk = e.slug?.trim() ?? "";
    const sc = slugCounts.get(sk) ?? [];
    sc.push(sk);
    slugCounts.set(sk, sc);

    const tk = e.title?.trim().toLowerCase() ?? "";
    const tc = titleCounts.get(tk) ?? [];
    tc.push(e.slug);
    titleCounts.set(tk, tc);
  }

  const duplicateSlugs = [...slugCounts.entries()].filter(([s, arr]) => s && arr.length > 1).map(([s]) => s);
  const duplicateTitles = [...titleCounts.entries()].filter(([t, slugs]) => t && slugs.length > 1);

  return {
    fileLabel,
    entryCount: entries.length,
    duplicateSlugs,
    duplicateTitles,
    langDistribution,
    missingFields,
  };
}

export function printIntegrityReport(r: ManifestIntegrityResult, failOnIssues: boolean): boolean {
  console.log(`[manifest-integrity] ${r.fileLabel}: ${r.entryCount} entries`);
  console.log(`[manifest-integrity] languages: ${JSON.stringify(r.langDistribution)}`);
  console.log(`[manifest-integrity] duplicate slugs: ${r.duplicateSlugs.length}`);
  if (r.duplicateSlugs.length) console.warn(`  → ${r.duplicateSlugs.slice(0, 8).join(", ")}${r.duplicateSlugs.length > 8 ? " …" : ""}`);
  console.log(`[manifest-integrity] duplicate titles: ${r.duplicateTitles.length}`);
  console.log(`[manifest-integrity] rows with missing required fields: ${r.missingFields.length}`);

  const bad =
    r.duplicateSlugs.length > 0 ||
    r.duplicateTitles.length > 0 ||
    r.missingFields.length > 0;
  if (bad) {
    if (failOnIssues) {
      console.error("[manifest-integrity] FAILED (--strict)");
      return false;
    }
    console.warn("[manifest-integrity] issues found (non-strict exit 0)");
    return true;
  }
  console.log("[manifest-integrity] OK");
  return true;
}
