/**
 * Paid learner study surfaces — prevent CTAs from silently routing to the wrong product.
 * Use in tests and (optionally) dev-only assertions at launcher boundaries.
 */

export function isSubscriberFlashcardsAppPath(href: string): boolean {
  const path = (href.split("?")[0] ?? "").trim();
  return path === "/app/flashcards" || path.startsWith("/app/flashcards/");
}

export function isSubscriberPracticeExamsAppPath(href: string): boolean {
  const path = (href.split("?")[0] ?? "").trim();
  return path === "/app/exams" || path.startsWith("/app/exams/");
}
