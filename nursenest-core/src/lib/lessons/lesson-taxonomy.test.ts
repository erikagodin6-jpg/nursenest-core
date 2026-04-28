import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getEffectiveCatalogLessonsForPathwaySync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  LESSON_CATEGORIES,
  inferLessonCategoryFromTitle,
  lessonCategoryToSlug,
  normalizeLessonCategory,
  normalizeVisibleLessonTitle,
  premiumizeLessonDisplayTitle,
} from "@/lib/lessons/lesson-taxonomy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "../../content/pathway-lessons/catalog.json");
const LESSON_LIBRARY_PATH = path.join(__dirname, "../../content/lessons/lesson-library.json");

type CatalogJson = {
  pathways: Record<string, { lessons: Array<{ topic?: string; title?: string; topicSlug?: string; slug?: string }> }>;
};

function loadCatalog(): CatalogJson {
  const raw = fs.readFileSync(CATALOG_PATH, "utf8");
  return JSON.parse(raw) as CatalogJson;
}

const NURSING_PATHWAYS = [
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "ca-rpn-rex-pn",
  "us-lpn-nclex-pn",
  "us-np-fnp",
] as const;

test("LESSON_CATEGORIES is fixed length and slug mapping is injective for this set", () => {
  assert.equal(LESSON_CATEGORIES.length, 21);
  const slugs = new Set<string>();
  for (const c of LESSON_CATEGORIES) {
    const s = lessonCategoryToSlug(c);
    assert.ok(s.length > 0, c);
    assert.ok(!slugs.has(s), `duplicate slug for ${c}: ${s}`);
    slugs.add(s);
  }
});

