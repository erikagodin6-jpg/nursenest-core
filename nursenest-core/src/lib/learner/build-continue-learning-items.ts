import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { coerceSafeLearnerNavHref } from "@/lib/learner/safe-app-href";

const MAX_ITEMS = 6;

export type ContinueLearningItem =
  | { kind: "continue"; title: string; href: string }
  | { kind: "practice_resume"; title: string; href: string }
  | { kind: "flashcard_resume"; title: string; href: string }
  | { kind: "track"; title: string; href: string; pathwayShortName: string }
  | { kind: "mock"; href: string; examTitle: string; pct: number }
  | { kind: "fallback"; target: "questions" | "lessons" };

export type ContinueLearningLink = { title: string; href: string };

/** Optional resume rows from {@link loadStudyResumeExtras} (flashcards + paused practice tests). */
export type StudyResumeExtrasForContinue = {
  practice: { title: string; href: string } | null;
  flashcard: { title: string; href: string } | null;
};

/**
 * Bounded list from snapshot fields plus optional flashcard / practice-test resume extras.
 */
export function buildContinueLearningItems(
  snapshot: Pick<PremiumDashboardSnapshot, "continueLesson" | "lessonContinuations" | "recentMocks">,
  extras?: StudyResumeExtrasForContinue | null,
): ContinueLearningItem[] {
  const out: ContinueLearningItem[] = [];
  const seenHref = new Set<string>();

  const canPush = (href: string) => {
    const h = coerceSafeLearnerNavHref(href);
    if (!h || seenHref.has(h)) return false;
    seenHref.add(h);
    return true;
  };

  if (snapshot.continueLesson?.href && canPush(snapshot.continueLesson.href)) {
    out.push({
      kind: "continue",
      title: snapshot.continueLesson.title.trim() || "Continue lesson",
      href: coerceSafeLearnerNavHref(snapshot.continueLesson.href),
    });
  }

  if (extras?.practice?.href && canPush(extras.practice.href)) {
    out.push({
      kind: "practice_resume",
      title: extras.practice.title.trim() || "Resume practice",
      href: coerceSafeLearnerNavHref(extras.practice.href),
    });
  }

  if (extras?.flashcard?.href && canPush(extras.flashcard.href)) {
    out.push({
      kind: "flashcard_resume",
      title: extras.flashcard.title.trim() || "Resume flashcards",
      href: coerceSafeLearnerNavHref(extras.flashcard.href),
    });
  }

  for (const row of snapshot.lessonContinuations ?? []) {
    if (out.length >= MAX_ITEMS) break;
    if (!canPush(row.href)) continue;
    out.push({
      kind: "track",
      title: row.title,
      href: coerceSafeLearnerNavHref(row.href),
      pathwayShortName: row.pathwayShortName,
    });
  }

  const mock = snapshot.recentMocks?.[0];
  if (mock && out.length < MAX_ITEMS && canPush(`/app/exams/attempts/${mock.id}`)) {
    out.push({
      kind: "mock",
      href: `/app/exams/attempts/${mock.id}`,
      examTitle: mock.examTitle,
      pct: mock.pct,
    });
  }

  if (out.length === 0) {
    out.push({ kind: "fallback", target: "questions" });
    out.push({ kind: "fallback", target: "lessons" });
  } else if (out.length < 2) {
    out.push({ kind: "fallback", target: "questions" });
  }

  return out.slice(0, MAX_ITEMS);
}

/** Resolve i18n titles for dashboard / client surfaces. */
export function continueLearningItemsToLinks(items: ContinueLearningItem[], t: LearnerMarketingT): ContinueLearningLink[] {
  return items.map((it) => {
    switch (it.kind) {
      case "continue":
        return { title: it.title, href: it.href };
      case "practice_resume":
        return { title: it.title, href: it.href };
      case "flashcard_resume":
        return { title: it.title, href: it.href };
      case "track":
        return { title: `${it.title} · ${it.pathwayShortName}`, href: it.href };
      case "mock":
        return {
          title: t("learner.retention.mockReview", { exam: it.examTitle, pct: it.pct }),
          href: it.href,
        };
      case "fallback":
        return {
          title:
            it.target === "lessons"
              ? t("learner.retention.fallbackLessons")
              : t("learner.retention.fallbackBank"),
          href: it.target === "lessons" ? "/app/lessons" : "/app/questions",
        };
    }
  });
}
