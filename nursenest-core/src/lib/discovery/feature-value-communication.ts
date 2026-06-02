export type FeatureDiscoveryPathway =
  | "rn"
  | "rpn"
  | "np"
  | "rt"
  | "allied"
  | "new_grad"
  | "ecg"
  | "advanced_ecg";

export type FeatureDiscoveryKey =
  | "questions"
  | "flashcards"
  | "lessons"
  | "ngn"
  | "clinical_skills"
  | "pharmacology"
  | "ecg_core"
  | "advanced_ecg"
  | "labs"
  | "medication_math"
  | "simulations"
  | "cat"
  | "loft"
  | "readiness"
  | "study_plans"
  | "analytics"
  | "progress_reports"
  | "notebook"
  | "confidence_analytics"
  | "hesi"
  | "teas"
  | "casper"
  | "np_specialty_tools"
  | "allied_health_resources";

export type FeatureAvailability = "included" | "upgrade" | "not_available";

export type FeatureUsageMetric = {
  launches: number;
  completions: number;
  itemsCompleted: number;
  lastUsedAt: string | null;
};

export type FeatureUsageSnapshot = Partial<Record<FeatureDiscoveryKey, FeatureUsageMetric>>;

export type FeatureDiscoveryItem = {
  key: FeatureDiscoveryKey;
  label: string;
  shortLabel: string;
  description: string;
  href: string;
  availability: Record<FeatureDiscoveryPathway, FeatureAvailability>;
  upgradeHref?: string;
};

export type FeatureValueItem = FeatureDiscoveryItem & {
  availabilityForLearner: FeatureAvailability;
  used: boolean;
  usage: FeatureUsageMetric;
};

export type DiscoveryPrompt = {
  id: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  featureKey: FeatureDiscoveryKey;
  tone: "try_next" | "weak_area" | "upgrade";
};

export type FeatureValueProfile = {
  pathway: FeatureDiscoveryPathway;
  utilizationScore: number;
  includedCount: number;
  usedIncludedCount: number;
  included: FeatureValueItem[];
  used: FeatureValueItem[];
  notYetUsed: FeatureValueItem[];
  upgrades: FeatureValueItem[];
  prompts: DiscoveryPrompt[];
};

const ZERO_USAGE: FeatureUsageMetric = {
  launches: 0,
  completions: 0,
  itemsCompleted: 0,
  lastUsedAt: null,
};

const ALL_INCLUDED: Record<FeatureDiscoveryPathway, FeatureAvailability> = {
  rn: "included",
  rpn: "included",
  np: "included",
  rt: "included",
  allied: "included",
  new_grad: "included",
  ecg: "included",
  advanced_ecg: "included",
};

const NURSING_BASE_INCLUDED: Record<FeatureDiscoveryPathway, FeatureAvailability> = {
  rn: "included",
  rpn: "included",
  np: "included",
  rt: "not_available",
  allied: "included",
  new_grad: "included",
  ecg: "included",
  advanced_ecg: "included",
};

const CORE_ECG_AVAILABILITY: Record<FeatureDiscoveryPathway, FeatureAvailability> = {
  rn: "included",
  rpn: "not_available",
  np: "included",
  rt: "not_available",
  allied: "not_available",
  new_grad: "included",
  ecg: "included",
  advanced_ecg: "included",
};

const ADVANCED_ECG_AVAILABILITY: Record<FeatureDiscoveryPathway, FeatureAvailability> = {
  rn: "upgrade",
  rpn: "not_available",
  np: "upgrade",
  rt: "not_available",
  allied: "not_available",
  new_grad: "upgrade",
  ecg: "upgrade",
  advanced_ecg: "included",
};

const CAT_AVAILABILITY: Record<FeatureDiscoveryPathway, FeatureAvailability> = {
  rn: "included",
  rpn: "included",
  np: "not_available",
  rt: "included",
  allied: "included",
  new_grad: "included",
  ecg: "not_available",
  advanced_ecg: "not_available",
};

const LOFT_AVAILABILITY: Record<FeatureDiscoveryPathway, FeatureAvailability> = {
  rn: "not_available",
  rpn: "not_available",
  np: "included",
  rt: "not_available",
  allied: "not_available",
  new_grad: "included",
  ecg: "not_available",
  advanced_ecg: "not_available",
};

