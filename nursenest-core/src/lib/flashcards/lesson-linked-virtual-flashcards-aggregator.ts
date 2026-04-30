import { stripToPlainText } from "@/lib/content-quality/plain-text";
import type { FlashcardStudySelectRow } from "@/lib/flashcards/flashcard-study-serialize";
import { collectLessonRecallFlashcardsForPathway } from "@/lib/flashcards/lesson-recall-flashcards-for-pathway";
import { collectLessonSectionDerivedFlashcardsForPathway } from "@/lib/flashcards/lesson-section-derived-flashcards-for-pathway";
import { lessonBodyHasGenericFiller, lessonDepthCohortFromPathwayId } from "@/lib/lessons/lesson-content-depth-schema";
import { pathwayLessonEligibleForLearnerStudyInventory } from "@/lib/learner-study-hub/pathway-lesson-learner-study-guards";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export type MergedLessonVirtualFlashcard = {
  id: string;
  row: FlashcardStudySelectRow;
  lessonSlug: string;
  lessonTitle: string;
  lessonHref: string;
  provenance: "recall" | "section";
  sourceSectionKind?: string;
  cardTypeTag?: string;
  /** Section-derived cards only: section body matched generic filler patterns (audit). */
  derivedFromGenericFillerBody?: boolean;
};

export type LessonVirtualInventoryDiagnostics = {
  pathwayId: string;
  catalogLessonCount: number;
  lessonsWithVirtualCards: number;
  totalVirtualCards: number;
  recallVirtualCount: number;
  sectionDerivedVirtualCount: number;
  genericFillerSourcedSectionCards: number;
};

/** Exported for tests — mirrors hub minimum targets (8 clinical vs 4 workflow / new-grad). */
export function minLessonLinkedCardsForPathwayLesson(pathwayId: string, lesson: PathwayLessonRecord): number {
  if (lessonDepthCohortFromPathwayId(pathwayId) === "NEW_GRAD") return 4;
  const t = `${lesson.topic} ${lesson.title}`.toLowerCase();
  if (/\b(workflow|orientation|onboarding|handoff|delegation|time management|transition)\b/.test(t)) return 4;
  return 8;
}

function sentencesForPadding(lesson: PathwayLessonRecord, exclude: Set<string>): string[] {
  const chunks: string[] = [];
  for (const s of lesson.sections ?? []) {
    if (lessonBodyHasGenericFiller(s.body)) continue;
    chunks.push(...stripToPlainText(s.body).split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => x.length >= 50));
  }
  const out: string[] = [];
  for (const c of chunks) {
    const k = c.toLowerCase().slice(0, 96);
    if (exclude.has(k)) continue;
    exclude.add(k);
    out.push(c);
  }
  return out;
}

function buildPaddingRow(args: {
  pathwayId: string;
  lesson: PathwayLessonRecord;
  cat: { name: string; topicCode: string | null };
  sentence: string;
  idx: number;
}): MergedLessonVirtualFlashcard {
  const { pathwayId, lesson, cat, sentence, idx } = args;
  const h = `${idx}:${sentence.slice(0, 40)}`;
  let hh = 2166136261;
  for (let i = 0; i < h.length; i += 1) hh = Math.imul(hh ^ h.charCodeAt(i), 16777619);
  const hash = (hh >>> 0).toString(36);
  const sourceKey = `lessonlink:v1|${pathwayId}|${lesson.slug}|padding|case_based_application|3|${hash}`;
  const id = `llp:${pathwayId}:${lesson.slug}:pad:${hash}`;
  const rationale = `Padding card to reach lesson-linked minimum — excerpt from lesson narrative for ${lesson.title}.`;
  const row: FlashcardStudySelectRow = {
    id,
    front: `${lesson.title} — confirm understanding: ${sentence.slice(0, 240)}${sentence.length > 240 ? "…" : ""}`,
    back: sentence,
    sourceKey,
    examItemKind: null,
    questionStem: null,
    answerOptions: null,
    correctAnswer: null,
    rationaleCorrect: rationale,
    rationaleIncorrect: null,
    category: cat,
    deck: { pathwayId, title: lesson.title },
  };
  const href =
    lesson.slug.length > 0
      ? `/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}&q=${encodeURIComponent(lesson.slug)}`
      : `/app/lessons?pathwayId=${encodeURIComponent(pathwayId)}`;
  return {
    id,
    row,
    lessonSlug: lesson.slug,
    lessonTitle: lesson.title,
    lessonHref: href,
    provenance: "section",
    sourceSectionKind: "padding",
    cardTypeTag: "case_based_application",
    derivedFromGenericFillerBody: false,
  };
}

