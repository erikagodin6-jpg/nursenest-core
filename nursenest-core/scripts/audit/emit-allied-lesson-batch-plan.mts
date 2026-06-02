/**
 * Build allied-lesson-fix-batch-1-plan.json + allied-pathway-inventory.json from audit + registry.
 * Read-only. Run: cd nursenest-core && npx tsx scripts/audit/emit-allied-lesson-batch-plan.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ExamFamily, TierCode } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");
const AUDIT_PATH = join(REPO_ROOT, "data", "audit", "lesson-completeness-audit.json");
const PLAN_PATH = join(REPO_ROOT, "data", "audit", "allied-lesson-fix-batch-1-plan.json");
const INV_PATH = join(REPO_ROOT, "data", "audit", "allied-pathway-inventory.json");

const BATCH_CAP = 100;
const ALLIED_PATHWAY_IDS = ["us-allied-core", "ca-allied-core"] as const;

type AuditRow = {
  lessonId: string;
  slug: string;
  title: string;
  pathwayId: string;
  exam: string;
  country: string;
  routable?: boolean;
  overallScore: number;
  status: string;
  contentReadinessStatus?: string;
  localizationReadinessStatus?: string;
  reasons: string[];
  evidence?: { internalStudyLinkCount?: number; relatedLessonRefCount?: number };
};

function isAlliedPathway(id: string): boolean {
  const p = getExamPathwayById(id);
  return Boolean(p && (p.stripeTier === TierCode.ALLIED || p.examFamily === ExamFamily.ALLIED));
}

function contentSeverity(r: AuditRow): number {
  const c = r.contentReadinessStatus ?? "";
  if (c === "structurally_incomplete") return 0;
  if (c === "content_incomplete") return 1;
  if (c === "usable_but_thin_en") return 2;
  if (c === "production_ready_en") return 3;
  return 2;
}

function main() {
  const audit = JSON.parse(readFileSync(AUDIT_PATH, "utf8")) as { lessons: AuditRow[]; generatedAt?: string };
  const alliedRows = audit.lessons.filter((l) => ALLIED_PATHWAY_IDS.includes(l.pathwayId as (typeof ALLIED_PATHWAY_IDS)[number]));

  const sorted = [...alliedRows].sort((a, b) => {
    const sev = contentSeverity(a) - contentSeverity(b);
    if (sev !== 0) return sev;
    if (a.routable !== b.routable) return a.routable ? -1 : 1;
    if (a.overallScore !== b.overallScore) return a.overallScore - b.overallScore;
    if (a.pathwayId !== b.pathwayId) return a.pathwayId.localeCompare(b.pathwayId);
    return a.slug.localeCompare(b.slug);
  });

  const selected = sorted.slice(0, BATCH_CAP);

  const plan = {
    generatedAt: new Date().toISOString(),
    selection:
      "Active allied pathways from EXAM_PATHWAYS (us-allied-core, ca-allied-core); bundled catalog lessons only. Sorted: content readiness severity, routable, lowest overallScore, pathwayId, slug. Capped at 100 (all available allied lessons in audit).",
    batchCap: BATCH_CAP,
    selectedCount: selected.length,
    lessons: selected.map((r) => ({
      lessonId: r.lessonId,
      slug: r.slug,
      title: r.title,
      pathwayId: r.pathwayId,
      profession: "allied_health_multi_discipline_hub",
      country: r.country,
      exam: r.exam,
      overallScore: r.overallScore,
      status: r.status,
      contentReadinessStatus: r.contentReadinessStatus,
      localizationReadinessStatus: r.localizationReadinessStatus,
      topFailureReasons: (r.reasons ?? []).slice(0, 8),
      intendedFixScope: [
        "Replace nursing-centric template phrasing with allied-health scope and collaboration language.",
        "Add 3+ internal study links (LESSON:slug) plus pathway hub link; add relatedLessonRefs metadata.",
        "Rename intervention section heading away from nursing-only framing where present.",
        "Prepend short allied-practice clinical frame to long intervention blocks where helpful for scenario quality.",
      ],
    })),
  };

  const inventoryPathways = ALLIED_PATHWAY_IDS.map((pathwayId) => {
    const p = getExamPathwayById(pathwayId);
    const lessons = getCatalogPathwayLessonsSync(pathwayId);
    return {
      pathwayId,
      profession: "allied_health",
      country: p?.countryCode === "CA" ? "canada" : "us",
      examTrack: p?.examCode ?? "allied-health",
      examFamily: p?.examFamily ?? "ALLIED",
      lessonCountCatalog: lessons.length,
      routableInRegistry: p?.status === "active",
      appearsActiveInProduction: p?.status === "active",
      stripeTier: p?.stripeTier ?? null,
    };
  });

  const inventory = {
    generatedAt: new Date().toISOString(),
    note: "Allied health content is consolidated into two active pathway hubs (US and Canada) in EXAM_PATHWAYS; discipline-specific tracks (respiratory, lab, imaging, etc.) are not separate pathway IDs in this repo.",
    pathways: inventoryPathways,
    totalAlliedLessonsInBundledAudit: alliedRows.length,
  };

  mkdirSync(dirname(PLAN_PATH), { recursive: true });
  writeFileSync(PLAN_PATH, JSON.stringify(plan, null, 2));
  writeFileSync(INV_PATH, JSON.stringify(inventory, null, 2));
  console.log(`Wrote ${PLAN_PATH} (${plan.selectedCount} lessons)`);
  console.log(`Wrote ${INV_PATH}`);
}

main();
