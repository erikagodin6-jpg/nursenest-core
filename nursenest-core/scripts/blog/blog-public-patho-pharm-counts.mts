#!/usr/bin/env npx tsx
/**
 * Read-only counts for public blog surface (same visibility as `/blog`: blogLiveWhere(now)).
 *
 * Requires DATABASE_URL (e.g. from `.env.local`).
 *
 *   npx tsx scripts/blog/blog-public-patho-pharm-counts.mts
 *
 * Definitions:
 * - **visible_public_total**: `blogLiveWhere(now)` — PUBLISHED, APPROVED, or SCHEDULED with publishAt/scheduledAt <= now.
 * - **visible_public_total_main**: live rows with no `careerSlug` (global marketing `/blog` when `BLOG_MAIN_INDEX_EXCLUDE_SCOPED_POSTS=1`).
 * - **visible_public_total_scoped_generated**: live rows with `careerSlug` set **and** `legacySource` = patho-pharm longtail generator.
 * - **patho_pharm_topical** / **long_tail**: unchanged totals; split **\_main** vs **\_scoped_generated** use the same topical/long-tail SQL heuristics.
 */
import "../../src/lib/db/script-env-bootstrap";

import { PrismaClient } from "@prisma/client";

import {
  explainMissingPathoPharmTopicalMatch,
  rowMatchesPathoPharmTopicalCriteria,
  sqlBlogLiveWhere,
  sqlPathoPharmLongTail,
  sqlPathoPharmTopical,
  textHasClinicalPathoPharmSignal,
} from "../../src/lib/blog/blog-patho-pharm-detection";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import { PATHO_PHARM_LONGTAIL_LEGACY_SOURCE } from "./lib/patho-pharm-longtail-post-builder";

const NEAR_MISS_SCAN_LIMIT = 600;
const NEAR_MISS_OUTPUT = 25;

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not set (e.g. load .env.local).");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const now = new Date();

  const liveSql = sqlBlogLiveWhere("p", "$1");
  const pathoPharmSql = sqlPathoPharmTopical("p");
  const longTailSql = sqlPathoPharmLongTail("p");
  const mainCareerSql = `(p."careerSlug" IS NULL OR trim(p."careerSlug") = '')`;
  const scopedGeneratedSql = `(p."careerSlug" IS NOT NULL AND trim(p."careerSlug") <> '' AND p."legacySource" = $2)`;

  const q = `
SELECT
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql}) AS visible_public_total,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${mainCareerSql}) AS visible_public_total_main,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${scopedGeneratedSql}) AS visible_public_total_scoped_generated,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoPharmSql}) AS patho_pharm_topical,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoPharmSql} AND ${mainCareerSql}) AS patho_pharm_topical_main,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoPharmSql} AND ${scopedGeneratedSql}) AS patho_pharm_topical_scoped_generated,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoPharmSql} AND ${longTailSql}) AS patho_pharm_long_tail,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoPharmSql} AND ${longTailSql} AND ${mainCareerSql}) AS patho_pharm_long_tail_main,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoPharmSql} AND ${longTailSql} AND ${scopedGeneratedSql}) AS patho_pharm_long_tail_scoped_generated
`;

  try {
    const rows = await prisma.$queryRawUnsafe<
      Array<{
        visible_public_total: number;
        visible_public_total_main: number;
        visible_public_total_scoped_generated: number;
        patho_pharm_topical: number;
        patho_pharm_topical_main: number;
        patho_pharm_topical_scoped_generated: number;
        patho_pharm_long_tail: number;
        patho_pharm_long_tail_main: number;
        patho_pharm_long_tail_scoped_generated: number;
      }>
    >(q, now, PATHO_PHARM_LONGTAIL_LEGACY_SOURCE);

    const counts = rows[0] ?? null;

    const diagnosticWhyTopicalZero =
      counts?.patho_pharm_topical === 0
        ? [
            "patho_pharm_topical counts only rows that pass BOTH (1) public live visibility blogLiveWhere(now) AND (2) strict topical SQL:",
            "  - postTemplate IN (MEDICATION_REVIEW, DISEASE_PROCESS_EXPLAINER, LAB_VALUES_GUIDE), OR",
            "  - category ILIKE '%pharm%' OR '%patho%', OR",
            "  - title ILIKE '%pharmacology%' OR '%pathophys%' OR '%medication%', OR",
            "  - tags[] contains a token matching the embedded regex in this script.",
            "If visible_public_total > 0 but patho_pharm_topical = 0, visible posts likely use generic templates (e.g. TOPIC_EXPLAINED) and titles/categories/tags without those substrings.",
            "Previously this script omitted APPROVED from live SQL, understating visible_public_total vs /blog — fixed to match src/lib/blog/blog-visibility.ts blogLiveWhere.",
          ]
        : [
            "patho_pharm_topical > 0: posts exist that match both live visibility and patho/pharm topical SQL heuristics.",
          ];

    const visibleCandidates = await prisma.blogPost.findMany({
      where: blogLiveWhere(now),
      take: NEAR_MISS_SCAN_LIMIT,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        postTemplate: true,
        tags: true,
        excerpt: true,
        body: true,
        targetKeyword: true,
      },
    });

    const nearMisses: Array<{
      id: string;
      slug: string;
      title: string;
      postTemplate: string | null;
      category: string | null;
      tagsSample: string[];
      missingFields: string[];
      clinicalKeywordSignalInBodyOrTitle: boolean;
    }> = [];

    for (const row of visibleCandidates) {
      if (rowMatchesPathoPharmTopicalCriteria(row)) continue;
      const blob = `${row.title}\n${row.excerpt}\n${row.body.slice(0, 12000)}`.toLowerCase();
      if (!textHasClinicalPathoPharmSignal(blob)) continue;
      nearMisses.push({
        id: row.id,
        slug: row.slug,
        title: row.title.slice(0, 160),
        postTemplate: row.postTemplate,
        category: row.category,
        tagsSample: row.tags.slice(0, 12),
        missingFields: explainMissingPathoPharmTopicalMatch(row),
        clinicalKeywordSignalInBodyOrTitle: true,
      });
      if (nearMisses.length >= NEAR_MISS_OUTPUT) break;
    }

    console.log(
      JSON.stringify(
        {
          asOf: now.toISOString(),
          counts,
          diagnosticWhyTopicalMayBeZero: diagnosticWhyTopicalZero,
          nearMissVisiblePostsClinicalSignalButNotTopicalCount: nearMisses.length,
          nearMissVisiblePostsClinicalSignalButNotTopicalSample: nearMisses,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
