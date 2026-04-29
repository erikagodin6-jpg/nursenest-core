import type { Prisma } from "@prisma/client";
import { FlashcardItemKind } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { FlashcardStudySelectRow } from "@/lib/flashcards/flashcard-study-serialize";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";
import type { CheckpointQuestion } from "@/lib/lessons/lesson-recall-types";

const MAX_RECALL_CARDS_PER_PATHWAY = 1_200;

function lessonHrefForCatalogLesson(pathwayId: string, lessonSlug: string): string {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    return `/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}&q=${encodeURIComponent(lessonSlug)}`;
  }
  return (
    marketingPathwayLessonDetailPath(pathway, lessonSlug) ??
    `/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}&q=${encodeURIComponent(lessonSlug)}`
  );
}

function categoryForLesson(lesson: PathwayLessonRecord): { name: string; topicCode: string | null } {
  const name = (lesson.system ?? lesson.bodySystem ?? lesson.topic ?? "").trim() || lesson.topic;
  const topicCode = lesson.topicSlug?.trim() ? lesson.topicSlug.trim().toLowerCase() : null;
  return { name, topicCode };
}

function checkpointToFlashcardRow(
  pathwayId: string,
  lesson: PathwayLessonRecord,
  sectionId: string,
  cq: CheckpointQuestion,
): FlashcardStudySelectRow | null {
  const opts = cq.options.slice(0, 4);
  if (opts.length < 3) return null;
  const letters = ["A", "B", "C", "D"] as const;
  const answerOptions = opts.map((o, i) => ({
    letter: letters[i]!,
    text: String(o.text ?? "").trim(),
  }));
  const correctIdx = opts.findIndex((o) => o.id === cq.correctId);
  if (correctIdx < 0 || correctIdx > 3) return null;
  const correctLetter = letters[correctIdx]!;
  const stem = String(cq.question ?? "").trim();
  if (stem.length < 8) return null;
  const rationaleCorrect = String(cq.explanation ?? "").trim();
  if (rationaleCorrect.length < 8) return null;
  const genericWrong =
    "Review the clinical scenario and eliminate options that do not match assessment findings or priority interventions.";
  const rationaleIncorrect = answerOptions
    .filter((o) => o.letter !== correctLetter)
    .map((o) => ({ letter: o.letter, rationale: genericWrong }));

  return {
    id: `lrc:${pathwayId}:${lesson.slug}:${sectionId}:${cq.id}`,
    front: stem,
    back: "",
    sourceKey: `lessonrecall:${pathwayId}:${lesson.slug}:cq:${cq.id}`,
    examItemKind: FlashcardItemKind.CLINICAL,
    questionStem: stem,
    answerOptions: answerOptions as unknown as Prisma.JsonValue,
    correctAnswer: correctLetter,
    rationaleCorrect,
    rationaleIncorrect: rationaleIncorrect as unknown as Prisma.JsonValue,
    category: categoryForLesson(lesson),
    deck: { pathwayId, title: lesson.title },
  };
}

export type LessonRecallFlashcardVirtual = {
  id: string;
  row: FlashcardStudySelectRow;
  lessonSlug: string;
  lessonTitle: string;
  lessonHref: string;
};

/**
 * Deterministic catalog-only flashcards from lesson active-recall (prompts, checkpoints, key facts).
 * Used when published `Flashcard` rows and bank-linked lesson question ids produce an empty deck.
 */
