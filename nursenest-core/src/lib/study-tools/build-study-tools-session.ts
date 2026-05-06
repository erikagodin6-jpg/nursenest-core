import "server-only";

import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { withRetry } from "@/lib/resilience/with-retry";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import { classifyQuestionTopicIntoLessonCategory } from "@/lib/questions/pathway-question-category-structure";
import { normalizeStudyCategory, type CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";
import { loadMissedQuestionIdsForPoolFilter } from "@/lib/learner/study-question-signals";
import { shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";
import { resolveMcqCorrectIndex } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import { buildFlashcardCustomSession } from "@/lib/flashcards/build-flashcard-custom-session";
import { parseCustomSessionSourceKind } from "@/lib/flashcards/custom-session-card-filters";
import { builderCategoryOptionsForPathway } from "@/lib/flashcards/flashcard-builder-taxonomy";
import {
  builderCategoryIdsForCanonicalSelection,
  pathwayHubCategoryToCanonical,
} from "@/lib/learner-study-hub/body-system-data";
import { orderingSequencesForCategories } from "@/lib/study-tools/clinical-ordering-sequences";
import type {
  StudyToolFillInItem,
  StudyToolLabItem,
  StudyToolMatchingItem,
  StudyToolMedicationItem,
  StudyToolOrderingItem,
  StudyToolSessionItem,
  StudyToolSessionMode,
  StudyToolsSessionBuildResult,
  StudyToolsSessionPayload,
} from "@/lib/study-tools/study-tools-session-types";

type ExamRow = {
  id: string;
  stem: string;
  options: Prisma.JsonValue | null;
  correctAnswer: Prisma.JsonValue | null;
  questionType: string;
  rationale: string | null;
  topic: string | null;
  subtopic: string | null;
  bodySystem: string | null;
};

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseOptionsArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => {
    if (typeof x === "string") return x;
    if (x && typeof x === "object" && "text" in x && typeof (x as { text?: unknown }).text === "string") {
      return (x as { text: string }).text;
    }
    return String(x);
  });
}

function rowCanonical(pathwayId: string, row: ExamRow): CanonicalStudyCategoryId {
  const { categoryId } = classifyQuestionTopicIntoLessonCategory(row.topic ?? "", pathwayId);
  return normalizeStudyCategory({
    pathwayId,
    topic: row.topic,
    subtopic: row.subtopic,
    bodySystem: row.bodySystem,
    taxonomyLeaf: categoryId,
  }).id;
}

function passesCategory(canon: CanonicalStudyCategoryId, selected: CanonicalStudyCategoryId[]): boolean {
  if (selected.length === 0) return true;
  return selected.includes(canon);
}

function isLabRow(row: ExamRow): boolean {
  const t = `${row.stem} ${row.topic ?? ""} ${row.rationale ?? ""}`.toLowerCase();
  return /\b(na\+|k\+|cl-|hco3|bicarb|bun|creat|inr|pt\/inr|ptt|wbc|hb|hgb|plt|glucose|lactate|troponin|arterial blood gas|abg|anion gap|mg\/dl|mmol\/l|siadh|dka|aki)\b/i.test(
    t,
  );
}

function isMedicationQuestionRow(row: ExamRow, canon: CanonicalStudyCategoryId): boolean {
  if (canon === "pharmacology") return true;
  const t = `${row.stem} ${row.topic ?? ""} ${row.subtopic ?? ""}`.toLowerCase();
  return /\b(mg\b|mcg\b|units?\/hr|infusion|titrate|antibiotic|insulin|heparin|warfarin|opioid|analgesic|ace inhibitor|beta block|diuretic|anticoag)\b/i.test(
    t,
  );
}

function extractNumericTokens(text: string): string[] {
  const nums = [...text.matchAll(/\b\d{1,3}(\.\d{1,2})?\b/g)].map((m) => m[0]);
  return Array.from(new Set(nums)).slice(0, 4);
}

