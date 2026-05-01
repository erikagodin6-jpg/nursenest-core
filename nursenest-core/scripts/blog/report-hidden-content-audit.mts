#!/usr/bin/env npx tsx
/**
 * Read-only hidden blog content audit.
 *
 * Discovers blog/article-like content across the monorepo and optional DB-backed
 * sources, then writes:
 * - reports/blog-hidden-content-audit.md
 * - reports/blog-hidden-content-inventory.json
 *
 * Default mode is read-only. Passing `--apply` throws immediately (no DB writes).
 *
 * Usage:
 *   npm run blog:audit:hidden
 *   npm run blog:audit:hidden:db   # requires DATABASE_URL after env load
 *   npx tsx scripts/blog/report-hidden-content-audit.mts [--require-database]
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BlogDraftGenerationBatchItemStatus,
  BlogPostStatus,
  BlogWorkflowStatus,
  LocalizedBlogStatus,
  PrismaClient,
} from "@prisma/client";
import { BLOG_ARTICLE_MIN_WORDS, countWordsFromHtml } from "../../src/lib/blog/blog-word-count";
import { blogPostIsLive } from "../../src/lib/blog/blog-visibility";
import { STATIC_BLOG_POSTS } from "../../src/content/blog-static-posts";
import { LONG_FORM_BLOG_POSTS, LONG_FORM_BLOG_TOPICS } from "../../src/lib/seo/long-form-seo-blog-posts";
import { LF2_POSTS, LF2_TOPICS } from "../../src/lib/seo/long-form-seo-blog-posts-chunk2";
import { loadBlogAuditEnv } from "../../src/lib/db/blog-audit-env-load";

type AuditStatus =
  | "draft"
  | "pending"
  | "published"
  | "failed"
  | "hidden"
  | "orphaned"
  | "unknown";

type PublishBucket =
  | "RN"
  | "RPN"
  | "NP"
  | "pre-nursing"
  | "allied health"
  | "pharm"
  | "patho"
  | "test prep"
  | "general nursing";

type InventoryRecord = {
  id: string;
  title: string;
  slug: string;
  status: AuditStatus;
  sourceType: string;
  sourceLocation: string;
  publicReachable: boolean;
  expectedPublicUrl: string | null;
  appearsInSitemap: boolean | null;
  enoughSeoToPublish: boolean | null;
  duplicateContent: boolean;
  duplicateGroup: string[];
  domainBucket: PublishBucket;
  wordCount: number | null;
  locale: string | null;
  routeSurface: string | null;
  publishReadiness: "ready_to_publish" | "recoverable" | "needs_review" | "blocked";
  reasons: string[];
  metadata: Record<string, unknown>;
};

type SourceSummary = {
  sourceType: string;
  location: string;
  description: string;
  liveSurface: boolean;
  notes: string[];
};

type InventoryOutput = {
  generatedAt: string;
  applyRequested: boolean;
  repoRoot: string;
  appRoot: string;
  searchCoverage: string[];
  database: {
    urlConfigured: boolean;
    queried: boolean;
    querySucceeded: boolean;
    error: string | null;
  };
  nearbyCheckouts: {
    path: string;
    exists: boolean;
  }[];
  sourceSummaries: SourceSummary[];
  sourceOfTruth: {
    adminCanonicalWrites: string[];
    generatorWrites: string[];
    publicCanonicalReads: string[];
    publicLocalizedReads: string[];
    blogIndexReads: string[];
    tagPageReads: string[];
    sitemapReads: string[];
    rssReads: string[];
    mismatchFindings: string[];
  };
  summary: {
    totalRecords: number;
    hiddenOrOrphaned: number;
    readyToPublish: number;
    recoverable: number;
    needsReview: number;
    blocked: number;
    duplicates: number;
    byStatus: Record<string, number>;
    bySourceType: Record<string, number>;
    byDomainBucket: Record<string, number>;
  };
  cohorts: {
    readyToPublish: Array<Pick<InventoryRecord, "id" | "title" | "slug" | "sourceType" | "sourceLocation" | "expectedPublicUrl" | "reasons">>;
    recoverable: Array<Pick<InventoryRecord, "id" | "title" | "slug" | "sourceType" | "sourceLocation" | "expectedPublicUrl" | "reasons">>;
    blocked: Array<Pick<InventoryRecord, "id" | "title" | "slug" | "sourceType" | "sourceLocation" | "reasons">>;
    duplicates: Array<Pick<InventoryRecord, "id" | "title" | "slug" | "sourceType" | "sourceLocation" | "duplicateGroup">>;
  };
  inventory: InventoryRecord[];
  /** Normalized rows for downstream tooling (same data as `inventory`, extended field names). */
  inventorySpec: AuditSpecRecord[];
  summaryBuckets: {
    totalDiscovered: number;
    alreadyLive: number;
    hiddenButRecoverable: number;
    blocked: number;
    duplicates: number;
    fileOrBackupOnly: number;
    dbOnlyNotPublic: number;
    readyToPublish: number;
    needsReview: number;
  };
};

