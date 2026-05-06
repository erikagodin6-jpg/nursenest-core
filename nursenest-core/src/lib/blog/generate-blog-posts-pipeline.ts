/**
 * Shared helpers for `scripts/generate-blog-posts.ts`.
 *
 * **Source of truth (no second blog system):**
 * - Persistence: Postgres `BlogPost` via Prisma (`persistControlPanelDraft` inside {@link runBlogArticleGenerationPipeline}).
 * - Public reads: `getPublishedBlogPostBySlug` / index queries in `safe-blog-queries.ts` with {@link blogLiveWhere}.
 * - Sitemap: `listBlogSitemapUrlsSafe` → `getMergedBlogSitemapSlugRows` (same live visibility rules).
 */
import fs from "node:fs";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

export const BLOG_GENERATION_PIPELINE_LOG = "[blog-generation-pipeline]";

export function logBlogGenerationPipeline(stage: string, payload: Record<string, unknown>): void {
  // eslint-disable-next-line no-console
  console.log(`${BLOG_GENERATION_PIPELINE_LOG} ${stage} ${JSON.stringify(payload)}`);
}

export const BLOG_SOURCE_OF_TRUTH_SUMMARY = [
  "write: Prisma model BlogPost (same rows as admin / marketing blog)",
  "read: src/lib/blog/safe-blog-queries.ts (getPublishedBlogPostBySlug, blog index)",
  "visibility: src/lib/blog/blog-visibility.ts (blogLiveWhere — PUBLISHED + workflowStatus PUBLISHED, etc.)",
  "sitemap: src/lib/seo/sitemap-blog-xml.ts (getMergedBlogSitemapSlugRows)",
  "public routes: src/app/(marketing)/(default)/blog/*",
].join(" | ");

export type ParsedGenerateBlogPostsCli = {
  dryRun: boolean;
  /** When true, run AI + persist draft, then call publishGeneratedBlogArticle (same path as control panel). */
  publish: boolean;
  topics: string[];
  topicsFile: string | null;
  pathwayId: string;
  minWords: number;
  minReferences: number;
  validateInternalLinks: boolean;
  paywallSafeLinks: boolean;
  publishOnlyIfValid: boolean;
  includeFaqs: boolean;
  includeClinicalPearls: boolean;
};

function parseBoolFlag(value: string | undefined, defaultTrue: boolean): boolean {
  if (value == null || value === "") return defaultTrue;
  const v = value.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return defaultTrue;
}

/** Parse argv for `scripts/generate-blog-posts.ts` (testable). */
export function parseGenerateBlogPostsCliArgs(argv: string[]): ParsedGenerateBlogPostsCli {
  let dryRun = false;
  let publish = false;
  const topics: string[] = [];
  let topicsFile: string | null = null;
  let pathwayId = "ca-rn-nclex-rn";
  let minWords = 1500;
  let minReferences = 4;
  let validateInternalLinks = true;
  let paywallSafeLinks = true;
  let publishOnlyIfValid = true;
  let includeFaqs = true;
  let includeClinicalPearls = true;

  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i]!;
    if (a === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (a === "--publish") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        publish = parseBoolFlag(next, true);
        i += 1;
      } else {
        publish = true;
      }
      continue;
    }
    if (a.startsWith("--publish=")) {
      publish = parseBoolFlag(a.slice("--publish=".length), true);
      continue;
    }
    if (a === "--draft") {
      publish = false;
      continue;
    }
    if (a.startsWith("--topics-file=")) {
      topicsFile = a.slice("--topics-file=".length).trim() || null;
      continue;
    }
    if (a === "--topics-file") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        topicsFile = next.trim() || null;
        i += 1;
      }
      continue;
    }
    if (a.startsWith("--pathway=")) {
      pathwayId = a.slice("--pathway=".length).trim() || pathwayId;
      continue;
    }
    if (a === "--pathway") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        pathwayId = next.trim() || pathwayId;
        i += 1;
      }
      continue;
    }
    if (a.startsWith("--min-words=")) {
      minWords = Math.max(800, Math.min(8000, parseInt(a.slice("--min-words=".length), 10) || minWords));
      continue;
    }
    if (a === "--min-words") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        minWords = Math.max(800, Math.min(8000, parseInt(next, 10) || minWords));
        i += 1;
      }
      continue;
    }
    if (a.startsWith("--min-references=")) {
      minReferences = Math.max(1, Math.min(20, parseInt(a.slice("--min-references=".length), 10) || minReferences));
      continue;
    }
    if (a === "--min-references") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        minReferences = Math.max(1, Math.min(20, parseInt(next, 10) || minReferences));
        i += 1;
      }
      continue;
    }
    if (a.startsWith("--validate-internal-links=")) {
      validateInternalLinks = parseBoolFlag(a.slice("--validate-internal-links=".length), true);
      continue;
    }
    if (a.startsWith("--paywall-safe-links=")) {
      paywallSafeLinks = parseBoolFlag(a.slice("--paywall-safe-links=".length), true);
      continue;
    }
    if (a.startsWith("--publish-only-if-valid=")) {
      publishOnlyIfValid = parseBoolFlag(a.slice("--publish-only-if-valid=".length), true);
      continue;
    }
    if (a.startsWith("--include-faqs=")) {
      includeFaqs = parseBoolFlag(a.slice("--include-faqs=".length), true);
      continue;
    }
    if (a.startsWith("--include-clinical-pearls=")) {
      includeClinicalPearls = parseBoolFlag(a.slice("--include-clinical-pearls=".length), true);
      continue;
    }
    if (a === "--topic") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        const t = next.trim();
        if (t.length >= 3) topics.push(t);
        i += 1;
      }
      continue;
    }
    if (a.startsWith("--topic=")) {
      const t = a.slice("--topic=".length).trim();
      if (t.length >= 3) topics.push(t);
      continue;
    }
  }

  if (dryRun) {
    publish = false;
  }

  return {
    dryRun,
    publish,
    topics,
    topicsFile,
    pathwayId,
    minWords,
    minReferences,
    validateInternalLinks,
    paywallSafeLinks,
    publishOnlyIfValid,
    includeFaqs,
    includeClinicalPearls,
  };
}