export const FEATURE_DISCOVERY_CATALOG: readonly FeatureDiscoveryItem[] = [
  {
    key: "questions",
    label: "Practice Questions",
    shortLabel: "Questions",
    description: "Exam-style practice with rationales, progress tracking, and weak-area repair.",
    href: "/app/questions",
    availability: ALL_INCLUDED,
  },
  {
    key: "flashcards",
    label: "Retention Flashcards",
    shortLabel: "Flashcards",
    description: "Spaced review for key facts, clinical cues, and rationale-linked recall.",
    href: "/app/flashcards",
    availability: ALL_INCLUDED,
  },
  {
    key: "lessons",
    label: "Guided Lessons",
    shortLabel: "Lessons",
    description: "Structured teaching for the concepts behind missed questions and weak topics.",
    href: "/app/lessons",
    availability: ALL_INCLUDED,
  },
  {
    key: "clinical_skills",
    label: "Clinical Skills",
    shortLabel: "Skills",
    description: "Procedure, safety, documentation, and bedside reasoning practice.",
    href: "/app/clinical-skills",
    availability: ALL_INCLUDED,
  },
  {
    key: "ngn",
    label: "NGN Question Types",
    shortLabel: "NGN",
    description: "Bowtie, matrix, SATA, case study, and trend-style clinical judgment practice.",
    href: "/app/practice-tests?questionType=ngn",
    availability: NURSING_BASE_INCLUDED,
  },
  {
    key: "pharmacology",
    label: "Pharmacology Review",
    shortLabel: "Pharmacology",
    description: "Medication safety, monitoring, teaching, and mechanism-focused review.",
    href: "/app/pharmacology",
    availability: NURSING_BASE_INCLUDED,
  },
  {
    key: "labs",
    label: "Clinical Labs",
    shortLabel: "Labs",
    description: "Abnormal values, trends, medication implications, and escalation decisions.",
    href: "/app/labs",
    availability: ALL_INCLUDED,
  },
  {
    key: "medication_math",
    label: "Medication Math",
    shortLabel: "Med Math",
    description: "Dose, rate, safe-range, and high-alert medication calculation practice.",
    href: "/app/med-calculations",
    availability: ALL_INCLUDED,
  },
  {
    key: "simulations",
    label: "Clinical Simulations",
    shortLabel: "Simulations",
    description: "Patient deterioration, branching decisions, and consequence-based feedback.",
    href: "/app/simulation-center",
    availability: ALL_INCLUDED,
  },
  {
    key: "ecg_core",
    label: "ECG Fundamentals",
    shortLabel: "ECG",
    description: "Core rhythm recognition and telemetry interpretation for eligible pathways.",
    href: "/modules/ecg/basic/lessons",
    availability: CORE_ECG_AVAILABILITY,
  },
  {
    key: "advanced_ecg",
    label: "Advanced ECG",
    shortLabel: "Advanced ECG",
    description: "Telemetry mastery, STEMI localization, electrolyte patterns, and complex strips.",
    href: "/modules/ecg-advanced",
    upgradeHref: "/pricing#advanced-ecg-add-on",
    availability: ADVANCED_ECG_AVAILABILITY,
  },
  {
    key: "cat",
    label: "Adaptive CAT Exams",
    shortLabel: "CAT",
    description: "Adaptive readiness checks that show whether practice is transferring.",
    href: "/app/practice-tests?cat=1",
    availability: CAT_AVAILABILITY,
  },
  {
    key: "loft",
    label: "LOFT Simulations",
    shortLabel: "LOFT",
    description: "Fixed-length longitudinal case practice for pathways that use simulation-style assessment.",
    href: "/app/cases/cnple",
    availability: LOFT_AVAILABILITY,
  },
  {
    key: "readiness",
    label: "Readiness Reports",
    shortLabel: "Readiness",
    description: "Strengths, weak areas, confidence calibration, and next-step guidance.",
    href: "/app/account/readiness",
    availability: ALL_INCLUDED,
  },
  {
    key: "study_plans",
    label: "Study Plans",
    shortLabel: "Study Plans",
    description: "Daily and weekly study structure that adapts around goals and weak areas.",
    href: "/app/study-plan",
    availability: ALL_INCLUDED,
  },
  {
    key: "analytics",
    label: "Analytics Dashboard",
    shortLabel: "Analytics",
    description: "Performance trends, question-type breakdowns, confidence, and study momentum.",
    href: "/app/account/analytics",
    availability: ALL_INCLUDED,
  },
  {
    key: "progress_reports",
    label: "Progress Reports",
    shortLabel: "Progress",
    description: "Completion history, category progress, activity history, and report cards.",
    href: "/app/account/progress",
    availability: ALL_INCLUDED,
  },
  {
    key: "notebook",
    label: "Study Notebook",
    shortLabel: "Notebook",
    description: "Capture rationales, weak-area notes, clinical pearls, and review plans.",
    href: "/app/account/notebook",
    availability: ALL_INCLUDED,
  },
  {
    key: "confidence_analytics",
    label: "Confidence Analytics",
    shortLabel: "Confidence",
    description: "Compare confidence with accuracy to find overconfidence and uncertain knowledge.",
    href: "/app/account/analytics#confidence",
    availability: ALL_INCLUDED,
  },
  {
    key: "hesi",
    label: "HESI A2 Prep",
    shortLabel: "HESI",
    description: "Admissions prep for HESI A2 science, math, reading, and study planning.",
    href: "/admissions#hesi-a2",
    availability: ALL_INCLUDED,
  },
  {
    key: "teas",
    label: "ATI TEAS Prep",
    shortLabel: "TEAS",
    description: "Admissions prep for TEAS science, math, English, and reading readiness.",
    href: "/admissions#ati-teas",
    availability: ALL_INCLUDED,
  },
  {
    key: "casper",
    label: "CASPER Prep",
    shortLabel: "CASPER",
    description: "Professional judgment, scenario reasoning, and admissions interview practice.",
    href: "/admissions#casper",
    availability: ALL_INCLUDED,
  },
  {
    key: "np_specialty_tools",
    label: "NP Specialty Tools",
    shortLabel: "NP Tools",
    description: "Certification-specific NP readiness, diagnostics, pharmacology, and case tools.",
    href: "/app/np",
    availability: {
      rn: "upgrade",
      rpn: "upgrade",
      np: "included",
      rt: "not_available",
      allied: "not_available",
      new_grad: "upgrade",
      ecg: "not_available",
      advanced_ecg: "not_available",
    },
  },
  {
    key: "allied_health_resources",
    label: "Allied Health Resources",
    shortLabel: "Allied",
    description: "RT, paramedic, OT, PT, MLT, PSW, placement, interview, and skills resources.",
    href: "/allied-health",
    availability: {
      rn: "upgrade",
      rpn: "upgrade",
      np: "upgrade",
      rt: "included",
      allied: "included",
      new_grad: "upgrade",
      ecg: "not_available",
      advanced_ecg: "not_available",
    },
  },
] as const;

