/** Map bank difficulty (typically 1–5) to a short exam-prep label. */
export function difficultyBandLabel(d: number | null | undefined): string {
  const x = typeof d === "number" && Number.isFinite(d) ? Math.round(d) : 3;
  const clamped = Math.min(5, Math.max(1, x));
  if (clamped <= 2) return "Foundational";
  if (clamped === 3) return "Intermediate";
  return "Advanced";
}
