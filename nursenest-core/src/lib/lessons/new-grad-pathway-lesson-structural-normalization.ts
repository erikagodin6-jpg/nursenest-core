import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import { PREMIUM_MIN_WORDS, SUBSTANTIVE_PREMIUM_SECTION_MIN_PLAIN_CHARS } from "@/lib/lessons/pathway-lesson-premium";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

const NEW_GRAD_PATHWAY_IDS = new Set(["us-rn-new-grad-transition"]);

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

function sectionsTextByKind(sections: PathwayLessonSection[], kind: string): string {
  return sections.find((section) => section.kind === kind)?.body?.trim() ?? "";
}

function upsertSection(sections: PathwayLessonSection[], section: PathwayLessonSection): PathwayLessonSection[] {
  const index = sections.findIndex((candidate) => candidate.kind === section.kind);
  if (index === -1) return [...sections, section];

  const existing = sections[index]!;
  const existingPlain = stripToPlainText(existing.body ?? "").replace(/\s+/g, " ").trim();
  if (existingPlain.length >= SUBSTANTIVE_PREMIUM_SECTION_MIN_PLAIN_CHARS) return sections;

  const next = [...sections];
  next[index] = {
    ...existing,
    heading: existing.heading?.trim() || section.heading,
    body: existing.body?.trim() || section.body,
  };
  return next;
}

function buildNewGradRedFlagsSection(input: {
  title: string;
  sections: PathwayLessonSection[];
}): PathwayLessonSection {
  const signs = sectionsTextByKind(input.sections, "signs_symptoms");
  const priorities = sectionsTextByKind(input.sections, "clinical_decision_making");
  const complications = sectionsTextByKind(input.sections, "complications");
  const caseStudy = sectionsTextByKind(input.sections, "case_study");

  const body = [
    `For **${input.title}**, treat rapid deterioration, airway or breathing compromise, new confusion, uncontrolled bleeding, hemodynamic instability, or any sudden change from the last handoff as immediate escalation triggers. New grad workflow should always default to ABCs, bedside reassessment, and calling for help early when the picture stops matching report.`,
    signs ? `**What looks wrong early**  ${excerptPlainText(signs, 36)}` : "",
    priorities ? `**What you do first**  ${excerptPlainText(priorities, 38)}` : "",
    complications ? `**Why delay is dangerous**  ${excerptPlainText(complications, 30)}` : "",
    caseStudy ? `**Pattern recognition**  ${excerptPlainText(caseStudy, 26)}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    id: "red_flags",
    heading: "Red Flags / Danger Signs",
    kind: "red_flags",
    body,
  };
}

export function isNewGradTransitionPathwayId(pathwayId: string): boolean {
  return NEW_GRAD_PATHWAY_IDS.has(pathwayId);
}

export function applyNewGradStructuralCompletion(input: {
  lessonSlug: string;
  title: string;
  pathwayId: string;
  sections: PathwayLessonSection[];
}): {
  sections: PathwayLessonSection[];
} {
  if (!isNewGradTransitionPathwayId(input.pathwayId)) {
    return { sections: input.sections };
  }

  let sections = [...input.sections];
  sections = upsertSection(
    sections,
    buildNewGradRedFlagsSection({
      title: input.title,
      sections,
    }),
  );

  const redFlags = sectionsTextByKind(sections, "red_flags");
  if (normalizedWordCount(redFlags) < PREMIUM_MIN_WORDS.red_flags) {
    return { sections: input.sections };
  }

  return { sections };
}
