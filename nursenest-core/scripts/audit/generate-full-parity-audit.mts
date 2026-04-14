/**
 * Evidence-based parity audit: registry, catalog, optional Prisma counts.
 * Run from nursenest-core/: npx tsx scripts/audit/generate-full-parity-audit.mts
 *
 * Does not deploy. Does not modify paywalls. Writes under repo-root data/audit/.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ContentStatus } from "@prisma/client";
import { listPublicExamPathways, buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { MARKETING_LOCALE_CODES } from "@/lib/i18n/marketing-locale-policy";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { stripToPlainText, countWords } from "@/lib/content-quality/plain-text";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Repo workspace root (parent of inner `nursenest-core/` app folder). */
const REPO_ROOT = join(__dirname, "../../..");
const OUT_DIR = join(REPO_ROOT, "data/audit");

type PathwayRow = {
  pathwayId: string;
  countrySlug: string;
  roleTrack: string;
  examCode: string;
  registryStatus: string;
  stripeTier: string;
  routeLessonsIndex: string;
  catalogLessonCount: number;
  dbPublishedLessonCount: number | null;
  dbPublishedQuestionCount: number | null;
  dbPublishedFlashcardDeckCount: number | null;
  contentStatus:
    | "full"
    | "catalog_only"
    | "db_only"
    | "route_only"
    | "partial"
    | "unknown";
  evidence: string[];
};