test("every bundled catalog lesson topic normalizes to a controlled category", () => {
  const cat = loadCatalog();
  const missing: string[] = [];
  for (const pid of Object.keys(cat.pathways ?? {})) {
    const lessons = cat.pathways[pid]?.lessons ?? [];
    for (const row of lessons) {
      const topic = typeof row.topic === "string" ? row.topic : "";
      const title = typeof row.title === "string" ? row.title : "";
      const n = normalizeLessonCategory(topic, title);
      if (!LESSON_CATEGORIES.includes(n)) {
        missing.push(`${pid}/${row.slug}: topic=${JSON.stringify(topic)} → ${JSON.stringify(n)}`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test("no effective catalog lesson uses topic General", () => {
  for (const pid of NURSING_PATHWAYS) {
    for (const l of getEffectiveCatalogLessonsForPathwaySync(pid)) {
      assert.notEqual((l.topic ?? "").trim(), "General", `${pid} ${l.slug}`);
    }
  }
});

test("no effective lesson display title contains exam branding strings", () => {
  for (const pid of NURSING_PATHWAYS) {
    for (const l of getEffectiveCatalogLessonsForPathwaySync(pid)) {
      const t = l.title ?? "";
      assert.match(t, /^(?!.*\(NCLEX).*$/, `${pid}/${l.slug}: ${t}`);
      assert.match(t, /^(?!.*— REx-PN).*$/, `${pid}/${l.slug}: ${t}`);
      assert.ok(!/\bNCLEX-RN\b/i.test(t), `${pid}/${l.slug}: ${t}`);
    }
  }
});

test("no duplicate premiumized titles within the same pathway (effective list)", () => {
  for (const pid of NURSING_PATHWAYS) {
    const eff = getEffectiveCatalogLessonsForPathwaySync(pid);
    const byTitle = new Map<string, string[]>();
    for (const l of eff) {
      const key = premiumizeLessonDisplayTitle(l.title, l.slug);
      const arr = byTitle.get(key) ?? [];
      arr.push(l.slug);
      byTitle.set(key, arr);
    }
    const dupes = [...byTitle.entries()].filter(([, slugs]) => slugs.length > 1);
    assert.deepEqual(
      dupes,
      [],
      dupes.length ? `${pid}: ${dupes.map(([k, s]) => `${k} → ${s.join(",")}`).join(" | ")}` : "",
    );
  }
});

test("lessonCategoryToSlug round-trip smoke", () => {
  assert.equal(lessonCategoryToSlug("Renal & Urinary"), "renal-and-urinary");
  assert.equal(lessonCategoryToSlug("Fluids, Electrolytes & Acid-Base"), "fluids-electrolytes-and-acid-base");
});

test("inferLessonCategoryFromTitle respects pharm → infection → leadership → safety priority", () => {
  assert.equal(inferLessonCategoryFromTitle("Vancomycin troughs and nephrotoxicity monitoring"), "Pharmacology");
  assert.equal(inferLessonCategoryFromTitle("Standard precautions and airborne isolation for TB"), "Infection Control");
  assert.equal(inferLessonCategoryFromTitle("Delegation to the UAP in acute care"), "Leadership & Delegation");
  assert.equal(inferLessonCategoryFromTitle("Fall risk and hourly rounding priorities"), "Safety & Prioritization");
  assert.equal(inferLessonCategoryFromTitle("Meningitis: droplet precautions and assessment"), "Infection Control");
  assert.equal(inferLessonCategoryFromTitle("Meningitis: emergency recognition and triage"), "Safety & Prioritization");
});

test("normalizeLessonCategory can override miscoded Safety topic when title signals pharm or infection", () => {
  assert.equal(
    normalizeLessonCategory("Safety & Prioritization", "Antibiotic stewardship and culture timing"),
    "Pharmacology",
  );
  assert.equal(
    normalizeLessonCategory("Safety & Prioritization", "PPE sequence and contact precautions"),
    "Infection Control",
  );
});

test("normalizeVisibleLessonTitle removes NurseNest pipe suffix and prefers colon over pipe", () => {
  assert.equal(normalizeVisibleLessonTitle("Sepsis bundles | NurseNest"), "Sepsis bundles");
  assert.equal(normalizeVisibleLessonTitle("Sepsis | NurseNest | Bundles"), "Sepsis: Bundles");
  assert.equal(normalizeVisibleLessonTitle("Topic A | Clinical focus"), "Topic A: Clinical focus");
});

test("premiumizeLessonDisplayTitle runs visible-title cleanup before exam strip", () => {
  assert.equal(premiumizeLessonDisplayTitle("Prioritization drills | NurseNest", null), "Prioritization drills");
});

type LessonLibraryJson = {
  lessons: Array<{ slug?: string; title?: string; topic?: string; pathwayIds?: string[] }>;
};

test("lesson-library.json: controlled categories, no NCLEX in display titles, unique slugs", () => {
  assert.ok(fs.existsSync(LESSON_LIBRARY_PATH), `missing ${LESSON_LIBRARY_PATH} — run scripts/build-lesson-library.mts`);
  const lib = JSON.parse(fs.readFileSync(LESSON_LIBRARY_PATH, "utf8")) as LessonLibraryJson;
  const slugs = new Set<string>();
  for (const row of lib.lessons ?? []) {
    const slug = typeof row.slug === "string" ? row.slug : "";
    assert.ok(slug.length > 0);
    assert.ok(!slugs.has(slug), `duplicate slug in library: ${slug}`);
    slugs.add(slug);
    const topic = typeof row.topic === "string" ? row.topic : "";
    assert.ok(LESSON_CATEGORIES.includes(topic as (typeof LESSON_CATEGORIES)[number]), `invalid topic: ${slug} → ${topic}`);
    const title = typeof row.title === "string" ? row.title : "";
    assert.match(title, /^(?!.*\(NCLEX).*$/, `${slug}: ${title}`);
  }
});

test("lesson-library.json: no duplicate display titles within the same pathway membership", () => {
  const lib = JSON.parse(fs.readFileSync(LESSON_LIBRARY_PATH, "utf8")) as LessonLibraryJson;
  const pathways = new Set<string>();
  for (const row of lib.lessons ?? []) {
    for (const pid of row.pathwayIds ?? []) pathways.add(pid);
  }
  for (const pid of pathways) {
    const byTitle = new Map<string, string[]>();
    for (const row of lib.lessons ?? []) {
      if (!row.pathwayIds?.includes(pid)) continue;
      const t = typeof row.title === "string" ? row.title : "";
      const arr = byTitle.get(t) ?? [];
      arr.push(row.slug ?? "");
      byTitle.set(t, arr);
    }
    const dupes = [...byTitle.entries()].filter(([, slugs]) => slugs.length > 1);
    assert.deepEqual(dupes, [], dupes.length ? `${pid}: ${dupes.map(([k, s]) => `${k} → ${s.join(",")}`).join(" | ")}` : "");
  }
});
