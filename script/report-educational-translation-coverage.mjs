#!/usr/bin/env node
/**
 * Reports coverage of file-based educational overlays (lessons / questions / flashcards)
 * relative to pathway catalog lesson keys and raw key counts per locale.
 *
 * Usage (repo root): node script/report-educational-translation-coverage.mjs
 * Output: reports/educational-translation-coverage.json
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const LANGUAGES = [
  "en",
  "fr",
  "tl",
  "hi",
  "es",
  "zh",
  "zh-tw",
  "ar",
  "ko",
  "pt",
  "pa",
  "vi",
  "ht",
  "ur",
  "ja",
  "fa",
  "de",
  "th",
  "tr",
  "id",
  "it",
  "ru",
];

function readJsonSafe(p) {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function countLessonKeysFromCatalog() {
  const catalogPath = join(repoRoot, "nursenest-core", "src", "content", "pathway-lessons", "catalog.json");
  const raw = readJsonSafe(catalogPath);
  if (!raw?.pathways || typeof raw.pathways !== "object") return { totalCompoundKeys: 0, totalSlugs: 0 };
  const compound = new Set();
  const slugs = new Set();
  for (const [pathwayId, p] of Object.entries(raw.pathways)) {
    const lessons = p?.lessons;
    if (!Array.isArray(lessons)) continue;
    for (const L of lessons) {
      if (L?.slug) {
        slugs.add(String(L.slug));
        compound.add(`${pathwayId}:${String(L.slug)}`);
      }
    }
  }
  return { totalCompoundKeys: compound.size, totalSlugs: slugs.size };
}

function mergeFragmentLessonKeys(baseRoot, loc, baseKeys) {
  const keys = new Set(baseKeys);
  const fragDir = join(baseRoot, loc, "fragments");
  if (!existsSync(fragDir)) return keys;
  const files = readdirSync(fragDir)
    .filter((x) => x.endsWith(".json"))
    .sort();
  for (const f of files) {
    const part = readJsonSafe(join(fragDir, f));
    if (part && typeof part === "object" && !Array.isArray(part)) {
      for (const k of Object.keys(part)) keys.add(k);
    }
  }
  return keys;
}

function overlayStatsForLocale(baseRoot, loc) {
  const lessonsPath = join(baseRoot, loc, "lessons.json");
  const questionsPath = join(baseRoot, loc, "questions.json");
  const flashPath = join(baseRoot, loc, "flashcards.json");

  const lessonsRaw = readJsonSafe(lessonsPath);
  const lessonKeys =
    lessonsRaw && typeof lessonsRaw === "object" && !Array.isArray(lessonsRaw) ? Object.keys(lessonsRaw) : [];

  const mergedLessonKeys = mergeFragmentLessonKeys(baseRoot, loc, lessonKeys);

  const qRaw = readJsonSafe(questionsPath);
  const questionKeys =
    qRaw && typeof qRaw === "object" && !Array.isArray(qRaw) ? Object.keys(qRaw) : [];

  const fRaw = readJsonSafe(flashPath);
  let flashDeckKeys = 0;
  let flashCardKeys = 0;
  let flashTagKeys = 0;
  if (fRaw && typeof fRaw === "object") {
    if (fRaw.decks && typeof fRaw.decks === "object") flashDeckKeys = Object.keys(fRaw.decks).length;
    if (fRaw.cards && typeof fRaw.cards === "object") flashCardKeys = Object.keys(fRaw.cards).length;
    if (fRaw.tags && typeof fRaw.tags === "object") flashTagKeys = Object.keys(fRaw.tags).length;
  }

  return {
    hasLessonsFile: existsSync(lessonsPath),
    lessonOverlayKeys: mergedLessonKeys.size,
    questionOverlayKeys: questionKeys.length,
    flashcardDeckKeys: flashDeckKeys,
    flashcardCardKeys: flashCardKeys,
    flashcardTagKeys: flashTagKeys,
  };
}

function main() {
  const baseRoot = join(repoRoot, "nursenest-core", "public", "i18n", "educational-overlays");
  const catalog = countLessonKeysFromCatalog();

  const byLocale = {};
  for (const loc of LANGUAGES) {
    if (loc === "en") {
      byLocale[loc] = {
        note: "English is canonical DB + catalog source; file overlays are optional for parity tooling only.",
        fileOverlays: overlayStatsForLocale(baseRoot, loc),
      };
      continue;
    }
    byLocale[loc] = overlayStatsForLocale(baseRoot, loc);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    pathwayCatalog: {
      distinctPathwaySlugCompoundKeys: catalog.totalCompoundKeys,
      distinctSlugsAcrossPathways: catalog.totalSlugs,
    },
    educationalOverlayRoot: baseRoot.replace(repoRoot + "/", ""),
    locales: byLocale,
    interpretation: {
      lessonParity:
        "lessonOverlayKeys counts keys in lessons.json plus keys only appearing under fragments/*.json. Full parity means one overlay entry per catalog compound key (pathwayId:slug) where translation exists.",
      questions:
        "questionOverlayKeys counts ExamQuestion.id entries in questions.json; DB-published overlays (educationalTranslationOverlay) are not included here — use admin / DB reports for production coverage.",
      flashcards:
        "flashcard* counts are file overlays only; merged at runtime with Prisma educationalTranslationOverlay rows.",
    },
  };

  const reportDir = join(repoRoot, "reports");
  mkdirSync(reportDir, { recursive: true });
  const outPath = join(reportDir, "educational-translation-coverage.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log(`[educational-coverage] wrote ${outPath.replace(repoRoot + "/", "")}`);
}

main();
