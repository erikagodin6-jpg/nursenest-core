/**
 * One-off: GET each path against local dev/prod and report status codes.
 * Run: BASE_URL=http://127.0.0.1:3000 npx tsx scripts/marketing-route-audit.ts
 */
import { EXAM_PATHWAYS, buildExamPathwayPath } from "../src/lib/exam-pathways/exam-product-registry";
import { listNpPracticeTestSegmentPaths } from "../src/lib/exam-pathways/np-practice-test-segments";
import { getAllProgrammaticSlugs } from "../src/lib/seo/programmatic-registry";
import { ALLIED_PROFESSIONS } from "../src/lib/allied/allied-professions-registry";
import { getAllToolSlugs } from "../src/lib/tools/tool-registry";
import {
  ALLIED,
  HUB,
  NP,
  PN,
  RN,
  alliedHub,
  alliedQuestions,
  npNpQuestionsForRegion,
  npPracticeProgrammatic,
  pnPracticeProgrammatic,
  pnQuestions,
  rnQuestions,
} from "../src/lib/marketing/marketing-entry-routes";
import { mapLegacyMarketingHref, resolveMarketingHref } from "../src/lib/legacy-marketing-routes";

const BASE = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");

async function getCode(path: string): Promise<{ path: string; status: number; finalUrl: string }> {
  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const r = await fetch(url, { redirect: "manual" });
    const loc = r.headers.get("location");
    if (r.status >= 300 && r.status < 400 && loc) {
      const u = new URL(loc, url);
      const r2 = await fetch(u.toString(), { redirect: "manual" });
      return { path, status: r2.status, finalUrl: u.toString() };
    }
    return { path, status: r.status, finalUrl: url };
  } catch (e) {
    return { path, status: -1, finalUrl: String(e) };
  }
}

function uniq(paths: string[]): string[] {
  return [...new Set(paths.filter(Boolean))];
}

async function main() {
  const paths: string[] = [];

  // Core hubs
  paths.push(
    "/",
    HUB.examLessons,
    HUB.questionBank,
    HUB.practiceExams,
    HUB.tools,
    HUB.pricing,
    HUB.signup,
    HUB.login,
    "/pre-nursing",
    "/blog",
    "/case-studies",
    "/for-institutions",
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/disclaimer",
    "/refund-policy",
    "/acceptable-use",
    "/flashcards",
    "/exam-lessons",
  );

  // Exam strip + programmatic
  paths.push(
    RN.practiceProgrammatic,
    PN.practiceProgrammatic,
    PN.practiceProgrammaticUs,
    NP.practiceProgrammatic,
    NP.practiceProgrammaticCa,
    mapLegacyMarketingHref("/allied-health"),
  );

  // Region toggles US / CA
  for (const region of ["US", "CA"] as const) {
    paths.push(
      rnQuestions(region),
      pnQuestions(region),
      npNpQuestionsForRegion(region),
      alliedQuestions(region),
      alliedHub(region),
      pnPracticeProgrammatic(region),
      npPracticeProgrammatic(region),
    );
  }

  // NP SEO aliases
  for (const row of listNpPracticeTestSegmentPaths()) {
    paths.push(`/${row.countrySlug}/${row.roleTrack}/${row.segment}`);
  }
  paths.push(NP.aanpPracticeTest, NP.anccFnpPracticeTest, NP.pmhnpPracticeTest, NP.cnplePracticeTest);

  // Pathway hubs + subpages
  for (const p of EXAM_PATHWAYS) {
    if (p.status === "hidden") continue;
    paths.push(buildExamPathwayPath(p));
    paths.push(buildExamPathwayPath(p, "lessons"));
    paths.push(buildExamPathwayPath(p, "questions"));
    paths.push(buildExamPathwayPath(p, "pricing"));
  }

  // Programmatic slugs (public URL)
  for (const slug of getAllProgrammaticSlugs()) {
    paths.push(`/${slug}`);
  }

  // Tools
  for (const slug of getAllToolSlugs()) {
    paths.push(`/tools/${slug}`);
  }
  paths.push("/tools/med-math");

  // Allied marketing heroes
  for (const prof of ALLIED_PROFESSIONS) {
    paths.push(`/allied-health/${prof.segment}`);
    paths.push(`/allied-health/${prof.professionKey}/lessons`);
  }

  // Footer / legacy targets that should stay on Core (resolveMarketingHref)
  const footerRaw = [
    "/lessons",
    "/flashcards",
    "/pre-nursing",
    "/med-math",
    "/anatomy",
    "/practice-exams",
    "/free-practice",
    "/case-studies",
    "/tools",
    "/blog",
    "/exam-prep",
    "/nclex-rn",
    "/question-of-the-day",
    "/nursing-specialties",
    "/pricing",
    "/faq",
    "/contact",
    "/for-institutions",
    "/terms",
    "/privacy",
    "/disclaimer",
    "/refund-policy",
    "/acceptable-use",
    "/allied-health",
    "/allied-health/rrt-exam-prep",
    "/allied-health/paramedic-exam-prep",
  ];
  for (const h of footerRaw) {
    const r = resolveMarketingHref(h);
    if (!r.startsWith("http")) paths.push(r);
  }

  // App entry (may 307 to login)
  paths.push("/app/questions", "/app/exams", "/app/practice-tests", "/app", "/app/lessons");

  const unique = uniq(paths);
  const results: { path: string; status: number; finalUrl: string }[] = [];
  for (const p of unique) {
    results.push(await getCode(p));
    await new Promise((r) => setTimeout(r, 15));
  }

  const bad = results.filter((r) => r.status !== 200 && r.status !== 307 && r.status !== 308);
  const redirects = results.filter((r) => r.status === 308 || r.status === 307);

  console.log(JSON.stringify({ base: BASE, total: unique.length, bad, redirects: redirects.slice(0, 40) }, null, 2));
}

main().catch(console.error);
