#!/usr/bin/env npx tsx
/**
 * Reconciles RN/RPN recovery counts (unique legacy vs pathway rows vs import operations)
 * and writes pathway-lessons reports for consolidation planning.
 */
import "../src/lib/db/env-bootstrap";

import fs from "node:fs";
import path from "node:path";
import { ContentStatus, PrismaClient } from "@prisma/client";
import { contentMap, loadNpGeneratedBatches } from "@legacy-client/data/lessons/index";
import { getPathwayLesson, listPathwayLessonSlugBatch } from "@/lib/lessons/pathway-lesson-loader";
import { loadAdminDashboardStats } from "@/lib/admin/load-admin-dashboard-stats";

const TARGET_PATHWAYS = ["us-rn-nclex-rn", "ca-rn-nclex-rn", "us-lpn-nclex-pn", "ca-rpn-rex-pn"] as const;
const RN_PAIR = ["us-rn-nclex-rn", "ca-rn-nclex-rn"] as const;
const PN_PAIR = ["us-lpn-nclex-pn", "ca-rpn-rex-pn"] as const;
const REPORT_DIR = path.join(process.cwd(), "data/reports/pathway-lessons");

const HISTORICAL_MARKER = "historical RN/RPN lesson restored from legacy corpus";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 110);
}

function inferTierFromLegacyId(id: string): "rn" | "rpn" | "other" {
  if (/-rn$|-basics-rn$|-rn-/.test(id)) return "rn";
  if (/-rpn$|-basics-rpn$|-rpn-/.test(id)) return "rpn";
  return "other";
}

function lessonBodyLen(sections: unknown): number {
  if (!Array.isArray(sections)) return 0;
  return sections.reduce((acc, s) => acc + (typeof (s as { body?: string }).body === "string" ? (s as { body: string }).body.length : 0), 0);
}

function normalizeTitleKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

/** Strip common country/tier slug prefixes so US/CA pairs can be compared. */
function normalizeSlugForCrossPathway(slug: string, pathwayId: string): string {
  let s = slug.toLowerCase();
  const strip = [
    /^us-rn-/,
    /^ca-rn-/,
    /^us-lpn-/,
    /^ca-rpn-/,
    /^nclex-rn-/,
    /^nclex-pn-/,
  ];
  for (const re of strip) s = s.replace(re, "");
  return s;
}

async function loadCatalogSlugSets(): Promise<Record<string, Set<string>>> {
  const p = path.join(process.cwd(), "src/content/pathway-lessons/catalog.json");
  const data = JSON.parse(fs.readFileSync(p, "utf8")) as { pathways?: Record<string, { lessons?: Array<{ slug?: string }> }> };
  const out: Record<string, Set<string>> = {};
  for (const pid of TARGET_PATHWAYS) {
    const lessons = data.pathways?.[pid]?.lessons ?? [];
    out[pid] = new Set(lessons.map((l) => slugify(String(l.slug ?? ""))).filter(Boolean));
  }
  return out;
}

