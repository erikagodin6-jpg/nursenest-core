/**
 * Single source of truth for deploy-safe `feature` tags passed to `setSentryServerContext` on API routes
 * and server helpers (entitlement gating, etc.). The `ServerFeatureTag` type is derived only from
 * `SERVER_FEATURE` — do not add parallel string unions elsewhere, or production typecheck will drift.
 *
 * Client-only Sentry tags (error boundaries, marketing, etc.) are intentionally separate and are not
 * required to appear here.
 */
export const SERVER_FEATURE = {
  /** Reserved for generic API instrumentation when no product feature applies. */
  api: "api",
  auth: "auth",
  entitlement: "entitlement",
  exam: "exam",
  flashcard: "flashcard",
  image: "image",
  lesson: "lesson",
  other: "other",
  payment: "payment",
  practiceTest: "practice_test",
  question: "question",
  signup: "signup",
  trial: "trial",
} as const;

export type ServerFeatureTag = (typeof SERVER_FEATURE)[keyof typeof SERVER_FEATURE];

/** Stable iteration list (e.g. tests, docs); same members as `ServerFeatureTag`. */
export const SERVER_FEATURE_TAGS: readonly ServerFeatureTag[] = Object.freeze(
  Object.values(SERVER_FEATURE) as ServerFeatureTag[],
);
