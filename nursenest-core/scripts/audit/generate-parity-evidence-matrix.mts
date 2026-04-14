#!/usr/bin/env npx tsx
/**
 * Evidence-based legacy ↔ current parity matrix (content vs feature separated).
 * Reads existing data/audit/*.json + capped filesystem scans. No DB writes.
 *
 * Run from nursenest-core/: npx tsx scripts/audit/generate-parity-evidence-matrix.mts
 * Output: repo-root data/audit/{legacy,current}-{content,feature}-inventory.json,
 *         legacy-vs-current-{content,feature}-parity.json,
 *         admin-surface-parity.json, user-surface-parity.json,
 *         restoration-priority-queue.json, parity-final-status.json, parity-summary.md
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { ContentStatus } from "@prisma/client";
import { listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { getMonorepoRoot } from "@/lib/monorepo-root";
import { getAllProgrammaticSlugs } from "@/lib/seo/programmatic-registry";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const APP_ROOT = join(__dirname, "../..");
const REPO_ROOT = join(APP_ROOT, "..");
const OUT = join(REPO_ROOT, "data", "audit");

export type ParityStatus = "matched" | "partial" | "missing" | "intentionally_skipped" | "obsolete";
export type Confidence = "high" | "medium" | "low";

function lessonParityStatus(lc: Record<string, number>): ParityStatus {
  const c = lc.C_notOnCatalogOrMaster ?? 0;
  if (c > 3000) return "partial";
  if (c > 0) return "partial";
  return "matched";
}

function mediumConfidence(before: number | null, after: number | null): Confidence {
  if (before == null || after == null) return "low";
  return "medium";
}

export type ParityMatrixItem = {
  category: string;
  subcategory: string;
  name: string;
  legacyExists: boolean;
  currentExists: boolean;
  status: ParityStatus;
  legacySourcePaths: string[];
  currentSourcePaths: string[];
  routes: string[];
  dataModelOrSource: string;
  beforeCount: number | null;
  currentCount: number | null;
  missingCount: number | null;
  confidence: Confidence;
  recommendedAction: string;
  notes: string;
};

function safeReadJson(path: string): Record<string, unknown> | null {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Capped recursive count of files matching extension under dir. */
function countFilesExt(rootDir: string, exts: Set<string>, maxFiles = 12000): number {
  let n = 0;
  const stack = [rootDir];
  while (stack.length && n < maxFiles) {
    const dir = stack.pop()!;
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (n >= maxFiles) break;
      const p = join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === ".next" || e.name === "dist") continue;
        stack.push(p);
      } else {
        const ext = e.name.includes(".") ? `.${e.name.split(".").pop()}` : "";
        if (exts.has(ext)) n += 1;
      }
    }
  }
  return n;
}

