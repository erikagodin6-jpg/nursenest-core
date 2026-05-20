/**
 * RN finishing roadmap from lesson-completeness-audit.json + pathway rollup.
 * Run: cd nursenest-core && npx tsx scripts/audit/build-rn-lesson-finishing-roadmap.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..", "..");
const AUDIT = join(REPO, "data/audit/lesson-completeness-audit.json");
const ROLLUP = join(REPO, "data/audit/lesson-completeness-pathway-rollup.json");
const OUT_JSON = join(REPO, "data/audit/rn-lesson-finishing-roadmap.json");
const OUT_MD = join(REPO, "data/audit/rn-lesson-finishing-roadmap.md");

const RN_PATHWAYS = new Set(["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-rn-new-grad-transition"]);

type AuditLesson = {
  pathwayId: string;
  slug: string;
  overallScore: number;
  status: string;
  contentReadinessStatus: string;
  localizationReadinessStatus: string;
  routable: boolean;
  reasons: string[];
};

function reasonKey(s: string): string {
  return s.split(":")[0]?.slice(0, 80) ?? s;
}

function main() {
  const audit = JSON.parse(readFileSync(AUDIT, "utf8")) as { lessons: AuditLesson[]; generatedAt: string };
  const rollupDoc = JSON.parse(readFileSync(ROLLUP, "utf8")) as {
    pathways: Array<{ pathwayId: string; totalLessons: number; productionReadyEn: number; topReasons: { reason: string; count: number }[] }>;
    generatedAt: string;
  };

  const rnLessons = audit.lessons.filter((l) => RN_PATHWAYS.has(l.pathwayId) && l.routable);
  const notProdEn = rnLessons.filter((l) => l.contentReadinessStatus !== "production_ready_en");
  const prodEn = rnLessons.filter((l) => l.contentReadinessStatus === "production_ready_en");
  const locBlocked = rnLessons.filter(
    (l) => l.contentReadinessStatus === "production_ready_en" && l.localizationReadinessStatus === "localization_incomplete",
  );

  const reasonCounts = new Map<string, number>();
  for (const l of notProdEn) {
    for (const r of l.reasons ?? []) {
      const k = reasonKey(r);
      reasonCounts.set(k, (reasonCounts.get(k) ?? 0) + 1);
    }
  }
  const topRecurring = [...reasonCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([reason, count]) => ({ reason, count }));

  const BATCH = 100;
  const batchesRemaining = Math.max(1, Math.ceil(notProdEn.length / BATCH));

  const rnRollup = rollupDoc.pathways.filter((p) => RN_PATHWAYS.has(p.pathwayId));

  const json = {
    generatedAt: new Date().toISOString(),
    sourceAuditGeneratedAt: audit.generatedAt,
    sourceRollupGeneratedAt: rollupDoc.generatedAt,
    rnPathways: [...RN_PATHWAYS],
    totals: {
      rnLessonRowsRoutable: rnLessons.length,
      productionReadyEn: prodEn.length,
      notProductionReadyEn: notProdEn.length,
      productionReadyEnButLocalizationIncomplete: locBlocked.length,
    },
    recommendedBatchOrder: [
      "us-rn-nclex-rn (flagship NCLEX-RN US)",
      "ca-rn-nclex-rn (parallel Canada RN hub)",
      "us-rn-new-grad-transition (first-year practice)",
    ],
    clusterPriorityNotes: [
      "Cardiovascular, respiratory, and endocrine acute care lessons drive pathway completeness perception.",
      "Management of care (delegation, assignment, ethics, legal) supports exam and new-grad trust.",
      "Gold-standard / premium-spine duplicates should be resolved as a separate track from bundled stub expansion.",
    ],
    topRecurringContentProblems: topRecurring,
    estimateBatchesAtSize100: batchesRemaining,
    rollupSnapshot: rnRollup,
  };

  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, `${JSON.stringify(json, null, 2)}\n`, "utf8");

  const md = `# RN lesson finishing roadmap

- **Audit:** ${audit.generatedAt}
- **RN routable lesson rows:** ${rnLessons.length}
- **English spine production_ready_en:** ${prodEn.length}
- **Not yet production_ready_en:** ${notProdEn.length}
- **Production EN but localization backlog:** ${locBlocked.length}

## Recommended batch order

1. **us-rn-nclex-rn** — flagship US NCLEX-RN volume and lowest average scores in rollup.
2. **ca-rn-nclex-rn** — parallel Canada hub; share slugs with US where catalog is unified.
3. **us-rn-new-grad-transition** — transition topics after core licensure spine is strong.

## Batches remaining (plan size ${BATCH})

- **~${batchesRemaining}** batches at **${BATCH}** RN rows each to cover current **notProductionReadyEn** rows (estimate; dedupe by shared slugs reduces authoring surface).

## Top recurring RN content issues (from non–production_ready_en rows)

${topRecurring.map((x) => `- **${x.count}×** ${x.reason}`).join("\n")}

## Pathway rollup snapshot

${rnRollup
  .map(
    (p) =>
      `- **${p.pathwayId}:** ${p.totalLessons} lessons, **productionReadyEn ${p.productionReadyEn}** (rollup field)`,
  )
  .join("\n")}

## Workflow

1. \`npx tsx scripts/audit/build-rn-lesson-fix-batch-1-plan.mts\` (refresh RN plan).
2. Expand \`rn-batch1-catalog-patches.ts\` (or rn-batch-N) with real bodies; merge includes batch-2 shared slugs.
3. \`npx tsx scripts/audit/apply-rn-lesson-batch1-catalog-patches.mts\`
4. \`npx tsx scripts/audit/run-lesson-completeness-audit.mts\`
5. \`npx tsx scripts/audit/run-rn-lesson-fix-batch-1-impact-report.mts\`

Do not hide RN lessons to improve metrics; keep thresholds unchanged.
`;
  writeFileSync(OUT_MD, md, "utf8");
  console.log("Wrote", OUT_JSON, OUT_MD);
}

main();
