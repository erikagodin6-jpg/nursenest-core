import fs from "node:fs";
import path from "node:path";
import { ContentStatus, CountryCode, LocalizedBlogStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { listExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayExamQuestionMarketingWhere } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { GLOBAL_LOCALE_CODES } from "@/lib/i18n/global-regions";
import { evaluatePathwayLessonStructuralGate } from "@/lib/lessons/pathway-lesson-premium";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

type CompletenessStatus = "COMPLETE" | "PARTIAL" | "INSUFFICIENT";
type PathwaySegment = "CORE_NURSING" | "ALLIED";
type CategoryName =
  | "cardiovascular"
  | "respiratory"
  | "renal"
  | "endocrine"
  | "neuro"
  | "GI"
  | "hematology"
  | "pharmacology"
  | "maternity"
  | "pediatrics"
  | "mental health"
  | "prioritization"
  | "safety";

type CountThreshold = { minimum: number; highEnd: number };

type SegmentThresholds = {
  lessons: CountThreshold;
  questions: CountThreshold;
  flashcards: CountThreshold;
  catPoolMin: number | null;
};

type PathwayCompletenessRow = {
  pathwayId: string;
  displayName: string;
  countryCode: CountryCode;
  roleTrack: string;
  segment: PathwaySegment;
  counts: {
    lessons: number;
    questions: number;
    flashcards: number;
    catPool: number;
    incompleteLessons: number;
  };
  required: SegmentThresholds;
  quality: {
    flashcardsDerivedFromQuestions: number;
    fullLearningLoop: boolean;
  };
  categoryCoverage: {
    lessonsByCategory: Record<CategoryName, number>;
    questionsByCategory: Record<CategoryName, number>;
  };
  completenessStatus: CompletenessStatus;
  missingCategories: CategoryName[];
  localizationIssues: {
    mismatchedCountryQuestions: number;
    mixedUnitOrNamingSignals: number;
    details: string[];
  };
  deficiencies: string[];
};

type LanguageCompletenessRow = {
  locale: string;
  navigationReady: boolean;
  publishedBlogPosts: number;
  localizedLessons: number;
  localizedQuestions: number;
  flashcardsAccessible: boolean;
  usableLessonsOrFallback: boolean;
  status: CompletenessStatus;
  deficiencies: string[];
};

export type HighEndCompletenessAudit = {
  generatedAt: string;
  thresholds: {
    coreNursing: SegmentThresholds;
    allied: SegmentThresholds;
  };
  pathways: PathwayCompletenessRow[];
  languageCompleteness: LanguageCompletenessRow[];
  prioritizedRoadmap: string[];
  languageExpansionBlocked: boolean;
};

export type HighEndCompletenessAuditInput = {
  pathwayIds?: string[];
  includeLanguageAudit?: boolean;
};

const CORE_THRESHOLDS: SegmentThresholds = {
  lessons: { minimum: 300, highEnd: 500 },
  questions: { minimum: 5000, highEnd: 15000 },
  flashcards: { minimum: 10000, highEnd: 30000 },
  catPoolMin: 3000,
};

const ALLIED_THRESHOLDS: SegmentThresholds = {
  lessons: { minimum: 150, highEnd: 300 },
  questions: { minimum: 2000, highEnd: 8000 },
  flashcards: { minimum: 5000, highEnd: 15000 },
  catPoolMin: null,
};

const REQUIRED_CATEGORIES: CategoryName[] = [
  "cardiovascular",
  "respiratory",
  "renal",
  "endocrine",
  "neuro",
  "GI",
  "hematology",
  "pharmacology",
  "maternity",
  "pediatrics",
  "mental health",
  "prioritization",
  "safety",
];

const CATEGORY_KEYWORDS: Record<CategoryName, string[]> = {
  cardiovascular: ["cardio", "heart", "arrhythm", "acs", "chf"],
  respiratory: ["resp", "pulm", "copd", "asthma", "oxygen"],
  renal: ["renal", "kidney", "aki", "ckd", "urinary"],
  endocrine: ["endocr", "diabetes", "thyroid", "dka", "hhs"],
  neuro: ["neuro", "stroke", "seizure", "cns", "brain"],
  GI: ["gi", "gastro", "liver", "hepatic", "bowel"],
  hematology: ["hema", "blood", "anemia", "coag", "platelet"],
  pharmacology: ["pharm", "medication", "drug", "insulin", "antibiotic"],
  maternity: ["maternity", "obst", "pregnan", "labor", "postpartum"],
  pediatrics: ["pediatric", "child", "newborn", "neonate", "adolescent"],
  "mental health": ["mental", "psych", "depression", "anxiety", "suicide"],
  prioritization: ["priorit", "triage", "delegation", "clinical judgment"],
  safety: ["safety", "infection", "isolation", "fall", "adverse event"],
};

function segmentForRoleTrack(roleTrack: string): PathwaySegment {
  return roleTrack === "allied" ? "ALLIED" : "CORE_NURSING";
}

function thresholdsForSegment(segment: PathwaySegment): SegmentThresholds {
  return segment === "CORE_NURSING" ? CORE_THRESHOLDS : ALLIED_THRESHOLDS;
}

function normalizeText(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function detectMissingCategories(signals: string[]): CategoryName[] {
  const text = normalizeText(signals.join(" "));
  return REQUIRED_CATEGORIES.filter((category) => {
    const keys = CATEGORY_KEYWORDS[category];
    return !keys.some((k) => text.includes(k));
  });
}

function categoryCountsFromSignals(signals: string[]): Record<CategoryName, number> {
  const textBlocks = signals.map((s) => normalizeText(s)).filter(Boolean);
  const out = Object.fromEntries(REQUIRED_CATEGORIES.map((k) => [k, 0])) as Record<CategoryName, number>;
  for (const block of textBlocks) {
    for (const category of REQUIRED_CATEGORIES) {
      if (CATEGORY_KEYWORDS[category].some((k) => block.includes(k))) {
        out[category] += 1;
      }
    }
  }
  return out;
}

function countMixedLocalizationSignals(args: {
  country: CountryCode;
  rows: Array<{ labUnitVariant: string | null; medicationNamingVariant: string | null }>;
}): number {
  const wrongTokens =
    args.country === CountryCode.CA
      ? ["imperial", "us", "fahrenheit"]
      : ["si", "metric", "canada", "celsius"];
  let mixed = 0;
  for (const r of args.rows) {
    const lab = normalizeText(r.labUnitVariant ?? "");
    const med = normalizeText(r.medicationNamingVariant ?? "");
    if (wrongTokens.some((token) => lab.includes(token) || med.includes(token))) {
      mixed += 1;
    }
  }
  return mixed;
}

function hasLocaleNavFile(locale: string): boolean {
  const localPath = path.join(process.cwd(), "public", "i18n", `${locale}.json`);
  return fs.existsSync(localPath);
}

function statusFromCounts(args: {
  lessons: number;
  questions: number;
  flashcards: number;
  catPool: number;
  incompleteLessons: number;
  missingCategories: CategoryName[];
  localizationIssueCount: number;
  fullLearningLoop: boolean;
  thresholds: SegmentThresholds;
}): CompletenessStatus {
  const hitHigh =
    args.lessons >= args.thresholds.lessons.highEnd &&
    args.questions >= args.thresholds.questions.highEnd &&
    args.flashcards >= args.thresholds.flashcards.highEnd &&
    (args.thresholds.catPoolMin == null || args.catPool >= args.thresholds.catPoolMin) &&
    args.incompleteLessons === 0 &&
    args.missingCategories.length === 0 &&
    args.localizationIssueCount === 0 &&
    args.fullLearningLoop;
  if (hitHigh) return "COMPLETE";

  const hitMinimum =
    args.lessons >= args.thresholds.lessons.minimum &&
    args.questions >= args.thresholds.questions.minimum &&
    args.flashcards >= args.thresholds.flashcards.minimum &&
    (args.thresholds.catPoolMin == null || args.catPool >= args.thresholds.catPoolMin) &&
    args.fullLearningLoop;
  return hitMinimum ? "PARTIAL" : "INSUFFICIENT";
}

export async function buildHighEndCompletenessAudit(input: HighEndCompletenessAuditInput = {}): Promise<HighEndCompletenessAudit> {
  const includeLanguageAudit = input.includeLanguageAudit ?? true;
  const selectedIds = new Set((input.pathwayIds ?? []).map((id) => id.trim()).filter(Boolean));
  const pathways = selectedIds.size > 0
    ? listExamPathways().filter((p) => selectedIds.has(p.id))
    : listExamPathways();

  const pathwayRows: PathwayCompletenessRow[] = [];

  for (const pathway of pathways) {
    const segment = segmentForRoleTrack(pathway.roleTrack);
    const thresholds = thresholdsForSegment(segment);
    const questionWhere = pathwayExamQuestionMarketingWhere(pathway);

    const [lessons, questionCount, catPoolCount, flashcardCount, flashcardsFromQuestions, questionSignals] =
      await Promise.all([
        prisma.pathwayLesson.findMany({
          where: { pathwayId: pathway.id, status: ContentStatus.PUBLISHED, locale: "en" },
          select: {
            slug: true,
            title: true,
            topic: true,
            topicSlug: true,
            bodySystem: true,
            seoTitle: true,
            seoDescription: true,
            sections: true,
          },
        }),
        prisma.examQuestion.count({ where: { AND: [questionWhere, { status: DB_PUBLISHED }] } }),
        prisma.examQuestion.count({ where: { AND: [questionWhere, { status: DB_PUBLISHED }, { isAdaptiveEligible: true }] } }),
        prisma.flashcard.count({
          where: {
            status: ContentStatus.PUBLISHED,
            deck: { is: { pathwayId: pathway.id, status: ContentStatus.PUBLISHED } },
          },
        }),
        prisma.examQuestion.count({
          where: { AND: [questionWhere, { status: DB_PUBLISHED }, { isFlashcardSource: true }] },
        }),
        prisma.examQuestion.findMany({
          where: { AND: [questionWhere, { status: DB_PUBLISHED }] },
          select: {
            topic: true,
            subtopic: true,
            bodySystem: true,
            countryCode: true,
            labUnitVariant: true,
            medicationNamingVariant: true,
          },
          take: 20000,
        }),
      ]);

    let incompleteLessons = 0;
    const lessonSignals: string[] = [];
    const lessonSignalRows: string[] = [];
    for (const l of lessons) {
      lessonSignals.push(l.topic, l.topicSlug, l.bodySystem, l.title);
      lessonSignalRows.push(`${l.title} ${l.topic} ${l.topicSlug} ${l.bodySystem}`);
      const structural = evaluatePathwayLessonStructuralGate({
        slug: l.slug,
        title: l.title,
        topic: l.topic,
        topicSlug: l.topicSlug,
        bodySystem: l.bodySystem,
        previewSectionCount: 1,
        seoTitle: l.seoTitle,
        seoDescription: l.seoDescription,
        sections: l.sections as PathwayLessonRecord["sections"],
      });
      if (!structural.publicComplete) incompleteLessons += 1;
    }

    const questionSignalsText = questionSignals
      .map((q) => `${q.topic ?? ""} ${q.subtopic ?? ""} ${q.bodySystem ?? ""}`)
      .join(" ");
    const missingCategories = detectMissingCategories([lessonSignals.join(" "), questionSignalsText]);
    const lessonsByCategory = categoryCountsFromSignals(lessonSignalRows);
    const questionsByCategory = categoryCountsFromSignals(
      questionSignals.map((q) => `${q.topic ?? ""} ${q.subtopic ?? ""} ${q.bodySystem ?? ""}`),
    );

    const mismatchedCountryQuestions = questionSignals.filter((q) => {
      const c = (q.countryCode ?? "").toUpperCase();
      if (!c) return false;
      return c !== pathway.countryCode;
    }).length;
    const mixedUnitOrNamingSignals = countMixedLocalizationSignals({
      country: pathway.countryCode,
      rows: questionSignals.map((q) => ({
        labUnitVariant: q.labUnitVariant,
        medicationNamingVariant: q.medicationNamingVariant,
      })),
    });

    const fullLearningLoop =
      lessons.length > 0 &&
      questionCount > 0 &&
      flashcardCount > 0 &&
      (segment === "ALLIED" || catPoolCount > 0);

    const localizationIssueCount = mismatchedCountryQuestions + mixedUnitOrNamingSignals;
    const completenessStatus = statusFromCounts({
      lessons: lessons.length,
      questions: questionCount,
      flashcards: flashcardCount,
      catPool: catPoolCount,
      incompleteLessons,
      missingCategories,
      localizationIssueCount,
      fullLearningLoop,
      thresholds,
    });

    const deficiencies: string[] = [];
    if (lessons.length < thresholds.lessons.minimum) deficiencies.push(`Lessons below minimum (${lessons.length}/${thresholds.lessons.minimum}).`);
    if (questionCount < thresholds.questions.minimum) deficiencies.push(`Questions below minimum (${questionCount}/${thresholds.questions.minimum}).`);
    if (flashcardCount < thresholds.flashcards.minimum) deficiencies.push(`Flashcards below minimum (${flashcardCount}/${thresholds.flashcards.minimum}).`);
    if (thresholds.catPoolMin != null && catPoolCount < thresholds.catPoolMin) {
      deficiencies.push(`CAT pool below minimum (${catPoolCount}/${thresholds.catPoolMin}).`);
    }
    if (incompleteLessons > 0) deficiencies.push(`${incompleteLessons} lessons fail strict structural quality checks.`);
    if (missingCategories.length > 0) deficiencies.push(`Missing major category coverage: ${missingCategories.join(", ")}.`);
    if (localizationIssueCount > 0) deficiencies.push(`Localization standard mismatches detected (${localizationIssueCount} signals).`);
    if (!fullLearningLoop) deficiencies.push("Learning loop incomplete (lessons → flashcards → questions → CAT/recommendations).");

    pathwayRows.push({
      pathwayId: pathway.id,
      displayName: pathway.displayName,
      countryCode: pathway.countryCode,
      roleTrack: pathway.roleTrack,
      segment,
      counts: {
        lessons: lessons.length,
        questions: questionCount,
        flashcards: flashcardCount,
        catPool: catPoolCount,
        incompleteLessons,
      },
      required: thresholds,
      quality: {
        flashcardsDerivedFromQuestions: flashcardsFromQuestions,
        fullLearningLoop,
      },
      categoryCoverage: {
        lessonsByCategory,
        questionsByCategory,
      },
      completenessStatus,
      missingCategories,
      localizationIssues: {
        mismatchedCountryQuestions,
        mixedUnitOrNamingSignals,
        details: [
          mismatchedCountryQuestions > 0
            ? `Question country-code mismatch count: ${mismatchedCountryQuestions}`
            : "No explicit country-code mismatches detected in sampled pathway questions.",
          mixedUnitOrNamingSignals > 0
            ? `Mixed unit/naming variant signals: ${mixedUnitOrNamingSignals}`
            : "No mixed unit/naming variant signals detected in sampled pathway questions.",
        ],
      },
      deficiencies,
    });
  }

  pathwayRows.sort((a, b) => {
    const order = { INSUFFICIENT: 0, PARTIAL: 1, COMPLETE: 2 } as const;
    return order[a.completenessStatus] - order[b.completenessStatus] || a.displayName.localeCompare(b.displayName);
  });

  const [publishedBlogByLocale, localizedLessonByLocale, localizedQuestionByLocale, publishedFlashcards] = includeLanguageAudit
    ? await Promise.all([
    prisma.localizedBlogArticle
      .groupBy({
        by: ["locale"],
        where: { contentStatus: LocalizedBlogStatus.PUBLISHED },
        _count: { _all: true },
      })
      .catch(() => []),
    prisma.pathwayLesson
      .groupBy({
        by: ["locale"],
        where: { status: ContentStatus.PUBLISHED },
        _count: { _all: true },
      })
      .catch(() => []),
    prisma.examQuestion
      .groupBy({
        by: ["languageCode"],
        where: { status: DB_PUBLISHED },
        _count: { _all: true },
      })
      .catch(() => []),
    prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }).catch(() => 0),
    ])
    : [[], [], [], 0];

  const blogMap = new Map(publishedBlogByLocale.map((r) => [r.locale, r._count._all]));
  const lessonLocaleMap = new Map(localizedLessonByLocale.map((r) => [r.locale, r._count._all]));
  const questionLocaleMap = new Map(localizedQuestionByLocale.map((r) => [r.languageCode ?? "en", r._count._all]));
  const englishLessons = lessonLocaleMap.get("en") ?? 0;

  const languageCompleteness: LanguageCompletenessRow[] = includeLanguageAudit ? GLOBAL_LOCALE_CODES.map((locale) => {
    const publishedBlogPosts = blogMap.get(locale) ?? 0;
    const localizedLessons = lessonLocaleMap.get(locale) ?? 0;
    const localizedQuestions = questionLocaleMap.get(locale) ?? 0;
    const navigationReady = hasLocaleNavFile(locale);
    const flashcardsAccessible = publishedFlashcards > 0;
    const usableLessonsOrFallback = localizedLessons > 0 || englishLessons > 0;
    const deficiencies: string[] = [];
    if (!navigationReady) deficiencies.push("Navigation locale file missing.");
    if (publishedBlogPosts < 200) deficiencies.push(`Blog depth below high-end target (${publishedBlogPosts}/200).`);
    if (!usableLessonsOrFallback) deficiencies.push("No usable lessons and no clean fallback.");
    if (localizedQuestions === 0) deficiencies.push("No accessible question bank rows for this language.");
    if (!flashcardsAccessible) deficiencies.push("Flashcards unavailable.");
    const status: CompletenessStatus =
      deficiencies.length === 0 ? "COMPLETE" : deficiencies.length <= 2 ? "PARTIAL" : "INSUFFICIENT";
    return {
      locale,
      navigationReady,
      publishedBlogPosts,
      localizedLessons,
      localizedQuestions,
      flashcardsAccessible,
      usableLessonsOrFallback,
      status,
      deficiencies,
    };
  }) : [];

  const coreRows = pathwayRows.filter((r) => r.segment === "CORE_NURSING");
  const rnRows = coreRows.filter((r) => r.roleTrack === "rn" && (r.countryCode === CountryCode.US || r.countryCode === CountryCode.CA));
  const pnRows = coreRows.filter((r) => r.roleTrack === "lpn" || r.roleTrack === "rpn");
  const alliedRows = pathwayRows.filter((r) => r.segment === "ALLIED");
  const languageExpansionBlocked = includeLanguageAudit
    ? coreRows.some((r) => r.completenessStatus !== "COMPLETE")
    : true;

  const prioritizedRoadmap: string[] = [];
  prioritizedRoadmap.push(
    `1) RN pathways (US + Canada): ${rnRows.filter((r) => r.completenessStatus !== "COMPLETE").length} pathway(s) still below COMPLETE.`,
  );
  prioritizedRoadmap.push(
    `2) PN pathways: ${pnRows.filter((r) => r.completenessStatus !== "COMPLETE").length} pathway(s) still below COMPLETE.`,
  );
  prioritizedRoadmap.push(
    `3) Lesson completion: ${pathwayRows.reduce((sum, r) => sum + r.counts.incompleteLessons, 0)} incomplete lesson(s) flagged by strict structural gate.`,
  );
  prioritizedRoadmap.push(
    `4) Question expansion: ${pathwayRows.filter((r) => r.counts.questions < r.required.questions.highEnd).length} pathway(s) below high-end question target.`,
  );
  prioritizedRoadmap.push(
    `5) Flashcard generation: ${pathwayRows.filter((r) => r.counts.flashcards < r.required.flashcards.highEnd).length} pathway(s) below high-end flashcard target.`,
  );
  prioritizedRoadmap.push(
    `6) Localization fixes: ${pathwayRows.filter((r) => r.localizationIssues.mismatchedCountryQuestions + r.localizationIssues.mixedUnitOrNamingSignals > 0).length} pathway(s) with standard-mix issues.`,
  );
  prioritizedRoadmap.push(
    `7) Allied pathways: ${alliedRows.filter((r) => r.completenessStatus !== "COMPLETE").length} allied pathway(s) still below COMPLETE.`,
  );
  prioritizedRoadmap.push(
    `8) Language expansion: ${languageExpansionBlocked ? "BLOCKED until core pathways are COMPLETE." : "Eligible once language rows are COMPLETE."}`,
  );

  return {
    generatedAt: new Date().toISOString(),
    thresholds: {
      coreNursing: CORE_THRESHOLDS,
      allied: ALLIED_THRESHOLDS,
    },
    pathways: pathwayRows,
    languageCompleteness,
    prioritizedRoadmap,
    languageExpansionBlocked,
  };
}
