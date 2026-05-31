import type { IndexablePageKind } from "@/lib/seo/thin-content-eradication-engine";

export type ConversionStage = "free_value" | "account_creation" | "trial" | "subscription" | "long_term_member";

export type PublicContentSurface =
  | "Disease Page"
  | "Medication Page"
  | "Care Plan Page"
  | "Lab Page"
  | "Clinical Skills Page"
  | "Career Guide"
  | "Certification Guide"
  | "Interview Guide"
  | "Placement Guide";

export type AccountCreationTrigger =
  | "save_content"
  | "bookmark_content"
  | "save_notes"
  | "track_progress"
  | "use_calculator"
  | "create_study_plan"
  | "create_notebook"
  | "use_readiness_tools";

export type LeadMagnetKind =
  | "Free NCLEX Mini Pack"
  | "Free RT Mini Pack"
  | "Free Paramedic Mini Pack"
  | "Free TEAS Pack"
  | "Free HESI Pack"
  | "Free CASPER Pack";

export type ConversionProfession =
  | "RN"
  | "RPN"
  | "NP"
  | "RT"
  | "Paramedic"
  | "OT"
  | "PT"
  | "MLT"
  | "PSW"
  | "Pre-Nursing"
  | "Admissions";

export type ConversionFeature =
  | "Lessons"
  | "Flashcards"
  | "Questions"
  | "CAT"
  | "NGN"
  | "ECG"
  | "Labs"
  | "Medication Math"
  | "Clinical Skills"
  | "Simulations"
  | "Study Plans"
  | "Care Plans"
  | "Notebook"
  | "Readiness";

export type ContentConversionPath = {
  surface: PublicContentSurface;
  pageKind: IndexablePageKind;
  stageSequence: readonly ConversionStage[];
  freeValueCta: string;
  accountCta: string;
  trialCta: string;
  subscriptionCta: string;
  relatedPremiumPreviewCards: readonly ConversionFeature[];
};

export type LeadMagnet = {
  kind: LeadMagnetKind;
  profession: ConversionProfession;
  title: string;
  included: {
    questions: number;
    flashcards: number;
    miniLessons: number;
    readinessSample: boolean;
  };
  requiresAccount: true;
  upgradeBridge: string;
};

export type IntelligentPaywallRule = {
  id: string;
  feature: ConversionFeature;
  freeUsageThreshold: number;
  thresholdUnit: "questions" | "flashcards" | "ecg_cases" | "simulations" | "lessons" | "readiness_views";
  promptTitle: string;
  valueMessage: string;
  upgradeCta: string;
};

export type ProfessionFunnel = {
  profession: ConversionProfession;
  entrySurfaces: readonly PublicContentSurface[];
  leadMagnets: readonly LeadMagnetKind[];
  discoveryFeatures: readonly ConversionFeature[];
  professionSpecificProof: readonly string[];
  accountCreationTriggers: readonly AccountCreationTrigger[];
  firstTrialMoment: string;
  subscriptionValueMessage: string;
};

export type ConversionAttributionEvent = {
  visitorId: string;
  userId?: string | null;
  stage: ConversionStage;
  sourcePage: string;
  sourceSurface: PublicContentSurface;
  cluster: string;
  profession: ConversionProfession;
  feature?: ConversionFeature | null;
  contentType: PublicContentSurface | "Premium Feature";
  occurredAt: string;
  revenueCents?: number | null;
};

export type ConversionAttributionSummary = {
  accountsByPage: Record<string, number>;
  trialsByPage: Record<string, number>;
  subscriptionsByPage: Record<string, number>;
  revenueByCluster: Record<string, number>;
  revenueByProfession: Record<ConversionProfession, number>;
  revenueByFeature: Partial<Record<ConversionFeature, number>>;
  highestConvertingPages: readonly Array<{ page: string; subscriptions: number; revenueCents: number }>;
  highestConvertingProfessions: readonly Array<{ profession: ConversionProfession; subscriptions: number; revenueCents: number }>;
};

export type SubscriptionDecisionAnalytics = {
  sessionsBeforeSubscription: number;
  viewedPages: readonly string[];
  influentialFeatures: readonly ConversionFeature[];
  influentialContent: readonly string[];
  highestSignal: "content_depth" | "feature_trial" | "readiness_value" | "social_proof" | "price";
};

