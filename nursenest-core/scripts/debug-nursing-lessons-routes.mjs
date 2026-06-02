#!/usr/bin/env node
/**
 * Temporary route inventory: nursing tier hubs vs marketing lessons hubs.
 * Run: `node scripts/debug-nursing-lessons-routes.mjs` from `nursenest-core/`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORE = path.resolve(__dirname, "..");

/** Mirrors {@link marketingHubRoleSegment} — US/CA PN segments publish as `pn`. */
function marketingHubRoleSegment(roleTrack) {
  return roleTrack === "lpn" || roleTrack === "rpn" ? "pn" : roleTrack;
}

function buildExamPathwayPath({ countrySlug, roleTrack, examCode }, subpath) {
  const roleSlug = marketingHubRoleSegment(roleTrack);
  const base = `/${countrySlug}/${roleSlug}/${examCode}`;
  if (!subpath) return base;
  return `${base}/${String(subpath).replace(/^\//u, "")}`;
}

const TIER_HUB_PAGE = path.join(
  CORE,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx",
);
const LESSONS_INDEX_PAGE = path.join(
  CORE,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
);
const LESSON_DETAIL_PAGE = path.join(
  CORE,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/page.tsx",
);
const QUESTIONS_PAGE = path.join(CORE, "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx");
const CAT_PAGE = path.join(CORE, "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx");

const PATHWAYS = [
  { label: "US RN NCLEX-RN", countrySlug: "us", roleTrack: "rn", examCode: "nclex-rn" },
  { label: "US PN NCLEX-PN (registry roleTrack lpn)", countrySlug: "us", roleTrack: "lpn", examCode: "nclex-pn" },
  { label: "US NP FNP", countrySlug: "us", roleTrack: "np", examCode: "fnp" },
];

console.log("=== NurseNest — nursing tier / lessons route inventory ===\n");
console.log("App Router files (filesystem → URL pattern `[locale]/[slug]/[examCode]`):");
for (const [label, abs] of [
  ["Tier hub (overview)", TIER_HUB_PAGE],
  ["Lessons index hub", LESSONS_INDEX_PAGE],
  ["Lesson detail", LESSON_DETAIL_PAGE],
  ["Practice questions", QUESTIONS_PAGE],
  ["CAT / exams", CAT_PAGE],
]) {
  console.log(`  ${label}: ${path.relative(CORE, abs)} exists=${fs.existsSync(abs)}`);
}

console.log("\n--- Canonical URLs vs on-disk route module ---\n");

for (const p of PATHWAYS) {
  const pathway = { countrySlug: p.countrySlug, roleTrack: p.roleTrack, examCode: p.examCode };
  const hub = buildExamPathwayPath(pathway);
  const lessons = buildExamPathwayPath(pathway, "lessons");
  const questions = buildExamPathwayPath(pathway, "questions");
  const cat = buildExamPathwayPath(pathway, "cat");
  console.log(JSON.stringify({
    scenario: p.label,
    tierHubUrl: hub,
    lessonsHubUrl: lessons,
    practiceQuestionsUrl: questions,
    catUrl: cat,
    routeModule_tierHub: fs.existsSync(TIER_HUB_PAGE),
    routeModule_lessonsIndex: fs.existsSync(LESSONS_INDEX_PAGE),
    routeModule_lessonDetail: fs.existsSync(LESSON_DETAIL_PAGE),
    routeModule_questions: fs.existsSync(QUESTIONS_PAGE),
    routeModule_cat: fs.existsSync(CAT_PAGE),
    /** URL segment `[slug]` is marketing role (`pn` for LPN/RPN), not always Prisma `roleTrack`. */
    urlSlugMatchesFilesystem: true,
  }, null, 2));
  console.log("");
}

const lessonsSrc = fs.readFileSync(LESSONS_INDEX_PAGE, "utf8");
const looksLikeTierHubDuplicate =
  lessonsSrc.includes("NursingTierHubPage") &&
  lessonsSrc.includes("buildNursingTierHubContent") &&
  !lessonsSrc.includes("PathwayLessonsCurriculumHub") &&
  lessonsSrc.split("\n").length < 400;
console.log("--- Heuristic: lessons/page.tsx should be the real hub, not tier overview duplicate ---");
console.log({
  lessonsPageLineCount: lessonsSrc.split("\n").length,
  suspiciousTierHubOnlyStub: looksLikeTierHubDuplicate,
  hasCurriculumHub: lessonsSrc.includes("PathwayLessonsCurriculumHub"),
});
