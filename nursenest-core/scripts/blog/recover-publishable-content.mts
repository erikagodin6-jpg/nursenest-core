#!/usr/bin/env npx tsx
/**
 * Master blog/content recovery command.
 *
 * Dry run:
 *   npx tsx scripts/blog/recover-publishable-content.mts
 *
 * Apply safe repairs/publication:
 *   npx tsx scripts/blog/recover-publishable-content.mts --apply --limit=5000
 *
 * Scope:
 * - inventories BlogPost, LocalizedBlogArticle, generation/import tables, ContentItem article-like rows,
 *   bundled static posts, long-tail static records, manifests, JSON/MD/MDX content files.
 * - repairs metadata for publishable BlogPost rows.
 * - publishes only rows that pass existing quality and canonical publish gates.
 */
import "../../src/lib/db/script-env-bootstrap";
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BlogPostStatus,
  BlogWorkflowStatus,
  LocalizedBlogStatus,
  PrismaClient,
  type BlogPostTemplate,
  type Prisma,
} from "@prisma/client";
import {
  blogLiveWhere,
  blogPostIsLive,
  isBlogPublicE2eTestArtifact,
} from "@/lib/blog/blog-visibility";
import { validateBlogPublishQuality } from "@/lib/blog/blog-publish-quality-validator";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { listStaticBlogPostsForIndex } from "@/lib/blog/static-blog-posts";
import {
  listBlogStaticLongtailFileRecords,
  listBlogStaticLongtailRecords,
} from "@/lib/blog/blog-static-longtail-load";
import type { BlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-types";
import { expectedCanonicalBlogPath } from "@/lib/blog/generated-blog-post-publish";
import { publishBlogPostCanonical } from "@/lib/blog/publish-blog-post-canonical";
import type { StaticBlogPostRecord } from "@/content/blog-static-posts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "../..");
const repoRoot = path.resolve(appRoot, "..");
const outDir = path.join(appRoot, "reports", "blog-recovery");
const reportJsonPath = path.join(
  outDir,
  "blog-content-recovery-publication-report.json",
);
const reportMdPath = path.join(
  appRoot,
  "docs",
  "blog-content-recovery-publication-report.md",
);

type Cli = {
  apply: boolean;
  limit: number;
  materializeStatic: boolean;
  materializeLimit: number;
};

type QualityGrade = "A+" | "A" | "B" | "C" | "D";

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  legacySource: string | null;
  locale: string;
  postStatus: BlogPostStatus;
  workflowStatus: BlogWorkflowStatus | null;
  publishAt: Date | null;
  scheduledAt: Date | null;
  exam: string | null;
  careerSlug: string | null;
  category: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  targetKeyword: string | null;
  postTemplate: BlogPostTemplate | null;
  faqBlock: Prisma.JsonValue | null;
  apaReferences: string[];
  sourcesJson: Prisma.JsonValue | null;
  medicalRiskFlags: string[];
  lastReviewedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
};

type RecoveryCandidate = {
  id: string;
  slug: string;
  title: string;
  grade: QualityGrade;
  wordCount: number;
  currentStatus: string;
  liveBefore: boolean;
  action: "repair_metadata" | "publish" | "repair_and_publish" | "none";
  reasons: string[];
};

type StaticRecoverySource = "static-corpus" | "static-longtail-md";

type StaticMaterializationCandidate = {
  slug: string;
  title: string;
  grade: QualityGrade;
  wordCount: number;
  source: StaticRecoverySource;
  file: string | null;
  locale: string;
  route: string;
  action: "materialize_published_blog_post" | "skip";
  reasons: string[];
};

function parseCli(argv: string[]): Cli {
  let apply = false;
  let limit = 5000;
  let materializeStatic = false;
  let materializeLimit = 5000;
  for (const arg of argv) {
    if (arg === "--apply") apply = true;
    if (arg === "--materialize-static") materializeStatic = true;
    if (arg.startsWith("--limit=")) {
      const n = Number(arg.slice("--limit=".length));
      if (Number.isFinite(n) && n > 0) limit = Math.min(50_000, Math.floor(n));
    }
    if (arg.startsWith("--materialize-limit=")) {
      const n = Number(arg.slice("--materialize-limit=".length));
      if (Number.isFinite(n) && n > 0)
        materializeLimit = Math.min(50_000, Math.floor(n));
    }
  }
  return { apply, limit, materializeStatic, materializeLimit };
}

function localeBucket(
  locale: string | null | undefined,
): "English" | "French" | "Spanish" | "Other" {
  const l = (locale ?? "en").toLowerCase();
  if (l === "en" || l.startsWith("en-")) return "English";
  if (l === "fr" || l.startsWith("fr-")) return "French";
  if (l === "es" || l.startsWith("es-")) return "Spanish";
  return "Other";
}

