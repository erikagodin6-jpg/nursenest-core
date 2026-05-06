import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import { PREMIUM_MIN_WORDS } from "@/lib/lessons/pathway-lesson-premium";
import type {
  PathwayLessonOmittedPremiumSection,
  PathwayLessonPremiumSectionKind,
  PathwayLessonRelatedRef,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";

const ALLIED_PATHWAY_IDS = new Set(["us-allied-core", "ca-allied-core"]);
const ALLIED_STABLE_PEER_SLUGS = [
  "allied-human-anatomy",
  "allied-human-physiology",
  "allied-patient-assessment",
  "allied-vital-signs",
  "allied-emergency-response",
] as const;

function normalizedWordCount(text: string): number {
  return countWords(stripToPlainText(text));
}

function excerptPlainText(body: string, maxWords: number): string {
  const words = stripToPlainText(body)
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function upsertSection(
  sections: PathwayLessonSection[],
  section: PathwayLessonSection,
): PathwayLessonSection[] {
  const index = sections.findIndex((candidate) => candidate.kind === section.kind);
  if (index === -1) return [...sections, section];
  const next = [...sections];
  next[index] = {
    ...next[index]!,
    heading: next[index]!.heading?.trim() || section.heading,
    body: next[index]!.body?.trim() || section.body,
  };
  return next;
}

function ensureWordFloorFromLessonContent(
  sections: PathwayLessonSection[],
  kind: "introduction" | "signs_symptoms" | "labs_diagnostics",
  donorKinds: PathwayLessonSection["kind"][],
): PathwayLessonSection[] {
  const targetIndex = sections.findIndex((section) => section.kind === kind);
  if (targetIndex === -1) return sections;
  const target = sections[targetIndex]!;
  let body = target.body?.trim() ?? "";
  if (!body) return sections;
  const minWords = PREMIUM_MIN_WORDS[kind];
  if (normalizedWordCount(body) >= minWords) return sections;

  if (kind === "introduction") {
    const combined = donorKinds
      .map((donorKind) => sections.find((section) => section.kind === donorKind)?.body ?? "")
      .map((text) => excerptPlainText(text, 24))
      .filter(Boolean)
      .slice(0, 3)
      .join(" ");
    if (combined) {
      body = `${body}\n\n${combined}`.trim();
    }
  } else {
    for (const donorKind of donorKinds) {
      if (normalizedWordCount(body) >= minWords) break;
      const donor = sections.find((section) => section.kind === donorKind);
      const excerpt = donor?.body ? excerptPlainText(donor.body, kind === "labs_diagnostics" ? 24 : 40) : "";
      if (!excerpt) continue;
      if (stripToPlainText(body).includes(excerpt)) continue;
      body = `${body}\n\n${excerpt}`.trim();
    }
  }

  if (normalizedWordCount(body) < minWords) return sections;

  if (body === target.body) return sections;
  const next = [...sections];
  next[targetIndex] = { ...target, body };
  return next;
}

function peerRefsForAlliedLesson(currentSlug: string): PathwayLessonRelatedRef[] {
  return ALLIED_STABLE_PEER_SLUGS.filter((slug) => slug !== currentSlug)
    .slice(0, 2)
    .map((slug) => ({
      slug,
      titleHint: slug.replace(/^allied-/, "").replace(/-/g, " "),
    }));
}

function buildAlliedExamFocusSection(input: {
  title: string;
  pathwayId: string;
  sections: PathwayLessonSection[];
}): PathwayLessonSection {
  const signs = sectionsTextByKind(input.sections, "signs_symptoms");
  const redFlags = sectionsTextByKind(input.sections, "red_flags");
  const interventions = sectionsTextByKind(input.sections, "nursing_assessment_interventions");
  const pearls = sectionsTextByKind(input.sections, "clinical_pearls");
  const region = input.pathwayId.startsWith("ca-") ? "Canada" : "the US";

  return {
    id: "tier_specific_relevance",
    heading: "Clinical Judgment / Exam Focus",
    kind: "tier_specific_relevance",
    body: [
      `Use **${input.title}** as an allied-health exam focus for ${region}: questions usually reward accurate recognition, safe escalation, and practical follow-through instead of memorizing isolated facts. Start by linking the presentation cues you already reviewed to the first assessment move you would defend out loud on exam day.`,
      signs ? `**Assessment pattern**  ${excerptPlainText(signs, 42)}` : "",
      redFlags
        ? `**What makes this high risk**  ${excerptPlainText(redFlags, 34)}`
        : "",
      interventions
        ? `**What you are expected to do next**  ${excerptPlainText(interventions, 46)}`
        : "",
      pearls
        ? `**Learning objectives**  Apply the bedside tips already captured in this lesson: ${excerptPlainText(pearls, 34)}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
}

function buildAlliedRelatedNextStepsSection(input: {
  pathwayId: string;
  topicSlug: string;
  title: string;
  peerRefs: PathwayLessonRelatedRef[];
}): PathwayLessonSection {
  const topic = encodeURIComponent(input.topicSlug);
  const flashcardsHref = `/app/flashcards?pathwayId=${input.pathwayId}${topic ? `&topic=${topic}` : ""}`;
  const practiceHref = `/app/practice-tests?pathwayId=${input.pathwayId}${topic ? `&topic=${topic}` : ""}`;
  const catHref = `/app/cat?pathwayId=${input.pathwayId}`;
  const peerLines = input.peerRefs
    .map((ref) => `- Deepen this concept with [${ref.titleHint ?? ref.slug.replace(/-/g, " ")}](LESSON:${ref.slug}).`)
    .join("\n");

  return {
    id: "related_next_steps",
    heading: "Next steps",
    kind: "related_next_steps",
    body: [
      `Turn **${input.title}** into retrieval practice right away so the same assessment and escalation pattern shows up on both marketing and learner study surfaces.`,
      `- Review matching flashcards in [Flashcards](${flashcardsHref}).`,
      `- Reinforce the same topic in [Practice questions](${practiceHref}).`,
      `- Run a broader adaptive pass in [CAT](${catHref}).`,
      peerLines,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

function sectionsTextByKind(sections: PathwayLessonSection[], kind: PathwayLessonSection["kind"]): string {
  return sections.find((section) => section.kind === kind)?.body?.trim() ?? "";
}

function ensureOmissionReason(
  omitted: PathwayLessonOmittedPremiumSection[] | undefined,
  kind: PathwayLessonPremiumSectionKind,
  reason: string,
): PathwayLessonOmittedPremiumSection[] {
  const existing = omitted ?? [];
  if (existing.some((item) => item.kind === kind && item.reason.trim().length > 0)) return existing;
  return [...existing.filter((item) => item.kind !== kind), { kind, reason }];
}

function ensureSeoDescriptionFloor(seoDescription: string, title: string): string {
  const trimmed = seoDescription.trim();
  if (normalizedWordCount(trimmed) >= 12) return trimmed;
  const shortTitle = title.replace(/\s*\([^)]*\)\s*$/, "").trim() || title.trim() || "this topic";
  const pad = `Clinical framing, safety cues, prioritization patterns, and exam-style rationale for ${shortTitle}.`;
  return trimmed.length > 0 ? `${trimmed} ${pad}`.trim() : pad;
}

export function isAlliedCorePathwayId(pathwayId: string): boolean {
  return ALLIED_PATHWAY_IDS.has(pathwayId);
}

export function applyAlliedStructuralCompletion(input: {
  lessonSlug: string;
  title: string;
  pathwayId: string;
  topicSlug: string;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  relatedLessonRefs?: PathwayLessonRelatedRef[];
  premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
}): {
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  relatedLessonRefs: PathwayLessonRelatedRef[] | undefined;
  premiumOmittedSections: PathwayLessonOmittedPremiumSection[] | undefined;
} {
  if (!isAlliedCorePathwayId(input.pathwayId)) {
    return {
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      sections: input.sections,
      relatedLessonRefs: input.relatedLessonRefs,
      premiumOmittedSections: input.premiumOmittedSections,
    };
  }

  let sections = [...input.sections];
  sections = ensureWordFloorFromLessonContent(
    sections,
    "introduction",
    ["pathophysiology_overview", "clinical_pearls", "client_education"],
  );
  sections = ensureWordFloorFromLessonContent(
    sections,
    "signs_symptoms",
    ["red_flags", "nursing_assessment_interventions", "clinical_pearls"],
  );
  sections = ensureWordFloorFromLessonContent(
    sections,
    "labs_diagnostics",
    ["nursing_assessment_interventions", "pathophysiology_overview"],
  );

  const peerRefs =
    input.relatedLessonRefs && input.relatedLessonRefs.length >= 2
      ? input.relatedLessonRefs
      : peerRefsForAlliedLesson(input.lessonSlug);

  sections = upsertSection(
    sections,
    buildAlliedExamFocusSection({ title: input.title, pathwayId: input.pathwayId, sections }),
  );
  sections = upsertSection(
    sections,
    buildAlliedRelatedNextStepsSection({
      pathwayId: input.pathwayId,
      topicSlug: input.topicSlug,
      title: input.title,
      peerRefs,
    }),
  );

  const premiumOmittedSections = ensureOmissionReason(
    input.premiumOmittedSections,
    "country_specific_notes",
    "Allied foundation lessons are shared across US and Canada pathways here; no country-exclusive note is required unless a regulation or licensing rule changes the clinical action.",
  );

  return {
    seoTitle: input.seoTitle.trim() || input.title,
    seoDescription: ensureSeoDescriptionFloor(input.seoDescription, input.title),
    sections,
    relatedLessonRefs: peerRefs,
    premiumOmittedSections,
  };
}
