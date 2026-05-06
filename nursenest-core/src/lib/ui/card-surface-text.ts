/**
 * Card / hub typography helpers — keep lesson, flashcard, practice, and marketing
 * surfaces on semantic Tailwind tokens so light pastel shells never inherit unsafe ink.
 *
 * - Light surfaces: use `text-foreground` / `text-muted-foreground` (backed by globals + @theme).
 * - Saturated fills (brand, success, chroma): pair with `nn-text-on-solid-fill` in globals.css
 *   (`color: var(--text-on-dark)`) instead of ad-hoc `text-white`.
 */
export const cardSurfaceTitleClass = "text-foreground";
export const cardSurfaceDescriptionClass = "text-muted-foreground";
export const cardSurfaceMetaClass = "text-muted-foreground";
/** For buttons and labels on `bg-[var(--semantic-brand)]`, `bg-primary`, `bg-green-600`, etc. */
export const textOnSolidFillClass = "nn-text-on-solid-fill";

export type CardTextTone = "onLight" | "onDark";

/** Root text color for a card stack — prefer with nn-card / nn-study-card which set readable defaults. */
export function cardSurfaceRootClass(tone: CardTextTone): string {
  return tone === "onDark" ? textOnSolidFillClass : "text-foreground";
}
