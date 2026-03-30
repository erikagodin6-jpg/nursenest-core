/**
 * Bounded ops report: which `pathway_lessons` locales exist vs English baseline slugs (no auto-translation).
 */
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import {
  PATHWAY_LESSON_CONTENT_LOCALE_CODES,
  isKnownPathwayLessonContentLocale,
  normalizePathwayLessonLocale,
} from "@/lib/lessons/pathway-lesson-locale";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { PATHWAY_LESSON_DB_TIMEOUT_MS } from "@/lib/lessons/pathway-lesson-loader";
import { ContentStatus } from "@prisma/client";

const DB_TIMEOUT = Math.min(PATHWAY_LESSON_DB_TIMEOUT_MS, 10_000);
const SAMPLE_SLUGS = 12;

/** Counts only — for paginated ops dashboard (no slug lists). */
export type PathwayTranslationCompact = {
  pathwayId: string;
  englishPublishedSlugCount: number;
  localesPresent: string[];
  missingVersusEnglish: Array<{ locale: string; missingSlugCount: number }>;
};

/**
 * Translation gap summary for specific pathways (one bounded `findMany`).
 */
export async function buildPathwayTranslationCompactForPathways(
  pathwayIds: string[],
): Promise<PathwayTranslationCompact[]> {
  if (pathwayIds.length === 0) return [];
  if (!isDatabaseUrlConfigured()) {
    return pathwayIds.map((pathwayId) => ({
      pathwayId,
      englishPublishedSlugCount: -1,
      localesPresent: [],
      missingVersusEnglish: [],
    }));
  }

  return withDatabaseFallbackTimeout(
    async () => {
      const rows = await prisma.pathwayLesson.findMany({
        where: { pathwayId: { in: pathwayIds }, status: ContentStatus.PUBLISHED },
        select: { pathwayId: true, locale: true, slug: true },
      });

      const byPathway = new Map<string, Map<string, Set<string>>>();
      for (const r of rows) {
        let m = byPathway.get(r.pathwayId);
        if (!m) {
          m = new Map();
          byPathway.set(r.pathwayId, m);
        }
        const key = normalizePathwayLessonLocale(r.locale);
        const set = m.get(key) ?? new Set<string>();
        set.add(r.slug);
        m.set(key, set);
      }

      return pathwayIds.map((pathwayId) => {
        const m = byPathway.get(pathwayId) ?? new Map<string, Set<string>>();
        const enSet = m.get("en") ?? new Set<string>();
        const localesPresent = [...m.keys()].sort((a, b) => a.localeCompare(b));
        const missingVersusEnglish: Array<{ locale: string; missingSlugCount: number }> = [];
        for (const loc of localesPresent) {
          if (loc === "en") continue;
          const locSet = m.get(loc) ?? new Set();
          const missingSlugCount = [...enSet].filter((s) => !locSet.has(s)).length;
          if (missingSlugCount > 0) missingVersusEnglish.push({ locale: loc, missingSlugCount });
        }
        return {
          pathwayId,
          englishPublishedSlugCount: enSet.size,
          localesPresent,
          missingVersusEnglish,
        };
      });
    },
    pathwayIds.map((pathwayId) => ({
      pathwayId,
      englishPublishedSlugCount: -1,
      localesPresent: [],
      missingVersusEnglish: [],
    })),
    DB_TIMEOUT,
  );
}

export type PathwayLessonTranslationGapReport = {
  generatedAt: string;
  databaseConfigured: boolean;
  /** Distinct `locale` values on published rows (may include keys outside marketing list). */
  distinctLocalesInDb: string[];
  /** Locales in DB that are not in {@link PATHWAY_LESSON_CONTENT_LOCALE_CODES}. */
  unknownLocaleKeysInDb: string[];
  supportedCatalogLocales: readonly string[];
  note: string;
  pathways: Array<{
    pathwayId: string;
    displayName: string;
    englishSlugCount: number;
    localesPresent: string[];
    missingVersusEnglish: Array<{
      locale: string;
      missingSlugCount: number;
      sampleMissingSlugs: string[];
    }>;
  }>;
};

