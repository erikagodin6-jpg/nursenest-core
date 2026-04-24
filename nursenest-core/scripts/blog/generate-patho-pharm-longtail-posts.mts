#!/usr/bin/env npx tsx
/**
 * Production-safe long-tail RN pathophysiology / pharmacology blog pipeline (500-topic catalog).
 *
 * - **Dry-run by default.** Writes only when **`APPLY_BLOG_GENERATION=1`** (requires `DATABASE_URL`).
 * - **`TARGET_COUNT`** (default 500), **`BATCH_SIZE`** (default 50).
 * - **`BLOG_GENERATION_OVERWRITE=1`**: update existing rows only when `legacySource` matches this generator.
 *
 *   DOTENV_CONFIG_PATH=.env.local npm run blog:generate-patho-pharm-longtail
 *   APPLY_BLOG_GENERATION=1 BATCH_SIZE=50 TARGET_COUNT=50 DOTENV_CONFIG_PATH=.env.local npm run blog:generate-patho-pharm-longtail
 */
import "../../src/lib/db/script-env-bootstrap";
import {
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
  BlogWorkflowStatus,
  Prisma,
  PrismaClient,
} from "@prisma/client";

import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import { sqlBlogLiveWhere, sqlPathoPharmLongTail, sqlPathoPharmTopical } from "../../src/lib/blog/blog-patho-pharm-detection";
import {
  buildArticleHtml,
  buildConservativeApaReferences,
  buildSchemaJsonLd,
  slugify,
  validatePostContent,
} from "./lib/patho-pharm-longtail-content";
import { buildLongTailTopicCatalog } from "./lib/patho-pharm-longtail-topic-catalog";

const prisma = new PrismaClient();

const LEGACY_SOURCE = "patho-pharm-longtail-regeneration";

type PathoCounts = {
  visible_public_total: number;
  patho_pharm_topical: number;
  patho_pharm_long_tail: number;
};

async function readPathoCounts(now: Date): Promise<PathoCounts> {
  const live = sqlBlogLiveWhere("p", "$1");
  const topical = sqlPathoPharmTopical("p");
  const lt = sqlPathoPharmLongTail("p");
  const rows = await prisma.$queryRawUnsafe<
    Array<{
      visible_public_total: number;
      patho_pharm_topical: number;
      patho_pharm_long_tail: number;
    }>
  >(
    `SELECT
      (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${live}) AS visible_public_total,
      (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${live} AND ${topical}) AS patho_pharm_topical,
      (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${live} AND ${topical} AND ${lt}) AS patho_pharm_long_tail`,
    now,
  );
  return rows[0] ?? { visible_public_total: 0, patho_pharm_topical: 0, patho_pharm_long_tail: 0 };
}

function siteBase(): string {
  const raw =
    process.env.NN_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (!raw) return "https://www.nursenest.com";
  if (raw.startsWith("http")) return raw.replace(/\/$/, "");
  return `https://${raw}`.replace(/\/$/, "");
}

type LinkRow = { slug: string; title: string };

function scoreInternalLinks(topicTitle: string, pool: LinkRow[], excludeSlug: string, take: number): LinkRow[] {
  const stop = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "for",
    "with",
    "from",
    "that",
    "this",
    "does",
    "why",
    "how",
    "what",
    "when",
    "nursing",
    "nurses",
  ]);
  const tokens = topicTitle
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3 && !stop.has(w));
  return pool
    .filter((p) => p.slug !== excludeSlug)
    .map((p) => {
      const tl = p.title.toLowerCase();
      const score = tokens.reduce((acc, t) => acc + (tl.includes(t) ? 1 : 0), 0);
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, take)
    .map(({ slug, title }) => ({ slug, title }));
}

