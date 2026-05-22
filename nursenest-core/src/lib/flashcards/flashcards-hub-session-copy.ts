import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import type { CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";
import type { FlashcardsHubCardLimit } from "@/lib/flashcards/flashcards-hub-preferences";

function labelForCanonical(id: CanonicalStudyCategoryId): string {
  return CANONICAL_STUDY_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function formatSystemList(ids: string[]): string {
  if (ids.length === 0) return "all body systems";
  const labels = ids.map((id) => labelForCanonical(id as CanonicalStudyCategoryId));
  if (labels.length === 1) return labels[0]!;
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

export function buildFlashcardsSessionPreview(args: {
  effectiveCount: number;
  cardLimit: FlashcardsHubCardLimit;
  selectedCanonicalIds: string[];
  shuffleOn: boolean;
  weakOnly: boolean;
  notStudiedOnly: boolean;
  incorrectOnly: boolean;
}): { preview: string; ctaSubline: string } {
  const mode =
    args.weakOnly
      ? "weak-area"
      : args.notStudiedOnly
        ? "unseen"
        : args.incorrectOnly
          ? "previously missed"
          : "adaptive";
  const sizePhrase =
    args.cardLimit === "all"
      ? `up to ${args.effectiveCount} cards in a full review`
      : `${args.effectiveCount} ${mode} card${args.effectiveCount === 1 ? "" : "s"}`;
  const systemsPhrase = formatSystemList(args.selectedCanonicalIds);
  const preview = `You'll review ${sizePhrase} across ${systemsPhrase}${args.weakOnly ? " — prioritized for weak areas" : ""}.`;

  const parts: string[] = [];
  if (args.cardLimit === "all") parts.push("Full review");
  else parts.push(`${args.effectiveCount} cards`);
  parts.push(systemsPhrase);
  parts.push(args.shuffleOn ? "Shuffle on" : "In order");
  if (args.weakOnly) parts.push("Weak areas");
  if (args.notStudiedOnly) parts.push("Unseen only");
  if (args.incorrectOnly) parts.push("Incorrect only");

  return { preview, ctaSubline: parts.join(" · ") };
}