function pathwayBucket(input: {
  exam?: string | null;
  careerSlug?: string | null;
  title?: string | null;
  tags?: readonly string[];
}): string {
  const hay =
    `${input.exam ?? ""} ${input.careerSlug ?? ""} ${input.title ?? ""} ${(input.tags ?? []).join(" ")}`.toLowerCase();
  if (/\b(np|cnple|fnp|agpcnp|pmhnp|whnp|pnp)\b/.test(hay)) return "NP";
  if (/\b(rpn|rex-pn|pn|nclex-pn|practical)\b/.test(hay)) return "PN/RPN";
  if (
    /\b(allied|paramedic|rt|respiratory|mlt|pt|ot|psw|social work|psychotherapy)\b/.test(
      hay,
    )
  )
    return "Allied";
  if (/\b(pre.?nursing|teas|hesi|ati)\b/.test(hay)) return "Pre-Nursing";
  return "RN";
}

function normalizeStatus(status: BlogPostStatus): string {
  if (status === BlogPostStatus.NEEDS_REVIEW) return "pending review";
  if (status === BlogPostStatus.SCHEDULED) return "scheduled";
  if (status === BlogPostStatus.PUBLISHED || status === BlogPostStatus.APPROVED)
    return "published";
  if (status === BlogPostStatus.DRAFT) return "draft";
  if (status === BlogPostStatus.FAILED) return "hidden";
  return String(status).toLowerCase();
}

function inc(map: Record<string, number>, key: string, n = 1): void {
  map[key] = (map[key] ?? 0) + n;
}

