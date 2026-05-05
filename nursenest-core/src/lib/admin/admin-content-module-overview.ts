import type { TierCode } from "@prisma/client";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { ALLIED_PROFESSIONS, alliedProfessionTrackChipLabel } from "@/lib/allied/allied-professions-registry";
import { ECG_ROUTE_CONFIGS, canAccessEcgModuleForTier, isEcgModuleEnabled } from "@/lib/ecg-module/ecg-module-config";
import { isLabValuesModuleEnabled, LAB_VALUES_MODULES } from "@/lib/lab-values/lab-values-module";

export type ContentReadinessBadge =
  | "Live"
  | "Draft"
  | "Admin-only"
  | "Hidden"
  | "Needs content"
  | "Needs questions"
  | "Needs links"
  | "SEO incomplete"
  | "Paywall missing"
  | "Ready to publish";

export type ContentModuleStatus = "live" | "draft" | "admin_only" | "hidden" | "needs_content" | "ready";

export type ContentCountSet = {
  lessons: number;
  publishedLessons: number;
  draftLessons: number;
  flashcards: number;
  publishedFlashcards: number;
  draftFlashcards: number;
  practiceQuestions: number;
  publishedPracticeQuestions: number;
  draftPracticeQuestions: number;
  catQuestions: number;
  publishedCatQuestions: number;
  clinicalScenarios: number;
  publishedClinicalScenarios: number;
  blogPosts: number;
  publishedBlogPosts: number;
  premium: number;
  free: number;
};

export type ContentModuleOverviewCard = {
  key: string;
  title: string;
  group: "pathway" | "module" | "content";
  status: ContentModuleStatus;
  badges: ContentReadinessBadge[];
  counts: Partial<ContentCountSet>;
  tierAccess: Record<string, boolean>;
  linkedPathways: string[];
  publicHref?: string;
  learnerHref?: string;
  adminHref?: string;
  diagnosticsHref?: string;
  warnings: string[];
  readiness: "Not ready" | "Admin preview" | "Ready to publish" | "Published";
  canPublish: boolean;
};

export type AlliedProfessionOverview = ContentModuleOverviewCard & {
  professionKey: string;
  professionLabel: string;
  publicHubVisible: boolean;
  learnerHubVisible: boolean;
};

export type AdminContentModuleOverview = {
  generatedAt: string;
  featureFlags: {
    enableEcgModule: boolean;
    enableLabValuesModule: boolean;
  };
  summary: {
    totalCards: number;
    live: number;
    hiddenOrAdminOnly: number;
    needsAttention: number;
  };
  modules: ContentModuleOverviewCard[];
  alliedProfessions: AlliedProfessionOverview[];
  diagnostics: string[];
};

type PrismaLike = {
  pathwayLesson?: {
    count(args?: unknown): Promise<number>;
  };
  flashcard?: {
    count(args?: unknown): Promise<number>;
  };
  examQuestion?: {
    count(args?: unknown): Promise<number>;
  };
  ecgVideoQuestion?: {
    count(args?: unknown): Promise<number>;
  };
  clinicalNursingScenario?: {
    count(args?: unknown): Promise<number>;
  };
  blogPost?: {
    count(args?: unknown): Promise<number>;
  };
};

const EMPTY_COUNTS: ContentCountSet = {
  lessons: 0,
  publishedLessons: 0,
  draftLessons: 0,
  flashcards: 0,
  publishedFlashcards: 0,
  draftFlashcards: 0,
  practiceQuestions: 0,
  publishedPracticeQuestions: 0,
  draftPracticeQuestions: 0,
  catQuestions: 0,
  publishedCatQuestions: 0,
  clinicalScenarios: 0,
  publishedClinicalScenarios: 0,
  blogPosts: 0,
  publishedBlogPosts: 0,
  premium: 0,
  free: 0,
};

const ECG_MINIMUM_QUESTION_COUNT = 300;

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function countWarnings(counts: Partial<ContentCountSet>, options: { requireLessons?: boolean; requireQuestions?: boolean }) {
  const warnings: string[] = [];
  if (options.requireLessons && (counts.lessons ?? 0) === 0) warnings.push("No lessons connected.");
  if (options.requireQuestions && (counts.practiceQuestions ?? 0) === 0) warnings.push("No practice questions connected.");
  if ((counts.catQuestions ?? 0) === 0 && options.requireQuestions) warnings.push("CAT/adaptive question coverage is empty.");
  return warnings;
}

