/**
 * Marketing-safe CTAs and hubs for blog posts (no /app/* in primary hrefs).
 * Maps admin exam labels (e.g. NCLEX-RN, NP-US) + country to real pathway URLs.
 */

import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate, CountryCode } from "@prisma/client";
import { ALLIED, HUB, NP, PN, RN } from "@/lib/marketing/marketing-entry-routes";

export type BlogCountryContext = "US" | "CA" | "unspecified";

export function blogCountryFromPrismaTarget(ct: CountryCode | null | undefined): BlogCountryContext {
  if (ct === CountryCode.CA) return "CA";
  if (ct === CountryCode.US) return "US";
  return "unspecified";
}

export type MarketingStudyHubs = {
  lessonsHub: string;
  questionBankHub: string;
  /** Public CAT / practice exam directory */
  practiceExamsHub: string;
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
  });

  if (u.includes("NCLEX-RN") || u.includes("NCLEX RN")) {
    return {
      lessonsHub: ca ? RN.caLessons : RN.usLessons,
      questionBankHub: ca ? RN.caQuestions : RN.usQuestions,
      practiceExamsHub: HUB.practiceExams,
    };
  }
  if (u.includes("NCLEX-PN")) {
    return {
      lessonsHub: PN.usLessons,
      questionBankHub: PN.usQuestions,
      practiceExamsHub: HUB.practiceExams,
      practiceProgrammatic: PN.practiceProgrammaticUs,
    };
  }
  if (u.includes("REX") || u.includes("REX-PN")) {
    return {
      lessonsHub: PN.caLessons,
      questionBankHub: PN.caQuestions,
      practiceExamsHub: HUB.practiceExams,
      practiceProgrammatic: PN.practiceProgrammatic,
    };
  }
  if (u.includes("CNPLE")) {
    return {
      lessonsHub: NP.caNpLessons,
      questionBankHub: NP.caNpQuestions,
      practiceExamsHub: HUB.practiceExams,
      practiceProgrammatic: NP.practiceProgrammaticCa,
    };
  }
  if (u.includes("NP")) {
    return {
      lessonsHub: NP.fnpLessons,
      questionBankHub: NP.fnpQuestions,
      practiceExamsHub: HUB.practiceExams,
      practiceProgrammatic: NP.practiceProgrammatic,
    };
  }
  if (u.includes("ALLIED") || u.toLowerCase().includes("allied")) {
    return {
      lessonsHub: us ? `${ALLIED.usHub}/lessons` : `${ALLIED.caHub}/lessons`,
      questionBankHub: us ? ALLIED.usQuestions : ALLIED.caQuestions,
      practiceExamsHub: HUB.practiceExams,
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
