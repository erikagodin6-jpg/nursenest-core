export type GovernanceOwner =
  | "learning-platform"
  | "adaptive-assessment"
  | "clinical-readiness"
  | "content-governance"
  | "growth-platform";

export type FeatureStatus = "production" | "beta" | "preview" | "planned";
export type FeatureTier = "free" | "freemium" | "subscriber" | "premium-addon" | "staff-only";
export type MonetizationStatus = "free" | "freemium-gated" | "subscription" | "add-on" | "staff-only";
export type ProductionReadiness = "ready" | "partial" | "guarded" | "not-ready";
export type AnalyticsCoverage = "full" | "partial" | "minimal" | "none";
export type EntitlementGuard =
  | "public"
  | "freemium"
  | "resolveEntitlementForPage"
  | "requireSubscriberSession"
  | "getCurrentEcgModuleAccess"
  | "alliedOccupationEntitlement"
  | "adminOnly";

export type ContentLifecycleCoverage = "full" | "partial" | "not-applicable";

export type PlatformFeature = {
  id: string;
  label: string;
  owner: GovernanceOwner;
  status: FeatureStatus;
  tier: FeatureTier;
  monetizationStatus: MonetizationStatus;
  productionReadiness: ProductionReadiness;
  analyticsCoverage: AnalyticsCoverage;
  entitlementGuard: EntitlementGuard;
  routePatterns: readonly string[];
  canonicalSourceFiles: readonly string[];
  analyticsEvents: readonly string[];
  contentLifecycle: ContentLifecycleCoverage;
  readinessScores: {
    content: number;
    qa: number;
    analytics: number;
    monetization: number;
    reliability: number;
  };
  notes: string;
};

export const PLATFORM_FEATURE_REGISTRY_VERSION = "1.0.0" as const;

