#!/usr/bin/env npx tsx
/**
 * Builds `src/content/pathway-lessons/allied-bundled-catalog.json` from legacy
 * `client/src/data/lessons/allied-health-foundations-{1,2,3}.ts` via convertLegacyLesson.
 *
 * Run: npx tsx scripts/build-allied-bundled-catalog.mts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { LessonContent } from "@legacy-client/data/lessons/types";
import { alliedHealthFoundations1Lessons } from "@legacy-client/data/lessons/allied-health-foundations-1";
import { alliedHealthFoundations2Lessons } from "@legacy-client/data/lessons/allied-health-foundations-2";
import { alliedHealthFoundations3Lessons } from "@legacy-client/data/lessons/allied-health-foundations-3";
import { convertLegacyLesson } from "./convert-legacy-lesson-to-enrichment";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src/content/pathway-lessons/allied-bundled-catalog.json");

type LessonInputShape = ReturnType<typeof convertLegacyLesson> & {
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  seoTitle: string;
  seoDescription: string;
};

function topicSlugFromKey(key: string): string {
  return key.replace(/^allied-/, "") || "general";
}

function buildForPathway(pathwayId: "us-allied-core" | "ca-allied-core", lessons: Record<string, LessonContent>): LessonInputShape[] {
  const ca = pathwayId === "ca-allied-core";
  const out: LessonInputShape[] = [];
  for (const [key, lesson] of Object.entries(lessons)) {
    const conv = convertLegacyLesson({ pathwayId, slug: key, lesson });
    const titleSuffix = ca ? " (Canada, allied health)" : " (US, allied health)";
    out.push({
      ...conv,
      title: `${lesson.title}${titleSuffix}`,
      topic: "Allied health foundations",
      topicSlug: topicSlugFromKey(key),
      bodySystem: "Professional practice",
      seoTitle: `${lesson.title} — Allied health${ca ? " (Canada)" : " (US)"}`,
      seoDescription: `Foundations lesson: ${lesson.title}. Allied health exam prep and clinical practice.`,
    });
  }
  return out;
}

const mergedLegacy = {
  ...alliedHealthFoundations1Lessons,
  ...alliedHealthFoundations2Lessons,
  ...alliedHealthFoundations3Lessons,
};

const payload = {
  version: 1 as const,
  generatedAt: new Date().toISOString(),
  source: "client/src/data/lessons/allied-health-foundations-1|2|3.ts via convertLegacyLesson",
  pathways: {
    "us-allied-core": buildForPathway("us-allied-core", mergedLegacy),
    "ca-allied-core": buildForPathway("ca-allied-core", mergedLegacy),
  },
};

fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(
  JSON.stringify(
    {
      out: OUT,
      usCount: payload.pathways["us-allied-core"].length,
      caCount: payload.pathways["ca-allied-core"].length,
      uniqueSlugs: Object.keys(mergedLegacy).length,
    },
    null,
    2,
  ),
);
