#!/usr/bin/env npx tsx
/**
 * Read-only counts for public blog surface (unpaid users = same as marketing `/blog` visibility).
 *
 * Requires DATABASE_URL (e.g. from `.env.local`).
 *
 *   npx tsx scripts/blog/blog-public-patho-pharm-counts.mts
 *
 * Definitions:
 * - **visible_public_total**: `blogLiveWhere(now)` — PUBLISHED, or SCHEDULED with publishAt/scheduledAt <= now.
 * - **patho_pharm_topical**: visible rows that look pharmacology / pathophysiology / meds focused
 *   (template MEDICATION_REVIEW | DISEASE_PROCESS_EXPLAINER | LAB_VALUES_GUIDE, or category/title/tag heuristics).
 * - **patho_pharm_long_tail**: subset of patho_pharm_topical that also looks “long tail”
 *   (slug has 5+ segments, or title has 12+ words, or targetKeyword length >= 28).
 */
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: path.join(root, ".env.local") });

await import("../../src/lib/db/env-bootstrap");
import { PrismaClient } from "@prisma/client";

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not set (e.g. load .env.local).");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const now = new Date();

  const liveSql = `(
  p."postStatus" = 'PUBLISHED'
  OR (
    p."postStatus" = 'SCHEDULED'
    AND (
      (p."publishAt" IS NOT NULL AND p."publishAt" <= $1::timestamptz)
      OR (p."scheduledAt" IS NOT NULL AND p."scheduledAt" <= $1::timestamptz)
    )
  )
)`;

  const pathoPharmSql = `(
  p."postTemplate"::text IN ('MEDICATION_REVIEW','DISEASE_PROCESS_EXPLAINER','LAB_VALUES_GUIDE')
  OR COALESCE(p."category", '') ILIKE '%pharm%'
  OR COALESCE(p."category", '') ILIKE '%patho%'
  OR p."title" ILIKE '%pharmacology%'
  OR p."title" ILIKE '%pathophys%'
  OR p."title" ILIKE '%medication%'
  OR EXISTS (
    SELECT 1 FROM unnest(p."tags") AS t(tag)
    WHERE lower(tag) ~ '(pharm|pathophys|patholog|pharmacolog|medication|medications|drug|dosage|antibiotic|anticoag|insulin|opio|diuretic|beta.block|ace inhibitor|nsaid|chemotherapy|vasopressor|electrolyte)'
  )
)`;

  const longTailSql = `(
  (length(p."slug") - length(replace(p."slug", '-', ''))) >= 4
  OR cardinality(regexp_split_to_array(trim(p."title"), '\\s+')) >= 12
  OR length(trim(COALESCE(p."targetKeyword", ''))) >= 28
)`;

  const q = `
SELECT
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql}) AS visible_public_total,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoPharmSql}) AS patho_pharm_topical,
  (SELECT COUNT(*)::int FROM "BlogPost" p WHERE ${liveSql} AND ${pathoPharmSql} AND ${longTailSql}) AS patho_pharm_long_tail
`;

  try {
    const rows = await prisma.$queryRawUnsafe<
      Array<{
        visible_public_total: number;
        patho_pharm_topical: number;
        patho_pharm_long_tail: number;
      }>
    >(q, now);
    console.log(
      JSON.stringify(
        {
          asOf: now.toISOString(),
          counts: rows[0] ?? null,
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
