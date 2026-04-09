/**
 * Strict editorial contract for **RN** pathway lessons tied to the RN master map tiers
 * (`rn-nclex-master-map.json`). Authors and generators must satisfy these bands — no shallow
 * notes, no unstructured mega-essays.
 *
 * Structure: use the exam-complete premium spine (`exam-complete-lesson-template.ts`) so lessons
 * stay scan-friendly (clear headings, predictable sections, internal links).
 */
export type RnNclexTier = "A" | "B" | "C" | "D";

export const RN_NCLEX_CONTENT_DEPTH_VERSION = 1 as const;

/** Inclusive word-count bands per tier (full lesson body, plain text). */
export const RN_NCLEX_TIER_WORD_RANGE: Record<RnNclexTier, readonly [number, number]> = {
  A: [1800, 2600],
  B: [1200, 1800],
  C: [900, 1400],
  D: [600, 900],
};

export type RnNclexTierDepthSpec = {
  tier: RnNclexTier;
  wordMin: number;
  wordMax: number;
  useFor: string[];
  mustInclude: string[];
};

export const RN_NCLEX_TIER_DEPTH: Record<RnNclexTier, RnNclexTierDepthSpec> = {
  A: {
    tier: "A",
    wordMin: 1800,
    wordMax: 2600,
    useFor: [
      "High-yield med-surg",
      "Emergency and resuscitation",
      "ICU-level concepts tested on RN exams",
      "Maternity emergencies",
      "Major pediatric disorders",
    ],
    mustInclude: [
      "Full pathophysiology (enough mechanism to explain assessment findings and priorities)",
      "Assessment: subjective/objective, monitoring, trending, focused exam cues",
      "Interventions: independent nursing actions, collaboration, escalation, teaching",
      "Complications: recognition, prevention, reporting",
      "NCLEX red flags: unsafe options, first actions, contraindications, when to call",
    ],
  },
  B: {
    tier: "B",
    wordMin: 1200,
    wordMax: 1800,
    useFor: ["Standard condition lessons that still need exam-useful depth"],
    mustInclude: [
      "Pathophysiology and clinical picture at RN depth",
      "Assessment and nursing priorities",
      "Interventions and complications at appropriate scope",
      "Exam-relevant discriminating details (not encyclopedic trivia)",
    ],
  },
  C: {
    tier: "C",
    wordMin: 900,
    wordMax: 1400,
    useFor: [
      "Medication and medication-class lessons",
      "Procedure and device lessons",
      "Safety, monitoring, and surveillance lessons",
    ],
    mustInclude: [
      "Mechanism / class rationale tied to nursing monitoring",
      "Key adverse effects, interactions, labs, and contraindications nurses act on",
      "Patient education and administration safety",
    ],
  },
  D: {
    tier: "D",
    wordMin: 600,
    wordMax: 900,
    useFor: ["Narrow support topics", "Quick-reference teaching bundles that still teach a complete idea"],
    mustInclude: [
      "One coherent objective (still complete, not a bullet stub)",
      "Actionable nursing takeaways tied to the exam",
    ],
  },
};

/** Editorial anti-patterns — reject or rewrite. */
export const RN_NCLEX_DEPTH_ANTI_PATTERNS = [
  "Short shallow notes that do not meet the tier word band or premium section minimums",
  "Giant unstructured essays without the exam-complete spine (headings, section kinds)",
  "Filler repetition to inflate word count without new clinical value",
  "Generic intros that could apply to any topic",
] as const;

export const RN_NCLEX_DEPTH_FORMATTING_RULES = [
  "Scan-friendly: descriptive headings, short paragraphs, bold key terms sparingly",
  "Clinically useful: tie every block to assessment, action, or exam trap",
  "Written for RN exam prep: prioritization, safety, scope, therapeutic communication as tested",
] as const;

/** Returns true if total plain-text word count sits inside the tier band (inclusive). */
export function rnNclexTierWordCountInBand(tier: RnNclexTier, totalWords: number): boolean {
  const [lo, hi] = RN_NCLEX_TIER_WORD_RANGE[tier];
  return totalWords >= lo && totalWords <= hi;
}
