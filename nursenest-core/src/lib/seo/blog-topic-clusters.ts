/**
 * Programmatic SEO blog topic clusters.
 *
 * NOT one blog per lesson. Instead: high-intent topic clusters that link to
 * multiple lessons, question sets, and CAT exams to drive conversion.
 *
 * Each market gets 20 cluster topics organized by search intent.
 * Each topic includes internal linking targets and CTA strategy.
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";

// ── Types ────────────────────────────────────────────────────────────────────

export type SearchIntent = "informational" | "navigational" | "transactional" | "comparison";

export type TrafficPotential = "high" | "medium" | "low";
export type RankingDifficulty = "easy" | "moderate" | "hard";
export type ConversionPotential = "high" | "medium" | "low";

export type BlogTopicCluster = {
  id: string;
  title: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: SearchIntent;
  /** Lesson slugs this blog should link to (2-4). */
  linkedLessonSlugs: string[];
  /** Whether to link to the question bank. */
  linkToQuestions: boolean;
  /** Whether to link to CAT exams. */
  linkToCat: boolean;
  /** Target word count range. */
  wordCountTarget: [number, number];
  /** CTA strategy for this cluster. */
  ctaStrategy: "soft_trial" | "readiness_check" | "unlock_full" | "study_plan";
  /** Priority 1 = highest for this market. */
  priority: number;
  /** Estimated organic traffic potential. Defaults based on intent + priority. */
  trafficPotential?: TrafficPotential;
  /** How hard it is to rank for this topic. Defaults based on market competition. */
  rankingDifficulty?: RankingDifficulty;
  /** Likelihood of converting readers to paid users. Defaults based on intent. */
  conversionPotential?: ConversionPotential;
  /** SEO meta description (150-160 chars). */
  metaDescription?: string;
};

export type MarketBlogPlan = {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string;
  exam: string;
  clusters: BlogTopicCluster[];
};

// ── Route helpers ────────────────────────────────────────────────────────────

export function blogRoute(locale: string, region: string, profession: string, exam: string, slug: string): string {
  return `/${locale}/${region}/${profession}/${exam}/blog/${slug}`;
}

export function lessonsRoute(locale: string, region: string, profession: string, exam: string): string {
  return `/${locale}/${region}/${profession}/${exam}/lessons`;
}

export function questionsRoute(locale: string, region: string, profession: string, exam: string): string {
  return `/${locale}/${region}/${profession}/${exam}/questions`;
}

export function catRoute(locale: string, region: string, profession: string, exam: string): string {
  return `/${locale}/${region}/${profession}/${exam}/cat`;
}

export function lessonRoute(locale: string, region: string, profession: string, exam: string, lessonSlug: string): string {
  return `/${locale}/${region}/${profession}/${exam}/lessons/${lessonSlug}`;
}

// ── Shared lesson slugs (from scoped-gold-registry) ──────────────────────────

const LESSON = {
  clinicalJudgment: "clinical-judgment-prioritization-gold",
  sepsis: "sepsis-early-recognition-gold",
  fluidsElectrolytes: "fluids-electrolytes-emergencies-gold",
  acs: "acute-coronary-syndrome-gold",
  highAlertMeds: "high-alert-medications-gold",
  strokeIcp: "stroke-increased-icp-gold",
  shock: "shock-gold",
  canadianRpn: "canadian-rpn-high-yield-gold",
  obEmergencies: "ob-emergencies-gold",
  pediatricTriage: "pediatric-triage-emergencies-gold",
  renalDialysis: "renal-dialysis-acute-complications-gold",
  copd: "copd-gold-standard",
} as const;

// ── Philippines RN NCLEX ─────────────────────────────────────────────────────

