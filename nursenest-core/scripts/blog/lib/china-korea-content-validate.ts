/**
 * Shared validation for China/Korea manifest blog HTML bodies (scripts only).
 */
import { wordCountFromHtml } from "../philippines-nle-blog-build-body";
import type { ManifestBlogRow } from "../regional-manifest-blog-body.ts";

export const CHINA_KOREA_MIN_WORDS = 1200;

export function requiredSectionMarkersOk(body: string): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!body.includes("Internal links")) missing.push("Internal links block");
  if (!body.includes("<h2>Summary</h2>")) missing.push("Summary h2");
  if (!body.includes("Practice question") && !body.includes("Practice spotlight")) {
    missing.push("Practice block");
  }
  if (!body.includes("Exam and scope orientation")) missing.push("Exam and scope section");
  if (!body.includes("Mistakes to avoid")) missing.push("Mistakes section");
  return { ok: missing.length === 0, missing };
}

export function firstParagraphText(html: string): string {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  if (!m) return "";
  return m[1]!.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

export type ManifestFile = {
  generatedAt?: string;
  country?: string;
  entries: Array<{
    slug: string;
    title: string;
    language?: string;
    primaryKeyword?: string;
    wordCount?: number;
    bodyHtml: string;
  }>;
};

export function validateMaterializedFile(
  data: ManifestFile,
  minWords: number,
): {
  wordStats: { min: number; max: number; avg: number };
  dupSlugs: string[];
  dupTitles: [string, string[]][];
  dupIntros: [string, string[]][];
  sectionFailures: { slug: string; missing: string[] }[];
} {
  const counts: number[] = [];
  const slugSeen = new Map<string, number>();
  const titles = new Map<string, string[]>();
  const intros = new Map<string, string[]>();
  const sectionFailures: { slug: string; missing: string[] }[] = [];

  for (const e of data.entries) {
    const wc = e.wordCount ?? wordCountFromHtml(e.bodyHtml);
    counts.push(wc);
    slugSeen.set(e.slug, (slugSeen.get(e.slug) ?? 0) + 1);
    const tk = e.title.trim().toLowerCase();
    const ta = titles.get(tk) ?? [];
    ta.push(e.slug);
    titles.set(tk, ta);
    const intro = firstParagraphText(e.bodyHtml);
    const ia = intros.get(intro) ?? [];
    ia.push(e.slug);
    intros.set(intro, ia);
    const { ok, missing } = requiredSectionMarkersOk(e.bodyHtml);
    if (!ok || wc < minWords) {
      sectionFailures.push({ slug: e.slug, missing: [...missing, ...(wc < minWords ? [`below ${minWords} words (${wc})`] : [])] });
    }
  }

  const dupSlugs = [...slugSeen.entries()].filter(([, c]) => c > 1).map(([s]) => s);
  const dupTitles = [...titles.entries()].filter(([, sl]) => sl.length > 1);
  const dupIntros = [...intros.entries()].filter(([k, sl]) => k.length > 0 && sl.length > 1);

  const min = counts.length ? Math.min(...counts) : 0;
  const max = counts.length ? Math.max(...counts) : 0;
  const avg = counts.length ? counts.reduce((a, b) => a + b, 0) / counts.length : 0;

  return {
    wordStats: { min, max, avg },
    dupSlugs,
    dupTitles,
    dupIntros,
    sectionFailures,
  };
}

export function filterManifestEntries(
  entries: ManifestBlogRow[],
  opts: { lang?: string; theme?: string; from: number; limit: number },
): ManifestBlogRow[] {
  let rows = entries;
  if (opts.lang) {
    rows = rows.filter((e) => e.language === opts.lang);
  }
  if (opts.theme) {
    const t = opts.theme.toLowerCase();
    rows = rows.filter(
      (e) => e.primaryKeyword.toLowerCase().includes(t) || e.slug.toLowerCase().includes(t),
    );
  }
  return rows.slice(opts.from, opts.from + opts.limit);
}
