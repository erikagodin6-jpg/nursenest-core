#!/usr/bin/env npx tsx
/**
 * Reads reports/lesson-system-inventory.json and emits root-cause bucket reports.
 * Run from nursenest-core: npx tsx scripts/lesson-root-cause-diagnostic.mts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { ALLIED_PROFESSIONS } from "../src/lib/allied/allied-professions-registry";
import { alliedLessonMatchesProfessionFilter } from "../src/lib/allied/allied-lesson-access";
import {
  getEffectiveCatalogLessonsForPathwaySync,
} from "../src/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INV = path.join(ROOT, "reports/lesson-system-inventory.json");
const OUT_BUCKETS = path.join(ROOT, "reports/lesson-root-cause-buckets.json");
const OUT_SUMMARY = path.join(ROOT, "reports/lesson-root-cause-summary.md");
const OUT_ROUTE = path.join(ROOT, "reports/proven-route-or-gate-bugs.json");
const OUT_ALLIED = path.join(ROOT, "reports/allied-visibility-root-cause.json");
const OUT_PLAN = path.join(ROOT, "reports/lesson-fix-plan-ranked.md");

type InvLesson = {
  slug: string;
  title: string;
  topicSlug: string;
  pathwayId: string;
  sources: string[];
  marketingWouldRender: boolean;
  structureMode: string;
  structuralIssues: string[];
  totalBodyChars: number;
  brokenRelatedRefs: string[];
};

type InvPayload = {
  generatedAt: string;
  byPathway: Record<
    string,
    {
      tierGroup: string;
      lessons: InvLesson[];
      catalogEffectiveCount?: number;
      dbPublishedEnCount?: number;
      mergedUniqueSlugCount?: number;
    }
  >;
  byTier: Record<string, unknown>;
};

const BUCKET_IDS = [
  "missing_required_content_sections",
  "missing_pre_test_items",
  "missing_post_test_items",
  "structural_normalization_failure",
  "slug_mismatch",
  "route_mismatch",
  "pathway_mapping_mismatch",
  "filtered_out_by_topicSlugsIn",
  "present_but_gating_or_merge_logic",
  "truly_missing_or_placeholder_content",
] as const;

type BucketId = (typeof BUCKET_IDS)[number];

function classifyIssueText(issue: string): BucketId[] {
  const t = issue.toLowerCase();
  const out = new Set<BucketId>();

  if (/pre[-\s]?test|pretest/i.test(issue) && /missing|required|at least/i.test(issue)) {
    out.add("missing_pre_test_items");
  }
  if (/post[-\s]?test|posttest/i.test(issue) && /missing|required|at least/i.test(issue)) {
    out.add("missing_post_test_items");
  }

  if (
    /below minimum word count/i.test(issue) ||
    /below the minimum depth/i.test(issue) ||
    /missing required legacy section/i.test(issue) ||
    /missing premium section/i.test(issue) ||
    /section\s+"[^"]+"\s+is below/i.test(issue) ||
    /introduction should contain at least 2 real paragraphs/i.test(issue) ||
    /metadata: provide at least 2 relatedlessonrefs/i.test(t) ||
    /internal study-flow links:/i.test(issue) ||
    /at least \d+ premium sections must include/i.test(issue)
  ) {
    out.add("missing_required_content_sections");
  }

  if (/normalize|normalization|malformed|invalid json/i.test(issue)) {
    out.add("structural_normalization_failure");
  }

  if (/slug|relatedlessonrefs target|unknown slug|duplicate slug/i.test(issue) && /href|link|lesson:/i.test(issue)) {
    out.add("slug_mismatch");
  }

  if (/route|url|path mismatch|404/i.test(issue)) {
    out.add("route_mismatch");
  }

  if (/exam meta|country|pathway|filtered by context|does not match pathway/i.test(issue)) {
    out.add("pathway_mapping_mismatch");
  }

  if (/topic slug|topicSlugsIn|profession filter/i.test(issue)) {
    out.add("filtered_out_by_topicSlugsIn");
  }

  if (
    /development or placeholder phrasing|empty, trivial, or reads as a placeholder|banned development/i.test(issue) ||
    /placeholder/i.test(issue)
  ) {
    out.add("truly_missing_or_placeholder_content");
  }

  if (
    /clinical scenario|patient vignette|structured patient/i.test(issue) ||
    /at least one premium section must include a structured clinical scenario/i.test(issue)
  ) {
    out.add("missing_required_content_sections");
  }

  if (out.size === 0) {
    out.add("present_but_gating_or_merge_logic");
  }

  return [...out];
}

function primaryBucket(issues: string[], totalBodyChars: number): BucketId {
  const counts = new Map<BucketId, number>();
  for (const iss of issues) {
    for (const b of classifyIssueText(iss)) {
      counts.set(b, (counts.get(b) ?? 0) + 1);
    }
  }
  if (totalBodyChars < 200 && issues.length > 0) {
    return "truly_missing_or_placeholder_content";
  }
  let best: BucketId = "present_but_gating_or_merge_logic";
  let n = -1;
  for (const [b, c] of counts) {
    if (c > n) {
      n = c;
      best = b;
    }
  }
  return best;
}

function tierFromPathway(pathwayId: string, tierGroup: string): "PN" | "RN" | "NP" | "Allied" | "Other" {
  if (pathwayId.includes("allied")) return "Allied";
  if (pathwayId.includes("-np-") || pathwayId === "ca-np-cnple") return "NP";
  if (pathwayId.includes("rex-pn") || pathwayId.includes("lpn-nclex-pn")) return "PN";
  if (pathwayId.includes("rn-nclex-rn")) return "RN";
  return "Other";
}

function main() {
  if (!fs.existsSync(INV)) {
    console.error("Missing", INV);
    process.exit(2);
  }
  const inv = JSON.parse(fs.readFileSync(INV, "utf8")) as InvPayload;

  const bucketCounts: Record<BucketId, number> = Object.fromEntries(BUCKET_IDS.map((b) => [b, 0])) as Record<
    BucketId,
    number
  >;
  const bucketByTier: Record<string, Record<BucketId, number>> = {
    PN: Object.fromEntries(BUCKET_IDS.map((b) => [b, 0])) as Record<BucketId, number>,
    RN: Object.fromEntries(BUCKET_IDS.map((b) => [b, 0])) as Record<BucketId, number>,
    NP: Object.fromEntries(BUCKET_IDS.map((b) => [b, 0])) as Record<BucketId, number>,
    Allied: Object.fromEntries(BUCKET_IDS.map((b) => [b, 0])) as Record<BucketId, number>,
    Other: Object.fromEntries(BUCKET_IDS.map((b) => [b, 0])) as Record<BucketId, number>,
  };

  const lessonsFailed: Array<InvLesson & { primaryBucket: BucketId; buckets: BucketId[]; tier: string }> = [];
  const pathwayFailCount = new Map<string, number>();

  for (const [pathwayId, pw] of Object.entries(inv.byPathway ?? {})) {
    for (const lesson of pw.lessons ?? []) {
      if (lesson.marketingWouldRender) continue;
      pathwayFailCount.set(pathwayId, (pathwayFailCount.get(pathwayId) ?? 0) + 1);
      const buckets = new Set<BucketId>();
      for (const iss of lesson.structuralIssues ?? []) {
        for (const b of classifyIssueText(iss)) buckets.add(b);
      }
      if ((lesson.brokenRelatedRefs ?? []).length > 0) {
        buckets.add("slug_mismatch");
      }
      const pb = primaryBucket(lesson.structuralIssues ?? [], lesson.totalBodyChars ?? 0);
      const tier = tierFromPathway(pathwayId, pw.tierGroup ?? "");
      bucketCounts[pb] += 1;
      bucketByTier[tier][pb] += 1;
      lessonsFailed.push({
        ...lesson,
        primaryBucket: pb,
        buckets: [...buckets],
        tier,
      });
    }
  }

  const topPathwaysByFailures = [...pathwayFailCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([pathwayId, failedCount]) => ({ pathwayId, failedCount }));

  const substantialGateFailures = lessonsFailed.filter(
    (l) => (l.totalBodyChars ?? 0) >= 3000 && !l.marketingWouldRender,
  );

  fs.writeFileSync(
    OUT_BUCKETS,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceInventory: "reports/lesson-system-inventory.json",
        methodology: {
          buckets: BUCKET_IDS,
          note: "Issue strings are classified by keyword rules aligned with pathway-lesson-premium + subscriber completeness. Structural gate does not currently emit dedicated preTest/postTest missing messages; buckets 2–3 may be empty.",
        },
        totals: {
          nonPublicCompleteLessons: lessonsFailed.length,
          bucketPrimaryCounts: bucketCounts,
        },
        byTierPrimaryCounts: bucketByTier,
        lessons: lessonsFailed.map((l) => ({
          pathwayId: l.pathwayId,
          slug: l.slug,
          tier: l.tier,
          primaryBucket: l.primaryBucket,
          buckets: l.buckets,
          structureMode: l.structureMode,
          totalBodyChars: l.totalBodyChars,
          structuralIssues: l.structuralIssues,
          sources: l.sources,
        })),
      },
      null,
      2,
    ),
    "utf8",
  );

  const md: string[] = [];
  md.push(`# Lesson root-cause bucket summary`);
  md.push("");
  md.push(`Source: \`reports/lesson-system-inventory.json\` (inventory generated: ${inv.generatedAt})`);
  md.push(`Diagnostic generated: ${new Date().toISOString()}`);
  md.push("");
  md.push(`## Non–public-complete lessons: primary bucket counts`);
  md.push("");
  md.push("| Bucket | Count |");
  md.push("| --- | ---: |");
  for (const b of BUCKET_IDS) {
    md.push(`| ${b} | ${bucketCounts[b]} |`);
  }
  md.push("");
  md.push(`## By tier (PN / RN / NP / Allied / Other) — primary bucket`);
  md.push("");
  for (const tier of ["PN", "RN", "NP", "Allied", "Other"] as const) {
    md.push(`### ${tier}`);
    md.push("");
    md.push("| Bucket | Count |");
    md.push("| --- | ---: |");
    for (const b of BUCKET_IDS) {
      md.push(`| ${b} | ${bucketByTier[tier][b]} |`);
    }
    md.push("");
  }
  md.push(`## Top pathways by failed-lesson count`);
  md.push("");
  md.push(JSON.stringify(topPathwaysByFailures, null, 2));
  md.push("");
  fs.writeFileSync(OUT_SUMMARY, md.join("\n"), "utf8");

  const routeReport = {
    generatedAt: new Date().toISOString(),
    conclusion:
      "Static inventory cannot prove HTTP route bugs (no request/response). Entries below are lessons with substantial body text that still fail publicComplete — strong evidence of strict gating or authoring depth, not Next.js routing.",
    provenRouteBugs: [] as unknown[],
    substantialContentButGateFailed: substantialGateFailures.slice(0, 200).map((l) => ({
      pathwayId: l.pathwayId,
      slug: l.slug,
      totalBodyChars: l.totalBodyChars,
      structureMode: l.structureMode,
      issueCount: l.structuralIssues?.length ?? 0,
    })),
  };
  fs.writeFileSync(OUT_ROUTE, JSON.stringify(routeReport, null, 2), "utf8");

  /** Allied: catalog effective vs profession topic filter */
  const alliedPathways = ["us-allied-core", "ca-allied-core"] as const;
  const professionRows: object[] = [];

  for (const prof of ALLIED_PROFESSIONS) {
    const pathwayId = prof.pathwayId;
    try {
      const effective = getEffectiveCatalogLessonsForPathwaySync(pathwayId);
      const filtered = effective.filter((l) => alliedLessonMatchesProfessionFilter(l, prof.topicSlugsIn));
      const wouldRender = filtered.filter((l) => l.structuralQuality?.publicComplete).length;
      professionRows.push({
        professionKey: prof.professionKey,
        pathwayId,
        topicSlugsIn: prof.topicSlugsIn ?? null,
        catalogEffectiveTotal: effective.length,
        afterTopicFilterCount: filtered.length,
        marketingWouldRenderApprox: wouldRender,
      });
    } catch (e) {
      professionRows.push({ professionKey: prof.professionKey, pathwayId, error: String(e) });
    }
  }

  const alliedReport: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    note: "topicSlugsIn on ALLIED_PROFESSIONS restricts which lessons appear per profession hub. Inventory hub rows use getEffectiveCatalogLessonsForPathwaySync (exam filter), then alliedLessonMatchesProfessionFilter.",
    externalVolumesAvailable: false,
    professions: professionRows,
  };

  for (const pid of alliedPathways) {
    const pw = inv.byPathway[pid];
    if (pw) {
      alliedReport[`pathway_${pid}_inventory_snapshot`] = {
        catalogEffectiveCount: pw.catalogEffectiveCount,
        dbPublishedEnCount: pw.dbPublishedEnCount,
        mergedUniqueSlugCount: pw.mergedUniqueSlugCount,
      };
    }
  }

  fs.writeFileSync(OUT_ALLIED, JSON.stringify(alliedReport, null, 2), "utf8");

  const top5 = Object.entries(bucketCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");

  const plan = [
    `# Ranked lesson fix plan (diagnostic)`,
    ``,
    `## A. Content / gating fixes (highest impact)`,
    `- Primary failure mode is **premium/legacy minimum depth**, **clinical scenario signal**, and **relatedLessonRefs** metadata — tune authoring or relax gates only with product approval.`,
    `- Address placeholder/banned phrasing where \`truly_missing_or_placeholder_content\` dominates.`,
    ``,
    `## B. Mapping / filter fixes`,
    `- Review **relatedLessonRefs** targets where \`slug_mismatch\` / broken refs appear in inventory.`,
    `- Allied: align **topicSlug** distribution with \`topicSlugsIn\` per profession or adjust filters after content inventory.`,
    ``,
    `## C. Route fixes (only if proven in runtime)`,
    `- No route bugs proven from static JSON; verify with Next + \`getPathwayLesson\` for specific slugs if a mismatch is suspected.`,
    ``,
    `## D. Manual review`,
    `- NP high-volume pathways: spot-check slugs with mixed issue types.`,
    `- "Other" tier group pathways (e.g. upcoming): confirm intentional non-publish.`,
    ``,
    `## Top primary buckets (this run)`,
    top5,
  ].join("\n");
  fs.writeFileSync(OUT_PLAN, plan, "utf8");

  console.log("Wrote", OUT_BUCKETS);
  console.log("Wrote", OUT_SUMMARY);
  console.log("Wrote", OUT_ROUTE);
  console.log("Wrote", OUT_ALLIED);
  console.log("Wrote", OUT_PLAN);
}

main();
