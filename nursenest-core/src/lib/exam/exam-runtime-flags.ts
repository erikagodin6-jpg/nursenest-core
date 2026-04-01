/** Client-readable flags (build-time). */
export function examNeutralPaletteDefault(): boolean {
  return process.env.NEXT_PUBLIC_EXAM_NEUTRAL_DEFAULT === "true";
}