/** Load topics from a newline file or JSON array file. */
export function readTopicsFromTopicsFile(filePath: string): string[] {
  const resolved = path.resolve(filePath);
  const raw = fs.readFileSync(resolved, "utf8").trim();
  if (!raw) return [];
  if (resolved.endsWith(".json")) {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error(`topics file must be a JSON array of strings: ${resolved}`);
    }
    return parsed.map((x) => String(x).trim()).filter((t) => t.length >= 3);
  }
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length >= 3 && !l.startsWith("#"));
}

export async function blogSlugExists(prisma: PrismaClient, slug: string): Promise<boolean> {
  const s = slug.trim();
  if (!s) return false;
  const n = await prisma.blogPost.count({ where: { slug: s } });
  return n > 0;
}

export async function blogTitleExistsCaseInsensitive(
  prisma: PrismaClient,
  title: string,
  excludePostId?: string,
): Promise<boolean> {
  const t = title.trim();
  if (!t) return false;
  const row = await prisma.blogPost.findFirst({
    where: {
      title: { equals: t, mode: "insensitive" },
      ...(excludePostId ? { NOT: { id: excludePostId } } : {}),
    },
    select: { id: true },
  });
  return row != null;
}

export type ScriptBlogPostValidationInput = {
  slug: string;
  title: string;
  body: string;
  excerpt: string;
  keyQuestions: string[];
  ctaHref: string | null;
  ctaText: string | null;
  minWords: number;
};

/**
 * Script-side checks before calling publish (drafts may still be below publish bars).
 * Rejects obviously broken payloads so we do not promote garbage.
 */
export function validateScriptBlogPostPayload(input: ScriptBlogPostValidationInput): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const slug = input.slug.trim();
  const title = input.title.trim();
  if (!slug) reasons.push("missing_slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) reasons.push("slug_must_be_lowercase_kebab");
  if (!title) reasons.push("missing_title");
  if (!input.excerpt?.trim()) reasons.push("missing_excerpt");
  const words = countWordsFromHtml(input.body);
  if (words < input.minWords) {
    reasons.push(`body_below_min_words:${words}<${input.minWords}`);
  }
  const hasH1 = /<h1[\s>]/i.test(input.body);
  const h2Count = (input.body.match(/<h2[\s>]/gi) ?? []).length;
  /** H1 in body, or at least two H2 sections when the template omits a literal `<h1>`. */
  if (!hasH1 && h2Count < 2) {
    reasons.push("missing_h1_or_two_h2");
  }
  if (!/<p[\s>]/i.test(input.body)) reasons.push("missing_intro_paragraph");
  if (h2Count < 2) reasons.push(`structured_content_need_at_least_2_h2_found_${h2Count}`);
  const hasPracticeSurface =
    input.keyQuestions.length >= 1 ||
    /\/questions|practice question|question bank|nclex-style question/i.test(input.body);
  if (!hasPracticeSurface) reasons.push("missing_practice_questions_or_question_bank_link");
  if (!(input.ctaHref?.trim())) reasons.push("missing_cta_href");
  if (!(input.ctaText?.trim())) reasons.push("missing_cta_text");
  return { ok: reasons.length === 0, reasons };
}