export function normalizeFeatureDiscoveryPathway(input: {
  tier?: string | null;
  learnerPath?: string | null;
  alliedCareer?: string | null;
}): FeatureDiscoveryPathway {
  const learnerPath = input.learnerPath?.trim().toLowerCase() ?? "";
  const alliedCareer = input.alliedCareer?.trim().toLowerCase() ?? "";
  const tier = input.tier?.trim().toUpperCase() ?? "";

  if (learnerPath.includes("advanced-ecg") || learnerPath.includes("telemetry")) return "advanced_ecg";
  if (learnerPath.includes("ecg")) return "ecg";
  if (tier === "NEW_GRAD" || learnerPath.includes("new-grad") || learnerPath.includes("new_grad")) return "new_grad";
  if (tier === "NP" || learnerPath.includes("cnple")) return "np";
  if (tier === "RN" || learnerPath.includes("nclex-rn")) return "rn";
  if (tier === "RPN" || tier === "LVN_LPN" || learnerPath.includes("rex-pn") || learnerPath.includes("pn")) return "rpn";
  if (alliedCareer.includes("respiratory") || alliedCareer === "rt" || learnerPath.includes("respiratory")) return "rt";
  if (tier === "ALLIED") return "allied";
  return "rn";
}

export function mergeFeatureUsageSnapshot(...snapshots: readonly FeatureUsageSnapshot[]): FeatureUsageSnapshot {
  const merged: FeatureUsageSnapshot = {};
  for (const snapshot of snapshots) {
    for (const [key, value] of Object.entries(snapshot) as Array<[FeatureDiscoveryKey, FeatureUsageMetric | undefined]>) {
      if (!value) continue;
      const existing = merged[key] ?? ZERO_USAGE;
      merged[key] = {
        launches: existing.launches + value.launches,
        completions: existing.completions + value.completions,
        itemsCompleted: existing.itemsCompleted + value.itemsCompleted,
        lastUsedAt: latestIso(existing.lastUsedAt, value.lastUsedAt),
      };
    }
  }
  return merged;
}

