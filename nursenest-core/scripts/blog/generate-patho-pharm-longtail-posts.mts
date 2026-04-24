#!/usr/bin/env npx tsx
/**
 * Production-safe long-tail pathophysiology / pharmacology blog generator.
 *
 * Defaults: dry-run (no DB writes). Set APPLY_BLOG_GENERATION=1 to insert.
 * BATCH_SIZE (default 50), TARGET_COUNT (default 500).
 *
 *   DOTENV_CONFIG_PATH=.env.local npm run blog:generate-patho-pharm-longtail
 *   APPLY_BLOG_GENERATION=1 BATCH_SIZE=50 TARGET_COUNT=50 DOTENV_CONFIG_PATH=.env.local npm run blog:generate-patho-pharm-longtail
 */
import "../../src/lib/db/script-env-bootstrap";

import { BlogPostStatus, BlogWorkflowStatus, Prisma } from "@prisma/client";

import { validateClinicalTopicCoherence } from "../../src/lib/blog/patho-pharm-longtail-topic-coherence";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import {
  sqlBlogLiveWhere,
  sqlPathoPharmLongTail,
  sqlPathoPharmTopical,
} from "../../src/lib/blog/blog-patho-pharm-detection";
import { assertPublicBlogSeedRenderable } from "../../src/lib/content/assert-public-renderable";
import { ensurePublicBlogPostVisibilityForSeed } from "../../src/lib/content/ensure-public-visibility";
import { prisma } from "../lib/prisma-script-client";
import {
  PATHO_PHARM_LONGTAIL_LEGACY_SOURCE,
  buildApaReferences,
  buildFaq,
  buildLongTailBody,
  buildSchemaSummaryJson,
  clampMetaDescription,
  clampMetaTitle,
  enumerateLongTailTopics,
  excerptFromHtml,
  normalizedTitleHash,
  resolveSiteOrigin,
  tagsForTopic,
  validateGeneratedBody,
  type LongTailTopicSpec,
} from "./lib/patho-pharm-longtail-post-builder";

type PublishedSlugRow = { slug: string; title: string };

