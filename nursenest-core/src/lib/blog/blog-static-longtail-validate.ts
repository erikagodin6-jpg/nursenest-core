import type { BlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-types";

const DISCLAIMER_MARKERS = [
  "not individualized medical advice",
  "educational",
  "exam preparation",
] as const;

export type BlogStaticLongtailValidationIssue = { file: string; message: string };

export function validateBlogStaticLongtailRecord(
  file: string,
  r: BlogStaticLongtailRecord,
): BlogStaticLongtailValidationIssue[] {
  const issues: BlogStaticLongtailValidationIssue[] = [];
  if (!r.slug?.trim()) issues.push({ file, message: "missing slug" });
  if (r.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.slug.trim())) {
    issues.push({ file, message: `slug must be kebab-case: ${r.slug}` });
  }
  if (!r.title?.trim()) issues.push({ file, message: "missing title" });
  if (!r.excerpt?.trim()) issues.push({ file, message: "missing excerpt" });
  if (!r.category?.trim()) issues.push({ file, message: "missing category" });
  if (!r.bodyHtml?.trim()) issues.push({ file, message: "missing body" });
  if (!r.createdAt?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(r.createdAt)) {
    issues.push({ file, message: `invalid createdAt/publishedAt: ${r.createdAt}` });
  }
  if (!r.updatedAt?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(r.updatedAt)) {
    issues.push({ file, message: `invalid updatedAt: ${r.updatedAt}` });
  }
  if (!r.seoTitle?.trim()) issues.push({ file, message: "missing seoTitle" });
  if (!r.seoDescription?.trim()) issues.push({ file, message: "missing seoDescription" });
  if (!r.canonicalUrl?.trim()) issues.push({ file, message: "missing canonicalUrl" });
  const can = r.canonicalUrl.trim();
  if (!can.startsWith("/blog/") && !can.startsWith("https://")) {
    issues.push({ file, message: `canonicalUrl must start with /blog/ or https:// — got ${can}` });
  }
  if (can.startsWith("/blog/") && r.slug && can !== `/blog/${r.slug.trim()}`) {
    issues.push({ file, message: `canonicalUrl must match /blog/{slug} — expected /blog/${r.slug.trim()}` });
  }
  if (!r.disclaimer?.trim()) issues.push({ file, message: "missing disclaimer" });
  const low = r.disclaimer.toLowerCase();
  if (!DISCLAIMER_MARKERS.some((m) => low.includes(m))) {
    issues.push({
      file,
      message: `disclaimer must mention educational / exam prep / not medical advice intent`,
    });
  }
  return issues;
}

export function validateAllBlogStaticLongtailRecords(
  records: Array<{ file: string; record: BlogStaticLongtailRecord }>,
): BlogStaticLongtailValidationIssue[] {
  const issues: BlogStaticLongtailValidationIssue[] = [];
  const slugs = new Map<string, string>();
  for (const { file, record } of records) {
    issues.push(...validateBlogStaticLongtailRecord(file, record));
    const s = record.slug?.trim();
    if (!s) continue;
    if (slugs.has(s)) issues.push({ file, message: `duplicate slug ${s} (also in ${slugs.get(s)})` });
    else slugs.set(s, file);
  }
  return issues;
}
