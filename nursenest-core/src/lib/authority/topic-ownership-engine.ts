export type TopicOwnershipAsset =
  | "authorityArticle"
  | "lessons"
  | "flashcards"
  | "questions"
  | "sata"
  | "matrix"
  | "bowtie"
  | "caseStudies"
  | "simulations"
  | "clinicalSkills"
  | "labs"
  | "pharmacology"
  | "carePlans"
  | "conceptMaps"
  | "clinicalReasoning"
  | "studyGuides"
  | "careerRelevance"
  | "placementRelevance"
  | "certificationRelevance";

export type TopicOwnershipProfession = "RN" | "RPN" | "NP" | "RT" | "Paramedic" | "OT" | "PT" | "MLT" | "PSW";

export type TopicOwnershipCertification =
  | "NCLEX"
  | "REx-PN"
  | "CNPLE"
  | "FNP"
  | "PMHNP"
  | "AGPCNP"
  | "WHNP"
  | "PNP-PC"
  | "TEAS"
  | "HESI"
  | "CASPER";

export type CompetitorName = "UWorld" | "Archer" | "Lecturio" | "Amboss" | "Osmosis";

export type TopicOwnershipAssetCoverage = Partial<Record<TopicOwnershipAsset, number>>;

export type TopicOwnershipInput = {
  topic: string;
  system: "Cardiovascular" | "Respiratory" | "Endocrine" | "Emergency" | "Renal" | "Neurology" | "Infectious Disease" | "Trauma" | "Labs" | "Professional Practice";
  professionCoverage: Partial<Record<TopicOwnershipProfession, TopicOwnershipAssetCoverage>>;
  certificationCoverage?: Partial<Record<TopicOwnershipCertification, TopicOwnershipAssetCoverage>>;
  trafficPotential: number;
  revenuePotential: number;
  conversionPotential: number;
  competitorScores?: Partial<Record<CompetitorName, number>>;
};

export type TopicOwnershipScore = {
  topic: string;
  score: number;
  status: "not_owned" | "emerging" | "developing" | "strong" | "owned";
  strongestProfession: TopicOwnershipProfession | null;
  weakestProfession: TopicOwnershipProfession | null;
  professionScores: Record<TopicOwnershipProfession, number>;
  certificationScores: Partial<Record<TopicOwnershipCertification, number>>;
  missingAssets: TopicOwnershipAsset[];
  missingAlliedConnections: TopicOwnershipProfession[];
  internalLinkGap: boolean;
};

export type TopicBuildPriority = {
  topic: string;
  priorityScore: number;
  trafficPotential: number;
  revenuePotential: number;
  conversionPotential: number;
  ownershipGap: number;
  buildPriority: "highest" | "high" | "medium" | "low";
  recommendedWork: string[];
};

export type CompetitorOwnershipComparison = {
  topic: string;
  nurseNestScore: number;
  competitorLeader: CompetitorName | "NurseNest" | "Nobody";
  competitorLeaderScore: number;
  marketPosition: "nursenest_leads" | "competitor_leads" | "nobody_owns" | "close_race";
  opportunity: string;
};

export type OwnershipDashboard = {
  rows: TopicOwnershipScore[];
  averageOwnership: number;
  ownedTopics: number;
  strongestTopics: string[];
  weakestTopics: string[];
  top10QuarterlyBuilds: TopicBuildPriority[];
  top50AnnualBuilds: TopicBuildPriority[];
};

export const TOPIC_OWNERSHIP_REQUIREMENTS: readonly TopicOwnershipAsset[] = [
  "authorityArticle",
  "lessons",
  "flashcards",
  "questions",
  "sata",
  "matrix",
  "bowtie",
  "caseStudies",
  "simulations",
  "clinicalSkills",
  "labs",
  "pharmacology",
  "carePlans",
  "conceptMaps",
  "clinicalReasoning",
  "studyGuides",
  "careerRelevance",
  "placementRelevance",
  "certificationRelevance",
] as const;

