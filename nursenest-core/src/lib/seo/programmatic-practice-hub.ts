import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import {
  HUB,
  NP,
  PN,
  RN,
  loginWithCallback,
  pnLessons,
  pnQuestions,
  rnLessons,
  rnQuestions,
} from "@/lib/marketing/marketing-entry-routes";
import { getExamTrack, type ExamKey } from "@/lib/content/master-topic-map";

export type PracticeHubContext = {
  examKey: ExamKey;
  examLabel: string;
  lead: string;
  categoryHeading: string;
  systemHeading: string;
  ctas: {
    questions: string;
    lessons: string;
    testBank: string;
    exams: string;
    studyPlan: string | null;
    pricing: string;
  };
};

export function isUnifiedPracticeSlug(slug: string): boolean {
  return (
    slug === "nclex-rn-practice-questions" ||
    slug === "nclex-pn-practice-questions" ||
    slug === "rex-pn-practice-questions" ||
    slug === "np-exam-practice-questions" ||
    slug === "cnple-practice-questions"
  );
}

function examKeyForSlug(slug: string): ExamKey {
  if (slug === "nclex-rn-practice-questions") return "RN";
  if (slug === "nclex-pn-practice-questions" || slug === "rex-pn-practice-questions") return "PN";
  return "NP";
}

export function buildPracticeHubContext(slug: string, region: MarketingRegionToggle, locale: string): PracticeHubContext {
  const loc = (path: string) => withMarketingLocale(locale, path);
  const examKey = examKeyForSlug(slug);

  if (examKey === "RN") {
    const examLabel = region === "US" ? "NCLEX-RN Practice Questions" : "Canadian RN Entry-to-Practice Questions";
    const lead =
      region === "US"
        ? "Prepare for the NCLEX-RN with client-needs categories, rationales, and targeted remediation."
        : "Prepare for Canadian RN entry-to-practice exams with category-driven questions, system review, and realistic rationale feedback.";
    return {
      examKey,
      examLabel,
      lead,
      categoryHeading: region === "US" ? "Client Needs categories" : "Core nursing competency categories",
      systemHeading: "Systems / topic groups",
      ctas: {
        questions: loc(rnQuestions(region)),
        lessons: loc(rnLessons(region)),
        testBank: loc("/test-bank"),
        exams: loc(loginWithCallback(RN.appExams)),
        studyPlan: loc("/nclex-study-plan"),
        pricing: loc(HUB.pricing),
      },
    };
  }

  if (examKey === "PN") {
    const examLabel = region === "US" ? "NCLEX-PN Practice Questions" : "REx-PN Practice Questions";
    const lead =
      region === "US"
        ? "Prepare for the NCLEX-PN with practical-nursing scope, safety, and delegation-focused practice."
        : "Prepare for the REx-PN entry-to-practice exam with Canadian terminology and scope-aware PN scenarios.";
    return {
      examKey,
      examLabel,
      lead,
      categoryHeading: "Client Needs categories",
      systemHeading: "Systems / topic groups",
      ctas: {
        questions: loc(pnQuestions(region)),
        lessons: loc(pnLessons(region)),
        testBank: loc("/test-bank"),
        exams: loc(loginWithCallback(RN.appExams)),
        studyPlan: loc("/nclex-study-plan"),
        pricing: loc(HUB.pricing),
      },
    };
  }

  const examLabel = region === "US" ? "FNP / NP Practice Questions" : "Canadian NP Practice Questions";
  const lead =
    region === "US"
      ? "Train advanced NP reasoning with pharmacotherapy, diagnostics, and management decisions."
      : "Train Canadian NP clinical reasoning for entry-to-practice with case-based management and differential focus.";

  return {
    examKey,
    examLabel,
    lead,
    categoryHeading: "Clinical domains",
    systemHeading: "Systems / topic groups",
    ctas: {
      questions: loc(region === "US" ? NP.fnpQuestions : NP.caNpQuestions),
      lessons: loc(region === "US" ? NP.fnpLessons : NP.caNpHub),
      testBank: loc("/test-bank"),
      exams: loc(loginWithCallback(RN.appExams)),
      studyPlan: region === "CA" ? loc("/np-study-guide-canada") : null,
      pricing: loc(HUB.pricing),
    },
  };
}

export type PracticeTaxonomyCategory = {
  id: string;
  name: string;
  systems: string[];
};

export function buildPracticeTaxonomy(examKey: ExamKey): PracticeTaxonomyCategory[] {
  const track = getExamTrack(examKey);
  return track.categories.map((c) => ({
    id: c.id,
    name: c.name,
    systems: c.topics.slice(0, 6).map((t) => t.name),
  }));
}

