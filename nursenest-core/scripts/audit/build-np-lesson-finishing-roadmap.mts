/**
 * NP finishing roadmap from lesson-completeness-audit.json + pathway rollup.
 * Run: cd nursenest-core && npx tsx scripts/audit/build-np-lesson-finishing-roadmap.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ExamFamily } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..", "..");
const AUDIT = join(REPO, "data/audit/lesson-completeness-audit.json");
const ROLLUP = join(REPO, "data/audit/lesson-completeness-pathway-rollup.json");
const OUT_JSON = join(REPO, "data/audit/np-lesson-finishing-roadmap.json");
const OUT_MD = join(REPO, "data/audit/np-lesson-finishing-roadmap.md");

const NP_PATHWAY_IDS = EXAM_PATHWAYS.filter((p) => p.examFamily === ExamFamily.NP).map((p) => p.id);
const NP_PATHWAY_SET = new Set(NP_PATHWAY_IDS);

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
    pathways: Array<{
      pathwayId: string;
      totalLessons: number;
      productionReadyEn: number;
      topReasons: { reason: string; count: number }[];
    }>;
    generatedAt: string;
  };

  const npLessons = audit.lessons.filter((l) => NP_PATHWAY_SET.has(l.pathwayId) && l.routable);
  const notProdEn = npLessons.filter((l) => l.contentReadinessStatus !== "production_ready_en");
  const prodEn = npLessons.filter((l) => l.contentReadinessStatus === "production_ready_en");
  const locBlocked = npLessons.filter(
    (l) => l.contentReadinessStatus === "production_ready_en" && l.localizationReadinessStatus === "localization_incomplete",
  );
  const thinEn = npLessons.filter((l) => l.contentReadinessStatus === "usable_but_thin_en");

  const reasonCounts = new Map<string, number>();
  for (const l of notProdEn) {
    for (const r of l.reasons ?? []) {
      const k = reasonKey(r);
      reasonCounts.set(k, (reasonCounts.get(k) ?? 0) + 1);
    }
  }
  const topRecurring = [...reasonCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([reason, count]) => ({ reason, count }));

  const BATCH = 100;
  const batchesRemaining = Math.max(0, Math.ceil(notProdEn.length / BATCH));

  const npRollup = rollupDoc.pathways.filter((p) => NP_PATHWAY_SET.has(p.pathwayId));

  const json = {
    generatedAt: new Date().toISOString(),
    sourceAuditGeneratedAt: audit.generatedAt,
    sourceRollupGeneratedAt: rollupDoc.generatedAt,
    npPathways: NP_PATHWAY_IDS,
    totals: {
      npLessonRowsRoutable: npLessons.length,
      productionReadyEn: prodEn.length,
      notProductionReadyEn: notProdEn.length,
      usableButThinEn: thinEn.length,
      productionReadyEnButLocalizationIncomplete: locBlocked.length,
    },
    usCanadaPriority: {
      unitedStates:
        "us-np-fnp is the only US NP track with bundled catalog volume today; other US NP tracks (AGPCNP, PMHNP, WHNP, PNP-PC) are registry-active but need catalog + scoped-gold content to match FNP depth.",
      canada:
        "ca-np-cnple is upcoming in the product registry with zero bundled catalog lessons—Canadian NP prep should be added as a dedicated catalog + scoped-gold wave, not by mislabeling US FNP content.",
    },
    recommendedBatchOrder: [
      "us-np-fnp — complete remaining not–production_ready_en + elevate usable_but_thin_en",
      "us-np-agpcnp / us-np-pmhnp / us-np-whnp / us-np-pnp-pc — add bundled lessons + gold where product enables exam hubs",
      "ca-np-cnple — Canada-specific primary-care NP corpus (collaborative prescribing language, SI vitals) once pathway ships",
    ],
    clusterPriorityNotes: [
      "Cardiovascular, endocrine, and infectious disease ambulatory lessons drive perceived NP premium completeness.",
      "Integrated PAD reviews (bp26-usnp-*) scale exam-style judgment—keep batches grouped by client-need × body-system domains.",
      "Scoped-gold lessons shared across NP tracks should stay pathway-aware (WHNP depth vs FNP primary-care lane vs Canada collaborative framing).",
    ],
    topRecurringContentProblems: topRecurring,
    estimateBatchesAtSize100: batchesRemaining,
    rollupSnapshot: npRollup,
  };

  mkdirSync(dirname(OUT_JSON), { recursive: true });
  writeFileSync(OUT_JSON, `${JSON.stringify(json, null, 2)}\n`, "utf8");

  const md = `# NP lesson finishing roadmap

- **Audit:** ${audit.generatedAt}
- **NP routable lesson rows:** ${npLessons.length}
- **English spine production_ready_en:** ${prodEn.length}
- **Not yet production_ready_en:** ${notProdEn.length}
- **usable_but_thin_en:** ${thinEn.length}
- **Production EN but localization backlog:** ${locBlocked.length}

## Batch estimate (size ${BATCH})

- **~${batchesRemaining}** remaining batches at **${BATCH}** rows each to cover current **notProductionReadyEn** NP lessons (estimate; shared slugs across tracks reduce unique authoring).

## US vs Canada

- **US:** Finish **FNP** bundled catalog + gold injections first (highest lesson volume and hub traffic).
- **Canada:** **CNPLE** track needs **net-new** bundled content—do not reuse US lesson bodies without **country-specific** framing and scope language.

## Top recurring issues (non–production_ready_en NP rows)

${topRecurring.map((x) => `- **${x.count}×** ${x.reason}`).join("\n")}

## Pathway rollup snapshot

${npRollup
  .map(
    (p) =>
      `- **${p.pathwayId}:** ${p.totalLessons} lessons, **productionReadyEn ${p.productionReadyEn}** (rollup field)`,
  )
  .join("\n")}
`;

  writeFileSync(OUT_MD, md, "utf8");
  console.log("Wrote", OUT_JSON, OUT_MD);
}

main();
