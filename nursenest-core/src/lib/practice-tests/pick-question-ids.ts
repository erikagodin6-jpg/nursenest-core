import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { loadWeakTopicPracticePlan } from "@/lib/learner/topic-performance";
import type { LinearDeliveryMode, PracticeTestConfigJson, PracticeTestSelectionMode } from "@/lib/practice-tests/types";

/** Linear pool selection — CAT uses {@link createCatPracticeTestPayload} instead. */
export type LinearPoolSelectionMode = Exclude<PracticeTestSelectionMode, "cat">;

const MAX_POOL = 4000;
export const PRACTICE_TEST_MIN_Q = 5;
export const PRACTICE_TEST_MAX_Q = 100;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function proportionalAllocBucketCounts(n: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map((w) => (n * w) / sum);
  const base = raw.map((x) => Math.floor(x));
  let rem = n - base.reduce((a, b) => a + b, 0);
  const order = raw
    .map((x, i) => ({ i, f: x - Math.floor(x) }))
    .sort((a, b) => b.f - a.f);
  for (let k = 0; k < rem; k++) {
    const o = order[k];
    if (o) base[o.i] = (base[o.i] ?? 0) + 1;
  }
  return base;
}

function interleaveWeakBuckets(buckets: { ids: string[]; take: number }[], total: number): string[] {
  const out: string[] = [];
  const ptr = buckets.map(() => 0);
  let guard = 0;
  while (out.length < total && guard < total * 30) {
    guard++;
    let progressed = false;
    for (let i = 0; i < buckets.length; i++) {
      const b = buckets[i]!;
      if (ptr[i]! >= b.take) continue;
      const id = b.ids[ptr[i]!];
      if (id == null) continue;
      if (!out.includes(id)) {
        out.push(id);
        ptr[i] = (ptr[i] ?? 0) + 1;
        progressed = true;
        if (out.length >= total) break;
      } else {
        ptr[i] = (ptr[i] ?? 0) + 1;
      }
    }
    if (!progressed) break;
  }
  return out;
}

async function pickDiversifiedWeakQuestionIds(
  base: Prisma.ExamQuestionWhereInput,
  diff: Prisma.ExamQuestionWhereInput | null,
  n: number,
  dbTopicNames: string[],
  priorityByCanonical: Map<string, number>,
): Promise<{ ok: true; ids: string[] } | { ok: false }> {
  const weights = dbTopicNames.map((tn) => {
    const k = normalizeTopicKey(tn);
    return Math.max(0.08, priorityByCanonical.get(k) ?? 0.08);
  });
  const counts = proportionalAllocBucketCounts(n, weights);
  const buckets: { ids: string[]; take: number }[] = [];
  for (let i = 0; i < dbTopicNames.length; i++) {
    const tn = dbTopicNames[i]!;
    const want = counts[i] ?? 0;
    if (want <= 0) continue;
    const pool = await prisma.examQuestion.findMany({
      where: { AND: [base, ...(diff ? [diff] : []), { topic: tn }] },
      select: { id: true },
      take: MAX_POOL,
    });
    const ids = shuffle(pool.map((p) => p.id));
    buckets.push({ ids, take: want });
  }
  const merged = interleaveWeakBuckets(buckets, n);
  if (merged.length < n) return { ok: false };
  return { ok: true, ids: merged };
}

export function difficultyWhere(min: number | null, max: number | null): Prisma.ExamQuestionWhereInput | null {
  if (min == null && max == null) return null;
  const lo = min ?? 1;
  const hi = max ?? 5;
  return {
    OR: [{ difficulty: null }, { AND: [{ difficulty: { gte: lo } }, { difficulty: { lte: hi } }] }],
  };
}

export type PickQuestionsInput = {
  questionCount: number;
  topicNames: string[];
  difficultyMin: number | null;
  difficultyMax: number | null;
  selectionMode: LinearPoolSelectionMode;
  pathwayId: string | null;
};

export async function pickPracticeQuestionIds(
  userId: string,
  entitlement: AccessScope,
  input: PickQuestionsInput,
): Promise<{ ok: true; ids: string[] } | { ok: false; message: string }> {
  const n = Math.min(PRACTICE_TEST_MAX_Q, Math.max(PRACTICE_TEST_MIN_Q, Math.floor(input.questionCount)));

  let pathway = input.pathwayId ? getExamPathwayById(input.pathwayId) ?? null : null;
  if (pathway && !subscriptionCoversPathwayBase(entitlement, pathway)) {
    pathway = null;
  }

  const base: Prisma.ExamQuestionWhereInput = pathway
    ? questionAccessWhereWithPathway(entitlement, pathway)
    : questionAccessWhere(entitlement);

  const parts: Prisma.ExamQuestionWhereInput[] = [base];

  const diff = difficultyWhere(input.difficultyMin, input.difficultyMax);
  if (diff) parts.push(diff);

  if (input.selectionMode === "targeted") {
    if (input.topicNames.length === 0) {
      return { ok: false, message: "Targeted mode requires at least one topic." };
    }
    parts.push({ OR: input.topicNames.map((t) => ({ topic: t })) });
  } else if (input.selectionMode === "weak") {
    const plan = await loadWeakTopicPracticePlan(userId, entitlement, 16);
    if (plan.priorityByCanonical.size === 0) {
      return {
        ok: false,
        message:
          "No weak areas yet. Answer graded questions, finish a mock, or complete a practice test. Then try weak mode again.",
      };
    }
    const names = plan.dbTopicNames;
    if (names.length === 0) {
      /* Resolved no DB topic rows — fall back to full tier pool (balanced). */
    } else if (names.length === 1) {
      parts.push({ topic: { in: names } });
    } else {
      const div = await pickDiversifiedWeakQuestionIds(base, diff, n, names, plan.priorityByCanonical);
      if (div.ok) return div;
      parts.push({ topic: { in: names } });
    }
  } else if (input.topicNames.length > 0) {
    parts.push({ OR: input.topicNames.map((t) => ({ topic: t })) });
  }

  const where: Prisma.ExamQuestionWhereInput = { AND: parts };

  const pool = await prisma.examQuestion.findMany({
    where,
    select: { id: true },
    take: MAX_POOL,
  });

  if (pool.length < n) {
    return {
      ok: false,
      message: `Only ${pool.length} question(s) match your filters. Relax topics or difficulty, or reduce count.`,
    };
  }

  const ids = shuffle(pool.map((p) => p.id)).slice(0, n);
  return { ok: true, ids };
}

export function configFromInput(
  input: PickQuestionsInput,
  timedMode: boolean,
  timeLimitSec: number | null,
  extras?: { linearDeliveryMode?: LinearDeliveryMode },
): PracticeTestConfigJson {
  return {
    questionCount: input.questionCount,
    topicNames: input.topicNames,
    difficultyMin: input.difficultyMin,
    difficultyMax: input.difficultyMax,
    selectionMode: input.selectionMode,
    pathwayId: input.pathwayId,
    timedMode,
    timeLimitSec,
    ...(extras?.linearDeliveryMode ? { linearDeliveryMode: extras.linearDeliveryMode } : {}),
  };
}
