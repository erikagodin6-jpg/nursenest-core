/**
 * HttpOnly cookie set only via `/api/admin/exam-hub-preview` (staff).
 * Edge `proxy` reads it so admins can load unpublished `/exams/…` marketing hubs without affecting learners.
 */
export const EXAM_HUB_PREVIEW_COOKIE = "nn_exam_hub_preview_region" as const;
export const EXAM_HUB_PREVIEW_MAX_AGE_SEC = 2 * 60 * 60;
