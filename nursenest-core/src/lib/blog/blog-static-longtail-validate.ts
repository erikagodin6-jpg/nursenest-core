import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { parseBlogStaticLongtailFile } from "@/lib/blog/blog-static-longtail-load";

export type BlogStaticLongtailValidationIssue = { file: string; message: string };

const MIN_BODY_WORDS = 120;
const MIN_SEO_TITLE_LEN = 10;
const MIN_SEO_DESC_LEN = 40;
/** Frontmatter `medicalDisclaimer` must read as non-clinical-advice guardrail copy. */
const DISCLAIMER_SUBSTRINGS = ["not medical advice", "not a substitute", "educational purposes"];

function longtailDir(): string {
  return join(process.cwd(), "src", "content", "blog-static-longtail");
}

function stripHtmlToWords(html: string): string[] {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);
}

function isValidCanonicalUrl(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  if (s.startsWith("https://") || s.startsWith("http://")) return true;
  return s.startsWith("/blog/");
}

/**
 * Validates every `*.md` under `src/content/blog-static-longtail/`.
 * Used by `npm run validate:blog-static-longtail` and can be imported from tests.
 */
export function validateBlogStaticLongtailCorpus(): { ok: boolean; issues: BlogStaticLongtailValidationIssue[] } {
  const issues: BlogStaticLongtailValidationIssue[] = [];
  const dir = longtailDir();
  if (!existsSync(dir)) {
    return { ok: true, issues: [] };
  }
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const slugToFile = new Map<string, string>();
  for (const f of files) {
    const rel = join(dir, f);
    let record;
    try {
      record = parseBlogStaticLongtailFile(readFileSync(rel, "utf8"));
    } catch (e) {
      issues.push({ file: f, message: e instanceof Error ? e.message : String(e) });
      continue;
    }
    const slug = record.slug.trim();
    if (!slug) {
      issues.push({ file: f, message: "Empty slug" });
      continue;
    }
    const prev = slugToFile.get(slug);
    if (prev) {
      issues.push({ file: f, message: `Duplicate static slug "${slug}" (also in ${prev})` });
    } else {
      slugToFile.set(slug, f);
    }
    const words = stripHtmlToWords(record.bodyHtml);
    if (words.length < MIN_BODY_WORDS) {
      issues.push({
        file: f,
        message: `Body word count ${words.length} is below minimum ${MIN_BODY_WORDS} (HTML stripped for count)`,
      });
    }
    if ((record.seoTitle ?? "").trim().length < MIN_SEO_TITLE_LEN) {
      issues.push({ file: f, message: `seoTitle shorter than ${MIN_SEO_TITLE_LEN} characters` });
    }
    if ((record.seoDescription ?? "").trim().length < MIN_SEO_DESC_LEN) {
      issues.push({ file: f, message: `seoDescription shorter than ${MIN_SEO_DESC_LEN} characters` });
    }
    if (!isValidCanonicalUrl(record.canonicalUrl)) {
      issues.push({
        file: f,
        message: "canonicalUrl must be an absolute http(s) URL or a path starting with /blog/",
      });
    }
    const disc = (record.medicalDisclaimer ?? "").trim().toLowerCase();
    if (!DISCLAIMER_SUBSTRINGS.some((frag) => disc.includes(frag))) {
      issues.push({
        file: f,
        message: `medicalDisclaimer must include one of: ${DISCLAIMER_SUBSTRINGS.join("; ")}`,
      });
    }
  }
  return { ok: issues.length === 0, issues };
}
