#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { getMarketingLessonsHubCatalogLessons } from "@/lib/lessons/marketing-lessons-hub-category";
import { REQUIRED_ALLIED_PROFESSION_KEYS } from "@/lib/allied/allied-profession-lesson-index-verification";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = path.join(coreRoot, "reports");

function rowFor(pathwayLessonsKey: "us-allied-core" | "ca-allied-core") {
  const lessons = getMarketingLessonsHubCatalogLessons(pathwayLessonsKey);
  return REQUIRED_ALLIED_PROFESSION_KEYS.map((professionKey) => {
    const profession = ALLIED_PROFESSIONS.find((p) => p.professionKey === professionKey);
    const topicSlugsIn = [...(profession?.topicSlugsIn ?? [])];
    const mapped = topicSlugsIn.length ? lessons.filter((l) => topicSlugsIn.includes(l.topicSlug)) : [];
    return {
      pathwayLessonsKey: pathwayLessonsKey,
      professionKey,
      label: profession?.h1 ?? professionKey,
      topicSlugsIn,
      mappedLessonCount: mapped.length,
      mappedLessonSlugs: mapped.map((l) => l.slug),
      status: mapped.length > 0 ? "mapped" : topicSlugsIn.length ? "unmapped" : "no-topic-filters",
    };
  });
}

const report = {
  generatedAt: new Date().toISOString(),
  us: rowFor("us-allied-core"),
  ca: rowFor("ca-allied-core"),
};

fs.mkdirSync(reportsDir, { recursive: true });
const jsonPath = path.join(reportsDir, "allied-lesson-coverage.json");
const mdPath = path.join(reportsDir, "allied-lesson-coverage.md");
fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

const md = [
  "# Allied lesson coverage",
  "",
  `Generated at: ${report.generatedAt}`,
  "",
  "## US allied-core",
  "",
  ...report.us.flatMap((r) => [
    `### ${r.professionKey}`,
    "",
    `- Status: ${r.status}`,
    `- Mapped lessons: ${r.mappedLessonCount}`,
    `- Slugs: ${r.mappedLessonSlugs.join(", ") || "None"}`,
    "",
  ]),
  "## CA allied-core",
  "",
  ...report.ca.flatMap((r) => [
    `### ${r.professionKey}`,
    "",
    `- Status: ${r.status}`,
    `- Mapped lessons: ${r.mappedLessonCount}`,
    `- Slugs: ${r.mappedLessonSlugs.join(", ") || "None"}`,
    "",
  ]),
].join("\n");

fs.writeFileSync(mdPath, `${md}\n`, "utf8");
console.info(`[allied-lesson-coverage] wrote ${jsonPath} and ${mdPath}`);