function badgesForCounts(
  status: ContentModuleStatus,
  counts: Partial<ContentCountSet>,
  warnings: string[],
  options: { adminOnly?: boolean; hidden?: boolean; paywallReady?: boolean; seoReady?: boolean },
): ContentReadinessBadge[] {
  const badges: ContentReadinessBadge[] = [];
  if (status === "live") badges.push("Live");
  if (status === "draft") badges.push("Draft");
  if (options.adminOnly) badges.push("Admin-only");
  if (options.hidden) badges.push("Hidden");
  if (warnings.some((warning) => warning.includes("lessons") || warning.includes("content"))) badges.push("Needs content");
  if (warnings.some((warning) => warning.includes("question") || warning.includes("CAT"))) badges.push("Needs questions");
  if ((counts.premium ?? 0) > 0 && !options.paywallReady) badges.push("Paywall missing");
  if (!options.seoReady) badges.push("SEO incomplete");
  if (warnings.length === 0 && status !== "live" && status !== "hidden") badges.push("Ready to publish");
  return unique(badges);
}

export function buildEcgModuleOverview(input: {
  enabled: boolean;
  status: "draft" | "qa_preview" | "published" | "archived";
  totalQuestions: number;
  stripVideoQuestions: number;
  lessons: number;
  flashcards: number;
  canPublish: boolean;
  minimumQuestions?: number;
}): ContentModuleOverviewCard {
  const minimum = input.minimumQuestions ?? ECG_MINIMUM_QUESTION_COUNT;
  const warnings = [
    input.totalQuestions < minimum ? `ECG question count ${input.totalQuestions}/${minimum}.` : null,
    input.stripVideoQuestions === 0 ? "No ECG strip/video questions connected." : null,
    input.lessons === 0 ? "No ECG lessons connected." : null,
    input.flashcards === 0 ? "No ECG flashcards connected." : null,
    canAccessEcgModuleForTier("RPN") ? "RPN/PN access is not blocked." : null,
  ].filter((entry): entry is string => Boolean(entry));

  const status: ContentModuleStatus =
    input.status === "published" && input.enabled ? "live" : input.status === "qa_preview" ? "admin_only" : "hidden";
  const readiness =
    input.status === "published" && input.enabled
      ? "Published"
      : input.canPublish && warnings.length === 0
        ? "Ready to publish"
        : input.status === "qa_preview"
          ? "Admin preview"
          : "Not ready";

  return {
    key: "ecg-module",
    title: "ECG module",
    group: "module",
    status,
    readiness,
    canPublish: input.canPublish && warnings.length === 0 && canAccessEcgModuleForTier("RN") && canAccessEcgModuleForTier("NP") && !canAccessEcgModuleForTier("RPN"),
    badges: badgesForCounts(status, { practiceQuestions: input.totalQuestions, flashcards: input.flashcards, lessons: input.lessons, premium: 1 }, warnings, {
      adminOnly: status === "admin_only",
      hidden: status === "hidden",
      paywallReady: true,
      seoReady: false,
    }),
    counts: {
      practiceQuestions: input.totalQuestions,
      publishedPracticeQuestions: input.totalQuestions,
      catQuestions: 0,
      lessons: input.lessons,
      flashcards: input.flashcards,
      premium: 1,
      free: 0,
    },
    tierAccess: { RN: true, NP: true, RPN: false, PN: false },
    linkedPathways: ["us-rn-nclex-rn", "ca-rn-nclex-rn", "np"],
    adminHref: "/admin/modules/ecg",
    learnerHref: "/modules/ecg",
    diagnosticsHref: "/admin/modules/ecg",
    warnings,
  };
}

