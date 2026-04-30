/**
 * Pure catalog lesson normalization + scoped-gold merge (no Prisma, no i18n DB overlays).
 * Split from `pathway-lesson-loader.ts` so CLI audits and tooling can import without the `server-only` graph.
 * Catalog-backed and still heavy enough to keep out of shared layouts, homepage chrome, and nav/header paths.
 */
import { inferExamAudienceFromPathwayId } from "@/lib/lessons/exam-complete-lesson-template";
import { buildLessonInteractiveModules } from "@/lib/lessons/lesson-interactive-modules";
import { deriveLessonHighYieldStudyFields } from "@/lib/lessons/lesson-high-yield-study-fields";
import { resolveLessonContextForPathwayId } from "@/lib/lessons/lesson-region-exam";
import {
  evaluatePathwayLessonStructuralGate,
  lessonUsesPremiumStructure,
  orderPremiumSections,
  PREMIUM_SECTION_KINDS,
  validatePathwayLessonPremium,
} from "@/lib/lessons/pathway-lesson-premium";
import { PATHWAY_CATALOG_LIST_HARD_CAP } from "@/lib/lessons/pathway-lesson-scale";
import {
  type PathwayEmbeddedSoundLibraryId,
  type PathwayLessonAudienceTier,
  type PathwayLessonClinicalPriority,
  type PathwayLessonCountryScope,
  type PathwayLessonExamMeta,
  type PathwayLessonExamRelevance,
  type PathwayLessonFigure,
  type PathwayLessonFigureKind,
  type PathwayLessonOmittedPremiumSection,
  type PathwayLessonPriority,
  type PathwayLessonQuizItem,
  type PathwayLessonRecord,
  type PathwayLessonRelatedRef,
  type PathwayLessonRuntimeCountry,
  type PathwayLessonRuntimeExam,
  type PathwayLessonSection,
  type PathwayLessonSectionKind,
  type PathwayLessonYieldLevel,
} from "@/lib/lessons/pathway-lesson-types";
import { sanitizeEmbeddedSoundLibraries } from "@/lib/lessons/pathway-lesson-sound-libraries";
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import { enrichLegacyFiveBlockSectionsForSubscriberGates } from "@/lib/lessons/pathway-lesson-subscriber-completeness";
import { pathwayLessonYieldWeight } from "@/lib/lessons/pathway-lesson-yield";
import { stripPathwayLessonToHubListShape } from "@/lib/lessons/pathway-lesson-hub-list-shape";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import { hydratePremiumCatalogSectionsForMarketingGate } from "@/lib/lessons/scoped-lessons/gold-premium-synthesis";
import { prependScopedGoldCatalogLessons } from "@/lib/lessons/scoped-lessons/scoped-gold-registry";
import {
  normalizeLessonCategory,
  premiumizeLessonDisplayTitle,
  type LessonCategory,
} from "@/lib/lessons/lesson-taxonomy";
import { lessonsPerfMark } from "@/lib/lessons/lessons-perf";
import {
  clearGeneratedPathwayLessonIndexCacheForTests,
  getOptionalGeneratedPathwayLessonIndex,
  type PathwayLessonGeneratedIndexFileV1,
} from "@/lib/lessons/pathway-lesson-generated-index";

type CatalogShape = {
  version: number;
  pathways: Record<
    string,
    {
      lessons: Array<{
        slug: string;
        /**
         * Canonical public display title in bundled catalog JSON. Generated inventory/taxonomy scripts
         * must preserve curated values; user-facing resolvers only use generated or slug fallback when
         * this title is missing or unsafe.
         */
        title: string;
        topic: string;
        topicSlug: string;
        system?: string;
        bodySystem: string;
        previewSectionCount: number;
        seoTitle: string;
        seoDescription: string;
        sections: PathwayLessonRecord["sections"];
        preTestQuestionIds?: string[];
        postTestQuestionIds?: string[];
        preTest?: PathwayLessonQuizItem[];
        postTest?: PathwayLessonQuizItem[];
        premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
        relatedLessonRefs?: PathwayLessonRelatedRef[];
        studyTakeaways?: string[];
        studyCommonTraps?: string[];
        memoryAnchor?: string;
        audienceTiers?: PathwayLessonAudienceTier[];
        countryScope?: PathwayLessonCountryScope;
        examRelevance?: PathwayLessonExamRelevance;
        exams?: PathwayLessonRuntimeExam[];
        countries?: PathwayLessonRuntimeCountry[];
        priority?: PathwayLessonPriority;
        examMeta?: PathwayLessonExamMeta[];
        embeddedSoundLibraries?: PathwayEmbeddedSoundLibraryId[];
      }>;
    }
  >;
};

let catalogDataCache: CatalogShape | null = null;
let alliedBundledPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
let rnCardiovascularExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null =
  null;
let rnNeurologicalExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null =
  null;
let rnHematologyOncologyExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null =
  null;
let rnGastrointestinalExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null =
  null;
let rnIntegumentaryWoundCareExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null =
  null;
let rnInfectionControlExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
let rnLeadershipDelegationExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
let rnMaternalNewbornExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN Procedures & Skills expansion (merged after maternal & newborn expansion). */
let rnProceduresSkillsExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN nutrition expansion (merged after procedures & skills expansion; deduped by slug). */
let rnNutritionExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN Exam Strategy expansion (merged after nutrition expansion; deduped by slug). */
let rnExamStrategyExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN respiratory expansion (merged after exam strategy expansion; deduped by slug). */
let rnRespiratoryExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN renal & urinary expansion (merged after respiratory expansion; deduped by slug). */
let rnRenalExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN endocrine expansion (merged after renal expansion; deduped by slug). */
let rnEndocrineExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN musculoskeletal expansion (merged after endocrine expansion; deduped by slug). */
let rnMusculoskeletalExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN fluids, electrolytes & acid-base expansion (merged after musculoskeletal expansion; deduped by slug). */
let rnFluidsElectrolytesExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN exam-notes integration spine (merged after fluids expansion; deduped by slug). */
let rnExamNotesIntegrationExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
/** RN NCLEX-RN exam-notes integration batch 3 (merged after batch 1; deduped by slug). */
let rnExamNotesIntegrationBatch3ExpansionPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
let newGradTransitionPathwaysCache: Record<string, { lessons?: CatalogShape["pathways"][string]["lessons"] }> | null = null;

function getCatalogData(): CatalogShape {
  if (catalogDataCache) return catalogDataCache;
  lessonsPerfMark("catalog_build_start", { scope: "bundled_catalog_json" });
  catalogDataCache = require("@/content/pathway-lessons/catalog.json") as CatalogShape;
  lessonsPerfMark("catalog_build_end", { scope: "bundled_catalog_json" });
  const pathwayCount = Object.keys(catalogDataCache.pathways ?? {}).length;
  const lessonRows = Object.values(catalogDataCache.pathways ?? {}).reduce(
    (n, p) => n + (Array.isArray(p.lessons) ? p.lessons.length : 0),
    0,
  );
  lessonsPerfMark("catalog_size", { scope: "bundled_catalog_json", pathwayKeys: pathwayCount, lessonRows });
  return catalogDataCache;
}

function getAlliedBundledPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (alliedBundledPathwaysCache) return alliedBundledPathwaysCache;
  alliedBundledPathwaysCache =
    (require("@/content/pathway-lessons/allied-bundled-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return alliedBundledPathwaysCache;
}

/** RN NCLEX-RN cardiovascular expansion rows (merged after main catalog + allied; deduped by slug). */
function getRnCardiovascularExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnCardiovascularExpansionPathwaysCache) return rnCardiovascularExpansionPathwaysCache;
  rnCardiovascularExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-cardiovascular-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnCardiovascularExpansionPathwaysCache;
}

function rnCardiovascularExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnCardiovascularExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

/** RN NCLEX-RN neurological expansion rows (merged after cardio expansion; deduped by slug). */
function getRnNeurologicalExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnNeurologicalExpansionPathwaysCache) return rnNeurologicalExpansionPathwaysCache;
  rnNeurologicalExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-neurological-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnNeurologicalExpansionPathwaysCache;
}

function rnNeurologicalExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnNeurologicalExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

/** RN NCLEX-RN hematology & oncology expansion rows (merged after neuro expansion; deduped by slug). */
function getRnHematologyOncologyExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnHematologyOncologyExpansionPathwaysCache) return rnHematologyOncologyExpansionPathwaysCache;
  rnHematologyOncologyExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-hematology-oncology-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnHematologyOncologyExpansionPathwaysCache;
}

function rnHematologyOncologyExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnHematologyOncologyExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

/** RN NCLEX-RN gastrointestinal expansion rows (merged after hem/onc expansion; deduped by slug). */
function getRnGastrointestinalExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnGastrointestinalExpansionPathwaysCache) return rnGastrointestinalExpansionPathwaysCache;
  rnGastrointestinalExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-gastrointestinal-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnGastrointestinalExpansionPathwaysCache;
}

function rnGastrointestinalExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnGastrointestinalExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

/** RN NCLEX-RN integumentary & wound care expansion rows (merged after GI expansion; deduped by slug). */
function getRnIntegumentaryWoundCareExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnIntegumentaryWoundCareExpansionPathwaysCache) return rnIntegumentaryWoundCareExpansionPathwaysCache;
  rnIntegumentaryWoundCareExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-integumentary-wound-care-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnIntegumentaryWoundCareExpansionPathwaysCache;
}

function rnIntegumentaryWoundCareExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnIntegumentaryWoundCareExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

/** RN NCLEX-RN infection control expansion rows (merged after integumentary expansion; deduped by slug). */
function getRnInfectionControlExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnInfectionControlExpansionPathwaysCache) return rnInfectionControlExpansionPathwaysCache;
  rnInfectionControlExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-infection-control-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnInfectionControlExpansionPathwaysCache;
}

function rnInfectionControlExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnInfectionControlExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

/** RN NCLEX-RN leadership & delegation expansion rows (merged after infection control expansion; deduped by slug). */
function getRnLeadershipDelegationExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnLeadershipDelegationExpansionPathwaysCache) return rnLeadershipDelegationExpansionPathwaysCache;
  rnLeadershipDelegationExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-leadership-delegation-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnLeadershipDelegationExpansionPathwaysCache;
}

function rnLeadershipDelegationExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnLeadershipDelegationExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

/** RN NCLEX-RN maternal & newborn expansion rows (merged after leadership expansion; deduped by slug). */
function getRnMaternalNewbornExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnMaternalNewbornExpansionPathwaysCache) return rnMaternalNewbornExpansionPathwaysCache;
  rnMaternalNewbornExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-maternal-newborn-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnMaternalNewbornExpansionPathwaysCache;
}

function rnMaternalNewbornExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnMaternalNewbornExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function getRnProceduresSkillsExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnProceduresSkillsExpansionPathwaysCache) return rnProceduresSkillsExpansionPathwaysCache;
  rnProceduresSkillsExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-procedures-skills-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnProceduresSkillsExpansionPathwaysCache;
}

function rnProceduresSkillsExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnProceduresSkillsExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

/** RN NCLEX-RN nutrition expansion rows (merged after procedures & skills expansion; deduped by slug). */
function getRnNutritionExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnNutritionExpansionPathwaysCache) return rnNutritionExpansionPathwaysCache;
  rnNutritionExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-nutrition-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnNutritionExpansionPathwaysCache;
}

function rnNutritionExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnNutritionExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function getRnExamStrategyExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnExamStrategyExpansionPathwaysCache) return rnExamStrategyExpansionPathwaysCache;
  rnExamStrategyExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-exam-strategy-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnExamStrategyExpansionPathwaysCache;
}

function rnExamStrategyExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnExamStrategyExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function getRnRespiratoryExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnRespiratoryExpansionPathwaysCache) return rnRespiratoryExpansionPathwaysCache;
  rnRespiratoryExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-respiratory-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnRespiratoryExpansionPathwaysCache;
}

function rnRespiratoryExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnRespiratoryExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function getRnRenalExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnRenalExpansionPathwaysCache) return rnRenalExpansionPathwaysCache;
  rnRenalExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-renal-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnRenalExpansionPathwaysCache;
}

function rnRenalExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnRenalExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function getRnEndocrineExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnEndocrineExpansionPathwaysCache) return rnEndocrineExpansionPathwaysCache;
  rnEndocrineExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-endocrine-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnEndocrineExpansionPathwaysCache;
}

function rnEndocrineExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnEndocrineExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function getRnMusculoskeletalExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnMusculoskeletalExpansionPathwaysCache) return rnMusculoskeletalExpansionPathwaysCache;
  rnMusculoskeletalExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-musculoskeletal-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnMusculoskeletalExpansionPathwaysCache;
}

function rnMusculoskeletalExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnMusculoskeletalExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function getRnFluidsElectrolytesExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnFluidsElectrolytesExpansionPathwaysCache) return rnFluidsElectrolytesExpansionPathwaysCache;
  rnFluidsElectrolytesExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-fluids-electrolytes-expansion-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnFluidsElectrolytesExpansionPathwaysCache;
}

function rnFluidsElectrolytesExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnFluidsElectrolytesExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function getRnExamNotesIntegrationExpansionPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (rnExamNotesIntegrationExpansionPathwaysCache) return rnExamNotesIntegrationExpansionPathwaysCache;
  rnExamNotesIntegrationExpansionPathwaysCache =
    (require("@/content/pathway-lessons/rn-nclex-exam-notes-integration-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return rnExamNotesIntegrationExpansionPathwaysCache;
}

function rnExamNotesIntegrationExpansionLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getRnExamNotesIntegrationExpansionPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function getNewGradTransitionPathways(): Record<string, { lessons?: CatalogShape["pathways"][string]["lessons"] }> {
  if (newGradTransitionPathwaysCache) return newGradTransitionPathwaysCache;
  newGradTransitionPathwaysCache =
    (require("@/content/pathway-lessons/new-grad-transition-catalog.json") as {
      pathways?: Record<string, { lessons?: CatalogShape["pathways"][string]["lessons"] }>;
    }).pathways ?? {};
  return newGradTransitionPathwaysCache;
}

function alliedBundledLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getAlliedBundledPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function newGradTransitionLessonsForPathway(pathwayId: string): LessonInput[] {
  const bucket = getNewGradTransitionPathways()[pathwayId];
  const rows = bucket?.lessons;
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

export type LessonInput = CatalogShape["pathways"][string]["lessons"][number];

export type PathwayLessonSummaryIndexRow = {
  id: string;
  slug: string;
  title: string;
  category: LessonCategory;
  shortDescription: string;
};

/** Merged raw catalog rows per pathway (lesson-library + expansions); avoids O(n) rebuild per slug lookup. */
const catalogLessonsRawByPathwayIdCache = new Map<string, LessonInput[]>();

/** Full {@link normalizeLesson} results per pathway — built once per process (hub + detail reuse). */
const pathwayNormalizedCatalogRows = new Map<string, PathwayLessonRecord[]>();
/** Slug → normalized lesson for O(1) detail/catalog reads. */
const pathwayNormalizedLessonBySlug = new Map<string, Map<string, PathwayLessonRecord>>();
/** Slug → raw merged JSON row (no normalize) for loaders that overlay DB onto catalog input. */
const pathwayCatalogRawBySlug = new Map<string, Map<string, LessonInput>>();
/**
 * Lowercased slugs that appear on the marketing hub after the same filters as
 * {@link sortAndFilterLessonsForPathwayContext} (used for dynamic segment resolution without scanning the list).
 */
const marketingEffectiveCatalogSlugSetByPathway = new Map<string, Set<string>>();
/** Hub-effective list with bodies stripped — reused by marketing category helpers. */
const effectiveHubCatalogLessonsByPathway = new Map<string, PathwayLessonRecord[]>();
/** Memoized {@link getLessonSummariesIndex} rows per pathway (process lifetime). */
const lessonSummariesIndexByPathway = new Map<string, PathwayLessonSummaryIndexRow[]>();
/**
 * Parsed optional disk index after a cheap trust check against merged raw slugs.
 * `null` value means "computed: no trusted disk index for this pathway".
 */
const trustedGeneratedLessonIndexByPathway = new Map<string, PathwayLessonGeneratedIndexFileV1 | null>();

/** Test-only: clear merged catalog slice cache and derived normalized indexes. */
export function resetCatalogLessonsRawMergeCacheForTests(): void {
  catalogLessonsRawByPathwayIdCache.clear();
  pathwayNormalizedCatalogRows.clear();
  pathwayNormalizedLessonBySlug.clear();
  pathwayCatalogRawBySlug.clear();
  marketingEffectiveCatalogSlugSetByPathway.clear();
  effectiveHubCatalogLessonsByPathway.clear();
  lessonSummariesIndexByPathway.clear();
  trustedGeneratedLessonIndexByPathway.clear();
  clearGeneratedPathwayLessonIndexCacheForTests();
}

/**
 * True when optional `generated-indexes/{pathwayId}.json` matches current merged raw catalog slugs
 * (cheap check — does not prove marketing filter parity; use `npm run verify:lesson-indexes` for that).
 */
function isTrustedGeneratedLessonIndex(pathwayId: string, idx: PathwayLessonGeneratedIndexFileV1): boolean {
  const key = pathwayId.trim();
  const raw = getCatalogLessonsRaw(key);
  if (idx.mergedRawLessonCount !== raw.length) return false;
  const rawSlugs = new Set<string>();
  for (const r of raw) {
    const s = typeof r.slug === "string" ? r.slug.trim() : "";
    if (s) rawSlugs.add(s);
  }
  for (const row of idx.summaries) {
    if (!rawSlugs.has(row.slug)) return false;
  }
  return true;
}

function tryTrustedGeneratedLessonIndex(pathwayId: string): PathwayLessonGeneratedIndexFileV1 | null {
  const key = pathwayId.trim();
  if (trustedGeneratedLessonIndexByPathway.has(key)) {
    return trustedGeneratedLessonIndexByPathway.get(key) ?? null;
  }
  const idx = getOptionalGeneratedPathwayLessonIndex(key);
  if (!idx || !isTrustedGeneratedLessonIndex(pathwayId, idx)) {
    trustedGeneratedLessonIndexByPathway.set(key, null);
    return null;
  }
  trustedGeneratedLessonIndexByPathway.set(key, idx);
  return idx;
}

function ensurePathwayCatalogIndexes(pathwayId: string): void {
  const key = pathwayId.trim();
  if (pathwayNormalizedCatalogRows.has(key)) return;
  lessonsPerfMark("catalog_build_start", { scope: "normalized_pathway_catalog", pathwayId: key });
  const rawList = getCatalogLessonsRaw(key);
  const normRows: PathwayLessonRecord[] = [];
  const normBySlug = new Map<string, PathwayLessonRecord>();
  const rawBySlug = new Map<string, LessonInput>();
  for (const raw of rawList) {
    const slugKey = typeof raw.slug === "string" ? raw.slug.trim() : "";
    if (!slugKey) continue;
    rawBySlug.set(slugKey, raw);
    const norm = normalizeLesson(raw, key);
    normRows.push(norm);
    normBySlug.set(slugKey, norm);
  }
  pathwayNormalizedCatalogRows.set(key, normRows);
  pathwayNormalizedLessonBySlug.set(key, normBySlug);
  pathwayCatalogRawBySlug.set(key, rawBySlug);
  lessonsPerfMark("catalog_build_end", { scope: "normalized_pathway_catalog", pathwayId: key, count: normRows.length });
  lessonsPerfMark("catalog_size", { scope: "normalized_pathway_catalog", pathwayId: key, count: normRows.length });
}

/** Raw merged catalog row for `slug` when present (no normalize). */
export function getCatalogLessonRawBySlug(pathwayId: string, slug: string): LessonInput | undefined {
  const key = pathwayId.trim();
  ensurePathwayCatalogIndexes(key);
  return pathwayCatalogRawBySlug.get(key)?.get(slug.trim());
}

/**
 * Normalized bundled lesson for `slug` when present — O(1) after first pathway catalog build.
 * Does not apply DB overlays; use {@link getPathwayLesson} for marketing detail.
 */
export function getLessonBySlug(pathwayId: string, slug: string): PathwayLessonRecord | undefined {
  const key = pathwayId.trim();
  ensurePathwayCatalogIndexes(key);
  return pathwayNormalizedLessonBySlug.get(key)?.get(slug.trim());
}

/** Curated display title from the bundled normalized catalog (hub card title parity). */
export function getCatalogPathwayLessonDisplayTitleForSlug(pathwayId: string, slug: string): string | undefined {
  const key = pathwayId.trim();
  const s = slug.trim();
  const trusted = tryTrustedGeneratedLessonIndex(key);
  if (trusted) {
    const t = trusted.slugToDisplayTitle[s];
    if (typeof t === "string" && t.trim()) return t.trim();
  }
  return getLessonBySlug(pathwayId, s)?.title;
}

const CANONICAL_ORDER: PathwayLessonSectionKind[] = [
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
];

const premiumSectionKindSet = new Set<string>(PREMIUM_SECTION_KINDS as readonly string[]);

/** Premium spine in canonical order; non-premium sections (e.g. exam_focus) append after. */
function finalizePremiumSections(sections: PathwayLessonSection[]): PathwayLessonSection[] {
  const ordered = orderPremiumSections(sections);
  const extras = sections.filter((s) => !premiumSectionKindSet.has(s.kind));
  return [...ordered, ...extras];
}

function hasAllCanonicalKinds(sections: PathwayLessonSection[]): boolean {
  return CANONICAL_ORDER.every((k) => sections.some((s) => s.kind === k));
}

function sanitizeSectionBody(body: unknown): string {
  if (typeof body !== "string") return "";
  return body.trim();
}

function sanitizeFigureKind(raw: unknown): PathwayLessonFigureKind | undefined {
  if (typeof raw !== "string") return undefined;
  const k = raw.trim() as PathwayLessonFigureKind;
  const allowed: PathwayLessonFigureKind[] = [
    "diagram",
    "chart",
    "anatomy",
    "flowchart",
    "clinical_reference",
    "other",
  ];
  return allowed.includes(k) ? k : "other";
}

function sanitizeFigures(raw: unknown): PathwayLessonFigure[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const out: PathwayLessonFigure[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const item = raw[i];
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const url = typeof o.url === "string" ? o.url.trim() : "";
    if (!url.startsWith("https://")) continue;
    const alt = typeof o.alt === "string" && o.alt.trim().length > 0 ? o.alt.trim() : "Lesson figure";
    const caption = typeof o.caption === "string" && o.caption.trim() ? o.caption.trim() : undefined;
    const attribution = typeof o.attribution === "string" && o.attribution.trim() ? o.attribution.trim() : undefined;
    const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : `figure-${i}`;
    const kind = sanitizeFigureKind(o.kind);
    out.push({ id, url, alt, caption, kind, attribution });
  }
  return out.length ? out : undefined;
}

function mergeFigures(...buckets: Array<PathwayLessonFigure[] | undefined>): PathwayLessonFigure[] | undefined {
  const merged: PathwayLessonFigure[] = [];
  const seen = new Set<string>();
  for (const b of buckets) {
    if (!b?.length) continue;
    for (const f of b) {
      const key = `${f.url}:${f.alt}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(f);
    }
  }
  return merged.length ? merged : undefined;
}

function sanitizeSection(raw: Partial<PathwayLessonSection>, index: number): PathwayLessonSection {
  const kind = (raw.kind ?? "intro") as PathwayLessonSectionKind;
  const heading = typeof raw.heading === "string" && raw.heading.trim().length > 0 ? raw.heading.trim() : "Section";
  const id = typeof raw.id === "string" && raw.id.trim().length > 0 ? raw.id : `${kind}-${index}`;
  const figures = sanitizeFigures(raw.figures);
  return {
    id,
    heading,
    kind,
    body: sanitizeSectionBody(raw.body),
    ...(figures ? { figures } : {}),
  };
}

function sanitizeIncomingSections(sections: unknown): PathwayLessonSection[] {
  if (!Array.isArray(sections)) return [];
  return sections.map((s, i) => sanitizeSection(s as Partial<PathwayLessonSection>, i));
}

function sanitizeAudienceTiers(raw: unknown): PathwayLessonAudienceTier[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonAudienceTier[] = [];
  for (const x of raw) {
    if (x === "rn" || x === "pn" || x === "np") out.push(x);
  }
  return out.length ? [...new Set(out)] : undefined;
}

function sanitizeCountryScope(raw: unknown): PathwayLessonCountryScope | undefined {
  if (raw === "us" || raw === "ca" || raw === "both") return raw;
  return undefined;
}

function sanitizeExamRelevance(raw: unknown): PathwayLessonExamRelevance | undefined {
  if (raw === "high_yield" || raw === "core" || raw === "specialty") return raw;
  return undefined;
}

function sanitizeRuntimeExam(raw: unknown): PathwayLessonRuntimeExam | undefined {
  if (raw === "REX_PN" || raw === "NCLEX_PN" || raw === "NCLEX_RN" || raw === "NP" || raw === "ALLIED" || raw === "NCLEX") return raw;
  if (typeof raw === "string") {
    const compact = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    /** Authoring / DB strings outside the strict runtime union — normalize to `NP` for filtering + overlays. */
    if (
      compact === "CNPLE" ||
      compact === "CANNP" ||
      compact === "FNP" ||
      compact === "AGPCNP" ||
      compact === "PMHNP"
    ) {
      return "NP";
    }
  }
  return undefined;
}

function sanitizeRuntimeCountry(raw: unknown): PathwayLessonRuntimeCountry | undefined {
  if (raw === "CA" || raw === "US" || raw === "GLOBAL") return raw;
  return undefined;
}

function sanitizeRuntimePriority(raw: unknown): PathwayLessonPriority | undefined {
  if (raw === "high" || raw === "medium" || raw === "low") return raw;
  return undefined;
}

function sanitizeYieldLevel(raw: unknown): PathwayLessonYieldLevel | undefined {
  if (raw === "must_know" || raw === "common" || raw === "advanced" || raw === "rare") return raw;
  return undefined;
}

function sanitizeClinicalPriority(raw: unknown): PathwayLessonClinicalPriority | undefined {
  if (raw === "urgent" || raw === "routine" || raw === "foundational") return raw;
  return undefined;
}

function sanitizeRuntimeExams(raw: unknown): PathwayLessonRuntimeExam[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonRuntimeExam[] = [];
  for (const x of raw) {
    const val = sanitizeRuntimeExam(x);
    if (val) out.push(val);
  }
  return out.length ? [...new Set(out)] : undefined;
}

function sanitizeRuntimeCountries(raw: unknown): PathwayLessonRuntimeCountry[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonRuntimeCountry[] = [];
  for (const x of raw) {
    const val = sanitizeRuntimeCountry(x);
    if (val) out.push(val);
  }
  return out.length ? [...new Set(out)] : undefined;
}

function sanitizeExamMeta(raw: unknown): PathwayLessonExamMeta[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonExamMeta[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const exam = sanitizeRuntimeExam(rec.exam);
    const yieldLevel = sanitizeYieldLevel(rec.yieldLevel);
    if (!exam || !yieldLevel) continue;
    const clinicalPriority = sanitizeClinicalPriority(rec.clinicalPriority);
    out.push({
      exam,
      yieldLevel,
      ...(clinicalPriority ? { clinicalPriority } : {}),
    });
  }
  if (out.length === 0) return undefined;
  const deduped = new Map<PathwayLessonRuntimeExam, PathwayLessonExamMeta>();
  for (const entry of out) {
    if (!deduped.has(entry.exam)) deduped.set(entry.exam, entry);
  }
  return [...deduped.values()];
}

function yieldFromPriority(priority: PathwayLessonPriority): PathwayLessonYieldLevel {
  if (priority === "high") return "must_know";
  if (priority === "low") return "advanced";
  return "common";
}

function lessonMetadataFields(raw: LessonInput): Pick<
  PathwayLessonRecord,
  "audienceTiers" | "countryScope" | "examRelevance" | "exams" | "countries" | "priority" | "examMeta"
> {
  const audienceTiers = sanitizeAudienceTiers((raw as { audienceTiers?: unknown }).audienceTiers);
  const countryScope = sanitizeCountryScope((raw as { countryScope?: unknown }).countryScope);
  const examRelevance = sanitizeExamRelevance((raw as { examRelevance?: unknown }).examRelevance);
  const exams = sanitizeRuntimeExams((raw as { exams?: unknown }).exams);
  const countries = sanitizeRuntimeCountries((raw as { countries?: unknown }).countries);
  const priority = sanitizeRuntimePriority((raw as { priority?: unknown }).priority);
  const examMeta = sanitizeExamMeta((raw as { examMeta?: unknown }).examMeta);
  return {
    ...(audienceTiers?.length ? { audienceTiers } : {}),
    ...(countryScope ? { countryScope } : {}),
    ...(examRelevance ? { examRelevance } : {}),
    ...(exams?.length ? { exams } : {}),
    ...(countries?.length ? { countries } : {}),
    ...(priority ? { priority } : {}),
    ...(examMeta?.length ? { examMeta } : {}),
  };
}

function mergeLessonAudienceMetadata(
  raw: LessonInput,
  pathwayId?: string,
): Pick<
  PathwayLessonRecord,
  "audienceTiers" | "countryScope" | "examRelevance" | "exams" | "countries" | "priority" | "examMeta"
> {
  const explicit = lessonMetadataFields(raw);
  if (!pathwayId) return explicit;
  const inferred = inferExamAudienceFromPathwayId(pathwayId);
  const context = resolveLessonContextForPathwayId(pathwayId);
  const audienceTiers = explicit.audienceTiers?.length ? explicit.audienceTiers : inferred.audienceTiers;
  const countryScope = explicit.countryScope ?? inferred.countryScope;
  const priority = explicit.priority ?? "medium";
  const exams = explicit.exams?.length ? explicit.exams : [context.exam];
  /**
   * Hub + detail filtering use {@link matchesLessonContext} against the pathway implied by `pathwayId`.
   * Rows are always published under a concrete `pathwayId`; that membership is the authoritative scope.
   * Legacy imports often stamp `countries: ["US"]` on shared NCLEX bodies attached to `ca-*` pathways,
   * which would incorrectly hide them on Canada hubs. Union the pathway's implied country whenever
   * metadata is region-specific but not explicitly global. (Explicit `GLOBAL` remains worldwide-only.)
   */
  let countries: PathwayLessonRuntimeCountry[];
  if (!explicit.countries?.length) {
    countries = [context.country];
  } else {
    const unique = new Set<PathwayLessonRuntimeCountry>(explicit.countries);
    if (!unique.has("GLOBAL")) {
      unique.add(context.country);
    }
    countries = [...unique];
  }
  const examMeta = explicit.examMeta?.length
    ? explicit.examMeta
    : [
        {
          exam: context.exam,
          yieldLevel: yieldFromPriority(priority),
        },
      ];
  return {
    audienceTiers,
    countryScope,
    ...(explicit.examRelevance ? { examRelevance: explicit.examRelevance } : {}),
    exams,
    countries,
    priority,
    examMeta,
  };
}

function expandToStandardFiveSections(sections: PathwayLessonSection[]): PathwayLessonSection[] {
  const cleaned = sanitizeIncomingSections(sections);

  if (cleaned.length >= 5 && hasAllCanonicalKinds(cleaned)) {
    const ordered = CANONICAL_ORDER.map((k) => cleaned.find((s) => s.kind === k)).filter(
      (s): s is PathwayLessonSection => Boolean(s),
    );
    if (ordered.length === 5) {
      return ordered.map((s) => ({
        ...s,
        body: s.body || defaultBodyFor(s.kind),
        ...(s.figures ? { figures: s.figures } : {}),
      }));
    }
  }

  const byKind = Object.fromEntries(cleaned.map((s) => [s.kind, s])) as Partial<
    Record<PathwayLessonSectionKind, PathwayLessonSection>
  >;

  const intro = byKind.intro ?? byKind.clinical_meaning ?? byKind.introduction;
  const core = byKind.core ?? byKind.core_concept ?? byKind.pathophysiology_overview;
  const clinical =
    byKind.clinical_application ??
    byKind.clinical_scenario ??
    byKind.nursing_assessment_interventions ??
    byKind.signs_symptoms;
  const exam = byKind.exam_tips ?? byKind.exam_relevance ?? byKind.labs_diagnostics;
  const explicitTakeaways =
    byKind.takeaways ??
    (byKind.clinical_pearls
      ? {
          id: `${byKind.clinical_pearls.id}-takeaways`,
          heading: "Key takeaways",
          kind: "takeaways" as const,
          body: byKind.clinical_pearls.body ?? "",
          ...(byKind.clinical_pearls.figures ? { figures: byKind.clinical_pearls.figures } : {}),
        }
      : undefined);

  const examBody = (exam?.body ?? "").trim();
  const sentences = examBody.split(/(?<=[.!?])\s+/).filter(Boolean);
  const examRelevanceBody =
    sentences.length > 1
      ? sentences.slice(0, Math.min(2, sentences.length)).join(" ")
      : examBody.length > 0
        ? `${examBody} Boards reward judgment, pacing, and elimination over memorizing isolated facts.`
        : "Examiners use these topics to test whether you can prioritize, sequence safely, and justify your next action.";

  const takeawaysBody =
    explicitTakeaways?.body?.trim() ||
    (sentences.length > 2
      ? sentences.slice(2).join(" ")
      : "Before your next question block, restate one rule you will not violate on prioritization or scope.");

  const figClinical = mergeFigures(intro?.figures);
  const figExam = mergeFigures(exam?.figures);
  const figCore = mergeFigures(core?.figures);
  const figScenario = mergeFigures(clinical?.figures);
  const figTakeaways = mergeFigures(explicitTakeaways?.figures);

  return [
    {
      id: "clinical_meaning",
      heading: "What this means clinically",
      kind: "clinical_meaning",
      body:
        intro?.body?.trim() ||
        "Read the stem as a safety and prioritization problem first, then match your action to the risk you can justify.",
      ...(figClinical ? { figures: figClinical } : {}),
    },
    {
      id: "exam_relevance",
      heading: "Why this appears on exams",
      kind: "exam_relevance",
      body: examRelevanceBody,
      ...(figExam ? { figures: figExam } : {}),
    },
    {
      id: "core_concept",
      heading: "Core concept explanation",
      kind: "core_concept",
      body:
        core?.body?.trim() ||
        "Anchor pathophysiology to assessment findings, then tie interventions to monitoring and escalation rules.",
      ...(figCore ? { figures: figCore } : {}),
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario example",
      kind: "clinical_scenario",
      body:
        clinical?.body?.trim() ||
        "Picture one client whose data forces a fork: stable monitoring versus urgent escalation. Choose the branch the stem supports.",
      ...(figScenario ? { figures: figScenario } : {}),
    },
    {
      id: "takeaways",
      heading: "Key takeaways",
      kind: "takeaways",
      body: takeawaysBody,
      ...(figTakeaways ? { figures: figTakeaways } : {}),
    },
  ];
}

function defaultBodyFor(kind: PathwayLessonSectionKind): string {
  switch (kind) {
    case "clinical_meaning":
      return "Read the stem as a safety and prioritization problem first, then match your action to the risk you can justify.";
    case "exam_relevance":
      return "Examiners use these topics to test whether you can prioritize, sequence safely, and justify your next action.";
    case "core_concept":
      return "Anchor pathophysiology to assessment findings, then tie interventions to monitoring and escalation rules.";
    case "clinical_scenario":
      return "Picture one client whose data forces a fork: stable monitoring versus urgent escalation. Choose the branch the stem supports.";
    case "takeaways":
      return "Before your next question block, restate one rule you will not violate on prioritization or scope.";
    default:
      return "";
  }
}
function isNursingCoreRuntimeExam(exam: PathwayLessonRuntimeExam): boolean {
  return exam === "NCLEX" || exam === "NCLEX_RN" || exam === "NCLEX_PN";
}

/**
 * NP marketing hubs (`*-np-*`) often ship lessons authored with NCLEX-RN/PN tags only; `pathway_id` is the
 * canonical publish scope — treat core nursing exam tags as compatible with NP **only** when the hub context is NP.
 */
function npHubContextMatchesLegacyNursingExamTags(
  context: { exam: PathwayLessonRuntimeExam; country: PathwayLessonRuntimeCountry },
  exams: PathwayLessonRuntimeExam[],
  examMeta: PathwayLessonExamMeta[],
): boolean {
  if (context.exam !== "NP") return false;
  const metaAllows =
    examMeta.length === 0 ||
    examMeta.some((e) => e.exam === "NP" || isNursingCoreRuntimeExam(e.exam));
  const examsAllow =
    exams.length === 0 ||
    exams.includes("NP") ||
    exams.some((e) => isNursingCoreRuntimeExam(e));
  return metaAllows && examsAllow;
}

/**
 * NCLEX-RN items are often authored with a single US or CA stamp even when `pathway_id` already scopes the row
 * to the sibling North American hub — treat mutually visible US/CA/GLOBAL-only tags as pathway-safe for RN.
 *
 * **Restricted to canonical RN NCLEX-RN pathway ids** (`*-rn-nclex-rn`): do not relax country matching for
 * PN/Rex-PN, NP, new-grad transition, or other hubs that still need strict stamps.
 */
function nclexRnNorthAmericaPeerCountryAllow(
  pathwayId: string,
  context: { exam: PathwayLessonRuntimeExam; country: PathwayLessonRuntimeCountry },
  countries: PathwayLessonRuntimeCountry[],
): boolean {
  if (!pathwayId.includes("-rn-nclex-rn")) return false;
  if (context.exam !== "NCLEX_RN" || countries.length === 0) return false;
  return countries.every((c) => c === "US" || c === "CA" || c === "GLOBAL");
}

function matchesLessonContext(
  pathwayId: string,
  lesson: PathwayLessonRecord,
  context: { exam: PathwayLessonRuntimeExam; country: PathwayLessonRuntimeCountry },
): boolean {
  const examMeta = lesson.examMeta ?? [];
  const exams = lesson.exams ?? [];
  const countries = lesson.countries ?? [];
  const examMetaMatch =
    examMeta.length === 0 ||
    examMeta.some(
      (entry) =>
        entry.exam === context.exam ||
        (entry.exam === "NCLEX" && (context.exam === "NCLEX_PN" || context.exam === "NCLEX_RN")) ||
        (context.exam === "NP" && isNursingCoreRuntimeExam(entry.exam)),
    );
  const examMatch =
    (examMetaMatch &&
      (exams.length === 0 ||
        exams.includes(context.exam) ||
        (exams.includes("NCLEX") && (context.exam === "NCLEX_PN" || context.exam === "NCLEX_RN")))) ||
    npHubContextMatchesLegacyNursingExamTags(context, exams, examMeta);
  const countryMatch =
    countries.length === 0 ||
    countries.includes(context.country) ||
    countries.includes("GLOBAL") ||
    nclexRnNorthAmericaPeerCountryAllow(pathwayId, context, countries);
  return examMatch && countryMatch;
}

/** Aggregated drop reasons when {@link sortAndFilterLessonsForPathwayContext} removes rows (hub diagnostics). */
export function summarizePathwayContextPipelineDrops(
  pathwayId: string,
  before: readonly PathwayLessonRecord[],
  after: readonly PathwayLessonRecord[],
): { droppedTotal: number; reasons: Record<string, number> } {
  const kept = new Set(after.map((l) => l.slug.trim()));
  const dropped = before.filter((l) => !kept.has(l.slug.trim()));
  const reasons: Record<string, number> = {};
  for (const l of dropped) {
    let r = "unknown";
    if (!pathwayLessonEligibleForPublicMarketingSurface(l)) r = "not_public_complete";
    else if (!matchesLessonContext(pathwayId, l, resolveLessonContextForPathwayId(pathwayId)))
      r = "exam_country_context_mismatch";
    reasons[r] = (reasons[r] ?? 0) + 1;
  }
  return { droppedTotal: dropped.length, reasons };
}

function examMetaForContext(
  lesson: PathwayLessonRecord,
  context: { exam: PathwayLessonRuntimeExam; country: PathwayLessonRuntimeCountry },
): PathwayLessonExamMeta | undefined {
  const examMeta = lesson.examMeta ?? [];
  const direct = examMeta.find((entry) => entry.exam === context.exam);
  if (direct) return direct;
  if (context.exam === "NCLEX_PN" || context.exam === "NCLEX_RN") {
    const generic = examMeta.find((entry) => entry.exam === "NCLEX");
    if (generic) return generic;
  }
  if (context.exam === "NP") {
    const np = examMeta.find((entry) => entry.exam === "NP");
    if (np) return np;
    const nursing = examMeta.find((entry) => isNursingCoreRuntimeExam(entry.exam));
    if (nursing) return { ...nursing, exam: "NP" };
  }
  return undefined;
}

function lessonPriorityWeight(priority: PathwayLessonPriority | undefined): number {
  if (priority === "high") return 0;
  if (priority === "medium") return 1;
  return 2;
}

/** Stage counts for hub list diagnostics — same filters as {@link sortAndFilterLessonsForPathwayContext}, pre-sort. */
export function countMarketingPathwayContextFilterStages(
  pathwayId: string,
  lessons: readonly PathwayLessonRecord[],
): { afterPublicComplete: number; afterCountryContext: number } {
  const context = resolveLessonContextForPathwayId(pathwayId);
  const afterPublic = lessons.filter((lesson) => pathwayLessonEligibleForPublicMarketingSurface(lesson));
  const afterCountry = afterPublic.filter((lesson) => matchesLessonContext(pathwayId, lesson, context));
  return { afterPublicComplete: afterPublic.length, afterCountryContext: afterCountry.length };
}

export function sortAndFilterLessonsForPathwayContext(
  pathwayId: string,
  lessons: PathwayLessonRecord[],
): PathwayLessonRecord[] {
  const context = resolveLessonContextForPathwayId(pathwayId);
  return lessons
    .filter((lesson) => pathwayLessonEligibleForPublicMarketingSurface(lesson))
    .filter((lesson) => matchesLessonContext(pathwayId, lesson, context))
    .map((lesson) => ({ ...lesson, activeExamMeta: examMetaForContext(lesson, context) }))
    .sort((a, b) => {
      const yieldDelta = pathwayLessonYieldWeight(a.activeExamMeta?.yieldLevel) - pathwayLessonYieldWeight(b.activeExamMeta?.yieldLevel);
      if (yieldDelta !== 0) return yieldDelta;
      const priorityDelta = lessonPriorityWeight(a.priority) - lessonPriorityWeight(b.priority);
      if (priorityDelta !== 0) return priorityDelta;
      const categoryDelta = a.bodySystem.localeCompare(b.bodySystem);
      if (categoryDelta !== 0) return categoryDelta;
      return a.title.localeCompare(b.title);
    });
}

/**
 * Same exam/country gate as {@link sortAndFilterLessonsForPathwayContext} — run on **hydrated**
 * detail rows so hub links cannot diverge when list metadata and `getPathwayLesson` payloads disagree.
 */
export function pathwayLessonMatchesMarketingPathwayContext(
  pathwayId: string,
  lesson: PathwayLessonRecord,
): boolean {
  const context = resolveLessonContextForPathwayId(pathwayId);
  return matchesLessonContext(pathwayId, lesson, context);
}

/**
 * Catalog JSON sometimes ships short seoDescription strings that still describe the lesson but fall
 * below the structural gate’s ~12-word floor. Pad deterministically from title — no new editorial claims.
 */
function ensureCatalogLessonSeoDescriptionWordFloor(seoDescription: string, title: string): string {
  const t = seoDescription.trim();
  if (countWords(stripToPlainText(t)) >= 12) return t;
  const shortTitle = title.replace(/\s*\([^)]*\)\s*$/, "").trim() || title.trim() || "this topic";
  const pad = `Clinical framing, safety cues, prioritization patterns, and exam-style rationale for ${shortTitle}.`;
  return t.length > 0 ? `${t} ${pad}`.trim() : pad.trim();
}

const MAX_QUESTION_IDS = 40;

/**
 * Normalizes `preTestQuestionIds` / `postTestQuestionIds` from catalog JSON, DB v2 payloads, or admin tooling:
 * string ids only, trim, length 8–80, dedupe preserving first-seen order, cap 40.
 * Server resolution (`loadLessonBankQuizItemsByExamIds`) still enforces entitlement + region + MCQ mapping.
 *
 * Persist boundary: any code path that writes these fields to durable lesson records should pass raw
 * authoring input through this helper (or {@link sanitizeQuestionIdArrayWithDiagnostics}) before save.
 */
export function sanitizeQuestionIdArray(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const id = x.trim();
    if (id.length < 8 || id.length > 80 || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= MAX_QUESTION_IDS) break;
  }
  return out.length ? out : undefined;
}

export type SanitizeQuestionIdDropReason = "malformed" | "duplicate" | "cap";

/**
 * Same rules as {@link sanitizeQuestionIdArray}, plus counts for internal diagnostics (never learner-facing).
 * `dropped` entries use `position` (0-based index in the input array) instead of raw strings.
 */
export function sanitizeQuestionIdArrayWithDiagnostics(raw: unknown): {
  ids: string[] | undefined;
  dropped: Array<{ position: number; reason: SanitizeQuestionIdDropReason }>;
} {
  const dropped: Array<{ position: number; reason: SanitizeQuestionIdDropReason }> = [];
  if (!Array.isArray(raw)) {
    return { ids: undefined, dropped };
  }
  const out: string[] = [];
  const seen = new Set<string>();
  raw.forEach((x, position) => {
    if (typeof x !== "string") {
      dropped.push({ position, reason: "malformed" });
      return;
    }
    const id = x.trim();
    if (id.length < 8 || id.length > 80) {
      dropped.push({ position, reason: "malformed" });
      return;
    }
    if (seen.has(id)) {
      dropped.push({ position, reason: "duplicate" });
      return;
    }
    if (out.length >= MAX_QUESTION_IDS) {
      dropped.push({ position, reason: "cap" });
      return;
    }
    seen.add(id);
    out.push(id);
  });
  return { ids: out.length ? out : undefined, dropped };
}

/**
 * When authoring supplies a non-empty `preTestQuestionIds` / `postTestQuestionIds` array but
 * {@link sanitizeQuestionIdArray} removes every entry, emit a dev / `NN_DEBUG_EXPLICIT_QUESTION_IDS`
 * warning so bad catalog input is easier to spot (never shown to learners).
 */
function warnIfExamQuestionIdFieldSanitizedToEmpty(opts: {
  pathwayId?: string;
  lessonSlug: string;
  field: "preTestQuestionIds" | "postTestQuestionIds";
  raw: unknown;
}): void {
  if (!Array.isArray(opts.raw) || opts.raw.length === 0) return;
  const sanitized = sanitizeQuestionIdArray(opts.raw);
  if (sanitized && sanitized.length > 0) return;
  const enabled =
    process.env.NODE_ENV !== "production" || process.env.NN_DEBUG_EXPLICIT_QUESTION_IDS === "true";
  if (!enabled) return;
  // eslint-disable-next-line no-console -- authoring-only diagnostic; not learner-facing
  console.warn(
    `[pathway-lesson-catalog] ${opts.field} became empty after sanitize (check authoring). slug=${opts.lessonSlug} pathway=${opts.pathwayId ?? ""} rawEntries=${opts.raw.length}`,
  );
}

export function sanitizeQuizItems(raw: unknown): PathwayLessonQuizItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonQuizItem[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    const question = typeof o.question === "string" ? o.question.trim() : "";
    const options = Array.isArray(o.options)
      ? o.options.filter((y): y is string => typeof y === "string" && y.trim().length > 0)
      : [];
    const correct = typeof o.correct === "number" && Number.isInteger(o.correct) ? o.correct : -1;
    if (question.length < 5 || options.length < 2 || correct < 0 || correct >= options.length) continue;
    const rationale = typeof o.rationale === "string" ? o.rationale.trim() : undefined;
    out.push({ question, options, correct, ...(rationale ? { rationale } : {}) });
  }
  return out.length ? out : undefined;
}

function defaultPeerLessonSlugsForPathwayId(pathwayId: string): string[] {
  if (pathwayId.startsWith("ca-")) {
    return ["fluid-balance-acute-care", "cardiovascular-prioritization", "ca-rn-shock"];
  }
  if (pathwayId.startsWith("us-")) {
    return ["respiratory-assessment-ngn", "us-rn-heart-failure", "us-rn-shock"];
  }
  return ["fluid-balance-acute-care", "cardiovascular-prioritization", "ca-rn-shock"];
}

/** Premium marketing gate expects ≥2 related refs; pad with stable hub peers when catalog rows omit them. */
function ensurePremiumCatalogRelatedLessonRefs(
  pathwayId: string,
  lessonSlug: string,
  refs: PathwayLessonRelatedRef[] | undefined,
): PathwayLessonRelatedRef[] | undefined {
  const base = (refs ?? []).filter((r) => typeof r.slug === "string" && r.slug.trim().length > 0);
  if (base.length >= 2) return base;
  const out: PathwayLessonRelatedRef[] = [...base];
  const seen = new Set(out.map((r) => r.slug.trim()));
  for (const slug of defaultPeerLessonSlugsForPathwayId(pathwayId)) {
    if (out.length >= 2) break;
    if (slug === lessonSlug) continue;
    if (seen.has(slug)) continue;
    out.push({ slug, titleHint: slug.replace(/-/g, " ") });
    seen.add(slug);
  }
  return out.length ? out : undefined;
}

export function normalizeLesson(raw: LessonInput, pathwayId?: string): PathwayLessonRecord {
  const rawTitle = typeof raw.title === "string" ? raw.title : "";
  const normalizedTopic = normalizeLessonCategory(typeof raw.topic === "string" ? raw.topic : "", rawTitle);
  const premiumizedTitle = premiumizeLessonDisplayTitle(rawTitle, raw.slug).trim();
  const title = premiumizedTitle.length > 0 ? premiumizedTitle : "Lesson";
  const seoTitle = typeof raw.seoTitle === "string" ? raw.seoTitle : title;
  const seoDescription = ensureCatalogLessonSeoDescriptionWordFloor(
    typeof raw.seoDescription === "string" ? raw.seoDescription : "",
    title,
  );
  const rawPc = raw.previewSectionCount;
  const previewCandidate =
    typeof rawPc === "number" && Number.isFinite(rawPc) && rawPc > 0 ? Math.floor(rawPc) : 1;

  const incoming = sanitizeIncomingSections(raw.sections as PathwayLessonSection[]);
  const usePremium = lessonUsesPremiumStructure(incoming);
  let expanded = usePremium ? finalizePremiumSections(incoming) : expandToStandardFiveSections(incoming);
  const lessonSlugEarly = typeof raw.slug === "string" ? raw.slug : "";
  let premiumOmittedMerged: PathwayLessonOmittedPremiumSection[] | undefined = Array.isArray(
    raw.premiumOmittedSections,
  )
    ? [...raw.premiumOmittedSections]
    : undefined;
  let relatedLessonRefsMerged: PathwayLessonRelatedRef[] | undefined = Array.isArray(raw.relatedLessonRefs)
    ? [...raw.relatedLessonRefs]
    : undefined;

  if (usePremium) {
    const hydrated = hydratePremiumCatalogSectionsForMarketingGate({
      pathwayId: pathwayId ?? "",
      title,
      sections: expanded,
      relatedLessonRefs: relatedLessonRefsMerged,
      premiumOmittedSections: premiumOmittedMerged,
    });
    expanded = hydrated.sections;
    premiumOmittedMerged = hydrated.premiumOmittedSections.length ? hydrated.premiumOmittedSections : undefined;
    relatedLessonRefsMerged = ensurePremiumCatalogRelatedLessonRefs(
      pathwayId ?? "",
      lessonSlugEarly,
      relatedLessonRefsMerged,
    );
  }

  if (!usePremium) {
    const topic = normalizedTopic;
    const bodySystem = typeof raw.bodySystem === "string" ? raw.bodySystem : "";
    expanded = enrichLegacyFiveBlockSectionsForSubscriberGates(expanded, {
      title,
      topic,
      bodySystem,
      pathwayId: pathwayId ?? "",
    });
  }

  const premiumOmitted = premiumOmittedMerged;
  const relatedLessonRefs = relatedLessonRefsMerged;

  const system = typeof raw.system === "string" && raw.system.trim().length > 0 ? raw.system.trim() : "";
  const bodySystem = typeof raw.bodySystem === "string" ? raw.bodySystem : "";
  const embeddedSoundLibraries = sanitizeEmbeddedSoundLibraries(
    (raw as { embeddedSoundLibraries?: unknown }).embeddedSoundLibraries,
  );

  const base: PathwayLessonRecord = {
    slug: raw.slug,
    title,
    topic: normalizedTopic,
    topicSlug: typeof raw.topicSlug === "string" ? raw.topicSlug : "",
    system: system || bodySystem,
    bodySystem,
    previewSectionCount: Math.max(1, Math.min(previewCandidate, usePremium ? 11 : 5)),
    seoTitle,
    seoDescription,
    sections: expanded,
    ...(premiumOmitted?.length ? { premiumOmittedSections: premiumOmitted } : {}),
    ...(relatedLessonRefs?.length ? { relatedLessonRefs } : {}),
    ...(embeddedSoundLibraries?.length ? { embeddedSoundLibraries } : {}),
    ...mergeLessonAudienceMetadata(raw, pathwayId),
  };

  const maxPreview = Math.min(expanded.length, usePremium ? 11 : 5);
  const preview = Math.max(1, Math.min(base.previewSectionCount, maxPreview || 1));
  const preTest = sanitizeQuizItems((raw as { preTest?: unknown }).preTest);
  const postTest = sanitizeQuizItems((raw as { postTest?: unknown }).postTest);
  const lessonSlugForAuthoring = typeof raw.slug === "string" ? raw.slug : "";
  const rawPreTestQuestionIds = (raw as { preTestQuestionIds?: unknown }).preTestQuestionIds;
  const rawPostTestQuestionIds = (raw as { postTestQuestionIds?: unknown }).postTestQuestionIds;
  warnIfExamQuestionIdFieldSanitizedToEmpty({
    pathwayId,
    lessonSlug: lessonSlugForAuthoring,
    field: "preTestQuestionIds",
    raw: rawPreTestQuestionIds,
  });
  warnIfExamQuestionIdFieldSanitizedToEmpty({
    pathwayId,
    lessonSlug: lessonSlugForAuthoring,
    field: "postTestQuestionIds",
    raw: rawPostTestQuestionIds,
  });
  const preTestQuestionIds = sanitizeQuestionIdArray(rawPreTestQuestionIds);
  const postTestQuestionIds = sanitizeQuestionIdArray(rawPostTestQuestionIds);

  const withQuizzes: PathwayLessonRecord = {
    ...base,
    previewSectionCount: preview,
    ...(preTestQuestionIds ? { preTestQuestionIds } : {}),
    ...(postTestQuestionIds ? { postTestQuestionIds } : {}),
    ...(preTest ? { preTest } : {}),
    ...(postTest ? { postTest } : {}),
  };

  const hy = deriveLessonHighYieldStudyFields(expanded, raw as { studyTakeaways?: unknown; studyCommonTraps?: unknown; memoryAnchor?: unknown });
  const withStudyStrips: PathwayLessonRecord = {
    ...withQuizzes,
    ...(hy.studyTakeaways && hy.studyTakeaways.length >= 1 ? { studyTakeaways: hy.studyTakeaways } : {}),
    ...(hy.studyCommonTraps && hy.studyCommonTraps.length > 0 ? { studyCommonTraps: hy.studyCommonTraps } : {}),
    ...(hy.memoryAnchor ? { memoryAnchor: hy.memoryAnchor } : {}),
    ...(hy.omitHighYieldSectionIds && hy.omitHighYieldSectionIds.length > 0
      ? { omitHighYieldSectionIds: hy.omitHighYieldSectionIds }
      : {}),
  };

  const structuralQuality = evaluatePathwayLessonStructuralGate(withStudyStrips);
  const interactiveModules = buildLessonInteractiveModules(withStudyStrips);
  const rawLfp = (raw as { linked_flashcard_prompts?: unknown }).linked_flashcard_prompts;
  const linked_flashcard_prompts = (() => {
    if (!Array.isArray(rawLfp) || rawLfp.length === 0) return undefined;
    const strings = rawLfp
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 48);
    return strings.length ? strings : undefined;
  })();

  return {
    ...withStudyStrips,
    structuralQuality,
    interactiveModules,
    ...(linked_flashcard_prompts ? { linked_flashcard_prompts } : {}),
    ...(usePremium ? { premiumValidation: validatePathwayLessonPremium(withStudyStrips) } : {}),
  };
}
type LessonLibraryRow = LessonInput & { pathwayIds: string[] };

type LessonLibraryFile = {
  version: number;
  generatedAt?: string;
  lessons: LessonLibraryRow[];
};

let lessonLibraryCache: LessonLibraryFile | null | undefined;

function readLessonLibrarySync(): LessonLibraryFile | null {
  if (lessonLibraryCache !== undefined) return lessonLibraryCache;
  try {
    lessonLibraryCache = require("@/content/lessons/lesson-library.json") as LessonLibraryFile;
  } catch {
    lessonLibraryCache = null;
  }
  return lessonLibraryCache;
}

/**
 * Catalog + allied + new-grad + scoped-gold merge **without** reading `lesson-library.json`.
 * Use for build tooling that must not recurse through the library file.
 */
export function getCatalogLessonsRawFromBundledOnly(pathwayId: string): LessonInput[] {
  const bucket = getCatalogData().pathways[pathwayId];
  const fromJson = bucket?.lessons?.length ? bucket.lessons.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
  const allied = alliedBundledLessonsForPathway(pathwayId);
  const cardioExpansion = rnCardiovascularExpansionLessonsForPathway(pathwayId);
  const neuroExpansion = rnNeurologicalExpansionLessonsForPathway(pathwayId);
  const hemOncExpansion = rnHematologyOncologyExpansionLessonsForPathway(pathwayId);
  const giExpansion = rnGastrointestinalExpansionLessonsForPathway(pathwayId);
  const integumentaryExpansion = rnIntegumentaryWoundCareExpansionLessonsForPathway(pathwayId);
  const infectionControlExpansion = rnInfectionControlExpansionLessonsForPathway(pathwayId);
  const leadershipDelegationExpansion = rnLeadershipDelegationExpansionLessonsForPathway(pathwayId);
  const maternalNewbornExpansion = rnMaternalNewbornExpansionLessonsForPathway(pathwayId);
  const proceduresSkillsExpansion = rnProceduresSkillsExpansionLessonsForPathway(pathwayId);
  const nutritionExpansion = rnNutritionExpansionLessonsForPathway(pathwayId);
  const examStrategyExpansion = rnExamStrategyExpansionLessonsForPathway(pathwayId);
  const respiratoryExpansion = rnRespiratoryExpansionLessonsForPathway(pathwayId);
  const renalExpansion = rnRenalExpansionLessonsForPathway(pathwayId);
  const endocrineExpansion = rnEndocrineExpansionLessonsForPathway(pathwayId);
  const musculoskeletalExpansion = rnMusculoskeletalExpansionLessonsForPathway(pathwayId);
  const fluidsElectrolytesExpansion = rnFluidsElectrolytesExpansionLessonsForPathway(pathwayId);
  const examNotesIntegrationExpansion = rnExamNotesIntegrationExpansionLessonsForPathway(pathwayId);
  const newGrad = newGradTransitionLessonsForPathway(pathwayId);
  const seen = new Set<string>();
  const merged: LessonInput[] = [];
  for (const l of [
    ...fromJson,
    ...allied,
    ...cardioExpansion,
    ...neuroExpansion,
    ...hemOncExpansion,
    ...giExpansion,
    ...integumentaryExpansion,
    ...infectionControlExpansion,
    ...leadershipDelegationExpansion,
    ...maternalNewbornExpansion,
    ...proceduresSkillsExpansion,
    ...nutritionExpansion,
    ...examStrategyExpansion,
    ...respiratoryExpansion,
    ...renalExpansion,
    ...endocrineExpansion,
    ...musculoskeletalExpansion,
    ...fluidsElectrolytesExpansion,
    ...examNotesIntegrationExpansion,
    ...newGrad,
  ]) {
    if (seen.has(l.slug)) continue;
    seen.add(l.slug);
    merged.push(l);
  }
  return prependScopedGoldCatalogLessons(pathwayId, merged);
}

function buildCatalogLessonsRawUncached(pathwayId: string): LessonInput[] {
  const lib = readLessonLibrarySync();
  if (lib?.lessons?.length) {
    const rows = lib.lessons.filter((r) => Array.isArray(r.pathwayIds) && r.pathwayIds.includes(pathwayId));
    if (rows.length > 0) {
      const stripped: LessonInput[] = rows.map((r) => {
        const { pathwayIds: _p, ...rest } = r;
        return rest;
      });
      const seen = new Set(stripped.map((l) => l.slug.trim()));
      const merged: LessonInput[] = [...stripped];
      for (const extra of rnCardiovascularExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnNeurologicalExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnHematologyOncologyExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnGastrointestinalExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnIntegumentaryWoundCareExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnInfectionControlExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnLeadershipDelegationExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnMaternalNewbornExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnProceduresSkillsExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnNutritionExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnExamStrategyExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnRespiratoryExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnRenalExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnEndocrineExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnMusculoskeletalExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnFluidsElectrolytesExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      for (const extra of rnExamNotesIntegrationExpansionLessonsForPathway(pathwayId)) {
        const s = extra.slug.trim();
        if (!s || seen.has(s)) continue;
        seen.add(s);
        merged.push(extra);
      }
      return prependScopedGoldCatalogLessons(pathwayId, merged);
    }
  }
  return getCatalogLessonsRawFromBundledOnly(pathwayId);
}

export function getCatalogLessonsRaw(pathwayId: string): LessonInput[] {
  const key = pathwayId.trim();
  const hit = catalogLessonsRawByPathwayIdCache.get(key);
  if (hit) return hit;
  lessonsPerfMark("catalog_build_start", { scope: "merged_catalog_lessons_raw", pathwayId: key });
  const built = buildCatalogLessonsRawUncached(key);
  catalogLessonsRawByPathwayIdCache.set(key, built);
  lessonsPerfMark("catalog_build_end", { scope: "merged_catalog_lessons_raw", pathwayId: key, count: built.length });
  lessonsPerfMark("catalog_size", { scope: "merged_catalog_lessons_raw", pathwayId: key, count: built.length });
  return built;
}

export function getCatalogPathwayLessonsSync(pathwayId: string): PathwayLessonRecord[] {
  const key = pathwayId.trim();
  ensurePathwayCatalogIndexes(key);
  return pathwayNormalizedCatalogRows.get(key) ?? [];
}

/**
 * Audit / inventory tooling: bundled `catalog.json` + optional `allied-bundled-catalog.json` +
 * `new-grad-transition-catalog.json` + scoped-gold,
 * normalized, then the same exam/country filter as catalog-backed hub paths. **Does not include Prisma-published
 * lessons.** DB-only pathways still list via `getPathwayLessonsPage` when published rows exist.
 *
 * Returns **hub index rows** only: {@link stripPathwayLessonToHubListShape} removes section bodies and quiz payloads
 * so category-first marketing hubs never retain full catalog lesson JSON in memory (detail routes load bodies).
 */
export function getEffectiveCatalogLessonsForPathwaySync(pathwayId: string): PathwayLessonRecord[] {
  const key = pathwayId.trim();
  const hit = effectiveHubCatalogLessonsByPathway.get(key);
  if (hit) return hit;
  ensurePathwayCatalogIndexes(key);
  const normalized = pathwayNormalizedCatalogRows.get(key) ?? [];
  const built = sortAndFilterLessonsForPathwayContext(key, normalized).map(stripPathwayLessonToHubListShape);
  effectiveHubCatalogLessonsByPathway.set(key, built);
  return built;
}

/**
 * Slugs accepted on the marketing hub for this pathway (post publicComplete + exam/country context filter).
 */
export function getMarketingHubEffectiveCatalogSlugSet(pathwayId: string): Set<string> {
  const key = pathwayId.trim();
  const hit = marketingEffectiveCatalogSlugSetByPathway.get(key);
  if (hit) return hit;
  const trusted = tryTrustedGeneratedLessonIndex(key);
  if (trusted) {
    const s = new Set(
      trusted.marketingEffectiveSlugsLowercase.map((x) => x.trim().toLowerCase()).filter(Boolean),
    );
    marketingEffectiveCatalogSlugSetByPathway.set(key, s);
    return s;
  }
  const eff = getEffectiveCatalogLessonsForPathwaySync(key);
  const s = new Set(eff.map((l) => l.slug.trim().toLowerCase()));
  marketingEffectiveCatalogSlugSetByPathway.set(key, s);
  return s;
}

/**
 * Lightweight marketing-hub index: no section bodies, one row per hub-visible lesson.
 * Process-memoized (cleared in tests via {@link resetCatalogLessonsRawMergeCacheForTests}).
 */
export function getLessonSummariesIndex(pathwayId: string): PathwayLessonSummaryIndexRow[] {
  const key = pathwayId.trim();
  const memo = lessonSummariesIndexByPathway.get(key);
  if (memo) return memo;
  const trusted = tryTrustedGeneratedLessonIndex(key);
  if (trusted) {
    const rows: PathwayLessonSummaryIndexRow[] = trusted.summaries.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category,
      shortDescription: r.shortDescription,
    }));
    lessonSummariesIndexByPathway.set(key, rows);
    lessonsPerfMark("summary_index_end", { pathwayId: key, count: rows.length, source: "generated_disk" });
    return rows;
  }
  lessonsPerfMark("summary_index_start", { pathwayId: key });
  const filtered = getEffectiveCatalogLessonsForPathwaySync(key);
  const rows: PathwayLessonSummaryIndexRow[] = filtered.map((l) => ({
    id: l.slug,
    slug: l.slug,
    title: l.title,
    category: normalizeLessonCategory(l.topic, l.title),
    shortDescription: l.seoDescription,
  }));
  lessonSummariesIndexByPathway.set(key, rows);
  lessonsPerfMark("summary_index_end", { pathwayId: key, count: rows.length, source: "live_normalize" });
  return rows;
}

/** True when the bundled catalog path yields at least one lesson (JSON slice and/or scoped-gold for this pathway). */
export function pathwayHasBundledCatalogLessonsSync(pathwayId: string): boolean {
  return getCatalogLessonsRaw(pathwayId).length > 0;
}

/** Pathway ids that have at least one catalog (+ allied bundled slice + scoped-gold) lesson row. */
export function listCatalogPathwayIdsWithLessonsSync(): string[] {
  const ids = new Set<string>([
    ...Object.keys(getCatalogData().pathways ?? {}),
    ...Object.keys(getAlliedBundledPathways()),
    ...Object.keys(getNewGradTransitionPathways()),
  ]);
  /** Canadian NP hub rows can live only in `lesson-library.json` (no `catalog.json` pathway bucket). */
  ids.add("ca-np-cnple");
  return [...ids].filter((id) => getCatalogLessonsRaw(id).length > 0);
}

/**
 * Marker for `pathway_lessons.sections` JSON when pre/post quizzes are stored alongside section bodies
 * (plain array cannot hold `preTest` / `postTest` at the top level).
 */
export const NN_LESSON_DB_PAYLOAD_V2 = "nnLessonPayloadV2" as const;

/**
 * Unwrap DB `sections` JSON: either a section array (legacy) or {@link NN_LESSON_DB_PAYLOAD_V2} with nested sections + quizzes.
 */
export function unwrapPathwayLessonDbSections(sections: unknown): {
  sectionList: unknown;
  preTestQuestionIds?: string[];
  postTestQuestionIds?: string[];
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
} {
  if (sections && typeof sections === "object" && !Array.isArray(sections)) {
    const o = sections as Record<string, unknown>;
    if (o[NN_LESSON_DB_PAYLOAD_V2] === true && Array.isArray(o.sections)) {
      const pre = sanitizeQuizItems(o.preTest);
      const post = sanitizeQuizItems(o.postTest);
      const preTestQuestionIds = sanitizeQuestionIdArray(o.preTestQuestionIds);
      const postTestQuestionIds = sanitizeQuestionIdArray(o.postTestQuestionIds);
      return {
        sectionList: o.sections,
        ...(preTestQuestionIds ? { preTestQuestionIds } : {}),
        ...(postTestQuestionIds ? { postTestQuestionIds } : {}),
        ...(pre ? { preTest: pre } : {}),
        ...(post ? { postTest: post } : {}),
      };
    }
  }
  return { sectionList: sections };
}

export function pathwayLessonRowToInput(row: {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: unknown;
  locale: string;
  exams?: string[];
  countries?: string[];
  priority?: string;
  examMeta?: unknown;
}): LessonInput {
  const unwrapped = unwrapPathwayLessonDbSections(row.sections);
  return {
    slug: row.slug,
    title: row.title,
    topic: row.topic,
    topicSlug: row.topicSlug,
    bodySystem: row.bodySystem,
    previewSectionCount: row.previewSectionCount,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    sections: unwrapped.sectionList as LessonInput["sections"],
    ...(Array.isArray(row.exams) ? { exams: row.exams as PathwayLessonRuntimeExam[] } : {}),
    ...(Array.isArray(row.countries) ? { countries: row.countries as PathwayLessonRuntimeCountry[] } : {}),
    ...(typeof row.priority === "string" ? { priority: row.priority as PathwayLessonPriority } : {}),
    ...(Array.isArray(row.examMeta) ? { examMeta: row.examMeta as PathwayLessonExamMeta[] } : {}),
    ...(unwrapped.preTestQuestionIds ? { preTestQuestionIds: unwrapped.preTestQuestionIds } : {}),
    ...(unwrapped.postTestQuestionIds ? { postTestQuestionIds: unwrapped.postTestQuestionIds } : {}),
    ...(unwrapped.preTest ? { preTest: unwrapped.preTest } : {}),
    ...(unwrapped.postTest ? { postTest: unwrapped.postTest } : {}),
  } as LessonInput;
}

/**
 * Persists the same boolean as `normalizeLesson(pathwayLessonRowToInput(row), pathwayId).structuralQuality?.publicComplete`
 * without requiring callers to duplicate gate logic.
 */
export function computeStructuralPublicCompleteFromDbRow(
  row: Parameters<typeof pathwayLessonRowToInput>[0] & { pathwayId: string },
): boolean {
  return Boolean(normalizeLesson(pathwayLessonRowToInput(row), row.pathwayId).structuralQuality?.publicComplete);
}

/** @deprecated Prefer {@link normalizeLesson} */
export const normalizePathwayLessonInput = normalizeLesson;
