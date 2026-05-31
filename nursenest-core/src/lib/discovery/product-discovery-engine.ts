import {
  FEATURE_DISCOVERY_CATALOG,
  buildFeatureImpactSummary,
  buildFeatureValueProfile,
  mergeFeatureUsageSnapshot,
  normalizeFeatureDiscoveryPathway,
  usageMetric,
  type DiscoveryPrompt,
  type FeatureDiscoveryItem,
  type FeatureDiscoveryKey,
  type FeatureDiscoveryPathway,
  type FeatureImpactAnalyticsRow,
  type FeatureImpactSummary,
  type FeatureUsageSnapshot,
  type FeatureValueProfile,
} from "@/lib/discovery/feature-value-communication";

export type ProductDiscoveryStatus = "completed" | "started" | "not_yet_explored" | "upgrade";

export type ProductDiscoveryModule = FeatureDiscoveryItem & {
  status: ProductDiscoveryStatus;
  launches: number;
  completions: number;
  itemsCompleted: number;
  lastUsedAt: string | null;
  valueMessage: string;
};

export type FirstTimeDiscoveryMoment =
  | "first_visit"
  | "first_module_use"
  | "first_subscription"
  | "returning_learner";

export type CrossModuleRecommendation = {
  id: string;
  title: string;
  body: string;
  href: string;
  sourceFeature: FeatureDiscoveryKey;
  targetFeature: FeatureDiscoveryKey;
  reason: "topic_match" | "completion_followup" | "weak_area" | "power_user" | "subscription_value";
};

export type ProductDiscoveryDashboard = {
  pathway: FeatureDiscoveryPathway;
  profile: FeatureValueProfile;
  modules: ProductDiscoveryModule[];
  completed: ProductDiscoveryModule[];
  started: ProductDiscoveryModule[];
  notYetExplored: ProductDiscoveryModule[];
  upgrades: ProductDiscoveryModule[];
  prompts: DiscoveryPrompt[];
  firstTimeMoments: FirstTimeDiscoveryMoment[];
  recommendations: CrossModuleRecommendation[];
  sevenDayDiscoveryGoal: { target: 5; discovered: number; remaining: number; met: boolean };
  thirtyDayDiscoveryGoal: { target: 8; discovered: number; remaining: number; met: boolean };
  subscriptionValue: {
    featuresUsed: number;
    featuresRemaining: number;
    estimatedValueUnlockedLabel: string;
    milestones: string[];
  };
};

const CROSS_MODULE_LINKS: Partial<Record<FeatureDiscoveryKey, FeatureDiscoveryKey[]>> = {
  lessons: ["flashcards", "questions", "simulations", "clinical_skills", "notebook"],
  questions: ["lessons", "ngn", "labs", "simulations", "readiness"],
  flashcards: ["questions", "lessons", "readiness"],
  ngn: ["clinical_skills", "simulations", "readiness"],
  ecg_core: ["labs", "simulations", "advanced_ecg"],
  labs: ["lessons", "questions", "simulations", "pharmacology"],
  medication_math: ["pharmacology", "clinical_skills", "questions"],
  pharmacology: ["medication_math", "labs", "questions"],
  clinical_skills: ["simulations", "notebook", "readiness"],
  simulations: ["readiness", "clinical_skills", "questions"],
  study_plans: ["lessons", "questions", "flashcards"],
  readiness: ["study_plans", "analytics", "confidence_analytics"],
  analytics: ["study_plans", "readiness", "confidence_analytics"],
  confidence_analytics: ["questions", "flashcards", "readiness"],
};

const TOPIC_TO_FEATURES: Array<{ pattern: RegExp; features: FeatureDiscoveryKey[] }> = [
  { pattern: /heart failure|cardiac|afib|stemi|rhythm|ecg|telemetry/i, features: ["ecg_core", "labs", "pharmacology", "simulations"] },
  { pattern: /lab|electrolyte|potassium|sodium|creatinine|lactate|abg|renal/i, features: ["labs", "questions", "simulations"] },
  { pattern: /med|pharm|insulin|heparin|warfarin|dose|calculation/i, features: ["pharmacology", "medication_math", "questions"] },
  { pattern: /priority|delegation|safety|deterioration|shock|sepsis|respiratory/i, features: ["simulations", "ngn", "clinical_skills"] },
  { pattern: /assessment|skill|wound|trach|chest tube|foley|documentation/i, features: ["clinical_skills", "notebook", "simulations"] },
];