export type SocialProofSnapshot = {
  questionsCompleted: number;
  learnersServed: number;
  hoursStudied: number;
  successStories: number;
  certificationSuccesses: number;
  programAdmissions: number;
  clinicalPlacementOutcomes: number;
};

export type SubscriptionValueCommunication = {
  freeIncludes: readonly string[];
  premiumIncludes: readonly string[];
  problemsSolved: readonly string[];
  differentiators: readonly string[];
};

export type ExecutiveConversionDashboard = {
  visitorToAccountRate: number;
  accountToTrialRate: number;
  trialToPaidRate: number;
  paidToRenewalRate: number;
  revenueByProfession: Record<ConversionProfession, number>;
  revenueByCluster: Record<string, number>;
  revenueByFeature: Partial<Record<ConversionFeature, number>>;
  revenueByContentType: Partial<Record<PublicContentSurface | "Premium Feature", number>>;
};

const conversionProfessions = ["RN", "RPN", "NP", "RT", "Paramedic", "OT", "PT", "MLT", "PSW", "Pre-Nursing", "Admissions"] as const satisfies readonly ConversionProfession[];

const defaultStages = ["free_value", "account_creation", "trial", "subscription"] as const satisfies readonly ConversionStage[];

export const CONTENT_CONVERSION_PATHS: readonly ContentConversionPath[] = [
  path("Disease Page", "Authority Page", "Download A Related Study Checklist", "Save This Topic To Your Study Plan", "Try Related Questions Free", "Unlock Full Clinical Reasoning Practice", ["Lessons", "Flashcards", "Questions", "Simulations", "Care Plans"]),
  path("Medication Page", "Authority Page", "Save A Medication Safety Checklist", "Bookmark This Medication", "Try Medication Flashcards", "Unlock Pharmacology Practice", ["Flashcards", "Questions", "Medication Math", "Labs"]),
  path("Care Plan Page", "Authority Page", "Copy A Basic Care Plan Example", "Save This Care Plan", "Try A Care Plan Practice Pack", "Unlock The Care Plan Builder", ["Lessons", "Clinical Skills", "Questions", "Notebook"]),
  path("Lab Page", "Authority Page", "Save Normal Value Ranges", "Track Lab Interpretation Progress", "Try A Lab Mini Pack", "Unlock Advanced Lab Workstations", ["Labs", "Questions", "Simulations", "Readiness"]),
  path("Clinical Skills Page", "Authority Page", "Download A Skills Checklist", "Save This Skill", "Try A Skills Mini Lesson", "Unlock Interactive Clinical Skills", ["Clinical Skills", "Simulations", "Notebook", "Readiness"]),
  path("Career Guide", "Career Page", "Download A Career Checklist", "Save Your Career Path", "Try A Profession Mini Pack", "Unlock Study Pathway Tools", ["Lessons", "Flashcards", "Readiness"]),
  path("Certification Guide", "Certification Page", "Download A Study Timeline", "Create Your Exam Plan", "Start A Free Mini Pack", "Unlock Full Certification Prep", ["Questions", "CAT", "Flashcards", "Readiness"]),
  path("Interview Guide", "Supporting Page", "Save Interview Questions", "Build Your Interview Notes", "Try A Scenario Practice Pack", "Unlock Career Readiness Tools", ["Notebook", "Clinical Skills", "Simulations"]),
  path("Placement Guide", "Supporting Page", "Download A Placement Prep Sheet", "Save Placement Goals", "Try Placement Readiness Activities", "Unlock Clinical Placement Tools", ["Clinical Skills", "Notebook", "Readiness", "Simulations"]),
] as const;

export const ACCOUNT_CREATION_TRIGGERS: readonly AccountCreationTrigger[] = [
  "save_content",
  "bookmark_content",
  "save_notes",
  "track_progress",
  "use_calculator",
  "create_study_plan",
  "create_notebook",
  "use_readiness_tools",
] as const;

