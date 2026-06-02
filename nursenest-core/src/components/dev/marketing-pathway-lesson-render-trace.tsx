import { shouldShowMarketingPathwayLessonRenderTrace } from "@/lib/dev/marketing-content-render-trace";

/** Server-only QA strip: confirms live lesson HTML is fed from normalized PathwayLesson sections. */
export function MarketingPathwayLessonRenderTrace({
  staffFullLessonAccess,
  pathwayId,
  lessonSlug,
  sectionsCount,
  firstSectionHeading,
  approximateWordCount,
}: {
  staffFullLessonAccess: boolean;
  pathwayId: string;
  lessonSlug: string;
  sectionsCount: number;
  firstSectionHeading: string;
  approximateWordCount: number;
}) {
  if (!shouldShowMarketingPathwayLessonRenderTrace(staffFullLessonAccess)) return null;
  const label = [
    "NN_RENDER_TRACE: marketing.pathway_lesson",
    `source=PathwayLesson`,
    `pathwayId=${pathwayId}`,
    `slug=${lessonSlug.slice(0, 120)}`,
    `sections=${sectionsCount}`,
    `h1=${firstSectionHeading.slice(0, 80)}`,
    `words≈${approximateWordCount}`,
  ].join(" | ");
  return (
    <p
      className="mb-2 rounded-md border border-[color-mix(in_srgb,var(--semantic-info)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] px-3 py-2 font-mono text-xs text-[var(--semantic-text-primary)]"
      data-nn-render-trace="marketing_pathway_lesson"
      suppressHydrationWarning
    >
      {label}
    </p>
  );
}
