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
    <aside className="nn-card border-dashed border-border/80 bg-muted/15 p-3 text-xs text-muted-foreground">
      {tier === "missing" ? (
        <p>Lesson body is still being assembled for this topic.</p>
      ) : (
        <p>
          This lesson is shorter than our full teaching-depth target. We show what’s published and keep improving depth
          over time{wordCount > 0 ? ` (~${wordCount} words in the full lesson)` : ""}.
        </p>
      )}
    </aside>
  );
}