export const LEAD_MAGNETS: readonly LeadMagnet[] = [
  lead("Free NCLEX Mini Pack", "RN", "Free NCLEX Mini Pack", 10, 20, 1, "Upgrade to full NCLEX questions, CAT exams, NGN, rationales, and readiness tracking."),
  lead("Free RT Mini Pack", "RT", "Free Respiratory Therapy Mini Pack", 10, 20, 1, "Upgrade to ABG, ventilator, oxygen therapy, and respiratory assessment practice."),
  lead("Free Paramedic Mini Pack", "Paramedic", "Free Paramedic Mini Pack", 10, 20, 1, "Upgrade to emergency scenarios, trauma assessment, ECG, and pharmacology practice."),
  lead("Free TEAS Pack", "Pre-Nursing", "Free ATI TEAS Pack", 10, 20, 1, "Upgrade to full admissions prep, subject review, and readiness tracking."),
  lead("Free HESI Pack", "Admissions", "Free HESI A2 Pack", 10, 20, 1, "Upgrade to full HESI review, practice questions, and admissions planning."),
  lead("Free CASPER Pack", "Admissions", "Free CASPER Pack", 0, 0, 2, "Upgrade to situational judgment practice, response coaching, and admissions support."),
] as const;

export const INTELLIGENT_PAYWALL_RULES: readonly IntelligentPaywallRule[] = [
  rule("questions-3", "Questions", 3, "questions", "You Have Tried The Question Style", "Keep practicing with rationales, clinical pearls, and weak-area tracking.", "Unlock The Full Question Bank"),
  rule("flashcards-10", "Flashcards", 10, "flashcards", "You Have Built Momentum", "Spaced repetition works best when NurseNest can track your mastery over time.", "Unlock Full Flashcards"),
  rule("ecg-1", "ECG", 1, "ecg_cases", "You Completed Your First ECG Case", "Unlock more rhythm strips, reasoning workflows, and escalation practice.", "Unlock ECG Practice"),
  rule("simulation-1", "Simulations", 1, "simulations", "You Tried A Clinical Scenario", "Continue with branching deterioration cases and debriefs.", "Unlock Simulations"),
  rule("readiness-1", "Readiness", 1, "readiness_views", "You Saw A Readiness Sample", "Track trends, weak areas, and targeted study recommendations.", "Unlock Readiness Analytics"),
] as const;