export function buildLabModuleOverview(input: {
  enabled: boolean;
  lessons: number;
  questions: number;
  flashcards: number;
  adultRangeCoverage?: number;
  pediatricRangeCoverage?: number;
}): ContentModuleOverviewCard {
  const warnings = [
    input.lessons === 0 ? "No lab value lessons connected." : null,
    input.questions === 0 ? "No lab interpretation questions connected." : null,
    input.flashcards === 0 ? "No lab flashcards connected." : null,
    input.adultRangeCoverage === 0 ? "Adult range coverage is missing." : null,
  ].filter((entry): entry is string => Boolean(entry));
  const status: ContentModuleStatus = input.enabled ? "admin_only" : "hidden";
  return {
    key: "lab-values-module",
    title: "Lab values / lab interpretation module",
    group: "module",
    status,
    readiness: warnings.length === 0 ? "Ready to publish" : input.enabled ? "Admin preview" : "Not ready",
    canPublish: warnings.length === 0,
    badges: badgesForCounts(status, { lessons: input.lessons, practiceQuestions: input.questions, flashcards: input.flashcards, premium: 2, free: 1 }, warnings, {
      adminOnly: status === "admin_only",
      hidden: status === "hidden",
      paywallReady: true,
      seoReady: false,
    }),
    counts: {
      lessons: input.lessons,
      practiceQuestions: input.questions,
      flashcards: input.flashcards,
      premium: 2,
      free: 1,
    },
    tierAccess: { RN: true, NP: true, RPN: true, PN: true, ALLIED: true },
    linkedPathways: ["lab-values"],
    adminHref: "/admin/modules/lab-values",
    learnerHref: "/modules/lab-values",
    diagnosticsHref: "/admin/modules/lab-values",
    warnings,
  };
}

export function buildAlliedProfessionOverview(input: {
  professionKey: string;
  professionLabel: string;
  pathwayId: string;
  lessons: number;
  publishedLessons: number;
  draftLessons: number;
  flashcards: number;
  questions: number;
  catQuestions: number;
  premium: number;
  free: number;
  publicHubVisible: boolean;
  learnerHubVisible: boolean;
}): AlliedProfessionOverview {
  const warnings = [
    input.lessons === 0 ? "Missing allied lessons." : null,
    input.questions === 0 ? "Missing allied practice questions." : null,
    input.flashcards === 0 ? "Missing allied flashcards." : null,
    input.publicHubVisible ? null : "Public hub is hidden or not launched.",
    input.learnerHubVisible ? null : "Learner hub visibility is not confirmed.",
  ].filter((entry): entry is string => Boolean(entry));
  const status: ContentModuleStatus = input.publicHubVisible ? "live" : "hidden";
  return {
    key: `allied-${input.professionKey}`,
    professionKey: input.professionKey,
    professionLabel: input.professionLabel,
    title: input.professionLabel,
    group: "pathway",
    status,
    readiness: input.publicHubVisible ? "Published" : warnings.length === 0 ? "Ready to publish" : "Not ready",
    canPublish: warnings.length === 0,
    badges: badgesForCounts(status, { lessons: input.lessons, practiceQuestions: input.questions, flashcards: input.flashcards, premium: input.premium }, warnings, {
      hidden: status === "hidden",
      paywallReady: input.premium > 0,
      seoReady: input.publicHubVisible,
    }),
    counts: {
      lessons: input.lessons,
      publishedLessons: input.publishedLessons,
      draftLessons: input.draftLessons,
      flashcards: input.flashcards,
      practiceQuestions: input.questions,
      catQuestions: input.catQuestions,
      premium: input.premium,
      free: input.free,
    },
    tierAccess: { ALLIED: true, RN: false, NP: false, RPN: false, PN: false },
    linkedPathways: [input.pathwayId],
    publicHubVisible: input.publicHubVisible,
    learnerHubVisible: input.learnerHubVisible,
    publicHref: `/allied-health/${input.professionKey}`,
    learnerHref: `/us/allied/allied-health/lessons?alliedProfession=${encodeURIComponent(input.professionKey)}`,
    adminHref: "/admin/modules/allied",
    diagnosticsHref: "/admin/modules/allied",
    warnings,
  };
}

function tierLabel(tier: TierCode | string): "RN" | "PN/RPN" | "NP" | "Allied Health" | "Other" {
  if (tier === "RN") return "RN";
  if (tier === "NP") return "NP";
  if (tier === "ALLIED") return "Allied Health";
  if (tier === "RPN" || tier === "LVN_LPN") return "PN/RPN";
  return "Other";
}