function plain(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function defaultSeoDescription(row: BlogRow): string {
  const source = row.excerpt?.trim() || plain(row.body).slice(0, 240);
  const base = source || `${row.title} nursing study guide from NurseNest.`;
  return base.slice(0, 155);
}

function qualityGrade(
  row: Pick<
    BlogRow,
    | "slug"
    | "title"
    | "body"
    | "targetKeyword"
    | "category"
    | "tags"
    | "faqBlock"
    | "apaReferences"
    | "sourcesJson"
    | "seoTitle"
    | "seoDescription"
  >,
  options?: { skipReferenceTopicAlignment?: boolean },
): {
  grade: QualityGrade;
  wordCount: number;
  issues: string[];
  blockingIssues: string[];
} {
  const wordCount = countWordsFromHtml(row.body);
  const validation = validateBlogPublishQuality(
    {
      title: row.title,
      body: row.body,
      targetKeyword: row.targetKeyword,
      category: row.category,
      tags: row.tags,
      faqBlock: row.faqBlock,
      apaReferences: row.apaReferences,
      sourcesJson: row.sourcesJson,
    },
    options,
  );
  const issues = validation.issues.map(
    (issue) => `${issue.severity}:${issue.id}`,
  );
  const blockingIssues = validation.blocking.map((issue) => issue.id);

  if (
    !row.slug.trim() ||
    !row.title.trim() ||
    !row.body.trim() ||
    wordCount < 250
  ) {
    return {
      grade: "D",
      wordCount,
      issues: ["missing_or_too_thin"],
      blockingIssues: ["missing_or_too_thin"],
    };
  }
  if (isBlogPublicE2eTestArtifact(row.slug, row.title)) {
    return {
      grade: "D",
      wordCount,
      issues: ["test_artifact"],
      blockingIssues: ["test_artifact"],
    };
  }
  if (blockingIssues.length > 0) {
    return {
      grade: wordCount >= 900 ? "C" : "D",
      wordCount,
      issues,
      blockingIssues,
    };
  }
  if (
    wordCount >= 1800 &&
    row.seoTitle &&
    row.seoDescription &&
    row.apaReferences.length >= 1
  ) {
    return { grade: "A+", wordCount, issues, blockingIssues };
  }
  if (wordCount >= 1200 && row.seoTitle && row.seoDescription) {
    return { grade: "A", wordCount, issues, blockingIssues };
  }
  if (wordCount >= 800) {
    return { grade: "B", wordCount, issues, blockingIssues };
  }
  return { grade: "C", wordCount, issues, blockingIssues };
}

function staticQualityGrade(row: {
  slug: string;
  title: string;
  body: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
}): {
  grade: QualityGrade;
  wordCount: number;
  issues: string[];
  blockingIssues: string[];
} {
  const wordCount = countWordsFromHtml(row.body);
  const bodyPlain = plain(row.body).toLowerCase();
  const blockingIssues: string[] = [];
  if (!row.slug.trim() || !row.title.trim() || !row.body.trim())
    blockingIssues.push("missing_required_field");
  if (wordCount < 250) blockingIssues.push("missing_or_too_thin");
  if (isBlogPublicE2eTestArtifact(row.slug, row.title))
    blockingIssues.push("test_artifact");
  if (
    /topic-specific clinical content goes here|replace this section|placeholder paragraph|this article will|here we explore/i.test(
      bodyPlain,
    )
  ) {
    blockingIssues.push("placeholder_or_template_content");
  }
  if (blockingIssues.length > 0) {
    return {
      grade: wordCount >= 900 ? "C" : "D",
      wordCount,
      issues: blockingIssues.map((id) => `block:${id}`),
      blockingIssues,
    };
  }
  if (wordCount >= 1800 && row.seoTitle && row.seoDescription) {
    return { grade: "A+", wordCount, issues: [], blockingIssues: [] };
  }
  if (wordCount >= 1200)
    return { grade: "A", wordCount, issues: [], blockingIssues: [] };
  if (wordCount >= 800)
    return { grade: "B", wordCount, issues: [], blockingIssues: [] };
  return {
    grade: "C",
    wordCount,
    issues: ["warn:short_static_article"],
    blockingIssues: [],
  };
}

function dateOnlyAtNoonUtc(raw: string | undefined): Date {
  const v = raw?.trim();
  if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const d = new Date(`${v}T12:00:00Z`);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

function staticLongtailBody(record: BlogStaticLongtailRecord): string {
  const disclaimer = record.disclaimer?.trim();
  if (!disclaimer) return record.bodyHtml.trim();
  const escaped = disclaimer
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return `${record.bodyHtml.trim()}\n<aside class="nn-blog-longtail-disclaimer"><p>${escaped}</p></aside>`;
}

function staticCandidateFromRecord(input: {
  source: StaticRecoverySource;
  file: string | null;
  record: StaticBlogPostRecord | BlogStaticLongtailRecord;
  existingSlugs: Set<string>;
}): StaticMaterializationCandidate {
  const record = input.record;
  const body = "bodyHtml" in record ? record.bodyHtml : "";
  const row = {
    slug: record.slug,
    title: record.title,
    body,
    targetKeyword: null,
    category: record.category ?? null,
    tags: record.tags ?? [],
    faqBlock: null,
    apaReferences: [],
    sourcesJson: null,
    seoTitle: "seoTitle" in record ? record.seoTitle : record.title,
    seoDescription:
      "seoDescription" in record ? record.seoDescription : record.excerpt,
  };
  const q = staticQualityGrade(row);
  const reasons = [...q.issues];
  if (input.existingSlugs.has(record.slug)) reasons.push("db_slug_exists");
  if (!record.slug.trim() || !record.title.trim() || !body.trim())
    reasons.push("missing_required_field");
  const publishable =
    ["A+", "A", "B"].includes(q.grade) &&
    q.blockingIssues.length === 0 &&
    !input.existingSlugs.has(record.slug) &&
    record.slug.trim().length > 0 &&
    record.title.trim().length > 0 &&
    body.trim().length > 0;
  return {
    slug: record.slug,
    title: record.title,
    grade: q.grade,
    wordCount: q.wordCount,
    source: input.source,
    file: input.file,
    locale:
      "locale" in record
        ? record.locale?.trim() || record.languageCode?.trim() || "en"
        : "en",
    route: expectedCanonicalBlogPath(record.slug, null),
    action: publishable ? "materialize_published_blog_post" : "skip",
    reasons,
  };
}

function createDataFromStaticRecord(input: {
  source: StaticRecoverySource;
  file: string | null;
  record: StaticBlogPostRecord | BlogStaticLongtailRecord;
  now: Date;
}): Prisma.BlogPostCreateInput {
  const record = input.record;
  const isLongtail = input.source === "static-longtail-md";
  const createdAt = dateOnlyAtNoonUtc(record.createdAt);
  const updatedAt = dateOnlyAtNoonUtc(
    "updatedAt" in record ? record.updatedAt : record.createdAt,
  );
  const body = isLongtail
    ? staticLongtailBody(record as BlogStaticLongtailRecord)
    : record.bodyHtml.trim();
  const locale =
    "locale" in record
      ? (record.locale?.trim() || record.languageCode?.trim() || "en").slice(
          0,
          32,
        )
      : "en";
  const seoTitle =
    "seoTitle" in record
      ? record.seoTitle?.trim() || record.title
      : record.title;
  const seoDescription =
    "seoDescription" in record
      ? record.seoDescription?.trim() || record.excerpt
      : record.excerpt;
  const authorDisplayName =
    "authorDisplayName" in record
      ? record.authorDisplayName?.trim() || null
      : null;
  const medicalReviewerName =
    "medicalReviewerName" in record
      ? record.medicalReviewerName?.trim() || null
      : null;
  const translationGroupId =
    "translationGroupId" in record
      ? record.translationGroupId?.trim() || null
      : null;
  return {
    slug: record.slug,
    title: record.title,
    excerpt:
      record.excerpt ||
      defaultSeoDescription({
        id: "",
        slug: record.slug,
        title: record.title,
        excerpt: record.excerpt,
        body,
        legacySource: input.source,
        locale,
        postStatus: BlogPostStatus.PUBLISHED,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
        publishAt: input.now,
        scheduledAt: null,
        exam: null,
        careerSlug: null,
        category: record.category,
        tags: record.tags ?? [],
        seoTitle,
        seoDescription,
        targetKeyword: null,
        postTemplate: null,
        faqBlock: null,
        apaReferences: [],
        sourcesJson: null,
        medicalRiskFlags: [],
        lastReviewedAt: null,
        updatedAt,
        createdAt,
      }),
    body,
    tags: record.tags ?? [],
    category: record.category ?? null,
    createdAt,
    updatedAt,
    legacySource: input.file ? `${input.source}:${input.file}` : input.source,
    postStatus: BlogPostStatus.PUBLISHED,
    publishAt:
      createdAt.getTime() <= input.now.getTime() ? createdAt : input.now,
    scheduledAt: null,
    seoTitle,
    seoDescription,
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
    adminPublishLog: [
      {
        at: input.now.toISOString(),
        action: "content_recovery_materialized_static_article",
        source: input.source,
        file: input.file,
        route: expectedCanonicalBlogPath(record.slug, null),
      },
    ],
    locale,
    translationGroupId,
    authorDisplayName,
    medicalReviewerName,
  };
}

function needsMetadataRepair(row: BlogRow): boolean {
  return (
    !row.seoTitle?.trim() || !row.seoDescription?.trim() || !row.excerpt?.trim()
  );
}

function shouldPublish(row: BlogRow, grade: QualityGrade, now: Date): boolean {
  if (!["A+", "A", "B"].includes(grade)) return false;
  if (row.medicalRiskFlags.length > 0 && !row.lastReviewedAt) return false;
  const live = blogPostIsLive(
    {
      postStatus: row.postStatus,
      publishAt: row.publishAt,
      scheduledAt: row.scheduledAt,
      workflowStatus: row.workflowStatus,
    },
    now,
  );
  if (!live) return true;
  return (
    row.postStatus !== BlogPostStatus.PUBLISHED ||
    row.workflowStatus !== BlogWorkflowStatus.PUBLISHED
  );
}

function discoverFileAssets(): {
  totalFiles: number;
  byKind: Record<string, number>;
  sample: Array<{ path: string; kind: string }>;
} {
  const roots = [
    "src/content",
    "src/lib/seo",
    "src/lib/blog",
    "scripts/blog",
    "data/blog-content",
    "data/blog-manifest",
    "content",
  ];
  const extensions = new Set([".json", ".md", ".mdx", ".ts", ".mts"]);
  const out: Array<{ path: string; kind: string }> = [];
  const visit = (abs: string) => {
    let st;
    try {
      st = statSync(abs);
    } catch {
      return;
    }
    if (st.isDirectory()) {
      if (abs.includes("node_modules") || abs.includes(".next")) return;
      for (const name of readdirSync(abs)) visit(path.join(abs, name));
      return;
    }
    const ext = path.extname(abs).toLowerCase();
    if (!extensions.has(ext)) return;
    const rel = path.relative(appRoot, abs);
    const lower = rel.toLowerCase();
    if (
      !/(blog|seo|article|longtail|long-tail|manifest|localized|international)/.test(
        lower,
      )
    )
      return;
    const kind = lower.includes("manifest")
      ? "manifest"
      : lower.endsWith(".md") || lower.endsWith(".mdx")
        ? "markdown"
        : lower.endsWith(".json")
          ? "json"
          : "registry_or_generator";
    out.push({ path: rel, kind });
  };
  for (const root of roots) visit(path.join(appRoot, root));
  const byKind: Record<string, number> = {};
  for (const row of out) inc(byKind, row.kind);
  return { totalFiles: out.length, byKind, sample: out.slice(0, 60) };
}

function writeMarkdown(report: Record<string, unknown>): void {
  const s = report.summary as Record<string, unknown>;
  const lines = [
    "# Blog Content Recovery Publication Report",
    "",
    `Generated: ${String(report.generatedAt)}`,
    `Mode: ${String(report.applyMode)}`,
    "",
    "## Reconciliation",
    "",
    `- Database Total: ${s.databaseTotalActual ?? s.databaseTotal}`,
    `- Visible Total: ${s.visibleTotal}`,
    `- Indexable Total: ${s.indexableTotal}`,
    `- Sitemap Total: ${s.sitemapTotal}`,
    `- Static/Repo Supplemental Total: ${s.staticSupplementTotal}`,
    `- Unshadowed Static Supplemental Total: ${s.unshadowedStaticSupplementTotal ?? 0}`,
    "",
    "## Recovery Results",
    "",
    `- Total Content Found: ${s.totalContentFound}`,
    `- Total Content Recovered: ${s.totalContentRecovered}`,
    `- Total Content Recovered This Run: ${s.totalContentRecoveredThisRun ?? 0}`,
    `- Total Content Repaired: ${s.totalContentRepaired}`,
    `- Total Content Published: ${s.totalContentPublished}`,
    `- Total Content Materialized To Active Pipeline: ${s.totalContentMaterializedToActivePipeline ?? 0}`,
    `- Total Content Routed: ${s.totalContentRouted}`,
    `- Total Content Added To Sitemap: ${s.totalContentAddedToSitemap}`,
    `- Total Content Still Requiring Human Review: ${s.totalHumanReview}`,
    "",
    "## Notes",
    "",
    "- Publication uses existing NurseNest canonical blog publish gates.",
    "- B-grade rows receive metadata repair and are published only when publish validation has no blocking issue.",
    "- C/D rows are not force-published because they require clinical or substantive rewrite.",
    "",
    "See `reports/blog-recovery/blog-content-recovery-publication-report.json` for full samples and breakdowns.",
    "",
  ];
  writeFileSync(reportMdPath, lines.join("\n"), "utf8");
}

async function main(): Promise<void> {
  const cli = parseCli(process.argv.slice(2));
  mkdirSync(outDir, { recursive: true });
  mkdirSync(path.dirname(reportMdPath), { recursive: true });
  const prisma = new PrismaClient();
  const now = new Date();

  const [
    blogRows,
    localizedRows,
    contentItems,
    generationJobs,
    draftBatchItems,
    scheduleItems,
  ] = await Promise.all([
    prisma.blogPost.findMany({
      take: cli.limit,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        body: true,
        legacySource: true,
        locale: true,
        postStatus: true,
        workflowStatus: true,
        publishAt: true,
        scheduledAt: true,
        exam: true,
        careerSlug: true,
        category: true,
        tags: true,
        seoTitle: true,
        seoDescription: true,
        targetKeyword: true,
        postTemplate: true,
        faqBlock: true,
        apaReferences: true,
        sourcesJson: true,
        medicalRiskFlags: true,
        lastReviewedAt: true,
        updatedAt: true,
        createdAt: true,
      },
    }),
    prisma.localizedBlogArticle.findMany({
      take: cli.limit,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        localizedSlug: true,
        localizedTitle: true,
        localizedBody: true,
        locale: true,
        region: true,
        profession: true,
        exam: true,
        contentStatus: true,
        scheduledAt: true,
        publishedAt: true,
        updatedAt: true,
      },
    }),
    prisma.contentItem
      .findMany({
        where: {
          OR: [
            { type: { contains: "blog", mode: "insensitive" } },
            { type: { contains: "article", mode: "insensitive" } },
            { type: { contains: "seo", mode: "insensitive" } },
          ],
        },
        take: cli.limit,
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          status: true,
          regionScope: true,
          updatedAt: true,
        },
      })
      .catch(
        () =>
          [] as Array<{
            id: string;
            title: string;
            slug: string;
            type: string;
            status: string | null;
            regionScope: string | null;
            updatedAt: Date;
          }>,
      ),
    prisma.blogArticleGenerationJob
      .findMany({
        take: cli.limit,
        select: {
          id: true,
          resultTitle: true,
          resultSlug: true,
          stage: true,
          blogPostId: true,
          updatedAt: true,
        },
      })
      .catch(() => []),
    prisma.blogDraftGenerationBatchItem
      .findMany({
        take: cli.limit,
        select: {
          id: true,
          topicRaw: true,
          canonicalTopicKey: true,
          status: true,
          blogPostId: true,
          updatedAt: true,
        },
      })
      .catch(() => []),
    prisma.blogBatchScheduleItem
      .findMany({
        take: cli.limit,
        select: {
          id: true,
          topicRaw: true,
          canonicalTopicKey: true,
          status: true,
          blogPostId: true,
          plannedPublishAt: true,
          updatedAt: true,
        },
      })
      .catch(() => []),
  ]);

  const staticRows = listStaticBlogPostsForIndex();
  const longtailFileRows = listBlogStaticLongtailFileRecords(now);
  const longtailRows = longtailFileRows.map((row) => row.record);
  const fileAssets = discoverFileAssets();
  const liveDbSlugRows = await prisma.blogPost.findMany({
    where: blogLiveWhere(now),
    select: { slug: true, title: true },
  });
  const databaseTotalCount = await prisma.blogPost.count();
  const recoveredStaticSourceDbCount = await prisma.blogPost.count({
    where: { legacySource: { startsWith: "static-" } },
  });
  const livePublicRows = liveDbSlugRows.filter(
    (row) => !isBlogPublicE2eTestArtifact(row.slug, row.title),
  );
  const liveWhereCount = livePublicRows.length;
  const liveSlugSet = new Set(
    livePublicRows.map((row) => row.slug.trim()).filter(Boolean),
  );
  const supplementSlugs = new Set(
    [
      ...staticRows.map((r) => r.slug),
      ...longtailRows.map((r) => r.slug),
    ].filter(Boolean),
  );
  const unshadowedSupplementSlugs = new Set(
    [...supplementSlugs].filter((slug) => !liveSlugSet.has(slug)),
  );
  const sitemapPostSlugs = new Set([
    ...liveSlugSet,
    ...[...supplementSlugs].filter((slug) => !liveSlugSet.has(slug)),
  ]);

  const byStatus: Record<string, number> = {
    published: 0,
    scheduled: 0,
    draft: 0,
    "pending review": 0,
    archived: 0,
    hidden: 0,
  };
  const byLocale: Record<string, number> = {
    English: 0,
    French: 0,
    Spanish: 0,
    Other: 0,
  };
  const byPathway: Record<string, number> = {
    RN: 0,
    "PN/RPN": 0,
    NP: 0,
    Allied: 0,
    "Pre-Nursing": 0,
  };
  const byGrade: Record<string, number> = { "A+": 0, A: 0, B: 0, C: 0, D: 0 };
  const candidates: RecoveryCandidate[] = [];
  const humanReview: RecoveryCandidate[] = [];
  const orphanedPosts: Array<{ slug: string; reason: string }> = [];
  const scheduledOverdue: Array<{
    slug: string;
    scheduledAt: string | null;
    publishAt: string | null;
  }> = [];
  const publishedMissingSitemap: string[] = [];
  const applied: Array<{ slug: string; action: string }> = [];
  const failedApply: Array<{ slug: string; action: string; error: string }> =
    [];
  const existingSlugSet = new Set(
    (blogRows as BlogRow[]).map((row) => row.slug.trim()).filter(Boolean),
  );
  const staticMaterializationCandidates = [
    ...staticRows.map((record) =>
      staticCandidateFromRecord({
        source: "static-corpus",
        file: null,
        record,
        existingSlugs: existingSlugSet,
      }),
    ),
    ...longtailFileRows.map(({ file, record }) =>
      staticCandidateFromRecord({
        source: "static-longtail-md",
        file,
        record,
        existingSlugs: existingSlugSet,
      }),
    ),
  ];
  const queuedStaticSlugs = new Set<string>();
  const staticMaterializationQueue: StaticMaterializationCandidate[] = [];
  for (const candidate of staticMaterializationCandidates) {
    if (candidate.action !== "materialize_published_blog_post") continue;
    if (queuedStaticSlugs.has(candidate.slug)) continue;
    queuedStaticSlugs.add(candidate.slug);
    staticMaterializationQueue.push(candidate);
    if (staticMaterializationQueue.length >= cli.materializeLimit) break;
  }
  const staticMaterialized: Array<{
    slug: string;
    source: StaticRecoverySource;
    route: string;
  }> = [];
  const staticMaterializationFailed: Array<{
    slug: string;
    source: StaticRecoverySource;
    error: string;
  }> = [];

  for (const row of blogRows as BlogRow[]) {
    const live = blogPostIsLive(
      {
        postStatus: row.postStatus,
        publishAt: row.publishAt,
        scheduledAt: row.scheduledAt,
        workflowStatus: row.workflowStatus,
      },
      now,
    );
    inc(byStatus, normalizeStatus(row.postStatus));
    inc(byLocale, localeBucket(row.locale));
    inc(byPathway, pathwayBucket(row));
    const q = row.legacySource?.startsWith("static-")
      ? staticQualityGrade({
          slug: row.slug,
          title: row.title,
          body: row.body,
          seoTitle: row.seoTitle,
          seoDescription: row.seoDescription,
        })
      : qualityGrade(row);
    inc(byGrade, q.grade);
    const repair = needsMetadataRepair(row);
    const publish = shouldPublish(row, q.grade, now);
    const action =
      repair && publish
        ? "repair_and_publish"
        : publish
          ? "publish"
          : repair && ["A+", "A", "B"].includes(q.grade)
            ? "repair_metadata"
            : "none";
    const c: RecoveryCandidate = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      grade: q.grade,
      wordCount: q.wordCount,
      currentStatus: `${row.postStatus}:${row.workflowStatus ?? "null"}`,
      liveBefore: live,
      action,
      reasons: [
        ...q.issues,
        ...(row.medicalRiskFlags.length > 0 && !row.lastReviewedAt
          ? ["medical_review_required"]
          : []),
      ],
    };
    if (action !== "none") candidates.push(c);
    if (
      q.grade === "C" ||
      q.grade === "D" ||
      c.reasons.includes("medical_review_required")
    )
      humanReview.push(c);
    if (row.postStatus === BlogPostStatus.SCHEDULED) {
      const gate = row.publishAt ?? row.scheduledAt;
      if (gate && gate.getTime() <= now.getTime() && !live) {
        scheduledOverdue.push({
          slug: row.slug,
          scheduledAt: row.scheduledAt?.toISOString() ?? null,
          publishAt: row.publishAt?.toISOString() ?? null,
        });
      }
    }
    if (
      live &&
      !isBlogPublicE2eTestArtifact(row.slug, row.title) &&
      !sitemapPostSlugs.has(row.slug.trim())
    ) {
      publishedMissingSitemap.push(row.slug);
    }
    if (
      live &&
      row.category == null &&
      row.tags.length === 0 &&
      row.careerSlug == null &&
      row.exam == null
    ) {
      orphanedPosts.push({
        slug: row.slug,
        reason: "live_but_no_category_tags_career_or_exam",
      });
    }
  }

  if (cli.apply) {
    for (const c of candidates) {
      const row = (blogRows as BlogRow[]).find((r) => r.id === c.id);
      if (!row) continue;
      try {
        if (
          c.action === "repair_metadata" ||
          c.action === "repair_and_publish"
        ) {
          await prisma.blogPost.update({
            where: { id: row.id },
            data: {
              excerpt: row.excerpt?.trim() || defaultSeoDescription(row),
              seoTitle: row.seoTitle?.trim() || row.title.slice(0, 180),
              seoDescription:
                row.seoDescription?.trim() || defaultSeoDescription(row),
              category: row.category?.trim() || pathwayBucket(row),
              tags:
                row.tags.length > 0
                  ? row.tags
                  : [pathwayBucket(row), "nursing education"],
            },
          });
          applied.push({ slug: row.slug, action: "repair_metadata" });
        }
        if (c.action === "publish" || c.action === "repair_and_publish") {
          await publishBlogPostCanonical({
            postId: row.id,
            publishAt: row.publishAt ?? now,
            clearScheduledAt: true,
            context: "recover_generated_blog_script",
            acknowledgePrePublishWarnings: true,
            skipRevalidate: true,
          });
          applied.push({ slug: row.slug, action: "publish" });
        }
      } catch (error) {
        failedApply.push({
          slug: row.slug,
          action: c.action,
          error:
            error instanceof Error
              ? error.message.slice(0, 500)
              : String(error).slice(0, 500),
        });
      }
    }
  }

  if (cli.apply && cli.materializeStatic) {
    for (const c of staticMaterializationQueue) {
      const sourceRecord =
        c.source === "static-corpus"
          ? staticRows.find((record) => record.slug === c.slug)
          : longtailFileRows.find(({ record }) => record.slug === c.slug)
              ?.record;
      if (!sourceRecord) continue;
      try {
        await prisma.blogPost.create({
          data: createDataFromStaticRecord({
            source: c.source,
            file: c.file,
            record: sourceRecord,
            now,
          }),
        });
        existingSlugSet.add(c.slug);
        staticMaterialized.push({
          slug: c.slug,
          source: c.source,
          route: c.route,
        });
      } catch (error) {
        staticMaterializationFailed.push({
          slug: c.slug,
          source: c.source,
          error:
            error instanceof Error
              ? error.message.slice(0, 500)
              : String(error).slice(0, 500),
        });
      }
    }
  }

  const localizedPublished = localizedRows.filter(
    (row) =>
      row.contentStatus === LocalizedBlogStatus.PUBLISHED ||
      (row.contentStatus === LocalizedBlogStatus.SCHEDULED &&
        row.scheduledAt &&
        row.scheduledAt.getTime() <= now.getTime()),
  );
  const localizedByStatus: Record<string, number> = {};
  for (const row of localizedRows) inc(localizedByStatus, row.contentStatus);

  const report = {
    generatedAt: now.toISOString(),
    applyMode: cli.apply ? "apply" : "dry-run",
    summary: {
      databaseTotal: blogRows.length,
      databaseTotalActual: databaseTotalCount,
      visibleTotal: liveWhereCount + unshadowedSupplementSlugs.size,
      indexableTotal:
        liveWhereCount +
        localizedPublished.length +
        unshadowedSupplementSlugs.size,
      sitemapTotal: sitemapPostSlugs.size,
      staticSupplementTotal: staticRows.length + longtailRows.length,
      unshadowedStaticSupplementTotal: unshadowedSupplementSlugs.size,
      localizedTotal: localizedRows.length,
      localizedPublishedTotal: localizedPublished.length,
      contentItemArticleLikeTotal: contentItems.length,
      generationJobTotal: generationJobs.length,
      draftBatchItemTotal: draftBatchItems.length,
      scheduleItemTotal: scheduleItems.length,
      repositoryContentFileTotal: fileAssets.totalFiles,
      staticMaterializationCandidates: staticMaterializationQueue.length,
      staticMaterializationAlreadyInDb: staticMaterializationCandidates.filter(
        (candidate) => candidate.reasons.includes("db_slug_exists"),
      ).length,
      staticMaterializationQualitySkipped:
        staticMaterializationCandidates.filter(
          (candidate) =>
            candidate.action === "skip" &&
            !candidate.reasons.includes("db_slug_exists"),
        ).length,
      totalContentMaterializedToActivePipeline: staticMaterialized.length,
      totalContentFound:
        blogRows.length +
        localizedRows.length +
        contentItems.length +
        generationJobs.length +
        draftBatchItems.length +
        scheduleItems.length +
        staticRows.length +
        longtailRows.length +
        fileAssets.totalFiles,
      totalContentRecoveredThisRun:
        applied.filter((x) => x.action === "publish").length +
        staticMaterialized.length,
      totalContentRecovered: recoveredStaticSourceDbCount,
      totalContentRepaired: applied.filter(
        (x) => x.action === "repair_metadata",
      ).length,
      totalContentPublished: liveWhereCount + unshadowedSupplementSlugs.size,
      totalContentRouted: liveWhereCount + unshadowedSupplementSlugs.size,
      totalContentAddedToSitemap: applied.filter((x) => x.action === "publish")
        .length,
      totalHumanReview: humanReview.length,
    },
    breakdowns: {
      byStatus,
      byLocale,
      byPathway,
      byGrade,
      localizedByStatus,
      fileAssetsByKind: fileAssets.byKind,
    },
    discrepancies: {
      databaseMinusVisible: blogRows.length - liveWhereCount,
      visibleMinusSitemap:
        liveWhereCount + unshadowedSupplementSlugs.size - sitemapPostSlugs.size,
      publishedMissingSitemap,
      scheduledOverdue,
      orphanedPosts: orphanedPosts.slice(0, 250),
      postsStoredOutsideActivePublishingPipeline: {
        staticRows: staticRows.length,
        longtailRows: longtailRows.length,
        unshadowedStaticRows: unshadowedSupplementSlugs.size,
        localizedRows: localizedRows.length,
        contentItemArticleLikeRows: contentItems.length,
        generationJobs: generationJobs.length,
        draftBatchItems: draftBatchItems.length,
        scheduleItems: scheduleItems.length,
        repositoryFiles: fileAssets.totalFiles,
      },
    },
    recoveryCandidates: candidates.slice(0, 1000),
    staticMaterialization: {
      enabled: cli.materializeStatic,
      dryRun: !cli.apply,
      candidates: staticMaterializationCandidates.slice(0, 1000),
      queueCount: staticMaterializationQueue.length,
      created: staticMaterialized,
      failed: staticMaterializationFailed,
    },
    humanReviewQueue: humanReview.slice(0, 1000),
    applied,
    failedApply,
    samples: {
      fileAssets: fileAssets.sample,
      localizedPublished: localizedPublished.slice(0, 50).map((row) => ({
        id: row.id,
        slug: row.localizedSlug,
        title: row.localizedTitle,
        locale: row.locale,
        region: row.region,
        profession: row.profession,
        exam: row.exam,
      })),
      staticSupplement: [
        ...staticRows.slice(0, 25),
        ...longtailRows.slice(0, 25),
      ].map((row) => ({
        slug: row.slug,
        title: row.title,
      })),
    },
    policy: {
      publication:
        "Only A+/A/B BlogPost rows with no blocking quality issues are repaired/published automatically.",
      humanReview:
        "C/D rows, missing/thin bodies, test artifacts, placeholder/filler, and unreviewed medical-risk content remain in human review.",
      sitemap:
        "Sitemap count is the union of live BlogPost slugs and static/longtail supplement slugs, with DB slugs winning on overlap.",
      route:
        "Canonical route is derived by expectedCanonicalBlogPath(slug, careerSlug).",
    },
  };

  writeFileSync(reportJsonPath, JSON.stringify(report, null, 2), "utf8");
  writeMarkdown(report);
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`[blog-recovery] wrote ${reportJsonPath}`);
  console.log(`[blog-recovery] wrote ${reportMdPath}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
