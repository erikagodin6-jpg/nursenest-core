/**
 * ------------------------------
 * SAMPLE QUESTIONS
 * ------------------------------
 */

type QotdSampleQuestion = {
  bodySystem: string;
  tier?: string;
  question?: string;
  options?: unknown;
  /** Index of correct option when `options` is an array */
  correct?: number;
  rationale?: string;
  lessonId?: string;
};

const sampleQuestions: QotdSampleQuestion[] = [
  /* Extend with real QOTD pool rows as needed; empty array is valid for typecheck. */
];

/**
 * ------------------------------
 * HELPERS
 * ------------------------------
 */

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getAllBodySystems(): string[] {
  return Array.from(new Set(sampleQuestions.map(q => q.bodySystem)));
}

function pickDeterministic<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error("Empty array in deterministic picker");
  }

  const index = getDayOfYear() % arr.length;
  return arr[index];
}

/**
 * ------------------------------
 * MAIN POOL BUILDER
 * ------------------------------
 */

export function buildQuestionPoolServer(recentBodySystems?: string[]) {
  const recentSet = new Set(recentBodySystems || []);

  const allSystems = getAllBodySystems();

  /**
   * Try to avoid recently used systems
   */
  if (recentSet.size > 0 && recentSet.size < allSystems.length) {
    const filtered = sampleQuestions.filter(q => !recentSet.has(q.bodySystem));

    if (filtered.length > 0) {
      return pickDeterministic(filtered);
    }
  }

  /**
   * Fallback to full pool
   */
  return pickDeterministic(sampleQuestions);
}