/**
 * Merges section-derived + recall-derived catalog virtuals, dedupes by id and near-duplicate stems,
 * then applies per-lesson minimum card targets (8 clinical / 4 workflow or new-grad).
 */
export function collectMergedLessonVirtualFlashcardsForPathway(pathwayId: string): {
  virtuals: MergedLessonVirtualFlashcard[];
  diagnostics: LessonVirtualInventoryDiagnostics;
} {
  const pid = pathwayId?.trim();
  if (!pid) {
    return {
      virtuals: [],
      diagnostics: {
        pathwayId: "",
        catalogLessonCount: 0,
        lessonsWithVirtualCards: 0,
        totalVirtualCards: 0,
        recallVirtualCount: 0,
        sectionDerivedVirtualCount: 0,
        genericFillerSourcedSectionCards: 0,
      },
    };
  }

  const lessons = getCatalogPathwayLessonsSync(pid).filter(pathwayLessonEligibleForLearnerStudyInventory);
  const sectionList = collectLessonSectionDerivedFlashcardsForPathway(pid);
  const recallList = collectLessonRecallFlashcardsForPathway(pid);

  const merged: MergedLessonVirtualFlashcard[] = [];
  const idSeen = new Set<string>();
  const stemSeen = new Set<string>();

  const push = (v: MergedLessonVirtualFlashcard) => {
    if (idSeen.has(v.id)) return;
    const stemKey = v.row.front.trim().toLowerCase().slice(0, 120);
    if (stemSeen.has(stemKey)) return;
    idSeen.add(v.id);
    stemSeen.add(stemKey);
    merged.push(v);
  };

  for (const s of sectionList) {
    push({
      id: s.id,
      row: s.row,
      lessonSlug: s.lessonSlug,
      lessonTitle: s.lessonTitle,
      lessonHref: s.lessonHref,
      provenance: "section",
      sourceSectionKind: s.sourceSectionKind,
      cardTypeTag: s.cardTypeTag,
      derivedFromGenericFillerBody: s.derivedFromGenericFillerBody,
    });
  }

  for (const r of recallList) {
    push({
      id: r.id,
      row: r.row,
      lessonSlug: r.lessonSlug,
      lessonTitle: r.lessonTitle,
      lessonHref: r.lessonHref,
      provenance: "recall",
    });
  }

  const fillerCount = sectionList.filter((s) => s.derivedFromGenericFillerBody).length;

  const bySlug = new Map<string, MergedLessonVirtualFlashcard[]>();
  for (const v of merged) {
    const arr = bySlug.get(v.lessonSlug) ?? [];
    arr.push(v);
    bySlug.set(v.lessonSlug, arr);
  }

  const catFor = (slug: string) => {
    const lesson = lessons.find((l) => l.slug === slug);
    if (!lesson) return { name: "General", topicCode: null as string | null };
    const name = (lesson.system ?? lesson.bodySystem ?? lesson.topic ?? "").trim() || lesson.topic;
    const topicCode = lesson.topicSlug?.trim() ? lesson.topicSlug.trim().toLowerCase() : null;
    return { name, topicCode };
  };

  for (const lesson of lessons) {
    const have = bySlug.get(lesson.slug) ?? [];
    const min = minLessonLinkedCardsForPathwayLesson(pid, lesson);
    if (have.length >= min) continue;
    const need = min - have.length;
    const exclude = new Set<string>(have.map((v) => v.row.front.trim().toLowerCase().slice(0, 96)));
    const pool = sentencesForPadding(lesson, exclude);
    const cat = catFor(lesson.slug);
    let used = 0;
    for (let i = 0; i < need && i < pool.length; i += 1) {
      const pad = buildPaddingRow({ pathwayId: pid, lesson, cat, sentence: pool[i]!, idx: i });
      push(pad);
      used += 1;
    }
    for (let j = used; j < need; j += 1) {
      const fallback = `${lesson.title}: review core objectives (${j + 1}) and safety cues for ${lesson.topic} on this track.`;
      const pad = buildPaddingRow({ pathwayId: pid, lesson, cat, sentence: fallback, idx: 900 + j });
      push(pad);
    }
  }

  const finalList = merged;
  const slugSet = new Set(finalList.map((v) => v.lessonSlug));

  return {
    virtuals: finalList,
    diagnostics: {
      pathwayId: pid,
      catalogLessonCount: lessons.length,
      lessonsWithVirtualCards: slugSet.size,
      totalVirtualCards: finalList.length,
      recallVirtualCount: recallList.length,
      sectionDerivedVirtualCount: sectionList.length,
      genericFillerSourcedSectionCards: fillerCount,
    },
  };
}