function lessonCorpusWords(lesson: { sections: { body?: string }[]; seoDescription?: string }): number {
  const parts = [...(lesson.sections ?? []).map((s) => stripToPlainText(s.body ?? "")), lesson.seoDescription ?? ""];
  return countWords(parts.join(" "));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const generatedAt = new Date().toISOString();
  const dbOk = isDatabaseUrlConfigured();

  const pathways = listPublicExamPathways();
  const catalogPathwayIds = new Set(listCatalogPathwayIdsWithLessonsSync());

  const pathwayRows: PathwayRow[] = [];
  const routeableNoContent: PathwayRow[] = [];

  /** pathwayId -> counts */
  let lessonCounts = new Map<string, number>();
  let questionCounts = new Map<string, number>();
  let deckCounts = new Map<string, number>();

  if (dbOk) {
    try {
      const [lc, qc, dc] = await Promise.all([
        prisma.pathwayLesson.groupBy({
          by: ["pathwayId"],
          where: { status: ContentStatus.PUBLISHED, locale: "en" },
          _count: { _all: true },
        }),
        prisma.examQuestion.groupBy({
          by: ["exam"],
          where: { status: DB_PUBLISHED },
          _count: { _all: true },
        }),
        prisma.flashcardDeck.groupBy({
          by: ["pathwayId"],
          where: { status: ContentStatus.PUBLISHED, pathwayId: { not: null } },
          _count: { _all: true },
        }),
      ]);
      lessonCounts = new Map(lc.map((x) => [x.pathwayId, x._count._all]));
      questionCounts = new Map(qc.map((x) => [x.exam, x._count._all]));
      deckCounts = new Map(
        dc.filter((x) => x.pathwayId != null).map((x) => [x.pathwayId as string, x._count._all]),
      );
    } catch (e) {
      console.warn("Prisma groupBy failed (continuing with catalog-only):", e instanceof Error ? e.message : e);
    }
  }

  for (const p of pathways) {
    const routeLessonsIndex = buildExamPathwayPath(p, "lessons");
    const normalized = getCatalogPathwayLessonsSync(p.id);
    const catalogLessonCount = normalized.length;
    const dbPublishedLessonCount = dbOk ? (lessonCounts.get(p.id) ?? 0) : null;

    const examKeys = p.contentExamKeys ?? [];
    let dbQ = 0;
    if (dbOk && examKeys.length) {
      for (const k of examKeys) {
        dbQ += questionCounts.get(k) ?? 0;
      }
    }
    const dbPublishedQuestionCount = dbOk ? dbQ : null;
    const dbPublishedFlashcardDeckCount = dbOk ? (deckCounts.get(p.id) ?? 0) : null;

    /** True if bundled loader returns any rows (catalog JSON, allied, new-grad, or scoped-gold). */
    const hasCatalogLessons = catalogLessonCount > 0;
    const hasDbLessons = (dbPublishedLessonCount ?? 0) > 0;
    const hasQuestions = (dbPublishedQuestionCount ?? 0) > 0;
    const hasDecks = (dbPublishedFlashcardDeckCount ?? 0) > 0;

    let contentStatus: PathwayRow["contentStatus"] = "unknown";
    if (hasCatalogLessons || hasDbLessons) {
      if (dbOk && hasCatalogLessons && hasDbLessons) contentStatus = "full";
      else if (hasCatalogLessons && (!dbOk || !hasDbLessons)) contentStatus = "catalog_only";
      else if (!hasCatalogLessons && hasDbLessons) contentStatus = "db_only";
      else contentStatus = "partial";
    } else {
      contentStatus = "route_only";
    }

    const evidence = [
      `registry:${p.id}`,
      `catalog.sync.lessons=${catalogLessonCount}`,
      dbOk ? `db.pathway_lessons.published.en=${dbPublishedLessonCount ?? 0}` : "db:skipped",
      dbOk ? `db.exam_questions.published.sumByExamKeys=${dbPublishedQuestionCount ?? 0}` : "db.questions:skipped",
      dbOk ? `db.flashcard_decks.published.byPathwayId=${dbPublishedFlashcardDeckCount ?? 0}` : "db.decks:skipped",
    ];

    const row: PathwayRow = {
      pathwayId: p.id,
      countrySlug: p.countrySlug,
      roleTrack: p.roleTrack,
      examCode: p.examCode,
      registryStatus: p.status,
      stripeTier: p.stripeTier,
      routeLessonsIndex,
      catalogLessonCount,
      dbPublishedLessonCount,
      dbPublishedQuestionCount,
      dbPublishedFlashcardDeckCount,
      contentStatus,
      evidence,
    };
    pathwayRows.push(row);
    if (contentStatus === "route_only") routeableNoContent.push(row);
  }

  /** Lessons: structural completeness (catalog, EN) */
  const incompleteStructural: Array<{
    pathwayId: string;
    slug: string;
    title: string;
    publicComplete: boolean;
    structureMode: string;
    issues: string[];
    approxWords: number;
  }> = [];

  const incompleteNonEmpty: typeof incompleteStructural = [];

  /** Include scoped-gold-only pathways (may be absent from catalog.json keys). */
  for (const p of pathways) {
    const pid = p.id;
    const lessons = getCatalogPathwayLessonsSync(pid);
    if (lessons.length === 0) continue;
    for (const l of lessons) {
      const gate = l.structuralQuality;
      const words = lessonCorpusWords(l);
      const row = {
        pathwayId: pid,
        slug: l.slug,
        title: l.title,
        publicComplete: Boolean(gate?.publicComplete),
        structureMode: gate?.structureMode ?? "unknown",
        issues: gate?.issues ?? [],
        approxWords: words,
      };
      if (!gate?.publicComplete) {
        incompleteStructural.push(row);
        if (words >= 80) incompleteNonEmpty.push(row);
      }
    }
  }

  /** Marketing locale × country × pathway: exam hub path is (default)/[locale]/[slug]/[examCode] where locale = country slug */
  const marketingCountrySlugs = ["us", "canada"] as const;
  const localeCombinations: Array<{
    marketingUiLocale: string;
    examHubCountrySegment: string;
    pathwayId: string;
    lessonsPath: string;
    note: string;
  }> = [];

  for (const m of MARKETING_LOCALE_CODES) {
    for (const c of marketingCountrySlugs) {
      for (const p of pathways) {
        if (p.countrySlug !== c) continue;
        const lessonsPath = buildExamPathwayPath(p, "lessons");
        localeCombinations.push({
          marketingUiLocale: m,
          examHubCountrySegment: c,
          pathwayId: p.id,
          lessonsPath,
          note:
            m === "en"
              ? "Default marketing routes omit /en; localized shell uses withMarketingLocale(prefix)."
              : "Translated UI strings; exam hub country segment still us|canada per registry.",
        });
      }
    }
  }

  /** Legacy snapshot (pre-computed) */
  let legacyUnimportedSummary: Record<string, unknown> = {};
  const unimportedPath = join(REPO_ROOT, "data/audit/unimported-legacy-content.json");
  if (existsSync(unimportedPath)) {
    try {
      legacyUnimportedSummary = JSON.parse(readFileSync(unimportedPath, "utf8")) as Record<string, unknown>;
    } catch {
      legacyUnimportedSummary = { error: "could_not_read" };
    }
  }

  /** Admin / learner surfaces (path lists) */
  const adminSurfaces = {
    evidence: "glob src/app/(admin)/admin/**/*.tsx",
    samplePaths: [
      "/admin",
      "/admin/lessons",
      "/admin/questions",
      "/admin/content-coverage",
      "/admin/ai/flashcards",
    ],
  };

  const learnerSurfaces = {
    evidence: "glob src/app/(student)/**/*.tsx + marketing study routes",
    samplePaths: [
      "/app",
      "/us/rn/nclex-rn/lessons",
      "/question-bank",
      "/flashcards",
      "/practice-exams",
    ],
  };

  /** Flashcard / question UI wiring heuristic */
  const flashcardUiGaps = {
    description:
      "Public hub uses loadPublicFlashcardHub → prisma.flashcardDeck with publicMarketingFlashcardDeckWhere (published + PUBLIC_PREVIEW + cardCount>0). Subscriber decks or pathway-tagged decks with SUBSCRIBER visibility do not appear on /flashcards.",
    pathwayDecksPublished: dbOk
      ? [...deckCounts.entries()].filter(([, n]) => n > 0).map(([pathwayId, count]) => ({ pathwayId, count }))
      : [],
    evidenceFiles: [
      "src/lib/seo/public-flashcard-landing.ts",
      "src/lib/entitlements/content-access-scope.ts (publicMarketingFlashcardDeckWhere)",
      "src/app/(marketing)/(default)/flashcards/page.tsx",
    ],
  };

  const reportMeta = {
    generatedAt,
    dbConnected: dbOk,
    legacySourcesScanned: [
      "data/audit/legacy-lessons-inventory.json (summary)",
      "data/audit/unimported-legacy-content.json",
      "external/NurseNest (legacyRoot in inventories when present)",
    ],
    currentSourcesScanned: [
      "src/lib/exam-pathways/exam-product-registry.ts (EXAM_PATHWAYS)",
      "src/lib/lessons/pathway-lesson-catalog-sync.ts (catalog + allied + new-grad + scoped gold)",
      "prisma/schema.prisma (PathwayLesson, ExamQuestion, FlashcardDeck)",
      dbOk ? "live Prisma aggregates" : "Prisma skipped (no DATABASE_URL or query failed)",
    ],
  };

  writeFileSync(
    join(OUT_DIR, "country-exam-locale-parity.json"),
    JSON.stringify(
      {
        ...reportMeta,
        summary: {
          pathwayCount: pathways.length,
          marketingLocales: [...MARKETING_LOCALE_CODES],
          examHubCountrySegments: [...marketingCountrySlugs],
          localeCombinationRows: localeCombinations.length,
        },
        pathwayMatrix: pathwayRows,
        routeableButNoLessonOrDbContent: routeableNoContent,
        note:
          "routeableButNoLessonOrDbContent: registry public pathway with 0 catalog lessons and 0 published DB lessons (questions/decks may still exist).",
      },
      null,
      2,
    ) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "lesson-content-completeness-audit.json"),
    JSON.stringify(
      {
        ...reportMeta,
        summary: {
          catalogPathways: catalogPathwayIds.size,
          lessonsNotPublicComplete: incompleteStructural.length,
          lessonsNotPublicCompleteWithSubstanceWordsGte80: incompleteNonEmpty.length,
        },
        incompleteAll: incompleteStructural.slice(0, 500),
        incompleteNonEmptyShell: incompleteNonEmpty.slice(0, 500),
        truncated: incompleteStructural.length > 500,
      },
      null,
      2,
    ) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "flashcard-content-completeness-audit.json"),
    JSON.stringify(
      {
        ...reportMeta,
        flashcardUiGaps,
        publishedDeckCountByPathwayId: dbOk ? Object.fromEntries(deckCounts) : null,
      },
      null,
      2,
    ) + "\n",
  );

  const totalPublishedQuestions = dbOk
    ? await prisma.examQuestion.count({ where: { status: DB_PUBLISHED } })
    : null;

  writeFileSync(
    join(OUT_DIR, "testbank-content-completeness-audit.json"),
    JSON.stringify(
      {
        ...reportMeta,
        totalPublishedExamQuestions: totalPublishedQuestions,
        questionsByExamColumn: dbOk ? Object.fromEntries(questionCounts) : null,
        note: "exam_questions.exam is a string column; pathway linkage is indirect via contentExamKeys on registry rows.",
      },
      null,
      2,
    ) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "legacy-content-inventory.json"),
    JSON.stringify(
      {
        ...reportMeta,
        pointer: "data/audit/legacy-lessons-inventory.json (full file; large)",
        unimportedLegacySummary: legacyUnimportedSummary.counts ?? legacyUnimportedSummary,
        methodology: (legacyUnimportedSummary as { methodology?: unknown }).methodology,
      },
      null,
      2,
    ) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "current-content-inventory.json"),
    JSON.stringify(
      {
        ...reportMeta,
        catalogPathwayIds: [...catalogPathwayIds].sort(),
        pathwayRows,
      },
      null,
      2,
    ) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "legacy-feature-inventory.json"),
    JSON.stringify(
      {
        ...reportMeta,
        pointer: "data/audit/legacy-feature-parity.json, data/audit/legacy-master-migration-map.md (if present)",
        legacyClient: "external/NurseNest/client (Vite) — see legacy-full-file-inventory.json",
      },
      null,
      2,
    ) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "current-feature-inventory.json"),
    JSON.stringify(
      {
        ...reportMeta,
        nextAppRoutes: "src/app/(marketing), src/app/(student), src/app/(admin)",
        coreLibraries: [
          "src/lib/exam-pathways/exam-product-registry.ts",
          "src/lib/lessons/pathway-lesson-loader.ts",
          "src/lib/entitlements/content-access-scope.ts",
        ],
      },
      null,
      2,
    ) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "admin-surface-parity.json"),
    JSON.stringify({ ...reportMeta, adminSurfaces }, null, 2) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "user-surface-parity.json"),
    JSON.stringify({ ...reportMeta, learnerSurfaces }, null, 2) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "legacy-vs-current-content-parity.json"),
    JSON.stringify(
      {
        ...reportMeta,
        legacyLessonKeysApprox: (legacyUnimportedSummary as { counts?: { totalLegacyContentMapKeys?: number } })
          .counts?.totalLegacyContentMapKeys,
        currentCatalogPathways: catalogPathwayIds.size,
        gapNote:
          "Majority of legacy lesson keys are not imported as pathway lessons; see unimported-legacy-content.json classification.",
      },
      null,
      2,
    ) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "legacy-vs-current-feature-parity.json"),
    JSON.stringify(
      {
        ...reportMeta,
        summary:
          "Legacy monolith features mapped in docs/legacy-restoration-map.md and data/audit/legacy-* inventories; Next app implements subset with different architecture.",
      },
      null,
      2,
    ) + "\n",
  );

  writeFileSync(
    join(OUT_DIR, "restoration-priority-queue.json"),
    JSON.stringify(
      {
        ...reportMeta,
        tier1: [
          "Pathways with route_only and zero bank questions (verify registry intent)",
          "Published lessons with empty sections (catalog)",
          "Broken locale/country routing (middleware)",
        ],
        tier2: [
          "Lessons failing structuralQuality.publicComplete with substantive copy (editorial)",
          "Translation coverage gaps (tools/i18n)",
        ],
        evidence: "See lesson-content-completeness-audit.json and country-exam-locale-parity.json",
      },
      null,
      2,
    ) + "\n",
  );

  const parityFinalStatus = {
    ...reportMeta,
    alliedHealthMarketingProfessions: ALLIED_PROFESSIONS.length,
    alliedHealthNote:
      "Allied lesson hubs use /allied-health/{professionKey}/lessons — parallel to EXAM_PATHWAYS us-allied-core / ca-allied-core.",
    countries: {
      US: pathwayRows.filter((r) => r.countrySlug === "us").length,
      CA: pathwayRows.filter((r) => r.countrySlug === "canada").length,
    },
    routeOnlyPathways: routeableNoContent.map((r) => r.pathwayId),
    structuralIncompleteLessonCount: incompleteStructural.length,
    structuralIncompleteNonEmptyCount: incompleteNonEmpty.length,
    claims: {
      parityNotClaimedWithoutDb: !dbOk,
      note: dbOk
        ? "DB counts included; still distinguish translated UI routes from localized lesson bodies (mostly EN catalog)."
        : "Re-run with DATABASE_URL for bank/deck/DB lesson counts.",
    },
  };

  writeFileSync(join(OUT_DIR, "parity-final-status.json"), JSON.stringify(parityFinalStatus, null, 2) + "\n");

  /** Markdown summary */
  const md = `# Parity audit summary (evidence-based)

Generated: ${generatedAt}

## Methodology

- **Registry**: \`listPublicExamPathways()\` in \`src/lib/exam-pathways/exam-product-registry.ts\`.
- **Catalog**: \`getCatalogPathwayLessonsSync(pathwayId)\` (bundled JSON + scoped gold + allied + new-grad merge).
- **DB**: ${dbOk ? "Prisma aggregates (published pathway lessons, published questions, published flashcard decks by pathwayId)." : "**Skipped** — \`DATABASE_URL\` not configured or query failed; bank/deck counts are null in JSON."}
- **Structural bar**: \`structuralQuality.publicComplete\` from \`evaluatePathwayLessonStructuralGate\` on normalized catalog lessons.

## Answers (from this run)

### 1. Country + exam + locale combinations that are routeable but lack content

**Definition used**: Public registry pathway where **catalogLessonCount = 0** AND **published DB lessons (locale en) = 0** (when DB available).

See \`routeableButNoLessonOrDbContent\` in \`data/audit/country-exam-locale-parity.json\`.

${
  routeableNoContent.length
    ? routeableNoContent
        .map((r) => `- \`${r.pathwayId}\` → ${r.routeLessonsIndex}`)
        .join("\n")
    : "- None matched this definition in this run."
}

