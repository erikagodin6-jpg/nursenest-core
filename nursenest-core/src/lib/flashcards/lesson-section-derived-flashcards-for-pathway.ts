import { stripToPlainText } from "@/lib/content-quality/plain-text";
import type { FlashcardStudySelectRow } from "@/lib/flashcards/flashcard-study-serialize";
import { buildAppLessonsReviewLessonHref } from "@/lib/learner/app-study-internal-links";
import { lessonBodyHasGenericFiller } from "@/lib/lessons/lesson-content-depth-schema";
import { pathwayLessonEligibleForLearnerStudyInventory } from "@/lib/learner-study-hub/pathway-lesson-learner-study-guards";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
const MAX_SECTION_CARDS_PER_PATHWAY = 2_400;

export type LessonSectionDerivedVirtual = {
  id: string;
  row: FlashcardStudySelectRow;
  lessonSlug: string;
  lessonTitle: string;
  lessonHref: string;
  sourceSectionKind: string;
  cardTypeTag: string;
  /** True when any slice of source body matched generic filler patterns (audit only). */
  derivedFromGenericFillerBody: boolean;
};

const SECTION_KINDS_FOR_DERIVATION = new Set<string>([
  "pathophysiology_overview",
  "signs_symptoms",
  "labs_diagnostics",
  "nursing_assessment_interventions",
  "treatments",
  "pharmacology",
  "clinical_decision_making",
  "complications",
  "clinical_pearls",
  "client_education",
  "case_study",
  "linked_flashcard_prompts",
]);

const KIND_TO_CARD_TYPE: Record<string, string> = {
  pathophysiology_overview: "pathophysiology_recall",
  signs_symptoms: "signs_symptoms_recognition",
  labs_diagnostics: "diagnostics_labs_interpretation",
  nursing_assessment_interventions: "nursing_intervention_priority",
  treatments: "nursing_intervention_priority",
  pharmacology: "pharmacology_safety",
  clinical_decision_making: "clinical_pearl_nclex_trap",
  complications: "complication_recognition",
  clinical_pearls: "clinical_pearl_nclex_trap",
  client_education: "client_education",
  case_study: "case_based_application",
  linked_flashcard_prompts: "author_linked_prompt",
};

const KIND_TO_DIFFICULTY: Record<string, number> = {
  introduction: 2,
  pathophysiology_overview: 3,
  signs_symptoms: 3,
  labs_diagnostics: 4,
  nursing_assessment_interventions: 3,
  treatments: 3,
  pharmacology: 4,
  clinical_decision_making: 4,
  complications: 4,
  clinical_pearls: 4,
  client_education: 3,
  case_study: 4,
  linked_flashcard_prompts: 3,
};

function lessonHrefForCatalogLesson(pathwayId: string, lessonSlug: string): string {
  return buildAppLessonsReviewLessonHref(pathwayId, lessonSlug);
}

function categoryForLesson(lesson: PathwayLessonRecord): { name: string; topicCode: string | null } {
  const name = (lesson.system ?? lesson.bodySystem ?? lesson.topic ?? "").trim() || lesson.topic;
  const topicCode = lesson.topicSlug?.trim() ? lesson.topicSlug.trim().toLowerCase() : null;
  return { name, topicCode };
}

function textHash(s: string): string {
  let h = 2166136261;
  const cap = Math.min(s.length, 240);
  for (let i = 0; i < cap; i += 1) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

function buildLessonLinkSourceKey(args: {
  pathwayId: string;
  lessonSlug: string;
  sectionKind: string;
  cardType: string;
  difficulty: number;
  hash: string;
}): string {
  const { pathwayId, lessonSlug, sectionKind, cardType, difficulty, hash } = args;
  return `lessonlink:v1|${pathwayId}|${lessonSlug}|${sectionKind}|${cardType}|${difficulty}|${hash}`;
}

function parseLinkedFlashcardPromptPairs(body: string): Array<{ q: string; a: string; rationale: string }> {
  const plain = stripToPlainText(body);
  const out: Array<{ q: string; a: string; rationale: string }> = [];
  const seen = new Set<string>();

  for (const block of plain.split(/\n{2,}/)) {
    const b = block.trim();
    if (b.length < 20) continue;
    const qIdx = b.indexOf("?");
    if (qIdx >= 15 && qIdx < 500) {
      const q = b.slice(0, qIdx + 1).trim();
      const a = b.slice(qIdx + 1).trim();
      if (q.length >= 15 && a.length >= 12 && !lessonBodyHasGenericFiller(q) && !lessonBodyHasGenericFiller(a)) {
        const k = `${q.slice(0, 80)}`;
        if (!seen.has(k)) {
          seen.add(k);
          out.push({ q, a, rationale: `Linked flashcard prompt block for this lesson.` });
        }
      }
    }
  }

  for (const line of plain.split("\n")) {
    const m = line.match(/^\s*(?:\d+[.)]|[*•-])\s*(.+?\?)\s+(.{12,})$/);
    if (m) {
      const q = m[1]!.trim();
      const a = m[2]!.trim();
      if (!lessonBodyHasGenericFiller(q) && !lessonBodyHasGenericFiller(a)) {
        const k = q.slice(0, 80);
        if (!seen.has(k)) {
          seen.add(k);
          out.push({ q, a, rationale: `Parsed from authored linked flashcard prompt list.` });
        }
      }
    }
  }

  return out;
}

function extractBulletLines(body: string): string[] {
  const plain = stripToPlainText(body);
  const lines = plain.split(/\n/).map((l) => l.trim());
  const bullets: string[] = [];
  for (const line of lines) {
    const m = line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
    if (m && m[1]) {
      const t = m[1].trim();
      if (t.length >= 28 && t.length <= 520) bullets.push(t);
    }
  }
  return bullets;
}

