const CHECKPOINT_PREFIX = "nursenest-exam-checkpoint-";

export interface ExamCheckpoint {
  examId: string;
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number | number[] | string>;
  elapsedTimeSeconds: number;
  progressState: "in-progress" | "paused" | "reviewing";
  totalQuestions: number;
  savedAt: number;
}

function getKey(examId: string): string {
  return `${CHECKPOINT_PREFIX}${examId}`;
}

export function saveExamCheckpoint(checkpoint: Omit<ExamCheckpoint, "savedAt">): void {
  try {
    const data: ExamCheckpoint = { ...checkpoint, savedAt: Date.now() };
    localStorage.setItem(getKey(checkpoint.examId), JSON.stringify(data));
  } catch {
    console.warn("[ExamCheckpoint] Failed to save checkpoint");
  }
}

export function loadExamCheckpoint(examId: string): ExamCheckpoint | null {
  try {
    const raw = localStorage.getItem(getKey(examId));
    if (!raw) return null;
    const parsed: ExamCheckpoint = JSON.parse(raw);
    const MAX_AGE = 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.savedAt > MAX_AGE) {
      clearExamCheckpoint(examId);
      return null;
    }
    if (
      typeof parsed.currentQuestionIndex !== "number" ||
      !parsed.selectedAnswers ||
      typeof parsed.selectedAnswers !== "object" ||
      Array.isArray(parsed.selectedAnswers) ||
      typeof parsed.elapsedTimeSeconds !== "number"
    ) {
      clearExamCheckpoint(examId);
      return null;
    }
    return parsed;
  } catch {
    clearExamCheckpoint(examId);
    return null;
  }
}

export function clearExamCheckpoint(examId: string): void {
  try {
    localStorage.removeItem(getKey(examId));
  } catch {}
}

export function hasExamCheckpoint(examId: string): boolean {
  return loadExamCheckpoint(examId) !== null;
}

export function getAllExamCheckpoints(): ExamCheckpoint[] {
  const checkpoints: ExamCheckpoint[] = [];
  const MAX_AGE = 24 * 60 * 60 * 1000;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CHECKPOINT_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (
              parsed &&
              typeof parsed.currentQuestionIndex === "number" &&
              parsed.selectedAnswers &&
              typeof parsed.selectedAnswers === "object" &&
              !Array.isArray(parsed.selectedAnswers) &&
              typeof parsed.elapsedTimeSeconds === "number" &&
              Date.now() - parsed.savedAt <= MAX_AGE
            ) {
              checkpoints.push(parsed);
            }
          } catch {}
        }
      }
    }
  } catch {}
  return checkpoints;
}

export function clearAllExamCheckpoints(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CHECKPOINT_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
}
