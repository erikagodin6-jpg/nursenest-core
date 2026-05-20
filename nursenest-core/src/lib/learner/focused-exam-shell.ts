const FOCUSED_EXAM_EXCLUDED_LEAVES = new Set(["start", "cat-insights"]);

export function isFocusedPracticeTestSessionPath(inputPathname: string | null | undefined): boolean {
  const pathname = (inputPathname ?? "").split("?")[0]?.split("#")[0] ?? "";
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 3) return false;
  if (parts[0] !== "app" || parts[1] !== "practice-tests") return false;
  const leaf = parts[2]?.trim() ?? "";
  if (!leaf || FOCUSED_EXAM_EXCLUDED_LEAVES.has(leaf)) return false;
  return true;
}