/** External audit schema (aligned with recovery runbooks). */
type AuditSpecRecord = {
  title: string;
  slug: string;
  normalizedSlug: string;
  status: AuditStatus;
  sourceType: string;
  sourceLocation: string;
  modelOrTable: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  locale: string | null;
  region: string | null;
  tierCategory: PublishBucket;
  expectedPublicUrl: string | null;
  reachableFromPublicUrl: boolean;
  appearsInBlogIndex: boolean | null;
  appearsInSitemap: boolean | null;
  contentWordCount: number | null;
  hasSeoTitle: boolean;
  hasMetaDescription: boolean;
  hasCanonicalSlug: boolean | null;
  duplicateGroupId: string | null;
  duplicateReason: string | null;
  publishReadiness: "ready" | "needs_review" | "blocked" | "duplicate" | "unknown";
  blockReason: string | null;
  recommendedAction: string;
  reasons: string[];
  id: string;
  /** First ~200 chars of body when available (see metadata.bodyPreview), else title + reasons. */
  contentPreview: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(appRoot, "..");
const reportsDir = path.join(repoRoot, "reports");
const reportMarkdownPath = path.join(reportsDir, "blog-hidden-content-audit.md");
const reportJsonPath = path.join(reportsDir, "blog-hidden-content-inventory.json");

function parseArgs(argv: string[]) {
  return {
    apply: argv.includes("--apply"),
    requireDatabase: argv.includes("--require-database"),
  };
}

function slugifyText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWordsFromMarkdown(value: string): number {
  return value
    .replace(/[#>*_`\[\]\(\)\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function inferDomainBucket(textParts: Array<string | null | undefined>): PublishBucket {
  const haystack = textParts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (/(paramedic|respiratory|rrt|mlt|lab tech|imaging|radiography|sonography|allied)/.test(haystack)) return "allied health";
  if (/(rex-pn|practical nurse|rpn|lpn|pn\b)/.test(haystack)) return "RPN";
  if (/(nurse practitioner|\bnp\b|fnp|pmhnp|agpcnp|whnp|pnp-pc)/.test(haystack)) return "NP";
  if (/(pre nursing|pre-nursing)/.test(haystack)) return "pre-nursing";
  if (/(pharmacology|\bpharm\b|medication)/.test(haystack)) return "pharm";
  if (/(pathophysiology|\bpatho\b)/.test(haystack)) return "patho";
  if (/(nclex|exam prep|test day|board|question bank|sata|ngn|clinical judgment)/.test(haystack)) return "test prep";
  if (/(rn|registered nurse|nursing)/.test(haystack)) return "RN";
  return "general nursing";
}

function canonicalBlogUrl(slug: string): string {
  return `/blog/${slug}`;
}

function scopedCanonicalBlogUrl(careerSlug: string | null | undefined, slug: string): string {
  const scoped = (careerSlug ?? "").trim().toLowerCase();
  if (!scoped) return canonicalBlogUrl(slug);
  if (["paramedic", "respiratory", "mlt", "imaging", "sonography"].includes(scoped)) {
    return `/allied-health/${scoped}/blog/${slug}`;
  }
  return `/nursing/${scoped}/blog/${slug}`;
}

function localizedBlogUrl(input: {
  locale: string | null | undefined;
  region: string | null | undefined;
  profession: string | null | undefined;
  exam: string | null | undefined;
  slug: string;
}): string | null {
  const locale = input.locale?.trim().toLowerCase();
  const region = input.region?.trim().toLowerCase();
  const profession = input.profession?.trim().toLowerCase();
  const exam = input.exam?.trim().toLowerCase();
  if (!locale || !region || !profession || !exam) return null;
  return `/${locale}/${region}/${profession}/${exam}/blog/${input.slug}`;
}

function inferSeoReadiness(input: {
  title?: string | null;
  excerpt?: string | null;
  body?: string | null;
  bodyWordCount?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  referencesRequired?: boolean;
  references?: string[] | null;
}): { ready: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const bodyWords = input.bodyWordCount ?? countWordsFromHtml(input.body ?? "");
  if (!input.title?.trim()) reasons.push("missing_title");
  if (!input.excerpt?.trim()) reasons.push("missing_excerpt");
  if (!input.body?.trim()) reasons.push("missing_body");
  if (bodyWords < BLOG_ARTICLE_MIN_WORDS) reasons.push(`body_below_min_words:${bodyWords}`);
  if (!input.seoTitle?.trim()) reasons.push("missing_seo_title");
  if (!input.seoDescription?.trim()) reasons.push("missing_seo_description");
  if ((input.referencesRequired ?? false) && (input.references?.length ?? 0) === 0) reasons.push("missing_required_references");
  return { ready: reasons.length === 0, reasons };
}

function pushRecord(records: InventoryRecord[], record: Omit<InventoryRecord, "duplicateContent" | "duplicateGroup">) {
  records.push({
    ...record,
    duplicateContent: false,
    duplicateGroup: [],
  });
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(targetPath: string): Promise<void> {
  await fs.mkdir(targetPath, { recursive: true });
}

async function readJsonFile<T>(targetPath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(targetPath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function listMatchingDirs(parent: string, prefix: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(parent, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
      .map((entry) => path.join(parent, entry.name))
      .sort();
  } catch {
    return [];
  }
}

async function listDirsContaining(parent: string, needle: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(parent, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && entry.name.includes(needle))
      .map((entry) => path.join(parent, entry.name))
      .sort();
  } catch {
    return [];
  }
}

async function loadFileBasedSources(records: InventoryRecord[], sources: SourceSummary[]): Promise<void> {
  sources.push(
    {
      sourceType: "blog_post_db",
      location: "prisma.BlogPost",
      description: "Canonical public blog model used by /blog and scoped nursing/allied hubs.",
      liveSurface: true,
      notes: ["Public canonical blog detail ultimately depends on BlogPost rows, not static TS or manifest JSON."],
    },
    {
      sourceType: "localized_blog_db",
      location: "prisma.LocalizedBlogArticle",
      description: "Localized/regional blog model used by locale-aware marketing routes.",
      liveSurface: true,
      notes: ["Current main sitemap route does not appear to include localized blog URLs."],
    },
    {
      sourceType: "content_item_db",
      location: "prisma.ContentItem",
      description: "Legacy content_items table; blog-like rows here would be orphaned because public blog routes do not read ContentItem.",
      liveSurface: false,
      notes: ["Relevant only if rows exist with blog/article-like types."],
    },
  );

  for (const post of STATIC_BLOG_POSTS) {
    const readiness = inferSeoReadiness({
      title: post.title,
      excerpt: post.excerpt,
      body: post.bodyHtml,
      bodyWordCount: countWordsFromHtml(post.bodyHtml),
      seoTitle: post.title,
      seoDescription: post.excerpt,
    });
    pushRecord(records, {
      id: `static:${post.slug}`,
      title: post.title,
      slug: post.slug,
      status: "hidden",
      sourceType: "static_fallback_ts",
      sourceLocation: "nursenest-core/src/content/blog-static-posts.ts",
      publicReachable: false,
      expectedPublicUrl: canonicalBlogUrl(post.slug),
      appearsInSitemap: false,
      enoughSeoToPublish: readiness.ready,
      domainBucket: inferDomainBucket([post.title, post.category, post.slug]),
      wordCount: countWordsFromHtml(post.bodyHtml),
      locale: "en",
      routeSurface: "/blog/[slug] (fallback-only, DB-empty mode)",
      publishReadiness: readiness.ready ? "recoverable" : "needs_review",
      reasons: [
        "static_body_not_used_by_live_detail_when_db_has_posts",
        ...readiness.reasons,
      ],
      metadata: {
        category: post.category,
        tags: post.tags,
        createdAt: post.createdAt,
      },
    });
  }
  sources.push({
    sourceType: "static_fallback_ts",
    location: "nursenest-core/src/content/blog-static-posts.ts",
    description: "Bundled static fallback corpus with full HTML bodies.",
    liveSurface: false,
    notes: ["Index/meta fallback only when DB is empty or build skips DB; live blog detail does not use this body when DB-backed rows exist."],
  });

  const batchImportReadyPath = path.join(repoRoot, "data", "blog-manifest", "batch-01", "batch-01-import-ready.json");
  const batchImportReady = await readJsonFile<{ posts?: Array<Record<string, unknown>> }>(batchImportReadyPath);
  if (batchImportReady?.posts) {
    for (const entry of batchImportReady.posts) {
      const title = String(entry.title ?? "");
      const slug = String(entry.slug ?? "");
      const body = String(entry.body ?? "");
      const excerpt = String(entry.excerpt ?? "");
      const readiness = inferSeoReadiness({
        title,
        excerpt,
        body,
        bodyWordCount: countWordsFromHtml(body),
        seoTitle: String(entry.seoTitle ?? ""),
        seoDescription: String(entry.seoDescription ?? ""),
        referencesRequired: Boolean(entry.requiresReferences),
        references: Array.isArray(entry.apaReferences) ? (entry.apaReferences as string[]) : [],
      });
      pushRecord(records, {
        id: `batch01:${slug}`,
        title,
        slug,
        status: String(entry.postStatus ?? "").toUpperCase() === "DRAFT" ? "draft" : "hidden",
        sourceType: "manifest_import_ready",
        sourceLocation: "data/blog-manifest/batch-01/batch-01-import-ready.json",
        publicReachable: false,
        expectedPublicUrl: canonicalBlogUrl(slug),
        appearsInSitemap: false,
        enoughSeoToPublish: readiness.ready,
        domainBucket: inferDomainBucket([title, String(entry.category ?? ""), slug, String(entry.exam ?? ""), String(entry.careerSlug ?? "")]),
        wordCount: countWordsFromHtml(body),
        locale: String(entry.locale ?? "en"),
        routeSurface: "/blog/[slug] after BlogPost import",
        publishReadiness: readiness.ready ? "ready_to_publish" : "needs_review",
        reasons: [
          "import_ready_json_exists_but_not_live",
          ...readiness.reasons,
        ],
        metadata: {
          workflowStatus: entry.workflowStatus ?? null,
          postStatus: entry.postStatus ?? null,
          bodySourceFile: entry.bodySourceFile ?? null,
          careerSlug: entry.careerSlug ?? null,
          exam: entry.exam ?? null,
          category: entry.category ?? null,
        },
      });
    }
    sources.push({
      sourceType: "manifest_import_ready",
      location: "data/blog-manifest/batch-01/batch-01-import-ready.json",
      description: "Generated batch with full English draft bodies and SEO metadata.",
      liveSurface: false,
      notes: ["Strongest non-DB recovery cohort: 10 full-body draft posts with explicit import path already documented in repo reports."],
    });
  }

  const newgradBatchDirs = await listMatchingDirs(path.join(repoRoot, "data", "blog-content"), "newgrad-prod-batch-");
  for (const batchDir of newgradBatchDirs) {
    const indexPath = path.join(batchDir, "index.json");
    const items = await readJsonFile<Array<Record<string, unknown>>>(indexPath);
    if (!items) continue;
    for (const item of items) {
      const slug = String(item.slug ?? "");
      const title = String(item.title ?? "");
      const excerpt = String(item.excerpt ?? "");
      const manifestId = Number(item.manifestId ?? 0);
      const bodyName = `body-${String(manifestId).padStart(2, "0")}.html`;
      const bodyPath = path.join(batchDir, bodyName);
      const bodyHtml = (await exists(bodyPath)) ? await fs.readFile(bodyPath, "utf8") : "";
      const readiness = inferSeoReadiness({
        title,
        excerpt,
        body: bodyHtml,
        bodyWordCount: countWordsFromHtml(bodyHtml),
        seoTitle: String(item.seoTitle ?? ""),
        seoDescription: String(item.seoDescription ?? ""),
      });
      pushRecord(records, {
        id: `newgrad:${path.basename(batchDir)}:${slug}`,
        title,
        slug,
        status: "hidden",
        sourceType: "newgrad_batch_file",
        sourceLocation: path.relative(repoRoot, indexPath),
        publicReachable: false,
        expectedPublicUrl: canonicalBlogUrl(slug),
        appearsInSitemap: false,
        enoughSeoToPublish: readiness.ready,
        domainBucket: inferDomainBucket([title, slug, "new grad", "test prep"]),
        wordCount: bodyHtml ? countWordsFromHtml(bodyHtml) : null,
        locale: "en",
        routeSurface: "/blog/[slug] after BlogPost import",
        publishReadiness: readiness.ready ? "ready_to_publish" : "needs_review",
        reasons: [
          "batch_index_and_body_html_exist_but_not_live",
          ...(bodyHtml ? [] : ["missing_body_html_file"]),
          ...readiness.reasons,
        ],
        metadata: {
          manifestId,
          batchDir: path.basename(batchDir),
          relatedLessonPaths: Array.isArray(item.relatedLessonPaths) ? item.relatedLessonPaths : [],
        },
      });
    }
    sources.push({
      sourceType: "newgrad_batch_file",
      location: path.relative(repoRoot, batchDir),
      description: "New-grad batch index + HTML bodies stored on disk.",
      liveSurface: false,
      notes: ["Recoverable only through import/materialization into BlogPost; not currently a direct public route source."],
    });
  }

  const regionalSampleDir = path.join(appRoot, "data", "blog-content");
  const regionalSampleCountries = [
    "australia-nursing",
    "china-nursing",
    "france-nursing",
    "germany-nursing",
    "hungary-nursing",
    "india-nursing",
    "italy-nursing",
    "japan-nursing",
    "korea-nursing",
    "mexico-nursing",
    "middle-east-nursing",
    "philippines-nursing",
    "portugal-nursing",
  ];
  for (const country of regionalSampleCountries) {
    const samplePath = path.join(regionalSampleDir, country, "sample-posts.json");
    const sampleData = await readJsonFile<{ entries?: Array<Record<string, unknown>> }>(samplePath);
    if (!sampleData?.entries) continue;
    for (const entry of sampleData.entries) {
      const slug = String(entry.slug ?? "");
      const title = String(entry.title ?? "");
      pushRecord(records, {
        id: `sample:${country}:${slug}`,
        title,
        slug,
        status: "pending",
        sourceType: "regional_sample_posts",
        sourceLocation: path.relative(repoRoot, samplePath),
        publicReachable: false,
        expectedPublicUrl: null,
        appearsInSitemap: false,
        enoughSeoToPublish: false,
        domainBucket: inferDomainBucket([title, slug, country]),
        wordCount: null,
        locale: String(entry.language ?? "en"),
        routeSurface: null,
        publishReadiness: "needs_review",
        reasons: ["sample_manifest_only", "missing_full_body"],
        metadata: {
          status: entry.status ?? null,
          translationGroupId: entry.translationGroupId ?? null,
          countryTargets: entry.countryTargets ?? [],
        },
      });
    }
    sources.push({
      sourceType: "regional_sample_posts",
      location: path.relative(repoRoot, samplePath),
      description: "Sample regional blog seed metadata without full body content.",
      liveSurface: false,
      notes: ["Useful for planning, not immediate publication."],
    });
  }

  const manifestPaths = [
    path.join(repoRoot, "data", "blog-manifest", "pathophysiology-200.manifest.json"),
    path.join(repoRoot, "data", "blog-manifest", "pathophysiology-200-wave2.manifest.json"),
    path.join(repoRoot, "data", "blog-manifest", "allied-400.manifest.json"),
    path.join(repoRoot, "data", "blog-manifest", "newgrad-400.manifest.json"),
  ];
  for (const manifestPath of manifestPaths) {
    const manifestData = await readJsonFile<{ posts?: Array<Record<string, unknown>> }>(manifestPath);
    if (!manifestData?.posts) continue;
    for (const entry of manifestData.posts) {
      const slug = String(entry.slug ?? "");
      const title = String(entry.title ?? "");
      pushRecord(records, {
        id: `manifest:${path.basename(manifestPath)}:${slug}`,
        title,
        slug,
        status: String(entry.status ?? "").toLowerCase() === "planned" ? "pending" : "unknown",
        sourceType: "planned_manifest",
        sourceLocation: path.relative(repoRoot, manifestPath),
        publicReachable: false,
        expectedPublicUrl: canonicalBlogUrl(slug),
        appearsInSitemap: false,
        enoughSeoToPublish: false,
        domainBucket: inferDomainBucket([
          title,
          String(entry.pathway ?? ""),
          String(entry.profession ?? ""),
          String(entry.category ?? ""),
          slug,
        ]),
        wordCount: null,
        locale: "en",
        routeSurface: "/blog/[slug] after generation/import",
        publishReadiness: "blocked",
        reasons: ["metadata_only_manifest_entry", "missing_full_body"],
        metadata: {
          status: entry.status ?? null,
          category: entry.category ?? null,
          profession: entry.profession ?? null,
          pathway: entry.pathway ?? null,
        },
      });
    }
    sources.push({
      sourceType: "planned_manifest",
      location: path.relative(repoRoot, manifestPath),
      description: "Topic manifest / planned post inventory without direct public materialization.",
      liveSurface: false,
      notes: ["Valuable for scope counting, but not a direct publish-ready hidden-content cohort unless a paired body source exists."],
    });
  }

  for (const topic of LONG_FORM_BLOG_TOPICS) {
    pushRecord(records, {
      id: `longform-topic:${topic.id}`,
      title: topic.title,
      slug: topic.slug,
      status: "pending",
      sourceType: "long_form_topic_ts",
      sourceLocation: "nursenest-core/src/lib/seo/long-form-seo-blog-posts.ts",
      publicReachable: false,
      expectedPublicUrl: `/${topic.locale}/${topic.region}/${topic.profession}/${topic.exam}/blog/${topic.slug}`,
      appearsInSitemap: false,
      enoughSeoToPublish: false,
      domainBucket: inferDomainBucket([topic.title, topic.profession, topic.exam, topic.primaryKeyword]),
      wordCount: null,
      locale: topic.locale,
      routeSurface: "/[locale]/[region]/[profession]/[exam]/blog/[postSlug] after materialization",
      publishReadiness: "blocked",
      reasons: ["topic_metadata_only", "missing_full_body"],
      metadata: {
        region: topic.region,
        profession: topic.profession,
        exam: topic.exam,
        searchIntent: topic.searchIntent,
      },
    });
  }

  for (const post of LONG_FORM_BLOG_POSTS) {
    const bodyMarkdown = post.sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n");
    const readiness = inferSeoReadiness({
      title: post.title,
      excerpt: post.metaDescription,
      body: bodyMarkdown,
      bodyWordCount: countWordsFromMarkdown(bodyMarkdown),
      seoTitle: post.metaTitle,
      seoDescription: post.metaDescription,
      referencesRequired: true,
      references: post.references.map((ref) => ref.text),
    });
    pushRecord(records, {
      id: `longform-post:${post.id}`,
      title: post.title,
      slug: post.slug,
      status: "hidden",
      sourceType: "long_form_post_ts",
      sourceLocation: "nursenest-core/src/lib/seo/long-form-seo-blog-posts.ts",
      publicReachable: false,
      expectedPublicUrl: `/${post.locale}/${post.region}/${post.profession}/${post.exam}/blog/${post.slug}`,
      appearsInSitemap: false,
      enoughSeoToPublish: readiness.ready,
      domainBucket: inferDomainBucket([post.title, post.profession, post.exam, post.primaryKeyword]),
      wordCount: countWordsFromMarkdown(bodyMarkdown),
      locale: post.locale,
      routeSurface: "/[locale]/[region]/[profession]/[exam]/blog/[postSlug] after materialization",
      publishReadiness: readiness.ready ? "recoverable" : "needs_review",
      reasons: ["full_long_form_post_in_ts_not_materialized_to_db", ...readiness.reasons],
      metadata: {
        region: post.region,
        profession: post.profession,
        exam: post.exam,
        referencesCount: post.references.length,
      },
    });
  }
  sources.push({
    sourceType: "long_form_post_ts",
    location: "nursenest-core/src/lib/seo/long-form-seo-blog-posts.ts",
    description: "Programmatic SEO long-form posts and topic metadata in TS.",
    liveSurface: false,
    notes: ["The route pattern exists, but these posts are not directly rendered until materialized/imported into runtime storage."],
  });

  for (const topic of LF2_TOPICS) {
    pushRecord(records, {
      id: `lf2-topic:${topic.id}`,
      title: topic.title,
      slug: topic.slug,
      status: "pending",
      sourceType: "long_form_topic_ts_chunk2",
      sourceLocation: "nursenest-core/src/lib/seo/long-form-seo-blog-posts-chunk2.ts",
      publicReachable: false,
      expectedPublicUrl: `/${topic.locale}/${topic.region}/${topic.profession}/${topic.exam}/blog/${topic.slug}`,
      appearsInSitemap: false,
      enoughSeoToPublish: false,
      domainBucket: inferDomainBucket([topic.title, topic.profession, topic.exam, topic.primaryKeyword]),
      wordCount: null,
      locale: topic.locale,
      routeSurface: "/[locale]/[region]/[profession]/[exam]/blog/[postSlug] after materialization",
      publishReadiness: "blocked",
      reasons: ["lf2_topic_metadata_only", "missing_full_body"],
      metadata: {
        region: topic.region,
        profession: topic.profession,
        exam: topic.exam,
        searchIntent: topic.searchIntent,
      },
    });
  }

  for (const post of LF2_POSTS) {
    const bodyMarkdown = post.sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n");
    const readiness = inferSeoReadiness({
      title: post.title,
      excerpt: post.metaDescription,
      body: bodyMarkdown,
      bodyWordCount: countWordsFromMarkdown(bodyMarkdown),
      seoTitle: post.metaTitle,
      seoDescription: post.metaDescription,
      referencesRequired: true,
      references: post.references.map((ref) => ref.text),
    });
    pushRecord(records, {
      id: `lf2-post:${post.id}`,
      title: post.title,
      slug: post.slug,
      status: "hidden",
      sourceType: "long_form_post_ts_chunk2",
      sourceLocation: "nursenest-core/src/lib/seo/long-form-seo-blog-posts-chunk2.ts",
      publicReachable: false,
      expectedPublicUrl: `/${post.locale}/${post.region}/${post.profession}/${post.exam}/blog/${post.slug}`,
      appearsInSitemap: false,
      enoughSeoToPublish: readiness.ready,
      domainBucket: inferDomainBucket([post.title, post.profession, post.exam, post.primaryKeyword]),
      wordCount: countWordsFromMarkdown(bodyMarkdown),
      locale: post.locale,
      routeSurface: "/[locale]/[region]/[profession]/[exam]/blog/[postSlug] after materialization",
      publishReadiness: readiness.ready ? "recoverable" : "needs_review",
      reasons: ["lf2_full_post_in_ts_not_materialized_to_db", ...readiness.reasons],
      metadata: {
        region: post.region,
        profession: post.profession,
        exam: post.exam,
        referencesCount: post.references.length,
      },
    });
  }
  sources.push({
    sourceType: "long_form_post_ts_chunk2",
    location: "nursenest-core/src/lib/seo/long-form-seo-blog-posts-chunk2.ts",
    description: "Second-chunk programmatic SEO topics + full posts (TS, not DB).",
    liveSurface: false,
    notes: ["Same materialization contract as LONG_FORM_BLOG_* — not live until imported to LocalizedBlogArticle or canonical BlogPost per routing."],
  });

  const ardsBundlePath = path.join(repoRoot, "data", "blog", "ards-pathophysiology-nclex-multilingual", "bundle.json");
  const ardsBundle = await readJsonFile<{
    slug?: string;
    languages?: Record<
      string,
      {
        locale?: string;
        slug?: string;
        seoTitle?: string;
        metaDescription?: string;
        bodyMarkdown?: string;
        referencesApa7?: string;
      }
    >;
  }>(ardsBundlePath);
  if (ardsBundle?.languages) {
    for (const [localeKey, localeEntry] of Object.entries(ardsBundle.languages)) {
      const bodyMarkdown = String(localeEntry.bodyMarkdown ?? "");
      const readiness = inferSeoReadiness({
        title: String(localeEntry.seoTitle ?? ardsBundle.slug ?? ""),
        excerpt: String(localeEntry.metaDescription ?? ""),
        body: bodyMarkdown,
        bodyWordCount: countWordsFromMarkdown(bodyMarkdown),
        seoTitle: String(localeEntry.seoTitle ?? ""),
        seoDescription: String(localeEntry.metaDescription ?? ""),
        referencesRequired: true,
        references: String(localeEntry.referencesApa7 ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      });
      pushRecord(records, {
        id: `ards-bundle:${localeKey}:${localeEntry.slug ?? ardsBundle.slug ?? ""}`,
        title: String(localeEntry.seoTitle ?? ardsBundle.slug ?? ""),
        slug: String(localeEntry.slug ?? ardsBundle.slug ?? ""),
        status: "hidden",
        sourceType: "multilingual_bundle_json",
        sourceLocation: "data/blog/ards-pathophysiology-nclex-multilingual/bundle.json",
        publicReachable: false,
        expectedPublicUrl: null,
        appearsInSitemap: false,
        enoughSeoToPublish: readiness.ready,
        domainBucket: inferDomainBucket([String(localeEntry.seoTitle ?? ""), "ards", "pathophysiology", "nclex"]),
        wordCount: countWordsFromMarkdown(bodyMarkdown),
        locale: String(localeEntry.locale ?? localeKey),
        routeSurface: "unknown regional blog route until localized materialization mapping is confirmed",
        publishReadiness: readiness.ready ? "needs_review" : "blocked",
        reasons: [
          "localized_bundle_not_connected_to_live_route",
          "missing_region_profession_exam_mapping",
          ...readiness.reasons,
        ],
        metadata: {
          locale: localeEntry.locale ?? localeKey,
        },
      });
    }
    sources.push({
      sourceType: "multilingual_bundle_json",
      location: "data/blog/ards-pathophysiology-nclex-multilingual/bundle.json",
      description: "Multilingual full-body blog bundle stored in JSON/Markdown.",
      liveSurface: false,
      notes: ["Strong content source, but route mapping and DB materialization are not proven from current public loaders."],
    });
  }
}

async function loadSnapshotJsonSources(
  snapshotRoot: string,
  label: string,
  records: InventoryRecord[],
  sources: SourceSummary[],
): Promise<void> {
  if (!(await exists(snapshotRoot))) return;

  const batchImportReadyPath = path.join(snapshotRoot, "data", "blog-manifest", "batch-01", "batch-01-import-ready.json");
  const batchImportReady = await readJsonFile<{ posts?: Array<Record<string, unknown>> }>(batchImportReadyPath);
  if (batchImportReady?.posts) {
    for (const entry of batchImportReady.posts) {
      const title = String(entry.title ?? "");
      const slug = String(entry.slug ?? "");
      const body = String(entry.body ?? "");
      const excerpt = String(entry.excerpt ?? "");
      const readiness = inferSeoReadiness({
        title,
        excerpt,
        body,
        bodyWordCount: countWordsFromHtml(body),
        seoTitle: String(entry.seoTitle ?? ""),
        seoDescription: String(entry.seoDescription ?? ""),
        referencesRequired: Boolean(entry.requiresReferences),
        references: Array.isArray(entry.apaReferences) ? (entry.apaReferences as string[]) : [],
      });
      pushRecord(records, {
        id: `snapshot:${label}:batch01:${slug}`,
        title,
        slug,
        status: String(entry.postStatus ?? "").toUpperCase() === "DRAFT" ? "draft" : "hidden",
        sourceType: "snapshot_manifest_import_ready",
        sourceLocation: path.join(snapshotRoot, "data/blog-manifest/batch-01/batch-01-import-ready.json"),
        publicReachable: false,
        expectedPublicUrl: canonicalBlogUrl(slug),
        appearsInSitemap: false,
        enoughSeoToPublish: readiness.ready,
        domainBucket: inferDomainBucket([title, String(entry.category ?? ""), slug, String(entry.exam ?? ""), String(entry.careerSlug ?? "")]),
        wordCount: countWordsFromHtml(body),
        locale: String(entry.locale ?? "en"),
        routeSurface: "/blog/[slug] after BlogPost import",
        publishReadiness: readiness.ready ? "ready_to_publish" : "needs_review",
        reasons: [`snapshot_source:${label}`, "import_ready_json_exists_but_not_live", ...readiness.reasons],
        metadata: {
          workflowStatus: entry.workflowStatus ?? null,
          postStatus: entry.postStatus ?? null,
          bodySourceFile: entry.bodySourceFile ?? null,
        },
      });
    }
    sources.push({
      sourceType: "snapshot_manifest_import_ready",
      location: path.join(snapshotRoot, "data/blog-manifest/batch-01/batch-01-import-ready.json"),
      description: `Snapshot ${label}: generated batch with full English draft bodies and SEO metadata.`,
      liveSurface: false,
      notes: ["Potential recovery source preserved in older checkout/snapshot."],
    });
  }

  const newgradParent = path.join(snapshotRoot, "data", "blog-content");
  const newgradBatchDirs = await listMatchingDirs(newgradParent, "newgrad-prod-batch-");
  for (const batchDir of newgradBatchDirs) {
    const indexPath = path.join(batchDir, "index.json");
    const items = await readJsonFile<Array<Record<string, unknown>>>(indexPath);
    if (!items) continue;
    for (const item of items) {
      const slug = String(item.slug ?? "");
      const title = String(item.title ?? "");
      const excerpt = String(item.excerpt ?? "");
      const manifestId = Number(item.manifestId ?? 0);
      const bodyName = `body-${String(manifestId).padStart(2, "0")}.html`;
      const bodyPath = path.join(batchDir, bodyName);
      const bodyHtml = (await exists(bodyPath)) ? await fs.readFile(bodyPath, "utf8") : "";
      const readiness = inferSeoReadiness({
        title,
        excerpt,
        body: bodyHtml,
        bodyWordCount: countWordsFromHtml(bodyHtml),
        seoTitle: String(item.seoTitle ?? ""),
        seoDescription: String(item.seoDescription ?? ""),
      });
      pushRecord(records, {
        id: `snapshot:${label}:newgrad:${path.basename(batchDir)}:${slug}`,
        title,
        slug,
        status: "hidden",
        sourceType: "snapshot_newgrad_batch_file",
        sourceLocation: indexPath,
        publicReachable: false,
        expectedPublicUrl: canonicalBlogUrl(slug),
        appearsInSitemap: false,
        enoughSeoToPublish: readiness.ready,
        domainBucket: inferDomainBucket([title, slug, "new grad", "test prep"]),
        wordCount: bodyHtml ? countWordsFromHtml(bodyHtml) : null,
        locale: "en",
        routeSurface: "/blog/[slug] after BlogPost import",
        publishReadiness: readiness.ready ? "ready_to_publish" : "needs_review",
        reasons: [`snapshot_source:${label}`, "batch_index_and_body_html_exist_but_not_live", ...(bodyHtml ? [] : ["missing_body_html_file"]), ...readiness.reasons],
        metadata: {
          manifestId,
          batchDir: path.basename(batchDir),
        },
      });
    }
    sources.push({
      sourceType: "snapshot_newgrad_batch_file",
      location: batchDir,
      description: `Snapshot ${label}: new-grad batch index + HTML bodies stored on disk.`,
      liveSurface: false,
      notes: ["Potential recovery source preserved in older checkout/snapshot."],
    });
  }

  const ardsBundlePath = path.join(snapshotRoot, "data", "blog", "ards-pathophysiology-nclex-multilingual", "bundle.json");
  const ardsBundle = await readJsonFile<{
    slug?: string;
    languages?: Record<
      string,
      {
        locale?: string;
        slug?: string;
        seoTitle?: string;
        metaDescription?: string;
        bodyMarkdown?: string;
        referencesApa7?: string;
      }
    >;
  }>(ardsBundlePath);
  if (ardsBundle?.languages) {
    for (const [localeKey, localeEntry] of Object.entries(ardsBundle.languages)) {
      const bodyMarkdown = String(localeEntry.bodyMarkdown ?? "");
      const readiness = inferSeoReadiness({
        title: String(localeEntry.seoTitle ?? ardsBundle.slug ?? ""),
        excerpt: String(localeEntry.metaDescription ?? ""),
        body: bodyMarkdown,
        bodyWordCount: countWordsFromMarkdown(bodyMarkdown),
        seoTitle: String(localeEntry.seoTitle ?? ""),
        seoDescription: String(localeEntry.metaDescription ?? ""),
      });
      pushRecord(records, {
        id: `snapshot:${label}:ards:${localeKey}:${localeEntry.slug ?? ardsBundle.slug ?? ""}`,
        title: String(localeEntry.seoTitle ?? ardsBundle.slug ?? ""),
        slug: String(localeEntry.slug ?? ardsBundle.slug ?? ""),
        status: "hidden",
        sourceType: "snapshot_multilingual_bundle_json",
        sourceLocation: ardsBundlePath,
        publicReachable: false,
        expectedPublicUrl: null,
        appearsInSitemap: false,
        enoughSeoToPublish: readiness.ready,
        domainBucket: inferDomainBucket([String(localeEntry.seoTitle ?? ""), "ards", "pathophysiology", "nclex"]),
        wordCount: countWordsFromMarkdown(bodyMarkdown),
        locale: String(localeEntry.locale ?? localeKey),
        routeSurface: "unknown regional blog route until localized materialization mapping is confirmed",
        publishReadiness: readiness.ready ? "needs_review" : "blocked",
        reasons: [`snapshot_source:${label}`, "localized_bundle_not_connected_to_live_route", "missing_region_profession_exam_mapping", ...readiness.reasons],
        metadata: {
          locale: localeEntry.locale ?? localeKey,
        },
      });
    }
    sources.push({
      sourceType: "snapshot_multilingual_bundle_json",
      location: ardsBundlePath,
      description: `Snapshot ${label}: multilingual full-body blog bundle stored in JSON/Markdown.`,
      liveSurface: false,
      notes: ["Potential recovery source preserved in older checkout/snapshot."],
    });
  }
}

function localizedStatusToAuditStatus(status: LocalizedBlogStatus, scheduledAt: Date | null, publishedAt: Date | null, now: Date): AuditStatus {
  if (status === LocalizedBlogStatus.PUBLISHED && publishedAt && publishedAt.getTime() <= now.getTime()) return "published";
  if (status === LocalizedBlogStatus.SCHEDULED) {
    if (scheduledAt && scheduledAt.getTime() <= now.getTime()) return "hidden";
    return "pending";
  }
  if (status === LocalizedBlogStatus.REJECTED) return "failed";
  if (status === LocalizedBlogStatus.DRAFT || status === LocalizedBlogStatus.AI_GENERATED || status === LocalizedBlogStatus.AI_ADAPTED) return "draft";
  return "pending";
}

async function loadDatabaseSources(
  prisma: PrismaClient,
  records: InventoryRecord[],
): Promise<{ queried: boolean; querySucceeded: boolean; error: string | null }> {
  if (!process.env.DATABASE_URL?.trim()) {
    return { queried: false, querySucceeded: false, error: null };
  }

  try {
    const now = new Date();

    const blogPosts = await prisma.blogPost.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        body: true,
        seoTitle: true,
        seoDescription: true,
        postStatus: true,
        workflowStatus: true,
        publishAt: true,
        scheduledAt: true,
        locale: true,
        careerSlug: true,
        exam: true,
        category: true,
        tags: true,
        targetKeyword: true,
        legacySource: true,
        requiresReferences: true,
        apaReferences: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    for (const row of blogPosts) {
      const live = blogPostIsLive(
        {
          postStatus: row.postStatus,
          publishAt: row.publishAt,
          scheduledAt: row.scheduledAt,
          workflowStatus: row.workflowStatus,
        },
        now,
      );
      const readiness = inferSeoReadiness({
        title: row.title,
        excerpt: row.excerpt,
        body: row.body,
        bodyWordCount: countWordsFromHtml(row.body),
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        referencesRequired: row.requiresReferences,
        references: row.apaReferences,
      });
      const reasons: string[] = [];
      let status: AuditStatus = "unknown";
      if (live) {
        status = "published";
      } else if (row.postStatus === BlogPostStatus.DRAFT) {
        status = "draft";
        reasons.push("post_status_draft");
      } else if (row.postStatus === BlogPostStatus.NEEDS_REVIEW) {
        status = "pending";
        reasons.push("post_status_needs_review");
      } else if (row.postStatus === BlogPostStatus.FAILED) {
        status = "failed";
        reasons.push("post_status_failed");
      } else if (row.postStatus === BlogPostStatus.PUBLISHED) {
        status = "hidden";
        reasons.push("published_row_hidden_by_visibility_rules");
      } else {
        status = "hidden";
        reasons.push(`post_status_${row.postStatus.toLowerCase()}`);
      }
      if (row.workflowStatus !== BlogWorkflowStatus.PUBLISHED && row.postStatus === BlogPostStatus.PUBLISHED) {
        reasons.push(`workflow_mismatch:${row.workflowStatus}`);
      }
      if (row.publishAt && row.publishAt.getTime() > now.getTime()) reasons.push("future_publish_at");
      if (row.scheduledAt && row.scheduledAt.getTime() > now.getTime() && row.postStatus === BlogPostStatus.SCHEDULED) reasons.push("future_scheduled_at");
      reasons.push(...readiness.reasons);

      pushRecord(records, {
        id: `db:blogPost:${row.id}`,
        title: row.title,
        slug: row.slug,
        status,
        sourceType: "db_blog_post",
        sourceLocation: `BlogPost:${row.id}`,
        publicReachable: live,
        expectedPublicUrl: scopedCanonicalBlogUrl(row.careerSlug, row.slug),
        appearsInSitemap: live,
        enoughSeoToPublish: readiness.ready,
        domainBucket: inferDomainBucket([row.title, row.category, row.slug, row.exam, row.careerSlug, row.targetKeyword]),
        wordCount: countWordsFromHtml(row.body),
        locale: row.locale,
        routeSurface: row.careerSlug ? "scoped canonical blog" : "/blog/[slug]",
        publishReadiness:
          live ? "blocked" : readiness.ready && status === "hidden" ? "ready_to_publish" : readiness.ready ? "recoverable" : "needs_review",
        reasons,
        metadata: {
          postStatus: row.postStatus,
          workflowStatus: row.workflowStatus,
          publishAt: row.publishAt?.toISOString() ?? null,
          scheduledAt: row.scheduledAt?.toISOString() ?? null,
          legacySource: row.legacySource,
          careerSlug: row.careerSlug,
          category: row.category,
          tags: row.tags,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
          modelOrTable: "BlogPost",
          bodyPreview: stripHtml(row.body ?? "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 220),
        },
      });
    }

    const localizedRows = await prisma.localizedBlogArticle.findMany({
      select: {
        id: true,
        canonicalArticleId: true,
        locale: true,
        region: true,
        profession: true,
        exam: true,
        contentStatus: true,
        localizedTitle: true,
        localizedExcerpt: true,
        localizedBody: true,
        canonicalSlug: true,
        localizedSlug: true,
        localizedMetaTitle: true,
        localizedMetaDescription: true,
        publishedAt: true,
        scheduledAt: true,
        rejectionReason: true,
        updatedAt: true,
      },
    });
    for (const row of localizedRows) {
      const status = localizedStatusToAuditStatus(row.contentStatus, row.scheduledAt, row.publishedAt, now);
      const live =
        row.contentStatus === LocalizedBlogStatus.PUBLISHED ||
        (row.contentStatus === LocalizedBlogStatus.SCHEDULED && !!row.scheduledAt && row.scheduledAt.getTime() <= now.getTime());
      const readiness = inferSeoReadiness({
        title: row.localizedTitle,
        excerpt: row.localizedExcerpt,
        body: row.localizedBody,
        bodyWordCount: countWordsFromHtml(row.localizedBody),
        seoTitle: row.localizedMetaTitle,
        seoDescription: row.localizedMetaDescription,
      });
      const reasons = [...readiness.reasons];
      if (live) reasons.push("localized_post_live_but_not_in_main_sitemap");
      if (row.rejectionReason) reasons.push(`rejection_reason:${slugifyText(row.rejectionReason).slice(0, 64)}`);
      pushRecord(records, {
        id: `db:localized:${row.id}`,
        title: row.localizedTitle,
        slug: row.localizedSlug,
        status,
        sourceType: "db_localized_blog_article",
        sourceLocation: `LocalizedBlogArticle:${row.id}`,
        publicReachable: live,
        expectedPublicUrl: localizedBlogUrl({
          locale: row.locale,
          region: row.region,
          profession: row.profession,
          exam: row.exam,
          slug: row.localizedSlug,
        }),
        appearsInSitemap: false,
        enoughSeoToPublish: readiness.ready,
        domainBucket: inferDomainBucket([row.localizedTitle, row.region, row.profession, row.exam, row.localizedSlug]),
        wordCount: countWordsFromHtml(row.localizedBody),
        locale: row.locale,
        routeSurface: "/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]",
        publishReadiness:
          live ? "blocked" : readiness.ready && (status === "hidden" || status === "pending") ? "recoverable" : "needs_review",
        reasons,
        metadata: {
          canonicalArticleId: row.canonicalArticleId,
          canonicalSlug: row.canonicalSlug,
          region: row.region,
          profession: row.profession,
          exam: row.exam,
          contentStatus: row.contentStatus,
          publishedAt: row.publishedAt?.toISOString() ?? null,
          scheduledAt: row.scheduledAt?.toISOString() ?? null,
          updatedAt: row.updatedAt.toISOString(),
          modelOrTable: "LocalizedBlogArticle",
          bodyPreview: stripHtml(row.localizedBody ?? "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 220),
        },
      });
    }

    const contentItems = await prisma.contentItem.findMany({
      where: {
        type: {
          in: ["blog", "blog-post", "article"],
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        status: true,
        summary: true,
        seoTitle: true,
        seoDescription: true,
        publishedAt: true,
        scheduledAt: true,
        updatedAt: true,
      },
    });
    for (const row of contentItems) {
      const reasons = ["content_item_not_used_by_public_blog_routes"];
      const readiness = inferSeoReadiness({
        title: row.title,
        excerpt: row.summary,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
      });
      reasons.push(...readiness.reasons);
      pushRecord(records, {
        id: `db:contentItem:${row.id}`,
        title: row.title,
        slug: row.slug,
        status: "orphaned",
        sourceType: "db_content_item",
        sourceLocation: `ContentItem:${row.id}`,
        publicReachable: false,
        expectedPublicUrl: canonicalBlogUrl(row.slug),
        appearsInSitemap: false,
        enoughSeoToPublish: readiness.ready,
        domainBucket: inferDomainBucket([row.title, row.slug, row.type]),
        wordCount: null,
        locale: null,
        routeSurface: null,
        publishReadiness: readiness.ready ? "needs_review" : "blocked",
        reasons,
        metadata: {
          type: row.type,
          status: row.status,
          publishedAt: row.publishedAt?.toISOString() ?? null,
          scheduledAt: row.scheduledAt?.toISOString() ?? null,
          updatedAt: row.updatedAt.toISOString(),
          modelOrTable: "ContentItem",
        },
      });
    }

    const draftBatchItems = await prisma.blogDraftGenerationBatchItem.findMany({
      select: {
        id: true,
        topicRaw: true,
        canonicalTopicKey: true,
        status: true,
        error: true,
        blogPostId: true,
        batchId: true,
        ordinal: true,
      },
    });
    for (const row of draftBatchItems) {
      const slug = row.canonicalTopicKey ?? slugifyText(row.topicRaw).slice(0, 160);
      pushRecord(records, {
        id: `db:draftBatchItem:${row.id}`,
        title: row.topicRaw,
        slug,
        status:
          row.status === BlogDraftGenerationBatchItemStatus.COMPLETED
            ? "hidden"
            : row.status === BlogDraftGenerationBatchItemStatus.FAILED
              ? "failed"
              : "pending",
        sourceType: "db_draft_generation_batch_item",
        sourceLocation: `BlogDraftGenerationBatchItem:${row.id}`,
        publicReachable: false,
        expectedPublicUrl: row.blogPostId ? canonicalBlogUrl(slug) : null,
        appearsInSitemap: false,
        enoughSeoToPublish: null,
        domainBucket: inferDomainBucket([row.topicRaw, slug]),
        wordCount: null,
        locale: null,
        routeSurface: null,
        publishReadiness:
          row.status === BlogDraftGenerationBatchItemStatus.COMPLETED ? "recoverable" : row.status === BlogDraftGenerationBatchItemStatus.FAILED ? "blocked" : "needs_review",
        reasons: [row.error ? `batch_error:${slugifyText(row.error).slice(0, 96)}` : `batch_status:${row.status.toLowerCase()}`],
        metadata: {
          batchId: row.batchId,
          ordinal: row.ordinal,
          blogPostId: row.blogPostId,
          status: row.status,
          modelOrTable: "BlogDraftGenerationBatchItem",
        },
      });
    }

    const scheduleItems = await prisma.blogBatchScheduleItem.findMany({
      select: {
        id: true,
        topicRaw: true,
        canonicalTopicKey: true,
        plannedPublishAt: true,
        status: true,
        failureReason: true,
        blogPostId: true,
        scheduleId: true,
        ordinal: true,
      },
    });
    for (const row of scheduleItems) {
      const slug = row.canonicalTopicKey ?? slugifyText(row.topicRaw).slice(0, 160);
      const reasons = [`schedule_status:${String(row.status).toLowerCase()}`];
      if (row.failureReason) reasons.push(`schedule_failure:${slugifyText(row.failureReason).slice(0, 96)}`);
      pushRecord(records, {
        id: `db:scheduleItem:${row.id}`,
        title: row.topicRaw,
        slug,
        status:
          String(row.status) === "PUBLISHED"
            ? "published"
            : String(row.status) === "FAILED"
              ? "failed"
              : row.plannedPublishAt.getTime() <= now.getTime()
                ? "hidden"
                : "pending",
        sourceType: "db_batch_schedule_item",
        sourceLocation: `BlogBatchScheduleItem:${row.id}`,
        publicReachable: false,
        expectedPublicUrl: row.blogPostId ? canonicalBlogUrl(slug) : null,
        appearsInSitemap: false,
        enoughSeoToPublish: null,
        domainBucket: inferDomainBucket([row.topicRaw, slug]),
        wordCount: null,
        locale: null,
        routeSurface: null,
        publishReadiness: row.failureReason ? "blocked" : row.plannedPublishAt.getTime() <= now.getTime() ? "recoverable" : "needs_review",
        reasons,
        metadata: {
          scheduleId: row.scheduleId,
          ordinal: row.ordinal,
          plannedPublishAt: row.plannedPublishAt.toISOString(),
          blogPostId: row.blogPostId,
          status: row.status,
          modelOrTable: "BlogBatchScheduleItem",
        },
      });
    }

    const generationJobs = await prisma.blogArticleGenerationJob.findMany({
      select: {
        id: true,
        stage: true,
        requestPayload: true,
        blogPostId: true,
        lastError: true,
        failureCode: true,
        repairable: true,
        retryCount: true,
        resultSlug: true,
        resultTitle: true,
        resultPostStatus: true,
      },
    });
    for (const row of generationJobs) {
      const payload = row.requestPayload && typeof row.requestPayload === "object" ? (row.requestPayload as Record<string, unknown>) : {};
      const title = String(row.resultTitle ?? payload.title ?? payload.topic ?? `job ${row.id}`);
      const slug = String(row.resultSlug ?? payload.slug ?? slugifyText(title).slice(0, 160));
      const reasons: string[] = [`job_stage:${row.stage}`];
      if (row.failureCode) reasons.push(`failure_code:${row.failureCode}`);
      if (row.lastError) reasons.push(`last_error:${slugifyText(row.lastError).slice(0, 96)}`);
      if (row.repairable) reasons.push("repairable_job");
      pushRecord(records, {
        id: `db:job:${row.id}`,
        title,
        slug,
        status: row.stage === "published" ? "published" : row.stage === "failed" ? "failed" : row.blogPostId ? "hidden" : "pending",
        sourceType: "db_article_generation_job",
        sourceLocation: `BlogArticleGenerationJob:${row.id}`,
        publicReachable: false,
        expectedPublicUrl: row.resultSlug ? canonicalBlogUrl(row.resultSlug) : null,
        appearsInSitemap: false,
        enoughSeoToPublish: null,
        domainBucket: inferDomainBucket([title, slug]),
        wordCount: null,
        locale: null,
        routeSurface: null,
        publishReadiness: row.stage === "failed" ? (row.repairable ? "recoverable" : "blocked") : row.blogPostId ? "recoverable" : "needs_review",
        reasons,
        metadata: {
          stage: row.stage,
          retryCount: row.retryCount,
          repairable: row.repairable,
          blogPostId: row.blogPostId,
          resultPostStatus: row.resultPostStatus,
          modelOrTable: "BlogArticleGenerationJob",
        },
      });
    }

    return { queried: true, querySucceeded: true, error: null };
  } catch (error) {
    return {
      queried: true,
      querySucceeded: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function attachDuplicateMetadata(records: InventoryRecord[]): void {
  const byKey = new Map<string, string[]>();
  for (const record of records) {
    const key = `${record.locale ?? "unknown"}::${record.slug}::${normalizeTitle(record.title)}`;
    const bucket = byKey.get(key) ?? [];
    bucket.push(record.id);
    byKey.set(key, bucket);
  }
  for (const record of records) {
    const key = `${record.locale ?? "unknown"}::${record.slug}::${normalizeTitle(record.title)}`;
    const group = byKey.get(key) ?? [];
    if (group.length > 1) {
      record.duplicateContent = true;
      record.duplicateGroup = group.filter((value) => value !== record.id);
      if (!record.reasons.includes("duplicate_slug_title_signature")) {
        record.reasons.push("duplicate_slug_title_signature");
      }
      if (record.publishReadiness === "ready_to_publish") record.publishReadiness = "needs_review";
    }
  }
}

function summarize(records: InventoryRecord[]) {
  const byStatus: Record<string, number> = {};
  const bySourceType: Record<string, number> = {};
  const byDomainBucket: Record<string, number> = {};
  for (const record of records) {
    byStatus[record.status] = (byStatus[record.status] ?? 0) + 1;
    bySourceType[record.sourceType] = (bySourceType[record.sourceType] ?? 0) + 1;
    byDomainBucket[record.domainBucket] = (byDomainBucket[record.domainBucket] ?? 0) + 1;
  }
  return {
    totalRecords: records.length,
    hiddenOrOrphaned: records.filter((record) => record.status === "hidden" || record.status === "orphaned").length,
    readyToPublish: records.filter((record) => record.publishReadiness === "ready_to_publish").length,
    recoverable: records.filter((record) => record.publishReadiness === "recoverable").length,
    needsReview: records.filter((record) => record.publishReadiness === "needs_review").length,
    blocked: records.filter((record) => record.publishReadiness === "blocked").length,
    duplicates: records.filter((record) => record.duplicateContent).length,
    byStatus,
    bySourceType,
    byDomainBucket,
  };
}

function userPublishReadiness(record: InventoryRecord): AuditSpecRecord["publishReadiness"] {
  if (record.duplicateContent) return "duplicate";
  if (record.publishReadiness === "ready_to_publish") return "ready";
  if (record.publishReadiness === "needs_review") return "needs_review";
  if (record.publishReadiness === "blocked") return "blocked";
  if (record.publishReadiness === "recoverable") return "needs_review";
  return "unknown";
}

function recommendedActionFor(record: InventoryRecord): string {
  if (record.duplicateContent) return "merge_duplicate";
  if (record.sourceType === "db_content_item") return "migrate_model";
  if (
    record.sourceType === "manifest_import_ready" ||
    record.sourceType === "newgrad_batch_file" ||
    record.sourceType.startsWith("snapshot_") ||
    record.sourceType === "multilingual_bundle_json"
  ) {
    return "publish_candidate";
  }
  if (record.sourceType === "db_blog_post" && !record.publicReachable) {
    if (record.publishReadiness === "ready_to_publish") return "publish_candidate";
    return "fix_status";
  }
  if (record.sourceType === "db_localized_blog_article") return "manual_review";
  if (record.sourceType === "db_article_generation_job") return record.publishReadiness === "recoverable" ? "publish_candidate" : "manual_review";
  if (
    record.sourceType.startsWith("static_") ||
    record.sourceType === "long_form_post_ts" ||
    record.sourceType === "long_form_post_ts_chunk2"
  ) {
    return "manual_review";
  }
  return "manual_review";
}

function buildAuditSpecRecord(record: InventoryRecord): AuditSpecRecord {
  const meta = record.metadata as Record<string, unknown>;
  const createdAt = typeof meta.createdAt === "string" ? meta.createdAt : null;
  const updatedAt = typeof meta.updatedAt === "string" ? meta.updatedAt : null;
  const publishedAt =
    typeof meta.publishAt === "string"
      ? meta.publishAt
      : typeof meta.publishedAt === "string"
        ? meta.publishedAt
        : null;
  const region = typeof meta.region === "string" ? meta.region : null;
  const canonicalSlug = typeof meta.canonicalSlug === "string" ? meta.canonicalSlug : null;
  const explicitModelOrTable = typeof meta.modelOrTable === "string" ? meta.modelOrTable : null;
  const sourceLocationHead = record.sourceLocation.includes(":") ? record.sourceLocation.split(":")[0] : record.sourceLocation;
  const recognizedDbSource =
    sourceLocationHead === "BlogPost" ||
    sourceLocationHead === "LocalizedBlogArticle" ||
    sourceLocationHead === "ContentItem" ||
    sourceLocationHead === "BlogArticleGenerationJob" ||
    sourceLocationHead === "BlogDraftGenerationBatchItem" ||
    sourceLocationHead === "BlogBatchScheduleItem";
  const modelOrTable = explicitModelOrTable ?? (recognizedDbSource || /^db_/.test(record.sourceType) ? sourceLocationHead : null);

  const appearsInBlogIndex =
    record.publicReachable && record.status === "published"
      ? true
      : record.publicReachable
        ? true
        : record.status === "published" && !record.publicReachable
          ? false
          : null;

  const bodyPreview = typeof meta.bodyPreview === "string" ? meta.bodyPreview.trim() : "";
  const contentPreview =
    bodyPreview.length > 0
      ? `${bodyPreview.slice(0, 197)}${bodyPreview.length > 197 ? "…" : ""}`
      : `${record.title}${record.reasons.length ? ` — ${record.reasons.slice(0, 2).join("; ")}` : ""}`.slice(0, 200);

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    normalizedSlug: slugifyText(record.slug),
    status: record.status,
    sourceType: record.sourceType,
    sourceLocation: record.sourceLocation,
    modelOrTable,
    createdAt,
    updatedAt,
    publishedAt,
    locale: record.locale,
    region,
    tierCategory: record.domainBucket,
    expectedPublicUrl: record.expectedPublicUrl,
    reachableFromPublicUrl: record.publicReachable,
    appearsInBlogIndex,
    appearsInSitemap: record.appearsInSitemap,
    contentWordCount: record.wordCount,
    hasSeoTitle: !record.reasons.includes("missing_seo_title"),
    hasMetaDescription: !record.reasons.includes("missing_seo_description"),
    hasCanonicalSlug: canonicalSlug != null ? Boolean(canonicalSlug.trim()) : null,
    duplicateGroupId: record.duplicateGroup.length ? [...record.duplicateGroup].sort().join("|") : null,
    duplicateReason: record.duplicateContent ? "duplicate_slug_title_signature" : null,
    publishReadiness: userPublishReadiness(record),
    blockReason: record.publishReadiness === "blocked" ? record.reasons.join("; ") : null,
    recommendedAction: recommendedActionFor(record),
    reasons: record.reasons,
    contentPreview,
  };
}

function buildSummaryBuckets(records: InventoryRecord[]) {
  const fileTypes = new Set([
    "manifest_import_ready",
    "newgrad_batch_file",
    "regional_sample_posts",
    "planned_manifest",
    "long_form_topic_ts",
    "long_form_post_ts",
    "long_form_post_ts_chunk2",
    "long_form_topic_ts_chunk2",
    "multilingual_bundle_json",
    "snapshot_manifest_import_ready",
    "snapshot_newgrad_batch_file",
    "snapshot_multilingual_bundle_json",
    "static_fallback_ts",
  ]);
  return {
    totalDiscovered: records.length,
    alreadyLive: records.filter((r) => r.publicReachable && r.status === "published").length,
    hiddenButRecoverable: records.filter((r) => r.publishReadiness === "recoverable").length,
    blocked: records.filter((r) => r.publishReadiness === "blocked").length,
    duplicates: records.filter((r) => r.duplicateContent).length,
    fileOrBackupOnly: records.filter((r) => fileTypes.has(r.sourceType)).length,
    dbOnlyNotPublic: records.filter((r) => r.sourceType.startsWith("db_") && !r.publicReachable).length,
    readyToPublish: records.filter((r) => r.publishReadiness === "ready_to_publish").length,
    needsReview: records.filter((r) => r.publishReadiness === "needs_review").length,
  };
}

function buildCohorts(records: InventoryRecord[]) {
  const compact = (record: InventoryRecord) => ({
    id: record.id,
    title: record.title,
    slug: record.slug,
    sourceType: record.sourceType,
    sourceLocation: record.sourceLocation,
    expectedPublicUrl: record.expectedPublicUrl,
    reasons: record.reasons,
    duplicateGroup: record.duplicateGroup,
  });
  return {
    readyToPublish: records.filter((record) => record.publishReadiness === "ready_to_publish").slice(0, 100).map(compact),
    recoverable: records.filter((record) => record.publishReadiness === "recoverable").slice(0, 100).map(compact),
    blocked: records.filter((record) => record.publishReadiness === "blocked").slice(0, 100).map(compact),
    duplicates: records.filter((record) => record.duplicateContent).slice(0, 100).map(compact),
  };
}

function toMarkdown(output: InventoryOutput): string {
  const lines: string[] = [];
  lines.push("# Blog Hidden Content Audit", "");
  lines.push(`Generated: ${output.generatedAt}`, "");
  lines.push("## Scope", "");
  lines.push(`- Repo root: \`${output.repoRoot}\``);
  lines.push(`- App root: \`${output.appRoot}\``);
  lines.push("- Search coverage:");
  for (const item of output.searchCoverage) lines.push(`  - \`${item}\``);
  lines.push(`- DATABASE_URL configured: \`${String(output.database.urlConfigured)}\``);
  lines.push(`- Database queried successfully: \`${String(output.database.querySucceeded)}\``);
  if (output.database.error) {
    lines.push(`- Database error: \`${output.database.error}\``);
  }
  lines.push("");
  lines.push("## Source Of Truth", "");
  lines.push("- Admin canonical writes:");
  for (const item of output.sourceOfTruth.adminCanonicalWrites) lines.push(`  - ${item}`);
  lines.push("- Generator writes:");
  for (const item of output.sourceOfTruth.generatorWrites) lines.push(`  - ${item}`);
  lines.push("- Public canonical reads:");
  for (const item of output.sourceOfTruth.publicCanonicalReads) lines.push(`  - ${item}`);
  lines.push("- Public localized reads:");
  for (const item of output.sourceOfTruth.publicLocalizedReads) lines.push(`  - ${item}`);
  lines.push("- Blog index reads:");
  for (const item of output.sourceOfTruth.blogIndexReads) lines.push(`  - ${item}`);
  lines.push("- Tag/category reads:");
  for (const item of output.sourceOfTruth.tagPageReads) lines.push(`  - ${item}`);
  lines.push("- Sitemap reads:");
  for (const item of output.sourceOfTruth.sitemapReads) lines.push(`  - ${item}`);
  lines.push("- RSS/feed reads:");
  for (const item of output.sourceOfTruth.rssReads) lines.push(`  - ${item}`);
  lines.push("- Mismatches:");
  for (const item of output.sourceOfTruth.mismatchFindings) lines.push(`  - ${item}`);
  lines.push("");
  lines.push("## Summary", "");
  lines.push(`- Total inventory records: **${output.summary.totalRecords}**`);
  lines.push(`- Hidden or orphaned: **${output.summary.hiddenOrOrphaned}**`);
  lines.push(`- Ready to publish: **${output.summary.readyToPublish}**`);
  lines.push(`- Recoverable after review/import: **${output.summary.recoverable}**`);
  lines.push(`- Need review: **${output.summary.needsReview}**`);
  lines.push(`- Blocked: **${output.summary.blocked}**`);
  lines.push(`- Duplicate signatures: **${output.summary.duplicates}**`);
  lines.push("");
  lines.push("## Summary buckets (recovery triage)", "");
  lines.push(`- Total discovered: **${output.summaryBuckets.totalDiscovered}**`);
  lines.push(`- Already live (reachable + published): **${output.summaryBuckets.alreadyLive}**`);
  lines.push(`- Hidden but recoverable (pipeline): **${output.summaryBuckets.hiddenButRecoverable}**`);
  lines.push(`- Blocked: **${output.summaryBuckets.blocked}**`);
  lines.push(`- Duplicates: **${output.summaryBuckets.duplicates}**`);
  lines.push(`- File / backup / manifest only: **${output.summaryBuckets.fileOrBackupOnly}**`);
  lines.push(`- DB-only, not public: **${output.summaryBuckets.dbOnlyNotPublic}**`);
  lines.push(`- Ready to publish (canonical gate): **${output.summaryBuckets.readyToPublish}**`);
  lines.push(`- Needs review: **${output.summaryBuckets.needsReview}**`);
  lines.push("");
  lines.push("## Highest-Signal Findings", "");
  lines.push("- `BlogPost` is the canonical source for `/blog`, scoped nursing/allied blog hubs, and the main blog sitemap.");
  lines.push("- `LocalizedBlogArticle` powers locale-aware regional blog routes, but current sitemap wiring appears canonical-only; localized live rows are not clearly included in the main sitemap.");
  lines.push("- `ContentItem` blog/article-like rows would be orphaned from the live public blog because public routes do not read `ContentItem`.");
  lines.push("- `data/blog-manifest/batch-01/batch-01-import-ready.json` contains full-body draft posts with strong publish potential but they are not live until imported to `BlogPost`.");
  lines.push("- `data/blog-content/newgrad-prod-batch-*` contains indexed posts plus HTML bodies on disk; these are recoverable but not public.");
  lines.push(
    "- `src/lib/seo/long-form-seo-blog-posts.ts` plus `long-form-seo-blog-posts-chunk2.ts` embed additional full posts + topic rows (same materialization gap: not live until imported to `BlogPost` / `LocalizedBlogArticle`).",
  );
  lines.push("- Static fallback posts exist in `src/content/blog-static-posts.ts`, but live detail pages still resolve from DB-backed `BlogPost` rows when the database is available.");
  lines.push("");
  lines.push("## Safest Publish Path", "");
  lines.push("1. Recover DB-backed hidden canonical posts first using the existing canonical publish path (`BlogPost` only), because those rows already match the live route and sitemap contract.");
  lines.push("2. For repo-resident full-body content (`batch-01`, `newgrad-prod-batch-*`, selected long-form posts), import into `BlogPost` through existing import/materialization scripts instead of wiring public routes directly to disk files.");
  lines.push("3. Do not publish `ContentItem` blog rows, sample manifests, or metadata-only manifests directly. They need explicit mapping or full-body generation/import first.");
  lines.push("4. Treat localized bundle content and localized DB rows as a second phase: confirm route mapping and sitemap expectations before publishing, because the main sitemap currently looks canonical-only.");
  lines.push("");
  lines.push("## Nearby Checkouts", "");
  for (const nearby of output.nearbyCheckouts) {
    lines.push(`- \`${nearby.path}\`: ${nearby.exists ? "present" : "not present"}`);
  }
  lines.push("");
  lines.push("## Output Files", "");
  lines.push(`- Inventory JSON: \`${path.relative(output.repoRoot, reportJsonPath)}\``);
  lines.push(`- Audit report: \`${path.relative(output.repoRoot, reportMarkdownPath)}\``);
  lines.push("");
  return lines.join("\n");
}

async function main(): Promise<void> {
  const { apply, requireDatabase } = parseArgs(process.argv.slice(2));
  if (apply) {
    throw new Error("Apply mode intentionally disabled until recovery plan is reviewed.");
  }
  const envLoad = await loadBlogAuditEnv({ appRoot, repoRoot });
  if (requireDatabase && !envLoad.databaseUrlSet) {
    console.error("[blog-audit-hidden] --require-database was passed but DATABASE_URL is still missing after env load.");
    process.exit(1);
  }

  const records: InventoryRecord[] = [];
  const sources: SourceSummary[] = [];

  const topLevelNursenestDirs = await listDirsContaining("/root", "nursenest");
  const corruptDirs = await listMatchingDirs("/root", "nursenest-core-corrupt-");
  const nearbyCheckouts = [...new Set([...topLevelNursenestDirs, ...corruptDirs])]
    .filter((targetPath) => path.resolve(targetPath) !== repoRoot)
    .sort();

  await loadFileBasedSources(records, sources);
  for (const snapshotRoot of nearbyCheckouts) {
    await loadSnapshotJsonSources(snapshotRoot, path.basename(snapshotRoot), records, sources);
  }

  const databaseUrlConfigured = envLoad.databaseUrlSet;
  let dbStatus = { queried: false, querySucceeded: false, error: null as string | null };
  if (databaseUrlConfigured) {
    const prisma = new PrismaClient();
    dbStatus = await loadDatabaseSources(prisma, records);
    await prisma.$disconnect().catch(() => undefined);
  }

  attachDuplicateMetadata(records);

  records.sort((a, b) => a.slug.localeCompare(b.slug) || a.title.localeCompare(b.title));

  const summaryBuckets = buildSummaryBuckets(records);
  const inventorySpec = records.map(buildAuditSpecRecord);

  const output: InventoryOutput = {
    generatedAt: new Date().toISOString(),
    applyRequested: false,
    repoRoot,
    appRoot,
    searchCoverage: [
      "/root/nursenest-core",
      "/root/nursenest-core/nursenest-core",
      "data/",
      "scripts/",
      "script/",
      "server/",
      "shared/",
      "reports/",
      ".claude/",
      ".cursor/",
      "backup-system/",
      "migrations/",
      "prisma/",
      "generated/",
      "public/",
      "src/",
      "app/",
      "content/",
      "/root/*nursenest*",
    ],
    database: {
      urlConfigured: databaseUrlConfigured,
      queried: dbStatus.queried,
      querySucceeded: dbStatus.querySucceeded,
      error: dbStatus.error,
    },
    nearbyCheckouts: await Promise.all(
      nearbyCheckouts.map(async (targetPath) => ({
        path: targetPath,
        exists: await exists(targetPath),
      })),
    ),
    sourceSummaries: sources,
    sourceOfTruth: {
      adminCanonicalWrites: [
        "src/app/api/admin/blog/route.ts -> prisma.blogPost.create/findMany",
        "src/app/api/admin/blog/[id]/route.ts -> prisma.blogPost.update/delete via canonical publish helper",
        "src/app/api/admin/blog/control-panel/persist-draft/route.ts -> persistControlPanelDraft -> BlogPost",
        "src/app/api/admin/blog/localized/*.ts -> prisma.localizedBlogArticle writes",
      ],
      generatorWrites: [
        "src/lib/blog/blog-control-panel-generation.ts -> BlogPost drafts + canonical publish helper",
        "src/lib/blog/blog-article-generation-job.ts -> BlogArticleGenerationJob snapshots and linked BlogPost rows",
        "src/app/api/admin/blog/campaigns/[id]/run-chunk/route.ts -> prisma.blogPost.create via campaign items",
        "src/app/api/blog/import/route.ts -> BlogPost import path",
      ],
      publicCanonicalReads: [
        "src/app/(marketing)/(default)/blog/page.tsx -> getPublishedBlogPostsPage",
        "src/app/(marketing)/(default)/blog/[slug]/page.tsx -> getPublishedBlogPostBySlug",
        "src/app/(marketing)/(default)/nursing/[careerSlug]/blog/* -> getPublishedBlogPostsPage / getPublishedBlogPostBySlug",
        "src/app/(marketing)/(default)/allied-health/[slug]/blog/* -> getPublishedBlogPostsPage / getPublishedBlogPostBySlug",
      ],
      publicLocalizedReads: [
        "src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/page.tsx -> getPublishedLocalizedBlogPostsPage",
        "src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]/page.tsx -> getPublishedLocalizedBlogBySlug",
      ],
      blogIndexReads: [
        "src/app/(marketing)/(default)/blog/page.tsx -> getPublishedBlogPostsPage",
        "src/app/(marketing)/(default)/nursing/[careerSlug]/blog/page.tsx -> getPublishedBlogPostsPage",
        "src/app/(marketing)/(default)/allied-health/[slug]/blog/page.tsx -> getPublishedBlogPostsPage",
      ],
      tagPageReads: [
        "src/app/(marketing)/(default)/blog/tag/[tag]/page.tsx -> safe-blog-queries tag filters",
        "No dedicated category route found under src/app for BlogPost.category",
      ],
      sitemapReads: [
        "src/app/sitemap.xml/route.ts -> listBlogSitemapEntriesSafe -> canonical BlogPost sitemap rows",
        "src/lib/seo/sitemap-localized-blog-xml.ts exists, but current route wiring does not clearly call it",
      ],
      rssReads: [
        "No dedicated RSS/feed route found in current app router audit",
      ],
      mismatchFindings: [
        "Canonical public blog reads BlogPost, not ContentItem.",
        "Admin and generator pipelines converge on BlogPost, but queue/snapshot models (BlogArticleGenerationJob, BlogDraftGenerationBatchItem, BlogBatchScheduleItem) are not themselves public sources.",
        "Localized public blog reads LocalizedBlogArticle, not canonical BlogPost bodies directly.",
        "Static fallback TS posts are not the live detail body source when DB-backed BlogPost rows exist.",
        "Localized sitemap generation code exists, but current sitemap route appears canonical-only.",
      ],
    },
    summary: summarize(records),
    cohorts: buildCohorts(records),
    inventory: records,
    inventorySpec,
    summaryBuckets,
  };

  await ensureDir(reportsDir);
  await fs.writeFile(reportJsonPath, JSON.stringify(output, null, 2));
  await fs.writeFile(reportMarkdownPath, toMarkdown(output));

  console.log(
    JSON.stringify(
      {
        ok: true,
        applyRequested: false,
        reportMarkdownPath,
        reportJsonPath,
        summary: output.summary,
        cohorts: {
          readyToPublish: output.cohorts.readyToPublish.length,
          recoverable: output.cohorts.recoverable.length,
          blocked: output.cohorts.blocked.length,
          duplicates: output.cohorts.duplicates.length,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
