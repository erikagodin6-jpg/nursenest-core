/**
 * Premium **clinical casebook** lessons — vignette-first case studies mapped through
 * {@link synthesizeCaseStudyCasebookSections} for RN, PN/LPN/RPN, and NP pathways.
 */
import type {
  PathwayLessonOmittedPremiumSection,
  PathwayLessonQuizItem,
  PathwayLessonRelatedRef,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";
import {
  ensurePremiumSeoDescription,
  PATHWAY_EXAM_LABEL,
  pathwayIdToTierGeo,
  synthesizeCaseStudyCasebookSections,
} from "@/lib/lessons/scoped-lessons/gold-premium-synthesis";
import { WAVE1_PATHWAY_VARIANT, type Wave1VariantKey } from "@/lib/lessons/scoped-lessons/launch-wave-1-shared";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export type CaseStudyVariantBlock = {
  title: string;
  seoTitle: string;
  seoDescription: string;
  scenarioSetup: string;
  clinical_meaning: string;
  exam_relevance: string;
  whatMattersMostEscalation: string;
  prioritizationNextActions: string;
  rationaleDecisions: string;
  escalationSafetyTeaching: string;
  takeaways: string;
  /** Optional override; defaults to lesson `sharedKeyFindings`. */
  keyFindingsSignsSymptoms?: string;
};

export type CaseStudyLessonSpec = {
  slug: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  pathophysiologyCore: string;
  sharedKeyFindings: string;
  labsDiagnostics?: string;
  labsOmitReason?: string;
  relatedSlugs: string[];
  relatedTitlesBySlug: Record<string, string>;
  npTitleStem: string;
  npSeoDescription: string;
  variants: Record<Wave1VariantKey, CaseStudyVariantBlock>;
  preTest: PathwayLessonQuizItem[];
  postTest: PathwayLessonQuizItem[];
};

type LessonInputShape = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  preTest: PathwayLessonQuizItem[];
  postTest: PathwayLessonQuizItem[];
  premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
  relatedLessonRefs?: PathwayLessonRelatedRef[];
};

function applyNpDisplay(
  pathwayId: string,
  stem: string,
  seoDescription: string,
  v: CaseStudyVariantBlock,
): CaseStudyVariantBlock {
  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);
  return {
    ...v,
    title: `${stem} (${suf})`,
    seoTitle: `${stem} | ${lab} US | NurseNest`,
    seoDescription,
  };
}

export function buildCaseStudyLessonInput(spec: CaseStudyLessonSpec, pathwayId: string): LessonInputShape | null {
  const key = WAVE1_PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  const geo = pathwayIdToTierGeo(pathwayId);
  if (!geo) return null;
  let v = spec.variants[key];
  if (key === "us_np") {
    v = applyNpDisplay(pathwayId, spec.npTitleStem, spec.npSeoDescription, v);
  }
  const keyFindings = v.keyFindingsSignsSymptoms?.trim() || spec.sharedKeyFindings;
  const syn = synthesizeCaseStudyCasebookSections({
    tierGeo: geo,
    examLabel: PATHWAY_EXAM_LABEL[pathwayId] ?? "your nursing licensure exam",
    scenarioSetup: v.scenarioSetup,
    clinical_meaning: v.clinical_meaning,
    exam_relevance: v.exam_relevance,
    pathophysiologyCore: spec.pathophysiologyCore,
    keyFindingsSignsSymptoms: keyFindings,
    whatMattersMostEscalation: v.whatMattersMostEscalation,
    prioritizationNextActions: v.prioritizationNextActions,
    rationaleDecisions: v.rationaleDecisions,
    escalationSafetyTeaching: v.escalationSafetyTeaching,
    takeaways: v.takeaways,
    labsDiagnostics: spec.labsDiagnostics,
    labsOmitReason: spec.labsOmitReason,
    relatedSlugs: spec.relatedSlugs,
    relatedTitlesBySlug: spec.relatedTitlesBySlug,
  });
  return {
    slug: spec.slug,
    title: v.title,
    topic: spec.topic,
    topicSlug: spec.topicSlug,
    bodySystem: spec.bodySystem,
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: ensurePremiumSeoDescription(v.seoDescription, PATHWAY_EXAM_LABEL[pathwayId] ?? pathwayId),
    sections: syn.sections,
    premiumOmittedSections: syn.premiumOmittedSections,
    relatedLessonRefs: syn.relatedLessonRefs,
    preTest: spec.preTest,
    postTest: spec.postTest,
  };
}

export function caseStudyHubRow(
  spec: CaseStudyLessonSpec,
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = buildCaseStudyLessonInput(spec, pathwayId);
  if (!full) return null;
  return {
    slug: full.slug,
    title: full.title,
    topic: full.topic,
    topicSlug: full.topicSlug,
    bodySystem: full.bodySystem,
    previewSectionCount: full.previewSectionCount,
    seoTitle: full.seoTitle,
    seoDescription: full.seoDescription,
  };
}

export type CaseStudyScopedGoldProvider = {
  slug: string;
  topicSlug: string;
  getFullLesson: (pathwayId: string) => ReturnType<typeof buildCaseStudyLessonInput>;
  getHubListRow: (pathwayId: string) => ReturnType<typeof caseStudyHubRow>;
};

export function caseStudyProviderFromSpec(spec: CaseStudyLessonSpec): CaseStudyScopedGoldProvider {
  return {
    slug: spec.slug,
    topicSlug: spec.topicSlug,
    getFullLesson: (pathwayId: string) => buildCaseStudyLessonInput(spec, pathwayId),
    getHubListRow: (pathwayId: string) => caseStudyHubRow(spec, pathwayId),
  };
}