export function usageMetric(metric: Partial<FeatureUsageMetric> | number | boolean | null | undefined): FeatureUsageMetric {
  if (typeof metric === "number") {
    const count = Math.max(0, Math.floor(metric));
    return { launches: count > 0 ? 1 : 0, completions: count, itemsCompleted: count, lastUsedAt: null };
  }
  if (typeof metric === "boolean") {
    return { launches: metric ? 1 : 0, completions: metric ? 1 : 0, itemsCompleted: metric ? 1 : 0, lastUsedAt: null };
  }
  if (!metric) return ZERO_USAGE;
  const launches = Math.max(0, Math.floor(metric.launches ?? 0));
  const completions = Math.max(0, Math.floor(metric.completions ?? 0));
  const itemsCompleted = Math.max(0, Math.floor(metric.itemsCompleted ?? 0));
  return {
    launches,
    completions,
    itemsCompleted,
    lastUsedAt: metric.lastUsedAt ?? null,
  };
}

export function buildFeatureUsageSnapshot(input: {
  questionsAnswered?: number | null;
  practiceSessions?: number | null;
  flashcardsReviewed?: number | null;
  lessonsCompleted?: number | null;
  catSessions?: number | null;
  readinessScoreAvailable?: boolean | null;
  studyPlanConfigured?: boolean | null;
  analyticsAvailable?: boolean | null;
  progressReportAvailable?: boolean | null;
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
  };
}

export function buildFeatureValueProfile(input: {
  pathway: FeatureDiscoveryPathway;
  usage?: FeatureUsageSnapshot;
  hasBaseAccess?: boolean;
  hasAdvancedEcgEntitlement?: boolean;
  weakTopics?: readonly string[];
}): FeatureValueProfile {
  const usage = input.usage ?? {};
  const hasBaseAccess = input.hasBaseAccess ?? true;
  const items = FEATURE_DISCOVERY_CATALOG.map((item): FeatureValueItem => {
    let availabilityForLearner = item.availability[input.pathway] ?? "not_available";
    if (item.key === "advanced_ecg" && availabilityForLearner === "upgrade" && input.hasAdvancedEcgEntitlement) {
      availabilityForLearner = "included";
    }
    if (!hasBaseAccess && availabilityForLearner === "included") {
      availabilityForLearner = "upgrade";
    }
    const metric = usageMetric(usage[item.key]);
    return {
      ...item,
      availabilityForLearner,
      used: metric.launches > 0 || metric.completions > 0 || metric.itemsCompleted > 0,
      usage: metric,
    };
  });

  const included = items.filter((item) => item.availabilityForLearner === "included");
  const used = included.filter((item) => item.used);
  const notYetUsed = included.filter((item) => !item.used);
  const upgrades = items.filter((item) => item.availabilityForLearner === "upgrade");
  const utilizationScore = included.length > 0 ? Math.round((used.length / included.length) * 100) : 0;

  return {
    pathway: input.pathway,
    utilizationScore,
    includedCount: included.length,
    usedIncludedCount: used.length,
    included,
    used,
    notYetUsed,
    upgrades,
    prompts: buildDiscoveryPrompts({
      notYetUsed,
      upgrades,
      used,
      weakTopics: input.weakTopics ?? [],
    }),
  };
}

export type FeatureImpactAnalyticsRow = {
  featureKey: FeatureDiscoveryKey;
  eligibleLearners: number;
  adoptedLearners: number;
  retainedLearners: number;
  upgradedLearners: number;
  readinessGainPct: number | null;
};

export type FeatureImpactSummary = {
  adoptionRows: Array<FeatureImpactAnalyticsRow & { adoptionRate: number; retentionContribution: number; upgradeContribution: number }>;
  unusedFeatureRate: number;
  topAdoptionDrivers: FeatureDiscoveryKey[];
  topUpgradeDrivers: FeatureDiscoveryKey[];
  topRetentionDrivers: FeatureDiscoveryKey[];
};

export function buildFeatureImpactSummary(rows: readonly FeatureImpactAnalyticsRow[]): FeatureImpactSummary {
  const adoptionRows = rows.map((row) => {
    const adoptionRate = pct(row.adoptedLearners, row.eligibleLearners);
    const retentionContribution = pct(row.retainedLearners, Math.max(row.adoptedLearners, 1));
    const upgradeContribution = pct(row.upgradedLearners, Math.max(row.adoptedLearners, 1));
    return { ...row, adoptionRate, retentionContribution, upgradeContribution };
  });
  const totalEligible = rows.reduce((sum, row) => sum + row.eligibleLearners, 0);
  const totalAdopted = rows.reduce((sum, row) => sum + row.adoptedLearners, 0);
  return {
    adoptionRows,
    unusedFeatureRate: totalEligible > 0 ? Math.round(((totalEligible - totalAdopted) / totalEligible) * 100) : 0,
    topAdoptionDrivers: [...adoptionRows].sort((a, b) => b.adoptionRate - a.adoptionRate).slice(0, 5).map((row) => row.featureKey),
    topUpgradeDrivers: [...adoptionRows].sort((a, b) => b.upgradeContribution - a.upgradeContribution).slice(0, 5).map((row) => row.featureKey),
    topRetentionDrivers: [...adoptionRows].sort((a, b) => b.retentionContribution - a.retentionContribution).slice(0, 5).map((row) => row.featureKey),
  };
}