export const PLATFORM_FEATURES = [
  {
    id: "lessons",
    label: "Lessons",
    owner: "content-governance",
    status: "production",
    tier: "freemium",
    monetizationStatus: "freemium-gated",
    productionReadiness: "ready",
    analyticsCoverage: "full",
    entitlementGuard: "resolveEntitlementForPage",
    routePatterns: ["/app/lessons", "/app/lessons/[id]"],
    canonicalSourceFiles: [
      "src/app/(app)/app/(learner)/lessons/page.tsx",
      "src/app/(app)/app/(learner)/lessons/[id]/page.tsx",
    ],
    analyticsEvents: [
      "learner_lesson_started",
      "learner_lesson_completed",
      "learner_lesson_study_loop_shown",
    ],
    contentLifecycle: "full",
    readinessScores: { content: 90, qa: 86, analytics: 88, monetization: 90, reliability: 86 },
    notes: "Freemium preview plus subscription unlock; governed by lesson access scope and publish status.",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    owner: "learning-platform",
    status: "production",
    tier: "freemium",
    monetizationStatus: "freemium-gated",
    productionReadiness: "ready",
    analyticsCoverage: "full",
    entitlementGuard: "resolveEntitlementForPage",
    routePatterns: ["/app/flashcards", "/app/flashcards/decks/[deckId]"],
    canonicalSourceFiles: ["src/app/(app)/app/(learner)/flashcards/page.tsx"],
    analyticsEvents: ["flashcard_card_reviewed"],
    contentLifecycle: "full",
    readinessScores: { content: 86, qa: 84, analytics: 85, monetization: 88, reliability: 84 },
    notes: "Deck, progress, mastery, and option-response models support governed study loops.",
  },
  {
    id: "cat",
    label: "CAT",
    owner: "adaptive-assessment",
    status: "production",
    tier: "subscriber",
    monetizationStatus: "subscription",
    productionReadiness: "ready",
    analyticsCoverage: "full",
    entitlementGuard: "requireSubscriberSession",
    routePatterns: ["/app/practice-tests/cat-launch", "/app/practice-tests/[id]"],
    canonicalSourceFiles: [
      "src/app/api/practice-tests/route.ts",
      "src/app/api/practice-tests/[id]/route.ts",
    ],
    analyticsEvents: [
      "learner_cat_exam_started",
      "learner_practice_test_session_completed",
      "learner_cat_coach_generated",
    ],
    contentLifecycle: "partial",
    readinessScores: { content: 84, qa: 86, analytics: 92, monetization: 92, reliability: 84 },
    notes: "Adaptive sessions use entitlement-gated APIs and CAT-specific results coaching.",
  },
  {
    id: "practice",
    label: "Practice",
    owner: "adaptive-assessment",
    status: "production",
    tier: "freemium",
    monetizationStatus: "freemium-gated",
    productionReadiness: "ready",
    analyticsCoverage: "full",
    entitlementGuard: "resolveEntitlementForPage",
    routePatterns: ["/app/questions", "/app/practice-tests"],
    canonicalSourceFiles: [
      "src/app/(app)/app/(learner)/practice-tests/page.tsx",
      "src/app/api/questions/grade/route.ts",
    ],
    analyticsEvents: [
      "learner_question_bank_session_started",
      "learner_question_bank_session_completed",
      "learner_question_graded_sample",
    ],
    contentLifecycle: "full",
    readinessScores: { content: 86, qa: 86, analytics: 90, monetization: 88, reliability: 84 },
    notes: "Question practice combines freemium gates, grading telemetry, and topic remediation.",
  },
  {
    id: "study-plans",
    label: "Study Plans",
    owner: "adaptive-assessment",
    status: "production",
    tier: "subscriber",
    monetizationStatus: "subscription",
    productionReadiness: "ready",
    analyticsCoverage: "partial",
    entitlementGuard: "resolveEntitlementForPage",
    routePatterns: ["/app/study-plan", "/api/study-plan"],
    canonicalSourceFiles: [
      "src/app/(app)/app/(learner)/study-plan/page.tsx",
      "src/app/api/study-plan/route.ts",
    ],
    analyticsEvents: ["continue_study_clicked"],
    contentLifecycle: "not-applicable",
    readinessScores: { content: 82, qa: 82, analytics: 76, monetization: 90, reliability: 82 },
    notes: "Deterministic remediation plan with optional AI generator behind subscriber access.",
  },
  {
    id: "ecg",
    label: "ECG",
    owner: "clinical-readiness",
    status: "production",
    tier: "subscriber",
    monetizationStatus: "subscription",
    productionReadiness: "partial",
    analyticsCoverage: "partial",
    entitlementGuard: "getCurrentEcgModuleAccess",
    routePatterns: ["/app/ecg-video-quiz", "/app/modules/ecg"],
    canonicalSourceFiles: [
      "src/app/(app)/app/(learner)/ecg-video-quiz/page.tsx",
      "src/app/api/modules/ecg/questions/route.ts",
      "src/app/api/modules/ecg/questions/[id]/answer/route.ts",
    ],
    analyticsEvents: ["app_section_view"],
    contentLifecycle: "partial",
    readinessScores: { content: 84, qa: 84, analytics: 72, monetization: 82, reliability: 80 },
    notes: "Learner ECG exists, with legacy module exceptions still tracked by navigation governance.",
  },
  {
    id: "clinical-skills",
    label: "Clinical Skills",
    owner: "clinical-readiness",
    status: "production",
    tier: "subscriber",
    monetizationStatus: "subscription",
    productionReadiness: "partial",
    analyticsCoverage: "partial",
    entitlementGuard: "resolveEntitlementForPage",
    routePatterns: ["/app/clinical-skills", "/app/clinical-skills/[slug]"],
    canonicalSourceFiles: ["src/app/(app)/app/(learner)/clinical-skills/page.tsx"],
    analyticsEvents: ["app_section_view"],
    contentLifecycle: "partial",
    readinessScores: { content: 82, qa: 80, analytics: 70, monetization: 84, reliability: 80 },
    notes: "Competency lab is pathway-aware; analytics should deepen before flagship positioning.",
  },
  {
    id: "labs",
    label: "Labs",
    owner: "clinical-readiness",
    status: "production",
    tier: "subscriber",
    monetizationStatus: "subscription",
    productionReadiness: "ready",
    analyticsCoverage: "partial",
    entitlementGuard: "resolveEntitlementForPage",
    routePatterns: ["/app/labs", "/app/labs/[category]/[slug]"],
    canonicalSourceFiles: [
      "src/app/(app)/app/(learner)/labs/page.tsx",
      "src/lib/labs/labs-route-loader.ts",
    ],
    analyticsEvents: ["app_section_view"],
    contentLifecycle: "partial",
    readinessScores: { content: 88, qa: 84, analytics: 72, monetization: 84, reliability: 84 },
    notes: "Interpretation engine and study links are mature; launch scoring should require analytics expansion.",
  },
  {
    id: "pharmacology",
    label: "Pharmacology",
    owner: "clinical-readiness",
    status: "production",
    tier: "subscriber",
    monetizationStatus: "subscription",
    productionReadiness: "partial",
    analyticsCoverage: "minimal",
    entitlementGuard: "resolveEntitlementForPage",
    routePatterns: ["/app/pharmacology"],
    canonicalSourceFiles: ["src/app/(app)/app/(learner)/pharmacology/page.tsx"],
    analyticsEvents: ["app_section_view"],
    contentLifecycle: "partial",
    readinessScores: { content: 78, qa: 76, analytics: 60, monetization: 84, reliability: 78 },
    notes: "Premium medication-safety surface; needs stronger event coverage and source-review cadence.",
  },
  {
    id: "simulations",
    label: "Simulations",
    owner: "clinical-readiness",
    status: "beta",
    tier: "subscriber",
    monetizationStatus: "subscription",
    productionReadiness: "partial",
    analyticsCoverage: "partial",
    entitlementGuard: "requireSubscriberSession",
    routePatterns: ["/app/simulation-center", "/app/clinical-scenarios"],
    canonicalSourceFiles: [
      "src/app/(app)/app/(learner)/simulation-center/page.tsx",
      "src/app/(app)/app/(learner)/clinical-scenarios/page.tsx",
    ],
    analyticsEvents: ["simulation_center_viewed"],
    contentLifecycle: "partial",
    readinessScores: { content: 76, qa: 74, analytics: 72, monetization: 86, reliability: 74 },
    notes: "High-moat area; requires graph/debrief governance before full production claim.",
  },
  {
    id: "new-grad",
    label: "New Grad",
    owner: "growth-platform",
    status: "preview",
    tier: "free",
    monetizationStatus: "free",
    productionReadiness: "partial",
    analyticsCoverage: "minimal",
    entitlementGuard: "public",
    routePatterns: ["/canada/new-grad", "/app/simulation-center"],
    canonicalSourceFiles: [
      "src/app/(marketing)/(default)/canada/new-grad/page.tsx",
      "src/app/(app)/app/(learner)/simulation-center/page.tsx",
    ],
    analyticsEvents: ["marketing_pathway_hub_cta"],
    contentLifecycle: "partial",
    readinessScores: { content: 76, qa: 72, analytics: 58, monetization: 68, reliability: 72 },
    notes: "Career-lifecycle wedge; should not fork learner shells or scoring systems.",
  },
  {
    id: "allied-health",
    label: "Allied Health",
    owner: "growth-platform",
    status: "production",
    tier: "subscriber",
    monetizationStatus: "subscription",
    productionReadiness: "partial",
    analyticsCoverage: "partial",
    entitlementGuard: "alliedOccupationEntitlement",
    routePatterns: ["/allied/allied-health", "/allied/[career]", "/app"],
    canonicalSourceFiles: [
      "src/app/(marketing)/(default)/allied/allied-health/page.tsx",
      "src/lib/entitlements/allied-occupation-entitlement.ts",
    ],
    analyticsEvents: ["marketing_pathway_hub_cta", "funnel_exam_hub_study_intent"],
    contentLifecycle: "partial",
    readinessScores: { content: 78, qa: 76, analytics: 70, monetization: 82, reliability: 76 },
    notes: "Occupation-scoped entitlement exists; content depth and profession-specific analytics remain expansion gates.",
  },
] as const satisfies readonly PlatformFeature[];

export type PlatformFeatureId = (typeof PLATFORM_FEATURES)[number]["id"];

export function listPlatformFeatures(): readonly PlatformFeature[] {
  return PLATFORM_FEATURES;
}

export function getPlatformFeature(id: PlatformFeatureId): PlatformFeature {
  return PLATFORM_FEATURES.find((feature) => feature.id === id)!;
}

export function featureReadinessScore(feature: Pick<PlatformFeature, "readinessScores">): number {
  const { content, qa, analytics, monetization, reliability } = feature.readinessScores;
  return Math.round((content + qa + analytics + monetization + reliability) / 5);
}

export function featureLaunchBand(score: number): "ready" | "watch" | "blocked" {
  if (score >= 85) return "ready";
  if (score >= 70) return "watch";
  return "blocked";
}