const assetWeights: Record<TopicOwnershipAsset, number> = {
  authorityArticle: 8,
  lessons: 7,
  flashcards: 6,
  questions: 8,
  sata: 5,
  matrix: 5,
  bowtie: 5,
  caseStudies: 6,
  simulations: 7,
  clinicalSkills: 5,
  labs: 5,
  pharmacology: 5,
  carePlans: 5,
  conceptMaps: 4,
  clinicalReasoning: 7,
  studyGuides: 4,
  careerRelevance: 2,
  placementRelevance: 3,
  certificationRelevance: 3,
};

export const TOPIC_OWNERSHIP_BASELINE: readonly TopicOwnershipInput[] = [
  topic("Heart Failure", "Cardiovascular", { RN: 82, RPN: 68, NP: 74, RT: 44, Paramedic: 36, OT: 24, PT: 22, MLT: 32, PSW: 28 }, 92, 88, 86, { UWorld: 78, Archer: 61, Lecturio: 69, Amboss: 75, Osmosis: 72 }),
  topic("COPD", "Respiratory", { RN: 72, RPN: 58, NP: 66, RT: 61, Paramedic: 34, OT: 30, PT: 28, MLT: 26, PSW: 22 }, 90, 84, 80, { UWorld: 75, Archer: 57, Lecturio: 68, Amboss: 72, Osmosis: 74 }),
  topic("Diabetes", "Endocrine", { RN: 84, RPN: 70, NP: 79, RT: 20, Paramedic: 28, OT: 24, PT: 30, MLT: 45, PSW: 38 }, 94, 90, 88, { UWorld: 82, Archer: 63, Lecturio: 73, Amboss: 80, Osmosis: 76 }),
  topic("DKA", "Endocrine", { RN: 76, RPN: 52, NP: 70, RT: 36, Paramedic: 40, OT: 10, PT: 10, MLT: 46, PSW: 12 }, 88, 82, 82, { UWorld: 80, Archer: 58, Lecturio: 69, Amboss: 78, Osmosis: 70 }),
  topic("Sepsis", "Infectious Disease", { RN: 58, RPN: 42, NP: 55, RT: 32, Paramedic: 30, OT: 10, PT: 12, MLT: 34, PSW: 14 }, 95, 92, 90, { UWorld: 84, Archer: 62, Lecturio: 72, Amboss: 82, Osmosis: 76 }),
  topic("Stroke", "Neurology", { RN: 64, RPN: 48, NP: 58, RT: 18, Paramedic: 42, OT: 40, PT: 44, MLT: 18, PSW: 28 }, 90, 86, 84, { UWorld: 80, Archer: 60, Lecturio: 70, Amboss: 76, Osmosis: 78 }),
  topic("AFib", "Cardiovascular", { RN: 62, RPN: 44, NP: 56, RT: 20, Paramedic: 38, OT: 8, PT: 8, MLT: 16, PSW: 10 }, 86, 82, 80, { UWorld: 78, Archer: 56, Lecturio: 66, Amboss: 77, Osmosis: 70 }),
  topic("AKI", "Renal", { RN: 54, RPN: 38, NP: 52, RT: 12, Paramedic: 14, OT: 8, PT: 10, MLT: 48, PSW: 8 }, 82, 76, 72, { UWorld: 72, Archer: 50, Lecturio: 64, Amboss: 74, Osmosis: 63 }),
  topic("CKD", "Renal", { RN: 50, RPN: 36, NP: 54, RT: 10, Paramedic: 8, OT: 18, PT: 20, MLT: 42, PSW: 22 }, 78, 72, 68, { UWorld: 68, Archer: 46, Lecturio: 60, Amboss: 70, Osmosis: 64 }),
  topic("Pneumonia", "Respiratory", { RN: 60, RPN: 46, NP: 55, RT: 42, Paramedic: 28, OT: 12, PT: 18, MLT: 20, PSW: 16 }, 84, 76, 74, { UWorld: 74, Archer: 54, Lecturio: 66, Amboss: 70, Osmosis: 73 }),
  topic("Ventilator Management", "Respiratory", { RN: 28, RPN: 12, NP: 36, RT: 54, Paramedic: 18, OT: 4, PT: 8, MLT: 4, PSW: 2 }, 80, 78, 70, { UWorld: 42, Archer: 30, Lecturio: 58, Amboss: 64, Osmosis: 60 }),
  topic("ABG Interpretation", "Labs", { RN: 36, RPN: 24, NP: 42, RT: 58, Paramedic: 26, OT: 4, PT: 8, MLT: 50, PSW: 2 }, 86, 80, 76, { UWorld: 50, Archer: 36, Lecturio: 60, Amboss: 68, Osmosis: 62 }),
  topic("Trauma Assessment", "Trauma", { RN: 24, RPN: 14, NP: 22, RT: 20, Paramedic: 52, OT: 10, PT: 16, MLT: 4, PSW: 4 }, 82, 78, 72, { UWorld: 40, Archer: 24, Lecturio: 48, Amboss: 56, Osmosis: 52 }),
] as const;