export async function buildPathwayLessonTranslationGapReport(): Promise<PathwayLessonTranslationGapReport> {
  const generatedAt = new Date().toISOString();
  const databaseConfigured = isDatabaseUrlConfigured();
  const note =
    "English (`en`) is the baseline: `missingVersusEnglish` lists slugs that exist for `en` but not for the given locale. Exam hub URL segment `[locale]` is countrySlug, not content locale — lesson content locale is passed separately (see defaultPathwayLessonContentLocaleForExamHubRoute).";

  if (!databaseConfigured) {
    return {
      generatedAt,
      databaseConfigured: false,
      distinctLocalesInDb: [],
      unknownLocaleKeysInDb: [],
      supportedCatalogLocales: PATHWAY_LESSON_CONTENT_LOCALE_CODES,
      note,
      pathways: EXAM_PATHWAYS.map((p) => ({
        pathwayId: p.id,
        displayName: p.displayName,
        englishSlugCount: -1,
        localesPresent: [],
        missingVersusEnglish: [],
      })),
    };
  }

  return withDatabaseFallbackTimeout(
    async () => {
      const localeGroups = await prisma.pathwayLesson.groupBy({
        by: ["locale"],
        where: { status: ContentStatus.PUBLISHED },
        _count: { _all: true },
      });
      const distinctLocalesInDb = localeGroups.map((g) => g.locale).sort((a, b) => a.localeCompare(b));
      const unknownLocaleKeysInDb = distinctLocalesInDb.filter((loc) => !isKnownPathwayLessonContentLocale(loc));

      const pathways: PathwayLessonTranslationGapReport["pathways"] = [];

      for (const p of EXAM_PATHWAYS) {
        const rows = await prisma.pathwayLesson.findMany({
          where: { pathwayId: p.id, status: ContentStatus.PUBLISHED },
          select: { locale: true, slug: true },
        });
        const byLocale = new Map<string, Set<string>>();
        for (const r of rows) {
          const key = normalizePathwayLessonLocale(r.locale);
          const set = byLocale.get(key) ?? new Set<string>();
          set.add(r.slug);
          byLocale.set(key, set);
        }
        const enSet = byLocale.get("en") ?? new Set<string>();
        const localesPresent = [...byLocale.keys()].sort((a, b) => a.localeCompare(b));
        const missingVersusEnglish: Array<{
          locale: string;
          missingSlugCount: number;
          sampleMissingSlugs: string[];
        }> = [];

        for (const loc of localesPresent) {
          if (loc === "en") continue;
          const locSet = byLocale.get(loc) ?? new Set();
          const missing = [...enSet].filter((s) => !locSet.has(s));
          if (missing.length > 0) {
            missingVersusEnglish.push({
              locale: loc,
              missingSlugCount: missing.length,
              sampleMissingSlugs: missing.slice(0, SAMPLE_SLUGS),
            });
          }
        }

        pathways.push({
          pathwayId: p.id,
          displayName: p.displayName,
          englishSlugCount: enSet.size,
          localesPresent,
          missingVersusEnglish,
        });
      }

      return {
        generatedAt,
        databaseConfigured: true,
        distinctLocalesInDb,
        unknownLocaleKeysInDb,
        supportedCatalogLocales: PATHWAY_LESSON_CONTENT_LOCALE_CODES,
        note,
        pathways,
      };
    },
    {
      generatedAt,
      databaseConfigured: true,
      distinctLocalesInDb: [],
      unknownLocaleKeysInDb: [],
      supportedCatalogLocales: PATHWAY_LESSON_CONTENT_LOCALE_CODES,
      note: `${note} Report unavailable (timeout or error).`,
      pathways: [],
    },
    DB_TIMEOUT,
  );
}
