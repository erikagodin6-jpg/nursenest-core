export type AcademyProductionGateId =
  | "academic_spine"
  | "content_depth"
  | "competency_graph"
  | "adaptive_remediation"
  | "premium_ux"
  | "theme_parity"
  | "entitlements"
  | "seo_indexing"
  | "simulation_readiness"
  | "qa_release";

export type AcademyProductionGate = {
  id: AcademyProductionGateId;
  title: string;
  requiredForPublicLaunch: boolean;
  acceptanceCriteria: string[];
};

export type AcademyAestheticContract = {
  surface: string;
  requiredTokens: string[];
  requiredLayouts: string[];
  forbiddenPatterns: string[];
  themeCoverage: string[];
};

export type AcademyProductionReadinessPlan = {
  title: string;
  status: "architecture" | "implementation" | "qa" | "production_ready";
  gates: AcademyProductionGate[];
  aestheticContracts: AcademyAestheticContract[];
  launchBlockers: string[];
};

export const ACADEMY_PRODUCTION_GATES: AcademyProductionGate[] = [
  {
    id: "academic_spine",
    title: "University-style academic spine",
    requiredForPublicLaunch: true,
    acceptanceCriteria: [
      "Academy is structured as semesters, units, modules, lessons, assessments, and remediation.",
      "Every lesson maps to at least one competency.",
      "Every academy declares downstream and cross-academy relationships.",
    ],
  },
  {
    id: "content_depth",
    title: "Deep authored content",
    requiredForPublicLaunch: true,
    acceptanceCriteria: [
      "No lesson launches as a title-only or outline-only page.",
      "Every lesson includes overview, objectives, teaching, clinical relevance, traps, practice, flashcards, assessment, and remediation.",
      "Rationales explain correct answers, incorrect options, mechanism, clinical implication, and exam trap.",
    ],
  },
  {
    id: "competency_graph",
    title: "Competency graph and mastery thresholds",
    requiredForPublicLaunch: true,
    acceptanceCriteria: [
      "Every lesson, flashcard deck, question pool, diagnostic, and simulation maps to competencies.",
      "Mastery thresholds are explicit and validated.",
      "Weak competency clusters can route learners to remediation.",
    ],
  },
  {
    id: "adaptive_remediation",
    title: "Adaptive remediation and study routing",
    requiredForPublicLaunch: true,
    acceptanceCriteria: [
      "Diagnostic misses route to specific lessons and drills.",
      "Repeated misses escalate from foundation review to applied drills.",
      "Study planner can prioritize weak domains and upcoming exam date.",
    ],
  },
  {
    id: "premium_ux",
    title: "Premium NurseNest academy UX",
    requiredForPublicLaunch: true,
    acceptanceCriteria: [
      "Academy surfaces use premium cards, meaningful hierarchy, high whitespace discipline, and clear progression cues.",
      "No generic quiz-bank visual treatment is allowed.",
      "Mobile dashboards remain scannable without horizontal overflow.",
    ],
  },
  {
    id: "theme_parity",
    title: "Theme parity and token compliance",
    requiredForPublicLaunch: true,
    acceptanceCriteria: [
      "Ocean remains source-of-truth layout.",
      "Blossom, Midnight, Aurora, and Sunset render as token variations, not separate layouts.",
      "Academy components use semantic/theme tokens and do not hardcode brand colors.",
    ],
  },
  {
    id: "entitlements",
    title: "Server-side entitlement and premium gating",
    requiredForPublicLaunch: true,
    acceptanceCriteria: [
      "Free funnel, paid drills, simulations, readiness scoring, and analytics are server-gated.",
      "No premium state is enforced only in client components.",
      "Pricing and checkout availability are verified before public CTAs appear.",
    ],
  },
  {
    id: "seo_indexing",
    title: "SEO and indexing policy",
    requiredForPublicLaunch: true,
    acceptanceCriteria: [
      "Hidden/internal pathways remain noindex and excluded from sitemaps.",
      "Public launch requires approved metadata, canonical URLs, sitemap inclusion, and internal-link strategy.",
      "Trademark/compliance copy is reviewed before HESI/TEAS public indexing.",
    ],
  },
  {
    id: "simulation_readiness",
    title: "Simulation and timed-exam readiness",
    requiredForPublicLaunch: false,
    acceptanceCriteria: [
      "Timed section drills preserve section pacing and post-attempt review.",
      "Full-length simulations store attempt summaries and domain scores.",
      "Future CAT/LOFT behavior is enabled only after pool thresholds and scoring contracts pass.",
    ],
  },
  {
    id: "qa_release",
    title: "QA, visual, accessibility, and release gates",
    requiredForPublicLaunch: true,
    acceptanceCriteria: [
      "Contract tests pass for curriculum, admissions, entitlements, SEO, and theme surfaces.",
      "Playwright mobile and desktop smoke tests pass for academy routes.",
      "Visual QA captures are reviewed for supported themes before public launch.",
    ],
  },
];

