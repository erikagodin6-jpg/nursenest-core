import {
  buildWeakAreaPlan,
  resolveEcosystemLinks,
  type EcosystemContentType,
  type EcosystemLink,
  type EcosystemPlan,
  type WeakAreaPlan,
} from "@/lib/flashcards/flashcard-ecosystem-resolver";

export type RelatedLearningInput = {
  cardId: string | null;
  topic: string | null;
  subtopic: string | null;
  pathwayId: string | null;
  lessonHref?: string | null;
  lessonTitle?: string | null;
  practiceTopicHref?: string | null;
  practiceTestsTopicHref?: string | null;
  isIncorrect?: boolean;
};

export type RelatedLearningSection = {
  type: EcosystemContentType;
  title: string;
  link: EcosystemLink;
};

const SECTION_TITLES: Record<EcosystemContentType, string> = {
  lesson: "Review Lesson",
  questions: "Practice Questions",
  drill: "Practice Questions",
  pharmacology: "Pharmacology",
  ecg: "ECG",
  simulation: "Simulation",
  "clinical-skill": "Clinical Skills",
  cat: "CAT Practice",
  career: "Professional Practice",
  "new-grad": "New Grad Readiness",
};

function uniqueLinks(links: EcosystemLink[]): EcosystemLink[] {
  const seen = new Set<string>();
  const out: EcosystemLink[] = [];
  for (const link of links) {
    const key = `${link.type}:${link.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(link);
  }
  return out;
}

export function buildRelatedLearningPlan(input: RelatedLearningInput): EcosystemPlan {
  const plan = resolveEcosystemLinks({
    cardId: input.cardId,
    topic: input.topic,
    subtopic: input.subtopic,
    pathwayId: input.pathwayId,
    lessonHref: input.lessonHref,
    lessonTitle: input.lessonTitle,
    practiceTopicHref: input.practiceTopicHref,
    practiceTestsTopicHref: input.practiceTestsTopicHref,
    isIncorrect: input.isIncorrect,
  });
  const all = uniqueLinks(plan.all).filter((link) => Boolean(link.href?.trim()));
  const primary = plan.primary && all.some((link) => link.href === plan.primary?.href && link.type === plan.primary?.type)
    ? plan.primary
    : all[0] ?? null;
  const secondary = all.filter((link) => link !== primary).slice(0, 4);
  return { primary, secondary, all };
}

export function buildContinueLearningSections(plan: EcosystemPlan): RelatedLearningSection[] {
  return plan.all.map((link) => ({
    type: link.type,
    title: SECTION_TITLES[link.type],
    link,
  }));
}

export function buildWeakTopicRemediationPlan(input: {
  topic: string;
  missCount: number;
  totalCount: number;
  pathwayId: string | null;
  lessonHref?: string | null;
  practiceTopicHref?: string | null;
  practiceTestsTopicHref?: string | null;
}): WeakAreaPlan {
  return buildWeakAreaPlan(input);
}

