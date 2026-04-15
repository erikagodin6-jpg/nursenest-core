#!/usr/bin/env npx tsx
/**
 * Legacy vs current CAT / practice-test audit (read-only JSON outputs).
 * Does not modify schema, routes, auth, entitlements, or marketing/homepage.
 *
 * Run from nursenest-core/: npx tsx scripts/build-legacy-cat-audit.mts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");
const AUDIT = path.join(ROOT, "data", "audit");

function walkFiles(dir: string, pred: (rel: string) => boolean, base = dir, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(base, full).replace(/\\/g, "/");
    if (ent.isDirectory()) walkFiles(full, pred, base, out);
    else if (ent.isFile() && pred(rel)) out.push(full);
  }
  return out;
}

function relWs(abs: string): string {
  return path.relative(WORKSPACE, abs).replace(/\\/g, "/");
}

function relNc(abs: string): string {
  return path.relative(ROOT, abs).replace(/\\/g, "/");
}

/** Curated legacy CAT-related modules (monolith client + Express server). */
const LEGACY_CURATED: {
  path: string;
  componentOrModule: string;
  purpose: string;
  controls: Record<string, boolean>;
}[] = [
  {
    path: "client/src/lib/cat-engine.ts",
    componentOrModule: "cat-engine (client)",
    purpose:
      "Client-side CAT state: initCAT, domain coverage, ability history, stopping, readiness/scaled score helpers for mock exam UI.",
    controls: {
      sessionStart: false,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: false,
      scoring: true,
      results: true,
      rationaleReview: false,
      readinessUx: true,
      layoutPresentation: false,
    },
  },
  {
    path: "client/src/pages/mock-exam-session.tsx",
    componentOrModule: "MockExamSession",
    purpose:
      "Large mock/CAT session page: blueprint-driven pools, option shuffle, timer, flags, pause, checkpoints, error recovery, optional server sync.",
    controls: {
      sessionStart: true,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: true,
      scoring: true,
      results: false,
      rationaleReview: true,
      readinessUx: true,
      layoutPresentation: true,
    },
  },
  {
    path: "client/src/pages/mock-exam-report.tsx",
    componentOrModule: "MockExamReport",
    purpose: "Post-session report / analytics for mock exams.",
    controls: {
      sessionStart: false,
      questionDelivery: false,
      adaptiveSelection: false,
      progress: false,
      resume: false,
      scoring: true,
      results: true,
      rationaleReview: true,
      readinessUx: true,
      layoutPresentation: true,
    },
  },
  {
    path: "client/src/lib/flagship-mock-exam-configs.ts",
    componentOrModule: "flagship-mock-exam-configs",
    purpose: "Blueprint/time limits and exam metadata for flagship mock flows.",
    controls: {
      sessionStart: true,
      questionDelivery: false,
      adaptiveSelection: false,
      progress: false,
      resume: false,
      scoring: false,
      results: false,
      rationaleReview: false,
      readinessUx: true,
      layoutPresentation: false,
    },
  },
  {
    path: "client/src/lib/session-checkpoint.ts",
    componentOrModule: "session-checkpoint",
    purpose: "Checkpoint manager for long exam sessions (resume / recovery).",
    controls: {
      sessionStart: false,
      questionDelivery: false,
      adaptiveSelection: false,
      progress: true,
      resume: true,
      scoring: false,
      results: false,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: false,
    },
  },
  {
    path: "client/src/lib/exam-session-checkpoint.ts",
    componentOrModule: "exam-session-checkpoint",
    purpose: "Clear/persist exam checkpoint helpers.",
    controls: {
      sessionStart: false,
      questionDelivery: false,
      adaptiveSelection: false,
      progress: true,
      resume: true,
      scoring: false,
      results: false,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: false,
    },
  },
  {
    path: "client/src/components/exam-fallbacks.tsx",
    componentOrModule: "exam-fallbacks",
    purpose: "Guards for media/translation/rationale, safe player, recovery prompts, printable backup.",
    controls: {
      sessionStart: false,
      questionDelivery: true,
      adaptiveSelection: false,
      progress: false,
      resume: true,
      scoring: false,
      results: false,
      rationaleReview: true,
      readinessUx: false,
      layoutPresentation: true,
    },
  },
  {
    path: "server/cat-session-api.ts",
    componentOrModule: "cat-session-api",
    purpose:
      "Express routes /api/cat/start and /api/cat/:id/answer with PG exam_questions; simple logistic IRT-ish ability update; entitlement gate cat_exams.",
    controls: {
      sessionStart: true,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: false,
      scoring: true,
      results: false,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: false,
    },
  },
  {
    path: "server/cat-engine.ts",
    componentOrModule: "cat-engine (server)",
    purpose: "Server-side ability estimation helpers, expected accuracy bands, candidate scoring utilities (used with adaptive flows).",
    controls: {
      sessionStart: false,
      questionDelivery: false,
      adaptiveSelection: true,
      progress: false,
      resume: false,
      scoring: true,
      results: true,
      rationaleReview: false,
      readinessUx: true,
      layoutPresentation: false,
    },
  },
  {
    path: "server/cat-exam-resilience.ts",
    componentOrModule: "cat-exam-resilience",
    purpose: "Resilience helpers for CAT exam delivery.",
    controls: {
      sessionStart: false,
      questionDelivery: true,
      adaptiveSelection: false,
      progress: true,
      resume: true,
      scoring: false,
      results: false,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: false,
    },
  },
  {
    path: "server/mlt-adaptive-engine.ts",
    componentOrModule: "mlt-adaptive-engine",
    purpose: "MLT-specific CAT simulation: selectNextQuestion, shouldStopCAT, simulateCAT, session state.",
    controls: {
      sessionStart: true,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: false,
      scoring: true,
      results: true,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: false,
    },
  },
];

