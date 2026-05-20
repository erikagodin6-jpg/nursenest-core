#!/usr/bin/env node
/**
 * Audit-only: generates legacy-full-file-inventory.json, current-full-file-inventory.json,
 * and companion gap/backlog JSON + audit-summary.md under this directory.
 * Legacy "old site" = in-repo proxy (client/, server/, tools/, etc.); NOT external drives.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const REPO_ROOT = path.resolve(import.meta.dirname, "../../..");
const CURRENT_APP = path.join(REPO_ROOT, "nursenest-core");

const EXCLUDE_RE =
  /node_modules|\.next\/|\/dist\/|\.git\/|pnpm-lock|package-lock|yarn\.lock|\.cache\/|\/build\/|coverage\/|\.png$|\.jpg$|\.jpeg$|\.gif$|\.webp$|\.ico$|\.woff|\.ttf$|\.mp4$|\.webm$|\.pdf$|\.zip$|\.tar\.gz$/i;

const EXT_OK = /\.(ts|tsx|js|jsx|json|md|mdx|sql|csv|txt|yaml|yml|html)$/i;

const LEGACY_ROOTS = [
  path.join(REPO_ROOT, "client"),
  path.join(REPO_ROOT, "server"),
  path.join(REPO_ROOT, "tools"),
  path.join(REPO_ROOT, "backup-system"),
  path.join(REPO_ROOT, "config"),
  path.join(REPO_ROOT, "script"),
];

function walkFiles(root) {
  const out = [];
  function walk(dir) {
    let ents;
    try {
      ents = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (/node_modules|\.next|^dist$|\.git$|\.cache$/i.test(e.name)) continue;
        walk(p);
      } else if (e.isFile()) {
        if (EXCLUDE_RE.test(p)) continue;
        if (!EXT_OK.test(e.name)) continue;
        out.push(p);
      }
    }
  }
  if (fs.existsSync(root)) walk(root);
  return out;
}

function rootLevelAuditFiles() {
  const out = [];
  if (!fs.existsSync(REPO_ROOT)) return out;
  for (const name of fs.readdirSync(REPO_ROOT)) {
    const p = path.join(REPO_ROOT, name);
    if (!fs.statSync(p).isFile()) continue;
    if (!EXT_OK.test(name)) continue;
    if (EXCLUDE_RE.test(p)) continue;
    out.push(p);
  }
  return out;
}

function categorize(rel, isCurrent) {
  const lower = rel.replace(/\\/g, "/").toLowerCase();
  let category = "misc";
  let purpose = "unknown";
  let pathway = "general";
  let country = "unknown";
  let role = "utility-bearing";
  let confidence = "medium";

  if (lower.includes("/i18n/") || lower.endsWith("en.json") && lower.includes("i18n")) {
    category = "translations_locales";
    purpose = "i18n strings or compile inputs";
    role = "metadata-bearing";
  } else if (lower.includes("/data/lessons/") || lower.includes("scoped-lessons")) {
    category = "lessons";
    purpose = "lesson content modules";
    role = "content-bearing";
    confidence = "high";
  } else if (lower.includes("question") && (lower.includes("bank") || lower.includes("exam"))) {
    category = "question_bank";
    purpose = "questions / exam content";
    role = "content-bearing";
  } else if (lower.includes("flashcard")) {
    category = "flashcards";
    purpose = "flashcard decks or UI";
    role = "content-bearing";
  } else if (lower.includes("blog")) {
    category = "blog_seo";
    purpose = "blog or SEO content";
    role = "content-bearing";
  } else if (lower.includes("case-stud") || lower.includes("case_stud")) {
    category = "case_studies";
    purpose = "case study content";
    role = "content-bearing";
  } else if (lower.includes("allied")) {
    category = "allied_health";
    pathway = "allied";
  } else if (lower.includes("pre-nursing") || lower.includes("prenursing")) {
    category = "pre_nursing";
    pathway = "pre-nursing";
  } else if (lower.includes("new-grad") || lower.includes("new_grad") || lower.includes("transition")) {
    category = "new_grad";
    pathway = "new-grad";
  } else if (lower.includes("/np-") || lower.includes("fnp") || lower.includes("np/")) {
    category = "np_pathway";
    pathway = "NP";
  } else if (lower.includes("nclex-pn") || lower.includes("lpn") || lower.includes("/pn/")) {
    category = "pn_pathway";
    pathway = "PN";
  } else if (lower.includes("nclex-rn") || lower.includes("/rn/") || lower.includes("rn-")) {
    category = "rn_pathway";
    pathway = "RN";
  } else if (lower.includes("cat-") || lower.includes("/cat/") || lower.includes("adaptive")) {
    category = "cat_adaptive";
    purpose = "CAT / adaptive exam patterns";
    role = "utility-bearing";
  } else if (lower.includes("/tools/") || lower.includes("calculator")) {
    category = "tools_calculators";
    purpose = "learner tools";
  } else if (lower.includes("/scripts/") || lower.includes("/script/")) {
    category = "scripts_importers";
    purpose = "import, migration, or build scripts";
    role = "utility-bearing";
  } else if (lower.includes("/prisma/migrations/") || lower.endsWith(".sql")) {
    category = "database_migrations";
    role = "metadata-bearing";
  } else if (lower.includes("/app/") && (lower.endsWith("page.tsx") || lower.endsWith("layout.tsx"))) {
    category = "routes_ui";
    purpose = "Next.js routes / UI";
    role = "utility-bearing";
  } else if (lower.includes("/pages/") && lower.endsWith(".tsx")) {
    category = "routes_ui";
    purpose = "Vite/legacy routes";
    role = "utility-bearing";
  }

  if (lower.includes("ca-") || lower.includes("canada") || lower.includes("-ca-")) country = "CA";
  if (lower.includes("us-") || lower.includes("united") || lower.includes("usa")) country = "US";
  if (lower.includes("locale") || lower.includes("/en/") || lower.includes("/fr/")) {
    if (category === "misc") category = "translations_locales";
  }

  return { category, purpose, pathway, country, role, confidence };
}

function toEntry(absPath, roots) {
  const rel = path.relative(REPO_ROOT, absPath).replace(/\\/g, "/");
  const ext = path.extname(absPath).slice(1).toLowerCase();
  const isCurrent = absPath.startsWith(CURRENT_APP + path.sep) || absPath === CURRENT_APP;
  const meta = categorize(rel, isCurrent);
  return {
    relativePath: rel,
    extension: ext,
    ...meta,
    contentBearing: meta.role === "content-bearing",
  };
}

function collectLegacy() {
  const set = new Set();
  for (const r of LEGACY_ROOTS) {
    for (const f of walkFiles(r)) set.add(f);
  }
  for (const f of rootLevelAuditFiles()) set.add(f);
  return [...set].sort();
}

function collectCurrent() {
  return walkFiles(CURRENT_APP).sort();
}

function loadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function main() {
  const outDir = import.meta.dirname;
  const generatedAt = new Date().toISOString();

  const legacyPaths = collectLegacy();
  const currentPaths = collectCurrent();

  const legacyFiles = legacyPaths.map((p) => toEntry(p, LEGACY_ROOTS));
  const currentFiles = currentPaths.map((p) => toEntry(p, [CURRENT_APP]));

  const countBy = (arr, key) =>
    arr.reduce((acc, x) => {
      acc[x[key]] = (acc[x[key]] || 0) + 1;
      return acc;
    }, {});

  const legacyInventory = {
    generatedAt,
    scanScope: {
      note: "EXTERNAL_OLD_SITE_NOT_SCANNED: /Volumes/Backup Plus/NurseNest (and similar) not available in this environment.",
      legacyProxyRoots: LEGACY_ROOTS.map((r) => path.relative(REPO_ROOT, r)),
      repoRoot: REPO_ROOT,
    },
    totals: {
      filesScanned: legacyFiles.length,
      byCategory: countBy(legacyFiles, "category"),
      contentBearingApprox: legacyFiles.filter((f) => f.contentBearing).length,
    },
    files: legacyFiles,
  };

  const currentInventory = {
    generatedAt,
    scanScope: {
      currentAppRoot: path.relative(REPO_ROOT, CURRENT_APP),
      repoRoot: REPO_ROOT,
    },
    totals: {
      filesScanned: currentFiles.length,
      byCategory: countBy(currentFiles, "category"),
      contentBearingApprox: currentFiles.filter((f) => f.contentBearing).length,
    },
    files: currentFiles,
  };

  fs.writeFileSync(path.join(outDir, "legacy-full-file-inventory.json"), JSON.stringify(legacyInventory, null, 2));
  fs.writeFileSync(path.join(outDir, "current-full-file-inventory.json"), JSON.stringify(currentInventory, null, 2));

  // Pull prior audit summaries if present
  const lessonInv = loadJson(path.join(outDir, "legacy-lesson-source-inventory.json"));
  const catCompare = loadJson(path.join(outDir, "legacy-vs-current-cat-comparison.json"));
  const lessonMap = loadJson(path.join(outDir, "legacy-to-current-lesson-map.json"));

  const legacyLessonKeys = lessonInv?.totals?.legacyContentMapLessonKeys ?? null;
  const mapSummary = lessonMap?.summary ?? null;

  const gapRows = [
    {
      id: "external_drive_unavailable",
      status: "E",
      label: "Full old-site tree on external volume",
      rationale:
        "Cannot verify file-by-file parity with /Volumes/Backup Plus/NurseNest from this workspace; use in-repo client/server/tools as proxy.",
      migrationValue: "unknown_until_mounted",
      implementationRisk: "n/a",
    },
    {
      id: "legacy_lesson_ts_corpus",
      status: mapSummary?.createMissing > 100 ? "C" : "B",
      label: "Legacy client/src/data/lessons TypeScript lesson corpus vs Prisma/pathway catalog",
      rationale:
        lessonMap?.summary
          ? `Mapping summary: createMissing=${mapSummary.createMissing}, mergeIntoExisting=${mapSummary.mergeIntoExisting}. Most legacy IDs lack automatic slug match to current pathway lessons.`
          : "legacy-to-current-lesson-map indicates large create_missing backlog.",
      migrationValue: "high",
      implementationRisk: "medium_high_structured_import",
    },
    {
      id: "cat_progress_resume_ux",
      status: "B",
      label: "CAT / mock exam checkpoint & recovery UX",
      rationale: catCompare?.categories?.find((c) => c.id === "progress_resume")?.verdict === "legacy_better"
        ? "Legacy mock-exam-session + session-checkpoint patterns richer than current; selective port of recovery UX."
        : "See legacy-vs-current-cat-comparison.json",
      migrationValue: "high_learner_trust",
      implementationRisk: "medium_must_not_fork_engine",
    },
    {
      id: "vite_monolith_parallel_marketing",
      status: "B",
      label: "Parallel Vite marketing / home vs Next marketing",
      rationale:
        "docs/legacy-restoration-map.md: client home components duplicate Next; long-term drift risk.",
      migrationValue: "medium_maintainability",
      implementationRisk: "low",
    },
    {
      id: "i18n_single_pipeline",
      status: "A",
      label: "i18n compile pipeline",
      rationale: "Current tools/i18n merged compile is canonical; do not reintroduce parallel loaders.",
      migrationValue: "n/a",
      implementationRisk: "low",
    },
    {
      id: "flashcards_qbank_alignment",
      status: "B",
      label: "Flashcards + question bank cross-links",
      rationale: "See legacy-flashcards-questionbank-inventory.json — alignment work may be partial.",
      migrationValue: "medium",
      implementationRisk: "low_medium",
    },
  ];

  const gapAnalysis = {
    generatedAt,
    methodology: "Semantic + repo-documented proxies; not a byte-level compare to external NurseNest export.",
    rows: gapRows,
    references: [
      "docs/legacy-restoration-map.md",
      "data/audit/legacy-to-current-lesson-map.json",
      "data/audit/legacy-vs-current-cat-comparison.json",
    ],
  };

  fs.writeFileSync(path.join(outDir, "legacy-vs-current-gap-analysis.json"), JSON.stringify(gapAnalysis, null, 2));

  const migrationByCategory = {
    generatedAt,
    categories: [
      {
        id: "nursing_lessons",
        oldProxy: "client/src/data/lessons/*.ts, nursenest-core/src/lib/lessons/scoped-lessons/*",
        current: "Prisma lessons + pathway registry + scoped TS modules",
        missingOrPartial: [
          "Thousands of legacy lesson IDs mapped to create_missing in legacy-to-current-lesson-map.json",
          "Pre/post/activities parity per lesson varies — enrichments JSON under data/lesson-enrichments/",
        ],
        migrationValue: "critical",
      },
      {
        id: "question_banks",
        oldProxy: "server + client exam question references, data exports",
        current: "Prisma exam_questions + pathway snapshots",
        missingOrPartial: ["Dedupe and crosswalk in legacy-question-duplicates.json"],
        migrationValue: "high",
      },
      {
        id: "allied_health",
        oldProxy: "allied* lesson files in client data",
        current: "allied-health marketing routes + lessons",
        missingOrPartial: ["Coverage vs full legacy allied corpus — verify per pathway"],
        migrationValue: "high",
      },
      {
        id: "new_grad",
        oldProxy: "scattered in legacy lessons / marketing",
        current: "Dedicated routes if present — verify programmatic registry",
        missingOrPartial: ["Needs explicit content audit vs legacy"],
        migrationValue: "medium",
      },
      {
        id: "case_studies_activities_tests",
        oldProxy: "embedded in lesson TS, activities flags in legacy-lesson-source-inventory",
        current: "pathway lesson body + bank assessments",
        missingOrPartial: ["Activity depth may be lower until enrichments imported"],
        migrationValue: "high",
      },
      {
        id: "tools_calculators",
        oldProxy: "client pages tools",
        current: "src/app/(marketing)/.../tools/",
        missingOrPartial: ["Compare route registry vs client tool pages"],
        migrationValue: "medium_conversion",
      },
      {
        id: "blog_seo",
        oldProxy: "tools/i18n marketing, blog manifests",
        current: "blog pipelines under src/lib/blog, data/blog-manifest",
        missingOrPartial: ["Batch imports in data/blog-manifest — ongoing"],
        migrationValue: "high_seo",
      },
      {
        id: "translations",
        oldProxy: "tools/i18n",
        current: "public/i18n, compile pipeline",
        missingOrPartial: ["Locale parity — compare compiled bundles"],
        migrationValue: "high",
      },
      {
        id: "flashcards_quick_review",
        oldProxy: "legacy flashcard inventory JSON",
        current: "src/components/flashcards",
        missingOrPartial: ["Deck coverage vs legacy — see flashcards audit JSONs"],
        migrationValue: "medium",
      },
      {
        id: "cat_adaptive",
        oldProxy: "client mock exam + server cat-session-api",
        current: "lib/exams/cat-engine, Prisma sessions",
        missingOrPartial: ["Resume/checkpoint UX from legacy (see gap analysis)"],
        migrationValue: "high_trust",
      },
    ],
  };

  fs.writeFileSync(
    path.join(outDir, "migration-opportunities-by-category.json"),
    JSON.stringify(migrationByCategory, null, 2),
  );

  const highValueMissing = {
    generatedAt,
    items: [
      {
        rank: 1,
        title: "Finish structured migration for legacy lesson IDs still in create_missing",
        bucket: "C",
        evidence: "legacy-to-current-lesson-map.json summary",
        effort: "larger_project",
      },
      {
        rank: 2,
        title: "Port selective CAT/mock checkpoint & recovery UX (not engine fork)",
        bucket: "B",
        evidence: "legacy-vs-current-cat-comparison.json progress_resume",
        effort: "medium",
      },
      {
        rank: 3,
        title: "Align flashcard decks with catalog exam questions (dedupe reports)",
        bucket: "B",
        evidence: "legacy-flashcards-questionbank-inventory.json",
        effort: "medium",
      },
      {
        rank: 4,
        title: "Close allied-health lesson coverage gaps vs legacy client corpus",
        bucket: "B",
        evidence: "legacy-lesson-source-inventory allied hints",
        effort: "medium",
      },
      {
        rank: 5,
        title: "Blog/SEO batch: data/blog-manifest pipelines to indexed pages",
        bucket: "B",
        evidence: "data/blog-manifest",
        effort: "quick_win_to_medium",
      },
    ],
  };

  fs.writeFileSync(path.join(outDir, "high-value-missing-content.json"), JSON.stringify(highValueMissing, null, 2));

  const unsafe = {
    generatedAt,
    items: [
      {
        id: "legacy_express_cat_engine",
        reason: "Duplicate adaptive logic; current cat-engine + Prisma is source of truth.",
        recommendation: "Study UX only; do not copy server paths wholesale.",
      },
      {
        id: "raw_gs_image_urls",
        reason: "legacy-restoration rule: do not reintroduce raw gs:// URLs",
        recommendation: "Re-host via approved asset pipeline.",
      },
      {
        id: "monolith_client_parallel_i18n_loader",
        reason: "Violates single compile pipeline guarantee",
        recommendation: "Merge strings into tools/i18n inputs only.",
      },
      {
        id: "full_mock_exam_session_port",
        reason: "Very large monolithic client module; high regression risk",
        recommendation: "Extract discrete patterns (checkpoint UI) only.",
      },
    ],
  };

  fs.writeFileSync(
    path.join(outDir, "unsafe-or-not-recommended-direct-migrations.json"),
    JSON.stringify(unsafe, null, 2),
  );

  const backlog = {
    generatedAt,
    priority1: [
      { task: "Mount external NurseNest export and re-run inventory diff against this baseline", type: "audit" },
      { task: "Drive down create_missing lessons using existing importers + enrichment JSON", type: "content_engineering" },
      { task: "CAT resume/checkpoint UX parity (engine unchanged)", type: "engineering_ux" },
    ],
    priority2: [
      { task: "Flashcard ↔ question bank alignment per audit JSONs", type: "content" },
      { task: "Allied pathway coverage verification", type: "content" },
      { task: "Tools route parity: legacy client tools vs Next tools pages", type: "engineering" },
    ],
    priority3: [
      { task: "New-grad / transition content cluster migration", type: "content" },
      { task: "Locale parity review (compiled i18n)", type: "content" },
    ],
    priority4: [
      { task: "Deprecate or document parallel Vite marketing duplicates", type: "maintainability" },
      { task: "Legacy Express CAT endpoints — keep dev-only; do not revive as prod", type: "risk_reduction" },
    ],
  };

  fs.writeFileSync(path.join(outDir, "proposed-implementation-backlog.json"), JSON.stringify(backlog, null, 2));

  const summaryMd = `# NurseNest legacy vs current audit summary

**Generated:** ${generatedAt}

## Critical limitation

- **External old-site path not scanned:** \`/Volumes/Backup Plus/NurseNest\` is **not available** in the environment where this audit was generated.
- **Legacy proxy used:** \`client/\`, \`server/\`, \`tools/\`, \`backup-system/\`, \`config/\`, \`script/\`, plus repo-root \`*.ts\` / \`*.txt\` audit helpers — consistent with \`docs/legacy-restoration-map.md\`.

## Counts (best-effort)

| Metric | Value |
|--------|------:|
| Total legacy-proxy files inventoried | ${legacyFiles.length} |
| Total current-app (\`nursenest-core/\`) files inventoried | ${currentFiles.length} |
| Legacy content-bearing (heuristic) | ${legacyInventory.totals.contentBearingApprox} |
| Current content-bearing (heuristic) | ${currentInventory.totals.contentBearingApprox} |
| Legacy lesson index keys (prior audit) | ${legacyLessonKeys ?? "see legacy-lesson-source-inventory.json"} |
| Lesson map create_missing (prior audit) | ${mapSummary?.createMissing ?? "see legacy-to-current-lesson-map.json"} |
| High-value gap rows (this pass) | ${gapRows.filter((g) => g.status === "C" || g.migrationValue === "high").length} (approx; see JSON) |
| Partial migration signals | ${gapRows.filter((g) => g.status === "B").length}+ |
| Unsafe direct migration entries | ${unsafe.items.length} |

### Category heuristics (automated)

- **Lessons (proxy):** ${legacyInventory.totals.byCategory["lessons"] ?? 0} legacy / ${currentInventory.totals.byCategory["lessons"] ?? 0} current files tagged \`lessons\`
- **Question bank:** ${legacyInventory.totals.byCategory["question_bank"] ?? 0} / ${currentInventory.totals.byCategory["question_bank"] ?? 0}
- **Blog/SEO:** ${legacyInventory.totals.byCategory["blog_seo"] ?? 0} / ${currentInventory.totals.byCategory["blog_seo"] ?? 0}
- **Tools:** ${legacyInventory.totals.byCategory["tools_calculators"] ?? 0} / ${currentInventory.totals.byCategory["tools_calculators"] ?? 0}
- **Translations:** ${legacyInventory.totals.byCategory["translations_locales"] ?? 0} / ${currentInventory.totals.byCategory["translations_locales"] ?? 0}
- **Allied:** ${legacyInventory.totals.byCategory["allied_health"] ?? 0} / ${currentInventory.totals.byCategory["allied_health"] ?? 0}
- **New grad:** ${legacyInventory.totals.byCategory["new_grad"] ?? 0} / ${currentInventory.totals.byCategory["new_grad"] ?? 0}
- **CAT/adaptive:** ${legacyInventory.totals.byCategory["cat_adaptive"] ?? 0} / ${currentInventory.totals.byCategory["cat_adaptive"] ?? 0}
- **Scripts/importers:** ${legacyInventory.totals.byCategory["scripts_importers"] ?? 0} / ${currentInventory.totals.byCategory["scripts_importers"] ?? 0}

## Strongest recommendations

1. **Mount or copy** the full external NurseNest export into the repo (or symlink) and **re-run** inventory diff — this report is necessarily incomplete without it.
2. Treat **legacy-to-current-lesson-map.json** \`create_missing\` backlog as the master **content** gap list for RN/PN/NP/allied.
3. For **CAT**, port **UX patterns** (checkpoint/recovery) only; keep **current cat-engine + APIs** as truth.
4. Keep **one i18n pipeline**; never copy alternate client loaders.
5. Use existing **data/audit/*.json** (flashcards, duplicates, CAT) as working inputs — do not duplicate audit logic ad hoc.

## Artifacts written

- \`legacy-full-file-inventory.json\`
- \`current-full-file-inventory.json\`
- \`legacy-vs-current-gap-analysis.json\`
- \`migration-opportunities-by-category.json\`
- \`high-value-missing-content.json\`
- \`unsafe-or-not-recommended-direct-migrations.json\`
- \`audit-summary.md\` (this file)
- \`proposed-implementation-backlog.json\`
- \`_generate-full-audit-artifacts.mjs\` (regenerator; audit-only)

`;

  fs.writeFileSync(path.join(outDir, "audit-summary.md"), summaryMd);

  console.log("Wrote audit artifacts to", outDir);
  console.log("legacy files:", legacyFiles.length, "current files:", currentFiles.length);
}

main();
