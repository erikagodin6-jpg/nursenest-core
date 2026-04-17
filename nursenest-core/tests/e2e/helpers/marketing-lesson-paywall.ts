/**
 * Marketing pathway lesson URLs — preview vs full access (see `pathway-lesson-detail-page-body.tsx`).
 * Default slug is used across typography / error-audit tests; override with `E2E_PAYWALL_LESSON_PATH`.
 */
export function defaultMarketingLessonPath(): string {
  const raw = process.env.E2E_PAYWALL_LESSON_PATH?.trim();
  if (raw) return raw.startsWith("/") ? raw : `/${raw}`;
  return "/us/rn/nclex-rn/lessons/respiratory-assessment-ngn";
}

/** Guest / non-subscriber preview chrome — `PathwayLessonPreviewBanner` + `aria-label="Lesson access"`. */
export const LESSON_ACCESS_ASIDE = 'aside[aria-label="Lesson access"]';