/** Curated current-app CAT / practice-test stack (Next.js nursenest-core). */
const CURRENT_CURATED: typeof LEGACY_CURATED = [
  {
    path: "nursenest-core/src/lib/exams/cat-engine.ts",
    componentOrModule: "exams/cat-engine",
    purpose:
      "Production CAT for practice tests: Prisma pool rows, blueprint diagnostics, theta/SE, stopping rules, exam simulation bounds, CAT report.",
    controls: {
      sessionStart: false,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: false,
      scoring: true,
      results: true,
      rationaleReview: false,
      readinessUx: true,
      layoutPresentation: false,
    },
  },
  {
    path: "nursenest-core/src/lib/exams/cat-types.ts",
    componentOrModule: "exams/cat-types",
    purpose: "Types for adaptive state, answers, presentation mode, exam report.",
    controls: {
      sessionStart: false,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: false,
      scoring: true,
      results: true,
      rationaleReview: false,
      readinessUx: true,
      layoutPresentation: false,
    },
  },
  {
    path: "nursenest-core/src/lib/practice-tests/cat-session.ts",
    componentOrModule: "practice-tests/cat-session",
    purpose: "Orchestrates CAT practice test scoring, pool fetch, weak-topic boost, results enrichment, persistence hooks.",
    controls: {
      sessionStart: true,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: false,
      scoring: true,
      results: true,
      rationaleReview: false,
      readinessUx: true,
      layoutPresentation: false,
    },
  },
  {
    path: "nursenest-core/src/lib/practice-tests/cat-pool.ts",
    componentOrModule: "cat-pool",
    purpose: "Loads eligible ExamQuestion rows for CAT with entitlements and pathway filters.",
    controls: {
      sessionStart: false,
      questionDelivery: true,
      adaptiveSelection: false,
      progress: false,
      resume: false,
      scoring: false,
      results: false,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: false,
    },
  },
  {
    path: "nursenest-core/src/lib/practice-tests/cat-results-coach.ts",
    componentOrModule: "cat-results-coach",
    purpose: "Readiness coaching copy from CAT report (theta stability, reliability, weak domains) — presentation only.",
    controls: {
      sessionStart: false,
      questionDelivery: false,
      adaptiveSelection: false,
      progress: false,
      resume: false,
      scoring: false,
      results: true,
      rationaleReview: false,
      readinessUx: true,
      layoutPresentation: true,
    },
  },
  {
    path: "nursenest-core/src/components/student/practice-test-runner-client.tsx",
    componentOrModule: "PracticeTestRunnerClient",
    purpose: "Main learner UI: CAT + linear modes, timer, rationale panels, coach, teaching review, notes, exam shell.",
    controls: {
      sessionStart: true,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: true,
      scoring: true,
      results: true,
      rationaleReview: true,
      readinessUx: true,
      layoutPresentation: true,
    },
  },
  {
    path: "nursenest-core/src/components/student/practice-test-runner-client.tsx",
    componentOrModule: "PracticeTestRunnerClient (CAT branch)",
    purpose: "CAT session: ExamSessionShell + split rationale (replaces legacy CatSessionLayout).",
    controls: {
      sessionStart: false,
      questionDelivery: false,
      adaptiveSelection: false,
      progress: true,
      resume: false,
      scoring: false,
      results: false,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: true,
    },
  },
  {
    path: "nursenest-core/src/components/study/cat-question-card.tsx",
    componentOrModule: "QuestionCard (CAT)",
    purpose: "Question stem/options presentation for CAT mode.",
    controls: {
      sessionStart: false,
      questionDelivery: true,
      adaptiveSelection: false,
      progress: false,
      resume: false,
      scoring: false,
      results: false,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: true,
    },
  },
  {
    path: "nursenest-core/src/components/study/cat-rationale-panel.tsx",
    componentOrModule: "RationalePanel",
    purpose: "Rationale reveal for CAT items.",
    controls: {
      sessionStart: false,
      questionDelivery: false,
      adaptiveSelection: false,
      progress: false,
      resume: false,
      scoring: false,
      results: false,
      rationaleReview: true,
      readinessUx: false,
      layoutPresentation: true,
    },
  },
  {
    path: "nursenest-core/src/components/study/cat-results-summary.tsx",
    componentOrModule: "ResultsSummary",
    purpose: "In-flow CAT results summary.",
    controls: {
      sessionStart: false,
      questionDelivery: false,
      adaptiveSelection: false,
      progress: false,
      resume: false,
      scoring: true,
      results: true,
      rationaleReview: false,
      readinessUx: true,
      layoutPresentation: true,
    },
  },
  {
    path: "nursenest-core/src/lib/cat/cat-engine.ts",
    componentOrModule: "lib/cat/cat-engine (NP)",
    purpose:
      "Separate NP CAT engine: weakness priority, floor enforcement, 1PL-style selection — used by /api/cat/np/* not main practice-tests pipeline.",
    controls: {
      sessionStart: false,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: false,
      scoring: true,
      results: false,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: false,
    },
  },
  {
    path: "nursenest-core/src/app/api/practice-tests/[id]/question/route.ts",
    componentOrModule: "GET practice-tests question",
    purpose: "One question at a time for practice tests (keeps large sessions off the wire).",
    controls: {
      sessionStart: false,
      questionDelivery: true,
      adaptiveSelection: false,
      progress: true,
      resume: false,
      scoring: false,
      results: false,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: false,
    },
  },
  {
    path: "nursenest-core/src/app/api/practice-tests/[id]/route.ts",
    componentOrModule: "practice-tests [id] API",
    purpose: "Practice test session fetch/update (CAT state, answers, completion).",
    controls: {
      sessionStart: true,
      questionDelivery: true,
      adaptiveSelection: true,
      progress: true,
      resume: true,
      scoring: true,
      results: true,
      rationaleReview: false,
      readinessUx: false,
      layoutPresentation: false,
    },
  },
];

