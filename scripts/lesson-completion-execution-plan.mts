#!/usr/bin/env npx tsx
/**
 * Builds bulk lesson completion plan from diagnostic + inventory reports.
 * Run: npx tsx scripts/lesson-completion-execution-plan.mts
 *
 * Outputs:
 *   reports/lesson-completion-execution-plan.json
 *   reports/lesson-completion-execution-plan.md
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { pathwayHasBundledCatalogLessonsSync } from "../src/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BUCKETS = path.join(ROOT, "reports/lesson-root-cause-buckets.json");
const INV = path.join(ROOT, "reports/lesson-system-inventory.json");
const OUT_JSON = path.join(ROOT, "reports/lesson-completion-execution-plan.json");
const OUT_MD = path.join(ROOT, "reports/lesson-completion-execution-plan.md");

const SUBSTANTIAL_BODY = 3000;

type BucketLesson = {
  pathwayId: string;
  slug: string;
  tier: string;
  primaryBucket: string;
  totalBodyChars: number;
  structuralIssues: string[];
  sources?: string[];
};

type BucketsFile = {
  generatedAt: string;
  lessons: BucketLesson[];
};

type InvLesson = {
  slug: string;
  pathwayId: string;
  sources: string[];
  marketingWouldRender: boolean;
  totalBodyChars: number;
};

type InvFile = {
  generatedAt: string;
  byPathway: Record<string, { lessons: InvLesson[]; catalogEffectiveCount?: number; dbPublishedEnCount?: number }>;
};

function tierForPathway(pathwayId: string): string {
  if (pathwayId === "us-rn-nclex-rn") return "RN";
  if (pathwayId === "ca-rn-nclex-rn") return "RN";
  if (pathwayId === "us-lpn-nclex-pn") return "PN";
  if (pathwayId === "ca-rpn-rex-pn") return "PN";
  if (pathwayId.startsWith("us-np-") || pathwayId === "ca-np-cnple") return "NP";
  if (pathwayId === "us-allied-core" || pathwayId === "ca-allied-core") return "Allied";
  return "Other";
}

function main(): void {
  const buckets: BucketsFile = JSON.parse(fs.readFileSync(BUCKETS, "utf8"));
  const inv: InvFile = JSON.parse(fs.readFileSync(INV, "utf8"));

  const lessonMeta = new Map<string, InvLesson>();
  for (const [pid, pw] of Object.entries(inv.byPathway ?? {})) {
    for (const row of pw.lessons ?? []) {
      lessonMeta.set(`${pid}::${row.slug}`, { ...row, pathwayId: pid });
    }
  }

  const executionCategories = {
    gatingPrimaryOrSubstantialBody: 0,
    missingSectionsPrimaryThinBody: 0,
    missingSectionsPrimarySubstantialBody: 0,
    trulyMissingOrPlaceholder: 0,
    otherBuckets: 0,
  };

  const sourcesBreakdown = {
    catalogOnly: 0,
    databaseOnly: 0,
    both: 0,
    unknown: 0,
  };

  let substantialBodyNonPublic = 0;

  for (const L of buckets.lessons) {
    const key = `${L.pathwayId}::${L.slug}`;
    const meta = lessonMeta.get(key);

    if ((L.totalBodyChars ?? 0) >= SUBSTANTIAL_BODY) substantialBodyNonPublic += 1;

    if (meta) {
      const s = meta.sources?.slice().sort().join(",") ?? "";
      if (s === "catalog") sourcesBreakdown.catalogOnly += 1;
      else if (s === "database") sourcesBreakdown.databaseOnly += 1;
      else if (s.includes("catalog") && s.includes("database")) sourcesBreakdown.both += 1;
      else sourcesBreakdown.unknown += 1;
    } else {
      sourcesBreakdown.unknown += 1;
    }

    const pb = L.primaryBucket;
    if (pb === "present_but_gating_or_merge_logic") {
      executionCategories.gatingPrimaryOrSubstantialBody += 1;
    } else if (pb === "missing_required_content_sections") {
      if ((L.totalBodyChars ?? 0) >= SUBSTANTIAL_BODY) {
        executionCategories.missingSectionsPrimarySubstantialBody += 1;
      } else {
        executionCategories.missingSectionsPrimaryThinBody += 1;
      }
    } else if (pb === "truly_missing_or_placeholder_content") {
      executionCategories.trulyMissingOrPlaceholder += 1;
    } else {
      executionCategories.otherBuckets += 1;
    }
  }

  const alliedRootCause = {
    summary:
      "Not a sync bug: `catalog.json` omits `us-allied-core` / `ca-allied-core` pathways, so bundled helpers return zero rows. Hubs use published DB lessons when present (`getPathwayLessonsPage` DB branch).",
    pathwayHasBundledCatalogLessonsSync: {
      "us-allied-core": pathwayHasBundledCatalogLessonsSync("us-allied-core"),
      "ca-allied-core": pathwayHasBundledCatalogLessonsSync("ca-allied-core"),
    },
    inventorySnapshots: {
      "us-allied-core": inv.byPathway["us-allied-core"]
        ? {
            catalogEffectiveCount: inv.byPathway["us-allied-core"].catalogEffectiveCount,
            dbPublishedEnCount: inv.byPathway["us-allied-core"].dbPublishedEnCount,
          }
        : null,
      "ca-allied-core": inv.byPathway["ca-allied-core"]
        ? {
            catalogEffectiveCount: inv.byPathway["ca-allied-core"].catalogEffectiveCount,
            dbPublishedEnCount: inv.byPathway["ca-allied-core"].dbPublishedEnCount,
          }
        : null,
    },
  };

  const rankedPhases = [
    {
      rank: 1,
      name: "Structural + premium gate compliance (NP/RN/PN bulk)",
      focus: "missing_required_content_sections — add/expand premium spine sections and metadata where body already exists",
      estimatedLessonsInBucket: buckets.totals.bucketPrimaryCounts.missing_required_content_sections,
    },
    {
      rank: 2,
      name: "Gating / depth / relatedLessonRefs (no route changes)",
      focus: "present_but_gating_or_merge_logic — editorial passes on clinical_scenario depth, relatedLessonRefs targets, subscriber/premium completeness",
      estimatedLessonsInBucket: buckets.totals.bucketPrimaryCounts.present_but_gating_or_merge_logic,
    },
    {
      rank: 3,
      name: "Placeholder / banned phrasing cleanup",
      focus: "truly_missing_or_placeholder_content — replace stubs; cross-check legacy map where applicable",
      estimatedLessonsInBucket: buckets.totals.bucketPrimaryCounts.truly_missing_or_placeholder_content,
    },
    {
      rank: 4,
      name: "Allied: optional future bundled catalog",
      focus:
        "Until `catalog.json` includes allied buckets, rely on DB + merged inventory for counts; add JSON only when offline/bundle parity is required",
      estimatedLessonsInBucket: 0,
    },
  ];

  const payload = {
    generatedAt: new Date().toISOString(),
    sources: {
      lessonRootCauseBuckets: "reports/lesson-root-cause-buckets.json",
      lessonSystemInventory: "reports/lesson-system-inventory.json",
      bucketsGeneratedAt: buckets.generatedAt,
      inventoryGeneratedAt: inv.generatedAt,
    },
    alliedBundledCatalogAnalysis: alliedRootCause,
    counts: {
      nonPublicCompleteLessons: buckets.lessons.length,
      substantialBodyCharsButNotPublic: substantialBodyNonPublic,
      executionCategorySplit: executionCategories,
      sourcesBreakdownNonPublic: sourcesBreakdown,
    },
    legacyAndRestoreHints: {
      databaseOnlyNonPublic: sourcesBreakdown.databaseOnly,
      catalogOnlyNonPublic: sourcesBreakdown.catalogOnly,
      bothSourcesNonPublic: sourcesBreakdown.both,
      note:
        "database-only failures may be restored/enriched from legacy pipelines; catalog-only may need section completion without DB drift; both — reconcile merge order first.",
    },
    rankedPhases,
    tierRollup: (() => {
      const m: Record<string, typeof executionCategories> = {};
      for (const L of buckets.lessons) {
        const t = L.tier ?? tierForPathway(L.pathwayId);
        if (!m[t]) {
          m[t] = {
            gatingPrimaryOrSubstantialBody: 0,
            missingSectionsPrimaryThinBody: 0,
            missingSectionsPrimarySubstantialBody: 0,
            trulyMissingOrPlaceholder: 0,
            otherBuckets: 0,
          };
        }
        const c = m[t];
        const pb = L.primaryBucket;
        if (pb === "present_but_gating_or_merge_logic") c.gatingPrimaryOrSubstantialBody += 1;
        else if (pb === "missing_required_content_sections") {
          if ((L.totalBodyChars ?? 0) >= SUBSTANTIAL_BODY) c.missingSectionsPrimarySubstantialBody += 1;
          else c.missingSectionsPrimaryThinBody += 1;
        } else if (pb === "truly_missing_or_placeholder_content") c.trulyMissingOrPlaceholder += 1;
        else c.otherBuckets += 1;
      }
      return m;
    })(),
    remainingBlockersBeforeBulkImport: [
      "Product rules for relaxing vs enforcing premium structural gates (especially NP volume).",
      "Legacy import: use existing convert/enrichment scripts; dedupe by pathway+slug.",
      "Allied: no bundled JSON required for hub correctness — optional parity if offline catalog needed.",
    ],
  };

  if (!fs.existsSync(path.dirname(OUT_JSON))) fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), "utf8");

  const md: string[] = [];
  md.push(`# Lesson completion execution plan`);
  md.push("");
  md.push(`Derived from root-cause buckets + system inventory (static analysis).`);
  md.push("");
  md.push(`## Allied: bundled catalog vs DB`);
  md.push("");
  md.push(alliedRootCause.summary);
  md.push("");
  md.push(`- \`pathwayHasBundledCatalogLessonsSync(us-allied-core)\`: ${alliedRootCause.pathwayHasBundledCatalogLessonsSync["us-allied-core"]}`);
  md.push(`- \`pathwayHasBundledCatalogLessonsSync(ca-allied-core)\`: ${alliedRootCause.pathwayHasBundledCatalogLessonsSync["ca-allied-core"]}`);
  md.push("");
  md.push(`## Primary blocker (overall)`);
  md.push("");
  md.push(
    `**Content completeness and structural gates** dominate (\`missing_required_content_sections\` + \`present_but_gating_or_merge_logic\`). Routes are not implicated by these reports.`,
  );
  md.push("");
  md.push(`## Execution category split (non–public-complete lessons)`);
  md.push("");
  md.push(JSON.stringify(executionCategories, null, 2));
  md.push("");
  md.push(`## Sources breakdown (non–public-complete)`);
  md.push("");
  md.push(JSON.stringify(sourcesBreakdown, null, 2));
  md.push("");
  md.push(`## Ranked phases`);
  md.push("");
  for (const p of rankedPhases) {
    md.push(`### ${p.rank}. ${p.name}`);
    md.push("");
    md.push(p.focus);
    md.push("");
  }
  md.push(`## Machine-readable`);
  md.push("");
  md.push(`- \`${path.relative(ROOT, OUT_JSON)}\``);
  md.push("");

  fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");
  console.log("Wrote", OUT_JSON);
  console.log("Wrote", OUT_MD);
}

main();
