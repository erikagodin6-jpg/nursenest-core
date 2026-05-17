/**
 * Pure normalization + validation for materializing Cursor / generator artifacts into {@link BlogPost}.
 * CLI: `scripts/blog/publish-generated-blog-post.mts`.
 */
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";
import { BLOG_ARTICLE_MIN_WORDS, countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { BLOG_SLUG_FORMAT_RE } from "@/lib/blog/blog-optional-slug";
import { classifyBlogCorpus, collectClassificationViolations } from "@/lib/taxonomy/content-write-taxonomy";

export type GeneratedBlogPublishSourceKind = "cursor" | "batch" | "manual" | "legacy";

export type NormalizedGeneratedBlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  category: string | null;
  tags: string[];
  locale: string;
  careerSlug: string | null;
  exam: string | null;
  targetKeyword: string | null;
  apaReferences: string[];
  requiresReferences: boolean;
  relatedLessonPaths: string[];
  sourcesJson: unknown;
  internalLinkPlan: unknown;
  faqBlock: unknown;
  schemaSummary: string | null;
};

export type GeneratedBlogMaterializationFlags = {
  updateExisting: boolean;
  allowPublishedUpdate: boolean;
  wantPublish: boolean;
};

function toStr(v: unknown): string {
  return typeof v === "string" ? v.trim() : v != null ? String(v).trim() : "";
}

function toStrArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

/** Compact provenance string (BlogPost.legacySource is a single string). */
export function buildLegacySourceProvenance(input: {
  sourceKind: GeneratedBlogPublishSourceKind;
  inputPath: string | null;
  generatedAt: string;
}): string {
  const pathPart = input.inputPath?.replace(/\s+/g, " ").trim() || "(cli)";
  return `cursor-generated|source=${input.sourceKind}|at=${input.generatedAt}|path=${pathPart}`;
}

export function expectedCanonicalBlogPath(slug: string, careerSlug: string | null | undefined): string {
  const scoped = (careerSlug ?? "").trim().toLowerCase();
  if (!scoped) return `/blog/${slug}`;
  if (["paramedic", "respiratory", "mlt", "imaging", "sonography"].includes(scoped)) {
    return `/allied-health/${scoped}/blog/${slug}`;
  }
  // Regional / specialty cluster slugs — dedicated /blog/{cluster}/ trees.
  if (["canada-rn", "us-rn", "rex-pn", "nclex-pn"].includes(scoped)) {
    return `/blog/${scoped}/${slug}`;
  }
  /** RN lesson-derived SEO posts and RN hub — canonical under `/blog/rn` for organic landing URLs. */
  if (scoped === "rn") return `/blog/rn/${slug}`;
  return `/nursing/${scoped}/blog/${slug}`;
}

export function parseSimpleFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const starts = raw.startsWith("---\n") || raw.startsWith("---\r\n");
  if (!starts) return { meta: {}, body: raw };
  const nl = raw.startsWith("---\r\n") ? "\r\n" : "\n";
  const afterFirst = raw.slice(4);
  const closeIdx = afterFirst.indexOf(`${nl}---${nl}`);
  if (closeIdx < 0) return { meta: {}, body: raw };
  const fmBlock = afterFirst.slice(0, closeIdx);
  const body = afterFirst.slice(closeIdx + nl.length + 4);
  const meta: Record<string, string> = {};
  for (const line of fmBlock.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 1) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    meta[k] = v;
  }
  return { meta, body };
}

