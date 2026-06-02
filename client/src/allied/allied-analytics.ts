import {
  trackGA4ExamStart,
  trackGA4ExamComplete,
  trackGA4QuizStart,
  trackGA4QuizComplete,
  trackGA4QuestionAnswered,
  trackGA4Signup,
  trackGA4EmailCapture,
  trackGA4Upgrade,
  trackGA4LessonStart,
  trackGA4LessonComplete,
  trackGA4FlashcardStudy,
  trackGA4CtaClick,
} from "@/components/analytics-tracker";

type AlliedEventCategory = "page_view" | "quiz" | "lesson" | "flashcard" | "exam" | "conversion" | "study_plan" | "cta_click" | "email_capture" | "social_share";

interface AlliedAnalyticsEvent {
  eventType: string;
  eventCategory: AlliedEventCategory;
  eventAction: string;
  profession: string;
  eventLabel?: string;
  eventValue?: number;
  metadata?: Record<string, any>;
  page?: string;
  country?: string;
}

function getSessionId(): string {
  let sid = sessionStorage.getItem("allied_session_id");
  if (!sid) {
    sid = `allied_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("allied_session_id", sid);
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

export function trackAlliedEvent(event: AlliedAnalyticsEvent): void {
  const payload = {
    eventType: event.eventType,
    profession: event.profession,
    page: event.page || window.location.pathname,
    sessionId: getSessionId(),
    metadata: {
      ...event.metadata,
      eventCategory: event.eventCategory,
      eventAction: event.eventAction,
      eventLabel: event.eventLabel,
      eventValue: event.eventValue,
      userId: getUserId(),
      country: event.country,
    },
  };

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/allied-marketing/track-event", blob);
    } else {
      fetch("/api/allied-marketing/track-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}
}

export function trackAlliedPageView(profession: string, page?: string, country?: string): void {
  trackAlliedEvent({
    eventType: "page_view",
    eventCategory: "page_view",
    eventAction: "view",
    profession,
    eventLabel: page || window.location.pathname,
    page,
    country,
  });
}

export function trackAlliedQuizStart(profession: string, topic: string, questionCount: number): void {
  trackAlliedEvent({
    eventType: "quiz_start",
    eventCategory: "quiz",
    eventAction: "start",
    profession,
    eventLabel: topic,
    eventValue: questionCount,
  });
  trackGA4QuizStart(profession, topic, questionCount);
}

export function trackAlliedQuizComplete(profession: string, topic: string, score: number, total: number): void {
  trackAlliedEvent({
    eventType: "quiz_complete",
    eventCategory: "quiz",
    eventAction: "complete",
    profession,
    eventLabel: topic,
    eventValue: score,
    metadata: { total, percentage: Math.round((score / total) * 100) },
  });
  trackGA4QuizComplete(profession, topic, score, total);
}

export function trackAlliedLessonStart(profession: string, lessonId: string): void {
  trackAlliedEvent({
    eventType: "lesson_start",
    eventCategory: "lesson",
    eventAction: "start",
    profession,
    eventLabel: lessonId,
  });
  trackGA4LessonStart(profession, lessonId);
}

export function trackAlliedLessonComplete(profession: string, lessonId: string): void {
  trackAlliedEvent({
    eventType: "lesson_complete",
    eventCategory: "lesson",
    eventAction: "complete",
    profession,
    eventLabel: lessonId,
  });
  trackGA4LessonComplete(profession, lessonId);
}

export function trackAlliedFlashcardStudy(profession: string, deckTitle: string, cardsStudied: number): void {
  trackAlliedEvent({
    eventType: "flashcard_study",
    eventCategory: "flashcard",
    eventAction: "study",
    profession,
    eventLabel: deckTitle,
    eventValue: cardsStudied,
  });
  trackGA4FlashcardStudy(profession, deckTitle, cardsStudied);
}

export function trackAlliedExamStart(profession: string, examType: string, country?: string): void {
  trackAlliedEvent({
    eventType: "exam_start",
    eventCategory: "exam",
    eventAction: "start",
    profession,
    eventLabel: examType,
    country,
  });
  trackGA4ExamStart(profession, examType);
}

export function trackAlliedExamComplete(profession: string, examType: string, score: number, country?: string): void {
  trackAlliedEvent({
    eventType: "exam_complete",
    eventCategory: "exam",
    eventAction: "complete",
    profession,
    eventLabel: examType,
    eventValue: score,
    country,
  });
  trackGA4ExamComplete(profession, examType, score, 100);
}

export function trackAlliedConversion(profession: string, action: string, tier?: string): void {
  trackAlliedEvent({
    eventType: "conversion",
    eventCategory: "conversion",
    eventAction: action,
    profession,
    eventLabel: tier,
  });
  if (action === "upgrade" && tier) {
    trackGA4Upgrade(profession, "free", tier);
  } else if (action === "signup") {
    trackGA4Signup(profession, "conversion");
  } else {
    trackGA4CtaClick(profession, action);
  }
}

export function trackAlliedUpgradePromptShown(profession: string, location: string): void {
  trackAlliedEvent({
    eventType: "upgrade_prompt_shown",
    eventCategory: "conversion",
    eventAction: "prompt_shown",
    profession,
    eventLabel: location,
  });
}

export function trackAlliedUpgradeClick(profession: string, location: string): void {
  trackAlliedEvent({
    eventType: "upgrade_click",
    eventCategory: "conversion",
    eventAction: "upgrade_click",
    profession,
    eventLabel: location,
  });
  trackGA4CtaClick(profession, "upgrade");
}

export function trackAlliedCtaClick(profession: string, ctaVariant: string, abVariant: string): void {
  trackAlliedEvent({
    eventType: "cta_click",
    eventCategory: "cta_click",
    eventAction: "click",
    profession,
    eventLabel: ctaVariant,
    metadata: { abVariant },
  });
  trackGA4CtaClick(profession, ctaVariant);
}

export function trackAlliedEmailCapture(profession: string, source: string): void {
  trackAlliedEvent({
    eventType: "email_capture",
    eventCategory: "email_capture",
    eventAction: "capture",
    profession,
    eventLabel: source,
  });
  trackGA4EmailCapture(profession, source);
}

export function trackAlliedSignup(profession: string, source: string): void {
  trackAlliedEvent({
    eventType: "signup",
    eventCategory: "conversion",
    eventAction: "signup",
    profession,
    eventLabel: source,
  });
  trackGA4Signup(profession, source);
}

export function trackAlliedPracticeQuestionUsage(profession: string, questionId: string, correct: boolean): void {
  trackAlliedEvent({
    eventType: "practice_question",
    eventCategory: "quiz",
    eventAction: correct ? "correct" : "incorrect",
    profession,
    eventLabel: questionId,
    eventValue: correct ? 1 : 0,
  });
  trackGA4QuestionAnswered(profession, correct);
}

export function trackAlliedMockExamAttempt(profession: string, examId: string, score: number, totalQuestions: number): void {
  trackAlliedEvent({
    eventType: "mock_exam_attempt",
    eventCategory: "exam",
    eventAction: "attempt",
    profession,
    eventLabel: examId,
    eventValue: score,
    metadata: { totalQuestions, percentage: Math.round((score / totalQuestions) * 100) },
  });
  trackGA4ExamComplete(profession, examId, score, totalQuestions);
}