export function buildProductDiscoveryDashboard(input: {
  tier?: string | null;
  learnerPath?: string | null;
  alliedCareer?: string | null;
  usage?: FeatureUsageSnapshot;
  activityUsage?: FeatureUsageSnapshot;
  weakTopics?: readonly string[];
  hasBaseAccess?: boolean;
  hasAdvancedEcgEntitlement?: boolean;
  firstSubscription?: boolean;
}): ProductDiscoveryDashboard {
  const pathway = normalizeFeatureDiscoveryPathway({
    tier: input.tier,
    learnerPath: input.learnerPath,
    alliedCareer: input.alliedCareer,
  });
  const usage = mergeFeatureUsageSnapshot(input.usage ?? {}, input.activityUsage ?? {});
  const profile = buildFeatureValueProfile({
    pathway,
    usage,
    weakTopics: input.weakTopics,
    hasBaseAccess: input.hasBaseAccess,
    hasAdvancedEcgEntitlement: input.hasAdvancedEcgEntitlement,
  });
  const modules = profile.included.concat(profile.upgrades).map((feature): ProductDiscoveryModule => {
    const status: ProductDiscoveryStatus =
      feature.availabilityForLearner === "upgrade"
        ? "upgrade"
        : feature.usage.completions >= 3 || feature.usage.itemsCompleted >= 5
          ? "completed"
          : feature.used
            ? "started"
            : "not_yet_explored";
    return {
      ...feature,
      status,
      launches: feature.usage.launches,
      completions: feature.usage.completions,
      itemsCompleted: feature.usage.itemsCompleted,
      lastUsedAt: feature.usage.lastUsedAt,
      valueMessage: valueMessageFor(feature.key, status),
    };
  });

  const completed = modules.filter((module) => module.status === "completed");
  const started = modules.filter((module) => module.status === "started");
  const notYetExplored = modules.filter((module) => module.status === "not_yet_explored");
  const upgrades = modules.filter((module) => module.status === "upgrade");
  const discovered = completed.length + started.length;

  return {
    pathway,
    profile,
    modules,
    completed,
    started,
    notYetExplored,
    upgrades,
    prompts: profile.prompts,
    firstTimeMoments: buildFirstTimeMoments({ discovered, firstSubscription: input.firstSubscription }),
    recommendations: buildCrossModuleRecommendations({
      modules,
      usage,
      weakTopics: input.weakTopics ?? [],
    }),
    sevenDayDiscoveryGoal: discoveryGoal(5, discovered),
    thirtyDayDiscoveryGoal: discoveryGoal(8, discovered),
    subscriptionValue: buildSubscriptionValue({ completed, started, notYetExplored, upgrades }),
  };
}

export function buildFeatureDiscoveryUsageSnapshot(input: {
  questionsAnswered?: number | null;
  practiceSessions?: number | null;
  flashcardsReviewed?: number | null;
  lessonsCompleted?: number | null;
  catSessions?: number | null;
  readinessScoreAvailable?: boolean | null;
  studyPlanConfigured?: boolean | null;
  analyticsAvailable?: boolean | null;
  progressReportAvailable?: boolean | null;
  notesCount?: number | null;
  labsCompleted?: number | null;
  simulationsCompleted?: number | null;
  clinicalSkillsCompleted?: number | null;
  medicationMathCompleted?: number | null;
  pharmacologyCompleted?: number | null;
  ngnCompleted?: number | null;
  confidenceAnalyticsViewed?: boolean | null;
}): FeatureUsageSnapshot {
  return {
    questions: usageMetric({
      launches: input.practiceSessions ?? 0,
      completions: input.practiceSessions ?? 0,
      itemsCompleted: input.questionsAnswered ?? 0,
    }),
    flashcards: usageMetric(input.flashcardsReviewed ?? 0),
    lessons: usageMetric(input.lessonsCompleted ?? 0),
    cat: usageMetric(input.catSessions ?? 0),
    readiness: usageMetric(Boolean(input.readinessScoreAvailable)),
    study_plans: usageMetric(Boolean(input.studyPlanConfigured)),
    analytics: usageMetric(Boolean(input.analyticsAvailable)),
    progress_reports: usageMetric(Boolean(input.progressReportAvailable)),
    notebook: usageMetric(input.notesCount ?? 0),
    labs: usageMetric(input.labsCompleted ?? 0),
    simulations: usageMetric(input.simulationsCompleted ?? 0),
    clinical_skills: usageMetric(input.clinicalSkillsCompleted ?? 0),
    medication_math: usageMetric(input.medicationMathCompleted ?? 0),
    pharmacology: usageMetric(input.pharmacologyCompleted ?? 0),
    ngn: usageMetric(input.ngnCompleted ?? 0),
    confidence_analytics: usageMetric(Boolean(input.confidenceAnalyticsViewed)),
  };
}

