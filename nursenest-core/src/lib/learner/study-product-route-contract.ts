/**
 * Paid learner study surfaces — prevent CTAs from silently routing to the wrong product.
 * Use in tests and at create/resume API boundaries (Referer / explicit launch header).
 */

export type StudyLaunchSurface = "flashcards" | "practice_exams" | "cat";

export type SubscriberStudyLaunchSurfaceReject = {
  ok: false;
  error: "INVALID_SURFACE";
  expected: StudyLaunchSurface;
  received: string;
  reason: string;
};

export type SubscriberStudyLaunchSurfaceResult = { ok: true } | SubscriberStudyLaunchSurfaceReject;

export function isSubscriberFlashcardsAppPath(href: string): boolean {
  const path = (href.split("?")[0] ?? "").trim();
  return path === "/app/flashcards" || path.startsWith("/app/flashcards/");
}

export function isSubscriberPracticeExamsAppPath(href: string): boolean {
  const path = (href.split("?")[0] ?? "").trim();
  return path === "/app/exams" || path.startsWith("/app/exams/");
}

/** Adaptive / linear practice exam builder + runner (excludes legacy `/app/exams` mocks-only shell). */
export function isSubscriberPracticeTestsAppPath(href: string): boolean {
  const path = (href.split("?")[0] ?? "").trim();
  return path === "/app/practice-tests" || path.startsWith("/app/practice-tests/");
}

/** Pathname from Referer (same-origin study launches). */
export function subscriberStudyLaunchPathname(req: Pick<Request, "headers">): string | null {
  const raw = req.headers.get("referer") ?? req.headers.get("Referer");
  if (!raw?.trim()) return null;
  try {
    const u = new URL(raw.trim());
    return u.pathname || null;
  } catch {
    return null;
  }
}

/**
 * Optional explicit surface from the client when Referer is missing (e.g. some proxies).
 * Values are lowercase tokens consumed by API route guards.
 */
export function subscriberStudyLaunchSurfaceHeader(req: Pick<Request, "headers">): string | null {
  const v = req.headers.get("x-nn-study-launch-surface")?.trim().toLowerCase();
  return v || null;
}

/**
 * Validate that the browser tab / explicit header matches the API being called.
 * Missing Referer remains **allowed** so tests and non-browser callers keep working.
 */
export function validateSubscriberStudyLaunchSurface(
  req: Pick<Request, "headers">,
  expected: StudyLaunchSurface,
): SubscriberStudyLaunchSurfaceResult {
  const headerSurface = subscriberStudyLaunchSurfaceHeader(req);
  if (headerSurface && headerSurface !== expected) {
    return {
      ok: false,
      error: "INVALID_SURFACE",
      expected,
      received: headerSurface,
      reason: `Launch surface header mismatch (expected ${expected}, received ${headerSurface}).`,
    };
  }

  const pathname = subscriberStudyLaunchPathname(req);
  if (!pathname) return { ok: true };

  if (expected === "practice_exams" || expected === "cat") {
    if (!pathname.startsWith("/app")) {
      return {
        ok: false,
        error: "INVALID_SURFACE",
        expected,
        received: "non_app_referer",
        reason: "Practice exams must be started from inside the signed-in study app.",
      };
    }
    if (isSubscriberFlashcardsAppPath(pathname)) {
      return {
        ok: false,
        error: "INVALID_SURFACE",
        expected,
        received: "flashcards",
        reason: "Practice exams cannot be started from the flashcards study surface.",
      };
    }
    return { ok: true };
  }

  if (expected === "flashcards") {
    if (!pathname.startsWith("/app")) {
      return {
        ok: false,
        error: "INVALID_SURFACE",
        expected,
        received: "non_app_referer",
        reason: "Flashcards must be reviewed from inside the signed-in study app.",
      };
    }
    if (isSubscriberPracticeTestsAppPath(pathname)) {
      return {
        ok: false,
        error: "INVALID_SURFACE",
        expected,
        received: "practice_tests",
        reason: "Flashcards progress cannot be saved from the practice-tests study surface.",
      };
    }
    return { ok: true };
  }

  return { ok: true };
}

export function validateFlashcardsPostLaunchRequest(req: Pick<Request, "headers">): SubscriberStudyLaunchSurfaceResult {
  return validateSubscriberStudyLaunchSurface(req, "flashcards");
}

/**
 * Reject practice-exam POST when we can prove the browser tab is on a different study product
 * (e.g. flashcards). Missing Referer is allowed so tests and non-browser callers keep working.
 */
export function validatePracticeExamPostLaunchRequest(req: Pick<Request, "headers">): SubscriberStudyLaunchSurfaceResult {
  return validateSubscriberStudyLaunchSurface(req, "practice_exams");
}
