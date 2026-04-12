import type { LessonDifficulty } from "@/components/pathway-lessons/lesson-board-metadata";

export function DifficultyBadge({ difficulty }: { difficulty: LessonDifficulty }) {
  const className =
    difficulty === "Advanced"
      ? "border-[color-mix(in_srgb,var(--semantic-warning)_24%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] text-[var(--semantic-warning-contrast)]"
      : difficulty === "Intermediate"
        ? "border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
        : "border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--semantic-info-soft)] text-[var(--semantic-info-contrast)]";

  return (
    <span
      className={`inline-flex shrink-0 min-h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold leading-none ${className}`}
    >
      {difficulty}
    </span>
  );
}