export const PROFESSION_FUNNELS: readonly ProfessionFunnel[] = [
  funnel("RN", ["Disease Page", "Care Plan Page", "Certification Guide", "Lab Page"], ["Free NCLEX Mini Pack"], ["Lessons", "Flashcards", "Questions", "CAT", "NGN", "ECG", "Labs", "Medication Math", "Clinical Skills", "Simulations", "Study Plans", "Notebook", "Readiness"], ["NCLEX readiness", "NGN clinical judgment", "care plan practice"], "Start a free NCLEX mini pack after saving a study plan.", "Full NCLEX, NGN, CAT, rationales, clinical reasoning, and readiness tracking."),
  funnel("RPN", ["Disease Page", "Care Plan Page", "Certification Guide", "Placement Guide"], ["Free NCLEX Mini Pack"], ["Lessons", "Flashcards", "Questions", "NGN", "Labs", "Medication Math", "Clinical Skills", "Study Plans", "Notebook", "Readiness"], ["REx-PN readiness", "scope-aware clinical judgment", "placement confidence"], "Start after creating a REx-PN study plan.", "REx-PN-focused questions, rationales, clinical skills, and readiness support."),
  funnel("NP", ["Disease Page", "Medication Page", "Certification Guide"], ["Free NCLEX Mini Pack"], ["Lessons", "Questions", "Flashcards", "Clinical Skills", "Simulations", "Study Plans", "Readiness"], ["advanced assessment", "diagnostic reasoning", "prescribing judgment"], "Start after saving certification goals.", "Advanced assessment, diagnostics, prescribing, cases, and certification readiness."),
  funnel("RT", ["Lab Page", "Clinical Skills Page", "Career Guide", "Placement Guide"], ["Free RT Mini Pack"], ["Lessons", "Flashcards", "Questions", "Labs", "Clinical Skills", "Simulations", "Study Plans", "Readiness"], ["ABG interpretation", "ventilator management", "oxygen therapy"], "Start after trying ABG or oxygen therapy preview.", "ABG interpretation, ventilator management, oxygen therapy, and RT placement readiness."),
  funnel("Paramedic", ["Clinical Skills Page", "Career Guide", "Placement Guide"], ["Free Paramedic Mini Pack"], ["Lessons", "Flashcards", "Questions", "ECG", "Medication Math", "Clinical Skills", "Simulations"], ["primary survey", "trauma assessment", "field ECG decisions"], "Start after trying a trauma or primary survey preview.", "Emergency scenarios, ECG recognition, trauma, pharmacology, and field decision-making."),
  funnel("OT", ["Career Guide", "Placement Guide", "Clinical Skills Page"], [], ["Lessons", "Clinical Skills", "Notebook", "Study Plans", "Readiness"], ["ADL assessment", "home safety", "functional independence"], "Start after saving placement goals.", "ADL assessment, home safety, clinical reasoning, and placement preparation."),
  funnel("PT", ["Career Guide", "Placement Guide", "Clinical Skills Page"], [], ["Lessons", "Clinical Skills", "Notebook", "Study Plans", "Readiness"], ["gait assessment", "mobility progression", "rehabilitation planning"], "Start after saving mobility assessment goals.", "Mobility assessment, gait, rehab planning, and placement readiness."),
  funnel("MLT", ["Lab Page", "Career Guide", "Placement Guide"], [], ["Lessons", "Flashcards", "Questions", "Labs", "Study Plans", "Readiness"], ["specimen integrity", "quality control", "critical value reporting"], "Start after saving a lab interpretation topic.", "Specimen collection, lab interpretation, quality control, and certification prep."),
  funnel("PSW", ["Career Guide", "Placement Guide", "Clinical Skills Page"], [], ["Lessons", "Flashcards", "Clinical Skills", "Notebook", "Readiness"], ["resident safety", "mobility support", "personal care documentation"], "Start after saving a placement readiness checklist.", "Personal care, safety, communication, documentation, and placement readiness."),
  funnel("Pre-Nursing", ["Career Guide", "Certification Guide"], ["Free TEAS Pack", "Free HESI Pack", "Free CASPER Pack"], ["Lessons", "Flashcards", "Questions", "Study Plans", "Notebook", "Readiness"], ["admissions exams", "science review", "study planning"], "Start after downloading an admissions study timeline.", "Admissions exams, study planning, science review, and application confidence."),
  funnel("Admissions", ["Certification Guide", "Interview Guide", "Career Guide"], ["Free TEAS Pack", "Free HESI Pack", "Free CASPER Pack"], ["Lessons", "Questions", "Study Plans", "Notebook", "Readiness"], ["TEAS prep", "HESI prep", "CASPER scenarios"], "Start after saving admissions goals.", "TEAS, HESI, CASPER, interview prep, and readiness planning."),
] as const;

export const SUBSCRIPTION_VALUE_COMMUNICATION: SubscriptionValueCommunication = {
  freeIncludes: ["Authority articles", "Medication guides", "Lab explainers", "Career guides", "Placement guides", "Basic care plan examples"],
  premiumIncludes: ["Question banks", "CAT exams", "NGN questions", "ECG cases", "Labs workstations", "Simulations", "Clinical skills", "Study plans", "Readiness analytics", "Personalized recommendations"],
  problemsSolved: ["What should I study next?", "Am I ready?", "Can I apply this clinically?", "Where are my weak areas?", "How do I improve before exam day or placement?"],
  differentiators: ["Clinical reasoning emphasis", "Cross-module remediation", "Profession-specific pathways", "Readiness tracking", "Deep rationales and clinical pearls"],
};

function path(
  surface: PublicContentSurface,
  pageKind: IndexablePageKind,
  freeValueCta: string,
  accountCta: string,
  trialCta: string,
  subscriptionCta: string,
  relatedPremiumPreviewCards: readonly ConversionFeature[],
): ContentConversionPath {
  return { surface, pageKind, stageSequence: defaultStages, freeValueCta, accountCta, trialCta, subscriptionCta, relatedPremiumPreviewCards };
}

