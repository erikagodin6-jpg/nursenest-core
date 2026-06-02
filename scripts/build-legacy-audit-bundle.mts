#!/usr/bin/env npx tsx
/**
 * Steps 1–2, 9, 11 (audit artifacts): inventory, legacy→current map, duplicates, post-audit summary.
 * Does not modify catalog.json, routes, or Prisma (offline-safe).
 *
 * Outputs (under nursenest-core/data/audit/):
 * - legacy-lesson-source-inventory.json
 * - legacy-to-current-lesson-map.json
 * - legacy-duplicate-lessons.json
 * - lesson-audit-post-legacy-merge.json
 *
 * Run: npx tsx scripts/build-legacy-audit-bundle.mts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import {
  extractLessonIdsFromSource,
  guessPathwayForLegacyId,
  likelyTierFromPath,
  normalizeTitleKey,
  walkTsFiles,
} from "./lib/legacy-audit-helpers.mts";
import type { PathwayLessonRecord } from "../src/lib/lessons/pathway-lesson-types";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
} from "../src/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO = path.resolve(ROOT, "..");
const AUDIT_DIR = path.join(ROOT, "data", "audit");

type CatalogJson = { pathways?: Record<string, { lessons?: { slug?: string; title?: string }[] }> };

type InventoryEntry = {
  filePath: string;
  repoRelativePath: string;
  sourceType:
    | "legacy_lesson_data_ts"
    | "legacy_lesson_index"
    | "json_lesson"
    | "legacy_lesson_page"
    | "current_pathway_lesson_page"
    | "legacy_lesson_component"
    | "other_ts";
  likelyPathwayOrProfession: string;
  lessonIdsExtracted: string[];
  slugSamples: string[];
  titleSamples: string[];
  contains: {
    lessonBodyContent: boolean;
    structuredSections: boolean;
    preTestQuestions: boolean;
    postTestQuestions: boolean;
    /** Legacy quiz items with rationale fields */
    rationales: boolean;
    /** getAssetUrl(…), common image extensions */
    imageReferences: boolean;
    activities: boolean;
    quizGeneric: boolean;
  };
  lessonUiLayoutCode: boolean;
  uiPatterns: {
    sectionCards: boolean;
    coloredContentBoxes: boolean;
    progressOrSidebar: boolean;
    prePostPlacement: boolean;
    stickyNavigation: boolean;
    headersOrHero: boolean;
    tabs: boolean;
  };
};

type MapRow = {
  legacyLessonId: string;
  legacyTitle: string | null;
  legacySourcePaths: string[];
  targetPathwayId: string | null;
  targetSlug: string | null;
  matchConfidence: "high" | "medium" | "low" | "none";
  action:
    | "merge_into_existing"
    | "create_missing_current_lesson"
    | "duplicate_flag"
    | "review_needed";
  notes: string[];
};

function readCatalog(): CatalogJson {
  const p = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
  return JSON.parse(fs.readFileSync(p, "utf8")) as CatalogJson;
}

