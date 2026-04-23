/**
 * Marketing-safe CTAs and hubs for blog posts (no /app/* in primary hrefs).
 * Maps admin exam labels (e.g. NCLEX-RN, NP-US) + country to real pathway URLs.
 */

import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate, CountryCode } from "@prisma/client";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { ALLIED, HUB, NP, PN, RN } from "@/lib/marketing/marketing-entry-routes";

export type BlogCountryContext = "US" | "CA" | "unspecified";

export function blogCountryFromPrismaTarget(ct: CountryCode | null | undefined): BlogCountryContext {
  if (ct === CountryCode.CA) return "CA";
  if (ct === CountryCode.US) return "US";
  return "unspecified";
}

/** Map marketing pathway region segment (`canada` | `us` | …) to blog CTA country context. */
export function blogCountryFromRegionSlug(regionSlug: string | null | undefined): BlogCountryContext {
  const s = (regionSlug ?? "").trim().toLowerCase();
  if (s === "canada" || s === "ca") return "CA";
  if (s === "us" || s === "usa" || s === "united-states") return "US";
  return "unspecified";
}

export type MarketingStudyHubs = {
  lessonsHub: string;
  questionBankHub: string;
  /** Public CAT / practice exam directory */
  practiceExamsHub: string;
  /** Pathway-scoped practice questions (preferred for internal links + auto-link targets). */
  pathwayQuestionsHub?: string;
  /** Pathway CAT landing (public marketing). */
  pathwayCatHub?: string;
  /** Public flashcards index (pathway decks deep-link from hub cards). */
  flashcardsHub: string;
  /** Optional programmatic practice landing for SEO */
  practiceProgrammatic?: string;
};

/**
 * Resolve public lesson + question hubs for blog CTAs and internal-link hints.
 */
