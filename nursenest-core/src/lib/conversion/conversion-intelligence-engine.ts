export type ConversionCohort =
  | "RN"
  | "RPN"
  | "NP"
  | "RT"
  | "Allied"
  | "NewGrad"
  | "HESI"
  | "TEAS"
  | "ECGCore"
  | "AdvancedECG";

export type ConversionStage =
  | "anonymous_visitor"
  | "marketing_page"
  | "pricing"
  | "signup"
  | "email_verification"
  | "trial_or_free_access"
  | "feature_exploration"
  | "checkout"
  | "subscription"
  | "retention";

export type ConversionStageMetric = {
  stage: ConversionStage;
  label: string;
  count: number | null;
};

export type ConversionFunnel = {
  cohort: ConversionCohort;
  steps: Array<
    ConversionStageMetric & {
      conversionFromPriorPct: number | null;
      dropOffFromPriorPct: number | null;
    }
  >;
  overallConversionPct: number | null;
  largestDropOff: {
    from: ConversionStage;
    to: ConversionStage;
    dropOffPct: number;
  } | null;
};

export type ContentAttributionInput = {
  page: string;
  pageType: "blog" | "authority" | "exam" | "pricing" | "ecg" | "clinical_skills" | "pharmacology" | "marketing";
  revenueCents: number;
  subscriptions: number;
  assistedCheckouts?: number;
};

export type FeatureDiscoveryInput = {
  feature:
    | "questions"
    | "flashcards"
    | "lessons"
    | "clinical_skills"
    | "pharmacology"
    | "ecg"
    | "cat"
    | "loft";
  explorers: number;
  subscribersAfterExploration: number;
  repeatUsers?: number;
};

export type PricingIntelligenceInput = {
  planCode: string;
  planType: "monthly" | "annual" | "bundle" | "addon";
  starts: number;
  completions: number;
  revenueCents: number;
  retainedSubscriptions?: number;
};

export type ConversionDropOff = {
  cohort: ConversionCohort;
  stage: ConversionStage;
  nextStage: ConversionStage;
  dropOffPct: number;
  riskScore: number;
  reason: string;
};

export type ConversionRecommendation = {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  evidence: string;
  suggestedAction: string;
};

export type ConversionIntelligenceReport = {
  generatedAt: string;
  funnels: ConversionFunnel[];
  dropOffs: ConversionDropOff[];
  topRevenueDrivers: Array<ContentAttributionInput & { revenueDollars: number }>;
  topConvertingFeatures: Array<FeatureDiscoveryInput & { conversionPct: number }>;
  pricingInsights: Array<PricingIntelligenceInput & { checkoutCompletionPct: number; revenueDollars: number; retentionPct: number | null }>;
  executiveSummary: {
    visitors: number | null;
    signups: number | null;
    subscribers: number | null;
    revenueDollars: number;
    averageConversionPct: number | null;
    checkoutSuccessPct: number | null;
  };
  alerts: ConversionRecommendation[];
  recommendations: ConversionRecommendation[];
};