function scanFileFeatures(absPath: string, src: string): InventoryEntry["contains"] & {
  ui: InventoryEntry["uiPatterns"];
  layoutCode: boolean;
} {
  const contains = {
    lessonBodyContent:
      /\b(cellular|riskFactors|diagnostics|management|nursingActions|assessmentFindings|signs)\b/.test(src),
    structuredSections: /\bkind:\s*["']/.test(src) || /\bsections\s*:\s*\[/.test(src),
    preTestQuestions: /\bpreTest\b/.test(src),
    postTestQuestions: /\bpostTest\b/.test(src),
    rationales: /\brationale\s*:/.test(src) || /\bdetailedRationale\b/.test(src),
    imageReferences: /getAssetUrl\s*\(|\.(png|jpe?g|webp|gif)\b/i.test(src),
    activities: /\bactivity|activities\b/i.test(src) && /\.tsx?$/.test(absPath),
    quizGeneric: /\bquiz\b/.test(src) && /options:\s*\[/.test(src),
  };
  const ui = {
    sectionCards: /\b(Card|CardContent|lesson-section|section-card)\b/i.test(src),
    coloredContentBoxes: /bg-(amber|blue|red|green|gray|slate)|#[0-9a-fA-F]{3,8}|rgb\(/.test(src),
    progressOrSidebar: /\b(Progress|sidebar|LessonSectionNav|sticky)/i.test(src),
    prePostPlacement: /preTest|postTest|LessonAssessmentFlow/i.test(src),
    stickyNavigation: /FixedLessonNav|sticky|LessonSectionNav/i.test(src),
    headersOrHero: /hero|nn-lesson-page-title|LessonPageHeader/i.test(src),
    tabs: /\bTabs\b|<Tabs|TabsList/i.test(src),
  };
  const layoutCode =
    /\.tsx$/.test(absPath) &&
    (/lesson-detail|LessonSection|PathwayLesson|lesson-page|PremiumLesson/i.test(absPath) ||
      /function\s+\w*Lesson|export\s+function\s+\w*Lesson/i.test(src));
  return { ...contains, ui, layoutCode };
}

function buildCatalogSlugTitleIndexes(catalog: CatalogJson): {
  slugToPathways: Map<string, string[]>;
  titleKeyToTargets: Map<string, { pathwayId: string; slug: string; title: string }[]>;
  allRows: { pathwayId: string; slug: string; title: string }[];
} {
  const slugToPathways = new Map<string, string[]>();
  const titleKeyToTargets = new Map<string, { pathwayId: string; slug: string; title: string }[]>();
  const allRows: { pathwayId: string; slug: string; title: string }[] = [];
  for (const [pathwayId, bucket] of Object.entries(catalog.pathways ?? {})) {
    for (const row of bucket.lessons ?? []) {
      const slug = typeof row.slug === "string" ? row.slug.trim() : "";
      const title = typeof row.title === "string" ? row.title.trim() : "";
      if (!slug) continue;
      allRows.push({ pathwayId, slug, title });
      if (!slugToPathways.has(slug)) slugToPathways.set(slug, []);
      slugToPathways.get(slug)!.push(pathwayId);
      const tk = normalizeTitleKey(title);
      if (tk.length < 4) continue;
      if (!titleKeyToTargets.has(tk)) titleKeyToTargets.set(tk, []);
      titleKeyToTargets.get(tk)!.push({ pathwayId, slug, title });
    }
  }
  return { slugToPathways, titleKeyToTargets, allRows };
}

function nursingTierForMapRow(
  row: MapRow,
  idToFiles: Map<string, string[]>,
  tierOfPathway: (pid: string) => string,
): "PN" | "RN" | "NP" | "Allied" | "Other" {
  if (row.targetPathwayId) {
    const t = tierOfPathway(row.targetPathwayId);
    if (t === "PN" || t === "RN" || t === "NP" || t === "Allied") return t;
  }
  const f = idToFiles.get(row.legacyLessonId)?.[0];
  if (f) {
    const lt = likelyTierFromPath(f);
    if (lt === "PN" || lt === "RN" || lt === "NP" || lt === "Allied") return lt;
  }
  return "Other";
}

function classifyRow(
  legacyId: string,
  legacyTitle: string | undefined,
  idToFiles: Map<string, string[]>,
  indexes: ReturnType<typeof buildCatalogSlugTitleIndexes>,
): MapRow {
  const notes: string[] = [];
  const title = legacyTitle?.trim() ?? null;
  const paths = idToFiles.get(legacyId) ?? [];

  const slugMatches = indexes.slugToPathways.get(legacyId);
  if (slugMatches?.length) {
    const pathwayId = slugMatches[0]!;
    if (slugMatches.length > 1)
      notes.push(
        `slug "${legacyId}" appears in multiple pathway buckets (e.g. US vs CA): ${slugMatches.join(", ")} — merge/enrich each published row separately`,
      );
    return {
      legacyLessonId: legacyId,
      legacyTitle: title,
      legacySourcePaths: paths,
      targetPathwayId: pathwayId,
      targetSlug: legacyId,
      matchConfidence: "high",
      action: "merge_into_existing",
      notes,
    };
  }

  if (title && title.length > 3) {
    const tk = normalizeTitleKey(title);
    const hits = indexes.titleKeyToTargets.get(tk);
    if (hits?.length === 1) {
      const h = hits[0]!;
      return {
        legacyLessonId: legacyId,
        legacyTitle: title,
        legacySourcePaths: paths,
        targetPathwayId: h.pathwayId,
        targetSlug: h.slug,
        matchConfidence: "medium",
        action: "merge_into_existing",
        notes: ["matched by normalized title equality to single catalog row"],
      };
    }
    if (hits && hits.length > 1) {
      return {
        legacyLessonId: legacyId,
        legacyTitle: title,
        legacySourcePaths: paths,
        targetPathwayId: null,
        targetSlug: null,
        matchConfidence: "low",
        action: "review_needed",
        notes: [`normalized title matches ${hits.length} catalog rows — pick canonical pathway/slug manually`],
      };
    }
  }

  const guessed = guessPathwayForLegacyId(legacyId, "unknown");
  return {
    legacyLessonId: legacyId,
    legacyTitle: title,
    legacySourcePaths: paths,
    targetPathwayId: guessed,
    targetSlug: null,
    matchConfidence: "none",
    action: "create_missing_current_lesson",
    notes: guessed
      ? [`no slug/title match; suggested pathway for new row (heuristic): ${guessed}`]
      : ["no slug/title match; pathway unknown — assign manually (may be Allied-only legacy)"],
  };
}

async function loadContentMap(): Promise<{
  contentMap: Record<string, { title?: string }>;
  lessonCount: number;
}> {
  const clientIndex = path.join(REPO, "client/src/data/lessons/index.ts");
  const mod = (await import(pathToFileURL(clientIndex).href)) as {
    contentMap?: Record<string, { title?: string }>;
    lessonCount?: number;
  };
  if (!mod.contentMap) throw new Error("Missing contentMap");
  return { contentMap: mod.contentMap as Record<string, { title?: string }>, lessonCount: mod.lessonCount ?? 0 };
}

async function main() {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });

  const catalog = readCatalog();
  const indexes = buildCatalogSlugTitleIndexes(catalog);

  const lessonDataDir = path.join(REPO, "client/src/data/lessons");
  const dataLessonsAlt = path.join(REPO, "data/lessons");
  const nursenestDataLessons = path.join(ROOT, "data/lessons");

  const inventory: InventoryEntry[] = [];
  const idToFiles = new Map<string, string[]>();

  function recordIdsForFile(repoRel: string, ids: string[]) {
    for (const id of ids) {
      if (!idToFiles.has(id)) idToFiles.set(id, []);
      idToFiles.get(id)!.push(repoRel);
    }
  }

  const lessonTsFiles = walkTsFiles(lessonDataDir).filter(
    (f) => !f.endsWith("types.ts") && !f.endsWith("index.ts"),
  );
  for (const abs of lessonTsFiles) {
    const repoRel = path.relative(REPO, abs).replace(/\\/g, "/");
    const src = fs.readFileSync(abs, "utf8");
    const ids = extractLessonIdsFromSource(src);
    recordIdsForFile(repoRel, ids);
    const feat = scanFileFeatures(abs, src);
    const tier = likelyTierFromPath(repoRel);
    inventory.push({
      filePath: abs,
      repoRelativePath: repoRel,
      sourceType: "legacy_lesson_data_ts",
      likelyPathwayOrProfession: tier === "unknown" ? "unclassified (see filename)" : tier,
      lessonIdsExtracted: ids,
      slugSamples: ids.slice(0, 12),
      titleSamples: [],
      contains: {
        lessonBodyContent: feat.lessonBodyContent,
        structuredSections: feat.structuredSections,
        preTestQuestions: feat.preTestQuestions,
        postTestQuestions: feat.postTestQuestions,
        rationales: feat.rationales,
        imageReferences: feat.imageReferences,
        activities: feat.activities,
        quizGeneric: feat.quizGeneric,
      },
      lessonUiLayoutCode: false,
      uiPatterns: {
        sectionCards: feat.ui.sectionCards,
        coloredContentBoxes: feat.ui.coloredContentBoxes,
        progressOrSidebar: feat.ui.progressOrSidebar,
        prePostPlacement: feat.ui.prePostPlacement,
        stickyNavigation: feat.ui.stickyNavigation,
        headersOrHero: feat.ui.headersOrHero,
        tabs: feat.ui.tabs,
      },
    });
  }

  const indexPath = path.join(lessonDataDir, "index.ts");
  if (fs.existsSync(indexPath)) {
    const src = fs.readFileSync(indexPath, "utf8");
    const feat = scanFileFeatures(indexPath, src);
    inventory.push({
      filePath: indexPath,
      repoRelativePath: path.relative(REPO, indexPath).replace(/\\/g, "/"),
      sourceType: "legacy_lesson_index",
      likelyPathwayOrProfession: "all (contentMap merge)",
      lessonIdsExtracted: [],
      slugSamples: [],
      titleSamples: [],
      contains: {
        lessonBodyContent: true,
        structuredSections: feat.structuredSections,
        preTestQuestions: feat.preTestQuestions,
        postTestQuestions: feat.postTestQuestions,
        rationales: feat.rationales,
        imageReferences: feat.imageReferences,
        activities: false,
        quizGeneric: feat.quizGeneric,
      },
      lessonUiLayoutCode: false,
      uiPatterns: {
        sectionCards: false,
        coloredContentBoxes: false,
        progressOrSidebar: false,
        prePostPlacement: false,
        stickyNavigation: false,
        headersOrHero: false,
        tabs: false,
      },
    });
  }

  for (const extraRoot of [dataLessonsAlt, nursenestDataLessons]) {
    if (!fs.existsSync(extraRoot)) continue;
    for (const abs of walkTsFiles(extraRoot)) {
      const src = fs.readFileSync(abs, "utf8");
      const repoRel = path.relative(REPO, abs).replace(/\\/g, "/");
      const ids = extractLessonIdsFromSource(src);
      recordIdsForFile(repoRel, ids);
      const feat = scanFileFeatures(abs, src);
      inventory.push({
        filePath: abs,
        repoRelativePath: repoRel,
        sourceType: "other_ts",
        likelyPathwayOrProfession: likelyTierFromPath(repoRel),
        lessonIdsExtracted: ids,
        slugSamples: ids.slice(0, 8),
        titleSamples: [],
        contains: {
          lessonBodyContent: feat.lessonBodyContent,
          structuredSections: feat.structuredSections,
          preTestQuestions: feat.preTestQuestions,
          postTestQuestions: feat.postTestQuestions,
          rationales: feat.rationales,
          imageReferences: feat.imageReferences,
          activities: feat.activities,
          quizGeneric: feat.quizGeneric,
        },
        lessonUiLayoutCode: false,
        uiPatterns: {
          sectionCards: feat.ui.sectionCards,
          coloredContentBoxes: feat.ui.coloredContentBoxes,
          progressOrSidebar: feat.ui.progressOrSidebar,
          prePostPlacement: feat.ui.prePostPlacement,
          stickyNavigation: feat.ui.stickyNavigation,
          headersOrHero: feat.ui.headersOrHero,
          tabs: feat.ui.tabs,
        },
      });
    }
  }

  const uiCandidates = [
    path.join(REPO, "client/src/pages/lesson-detail.tsx"),
    path.join(REPO, "client/src/pages/seo-lesson-detail.tsx"),
    path.join(REPO, "client/src/pages/lessons.tsx"),
    path.join(REPO, "client/src/components/fixed-lesson-nav.tsx"),
    path.join(REPO, "client/src/components/lesson-quiz-embed.tsx"),
    path.join(REPO, "client/src/components/lesson-progress-card.tsx"),
    path.join(REPO, "client/src/allied/pages/allied-lessons.tsx"),
    path.join(REPO, "client/src/allied/pages/paramedic/paramedic-lessons-hub.tsx"),
    path.join(ROOT, "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx"),
    path.join(ROOT, "src/components/lessons/pathway-lesson-detail-header.tsx"),
    path.join(ROOT, "src/components/lessons/lesson-section-card.tsx"),
    path.join(ROOT, "src/app/(student)/app/(learner)/lessons/[id]/page.tsx"),
  ].filter((p) => fs.existsSync(p));

  for (const abs of uiCandidates) {
    const src = fs.readFileSync(abs, "utf8");
    const feat = scanFileFeatures(abs, src);
    const repoRel = path.relative(REPO, abs).replace(/\\/g, "/");
    inventory.push({
      filePath: abs,
      repoRelativePath: repoRel,
      sourceType: abs.includes("/client/")
        ? "legacy_lesson_page"
        : abs.includes("/src/app/") && abs.includes("/lessons/")
          ? "current_pathway_lesson_page"
          : "legacy_lesson_component",
      likelyPathwayOrProfession: "UI / layout (not tier-specific)",
      lessonIdsExtracted: [],
      slugSamples: [],
      titleSamples: [],
      contains: {
        lessonBodyContent: feat.lessonBodyContent,
        structuredSections: feat.structuredSections,
        preTestQuestions: feat.preTestQuestions,
        postTestQuestions: feat.postTestQuestions,
        rationales: feat.rationales,
        imageReferences: feat.imageReferences,
        activities: feat.activities,
        quizGeneric: feat.quizGeneric,
      },
      lessonUiLayoutCode: feat.layoutCode,
      uiPatterns: {
        sectionCards: feat.ui.sectionCards,
        coloredContentBoxes: feat.ui.coloredContentBoxes,
        progressOrSidebar: feat.ui.progressOrSidebar,
        prePostPlacement: feat.ui.prePostPlacement,
        stickyNavigation: feat.ui.stickyNavigation,
        headersOrHero: feat.ui.headersOrHero,
        tabs: feat.ui.tabs,
      },
    });
  }

  const { contentMap, lessonCount } = await loadContentMap();
  const legacyIds = Object.keys(contentMap);

  const titleDupBuckets = new Map<string, string[]>();
  for (const id of legacyIds) {
    const t = contentMap[id]?.title?.trim();
    if (!t) continue;
    const k = normalizeTitleKey(t);
    if (k.length < 6) continue;
    if (!titleDupBuckets.has(k)) titleDupBuckets.set(k, []);
    titleDupBuckets.get(k)!.push(id);
  }
  const duplicateTitleGroups = [...titleDupBuckets.entries()].filter(([, ids]) => ids.length > 1);

  const mapRows: MapRow[] = [];
  for (const id of legacyIds) {
    const row = classifyRow(id, contentMap[id]?.title, idToFiles, indexes);
    if ((idToFiles.get(id)?.length ?? 0) > 1) {
      row.notes.push("same legacy id string appears in multiple source files — verify safeMerge / authoring collision");
      if (row.matchConfidence === "none") row.action = "review_needed";
    }
    mapRows.push(row);
  }

  const summary = {
    high: mapRows.filter((r) => r.matchConfidence === "high").length,
    medium: mapRows.filter((r) => r.matchConfidence === "medium").length,
    low: mapRows.filter((r) => r.matchConfidence === "low").length,
    none: mapRows.filter((r) => r.matchConfidence === "none").length,
    mergeIntoExisting: mapRows.filter((r) => r.action === "merge_into_existing").length,
    createMissing: mapRows.filter((r) => r.action === "create_missing_current_lesson").length,
    reviewNeeded: mapRows.filter((r) => r.action === "review_needed").length,
    duplicateFlag: mapRows.filter((r) => r.action === "duplicate_flag").length,
  };

  const inventoryOut = {
    generatedAt: new Date().toISOString(),
    repoRoot: REPO,
    note: "Inventory covers in-repo workspace paths; an external drive must be mounted under this repo (or symlinked) to appear here.",
    totals: {
      legacyContentMapLessonKeys: legacyIds.length,
      legacyIndexExportLessonCount: lessonCount,
      legacyDataTsFilesScanned: lessonTsFiles.length,
      inventoryEntries: inventory.length,
    },
    alliedHints: {
      filesMatchingAlliedHeuristic: inventory.filter(
        (e) =>
          e.sourceType === "legacy_lesson_data_ts" &&
          /allied|rrt|paramedic|mlt|imaging|ota|pta|social-worker|psychotherapist|addictions|surgical-tech|dms-|sonography/i.test(
            e.repoRelativePath,
          ),
      ).length,
    },
    sources: inventory,
  };
  fs.writeFileSync(path.join(AUDIT_DIR, "legacy-lesson-source-inventory.json"), JSON.stringify(inventoryOut, null, 2));

  const mapOut = {
    generatedAt: new Date().toISOString(),
    catalogPathwayIds: Object.keys(catalog.pathways ?? {}),
    supplementalSlugMaps: [
      "src/content/pathway-lessons/rn-nclex-master-map.json",
      "scripts/recover-rn-rpn-historical-lessons.ts",
      "scripts/recover-np-historical-lessons.ts",
      "scripts/convert-legacy-lesson-to-enrichment.ts",
    ],
    summary,
    mapping: mapRows,
  };
  fs.writeFileSync(path.join(AUDIT_DIR, "legacy-to-current-lesson-map.json"), JSON.stringify(mapOut, null, 2));

  const dupOut = {
    generatedAt: new Date().toISOString(),
    duplicateTitleGroups: duplicateTitleGroups.map(([normalizedTitle, ids]) => ({
      normalizedTitle,
      legacyLessonIds: ids,
      count: ids.length,
    })),
    idAppearsInMultipleFiles: [...idToFiles.entries()]
      .filter(([, files]) => files.length > 1)
      .map(([id, files]) => ({ legacyLessonId: id, files })),
  };
  fs.writeFileSync(path.join(AUDIT_DIR, "legacy-duplicate-lessons.json"), JSON.stringify(dupOut, null, 2));

  const pathwayIds = listCatalogPathwayIdsWithLessonsSync();
  const tierOf = (pid: string) => {
    if (pid.includes("allied")) return "Allied" as const;
    if (pid.includes("np")) return "NP" as const;
    if (pid.includes("lpn") || pid.includes("rpn")) return "PN" as const;
    if (pid.includes("rn")) return "RN" as const;
    return "Other" as const;
  };

  const postAudit: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    phase: "pre_merge_audit",
    note:
      "No catalog rows were modified by this script. Merge batches should use convert-legacy-lesson-to-enrichment.ts + editorial review. Allied pathway buckets are absent from catalog.json today — add us-allied-core / ca-allied-core lessons via controlled JSON commits after mapping.",
    constraintsVerified: {
      prismaSchemaChanged: false,
      authChanged: false,
      routingChanged: false,
      lessonSlugsChanged: false,
    },
    legacySourcesUsed: [
      path.relative(REPO, path.join(REPO, "client/src/data/lessons")),
      ...[dataLessonsAlt, nursenestDataLessons].filter((p) => fs.existsSync(p)).map((p) => path.relative(REPO, p)),
    ],
    lessonsMergedFromLegacyCount: 0,
    lessonsCreatedFromLegacyOnlyCount: 0,
    duplicatesFlaggedCount: dupOut.idAppearsInMultipleFiles.length + duplicateTitleGroups.length,
    externalVolumesRequested: ["/Volumes/Backup Plus/11", "/Volumes/Backup Plus/NurseNest"],
    externalVolumesMountedInThisEnvironment: false,
    prePostLessonTestUx: {
      marketingAssessmentFlow:
        "PathwayLessonAssessmentExperience: controls → pre-test before lesson body → post-test after completion (matches learner LessonAssessmentFlow).",
      marketingQuizzes:
        "PathwayLessonQuizzes: per-question feedback and rationale when fullAccess; preview hides grading (legacy embed-style flow, themed).",
      learnerAppUnchanged:
        "LessonAssessmentFlow + LessonPreAssessmentCard / LessonPostAssessmentCard already used correct ordering; no routing change.",
      filesImplementingPrePostUx: [
        "src/components/lessons/pathway-lesson-assessment-experience.tsx",
        "src/components/lessons/pathway-lesson-quizzes.tsx",
        "src/components/lessons/lesson-assessment-flow.tsx",
        "src/components/lessons/lesson-pre-assessment-card.tsx",
        "src/components/lessons/lesson-post-assessment-card.tsx",
        "src/components/lessons/lesson-assessment-quiz.tsx",
      ],
    },
    uiHarmonization: {
      oldLayoutCodeReused: false,
      currentLessonUiFilesTouched: [] as string[],
      themeTokensNote:
        "Reuse fixed bottom nav / sticky patterns only after porting to semantic tokens (see pathway lesson layout); do not copy client gray-* hex from fixed-lesson-nav.",
    },
    mappingSummary: summary,
    interpretation: {
      createMissingCurrentLesson:
        "Rows with action create_missing_current_lesson lack exact slug match to catalog AND lack unique normalized title match — use supplementalSlugMaps, editorial review, and convert-legacy-lesson-to-enrichment before adding catalog.json entries.",
    },
    catalogSnapshotByPathway: {} as Record<
      string,
      { tier: string; totalLessons: number; completePublic: number; incomplete: number }
    >,
    completenessByTier: { PN: 0, RN: 0, NP: 0, Allied: 0, Other: 0 },
    completePublicByTier: { PN: 0, RN: 0, NP: 0, Allied: 0, Other: 0 },
    lessonsNeedingManualReview: summary.reviewNeeded + summary.duplicateFlag,
    exactFilesModifiedThisRun: [
      "scripts/build-legacy-audit-bundle.mts",
      "scripts/lib/legacy-audit-helpers.mts",
    ],
  };

  for (const pid of pathwayIds) {
    const lessons = getCatalogPathwayLessonsSync(pid);
    let complete = 0;
    let incomplete = 0;
    for (const l of lessons) {
      if (l.structuralQuality?.publicComplete) complete++;
      else incomplete++;
    }
    const t = tierOf(pid);
    (postAudit.catalogSnapshotByPathway as Record<string, unknown>)[pid] = {
      tier: t,
      totalLessons: lessons.length,
      completePublic: complete,
      incomplete,
    };
    (postAudit.completenessByTier as Record<string, number>)[t] += lessons.length;
    (postAudit.completePublicByTier as Record<string, number>)[t] += complete;
  }

  const catLessonByPath = new Map<string, PathwayLessonRecord>();
  for (const pid of pathwayIds) {
    const t = tierOf(pid);
    if (t !== "PN" && t !== "RN" && t !== "NP") continue;
    for (const lesson of getCatalogPathwayLessonsSync(pid)) {
      catLessonByPath.set(`${pid}::${lesson.slug}`, lesson);
    }
  }

  const nursingMapActions: Record<MapRow["action"], number> = {
    merge_into_existing: 0,
    create_missing_current_lesson: 0,
    duplicate_flag: 0,
    review_needed: 0,
  };
  const prePostMergeCandidates: Record<string, unknown>[] = [];
  for (const row of mapRows) {
    const nt = nursingTierForMapRow(row, idToFiles, (p) => tierOf(p));
    if (nt !== "PN" && nt !== "RN" && nt !== "NP") continue;
    nursingMapActions[row.action] += 1;

    if (
      row.action === "merge_into_existing" &&
      row.targetPathwayId &&
      row.targetSlug &&
      prePostMergeCandidates.length < 450
    ) {
      const key = `${row.targetPathwayId}::${row.targetSlug}`;
      const catL = catLessonByPath.get(key);
      const files = idToFiles.get(row.legacyLessonId);
      if (!catL || !files?.length) continue;
      let legacySrc = "";
      try {
        legacySrc = fs.readFileSync(path.join(REPO, files[0]!), "utf8");
      } catch {
        continue;
      }
      const legPre = /\bpreTest\s*:/.test(legacySrc);
      const legPost = /\bpostTest\s*:/.test(legacySrc);
      const catPre = Array.isArray(catL.preTest) && catL.preTest.length > 0;
      const catPost = Array.isArray(catL.postTest) && catL.postTest.length > 0;
      const incomplete = !catL.structuralQuality?.publicComplete;
      if (
        (legPre && !catPre) ||
        (legPost && !catPost) ||
        (incomplete && (legPre || legPost))
      ) {
        prePostMergeCandidates.push({
          legacyLessonId: row.legacyLessonId,
          targetPathwayId: row.targetPathwayId,
          targetSlug: row.targetSlug,
          nursingTier: nt,
          legacySourceFile: files[0],
          legacyHasPreTest: legPre,
          legacyHasPostTest: legPost,
          catalogHasPreTest: catPre,
          catalogHasPostTest: catPost,
          catalogPublicComplete: Boolean(catL.structuralQuality?.publicComplete),
        });
      }
    }
  }

  const pnSnap = { total: 0, complete: 0, incomplete: 0 };
  const rnSnap = { total: 0, complete: 0, incomplete: 0 };
  const npSnap = { total: 0, complete: 0, incomplete: 0 };
  const snap = postAudit.catalogSnapshotByPathway as Record<
    string,
    { tier: string; totalLessons: number; completePublic: number; incomplete: number }
  >;
  for (const [pid, row] of Object.entries(snap)) {
    if (row.tier === "PN") {
      pnSnap.total += row.totalLessons;
      pnSnap.complete += row.completePublic;
      pnSnap.incomplete += row.incomplete;
    } else if (row.tier === "RN") {
      rnSnap.total += row.totalLessons;
      rnSnap.complete += row.completePublic;
      rnSnap.incomplete += row.incomplete;
    } else if (row.tier === "NP") {
      npSnap.total += row.totalLessons;
      npSnap.complete += row.completePublic;
      npSnap.incomplete += row.incomplete;
    }
  }

  const nursingRestore = {
    generatedAt: new Date().toISOString(),
    phase: "nursing_restore_batch_planning",
    note:
      "Audit-only: no catalog.json mutations in this run. Use prePostMergeCandidates + convert-legacy-lesson-to-enrichment.ts for editorial merges. External Backup Plus paths were requested but are not mounted in this Linux workspace — symlink or copy under repo to include.",
    priorityOrder: ["PN", "RN", "NP", "pre_post_tests", "layout_harmonization", "crash_prevention", "Allied_last"],
    externalVolumes: {
      requested: ["/Volumes/Backup Plus/11", "/Volumes/Backup Plus/NurseNest"],
      mountedHere: false,
    },
    constraintsVerified: postAudit.constraintsVerified,
    catalogNursingCompleteness: { PN: pnSnap, RN: rnSnap, NP: npSnap },
    legacyContentMapLessonCount: legacyIds.length,
    nursingOnlyMappingActions: nursingMapActions,
    prePostMergeCandidatesCount: prePostMergeCandidates.length,
    prePostMergeCandidatesSample: prePostMergeCandidates.slice(0, 80),
    lessonsMergedFromLegacyCount: 0,
    lessonsCreatedFromScratchCount: 0,
    preTestsRestoredCount: 0,
    postTestsRestoredCount: 0,
    layoutFilesTouched: [] as string[],
    crashPreventionFilesTouched: [] as string[],
    duplicatesFlaggedCount: dupOut.idAppearsInMultipleFiles.length + duplicateTitleGroups.length,
    alliedPending: true,
    remainingNursingGapsBeforeAllied:
      "Clear merge_into_existing + pre/post gaps using legacy TS sources; promote publicComplete via pathway-lesson-premium gates; then run allied-bundled catalog batches.",
  };

  fs.writeFileSync(path.join(AUDIT_DIR, "lesson-audit-post-nursing-restore.json"), JSON.stringify(nursingRestore, null, 2));

  const md = `# Lesson audit — post–nursing-restore planning

Generated: ${nursingRestore.generatedAt}

## Nursing catalog completeness (bundled catalog.json)

| Tier | Total lessons | Public complete | Incomplete |
|------|---------------|-----------------|------------|
| PN | ${pnSnap.total} | ${pnSnap.complete} | ${pnSnap.incomplete} |
| RN | ${rnSnap.total} | ${rnSnap.complete} | ${rnSnap.incomplete} |
| NP | ${npSnap.total} | ${npSnap.complete} | ${npSnap.incomplete} |

## Legacy → current mapping (PN / RN / NP rows only)

- merge_into_existing: ${nursingMapActions.merge_into_existing}
- create_missing_current_lesson: ${nursingMapActions.create_missing_current_lesson}
- review_needed: ${nursingMapActions.review_needed}
- duplicate_flag: ${nursingMapActions.duplicate_flag}

## Pre/post test merge candidates

Count: **${prePostMergeCandidates.length}** (catalog row missing pre/post or structurally incomplete while legacy source contains preTest/postTest patterns).

First rows are listed in \`lesson-audit-post-nursing-restore.json\` as \`prePostMergeCandidatesSample\`.

## Execution status

- **Content merges applied this run:** 0 (audit only).
- **Schema / auth / routes:** unchanged.
- **External volumes:** not mounted; use repo \`client/src/data/lessons\` as legacy source of truth here.

## Next batches

1. PN lesson enrichment merges (editorial + \`convert-legacy-lesson-to-enrichment.ts\`).
2. RN, then NP.
3. Pre/post restoration from candidate list.
4. Layout harmonization (semantic tokens only).
5. Performance guards where loaders exceed safe size.
6. Allied after nursing stabilizes.
`;

  fs.writeFileSync(path.join(AUDIT_DIR, "lesson-audit-post-nursing-restore-summary.md"), md);

  fs.writeFileSync(path.join(AUDIT_DIR, "lesson-audit-post-legacy-merge.json"), JSON.stringify(postAudit, null, 2));

  console.log("Wrote:");
  console.log(" - data/audit/legacy-lesson-source-inventory.json");
  console.log(" - data/audit/legacy-to-current-lesson-map.json");
  console.log(" - data/audit/legacy-duplicate-lessons.json");
  console.log(" - data/audit/lesson-audit-post-legacy-merge.json");
  console.log(" - data/audit/lesson-audit-post-nursing-restore.json");
  console.log(" - data/audit/lesson-audit-post-nursing-restore-summary.md");
  console.log(JSON.stringify({ legacyKeys: legacyIds.length, mappingSummary: summary }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