export function collectLessonRecallFlashcardsForPathway(pathwayId: string): LessonRecallFlashcardVirtual[] {
  const pid = pathwayId?.trim();
  if (!pid) return [];

  const lessons = getCatalogPathwayLessonsSync(pid);
  const out: LessonRecallFlashcardVirtual[] = [];

  for (const lesson of lessons) {
    if (out.length >= MAX_RECALL_CARDS_PER_PATHWAY) break;
    const href = lessonHrefForCatalogLesson(pid, lesson.slug);
    const cat = categoryForLesson(lesson);

    for (const section of lesson.sections ?? []) {
      if (out.length >= MAX_RECALL_CARDS_PER_PATHWAY) break;
      const sid = section.id || "section";

      for (const rp of section.recallPrompts ?? []) {
        if (out.length >= MAX_RECALL_CARDS_PER_PATHWAY) break;
        const prompt = String(rp.prompt ?? "").trim();
        const answer = String(rp.answer ?? "").trim();
        if (prompt.length < 4 || answer.length < 2) continue;
        const id = `lrp:${pid}:${lesson.slug}:${sid}:${rp.id}`;
        const explanation = String(rp.explanation ?? "").trim();
        const row: FlashcardStudySelectRow = {
          id,
          front: prompt,
          back: answer,
          sourceKey: `lessonrecall:${pid}:${lesson.slug}:rp:${rp.id}`,
          examItemKind: null,
          questionStem: null,
          answerOptions: null,
          correctAnswer: null,
          rationaleCorrect: explanation.length >= 8 ? explanation : null,
          rationaleIncorrect: null,
          category: cat,
          deck: { pathwayId: pid, title: lesson.title },
        };
        out.push({ id, row, lessonSlug: lesson.slug, lessonTitle: lesson.title, lessonHref: href });
      }

      for (const kf of section.keyRecallFacts ?? []) {
        if (out.length >= MAX_RECALL_CARDS_PER_PATHWAY) break;
        const fact = String(kf.fact ?? "").trim();
        if (fact.length < 4) continue;
        const label = String(kf.label ?? "").trim();
        const id = `lrf:${pid}:${lesson.slug}:${sid}:${kf.id}`;
        const row: FlashcardStudySelectRow = {
          id,
          front: label.length >= 2 ? `${label} — recall` : "Key recall",
          back: fact,
          sourceKey: `lessonrecall:${pid}:${lesson.slug}:kf:${kf.id}`,
          examItemKind: null,
          questionStem: null,
          answerOptions: null,
          correctAnswer: null,
          rationaleCorrect: `Key recall fact — expand in the lesson context for ${lesson.title}.`,
          rationaleIncorrect: null,
          category: cat,
          deck: { pathwayId: pid, title: lesson.title },
        };
        out.push({ id, row, lessonSlug: lesson.slug, lessonTitle: lesson.title, lessonHref: href });
      }

      for (const cq of section.checkpointQuestions ?? []) {
        if (out.length >= MAX_RECALL_CARDS_PER_PATHWAY) break;
        const row = checkpointToFlashcardRow(pid, lesson, sid, cq);
        if (!row) continue;
        out.push({
          id: row.id,
          row,
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          lessonHref: href,
        });
      }
    }

    let takeawayIdx = 0;
    for (const raw of lesson.studyTakeaways ?? []) {
      if (out.length >= MAX_RECALL_CARDS_PER_PATHWAY) break;
      const line = String(raw ?? "").trim();
      if (line.length < 10) continue;
      const id = `ltk:${pid}:${lesson.slug}:tk:${takeawayIdx}`;
      takeawayIdx += 1;
      const row: FlashcardStudySelectRow = {
        id,
        front: `${lesson.title} — key point`,
        back: line,
        sourceKey: `lessontakeaway:${pid}:${lesson.slug}:${takeawayIdx}`,
        examItemKind: null,
        questionStem: null,
        answerOptions: null,
        correctAnswer: null,
        rationaleCorrect: `Study takeaway for ${lesson.title} — revisit the linked lesson for clinical nuance.`,
        rationaleIncorrect: null,
        category: cat,
        deck: { pathwayId: pid, title: lesson.title },
      };
      out.push({ id, row, lessonSlug: lesson.slug, lessonTitle: lesson.title, lessonHref: href });
    }

    const anchor = String(lesson.memoryAnchor ?? "").trim();
    if (anchor.length >= 10 && out.length < MAX_RECALL_CARDS_PER_PATHWAY) {
      const id = `lta:${pid}:${lesson.slug}`;
      const row: FlashcardStudySelectRow = {
        id,
        front: `${lesson.title} — memory anchor`,
        back: anchor,
        sourceKey: `lessonanchor:${pid}:${lesson.slug}`,
        examItemKind: null,
        questionStem: null,
        answerOptions: null,
        correctAnswer: null,
        rationaleCorrect: `Memory anchor — use this as the “if nothing else sticks” line for ${lesson.title}.`,
        rationaleIncorrect: null,
        category: cat,
        deck: { pathwayId: pid, title: lesson.title },
      };
      out.push({ id, row, lessonSlug: lesson.slug, lessonTitle: lesson.title, lessonHref: href });
    }
  }

  return out;
}