function lead(
  kind: LeadMagnetKind,
  profession: ConversionProfession,
  title: string,
  questions: number,
  flashcards: number,
  miniLessons: number,
  upgradeBridge: string,
): LeadMagnet {
  return {
    kind,
    profession,
    title,
    included: { questions, flashcards, miniLessons, readinessSample: true },
    requiresAccount: true,
    upgradeBridge,
  };
}

function rule(
  id: string,
  feature: ConversionFeature,
  freeUsageThreshold: number,
  thresholdUnit: IntelligentPaywallRule["thresholdUnit"],
  promptTitle: string,
  valueMessage: string,
  upgradeCta: string,
): IntelligentPaywallRule {
  return { id, feature, freeUsageThreshold, thresholdUnit, promptTitle, valueMessage, upgradeCta };
}

function funnel(
  profession: ConversionProfession,
  entrySurfaces: readonly PublicContentSurface[],
  leadMagnets: readonly LeadMagnetKind[],
  discoveryFeatures: readonly ConversionFeature[],
  professionSpecificProof: readonly string[],
  firstTrialMoment: string,
  subscriptionValueMessage: string,
): ProfessionFunnel {
  return {
    profession,
    entrySurfaces,
    leadMagnets,
    discoveryFeatures,
    professionSpecificProof,
    accountCreationTriggers: ACCOUNT_CREATION_TRIGGERS,
    firstTrialMoment,
    subscriptionValueMessage,
  };
}

export function getConversionPathForSurface(surface: PublicContentSurface): ContentConversionPath {
  const match = CONTENT_CONVERSION_PATHS.find((item) => item.surface === surface);
  if (!match) throw new Error(`Missing conversion path for ${surface}`);
  return match;
}

export function getProfessionFunnel(profession: ConversionProfession): ProfessionFunnel {
  const match = PROFESSION_FUNNELS.find((item) => item.profession === profession);
  if (!match) throw new Error(`Missing profession funnel for ${profession}`);
  return match;
}

export function selectLeadMagnetsForProfession(profession: ConversionProfession): readonly LeadMagnet[] {
  const funnelForProfession = getProfessionFunnel(profession);
  return LEAD_MAGNETS.filter((leadMagnet) => funnelForProfession.leadMagnets.includes(leadMagnet.kind));
}

export function selectPaywallPrompt(args: {
  feature: ConversionFeature;
  usageCount: number;
}): IntelligentPaywallRule | null {
  const rules = INTELLIGENT_PAYWALL_RULES.filter((ruleItem) => ruleItem.feature === args.feature).sort((a, b) => a.freeUsageThreshold - b.freeUsageThreshold);
  return rules.find((ruleItem) => args.usageCount >= ruleItem.freeUsageThreshold) ?? null;
}

function inc<T extends string>(record: Partial<Record<T, number>>, key: T, amount = 1): void {
  record[key] = (record[key] ?? 0) + amount;
}

export function buildConversionAttributionSummary(events: readonly ConversionAttributionEvent[]): ConversionAttributionSummary {
  const accountsByPage: Record<string, number> = {};
  const trialsByPage: Record<string, number> = {};
  const subscriptionsByPage: Record<string, number> = {};
  const revenueByCluster: Record<string, number> = {};
  const revenueByProfession = Object.fromEntries(
    conversionProfessions.map((profession) => [profession, 0]),
  ) as Record<ConversionProfession, number>;
  const revenueByFeature: Partial<Record<ConversionFeature, number>> = {};

  for (const event of events) {
    if (event.stage === "account_creation") inc(accountsByPage, event.sourcePage);
    if (event.stage === "trial") inc(trialsByPage, event.sourcePage);
    if (event.stage === "subscription") {
      inc(subscriptionsByPage, event.sourcePage);
      inc(revenueByCluster, event.cluster, event.revenueCents ?? 0);
      inc(revenueByProfession, event.profession, event.revenueCents ?? 0);
      if (event.feature) inc(revenueByFeature, event.feature, event.revenueCents ?? 0);
    }
  }

  const highestConvertingPages = Object.entries(subscriptionsByPage)
    .map(([page, subscriptions]) => ({
      page,
      subscriptions,
      revenueCents: events.filter((event) => event.stage === "subscription" && event.sourcePage === page).reduce((sum, event) => sum + (event.revenueCents ?? 0), 0),
    }))
    .sort((a, b) => b.subscriptions - a.subscriptions || b.revenueCents - a.revenueCents);
  const subscriptionCountByProfession = events.reduce((record, event) => {
    if (event.stage === "subscription") inc(record, event.profession);
    return record;
  }, {} as Partial<Record<ConversionProfession, number>>);
  const highestConvertingProfessions = Object.entries(revenueByProfession)
    .map(([profession, revenueCents]) => ({
      profession: profession as ConversionProfession,
      subscriptions: subscriptionCountByProfession[profession as ConversionProfession] ?? 0,
      revenueCents,
    }))
    .sort((a, b) => b.subscriptions - a.subscriptions || b.revenueCents - a.revenueCents);

  return {
    accountsByPage,
    trialsByPage,
    subscriptionsByPage,
    revenueByCluster,
    revenueByProfession,
    revenueByFeature,
    highestConvertingPages,
    highestConvertingProfessions,
  };
}