export type ProductDiscoveryInsights = {
  mostDiscoveredFeatures: FeatureDiscoveryKey[];
  leastDiscoveredFeatures: FeatureDiscoveryKey[];
  highestConvertingFeatures: FeatureDiscoveryKey[];
  highestRetentionFeatures: FeatureDiscoveryKey[];
  mostShareableFeatures: FeatureDiscoveryKey[];
  adoptionSummary: FeatureImpactSummary;
};

export function buildProductDiscoveryInsights(rows: readonly FeatureImpactAnalyticsRow[]): ProductDiscoveryInsights {
  const adoptionSummary = buildFeatureImpactSummary(rows);
  const sortedByAdoption = [...adoptionSummary.adoptionRows].sort((a, b) => b.adoptionRate - a.adoptionRate);
  const sortedByLowAdoption = [...adoptionSummary.adoptionRows].sort((a, b) => a.adoptionRate - b.adoptionRate);
  return {
    mostDiscoveredFeatures: sortedByAdoption.slice(0, 5).map((row) => row.featureKey),
    leastDiscoveredFeatures: sortedByLowAdoption.slice(0, 5).map((row) => row.featureKey),
    highestConvertingFeatures: adoptionSummary.topUpgradeDrivers,
    highestRetentionFeatures: adoptionSummary.topRetentionDrivers,
    mostShareableFeatures: sortedByAdoption
      .filter((row) => row.retentionContribution >= 60 || row.readinessGainPct == null || row.readinessGainPct >= 5)
      .slice(0, 5)
      .map((row) => row.featureKey),
    adoptionSummary,
  };
}

function buildCrossModuleRecommendations(input: {
  modules: readonly ProductDiscoveryModule[];
  usage: FeatureUsageSnapshot;
  weakTopics: readonly string[];
}): CrossModuleRecommendation[] {
  const byKey = new Map(input.modules.map((module) => [module.key, module]));
  const usedKeys = new Set(
    Object.entries(input.usage)
      .filter(([, metric]) => metric && (metric.launches > 0 || metric.completions > 0 || metric.itemsCompleted > 0))
      .map(([key]) => key as FeatureDiscoveryKey),
  );
  const recommendations: CrossModuleRecommendation[] = [];

  if (usedKeys.size >= 5) {
    for (const target of ["advanced_ecg", "simulations", "confidence_analytics"] as const) {
      const targetModule = byKey.get(target);
      if (!targetModule || targetModule.status === "completed" || targetModule.status === "started") continue;
      recommendations.push(recommendationFor("analytics", targetModule, "power_user"));
    }
  }

  for (const source of usedKeys) {
    for (const target of CROSS_MODULE_LINKS[source] ?? []) {
      const targetModule = byKey.get(target);
      if (!targetModule || targetModule.status === "completed" || targetModule.status === "started") continue;
      recommendations.push(recommendationFor(source, targetModule, "completion_followup"));
    }
  }

  const weakTopicText = input.weakTopics.join(" ");
  for (const cluster of TOPIC_TO_FEATURES) {
    if (!cluster.pattern.test(weakTopicText)) continue;
    for (const target of cluster.features) {
      const targetModule = byKey.get(target);
      if (!targetModule || targetModule.status === "completed" || targetModule.status === "started") continue;
      recommendations.push(recommendationFor("questions", targetModule, "weak_area"));
    }
  }

  return uniqueRecommendations(recommendations).slice(0, 6);
}