function pct(numerator: number | null | undefined, denominator: number | null | undefined): number | null {
  if (numerator == null || denominator == null || denominator <= 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function riskFromDropOff(dropOffPct: number): number {
  if (dropOffPct >= 85) return 100;
  if (dropOffPct >= 70) return 85;
  if (dropOffPct >= 50) return 70;
  if (dropOffPct >= 30) return 45;
  return 20;
}

export function buildConversionFunnel(cohort: ConversionCohort, stages: ConversionStageMetric[]): ConversionFunnel {
  let prior: number | null = null;
  const steps = stages.map((stage) => {
    const conversionFromPriorPct = pct(stage.count, prior);
    const dropOffFromPriorPct = conversionFromPriorPct == null ? null : Math.max(0, Math.round((100 - conversionFromPriorPct) * 10) / 10);
    if (stage.count != null) prior = stage.count;
    return { ...stage, conversionFromPriorPct, dropOffFromPriorPct };
  });
  const first = steps.find((step) => step.count != null)?.count ?? null;
  const last = [...steps].reverse().find((step) => step.count != null)?.count ?? null;
  const largestDropOffStep = steps
    .map((step, index) => ({ step, prev: steps[index - 1] }))
    .filter((row): row is { step: (typeof steps)[number]; prev: (typeof steps)[number] } => Boolean(row.prev && row.step.dropOffFromPriorPct != null))
    .sort((a, b) => (b.step.dropOffFromPriorPct ?? 0) - (a.step.dropOffFromPriorPct ?? 0))[0];

  return {
    cohort,
    steps,
    overallConversionPct: pct(last, first),
    largestDropOff: largestDropOffStep
      ? {
          from: largestDropOffStep.prev.stage,
          to: largestDropOffStep.step.stage,
          dropOffPct: largestDropOffStep.step.dropOffFromPriorPct ?? 0,
        }
      : null,
  };
}

export function identifyDropOffRisks(funnels: ConversionFunnel[]): ConversionDropOff[] {
  return funnels.flatMap((funnel) =>
    funnel.steps
      .map((step, index) => ({ step, prev: funnel.steps[index - 1] }))
      .filter((row): row is { step: (typeof funnel.steps)[number]; prev: (typeof funnel.steps)[number] } => {
        return Boolean(row.prev && row.step.dropOffFromPriorPct != null && row.step.dropOffFromPriorPct >= 30);
      })
      .map(({ step, prev }) => ({
        cohort: funnel.cohort,
        stage: prev.stage,
        nextStage: step.stage,
        dropOffPct: step.dropOffFromPriorPct ?? 0,
        riskScore: riskFromDropOff(step.dropOffFromPriorPct ?? 0),
        reason: `${funnel.cohort} loses ${step.dropOffFromPriorPct}% from ${prev.label} to ${step.label}.`,
      })),
  );
}

export function buildConversionRecommendations(report: Omit<ConversionIntelligenceReport, "alerts" | "recommendations">): ConversionRecommendation[] {
  const recommendations: ConversionRecommendation[] = [];
  for (const drop of report.dropOffs.slice(0, 5)) {
    recommendations.push({
      severity: drop.riskScore >= 90 ? "critical" : drop.riskScore >= 70 ? "high" : "medium",
      title: `${drop.cohort} ${drop.nextStage.replace(/_/g, " ")} drop-off needs review`,
      evidence: drop.reason,
      suggestedAction: "Review page copy, CTA clarity, entitlement messaging, load performance, and form errors for this stage.",
    });
  }

  const bestFeature = report.topConvertingFeatures[0];
  if (bestFeature) {
    recommendations.push({
      severity: "medium",
      title: `${bestFeature.feature.replace(/_/g, " ")} exploration is associated with conversion`,
      evidence: `${bestFeature.conversionPct}% of explorers subscribed after engaging with this feature.`,
      suggestedAction: "Surface this feature earlier in pricing, onboarding, and pathway landing pages.",
    });
  }

  const bestPage = report.topRevenueDrivers[0];
  if (bestPage) {
    recommendations.push({
      severity: "low",
      title: `${bestPage.page} is a revenue driver`,
      evidence: `$${bestPage.revenueDollars.toLocaleString()} attributed across ${bestPage.subscriptions} subscriptions.`,
      suggestedAction: "Protect internal links to this page and use it as a model for adjacent authority content.",
    });
  }

  return recommendations;
}

export function buildConversionIntelligenceReport(input: {
  generatedAt?: string;
  funnels: ConversionFunnel[];
  contentAttribution?: ContentAttributionInput[];
  featureDiscovery?: FeatureDiscoveryInput[];
  pricing?: PricingIntelligenceInput[];
}): ConversionIntelligenceReport {
  const dropOffs = identifyDropOffRisks(input.funnels).sort((a, b) => b.riskScore - a.riskScore);
  const topRevenueDrivers = [...(input.contentAttribution ?? [])]
    .sort((a, b) => b.revenueCents - a.revenueCents)
    .slice(0, 15)
    .map((item) => ({ ...item, revenueDollars: Math.round(item.revenueCents / 100) }));
  const topConvertingFeatures = [...(input.featureDiscovery ?? [])]
    .map((item) => ({ ...item, conversionPct: pct(item.subscribersAfterExploration, item.explorers) ?? 0 }))
    .sort((a, b) => b.conversionPct - a.conversionPct)
    .slice(0, 15);
  const pricingInsights = [...(input.pricing ?? [])]
    .map((item) => ({
      ...item,
      checkoutCompletionPct: pct(item.completions, item.starts) ?? 0,
      revenueDollars: Math.round(item.revenueCents / 100),
      retentionPct: item.retainedSubscriptions == null ? null : pct(item.retainedSubscriptions, item.completions),
    }))
    .sort((a, b) => b.revenueCents - a.revenueCents);
  const revenueDollars = topRevenueDrivers.reduce((sum, item) => sum + item.revenueDollars, 0);
  const visitors = input.funnels.reduce<number | null>((max, funnel) => {
    const value = funnel.steps.find((step) => step.stage === "anonymous_visitor")?.count;
    return value == null ? max : Math.max(max ?? 0, value);
  }, null);
  const signups = input.funnels.reduce<number | null>((sum, funnel) => {
    const value = funnel.steps.find((step) => step.stage === "signup")?.count;
    return value == null ? sum : (sum ?? 0) + value;
  }, null);
  const subscribers = input.funnels.reduce<number | null>((sum, funnel) => {
    const value = funnel.steps.find((step) => step.stage === "subscription")?.count;
    return value == null ? sum : (sum ?? 0) + value;
  }, null);
  const conversionPcts = input.funnels.map((funnel) => funnel.overallConversionPct).filter((value): value is number => value != null);
  const checkoutStarts = pricingInsights.reduce((sum, item) => sum + item.starts, 0);
  const checkoutCompletions = pricingInsights.reduce((sum, item) => sum + item.completions, 0);

  const reportBase = {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    funnels: input.funnels,
    dropOffs,
    topRevenueDrivers,
    topConvertingFeatures,
    pricingInsights,
    executiveSummary: {
      visitors,
      signups,
      subscribers,
      revenueDollars,
      averageConversionPct:
        conversionPcts.length > 0 ? Math.round((conversionPcts.reduce((sum, value) => sum + value, 0) / conversionPcts.length) * 10) / 10 : null,
      checkoutSuccessPct: pct(checkoutCompletions, checkoutStarts),
    },
  };
  const recommendations = buildConversionRecommendations(reportBase);
  const alerts = recommendations.filter((item) => item.severity === "critical" || item.severity === "high");

  return { ...reportBase, alerts, recommendations };
}
