import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

const MAX_ITEMS = 4;

export type ContinueLearningItem =
  | { kind: "continue"; title: string; href: string }
  | { kind: "track"; title: string; href: string; pathwayShortName: string }
  | { kind: "mock"; href: string; examTitle: string; pct: number }
  | { kind: "fallback"; target: "questions" | "lessons" };

export type ContinueLearningLink = { title: string; href: string };

/**
 * Bounded list from existing snapshot fields only — no extra queries.
 */
export function buildContinueLearningItems(
  snapshot: Pick<PremiumDashboardSnapshot, "continueLesson" | "lessonContinuations" | "recentMocks">,
): ContinueLearningItem[] {
  const out: ContinueLearningItem[] = [];
  const seenHref = new Set<string>();

  const canPush = (href: string) => {
    const h = href.trim();
    if (!h || seenHref.has(h)) return false;
    seenHref.add(h);
    return true;
  };

  if (snapshot.continueLesson?.href && canPush(snapshot.continueLesson.href)) {
    out.push({
      kind: "continue",
      title: snapshot.continueLesson.title.trim() || "Continue lesson",
      href: snapshot.continueLesson.href,
    });
  }

  for (const row of snapshot.lessonContinuations ?? []) {
    if (out.length >= MAX_ITEMS) break;
    if (!canPush(row.href)) continue;
    out.push({
      kind: "track",
      title: row.title,
      href: row.href,
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