async function safeCount(diagnostics: string[], label: string, count: (() => Promise<number>) | undefined): Promise<number> {
  if (!count) {
    diagnostics.push(`${label}: unavailable model or table.`);
    return 0;
  }
  try {
    return await count();
  } catch (error) {
    diagnostics.push(`${label}: ${(error as Error).message.split("\n")[0]}`);
    return 0;
  }
}

async function countSetForWhere(prisma: PrismaLike, diagnostics: string[], where: Record<string, unknown>): Promise<ContentCountSet> {
  const [
    lessons,
    publishedLessons,
    draftLessons,
    flashcards,
    publishedFlashcards,
    draftFlashcards,
    practiceQuestions,
    publishedPracticeQuestions,
    draftPracticeQuestions,
    catQuestions,
    publishedCatQuestions,
    clinicalScenarios,
    publishedClinicalScenarios,
    blogPosts,
    publishedBlogPosts,
  ] = await Promise.all([
    safeCount(diagnostics, "PathwayLesson count", () => prisma.pathwayLesson!.count({ where: where.pathwayLesson })),
    safeCount(diagnostics, "Published PathwayLesson count", () => prisma.pathwayLesson!.count({ where: { ...(where.pathwayLesson as object), status: "PUBLISHED" } })),
    safeCount(diagnostics, "Draft PathwayLesson count", () => prisma.pathwayLesson!.count({ where: { ...(where.pathwayLesson as object), status: { not: "PUBLISHED" } } })),
    safeCount(diagnostics, "Flashcard count", () => prisma.flashcard!.count({ where: where.flashcard })),
    safeCount(diagnostics, "Published Flashcard count", () => prisma.flashcard!.count({ where: { ...(where.flashcard as object), status: "PUBLISHED" } })),
    safeCount(diagnostics, "Draft Flashcard count", () => prisma.flashcard!.count({ where: { ...(where.flashcard as object), status: { not: "PUBLISHED" } } })),
    safeCount(diagnostics, "ExamQuestion count", () => prisma.examQuestion!.count({ where: where.examQuestion })),
    safeCount(diagnostics, "Published ExamQuestion count", () => prisma.examQuestion!.count({ where: { ...(where.examQuestion as object), status: "published" } })),
    safeCount(diagnostics, "Draft ExamQuestion count", () => prisma.examQuestion!.count({ where: { ...(where.examQuestion as object), status: { not: "published" } } })),
    safeCount(diagnostics, "CAT ExamQuestion count", () => prisma.examQuestion!.count({ where: { ...(where.examQuestion as object), isAdaptiveEligible: true } })),
    safeCount(diagnostics, "Published CAT ExamQuestion count", () => prisma.examQuestion!.count({ where: { ...(where.examQuestion as object), isAdaptiveEligible: true, status: "published" } })),
    safeCount(diagnostics, "ClinicalNursingScenario count", () => prisma.clinicalNursingScenario!.count({ where: where.clinicalNursingScenario })),
    safeCount(diagnostics, "Published ClinicalNursingScenario count", () => prisma.clinicalNursingScenario!.count({ where: { ...(where.clinicalNursingScenario as object), publishStatus: "APPROVED" } })),
    safeCount(diagnostics, "BlogPost count", () => prisma.blogPost!.count({ where: where.blogPost })),
    safeCount(diagnostics, "Published BlogPost count", () => prisma.blogPost!.count({ where: { ...(where.blogPost as object), postStatus: "PUBLISHED" } })),
  ]);

  return {
    ...EMPTY_COUNTS,
    lessons,
    publishedLessons,
    draftLessons,
    flashcards,
    publishedFlashcards,
    draftFlashcards,
    practiceQuestions,
    publishedPracticeQuestions,
    draftPracticeQuestions,
    catQuestions,
    publishedCatQuestions,
    clinicalScenarios,
    publishedClinicalScenarios,
    blogPosts,
    publishedBlogPosts,
    premium: publishedPracticeQuestions + publishedFlashcards,
    free: Math.max(publishedLessons, 0),
  };
}

