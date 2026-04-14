#!/usr/bin/env node
/**
 * Second-pass legacy recovery audit: aggregates prior audit JSON + lightweight repo scans.
 * Chunked / capped — does not load huge arrays into memory beyond JSON.parse of summary files.
 *
 * Run from repo root: node nursenest-core/scripts/audit/second-pass-legacy-recovery-audit.mjs
 * Or from nursenest-core/: node scripts/audit/second-pass-legacy-recovery-audit.mjs
 */
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
/** Inner app root (…/nursenest-core/nursenest-core) */
const APP_ROOT = join(__dirname, "..", "..");
/** Workspace root (parent of inner nursenest-core app folder) */
const REPO_ROOT = join(APP_ROOT, "..");
const AUDIT_DIR = join(REPO_ROOT, "data/audit");
const IMPORT_REPORT_DIR = join(REPO_ROOT, "data/import-reports");

function safeReadJson(path) {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/** Bounded recursive file count by extension (caps total files walked). */
function countFilesByExt(rootDir, extensions, maxFiles = 40000) {
  let n = 0;
  const counts = Object.fromEntries(extensions.map((e) => [e, 0]));
  const stack = [rootDir];
  while (stack.length && n < maxFiles) {
    const dir = stack.pop();
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
        if (e.name === "node_modules" || e.name === ".next" || e.name === "dist" || e.name === "build") continue;
        stack.push(p);
      } else {
        n += 1;
        const ext = e.name.includes(".") ? `.${e.name.split(".").pop()}` : "";
        if (counts[ext] !== undefined) counts[ext] += 1;
      }
    }
  }
  return { totalWalked: n, byExt: counts, capped: n >= maxFiles };
}