function recommendationFor(
  sourceFeature: FeatureDiscoveryKey,
  target: ProductDiscoveryModule,
  reason: CrossModuleRecommendation["reason"],
): CrossModuleRecommendation {
  const source = FEATURE_DISCOVERY_CATALOG.find((item) => item.key === sourceFeature);
  return {
    id: `${reason}:${sourceFeature}->${target.key}`,
    title: `Try ${target.label}`,
    body:
      reason === "weak_area"
        ? `${target.shortLabel} connects directly to the weak areas showing up in your practice.`
        : reason === "power_user"
          ? `You are using multiple NurseNest tools. ${target.shortLabel} is a strong next step.`
          : `After ${source?.shortLabel ?? "your recent work"}, ${target.shortLabel} helps transfer the same topic into another learning mode.`,
    href: target.availabilityForLearner === "upgrade" ? target.upgradeHref ?? target.href : target.href,
    sourceFeature,
    targetFeature: target.key,
    reason,
  };
}

function uniqueRecommendations(recommendations: readonly CrossModuleRecommendation[]): CrossModuleRecommendation[] {
  const seen = new Set<string>();
  return recommendations.filter((recommendation) => {
    if (seen.has(recommendation.targetFeature)) return false;
    seen.add(recommendation.targetFeature);
    return true;
  });
}

function buildFirstTimeMoments(input: { discovered: number; firstSubscription?: boolean }): FirstTimeDiscoveryMoment[] {
  const moments: FirstTimeDiscoveryMoment[] = [];
  if (input.discovered === 0) moments.push("first_visit");
  if (input.discovered <= 1) moments.push("first_module_use");
  if (input.firstSubscription) moments.push("first_subscription");
  if (moments.length === 0) moments.push("returning_learner");
  return moments;
}

function discoveryGoal(target: 5 | 8, discovered: number) {
  const remaining = Math.max(0, target - discovered);
  return { target, discovered, remaining, met: remaining === 0 };
}

function buildSubscriptionValue(input: {
  completed: readonly ProductDiscoveryModule[];
  started: readonly ProductDiscoveryModule[];
  notYetExplored: readonly ProductDiscoveryModule[];
  upgrades: readonly ProductDiscoveryModule[];
}) {
  const featuresUsed = input.completed.length + input.started.length;
  const featuresRemaining = input.notYetExplored.length + input.upgrades.length;
  const milestones = [
    input.completed.length > 0 ? `${input.completed.length} modules completed` : "Start your first module",
    input.started.length > 0 ? `${input.started.length} modules in progress` : "Open a second learning mode",
    input.notYetExplored.length > 0 ? `${input.notYetExplored.length} included modules still unexplored` : "All included modules discovered",
  ];
  return {
    featuresUsed,
    featuresRemaining,
    estimatedValueUnlockedLabel:
      featuresUsed >= 8
        ? "Deep platform value unlocked"
        : featuresUsed >= 5
          ? "Strong platform value unlocked"
          : "More value waiting in your plan",
    milestones,
  };
}

function valueMessageFor(key: FeatureDiscoveryKey, status: ProductDiscoveryStatus): string {
  if (status === "upgrade") return "Available as an upgrade or adjacent pathway.";
  if (status === "completed") return "You have already turned this feature into progress.";
  if (status === "started") return "You have started this feature. Return to build momentum.";
  switch (key) {
    case "ecg_core":
      return "Try your first ECG case to connect rhythm recognition with nursing action.";
    case "ngn":
      return "Complete your first Bowtie or Matrix item to practice clinical judgment.";
    case "notebook":
      return "Create your first notebook entry from a rationale or weak area.";
    case "labs":
      return "Open a lab interpretation activity to practice abnormal values and escalation.";
    case "simulations":
      return "Run a patient scenario to practice what to do next.";
    case "medication_math":
      return "Complete a medication math drill to strengthen safety under pressure.";
    case "confidence_analytics":
      return "Review confidence calibration to find overconfidence and uncertainty.";
    default:
      return "Explore this feature to unlock more of your NurseNest plan.";
  }
}
