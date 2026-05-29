/**
 * Tier Alignment Audit Engine
 *
 * Detects specialty content leaking into the wrong learning pathway.
 * Prevents learner confusion from inappropriate content in foundational programs.
 *
 * Example violations:
 *   ICU ventilator settings  → appearing in RN NCLEX bank (specialty leak)
 *   NP-level diagnostics     → appearing in RPN/PN (scope mismatch)
 *   Advanced telemetry ECG   → in pre-nursing (complexity mismatch)
 *   RT-specific content      → in RN NCLEX bank (profession mismatch)
 *
 * Scoring per question:
 *   100 = Perfect tier alignment
 *    0  = Completely wrong tier
 *
 * Platform Tier Alignment Score:
 *   Average of all question alignment scores
 *   <80 = Warning (significant leakage)
 *   <60 = Critical (systematic misclassification)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type TierKey = "rn" | "rpn" | "np" | "allied" | "newgrad" | "pre_nursing";

export type AlignmentViolation =
  | "icu_in_rn"           // ICU specialty in basic RN bank
  | "rt_in_rn"            // Respiratory therapy content in RN bank
  | "np_in_rpn"           // NP-level diagnostics in PN bank
  | "specialty_in_entry"  // Any specialty content in entry-level
  | "advanced_ecg_in_rn"  // 12-lead advanced ECG in basic RN bank
  | "hemodynamics_in_rn"  // Advanced hemodynamics in entry-level
  | "scope_mismatch"      // Content outside the tier's scope of practice
  | "complex_pharmacology_in_rpn" // Advanced drug management in PN bank
  | "complexity_mismatch" // Content complexity doesn't match tier level

export type TierAlignmentResult = {
  questionId: string;
  tier: string;
  topic: string;
  text: string;
  alignmentScore: number;
  violations: AlignmentViolation[];
  violationDetails: string[];
  recommendation: string;
};

// ─── Tier-specific keyword signals ───────────────────────────────────────────

// Keywords that should NOT appear in each tier's question bank
const FORBIDDEN_SIGNALS: Record<TierKey, Array<{ keywords: string[]; violation: AlignmentViolation; label: string }>> = {
  rn: [
    {
      keywords: ["Swan-Ganz catheter", "pulmonary artery wedge pressure", "PAWP", "cardiac output thermodilution", "pulmonary vascular resistance"],
      violation: "icu_in_rn",
      label: "ICU hemodynamic monitoring (Swan-Ganz) in basic RN bank",
    },
    {
      keywords: ["high-frequency oscillatory ventilation", "HFOV", "airway pressure release", "APRV", "inverse ratio ventilation"],
      violation: "rt_in_rn",
      label: "Advanced ventilator modes (RT specialty) in RN bank",
    },
    {
      keywords: ["Wenckebach", "Mobitz type II", "trifascicular block", "delta wave pre-excitation", "His bundle"],
      violation: "advanced_ecg_in_rn",
      label: "Advanced ECG interpretation (12-lead specialty) in basic RN bank",
    },
    {
      keywords: ["CRRT", "continuous renal replacement therapy", "venovenous hemofiltration", "CVVHDF"],
      violation: "icu_in_rn",
      label: "CRRT/advanced renal replacement (ICU specialty) in RN bank",
    },
  ],
  rpn: [
    {
      keywords: ["prescribe", "primary diagnosis", "differential diagnosis", "order CT scan", "interpret echocardiogram", "prescribing authority"],
      violation: "np_in_rpn",
      label: "Prescribing/advanced diagnostic authority — outside PN scope",
    },
    {
      keywords: ["vasopressor titration", "norepinephrine infusion", "dopamine drip titration"],
      violation: "scope_mismatch",
      label: "ICU vasopressor management — outside basic PN scope",
    },
    {
      keywords: ["thrombolytic therapy", "tPA administration", "alteplase", "streptokinase"],
      violation: "complex_pharmacology_in_rpn",
      label: "Advanced thrombolytic agents — typically outside basic PN scope",
    },
  ],
  np: [],  // NP is advanced — very few forbidden topics
  allied: [
    {
      keywords: ["prescribe medication", "prescribing", "medical diagnosis", "physician order"],
      violation: "scope_mismatch",
      label: "Prescribing authority — outside allied health scope",
    },
  ],
  newgrad: [
    {
      keywords: ["transplant coordination", "bone marrow transplant protocol", "LVAD management", "aortic balloon pump IABP management"],
      violation: "specialty_in_entry",
      label: "Advanced specialty procedures — inappropriate for new grad orientation",
    },
  ],
  pre_nursing: [
    {
      keywords: ["CAT exam", "NCLEX", "clinical judgment model", "Next Generation NCLEX", "NGN"],
      violation: "complexity_mismatch",
      label: "NCLEX-level exam concepts inappropriate for pre-nursing content",
    },
  ],
};

// ─── Analysis ─────────────────────────────────────────────────────────────────

export function analyzeTierAlignment(opts: {
  questionId: string;
  tier: string;
  topic: string;
  questionText: string;
  rationaleText?: string;
}): TierAlignmentResult {
  const tierKey = normalizeTierKey(opts.tier);
  const fullText = `${opts.questionText} ${opts.rationaleText ?? ""}`.toLowerCase();

  const violations: AlignmentViolation[] = [];
  const details: string[] = [];

  const signals = FORBIDDEN_SIGNALS[tierKey] ?? [];
  for (const sig of signals) {
    const found = sig.keywords.find((kw) => fullText.includes(kw.toLowerCase()));
    if (found) {
      violations.push(sig.violation);
      details.push(`"${found}" — ${sig.label}`);
    }
  }

  const score = Math.max(0, 100 - violations.length * 25);

  let recommendation = "No alignment issues detected.";
  if (violations.length > 0) {
    recommendation = violations.includes("np_in_rpn")
      ? "Move to NP pathway or simplify to remove prescribing/diagnosis authority."
      : violations.includes("icu_in_rn")
      ? "Move to specialty/ICU module or reframe to basic clinical decision-making."
      : violations.includes("rt_in_rn")
      ? "Move to RT/Allied pathway or reframe as basic respiratory nursing."
      : violations.includes("advanced_ecg_in_rn")
      ? "Move to Advanced ECG module or simplify to basic rhythm recognition."
      : "Review content scope and move to appropriate pathway.";
  }

  return {
    questionId: opts.questionId,
    tier: opts.tier,
    topic: opts.topic,
    text: opts.questionText.slice(0, 100),
    alignmentScore: score,
    violations,
    violationDetails: details,
    recommendation,
  };
}

function normalizeTierKey(tier: string): TierKey {
  const t = tier.toUpperCase();
  if (t === "RN") return "rn";
  if (t === "RPN" || t === "LVN_LPN" || t === "PN") return "rpn";
  if (t === "NP") return "np";
  if (t === "ALLIED") return "allied";
  if (t === "NEW_GRAD") return "newgrad";
  if (t === "PRE_NURSING") return "pre_nursing";
  return "rn";
}

/** Platform-level tier alignment summary. */
export function summarizeTierAlignment(results: TierAlignmentResult[]): {
  total: number;
  misalignedCount: number;
  criticalCount: number;
  avgAlignmentScore: number;
  misalignmentRate: number;
  topViolations: Array<{ violation: AlignmentViolation; count: number }>;
  tierBreakdown: Record<string, { total: number; misaligned: number }>;
} {
  const misaligned = results.filter((r) => r.violations.length > 0);
  const critical = results.filter((r) => r.alignmentScore < 50);
  const avgScore = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.alignmentScore, 0) / results.length)
    : 100;

  const violationCounts = new Map<AlignmentViolation, number>();
  for (const r of misaligned) {
    for (const v of r.violations) {
      violationCounts.set(v, (violationCounts.get(v) ?? 0) + 1);
    }
  }

  const tierBreakdown: Record<string, { total: number; misaligned: number }> = {};
  for (const r of results) {
    if (!tierBreakdown[r.tier]) tierBreakdown[r.tier] = { total: 0, misaligned: 0 };
    tierBreakdown[r.tier].total++;
    if (r.violations.length > 0) tierBreakdown[r.tier].misaligned++;
  }

  return {
    total: results.length,
    misalignedCount: misaligned.length,
    criticalCount: critical.length,
    avgAlignmentScore: avgScore,
    misalignmentRate: results.length > 0 ? misaligned.length / results.length : 0,
    topViolations: [...violationCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([violation, count]) => ({ violation, count })),
    tierBreakdown,
  };
}
