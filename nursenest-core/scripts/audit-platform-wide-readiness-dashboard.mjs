#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const { Pool } = pg;
const OUT_DIR = path.resolve(process.cwd(), "docs/reports");
const OUT_MD = path.join(OUT_DIR, "platform-wide-readiness-dashboard.md");
const OUT_JSON = path.join(OUT_DIR, "platform-wide-readiness-dashboard.json");

const PATHWAYS = [
  {
    key: "RN",
    label: "RN",
    aliases: ["rn", "registered nurse", "nclex-rn", "nclex rn", "canada rn", "us rn"],
    searchAliases: ["registered nurse", "nclex-rn", "nclex rn", "canada rn", "us rn"],
    question: (r) => norm(r.career_type) === "nursing" && norm(r.exam) === "nclex_rn" && ["rn"].includes(norm(r.tier)),
    lessonIds: ["us-rn-nclex-rn", "ca-rn-nclex-rn"],
    flashcard: (r) => norm(r.tier) === "rn",
    casePathways: ["us-rn-nclex-rn", "ca-rn-nclex-rn", null],
    targets: { questions: 10000, flashcards: 2500, lessons: 1200, cases: 25, blog: 250, seo: 30, blueprintDomains: 8 },
    revenueRank: "high",
  },
  {
    key: "RPN",
    label: "RPN",
    aliases: ["rpn", "rex-pn", "rex pn", "canadian pn", "canada pn", "practical nurse"],
    searchAliases: ["rpn", "rex-pn", "rex pn", "canadian pn", "canada pn", "practical nurse"],
    question: (r) => norm(r.career_type) === "nursing" && norm(r.tier) === "rpn" && norm(r.exam) === "rex_pn",
    lessonIds: ["ca-rpn-rex-pn"],
    flashcard: (r) => norm(r.tier) === "rpn",
    casePathways: ["ca-rpn-rex-pn"],
    targets: { questions: 3000, flashcards: 1500, lessons: 1000, cases: 15, blog: 120, seo: 18, blueprintDomains: 5 },
    revenueRank: "high",
  },
  {
    key: "PN",
    label: "PN",
    aliases: ["pn", "lpn", "lvn", "nclex-pn", "nclex pn"],
    searchAliases: ["lpn", "lvn", "nclex-pn", "nclex pn", "practical nurse"],
    question: (r) => norm(r.career_type) === "nursing" && norm(r.exam) === "nclex_pn" && ["lvn", "rpn"].includes(norm(r.tier)),
    lessonIds: ["us-lpn-nclex-pn"],
    flashcard: (r) => norm(r.tier) === "rpn",
    casePathways: ["us-lpn-nclex-pn"],
    targets: { questions: 5000, flashcards: 1500, lessons: 1000, cases: 15, blog: 120, seo: 18, blueprintDomains: 5 },
    revenueRank: "high",
  },
  {
    key: "NP",
    label: "NP",
    aliases: ["np", "cnple", "fnp", "nurse practitioner", "canadian np"],
    searchAliases: ["cnple", "fnp", "nurse practitioner", "canadian np", "np certification"],
    question: (r) => norm(r.career_type) === "nursing" && ["np", "premium"].includes(norm(r.tier)),
    lessonIds: ["ca-np-cnple", "us-np-fnp", "us-np-agpcnp", "us-np-pmhnp", "us-np-pnp-pc", "us-np-whnp"],
    flashcard: (r) => norm(r.tier) === "np",
    casePathways: ["ca-np-cnple", "us-np-fnp", "us-np-agpcnp", "us-np-pmhnp", "us-np-pnp-pc", "us-np-whnp"],
    targets: { questions: 5000, flashcards: 2000, lessons: 5000, cases: 50, blog: 200, seo: 30, blueprintDomains: 8 },
    revenueRank: "high",
  },
  {
    key: "RT",
    label: "RT",
    aliases: ["rt", "rrt", "respiratory", "respiratory therapy", "tmc"],
    searchAliases: ["rrt", "respiratory", "respiratory therapy", "tmc"],
    question: (r) => ["rrt", "respiratory_therapy"].includes(norm(r.career_type)) || norm(r.tier) === "rrt",
    lessonIds: ["us-allied-core", "ca-allied-core"],
    alliedKey: "respiratory",
    flashcard: (r) => norm(r.tier) === "allied",
    casePathways: ["us-allied-core", "ca-allied-core"],
    targets: { questions: 5000, flashcards: 1500, lessons: 150, cases: 20, blog: 80, seo: 15, blueprintDomains: 8 },
    revenueRank: "high",
  },
  {
    key: "Paramedic",
    label: "Paramedic",
    aliases: ["paramedic", "ems", "prehospital", "emergency medical"],
    searchAliases: ["paramedic", "prehospital", "emergency medical"],
    question: (r) => norm(r.career_type) === "paramedic",
    lessonIds: ["us-allied-core", "ca-allied-core"],
    alliedKey: "paramedic",
    flashcard: (r) => norm(r.tier) === "allied",
    casePathways: ["us-allied-core", "ca-allied-core"],
    targets: { questions: 2500, flashcards: 1200, lessons: 120, cases: 20, blog: 60, seo: 12, blueprintDomains: 6 },
    revenueRank: "medium",
  },
  {
    key: "MLT",
    label: "MLT",
    aliases: ["mlt", "medical laboratory", "lab technologist", "laboratory technology"],
    searchAliases: ["mlt", "medical laboratory", "lab technologist", "laboratory technology"],
    question: (r) => norm(r.career_type) === "mlt",
    lessonIds: ["us-allied-core", "ca-allied-core"],
    alliedKey: "mlt",
    flashcard: (r) => norm(r.tier) === "allied",
    casePathways: ["us-allied-core", "ca-allied-core"],
    targets: { questions: 2500, flashcards: 1200, lessons: 120, cases: 15, blog: 50, seo: 10, blueprintDomains: 6 },
    revenueRank: "medium",
  },
  {
    key: "OT",
    label: "OT",
    aliases: ["ot", "ota", "occupational therapy", "occupational therapist"],
    searchAliases: ["ota", "occupational therapy", "occupational therapist"],
    question: (r) => ["ota", "occupationaltherapyassistant", "occupationaltherapy"].includes(norm(r.career_type)),
    lessonIds: ["us-allied-core", "ca-allied-core"],
    alliedKey: "occupational-therapy",
    flashcard: (r) => norm(r.tier) === "allied",
    casePathways: ["us-allied-core", "ca-allied-core"],
    targets: { questions: 3000, flashcards: 1200, lessons: 120, cases: 15, blog: 50, seo: 10, blueprintDomains: 6 },
    revenueRank: "medium",
  },
  {
    key: "PT",
    label: "PT",
    aliases: ["pt", "pta", "physiotherapy", "physical therapy", "physiotherapist"],
    searchAliases: ["pta", "physiotherapy", "physical therapy", "physiotherapist"],
    question: (r) => ["pta", "physiotherapyassistant", "physicaltherapy"].includes(norm(r.career_type)),
    lessonIds: ["us-allied-core", "ca-allied-core"],
    alliedKey: "physiotherapy",
    flashcard: (r) => norm(r.tier) === "allied",
    casePathways: ["us-allied-core", "ca-allied-core"],
    targets: { questions: 3000, flashcards: 1200, lessons: 120, cases: 15, blog: 50, seo: 10, blueprintDomains: 6 },
    revenueRank: "medium",
  },
  {
    key: "PSW",
    label: "PSW",
    aliases: ["psw", "personal support worker", "hca", "health care aide", "care aide"],
    searchAliases: ["psw", "personal support worker", "hca", "health care aide", "care aide"],
    question: (r) => ["psw", "hca", "healthcareaide", "personal_support_worker"].includes(norm(r.career_type)),
    lessonIds: ["us-allied-core", "ca-allied-core"],
    alliedKey: "psw-hca",
    flashcard: (r) => norm(r.tier) === "allied",
    casePathways: ["us-allied-core", "ca-allied-core"],
    targets: { questions: 1500, flashcards: 800, lessons: 80, cases: 12, blog: 40, seo: 8, blueprintDomains: 5 },
    revenueRank: "medium",
  },
  {
    key: "Social Work",
    label: "Social Work",
    aliases: ["social work", "social worker", "aswb"],
    searchAliases: ["social work", "social worker", "aswb"],
    question: (r) => ["social_worker", "socialworker"].includes(norm(r.career_type)),
    lessonIds: ["us-allied-core", "ca-allied-core"],
    alliedKey: "social-work",
    flashcard: (r) => norm(r.tier) === "allied",
    casePathways: ["us-allied-core", "ca-allied-core"],
    targets: { questions: 2000, flashcards: 800, lessons: 80, cases: 15, blog: 40, seo: 8, blueprintDomains: 5 },
    revenueRank: "medium",
  },
  {
    key: "Psychotherapy",
    label: "Psychotherapy",
    aliases: ["psychotherapy", "psychotherapist", "counselling", "counseling", "mental health"],
    searchAliases: ["psychotherapy", "psychotherapist", "counselling", "counseling", "mental health"],
    question: (r) => ["psychotherapist", "addictions_counsellor", "addictionscounsellor"].includes(norm(r.career_type)),
    lessonIds: ["us-allied-core", "ca-allied-core"],
    alliedKey: "psychotherapy",
    flashcard: (r) => norm(r.tier) === "allied",
    casePathways: ["us-allied-core", "ca-allied-core"],
    targets: { questions: 2000, flashcards: 800, lessons: 80, cases: 15, blog: 40, seo: 8, blueprintDomains: 5 },
    revenueRank: "medium",
  },
];