export function marketingStudyHubsForBlogExam(exam: string, country: BlogCountryContext): MarketingStudyHubs {
  const u = exam.trim().toUpperCase();
  const ca = country === "CA";
  const us = country === "US" || country === "unspecified";

  const base = (): MarketingStudyHubs => ({
    lessonsHub: HUB.examLessons,
    questionBankHub: HUB.questionBank,
    practiceExamsHub: HUB.practiceExams,
    flashcardsHub: HUB.flashcards,
  });

  if (u.includes("NCLEX-RN") || u.includes("NCLEX RN")) {
    const rnPath = { countrySlug: "canada" as const, roleTrack: "rn" as const, examCode: "nclex-rn" as const };
    return {
      lessonsHub: ca ? RN.caLessons : RN.usLessons,
      questionBankHub: ca ? RN.caQuestions : RN.usQuestions,
      practiceExamsHub: HUB.practiceExams,
      flashcardsHub: HUB.flashcards,
      pathwayQuestionsHub: ca ? buildExamPathwayPath(rnPath, "questions") : undefined,
      pathwayCatHub: ca ? buildExamPathwayPath(rnPath, "cat") : buildExamPathwayPath(
        { countrySlug: "us", roleTrack: "rn", examCode: "nclex-rn" },
        "cat",
      ),
    };
  }
  if (u.includes("NCLEX-PN")) {
    const pnUs = { countrySlug: "us" as const, roleTrack: "lpn" as const, examCode: "nclex-pn" as const };
    return {
      lessonsHub: PN.usLessons,
      questionBankHub: PN.usQuestions,
      practiceExamsHub: HUB.practiceExams,
      flashcardsHub: HUB.flashcards,
      pathwayQuestionsHub: buildExamPathwayPath(pnUs, "questions"),
      pathwayCatHub: buildExamPathwayPath(pnUs, "cat"),
      practiceProgrammatic: PN.practiceProgrammaticUs,
    };
  }
  if (u.includes("REX") || u.includes("REX-PN")) {
    const rex = { countrySlug: "canada" as const, roleTrack: "rpn" as const, examCode: "rex-pn" as const };
    return {
      lessonsHub: PN.caLessons,
      questionBankHub: PN.caQuestions,
      practiceExamsHub: HUB.practiceExams,
      flashcardsHub: HUB.flashcards,
      pathwayQuestionsHub: buildExamPathwayPath(rex, "questions"),
      pathwayCatHub: buildExamPathwayPath(rex, "cat"),
      practiceProgrammatic: PN.practiceProgrammatic,
    };
  }
  if (u.includes("CNPLE")) {
    const cnple = { countrySlug: "canada" as const, roleTrack: "np" as const, examCode: "cnple" as const };
    return {
      lessonsHub: NP.caNpLessons,
      questionBankHub: NP.caNpQuestions,
      practiceExamsHub: HUB.practiceExams,
      flashcardsHub: HUB.flashcards,
      pathwayQuestionsHub: buildExamPathwayPath(cnple, "questions"),
      pathwayCatHub: buildExamPathwayPath(cnple, "cat"),
      practiceProgrammatic: NP.practiceProgrammaticCa,
    };
  }
  if (u.includes("NP")) {
    const fnpUs = { countrySlug: "us" as const, roleTrack: "np" as const, examCode: "fnp" as const };
    return {
      lessonsHub: NP.fnpLessons,
      questionBankHub: NP.fnpQuestions,
      practiceExamsHub: HUB.practiceExams,
      flashcardsHub: HUB.flashcards,
      pathwayQuestionsHub: buildExamPathwayPath(fnpUs, "questions"),
      pathwayCatHub: buildExamPathwayPath(fnpUs, "cat"),
      practiceProgrammatic: NP.practiceProgrammatic,
    };
  }
  if (u.includes("ALLIED") || u.toLowerCase().includes("allied")) {
    const caAllied = { countrySlug: "canada" as const, roleTrack: "allied" as const, examCode: "allied-health" as const };
    const usAllied = { countrySlug: "us" as const, roleTrack: "allied" as const, examCode: "allied-health" as const };
    return {
      lessonsHub: us ? `${ALLIED.usHub}/lessons` : `${ALLIED.caHub}/lessons`,
      questionBankHub: us ? ALLIED.usQuestions : ALLIED.caQuestions,
      practiceExamsHub: HUB.practiceExams,
      flashcardsHub: HUB.flashcards,
      pathwayQuestionsHub: us ? buildExamPathwayPath(usAllied, "questions") : buildExamPathwayPath(caAllied, "questions"),
      pathwayCatHub: us ? buildExamPathwayPath(usAllied, "cat") : buildExamPathwayPath(caAllied, "cat"),
    };
  }
  return base();
}

export type BlogPrimaryCta = { type: string; text: string; href: string };

/**
 * Primary post CTA: marketing URLs only (question bank hub, lessons, practice exams, pricing).
 */
export function blogPrimaryStudyCta(params: {
  exam: string;
  country: BlogCountryContext;
  intent?: BlogPostIntent | null;
  funnel?: BlogFunnelStage | null;
  template?: BlogPostTemplate | null;
}): BlogPrimaryCta {
  const hubs = marketingStudyHubsForBlogExam(params.exam, params.country);

  if (params.intent === BlogPostIntent.CONVERSION || params.funnel === BlogFunnelStage.CONVERSION) {
    return { type: "pricing", text: "See plans and unlock full prep", href: "/pricing" };
  }
  if (params.intent === BlogPostIntent.PRACTICE_QUESTIONS || params.template === BlogPostTemplate.PRACTICE_QUESTIONS) {
    return {
      type: "question_bank_hub",
      text: "Practice exam-style questions (public hub)",
      href: hubs.questionBankHub,
    };
  }
  if (params.template === BlogPostTemplate.STUDY_PLAN || params.intent === BlogPostIntent.STUDY_STRATEGY) {
    return {
      type: "lessons_hub",
      text: "Browse structured exam lessons",
      href: hubs.lessonsHub,
    };
  }
  if (params.funnel === BlogFunnelStage.RETENTION) {
    return {
      type: "practice_exams",
      text: "Try CAT-style practice exams",
      href: hubs.practiceExamsHub,
    };
  }
  return {
    type: "question_bank_hub",
    text: "Drill questions for this exam track",
    href: hubs.questionBankHub,
  };
}
