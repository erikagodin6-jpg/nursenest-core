/**
 * Quality audit for legacy-imported exam_questions (not just row counts).
 * Requires DATABASE_URL. Writes data/audit/legacy-question-mapping-quality.json
 *
 * Run: cd nursenest-core && npm run audit:legacy-question-mapping
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { requireDatabaseUrlForLiveImport } from "./lib/require-database-for-live-import.mts";

import "../src/lib/db/env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PKG_ROOT, "..");
const OUT = join(REPO_ROOT, "data", "audit", "legacy-question-mapping-quality.json");

const LEGACY_REF = ["legacy_client_advanced_ts", "legacy_client_career_ts"] as const;

function legacyImportWhere(): Prisma.ExamQuestionWhereInput {
  return {
    OR: [
      { referenceSource: { in: [...LEGACY_REF] } },
      { tags: { has: "legacy_advanced_ts" } },
      { tags: { has: "legacy_career_ts" } },
    ],
  };
}

function extractSourceFileFromTags(tags: string[]): string | null {
  for (const t of tags) {
    const m = /^legacy_adv:([^:]+):/.exec(t);
    if (m) return m[1] ?? null;
  }
  if (tags.includes("legacy_career_ts")) {
    const other = tags.find((x) => x !== "legacy_career_ts" && x.length > 0);
    return other ?? "legacy_career_ts";
  }
  return null;
}

async function main() {
  requireDatabaseUrlForLiveImport("audit:legacy-question-mapping");
  const prisma = new PrismaClient();
  const generatedAt = new Date().toISOString();
  const lw = legacyImportWhere();

  try {
    const [
      totalLegacy,
      byTier,
      byExam,
      byRef,
      noRationale,
      published,
    ] = await Promise.all([
      prisma.examQuestion.count({ where: lw }),
      prisma.examQuestion.groupBy({
        by: ["tier"],
        where: lw,
        _count: { _all: true },
      }),
      prisma.examQuestion.groupBy({
        by: ["exam"],
        where: lw,
        _count: { _all: true },
      }),
      prisma.examQuestion.groupBy({
        by: ["referenceSource"],
        where: lw,
        _count: { _all: true },
      }),
      prisma.examQuestion.count({
        where: { AND: [lw, { OR: [{ rationale: null }, { rationale: "" }] }] },
      }),
      prisma.examQuestion.count({
        where: { AND: [lw, { status: "published" }] },
      }),
    ]);

    const shortRationaleRows = await prisma.$queryRaw<[{ c: bigint }]>`
      SELECT COUNT(*)::bigint AS c
      FROM exam_questions
      WHERE (
        reference_source IN ('legacy_client_advanced_ts', 'legacy_client_career_ts')
        OR 'legacy_advanced_ts' = ANY(tags)
        OR 'legacy_career_ts' = ANY(tags)
      )
      AND rationale IS NOT NULL
      AND char_length(trim(rationale)) < 10
    `;
    const shortRationale = Number(shortRationaleRows[0]?.c ?? 0n);

    const dupRows = await prisma.$queryRaw<Array<{ stem_hash: string; c: bigint }>>`
      SELECT stem_hash, COUNT(*)::bigint AS c
      FROM exam_questions
      WHERE stem_hash IS NOT NULL
        AND (
          reference_source IN ('legacy_client_advanced_ts', 'legacy_client_career_ts')
          OR 'legacy_advanced_ts' = ANY(tags)
          OR 'legacy_career_ts' = ANY(tags)
        )
      GROUP BY stem_hash
      HAVING COUNT(*) > 1
      ORDER BY c DESC
      LIMIT 50
    `;

    const alliedTierCount = await prisma.examQuestion.count({
      where: { AND: [lw, { tier: "allied" }] },
    });
    const npTierCount = await prisma.examQuestion.count({
      where: { AND: [lw, { tier: "np" }] },
    });
    const pnTierCount = await prisma.examQuestion.count({
      where: { AND: [lw, { tier: { in: ["rpn", "lvn"] } }] },
    });

    const sample = await prisma.examQuestion.findMany({
      where: lw,
      select: { tags: true, referenceSource: true },
      take: 8000,
    });

    const bySourceFile: Record<string, number> = {};
    for (const row of sample) {
      const f = extractSourceFileFromTags(row.tags ?? []) ?? `ref:${row.referenceSource ?? "unknown"}`;
      bySourceFile[f] = (bySourceFile[f] ?? 0) + 1;
    }

    const warnings: string[] = [];
    if (alliedTierCount > 0) {
      warnings.push(
        `Rows with tier=allied in legacy scope: ${alliedTierCount} (expected for ALLIED career files; verify nursing files are not mis-tagged).`,
      );
    }
    if (dupRows.length > 0) {
      warnings.push(
        `Non-unique stem_hash groups (sample top 50): ${dupRows.length}. Review for over-collapse or true duplicates.`,
      );
    }

    const report = {
      generatedAt,
      kind: "legacy_question_mapping_quality",
      scope: "Rows matching legacy import heuristics (referenceSource and/or legacy tags)",
      counts: {
        totalLegacyTagged: totalLegacy,
        published,
        noRationaleOrEmpty: noRationale,
        rationaleUnder10Chars: shortRationale,
        tierAlliedLegacy: alliedTierCount,
        tierNpLegacy: npTierCount,
        tierPnFamilyLegacy: pnTierCount,
      },
      distribution: {
        byTier: byTier.map((r) => ({ tier: r.tier, count: r._count._all })),
        byExam: byExam.map((r) => ({ exam: r.exam, count: r._count._all })),
        byReferenceSource: byRef.map((r) => ({
          referenceSource: r.referenceSource,
          count: r._count._all,
        })),
      },
      stemHashCollisionsTop: dupRows.map((r) => ({
        stemHash: r.stem_hash,
        rowCount: Number(r.c),
      })),
      approximateCountsBySourceFileTag: Object.entries(bySourceFile)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 80)
        .map(([file, count]) => ({ file, count })),
      warnings,
      methodology: [
        "Tier/exam come from normalizeRawQuestionRecord + mapTrackAndCountryToExamFields; RN/PN/NP inferred from legacy TS tier fields and filenames.",
        "Published rows require rationale length >= 10 unless import used padded placeholder text.",
        "Stem collisions: same stem_hash with multiple IDs — compare tags/reference_source to distinguish lineage.",
      ],
    };

    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify(report, null, 2));
    console.log(`Wrote ${OUT}`);
    if (warnings.length) console.warn("Warnings:\n", warnings.join("\n"));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
