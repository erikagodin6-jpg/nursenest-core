import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getPlatformSection } from "@shared/platform-sections";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

function gtagEvent(eventName: string, params: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

function extractProfession(path: string): string | null {
  const professionSlugs = [
    "nursing", "mlt", "paramedic", "imaging", "rrt",
    "pharmacy-tech", "social-worker", "psychotherapist",
    "occupational-therapy", "physical-therapy", "addictions-counsellor",
    "critical-care", "emergency-nursing",
  ];
  for (const slug of professionSlugs) {
    if (path.includes(`/${slug}`)) return slug;
  }
  if (path.includes("/rpn") || path.includes("/rn") || path.includes("/np")) return "nursing";
  return null;
}

export default function AnalyticsTracker() {
  const [location] = useLocation();
  const previousSectionRef = useRef<string>("");
  const previousPageRef = useRef<string>("");

  useEffect(() => {
    const profession = extractProfession(location);
    const platformSection = getPlatformSection(location);
    const previousSection = previousSectionRef.current;
    const previousPage = previousPageRef.current;

    gtagEvent("page_view", {
      page_path: location,
      page_location: window.location.href,
      page_title: document.title,
      platform_section: platformSection,
      ...(profession && { profession }),
    });

    if (previousSection && previousSection !== platformSection && previousSection !== "other" && platformSection !== "other") {
      gtagEvent("cross_section_navigation", {
        source_section: previousSection,
        destination_section: platformSection,
        source_page: previousPage,
        destination_page: location,
        event_category: "navigation",
      });
    }

    previousSectionRef.current = platformSection;
    previousPageRef.current = location;
  }, [location]);

  return null;
}

export function trackCrossSectionClick(sourceSection: string, destinationSection: string, linkText: string) {
  gtagEvent("cross_section_click", {
    source_section: sourceSection,
    destination_section: destinationSection,
    link_text: linkText,
    event_category: "navigation",
  });
}

export function trackEducationToCareerConversion(profession: string, sourceActivity: string) {
  gtagEvent("education_to_career_conversion", {
    profession,
    source_activity: sourceActivity,
    event_category: "conversion",
  });
}

export function trackCheckoutBegin(productName: string, productPrice: number) {
  gtagEvent("begin_checkout", {
    currency: "CAD",
    value: productPrice,
    items: [{ item_name: productName, price: productPrice }],
  });
}

export function trackPurchase(orderId: string, totalAmount: number) {
  gtagEvent("purchase", {
    transaction_id: orderId,
    value: totalAmount,
    currency: "CAD",
  });
}

export function trackGA4ExamStart(profession: string, examType: string) {
  gtagEvent("exam_start", {
    profession,
    exam_type: examType,
    event_category: "engagement",
  });
}

export function trackGA4ExamComplete(profession: string, examType: string, score: number, total: number) {
  gtagEvent("exam_complete", {
    profession,
    exam_type: examType,
    score,
    total_questions: total,
    percentage: Math.round((score / total) * 100),
    event_category: "engagement",
  });
}

export function trackGA4QuestionAnswered(profession: string, correct: boolean) {
  gtagEvent("question_answered", {
    profession,
    correct: correct ? "yes" : "no",
    event_category: "engagement",
  });
}

export function trackGA4QuizStart(profession: string, topic: string, questionCount: number) {
  gtagEvent("quiz_start", {
    profession,
    topic,
    question_count: questionCount,
    event_category: "engagement",
  });
}

export function trackGA4QuizComplete(profession: string, topic: string, score: number, total: number) {
  gtagEvent("quiz_complete", {
    profession,
    topic,
    score,
    total_questions: total,
    percentage: Math.round((score / total) * 100),
    event_category: "engagement",
  });
}

export function trackGA4Signup(profession: string, source: string) {
  gtagEvent("sign_up", {
    profession,
    source,
    method: "email",
    event_category: "conversion",
  });
}

export function trackGA4EmailCapture(profession: string, source: string) {
  gtagEvent("generate_lead", {
    profession,
    source,
    event_category: "conversion",
  });
}

export function trackGA4Upgrade(profession: string, fromTier: string, toTier: string) {
  gtagEvent("upgrade", {
    profession,
    from_tier: fromTier,
    to_tier: toTier,
    event_category: "conversion",
  });
}

export function trackGA4LessonStart(profession: string, lessonId: string) {
  gtagEvent("lesson_start", {
    profession,
    lesson_id: lessonId,
    event_category: "engagement",
  });
}

export function trackGA4LessonComplete(profession: string, lessonId: string) {
  gtagEvent("lesson_complete", {
    profession,
    lesson_id: lessonId,
    event_category: "engagement",
  });
}

export function trackGA4FlashcardStudy(profession: string, deckTitle: string, cardsStudied: number) {
  gtagEvent("flashcard_study", {
    profession,
    deck_title: deckTitle,
    cards_studied: cardsStudied,
    event_category: "engagement",
  });
}

export function trackGA4CtaClick(profession: string, ctaVariant: string) {
  gtagEvent("cta_click", {
    profession,
    cta_variant: ctaVariant,
    event_category: "conversion",
  });
}
