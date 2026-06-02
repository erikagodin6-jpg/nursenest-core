export type ExecutionReadinessArea =
  | "rn"
  | "pn"
  | "np"
  | "usExpansion"
  | "uk"
  | "australia"
  | "newZealand"
  | "ireland"
  | "overallCommercial"
  | "overallLaunch";

export type ExpansionKillSwitchStatus = "PAUSE_NEW_COUNTRY_EXPANSION" | "ALLOW_CONTROLLED_EXPANSION";

export type ExecutionPriorityTier = {
  readonly tier: 1 | 2 | 3 | 4;
  readonly label: string;
  readonly initiatives: readonly string[];
  readonly status: "active" | "gated" | "paused";
};

export type ExecutionReadinessWeights = {
  readonly contentQuality: 30;
  readonly questionEnrichment: 20;
  readonly flashcards: 10;
  readonly cat: 10;
  readonly practiceExams: 10;
  readonly reliability: 10;
  readonly countrySupplements: 5;
  readonly seo: 5;
};

export type ExecutionPathwaySignals = {
  readonly contentQuality: number;
  readonly questionEnrichment: number;
  readonly flashcards: number;
  readonly cat: number;
  readonly practiceExams: number;
  readonly reliability: number;
  readonly countrySupplements: number;
  readonly seo: number;
  readonly conversion: number;
  readonly revenue: number;
  readonly monetizationTested: boolean;
  readonly conversionFunnelTested: boolean;
  readonly supportSystemsReady: boolean;
};

export type CountryLaunchGateScores = {
  readonly country: "United States" | "United Kingdom" | "Australia" | "New Zealand" | "Ireland";
  readonly gates: Record<string, number>;
  readonly pass: boolean;
};

export type GlobalExecutionDashboardInput = {
  readonly rn: ExecutionPathwaySignals;
  readonly pn: ExecutionPathwaySignals;
  readonly np: ExecutionPathwaySignals;
  readonly usExpansion: ExecutionPathwaySignals;
  readonly uk: ExecutionPathwaySignals;
  readonly australia: ExecutionPathwaySignals;
  readonly newZealand: ExecutionPathwaySignals;
  readonly ireland?: ExecutionPathwaySignals;
};

export type GlobalExecutionDashboard = {
  readonly generatedAt: string;
  readonly killSwitchStatus: ExpansionKillSwitchStatus;
  readonly killSwitchReasons: readonly string[];
  readonly readinessWeights: ExecutionReadinessWeights;
  readonly executiveDashboard: Record<ExecutionReadinessArea, number>;
  readonly countryLaunchGates: readonly CountryLaunchGateScores[];
  readonly currentPriorityRanking: readonly ExecutionPriorityTier[];
  readonly resourceAllocation: {
    readonly coreEcosystemMinimumPercent: 70;
    readonly internationalMaximumPercent: 20;
    readonly experimentalMaximumPercent: 10;
    readonly recommendedCoreEcosystemPercent: number;
    readonly recommendedInternationalPercent: number;
    readonly recommendedExperimentalPercent: number;
  };
  readonly launchApprovalFindings: readonly string[];
  readonly nextExecutionFocus: readonly string[];
  readonly successMetricShift: readonly string[];
};

export const EXECUTION_READINESS_WEIGHTS: ExecutionReadinessWeights = {
  contentQuality: 30,
  questionEnrichment: 20,
  flashcards: 10,
  cat: 10,
  practiceExams: 10,
  reliability: 10,
  countrySupplements: 5,
  seo: 5,
} as const;

export const EXECUTION_PRIORITY_RANKING_BASE: readonly ExecutionPriorityTier[] = [
  {
    tier: 1,
    label: "Core quality and learning engine",
    initiatives: ["RN Question Enrichment", "PN Question Enrichment", "NP Question Enrichment", "Flashcard Regeneration", "Practice Exam Quality", "CAT Quality", "Blueprint Coverage"],
    status: "active",
  },
  {
    tier: 2,
    label: "U.S. expansion depth",
    initiatives: ["U.S. Expansion", "Delegation", "Legal", "Documentation", "Medicare", "Medicaid", "NCLEX-PN Differentiation"],
    status: "gated",
  },
  {
    tier: 3,
    label: "Hidden international beta",
    initiatives: ["UK Hidden Beta", "Australia Hidden Beta", "New Zealand Hidden Beta"],
    status: "paused",
  },
  {
    tier: 4,
    label: "Future country expansion",
    initiatives: ["Ireland", "UAE", "Saudi Arabia", "Singapore"],
    status: "paused",
  },
] as const;

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Number(value.toFixed(1))));
}

