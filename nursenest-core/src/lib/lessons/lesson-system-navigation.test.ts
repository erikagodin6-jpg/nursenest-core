import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import {
  buildAppLessonsSystemHref,
  lessonSystemTopicSlugCandidates,
  primaryLessonSystemTopicSlug,
  resolveLessonSystemNavigationTarget,
} from "@/lib/lessons/lesson-system-navigation";
import { resolveMarketingLessonsHubDynamicSegment } from "@/lib/lessons/marketing-lessons-hub-category-resolve";

const REQUIRED_SYSTEMS = [
  ["Cardiovascular", "cardiovascular"],
  ["Respiratory", "respiratory"],
  ["Neurological", "neurological"],
  ["Endocrine", "endocrine"],
  ["Renal", "renal"],
  ["GI", "gastrointestinal"],
  ["Mental Health", "mental-health"],
  ["Pediatrics", "pediatrics"],
  ["Maternity", "maternity"],
] as const;

test("required lesson system labels resolve to stable app lesson topic URLs", () => {
  for (const [label, slug] of REQUIRED_SYSTEMS) {
    assert.equal(primaryLessonSystemTopicSlug(label), slug, label);
    const href = buildAppLessonsSystemHref({ pathwayId: "ca-rn-nclex-rn", system: label, limit: 24 });
    assert.equal(href, `/app/lessons?topicSlug=${encodeURIComponent(slug)}&pathwayId=ca-rn-nclex-rn&limit=24`);
  }
});

test("lesson system route files exist for app and marketing topic navigation", () => {
  assert.equal(existsSync("src/app/(app)/app/(learner)/lessons/page.tsx"), true);
  assert.equal(existsSync("src/app/(app)/app/(learner)/lessons/loading.tsx"), true);
  assert.equal(existsSync("src/app/(app)/app/(learner)/lessons/layout.tsx"), true);
  assert.equal(existsSync("src/app/api/learner/pathway-lessons/route.ts"), true);
  assert.equal(existsSync("src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx"), true);
  assert.equal(existsSync("src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/topics/[topicSlug]/page.tsx"), true);
});

test("marketing lessons hub defines topic slug candidates inside metadata and page render scopes", () => {
  const src = readFileSync("src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx", "utf8");
  assert.equal(
    src.split("const topicSlugCandidates = topicSlugNorm ? lessonSystemTopicSlugCandidates(topicSlugNorm) : [];").length - 1,
    2,
    "metadata and page render scopes must both define topicSlugCandidates before topicSlugsForList is used",
  );
  assert.equal(
    src.split("const topicSlugsForList = topicSlugNorm").length - 1,
    2,
    "metadata and page render scopes must both define topicSlugsForList before topic filtering",
  );
});

test("next config does not redirect canonical lesson category/detail routes back to the hub", () => {
  const src = readFileSync("next.config.mjs", "utf8");
  assert.doesNotMatch(
    src,
    /source:\s*["']\/(?:canada|us)\/[^"']+\/lessons\/:slug["'][\s\S]{0,140}?destination:\s*["']\/(?:canada|us)\/[^"']+\/lessons["']/,
    "lesson category/detail routes must reach the dynamic route, not a hub redirect",
  );
  assert.match(
    src,
    /Do not redirect `\/lessons\/:slug`/,
    "next.config should document why lesson dynamic routes are protected",
  );
});

test("canonical marketing lesson category slugs resolve before any lesson DB lookup", async () => {
  const resolved = await resolveMarketingLessonsHubDynamicSegment("ca-rn-nclex-rn", "cardiovascular");
  assert.notEqual(resolved, "lesson");
  if (resolved !== "lesson") {
    assert.equal(resolved.category.slug, "cardiovascular");
    assert.equal(resolved.category.label, "Cardiovascular");
  }
});

test("legacy taxonomy aliases still resolve when a hub emits category ids", () => {
  assert.equal(resolveLessonSystemNavigationTarget("renal_urinary")?.primaryTopicSlug, "renal");
  assert.equal(resolveLessonSystemNavigationTarget("reproductive_maternal_newborn")?.primaryTopicSlug, "maternity");
  assert.equal(resolveLessonSystemNavigationTarget("reproductive_obstetrics")?.primaryTopicSlug, "maternity");
  assert.equal(resolveLessonSystemNavigationTarget("mental_health")?.primaryTopicSlug, "mental-health");
});

test("query candidates include DB and catalog slug variants for high-risk systems", () => {
  const renal = lessonSystemTopicSlugCandidates("Renal");
  for (const slug of [
    "renal",
    "renal_urinary",
    "renal-and-urinary",
    "renal_genitourinary",
    "fluid-balance",
    "fluids-electrolytes",
    "fluids-electrolytes-and-acid-base",
  ]) {
    assert.ok(renal.includes(slug), `missing renal alias ${slug}`);
  }
  assert.ok(lessonSystemTopicSlugCandidates("Mental Health").includes("mental_health"));
  assert.ok(lessonSystemTopicSlugCandidates("Maternity").includes("maternal-and-newborn"));
  assert.ok(lessonSystemTopicSlugCandidates("Maternity").includes("reproductive_obstetrics"));
});