export const ACADEMY_AESTHETIC_CONTRACTS: AcademyAestheticContract[] = [
  {
    surface: "marketing academy hub",
    requiredTokens: ["--semantic-brand", "--semantic-surface", "--semantic-border", "--theme-primary", "--logo-primary"],
    requiredLayouts: ["marketing-row4 header compatibility", "premium hero", "domain cards", "free-vs-premium comparison", "readiness preview"],
    forbiddenPatterns: ["hardcoded hex brand colors", "generic white quiz-bank grid", "horizontal mobile overflow", "duplicate sticky nav bars"],
    themeCoverage: ["Ocean", "Blossom", "Midnight", "Aurora", "Sunset"],
  },
  {
    surface: "learner academy dashboard",
    requiredTokens: ["--semantic-brand", "--semantic-surface", "--semantic-muted", "--semantic-border"],
    requiredLayouts: ["readiness card", "daily plan", "weak domains", "continue learning", "timed drill entry"],
    forbiddenPatterns: ["client-only premium gates", "dense table-only progress", "unbounded chart height", "non-token progress colors"],
    themeCoverage: ["Ocean", "Blossom", "Midnight", "Aurora", "Sunset"],
  },
  {
    surface: "lesson experience",
    requiredTokens: ["--semantic-brand", "--semantic-surface", "--semantic-border", "--semantic-success", "--semantic-warning"],
    requiredLayouts: ["objective block", "deep teaching block", "clinical relevance block", "exam trap block", "mini assessment", "remediation CTA"],
    forbiddenPatterns: ["markdown-only wall of text", "answer reveal without rationale", "missing incorrect-option teaching", "AI-looking generic filler"],
    themeCoverage: ["Ocean", "Blossom", "Midnight", "Aurora", "Sunset"],
  },
];

export const ACADEMY_PRODUCTION_READINESS_PLAN: AcademyProductionReadinessPlan = {
  title: "NurseNest Academy Production Readiness Plan",
  status: "implementation",
  gates: ACADEMY_PRODUCTION_GATES,
  aestheticContracts: ACADEMY_AESTHETIC_CONTRACTS,
  launchBlockers: [
    "Full authored lessons are not yet populated for every HESI A2 and ATI TEAS blueprint.",
    "Timed simulations and readiness analytics are not yet production implemented.",
    "Server-side admissions entitlement gates need final pricing/SKU policy.",
    "HESI/TEAS trademark and compliance copy must be reviewed before public indexing.",
    "Visual QA must confirm academy surfaces across Ocean, Blossom, Midnight, Aurora, and Sunset.",
  ],
};

export function requiredAcademyProductionGateIds(): AcademyProductionGateId[] {
  return ACADEMY_PRODUCTION_GATES.filter((gate) => gate.requiredForPublicLaunch).map((gate) => gate.id);
}

export function validateAcademyProductionReadinessPlan(
  plan: AcademyProductionReadinessPlan = ACADEMY_PRODUCTION_READINESS_PLAN,
): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const gateIds = new Set<AcademyProductionGateId>();

  for (const gate of plan.gates) {
    if (gateIds.has(gate.id)) errors.push(`Duplicate gate id: ${gate.id}`);
    gateIds.add(gate.id);
    if (gate.acceptanceCriteria.length < 3) errors.push(`${gate.id} needs at least three acceptance criteria`);
  }

  for (const requiredGateId of requiredAcademyProductionGateIds()) {
    if (!gateIds.has(requiredGateId)) errors.push(`Missing required production gate: ${requiredGateId}`);
  }

  for (const contract of plan.aestheticContracts) {
    if (contract.requiredTokens.length < 3) errors.push(`${contract.surface} needs token requirements`);
    if (!contract.themeCoverage.includes("Ocean")) errors.push(`${contract.surface} must include Ocean source-of-truth coverage`);
    if (!contract.themeCoverage.includes("Midnight")) errors.push(`${contract.surface} must include dark-theme coverage`);
    if (contract.forbiddenPatterns.length < 3) errors.push(`${contract.surface} needs explicit forbidden anti-patterns`);
  }

  if (plan.status === "production_ready" && plan.launchBlockers.length > 0) {
    errors.push("Production-ready plan cannot have launch blockers");
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}
