/**
 * Opt-in diagnostics for marketing PathwayLesson detail (source-of-truth QA).
 * Production anonymous users never see this strip; use local dev, staff session, or `NN_MARKETING_LESSON_RENDER_TRACE=1`.
 */
export function shouldShowMarketingPathwayLessonRenderTrace(staffFullLessonAccess: boolean): boolean {
  if (process.env.NN_MARKETING_LESSON_RENDER_TRACE === "1") return true;
  if (staffFullLessonAccess) return true;
  return process.env.NODE_ENV === "development";
}