async function main(): Promise<void> {
  const apply = process.env.APPLY_BLOG_GENERATION?.trim() === "1";
  const overwrite = process.env.BLOG_GENERATION_OVERWRITE?.trim() === "1";
  const targetCount = Math.min(5000, Math.max(1, parseInt(process.env.TARGET_COUNT?.trim() ?? "500", 10) || 500));
  const batchSize = Math.min(200, Math.max(1, parseInt(process.env.BATCH_SIZE?.trim() ?? "50", 10) || 50));

  if (apply && !process.env.DATABASE_URL?.trim()) {
    console.error("[generate-patho-pharm-longtail-posts] Refusing write: DATABASE_URL is not set.");
    process.exit(1);
  }

  const now = new Date();
  const accessDate = now.toISOString().slice(0, 10);
  const base = siteBase();

  const visiblePublicCountBefore = await prisma.blogPost.count({ where: blogLiveWhere(now) });
  const pathoPharmCountsBefore = await readPathoCounts(now);

  const topics = buildLongTailTopicCatalog(targetCount);
  const linkPool = await prisma.blogPost.findMany({
    where: blogLiveWhere(now),
    select: { slug: true, title: true },
    take: 400,
    orderBy: { updatedAt: "desc" },
  });

  let createdTotal = 0;
  let skippedTotal = 0;
  let rejectedTotal = 0;
  let plannedTotal = 0;
  let internalLinksInsufficientTotal = 0;
  const rejectionReasons: Record<string, number> = {};
  const bump = (k: string) => {
    rejectionReasons[k] = (rejectionReasons[k] ?? 0) + 1;
  };
  const allCreatedSlugs: string[] = [];
  let aborted = false;
  let abortReason: string | null = null;

  for (let offset = 0; offset < topics.length; offset += batchSize) {
    const slice = topics.slice(offset, offset + batchSize);
    let batchCreated = 0;
    let batchSkipped = 0;
    let batchRejected = 0;
    let batchPlanned = 0;
    let batchQualityRejected = 0;
    let batchInsufficientLinks = 0;
    const batchSlugs: string[] = [];

    for (const topic of slice) {
      let slug = slugify(topic.title);
      const category = topic.pharm ? "Pharmacology" : "Pathophysiology";
      const template = topic.pharm ? BlogPostTemplate.MEDICATION_REVIEW : BlogPostTemplate.DISEASE_PROCESS_EXPLAINER;
      const tags = Array.from(
        new Set([
          "nursing",
          "NCLEX",
          "RN",
          topic.pharm ? "pharmacology" : "pathophysiology",
          topic.bodySystem.toLowerCase().replace(/\s+/g, "-"),
          topic.conditionOrDrug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "clinical-focus",
        ]),
      );

      const ranked = scoreInternalLinks(topic.title, linkPool, slug, 6);
      const internal = ranked.slice(0, 3);
      const minLinksRequired = Math.min(3, linkPool.filter((p) => p.slug !== slug).length);
      if (internal.length < 3) batchInsufficientLinks += 1;

      const body = buildArticleHtml(topic, internal, accessDate);
      const v = validatePostContent(body, topic.title, minLinksRequired);
      if (v) {
        bump(v);
        batchRejected += 1;
        batchQualityRejected += 1;
        rejectedTotal += 1;
        continue;
      }

      const bySlug = await prisma.blogPost.findUnique({
        where: { slug },
        select: { legacySource: true },
      });
      if (bySlug && !overwrite) {
        batchSkipped += 1;
        skippedTotal += 1;
        continue;
      }
      if (bySlug && overwrite && bySlug.legacySource !== LEGACY_SOURCE) {
        bump("slug_collision_non_generation_post");
        batchRejected += 1;
        rejectedTotal += 1;
        continue;
      }

      const titleDup = await prisma.blogPost.findFirst({
        where: { title: { equals: topic.title, mode: "insensitive" } },
        select: { slug: true },
      });
      if (titleDup && titleDup.slug !== slug) {
        bump("duplicate_title_different_slug");
        batchRejected += 1;
        rejectedTotal += 1;
        continue;
      }

      batchPlanned += 1;
      plannedTotal += 1;

      const excerpt = `${topic.title} — Mechanism-focused RN review with assessment cues, interventions, teaching, escalation guidance, NCLEX reasoning, FAQ, and conservative reference entries for exam preparation.`.slice(
        0,
        480,
      );
      const faqItems = [
        {
          q: "What should I prioritize first in an unstable presentation?",
          a: "Protect airway, breathing, and circulation, then treat the underlying mechanism while trending focused reassessments.",
        },
        {
          q: "How do I avoid choosing a true-but-not-best NCLEX answer?",
          a: "Pick the option that addresses the primary mechanism and highest-risk harm described in the stem.",
        },
        {
          q: "Is this article individualized medical advice?",
          a: "No—this article is for nursing education and exam preparation, not personal medical advice.",
        },
      ];
      const schemaJson = buildSchemaJsonLd({
        title: topic.title,
        slug,
        excerpt,
        siteBase: base,
        publishedIso: now.toISOString(),
        faqItems,
      });
      const schemaSummary = JSON.stringify(schemaJson);
      const apaReferences = buildConservativeApaReferences(accessDate);

      const publishAt = new Date();
      const data: Prisma.BlogPostCreateInput = {
        slug,
        title: topic.title,
        excerpt,
        body,
        category,
        postTemplate: template,
        tags,
        postStatus: BlogPostStatus.PUBLISHED,
        publishAt,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
        legacySource: LEGACY_SOURCE,
        seoTitle: topic.title.slice(0, 120),
        seoDescription: excerpt.slice(0, 300),
        intent: BlogPostIntent.INFORMATIONAL,
        faqBlock: { items: faqItems } as Prisma.InputJsonValue,
        schemaSummary,
        apaReferences,
        exam: "RN",
        locale: "en",
      };

      if (!apply) {
        batchCreated += 1;
        createdTotal += 1;
        batchSlugs.push(slug);
        allCreatedSlugs.push(slug);
        continue;
      }

      try {
        if (bySlug && overwrite) {
          await prisma.blogPost.update({
            where: { slug },
            data: data as Prisma.BlogPostUpdateInput,
          });
        } else {
          await prisma.blogPost.create({ data });
        }
        batchCreated += 1;
        createdTotal += 1;
        batchSlugs.push(slug);
        allCreatedSlugs.push(slug);
        if (!linkPool.some((p) => p.slug === slug)) {
          linkPool.unshift({ slug, title: topic.title });
        }
      } catch {
        bump("db_insert_failed");
        batchRejected += 1;
        rejectedTotal += 1;
        aborted = true;
        abortReason = "db_insert_failed";
        break;
      }
    }

    internalLinksInsufficientTotal += batchInsufficientLinks;

    if (!aborted && slice.length > 0 && batchQualityRejected / slice.length > 0.25) {
      aborted = true;
      abortReason = "batch_quality_rejection_rate_exceeded_25_percent";
    }

    const visibleMid = await prisma.blogPost.count({ where: blogLiveWhere(now) });
    const pathoMid = await readPathoCounts(now);

    console.log(
      JSON.stringify(
        {
          dryRun: !apply,
          batchIndex: offset / batchSize,
          batchOffset: offset,
          targetCount,
          batchSize: slice.length,
          plannedCount: batchPlanned,
          createdCount: batchCreated,
          skippedExisting: batchSkipped,
          rejectedCount: batchRejected,
          rejectionReasons: Object.fromEntries(
            Object.entries(rejectionReasons).filter(([, v]) => v > 0),
          ),
          internalLinksInsufficientCount: batchInsufficientLinks,
          createdSlugs: batchSlugs,
          visiblePublicCountBefore: visiblePublicCountBefore,
          visiblePublicCountAfterBatch: visibleMid,
          pathoPharmCountsBefore: pathoPharmCountsBefore,
          pathoPharmCountsAfterBatch: pathoMid,
          aborted,
          abortReason,
        },
        null,
        2,
      ),
    );

    if (aborted) break;
  }

  const visiblePublicCountAfter = await prisma.blogPost.count({ where: blogLiveWhere(now) });
  const pathoPharmCountsAfter = await readPathoCounts(now);

  console.log(
    JSON.stringify(
      {
        phase: "final_summary",
        dryRun: !apply,
        targetCount,
        batchSize,
        plannedCount: plannedTotal,
        createdCount: createdTotal,
        skippedExisting: skippedTotal,
        rejectedCount: rejectedTotal,
        rejectionReasons,
        internalLinksInsufficientCount: internalLinksInsufficientTotal,
        createdSlugs: allCreatedSlugs.slice(-200),
        visiblePublicCountBefore,
        visiblePublicCountAfter,
        pathoPharmCountsBefore: pathoPharmCountsBefore,
        pathoPharmCountsAfter,
        aborted,
        abortReason,
        canonicalNote: "Public path for each post is /blog/{slug}; absolute URL in schemaSummary uses NN_PUBLIC_SITE_URL, NEXT_PUBLIC_APP_URL, VERCEL_URL, or nursenest.com default.",
      },
      null,
      2,
    ),
  );

  if (aborted) process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
