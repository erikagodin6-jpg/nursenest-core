import { generateSeo, type GenerateSeoResult } from "@/lib/seo/seo-generator";
import type { SeoContentDomain } from "@/lib/seo/seo-taxonomy-align";
import type { SeoTier } from "@/lib/seo/seo-taxonomy-align";

export type ProgrammaticTaxonomyTopicSection = {
  id: string;
  heading: string;
  /** Authoring brief — not thin; expand into 2–3 short paragraphs + bullets per section. */
  contentBrief: string;
};

export type ProgrammaticTaxonomyTopicPageDraft = {
  patternTitleA: string;
  patternTitleB: string;
  introBrief: string;
  sections: ProgrammaticTaxonomyTopicSection[];
  seo: GenerateSeoResult;
};

/**
 * Non-thin programmatic page scaffold: intro + structured sections + FAQ source (`seo.faq`) + internal link hooks.
 * Pair with {@link resolveRelatedInternalLinks} at publish time.
 */
export function buildProgrammaticTaxonomyTopicPageDraft(input: {
  topic: string;
  category: string;
  domain: SeoContentDomain;
  tier: SeoTier;
  keywords?: string[];
}): ProgrammaticTaxonomyTopicPageDraft {
  const patternTitleA = `${input.topic} Pathophysiology Explained for Nurses`;
  const patternTitleB = `${input.topic}: Symptoms, Causes, Treatment (Nursing Review)`;
  const seo = generateSeo({
    title: patternTitleA,
    category: input.category,
    domain: input.domain,
    tier: input.tier,
    keywords: input.keywords ?? [input.topic],
  });
  const introBrief = `Introduce ${input.topic} in plain language for ${input.tier} learners. State why it matters on exams, what safety risks to watch, and how this page is organized. Avoid promises; keep a calm, clinical teaching tone.`;

  const sections: ProgrammaticTaxonomyTopicSection[] = [
    {
      id: "overview",
      heading: "Overview",
      contentBrief: `Define ${input.topic}, who it affects, and the nursing lens (assessment-first, safety, escalation).`,
    },
    {
      id: "pathophysiology",
      heading: "Pathophysiology",
      contentBrief: `Explain mechanisms in exam-relevant depth: triggers, compensatory responses, and key differentials without overclaiming.`,
    },
    {
      id: "assessment",
      heading: "Assessment & monitoring",
      contentBrief: `Vitals, history cues, red flags, labs/imaging when applicable, and what changes should prompt urgent escalation.`,
    },
    {
      id: "interventions",
      heading: "Nursing interventions",
      contentBrief: `Prioritize airway/breathing/circulation framing where relevant, plus patient education and coordination of care.`,
    },
    {
      id: "exam",
      heading: "Exam-style takeaways",
      contentBrief: `3–6 bullet “if you see X, think Y” patterns plus common distractors and safe elimination habits.`,
    },
  ];

  return { patternTitleA, patternTitleB, introBrief, sections, seo };
}