function envInt(name: string, fallback: number): number {
  const v = process.env[name]?.trim();
  if (!v) return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function tokenize(s: string): Set<string> {
  const out = new Set<string>();
  for (const raw of s.toLowerCase().split(/[^a-z0-9]+/)) {
    if (raw.length >= 4) out.add(raw);
  }
  return out;
}

function scoreInternalLink(topic: LongTailTopicSpec, row: PublishedSlugRow): number {
  if (row.slug === topic.slug) return -1;
  const tt = tokenize(`${topic.title} ${topic.slug} ${topic.targetKeyword}`);
  const rt = tokenize(`${row.title} ${row.slug}`);
  let n = 0;
  for (const x of tt) {
    if (rt.has(x)) n += 1;
  }
  return n;
}

function pickInternalLinks(topic: LongTailTopicSpec, pool: PublishedSlugRow[], need: number): {
  html: string;
  slugs: string[];
  insufficient: boolean;
} {
  const scored = pool
    .map((r) => ({ r, s: scoreInternalLink(topic, r) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => b.s - a.s);
  const picked: PublishedSlugRow[] = [];
  const seen = new Set<string>();
  for (const { r } of scored) {
    if (picked.length >= need) break;
    if (seen.has(r.slug)) continue;
    seen.add(r.slug);
    picked.push(r);
  }
  const want = Math.min(need, pool.length);
  while (picked.length < want && picked.length < pool.length) {
    const next = pool.find((r) => !seen.has(r.slug));
    if (!next) break;
    seen.add(next.slug);
    picked.push(next);
  }
  const slugs = picked.map((p) => p.slug);
  const html = picked
    .map((p) => {
      const label = p.title.length > 72 ? `${p.title.slice(0, 69)}…` : p.title;
      return `<a href="/blog/${p.slug}">${label.replace(/</g, "&lt;")}</a>`;
    })
    .join(", ");
  return { html, slugs, insufficient: slugs.length < need };
}

async function pathoCounts(now: Date): Promise<{
  visible_public_total: number;
  patho_pharm_topical: number;
  patho_pharm_long_tail: number;
}> {
  const liveSql = sqlBlogLiveWhere("p", "$1");
  const pathoSql = sqlPathoPharmTopical("p");
  const longSql = sqlPathoPharmLongTail("p");
  const q = `
SELECT
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql}) AS visible_public_total,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoSql}) AS patho_pharm_topical,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoSql} AND ${longSql}) AS patho_pharm_long_tail
`;
  const rows = await prisma.$queryRawUnsafe<
    Array<{ visible_public_total: number; patho_pharm_topical: number; patho_pharm_long_tail: number }>
  >(q, now);
  return rows[0] ?? { visible_public_total: 0, patho_pharm_topical: 0, patho_pharm_long_tail: 0 };
}

async function loadPublishedSlugPool(now: Date, take: number): Promise<PublishedSlugRow[]> {
  return prisma.blogPost.findMany({
    where: blogLiveWhere(now),
    select: { slug: true, title: true },
    take,
    orderBy: { updatedAt: "desc" },
  });
}

async function loadExistingTitleHashesForPipeline(): Promise<Set<string>> {
  const rows = await prisma.blogPost.findMany({
    where: { legacySource: PATHO_PHARM_LONGTAIL_LEGACY_SOURCE },
    select: { title: true },
    take: 50_000,
  });
  const s = new Set<string>();
  for (const r of rows) s.add(normalizedTitleHash(r.title));
  return s;
}

/** Same listing gate as public `/blog` index (live rows only). */
async function countLiveBySlugs(now: Date, slugs: string[]): Promise<number> {
  if (slugs.length === 0) return 0;
  return prisma.blogPost.count({
    where: {
      AND: [blogLiveWhere(now), { slug: { in: slugs } }],
    },
  });
}

async function main(): Promise<void> {
  const dryRun = process.env.APPLY_BLOG_GENERATION?.trim() !== "1";
  const batchSize = envInt("BATCH_SIZE", 50);
  const targetCount = envInt("TARGET_COUNT", 500);
  const overwrite = process.env.BLOG_GENERATION_OVERWRITE?.trim() === "1";
  const now = new Date();
  const accessDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!dryRun && !process.env.DATABASE_URL?.trim()) {
    console.error("[patho-pharm-longtail] Refusing write mode: DATABASE_URL is not set.");
    process.exit(1);
  }

  const topics = enumerateLongTailTopics(targetCount);
  const plannedCount = topics.length;

  let visiblePublicCountBefore = 0;
  let pathoPharmCountsBefore = { patho_pharm_topical: 0, patho_pharm_long_tail: 0, visible_public_total: 0 };
  const existingTitleHashes = new Set<string>();
  if (process.env.DATABASE_URL?.trim()) {
    pathoPharmCountsBefore = await pathoCounts(now);
    visiblePublicCountBefore = pathoPharmCountsBefore.visible_public_total;
    if (!dryRun) {
      const h = await loadExistingTitleHashesForPipeline();
      for (const x of h) existingTitleHashes.add(x);
    }
  }

  const globalCreatedSlugs: string[] = [];
  let globalCreated = 0;
  let globalSkipped = 0;
  let globalRejected = 0;
  let globalClinicalRejected = 0;
  const rejectionReasons: Record<string, number> = {};
  const clinicalRejectionReasons: Record<string, number> = {};
  const sampleRejectedTopics: string[] = [];
  const sampleApprovedTopics: string[] = [];
  let globalInternalLinksInsufficient = 0;

  const bumpReason = (rs: string[]) => {
    for (const r of rs) {
      rejectionReasons[r] = (rejectionReasons[r] ?? 0) + 1;
    }
  };

  for (let offset = 0; offset < topics.length; offset += batchSize) {
    const batch = topics.slice(offset, offset + batchSize);
    const pool = process.env.DATABASE_URL?.trim()
      ? await loadPublishedSlugPool(now, 4000)
      : [];

    const pathoPharmBatchBefore = process.env.DATABASE_URL?.trim() ? await pathoCounts(now) : null;

    const batchSampleRejected: string[] = [];
    const batchSampleApproved: string[] = [];

    let createdCount = 0;
    let skippedExisting = 0;
    let rejectedCount = 0;
    let batchClinicalRejected = 0;
    let internalLinksInsufficientCount = 0;
    const createdSlugs: string[] = [];
    const batchRejectionReasons: string[] = [];

    let attemptedNew = 0;

    const slugList = batch.map((t) => t.slug);
    const existingSlugSet = new Set<string>();
    if (!dryRun && process.env.DATABASE_URL?.trim()) {
      const slugHits = await prisma.blogPost.findMany({
        where: { slug: { in: slugList } },
        select: { slug: true },
      });
      for (const r of slugHits) existingSlugSet.add(r.slug);
    }

    for (const topic of batch) {
      const slugExists = !dryRun && existingSlugSet.has(topic.slug);
      const titleHash = normalizedTitleHash(topic.title);
      const titleHashExists = !dryRun && !overwrite && existingTitleHashes.has(titleHash);

      if (!overwrite && slugExists) {
        skippedExisting += 1;
        continue;
      }
      if (!overwrite && titleHashExists) {
        skippedExisting += 1;
        continue;
      }

      const coh = validateClinicalTopicCoherence({
        title: topic.title,
        slug: topic.slug,
        topicSource: topic.topicSource,
        relationshipType: topic.relationshipType,
      });
      if (!coh.ok) {
        rejectedCount += 1;
        batchClinicalRejected += 1;
        globalClinicalRejected += 1;
        const r = `clinical_coherence:${coh.reason}`;
        batchRejectionReasons.push(r);
        bumpReason([r]);
        clinicalRejectionReasons[coh.reason] = (clinicalRejectionReasons[coh.reason] ?? 0) + 1;
        if (batchSampleRejected.length < 8) batchSampleRejected.push(topic.title);
        if (sampleRejectedTopics.length < 8) sampleRejectedTopics.push(topic.title);
        continue;
      }

      const { html: internalHtml, slugs: internalSlugs, insufficient } = pickInternalLinks(topic, pool, 3);
      if (insufficient) internalLinksInsufficientCount += 1;

      const body = buildLongTailBody(topic, internalHtml);
      const v = validateGeneratedBody(body, topic.title);
      if (!v.ok) {
        rejectedCount += 1;
        batchRejectionReasons.push(...v.reasons);
        bumpReason(v.reasons);
        continue;
      }

      const minLinksRequired = Math.min(3, pool.length);
      const linkCount = (body.match(/href="\/blog\//g) ?? []).length;
      if (linkCount < minLinksRequired) {
        rejectedCount += 1;
        const r = "internal_link_count_insufficient_for_corpus";
        batchRejectionReasons.push(r);
        bumpReason([r]);
        continue;
      }

      attemptedNew += 1;

      const excerpt = excerptFromHtml(body, topic.title);
      const metaTitle = clampMetaTitle(topic.title, 60);
      const metaDescription = clampMetaDescription(excerpt, 155);
      const faq = buildFaq(topic);
      const apa = buildApaReferences(accessDate);
      const origin = resolveSiteOrigin();
      const publishedIso = now.toISOString();
      const schemaSummary = buildSchemaSummaryJson({
        slug: topic.slug,
        title: metaTitle,
        excerpt: metaDescription,
        publishedIso,
        faq,
        origin,
      });

      const faqBlock: Prisma.InputJsonValue = {
        items: [
          { q: faq.q1, a: faq.a1 },
          { q: faq.q2, a: faq.a2 },
          { q: faq.q3, a: faq.a3 },
        ],
      };

      const keyQuestions = [faq.q1, faq.q2, faq.q3];
      const internalLinkPlan: Prisma.InputJsonValue = { slugs: internalSlugs, kind: "patho-pharm-longtail" };

      const baseData = {
        slug: topic.slug,
        title: topic.title.slice(0, 200),
        excerpt,
        body,
        tags: tagsForTopic(topic),
        category: topic.category,
        legacySource: PATHO_PHARM_LONGTAIL_LEGACY_SOURCE,
        postTemplate: topic.postTemplate,
        careerSlug: topic.careerSlug,
        exam: topic.exam,
        locale: "en",
        seoTitle: metaTitle,
        seoDescription: metaDescription,
        targetKeyword: topic.targetKeyword.slice(0, 200),
        keywordCluster: "patho-pharm-longtail",
        keywordPlan: [topic.bodySystem, "multi-tier", "long-tail"],
        apaReferences: apa,
        requiresReferences: true,
        schemaSummary,
        faqBlock,
        keyQuestions,
        internalLinkPlan,
        sourcesJson: {
          families: ["CDC", "NIH/NIDDK", "MedlinePlus", "WHO"],
          retrieved: publishedIso,
        } as Prisma.InputJsonValue,
        postStatus: BlogPostStatus.PUBLISHED,
        publishAt: now,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
      };

      assertPublicBlogSeedRenderable({ slug: topic.slug, title: topic.title, body });
      const data = ensurePublicBlogPostVisibilityForSeed(baseData);

      if (dryRun) {
        createdCount += 1;
        createdSlugs.push(topic.slug);
        if (batchSampleApproved.length < 8) batchSampleApproved.push(topic.title);
        if (sampleApprovedTopics.length < 8) sampleApprovedTopics.push(topic.title);
        continue;
      }

      try {
        if (overwrite && slugExists) {
          await prisma.blogPost.update({
            where: { slug: topic.slug },
            data: {
              ...data,
              slug: topic.slug,
            },
          });
        } else {
          await prisma.blogPost.create({ data });
        }
        createdCount += 1;
        createdSlugs.push(topic.slug);
        existingTitleHashes.add(titleHash);
        if (batchSampleApproved.length < 8) batchSampleApproved.push(topic.title);
        if (sampleApprovedTopics.length < 8) sampleApprovedTopics.push(topic.title);
      } catch (e) {
        console.error("[patho-pharm-longtail] DB insert failed:", e);
        process.exit(1);
      }
    }

    const denom = Math.max(1, attemptedNew);
    const rejectionRate = rejectedCount / denom;
    const batchSummary = {
      dryRun,
      targetCount,
      batchSize,
      batchOffset: offset,
      plannedCount: batch.length,
      createdCount,
      skippedExisting,
      rejectedCount,
      rejectionRate: Math.round(rejectionRate * 1000) / 1000,
      rejectionReasons: summarizeReasons(batchRejectionReasons),
      clinicallyRejectedCount: batchClinicalRejected,
      clinicallyRejectedReasons: summarizeReasons(
        batchRejectionReasons.filter((x) => x.startsWith("clinical_coherence:")),
      ),
      sampleRejectedTopics: batchSampleRejected,
      sampleApprovedTopics: batchSampleApproved,
      internalLinksInsufficientCount,
      createdSlugs,
    };
    let batchVisibility: Record<string, unknown> = { skipped: dryRun || createdSlugs.length === 0 };
    if (!dryRun && createdSlugs.length > 0 && process.env.DATABASE_URL?.trim()) {
      const liveListed = await countLiveBySlugs(now, createdSlugs);
      batchVisibility = {
        liveListedCount: liveListed,
        expectedLive: createdSlugs.length,
        liveListingOk: liveListed === createdSlugs.length,
      };
      if (liveListed !== createdSlugs.length) {
        console.error("[patho-pharm-longtail] Batch visibility check failed: not all new slugs are blogLiveWhere live.");
        process.exit(1);
      }
      if (pathoPharmBatchBefore) {
        const afterBatch = await pathoCounts(now);
        const increased =
          afterBatch.visible_public_total > pathoPharmBatchBefore.visible_public_total ||
          afterBatch.patho_pharm_topical > pathoPharmBatchBefore.patho_pharm_topical ||
          afterBatch.patho_pharm_long_tail > pathoPharmBatchBefore.patho_pharm_long_tail;
        (batchVisibility as Record<string, unknown>).pathoPharmBatchBefore = pathoPharmBatchBefore;
        (batchVisibility as Record<string, unknown>).pathoPharmBatchAfter = afterBatch;
        (batchVisibility as Record<string, unknown>).pathoCountsIncreased = increased;
        if (!increased) {
          console.error(
            "[patho-pharm-longtail] Batch visibility check failed: patho/pharm or visible_public counts did not increase after inserts.",
          );
          process.exit(1);
        }
      }
    }

    console.log(JSON.stringify({ batchSummary: { ...batchSummary, batchVisibility } }));

    globalCreated += createdCount;
    globalSkipped += skippedExisting;
    globalRejected += rejectedCount;
    globalCreatedSlugs.push(...createdSlugs);
    globalInternalLinksInsufficient += internalLinksInsufficientCount;

    if (rejectionRate > 0.25 && attemptedNew > 0) {
      console.error("[patho-pharm-longtail] Stopping: batch rejection rate > 25%.");
      process.exit(1);
    }
  }

  let pathoPharmCountsAfter = pathoPharmCountsBefore;
  let visiblePublicCountAfter = visiblePublicCountBefore;
  if (process.env.DATABASE_URL?.trim()) {
    pathoPharmCountsAfter = await pathoCounts(now);
    visiblePublicCountAfter = pathoPharmCountsAfter.visible_public_total;
  }

  const finalSummary = {
    dryRun,
    targetCount,
    batchSize,
    plannedCount,
    createdCount: globalCreated,
    skippedExisting: globalSkipped,
    rejectedCount: globalRejected,
    clinicallyRejectedCount: globalClinicalRejected,
    rejectionReasons,
    clinicallyRejectedReasons: clinicalRejectionReasons,
    sampleRejectedTopics,
    sampleApprovedTopics,
    internalLinksInsufficientCount: globalInternalLinksInsufficient,
    createdSlugs: globalCreatedSlugs,
    visiblePublicBefore: visiblePublicCountBefore,
    visiblePublicAfter: visiblePublicCountAfter,
    pathoPharmBefore: pathoPharmCountsBefore,
    pathoPharmAfter: pathoPharmCountsAfter,
    visiblePublicCountBefore,
    visiblePublicCountAfter,
    pathoPharmCountsBefore,
    pathoPharmCountsAfter,
  };
  console.log(JSON.stringify({ finalSummary }));
}

function summarizeReasons(rs: string[]): Record<string, number> {
  const m: Record<string, number> = {};
  for (const r of rs) {
    m[r] = (m[r] ?? 0) + 1;
  }
  return m;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
