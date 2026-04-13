/**
 * NurseNest learner UI design system — surfaces, sections, and study primitives.
 *
 * **When building new `/app` features:**
 * 1. Pick a {@link LearnerSurface} `tone` (primary / secondary / supportive / danger / success) instead of one-off borders.
 * 2. Use {@link LearnerStudySurfaceSection} for major study blocks (kicker + title + intro + children).
 * 3. Use {@link LearnerStatCard} for KPIs; rotate `accent` keys (c1–c5) across rows.
 * 4. Use {@link LearnerProgressCard} or {@link ProgressBarSemantic} directly for bars — never raw gray tracks.
 * 5. Use {@link LearnerNotePanel} for inline guidance; `danger` for red-flag, `success` for reinforcement.
 * 6. Use {@link LearnerFilterChips} for pill filters; {@link LearnerSegmentedBlock} for dual summaries.
 * 7. Use {@link LearnerStudyRecommendationCard} for secondary “you might also…” links; keep PrimaryActionCard for the single dominant CTA.
 * 8. Use {@link LearnerEmptyState} for zero-data; pass `inset` when nested inside another card.
 *
 * CSS lives in `src/app/learner-surface-primitives.css` (imported from `globals.css`).
 */

export type { LearnerSurfaceTone, LearnerNoteTone } from "@/components/learner-ui/learner-surface-tone";
export { LearnerSurface } from "@/components/learner-ui/learner-surface";
export { LearnerKickerHeading } from "@/components/learner-ui/learner-kicker-heading";
export { LearnerStudySurfaceSection } from "@/components/learner-ui/learner-study-surface-section";
export { LearnerStatCard } from "@/components/learner-ui/learner-stat-card";
export { LearnerProgressCard } from "@/components/learner-ui/learner-progress-card";
export { LearnerEmptyState, type LearnerEmptyStateProps } from "@/components/learner-ui/learner-empty-state";
export { LearnerFilterChips, type LearnerFilterChipItem } from "@/components/learner-ui/learner-filter-chips";
export { LearnerSegmentedBlock } from "@/components/learner-ui/learner-segmented-block";
export { LearnerNotePanel } from "@/components/learner-ui/learner-note-panel";
export { LearnerStudyRecommendationCard } from "@/components/learner-ui/learner-study-recommendation-card";