function weightedReadiness(signals: ExecutionPathwaySignals): number {
  const score =
    signals.contentQuality * 0.3 +
    signals.questionEnrichment * 0.2 +
    signals.flashcards * 0.1 +
    signals.cat * 0.1 +
    signals.practiceExams * 0.1 +
    signals.reliability * 0.1 +
    signals.countrySupplements * 0.05 +
    signals.seo * 0.05;
  return clamp(score);
}

function average(values: readonly number[]): number {
  return values.length ? clamp(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function killSwitchReasons(input: GlobalExecutionDashboardInput): string[] {
  const reasons: string[] = [];
  const checks = [
    ["RN Quality Readiness", input.rn.questionEnrichment],
    ["PN Quality Readiness", input.pn.questionEnrichment],
    ["NP Quality Readiness", input.np.questionEnrichment],
    ["Conversion Readiness", average([input.rn.conversion, input.pn.conversion, input.np.conversion])],
    ["Reliability Readiness", average([input.rn.reliability, input.pn.reliability, input.np.reliability])],
    ["Revenue Readiness", average([input.rn.revenue, input.pn.revenue, input.np.revenue])],
  ] as const;
  for (const [label, value] of checks) {
    if (value < 90) reasons.push(`${label} is ${value}%, below the 90% expansion threshold.`);
  }
  return reasons;
}

function launchApprovalFindingsFor(name: string, signals: ExecutionPathwaySignals, overall: number): string[] {
  const findings: string[] = [];
  if (overall < 95) findings.push(`${name}: overall readiness ${overall}% is below 95%.`);
  if (signals.questionEnrichment < 95) findings.push(`${name}: question quality ${signals.questionEnrichment}% is below 95%.`);
  if (signals.flashcards < 95) findings.push(`${name}: flashcard quality ${signals.flashcards}% is below 95%.`);
  if (signals.contentQuality < 95) findings.push(`${name}: blueprint/content coverage ${signals.contentQuality}% is below 95%.`);
  if (signals.reliability < 99.9) findings.push(`${name}: reliability ${signals.reliability}% is below 99.9%.`);
  if (!signals.conversionFunnelTested) findings.push(`${name}: conversion funnel is not tested.`);
  if (!signals.monetizationTested) findings.push(`${name}: monetization is not tested.`);
  if (!signals.supportSystemsReady) findings.push(`${name}: learner support systems are not ready.`);
  return findings;
}

function countryGate(country: CountryLaunchGateScores["country"], gates: Record<string, number>): CountryLaunchGateScores {
  return {
    country,
    gates,
    pass: Object.values(gates).every((score) => score >= 95),
  };
}

function priorityRanking(paused: boolean): readonly ExecutionPriorityTier[] {
  if (!paused) return EXECUTION_PRIORITY_RANKING_BASE;
  return EXECUTION_PRIORITY_RANKING_BASE.map((tier) =>
    tier.tier === 1
      ? { ...tier, status: "active" as const }
      : tier.tier === 2
        ? { ...tier, status: "gated" as const }
        : { ...tier, status: "paused" as const },
  );
}

export function buildGlobalExecutionDashboard(input: GlobalExecutionDashboardInput): GlobalExecutionDashboard {
  const rnReadiness = weightedReadiness(input.rn);
  const pnReadiness = weightedReadiness(input.pn);
  const npReadiness = weightedReadiness(input.np);
  const usExpansionReadiness = weightedReadiness(input.usExpansion);
  const ukReadiness = weightedReadiness(input.uk);
  const australiaReadiness = weightedReadiness(input.australia);
  const newZealandReadiness = weightedReadiness(input.newZealand);
  const irelandReadiness = input.ireland ? weightedReadiness(input.ireland) : 0;
  const overallCommercialReadiness = average([input.rn.revenue, input.pn.revenue, input.np.revenue, input.usExpansion.revenue]);
  const overallLaunchReadiness = average([rnReadiness, pnReadiness, npReadiness, usExpansionReadiness]);
  const reasons = killSwitchReasons(input);
  const paused = reasons.length > 0;

  return {
    generatedAt: new Date().toISOString(),
    killSwitchStatus: paused ? "PAUSE_NEW_COUNTRY_EXPANSION" : "ALLOW_CONTROLLED_EXPANSION",
    killSwitchReasons: reasons,
    readinessWeights: EXECUTION_READINESS_WEIGHTS,
    executiveDashboard: {
      rn: rnReadiness,
      pn: pnReadiness,
      np: npReadiness,
      usExpansion: usExpansionReadiness,
      uk: ukReadiness,
      australia: australiaReadiness,
      newZealand: newZealandReadiness,
      ireland: irelandReadiness,
      overallCommercial: overallCommercialReadiness,
      overallLaunch: overallLaunchReadiness,
    },
    countryLaunchGates: [
      countryGate("United States", {
        "Country Supplements": input.usExpansion.countrySupplements,
        "Question Quality": input.usExpansion.questionEnrichment,
        Flashcards: input.usExpansion.flashcards,
        CAT: input.usExpansion.cat,
      }),
      countryGate("United Kingdom", {
        "NMC CBT": input.uk.contentQuality,
        OSCE: input.uk.practiceExams,
        NEWS2: input.uk.countrySupplements,
        "Duty of Candour": input.uk.countrySupplements,
        Safeguarding: input.uk.countrySupplements,
      }),
      countryGate("Australia", {
        NMBA: input.australia.contentQuality,
        "Ahpra/IQNM": input.australia.countrySupplements,
        "Aboriginal Health": input.australia.countrySupplements,
        "Rural Care": input.australia.countrySupplements,
      }),
      countryGate("New Zealand", {
        NCNZ: input.newZealand.contentQuality,
        "Te Tiriti": input.newZealand.countrySupplements,
        "Cultural Safety": input.newZealand.countrySupplements,
        "Community Care": input.newZealand.practiceExams,
      }),
      countryGate("Ireland", {
        "NMBI Readiness": input.ireland ? weightedReadiness(input.ireland) : 0,
      }),
    ],
    currentPriorityRanking: priorityRanking(paused),
    resourceAllocation: {
      coreEcosystemMinimumPercent: 70,
      internationalMaximumPercent: 20,
      experimentalMaximumPercent: 10,
      recommendedCoreEcosystemPercent: paused ? 90 : 70,
      recommendedInternationalPercent: paused ? 5 : 20,
      recommendedExperimentalPercent: paused ? 5 : 10,
    },
    launchApprovalFindings: [
      ...launchApprovalFindingsFor("RN", input.rn, rnReadiness),
      ...launchApprovalFindingsFor("PN", input.pn, pnReadiness),
      ...launchApprovalFindingsFor("NP", input.np, npReadiness),
      ...launchApprovalFindingsFor("U.S. Expansion", input.usExpansion, usExpansionReadiness),
      ...launchApprovalFindingsFor("UK", input.uk, ukReadiness),
      ...launchApprovalFindingsFor("Australia", input.australia, australiaReadiness),
      ...launchApprovalFindingsFor("New Zealand", input.newZealand, newZealandReadiness),
    ],
    nextExecutionFocus: paused
      ? ["RN Question Enrichment", "PN Question Enrichment", "NP Question Enrichment", "Flashcard Regeneration", "Practice Exam Quality", "CAT Quality", "Blueprint Coverage", "Reliability", "Conversion", "Retention"]
      : ["Controlled U.S. expansion", "Hidden beta proof for UK/Australia/New Zealand", "Revenue instrumentation"],
    successMetricShift: ["Learner outcomes", "Conversion", "Retention", "Readiness", "Revenue", "Quality"],
  };
}

export function validateGlobalExecutionDashboard(dashboard: GlobalExecutionDashboard): readonly string[] {
  const issues: string[] = [];
  if (dashboard.killSwitchStatus === "PAUSE_NEW_COUNTRY_EXPANSION" && dashboard.resourceAllocation.recommendedInternationalPercent > 20) {
    issues.push("Paused expansion cannot allocate more than 20% to international work.");
  }
  if (dashboard.resourceAllocation.recommendedCoreEcosystemPercent < 70) {
    issues.push("Core ecosystem allocation must remain at least 70%.");
  }
  for (const gate of dashboard.countryLaunchGates) {
    if (gate.pass && Object.values(gate.gates).some((score) => score < 95)) {
      issues.push(`${gate.country} cannot pass country launch gates below 95%.`);
    }
  }
  return issues;
}
