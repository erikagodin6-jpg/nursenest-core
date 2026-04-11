/**
 * Strategy Taxonomy — Test-Taking Strategy Trainer
 *
 * Canonical definitions for the seven nursing-exam thinking strategies.
 * These map directly to `ExamQuestion.examStrategy` in the Prisma schema
 * (the `exam_strategy` DB column).
 *
 * Design:
 *   - Each entry carries its own accent CSS variable (no hardcoded colors)
 *   - Surface tint and accent are separate so chips, cards, and panels
 *     each use the appropriate visual weight
 *   - `examFrequency` is an approximate band, not a promise
 *
 * Stability: strategy keys are used in URL params and API filters.
 *   Rename only with a redirect or migration.
 */

// ── Strategy keys ─────────────────────────────────────────────────────────────

export type StrategyKey =
  | "prioritization"
  | "abcs"
  | "safety"
  | "delegation"
  | "assessment_first"
  | "acute_vs_chronic"
  | "stable_vs_unstable";

// ── Per-strategy metadata ─────────────────────────────────────────────────────

export type StrategyEntry = {
  key: StrategyKey;
  /** Display label — shown on chips and card headers. */
  label: string;
  /** Short description for filter cards and tooltips (1–2 sentences). */
  description: string;
  /**
   * The core nursing/clinical principle this strategy enforces.
   * Used in the "What strategy helps here?" rationale section.
   */
  nursingPrinciple: string;
  /**
   * How to spot this strategy type on exams.
   * Used in the "Decision rule" section of the rationale panel.
   */
  decisionRule: string;
  /** Why wrong answers are tempting on strategy questions. */
  typicalTrap: string;
  /** Approximate exam frequency label. */
  examFrequency: "Very high" | "High" | "Moderate" | "Lower";
  /**
   * CSS custom property reference for the accent color.
   * Used for chip borders, card left-borders, and section labels.
   * Must be a valid CSS var() expression.
   */
  accentVar: string;
  /**
   * Icon keyword — maps to a Lucide icon name for rendering.
   * Consumer components map this to the actual icon import.
   */
  icon: "arrow-up" | "heart-pulse" | "shield" | "users" | "stethoscope" | "activity" | "trending-up";
};

// ── Taxonomy entries ──────────────────────────────────────────────────────────

