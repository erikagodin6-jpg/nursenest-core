export type PhaseStatus = "completed" | "in-progress" | "queued" | "blocked";

export interface PhaseComponent {
  name: string;
  inventoryKey: string;
  type: "tier" | "exam" | "career" | "feature" | "language" | "country";
  targetQuestions: number;
  status: PhaseStatus;
  currentQuestions?: number;
}

export interface ExpansionPhase {
  id: number;
  title: string;
  description: string;
  status: PhaseStatus;
  startDate?: string;
  targetDate?: string;
  components: PhaseComponent[];
}

export const THIN_BANK_FLOOR = 1200;
export const FLAGSHIP_THRESHOLD = 2500;

export const GLOBAL_CONTENT_EXPANSION_ROADMAP: ExpansionPhase[] = [
  {
    id: 1,
    title: "Phase 1 — Core Nursing Tiers",
    description: "Build foundational nursing question banks for RPN/LVN, RN, and NP tiers with full mock exams, CAT-adaptive testing, and blueprint coverage.",
    status: "in-progress",
    startDate: "2025-06-01",
    targetDate: "2026-06-30",
    components: [
      { name: "RPN/LVN (NCLEX-PN / REx-PN)", inventoryKey: "rpn", type: "tier", targetQuestions: 10000, status: "in-progress" },
      { name: "RN (NCLEX-RN)", inventoryKey: "rn", type: "tier", targetQuestions: 15000, status: "in-progress" },
      { name: "NP (AANP / ANCC)", inventoryKey: "np", type: "tier", targetQuestions: 20000, status: "in-progress" },
      { name: "Pre-Nursing (HESI A2 / TEAS)", inventoryKey: "preNursing", type: "tier", targetQuestions: 2500, status: "completed" },
      { name: "Mock Exam Engine", inventoryKey: "_mock_engine", type: "feature", targetQuestions: 0, status: "completed" },
      { name: "CAT-Adaptive Testing", inventoryKey: "_cat_engine", type: "feature", targetQuestions: 0, status: "completed" },
    ],
  },
  {
    id: 1.5,
    title: "Phase 1B — NP Sub-Specialty Mass Expansion",
    description: "Expand NP question banks across 8 distinct exam pathways plus CNPLE: AANP-FNP, ANCC-FNP, AGPCNP, AGACNP, PMHNP, PNP, WHNP, ENP, and CNPLE. Each pathway has distinct clinical content and exam blueprints.",
    status: "in-progress",
    startDate: "2026-03-01",
    targetDate: "2026-06-30",
    components: [
      { name: "AANP FNP (Family NP)", inventoryKey: "np_fnp", type: "exam", targetQuestions: 3000, status: "in-progress" },
      { name: "ANCC FNP-BC (Family NP)", inventoryKey: "np_fnp", type: "exam", targetQuestions: 3000, status: "in-progress" },
      { name: "AGPCNP (Adult-Gero Primary Care)", inventoryKey: "np_agpcnp", type: "exam", targetQuestions: 2500, status: "in-progress" },
      { name: "AGACNP (Adult-Gero Acute Care)", inventoryKey: "np_agacnp", type: "exam", targetQuestions: 2500, status: "in-progress" },
      { name: "PMHNP (Psychiatric Mental Health)", inventoryKey: "np_pmhnp", type: "exam", targetQuestions: 3000, status: "in-progress" },
      { name: "PNP (Pediatric NP)", inventoryKey: "np_pnp", type: "exam", targetQuestions: 2000, status: "in-progress" },
      { name: "WHNP (Women's Health NP)", inventoryKey: "np_whnp", type: "exam", targetQuestions: 2000, status: "in-progress" },
      { name: "ENP (Emergency NP)", inventoryKey: "np_enp", type: "exam", targetQuestions: 1500, status: "in-progress" },
      { name: "CNPLE (Canadian NP)", inventoryKey: "np_cnpe", type: "exam", targetQuestions: 2000, status: "in-progress" },
      { name: "NGN-Style Content (≥35%)", inventoryKey: "_ngn_content", type: "feature", targetQuestions: 0, status: "in-progress" },
      { name: "Flashcard Pairing (1:1)", inventoryKey: "_flashcard_pairing", type: "feature", targetQuestions: 0, status: "in-progress" },
    ],
  },
  {
    id: 2,
    title: "Phase 2 — Allied Health Expansion",
    description: "Expand to 14+ allied health careers including respiratory therapy, paramedic, pharmacy tech, MLT, imaging, social work, and more.",
    status: "in-progress",
    startDate: "2026-01-01",
    targetDate: "2026-06-30",
    components: [
      { name: "Respiratory Therapy (RRT)", inventoryKey: "rrt", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "Paramedic (NREMT)", inventoryKey: "paramedic", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "Pharmacy Technician (PTCB)", inventoryKey: "pharmacyTech", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "Medical Lab Technologist (MLT)", inventoryKey: "mlt", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "Radiologic Technologist (ARRT)", inventoryKey: "imaging", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "OTA (COTA/OTA)", inventoryKey: "occupationalTherapyAssistant", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "PTA (Physical Therapy Asst)", inventoryKey: "physiotherapyAssistant", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "Social Worker (ASWB)", inventoryKey: "socialWorker", type: "career", targetQuestions: 2500, status: "completed" },
      { name: "Psychotherapist", inventoryKey: "psychotherapist", type: "career", targetQuestions: 2500, status: "queued" },
      { name: "Addictions Counsellor", inventoryKey: "addictionsCounsellor", type: "career", targetQuestions: 2500, status: "queued" },
      { name: "Surgical Technologist (CST)", inventoryKey: "surgicalTechnologist", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "Diagnostic Sonography (ARDMS)", inventoryKey: "diagnosticSonography", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "Cardiac Sonographer (RCS)", inventoryKey: "cardiacSonographer", type: "career", targetQuestions: 2500, status: "in-progress" },
      { name: "Health Info Mgmt (RHIT/RHIA)", inventoryKey: "healthInfoMgmt", type: "career", targetQuestions: 2500, status: "in-progress" },
    ],
  },
  {
    id: 3,
    title: "Phase 3 — Nursing Certification Exams",
    description: "Build specialty certification exam banks for BLS, ACLS, PALS, NRP, TNCC, ENPC, CCRN, CEN, OCN, CNOR, and CPN.",
    status: "in-progress",
    startDate: "2026-01-15",
    targetDate: "2026-06-30",
    components: [
      { name: "BLS", inventoryKey: "bls", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "ACLS", inventoryKey: "acls", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "PALS", inventoryKey: "pals", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "NRP", inventoryKey: "nrp", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "TNCC", inventoryKey: "tncc", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "ENPC", inventoryKey: "enpc", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "CCRN (Critical Care)", inventoryKey: "criticalCare", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "CEN (Emergency)", inventoryKey: "emergencyNursing", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "OCN (Oncology)", inventoryKey: "oncologyNursing", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "CNOR (Perioperative)", inventoryKey: "perioperative", type: "exam", targetQuestions: 1500, status: "completed" },
      { name: "CPN (Pediatric)", inventoryKey: "pediatricCert", type: "exam", targetQuestions: 1500, status: "completed" },
    ],
  },
  {
    id: 4,
    title: "Phase 4 — Global & Multilingual Expansion",
    description: "Expand content for international nursing exams (UK NMC, AU AHPRA, PH PRC, IN INC, etc.) and add multilingual support (FR, ES, TL, HI, AR, ZH).",
    status: "queued",
    startDate: "2026-07-01",
    targetDate: "2027-03-31",
    components: [
      { name: "UK — NMC CBT", inventoryKey: "country_gb", type: "country", targetQuestions: 3000, status: "queued" },
      { name: "Australia — AHPRA", inventoryKey: "country_au", type: "country", targetQuestions: 3000, status: "queued" },
      { name: "Philippines — PRC", inventoryKey: "country_ph", type: "country", targetQuestions: 3000, status: "queued" },
      { name: "India — INC", inventoryKey: "country_in", type: "country", targetQuestions: 3000, status: "queued" },
      { name: "Middle East — DHA/MOH/HAAD", inventoryKey: "country_ae", type: "country", targetQuestions: 3000, status: "queued" },
      { name: "French (CA/International)", inventoryKey: "lang_fr", type: "language", targetQuestions: 5000, status: "queued" },
      { name: "Spanish", inventoryKey: "lang_es", type: "language", targetQuestions: 5000, status: "queued" },
      { name: "Tagalog", inventoryKey: "lang_tl", type: "language", targetQuestions: 3000, status: "queued" },
      { name: "Hindi", inventoryKey: "lang_hi", type: "language", targetQuestions: 3000, status: "queued" },
      { name: "Arabic", inventoryKey: "lang_ar", type: "language", targetQuestions: 3000, status: "queued" },
      { name: "Chinese (Simplified)", inventoryKey: "lang_zh", type: "language", targetQuestions: 3000, status: "queued" },
    ],
  },
  {
    id: 5,
    title: "Phase 5 — Advanced Features & Scale",
    description: "Implement AI-driven personalized study plans, spaced repetition algorithms, group study rooms, leaderboards, and content quality automation.",
    status: "queued",
    startDate: "2027-04-01",
    targetDate: "2027-12-31",
    components: [
      { name: "AI Personalized Study Plans", inventoryKey: "_study_plans", type: "feature", targetQuestions: 0, status: "queued" },
      { name: "Spaced Repetition Engine", inventoryKey: "_spaced_rep", type: "feature", targetQuestions: 0, status: "queued" },
      { name: "Group Study Rooms", inventoryKey: "_group_study", type: "feature", targetQuestions: 0, status: "queued" },
      { name: "Competitive Leaderboards", inventoryKey: "_leaderboards", type: "feature", targetQuestions: 0, status: "queued" },
      { name: "Content Quality Automation", inventoryKey: "_quality_auto", type: "feature", targetQuestions: 0, status: "queued" },
      { name: "Question Deduplication Engine", inventoryKey: "_dedup", type: "feature", targetQuestions: 0, status: "queued" },
    ],
  },
];