function rel(p: string): string {
  try {
    return relative(REPO_ROOT, p).replace(/\\/g, "/");
  } catch {
    return p;
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const generatedAt = new Date().toISOString();
  let gitHead = "unknown";
  try {
    gitHead = execSync("git rev-parse --short HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  } catch {
    /* ignore */
  }

  const monorepo = getMonorepoRoot();
  const clientRoot = join(monorepo, "client", "src");
  const legacyMirror = join(monorepo, "external", "NurseNest");
  const studentApp = join(APP_ROOT, "src", "app", "(student)");
  const adminApp = join(APP_ROOT, "src", "app", "(admin)", "admin");
  const unimported = safeReadJson(join(OUT, "unimported-legacy-content.json"));
  const counts = (unimported?.counts as Record<string, unknown> | undefined) ?? {};
  const legacyFlash = safeReadJson(join(OUT, "legacy-flashcards-inventory.json"));
  const legacyActivities = safeReadJson(join(OUT, "legacy-activities-inventory.json"));
  const legacyCase = safeReadJson(join(OUT, "legacy-case-studies-inventory.json"));
  const legacyCat = safeReadJson(join(OUT, "legacy-cat-source-inventory.json"));
  const currentCat = safeReadJson(join(OUT, "current-cat-source-inventory.json"));
  const legacyBlog = safeReadJson(join(OUT, "legacy-blog-inventory.json"));

  const totalLegacyLessonRows = (counts.totalLegacyLessonRows as number) ?? null;
  const missingFromSnapshots = (counts.missingFromCurrentSnapshots as number) ?? null;
  const careerQItems = (counts.careerQuestionItemsTotal as number) ?? null;
  const careerQFiles = (counts.careerQuestionJsonFiles as number) ?? null;
  const lessonClass = (counts.lessonClassification as Record<string, number> | undefined) ?? {};

  const pathwayIds = listCatalogPathwayIdsWithLessonsSync();
  let catalogLessonTotal = 0;
  for (const pid of pathwayIds) {
    catalogLessonTotal += getCatalogPathwayLessonsSync(pid).length;
  }
  const pathways = listPublicExamPathways();

  const programmaticSlugs = getAllProgrammaticSlugs().length;
  const dbOk = isDatabaseUrlConfigured();
  let dbPublishedLessons: number | null = null;
  let dbPublishedQuestions: number | null = null;
  let dbPublishedDecks: number | null = null;
  if (dbOk) {
    try {
      dbPublishedLessons = await prisma.pathwayLesson.count({
        where: { status: ContentStatus.PUBLISHED, locale: "en" },
      });
      dbPublishedQuestions = await prisma.examQuestion.count({ where: { status: DB_PUBLISHED } });
      dbPublishedDecks = await prisma.flashcardDeck.count({ where: { status: ContentStatus.PUBLISHED } });
    } catch {
      /* keep null */
    }
  }

  const clientLessonTsApprox = (counts.clientLessonTsFilesApprox as number) ?? countFilesExt(clientRoot, new Set([".ts", ".tsx"]), 8000);
  const legacyMirrorPresent = existsSync(legacyMirror);

  const meta = {
    schemaVersion: 3,
    generatedAt,
    gitHead,
    methodology:
      "Separated CONTENT parity from FEATURE parity. Counts from data/audit/unimported-legacy-content.json, pathway catalog sync, optional Prisma, and route scans — not claims without file evidence.",
    evidenceRootsScanned: [
      rel(clientRoot),
      rel(APP_ROOT),
      legacyMirrorPresent ? rel(legacyMirror) : "(external/NurseNest not mounted)",
      rel(OUT),
    ],
  };

  /** ---------- Legacy content inventory (what old stack exposed) ---------- */
  const legacyContentItems: ParityMatrixItem[] = [
    {
      category: "CONTENT",
      subcategory: "lessons",
      name: "Legacy lesson / content-map rows",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["client/src (Vite lesson maps)", "data/audit/unimported-legacy-content.json"],
      currentSourcePaths: ["nursenest-core/src/content/pathway-lessons/catalog.json", "pathway-lesson-catalog-sync.ts"],
      routes: ["/{country}/{role}/{exam}/lessons", "/allied-health/.../lessons"],
      dataModelOrSource: "Legacy content maps + JSON; current: bundled catalog + DB PathwayLesson",
      beforeCount: totalLegacyLessonRows,
      currentCount: catalogLessonTotal,
      missingCount: missingFromSnapshots,
      confidence: "high",
      recommendedAction: "Chunked imports + slug mapping for class C keys; see legacy-recovery-import-plan.json",
      notes: "Matched keys in unimported report: A/B/C buckets — majority class C not on catalog snapshots.",
    },
    {
      category: "CONTENT",
      subcategory: "questions",
      name: "Career / question JSON (legacy bank)",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["client career question JSON (see unimported counts)"],
      currentSourcePaths: ["prisma ExamQuestion", "src/lib/** question loaders"],
      routes: ["/app/.../questions", "/question-bank", "marketing question routes"],
      dataModelOrSource: "exam_questions table; exam column string",
      beforeCount: careerQItems,
      currentCount: dbPublishedQuestions,
      missingCount: careerQItems != null && dbPublishedQuestions != null ? Math.max(0, careerQItems - dbPublishedQuestions) : null,
      confidence: mediumConfidence(careerQItems, dbPublishedQuestions),
      recommendedAction: "Dedupe imports by stem_hash; align exam keys to registry contentExamKeys",
      notes: "Parity is not 1:1 row count — schema and dedupe differ from monolith JSON.",
    },
    {
      category: "CONTENT",
      subcategory: "flashcards",
      name: "Legacy flashcard TS modules",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["client/src/data/flashcards*.ts (see legacy-flashcards-inventory.json)"],
      currentSourcePaths: ["prisma FlashcardDeck / Flashcard", "admin/ai/flashcards"],
      routes: ["/app/.../flashcards", "/flashcards (marketing)"],
      dataModelOrSource: "flashcard_decks, flashcards",
      beforeCount: (legacyFlash?.summary as { flashcardTsFiles?: number } | undefined)?.flashcardTsFiles ?? null,
      currentCount: dbPublishedDecks,
      missingCount: null,
      confidence: "medium",
      recommendedAction: "Pipeline import with source_key dedupe; verify PUBLIC_PREVIEW vs subscriber decks",
      notes: (legacyFlash?.summary as { note?: string } | undefined)?.note ?? "",
    },
    {
      category: "CONTENT",
      subcategory: "activities",
      name: "Legacy learning activities",
      legacyExists: Array.isArray(legacyActivities?.entries) ? (legacyActivities.entries as unknown[]).length > 0 : true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["legacy-activities-inventory.json"],
      currentSourcePaths: ["src/app/(marketing)/**/activities**", "learner routes"],
      routes: [],
      dataModelOrSource: "Mixed — marketing + learner",
      beforeCount: Array.isArray(legacyActivities?.entries) ? (legacyActivities!.entries as unknown[]).length : null,
      currentCount: null,
      missingCount: null,
      confidence: "low",
      recommendedAction: "Map activity IDs to current hubs or intentionally skip if obsolete",
      notes: "Inventory from legacy scan; current surface differs (Next marketing shell).",
    },
    {
      category: "CONTENT",
      subcategory: "case_studies",
      name: "Legacy case studies",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["legacy-case-studies-inventory.json"],
      currentSourcePaths: ["pathway lessons / blog / admin content"],
      routes: [],
      dataModelOrSource: "n/a",
      beforeCount: Array.isArray(legacyCase?.entries) ? (legacyCase!.entries as unknown[]).length : null,
      currentCount: null,
      missingCount: null,
      confidence: "low",
      recommendedAction: "Crosswalk case study slugs to lesson or blog",
      notes: "",
    },
    {
      category: "CONTENT",
      subcategory: "blog",
      name: "Blog / articles",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["legacy-blog-inventory.json", "client blog TS"],
      currentSourcePaths: ["prisma BlogPost", "src/app/(marketing)/blog", "admin/blog/**"],
      routes: ["/blog", "/admin/blog"],
      dataModelOrSource: "BlogPost",
      beforeCount: (legacyBlog?.summary as { mergedUniqueFiles?: number } | undefined)?.mergedUniqueFiles ?? null,
      currentCount: null,
      missingCount: null,
      confidence: "medium",
      recommendedAction: "Use blog import + dedupe reports; E-E-A-T editorial dashboard",
      notes: "",
    },
    {
      category: "CONTENT",
      subcategory: "seo_programmatic",
      name: "Programmatic SEO pages",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["legacy programmatic / marketing"],
      currentSourcePaths: ["src/lib/seo/programmatic-registry.ts", "src/app/seo/[slug]"],
      routes: ["/{programmaticSlug}"],
      dataModelOrSource: "registry + static sections",
      beforeCount: null,
      currentCount: programmaticSlugs,
      missingCount: null,
      confidence: "high",
      recommendedAction: "Expand thin slugs per eeat-page-scores.json",
      notes: "",
    },
    {
      category: "CONTENT",
      subcategory: "translations",
      name: "Locale / educational overlays",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["client/public/i18n/*.json"],
      currentSourcePaths: ["nursenest-core/public/i18n", "tools/i18n", "educational-content-overlay"],
      routes: [],
      dataModelOrSource: "compile pipeline + DB overlays",
      beforeCount: null,
      currentCount: null,
      missingCount: null,
      confidence: "medium",
      recommendedAction: "Follow docs/i18n-architecture.md — no second runtime loader",
      notes: "",
    },
    {
      category: "CONTENT",
      subcategory: "cat_readiness",
      name: "CAT / readiness practice sources",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["legacy-cat-source-inventory.json"],
      currentSourcePaths: ["current-cat-source-inventory.json", "src/lib/practice-tests/**"],
      routes: ["/app/.../practice-tests", "marketing CAT entrypoints"],
      dataModelOrSource: "configs + exam sessions",
      beforeCount: (legacyCat?.entryCount as number) ?? (legacyCat?.files as unknown[] | undefined)?.length ?? null,
      currentCount: (currentCat?.entryCount as number) ?? (currentCat?.files as unknown[] | undefined)?.length ?? null,
      missingCount: null,
      confidence: "medium",
      recommendedAction: "Compare inventories in legacy-vs-current-cat parity (run audit:legacy-cat)",
      notes: "",
    },
  ];

  /** ---------- Current content inventory (canonical sources) ---------- */
  const currentContentItems: ParityMatrixItem[] = [
    {
      category: "CONTENT",
      subcategory: "catalog",
      name: "Bundled pathway lesson catalog",
      legacyExists: false,
      currentExists: true,
      status: "matched",
      legacySourcePaths: [],
      currentSourcePaths: [rel(join(APP_ROOT, "src/content/pathway-lessons/catalog.json")), "pathway-lesson-catalog-sync.ts"],
      routes: ["marketing + sitemap lesson detail"],
      dataModelOrSource: "catalog.json + scoped gold + allied merges",
      beforeCount: null,
      currentCount: catalogLessonTotal,
      missingCount: null,
      confidence: "high",
      recommendedAction: "Keep hub pagination; never ship full catalog to client",
      notes: `Pathways with lessons: ${pathwayIds.length}`,
    },
    {
      category: "CONTENT",
      subcategory: "db_lessons",
      name: "Published PathwayLesson rows (en)",
      legacyExists: false,
      currentExists: dbPublishedLessons != null,
      status: dbPublishedLessons != null && dbPublishedLessons > 0 ? "partial" : "partial",
      legacySourcePaths: [],
      currentSourcePaths: ["prisma/schema.prisma PathwayLesson"],
      routes: ["/admin/lessons"],
      dataModelOrSource: "pathway_lessons",
      beforeCount: null,
      currentCount: dbPublishedLessons,
      missingCount: null,
      confidence: dbOk ? "high" : "low",
      recommendedAction: "Align DB rows with catalog or document DB-only experiments",
      notes: dbOk ? "" : "DATABASE_URL absent — count not verified this run.",
    },
  ];

  /** ---------- Content parity (legacy vs current) ---------- */
  const contentParityItems: ParityMatrixItem[] = [
    {
      category: "CONTENT",
      subcategory: "lessons",
      name: "Lesson inventory parity (normalized keys)",
      legacyExists: true,
      currentExists: true,
      status: lessonParityStatus(lessonClass),
      legacySourcePaths: ["data/audit/unimported-legacy-content.json", "client lesson maps"],
      currentSourcePaths: ["pathway-lesson-catalog-sync.ts", "prisma PathwayLesson"],
      routes: ["/{country}/{role}/{exam}/lessons/{slug}"],
      dataModelOrSource: "Legacy content map keys vs catalog + DB",
      beforeCount: totalLegacyLessonRows,
      currentCount: catalogLessonTotal,
      missingCount: missingFromSnapshots,
      confidence: "high",
      recommendedAction: "RN-first chunked imports; dedupe; see restoration-priority-queue.json",
      notes: `Classification: A=${lessonClass.A_alreadyImportedMaterialized ?? "?"}, B_partial=${(lessonClass.B_partialMasterMapOnly ?? 0) + (lessonClass.B_partialMergeIntoExisting ?? 0)}, C=${lessonClass.C_notOnCatalogOrMaster ?? "?"}`,
    },
    {
      category: "CONTENT",
      subcategory: "images_media",
      name: "Lesson figures / hero / assets",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["legacy-assets-inventory.json", "external/NurseNest/public"],
      currentSourcePaths: ["PathwayLessonFigure in lesson types", "public/**"],
      routes: [],
      dataModelOrSource: "HTTPS figures in sections",
      beforeCount: null,
      currentCount: null,
      missingCount: null,
      confidence: "medium",
      recommendedAction: "See legacy-image-reference-audit.json + image-mapping-report.json",
      notes: "Many catalog lessons have no inline figures yet.",
    },
  ];

  /** ---------- Feature inventories ---------- */
  const learnerPageCount = countFilesExt(studentApp, new Set([".tsx"]), 6000);
  const adminPageCount = countFilesExt(adminApp, new Set([".tsx"]), 4000);

  const legacyFeatureItems: ParityMatrixItem[] = [
    {
      category: "FEATURE",
      subcategory: "monolith_client",
      name: "Legacy Vite client feature surface",
      legacyExists: existsSync(clientRoot),
      currentExists: true,
      status: "obsolete",
      legacySourcePaths: [rel(clientRoot)],
      currentSourcePaths: [rel(join(APP_ROOT, "src"))],
      routes: [],
      dataModelOrSource: "n/a",
      beforeCount: clientLessonTsApprox,
      currentCount: learnerPageCount + adminPageCount,
      missingCount: null,
      confidence: "high",
      recommendedAction: "Do not resurrect Vite shell; port behaviors into Next routes",
      notes: "Legacy client retained for reference per restoration map — not production.",
    },
  ];

  const currentFeatureItems: ParityMatrixItem[] = [
    {
      category: "FEATURE",
      subcategory: "routing",
      name: "Next App Router surfaces",
      legacyExists: false,
      currentExists: true,
      status: "matched",
      legacySourcePaths: [],
      currentSourcePaths: [rel(join(APP_ROOT, "src/app"))],
      routes: ["(marketing)", "(student)/app", "(admin)/admin"],
      dataModelOrSource: "Next.js layouts",
      beforeCount: null,
      currentCount: learnerPageCount + adminPageCount,
      missingCount: null,
      confidence: "high",
      recommendedAction: "Maintain route integrity tests (marketing-route-integrity)",
      notes: `Learner .tsx pages under (student): ~${learnerPageCount}; admin: ~${adminPageCount} (capped scan).`,
    },
  ];

  /** ---------- Admin surface (checklist) ---------- */
  const adminChecklist: ParityMatrixItem[] = [
    adminRow("lessons_crud", "Lessons list / edit / generate", ["/admin/lessons", "/admin/lessons/[id]", "/admin/lessons/new", "/admin/lessons/generate"], "partial"),
    adminRow("questions", "Question bank admin", ["/admin/questions", "/admin/questions/import", "/admin/questions/nclex-mapping"], "partial"),
    adminRow("flashcards_ai", "Flashcard AI / review", ["/admin/ai/flashcards", "/admin/ai/review"], "partial"),
    adminRow("blog", "Blog management", ["/admin/blog", "/admin/blog/studio", "/admin/blog/scheduler"], "partial"),
    adminRow("media", "Media / screenshots", ["/admin/media", "/admin/media/screenshots"], "partial"),
    adminRow("users", "Users", ["/admin/users"], "partial"),
    adminRow("subscriptions", "Subscriptions", ["/admin/subscriptions"], "partial"),
    adminRow("analytics", "Analytics hub", ["/admin/analytics", "/admin/analytics/content"], "partial"),
    adminRow("seo", "SEO & internal links", ["/admin/seo"], "partial"),
    adminRow("eeat", "E-E-A-T editorial", ["/admin/eeat-editorial"], "partial"),
    adminRow("i18n", "i18n tools", ["/admin/i18n"], "partial"),
    adminRow("inventory", "Content inventory / coverage", ["/admin/inventory", "/admin/content-coverage", "/admin/content-quality"], "partial"),
  ];

  /** ---------- User surface ---------- */
  const userChecklist: ParityMatrixItem[] = [
    userRow("lesson_browse", "Lesson browsing & detail", ["/app/.../lessons", "/app/.../lessons/[id]"], "partial"),
    userRow("questions", "Question practice", ["/app/.../questions"], "partial"),
    userRow("flashcards", "Flashcard study", ["/app/.../flashcards", "/app/.../flashcards/[deckRef]"], "partial"),
    userRow("practice_tests", "Practice tests / CAT", ["/app/.../practice-tests", "/app/.../practice-tests/cat-insights"], "partial"),
    userRow("progress", "Progress & account", ["/app/.../account/progress", "/app/.../account/overview"], "partial"),
    userRow("weak_areas", "Weak areas / review", ["/app/.../flashcards/weak-areas", "/app/.../account/mistakes", "/app/.../review"], "partial"),
    userRow("readiness", "Readiness / CAT history", ["/app/.../account/readiness", "/app/.../account/cat-history"], "partial"),
    userRow("billing", "Billing / subscription", ["/app/.../account/billing"], "partial"),
    userRow("search", "Search / filtering", ["/app/.../command-center", "hubs with search params"], "partial"),
  ];

  function adminRow(
    sub: string,
    name: string,
    routes: string[],
    status: ParityStatus,
  ): ParityMatrixItem {
    return {
      category: "ADMIN_SURFACE",
      subcategory: sub,
      name,
      legacyExists: true,
      currentExists: existsSync(adminApp) && adminPageCount > 0,
      status,
      legacySourcePaths: ["external/NurseNest client admin (if present)", "docs/legacy-restoration-map.md"],
      currentSourcePaths: [rel(adminApp)],
      routes,
      dataModelOrSource: "Admin React pages + API routes /api/admin/**",
      beforeCount: null,
      currentCount: adminPageCount,
      missingCount: null,
      confidence: "medium",
      recommendedAction: "Compare feature-by-feature to legacy admin; mark intentionally skipped in notes",
      notes: "Routes listed are canonical patterns; verify auth + staff tier on each.",
    };
  }

  function userRow(sub: string, name: string, routes: string[], status: ParityStatus): ParityMatrixItem {
    return {
      category: "USER_SURFACE",
      subcategory: sub,
      name,
      legacyExists: true,
      currentExists: existsSync(studentApp) && learnerPageCount > 0,
      status,
      legacySourcePaths: [rel(clientRoot)],
      currentSourcePaths: [rel(studentApp)],
      routes,
      dataModelOrSource: "Learner app + entitlements",
      beforeCount: null,
      currentCount: learnerPageCount,
      missingCount: null,
      confidence: "medium",
      recommendedAction: "End-to-end QA per release; compare weak-area flows to legacy",
      notes: "Subscriber /app routes — not marketing previews.",
    };
  }

  /** ---------- Feature parity (high level) ---------- */
  const featureParityItems: ParityMatrixItem[] = [
    {
      category: "FEATURE",
      subcategory: "entitlements",
      name: "Subscription gating & previews",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: ["legacy client guards"],
      currentSourcePaths: ["src/lib/entitlements/**", "middleware / proxy"],
      routes: [],
      dataModelOrSource: "Stripe + resolveEntitlement",
      beforeCount: null,
      currentCount: null,
      missingCount: null,
      confidence: "high",
      recommendedAction: "Run audit:entitlements + paywall tests",
      notes: "Marketing shows previews; full body gated server-side.",
    },
    {
      category: "FEATURE",
      subcategory: "progress",
      name: "Progress persistence",
      legacyExists: true,
      currentExists: true,
      status: "partial",
      legacySourcePaths: [],
      currentSourcePaths: ["prisma progress models", "src/lib/learner/**"],
      routes: ["/app/.../account/**"],
      dataModelOrSource: "DB + client storage for some UX",
      beforeCount: null,
      currentCount: null,
      missingCount: null,
      confidence: "medium",
      recommendedAction: "Verify lesson completion + question attempts per pathway",
      notes: "",
    },
  ];

  /** ---------- Restoration queue ---------- */
  const restorationPriorityQueue = {
    ...meta,
    tiers: {
      tier1_content_core: {
        focus: ["Pathway lessons", "Exam questions", "Flashcards", "Pre/post lesson quizzes in payloads"],
        evidenceFiles: ["unimported-legacy-content.json", "lesson-content-completeness-audit.json"],
        nursingFirst: true,
      },
      tier2_user_study: {
        focus: ["Dashboard", "practice flows", "weak areas", "CAT insights"],
        evidenceFiles: ["user-surface-parity.json", "src/app/(student)/**"],
      },
      tier3_admin_editorial: {
        focus: ["Admin lessons/questions/blog", "E-E-A-T editorial", "imports"],
        evidenceFiles: ["admin-surface-parity.json", "data/audit/eeat-*.json"],
      },
      tier4_tools_secondary: {
        focus: ["Calculators", "activities", "case studies", "media"],
        evidenceFiles: ["legacy-activities-inventory.json", "tools/**"],
      },
      tier5_obsolete: {
        focus: ["Legacy-only UI", "abandoned Replit experiments"],
        status: "intentionally_skipped_or_obsolete",
        evidenceFiles: ["docs/legacy-restoration-map.md"],
      },
    },
    rules: [
      "No single giant import — chunked batches with import-reports/*.json",
      "Each batch: before/after counts + duplicates skipped",
    ],
  };

  /** ---------- Final status ---------- */
  const registrySnap = safeReadJson(join(OUT, "parity-registry-lesson-snapshot.json"));
  const parityFinalStatus = {
    ...meta,
    summary: {
      pathwaysInRegistry: pathways.length,
      catalogLessonRows: catalogLessonTotal,
      dbPublishedLessons,
      dbPublishedQuestions,
      dbPublishedDecks,
      legacyLessonRowsReported: totalLegacyLessonRows,
      missingLessonKeysFromSnapshots: missingFromSnapshots,
      programmaticSeoSlugs: programmaticSlugs,
      learnerAppTsFilesScannedApprox: learnerPageCount,
      adminAppTsFilesScannedApprox: adminPageCount,
      databaseVerified: dbOk,
    },
    structuralGateFromLessonAudit: registrySnap
      ? {
          structuralIncompleteLessonCount: registrySnap.structuralIncompleteLessonCount as number | undefined,
          structuralIncompleteNonEmptyCount: registrySnap.structuralIncompleteNonEmptyCount as number | undefined,
          sourceFile: "parity-registry-lesson-snapshot.json (from npm run audit:full-parity)",
        }
      : null,
    definitionOfDone: [
      "Trace: legacy source → current source → route → audit row (this matrix).",
      "If UI not routable or DB not wired, status cannot be matched.",
      "Run `npm run audit:full-parity` before this script to refresh parity-registry-lesson-snapshot.json (structural gate).",
    ],
  };

  /** ---------- Write files ---------- */
  writeJson("legacy-content-inventory.json", { ...meta, auditKind: "legacy_content_inventory", items: legacyContentItems });
  writeJson("current-content-inventory.json", { ...meta, auditKind: "current_content_inventory", items: currentContentItems });
  writeJson("legacy-feature-inventory.json", { ...meta, auditKind: "legacy_feature_inventory", items: legacyFeatureItems });
  writeJson("current-feature-inventory.json", { ...meta, auditKind: "current_feature_inventory", items: currentFeatureItems });
  writeJson("legacy-vs-current-content-parity.json", {
    ...meta,
    auditKind: "content_parity",
    items: [...contentParityItems, ...legacyContentItems.filter((x) => x.name !== "Legacy lesson / content-map rows")],
  });
  writeJson("legacy-vs-current-feature-parity.json", { ...meta, auditKind: "feature_parity", items: [...featureParityItems, ...legacyFeatureItems, ...currentFeatureItems] });
  writeJson("admin-surface-parity.json", { ...meta, auditKind: "admin_surface", items: adminChecklist });
  writeJson("user-surface-parity.json", { ...meta, auditKind: "user_surface", items: userChecklist });
  writeJson("restoration-priority-queue.json", restorationPriorityQueue);
  writeJson("parity-final-status.json", parityFinalStatus);

  const md = `# Parity evidence matrix

Generated: ${generatedAt} · \`${gitHead}\`

## What this is

Machine-generated **separation of content vs feature** parity. Rows reference **files and counts**, not unsubstantiated claims.

## Evidence roots

${meta.evidenceRootsScanned.map((e) => `- \`${e}\``).join("\n")}

## Summary

| Metric | Value |
|--------|--------|
| Registry pathways | ${pathways.length} |
| Catalog lesson rows (bundled) | ${catalogLessonTotal} |
| Legacy lesson rows (unimported report) | ${totalLegacyLessonRows ?? "n/a"} |
| Missing from current snapshots | ${missingFromSnapshots ?? "n/a"} |
| DB published lessons (en) | ${dbPublishedLessons ?? "skipped"} |
| DB published questions | ${dbPublishedQuestions ?? "skipped"} |
| DB published decks | ${dbPublishedDecks ?? "skipped"} |
| Programmatic SEO slugs | ${programmaticSlugs} |

## Outputs (schema v3)

| File | Purpose |
|------|---------|
| \`legacy-content-inventory.json\` | What the legacy stack contained (inventoried) |
| \`current-content-inventory.json\` | Canonical current content sources |
| \`legacy-feature-inventory.json\` | Legacy feature / client surface |
| \`current-feature-inventory.json\` | Current app feature surface |
| \`legacy-vs-current-content-parity.json\` | Content comparison rows |
| \`legacy-vs-current-feature-parity.json\` | Feature comparison rows |
| \`admin-surface-parity.json\` | Admin checklist with routes |
| \`user-surface-parity.json\` | Learner checklist with routes |
| \`restoration-priority-queue.json\` | Tier 1–5 restoration ordering |
| \`parity-final-status.json\` | Counts + definition-of-done |

## Next questions (proof-based)

1. Top 25 missing legacy items: filter \`unimported-legacy-content.json\` class C + RN pathway guess.
2. RN lesson gaps: \`pathwayGuessOnMissing.RN\` + catalog RN pathway slugs.
3. User study gaps: compare \`user-surface-parity.json\` routes to legacy client routes (manual).
4. Admin tools gaps: compare \`admin-surface-parity.json\` to legacy admin.
5. Imported but not routable: cross-check DB slug → \`generateStaticParams\` / hub link audits.

## Verification

\`cd nursenest-core && npm run typecheck\` (may require higher heap). This script does not modify application TS outside \`scripts/audit/\`.

`;

  writeFileSync(join(OUT, "parity-summary.md"), md);

  console.log("Wrote parity evidence matrix to", relative(REPO_ROOT, OUT));

  if (dbOk) await prisma.$disconnect().catch(() => {});
}

function writeJson(name: string, data: unknown) {
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 2) + "\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