export const STRATEGY_TAXONOMY: StrategyEntry[] = [
  {
    key: "prioritization",
    label: "Prioritization",
    description:
      "Which patient or action comes first? Applies Maslow's hierarchy, life threats before comfort, and urgent vs. non-urgent triage.",
    nursingPrinciple:
      "Life-threatening physiological needs always take precedence. Apply Maslow's hierarchy: physiological → safety → love → esteem → self-actualization.",
    decisionRule:
      "Ask: Is any patient in immediate danger? If yes, act there first. Among similarly stable patients, address the most acute physiological need.",
    typicalTrap:
      "Distractors often present a psychosocial need (e.g., anxiety) as urgent, or list a non-acute physiological concern (e.g., a wound needing dressing change) alongside a true emergency.",
    examFrequency: "Very high",
    accentVar: "var(--semantic-info, #0284c7)",
    icon: "arrow-up",
  },
  {
    key: "abcs",
    label: "ABCs",
    description:
      "Airway → Breathing → Circulation. The fundamental triage order for any emergent or deteriorating patient.",
    nursingPrinciple:
      "Airway patency is always the first concern. A patient who cannot oxygenate will deteriorate in every other system. Never bypass airway/breathing for circulation problems except in cardiac arrest (CAB sequence).",
    decisionRule:
      "When multiple options look equally urgent, work through A→B→C in order. Airway problems beat breathing problems; breathing beats circulatory. Exception: active cardiac arrest — begin chest compressions.",
    typicalTrap:
      "Questions often present a cardiovascular finding (low BP, tachycardia) alongside a subtle airway sign (stridor, accessory muscle use). Test-takers choose the circulatory intervention first — but airway wins.",
    examFrequency: "Very high",
    accentVar: "var(--semantic-danger, #ef4444)",
    icon: "heart-pulse",
  },
  {
    key: "safety",
    label: "Safety",
    description:
      "Prevent harm before it occurs. Includes fall prevention, medication verification, infection control, restraint standards, and environmental hazard removal.",
    nursingPrinciple:
      "The nurse is the last line of defense against patient harm. Safety interventions are not optional — they are mandated and time-sensitive.",
    decisionRule:
      "If an option eliminates an immediate physical safety threat, that action takes priority over assessment (exception to assess-before-intervene) and over comfort measures.",
    typicalTrap:
      "Wrong answers often give the nurse an assessment or communication task first (e.g., 'notify the physician') when the safe action (e.g., lower the bed rails) can and should be done immediately.",
    examFrequency: "High",
    accentVar: "var(--semantic-warning, #f59e0b)",
    icon: "shield",
  },
  {
    key: "delegation",
    label: "Delegation",
    description:
      "What can the RN delegate to an LPN or UAP? Five Rights of Delegation: right task, right circumstance, right person, right direction, right supervision.",
    nursingPrinciple:
      "The RN retains accountability. Delegate stable, predictable, routine tasks. RNs cannot delegate assessment, care planning, evaluation, or teaching to UAPs.",
    decisionRule:
      "For UAP delegation: Is the task routine? Is the patient stable? Does it require nursing judgment? If any judgment is required, the RN does it. LPNs can perform tasks within their scope under RN supervision for stable patients.",
    typicalTrap:
      "Distractors present stable tasks wrapped in clinical language that implies instability. Test-takers over-delegate to UAPs (tasks requiring judgment) or under-delegate (refuse to assign routine tasks).",
    examFrequency: "High",
    accentVar: "var(--semantic-chart-3, #a78bfa)",
    icon: "users",
  },
  {
    key: "assessment_first",
    label: "Assessment Before Intervention",
    description:
      "Assess before acting. The nursing process begins with assessment — never skip to intervention without first understanding the situation.",
    nursingPrinciple:
      "Data before action. Intervening without assessing wastes resources, misses root causes, and can cause harm. Even in urgent situations, a rapid focused assessment precedes the intervention.",
    decisionRule:
      "When a patient has a new or worsening finding, the first nursing action is almost always to assess further (vital signs, focused assessment, pain scale). Avoid 'notify physician' as the first action unless you've assessed.",
    typicalTrap:
      "Questions present a concerning sign and offer 'administer PRN medication' or 'notify the MD' before any assessment options. Test-takers jump to intervention or notification, skipping the assessment step.",
    examFrequency: "High",
    accentVar: "var(--semantic-brand, var(--theme-primary))",
    icon: "stethoscope",
  },
  {
    key: "acute_vs_chronic",
    label: "Acute vs Chronic",
    description:
      "Distinguish new, acute changes from stable, long-standing conditions. Acute changes require immediate attention; chronic baseline findings may not.",
    nursingPrinciple:
      "Acute decompensation in a chronic condition is still acute. A new symptom in a chronic patient is a red flag, not 'expected for them.' Compare to baseline, not to normal values.",
    decisionRule:
      "Ask: Is this finding new? Is it a deviation from the patient's established baseline? New or worsening = act. Chronic stable finding = document, monitor, report at next check-in.",
    typicalTrap:
      "Questions describe a chronic patient (COPD, CHF, DM) and embed a new acute sign. Test-takers dismiss the sign as 'expected for this patient' because of the chronic diagnosis.",
    examFrequency: "Moderate",
    accentVar: "var(--semantic-chart-1, #14b8a6)",
    icon: "activity",
  },
  {
    key: "stable_vs_unstable",
    label: "Stable vs Unstable",
    description:
      "Is this patient compensating or decompensating? Stability determines urgency, delegation eligibility, transfer decisions, and monitoring frequency.",
    nursingPrinciple:
      "Clinical stability is dynamic, not static. A 'stable' patient can shift. Trending vital signs matter more than single values. Compensating shock may look stable until sudden decompensation.",
    decisionRule:
      "Look for trends: worsening LOC, narrowing pulse pressure, rising lactate, increasing O₂ requirements. Single normal values ≠ stable. Repeated declining values = unstable regardless of absolute number.",
    typicalTrap:
      "Questions show a patient with 'normal' individual vital signs but trending in a concerning direction. Test-takers declare the patient stable based on the last single reading rather than the trend.",
    examFrequency: "Moderate",
    accentVar: "var(--semantic-success, #22c55e)",
    icon: "trending-up",
  },
];

// ── Lookup helpers ────────────────────────────────────────────────────────────

const STRATEGY_MAP = new Map(STRATEGY_TAXONOMY.map((s) => [s.key, s]));

/** Lookup a strategy by its key. Returns `undefined` if not found. */
export function getStrategy(key: string): StrategyEntry | undefined {
  return STRATEGY_MAP.get(key as StrategyKey);
}

/** All valid strategy keys as a readonly tuple (for Zod enum, Next.js generateStaticParams, etc.). */
export const ALL_STRATEGY_KEYS: readonly StrategyKey[] = STRATEGY_TAXONOMY.map((s) => s.key);

/** Returns whether a string is a valid strategy key. */
export function isStrategyKey(s: string): s is StrategyKey {
  return STRATEGY_MAP.has(s as StrategyKey);
}

/**
 * Map `ExamQuestion.examStrategy` (raw DB string) to a `StrategyEntry`.
 * Handles null, empty, or unknown values gracefully.
 */
export function resolveStrategyFromDbValue(
  raw: string | null | undefined,
): StrategyEntry | null {
  if (!raw) return null;
  // The DB field might store the key directly or with slight variations
  const normalized = raw.toLowerCase().trim().replace(/\s+/g, "_").replace(/-/g, "_");
  return STRATEGY_MAP.get(normalized as StrategyKey) ?? null;
}

/** Mixed session uses all strategies. */
export const MIXED_STRATEGY_KEY = "mixed" as const;

export type SessionMode = StrategyKey | typeof MIXED_STRATEGY_KEY;
