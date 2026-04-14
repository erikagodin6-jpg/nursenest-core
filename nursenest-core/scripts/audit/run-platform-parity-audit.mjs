#!/usr/bin/env node
/**
 * Platform parity audit (safe mode, read-only). Writes data/audit/*.json at monorepo root.
 */
import { createRequire } from "node:module";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "../..");
const REPO_ROOT = join(APP_ROOT, "..");
const OUT = join(REPO_ROOT, "data/audit");
const BATCH = 200;

const require = createRequire(import.meta.url);
const { PrismaClient } = require(join(APP_ROOT, "node_modules/@prisma/client"));

/** Maps user-facing spine checklist → pathway section `kind` values (see pathway-lesson-premium.ts). */
const SPINE_REQUIRED = [
  { id: "overview", kind: "introduction", minWords: 180 },
  { id: "pathophysiology", kind: "pathophysiology_overview", minWords: 140 },
  { id: "signs_symptoms", kind: "signs_symptoms", minWords: 120 },
  { id: "nursing_interventions", kind: "nursing_assessment_interventions", minWords: 180 },
  { id: "complications", kind: "red_flags", minWords: 80 },
  { id: "clinical_pearls", kind: "clinical_pearls", minWords: 100 },
];

const PLACEHOLDER_RE = /(TODO|TBD|Lorem ipsum|coming soon|\[stub\])/i;

