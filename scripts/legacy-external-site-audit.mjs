#!/usr/bin/env node
/**
 * Read-only audit of /root/nursenest-core/external/NurseNest
 * Writes JSON inventories to nursenest-core/data/audit/
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const LEGACY = "/root/nursenest-core/external/NurseNest";
const APP_ROOT = path.resolve(import.meta.dirname, "..");
const AUDIT = path.join(APP_ROOT, "data/audit");

const EXCLUDE_FIND = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".cache",
  "attached_assets/generated_images",
];

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
  const lines = r.stdout.split("\n").filter(Boolean);
  return lines.slice(0, maxFiles);
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

function tierFromPath(rel) {
  const p = rel.toLowerCase();
  if (p.includes("rpn") || p.includes("lpn") || p.includes("lvn") || p.includes("rex-pn")) return ["PN/RPN/LVN"];
  if (p.includes("np-") || p.includes("/np") || p.includes("fnp")) return ["NP"];
  if (p.includes("allied") || p.includes("mlt") || p.includes("rrt") || p.includes("paramedic") || p.includes("imaging") || p.includes("surgical-tech") || p.includes("pta") || p.includes("ota")) return ["Allied"];
  if (p.includes("rn-") || p.includes("/rn") || p.includes("nclex-rn")) return ["RN"];
  return ["mixed/unknown"];
}

function riskFlags(rel, kind) {
  const f = [];
  if (rel.includes("generated-batch") || rel.includes("repair")) f.push("legacy-format");
  if (rel.includes("missing-batch")) f.push("partial-data");
  if (kind === "lesson" && rel.endsWith(".ts")) f.push("schema-transform-needed");
  if (rel.includes("replit-export")) f.push("unknown-dependency");
  return [...new Set(f)];
}

function dest(kind) {
  const m = {
    lessons: "pathway-lessons + convert-legacy-lesson-to-enrichment pipeline",
    questions: "exam question import / qbank sync",
    flashcards: "flashcard decks + pathway linkage",
    tests: "pathway lesson preTest/postTest JSON",
    blog: "blog posts / CMS",
    translations: "next-intl / locale JSON",
    activities: "learner activities / tools routes",
    cat: "server CAT engine parity + API",
    assets: "public assets / CDN",
  };
  return m[kind] || "TBD";
}

function run() {
  if (!fs.existsSync(LEGACY)) {
    console.error(JSON.stringify({ error: "LEGACY_ROOT_NOT_FOUND", LEGACY }));
    process.exit(1);
  }

  fs.mkdirSync(AUDIT, { recursive: true });

  const lessonFiles = findFiles(LEGACY, [".ts", ".tsx"]).filter(
    (f) => f.includes("/client/src/data/lessons/") && !f.endsWith("types.ts"),
  );
  let lessonKeyEstimate = null;
  let embeddedQuestionCount = null;
  const tsxCount = spawnSync(
    "npx",
    [
      "--yes",
      "tsx",
      "-e",
      `import { lessonCount, questionCount } from './client/src/data/lessons/index.ts'; console.log(JSON.stringify({lessonCount,questionCount}));`,
    ],
    { cwd: LEGACY, encoding: "utf8", maxBuffer: 1024 * 1024 },
  );
  if (tsxCount.status === 0 && tsxCount.stdout) {
    try {
      const j = JSON.parse(tsxCount.stdout.trim());
      lessonKeyEstimate = j.lessonCount;
      embeddedQuestionCount = j.questionCount;
    } catch {
      /* optional */
    }
  }

  const careerQ = findFiles(LEGACY, [".ts"]).filter((f) => f.includes("/client/src/data/career-questions/"));
  const examQ = findFiles(LEGACY, [".ts"]).filter((f) => f.includes("/client/src/data/exam-questions/"));
  const flashFiles = findFiles(LEGACY, [".ts"]).filter((f) => f.includes("/client/src/data/") && f.includes("flashcard"));

  const dataJson = findFiles(LEGACY, [".json"]).filter((f) => f.includes("/data/") && !f.includes("node_modules"));

  const serverCat = findFiles(LEGACY, [".ts"]).filter(
    (f) =>
      f.includes("/server/") &&
      (f.includes("cat-") || f.includes("adaptive") || f.includes("cat-engine") || f.includes("cat_session")),
  );

  const blogPages = findFiles(LEGACY, [".tsx", ".ts"]).filter(
    (f) => f.includes("blog") && (f.includes("/pages/") || f.includes("/components/")),
  );

  const i18nFiles = findFiles(LEGACY, [".json", ".ts"]).filter(
    (f) => f.includes("i18n") || f.includes("/locales/") || f.includes("/translations/"),
  );

  const toolsFiles = findFiles(LEGACY, [".tsx", ".ts"]).filter(
    (f) =>
      (f.includes("/client/src/pages/") && (f.includes("tool") || f.includes("calculator") || f.includes("case"))) ||
      (f.includes("/tools/") && f.endsWith(".ts")),
  );

  const publicAssets = spawnSync(
    "find",
    [LEGACY, "-path", "*/public/*", "-type", "f"],
    { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 },
  );
  const assetLines = publicAssets.stdout ? publicAssets.stdout.split("\n").filter(Boolean) : [];

  const replitExport = findFiles(LEGACY, [".json"]).filter((f) => f.includes("replit-export"));

  /** Sample pre/post from lessons: count preTest/postTest keys across a sample of files */
  let preTestHits = 0;
  let postTestHits = 0;
  for (const fp of lessonFiles.slice(0, 80)) {
    const pre = countRegexInFile(fp, /\bpreTest\s*:/g);
    const post = countRegexInFile(fp, /\bpostTest\s*:/g);
    if (pre.count) preTestHits += pre.count;
    if (post.count) postTestHits += post.count;
  }

  const stemCountSample = examQ.slice(0, 50).reduce((acc, fp) => {
    const c = countRegexInFile(fp, /\bstem\s*:/g);
    return acc + (c.count || 0);
  }, 0);

  const flashcardObjectEstimate = flashFiles.reduce((acc, fp) => {
    const c = countRegexInFile(fp, /\bid\s*:\s*["']/g);
    return acc + (c.count || 0);
  }, 0);

  const mkEntry = (rel, type, opts = {}) => ({
    sourcePath: rel,
    contentType: type,
    estimatedRecordCount: opts.count ?? null,
    professionTier: tierFromPath(rel),
    locale: opts.locale ?? "en (default in legacy client)",
    reusability: opts.reusability ?? "transform-needed",
    riskFlags: riskFlags(rel, type),
    recommendedDestination: dest(opts.kind || type),
    notes: opts.notes ?? "",
  });

  const legacyLessons = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    format: "primarily TypeScript modules (LessonContent) merged via client/src/data/lessons/index.ts",
    summary: {
      lessonModuleFiles: lessonFiles.length,
      lessonKeysInContentMap: lessonKeyEstimate,
      embeddedQuestionsInLessons: embeddedQuestionCount,
      indexPath: "client/src/data/lessons/index.ts",
    },
    files: lessonFiles.map((fp) => {
      const rel = path.relative(LEGACY, fp);
      return mkEntry(rel, "lesson", {
        kind: "lesson",
        count: null,
        reusability: "transform-needed",
        notes: "Import via contentMap keys; align to pathway-lesson schema in nursenest-core.",
      });
    }),
  };

  const legacyQuestions = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    summary: {
      careerQuestionTsFiles: careerQ.length,
      examQuestionTsFiles: examQ.length,
      sampleStemOccurrencesInFirst50ExamFiles: stemCountSample,
    },
    files: [...careerQ, ...examQ].map((fp) => {
      const rel = path.relative(LEGACY, fp);
      const c = countRegexInFile(fp, /\bstem\s*:/g);
      return mkEntry(rel, careerQ.includes(fp) ? "career_question_bank" : "exam_question_bank", {
        kind: "questions",
        count: c.count,
        reusability: c.truncated ? "partial-data" : "transform-needed",
        notes: c.truncated ? "file large; count not fully scanned" : "",
      });
    }),
  };

  const legacyFlashcards = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    summary: {
      flashcardTsFiles: flashFiles.length,
      estimatedCardObjectsByIdPatternSum: flashcardObjectEstimate,
    },
    files: flashFiles.map((fp) => {
      const rel = path.relative(LEGACY, fp);
      return mkEntry(rel, "flashcard_deck", {
        kind: "flashcards",
        reusability: "transform-needed",
        notes: "Verify deck IDs vs current flashcard pipeline.",
      });
    }),
  };

  const legacyTests = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    summary: {
      note: "Pre/post tests are embedded in LessonContent (preTest/postTest arrays), not separate DB tables in client data.",
      sampleFilesScannedForPrePostMarkers: Math.min(80, lessonFiles.length),
      preTestFieldOccurrencesInSample: preTestHits,
      postTestFieldOccurrencesInSample: postTestHits,
    },
    files: lessonFiles.slice(0, 200).map((fp) => {
      const rel = path.relative(LEGACY, fp);
      return mkEntry(rel, "lesson_embedded_tests", {
        kind: "tests",
        reusability: "transform-needed",
        notes: "Extract with lesson body during pathway lesson sync.",
      });
    }),
  };

  const legacyBlog = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    summary: {
      blogRelatedSourceFiles: blogPages.length,
      normalizedForImport: "partial — depends on page components vs markdown CMS",
    },
    files: blogPages.map((fp) => {
      const rel = path.relative(LEGACY, fp);
      return mkEntry(rel, "blog_ui", {
        kind: "blog",
        reusability: "transform-needed",
        notes: "May need content extraction from React pages to markdown/DB.",
      });
    }),
  };

  const legacyTranslations = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    summary: {
      i18nRelatedFiles: i18nFiles.length,
      completeness: "unknown without parsing each locale",
    },
    files: i18nFiles.slice(0, 500).map((fp) => {
      const rel = path.relative(LEGACY, fp);
      const locale = rel.includes("/fr/") ? "fr" : rel.includes("/es/") ? "es" : "multi";
      return mkEntry(rel, "translation_or_i18n", {
        kind: "translations",
        locale,
        reusability: "as-is where JSON matches next-intl shape",
        notes: "Validate against docs/i18n-architecture in target app.",
      });
    }),
  };

  const legacyActivities = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    summary: {
      toolCaseCalculatorPages: toolsFiles.length,
    },
    files: toolsFiles.map((fp) => {
      const rel = path.relative(LEGACY, fp);
      return mkEntry(rel, "activity_or_tool_page", {
        kind: "activities",
        reusability: "transform-needed",
        riskFlags: [...riskFlags(rel, "activities"), "legacy-format"],
        notes: "Often tightly coupled to legacy router/pages.",
      });
    }),
  };

  const legacyCat = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    summary: {
      coreFiles: serverCat.length,
      engines: ["cat-engine.ts", "adaptive-engine.ts", "cat-session-api.ts", "sm2-engine.ts (related)"].filter((n) =>
        serverCat.some((p) => p.endsWith(n)),
      ),
    },
    files: serverCat.map((fp) => {
      const rel = path.relative(LEGACY, fp);
      return mkEntry(rel, "cat_adaptive_server", {
        kind: "cat",
        reusability: "selective — compare to current CAT; do not fork blindly",
        riskFlags: [...riskFlags(rel, "cat"), "unknown-dependency"],
        notes: "Requires DB schema + API parity review before reuse.",
      });
    }),
  };

  const legacyAssets = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    summary: {
      publicRasterVectorFilesCounted: assetLines.length,
      note: "attached_assets skipped in find prune; re-scan if full media audit needed.",
    },
    samplePaths: assetLines.slice(0, 100).map((fp) => path.relative(LEGACY, fp)),
  };

  const topNursingCandidates = lessonFiles
    .filter((f) => /rn-|nclex-rn|patho-cardio|patho-endocrine|shock|critical/i.test(f))
    .slice(0, 30)
    .map((fp) => path.relative(LEGACY, fp));

  const doNotRestoreExamples = [
    "client/src/data/lessons/lesson-repair-batch.ts (repair scaffolding — validate before merge)",
    "client/src/data/lessons/missing-batch-*.ts (explicitly marked missing/incomplete in name)",
    ".local/** Replit secondary skills (non-NurseNest product)",
  ];

  const master = {
    generatedAt: new Date().toISOString(),
    legacyRoot: LEGACY,
    topNursingLessonFilesForReview: topNursingCandidates,
    topLegacyItemsLowPriorityOrDoNotRestore: doNotRestoreExamples,
    migrateFirst: [
      "client/src/data/lessons/** (nursing + NP + allied lesson corpus)",
      "client/src/data/exam-questions/** (NCLEX-style stems)",
      "Embedded preTest/postTest inside LessonContent via lesson pipeline",
      "client/src/data/flashcards-*.ts decks (RN/NP/RPN)",
    ],
    migrateSecond: [
      "client/src/data/career-questions/** (allied career banks)",
      "Translation/locale JSON under tools/i18n and dist/public/i18n",
      "public/** educational imagery tied to lessons",
    ],
    restoreSelectively: [
      "server/cat-engine.ts + adaptive-engine.ts (logic review vs current)",
      "server/qbank-api.ts patterns (non-breaking adapter ideas only)",
      "Blog/imaging-blog pages → extract editorial content",
    ],
    doNotMigrate: [
      ".local/** (IDE/Replit tooling)",
      ".agents/**",
      "artifacts/** stale builds",
      "migrations/** as authoritative schema for old DB only — use as reference",
      "Secondary skills under .local/secondary_skills (non-product)",
    ],
    prioritizationNotes: "Per user: nursing lessons → question banks → pre/post → flashcards → CAT logic → blog → translations → allied.",
    blockers: [
      "Lesson volume requires chunked import; do not load full contentMap in one process on low-memory hosts.",
      "CAT/adaptive paths depend on legacy Postgres schema — map to current Prisma before reuse.",
      "Blog may be React-embedded; needs HTML/markdown extraction for current blog pipeline.",
    ],
    nextMigrationOrder: [
      "1) Freeze snapshot of legacy lesson keys vs current catalog (already partially in repo audits).",
      "2) Import nursing lessons via existing nurse-nest importer + enrichment converter.",
      "3) Stem-hash dedupe exam questions against current ExamQuestion.",
      "4) Flashcard deck mapping by deck ID/slug.",
      "5) CAT: diff cat-engine.ts vs nursenest-core server implementation.",
      "6) i18n JSON validation against current locale files.",
      "7) Allied career questions after RN/PN/NP pathways stable.",
    ],
  };

  fs.writeFileSync(path.join(AUDIT, "legacy-lessons-inventory.json"), JSON.stringify(legacyLessons, null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-questions-inventory.json"), JSON.stringify(legacyQuestions, null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-flashcards-inventory.json"), JSON.stringify(legacyFlashcards, null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-tests-inventory.json"), JSON.stringify(legacyTests, null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-blog-inventory.json"), JSON.stringify(legacyBlog, null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-translations-inventory.json"), JSON.stringify(legacyTranslations, null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-activities-inventory.json"), JSON.stringify(legacyActivities, null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-cat-practice-inventory.json"), JSON.stringify(legacyCat, null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-assets-inventory.json"), JSON.stringify(legacyAssets, null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-master-migration-map.json"), JSON.stringify(master, null, 2));

  const counts = {
    lessonModuleFiles: lessonFiles.length,
    lessonKeysInContentMap: lessonKeyEstimate,
    embeddedQuestionsInLessons: embeddedQuestionCount,
    careerQuestionFiles: careerQ.length,
    examQuestionFiles: examQ.length,
    flashcardFiles: flashFiles.length,
    blogRelatedFiles: blogPages.length,
    i18nFilesListed: Math.min(500, i18nFiles.length),
    activityToolFiles: toolsFiles.length,
    catServerFiles: serverCat.length,
    publicImageAssets: assetLines.length,
    replitJsonFiles: replitExport.length,
  };

  console.log(JSON.stringify({ ok: true, LEGACY, AUDIT, counts }, null, 2));
}

run();
