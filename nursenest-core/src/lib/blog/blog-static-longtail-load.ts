import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { BlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-types";

const LONGTAIL_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../content/blog-static-longtail");

let cache: { file: string; record: BlogStaticLongtailRecord }[] | null = null;

function parseSimpleFrontmatter(raw: string): { fields: Record<string, string>; body: string } {
  const trimmed = raw.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) {
    return { fields: {}, body: trimmed };
  }
  const nl = trimmed.indexOf("\n");
  if (nl < 0) return { fields: {}, body: trimmed };
  const rest = trimmed.slice(nl + 1);
  const end = rest.indexOf("\n---");
  if (end < 0) {
    throw new Error("[blog-static-longtail] missing closing --- frontmatter fence");
  }
  const block = rest.slice(0, end).trim();
  const body = rest.slice(end + 4).replace(/^\s*\n/, "");
  const fields: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    const k = m[1];
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    fields[k] = v;
  }
  return { fields, body };
}

function parseTags(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j.map((x) => String(x).trim()).filter(Boolean);
  } catch {
    /* comma list */
  }
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseDraftFlag(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

function recordFromFields(bodyHtml: string, fields: Record<string, string>): BlogStaticLongtailRecord {
  const slug = fields.slug?.trim() ?? "";
  const title = fields.title?.trim() ?? "";
  const excerpt = fields.excerpt?.trim() ?? "";
  const category = fields.category?.trim() ?? "Clinical reasoning";
  const createdAt = fields.publishedAt?.trim() || fields.createdAt?.trim() || "";
  const updatedAt = fields.updatedAt?.trim() || createdAt;
  const seoTitle = fields.seoTitle?.trim() || title;
  const seoDescription = fields.seoDescription?.trim() || excerpt;
  const canonicalUrl = fields.canonicalUrl?.trim() || `/blog/${slug}`;
  const disclaimer = fields.medicalDisclaimer?.trim() ?? fields.disclaimer?.trim() ?? "";
  const draft = parseDraftFlag(fields.draft);
  return {
    slug,
    title,
    excerpt,
    category,
    createdAt,
    updatedAt,
    tags: parseTags(fields.tags),
    bodyHtml: bodyHtml.trim(),
    seoTitle,
    seoDescription,
    canonicalUrl,
    disclaimer,
    authorDisplayName: fields.authorDisplayName?.trim() || undefined,
    medicalReviewerName: fields.medicalReviewerName?.trim() || fields.reviewerName?.trim() || undefined,
    ...(draft ? { draft: true } : {}),
  };
}

/**
 * Every `*.md` row under `src/content/blog-static-longtail/`, including `draft: true`
 * (for validators and tooling). Cached per process.
 */
export function listAllBlogStaticLongtailFileRecords(): { file: string; record: BlogStaticLongtailRecord }[] {
  if (cache) return cache;
  if (!existsSync(LONGTAIL_DIR)) {
    cache = [];
    return cache;
  }
  const files = readdirSync(LONGTAIL_DIR).filter((f) => f.endsWith(".md"));
  const out: { file: string; record: BlogStaticLongtailRecord }[] = [];
  for (const f of files) {
    const full = join(LONGTAIL_DIR, f);
    const raw = readFileSync(full, "utf8");
    const { fields, body } = parseSimpleFrontmatter(raw);
    out.push({ file: f, record: recordFromFields(body, fields) });
  }
  cache = out;
  return cache;
}

/** Published long-tail records (`draft` omitted or false). */
export function listBlogStaticLongtailRecords(): BlogStaticLongtailRecord[] {
  return listBlogStaticLongtailFileRecords().map((x) => x.record);
}

/** Published long-tail files only (`draft` omitted or false). */
export function listBlogStaticLongtailFileRecords(): { file: string; record: BlogStaticLongtailRecord }[] {
  return listAllBlogStaticLongtailFileRecords().filter(({ record }) => !record.draft);
}

export function getBlogStaticLongtailRecord(slug: string): BlogStaticLongtailRecord | undefined {
  return listBlogStaticLongtailRecords().find((r) => r.slug === slug);
}

export function blogStaticLongtailDirForDiagnostics(): string {
  return LONGTAIL_DIR;
}

/** Test helper: reset module cache */
export function resetBlogStaticLongtailCacheForTests(): void {
  cache = null;
}
