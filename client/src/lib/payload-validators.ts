export interface ValidationResult<T> {
  valid: T[];
  skippedCount: number;
  skippedReasons: string[];
}

export function validateExamQuestions(items: any[]): ValidationResult<any> {
  if (!Array.isArray(items)) {
    return { valid: [], skippedCount: 0, skippedReasons: ["Input is not an array"] };
  }
  const valid: any[] = [];
  const skippedReasons: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item || typeof item !== "object") {
      skippedReasons.push(`Item ${i}: not an object`);
      continue;
    }
    if (!item.question && !item.stem && !item.text) {
      skippedReasons.push(`Item ${i}: missing question text`);
      continue;
    }
    if (item.options && !Array.isArray(item.options)) {
      skippedReasons.push(`Item ${i}: options is not an array`);
      continue;
    }
    if (item.options && item.options.length < 2) {
      skippedReasons.push(`Item ${i}: fewer than 2 options`);
      continue;
    }
    valid.push(item);
  }

  return { valid, skippedCount: items.length - valid.length, skippedReasons };
}

export function validateFlashcards(items: any[]): ValidationResult<any> {
  if (!Array.isArray(items)) {
    return { valid: [], skippedCount: 0, skippedReasons: ["Input is not an array"] };
  }
  const valid: any[] = [];
  const skippedReasons: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item || typeof item !== "object") {
      skippedReasons.push(`Card ${i}: not an object`);
      continue;
    }
    if (!item.question && !item.front && !item.term) {
      skippedReasons.push(`Card ${i}: missing front/question text`);
      continue;
    }
    if (!item.answer && !item.back && !item.definition) {
      skippedReasons.push(`Card ${i}: missing back/answer text`);
      continue;
    }
    valid.push(item);
  }

  return { valid, skippedCount: items.length - valid.length, skippedReasons };
}

export function validateLessons(items: any[]): ValidationResult<any> {
  if (!Array.isArray(items)) {
    return { valid: [], skippedCount: 0, skippedReasons: ["Input is not an array"] };
  }
  const valid: any[] = [];
  const skippedReasons: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item || typeof item !== "object") {
      skippedReasons.push(`Lesson ${i}: not an object`);
      continue;
    }
    if (!item.title && !item.name && !item.id) {
      skippedReasons.push(`Lesson ${i}: missing title or identifier`);
      continue;
    }
    valid.push(item);
  }

  return { valid, skippedCount: items.length - valid.length, skippedReasons };
}

export function getSkippedItemsMessage(skippedCount: number, contentType: string): string | null {
  if (skippedCount === 0) return null;
  return `${skippedCount} ${contentType}${skippedCount > 1 ? "s" : ""} could not be loaded and ${skippedCount > 1 ? "were" : "was"} skipped.`;
}
