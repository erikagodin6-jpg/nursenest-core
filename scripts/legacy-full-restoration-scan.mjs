#!/usr/bin/env node
/**
 * Full restoration-planning + implementation-readiness scan (read-only legacy tree).
 * Writes/updates nursenest-core/data/audit/*.json — does NOT modify external/NurseNest.
 *
 * Chunking: find/rg with maxBuffer limits; optional tsx subprocess for contentMap counts only.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const LEGACY = "/root/nursenest-core/external/NurseNest";
const APP_ROOT = path.resolve(import.meta.dirname, "..");
const AUDIT = path.join(APP_ROOT, "data/audit");

const SCHEMA_VERSION = 2;
const CAPS = {
  maxLessonFileEntries: 600,
  maxQuestionFileEntries: 400,
  maxTranslationFileEntries: 400,
  maxBlogFileEntries: 200,
  maxActivityFileEntries: 250,
  assetSamplePaths: 120,
  maxTestsSampleFiles: 220,
};

const EXCLUDE_FIND = ["node_modules", ".git", "dist", "build", ".cache", "attached_assets/generated_images"];

function findFiles(root, exts, maxFiles = 500000) {
  const args = [root, "-type", "f"];
  for (const e of EXCLUDE_FIND) {
    args.push("-path", `*/${e}/*`, "-prune", "-o");
  }
  args.push("-type", "f", "(");
  exts.forEach((ext, i) => {
    if (i) args.push("-o");
    args.push("-name", `*${ext}`);
  });
  args.push(")", "-print");
  const r = spawnSync("find", args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 512 });
  if (r.error) throw r.error;
  return r.stdout.split("\n").filter(Boolean).slice(0, maxFiles);
}

function rel(fp) {
  return path.relative(LEGACY, fp).replace(/\\/g, "/");
}

function tierFromPath(r) {
  const p = r.toLowerCase();
  if (p.includes("rpn") || p.includes("lpn") || p.includes("lvn") || p.includes("rex-pn") || p.includes("nclex-pn"))
    return { tier: "PN/RPN/LVN", examHint: "NCLEX-PN / REx-PN" };
  if (p.includes("np-") || p.includes("/np/") || p.includes("fnp") || p.includes("np-exam")) return { tier: "NP", examHint: "NP boards" };
  if (
    p.includes("allied") ||
    p.includes("mlt") ||
    p.includes("rrt") ||
    p.includes("paramedic") ||
    p.includes("imaging") ||
    p.includes("surgical-tech") ||
    p.includes("pta") ||
    p.includes("ota") ||
    p.includes("pharmtech")
  )
    return { tier: "Allied", examHint: "profession-specific" };
  if (p.includes("rn-") || p.includes("/rn") || p.includes("nclex-rn")) return { tier: "RN", examHint: "NCLEX-RN" };
  return { tier: "mixed/unknown", examHint: "resolve per file" };
}

function baseRisk(r, kind) {
  const f = [];
  const s = r.toLowerCase();
  if (s.includes("generated-batch") || s.includes("repair")) f.push("legacy-format");
  if (s.includes("missing-batch")) f.push("partial-data");
  if (kind === "lesson" && s.endsWith(".ts")) f.push("schema-transform-needed");
  if (s.includes("replit-export")) f.push("unknown-dependency");
  if (s.includes("/pages/") && s.endsWith(".tsx")) f.push("tightly-coupled-ui");
  if (s.includes("vite") || s.includes("wouter") || s.includes("react-router")) f.push("old-routing-assumption");
  return [...new Set(f)];
}

function mkEntry(relPath, contentType, o = {}) {
  const t = tierFromPath(relPath);
  const rf = [...new Set([...baseRisk(relPath, o.kind || contentType), ...(o.extraRisk || [])])];
  return {
    sourcePath: relPath,
    contentType,
    estimatedRecordCount: o.count ?? null,
    professionTierExam: o.professionTierExam ?? t,
    locale: o.locale ?? "en-primary (legacy Vite client)",
    reusability: o.reusability ?? "transform-needed",
    riskFlags: o.riskFlags ?? rf,
    recommendedDestination: o.destination ?? "TBD — see legacy-master-migration-map.json",
    recommendedMigrationOrder: o.migrationOrder ?? 5,
    matchCurrent: {
      lessonFormat: o.matchLesson ?? "n/a",
      blogStructure: o.matchBlog ?? "n/a",
      flashcardUx: o.matchFlash ?? "n/a",
      catFlow: o.matchCat ?? "n/a",
      toolPageStructure: o.matchTool ?? "n/a",
      themeAesthetic: o.matchTheme ?? "rebuild-with-semantic-tokens",
    },
    notes: o.notes ?? "",
  };
}

function countRegexInFile(fp, re, maxBytes = 8 * 1024 * 1024) {
  try {
    const st = fs.statSync(fp);
    if (st.size > maxBytes) return { truncated: true, count: null, size: st.size };
    const s = fs.readFileSync(fp, "utf8");
    const m = s.match(re);
    return { truncated: false, count: m ? m.length : 0, size: st.size };
  } catch {
    return { truncated: false, count: null, size: 0 };
  }
}

function runTsxLessonCounts() {
  const tsx = spawnSync(
    "npx",
    ["--yes", "tsx", "-e", `import { lessonCount, questionCount } from './client/src/data/lessons/index.ts'; console.log(JSON.stringify({lessonCount,questionCount}));`],
    { cwd: LEGACY, encoding: "utf8", maxBuffer: 1024 * 1024 },
  );
  if (tsx.status !== 0 || !tsx.stdout) return { lessonCount: null, questionCount: null };
  try {
    return JSON.parse(tsx.stdout.trim());
  } catch {
    return { lessonCount: null, questionCount: null };
  }
}

function rgFiles(pattern, relSubdir, glob, max = 500) {
  const base = path.join(LEGACY, relSubdir);
  const r = spawnSync("rg", ["-l", "--glob", glob, pattern, base], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 32,
  });
  if (r.status !== 0 && r.status !== 1) return [];
  const lines = (r.stdout || "").split("\n").filter(Boolean);
  return lines.slice(0, max).map((p) => rel(p));
}

function extBucketCount(assetLines) {
  const m = {};
  for (const fp of assetLines) {
    const ext = (path.extname(fp) || "no-ext").toLowerCase();
    m[ext] = (m[ext] || 0) + 1;
  }
  return m;
}

function main() {
  if (!fs.existsSync(LEGACY)) {
    console.error(JSON.stringify({ error: "LEGACY_ROOT_NOT_FOUND", LEGACY }));
    process.exit(1);
  }
  fs.mkdirSync(AUDIT, { recursive: true });

  const generatedAt = new Date().toISOString();
  const meta = { schemaVersion: SCHEMA_VERSION, generatedAt, legacyRoot: LEGACY, scanTool: "legacy-full-restoration-scan.mjs", caps: CAPS };

  const lessonFilesAll = findFiles(LEGACY, [".ts", ".tsx"]).filter(
    (f) => f.includes("/client/src/data/lessons/") && !f.endsWith("types.ts"),
  );
  const lessonFiles = lessonFilesAll.slice(0, CAPS.maxLessonFileEntries);
  const lessonTruncated = lessonFilesAll.length > lessonFiles.length;

  const counts = runTsxLessonCounts();

  let preHits = 0;
  let postHits = 0;
  for (const fp of lessonFiles.slice(0, 100)) {
    preHits += countRegexInFile(fp, /\bpreTest\s*:/g).count || 0;
    postHits += countRegexInFile(fp, /\bpostTest\s*:/g).count || 0;
  }

  const careerQ = findFiles(LEGACY, [".ts"]).filter((f) => f.includes("/client/src/data/career-questions/"));
  const examQ = findFiles(LEGACY, [".ts"]).filter((f) => f.includes("/client/src/data/exam-questions/"));
  const flashFiles = findFiles(LEGACY, [".ts"]).filter((f) => f.includes("/client/src/data/") && f.includes("flashcard"));

  const blogPages = findFiles(LEGACY, [".tsx", ".ts"]).filter(
    (f) => f.includes("blog") && (f.includes("/pages/") || f.includes("/components/") || f.includes("/server/")),
  );
  const blogServer = findFiles(LEGACY, [".ts"]).filter((f) => f.includes("/server/") && f.includes("blog"));
  const blogSeoArticle = findFiles(LEGACY, [".tsx", ".ts"]).filter((f) => {
    const r = rel(f);
    if (!r.startsWith("client/src/") && !r.startsWith("server/")) return false;
    return (
      /\/seo-|article|encyclopedia|imaging-blog|study-guide|exam-prep-cornerstone|nursing-study-guides/i.test(r) &&
      (r.includes("/pages/") || r.includes("/data/") || r.includes("/server/"))
    );
  });
  const blogMergedPaths = [...new Set([...blogPages, ...blogServer, ...blogSeoArticle])];

  const i18nFiles = findFiles(LEGACY, [".json", ".ts"]).filter(
    (f) =>
      (f.includes("i18n") || f.includes("/locales/") || f.includes("/translations/")) && !f.includes("node_modules"),
  );

  let toolsCalcPagesFixed = rgFiles("calculator|Calculator|dosage|med-math|MedMath", "client/src", "*.tsx", 80);
  if (!toolsCalcPagesFixed.length) {
    toolsCalcPagesFixed = findFiles(LEGACY, [".tsx"])
      .filter(
        (f) =>
          f.includes("/client/src/pages/") &&
          (/calculator|med-math|dosage|converter|generator-v2|si-conventional/i.test(f) ||
            /clinical-calculators|med-math\.tsx/i.test(f)),
      )
      .map((f) => rel(f));
  }

  const caseStudyPaths = rgFiles("case study|clinical scenario|Clinical scenario", "client/src", "*.{ts,tsx}", 60);
  const scenarioHub = findFiles(LEGACY, [".tsx"]).filter((f) => /scenario|case-stud|clinical-scenarios/i.test(f));

  const gameInteractive = findFiles(LEGACY, [".tsx"]).filter(
    (f) =>
      f.includes("/client/src/pages/") &&
      (/simulator|game|interactive|generator-v2|flashcards\.tsx|deck-page/i.test(f) || f.includes("career-ai-simulator")),
  );

  const dashboardFiles = findFiles(LEGACY, [".tsx", ".ts"]).filter(
    (f) =>
      (f.includes("/client/src/pages/dashboard") || f.includes("/server/study-path") || f.includes("nclex-readiness-score")) &&
      !f.includes("node_modules"),
  );

  const studyRemediation = findFiles(LEGACY, [".ts", ".tsx"]).filter(
    (f) =>
      /onboarding-plan|study-path|premium-study|mock-exam|remediation|readiness/i.test(f) &&
      (f.includes("/server/") || f.includes("/client/src/pages/")),
  );

  const serverCat = findFiles(LEGACY, [".ts"]).filter(
    (f) =>
      f.includes("/server/") &&
      (f.includes("cat-") || f.includes("adaptive") || f.includes("cat-engine") || f.includes("cat_session") || f.includes("mock-exam")),
  );

  const publicFind = spawnSync("find", [LEGACY, "-path", "*/public/*", "-type", "f"], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 64,
  });
  const assetLines = publicFind.stdout ? publicFind.stdout.split("\n").filter(Boolean) : [];
  const extBuckets = extBucketCount(assetLines);

  const replitExport = findFiles(LEGACY, [".json"]).filter((f) => f.includes("replit-export"));

  const activitiesBroad = findFiles(LEGACY, [".tsx", ".ts"]).filter(
    (f) =>
      f.includes("/client/src/pages/") &&
      (/tool|activity|worksheet|worksheets|hub\.tsx|pathways\.tsx|exam-prep|qbank|question-bank/i.test(f) ||
        f.includes("/career-tools/")),
  );

  /** Lessons inventory */
  const legacyLessons = {
    ...meta,
    summary: {
      lessonModuleFiles: lessonFilesAll.length,
      lessonFileEntriesInReport: lessonFiles.length,
      truncated: lessonTruncated,
      lessonKeysInContentMap: counts.lessonCount,
      embeddedQuestionsInLessons: counts.questionCount,
      indexPath: "client/src/data/lessons/index.ts",
      interpretation: "LessonContent merged into contentMap; transform via convert-legacy-lesson-to-enrichment + importer.",
    },
    entries: lessonFiles.map((fp) => {
      const r = rel(fp);
      return mkEntry(r, "lesson_module", {
        kind: "lesson",
        count: null,
        reusability: "transform-needed",
        destination: "pathway-lessons DB + catalog alignment; chunked import",
        migrationOrder: 1,
        matchLesson: "yes-after-conversion",
        matchTheme: "use-current-pathway-lesson-cards-sections",
        notes: "Do not bulk load contentMap; per-lesson or batched JSON import.",
        extraRisk: ["duplicate-risk"],
      });
    }),
  };

  /** Questions */
  const qEntries = [...careerQ, ...examQ].slice(0, CAPS.maxQuestionFileEntries).map((fp) => {
    const r = rel(fp);
    const stemC = countRegexInFile(fp, /\bstem\s*:/g);
    const isCareer = fp.includes("career-questions");
    return mkEntry(r, isCareer ? "career_question_bank" : "exam_question_bank", {
      kind: "questions",
      count: stemC.count,
      reusability: stemC.truncated ? "partial-data" : "transform-needed",
      destination: "ExamQuestion import + stem-hash dedupe vs current DB",
      migrationOrder: 2,
      matchLesson: "n/a",
      extraRisk: stemC.truncated ? ["partial-data"] : [],
      notes: isCareer ? "Allied / career-specific stems" : "NCLEX-style exam-questions batches",
    });
  });

  const legacyQuestions = {
    ...meta,
    summary: {
      careerQuestionTsFiles: careerQ.length,
      examQuestionTsFiles: examQ.length,
      filesListed: qEntries.length,
    },
    entries: qEntries,
  };

  /** Flashcards */
  const legacyFlashcards = {
    ...meta,
    summary: {
      flashcardTsFiles: flashFiles.length,
      note: "Deck modules under client/src/data; IDs embedded as TS objects.",
    },
    entries: flashFiles.map((fp) =>
      mkEntry(rel(fp), "flashcard_deck_data", {
        kind: "flashcards",
        reusability: "transform-needed",
        destination: "Current flashcard pipeline / deck registry",
        migrationOrder: 4,
        matchFlash: "rebuild-ui-parity",
        matchTheme: "card-surface-semantic-tokens",
        notes: "Map deck IDs; avoid duplicate slugs.",
        extraRisk: ["duplicate-risk", "schema-transform-needed"],
      }),
    ),
  };

  /** Tests embedded */
  const legacyTests = {
    ...meta,
    summary: {
      note: "preTest/postTest/quiz live inside LessonContent; not separate relational tables in legacy client.",
      sampleFilesScannedForMarkers: Math.min(100, lessonFiles.length),
      preTestOccurrencesInSample: preHits,
      postTestOccurrencesInSample: postHits,
    },
    entries: lessonFiles.slice(0, CAPS.maxTestsSampleFiles).map((fp) =>
      mkEntry(rel(fp), "lesson_embedded_assessment", {
        kind: "tests",
        reusability: "content-only",
        destination: "Pathway lesson sections JSON (NN_LESSON_DB_PAYLOAD_V2) preTest/postTest",
        migrationOrder: 3,
        matchLesson: "yes-embedded-in-lesson",
        notes: "Migrated with parent lesson body.",
      }),
    ),
  };

  /** Blog */
  const legacyBlog = {
    ...meta,
    summary: {
      blogRelatedClientFiles: blogPages.length,
      blogRelatedServerFiles: blogServer.length,
      seoArticleClusterFiles: blogSeoArticle.length,
      mergedUniqueFiles: blogMergedPaths.length,
      interpretation: "Mix of React marketing pages and server blog automation; extract editorial content for current blog/MDX/DB.",
    },
    entries: blogMergedPaths.slice(0, CAPS.maxBlogFileEntries).map((fp) =>
      mkEntry(rel(fp), "blog_or_seo_surface", {
        kind: "blog",
        reusability: "content-only",
        destination: "Current BlogPost / marketing content pipeline",
        migrationOrder: 7,
        matchBlog: "extract-then-reauthor-in-current-layout",
        matchTheme: "marketing-study-surfaces-semantic-colors",
        extraRisk: ["tightly-coupled-ui", "legacy-format"],
        notes: "Prefer content extraction over porting legacy page components.",
      }),
    ),
  };

  /** Translations */
  const legacyTranslations = {
    ...meta,
    summary: {
      i18nRelatedFiles: i18nFiles.length,
      toolsI18nSource: "tools/i18n/source/*.ts (compile-time bundles)",
      completeness: "requires diff vs nursenest-core next-intl / compile pipeline — not assumed complete parity",
    },
    entries: i18nFiles.slice(0, CAPS.maxTranslationFileEntries).map((fp) => {
      const r = rel(fp);
      let loc = "multi";
      if (r.includes("/fr") || r.includes("i18n-fr")) loc = "fr";
      else if (r.includes("/es") || r.includes("i18n-es")) loc = "es";
      else if (r.includes("i18n-zh")) loc = "zh";
      return mkEntry(r, "translation_locale_bundle", {
        kind: "translations",
        locale: loc,
        reusability: "transform-needed",
        destination: "nursenest-core messages/*.json + docs/i18n-architecture compliance",
        migrationOrder: 6,
        matchTheme: "n/a",
        notes: "Validate key parity and ICU/format rules in target app.",
        extraRisk: ["schema-transform-needed"],
      });
    }),
  };

  /** Activities (broad) */
  const legacyActivities = {
    ...meta,
    summary: {
      candidatePageFiles: activitiesBroad.length,
      note: "Hub pages, qbank shells, pathway explorers — mostly route orchestration; content often in /data.",
    },
    entries: activitiesBroad.slice(0, CAPS.maxActivityFileEntries).map((fp) =>
      mkEntry(rel(fp), "activity_or_hub_page", {
        kind: "activities",
        reusability: "rebuild-in-new-ui",
        destination: "Equivalent Next.js routes / learner tools hub",
        migrationOrder: 9,
        matchTool: "partial-pattern-only",
        extraRisk: ["tightly-coupled-ui", "old-routing-assumption"],
        notes: "Reuse IA ideas; rebuild UI with current shell.",
      }),
    ),
  };

  /** CAT */
  const legacyCat = {
    ...meta,
    summary: {
      serverFiles: serverCat.length,
      note: "Compare algorithm + session persistence vs current CAT; do not import schema blindly.",
    },
    entries: serverCat.map((fp) =>
      mkEntry(rel(fp), "cat_adaptive_or_mock_exam_server", {
        kind: "cat",
        reusability: "selective-logic-review",
        destination: "Current CAT/practice APIs — adapter or cherry-pick algorithms after audit",
        migrationOrder: 5,
        matchCat: "diff-and-selective-port",
        extraRisk: ["unknown-dependency", "schema-transform-needed"],
        notes: "Requires Prisma parity mapping; high coupling to legacy DB.",
      }),
    ),
  };

  /** Assets */
  const legacyAssets = {
    ...meta,
    summary: {
      totalPublicFiles: assetLines.length,
      extensionBuckets: extBuckets,
      capNote: `Sample paths capped at ${CAPS.assetSamplePaths}; full tree via find.`,
    },
    entries: Object.entries(extBuckets).map(([ext, n]) =>
      mkEntry(`public/**/*${ext}`, "static_asset_bucket", {
        count: n,
        reusability: "as-is-urls-if-https-ready",
        destination: "CDN / Next public assets; lesson figures must be HTTPS",
        migrationOrder: 8,
        matchLesson: "figures-in-lesson-sections",
        professionTierExam: { tier: "all", examHint: "n/a" },
        extraRisk: ["duplicate-risk"],
        notes: "Audit large binaries separately; avoid gs:// raw URLs in product.",
      }),
    ),
    samplePaths: assetLines.slice(0, CAPS.assetSamplePaths).map((p) => rel(p)),
  };

  /** NEW: Tools & calculators */
  const toolPaths = [...new Set(toolsCalcPagesFixed)].filter(Boolean);

  const legacyToolsCalculators = {
    ...meta,
    summary: {
      pagesMatched: toolPaths.length,
      dataFiles: ["client/src/data/med-math-questions.ts", "client/src/data/lessons/med-math-lessons.ts"],
      alliedExamples: ["client/src/allied/data/pharmtech-calculations-data.ts"],
    },
    entries: [
      mkEntry("client/src/pages/med-math.tsx", "med_math_tool_page", {
        reusability: "rebuild-in-new-ui",
        destination: "Current tools / study tools hub — med math module",
        migrationOrder: 8,
        matchTool: "rebuild",
        professionTierExam: { tier: "RN/PN", examHint: "dosage safety" },
        notes: "Reuse question data where clean; rebuild interactions.",
      }),
      mkEntry("client/src/pages/clinical-calculators.tsx", "clinical_calculators_hub", {
        reusability: "rebuild-in-new-ui",
        destination: "Tools hub — calculator cards",
        migrationOrder: 8,
        matchTool: "rebuild",
      }),
      mkEntry("client/src/pages/si-conventional-converter.tsx", "unit_converter", {
        reusability: "rebuild-in-new-ui",
        destination: "Utility tool page",
        migrationOrder: 10,
        matchTool: "rebuild",
      }),
      ...toolPaths.slice(0, 40).map((p) =>
        mkEntry(p, "tool_or_calculator_page", {
          reusability: "rebuild-in-new-ui",
          destination: "Mapped tool route in nursenest-core",
          migrationOrder: 8,
          matchTool: "partial",
          extraRisk: ["tightly-coupled-ui"],
        }),
      ),
    ],
  };

  /** Case studies */
  const legacyCaseStudies = {
    ...meta,
    summary: {
      rgHitsSample: caseStudyPaths.length,
      explicitScenarioFiles: scenarioHub.length,
    },
    entries: [
      ...scenarioHub.slice(0, 80).map((fp) =>
        mkEntry(rel(fp), "clinical_scenario_or_case_page", {
          reusability: "content-only",
          destination: "Case study / scenario content in current lesson or blog-like longform",
          migrationOrder: 9,
          matchLesson: "optional-scenario-blocks",
          notes: "Extract narrative; rebuild presentation.",
        }),
      ),
      ...caseStudyPaths.slice(0, 40).map((p) =>
        mkEntry(p, "case_study_reference", {
          reusability: "review-manually",
          destination: "TBD after content QA",
          migrationOrder: 9,
        }),
      ),
    ],
  };

  /** Games / interactives */
  const legacyGamesInteractives = {
    ...meta,
    summary: { pageFiles: gameInteractive.length },
    entries: gameInteractive.map((fp) =>
      mkEntry(rel(fp), "game_simulator_or_interactive", {
        reusability: "rebuild-in-new-ui",
        destination: "Engagement modules — only if pedagogy justifies maintenance",
        migrationOrder: 10,
        matchTheme: "rebuild-semantic-playful",
        extraRisk: ["tightly-coupled-ui"],
        notes: "Prefer stripping to content + simple quiz; avoid copying legacy chrome.",
      }),
    ),
  };

  /** Dashboard / progress */
  const legacyDashboardProgress = {
    ...meta,
    summary: {
      files: dashboardFiles.length,
      serverHooks: ["server/study-path.ts", "server/premium-study-routes.ts"],
    },
    entries: dashboardFiles.map((fp) =>
      mkEntry(rel(fp), "dashboard_or_progress_surface", {
        reusability: "selective-logic-review",
        destination: "Current learner dashboard / progress APIs",
        migrationOrder: 11,
        matchTheme: "dashboard-semantic-surfaces",
        extraRisk: ["old-routing-assumption", "unknown-dependency"],
        notes: "Ideas for metrics OK; UI must match current dashboard shell.",
      }),
    ),
  };

  /** Study plans / remediation */
  const legacyStudyPlansRemediation = {
    ...meta,
    summary: {
      files: studyRemediation.length,
      concepts: ["onboarding-plan", "study-path", "mock-exam assembly", "readiness score"],
    },
    entries: studyRemediation.map((fp) =>
      mkEntry(rel(fp), "study_plan_remediation_or_mock_flow", {
        reusability: "selective-logic-review",
        destination: "Current study coach / plans — only aligned features",
        migrationOrder: 11,
        matchLesson: "n/a",
        notes: "Compare to current remediation; avoid duplicate study-loop logic.",
      }),
    ),
  };

  /** UI patterns worth rebuilding */
  const legacyUiPatterns = {
    ...meta,
    summary: {
      principle: "Do not port Vite page chrome; reuse patterns as specs for React Server Components + current design tokens.",
    },
    entries: [
      mkEntry("client/src/components/mobile-study-shell.tsx", "mobile_study_shell", {
        reusability: "rebuild-in-new-ui",
        destination: "Learner shell responsive patterns",
        migrationOrder: 10,
        matchTheme: "current-marketing-study-surfaces",
        notes: "Useful IA; rebuild with current layout primitives.",
        professionTierExam: { tier: "all", examHint: "n/a" },
      }),
      mkEntry("client/src/components/deck-views.tsx", "flashcard_deck_views", {
        reusability: "rebuild-in-new-ui",
        destination: "Flashcard study UX",
        migrationOrder: 4,
        matchFlash: "inspire-layout-only",
      }),
      mkEntry("client/src/components/lesson-quiz-embed.tsx", "lesson_quiz_embed", {
        reusability: "rebuild-in-new-ui",
        destination: "Pathway lesson assessment embeds",
        migrationOrder: 3,
        matchLesson: "yes",
      }),
      mkEntry("client/src/components/content-gate.tsx", "content_gate", {
        reusability: "selective-logic-review",
        destination: "Entitlement gating — align with server paywall",
        migrationOrder: 2,
        notes: "Never client-only paywall; match current entitlements.",
        extraRisk: ["unknown-dependency"],
      }),
      mkEntry("client/src/components/navigation.tsx", "legacy_navigation", {
        reusability: "deprecated",
        destination: "Ignore — use current nav",
        migrationOrder: 99,
        extraRisk: ["tightly-coupled-ui", "old-routing-assumption"],
        notes: "Reference for IA only.",
      }),
    ],
  };

  /** Theme + aesthetic mapping */
  const legacyThemeAndAestheticMapping = {
    ...meta,
    summary: {
      legacyThemeFile: "client/src/theme/nursenestTheme.ts",
      legacyPalette: "pastel hex literals (pink/lavender) — differs from current semantic CSS variable system",
      currentTarget:
        "nursenest-core semantic tokens (semantic-status-tokens.css, theme-palettes, globals) — soft premium, multi-hue status, not flat gray",
    },
    systems: [
      {
        system: "lessons",
        legacyUx: "Long-form sections + embedded quiz cards; tabbed/mobile shells optional.",
        newAesthetic: "Pathway lesson premium sections, semantic panels, nn-progress / badges.",
        destinationSurface: "current lesson page design",
        migrateVisuals: "no — rebuild layout with current section cards",
        reuseAssets: "illustrations if HTTPS and on-brand; otherwise replace",
        mustRebuild: ["section spacing", "typography hierarchy", "semantic borders", "responsive lesson nav"],
      },
      {
        system: "blogs",
        legacyUx: "React pages + automation; mixed SEO clusters.",
        newAesthetic: "Current blog typography + marketing shells",
        destinationSurface: "current blog design",
        migrateVisuals: "no",
        reuseAssets: "hero images if licensed",
        mustRebuild: ["MDX/HTML hygiene", "internal linking to pathways"],
      },
      {
        system: "tools_calculators",
        legacyUx: "Standalone tool pages with legacy form styling.",
        newAesthetic: "Tool hub cards + semantic info/warning panels",
        destinationSurface: "current tool page structure",
        migrateVisuals: "no",
        reuseAssets: "formulas / question JSON",
        mustRebuild: ["inputs", "validation UX", "mobile layout"],
      },
      {
        system: "flashcards",
        legacyUx: "Deck views + swipe/stack metaphors.",
        newAesthetic: "Current flashcard UX + motion discipline",
        destinationSurface: "current flashcard design",
        migrateVisuals: "no",
        reuseAssets: "card content",
        mustRebuild: ["keyboard/a11y", "progress sync"],
      },
      {
        system: "cat_practice",
        legacyUx: "Server-driven adaptive sessions + mock exams.",
        newAesthetic: "Current CAT / practice flows",
        destinationSurface: "current CAT/practice design",
        migrateVisuals: "n/a",
        reuseAssets: "item pools after dedupe",
        mustRebuild: ["session state", "explanation panels"],
      },
      {
        system: "dashboard_progress",
        legacyUx: "Metric tiles + study path hints.",
        newAesthetic: "Learner dashboard semantic charts",
        destinationSurface: "current learner dashboard",
        migrateVisuals: "no",
        reuseAssets: "none directly",
        mustRebuild: ["widgets", "data contracts"],
      },
    ],
  };

  /** Full priority plan */
  const legacyFullRestorationPriorityPlan = {
    ...meta,
    priorityOrderReference: [
      "nursing lessons",
      "nursing question banks",
      "pre/post lesson tests",
      "flashcards",
      "CAT / adaptive improvements",
      "translations",
      "high-quality blogs",
      "tools/calculators",
      "case studies / activities / games",
      "dashboard/progress ideas",
      "allied after nursing stable",
    ],
    restoreImmediately: {
      rationale: "Highest learner value + existing pipelines",
      items: [
        { slug: "lessons-contentMap", path: "client/src/data/lessons/**", migrationOrder: 1 },
        { slug: "exam-questions", path: "client/src/data/exam-questions/**", migrationOrder: 2 },
        { slug: "lesson-embedded-tests", path: "embedded in LessonContent", migrationOrder: 3 },
      ],
    },
    restoreNext: {
      items: [
        { slug: "flashcard-decks", path: "client/src/data/*flashcard*.ts", migrationOrder: 4 },
        { slug: "cat-server-review", path: "server/cat-engine.ts, server/adaptive-engine.ts", migrationOrder: 5 },
        { slug: "i18n-bundles", path: "tools/i18n/source/**", migrationOrder: 6 },
      ],
    },
    rebuildInNewUiLater: {
      items: [
        { slug: "med-math-and-calculators", path: "client/src/pages/med-math.tsx, clinical-calculators.tsx, ..." },
        { slug: "simulators-games", path: "client/src/pages/*simulator*.tsx" },
        { slug: "legacy-page-chrome", path: "client/src/pages/** — all non-content" },
      ],
    },
    contentExtractionOnly: {
      items: [
        { slug: "blog-editorial", path: "blog-related pages + server/blog*.ts" },
        { slug: "case-scenarios-narrative", path: "clinical-scenarios-hub + data narratives" },
      ],
    },
    reviewManuallyBeforeRestore: {
      items: [
        { slug: "generated-batches", path: "**/generated-batch-*.ts", reason: "volume + QA cost" },
        { slug: "lesson-repair-missing-batches", path: "**/lesson-repair*.ts, **/missing-batch*.ts" },
        { slug: "replit-export", paths: replitExport.map((p) => rel(p)) },
      ],
    },
    doNotRestore: {
      items: [
        { slug: "ide-tooling", path: ".local/**, .agents/**" },
        { slug: "stale-artifacts", path: "artifacts/**, dist/**" },
        { slug: "legacy-admin-ops-only", path: "client/src/pages/admin-*.tsx (product admin differs)" },
      ],
    },
    systemsClassification: {
      importMostlyAsContent: ["lessons", "exam questions", "flashcard cards", "blog prose", "med-math items"],
      selectivelyReuseLogic: ["CAT item selection facets", "stem hashing ideas", "study-path prioritization (review)"],
      rebuildInCurrentApp: ["all page components", "navigation", "theme.ts visuals", "dashboard widgets"],
      ignoreAsOutdated: ["Vite-specific route guards tied to old auth shape", "hardcoded hex theme as production source of truth"],
    },
    blockers: [
      "Legacy contentMap size — chunked import only",
      "CAT depends on legacy DB shapes — map to Prisma before porting logic",
      "i18n compile pipeline differs — keys must match nursenest-core rules",
      "Duplicate stem/slug risk — dedupe against production",
    ],
  };

  /** Master map — superset */
  const legacyMasterMigrationMap = {
    generatedAt,
    legacyRoot: LEGACY,
    schemaVersion: SCHEMA_VERSION,
    countsSnapshot: {
      lessonModuleFiles: lessonFilesAll.length,
      lessonKeysInContentMap: counts.lessonCount,
      embeddedLessonQuestions: counts.questionCount,
      careerQuestionFiles: careerQ.length,
      examQuestionFiles: examQ.length,
      flashcardFiles: flashFiles.length,
      blogRelatedTotal: blogMergedPaths.length,
      i18nFiles: i18nFiles.length,
      activityHubPages: activitiesBroad.length,
      catServerFiles: serverCat.length,
      publicAssetFiles: assetLines.length,
      dashboardProgressFiles: dashboardFiles.length,
      toolsPagesDiscovered: toolPaths.length,
    },
    topNursingLessonFilesForReview: lessonFilesAll
      .filter((f) => /rn-|nclex-rn|patho|shock|critical|sepsis|stroke|aki|heart-failure/i.test(f))
      .slice(0, 35)
      .map((f) => rel(f)),
    topLegacyItemsLowPriorityOrDoNotRestore: [
      "client/src/data/lessons/lesson-repair-batch.ts",
      "client/src/data/lessons/missing-batch-*.ts",
      ".local/** Replit / IDE tooling",
    ],
    migrateFirst: legacyFullRestorationPriorityPlan.restoreImmediately.items.map((x) => `${x.path} (order ${x.migrationOrder})`),
    migrateSecond: legacyFullRestorationPriorityPlan.restoreNext.items.map((x) => `${x.path} (order ${x.migrationOrder})`),
    restoreSelectively: [
      "server/cat-engine.ts + adaptive-engine.ts — diff vs nursenest-core",
      "server/study-path.ts — ideas only",
      "Blog automation — extract content only",
    ],
    doNotMigrate: legacyFullRestorationPriorityPlan.doNotRestore.items,
    prioritizationNotes: legacyFullRestorationPriorityPlan.priorityOrderReference.join(" → "),
    blockers: legacyFullRestorationPriorityPlan.blockers,
    nextMigrationOrder: [
      "1) Chunked lesson import + enrichment converter",
      "2) Exam questions with stem-hash dedupe",
      "3) Pre/post with lesson payloads",
      "4) Flashcard deck mapping",
      "5) CAT algorithm review",
      "6) i18n bundle validation",
      "7) Blog editorial extraction",
      "8) Tools rebuild in tool hub",
      "9) Allied content",
    ],
    aestheticRule:
      "Valuable legacy content that looks dated should be migrated as data and rendered with current NurseNest components — never copy legacy Vite page chrome or raw nursenestTheme hex as the system of record.",
  };

  const writers = [
    ["legacy-lessons-inventory.json", legacyLessons],
    ["legacy-questions-inventory.json", legacyQuestions],
    ["legacy-flashcards-inventory.json", legacyFlashcards],
    ["legacy-tests-inventory.json", legacyTests],
    ["legacy-blog-inventory.json", legacyBlog],
    ["legacy-translations-inventory.json", legacyTranslations],
    ["legacy-activities-inventory.json", legacyActivities],
    ["legacy-cat-practice-inventory.json", legacyCat],
    ["legacy-assets-inventory.json", legacyAssets],
    ["legacy-master-migration-map.json", legacyMasterMigrationMap],
    ["legacy-tools-calculators-inventory.json", legacyToolsCalculators],
    ["legacy-case-studies-inventory.json", legacyCaseStudies],
    ["legacy-games-interactives-inventory.json", legacyGamesInteractives],
    ["legacy-dashboard-progress-inventory.json", legacyDashboardProgress],
    ["legacy-study-plans-remediation-inventory.json", legacyStudyPlansRemediation],
    ["legacy-ui-patterns-worth-rebuilding.json", legacyUiPatterns],
    ["legacy-theme-and-aesthetic-mapping.json", legacyThemeAndAestheticMapping],
    ["legacy-full-restoration-priority-plan.json", legacyFullRestorationPriorityPlan],
  ];

  for (const [name, data] of writers) {
    fs.writeFileSync(path.join(AUDIT, name), JSON.stringify(data, null, 2));
  }

  console.log(
    JSON.stringify(
      {
        PASS: true,
        auditDir: AUDIT,
        filesWritten: writers.map((w) => w[0]),
        countsSnapshot: legacyMasterMigrationMap.countsSnapshot,
      },
      null,
      2,
    ),
  );
}

main();