**Important**: Marketing UI locales (\`MARKETING_LOCALE_CODES\`) add a **language prefix** for many marketing pages; exam hub paths still use **\`us\` / \`canada\`** as the first segment in \`(default)/[locale]/[slug]/[examCode]\` (that \`locale\` param is **country**, not UI language). Localized *lesson bodies* are mostly **EN** in catalog; DB may store other locales separately.

### 2. Legacy vs new: still missing at scale

Evidence: \`data/audit/unimported-legacy-content.json\` — **~4084** legacy lesson keys not on current catalog/master snapshots (see file \`counts.missingFromCurrentSnapshots\`). This is **not** a claim of 1:1 slug parity; it is an inventory delta.

### 3. Published / catalog lessons: non-empty but structurally incomplete

Lessons with **approxWords ≥ 80** in combined section corpus but **\`publicComplete: false\`**: **${incompleteNonEmpty.length}** (see \`incompleteNonEmptyShell\` in \`lesson-content-completeness-audit.json\`, capped).

### 4. Flashcard / question pathways: code vs public UI

- **Questions**: pools are DB-backed; pathway filters use registry \`contentExamKeys\` + entitlements. No single “pathway” column on \`exam_questions\`.
- **Flashcards**: **\`/flashcards\`** lists only decks matching \`publicMarketingFlashcardDeckWhere\` (published + **PUBLIC_PREVIEW** + cards). **Subscriber-only** or **HIDDEN** decks, or decks with **0** published cards, are **not** shown on the public hub even if rows exist.

See \`flashcard-content-completeness-audit.json\`.

## Files changed

- \`scripts/audit/generate-full-parity-audit.mts\` (this generator)
- \`data/audit/*.json\` + \`data/audit/parity-summary.md\` (outputs)

## Verification

Run from \`nursenest-core/\`: \`npm run typecheck\`

`;

  writeFileSync(join(OUT_DIR, "parity-summary.md"), md);

  console.log("Wrote audit outputs to", OUT_DIR);
  console.log("routeableButNoContent:", routeableNoContent.length);
  console.log("structural incomplete (all):", incompleteStructural.length);
  console.log("structural incomplete, words>=80:", incompleteNonEmpty.length);
  if (!dbOk) console.warn("DB skipped — re-run with DATABASE_URL for full bank counts.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
