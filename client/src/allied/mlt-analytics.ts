import {
  trackGA4ExamStart,
  trackGA4ExamComplete,
  trackGA4QuizStart,
  trackGA4QuizComplete,
  trackGA4LessonStart,
  trackGA4LessonComplete,
  trackGA4FlashcardStudy,
  trackGA4Upgrade,
  trackGA4CtaClick,
} from "@/components/analytics-tracker";

type MltEventCategory = "page_view" | "quiz" | "lesson" | "flashcard" | "exam" | "conversion" | "study_plan" | "wrong_answer" | "remediation";

interface MltAnalyticsEvent {
  eventType: string;
  eventCategory: MltEventCategory;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  metadata?: Record<string, any>;
  page?: string;
  country?: string;
}

function getSessionId(): string {
  let sid = sessionStorage.getItem("mlt_session_id");
  if (!sid) {
    sid = `mlt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("mlt_session_id", sid);
  }
  return sid;
}

function getUserId(): string | null {
  try {
    const stored = localStorage.getItem("nursenest-user");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.id || null;
    }
  } catch {}
  return null;
}

export function trackMltEvent(event: MltAnalyticsEvent): void {
  const payload = {
    ...event,
    userId: getUserId(),
    sessionId: getSessionId(),
    page: event.page || window.location.pathname,
  };

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/mlt/analytics/event", blob);
    } else {
      fetch("/api/mlt/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}
}

export function trackMltPageView(page: string, country?: string): void {
  trackMltEvent({
    eventType: "page_view",
    eventCategory: "page_view",
    eventAction: "view",
    eventLabel: page,
    page,
    country,
  });
}

export function trackMltQuizStart(discipline: string, questionCount: number): void {
  trackMltEvent({
    eventType: "quiz_start",
    eventCategory: "quiz",
    eventAction: "start",
    eventLabel: discipline,
    eventValue: questionCount,
  });
  trackGA4QuizStart("mlt", discipline, questionCount);
}

export function trackMltQuizComplete(discipline: string, score: number, total: number): void {
  trackMltEvent({
    eventType: "quiz_complete",
    eventCategory: "quiz",
    eventAction: "complete",
    eventLabel: discipline,
    eventValue: score,
    metadata: { total, percentage: Math.round((score / total) * 100) },
  });
  trackGA4QuizComplete("mlt", discipline, score, total);
}

export function trackMltLessonStart(lessonId: string, discipline: string): void {
  trackMltEvent({
    eventType: "lesson_start",
    eventCategory: "lesson",
    eventAction: "start",
    eventLabel: discipline,
    metadata: { lessonId },
  });
  trackGA4LessonStart("mlt", lessonId);
}

export function trackMltLessonComplete(lessonId: string, discipline: string): void {
  trackMltEvent({
    eventType: "lesson_complete",
    eventCategory: "lesson",
    eventAction: "complete",
    eventLabel: discipline,
    metadata: { lessonId },
  });
  trackGA4LessonComplete("mlt", lessonId);
}

export function trackMltFlashcardStudy(deckTitle: string, cardsStudied: number): void {
  trackMltEvent({
    eventType: "flashcard_study",
    eventCategory: "flashcard",
    eventAction: "study",
    eventLabel: deckTitle,
    eventValue: cardsStudied,
  });
  trackGA4FlashcardStudy("mlt", deckTitle, cardsStudied);
}

export function trackMltExamStart(examType: string, country: string): void {
  trackMltEvent({
    eventType: "exam_start",
    eventCategory: "exam",
    eventAction: "start",
    eventLabel: examType,
    country,
  });
  trackGA4ExamStart("mlt", examType);
}

export function trackMltExamComplete(examType: string, score: number, country: string): void {
  trackMltEvent({
    eventType: "exam_complete",
    eventCategory: "exam",
    eventAction: "complete",
    eventLabel: examType,
    eventValue: score,
    country,
  });
  trackGA4ExamComplete("mlt", examType, score, 100);
}

export function trackMltConversionEvent(action: string, tier?: string): void {
  trackMltEvent({
    eventType: "conversion",
    eventCategory: "conversion",
    eventAction: action,
    eventLabel: tier,
  });
  if (action === "upgrade" && tier) {
    trackGA4Upgrade("mlt", "free", tier);
  } else if (action === "signup") {
    trackGA4Signup("mlt", "conversion");
  } else {
    trackGA4CtaClick("mlt", action);
  }
}

export function trackMltUpgradePromptShown(location: string): void {
  trackMltEvent({
    eventType: "upgrade_prompt_shown",
    eventCategory: "conversion",
    eventAction: "prompt_shown",
    eventLabel: location,
  });
}

export function trackMltUpgradeClick(location: string): void {
  trackMltEvent({
    eventType: "upgrade_click",
    eventCategory: "conversion",
    eventAction: "upgrade_click",
    eventLabel: location,
  });
  trackGA4CtaClick("mlt", "upgrade");
}