export const PHILIPPINES_RN_NCLEX: MarketBlogPlan = {
  region: "philippines",
  locale: "en",
  profession: "rn",
  exam: "nclex-rn",
  clusters: [
    {
      id: "ph-1", title: "How to Pass the NCLEX-RN From the Philippines: Complete Study Guide", slug: "how-to-pass-nclex-rn-from-the-philippines",
      primaryKeyword: "how to pass NCLEX-RN from Philippines", secondaryKeywords: ["NCLEX Philippines study plan", "NCLEX review Philippines", "pass NCLEX first try Philippines"],
      searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: true,
      wordCountTarget: [800, 900], ctaStrategy: "study_plan", priority: 1,
    },
    {
      id: "ph-2", title: "NCLEX-RN Study Plan for Filipino Nurses Working Full-Time", slug: "nclex-study-plan-for-filipino-nurses-working-full-time",
      primaryKeyword: "NCLEX study plan working nurses Philippines", secondaryKeywords: ["study while working NCLEX", "part time NCLEX study", "NCLEX Philippines schedule"],
      searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "study_plan", priority: 2,
    },
    {
      id: "ph-3", title: "Top 10 NCLEX-RN Mistakes Filipino Test-Takers Make (and How to Avoid Them)", slug: "top-nclex-mistakes-filipino-nurses-make",
      primaryKeyword: "NCLEX mistakes Filipino nurses", secondaryKeywords: ["common NCLEX errors", "why Filipino nurses fail NCLEX", "NCLEX tips Philippines"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.highAlertMeds, LESSON.sepsis], linkToQuestions: true, linkToCat: true,
      wordCountTarget: [700, 900], ctaStrategy: "readiness_check", priority: 3,
    },
    {
      id: "ph-4", title: "NCLEX-RN Pharmacology Review: What Filipino Nurses Need to Know", slug: "nclex-pharmacology-review-for-filipino-nurses",
      primaryKeyword: "NCLEX pharmacology review Philippines", secondaryKeywords: ["NCLEX drug questions", "pharmacology NCLEX tips", "medication questions NCLEX"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 4,
    },
    {
      id: "ph-5", title: "NCLEX-RN Practice Questions: Free Sample Questions for Filipino Nurses", slug: "nclex-practice-questions-for-filipino-nurses",
      primaryKeyword: "NCLEX practice questions Philippines", secondaryKeywords: ["free NCLEX questions", "NCLEX sample questions", "NCLEX test bank Philippines"],
      searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis], linkToQuestions: true, linkToCat: true,
      wordCountTarget: [600, 800], ctaStrategy: "unlock_full", priority: 5,
    },
    {
      id: "ph-6", title: "How the NCLEX-RN CAT Format Works: A Guide for Philippine-Educated Nurses", slug: "how-nclex-cat-format-works-philippine-nurses",
      primaryKeyword: "NCLEX CAT format Philippines", secondaryKeywords: ["computer adaptive testing NCLEX", "NCLEX next generation", "NCLEX format explained"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: false, linkToCat: true,
      wordCountTarget: [600, 800], ctaStrategy: "readiness_check", priority: 6,
    },
    {
      id: "ph-7", title: "Fluid and Electrolyte NCLEX Questions: A Filipino Nurse's Study Guide", slug: "fluid-electrolyte-nclex-questions-filipino-nurses",
      primaryKeyword: "fluid and electrolyte NCLEX questions", secondaryKeywords: ["electrolyte imbalance nursing", "IV fluid NCLEX", "hyponatremia NCLEX"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.fluidsElectrolytes, LESSON.renalDialysis], linkToQuestions: true, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 7,
    },
    {
      id: "ph-8", title: "NCLEX-RN Readiness: How to Know If You're Ready to Take the Exam", slug: "nclex-readiness-how-to-know-you-are-ready",
      primaryKeyword: "NCLEX readiness Philippines", secondaryKeywords: ["am I ready for NCLEX", "NCLEX readiness assessment", "when to schedule NCLEX"],
      searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis, LESSON.shock], linkToQuestions: true, linkToCat: true,
      wordCountTarget: [600, 800], ctaStrategy: "readiness_check", priority: 8,
    },
    {
      id: "ph-9", title: "Cardiac NCLEX Questions Every Filipino Nurse Should Master", slug: "cardiac-nclex-questions-for-filipino-nurses",
      primaryKeyword: "cardiac NCLEX questions Philippines", secondaryKeywords: ["heart failure NCLEX", "ACS nursing questions", "cardiac nursing NCLEX"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.acs, LESSON.shock], linkToQuestions: true, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 9,
    },
    {
      id: "ph-10", title: "Affordable NCLEX Review Options for Filipino Nurses (2025)", slug: "affordable-nclex-review-options-for-filipino-nurses",
      primaryKeyword: "affordable NCLEX review Philippines", secondaryKeywords: ["cheap NCLEX review", "NCLEX review center alternative Philippines", "online NCLEX prep Philippines"],
      searchIntent: "comparison", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: true,
      wordCountTarget: [700, 900], ctaStrategy: "unlock_full", priority: 10,
    },
    {
      id: "ph-11", title: "NCLEX-RN Maternal and Newborn Nursing Review for Filipino Nurses", slug: "nclex-maternal-newborn-nursing-review-philippines",
      primaryKeyword: "maternal newborn NCLEX Philippines", secondaryKeywords: ["OB nursing NCLEX", "pregnancy NCLEX questions", "postpartum NCLEX"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.obEmergencies], linkToQuestions: true, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 11,
    },
    {
      id: "ph-12", title: "How to Study for the NCLEX-RN in 30 Days: Philippines Edition", slug: "study-nclex-in-30-days-philippines",
      primaryKeyword: "NCLEX 30 day study plan Philippines", secondaryKeywords: ["fast NCLEX prep", "study NCLEX quickly", "30 day NCLEX schedule"],
      searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis, LESSON.highAlertMeds, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: true,
      wordCountTarget: [800, 900], ctaStrategy: "study_plan", priority: 12,
    },
    {
      id: "ph-13", title: "NCLEX-RN Sepsis and Infection Control: What Filipino Nurses Must Know", slug: "nclex-sepsis-infection-control-filipino-nurses",
      primaryKeyword: "sepsis NCLEX questions", secondaryKeywords: ["infection control NCLEX", "sepsis nursing care", "sepsis signs NCLEX"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.sepsis, LESSON.shock], linkToQuestions: true, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 13,
    },
    {
      id: "ph-14", title: "Pediatric Nursing NCLEX Questions: Study Guide for Filipino Nurses", slug: "pediatric-nursing-nclex-questions-filipino-nurses",
      primaryKeyword: "pediatric NCLEX questions Philippines", secondaryKeywords: ["pediatric nursing NCLEX", "child nursing questions", "pedia NCLEX"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.pediatricTriage], linkToQuestions: true, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 14,
    },
    {
      id: "ph-15", title: "Clinical Judgment on the NCLEX: Why It Matters for Filipino Nurses", slug: "clinical-judgment-nclex-why-it-matters-filipino-nurses",
      primaryKeyword: "NCLEX clinical judgment Philippines", secondaryKeywords: ["NCLEX clinical judgment model", "next generation NCLEX", "clinical reasoning NCLEX"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true,
      wordCountTarget: [700, 900], ctaStrategy: "readiness_check", priority: 15,
    },
    {
      id: "ph-16", title: "NCLEX-RN Results: How to Interpret the Quick Results and What to Do Next", slug: "nclex-results-quick-results-what-to-do-next",
      primaryKeyword: "NCLEX results Philippines", secondaryKeywords: ["NCLEX quick results", "NCLEX pass or fail", "after NCLEX exam"],
      searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false,
      wordCountTarget: [600, 750], ctaStrategy: "soft_trial", priority: 16,
    },
    {
      id: "ph-17", title: "NCLEX-RN Application Process for Philippine-Educated Nurses", slug: "nclex-application-process-philippine-nurses",
      primaryKeyword: "NCLEX application Philippines", secondaryKeywords: ["NCLEX registration Philippines", "how to apply NCLEX from Philippines", "NCLEX requirements Philippines"],
      searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "study_plan", priority: 17,
    },
    {
      id: "ph-18", title: "Shock Nursing NCLEX Review: Types, Assessment, and Interventions", slug: "shock-nursing-nclex-review-types-assessment",
      primaryKeyword: "shock nursing NCLEX", secondaryKeywords: ["types of shock NCLEX", "hypovolemic shock nursing", "cardiogenic shock NCLEX"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.shock, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 18,
    },
    {
      id: "ph-19", title: "NCLEX-RN Prioritization and Delegation Questions Explained", slug: "nclex-prioritization-delegation-questions-explained",
      primaryKeyword: "NCLEX prioritization questions", secondaryKeywords: ["delegation NCLEX", "which patient to see first NCLEX", "nursing prioritization"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis], linkToQuestions: true, linkToCat: true,
      wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 19,
    },
    {
      id: "ph-20", title: "NCLEX Renal and Dialysis Questions: Essential Review for Filipino Nurses", slug: "nclex-renal-dialysis-questions-filipino-nurses",
      primaryKeyword: "renal NCLEX questions Philippines", secondaryKeywords: ["dialysis nursing NCLEX", "kidney disease NCLEX", "renal failure NCLEX"],
      searchIntent: "informational", linkedLessonSlugs: [LESSON.renalDialysis, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false,
      wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 20,
    },
  ],
};

// ── India RN NCLEX ───────────────────────────────────────────────────────────

export const INDIA_RN_NCLEX: MarketBlogPlan = {
  region: "india",
  locale: "en",
  profession: "rn",
  exam: "nclex-rn",
  clusters: [
    { id: "in-1", title: "NCLEX-RN Preparation Guide for Indian Nurses: Everything You Need to Know", slug: "nclex-rn-preparation-guide-for-indian-nurses", primaryKeyword: "NCLEX preparation India", secondaryKeywords: ["NCLEX guide Indian nurses", "NCLEX coaching India", "NCLEX study plan India"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: true, wordCountTarget: [800, 900], ctaStrategy: "study_plan", priority: 1 },
    { id: "in-2", title: "Best NCLEX Study Plan for Indian Nurses (Budget-Friendly)", slug: "best-nclex-study-plan-for-indian-nurses-budget", primaryKeyword: "NCLEX study plan India budget", secondaryKeywords: ["affordable NCLEX prep India", "NCLEX coaching alternative India", "cheap NCLEX prep"], searchIntent: "comparison", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 900], ctaStrategy: "unlock_full", priority: 2 },
    { id: "in-3", title: "Top NCLEX-RN Mistakes Indian Nurses Make and How to Fix Them", slug: "top-nclex-mistakes-indian-nurses-make", primaryKeyword: "NCLEX mistakes Indian nurses", secondaryKeywords: ["why Indian nurses fail NCLEX", "NCLEX common errors India", "NCLEX tips India"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 3 },
    { id: "in-4", title: "NCLEX-RN Pharmacology Tips for Indian Nursing Graduates", slug: "nclex-pharmacology-tips-for-indian-nursing-graduates", primaryKeyword: "NCLEX pharmacology India", secondaryKeywords: ["medication NCLEX India", "drug calculation NCLEX", "pharmacology questions NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 4 },
    { id: "in-5", title: "NCLEX-RN Practice Questions for Indian Nurses: Try Free Samples", slug: "nclex-practice-questions-for-indian-nurses-free", primaryKeyword: "NCLEX practice questions India", secondaryKeywords: ["free NCLEX questions India", "NCLEX sample test", "NCLEX question bank India"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [600, 800], ctaStrategy: "unlock_full", priority: 5 },
    { id: "in-6", title: "How Indian Nurses Can Apply for the NCLEX-RN: Step-by-Step", slug: "how-indian-nurses-apply-nclex-rn-step-by-step", primaryKeyword: "NCLEX application India", secondaryKeywords: ["NCLEX registration India", "CGFNS India", "NCLEX requirements Indian nurses"], searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "study_plan", priority: 6 },
    { id: "in-7", title: "NCLEX-RN Clinical Judgment Questions: What Indian Nurses Need to Know", slug: "nclex-clinical-judgment-questions-indian-nurses", primaryKeyword: "NCLEX clinical judgment India", secondaryKeywords: ["clinical reasoning NCLEX", "next gen NCLEX India", "NGN clinical judgment"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 7 },
    { id: "in-8", title: "NCLEX-RN vs Indian Nursing Exams: Key Differences You Must Know", slug: "nclex-vs-indian-nursing-exams-key-differences", primaryKeyword: "NCLEX vs Indian nursing exam", secondaryKeywords: ["difference NCLEX Indian exam", "Indian nursing board vs NCLEX", "NCLEX harder than Indian exam"], searchIntent: "comparison", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 900], ctaStrategy: "soft_trial", priority: 8 },
    { id: "in-9", title: "Cardiac and Cardiovascular NCLEX Review for Indian Nurses", slug: "cardiac-cardiovascular-nclex-review-indian-nurses", primaryKeyword: "cardiac NCLEX India", secondaryKeywords: ["heart failure NCLEX", "ACS nursing questions", "cardiovascular NCLEX review"], searchIntent: "informational", linkedLessonSlugs: [LESSON.acs, LESSON.shock], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 9 },
    { id: "in-10", title: "How to Study for the NCLEX-RN in 60 Days: Indian Nurse Edition", slug: "study-nclex-in-60-days-indian-nurse-edition", primaryKeyword: "NCLEX 60 day study plan India", secondaryKeywords: ["NCLEX study schedule India", "NCLEX timeline India", "two month NCLEX plan"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis, LESSON.highAlertMeds, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: true, wordCountTarget: [800, 900], ctaStrategy: "study_plan", priority: 10 },
    { id: "in-11", title: "NCLEX-RN Infection Control and Sepsis Review for Indian Nurses", slug: "nclex-infection-control-sepsis-review-indian-nurses", primaryKeyword: "NCLEX infection control India", secondaryKeywords: ["sepsis NCLEX questions", "infection prevention NCLEX", "standard precautions NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.sepsis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 11 },
    { id: "in-12", title: "NCLEX-RN Maternal Child Nursing Questions for Indian Nurses", slug: "nclex-maternal-child-nursing-indian-nurses", primaryKeyword: "maternal child NCLEX India", secondaryKeywords: ["OB NCLEX questions India", "pediatric NCLEX India", "maternity nursing NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.obEmergencies, LESSON.pediatricTriage], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 12 },
    { id: "in-13", title: "NCLEX-RN Fluid and Electrolyte Imbalances Made Simple", slug: "nclex-fluid-electrolyte-imbalances-made-simple-india", primaryKeyword: "fluid electrolyte NCLEX India", secondaryKeywords: ["electrolyte imbalance nursing", "hyperkalemia NCLEX", "IV fluids NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.fluidsElectrolytes, LESSON.renalDialysis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 13 },
    { id: "in-14", title: "NCLEX-RN Prioritization Strategies Indian Nurses Struggle With", slug: "nclex-prioritization-strategies-indian-nurses", primaryKeyword: "NCLEX prioritization India", secondaryKeywords: ["which patient first NCLEX", "nursing priority questions", "triage NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 14 },
    { id: "in-15", title: "NCLEX-RN Renal and Dialysis Nursing Review", slug: "nclex-renal-dialysis-nursing-review-india", primaryKeyword: "renal NCLEX India", secondaryKeywords: ["dialysis NCLEX questions", "kidney nursing NCLEX", "AKI NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.renalDialysis, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 15 },
    { id: "in-16", title: "Shock Types and NCLEX Questions: Complete Nursing Review", slug: "shock-types-nclex-questions-nursing-review-india", primaryKeyword: "shock NCLEX questions India", secondaryKeywords: ["types of shock NCLEX", "septic shock nursing", "cardiogenic shock"], searchIntent: "informational", linkedLessonSlugs: [LESSON.shock, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 16 },
    { id: "in-17", title: "NCLEX-RN Stroke and Neuro Questions: What Indian Nurses Must Know", slug: "nclex-stroke-neuro-questions-indian-nurses", primaryKeyword: "stroke NCLEX India", secondaryKeywords: ["neuro NCLEX questions", "increased ICP nursing", "stroke assessment NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.strokeIcp], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 17 },
    { id: "in-18", title: "NCLEX-RN COPD and Respiratory Nursing Review for Indian Nurses", slug: "nclex-copd-respiratory-nursing-review-india", primaryKeyword: "COPD NCLEX India", secondaryKeywords: ["respiratory NCLEX questions", "asthma NCLEX", "oxygen therapy NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.copd], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 18 },
    { id: "in-19", title: "Is NCLEX-RN Worth It for Indian Nurses? Career and Salary Outlook", slug: "is-nclex-worth-it-for-indian-nurses-career-salary", primaryKeyword: "NCLEX worth it India", secondaryKeywords: ["NCLEX salary abroad", "Indian nurse abroad salary", "nursing career after NCLEX"], searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "study_plan", priority: 19 },
    { id: "in-20", title: "NCLEX-RN High-Alert Medications Every Indian Nurse Must Know", slug: "nclex-high-alert-medications-indian-nurses", primaryKeyword: "high alert medications NCLEX India", secondaryKeywords: ["dangerous drugs NCLEX", "medication safety NCLEX", "insulin heparin NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 20 },
  ],
};

// ── Nigeria RN NCLEX ─────────────────────────────────────────────────────────

export const NIGERIA_RN_NCLEX: MarketBlogPlan = {
  region: "nigeria",
  locale: "en",
  profession: "rn",
  exam: "nclex-rn",
  clusters: [
    { id: "ng-1", title: "How to Pass the NCLEX-RN as a Nigerian Nurse: Study Guide", slug: "how-to-pass-nclex-rn-as-nigerian-nurse", primaryKeyword: "NCLEX-RN Nigerian nurse", secondaryKeywords: ["NCLEX prep Nigeria", "Nigerian nurse NCLEX study plan", "pass NCLEX Nigeria"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: true, wordCountTarget: [800, 900], ctaStrategy: "study_plan", priority: 1 },
    { id: "ng-2", title: "Best NCLEX-RN Study Plan for Nigerian Nurses", slug: "best-nclex-study-plan-for-nigerian-nurses", primaryKeyword: "NCLEX study plan Nigeria", secondaryKeywords: ["NCLEX schedule Nigeria", "structured NCLEX prep Nigeria", "NCLEX review plan"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 900], ctaStrategy: "study_plan", priority: 2 },
    { id: "ng-3", title: "NCLEX-RN Practice Questions for Nigerian Nurses: Free Samples", slug: "nclex-practice-questions-nigerian-nurses-free", primaryKeyword: "NCLEX practice questions Nigeria", secondaryKeywords: ["free NCLEX questions Nigeria", "NCLEX test bank Nigeria", "NCLEX sample questions"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [600, 800], ctaStrategy: "unlock_full", priority: 3 },
    { id: "ng-4", title: "Common NCLEX-RN Mistakes Nigerian Nurses Make", slug: "common-nclex-mistakes-nigerian-nurses-make", primaryKeyword: "NCLEX mistakes Nigeria", secondaryKeywords: ["NCLEX errors Nigerian nurses", "why nurses fail NCLEX Nigeria", "NCLEX tips Nigeria"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 4 },
    { id: "ng-5", title: "NCLEX-RN Pharmacology Review for Nigerian Nursing Graduates", slug: "nclex-pharmacology-review-nigerian-nursing-graduates", primaryKeyword: "NCLEX pharmacology Nigeria", secondaryKeywords: ["medication questions NCLEX Nigeria", "drug calculation NCLEX", "pharmacology study tips"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 5 },
    { id: "ng-6", title: "NCLEX-RN Clinical Judgment for Nigerian Nurses Explained", slug: "nclex-clinical-judgment-nigerian-nurses-explained", primaryKeyword: "NCLEX clinical judgment Nigeria", secondaryKeywords: ["NGN clinical judgment", "clinical reasoning NCLEX Nigeria", "NCLEX thinking skills"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 6 },
    { id: "ng-7", title: "NCLEX-RN Application Process for Nigerian Nurses", slug: "nclex-application-process-nigerian-nurses", primaryKeyword: "NCLEX application Nigeria", secondaryKeywords: ["NCLEX registration Nigeria", "CGFNS Nigeria", "how to apply NCLEX Nigeria"], searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "study_plan", priority: 7 },
    { id: "ng-8", title: "Fluid and Electrolyte NCLEX Questions for Nigerian Nurses", slug: "fluid-electrolyte-nclex-questions-nigerian-nurses", primaryKeyword: "fluid electrolyte NCLEX Nigeria", secondaryKeywords: ["electrolyte imbalance nursing", "IV fluid NCLEX Nigeria", "hyperkalemia NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.fluidsElectrolytes, LESSON.renalDialysis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 8 },
    { id: "ng-9", title: "Cardiac NCLEX Questions Nigerian Nurses Need to Master", slug: "cardiac-nclex-questions-nigerian-nurses", primaryKeyword: "cardiac NCLEX Nigeria", secondaryKeywords: ["heart failure NCLEX Nigeria", "ACS nursing questions", "cardiovascular nursing"], searchIntent: "informational", linkedLessonSlugs: [LESSON.acs, LESSON.shock], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 9 },
    { id: "ng-10", title: "NCLEX-RN Sepsis Review for Nigerian Nurses", slug: "nclex-sepsis-review-nigerian-nurses", primaryKeyword: "sepsis NCLEX Nigeria", secondaryKeywords: ["sepsis screening NCLEX", "infection control NCLEX", "sepsis signs nursing"], searchIntent: "informational", linkedLessonSlugs: [LESSON.sepsis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 10 },
    { id: "ng-11", title: "Affordable NCLEX-RN Prep Options for Nigerian Nurses", slug: "affordable-nclex-prep-options-nigerian-nurses", primaryKeyword: "affordable NCLEX prep Nigeria", secondaryKeywords: ["cheap NCLEX review Nigeria", "online NCLEX prep Nigeria", "NCLEX cost Nigeria"], searchIntent: "comparison", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 900], ctaStrategy: "unlock_full", priority: 11 },
    { id: "ng-12", title: "NCLEX-RN Maternal and Newborn Questions for Nigerian Nurses", slug: "nclex-maternal-newborn-questions-nigerian-nurses", primaryKeyword: "maternal NCLEX Nigeria", secondaryKeywords: ["OB nursing NCLEX Nigeria", "postpartum NCLEX", "maternity questions"], searchIntent: "informational", linkedLessonSlugs: [LESSON.obEmergencies], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 12 },
    { id: "ng-13", title: "NCLEX-RN Pediatric Nursing Review for Nigerian Nurses", slug: "nclex-pediatric-nursing-review-nigerian-nurses", primaryKeyword: "pediatric NCLEX Nigeria", secondaryKeywords: ["child nursing NCLEX", "pedia questions NCLEX Nigeria", "growth development NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.pediatricTriage], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 13 },
    { id: "ng-14", title: "NCLEX-RN Prioritization Questions for Nigerian Nurses", slug: "nclex-prioritization-questions-nigerian-nurses", primaryKeyword: "NCLEX prioritization Nigeria", secondaryKeywords: ["delegation NCLEX", "which patient first", "triage NCLEX Nigeria"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 14 },
    { id: "ng-15", title: "How to Know If You're Ready for the NCLEX-RN: Nigerian Nurse Guide", slug: "nclex-readiness-check-nigerian-nurse-guide", primaryKeyword: "NCLEX readiness Nigeria", secondaryKeywords: ["am I ready NCLEX Nigeria", "NCLEX readiness assessment", "when to take NCLEX"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis], linkToQuestions: true, linkToCat: true, wordCountTarget: [600, 800], ctaStrategy: "readiness_check", priority: 15 },
    { id: "ng-16", title: "NCLEX-RN Shock and Emergency Nursing Review", slug: "nclex-shock-emergency-nursing-review-nigeria", primaryKeyword: "shock NCLEX Nigeria", secondaryKeywords: ["types of shock NCLEX", "emergency nursing NCLEX", "septic shock nursing"], searchIntent: "informational", linkedLessonSlugs: [LESSON.shock, LESSON.sepsis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 16 },
    { id: "ng-17", title: "NCLEX-RN Stroke and Neurological Nursing Questions", slug: "nclex-stroke-neurological-nursing-questions-nigeria", primaryKeyword: "stroke NCLEX Nigeria", secondaryKeywords: ["neuro NCLEX Nigeria", "increased ICP NCLEX", "stroke assessment nursing"], searchIntent: "informational", linkedLessonSlugs: [LESSON.strokeIcp], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 17 },
    { id: "ng-18", title: "NCLEX-RN High-Alert Medications Nigerian Nurses Must Know", slug: "nclex-high-alert-medications-nigerian-nurses", primaryKeyword: "high alert meds NCLEX Nigeria", secondaryKeywords: ["dangerous medications nursing", "insulin heparin NCLEX", "medication safety"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 18 },
    { id: "ng-19", title: "NCLEX-RN COPD and Respiratory Questions for Nigerian Nurses", slug: "nclex-copd-respiratory-questions-nigerian-nurses", primaryKeyword: "COPD NCLEX Nigeria", secondaryKeywords: ["respiratory NCLEX Nigeria", "asthma NCLEX", "oxygen therapy NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.copd], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 19 },
    { id: "ng-20", title: "NCLEX-RN Renal and Dialysis Questions for Nigerian Nurses", slug: "nclex-renal-dialysis-questions-nigerian-nurses", primaryKeyword: "renal NCLEX Nigeria", secondaryKeywords: ["dialysis nursing NCLEX", "kidney disease NCLEX", "AKI NCLEX Nigeria"], searchIntent: "informational", linkedLessonSlugs: [LESSON.renalDialysis, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 20 },
  ],
};

// ── Canada RPN REx-PN ────────────────────────────────────────────────────────

export const CANADA_RPN_REXPN: MarketBlogPlan = {
  region: "canada",
  locale: "en",
  profession: "rpn",
  exam: "rex-pn",
  clusters: [
    { id: "ca-1", title: "How to Pass the REx-PN: Complete Study Guide for Canadian RPNs", slug: "how-to-pass-rex-pn-complete-study-guide-canadian-rpns", primaryKeyword: "how to pass REx-PN", secondaryKeywords: ["REx-PN study guide", "REx-PN prep Canada", "pass REx-PN first try"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.canadianRpn, LESSON.clinicalJudgment, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: true, wordCountTarget: [800, 900], ctaStrategy: "study_plan", priority: 1 },
    { id: "ca-2", title: "REx-PN Study Plan: 4-Week Schedule for Canadian Practical Nurses", slug: "rex-pn-study-plan-4-week-schedule-canadian-practical-nurses", primaryKeyword: "REx-PN study plan", secondaryKeywords: ["REx-PN study schedule", "RPN exam prep plan", "practical nursing exam plan"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.canadianRpn, LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 900], ctaStrategy: "study_plan", priority: 2 },
    { id: "ca-3", title: "REx-PN Practice Questions: Free Sample Questions for Canadian RPNs", slug: "rex-pn-practice-questions-free-sample-canadian-rpns", primaryKeyword: "REx-PN practice questions", secondaryKeywords: ["free REx-PN questions", "RPN practice test Canada", "REx-PN sample questions"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.canadianRpn], linkToQuestions: true, linkToCat: true, wordCountTarget: [600, 800], ctaStrategy: "unlock_full", priority: 3 },
    { id: "ca-4", title: "REx-PN vs NCLEX-PN: What Canadian RPNs Need to Know About the Exam Change", slug: "rex-pn-vs-nclex-pn-what-canadian-rpns-need-to-know", primaryKeyword: "REx-PN vs NCLEX-PN", secondaryKeywords: ["REx-PN differences", "new Canadian practical nursing exam", "REx-PN format"], searchIntent: "comparison", linkedLessonSlugs: [LESSON.canadianRpn, LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 900], ctaStrategy: "readiness_check", priority: 4 },
    { id: "ca-5", title: "Top REx-PN Study Tips: What Not to Do Before Your Exam", slug: "top-rex-pn-study-tips-what-not-to-do", primaryKeyword: "REx-PN study tips", secondaryKeywords: ["REx-PN mistakes", "RPN exam tips Canada", "REx-PN common errors"], searchIntent: "informational", linkedLessonSlugs: [LESSON.canadianRpn, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 5 },
    { id: "ca-6", title: "REx-PN Pharmacology Review for Canadian Practical Nurses", slug: "rex-pn-pharmacology-review-canadian-practical-nurses", primaryKeyword: "REx-PN pharmacology", secondaryKeywords: ["medication questions REx-PN", "drug safety RPN exam", "pharmacology RPN"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 6 },
    { id: "ca-7", title: "REx-PN Clinical Judgment Questions Explained", slug: "rex-pn-clinical-judgment-questions-explained", primaryKeyword: "REx-PN clinical judgment", secondaryKeywords: ["clinical reasoning REx-PN", "clinical judgment RPN exam", "nursing judgment questions"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.canadianRpn], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 7 },
    { id: "ca-8", title: "REx-PN Infection Control and Safety Review", slug: "rex-pn-infection-control-safety-review", primaryKeyword: "REx-PN infection control", secondaryKeywords: ["infection prevention RPN", "safety questions REx-PN", "standard precautions RPN"], searchIntent: "informational", linkedLessonSlugs: [LESSON.sepsis, LESSON.canadianRpn], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 8 },
    { id: "ca-9", title: "REx-PN Maternal Child Nursing Questions for Canadian RPNs", slug: "rex-pn-maternal-child-nursing-questions-canadian-rpns", primaryKeyword: "maternal child REx-PN", secondaryKeywords: ["OB nursing REx-PN", "pediatric RPN exam", "maternity RPN questions"], searchIntent: "informational", linkedLessonSlugs: [LESSON.obEmergencies, LESSON.pediatricTriage], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 9 },
    { id: "ca-10", title: "REx-PN Readiness: How to Know When You're Ready", slug: "rex-pn-readiness-how-to-know-when-ready", primaryKeyword: "REx-PN readiness", secondaryKeywords: ["am I ready for REx-PN", "RPN exam readiness", "when to book REx-PN"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.canadianRpn, LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [600, 800], ctaStrategy: "readiness_check", priority: 10 },
    { id: "ca-11", title: "Fluid and Electrolyte Questions on the REx-PN", slug: "fluid-electrolyte-questions-rex-pn", primaryKeyword: "fluid electrolyte REx-PN", secondaryKeywords: ["electrolyte imbalance RPN", "IV fluid RPN exam", "hyperkalemia RPN"], searchIntent: "informational", linkedLessonSlugs: [LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 11 },
    { id: "ca-12", title: "REx-PN Mental Health Nursing Questions for Canadian RPNs", slug: "rex-pn-mental-health-nursing-questions-canadian-rpns", primaryKeyword: "mental health REx-PN", secondaryKeywords: ["psych nursing RPN", "therapeutic communication RPN", "mental health questions"], searchIntent: "informational", linkedLessonSlugs: [LESSON.canadianRpn], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 12 },
    { id: "ca-13", title: "REx-PN Scope of Practice: What Canadian RPNs Are Tested On", slug: "rex-pn-scope-of-practice-canadian-rpns", primaryKeyword: "REx-PN scope of practice", secondaryKeywords: ["RPN scope Canada", "what RPNs can do", "practical nurse scope"], searchIntent: "informational", linkedLessonSlugs: [LESSON.canadianRpn], linkToQuestions: false, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 13 },
    { id: "ca-14", title: "REx-PN Delegation and Prioritization Questions", slug: "rex-pn-delegation-prioritization-questions", primaryKeyword: "REx-PN delegation", secondaryKeywords: ["prioritization RPN exam", "delegation RPN", "which patient first RPN"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.canadianRpn], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 14 },
    { id: "ca-15", title: "REx-PN Cardiac and Cardiovascular Questions for Canadian RPNs", slug: "rex-pn-cardiac-cardiovascular-questions-canadian-rpns", primaryKeyword: "cardiac REx-PN", secondaryKeywords: ["heart failure RPN exam", "cardiovascular RPN", "cardiac nursing RPN"], searchIntent: "informational", linkedLessonSlugs: [LESSON.acs], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 15 },
    { id: "ca-16", title: "How to Register for the REx-PN in Canada: Step-by-Step", slug: "how-to-register-rex-pn-canada-step-by-step", primaryKeyword: "REx-PN registration Canada", secondaryKeywords: ["register REx-PN", "book REx-PN exam", "RPN exam registration"], searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false, wordCountTarget: [600, 800], ctaStrategy: "study_plan", priority: 16 },
    { id: "ca-17", title: "REx-PN Wound Care and Fundamentals Review", slug: "rex-pn-wound-care-fundamentals-review", primaryKeyword: "wound care REx-PN", secondaryKeywords: ["fundamentals RPN exam", "nursing basics RPN", "wound assessment RPN"], searchIntent: "informational", linkedLessonSlugs: [LESSON.canadianRpn], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 17 },
    { id: "ca-18", title: "REx-PN Respiratory Nursing Questions for Canadian RPNs", slug: "rex-pn-respiratory-nursing-questions-canadian-rpns", primaryKeyword: "respiratory REx-PN", secondaryKeywords: ["COPD RPN exam", "asthma RPN", "oxygen therapy RPN"], searchIntent: "informational", linkedLessonSlugs: [LESSON.copd], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 18 },
    { id: "ca-19", title: "Affordable REx-PN Prep Options for Canadian Students", slug: "affordable-rex-pn-prep-options-canadian-students", primaryKeyword: "affordable REx-PN prep", secondaryKeywords: ["cheap RPN exam prep", "online REx-PN review", "REx-PN prep cost"], searchIntent: "comparison", linkedLessonSlugs: [LESSON.canadianRpn, LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 900], ctaStrategy: "unlock_full", priority: 19 },
    { id: "ca-20", title: "REx-PN High-Alert Medications Every RPN Must Know", slug: "rex-pn-high-alert-medications-rpn-must-know", primaryKeyword: "high alert medications REx-PN", secondaryKeywords: ["medication safety RPN", "insulin heparin RPN", "drug errors RPN exam"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 20 },
  ],
};

// ── UK RN Pathway ────────────────────────────────────────────────────────────

export const UK_RN_PATHWAY: MarketBlogPlan = {
  region: "uk",
  locale: "en",
  profession: "rn",
  exam: "nclex-rn",
  clusters: [
    { id: "uk-1", title: "NCLEX-RN for UK Nurses: Complete Preparation Guide", slug: "nclex-rn-for-uk-nurses-complete-preparation-guide", primaryKeyword: "NCLEX-RN UK nurses", secondaryKeywords: ["NCLEX prep UK", "UK nurse NCLEX guide", "British nurse NCLEX"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: true, wordCountTarget: [800, 900], ctaStrategy: "study_plan", priority: 1 },
    { id: "uk-2", title: "NCLEX-RN vs NMC CBT: Key Differences UK Nurses Must Know", slug: "nclex-rn-vs-nmc-cbt-key-differences-uk-nurses", primaryKeyword: "NCLEX vs NMC CBT", secondaryKeywords: ["NMC CBT differences", "NCLEX NMC comparison", "UK nursing exam vs NCLEX"], searchIntent: "comparison", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 900], ctaStrategy: "soft_trial", priority: 2 },
    { id: "uk-3", title: "NCLEX-RN Study Plan for UK-Trained Nurses", slug: "nclex-rn-study-plan-uk-trained-nurses", primaryKeyword: "NCLEX study plan UK", secondaryKeywords: ["NCLEX schedule UK nurses", "UK nurse NCLEX timeline", "study plan British nurses"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 900], ctaStrategy: "study_plan", priority: 3 },
    { id: "uk-4", title: "NCLEX-RN Practice Questions for UK Nurses: Free Sample Set", slug: "nclex-practice-questions-uk-nurses-free-sample", primaryKeyword: "NCLEX practice questions UK", secondaryKeywords: ["free NCLEX questions UK", "NCLEX test bank UK", "NCLEX sample questions UK"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [600, 800], ctaStrategy: "unlock_full", priority: 4 },
    { id: "uk-5", title: "Common NCLEX-RN Mistakes UK Nurses Make", slug: "common-nclex-mistakes-uk-nurses-make", primaryKeyword: "NCLEX mistakes UK nurses", secondaryKeywords: ["why UK nurses fail NCLEX", "NCLEX errors British nurses", "NCLEX tips UK"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 5 },
    { id: "uk-6", title: "NCLEX-RN Pharmacology Differences UK Nurses Should Know", slug: "nclex-pharmacology-differences-uk-nurses", primaryKeyword: "NCLEX pharmacology UK", secondaryKeywords: ["US vs UK drug names NCLEX", "pharmacology NCLEX UK nurses", "medication differences US UK"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 6 },
    { id: "uk-7", title: "NCLEX-RN Clinical Judgment for UK-Educated Nurses", slug: "nclex-clinical-judgment-uk-educated-nurses", primaryKeyword: "NCLEX clinical judgment UK", secondaryKeywords: ["clinical reasoning NCLEX UK", "next gen NCLEX UK", "NGN clinical judgment UK"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 7 },
    { id: "uk-8", title: "How UK Nurses Can Apply for the NCLEX-RN to Work in the US", slug: "how-uk-nurses-apply-nclex-rn-work-us", primaryKeyword: "NCLEX application UK nurses", secondaryKeywords: ["UK nurse US registration", "NCLEX requirements UK", "British nurse work in America"], searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "study_plan", priority: 8 },
    { id: "uk-9", title: "NCLEX-RN Cardiac Nursing Review for UK Nurses", slug: "nclex-cardiac-nursing-review-uk-nurses", primaryKeyword: "cardiac NCLEX UK", secondaryKeywords: ["heart failure NCLEX UK", "ACS NCLEX UK", "cardiovascular nursing NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.acs, LESSON.shock], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 9 },
    { id: "uk-10", title: "NCLEX-RN Sepsis and Infection Control Review for UK Nurses", slug: "nclex-sepsis-infection-control-uk-nurses", primaryKeyword: "sepsis NCLEX UK", secondaryKeywords: ["infection control NCLEX UK", "sepsis screening NCLEX", "standard precautions NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.sepsis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 10 },
    { id: "uk-11", title: "NCLEX-RN Fluid and Electrolyte Review for UK-Trained Nurses", slug: "nclex-fluid-electrolyte-review-uk-trained-nurses", primaryKeyword: "fluid electrolyte NCLEX UK", secondaryKeywords: ["electrolyte imbalance NCLEX UK", "IV fluid NCLEX", "hyperkalemia NCLEX UK"], searchIntent: "informational", linkedLessonSlugs: [LESSON.fluidsElectrolytes, LESSON.renalDialysis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 11 },
    { id: "uk-12", title: "NCLEX-RN Maternal and Newborn Review for UK Nurses", slug: "nclex-maternal-newborn-review-uk-nurses", primaryKeyword: "maternal NCLEX UK", secondaryKeywords: ["OB NCLEX UK", "maternity nursing NCLEX UK", "postpartum NCLEX UK"], searchIntent: "informational", linkedLessonSlugs: [LESSON.obEmergencies], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 12 },
    { id: "uk-13", title: "NCLEX-RN Prioritization for UK Nurses: A Different Way of Thinking", slug: "nclex-prioritization-uk-nurses-different-thinking", primaryKeyword: "NCLEX prioritization UK", secondaryKeywords: ["prioritization questions NCLEX UK", "triage NCLEX UK", "which patient first NCLEX UK"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 13 },
    { id: "uk-14", title: "NCLEX-RN Pediatric Nursing Questions for UK-Trained Nurses", slug: "nclex-pediatric-nursing-questions-uk-trained-nurses", primaryKeyword: "pediatric NCLEX UK", secondaryKeywords: ["child nursing NCLEX UK", "paediatric NCLEX UK", "growth development NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.pediatricTriage], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 14 },
    { id: "uk-15", title: "NCLEX-RN Readiness Assessment for UK Nurses", slug: "nclex-readiness-assessment-uk-nurses", primaryKeyword: "NCLEX readiness UK", secondaryKeywords: ["am I ready NCLEX UK", "NCLEX score predictor UK", "when to take NCLEX UK"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis], linkToQuestions: true, linkToCat: true, wordCountTarget: [600, 800], ctaStrategy: "readiness_check", priority: 15 },
    { id: "uk-16", title: "NCLEX-RN Shock Nursing Review for UK Nurses", slug: "nclex-shock-nursing-review-uk-nurses", primaryKeyword: "shock NCLEX UK", secondaryKeywords: ["types of shock NCLEX", "hypovolemic shock nursing", "septic shock NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.shock, LESSON.sepsis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 16 },
    { id: "uk-17", title: "NCLEX-RN Stroke and Neuro Review for UK-Trained Nurses", slug: "nclex-stroke-neuro-review-uk-trained-nurses", primaryKeyword: "stroke NCLEX UK", secondaryKeywords: ["neuro NCLEX UK", "increased ICP NCLEX", "CVA nursing NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.strokeIcp], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 17 },
    { id: "uk-18", title: "NCLEX-RN COPD and Respiratory Review for UK Nurses", slug: "nclex-copd-respiratory-review-uk-nurses", primaryKeyword: "COPD NCLEX UK", secondaryKeywords: ["respiratory NCLEX UK", "asthma NCLEX UK", "oxygen therapy NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.copd], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 18 },
    { id: "uk-19", title: "NCLEX-RN High-Alert Medications UK Nurses Must Know", slug: "nclex-high-alert-medications-uk-nurses", primaryKeyword: "high alert medications NCLEX UK", secondaryKeywords: ["medication safety NCLEX UK", "insulin heparin NCLEX", "drug safety NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 19 },
    { id: "uk-20", title: "Is the NCLEX-RN Worth It for UK Nurses? Career Opportunities", slug: "nclex-rn-worth-it-uk-nurses-career-opportunities", primaryKeyword: "NCLEX worth it UK", secondaryKeywords: ["UK nurse work abroad", "NCLEX career UK", "nursing salary US vs UK"], searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "study_plan", priority: 20 },
  ],
};

// ── Kenya RN NCLEX ───────────────────────────────────────────────────────────

export const KENYA_RN_NCLEX: MarketBlogPlan = {
  region: "kenya",
  locale: "en",
  profession: "rn",
  exam: "nclex-rn",
  clusters: [
    { id: "ke-1", title: "How to Pass the NCLEX-RN as a Kenyan Nurse: Complete Guide", slug: "how-to-pass-nclex-rn-as-kenyan-nurse", primaryKeyword: "NCLEX-RN Kenyan nurse", secondaryKeywords: ["NCLEX prep Kenya", "Kenyan nurse NCLEX study", "pass NCLEX Kenya"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.sepsis, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: true, wordCountTarget: [800, 900], ctaStrategy: "study_plan", priority: 1, trafficPotential: "high", rankingDifficulty: "easy", conversionPotential: "high", metaDescription: "Complete NCLEX-RN study guide for Kenyan nurses. Learn the exam format, common mistakes, and a study strategy built for Kenya-educated nurses." },
    { id: "ke-2", title: "Best NCLEX Study Plan for Kenyan Nurses", slug: "best-nclex-study-plan-kenyan-nurses", primaryKeyword: "NCLEX study plan Kenya", secondaryKeywords: ["NCLEX schedule Kenya", "structured NCLEX prep Kenya", "Kenyan nurse study plan"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 900], ctaStrategy: "study_plan", priority: 2, trafficPotential: "high", rankingDifficulty: "easy", conversionPotential: "high", metaDescription: "Structured NCLEX-RN study plan designed for Kenyan nurses. Week-by-week schedule with practice questions and readiness tracking." },
    { id: "ke-3", title: "NCLEX-RN Practice Questions for Kenyan Nurses: Free Samples", slug: "nclex-practice-questions-kenyan-nurses-free", primaryKeyword: "NCLEX practice questions Kenya", secondaryKeywords: ["free NCLEX questions Kenya", "NCLEX test bank Kenya", "NCLEX sample questions Kenya"], searchIntent: "transactional", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [600, 800], ctaStrategy: "unlock_full", priority: 3, trafficPotential: "high", rankingDifficulty: "easy", conversionPotential: "high", metaDescription: "Try free NCLEX-RN practice questions designed for Kenyan nurses. Test your clinical judgment and track your readiness." },
    { id: "ke-4", title: "Common NCLEX-RN Mistakes Kenyan Nurses Make", slug: "common-nclex-mistakes-kenyan-nurses", primaryKeyword: "NCLEX mistakes Kenya", secondaryKeywords: ["why Kenyan nurses fail NCLEX", "NCLEX errors Kenya", "NCLEX tips Kenya"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment, LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 4, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "high", metaDescription: "Avoid the most common NCLEX-RN mistakes Kenyan nurses make. Learn what to change in your study approach before exam day." },
    { id: "ke-5", title: "NCLEX-RN Pharmacology Review for Kenyan Nursing Graduates", slug: "nclex-pharmacology-review-kenyan-nursing-graduates", primaryKeyword: "NCLEX pharmacology Kenya", secondaryKeywords: ["medication NCLEX Kenya", "drug questions NCLEX Kenya", "pharmacology study tips"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds, LESSON.fluidsElectrolytes], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 5, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "medium", metaDescription: "NCLEX-RN pharmacology review for Kenyan nurses. Master high-alert medications, drug calculations, and medication safety questions." },
    { id: "ke-6", title: "NCLEX-RN Clinical Judgment for Kenyan Nurses Explained", slug: "nclex-clinical-judgment-kenyan-nurses-explained", primaryKeyword: "NCLEX clinical judgment Kenya", secondaryKeywords: ["clinical reasoning NCLEX Kenya", "NGN clinical judgment", "NCLEX thinking skills Kenya"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 6, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "high", metaDescription: "Understand how clinical judgment works on the NCLEX-RN. A practical guide for Kenyan nurses preparing for the exam." },
    { id: "ke-7", title: "NCLEX-RN Application Process for Kenyan Nurses: Step-by-Step", slug: "nclex-application-process-kenyan-nurses", primaryKeyword: "NCLEX application Kenya", secondaryKeywords: ["NCLEX registration Kenya", "CGFNS Kenya", "how to apply NCLEX Kenya"], searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "study_plan", priority: 7, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "medium", metaDescription: "Step-by-step guide to applying for the NCLEX-RN from Kenya. Requirements, CGFNS, state board applications, and timelines." },
    { id: "ke-8", title: "Affordable NCLEX-RN Prep Options for Kenyan Nurses", slug: "affordable-nclex-prep-options-kenyan-nurses", primaryKeyword: "affordable NCLEX prep Kenya", secondaryKeywords: ["cheap NCLEX review Kenya", "online NCLEX prep Kenya", "NCLEX cost Kenya"], searchIntent: "comparison", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 900], ctaStrategy: "unlock_full", priority: 8, trafficPotential: "high", rankingDifficulty: "easy", conversionPotential: "high", metaDescription: "Compare affordable NCLEX-RN prep options available to Kenyan nurses. Online platforms, costs, and what to look for in a study program." },
    { id: "ke-9", title: "NCLEX-RN Cardiac Questions for Kenyan Nurses", slug: "nclex-cardiac-questions-kenyan-nurses", primaryKeyword: "cardiac NCLEX Kenya", secondaryKeywords: ["heart failure NCLEX Kenya", "ACS nursing NCLEX", "cardiovascular questions"], searchIntent: "informational", linkedLessonSlugs: [LESSON.acs, LESSON.shock], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 9, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "medium", metaDescription: "Master cardiac NCLEX-RN questions as a Kenyan nurse. Review ACS, heart failure, and cardiovascular nursing interventions." },
    { id: "ke-10", title: "NCLEX-RN Sepsis and Infection Control Review for Kenyan Nurses", slug: "nclex-sepsis-infection-control-kenyan-nurses", primaryKeyword: "sepsis NCLEX Kenya", secondaryKeywords: ["infection control NCLEX Kenya", "sepsis screening NCLEX", "standard precautions"], searchIntent: "informational", linkedLessonSlugs: [LESSON.sepsis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 10, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "medium", metaDescription: "Review sepsis recognition and infection control for the NCLEX-RN. Practical study guide for Kenyan nursing professionals." },
    { id: "ke-11", title: "NCLEX-RN Fluid and Electrolyte Questions for Kenyan Nurses", slug: "nclex-fluid-electrolyte-questions-kenyan-nurses", primaryKeyword: "fluid electrolyte NCLEX Kenya", secondaryKeywords: ["electrolyte imbalance NCLEX", "IV fluid NCLEX Kenya", "hyperkalemia NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.fluidsElectrolytes, LESSON.renalDialysis], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 11, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "medium", metaDescription: "Study fluid and electrolyte imbalances for the NCLEX-RN. Practical review guide for Kenya-educated nurses." },
    { id: "ke-12", title: "NCLEX-RN Prioritization Strategies for Kenyan Nurses", slug: "nclex-prioritization-strategies-kenyan-nurses", primaryKeyword: "NCLEX prioritization Kenya", secondaryKeywords: ["which patient first NCLEX Kenya", "delegation NCLEX Kenya", "triage NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.clinicalJudgment], linkToQuestions: true, linkToCat: true, wordCountTarget: [700, 850], ctaStrategy: "readiness_check", priority: 12, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "high", metaDescription: "Learn NCLEX-RN prioritization strategies for Kenyan nurses. Practice deciding which patient to assess first." },
    { id: "ke-13", title: "NCLEX-RN Maternal Newborn Questions for Kenyan Nurses", slug: "nclex-maternal-newborn-questions-kenyan-nurses", primaryKeyword: "maternal NCLEX Kenya", secondaryKeywords: ["OB nursing NCLEX Kenya", "maternity questions NCLEX", "postpartum nursing"], searchIntent: "informational", linkedLessonSlugs: [LESSON.obEmergencies], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 13, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "medium", metaDescription: "Review maternal and newborn NCLEX-RN questions for Kenyan nurses. Study OB emergencies and postpartum nursing care." },
    { id: "ke-14", title: "Is the NCLEX-RN Worth It for Kenyan Nurses? Career Outlook", slug: "nclex-worth-it-kenyan-nurses-career-outlook", primaryKeyword: "NCLEX worth it Kenya", secondaryKeywords: ["Kenyan nurse abroad", "nursing career after NCLEX Kenya", "NCLEX salary Kenya"], searchIntent: "informational", linkedLessonSlugs: [], linkToQuestions: false, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "study_plan", priority: 14, trafficPotential: "high", rankingDifficulty: "easy", conversionPotential: "medium", metaDescription: "Is the NCLEX-RN worth pursuing as a Kenyan nurse? Explore career opportunities, salary expectations, and migration pathways." },
    { id: "ke-15", title: "NCLEX-RN High-Alert Medications Every Kenyan Nurse Must Know", slug: "nclex-high-alert-medications-kenyan-nurses", primaryKeyword: "high alert medications NCLEX Kenya", secondaryKeywords: ["medication safety NCLEX", "insulin heparin NCLEX Kenya", "drug errors NCLEX"], searchIntent: "informational", linkedLessonSlugs: [LESSON.highAlertMeds], linkToQuestions: true, linkToCat: false, wordCountTarget: [700, 850], ctaStrategy: "soft_trial", priority: 15, trafficPotential: "medium", rankingDifficulty: "easy", conversionPotential: "medium", metaDescription: "Master high-alert medications for the NCLEX-RN. Essential pharmacology review for Kenyan nursing professionals." },
  ],
};

// ── Master registry ──────────────────────────────────────────────────────────

export const ALL_MARKET_BLOG_PLANS: MarketBlogPlan[] = [
  PHILIPPINES_RN_NCLEX,
  INDIA_RN_NCLEX,
  NIGERIA_RN_NCLEX,
  KENYA_RN_NCLEX,
  CANADA_RPN_REXPN,
  UK_RN_PATHWAY,
];

export function getMarketBlogPlan(region: GlobalRegionSlug, exam: string): MarketBlogPlan | undefined {
  return ALL_MARKET_BLOG_PLANS.find((p) => p.region === region && p.exam === exam);
}

// ── Scoring helpers ──────────────────────────────────────────────────────────

/**
 * Infer traffic/ranking/conversion scores for clusters that don't have
 * explicit values. Uses search intent, priority, and market competition.
 */
export function inferClusterScores(
  cluster: BlogTopicCluster,
  plan: MarketBlogPlan,
): { traffic: TrafficPotential; ranking: RankingDifficulty; conversion: ConversionPotential } {
  const traffic: TrafficPotential =
    cluster.trafficPotential ??
    (cluster.priority <= 5 ? "high" : cluster.priority <= 12 ? "medium" : "low");

  const isUnderserved = ["philippines", "india", "nigeria", "kenya", "pakistan", "bangladesh", "south-africa"].includes(plan.region);
  const ranking: RankingDifficulty =
    cluster.rankingDifficulty ??
    (isUnderserved ? "easy" : plan.region === "us" ? "hard" : "moderate");

  const conversion: ConversionPotential =
    cluster.conversionPotential ??
    (cluster.searchIntent === "transactional" ? "high"
      : cluster.searchIntent === "comparison" ? "high"
      : cluster.linkToQuestions && cluster.linkToCat ? "high"
      : "medium");

  return { traffic, ranking, conversion };
}

/**
 * Get the top N clusters across all markets, ranked by combined score.
 * Prioritizes: high traffic + easy ranking + high conversion.
 */
export function getTopClusters(limit: number = 10): Array<BlogTopicCluster & { region: GlobalRegionSlug; score: number }> {
  const scoreMap = { high: 3, medium: 2, low: 1, easy: 3, moderate: 2, hard: 1 };

  const all: Array<BlogTopicCluster & { region: GlobalRegionSlug; score: number }> = [];

  for (const plan of ALL_MARKET_BLOG_PLANS) {
    for (const cluster of plan.clusters) {
      const { traffic, ranking, conversion } = inferClusterScores(cluster, plan);
      const score = scoreMap[traffic] + scoreMap[ranking] + scoreMap[conversion];
      all.push({ ...cluster, region: plan.region, score });
    }
  }

  return all.sort((a, b) => b.score - a.score || a.priority - b.priority).slice(0, limit);
}

// ── Translation candidates ───────────────────────────────────────────────────

export type TranslationCandidate = {
  region: GlobalRegionSlug;
  sourceLocale: GlobalLocaleCode;
  targetLocale: GlobalLocaleCode;
  cluster: BlogTopicCluster;
  reason: string;
};

/**
 * Select top translation candidates per market.
 * Only high-performing transactional/comparison blogs qualify.
 */
export function getTranslationCandidates(): TranslationCandidate[] {
  const candidates: TranslationCandidate[] = [];

  const phTop = PHILIPPINES_RN_NCLEX.clusters
    .filter((c) => c.priority <= 5 && (c.searchIntent === "transactional" || c.searchIntent === "comparison"))
    .slice(0, 5);
  for (const c of phTop) {
    candidates.push({ region: "philippines", sourceLocale: "en", targetLocale: "tl", cluster: c, reason: "Top transactional blog for Tagalog market" });
  }

  const inTop = INDIA_RN_NCLEX.clusters
    .filter((c) => c.priority <= 5 && (c.searchIntent === "transactional" || c.searchIntent === "comparison"))
    .slice(0, 5);
  for (const c of inTop) {
    candidates.push({ region: "india", sourceLocale: "en", targetLocale: "hi", cluster: c, reason: "Top transactional blog for Hindi market" });
  }

  const caTop = CANADA_RPN_REXPN.clusters
    .filter((c) => c.priority <= 5 && (c.searchIntent === "transactional" || c.searchIntent === "comparison"))
    .slice(0, 5);
  for (const c of caTop) {
    candidates.push({ region: "canada", sourceLocale: "en", targetLocale: "fr", cluster: c, reason: "Top RPN blog for French Canadian market" });
  }

  return candidates;
}
