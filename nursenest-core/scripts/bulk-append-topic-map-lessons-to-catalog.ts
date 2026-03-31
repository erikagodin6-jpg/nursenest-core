#!/usr/bin/env npx tsx
/**
 * Appends pathway lessons from `src/content/topic-maps/master-topic-map.json` into
 * `src/content/pathway-lessons/catalog.json` for RN + PN pathways (US + Canada).
 * Skips slugs that already exist per pathway. Emits five canonical section kinds.
 *
 *   npx tsx scripts/bulk-append-topic-map-lessons-to-catalog.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const TOPIC_MAP_PATH = path.join(ROOT, "src/content/topic-maps/master-topic-map.json");

type MapTopic = {
  id: string;
  name: string;
  priority?: string;
  difficultyDefault?: number;
  autoRelatedTopicIds?: string[];
};

type MapCategory = { id: string; name: string; topics: MapTopic[] };
type MapExam = { categories: MapCategory[] };
type MapDoc = { exams: Record<string, MapExam> };

type CatalogLesson = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: Array<{ id: string; heading: string; kind: string; body: string }>;
};

type CatalogFile = { version: number; pathways: Record<string, { lessons: CatalogLesson[] }> };

const PATHWAY_TARGETS: Array<{
  pathwayId: string;
  examKey: "RN" | "PN";
  region: "us" | "ca";
}> = [
  { pathwayId: "us-rn-nclex-rn", examKey: "RN", region: "us" },
  { pathwayId: "ca-rn-nclex-rn", examKey: "RN", region: "ca" },
  { pathwayId: "us-lpn-nclex-pn", examKey: "PN", region: "us" },
  { pathwayId: "ca-rpn-rex-pn", examKey: "PN", region: "ca" },
];

function bodySystemForCategory(categoryId: string): string {
  const m: Record<string, string> = {
    cardiovascular: "Cardiovascular",
    respiratory: "Respiratory",
    pharmacology: "Pharmacology",
    "fluids-electrolytes": "Renal",
    gastrointestinal: "Gastrointestinal",
    neurological: "Neurologic",
    endocrine: "Endocrine",
    "renal-gu": "Renal",
    hematology: "Hematologic",
    musculoskeletal: "Integumentary",
    infectious: "Immune",
    "mental-health": "Mental Health",
    "women-health": "Women's health",
    "child-health": "Child health",
    fundamentals: "General",
    "management-of-care": "General",
    leadership: "General",
    "pn-foundation": "General",
    "safety-infection": "Infection control",
    perioperative: "General",
    ethics: "General",
    nutrition: "Gastrointestinal",
    integumentary: "Integumentary",
    sensory: "Neurologic",
    legal: "General",
  };
  return m[categoryId] ?? "General";
}

function buildSections(args: {
  topic: MapTopic;
  category: MapCategory;
  track: "rn" | "pn";
  region: "us" | "ca";
}): CatalogLesson["sections"] {
  const { topic, category, track, region } = args;
  const tn = topic.name;
  const cat = category.name;
  const rel = (topic.autoRelatedTopicIds ?? []).slice(0, 6);
  const relatedLine =
    rel.length > 0
      ? `\n\n**Related topics in your map:** ${rel.map((id) => `\`${id}\``).join(", ")} — use the question bank and lesson hub filters to cluster practice.`
      : "";

  const regionRn =
    region === "ca"
      ? " Canadian items may use **metric** units and provincial wording; prioritization logic matches NCLEX-RN."
      : " US NCLEX-RN items often test **unstable vs stable**, **delegation**, and **first action**.";

  const regionPn =
    region === "ca"
      ? " Canadian PN / REx-PN stems emphasize **assignment clarity**, **scope**, and **safety within role**."
      : " US NCLEX-PN items emphasize **stable clients**, **task sequencing**, and **reporting** when findings exceed PN scope.";

  const clinicalMeaning =
    track === "rn"
      ? `**${tn}** (${cat}) is a clinical judgment topic: connect **assessment data** to **risk**, choose the **first safe nursing action**, and know when to **delegate** versus **retain** responsibility.${regionRn}`
      : `**${tn}** (${cat}) tests whether you stay **within PN scope**: carry out **ordered** care, **observe and report** changes, and **escalate** when the plan or stability is unclear.${regionPn}`;

  const examRelevance =
    track === "rn"
      ? `Examiners use **${tn}** to probe **prioritization**, **monitoring**, and **escalation**. Expect **distractors** that look reasonable but delay assessment, skip unstable clients, or delegate RN-level judgment inappropriately.`
      : `Examiners use **${tn}** to probe **task safety**, **communication**, and **scope**. Watch for options that **independently diagnose**, **prescribe**, or **hide** abnormal findings from the RN.`;

  const coreConcept = `Frame **${tn}** within **${cat}**: link expected **assessment** findings to **interventions** and the **monitoring** that proves the plan is working. Difficulty default in the topic map: **${topic.difficultyDefault ?? "n/a"}**; priority: **${topic.priority ?? "n/a"}**.`;

  const clinicalScenario =
    track === "rn"
      ? `Picture multiple clients or tasks: pick the option that **reduces harm fastest** for the client whose status is **deteriorating** or **high risk** if unattended. When the stem is stable, still choose the action that **closes the data gap** before routines.`
      : `Picture a **stable** assignment with a **new finding**: your best move is usually **assess per order**, **reinforce teaching**, or **notify the RN**—not silent completion of tasks when something changed.`;

  const takeaways = `- Tie **vitals + labs + story** before comfort measures or discharge teaching.\n- Eliminate answers that **skip assessment** or **delay escalation** when data show risk.\n- Pair this page with **topic slug \`${category.id}\`** in the hub and timed question blocks.${relatedLine}`;

  return [
    { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: clinicalMeaning },
    { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: examRelevance },
    { id: "core_concept", heading: "Core concept", kind: "core_concept", body: coreConcept },
    { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: clinicalScenario },
    { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeaways },
  ];
}

function lessonForPathway(
  topic: MapTopic,
  category: MapCategory,
  spec: (typeof PATHWAY_TARGETS)[number],
): CatalogLesson {
  const track = spec.examKey === "RN" ? "rn" : "pn";
  const region = spec.region;
  const title =
    track === "rn"
      ? region === "us"
        ? `${topic.name} (NCLEX-RN, US)`
        : `${topic.name} (NCLEX-RN, Canada)`
      : region === "us"
        ? `${topic.name} (NCLEX-PN, US)`
        : `${topic.name} (REx-PN / PN, Canada)`;

  const seoTitle =
    track === "rn"
      ? `${topic.name} | NCLEX-RN | NurseNest`
      : `${topic.name} | NCLEX-PN / PN | NurseNest`;

  const seoDescription = `Study guide: ${topic.name} — ${category.name}. Five-section pathway lesson aligned to the master topic map (coverage-first).`;

  return {
    slug: topic.id,
    title,
    topic: category.name,
    topicSlug: category.id,
    bodySystem: bodySystemForCategory(category.id),
    previewSectionCount: 1,
    seoTitle,
    seoDescription,
    sections: buildSections({ topic, category, track, region }),
  };
}

function collectTopics(map: MapDoc, examKey: "RN" | "PN"): Array<{ category: MapCategory; topic: MapTopic }> {
  const exam = map.exams[examKey];
  if (!exam?.categories) return [];
  const out: Array<{ category: MapCategory; topic: MapTopic }> = [];
  for (const cat of exam.categories) {
    for (const topic of cat.topics ?? []) {
      out.push({ category: cat, topic });
    }
  }
  return out;
}

function main() {
  const map = JSON.parse(fs.readFileSync(TOPIC_MAP_PATH, "utf8")) as MapDoc;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8")) as CatalogFile;

  const beforeTotal = Object.values(catalog.pathways).reduce((n, p) => n + (p.lessons?.length ?? 0), 0);
  const beforePublishedNote =
    "PathwayLesson DB: if any row exists for a pathway, the app lists **only DB rows** (not merged with catalog). Run `npm run db:seed-pathway-lessons` after updating catalog.";

  let addedRn = 0;
  let addedPn = 0;
  const perPathway: Record<string, number> = {};

  for (const target of PATHWAY_TARGETS) {
    const bucket = catalog.pathways[target.pathwayId];
    if (!bucket) {
      console.error(`Missing pathway ${target.pathwayId} in catalog.json`);
      process.exit(1);
    }
    const existing = new Set((bucket.lessons ?? []).map((l) => l.slug));
    const topics = collectTopics(map, target.examKey);
    let n = 0;
    for (const { category, topic } of topics) {
      if (existing.has(topic.id)) continue;
      bucket.lessons.push(lessonForPathway(topic, category, target));
      existing.add(topic.id);
      n++;
      if (target.examKey === "RN") addedRn += 1;
      else addedPn += 1;
    }
    perPathway[target.pathwayId] = n;
  }

  const afterTotal = Object.values(catalog.pathways).reduce((n, p) => n + (p.lessons?.length ?? 0), 0);

  fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n", "utf8");

  console.log(
    JSON.stringify(
      {
        beforeTotalLessonsInCatalog: beforeTotal,
        afterTotalLessonsInCatalog: afterTotal,
        appendedPerPathway: perPathway,
        appendedRnLessonRowsAcrossPathways: addedRn,
        appendedPnLessonRowsAcrossPathways: addedPn,
        note: beforePublishedNote,
      },
      null,
      2,
    ),
  );
}

main();
