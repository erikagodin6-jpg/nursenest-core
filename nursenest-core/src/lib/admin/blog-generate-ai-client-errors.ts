/** Subset of Zod `flatten()` we serialize on 400 responses for `/api/admin/blog/generate-ai`. */
export type BlogGenerateAiValidationFlatten = {
  fieldErrors: Record<string, string[] | undefined>;
  formErrors: string[];
};

function joinNonEmpty(lines: string[]): string {
  return lines.filter((s) => s.trim().length > 0).join("\n");
}

/**
 * Turns Zod `flatten()` output into short, field-labeled lines for admin UI
 * (avoids opaque browser "pattern" messages and raw Zod defaults where possible).
 */
export function formatBlogGenerateAiFlattenedErrors(f: BlogGenerateAiValidationFlatten): string {
  const fieldLines: string[] = [];
  for (const [key, msgs] of Object.entries(f.fieldErrors)) {
    if (!Array.isArray(msgs) || msgs.length === 0) continue;
    const first = msgs.find((m): m is string => typeof m === "string" && m.trim().length > 0);
    if (first) fieldLines.push(`${key}: ${first}`);
  }
  const form = Array.isArray(f.formErrors) ? f.formErrors.filter((m): m is string => typeof m === "string" && m.trim() !== "") : [];
  if (fieldLines.length > 0) {
    return joinNonEmpty([...fieldLines, ...form.map((m) => m)]);
  }
  if (form.length > 0) return joinNonEmpty(form);
  return "Request validation failed. Check required fields and try again.";
}