function norm(value) {
  return String(value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function pct(actual, target) {
  if (!target) return 0;
  return Math.min(100, Number(((actual / target) * 100).toFixed(1)));
}

function grade(score) {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  return "D";
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map((h) => (/(count|score|coverage|readiness|rank|required|gap|%)/i.test(h) ? "---:" : "---")).join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((v) => String(v).replace(/\|/g, "\\|")).join(" | ")} |`),
  ].join("\n");
}

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const abs = path.join(dir, entry);
    const st = statSync(abs);
    if (st.isDirectory()) walkFiles(abs, out);
    else out.push(abs);
  }
  return out;
}

function countMatches(files, aliases) {
  const needles = aliases.map((a) => a.toLowerCase());
  let count = 0;
  for (const file of files) {
    const rel = path.relative(process.cwd(), file).toLowerCase();
    let text = rel;
    if (/\.(md|mdx|tsx|ts|json)$/i.test(file)) {
      try {
        text += "\n" + readFileSync(file, "utf8").slice(0, 20_000).toLowerCase();
      } catch {
        // ignore unreadable files
      }
    }
    if (needles.some((n) => text.includes(n))) count += 1;
  }
  return count;
}

async function main() {
  let databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("DATABASE_URL is required.");
  const allowSelfSignedSsl = process.env.NN_DB_AUDIT_ALLOW_SELF_SIGNED_SSL === "1";
  if (allowSelfSignedSsl) {
    const u = new URL(databaseUrl);
    u.searchParams.delete("sslmode");
    u.searchParams.delete("sslcert");
    u.searchParams.delete("sslrootcert");
    databaseUrl = u.toString();
  }
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 4,
    statement_timeout: 60_000,
    ...(allowSelfSignedSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  const client = await pool.connect();
  try {
    const questionRows = await client.query(`SELECT tier, exam, career_type, status, nclex_client_needs_category FROM exam_questions WHERE lower(coalesce(status,''))='published'`);
    const lessonRows = await client.query(`SELECT pathway_id, tier_code::text, allied_profession_key, status FROM pathway_lessons WHERE status='PUBLISHED'`);
    const flashcardRows = await client.query(`SELECT d.pathway_id, f.tier::text, f."examFamily"::text, f.status::text FROM "Flashcard" f LEFT JOIN flashcard_decks d ON d.id=f.deck_id WHERE f.status='PUBLISHED'`);
    const deckRows = await client.query(`SELECT pathway_id, tier::text, "examFamily"::text, status::text, visibility::text, card_count FROM flashcard_decks WHERE status='PUBLISHED'`);
    const blogRows = await client.query(`SELECT slug, title, excerpt, exam, "careerSlug", "postStatus", "workflowStatus", "publishAt", "scheduledAt" FROM "BlogPost" WHERE "postStatus"='PUBLISHED' AND "workflowStatus"='PUBLISHED'`);
    const osceRows = await client.query(`SELECT pathway_id, role_track, is_published FROM osce_stations WHERE is_published IS TRUE`);
    const categoryRows = await client.query(`SELECT tier, exam, career_type, nclex_client_needs_category FROM exam_questions WHERE lower(coalesce(status,''))='published' AND coalesce(nclex_client_needs_category,'') <> ''`);

    const blogFiles = walkFiles(path.resolve(process.cwd(), "src/content/blog-static-longtail")).filter((f) => /\.mdx?$/i.test(f));
    const seoFiles = [
      ...walkFiles(path.resolve(process.cwd(), "src/app")).filter((f) => /page\.tsx$|sitemap\.ts$/i.test(f)),
      ...blogFiles,
    ];

    const results = PATHWAYS.map((p) => {
      const questionCount = questionRows.rows.filter(p.question).length;
      const lessonCount = lessonRows.rows.filter((r) => p.lessonIds.includes(r.pathway_id) && (!p.alliedKey || r.allied_profession_key === p.alliedKey || r.allied_profession_key == null)).length;
      const dedicatedLessonCount = lessonRows.rows.filter((r) => p.alliedKey && r.allied_profession_key === p.alliedKey).length;
      const flashcardCount = flashcardRows.rows.filter(p.flashcard).length;
      const deckCardCount = deckRows.rows.filter(p.flashcard).reduce((sum, r) => sum + Number(r.card_count ?? 0), 0);
      const usableFlashcards = Math.max(flashcardCount, deckCardCount);
      const caseCount = osceRows.rows.filter((r) => p.casePathways.includes(r.pathway_id)).length;
      const blogDb = blogRows.rows.filter((r) => {
        const text = `${r.slug} ${r.title} ${r.excerpt} ${r.exam} ${r.careerSlug}`.toLowerCase();
        return (p.searchAliases ?? p.aliases).some((a) => text.includes(a.toLowerCase()));
      }).length;
      const blogStatic = countMatches(blogFiles, p.searchAliases ?? p.aliases);
      const blogCoverage = blogDb + blogStatic;
      const seoCoverage = countMatches(seoFiles, p.searchAliases ?? p.aliases);
      const blueprintDomains = new Set(categoryRows.rows.filter(p.question).map((r) => norm(r.nclex_client_needs_category)).filter(Boolean)).size;

      const contentScore = weighted([
        [pct(questionCount, p.targets.questions), 0.35],
        [pct(usableFlashcards, p.targets.flashcards), 0.20],
        [pct(lessonCount, p.targets.lessons), 0.25],
        [pct(caseCount, p.targets.cases), 0.20],
      ]);
      const blogScore = pct(blogCoverage, p.targets.blog);
      const seoScore = pct(seoCoverage, p.targets.seo);
      const blueprintScore = pct(blueprintDomains, p.targets.blueprintDomains);
      const monetizationReadiness = weighted([
        [contentScore, 0.35],
        [seoScore, 0.20],
        [usableFlashcards > 0 ? 80 : 0, 0.15],
        [questionCount >= p.targets.questions * 0.8 ? 90 : pct(questionCount, p.targets.questions) * 0.9, 0.20],
        [p.revenueRank === "high" ? 90 : 75, 0.10],
      ]);
      const competitiveReadiness = weighted([
        [contentScore, 0.40],
        [blueprintScore, 0.25],
        [pct(caseCount, p.targets.cases), 0.20],
        [blogScore, 0.15],
      ]);
      const readinessScore = weighted([
        [pct(questionCount, p.targets.questions), 0.24],
        [pct(usableFlashcards, p.targets.flashcards), 0.14],
        [pct(lessonCount, p.targets.lessons), 0.18],
        [pct(caseCount, p.targets.cases), 0.12],
        [blogScore, 0.10],
        [seoScore, 0.08],
        [blueprintScore, 0.06],
        [monetizationReadiness, 0.04],
        [competitiveReadiness, 0.04],
      ]);

      return {
        pathway: p.key,
        label: p.label,
        questionCount,
        flashcardCount: usableFlashcards,
        lessonCount,
        dedicatedLessonCount,
        caseCount,
        blogCoverage,
        seoCoverage,
        blueprintCoverage: blueprintScore,
        blueprintDomains,
        monetizationReadiness,
        competitiveReadiness,
        readinessScore,
        grade: grade(readinessScore),
        gapsTo95: {
          questions: gapFor95(questionCount, p.targets.questions),
          flashcards: gapFor95(usableFlashcards, p.targets.flashcards),
          lessons: gapFor95(lessonCount, p.targets.lessons),
          cases: gapFor95(caseCount, p.targets.cases),
          blog: gapFor95(blogCoverage, p.targets.blog),
          seo: gapFor95(seoCoverage, p.targets.seo),
          blueprintDomains: gapFor95(blueprintDomains, p.targets.blueprintDomains),
        },
        notes: p.alliedKey && dedicatedLessonCount === 0 ? "Allied lessons/flashcards are mostly shared core inventory, not dedicated profession depth." : "",
      };
    }).sort((a, b) => b.readinessScore - a.readinessScore || b.questionCount - a.questionCount);

    const strongest = results.slice(0, 10);
    const weakest = [...results].sort((a, b) => a.readinessScore - b.readinessScore).slice(0, 10);
    const totalGaps = results.reduce((acc, r) => {
      for (const [k, v] of Object.entries(r.gapsTo95)) acc[k] = (acc[k] ?? 0) + v;
      return acc;
    }, {});
    const roi = buildRoi(results);
    const fastestRevenue = [...results].sort((a, b) => b.monetizationReadiness - a.monetizationReadiness || b.readinessScore - a.readinessScore).slice(0, 8);

    const generatedAt = new Date().toISOString();
    const payload = { generatedAt, scoringModel: "Weighted production inventory readiness; content 68%, market/SEO/blueprint/monetization/competitive 32%. Case inventory is intentionally scored because it is a competitive differentiator.", results, strongest, weakest, roi, fastestRevenue, totalGaps };
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));
    writeFileSync(OUT_MD, renderMarkdown(payload));
    console.log(JSON.stringify({ generatedAt, out: path.relative(process.cwd(), OUT_MD), pathways: results.length }, null, 2));
  } finally {
    client.release();
    await pool.end();
  }
}

function weighted(items) {
  return Number(items.reduce((sum, [score, weight]) => sum + score * weight, 0).toFixed(1));
}

function gapFor95(actual, target) {
  return Math.max(0, Math.ceil(target * 0.95 - actual));
}

function buildRoi(results) {
  return results
    .flatMap((r) => [
      { pathway: r.pathway, investment: "Case/simulation layer", required: r.gapsTo95.cases, rationale: "Largest universal competitive-readiness drag; unlocks CAT/readiness differentiation." },
      { pathway: r.pathway, investment: "Dedicated flashcards", required: r.gapsTo95.flashcards, rationale: "Fast to generate from existing questions/lessons; improves daily-use subscription value." },
      { pathway: r.pathway, investment: "Blueprint tagging", required: r.gapsTo95.blueprintDomains, rationale: "Low-content lift that improves CAT/readiness credibility and coverage claims." },
      { pathway: r.pathway, investment: "SEO/blog depth", required: r.gapsTo95.blog + r.gapsTo95.seo, rationale: "Fast acquisition lift when content inventory already exists." },
    ])
    .filter((x) => x.required > 0)
    .sort((a, b) => a.required - b.required)
    .slice(0, 12);
}

function renderMarkdown(payload) {
  const { generatedAt, results, strongest, weakest, roi, fastestRevenue, totalGaps } = payload;
  return [
    "# Platform-Wide Readiness Executive Dashboard",
    "",
    `Generated: ${generatedAt}`,
    "",
    "## Executive Summary",
    "",
    "- This dashboard uses production database inventory for questions, lessons, flashcards, OSCE/cases, and live BlogPost rows, plus repository static long-tail/blog and route files for SEO coverage.",
    "- Readiness is not just raw question volume. Case inventory and blueprint tagging are scored because they determine adaptive readiness, CAT credibility, and competitive defensibility.",
    "- Production case coverage is the major platform-wide weakness: only one published OSCE/case row was found in the scoped production tables.",
    "- Allied flashcards are currently shared ALLIED inventory rather than clearly profession-dedicated inventory, so allied scores should be read as launch potential, not full competitive moat.",
    "",
    "## Ranked Dashboard",
    "",
    markdownTable(
      ["Rank", "Pathway", "Grade", "Score", "Question Count", "Flashcard Count", "Lesson Count", "Case Count", "Blog Coverage", "SEO Coverage", "Blueprint Coverage", "Monetization Readiness", "Competitive Readiness"],
      results.map((r, i) => [
        i + 1,
        r.pathway,
        r.grade,
        `${r.readinessScore}%`,
        r.questionCount,
        r.flashcardCount,
        r.lessonCount,
        r.caseCount,
        r.blogCoverage,
        r.seoCoverage,
        `${r.blueprintCoverage}%`,
        `${r.monetizationReadiness}%`,
        `${r.competitiveReadiness}%`,
      ]),
    ),
    "",
    "## Top 10 Strongest Pathways",
    "",
    markdownTable(["Rank", "Pathway", "Score", "Grade", "Why"], strongest.map((r, i) => [i + 1, r.pathway, `${r.readinessScore}%`, r.grade, strongestWhy(r)])),
    "",
    "## Top 10 Weakest Pathways",
    "",
    markdownTable(["Rank", "Pathway", "Score", "Grade", "Primary Gap"], weakest.map((r, i) => [i + 1, r.pathway, `${r.readinessScore}%`, r.grade, weakestWhy(r)])),
    "",
    "## Highest ROI Content Investments",
    "",
    markdownTable(["Rank", "Pathway", "Investment", "Required To Reach 95%", "Rationale"], roi.map((r, i) => [i + 1, r.pathway, r.investment, r.required, r.rationale])),
    "",
    "## Fastest Pathways To Revenue",
    "",
    markdownTable(["Rank", "Pathway", "Monetization Readiness", "Overall Score", "Revenue Motion"], fastestRevenue.map((r, i) => [i + 1, r.pathway, `${r.monetizationReadiness}%`, `${r.readinessScore}%`, revenueMotion(r)])),
    "",
    "## Estimated Content Required For 95% Platform Readiness",
    "",
    markdownTable(
      ["Content Type", "Required New/Tagged Items"],
      [
        ["Questions", totalGaps.questions],
        ["Flashcards", totalGaps.flashcards],
        ["Lessons", totalGaps.lessons],
        ["Cases / OSCE / Simulations", totalGaps.cases],
        ["Blog Articles", totalGaps.blog],
        ["SEO Route/Long-tail Assets", totalGaps.seo],
        ["Blueprint Domain Tags", totalGaps.blueprintDomains],
      ],
    ),
    "",
    "## Notes",
    "",
    "- `Blog Coverage` includes live scoped DB blog rows plus static long-tail markdown files matching pathway aliases.",
    "- `SEO Coverage` includes matching marketing routes, sitemap/page files, and static long-tail content assets.",
    "- `Blueprint Coverage` is based on published questions with non-empty blueprint/client-needs category tags; empty allied blueprint table rows were not credited.",
    "- `Flashcard Count` uses the larger of published card rows and published deck `card_count`. For allied professions this is shared ALLIED inventory unless profession tagging exists.",
    "- Scores are directional readiness scores, not a user-facing claim of exam coverage.",
    "",
  ].join("\n");
}

function strongestWhy(r) {
  if (r.questionCount >= 5000 && r.lessonCount >= 1000) return "Deep question and lesson inventory; needs cases/blueprint polishing.";
  if (r.questionCount >= 3000) return "Strong question bank, viable acquisition surface.";
  return "Best relative blend of content and market assets.";
}

function weakestWhy(r) {
  const gaps = Object.entries(r.gapsTo95).sort((a, b) => b[1] - a[1]).filter(([, v]) => v > 0);
  return gaps.slice(0, 3).map(([k, v]) => `${k}: ${v}`).join("; ") || "No major automated gap.";
}

function revenueMotion(r) {
  if (r.monetizationReadiness >= 80) return "Package existing inventory; add cases and blueprint proof before aggressive claims.";
  if (r.questionCount >= 2000) return "Question-bank-first offer with transparent roadmap for lessons/cases.";
  return "Build dedicated content before paid acquisition.";
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