async function main() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const prisma = new PrismaClient();

  await loadNpGeneratedBatches();
  let legacyRnRaw = 0;
  let legacyRpnRaw = 0;
  for (const id of Object.keys(contentMap as Record<string, unknown>)) {
    const tier = inferTierFromLegacyId(id);
    if (tier === "rn") legacyRnRaw += 1;
    else if (tier === "rpn") legacyRpnRaw += 1;
  }

  /** Valid legacy: same assembly + length check as recover-rn-rpn-historical-lessons.ts */
  let legacyRnValid = 0;
  let legacyRpnValid = 0;
  for (const [id, lessonRaw] of Object.entries(contentMap as Record<string, unknown>)) {
    const tier = inferTierFromLegacyId(id);
    if (tier === "other") continue;
    const lesson = lessonRaw as Record<string, unknown>;
    const cellularObj = lesson.cellular as { content?: unknown } | undefined;
    const cellular = typeof cellularObj?.content === "string" ? cellularObj.content : "";
    const stringifyList = (label: string, v: unknown) =>
      !Array.isArray(v) || v.length === 0 ? `${label}: not specified.` : `${label}:\n${v.map((x) => `- ${String(x)}`).join("\n")}`;
    const totalBody = `${cellular}\n${stringifyList("Risk factors", lesson.riskFactors)}\n${stringifyList("Diagnostics", lesson.diagnostics)}`.trim();
    if (totalBody.length < 200) continue;
    if (tier === "rn") legacyRnValid += 1;
    else legacyRpnValid += 1;
  }

  const dbRows = await prisma.pathwayLesson.findMany({
    where: { pathwayId: { in: [...TARGET_PATHWAYS] }, locale: "en" },
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      seoDescription: true,
      sections: true,
      status: true,
    },
  });
  const published = dbRows.filter((r) => r.status === ContentStatus.PUBLISHED);

  const catalogSlugs = await loadCatalogSlugSets();

  const importSummaryPath = path.join(REPORT_DIR, "rn-rpn-import-summary.json");
  const importSummary = fs.existsSync(importSummaryPath)
    ? (JSON.parse(fs.readFileSync(importSummaryPath, "utf8")) as {
        inserted?: number;
        updated?: number;
        skipped?: number;
        candidateRows?: number;
      })
    : null;

  const byPathwayPublished = Object.fromEntries(
    TARGET_PATHWAYS.map((pid) => [pid, published.filter((r) => r.pathwayId === pid).length]),
  ) as Record<(typeof TARGET_PATHWAYS)[number], number>;

  const combinedRn = byPathwayPublished["us-rn-nclex-rn"] + byPathwayPublished["ca-rn-nclex-rn"];
  const combinedPn = byPathwayPublished["us-lpn-nclex-pn"] + byPathwayPublished["ca-rpn-rex-pn"];

  const slugSets: Record<string, Set<string>> = {};
  for (const pid of TARGET_PATHWAYS) {
    slugSets[pid] = new Set(published.filter((r) => r.pathwayId === pid).map((r) => r.slug));
  }

  const rnUnion = new Set([...slugSets["us-rn-nclex-rn"], ...slugSets["ca-rn-nclex-rn"]]);
  const rnIntersection = [...slugSets["us-rn-nclex-rn"]].filter((s) => slugSets["ca-rn-nclex-rn"].has(s));
  const pnUnion = new Set([...slugSets["us-lpn-nclex-pn"], ...slugSets["ca-rpn-rex-pn"]]);
  const pnIntersection = [...slugSets["us-lpn-nclex-pn"]].filter((s) => slugSets["ca-rpn-rex-pn"].has(s));

  const normKeysRn = new Map<string, string[]>();
  for (const pid of RN_PAIR) {
    for (const r of published.filter((x) => x.pathwayId === pid)) {
      const k = normalizeSlugForCrossPathway(r.slug, pid);
      const arr = normKeysRn.get(k) ?? [];
      arr.push(`${pid}::${r.slug}`);
      normKeysRn.set(k, arr);
    }
  }
  const normKeysPn = new Map<string, string[]>();
  for (const pid of PN_PAIR) {
    for (const r of published.filter((x) => x.pathwayId === pid)) {
      const k = normalizeSlugForCrossPathway(r.slug, pid);
      const arr = normKeysPn.get(k) ?? [];
      arr.push(`${pid}::${r.slug}`);
      normKeysPn.set(k, arr);
    }
  }
  const nearDupRnCross = [...normKeysRn.entries()].filter(([, v]) => v.length > 1).length;
  const nearDupPnCross = [...normKeysPn.entries()].filter(([, v]) => v.length > 1).length;

  const titleCounts = new Map<string, string[]>();
  for (const r of published) {
    const k = `${r.pathwayId}::${normalizeTitleKey(r.title)}`;
    const arr = titleCounts.get(k) ?? [];
    arr.push(r.slug);
    titleCounts.set(k, arr);
  }
  const duplicateTitleWithinPathway = [...titleCounts.entries()].filter(([, slugs]) => slugs.length > 1).length;

  const rnUnionAcrossPair = new Set([...slugSets["us-rn-nclex-rn"], ...slugSets["ca-rn-nclex-rn"]]).size;
  const pnUnionAcrossPair = new Set([...slugSets["us-lpn-nclex-pn"], ...slugSets["ca-rpn-rex-pn"]]).size;

  const reconciliation = {
    generatedAt: new Date().toISOString(),
    authoritativeModel: {
      description:
        "Use one vocabulary per metric. Do not compare 'unique legacy lessons' directly to 'total published DB rows' without accounting for US+CA pathway duplication.",
      definitions: {
        historicalUniqueRnLessonsInLegacyContentMap:
          "Count of distinct legacy contentMap keys whose id matches RN tier (regex). Same lesson is intentionally materialized as TWO pathway_lessons rows (US + CA).",
        historicalUniqueRpnPnLessonsInLegacyContentMap:
          "Count of distinct legacy contentMap keys whose id matches RPN tier. Same lesson is TWO rows (US LPN + CA REx-PN).",
        legacySourceRowsForImporter:
          "historical RN unique × 2 pathways + historical RPN unique × 2 pathways = valid legacy rows fed to importer (after body-length filter), plus catalog + materialized candidates.",
        recoveredFromSourceOperations:
          "Sum of inserted + updated rows in the recovery run (one operation per pathway+slug key). Comparable to 'import batch touches', not unique canonical lessons.",
        recoveredInserted:
          "New pathway_lessons rows created by recovery (from import summary when present).",
        recoveredUpdated:
          "Existing rows replaced when incoming legacy content scored higher quality.",
        recoveredSkipped:
          "Existing row kept because incoming was not materially richer.",
        finalLivePublishedRowsByPathway:
          "Count of PUBLISHED rows in pathway_lessons for locale=en per pathwayId — this is what hubs and routes surface.",
        finalLivePublishedRowsCombinedRn:
          "us-rn + ca-rn published row counts. Expect ~2× unique RN lessons if US/CA slugs align, plus catalog-only rows.",
        finalLivePublishedRowsCombinedRpnPn:
          "us-lpn + ca-rpn published row counts.",
        uniqueSlugWithinPathway:
          "Equals published count per pathway (slug unique per pathway+locale).",
        uniqueCanonicalSlugAcrossCountryPair:
          "Union of slugs across the two RN pathways (or PN pair) — approximates distinct topics when US/CA use identical slugs.",
      },
    },
    legacyContentMap: {
      rawRnKeysCount: legacyRnRaw,
      rawRpnKeysCount: legacyRpnRaw,
      validRnLessonsAfterRecoveryFilter: legacyRnValid,
      validRpnPnLessonsAfterRecoveryFilter: legacyRpnValid,
      note: "valid* matches the recovery script's body-length >= 200 rule for legacy assembly.",
    },
    importer: importSummary
      ? {
          candidateRows: importSummary.candidateRows,
          inserted: importSummary.inserted,
          updated: importSummary.updated,
          skipped: importSummary.skipped,
          recoveredFromSourceOperations: (importSummary.inserted ?? 0) + (importSummary.updated ?? 0),
          explanation:
            "recoveredFromSourceOperations (3088) is NOT comparable to 587+922. It counts DB upserts per pathway+slug. 587/922 are unique legacy IDs per tier.",
        }
      : { note: "rn-rpn-import-summary.json missing — run ops:recover-rn-rpn-historical --apply" },
    publishedDatabase: {
      byPathway: byPathwayPublished,
      combinedRnPublishedRows: combinedRn,
      combinedRpnPnPublishedRows: combinedPn,
      combinedFourPathways: combinedRn + combinedPn,
    },
    crossPathwaySlugAlignment: {
      rn: {
        usSlugCount: slugSets["us-rn-nclex-rn"].size,
        caSlugCount: slugSets["ca-rn-nclex-rn"].size,
        identicalSlugPairCount: rnIntersection.length,
        unionSlugCount: rnUnion.size,
        normalizedSlugGroupsWithMultipleRows: nearDupRnCross,
      },
      pn: {
        usSlugCount: slugSets["us-lpn-nclex-pn"].size,
        caSlugCount: slugSets["ca-rpn-rex-pn"].size,
        identicalSlugPairCount: pnIntersection.length,
        unionSlugCount: pnUnion.size,
        normalizedSlugGroupsWithMultipleRows: nearDupPnCross,
      },
      whyMismatchWithHistoricalEstimate: [
        "587 + 922 count unique legacy IDs, not DB rows.",
        "Importer maps each legacy lesson to two pathway rows (US + CA), so expected minimum DB rows from legacy alone ≈ 2×(587+922) = 3018 if every slug pairs.",
        "Additional rows come from catalog.json and materialized JSON that are not in legacy contentMap.",
        "recoveredFromSourceOperations ≈ inserted+updated counts each pathway+slug once per operation — not unique lessons.",
      ],
    },
    reconcileCheck: {
      legacyValidRnTimesTwoApprox: legacyRnValid * 2,
      legacyValidRpnTimesTwoApprox: legacyRpnValid * 2,
      legacyDoubledTotalApprox: legacyRnValid * 2 + legacyRpnValid * 2,
      publishedFourPathwaysTotal: combinedRn + combinedPn,
      deltaExplainedBy:
        "catalog/materialized-only lessons, slug mismatches, pre-existing rows, and counting operations vs rows",
    },
  };

  fs.writeFileSync(path.join(REPORT_DIR, "rn-rpn-count-reconciliation.json"), JSON.stringify(reconciliation, null, 2));

  const pathwayInventory: Record<
    string,
    {
      pathwayId: string;
      publishedDbTotal: number;
      uniqueSlugCount: number;
      duplicateSlugWithinPathway: number;
      uniqueConceptCountDerivable: {
        identicalSlugCountInSiblingCountryPathway: number | null;
        unionSlugCountAcrossCountryPair: number | null;
      };
      nearDuplicateTitleGroupsInPathway: number;
      importedHistoricalCount: number;
      curatedCatalogSlugOverlapCount: number;
      curatedModernCount: number;
      generatedHeuristicCount: number;
      otherUncategorizedCount: number;
    }
  > = {};

  for (const pid of TARGET_PATHWAYS) {
    const rows = published.filter((r) => r.pathwayId === pid);
    const hist = rows.filter((r) => r.seoDescription.includes(HISTORICAL_MARKER));
    const catalogSet = catalogSlugs[pid];
    let curatedOverlap = 0;
    let curatedModern = 0;
    for (const r of rows) {
      if (catalogSet.has(r.slug)) {
        curatedOverlap += 1;
        if (!r.seoDescription.includes(HISTORICAL_MARKER)) curatedModern += 1;
      }
    }
    const generated = rows.filter(
      (r) =>
        /\bgenerated\b|ai-generated|synthetic/i.test(r.seoDescription) || /\bgenerated\b/i.test(r.title),
    );
    const otherUncategorized = Math.max(0, rows.length - hist.length - curatedModern - generated.length);
    const pair = pid === "us-rn-nclex-rn" || pid === "ca-rn-nclex-rn" ? RN_PAIR : PN_PAIR;
    const sibling = pair.find((p) => p !== pid) ?? pid;
    const siblingSlugs = slugSets[sibling];
    let identicalAcrossPair = 0;
    for (const r of rows) {
      if (siblingSlugs.has(r.slug)) identicalAcrossPair += 1;
    }
    const unionAcross =
      pid === "us-rn-nclex-rn" || pid === "ca-rn-nclex-rn" ? rnUnionAcrossPair : pid === "us-lpn-nclex-pn" || pid === "ca-rpn-rex-pn" ? pnUnionAcrossPair : null;

    pathwayInventory[pid] = {
      pathwayId: pid,
      publishedDbTotal: rows.length,
      uniqueSlugCount: new Set(rows.map((r) => r.slug)).size,
      duplicateSlugWithinPathway: rows.length - new Set(rows.map((r) => r.slug)).size,
      uniqueConceptCountDerivable: {
        identicalSlugCountInSiblingCountryPathway: identicalAcrossPair,
        unionSlugCountAcrossCountryPair: unionAcross,
      },
      nearDuplicateTitleGroupsInPathway: [...titleCounts.entries()].filter(([k]) => k.startsWith(`${pid}::`)).filter(([, slugs]) => slugs.length > 1).length,
      importedHistoricalCount: hist.length,
      curatedCatalogSlugOverlapCount: curatedOverlap,
      curatedModernCount: curatedModern,
      generatedHeuristicCount: generated.length,
      otherUncategorizedCount: otherUncategorized,
    };
  }

  fs.writeFileSync(
    path.join(REPORT_DIR, "rn-rpn-unique-inventory.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        note: "unionSlugCountAcrossCountryPair is identical for both pathways in the RN pair (or PN pair): distinct slugs when US+CA hubs are merged by slug identity.",
        duplicateTitleGroupsTotalAcrossRnRpn: duplicateTitleWithinPathway,
        pathways: pathwayInventory,
      },
      null,
      2,
    ),
  );

  const THIN_BODY = 2500;
  const qualityRows: Array<{
    pathwayId: string;
    slug: string;
    classification:
      | "imported-rich"
      | "imported-thin"
      | "curated-modern"
      | "generated"
      | "duplicate-candidate"
      | "needs-enrichment";
    bodyChars: number;
    rationale: string;
  }> = [];

  const duplicateCandidateKeys = new Set(
    [...titleCounts.entries()].filter(([, slugs]) => slugs.length > 1).map(([k]) => k),
  );

  for (const r of published) {
    const bodyChars = lessonBodyLen(r.sections);
    const isHist = r.seoDescription.includes(HISTORICAL_MARKER);
    const inCatalog = catalogSlugs[r.pathwayId].has(r.slug);
    const isGen = /\bgenerated\b|ai-generated|synthetic/i.test(r.seoDescription) || /\bgenerated\b/i.test(r.title);
    const titleKey = `${r.pathwayId}::${normalizeTitleKey(r.title)}`;
    const dupCand = duplicateCandidateKeys.has(titleKey);

    let classification: (typeof qualityRows)[0]["classification"];
    let rationale: string;

    if (isGen) {
      classification = "generated";
      rationale = "seo/title matches generated heuristic";
    } else if (dupCand && bodyChars < THIN_BODY) {
      classification = "duplicate-candidate";
      rationale = "same normalized title as another row in this pathway with thin body — review before merge";
    } else if (isHist && bodyChars >= THIN_BODY) {
      classification = "imported-rich";
      rationale = "legacy marker + substantive body";
    } else if (isHist) {
      classification = "imported-thin";
      rationale = "legacy marker but body below richness threshold";
    } else if (inCatalog && !isHist) {
      classification = "curated-modern";
      rationale = "catalog slug, no legacy marker";
    } else if (bodyChars < THIN_BODY) {
      classification = "needs-enrichment";
      rationale = "thin body, not clearly legacy/catalog";
    } else {
      classification = "curated-modern";
      rationale = "substantive non-legacy row (treated as curated/modern)";
    }

    qualityRows.push({ pathwayId: r.pathwayId, slug: r.slug, classification, bodyChars, rationale });
  }

  const byClass = (c: (typeof qualityRows)[0]["classification"]) => qualityRows.filter((x) => x.classification === c).length;

  fs.writeFileSync(
    path.join(REPORT_DIR, "rn-rpn-content-quality-audit.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        thresholds: { thinBodyCharsMax: THIN_BODY, duplicateCandidateRequiresSameNormalizedTitle: true },
        summaryCounts: {
          importedRich: byClass("imported-rich"),
          importedThin: byClass("imported-thin"),
          curatedModern: byClass("curated-modern"),
          generated: byClass("generated"),
          duplicateCandidate: byClass("duplicate-candidate"),
          needsEnrichment: byClass("needs-enrichment"),
        },
        consolidationRules:
          "Do not merge across pathways. Prefer richer body when titles collide within pathway. Demote thin duplicates only when clearly redundant.",
        sampleRows: qualityRows.slice(0, 400),
        totalRowsClassified: qualityRows.length,
      },
      null,
      2,
    ),
  );

  const detailRouteTotals: Record<string, number> = {};
  const randomChecks: Array<{ pathwayId: string; slug: string; resolved: boolean }> = [];
  for (const pid of TARGET_PATHWAYS) {
    let skip = 0;
    let total = 0;
    const slugs: string[] = [];
    for (;;) {
      const batch = await listPathwayLessonSlugBatch(pid, skip, 300, "en");
      if (batch.length === 0) break;
      total += batch.length;
      slugs.push(...batch.map((b) => b.slug));
      skip += batch.length;
      if (batch.length < 300) break;
    }
    detailRouteTotals[pid] = total;
    for (const slug of slugs.slice(0, 8)) {
      const hit = await getPathwayLesson(pid, slug, "en");
      randomChecks.push({ pathwayId: pid, slug, resolved: Boolean(hit) });
    }
  }

  const stats = await loadAdminDashboardStats();
  const pathwayPublishedDbTotal = await prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED, locale: "en" } });
  const adminMatchesDb = stats?.totals.pathwayLessonsPublished === pathwayPublishedDbTotal;

  const orphanOutsideTarget = await prisma.pathwayLesson.count({
    where: {
      locale: "en",
      status: ContentStatus.PUBLISHED,
      pathwayId: { notIn: [...TARGET_PATHWAYS] },
    },
  });

  const orphanRnRpnDraft = await prisma.pathwayLesson.count({
    where: {
      locale: "en",
      pathwayId: { in: [...TARGET_PATHWAYS] },
      status: { not: ContentStatus.PUBLISHED },
    },
  });

  const topicGaps = {
    note: "True gaps are only after consolidation — thin duplicates are not topic gaps.",
    legacyUniqueRn: legacyRnValid,
    legacyUniqueRpnPn: legacyRpnValid,
    approximateDistinctTopicsRn: rnUnionAcrossPair,
    approximateDistinctTopicsRpnPn: pnUnionAcrossPair,
    suggestedNextBatchOrder: [
      "consolidation: review duplicate-candidate + same-title groups in rn-rpn-content-quality-audit.json",
      "enrichment: imported-thin + needs-enrichment rows",
      "true-gap lesson building: only where union slug coverage is still below exam needs after enrichment",
    ] as const,
  };

  fs.writeFileSync(
    path.join(REPORT_DIR, "rn-rpn-post-reconcile-validation.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        hubTotalsByPathway: byPathwayPublished,
        detailRouteTotalsByPathway: detailRouteTotals,
        randomResolutionChecks: { total: randomChecks.length, failed: randomChecks.filter((x) => !x.resolved).length, rows: randomChecks },
        adminOpsCountMatch: adminMatchesDb,
        pathwayLessonsPublishedEn: pathwayPublishedDbTotal,
        staticParams: {
          lessonDetailDynamicParams:
            "generateStaticParams returns [] for lesson detail; dynamicParams=true — routes validated via loader + random checks, not build-time enumeration.",
        },
        orphanChecks: {
          publishedNonTargetPathways: orphanOutsideTarget,
          draftOrNonPublishedInRnRpnTargetPathways: orphanRnRpnDraft,
        },
        targetedBuildingAfterReconciliation: topicGaps,
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect();

  const summary = {
    finalAuthoritativeRnTotal: combinedRn,
    finalAuthoritativeRpnPnTotal: combinedPn,
    explanation:
      "Authoritative totals = sum of published EN rows in US+CA RN pathways (and US+CA PN pathways). Compare unique legacy IDs vs row totals using rn-rpn-count-reconciliation.json (not the same units).",
    rawRecoveredSourceRowCount: importSummary?.candidateRows ?? null,
    uniqueRecoveredLessonEstimate: {
      legacyRnUnique: legacyRnValid,
      legacyRpnPnUnique: legacyRpnValid,
      distinctSlugsRnUnionUsCa: rnUnionAcrossPair,
      distinctSlugsPnUnionUsCa: pnUnionAcrossPair,
    },
    recoveredFromSourceOperations: importSummary ? (importSummary.inserted ?? 0) + (importSummary.updated ?? 0) : null,
    safeDuplicateCandidates: byClass("duplicate-candidate"),
    lessonsNeedingEnrichment: byClass("imported-thin") + byClass("needs-enrichment"),
    trueTopicGapsRemaining: "deferred — see topicGaps in report; prioritize dedupe/enrichment before new builds",
    recommendedNextBatch: topicGaps.suggestedNextBatchOrder,
  };

  console.log(JSON.stringify({ phase: "reconcile-complete", summary, topicGaps }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