function assetCoverageFromScore(score: number): TopicOwnershipAssetCoverage {
  const coverage: TopicOwnershipAssetCoverage = {};
  for (const asset of TOPIC_OWNERSHIP_REQUIREMENTS) {
    const importanceBoost = assetWeights[asset] >= 7 ? 6 : assetWeights[asset] >= 5 ? 2 : -4;
    coverage[asset] = Math.max(0, Math.min(100, score + importanceBoost));
  }
  return coverage;
}

function topic(
  topicName: string,
  system: TopicOwnershipInput["system"],
  professionScores: Partial<Record<TopicOwnershipProfession, number>>,
  trafficPotential: number,
  revenuePotential: number,
  conversionPotential: number,
  competitorScores: Partial<Record<CompetitorName, number>>,
): TopicOwnershipInput {
  const professionCoverage = Object.fromEntries(
    Object.entries(professionScores).map(([profession, score]) => [profession, assetCoverageFromScore(score)]),
  ) as Partial<Record<TopicOwnershipProfession, TopicOwnershipAssetCoverage>>;
  return {
    topic: topicName,
    system,
    professionCoverage,
    certificationCoverage: {
      NCLEX: assetCoverageFromScore(professionScores.RN ?? 0),
      "REx-PN": assetCoverageFromScore(professionScores.RPN ?? 0),
      CNPLE: assetCoverageFromScore(professionScores.NP ?? 0),
      FNP: assetCoverageFromScore(professionScores.NP ?? 0),
      HESI: assetCoverageFromScore(Math.max(0, (professionScores.RN ?? 0) - 18)),
      TEAS: assetCoverageFromScore(Math.max(0, (professionScores.RN ?? 0) - 20)),
      CASPER: assetCoverageFromScore(Math.max(0, (professionScores.RN ?? 0) - 28)),
    },
    trafficPotential,
    revenuePotential,
    conversionPotential,
    competitorScores,
  };
}

function weightedAssetScore(coverage: TopicOwnershipAssetCoverage): number {
  const totalWeight = TOPIC_OWNERSHIP_REQUIREMENTS.reduce((sum, asset) => sum + assetWeights[asset], 0);
  const weighted = TOPIC_OWNERSHIP_REQUIREMENTS.reduce((sum, asset) => sum + (coverage[asset] ?? 0) * assetWeights[asset], 0);
  return Math.round(weighted / totalWeight);
}

function status(score: number): TopicOwnershipScore["status"] {
  if (score >= 90) return "owned";
  if (score >= 75) return "strong";
  if (score >= 55) return "developing";
  if (score >= 30) return "emerging";
  return "not_owned";
}

function missingAssetsForTopic(input: TopicOwnershipInput): TopicOwnershipAsset[] {
  const bestCoverage = TOPIC_OWNERSHIP_REQUIREMENTS.map((asset) => ({
    asset,
    value: Math.max(...Object.values(input.professionCoverage).map((coverage) => coverage?.[asset] ?? 0)),
  }));
  return bestCoverage.filter((item) => item.value < 70).map((item) => item.asset);
}