function maskStemForFillIn(stem: string): { masked: string; answers: string[] } | null {
  const plain = stripHtml(stem);
  if (plain.length < 24) return null;
  const m = plain.match(/\b([A-Za-z][A-Za-z'\-]{5,})\b/);
  if (!m) return null;
  const word = m[1];
  const masked = plain.replace(word, "____");
  const w = word.trim();
  return { masked: masked.slice(0, 420), answers: [w.toLowerCase(), w] };
}

export async function buildStudyToolsSession(args: {
  userId: string;
  entitlement: AccessScope;
  pathwayId: string;
  mode: StudyToolSessionMode;
  selectedCategories: CanonicalStudyCategoryId[];
  count: number;
  shuffle: boolean;
  filters: { weakOnly?: boolean };
}): Promise<StudyToolsSessionBuildResult> {
  const pathway = getExamPathwayById(args.pathwayId.trim());
  if (!pathway) {
    return { ok: false, code: "invalid_pathway", message: "Unknown pathwayId." };
  }
  if (!subscriptionCoversPathwayBase(args.entitlement, pathway)) {
    return { ok: false, code: "pathway_not_covered", message: "Pathway is not covered by this account." };
  }

  const payload: StudyToolsSessionPayload = {
    pathwayId: pathway.id,
    selectedCategories: args.selectedCategories,
    mode: args.mode,
    count: Math.min(50, Math.max(1, args.count)),
    shuffle: args.shuffle,
    filters: args.filters ?? {},
  };

  if (args.mode === "ordering") {
    const pool = orderingSequencesForCategories(args.selectedCategories);
    const shuffled = shuffleSeeded([...pool], `${args.userId}:${pathway.id}:ordering:${randomUUID()}`).slice(
      0,
      payload.count,
    );
    const items: StudyToolOrderingItem[] = shuffled.map((s) => ({
      kind: "ordering",
      id: `ord:${s.id}`,
      title: s.title,
      steps: [...s.steps],
      canonicalCategory: s.canonicalTags[0] ?? "fundamentals_safety",
    }));
    if (items.length === 0) {
      return { ok: false, code: "empty_pool", message: "No ordering sequences available for this filter." };
    }
    return { ok: true, pathwayId: pathway.id, payload, items };
  }

  let missedIds: string[] = [];
  if (args.filters.weakOnly) {
    missedIds = await loadMissedQuestionIdsForPoolFilter(args.userId, 200);
    if (missedIds.length === 0) {
      return { ok: false, code: "empty_pool", message: "No missed questions yet for weak-only mode." };
    }
  }

  const baseWhere = questionAccessWhereWithPathway(args.entitlement, pathway);
  const where: Prisma.ExamQuestionWhereInput =
    missedIds.length > 0 ? { AND: [baseWhere, { id: { in: missedIds } }] } : baseWhere;

  let rows: ExamRow[] = [];
  try {
    rows = await withRetry(() =>
      prisma.examQuestion.findMany({
        where,
        select: {
          id: true,
          stem: true,
          options: true,
          correctAnswer: true,
          questionType: true,
          rationale: true,
          topic: true,
          subtopic: true,
          bodySystem: true,
        },
        take: 240,
        orderBy: { updatedAt: "desc" },
      }),
    );
  } catch (e) {
    return {
      ok: false,
      code: "database_error",
      message: e instanceof Error ? e.message : "database_error",
    };
  }

  const withCanon = rows
    .map((r) => ({ row: r, canon: rowCanonical(pathway.id, r) }))
    .filter(({ canon }) => passesCategory(canon, args.selectedCategories));

  const allCorrectTexts: string[] = [];
  for (const { row } of withCanon) {
    const idx = resolveMcqCorrectIndex(row.options, row.correctAnswer, row.questionType);
    if (idx == null) continue;
    const opts = parseOptionsArray(row.options);
    const ans = opts[idx];
    if (ans?.trim()) allCorrectTexts.push(stripHtml(ans).slice(0, 200));
  }

  const items: StudyToolSessionItem[] = [];

  if (args.mode === "matching") {
    for (const { row, canon } of withCanon) {
      const idx = resolveMcqCorrectIndex(row.options, row.correctAnswer, row.questionType);
      if (idx == null) continue;
      const opts = parseOptionsArray(row.options);
      const answer = stripHtml(opts[idx] ?? "").slice(0, 240);
      if (!answer) continue;
      const distractorPool = shuffleSeeded(
        allCorrectTexts.filter((t) => t && t !== answer),
        `${row.id}:md`,
      );
      const distractors = distractorPool.slice(0, 3);
      while (distractors.length < 3) {
        distractors.push(`Review option ${distractors.length + 1}`);
      }
      const m: StudyToolMatchingItem = {
        kind: "matching",
        id: `m:${row.id}`,
        sourceQuestionId: row.id,
        prompt: stripHtml(row.stem).slice(0, 360),
        answer,
        distractors: distractors.slice(0, 3),
        canonicalCategory: canon,
      };
      items.push(m);
      if (items.length >= payload.count) break;
    }
  } else if (args.mode === "fill_in_the_blank") {
    for (const { row, canon } of withCanon) {
      const masked = maskStemForFillIn(row.stem);
      if (!masked) continue;
      const f: StudyToolFillInItem = {
        kind: "fill_in_the_blank",
        id: `f:${row.id}`,
        sourceQuestionId: row.id,
        stemMasked: masked.masked,
        acceptableAnswers: masked.answers,
        hint: row.topic?.trim() || undefined,
        canonicalCategory: canon,
      };
      items.push(f);
      if (items.length >= payload.count) break;
    }
  } else if (args.mode === "lab_drills") {
    for (const { row, canon } of withCanon) {
      if (!isLabRow(row)) continue;
      const nums = extractNumericTokens(`${row.stem} ${row.rationale ?? ""}`);
      const acceptable = nums.length > 0 ? nums : ["trend and interpret per protocol / order"];
      const lab: StudyToolLabItem = {
        kind: "lab_drills",
        id: `l:${row.id}`,
        sourceQuestionId: row.id,
        prompt: stripHtml(row.stem).slice(0, 420),
        acceptableAnswers: acceptable,
        rationaleHint: row.rationale ? stripHtml(row.rationale).slice(0, 220) : undefined,
        canonicalCategory: canon,
      };
      items.push(lab);
      if (items.length >= payload.count) break;
    }
  } else if (args.mode === "medication_drills") {
    const builderRows = builderCategoryOptionsForPathway(pathway.id).map((c) => ({ id: c.id, title: c.title, count: 0 }));
    const selectedSet = new Set(args.selectedCategories);
    const builderIds = builderCategoryIdsForCanonicalSelection(pathway.id, builderRows, selectedSet);
    try {
      const fc = await buildFlashcardCustomSession({
        userId: args.userId,
        entitlement: args.entitlement,
        pathwayId: pathway.id,
        selectedCategories: builderIds,
        stateIds: [],
        weakOnly: false,
        incorrectOnly: false,
        starredOnly: false,
        savedOnly: false,
        notesOnly: false,
        revisitOnly: false,
        notStudiedOnly: false,
        recentStudiedOnly: false,
        recentDays: 7,
        shuffle: true,
        mode: "mixed",
        limit: Math.min(payload.count, 30),
        includeCards: true,
        sourceKind: parseCustomSessionSourceKind("all"),
        sessionSeed: randomUUID(),
        cardLimitRaw: String(Math.min(payload.count, 30)),
      });
      if (fc.ok) {
        for (const c of fc.cards) {
          const front = stripHtml(c.front ?? "").slice(0, 280);
          const back = stripHtml(c.back ?? "").slice(0, 280);
          if (!front || !back) continue;
          const parts = back.split(/[.;]/).map((s) => s.trim()).filter(Boolean).slice(0, 4);
          const acceptableAnswers = parts.length > 0 ? parts : [back];
          const canon = pathwayHubCategoryToCanonical(
            pathway.id,
            (c.subtopic ?? "uncategorized").trim() || "uncategorized",
            c.rawTopic ?? c.topic ?? "",
          );
          const med: StudyToolMedicationItem = {
            kind: "medication_drills",
            id: `md:fc:${c.id}`,
            sourceId: c.id,
            prompt: front,
            acceptableAnswers,
            hint: c.topic?.trim() || undefined,
            canonicalCategory: canon === "pharmacology" ? "pharmacology" : canon,
          };
          items.push(med);
          if (items.length >= payload.count) break;
        }
      }
    } catch {
      /* fall through to question-backed meds */
    }
    if (items.length < payload.count) {
      for (const { row, canon } of withCanon) {
        if (!isMedicationQuestionRow(row, canon)) continue;
        const idx = resolveMcqCorrectIndex(row.options, row.correctAnswer, row.questionType);
        if (idx == null) continue;
        const opts = parseOptionsArray(row.options);
        const answer = stripHtml(opts[idx] ?? "").slice(0, 240);
        if (!answer) continue;
        const med: StudyToolMedicationItem = {
          kind: "medication_drills",
          id: `md:q:${row.id}`,
          sourceId: row.id,
          prompt: stripHtml(row.stem).slice(0, 360),
          acceptableAnswers: [answer],
          hint: row.topic?.trim() || undefined,
          canonicalCategory: canon === "pharmacology" ? "pharmacology" : canon,
        };
        items.push(med);
        if (items.length >= payload.count) break;
      }
    }
  }

  const ordered =
    args.shuffle && items.length > 0
      ? shuffleSeeded([...items], `${args.userId}:${pathway.id}:${args.mode}:${randomUUID()}`)
      : items;

  const trimmed = ordered.slice(0, payload.count);
  if (trimmed.length === 0) {
    return {
      ok: false,
      code: "empty_pool",
      message: "No items matched this mode and category filter. Try more categories or disable weak-only.",
    };
  }

  return { ok: true, pathwayId: pathway.id, payload, items: trimmed };
}
