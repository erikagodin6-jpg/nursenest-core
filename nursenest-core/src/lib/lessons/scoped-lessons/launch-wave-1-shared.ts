/**
 * Shared builder for Launch Wave 1 high-yield scoped gold lessons (see `launch-wave-1a/b-high-yield-gold.ts`).
 * Mirrors sepsis/COPD pathway coverage: US PN, CA RPN, US RN, CA RN, and all US NP tracks (FNP/AGPCNP/PMHNP).
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
  synthesizeGoldPremiumSections,
} from "@/lib/lessons/scoped-lessons/gold-premium-synthesis";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export type Wave1VariantKey = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

export const WAVE1_PATHWAY_VARIANT: Record<string, Wave1VariantKey> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

export type Wave1VariantBlock = {
  title: string;
  seoTitle: string;
  seoDescription: string;
  clinical_meaning: string;
  exam_relevance: string;
  clinical_scenario: string;
  takeaways: string;
};

export type Wave1LessonSpec = {
  slug: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  sharedCore: string;
  labsDiagnostics?: string;
  labsOmitReason?: string;
  relatedSlugs: string[];
  relatedTitlesBySlug: Record<string, string>;
  /** Short stem for NP titles, e.g. "DKA & HHS risk" */
  npTitleStem: string;
  npSeoDescription: string;
  variants: Record<Wave1VariantKey, Wave1VariantBlock>;
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

function applyNpDisplay(pathwayId: string, stem: string, seoDescription: string, v: Wave1VariantBlock): Wave1VariantBlock {
  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);
  return {
    ...v,
    title: `${stem} (${suf})`,
    seoTitle: `${stem} | ${lab} US | NurseNest`,
    seoDescription,
  };
}

export function buildWave1LessonInput(spec: Wave1LessonSpec, pathwayId: string): LessonInputShape | null {
  const key = WAVE1_PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  const geo = pathwayIdToTierGeo(pathwayId);
  if (!geo) return null;
  let v = spec.variants[key];
  if (key === "us_np") {
    v = applyNpDisplay(pathwayId, spec.npTitleStem, spec.npSeoDescription, v);
  }
  const syn = synthesizeGoldPremiumSections({
    sharedCore: spec.sharedCore,
    clinical_meaning: v.clinical_meaning,
    exam_relevance: v.exam_relevance,
    clinical_scenario: v.clinical_scenario,
    takeaways: v.takeaways,
    tierGeo: geo,
    examLabel: PATHWAY_EXAM_LABEL[pathwayId] ?? "your nursing licensure exam",
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

export function wave1HubRow(
  spec: Wave1LessonSpec,
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = buildWave1LessonInput(spec, pathwayId);
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

/** Registry-compatible provider (see `scoped-gold-registry.ts`). */
export type Wave1ScopedGoldProvider = {
  slug: string;
  topicSlug: string;
  getFullLesson: (pathwayId: string) => ReturnType<typeof buildWave1LessonInput>;
  getHubListRow: (pathwayId: string) => ReturnType<typeof wave1HubRow>;
};

export function wave1ProviderFromSpec(spec: Wave1LessonSpec): Wave1ScopedGoldProvider {
  return {
    slug: spec.slug,
    topicSlug: spec.topicSlug,
    getFullLesson: (pathwayId: string) => buildWave1LessonInput(spec, pathwayId),
    getHubListRow: (pathwayId: string) => wave1HubRow(spec, pathwayId),
  };
}