export function scoreTopicOwnership(input: TopicOwnershipInput): TopicOwnershipScore {
  const professionScores = Object.fromEntries(
    (["RN", "RPN", "NP", "RT", "Paramedic", "OT", "PT", "MLT", "PSW"] as const).map((profession) => [
      profession,
      weightedAssetScore(input.professionCoverage[profession] ?? {}),
    ]),
  ) as Record<TopicOwnershipProfession, number>;
  const overall = Math.round(Object.values(professionScores).reduce((sum, value) => sum + value, 0) / Object.values(professionScores).length);
  const strongestProfession = Object.entries(professionScores).sort((a, b) => b[1] - a[1])[0]?.[0] as TopicOwnershipProfession | undefined;
  const weakestProfession = Object.entries(professionScores).sort((a, b) => a[1] - b[1])[0]?.[0] as TopicOwnershipProfession | undefined;
  const certificationScores = Object.fromEntries(
    Object.entries(input.certificationCoverage ?? {}).map(([certification, coverage]) => [certification, weightedAssetScore(coverage)]),
  ) as Partial<Record<TopicOwnershipCertification, number>>;
  const missingAlliedConnections = (["RT", "Paramedic", "OT", "PT", "MLT", "PSW"] as const).filter((profession) => professionScores[profession] < 50);

  return {
    topic: input.topic,
    score: overall,
    status: status(overall),
    strongestProfession: strongestProfession ?? null,
    weakestProfession: weakestProfession ?? null,
    professionScores,
    certificationScores,
    missingAssets: missingAssetsForTopic(input),
    missingAlliedConnections,
    internalLinkGap: overall < 85 || missingAlliedConnections.length > 0,
  };
}

export function buildTopicGapAnalysis(score: TopicOwnershipScore): string[] {
  const labels: Record<TopicOwnershipAsset, string> = {
    authorityArticle: "Missing SEO Authority Page",
    lessons: "Missing Lessons",
    flashcards: "Missing Flashcards",
    questions: "Missing Questions",
    sata: "Missing SATA Questions",
    matrix: "Missing Matrix Questions",
    bowtie: "Missing Bowtie Questions",
    caseStudies: "Missing Case Studies",
    simulations: "Missing Simulations",
    clinicalSkills: "Missing Skills",
    labs: "Missing Labs",
    pharmacology: "Missing Pharmacology",
    carePlans: "Missing Care Plans",
    conceptMaps: "Missing Concept Maps",
    clinicalReasoning: "Missing Clinical Reasoning",
    studyGuides: "Missing Study Guides",
    careerRelevance: "Missing Career Relevance",
    placementRelevance: "Missing Placement Relevance",
    certificationRelevance: "Missing Certification Relevance",
  };
  return [
    ...score.missingAssets.map((asset) => labels[asset]),
    score.internalLinkGap ? "Missing Internal Links" : null,
    score.missingAlliedConnections.length ? "Missing Allied Health Connections" : null,
  ].filter(Boolean) as string[];
}

export function compareCompetitorOwnership(input: TopicOwnershipInput): CompetitorOwnershipComparison {
  const nurseNestScore = scoreTopicOwnership(input).score;
  const competitors = Object.entries(input.competitorScores ?? {}) as Array<[CompetitorName, number]>;
  const leader = competitors.sort((a, b) => b[1] - a[1])[0];
  const leaderName = !leader || nurseNestScore > leader[1] ? "NurseNest" : leader[0];
  const leaderScore = !leader || nurseNestScore > leader[1] ? nurseNestScore : leader[1];
  const marketPosition =
    nurseNestScore >= 75 && leaderName === "NurseNest"
      ? "nursenest_leads"
      : leaderScore < 70
        ? "nobody_owns"
        : Math.abs(nurseNestScore - leaderScore) <= 5
          ? "close_race"
          : "competitor_leads";
  return {
    topic: input.topic,
    nurseNestScore,
    competitorLeader: leaderName,
    competitorLeaderScore: leaderScore,
    marketPosition,
    opportunity:
      marketPosition === "nobody_owns"
        ? "White-space topic: build a complete cluster before competitors consolidate authority."
        : marketPosition === "competitor_leads"
          ? "Close the ownership gap with simulations, NGN formats, allied links, and authority content."
          : marketPosition === "close_race"
            ? "One focused content sprint could shift category leadership."
            : "Defend leadership with refreshes, internal links, and flagship interactive assets.",
  };
}