/** Merge CLI / file meta into a single record for normalization. */
export function normalizeGeneratedBlogRecord(record: Record<string, unknown>): {
  ok: boolean;
  value?: NormalizedGeneratedBlogPost;
  errors: string[];
} {
  const errors: string[] = [];
  const title = toStr(record.title);
  const slug = toStr(record.slug);
  let excerpt = toStr(record.excerpt);
  const body = toStr(record.body);
  let seoTitle = toStr(record.seoTitle ?? record.metaTitle ?? record.meta_title);
  let seoDescription = toStr(record.seoDescription ?? record.metaDescription ?? record.meta_description);
  const category = toStr(record.category) || null;
  const tags = toStrArray(record.tags ?? record.keywords);
  const locale = toStr(record.locale) || "en";
  const careerSlug = toStr(record.careerSlug) || null;
  const exam = toStr(record.exam) || null;
  const targetKeyword = toStr(record.targetKeyword ?? record.target_keyword) || null;
  const apaReferences = toStrArray(record.apaReferences ?? record.apa_references);
  const requiresReferences = Boolean(record.requiresReferences ?? record.requires_references);
  const relatedLessonPaths = toStrArray(record.relatedLessonPaths ?? record.related_lesson_paths);
  const sourcesJson = record.sourcesJson ?? record.sources_json ?? [];
  const internalLinkPlan = record.internalLinkPlan ?? record.internal_link_plan ?? null;
  const faqBlock = record.faqBlock ?? record.faq_block ?? null;
  const schemaSummary = toStr(record.schemaSummary ?? record.schema_summary) || null;

  if (!title) errors.push("missing_title");
  if (!slug) errors.push("missing_slug");
  if (!BLOG_SLUG_FORMAT_RE.test(slug)) errors.push("invalid_slug_format");
  if (!body) errors.push("missing_body");

  if (!seoTitle) seoTitle = title.slice(0, 220);
  if (!seoDescription) {
    seoDescription = excerpt
      ? excerpt.slice(0, 500)
      : `${title.slice(0, 120)} — NurseNest study guide.`.slice(0, 500);
  }
  if (!excerpt) excerpt = seoDescription.slice(0, 500);
  if (!excerpt.trim()) errors.push("missing_excerpt");
  if (excerpt.trim().length < 10) errors.push("excerpt_too_short_min_10");

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      title,
      slug,
      excerpt,
      body,
      seoTitle,
      seoDescription,
      category,
      tags,
      locale,
      careerSlug,
      exam,
      targetKeyword,
      apaReferences,
      requiresReferences,
      relatedLessonPaths,
      sourcesJson,
      internalLinkPlan,
      faqBlock,
      schemaSummary,
    },
    errors: [],
  };
}

export function validateGeneratedBlogMaterialization(input: {
  normalized: NormalizedGeneratedBlogPost;
  wordCount: number;
  existing: {
    postStatus: BlogPostStatus;
    workflowStatus: BlogWorkflowStatus;
    publishAt: Date | null;
    scheduledAt: Date | null;
  } | null;
  flags: GeneratedBlogMaterializationFlags;
  now: Date;
}): { ok: boolean; reasons: string[]; action: "skip" | "create" | "update" } {
  const reasons: string[] = [];
  const { normalized, wordCount, existing, flags, now } = input;

  if (wordCount < BLOG_ARTICLE_MIN_WORDS) {
    reasons.push(`body_below_min_words:${wordCount}_min_${BLOG_ARTICLE_MIN_WORDS}`);
  }

  const blogTax = classifyBlogCorpus({
    title: normalized.title,
    body: normalized.body,
    category: normalized.category,
    tags: normalized.tags,
  });
  const taxViolations = collectClassificationViolations(blogTax);
  if (taxViolations.length > 0) reasons.push(`taxonomy_invalid:${taxViolations[0]!.slice(0, 160)}`);

  if (existing) {
    const live = blogPostIsLive(
      {
        postStatus: existing.postStatus,
        publishAt: existing.publishAt,
        scheduledAt: existing.scheduledAt,
        workflowStatus: existing.workflowStatus,
      },
      now,
    );
    if (!flags.updateExisting) {
      reasons.push("slug_exists_use_update_existing");
      return { ok: false, reasons, action: "skip" };
    }
    if (live && !flags.allowPublishedUpdate) {
      reasons.push("existing_published_live_requires_allow_published_update");
      return { ok: false, reasons, action: "skip" };
    }
  }

  if (reasons.length > 0) return { ok: false, reasons, action: "skip" };

  if (existing) return { ok: true, reasons: [], action: "update" };
  return { ok: true, reasons: [], action: "create" };
}

export function wordCountForGeneratedBody(body: string): number {
  return countWordsFromHtml(body);
}

export function verifyLiveMatchesIntent(input: {
  postStatus: BlogPostStatus;
  workflowStatus: BlogWorkflowStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
  intendedPublished: boolean;
  now: Date;
}): { ok: boolean; live: boolean; reasons: string[] } {
  const live = blogPostIsLive(
    {
      postStatus: input.postStatus,
      publishAt: input.publishAt,
      scheduledAt: input.scheduledAt,
      workflowStatus: input.workflowStatus,
    },
    input.now,
  );
  const reasons: string[] = [];
  if (input.intendedPublished !== live) {
    reasons.push(
      input.intendedPublished
        ? `expected_live_but_blogPostIsLive=${String(live)}`
        : `expected_not_live_but_blogPostIsLive=${String(live)}`,
    );
  }
  return { ok: reasons.length === 0, live, reasons };
}

/** Published rows eligible for merged canonical blog sitemap slice when DB-backed. */
export function isSitemapEligibleCanonicalBlogRow(input: {
  postStatus: BlogPostStatus;
  workflowStatus: BlogWorkflowStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
  now: Date;
}): boolean {
  return blogPostIsLive(
    {
      postStatus: input.postStatus,
      publishAt: input.publishAt,
      scheduledAt: input.scheduledAt,
      workflowStatus: input.workflowStatus,
    },
    input.now,
  );
}