export const APPROACHING_WEAK_PERCENT = 0.75;

export interface ThinBankAlert {
  name: string;
  key: string;
  type: "tier" | "career" | "exam" | "topic";
  currentCount: number;
  threshold: number;
  deficit: number;
  isFlagship: boolean;
  severity: "critical" | "warning" | "approaching-weak";
}

export interface BlueprintGap {
  tierOrExam: string;
  domain: string;
  weight: number;
  currentCount: number;
  targetCount: number;
  deficit: number;
  coveragePercent: number;
}

export interface NextPriorityRecommendation {
  rank: number;
  action: string;
  target: string;
  reason: string;
  impact: "critical" | "high" | "medium";
  estimatedQuestions: number;
  phase: number;
}

export function detectThinBanks(
  inventoryByKey: Record<string, number>,
  roadmap: ExpansionPhase[],
  topicCounts?: { topic: string; count: number }[],
  topicMinThreshold: number = 50,
  flagshipKeys: string[] = ["rn", "rpn", "np", "rrt", "socialWorker"]
): ThinBankAlert[] {
  const alerts: ThinBankAlert[] = [];
  const seen = new Set<string>();

  for (const phase of roadmap) {
    for (const comp of phase.components) {
      if (comp.targetQuestions === 0 || comp.inventoryKey.startsWith("_")) continue;
      if (seen.has(comp.inventoryKey)) continue;
      seen.add(comp.inventoryKey);

      const count = inventoryByKey[comp.inventoryKey] || 0;
      const isFlagship = flagshipKeys.includes(comp.inventoryKey);
      const threshold = isFlagship ? FLAGSHIP_THRESHOLD : THIN_BANK_FLOOR;
      const approachingWeakCeiling = Math.round(threshold * (1 + (1 - APPROACHING_WEAK_PERCENT)));

      if (count < threshold * 0.5) {
        alerts.push({
          name: comp.name,
          key: comp.inventoryKey,
          type: comp.type as "tier" | "career" | "exam" | "topic",
          currentCount: count,
          threshold,
          deficit: threshold - count,
          isFlagship,
          severity: "critical",
        });
      } else if (count < threshold) {
        alerts.push({
          name: comp.name,
          key: comp.inventoryKey,
          type: comp.type as "tier" | "career" | "exam" | "topic",
          currentCount: count,
          threshold,
          deficit: threshold - count,
          isFlagship,
          severity: "warning",
        });
      } else if (count < approachingWeakCeiling) {
        alerts.push({
          name: comp.name,
          key: comp.inventoryKey,
          type: comp.type as "tier" | "career" | "exam" | "topic",
          currentCount: count,
          threshold,
          deficit: 0,
          isFlagship,
          severity: "approaching-weak",
        });
      }
    }
  }

  if (topicCounts) {
    for (const { topic, count } of topicCounts) {
      if (count < topicMinThreshold) {
        alerts.push({
          name: topic,
          key: `topic:${topic}`,
          type: "topic",
          currentCount: count,
          threshold: topicMinThreshold,
          deficit: topicMinThreshold - count,
          isFlagship: false,
          severity: count < topicMinThreshold / 2 ? "critical" : "warning",
        });
      }
    }
  }

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, "approaching-weak": 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) return severityOrder[a.severity] - severityOrder[b.severity];
    return b.deficit - a.deficit;
  });
}