function main() {
  mkdirSync(AUDIT_DIR, { recursive: true });
  mkdirSync(IMPORT_REPORT_DIR, { recursive: true });
  const generatedAt = new Date().toISOString();

  const unimported = safeReadJson(join(AUDIT_DIR, "unimported-legacy-content.json"));
  const legacyInv = safeReadJson(join(AUDIT_DIR, "legacy-content-inventory.json"));
  const currentInv = safeReadJson(join(AUDIT_DIR, "current-content-inventory.json"));
  const parity = safeReadJson(join(AUDIT_DIR, "legacy-vs-current-content-parity.json"));
  const legacyBlog = safeReadJson(join(AUDIT_DIR, "legacy-blog-inventory.json"));
  const legacyCat = safeReadJson(join(AUDIT_DIR, "legacy-cat-source-inventory.json"));
  const currentCat = safeReadJson(join(AUDIT_DIR, "current-cat-source-inventory.json"));
  const legacyFlash = safeReadJson(join(AUDIT_DIR, "legacy-flashcards-inventory.json"));
  const legacyActivities = safeReadJson(join(AUDIT_DIR, "legacy-activities-inventory.json"));
  const legacyCase = safeReadJson(join(AUDIT_DIR, "legacy-case-studies-inventory.json"));
  const i18nAudit = safeReadJson(join(AUDIT_DIR, "i18n-global-audit.json"));
  const lessonCompleteness = safeReadJson(join(AUDIT_DIR, "lesson-content-completeness-audit.json"));
  const testbankAudit = safeReadJson(join(AUDIT_DIR, "testbank-content-completeness-audit.json"));
  const flashcardAudit = safeReadJson(join(AUDIT_DIR, "flashcard-content-completeness-audit.json"));
  const externalGap = safeReadJson(join(AUDIT_DIR, "full-external-site-inventory.json"));
  const highValue = safeReadJson(join(AUDIT_DIR, "high-value-import-candidates.json"));

  const uc = unimported?.counts ?? {};
  const catalogPathwayIds = currentInv?.catalogPathwayIds?.length ?? legacyInv?.catalogPathwayIds?.length ?? 0;

  // Lightweight scans (capped)
  const clientRoot = join(REPO_ROOT, "client", "src");
  const serverRoot = join(REPO_ROOT, "server");
  const contentRoot = join(APP_ROOT, "src", "content");
  const legacyMarketing = join(APP_ROOT, "src", "legacy");

  const scanClient = existsSync(clientRoot)
    ? countFilesByExt(clientRoot, [".tsx", ".ts", ".json"], 25000)
    : null;
  const scanServer = existsSync(serverRoot)
    ? countFilesByExt(serverRoot, [".ts", ".json"], 15000)
    : null;
  const scanContent = existsSync(contentRoot)
    ? countFilesByExt(contentRoot, [".json", ".ts", ".tsx"], 20000)
    : null;
  const scanLegacy = existsSync(legacyMarketing)
    ? countFilesByExt(legacyMarketing, [".tsx", ".ts", ".json"], 5000)
    : null;

  let gitHead = "unknown";
  try {
    gitHead = execSync("git rev-parse --short HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  } catch {
    /* ignore */
  }

  /** ---------- legacy-content-source-inventory.json ---------- */
  const legacyContentSourceInventory = {
    schemaVersion: 2,
    generatedAt,
    gitHead,
    description:
      "Machine-readable inventory of in-repo legacy / monolith-adjacent sources (second pass). External USB paths may be absent; see full-external-site-inventory.json.",
    scanRoots: [
      relative(REPO_ROOT, clientRoot),
      relative(REPO_ROOT, serverRoot),
      relative(REPO_ROOT, join(REPO_ROOT, "shared")),
      relative(REPO_ROOT, contentRoot),
      relative(REPO_ROOT, legacyMarketing),
      "data/materialized/**",
      "data/audit/*.json (summaries)",
    ].filter(Boolean),
    categories: {
      lessons: {
        legacyTotalFound: uc.totalLegacyLessonRows ?? null,
        sources: [
          "client/src (Vite lesson pages & content maps)",
          "data/audit/unimported-legacy-content.json",
          "data/audit/legacy-lessons-inventory.json",
          "data/materialized/rn-pn-replit-batch-2026/catalog-lessons.json",
          "src/content/pathway-lessons/rn-nclex-master-map.json",
        ],
        clientTsApprox: uc.clientLessonTsFilesApprox ?? null,
        classification: uc.lessonClassification ?? null,
      },
      questions: {
        legacyTotalFound: uc.careerQuestionItemsTotal ?? null,
        jsonFileCount: uc.careerQuestionJsonFiles ?? null,
        sources: ["client career question JSON", "legacy flashcard-questionbank maps"],
      },
      preTestsPostTests: {
        note: "Pre/post lesson quizzes in current app: pathway lesson DB payload (nnLessonPayloadV2) + import pipelines; legacy samples under data/audit maxTestsSampleFiles caps in legacy-full-restoration-scan.",
        legacySamples: legacyBlog?.caps?.maxTestsSampleFiles ?? null,
      },
      catReadiness: {
        legacyEntryCount: legacyCat?.entryCount ?? legacyCat?.entries?.length ?? legacyCat?.files?.length ?? null,
        currentEntryCount: currentCat?.entryCount ?? currentCat?.files?.length ?? null,
        sources: ["legacy-cat-source-inventory.json", "current-cat-source-inventory.json"],
      },
      flashcards: {
        legacyInventoryRows: legacyFlash?.summary?.totalEntries ?? legacyFlash?.entries?.length ?? null,
        sources: ["legacy-flashcards-inventory.json", "legacy-flashcards-questionbank-inventory.json"],
      },
      activities: {
        legacyInventoryRows: legacyActivities?.entries?.length ?? null,
        sources: ["legacy-activities-inventory.json"],
      },
      caseStudies: {
        legacyInventoryRows: legacyCase?.entries?.length ?? null,
        sources: ["legacy-case-studies-inventory.json"],
      },
      blogPosts: {
        legacyMergedFiles: legacyBlog?.summary?.mergedUniqueFiles ?? null,
        sources: ["legacy-blog-inventory.json", "client SEO / blog TS pages"],
      },
      translations: {
        note: i18nAudit?.summary ?? "See i18n-global-audit.json",
        legacyClientLocales: "client/public/i18n/*.json",
        currentAppLocales: "nursenest-core/public/i18n/*.json",
        toolsPipeline: "tools/i18n/*",
      },
      seoProgrammatic: {
        legacySeoFiles: legacyBlog?.summary?.seoArticleClusterFiles ?? null,
      },
      toolsCalculators: {
        sources: ["client/src/pages/*calc*", "nursenest-core/src/app/**/tools/**"],
        note: "Use pathway + marketing route inventories for authoritative list",
      },
      imagesMedia: {
        sources: ["legacy-assets-inventory.json", "public/**", "content/media/**"],
      },
    },
    filesystemScanSamples: {
      clientSrc: scanClient,
      server: scanServer,
      nursenestCoreSrcContent: scanContent,
      nursenestCoreSrcLegacyMarketing: scanLegacy,
    },
    externalMirror: {
      status: externalGap?.scanStatus ?? "unknown",
      note: externalGap?.instructionsToCompleteScan?.[0] ?? null,
    },
  };

  /** ---------- current-content-source-inventory.json ---------- */
  const currentContentSourceInventory = {
    schemaVersion: 2,
    generatedAt,
    gitHead,
    description: "Current NurseNest (Next app) content sources — second pass snapshot.",
    primaryModules: currentInv?.currentSourcesScanned ?? [
      "src/lib/exam-pathways/exam-product-registry.ts",
      "src/lib/lessons/pathway-lesson-catalog-sync.ts",
      "prisma/schema.prisma",
    ],
    catalogPathwayCount: catalogPathwayIds,
    pathwayRowsSample: currentInv?.pathwayRows?.slice?.(0, 12) ?? currentInv?.pathwayRows,
    prismaNote: currentInv?.dbConnected === false ? "DATABASE_URL not available during last parity run — re-run generate-full-parity-audit.mts with DB for live counts." : "dbConnected per last inventory",
    supportingAudits: {
      lessonContentCompleteness: lessonCompleteness?.summary ?? lessonCompleteness?.headline ?? null,
      testbank: testbankAudit?.summary ?? null,
      flashcards: flashcardAudit?.summary ?? null,
      i18n: i18nAudit?.overview ?? null,
    },
    filesystemScanSamples: {
      nursenestCoreSrcContent: scanContent,
    },
  };

  /** ---------- legacy-vs-current-content-gap-analysis.json ---------- */
  const missingLessons = uc.missingFromCurrentSnapshots ?? null;
  const gapAnalysis = {
    schemaVersion: 2,
    generatedAt,
    gitHead,
    dedupeKeys: ["slug", "normalizedTitle", "topicSlug", "stemHash (questions)", "translationKey", "blog slug"],
    summary: {
      legacyLessonRows: uc.totalLegacyLessonRows ?? null,
      currentCatalogPathways: catalogPathwayIds,
      approximateMissingLessonTopics: missingLessons,
      lessonClassification: uc.lessonClassification ?? null,
      pathwayGuessOnMissing: uc.pathwayGuessOnMissing ?? null,
      questionsLegacyItems: uc.careerQuestionItemsTotal ?? null,
      parityNote: parity?.gapNote ?? null,
    },
    byCategory: {
      lessons: {
        legacyTotal: uc.totalLegacyLessonRows ?? null,
        currentApprox: "pathway catalog + DB (see current-content-inventory)",
        matchedApprox: (uc.lessonClassification?.A_alreadyImportedMaterialized ?? 0) + (uc.lessonClassification?.B_partialMasterMapOnly ?? 0) + (uc.lessonClassification?.B_partialMergeIntoExisting ?? 0),
        missingApprox: uc.missingFromCurrentSnapshots ?? null,
        partialIncomplete: (uc.lessonClassification?.B_partialMasterMapOnly ?? 0) + (uc.lessonClassification?.B_partialMergeIntoExisting ?? 0),
        duplicateCandidatesFile: "data/audit/legacy-duplicate-lessons.json",
        confidence: "high for classification buckets; per-lesson fuzzy match in legacy-to-current-lesson-map.json",
      },
      questions: {
        legacyTotal: uc.careerQuestionItemsTotal ?? null,
        currentTotal: "Prisma exam_questions when DB connected",
        matched: "partial — see testbank-content-completeness-audit.json",
        missing: "see high-value-import-candidates.json",
      },
      preTestsPostTests: {
        legacy: "sampled in legacy scans; not fully enumerated in this pass",
        current: "PathwayLesson sections + nnLessonPayloadV2 preTest/postTest",
        gap: "Align legacy lesson quiz JSON to exam question bank + lesson payload importers",
      },
      catReadiness: {
        legacyFiles: legacyCat?.entryCount ?? legacyCat?.files?.length ?? null,
        currentFiles: currentCat?.entryCount ?? null,
        gap: "Compare legacy-cat-practice-inventory vs current adaptive exam routes",
      },
      flashcards: {
        legacy: legacyFlash?.entries?.length ?? null,
        current: "Prisma flashcard_decks + deck JSON pipelines",
        gapReport: "flashcard-content-completeness-audit.json",
      },
      activities: {
        legacy: legacyActivities?.entries?.length ?? null,
        current: "marketing + learner activities routes (see restoration map)",
      },
      blogPosts: {
        parity: "blog-current-vs-legacy.json",
        dedupe: "blog-deduplication-from-legacy.json",
      },
      translations: {
        audit: "i18n-global-audit.json",
        gap: "tools/i18n compile pipeline is canonical — do not add parallel runtime loaders",
      },
      seoProgrammatic: {
        notes: "country-exam-locale-parity.json + programmatic SEO modules",
      },
      toolsCalculators: {
        note: "Scan client + core app routes; no single legacy total without external mirror",
      },
    },
    fuzzyMatching: {
      usedWhereExactFails: true,
      artifacts: ["legacy-to-current-lesson-map.json", "legacy-duplicate-lessons.json"],
    },
  };

  /** ---------- legacy-recovery-import-plan.json ---------- */
  const importPlan = {
    schemaVersion: 2,
    generatedAt,
    priorityOrder: ["RN", "PN/RPN/LVN", "NP", "core nursing shared", "Allied"],
    phases: [
      {
        phase: 1,
        name: "inventory_and_gap_analysis",
        status: "complete",
      },
      {
        phase: 2,
        name: "low_risk_additive_imports",
        status: "pending_operator_execution",
        recommendedJobs: [
          {
            action: "pathway_lesson_batch_import",
            scriptHints: ["scripts/content-completion-incremental.ts (incremental)", "lesson import batches per docs/legacy-restoration-map.md"],
            requires: ["DATABASE_URL", "idempotent keys (pathwayId+slug)"],
          },
          {
            action: "exam_question_import",
            scriptHints: ["question bank importers in scripts/", "dedupe by stem hash / examQuestionId"],
            requires: ["DATABASE_URL"],
          },
          {
            action: "blog_import",
            scriptHints: ["nursenest-core/scripts/import-blog.ts"],
            requires: ["DATABASE_URL"],
          },
          {
            action: "i18n_merge",
            scriptHints: ["tools/i18n pipeline per docs/i18n-architecture.md"],
            requires: ["compile-i18n", "no duplicate runtime loaders"],
          },
        ],
      },
      {
        phase: 3,
        name: "transform_then_import",
        status: "blocked_until_mapping",
        items: ["Legacy C-class lessons (4084) need slug/topic mapping before bulk import", "NP slug mapping group in unimported-legacy-content.json"],
      },
    ],
    references: {
      highValueCandidates: "data/audit/high-value-import-candidates.json",
      unimported: "data/audit/unimported-legacy-content.json",
    },
  };

  /** ---------- legacy-recovery-risk-register.json ---------- */
  const riskRegister = {
    schemaVersion: 2,
    generatedAt,
    risks: [
      {
        id: "R1",
        title: "Bulk lesson import without dedupe",
        severity: "high",
        mitigation: "Use stable pathwayId+slug; run dedupe reports; incremental batches only",
      },
      {
        id: "R2",
        title: "Client-side paywall bypass",
        severity: "critical",
        mitigation: "Server getUserAccess / resolveEntitlement — never import routes that skip gates",
      },
      {
        id: "R3",
        title: "Parallel i18n loaders",
        severity: "high",
        mitigation: "Single compile pipeline per docs/i18n-architecture.md",
      },
      {
        id: "R4",
        title: "Oversized list renders",
        severity: "medium",
        mitigation: "Pagination / ISR — see rn-lesson-library-safety rule",
      },
      {
        id: "R5",
        title: "External legacy mirror unavailable",
        severity: "low",
        mitigation: externalGap?.scanStatus === "aborted" ? "Mount/copy NurseNest mirror; re-run external scan" : "n/a",
      },
      {
        id: "R6",
        title: "Schema mismatch for legacy record shape",
        severity: "medium",
        mitigation: "Park in holding JSON + import-reports; transform before Prisma write",
      },
    ],
  };

  writeFileSync(join(AUDIT_DIR, "legacy-content-source-inventory.json"), JSON.stringify(legacyContentSourceInventory, null, 2));
  writeFileSync(join(AUDIT_DIR, "current-content-source-inventory.json"), JSON.stringify(currentContentSourceInventory, null, 2));
  writeFileSync(join(AUDIT_DIR, "legacy-vs-current-content-gap-analysis.json"), JSON.stringify(gapAnalysis, null, 2));
  writeFileSync(join(AUDIT_DIR, "legacy-recovery-import-plan.json"), JSON.stringify(importPlan, null, 2));
  writeFileSync(join(AUDIT_DIR, "legacy-recovery-risk-register.json"), JSON.stringify(riskRegister, null, 2));

  const importReport = {
    schemaVersion: 1,
    generatedAt,
    pass: "second-pass-recovery-audit",
    mutationsExecuted: [],
    contentImportedCounts: {},
    beforeAfter: { note: "No DB writes in this audit-only pass" },
    skippedReason: "Audit generation only — run dedicated import scripts with DATABASE_URL and review dedupe reports.",
    highValueCandidatesPreview: highValue ? Object.keys(highValue).slice(0, 20) : null,
  };
  writeFileSync(join(IMPORT_REPORT_DIR, `second-pass-recovery-${generatedAt.slice(0, 10)}.json`), JSON.stringify(importReport, null, 2));

  /** Markdown summary */
  const md = `# Legacy recovery — second-pass audit summary

Generated: ${generatedAt}

## Git

- Short HEAD: \`${gitHead}\`

## Answers (recovery questions)

1. **Legacy content not yet in current app** — Majority of monolith lesson keys (\`missingFromCurrentSnapshots: ${missingLessons ?? "see JSON"}\`) per \`unimported-legacy-content.json\` classification C; plus external mirror not mounted (\`${externalGap?.scanStatus ?? "unknown"}\`).
2. **Current incomplete vs legacy** — Partial imports (A/B buckets) and pathway catalog vs DB drift — see \`legacy-vs-current-content-gap-analysis.json\` and per-domain completeness audits.
3. **Safe low-risk imports now** — Small batches of catalog-normalized lessons, blog posts via \`import-blog.ts\`, idempotent question rows with dedupe — **only with DB + operator review** (this pass did **not** execute imports).
4. **Requires transformation** — Class C lessons (slug/topic mapping), some NP content (\`needs_slug_mapping\` groups), legacy HTML → MDX/blog schema.
5. **Archive only** — Duplicate legacy UI routes, abandoned Replit-only experiments, and content flagged \`riskFlags: tightly-coupled-ui\` in legacy blog inventory — keep as reference; do not blindly port.

## Outputs (this pass)

| File | Purpose |
|------|---------|
| \`data/audit/legacy-content-source-inventory.json\` | Legacy source totals + scan roots |
| \`data/audit/current-content-source-inventory.json\` | Current app sources |
| \`data/audit/legacy-vs-current-content-gap-analysis.json\` | Gap by category |
| \`data/audit/legacy-recovery-import-plan.json\` | Phased import plan |
| \`data/audit/legacy-recovery-risk-register.json\` | Risks |
| \`data/import-reports/second-pass-recovery-*.json\` | Import report (no mutations) |

## Next steps

1. Re-run \`npx tsx nursenest-core/scripts/audit/generate-full-parity-audit.mts\` with \`DATABASE_URL\` for live DB counts.
2. Execute import batches using \`legacy-recovery-import-plan.json\` priority order (RN first).
3. Mount/copy external NurseNest mirror and re-run external inventory if full parity vs old monolith is required.

## Typecheck

Run \`cd nursenest-core && npm run typecheck\` after code changes; this audit script does not modify TypeScript sources.
`;

  writeFileSync(join(AUDIT_DIR, "legacy-recovery-summary.md"), md);

  console.log(`Wrote second-pass audit to ${relative(REPO_ROOT, AUDIT_DIR)}`);
  console.log(`Import report: ${relative(REPO_ROOT, IMPORT_REPORT_DIR)}`);
}

main();