function buildAggregateContentCard(input: {
  key: string;
  title: string;
  counts: Partial<ContentCountSet>;
  tierAccess: Record<string, boolean>;
  linkedPathways: string[];
  adminHref?: string;
  publicHref?: string;
  learnerHref?: string;
  requireLessons?: boolean;
  requireQuestions?: boolean;
}): ContentModuleOverviewCard {
  const warnings = countWarnings(input.counts, { requireLessons: input.requireLessons, requireQuestions: input.requireQuestions });
  const live = (input.counts.publishedLessons ?? 0) > 0 || (input.counts.publishedPracticeQuestions ?? 0) > 0 || (input.counts.publishedFlashcards ?? 0) > 0;
  const status: ContentModuleStatus = live ? "live" : "needs_content";
  return {
    key: input.key,
    title: input.title,
    group: "content",
    status,
    badges: badgesForCounts(status, input.counts, warnings, { paywallReady: true, seoReady: live }),
    counts: input.counts,
    tierAccess: input.tierAccess,
    linkedPathways: input.linkedPathways,
    publicHref: input.publicHref,
    learnerHref: input.learnerHref,
    adminHref: input.adminHref,
    readiness: warnings.length === 0 ? (live ? "Published" : "Ready to publish") : "Not ready",
    canPublish: false,
    warnings,
  };
}

