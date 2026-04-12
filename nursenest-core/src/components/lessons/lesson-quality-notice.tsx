import type { ContentQualityTier } from "@/lib/content-quality/standards";

/** Subtle, honest notice when lesson body is below internal teaching-depth targets. */
export function LessonQualityNotice({
  tier,
  wordCount,
}: {
  tier: ContentQualityTier;
  wordCount: number;
}) {
  if (tier !== "thin" && tier !== "missing") return null;
  return (
    <aside
      className="rounded-xl border px-4 py-3.5 text-xs font-medium leading-relaxed"
      style={{
        borderStyle: "dashed",
        background: "color-mix(in srgb, var(--semantic-warning) 6%, var(--bg-card))",
        borderColor: "color-mix(in srgb, var(--semantic-warning) 28%, var(--border-subtle))",
        color: "var(--semantic-text-secondary)",
      }}
    >
      {tier === "missing" ? (
        <p>Lesson body is still being assembled for this topic.</p>
      ) : (
        <p>
          This lesson is shorter than our full teaching-depth target. We show what&apos;s published and keep improving
          depth over time{wordCount > 0 ? ` (~${wordCount} words in the full lesson)` : ""}.
        </p>
      )}
    </aside>
  );
}