export function buildSubscriptionDecisionAnalytics(events: readonly ConversionAttributionEvent[], userId: string): SubscriptionDecisionAnalytics | null {
  const userEvents = events.filter((event) => event.userId === userId).sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt));
  const subscriptionIndex = userEvents.findIndex((event) => event.stage === "subscription");
  if (subscriptionIndex < 0) return null;
  const beforeSubscription = userEvents.slice(0, subscriptionIndex + 1);
  const viewedPages = [...new Set(beforeSubscription.map((event) => event.sourcePage))];
  const influentialFeatures = [...new Set(beforeSubscription.map((event) => event.feature).filter(Boolean))] as ConversionFeature[];
  const influentialContent = [...new Set(beforeSubscription.map((event) => event.cluster))];
  const highestSignal: SubscriptionDecisionAnalytics["highestSignal"] =
    influentialFeatures.includes("Readiness")
      ? "readiness_value"
      : influentialFeatures.length >= 3
        ? "feature_trial"
        : viewedPages.length >= 3
          ? "content_depth"
          : "social_proof";
  return {
    sessionsBeforeSubscription: new Set(beforeSubscription.map((event) => event.occurredAt.slice(0, 10))).size,
    viewedPages,
    influentialFeatures,
    influentialContent,
    highestSignal,
  };
}

export function buildExecutiveConversionDashboard(args: {
  visitors: number;
  accounts: number;
  trials: number;
  paid: number;
  renewals: number;
  attribution: ConversionAttributionSummary;
  events: readonly ConversionAttributionEvent[];
}): ExecutiveConversionDashboard {
  const revenueByContentType: Partial<Record<PublicContentSurface | "Premium Feature", number>> = {};
  for (const event of args.events) {
    if (event.stage !== "subscription") continue;
    inc(revenueByContentType, event.contentType, event.revenueCents ?? 0);
  }
  return {
    visitorToAccountRate: args.visitors > 0 ? args.accounts / args.visitors : 0,
    accountToTrialRate: args.accounts > 0 ? args.trials / args.accounts : 0,
    trialToPaidRate: args.trials > 0 ? args.paid / args.trials : 0,
    paidToRenewalRate: args.paid > 0 ? args.renewals / args.paid : 0,
    revenueByProfession: args.attribution.revenueByProfession,
    revenueByCluster: args.attribution.revenueByCluster,
    revenueByFeature: args.attribution.revenueByFeature,
    revenueByContentType,
  };
}

export function buildSocialProofLines(snapshot: SocialProofSnapshot): readonly string[] {
  return [
    `${snapshot.questionsCompleted.toLocaleString()} Questions Completed`,
    `${snapshot.learnersServed.toLocaleString()} Learners Served`,
    `${snapshot.hoursStudied.toLocaleString()} Hours Studied`,
    `${snapshot.successStories.toLocaleString()} Success Stories`,
    `${snapshot.certificationSuccesses.toLocaleString()} Certification Successes`,
    `${snapshot.programAdmissions.toLocaleString()} Program Admissions`,
    `${snapshot.clinicalPlacementOutcomes.toLocaleString()} Clinical Placement Outcomes`,
  ];
}