export async function loadAdminContentModuleOverview(): Promise<AdminContentModuleOverview> {
  const diagnostics: string[] = [];
  const { prisma } = await import("@/lib/db").catch((error) => {
    diagnostics.push(`Prisma unavailable: ${(error as Error).message.split("\n")[0]}`);
    return { prisma: null as PrismaLike | null };
  });

  const db = prisma as PrismaLike | null;
  const byTier = new Map<string, ContentCountSet>();

  if (db) {
    for (const group of ["RN", "PN/RPN", "NP", "Allied Health"] as const) {
      const tiers =
        group === "RN" ? ["RN"] : group === "NP" ? ["NP"] : group === "Allied Health" ? ["ALLIED"] : ["RPN", "LVN_LPN"];
      const pathwayIds = EXAM_PATHWAYS.filter((pathway) => tierLabel(pathway.stripeTier) === group).map((pathway) => pathway.id);
      byTier.set(
        group,
        await countSetForWhere(db, diagnostics, {
          pathwayLesson: { OR: [{ pathwayId: { in: pathwayIds } }, { tierCode: { in: tiers } }] },
          flashcard: { tier: { in: tiers } },
          examQuestion: { tier: { in: tiers.map((tier) => tier.toLowerCase()) } },
          clinicalNursingScenario: { OR: [{ pathwayId: { in: pathwayIds } }, { tierFocus: { in: tiers } }] },
          blogPost: { exam: group === "PN/RPN" ? { in: ["PN", "RPN"] } : group === "Allied Health" ? "Allied" : group },
        }),
      );
    }
  }

  const pathwayCards = (["RN", "PN/RPN", "NP", "Allied Health"] as const).map((group) => {
    const counts = byTier.get(group) ?? EMPTY_COUNTS;
    return buildAggregateContentCard({
      key: `${group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-modules`,
      title: `${group} modules`,
      counts,
      tierAccess: { RN: group === "RN", NP: group === "NP", RPN: group === "PN/RPN", PN: group === "PN/RPN", ALLIED: group === "Allied Health" },
      linkedPathways: EXAM_PATHWAYS.filter((pathway) => tierLabel(pathway.stripeTier) === group).map((pathway) => pathway.id),
      adminHref: group === "Allied Health" ? "/admin/modules/allied" : "/admin/content-coverage",
      requireLessons: true,
      requireQuestions: true,
    });
  });

  const alliedProfessions = await Promise.all(
    ALLIED_PROFESSIONS.map(async (profession) => {
      if (!db) {
        return buildAlliedProfessionOverview({
          professionKey: profession.professionKey,
          professionLabel: alliedProfessionTrackChipLabel(profession),
          pathwayId: profession.pathwayId,
          lessons: 0,
          publishedLessons: 0,
          draftLessons: 0,
          flashcards: 0,
          questions: 0,
          catQuestions: 0,
          premium: 0,
          free: 0,
          publicHubVisible: false,
          learnerHubVisible: false,
        });
      }
      const counts = await countSetForWhere(db, diagnostics, {
        pathwayLesson: { OR: [{ alliedProfessionKey: profession.professionKey }, { pathwayId: profession.pathwayId, topicSlug: { in: profession.topicSlugsIn ?? [] } }] },
        flashcard: { tier: "ALLIED" },
        examQuestion: { OR: [{ tier: "allied" }, { careerType: "allied" }, { tags: { has: profession.professionKey } }] },
        clinicalNursingScenario: { pathwayId: profession.pathwayId },
        blogPost: { OR: [{ exam: "Allied" }, { tags: { has: profession.professionKey } }] },
      });
      return buildAlliedProfessionOverview({
        professionKey: profession.professionKey,
        professionLabel: alliedProfessionTrackChipLabel(profession),
        pathwayId: profession.pathwayId,
        lessons: counts.lessons,
        publishedLessons: counts.publishedLessons,
        draftLessons: counts.draftLessons,
        flashcards: counts.flashcards,
        questions: counts.practiceQuestions,
        catQuestions: counts.catQuestions,
        premium: counts.premium,
        free: counts.free,
        publicHubVisible: false,
        learnerHubVisible: counts.publishedLessons > 0,
      });
    }),
  );

  let ecgCard = buildEcgModuleOverview({
    enabled: isEcgModuleEnabled(),
    status: "draft",
    totalQuestions: 0,
    stripVideoQuestions: 0,
    lessons: 0,
    flashcards: 0,
    canPublish: false,
  });
  try {
    const { getEcgModuleReadiness } = await import("@/lib/ecg-module/ecg-module-readiness");
    const readiness = await getEcgModuleReadiness();
    ecgCard = buildEcgModuleOverview({
      enabled: isEcgModuleEnabled(),
      status: readiness.status,
      totalQuestions: readiness.counts.totalQuestions,
      stripVideoQuestions: readiness.counts.stripVideo,
      lessons: readiness.counts.linkedLessons,
      flashcards: readiness.counts.flashcards,
      canPublish: readiness.canPublish,
    });
  } catch (error) {
    diagnostics.push(`ECG readiness unavailable: ${(error as Error).message.split("\n")[0]}`);
  }

  let labCounts = { lessons: LAB_VALUES_MODULES.reduce((sum, module) => sum + module.lessons.length, 0), questions: 0, flashcards: 0 };
  if (db) {
    const [questions, flashcards] = await Promise.all([
      safeCount(diagnostics, "Lab ExamQuestion count", () =>
        db.examQuestion!.count({ where: { OR: [{ topic: { contains: "lab", mode: "insensitive" } }, { tags: { has: "lab-values" } }, { tags: { has: "lab-interpretation" } }] } }),
      ),
      safeCount(diagnostics, "Lab Flashcard count", () =>
        db.flashcard!.count({ where: { OR: [{ front: { contains: "lab", mode: "insensitive" } }, { back: { contains: "lab", mode: "insensitive" } }, { sourceKey: { startsWith: "lab:" } }] } }),
      ),
    ]);
    labCounts = { ...labCounts, questions, flashcards };
  }
  const labCard = buildLabModuleOverview({
    enabled: isLabValuesModuleEnabled(),
    lessons: labCounts.lessons,
    questions: labCounts.questions,
    flashcards: labCounts.flashcards,
    adultRangeCoverage: LAB_VALUES_MODULES.some((module) => module.lessons.length > 0) ? 1 : 0,
    pediatricRangeCoverage: 0,
  });

  const aggregateCards: ContentModuleOverviewCard[] = [
    buildAggregateContentCard({
      key: "lessons",
      title: "Lessons",
      counts: {
        lessons: pathwayCards.reduce((sum, card) => sum + (card.counts.lessons ?? 0), 0),
        publishedLessons: pathwayCards.reduce((sum, card) => sum + (card.counts.publishedLessons ?? 0), 0),
        draftLessons: pathwayCards.reduce((sum, card) => sum + (card.counts.draftLessons ?? 0), 0),
      },
      tierAccess: { RN: true, NP: true, RPN: true, PN: true, ALLIED: true },
      linkedPathways: EXAM_PATHWAYS.map((pathway) => pathway.id),
      adminHref: "/admin/lessons",
      requireLessons: true,
    }),
    buildAggregateContentCard({
      key: "flashcards",
      title: "Flashcards",
      counts: {
        flashcards: pathwayCards.reduce((sum, card) => sum + (card.counts.flashcards ?? 0), 0),
        publishedFlashcards: pathwayCards.reduce((sum, card) => sum + (card.counts.publishedFlashcards ?? 0), 0),
        draftFlashcards: pathwayCards.reduce((sum, card) => sum + (card.counts.draftFlashcards ?? 0), 0),
      },
      tierAccess: { RN: true, NP: true, RPN: true, PN: true, ALLIED: true },
      linkedPathways: EXAM_PATHWAYS.map((pathway) => pathway.id),
      adminHref: "/admin/content-coverage",
      requireQuestions: false,
    }),
    buildAggregateContentCard({
      key: "practice-questions",
      title: "Practice questions",
      counts: {
        practiceQuestions: pathwayCards.reduce((sum, card) => sum + (card.counts.practiceQuestions ?? 0), 0),
        publishedPracticeQuestions: pathwayCards.reduce((sum, card) => sum + (card.counts.publishedPracticeQuestions ?? 0), 0),
        draftPracticeQuestions: pathwayCards.reduce((sum, card) => sum + (card.counts.draftPracticeQuestions ?? 0), 0),
      },
      tierAccess: { RN: true, NP: true, RPN: true, PN: true, ALLIED: true },
      linkedPathways: EXAM_PATHWAYS.map((pathway) => pathway.id),
      adminHref: "/admin/questions",
      requireQuestions: true,
    }),
    buildAggregateContentCard({
      key: "cat-question-pools",
      title: "CAT question pools",
      counts: {
        catQuestions: pathwayCards.reduce((sum, card) => sum + (card.counts.catQuestions ?? 0), 0),
        publishedCatQuestions: pathwayCards.reduce((sum, card) => sum + (card.counts.publishedCatQuestions ?? 0), 0),
      },
      tierAccess: { RN: true, NP: true, RPN: true, PN: true, ALLIED: false },
      linkedPathways: EXAM_PATHWAYS.filter((pathway) => pathway.stripeTier !== "ALLIED").map((pathway) => pathway.id),
      adminHref: "/admin/questions",
      requireQuestions: true,
    }),
    buildAggregateContentCard({
      key: "clinical-scenarios",
      title: "Clinical scenarios",
      counts: {
        clinicalScenarios: pathwayCards.reduce((sum, card) => sum + (card.counts.clinicalScenarios ?? 0), 0),
        publishedClinicalScenarios: pathwayCards.reduce((sum, card) => sum + (card.counts.publishedClinicalScenarios ?? 0), 0),
        premium: pathwayCards.reduce((sum, card) => sum + (card.counts.premium ?? 0), 0),
      },
      tierAccess: { RN: true, NP: true, RPN: true, PN: true, ALLIED: false },
      linkedPathways: EXAM_PATHWAYS.filter((pathway) => pathway.stripeTier !== "ALLIED").map((pathway) => pathway.id),
      adminHref: "/admin/clinical-scenarios",
      requireLessons: false,
      requireQuestions: false,
    }),
    buildAggregateContentCard({
      key: "blog-posts",
      title: "Blog posts",
      counts: {
        blogPosts: pathwayCards.reduce((sum, card) => sum + (card.counts.blogPosts ?? 0), 0),
        publishedBlogPosts: pathwayCards.reduce((sum, card) => sum + (card.counts.publishedBlogPosts ?? 0), 0),
      },
      tierAccess: { RN: true, NP: true, RPN: true, PN: true, ALLIED: true },
      linkedPathways: EXAM_PATHWAYS.map((pathway) => pathway.id),
      adminHref: "/admin/blog",
      publicHref: "/blog",
    }),
  ];

  const modules = [...pathwayCards, ecgCard, labCard, ...aggregateCards];
  const needsAttention = [...modules, ...alliedProfessions].filter((card) => card.warnings.length > 0 || card.badges.includes("Needs content") || card.badges.includes("Needs questions")).length;

  return {
    generatedAt: new Date().toISOString(),
    featureFlags: {
      enableEcgModule: isEcgModuleEnabled(),
      enableLabValuesModule: isLabValuesModuleEnabled(),
    },
    summary: {
      totalCards: modules.length + alliedProfessions.length,
      live: [...modules, ...alliedProfessions].filter((card) => card.status === "live").length,
      hiddenOrAdminOnly: [...modules, ...alliedProfessions].filter((card) => card.status === "hidden" || card.status === "admin_only").length,
      needsAttention,
    },
    modules,
    alliedProfessions,
    diagnostics: unique(diagnostics).slice(0, 20),
  };
}