export function prioritizeTopicBuilds(inputs: readonly TopicOwnershipInput[] = TOPIC_OWNERSHIP_BASELINE): TopicBuildPriority[] {
  return inputs
    .map((input) => {
      const score = scoreTopicOwnership(input);
      const ownershipGap = 100 - score.score;
      const priorityScore = Math.round(ownershipGap * 0.35 + input.trafficPotential * 0.22 + input.revenuePotential * 0.22 + input.conversionPotential * 0.21);
      const gaps = buildTopicGapAnalysis(score);
      return {
        topic: input.topic,
        priorityScore,
        trafficPotential: input.trafficPotential,
        revenuePotential: input.revenuePotential,
        conversionPotential: input.conversionPotential,
        ownershipGap,
        buildPriority: priorityScore >= 82 ? "highest" : priorityScore >= 72 ? "high" : priorityScore >= 58 ? "medium" : "low",
        recommendedWork: gaps.slice(0, 6),
      } satisfies TopicBuildPriority;
    })
    .sort((a, b) => b.priorityScore - a.priorityScore || b.revenuePotential - a.revenuePotential);
}

export function buildOwnershipDashboard(inputs: readonly TopicOwnershipInput[] = TOPIC_OWNERSHIP_BASELINE): OwnershipDashboard {
  const rows = inputs.map(scoreTopicOwnership).sort((a, b) => b.score - a.score);
  const averageOwnership = Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length);
  const priorities = prioritizeTopicBuilds(inputs);
  return {
    rows,
    averageOwnership,
    ownedTopics: rows.filter((row) => row.status === "owned").length,
    strongestTopics: rows.slice(0, 5).map((row) => row.topic),
    weakestTopics: [...rows].sort((a, b) => a.score - b.score).slice(0, 5).map((row) => row.topic),
    top10QuarterlyBuilds: priorities.slice(0, 10),
    top50AnnualBuilds: priorities.slice(0, 50),
  };
}

export function buildProfessionOwnershipMap(inputs: readonly TopicOwnershipInput[] = TOPIC_OWNERSHIP_BASELINE): Record<TopicOwnershipProfession, Array<{ topic: string; score: number }>> {
  const map = Object.fromEntries((["RN", "RPN", "NP", "RT", "Paramedic", "OT", "PT", "MLT", "PSW"] as const).map((profession) => [profession, []])) as Record<TopicOwnershipProfession, Array<{ topic: string; score: number }>>;
  for (const input of inputs) {
    const score = scoreTopicOwnership(input);
    for (const profession of Object.keys(map) as TopicOwnershipProfession[]) {
      map[profession].push({ topic: input.topic, score: score.professionScores[profession] });
    }
  }
  for (const profession of Object.keys(map) as TopicOwnershipProfession[]) {
    map[profession].sort((a, b) => b.score - a.score);
  }
  return map;
}

export function buildCertificationOwnershipMap(inputs: readonly TopicOwnershipInput[] = TOPIC_OWNERSHIP_BASELINE): Record<TopicOwnershipCertification, Array<{ topic: string; score: number }>> {
  const certifications: TopicOwnershipCertification[] = ["NCLEX", "REx-PN", "CNPLE", "FNP", "PMHNP", "AGPCNP", "WHNP", "PNP-PC", "TEAS", "HESI", "CASPER"];
  const map = Object.fromEntries(certifications.map((certification) => [certification, []])) as Record<TopicOwnershipCertification, Array<{ topic: string; score: number }>>;
  for (const input of inputs) {
    const score = scoreTopicOwnership(input);
    for (const certification of certifications) {
      map[certification].push({ topic: input.topic, score: score.certificationScores[certification] ?? 0 });
    }
  }
  for (const certification of certifications) {
    map[certification].sort((a, b) => b.score - a.score);
  }
  return map;
}