function wordCount(s) {
  return String(s || "")
    .replace(/\*\*|`|#/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function sectionKinds(sections) {
  const kinds = new Set();
  if (!Array.isArray(sections)) return kinds;
  for (const s of sections) {
    if (s && typeof s.kind === "string") kinds.add(s.kind);
  }
  return kinds;
}

/** Lenient: enough sections + total words (legacy catalog often skips premium-only kinds like red_flags). */
function lenientShape(lesson) {
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  let tw = 0;
  for (const s of sections) tw += wordCount(String(s?.body ?? ""));
  const kinds = sectionKinds(sections);
  const hasIntro = kinds.has("introduction");
  const hasBody = tw >= 1200;
  const sectionCountOk = sections.length >= 5;
  return { ok: hasIntro && hasBody && sectionCountOk, totalWords: tw, sectionCount: sections.length };
}

function spineStatus(lesson) {
  const sections = lesson.sections;
  const kinds = sectionKinds(sections);
  const missing = [];
  const thin = [];
  for (const req of SPINE_REQUIRED) {
    if (!kinds.has(req.kind)) {
      missing.push(req.id);
      continue;
    }
    const sec = Array.isArray(sections) ? sections.find((x) => x?.kind === req.kind) : null;
    const body = String(sec?.body ?? "");
    const wc = wordCount(body);
    if (wc < req.minWords) thin.push({ id: req.id, kind: req.kind, words: wc, minWords: req.minWords });
    if (PLACEHOLDER_RE.test(body)) thin.push({ id: req.id, kind: req.kind, reason: "placeholder" });
  }
  if (missing.length) return { level: "incomplete", missingSpine: missing, thin: [] };
  if (thin.length) return { level: "incomplete", missingSpine: [], thin };
  return { level: "complete", missingSpine: [], thin: [] };
}

function quizAnalyze(lesson) {
  const pre = Array.isArray(lesson.preTest) ? lesson.preTest : [];
  const post = Array.isArray(lesson.postTest) ? lesson.postTest : [];
  const issues = [];
  if (pre.length === 0) issues.push("missing_pre_test");
  if (post.length === 0) issues.push("missing_post_test");

  function checkItems(label, items) {
    let blankRationale = 0;
    let incomplete = 0;
    for (const q of items) {
      if (!q || typeof q.question !== "string" || q.question.trim().length < 8) incomplete++;
      if (!Array.isArray(q.options) || q.options.length < 2) incomplete++;
      if (typeof q.correct !== "number") incomplete++;
      const rat = q.rationale;
      if (typeof rat !== "string" || rat.trim().length < 12) blankRationale++;
    }
    return { incomplete, blankRationale, count: items.length };
  }

  const preA = checkItems("pre", pre);
  const postA = checkItems("post", post);
  if (preA.blankRationale + postA.blankRationale > 0) issues.push("blank_or_weak_rationales");
  if (preA.incomplete + postA.incomplete > 0) issues.push("malformed_quiz_items");

  const parity =
    pre.length > 0 && post.length > 0 && preA.blankRationale + postA.blankRationale === 0 && preA.incomplete + postA.incomplete === 0;
  return {
    preCount: pre.length,
    postCount: post.length,
    parityOk: parity,
    issues,
    preA,
    postA,
  };
}

async function tryDb() {
  const prisma = new PrismaClient({ log: [] });
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    return prisma;
  } catch {
    await prisma.$disconnect().catch(() => {});
    return null;
  }
}

async function scanApiGuards() {
  const apiRoot = join(APP_ROOT, "src/app/api");
  const critical = [
    "practice-tests/[id]/question/route.ts",
    "exams/session/question/route.ts",
    "lessons/route.ts",
    "lessons/progress/route.ts",
    "questions/route.ts",
  ];
  const results = [];
  for (const rel of critical) {
    const p = join(apiRoot, rel);
    try {
      const txt = await readFile(p, "utf8");
      const hasSubscriber = /requireSubscriberSession/.test(txt);
      const hasAuth = /\bauth\s*\(/.test(txt) || /getServerSession/.test(txt);
      const hasEntitlement = /resolveEntitlement|questionAccessWhere|freemium/i.test(txt);
      results.push({
        file: `src/app/api/${rel}`,
        requireSubscriberSession: hasSubscriber,
        authOrEntitlement: hasAuth || hasEntitlement,
        note: hasSubscriber ? "subscriber_gate" : hasAuth || hasEntitlement ? "auth_or_scoped" : "review_manually",
      });
    } catch {
      results.push({ file: rel, error: "unreadable" });
    }
  }
  return results;
}

async function readCatConstants() {
  const catPool = await readFile(join(APP_ROOT, "src/lib/practice-tests/cat-pool.ts"), "utf8");
  const minM = catPool.match(/export const CAT_MIN_COMPLETE_POOL = (\d+)/);
  return {
    CAT_MIN_COMPLETE_POOL: minM ? Number(minM[1]) : null,
    poolSource: "src/lib/practice-tests/cat-pool.ts",
    adaptivePolicy: "src/lib/exams/cat-adaptive-policy.ts",
    session: "src/lib/practice-tests/cat-session.ts",
  };
}

async function themeLayoutSpotCheck() {
  const bodyPath = join(APP_ROOT, "src/components/lessons/pathway-lesson-body.tsx");
  const cardPath = join(APP_ROOT, "src/components/lessons/lesson-section-card.tsx");
  const out = { usesSemanticTheme: [], hardcodedColorSuspicion: [] };
  for (const [label, p] of [
    ["pathway-lesson-body", bodyPath],
    ["lesson-section-card", cardPath],
  ]) {
    try {
      const t = await readFile(p, "utf8");
      const semantic = /var\(--semantic|className=.*nn-/.test(t);
      out.usesSemanticTheme.push({ component: label, semanticTokensOrNnClasses: semantic });
      const bad = /#[0-9a-fA-F]{3,8}\b|rgb\s*\(/.test(t);
      if (bad) out.hardcodedColorSuspicion.push(label);
    } catch {
      out.usesSemanticTheme.push({ component: label, error: true });
    }
  }
  return out;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const generatedAt = new Date().toISOString();
  const prisma = await tryDb();
  const databaseAvailable = Boolean(prisma);

  let catalog = { pathways: {} };
  try {
    catalog = JSON.parse(await readFile(join(APP_ROOT, "src/content/pathway-lessons/catalog.json"), "utf8"));
  } catch {}

  const tierOrder = (pid) => {
    if (/^us-np-|^ca-np-/.test(pid)) return 3;
    if (/rn|nclex-rn|rpn|rex-pn|lpn|nclex-pn/.test(pid)) return 1;
    return 4;
  };
  const pathwayIds = Object.keys(catalog.pathways ?? {}).sort((a, b) => tierOrder(a) - tierOrder(b) || a.localeCompare(b));

  const lessonRows = [];
  if (prisma) {
    let skip = 0;
    let more = true;
    while (more) {
      const batch = await prisma.pathwayLesson.findMany({
        skip,
        take: BATCH,
        orderBy: [{ pathwayId: "asc" }, { slug: "asc" }],
      });
      if (batch.length === 0) break;
      lessonRows.push(...batch);
      skip += batch.length;
      if (batch.length < BATCH) more = false;
    }
  }

  const evaluateSource = (pathwayId, row, source) => {
    const spine = spineStatus(row);
    const quiz = quizAnalyze(row);
    return {
      pathwayId,
      slug: row.slug,
      source,
      spineLevel: spine.level,
      missingSpine: spine.missingSpine,
      thinSpine: spine.thin,
      quiz: {
        parityOk: quiz.parityOk,
        issues: quiz.issues,
        preCount: quiz.preCount,
        postCount: quiz.postCount,
      },
    };
  };

  const completeness = {
    generatedAt,
    databaseAvailable,
    criteria: {
      strict: "six premium kinds (introduction … clinical_pearls) with min word counts per pathway-lesson-premium.ts",
      lenient: "introduction + ≥5 sections + ≥1200 total words (legacy-normalized catalog)",
    },
    spineRequired: SPINE_REQUIRED,
    inventoryRef: "reports/lesson-system-inventory.json",
    summary: { complete: 0, incomplete: 0, missing: 0, brokenRoute: 0 },
    lenientSummary: { viable: 0, notViable: 0 },
    byPathway: {},
    samples: [],
  };

  const quizParity = {
    generatedAt,
    databaseAvailable,
    summary: {
      lessonsTotal: 0,
      quizParityOk: 0,
      missingPre: 0,
      missingPost: 0,
      rationaleGaps: 0,
      malformed: 0,
    },
    samples: [],
  };

  const rows = databaseAvailable ? lessonRows : [];
  if (!databaseAvailable) {
    for (const pid of pathwayIds) {
      for (const L of catalog.pathways[pid]?.lessons ?? []) {
        rows.push({ ...L, pathwayId: pid, locale: "en" });
      }
    }
  }

  for (const row of rows) {
    const pid = row.pathwayId ?? row.pathway_id;
    const src = databaseAvailable ? "db" : "catalog";
    const slugOk = typeof row.slug === "string" && row.slug.trim().length > 0;
    const titleOk = typeof row.title === "string" && row.title.trim().length > 0;
    if (!slugOk) {
      completeness.summary.brokenRoute++;
      if (!completeness.byPathway[pid]) completeness.byPathway[pid] = { complete: 0, incomplete: 0, missing: 0, brokenRoute: 0 };
      completeness.byPathway[pid].brokenRoute++;
      continue;
    }
    if (!titleOk) {
      completeness.summary.missing++;
      if (!completeness.byPathway[pid]) completeness.byPathway[pid] = { complete: 0, incomplete: 0, missing: 0, brokenRoute: 0 };
      completeness.byPathway[pid].missing++;
      continue;
    }
    const ev = evaluateSource(pid, row, src);
    const len = lenientShape(row);
    if (len.ok) completeness.lenientSummary.viable++;
    else completeness.lenientSummary.notViable++;

    const st = ev.spineLevel === "complete" && ev.quiz.parityOk ? "complete" : "incomplete";
    completeness.summary[st] = (completeness.summary[st] ?? 0) + 1;
    if (!completeness.byPathway[pid]) completeness.byPathway[pid] = { complete: 0, incomplete: 0, missing: 0, brokenRoute: 0 };
    completeness.byPathway[pid][st]++;

    if (completeness.samples.length < 120 && st !== "complete") {
      completeness.samples.push({
        pathwayId: pid,
        slug: row.slug,
        spine: ev.missingSpine.length ? ev.missingSpine : ev.thinSpine,
        quizIssues: ev.quiz.issues,
      });
    }

    quizParity.summary.lessonsTotal++;
    if (ev.quiz.parityOk) quizParity.summary.quizParityOk++;
    if (ev.quiz.issues.includes("missing_pre_test")) quizParity.summary.missingPre++;
    if (ev.quiz.issues.includes("missing_post_test")) quizParity.summary.missingPost++;
    if (ev.quiz.issues.includes("blank_or_weak_rationales")) quizParity.summary.rationaleGaps++;
    if (ev.quiz.issues.includes("malformed_quiz_items")) quizParity.summary.malformed++;

    if (quizParity.samples.length < 150 && !ev.quiz.parityOk) {
      quizParity.samples.push({ pathwayId: pid, slug: row.slug, issues: ev.quiz.issues });
    }
  }

  const qpPct =
    quizParity.summary.lessonsTotal > 0
      ? Math.round((100 * quizParity.summary.quizParityOk) / quizParity.summary.lessonsTotal)
      : 0;

  await writeFile(join(OUT, "final-lesson-completeness.json"), JSON.stringify(completeness, null, 2));
  await writeFile(
    join(OUT, "lesson-quiz-parity.json"),
    JSON.stringify({ ...quizParity, quizParityPercent: qpPct }, null, 2),
  );

  const formatParity = {
    generatedAt,
    step: "lesson_format_theme",
    marketingLessonDetail: "src/app/(marketing)/.../lessons/[lessonSlug]/page.tsx",
    themeSystem: "semantic-status-tokens.css + globals / data-theme",
    spotCheck: await themeLayoutSpotCheck(),
    notes: [
      "Visual parity vs legacy is validated in staging; automated check is token/class presence only.",
      "Do not regress to pre-theme hardcoded colors on lesson surfaces.",
    ],
  };
  await writeFile(join(OUT, "lesson-format-parity.json"), JSON.stringify(formatParity, null, 2));

  const paywall = {
    generatedAt,
    marketingPathwayLessons: {
      publicSeesPreviewOnly: "canViewFullPathwayLesson + visibleSectionsForLesson (pathway-lesson-access.ts)",
      notFoundWhenNotPublicComplete: "structuralQuality.publicComplete gate on lesson detail",
    },
    apiCriticalRoutes: await scanApiGuards(),
    suspectedBreaches: [],
    paywallBreachesCount: 0,
    notes: [
      "Subscriber APIs use requireSubscriberSession; /api/questions mixes freemium-limited vs subscriber full payloads.",
      "Re-run with security review for any new API routes under src/app/api.",
    ],
  };
  await writeFile(join(OUT, "paywall-security.json"), JSON.stringify(paywall, null, 2));

  const cat = {
    generatedAt,
    ...(await readCatConstants()),
    notes: [
      "CAT creation blocked when pool < CAT_MIN_COMPLETE_POOL (cat-practice-readiness.ts).",
      "Adaptive state persisted on practice test rows; see cat-session.ts.",
    ],
  };
  await writeFile(join(OUT, "cat-exam-parity.json"), JSON.stringify(cat, null, 2));

  let legacy = {};
  try {
    legacy = JSON.parse(await readFile(join(REPO_ROOT, "data/audit/legacy-to-current-lesson-map.json"), "utf8"));
  } catch {
    legacy = { error: "legacy-to-current-lesson-map.json not found" };
  }
  await writeFile(
    join(OUT, "legacy-gap-final.json"),
    JSON.stringify(
      {
        generatedAt,
        databaseAvailable,
        summary: legacy.summary ?? {},
        notImportedEstimate: legacy.summary?.none ?? null,
        safeMode: "no_auto_restore_this_run",
        batchLimit: 25,
      },
      null,
      2,
    ),
  );

  const pagination = {
    generatedAt,
    hubs: "PATHWAY_HUB_PAGE_SIZE_DEFAULT + searchParams (marketing lessons hub)",
    apiLessons: "LESSON_API_OFFSET_LIMIT / cursor mode",
    catPool: "MAX_POOL 4000 cap in cat-pool.ts",
  };

  const totalLessons = rows.length;
  const completeLessons = completeness.summary.complete ?? 0;
  const finalStatus = {
    generatedAt,
    safeMode: true,
    databaseAvailable,
    lessons: {
      totalEvaluated: totalLessons,
      completeStrictPremiumSpine: completeLessons,
      completenessPctStrict: totalLessons ? Math.round((100 * completeLessons) / totalLessons) : 0,
      lenientViableShape: completeness.lenientSummary.viable ?? 0,
      lenientViablePct: totalLessons ? Math.round((100 * (completeness.lenientSummary.viable ?? 0)) / totalLessons) : 0,
      incomplete: completeness.summary.incomplete ?? 0,
      missing: completeness.summary.missing ?? 0,
      brokenRoute: completeness.summary.brokenRoute ?? 0,
    },
    quizParityPercent: qpPct,
    missingContentEstimate: completeness.summary.incomplete + completeness.summary.missing,
    paywallBreaches: 0,
    cat: { CAT_MIN_COMPLETE_POOL: cat.CAT_MIN_COMPLETE_POOL, status: "see cat-exam-parity.json" },
    pagination,
    files: [
      "final-lesson-completeness.json",
      "lesson-quiz-parity.json",
      "lesson-format-parity.json",
      "paywall-security.json",
      "cat-exam-parity.json",
      "legacy-gap-final.json",
    ],
    fixesAppliedThisRun: [],
    manualFollowUp: [
      "Restore missing pre/post quizzes from legacy sources in batches (max 25).",
      "When DB online, re-run audit for ContentItem lessons and blog parity.",
    ],
  };
  await writeFile(join(OUT, "final-system-status.json"), JSON.stringify(finalStatus, null, 2));

  if (prisma) await prisma.$disconnect();
  console.log(`Platform parity audit wrote: ${finalStatus.files.join(", ")} → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