export function generateNextPriorityRecommendations(
  inventoryByKey: Record<string, number>,
  roadmap: ExpansionPhase[]
): NextPriorityRecommendation[] {
  const recommendations: NextPriorityRecommendation[] = [];
  let rank = 0;

  const activePhases = roadmap.filter((p) => p.status === "in-progress");

  for (const phase of activePhases) {
    for (const comp of phase.components) {
      if (comp.status === "completed" || comp.targetQuestions === 0 || comp.inventoryKey.startsWith("_")) continue;

      const current = inventoryByKey[comp.inventoryKey] || 0;

      if (current < comp.targetQuestions) {
        const deficit = comp.targetQuestions - current;
        const coveragePercent = Math.round((current / comp.targetQuestions) * 100);

        let impact: "critical" | "high" | "medium" = "medium";
        if (coveragePercent < 25) impact = "critical";
        else if (coveragePercent < 60) impact = "high";

        rank++;
        recommendations.push({
          rank,
          action: current === 0 ? "Build new question bank" : "Expand question bank",
          target: comp.name,
          reason: `${current.toLocaleString()} / ${comp.targetQuestions.toLocaleString()} questions (${coveragePercent}% complete)`,
          impact,
          estimatedQuestions: deficit,
          phase: phase.id,
        });
      }
    }
  }

  const queuedPhases = roadmap.filter((p) => p.status === "queued");
  for (const phase of queuedPhases) {
    for (const comp of phase.components) {
      if (comp.targetQuestions === 0 || comp.inventoryKey.startsWith("_")) continue;
      rank++;
      recommendations.push({
        rank,
        action: "Plan content for upcoming phase",
        target: comp.name,
        reason: `Phase ${phase.id} — ${comp.targetQuestions.toLocaleString()} questions needed`,
        impact: "medium",
        estimatedQuestions: comp.targetQuestions,
        phase: phase.id,
      });
    }
  }

  return recommendations
    .sort((a, b) => {
      const impactOrder = { critical: 0, high: 1, medium: 2 };
      if (impactOrder[a.impact] !== impactOrder[b.impact]) return impactOrder[a.impact] - impactOrder[b.impact];
      return a.phase - b.phase;
    })
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function getPhaseCompletionPercent(phase: ExpansionPhase): number {
  const total = phase.components.length;
  if (total === 0) return 0;
  const completed = phase.components.filter((c) => c.status === "completed").length;
  return Math.round((completed / total) * 100);
}

export function getRoadmapOverallProgress(phases: ExpansionPhase[]): {
  totalComponents: number;
  completedComponents: number;
  inProgressComponents: number;
  queuedComponents: number;
  blockedComponents: number;
  overallPercent: number;
} {
  let totalComponents = 0;
  let completedComponents = 0;
  let inProgressComponents = 0;
  let queuedComponents = 0;
  let blockedComponents = 0;

  for (const phase of phases) {
    for (const comp of phase.components) {
      totalComponents++;
      if (comp.status === "completed") completedComponents++;
      else if (comp.status === "in-progress") inProgressComponents++;
      else if (comp.status === "queued") queuedComponents++;
      else if (comp.status === "blocked") blockedComponents++;
    }
  }

  return {
    totalComponents,
    completedComponents,
    inProgressComponents,
    queuedComponents,
    blockedComponents,
    overallPercent: totalComponents > 0 ? Math.round((completedComponents / totalComponents) * 100) : 0,
  };
}