function sentencesFromBody(body: string, max: number): string[] {
  const plain = stripToPlainText(body);
  const parts = plain.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length >= 45);
  return parts.slice(0, max);
}

function pushSectionCards(args: {
  pathwayId: string;
  lesson: PathwayLessonRecord;
  section: PathwayLessonSection;
  href: string;
  cat: { name: string; topicCode: string | null };
  out: LessonSectionDerivedVirtual[];
  stemSeen: Set<string>;
}): void {
  const { pathwayId, lesson, section, href, cat, out, stemSeen } = args;
  const kind = String(section.kind);
  if (!SECTION_KINDS_FOR_DERIVATION.has(kind)) return;

  const cardType = KIND_TO_CARD_TYPE[kind] ?? "clinical_pearl_nclex_trap";
  const difficulty = KIND_TO_DIFFICULTY[kind] ?? 3;
  const fillerBody = lessonBodyHasGenericFiller(section.body);

  const pushOne = (front: string, back: string, rationale: string, hashSeed: string) => {
    if (out.length >= MAX_SECTION_CARDS_PER_PATHWAY) return;
    if (front.length < 12 || back.length < 8) return;
    if (lessonBodyHasGenericFiller(front) || lessonBodyHasGenericFiller(back)) return;
    const nk = front.trim().toLowerCase().slice(0, 96);
    if (stemSeen.has(nk)) return;
    stemSeen.add(nk);
    const h = textHash(`${lesson.slug}|${kind}|${hashSeed}`);
    const sourceKey = buildLessonLinkSourceKey({
      pathwayId,
      lessonSlug: lesson.slug,
      sectionKind: kind,
      cardType,
      difficulty,
      hash: h,
    });
    const id = `lls:${pathwayId}:${lesson.slug}:${kind}:${h}`;
    const row: FlashcardStudySelectRow = {
      id,
      front,
      back,
      sourceKey,
      examItemKind: null,
      questionStem: null,
      answerOptions: null,
      correctAnswer: null,
      rationaleCorrect: rationale.length >= 8 ? rationale : `See lesson section “${section.heading}” (${kind}).`,
      rationaleIncorrect: null,
      category: cat,
      deck: { pathwayId, title: lesson.title },
    };
    out.push({
      id,
      row,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      lessonHref: href,
      sourceSectionKind: kind,
      cardTypeTag: cardType,
      derivedFromGenericFillerBody: fillerBody,
    });
  };

  if (kind === "linked_flashcard_prompts") {
    for (const pair of parseLinkedFlashcardPromptPairs(section.body)) {
      pushOne(pair.q, pair.a, pair.rationale, pair.q);
    }
    return;
  }

  if (fillerBody) return;

  const bullets = extractBulletLines(section.body);
  const cap = kind === "case_study" ? 6 : 4;
  for (let i = 0; i < Math.min(cap, bullets.length); i += 1) {
    const b = bullets[i]!;
    const stem = `${section.heading.trim() || lesson.title} — apply: ${b.slice(0, 200)}${b.length > 200 ? "…" : ""}`;
    pushOne(
      stem,
      b,
      `Lesson section “${section.heading}” (${kind}). Confirm understanding with your instructor or references if local policy differs.`,
      `${i}:${b.slice(0, 60)}`,
    );
  }

  if (bullets.length === 0) {
    for (const sent of sentencesFromBody(section.body, 3)) {
      const stem = `Clinical recall (${lesson.title}): ${sent.slice(0, 220)}${sent.length > 220 ? "…" : ""}`;
      pushOne(
        stem,
        sent,
        `Drawn from “${section.heading}” (${kind}) in this pathway lesson.`,
        sent.slice(0, 80),
      );
    }
  }
}

/**
 * Deterministic catalog-only flashcards derived from canonical lesson sections (and linked_flashcard_prompts).
 * Complements {@link collectLessonRecallFlashcardsForPathway} (recall arrays) and bank-linked lesson questions.
 */
export function collectLessonSectionDerivedFlashcardsForPathway(
  pathwayId: string,
  /** When provided, inventory is built from these normalized lessons only (e.g. Prisma PathwayLesson). */
  pathwayLessons?: PathwayLessonRecord[],
): LessonSectionDerivedVirtual[] {
  const pid = pathwayId?.trim();
  if (!pid) return [];

  const lessons =
    pathwayLessons ??
    getCatalogPathwayLessonsSync(pid).filter((l) => pathwayLessonEligibleForLearnerStudyInventory(l));
  const out: LessonSectionDerivedVirtual[] = [];
  const stemSeen = new Set<string>();

  for (const lesson of lessons) {
    if (out.length >= MAX_SECTION_CARDS_PER_PATHWAY) break;
    if (!pathwayLessonEligibleForLearnerStudyInventory(lesson)) continue;
    const href = lessonHrefForCatalogLesson(pid, lesson.slug);
    const cat = categoryForLesson(lesson);

    const sections = lesson.sections ?? [];
    const linkedFirst = sections.filter((s) => String(s.kind) === "linked_flashcard_prompts");
    const rest = sections.filter((s) => String(s.kind) !== "linked_flashcard_prompts");
    const ordered = [...linkedFirst, ...rest];

    for (const section of ordered) {
      if (out.length >= MAX_SECTION_CARDS_PER_PATHWAY) break;
      pushSectionCards({ pathwayId: pid, lesson, section, href, cat, out, stemSeen });
    }
  }

  return out;
}
