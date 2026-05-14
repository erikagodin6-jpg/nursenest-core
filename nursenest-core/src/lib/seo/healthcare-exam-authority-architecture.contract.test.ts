import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildHealthcareExamAuthorityUrlInventory,
  HEALTHCARE_EXAM_AUTHORITY_PILLARS,
  HEALTHCARE_EXAM_ECOSYSTEM_PAGES,
  HEALTHCARE_EXAM_TOPIC_CLUSTERS,
  listLiveHealthcareExamAuthorityUrls,
} from "@/lib/seo/healthcare-exam-authority-architecture";

const appRoot = path.join(process.cwd(), "src/app/(marketing)/(default)");

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), relativePath));
}

function routeExistsForLivePath(urlPath: string): boolean {
  const parts = urlPath.split("/").filter(Boolean);
  if (parts[0] === "allied" && parts.length === 2) {
    return exists("src/app/(marketing)/(default)/allied/[career]/page.tsx");
  }
  if (parts[0] === "allied" && parts[1] === "allied-health") {
    if (parts.length === 2) return exists("src/app/(marketing)/(default)/allied/allied-health/page.tsx");
    return exists(`src/app/(marketing)/(default)/allied/allied-health/${parts[2]}/page.tsx`);
  }
  if (parts[0] === "ecg" && parts.length === 2) {
    return exists("src/app/(marketing)/(default)/ecg/[topic]/page.tsx");
  }
  if (parts.length === 1) {
    return exists(`src/app/(marketing)/(default)/${parts[0]}/page.tsx`);
  }
  if (parts.length >= 3 && ["us", "canada"].includes(parts[0]!)) {
    if (parts.length === 3) {
      return exists("src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx");
    }
    const subpath = parts[3]!;
    const direct = `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/${subpath}/page.tsx`;
    const authority = path.join(appRoot, parts[0]!, parts[1]!, parts[2]!, "[topic]/page.tsx");
    return exists(direct) || fs.existsSync(authority);
  }
  return exists(`src/app/(marketing)/(default)${urlPath}/page.tsx`);
}

test("healthcare exam authority pillars cover requested exam families", () => {
  const families = new Set(HEALTHCARE_EXAM_AUTHORITY_PILLARS.map((pillar) => pillar.family));
  for (const family of ["nclex-rn", "rex-pn", "cnple", "np", "allied"] as const) {
    assert.ok(families.has(family), `missing authority pillar family: ${family}`);
  }
});

test("each healthcare authority pillar has production SEO and conversion requirements", () => {
  for (const pillar of HEALTHCARE_EXAM_AUTHORITY_PILLARS) {
    assert.equal(pillar.robots, "index,follow", `${pillar.id} must be index,follow`);
    assert.ok(pillar.title.length >= 45 && pillar.title.length <= 75, `${pillar.id} title length needs SEO bounds`);
    assert.ok(pillar.description.length >= 120 && pillar.description.length <= 180, `${pillar.id} description length needs SEO bounds`);
    assert.ok(pillar.schema.includes("FAQPage"), `${pillar.id} missing FAQPage schema requirement`);
    assert.ok(pillar.schema.includes("EducationalCourse"), `${pillar.id} missing EducationalCourse schema requirement`);
    assert.ok(pillar.schema.includes("BreadcrumbList"), `${pillar.id} missing BreadcrumbList schema requirement`);
    assert.ok(pillar.conversionCtas.length >= 3, `${pillar.id} needs premium conversion CTAs`);
    assert.ok(pillar.internalLinks.length >= 3, `${pillar.id} needs strong internal linking`);
    for (const cta of pillar.conversionCtas) {
      assert.match(cta.href, /^\//, `${pillar.id} CTA must use internal path: ${cta.href}`);
    }
  }
});

test("ecosystem architecture includes test bank, CAT, flashcard, guide, and practice surfaces", () => {
  const intents = new Set(HEALTHCARE_EXAM_ECOSYSTEM_PAGES.map((page) => page.intent));
  for (const intent of ["practice-questions", "test-bank", "cat-exam", "flashcards", "study-guide"] as const) {
    assert.ok(intents.has(intent), `missing ecosystem intent: ${intent}`);
  }
});

test("topic cluster architecture covers high-value long-tail groups", () => {
  const ids = new Set(HEALTHCARE_EXAM_TOPIC_CLUSTERS.map((cluster) => cluster.id));
  for (const id of [
    "insulin-nursing-questions",
    "copd-respiratory-questions",
    "ecg-nursing-questions",
    "dosage-calculations",
    "prioritization-delegation-sata",
    "np-case-studies-diagnostics",
    "allied-competency-clusters",
  ]) {
    assert.ok(ids.has(id), `missing topic cluster: ${id}`);
  }
});

test("live healthcare authority URLs resolve to existing route patterns", () => {
  for (const url of listLiveHealthcareExamAuthorityUrls()) {
    assert.ok(routeExistsForLivePath(url), `live SEO URL has no route pattern: ${url}`);
  }
});

test("planned short aliases are not emitted as live indexable URLs", () => {
  const live = new Set(listLiveHealthcareExamAuthorityUrls());
  for (const row of buildHealthcareExamAuthorityUrlInventory()) {
    if (row.plannedAliasPath) {
      assert.ok(!live.has(row.plannedAliasPath), `planned alias leaked into live URL set: ${row.plannedAliasPath}`);
    }
  }
});

test("live healthcare authority inventory has unique canonical paths", () => {
  const liveRows = buildHealthcareExamAuthorityUrlInventory().filter((row) => row.status === "live");
  const seen = new Map<string, string>();
  for (const row of liveRows) {
    const prior = seen.get(row.canonicalPath);
    assert.equal(prior, undefined, `duplicate live canonical path ${row.canonicalPath} for ${prior} and ${row.id}`);
    seen.set(row.canonicalPath, row.id);
  }
});