function buildDiscoveryPrompts(input: {
  notYetUsed: readonly FeatureValueItem[];
  upgrades: readonly FeatureValueItem[];
  used: readonly FeatureValueItem[];
  weakTopics: readonly string[];
}): DiscoveryPrompt[] {
  const prompts: DiscoveryPrompt[] = [];
  const weak = input.weakTopics.join(" ").toLowerCase();
  const notUsed = new Set(input.notYetUsed.map((item) => item.key));

  if (notUsed.has("ecg_core")) {
    prompts.push(promptFor("ecg_core", "You have not tried ECG yet.", "Build rhythm recognition with guided ECG fundamentals.", "Explore ECG Interpretation", "try_next"));
  }
  if (notUsed.has("pharmacology") && /pharm|med|drug|insulin|anticoagulant|cardiac/.test(weak)) {
    prompts.push(promptFor("pharmacology", "Your weak areas include medication-linked topics.", "Open pharmacology review to connect mechanisms, monitoring, and patient teaching.", "Open Pharmacology Review", "weak_area"));
  }
  if (notUsed.has("labs") && /lab|electrolyte|renal|sepsis|heart failure|cardiac|dka|kidney/.test(weak)) {
    prompts.push(promptFor("labs", "Your weak areas connect to lab interpretation.", "Use the labs workstation to practice trends, urgency, and escalation decisions.", "Open Clinical Labs", "weak_area"));
  }
  if (notUsed.has("simulations") && /deteriorat|priority|unstable|safety|respiratory|sepsis|shock/.test(weak)) {
    prompts.push(promptFor("simulations", "Turn weak areas into bedside decisions.", "Simulations help you practice what to do next when a patient changes.", "Try A Simulation", "weak_area"));
  }
  if (notUsed.has("flashcards") && input.used.some((item) => item.key === "questions")) {
    prompts.push(promptFor("flashcards", "Turn practice into retention.", "You have used questions. Add flashcards to reinforce the concepts you are seeing in rationales.", "Try Flashcards", "try_next"));
  }

  const advancedEcg = input.upgrades.find((item) => item.key === "advanced_ecg");
  if (advancedEcg) {
    prompts.push({
      id: "upgrade-advanced-ecg",
      title: input.used.some((item) => item.key === "ecg_core")
        ? "You completed Core ECG. Advanced ECG is available."
        : "Advanced ECG is available as an add-on.",
      body: "Unlock telemetry mastery, STEMI localization, electrolyte ECG changes, and complex rhythm practice.",
      href: advancedEcg.upgradeHref ?? advancedEcg.href,
      cta: "View Advanced ECG",
      featureKey: "advanced_ecg",
      tone: "upgrade",
    });
  }
  if (notUsed.has("clinical_skills")) {
    prompts.push(promptFor("clinical_skills", "Clinical Skills are included in your membership.", "Practice procedures, safety checkpoints, documentation, and escalation criteria.", "Open Clinical Skills", "try_next"));
  }
  if (notUsed.has("ngn") && input.used.some((item) => item.key === "questions")) {
    prompts.push(promptFor("ngn", "You have used questions. Try NGN formats next.", "Bowtie and matrix questions make clinical judgment visible.", "Try NGN Questions", "try_next"));
  }
  if (notUsed.has("study_plans")) {
    prompts.push(promptFor("study_plans", "Let NurseNest organize the next study block.", "A study plan reduces decision fatigue and connects weak areas to activities.", "Build a Study Plan", "try_next"));
  }

  return prompts.slice(0, 6);
}

function promptFor(
  featureKey: FeatureDiscoveryKey,
  title: string,
  body: string,
  cta: string,
  tone: DiscoveryPrompt["tone"],
): DiscoveryPrompt {
  const feature = FEATURE_DISCOVERY_CATALOG.find((item) => item.key === featureKey);
  return {
    id: `discover-${featureKey}`,
    title,
    body,
    href: feature?.href ?? "/app",
    cta,
    featureKey,
    tone,
  };
}

function latestIso(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

function pct(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
}
