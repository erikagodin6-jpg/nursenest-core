import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { BlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-types";
import { isBlogSlugHiddenFromPublicMarketingCatalog } from "@/lib/blog/blog-visibility";

const REQUIRED_KEYS = [
  "slug",
  "title",
  "excerpt",
  "category",
  "publishedAt",
  "updatedAt",
  "seoTitle",
  "seoDescription",
  "canonicalUrl",
  "medicalDisclaimer",
] as const;

/** Frontmatter `publishedAt` is stored as `createdAt` on the record (index + `BlogPost` synthetic row). */

/** Split `---` YAML frontmatter from markdown body (first `---` must be line 1). */
export function splitLongtailFrontmatter(raw: string): { frontmatter: string; body: string } {
  const trimmed = raw.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---\n")) return { frontmatter: "", body: trimmed };
  const close = trimmed.indexOf("\n---\n", 4);
  if (close === -1) return { frontmatter: "", body: trimmed };
  return {
    frontmatter: trimmed.slice(4, close).trim(),
    body: trimmed.slice(close + 5).trim(),
  };
}

/** Minimal YAML subset: `key: value`, `tags: ["a","b"]`, blank lines ignored. */
export function parseLongtailYaml(frontmatter: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of frontmatter.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf(":");
    if (idx <= 0) continue;
    const key = t.slice(0, idx).trim();
    let val = t.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function parseTagsField(raw: string | undefined): string[] {
  if (!raw) return [];
  const s = raw.trim();
  if (!s) return [];
  try {
    const parsed = JSON.parse(s) as unknown;
    if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean);
  } catch {
    /* fall through */
  }
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function recordFromParsed(data: Record<string, string>, body: string): BlogStaticLongtailRecord {
  for (const k of REQUIRED_KEYS) {
    if (!data[k]?.trim()) throw new Error(`Missing long-tail frontmatter: ${k}`);
  }
  const bodyHtml = (data.bodyHtml?.trim() || body.trim());
  if (!bodyHtml) throw new Error("Long-tail body is empty (set body after second --- or `bodyHtml` in frontmatter)");
  const tags = parseTagsField(data.tags);
  if (tags.length === 0) throw new Error("Long-tail tags must be non-empty");
  return {
    slug: data.slug.trim(),
    title: data.title.trim(),
    excerpt: data.excerpt.trim(),
    category: data.category.trim(),
    tags,
    bodyHtml,
    createdAt: data.publishedAt.trim(),
    updatedAt: data.updatedAt.trim(),
    seoTitle: data.seoTitle.trim(),
    seoDescription: data.seoDescription.trim(),
    canonicalUrl: data.canonicalUrl.trim(),
    authorDisplayName: data.author?.trim() || data.authorDisplayName?.trim() || undefined,
    medicalReviewerName: data.reviewer?.trim() || data.medicalReviewerName?.trim() || undefined,
    medicalDisclaimer: data.medicalDisclaimer.trim(),
  };
}

export function parseBlogStaticLongtailFile(raw: string): BlogStaticLongtailRecord {
  const { frontmatter, body } = splitLongtailFrontmatter(raw);
  if (!frontmatter) throw new Error("Long-tail file must start with YAML frontmatter (---)");
  const data = parseLongtailYaml(frontmatter);
  return recordFromParsed(data, body);
}

function longtailDir(): string {
  return join(process.cwd(), "src", "content", "blog-static-longtail");
}

let cache: BlogStaticLongtailRecord[] | null = null;

export function loadBlogStaticLongtailRecordsSync(): BlogStaticLongtailRecord[] {
  if (cache) return cache;
  const dir = longtailDir();
  if (!existsSync(dir)) {
    cache = [];
    return cache;
  }
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const out: BlogStaticLongtailRecord[] = [];
  for (const f of files) {
    const raw = readFileSync(join(dir, f), "utf8");
    out.push(parseBlogStaticLongtailFile(raw));
  }
  cache = out;
  return cache;
}

export function listBlogStaticLongtailRecords(): BlogStaticLongtailRecord[] {
  return loadBlogStaticLongtailRecordsSync().filter((r) => !isBlogSlugHiddenFromPublicMarketingCatalog(r.slug));
}

export function getBlogStaticLongtailRecord(slug: string): BlogStaticLongtailRecord | undefined {
  const needle = slug.trim();
  if (isBlogSlugHiddenFromPublicMarketingCatalog(needle)) return undefined;
  return loadBlogStaticLongtailRecordsSync().find((r) => r.slug.trim() === needle);
}

/** For tests: reset module cache so fixtures can swap directory contents. */
export function resetBlogStaticLongtailCacheForTests(): void {
  cache = null;
}
