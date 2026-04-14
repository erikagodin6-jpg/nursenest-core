type JsonObject = Record<string, unknown>;

function toTrimmedStringArray(values: unknown[]): string[] {
  return values
    .map((value) => String(value).trim())
    .filter(Boolean);
}

export function normalizeImportedQuestionOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return toTrimmedStringArray(raw);
  if (!raw || typeof raw !== "object") return [];

  const entries = Object.entries(raw as JsonObject)
    .filter(([, value]) => value !== null && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b, "en", { sensitivity: "base" }));

  return toTrimmedStringArray(entries.map(([, value]) => value));
}

function answerKeysFromRaw(raw: unknown): string[] {
  if (Array.isArray(raw)) return toTrimmedStringArray(raw);
  if (raw === null || raw === undefined) return [];
  return [String(raw).trim()].filter(Boolean);
}

function optionValueFromKey(rawOptions: unknown, key: string): string | null {
  if (!rawOptions || typeof rawOptions !== "object" || Array.isArray(rawOptions)) return null;
  const value = (rawOptions as JsonObject)[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function normalizeImportedQuestionCorrectAnswer(
  rawCorrectAnswer: unknown,
  rawOptions: unknown,
  normalizedOptions: string[],
): string[] {
  const answers = answerKeysFromRaw(rawCorrectAnswer);
  if (answers.length === 0) return [];

  const optionSet = new Set(normalizedOptions);
  const normalizedAnswers = answers
    .map((answer) => {
      if (optionSet.has(answer)) return answer;

      const byKey = optionValueFromKey(rawOptions, answer);
      if (byKey && optionSet.has(byKey)) return byKey;

      const numericIndex = Number(answer);
      if (Number.isInteger(numericIndex) && numericIndex >= 0 && numericIndex < normalizedOptions.length) {
        return normalizedOptions[numericIndex] ?? null;
      }

      const letterIndex = answer.length === 1 ? answer.toUpperCase().charCodeAt(0) - 65 : -1;
      if (letterIndex >= 0 && letterIndex < normalizedOptions.length) {
        return normalizedOptions[letterIndex] ?? null;
      }

      return null;
    })
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  return [...new Set(normalizedAnswers)];
}

export function normalizeImportedQuestionShape(rawOptions: unknown, rawCorrectAnswer: unknown): {
  options: string[];
  correctAnswer: string[];
} {
  const options = normalizeImportedQuestionOptions(rawOptions);
  const correctAnswer = normalizeImportedQuestionCorrectAnswer(rawCorrectAnswer, rawOptions, options);
  return { options, correctAnswer };
}

export function questionShapeNeedsRepair(
  existingOptions: unknown,
  existingCorrectAnswer: unknown,
  normalizedOptions: string[],
  normalizedCorrectAnswer: string[],
): boolean {
  if (!Array.isArray(existingOptions)) return true;
  if (existingOptions.length !== normalizedOptions.length) return true;
  if (existingOptions.some((value, index) => String(value) !== normalizedOptions[index])) return true;

  if (!Array.isArray(existingCorrectAnswer)) return true;
  if (existingCorrectAnswer.length !== normalizedCorrectAnswer.length) return true;
  if (existingCorrectAnswer.some((value, index) => String(value) !== normalizedCorrectAnswer[index])) return true;

  return false;
}