function exists(relFromWs: string): boolean {
  return fs.existsSync(path.join(WORKSPACE, relFromWs));
}

function buildLegacyInventory(): Record<string, unknown> {
  const entries: Record<string, unknown>[] = [];
  for (const c of LEGACY_CURATED) {
    const abs = path.join(WORKSPACE, c.path);
    entries.push({
      filePath: abs,
      repoRelativePath: c.path,
      exists: exists(c.path),
      componentOrModule: c.componentOrModule,
      purpose: c.purpose,
      controls: c.controls,
      source: "curated",
    });
  }

  const extraPatterns = [
    walkFiles(path.join(WORKSPACE, "client/src/pages"), (r) =>
      /mock-exam|exam-landing|free-demo-exam|trial-results|exam-practice/i.test(r),
    ),
    walkFiles(path.join(WORKSPACE, "client/src/lib"), (r) => /checkpoint|exam-session|question-pool/i.test(r)),
  ].flat();

  for (const abs of [...new Set(extraPatterns)]) {
    const rp = relWs(abs);
    if (entries.some((e) => (e as { repoRelativePath?: string }).repoRelativePath === rp)) continue;
    entries.push({
      filePath: abs,
      repoRelativePath: rp,
      exists: true,
      componentOrModule: path.basename(abs, path.extname(abs)),
      purpose: "Related exam/mock/practice entry or support module (auto-discovered).",
      controls: {
        sessionStart: /landing|mock-exams|exam-landing/i.test(rp),
        questionDelivery: false,
        adaptiveSelection: false,
        progress: /checkpoint|session/i.test(rp),
        resume: /checkpoint/i.test(rp),
        scoring: false,
        results: /report|trial-results/i.test(rp),
        rationaleReview: false,
        readinessUx: /readiness|demo/i.test(rp),
        layoutPresentation: /\.tsx$/.test(rp),
      },
      source: "auto_discovered",
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    externalVolumesMounted: false,
    note: "Legacy monolith paths under workspace root (client/, server/). Mount external drives and re-run to include out-of-repo copies.",
    workspaceRoot: WORKSPACE,
    entryCount: entries.length,
    files: entries,
  };
}

function buildCurrentInventory(): Record<string, unknown> {
  const entries: Record<string, unknown>[] = [];
  for (const c of CURRENT_CURATED) {
    const abs = path.join(WORKSPACE, c.path);
    entries.push({
      filePath: abs,
      repoRelativePath: c.path,
      exists: exists(c.path),
      componentOrModule: c.componentOrModule,
      purpose: c.purpose,
      controls: c.controls,
      source: "curated",
    });
  }

  const apiPt = walkFiles(path.join(ROOT, "src/app/api/practice-tests"), (r) => r.endsWith(".ts") && !r.endsWith(".test.ts"));
  const apiCatNp = walkFiles(path.join(ROOT, "src/app/api/cat"), (r) => r.endsWith(".ts") && !r.endsWith(".test.ts"));
  for (const abs of [...apiPt, ...apiCatNp]) {
    const rp = "nursenest-core/" + relNc(abs);
    if (entries.some((e) => (e as { repoRelativePath?: string }).repoRelativePath === rp)) continue;
    entries.push({
      filePath: abs,
      repoRelativePath: rp,
      exists: true,
      componentOrModule: path.basename(abs, ".ts"),
      purpose: "Practice-test or NP CAT API route (auto-discovered).",
      controls: {
        sessionStart: /route\.ts$/.test(abs) && (/\/start\//.test(rp) || /\/session\//.test(rp) || /\/practice-tests\/route/.test(rp)),
        questionDelivery: /question/.test(rp),
        adaptiveSelection: /cat|practice-tests\/\[id\]/.test(rp),
        progress: /practice-tests/.test(rp),
        resume: true,
        scoring: /answer|post/i.test(rp),
        results: /results|insights|readiness/.test(rp),
        rationaleReview: /review|rationale/i.test(rp),
        readinessUx: /readiness|insights|coach/.test(rp),
        layoutPresentation: false,
      },
      source: "auto_discovered",
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    nursenestCoreRoot: ROOT,
    entryCount: entries.length,
    files: entries,
  };
}

function comparison(): Record<string, unknown> {
  const categories = [
    {
      id: "start_flow",
      legacyBetter: false,
      currentBetter: true,
      equal: false,
      unclear: false,
      verdict: "current_better",
      why: "Current flow is integrated with Next.js app routes, Prisma PracticeTest, subscriber gates, and pathway registry. Legacy split between giant client mock page and Express /api/cat with separate PG mock_exam_attempts.",
    },
    {
      id: "question_flow",
      legacyBetter: false,
      currentBetter: true,
      equal: false,
      unclear: false,
      verdict: "current_better",
      why: "Current one-question-at-a-time API reduces payload size and aligns with overlay/i18n. Legacy mock-exam-session is powerful but monolithic (~2.6k lines) and harder to maintain.",
    },
    {
      id: "adaptive_behavior",
      legacyBetter: false,
      currentBetter: true,
      equal: false,
      unclear: false,
      verdict: "current_better",
      why: "exams/cat-engine ties to blueprint diagnostics, stem hash, exam simulation, and validated stopping. Legacy Express cat uses simpler ability delta; client cat-engine is rich but duplicated. NP stack adds second adaptive engine under lib/cat.",
    },
    {
      id: "progress_resume",
      legacyBetter: true,
      currentBetter: false,
      equal: false,
      unclear: false,
      verdict: "legacy_better",
      why: "Legacy mock-exam-session + session-checkpoint + exam-fallbacks explicitly model checkpoints and recovery UX. Current runner has resume paths but legacy surface area for edge-case recovery is larger — selective port of recovery/checkpoint patterns is worth study.",
    },
    {
      id: "exam_simulation",
      legacyBetter: false,
      currentBetter: true,
      equal: false,
      unclear: false,
      verdict: "current_better",
      why: "cat-exam-simulation and presentation modes are first-class in current code. Legacy relies on blueprint meta in client configs.",
    },
    {
      id: "rationale_review",
      legacyBetter: true,
      currentBetter: true,
      equal: false,
      unclear: false,
      verdict: "equal",
      why: "Both have strong rationale paths: legacy RationaleGuard/fallbacks; current PracticeRationaleFullPanel + cat-rationale-panel + teaching review. Merge ideas, not wholesale swap.",
    },
    {
      id: "results_page",
      legacyBetter: false,
      currentBetter: true,
      equal: false,
      unclear: false,
      verdict: "current_better",
      why: "cat-results-coach + theta stability + reliability language is richer and test-backed. Legacy mock-exam-report is static compared.",
    },
    {
      id: "readiness_ux",
      legacyBetter: false,
      currentBetter: true,
      equal: false,
      unclear: false,
      verdict: "current_better",
      why: "Current integrates pathway CAT start, readiness dashboard copy, and coach snapshots. Legacy marketing pages explain CAT textually; less integrated with learner product.",
    },
    {
      id: "visual_clarity",
      legacyBetter: false,
      currentBetter: true,
      equal: false,
      unclear: false,
      verdict: "current_better",
      why: "Current uses design-system session shell, semantic tokens, and focused CAT layout. Legacy mock session predates NurseNest learner shell — do not import old global styles.",
    },
    {
      id: "perceived_stability",
      legacyBetter: false,
      currentBetter: true,
      equal: false,
      unclear: false,
      verdict: "current_better",
      why: "Centralized API + Sentry context + entitlement checks improve operability vs split Express + client sync.",
    },
  ];

  const topAreasLegacyStronger = [
    {
      rank: 1,
      area: "progress_resume",
      summary: "Explicit checkpoint + recovery prompts in mock-exam-session and session-checkpoint utilities.",
    },
    {
      rank: 2,
      area: "offline_resilience_surface_area",
      summary: "exam-fallbacks bundles many guards (media, translation, rationale, printable backup) in one legacy module.",
    },
    {
      rank: 3,
      area: "client_blueprint_mock_config",
      summary: "flagship-mock-exam-configs + client cat-engine tie blueprint meta to a single long-lived page (useful reference for edge cases).",
    },
    {
      rank: 4,
      area: "mlt_allied_simulation",
      summary: "server/mlt-adaptive-engine provides self-contained CAT simulation for MLT workflows.",
    },
    {
      rank: 5,
      area: "express_cat_debuggability",
      summary: "server/cat-session-api is small and easy to trace for ability updates (dev/legacy only — not a prod replacement for current API).",
    },
  ];

  const topAreasCurrentStronger = [
    { rank: 1, area: "adaptive_engine_integrity", summary: "Blueprint-aware selection, diagnostics, and stopping in lib/exams/cat-engine." },
    { rank: 2, area: "results_and_coaching", summary: "cat-results-coach + enrich layer with reliability rules and theta history." },
    { rank: 3, area: "security_and_entitlements", summary: "Subscriber session gates, Prisma-backed sessions, content-access scopes." },
    { rank: 4, area: "question_delivery_shape", summary: "One-question API + overlays keeps payloads bounded and i18n-safe." },
    { rank: 5, area: "learner_ui_consistency", summary: "Exam session shell, semantic styling, CAT-specific layout components." },
  ];

  return {
    generatedAt: new Date().toISOString(),
    summary:
      "Legacy monolith mock/CAT is feature-rich on the client (checkpoint/recovery) but split from production data model. Current stack is the source of truth for adaptive logic and results quality.",
    topAreasLegacyStronger,
    topAreasCurrentStronger,
    categories,
  };
}

function restorationPlan(): Record<string, unknown> {
  return {
    generatedAt: new Date().toISOString(),
    selectiveRestorationRecommended: true,
    rationale:
      "Recommend borrowing specific UX/behaviors (checkpoint messaging, recovery prompts, optional printable backup patterns) into current components without replacing routes or engines.",
    doNotDo: [
      "Replace PracticeTestRunnerClient or /app/practice-tests routes with mock-exam-session.",
      "Re-enable Express /api/cat as production path for RN/PN CAT.",
      "Merge lib/cat (NP) and lib/exams/cat-engine without an explicit product decision.",
      "Import legacy global CSS or gray marketing-only styles into learner CAT.",
    ],
    recommendedLowRiskItems: [
      {
        item: "Session recovery copy and edge-case flows",
        sourceHint: "client session-checkpoint + exam-fallbacks SessionRecoveryPrompt patterns",
        targetHint: "practice-test-runner-client.tsx resilience surfaces",
        risk: "low",
      },
      {
        item: "Printable / backup practice set (if still needed)",
        sourceHint: "exam-fallbacks PrintableBackup",
        targetHint: "optional export behind existing premium gate",
        risk: "low",
      },
      {
        item: "Deeper rationale guardrails for broken media",
        sourceHint: "MediaGuard / TranslationGuard patterns",
        targetHint: "align with existing PracticeQuestionCard media handling",
        risk: "low",
      },
    ],
    deferOrHighRisk: [
      "Porting full mock-exam-session state machine into Next without a phased plan.",
      "Unifying three adaptive engines (client legacy, server mlt, exams/cat, lib/cat NP) in one pass.",
    ],
  };
}

function main() {
  fs.mkdirSync(AUDIT, { recursive: true });
  fs.writeFileSync(path.join(AUDIT, "legacy-cat-source-inventory.json"), JSON.stringify(buildLegacyInventory(), null, 2));
  fs.writeFileSync(path.join(AUDIT, "current-cat-source-inventory.json"), JSON.stringify(buildCurrentInventory(), null, 2));
  fs.writeFileSync(path.join(AUDIT, "legacy-vs-current-cat-comparison.json"), JSON.stringify(comparison(), null, 2));
  fs.writeFileSync(path.join(AUDIT, "cat-selective-restoration-plan.json"), JSON.stringify(restorationPlan(), null, 2));
  console.log("Wrote data/audit/legacy-cat-*.json and cat-selective-restoration-plan.json");
}

main();
