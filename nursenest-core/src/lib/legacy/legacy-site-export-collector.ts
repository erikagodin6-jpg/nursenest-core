/**
 * Bounded, read-only crawl of a legacy marketing site to build a {@link LegacyPublicContentExportV1}.
 * Prefer a checked-in JSON export for repeatability; crawling is best-effort and capped.
 */

import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { LegacyLessonExportRow, LegacyPublicContentExportV1 } from "@/lib/legacy/legacy-public-content-types";
import { normalizeLegacySlug } from "@/lib/legacy/legacy-public-content-types";

const MAX_SITEMAP_LOCS = 400;
const MAX_PAGE_FETCHES = 80;
const FETCH_TIMEOUT_MS = 15_000;

function pathwayIdForMarketingLessonsPath(pathname: string): string | null {
  for (const p of EXAM_PATHWAYS) {
    const base = buildExamPathwayPath(p, "lessons");
    if (pathname === base || pathname.startsWith(`${base}/`)) {
      return p.id;
    }
  }
  return null;
}

async function fetchText(url: string): Promise<string | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function extractLocsFromSitemapXml(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1]?.trim();
    if (u) out.push(u);
    if (out.length >= MAX_SITEMAP_LOCS) break;
  }
  return out;
}

function lessonSlugFromDetailPath(pathname: string, pathwayBase: string): string | null {
  if (!pathname.startsWith(pathwayBase + "/")) return null;
  const rest = pathname.slice(pathwayBase.length + 1).split("/")[0] ?? "";
  const slug = rest.split("?")[0]?.trim() ?? "";
  const n = normalizeLegacySlug(slug);
  return n || null;
}

function decodeHtmlEntitiesTitle(raw: string): string {
  return raw
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function titleFromHtml(html: string): string {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] ? decodeHtmlEntitiesTitle(m[1]) : "";
}

/**
 * Attempts `sitemap.xml` at the site root (and `/sitemap_index.xml`), then fetches lesson detail pages.
 * Returns `null` when no usable URLs were discovered.
 */
export async function collectLegacyLessonsFromSite(baseUrl: string): Promise<LegacyPublicContentExportV1 | null> {
  const origin = baseUrl.replace(/\/$/, "");
  const lessons: LegacyLessonExportRow[] = [];
  const seen = new Set<string>();

  const trySitemaps = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];
  const locs: string[] = [];
  for (const sm of trySitemaps) {
    const xml = await fetchText(sm);
    if (xml && xml.includes("<loc>")) {
      locs.push(...extractLocsFromSitemapXml(xml));
      break;
    }
  }

  const detailCandidates = locs.filter((u) => {
    try {
      const p = new URL(u).pathname;
      return pathwayIdForMarketingLessonsPath(p) !== null && p.includes("/lessons/");
    } catch {
      return false;
    }
  });

  let fetches = 0;
  for (const url of detailCandidates) {
    if (fetches >= MAX_PAGE_FETCHES) break;
    let pathname: string;
    try {
      pathname = new URL(url).pathname;
    } catch {
      continue;
    }
    const pathwayId = pathwayIdForMarketingLessonsPath(pathname);
    if (!pathwayId) continue;
    const pathway = EXAM_PATHWAYS.find((p) => p.id === pathwayId);
    if (!pathway) continue;
    const base = buildExamPathwayPath(pathway, "lessons");
    const slug = lessonSlugFromDetailPath(pathname, base);
    if (!slug) continue;
    const key = `${pathwayId}:${slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    fetches += 1;
    const html = await fetchText(url) ?? "";
    const title = titleFromHtml(html) || slug.replace(/-/g, " ");
    lessons.push({
      pathwayId,
      slug,
      title,
      legacyUrl: url,
      status: "PUBLISHED",
      visiblePublic: true,
    });
  }

  if (lessons.length === 0) return null;
  return { version: 1, lessons, flashcards: {} };
}
