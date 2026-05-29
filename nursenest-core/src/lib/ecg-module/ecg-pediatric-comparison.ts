/**
 * ECG Pediatric vs Adult Comparison Module
 *
 * Provides side-by-side educational comparison configurations for adult and
 * pediatric ECG strips. Used by the pediatric curriculum UI to render the
 * "adult vs pediatric" learning mode.
 *
 * DESIGN PRINCIPLE
 *   Every comparison teaches a single, clinically meaningful distinction.
 *   The adult and pediatric strips must be directly comparable — same rhythm,
 *   same educational mode, different age-specific parameters.
 *
 * VALIDATION CONTRACT
 *   - Adult strip must be renderable by defaultEcgStripConfigForRhythm()
 *   - Pediatric strip must be renderable by defaultPediatricEcgStripConfig()
 *   - Both strips must pass isPublishableMorphology()
 *   - Rate labels must accurately reflect the displayed rate
 *   - Clinical teaching points must be accurate for the displayed rhythms
 */

import {
  defaultEcgStripConfigForRhythm,
  defaultPediatricEcgStripConfig,
  type EcgStripMediaConfig,
} from "@/lib/ecg-module/ecg-waveform-generator";
import type { PediatricAgeGroup } from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";
import { PEDIATRIC_NORMAL_RATE_RANGES } from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";

// ─── Comparison pair type ───────────────────────────────────────────────────────

export type EcgComparisonStrip = {
  config: EcgStripMediaConfig;
  /** Human-readable label for the strip (e.g. "Adult Normal Sinus Rhythm — 72 BPM") */
  label: string;
  /** Rate display string shown in the UI */
  rateLabel: string;
  /** Which clinically relevant features to call out for this specific strip */
  calloutFeatures: ReadonlyArray<string>;
};

export type EcgAdultPediatricComparison = {
  /** Unique identifier for URL routing and analytics */
  id: string;
  /** Title shown in the lesson/comparison view */
  title: string;
  /** 1–2 sentence clinical learning objective */
  objective: string;
  /** The adult strip */
  adult: EcgComparisonStrip;
  /** The pediatric strip */
  pediatric: EcgComparisonStrip;
  /** Age group of the pediatric subject */
  pediatricAgeGroup: PediatricAgeGroup;
  /** Key teaching points that apply to both strips — shown below the comparison */
  sharedTeachingPoints: ReadonlyArray<string>;
  /** The most critical clinical pearl from this comparison */
  primaryPearl: string;
  /** Which learner tiers see this comparison (some advanced comparisons are NP/RN only) */
  applicableTiers: ReadonlyArray<"RN" | "PN" | "RPN" | "NP">;
};

// ─── Comparison factory ─────────────────────────────────────────────────────────

function normalRangeForAge(ageGroup: PediatricAgeGroup): { min: number; max: number } {
  const range = PEDIATRIC_NORMAL_RATE_RANGES.find((r) => r.ageGroup === ageGroup)!;
  return { min: range.restingMin, max: range.restingMax };
}

// ─── Comparison library ─────────────────────────────────────────────────────────

export const ECG_ADULT_PEDIATRIC_COMPARISONS: ReadonlyArray<EcgAdultPediatricComparison> = [

  // ─── Sinus rhythm comparisons ─────────────────────────────────────────────────

  {
    id: "sinus-adult-vs-neonate",
    title: "Normal Sinus Rhythm — Adult vs Neonate",
    objective:
      "Recognize that a neonatal ECG at 130 BPM with a short PR interval is completely " +
      "normal, and would be tachycardia if the same rate appeared in an adult.",
    adult: {
      config: defaultEcgStripConfigForRhythm("normal_sinus_rhythm"),
      label: "Adult Normal Sinus Rhythm — 72 BPM",
      rateLabel: "72 BPM",
      calloutFeatures: [
        "PR interval 0.12–0.20s (adult normal)",
        "QRS 0.06–0.10s",
        "Rate 60–100 BPM (adult normal)",
      ],
    },
    pediatric: {
      config: defaultPediatricEcgStripConfig("normal_sinus_rhythm", "neonate", {
        features: { rightVentricularDominance: true },
      }),
      label: "Neonatal Normal Sinus Rhythm — 130 BPM",
      rateLabel: "130 BPM",
      calloutFeatures: [
        "PR interval 0.08–0.10s (shorter than adult — normal for neonate)",
        "QRS 0.04–0.06s (narrower — smaller conduction system)",
        "Rate 100–160 BPM (neonate normal range)",
        "Taller T-waves in right-sided leads (right ventricular dominance — physiologic at birth)",
      ],
    },
    pediatricAgeGroup: "neonate",
    sharedTeachingPoints: [
      "Both strips show normal sinus rhythm for their respective age groups",
      "Rate, PR interval, and QRS duration ALL change with age — not just rate",
      "A neonatal rate of 130 BPM is normal; an adult at 130 BPM would require clinical assessment",
    ],
    primaryPearl:
      "Never apply adult heart rate norms to children. Normal for age requires knowing " +
      "the age-specific reference range, not the adult 60–100 BPM standard.",
    applicableTiers: ["RN", "PN", "RPN", "NP"],
  },

  {
    id: "sinus-adult-vs-infant",
    title: "Normal Sinus Rhythm — Adult vs Infant",
    objective:
      "Distinguish normal infant sinus rhythm (120 BPM, short PR) from adult sinus tachycardia " +
      "at the same rate, and understand why rate alone is insufficient for pediatric rhythm assessment.",
    adult: {
      config: { ...defaultEcgStripConfigForRhythm("sinus_tachycardia"), rate: 120 },
      label: "Adult Sinus Tachycardia — 120 BPM",
      rateLabel: "120 BPM (tachycardic for adult)",
      calloutFeatures: [
        "Rate > 100 BPM = tachycardia in adults",
        "Assess for underlying cause: fever, pain, bleeding, hypoxia",
        "PR 0.12–0.20s, narrow QRS",
      ],
    },
    pediatric: {
      config: defaultPediatricEcgStripConfig("normal_sinus_rhythm", "infant"),
      label: "Infant Normal Sinus Rhythm — 120 BPM",
      rateLabel: "120 BPM (normal for infant)",
      calloutFeatures: [
        "Rate 90–150 BPM is the infant normal range — 120 BPM is mid-range normal",
        "Shorter PR interval (0.08–0.11s) than adult — normal for developmental stage",
        "Rate varies with activity and crying (unlike SVT, which is fixed)",
      ],
    },
    pediatricAgeGroup: "infant",
    sharedTeachingPoints: [
      "Rate 120 BPM represents tachycardia in an adult but normal sinus rhythm in an infant",
      "Context and age group determine whether intervention is needed",
      "Always document age when interpreting pediatric rhythm strips",
    ],
    primaryPearl:
      "A rate of 120 BPM is completely normal for an infant. The same rate in an adult " +
      "requires clinical investigation. Rate interpretation is always age-dependent.",
    applicableTiers: ["RN", "PN", "RPN", "NP"],
  },

  {
    id: "sinus-adult-vs-toddler",
    title: "Normal Sinus Rhythm — Adult vs Toddler",
    objective:
      "Identify normal toddler ECG parameters and explain why a toddler's PR interval " +
      "appears shorter than adult norms on telemetry.",
    adult: {
      config: defaultEcgStripConfigForRhythm("normal_sinus_rhythm"),
      label: "Adult Normal Sinus Rhythm — 72 BPM",
      rateLabel: "72 BPM",
      calloutFeatures: [
        "PR interval 160–200 ms — adult standard",
        "Rate 60–100 BPM",
        "QRS 60–100 ms",
      ],
    },
    pediatric: {
      config: defaultPediatricEcgStripConfig("normal_sinus_rhythm", "toddler"),
      label: "Toddler Normal Sinus Rhythm — 95 BPM",
      rateLabel: "95 BPM",
      calloutFeatures: [
        "PR interval 80–120 ms (shorter than adult — do not misinterpret as pre-excitation)",
        "Rate 70–120 BPM (toddler normal range)",
        "QRS 30–75 ms",
      ],
    },
    pediatricAgeGroup: "toddler",
    sharedTeachingPoints: [
      "Toddler PR interval is shorter than adult norms — this is normal development, not pre-excitation",
      "A toddler PR of 110 ms is normal; an adult PR of 110 ms is short",
      "Pediatric ECG interpretation requires pediatric reference tables",
    ],
    primaryPearl:
      "A short PR interval in a toddler is usually a normal developmental finding. " +
      "Apply pediatric age-specific PR ranges before labeling a short PR as WPW or pre-excitation.",
    applicableTiers: ["RN", "PN", "RPN", "NP"],
  },

  // ─── Bradycardia comparisons ─────────────────────────────────────────────────

  {
    id: "bradycardia-adult-vs-infant",
    title: "Bradycardia — Adult vs Infant",
    objective:
      "Recognize that infant bradycardia thresholds differ substantially from adult thresholds, " +
      "and that hypoxia (not atropine) is the first-line intervention in pediatric bradycardia.",
    adult: {
      config: defaultEcgStripConfigForRhythm("sinus_bradycardia"),
      label: "Adult Sinus Bradycardia — 50 BPM",
      rateLabel: "50 BPM (bradycardic for adult)",
      calloutFeatures: [
        "Rate < 60 BPM = bradycardia in adults",
        "May be asymptomatic in athletes",
        "Symptomatic: atropine 0.5 mg IV is first-line per ACLS",
      ],
    },
    pediatric: {
      config: defaultPediatricEcgStripConfig("sinus_bradycardia", "infant", { rate: 72 }),
      label: "Infant Bradycardia — 72 BPM",
      rateLabel: "72 BPM (bradycardic for infant)",
      calloutFeatures: [
        "Rate < 80 BPM = bradycardia in infants",
        "72 BPM would be normal for an adult but concerning for an infant",
        "PALS first-line: bag-valve-mask ventilation (hypoxia is the primary cause)",
        "Atropine is NOT first-line — ventilate before medicating",
      ],
    },
    pediatricAgeGroup: "infant",
    sharedTeachingPoints: [
      "Bradycardia threshold is age-dependent: 60 BPM for adults, 80 BPM for infants",
      "In children, bradycardia is almost always caused by hypoxia — ventilate first",
      "Pediatric PALS algorithm prioritizes oxygenation before pharmacology for bradycardia",
    ],
    primaryPearl:
      "Pediatric bradycardia = ventilate first. Unlike adults, the most common cause is " +
      "hypoxia, not intrinsic conduction disease. Correcting hypoxia usually corrects the bradycardia.",
    applicableTiers: ["RN", "PN", "RPN", "NP"],
  },

  // ─── Tachycardia comparisons ─────────────────────────────────────────────────

  {
    id: "svt-adult-vs-infant",
    title: "SVT — Adult vs Infant",
    objective:
      "Compare adult SVT morphology with infant SVT to understand why infant SVT " +
      "presents at rates that would be fatal in adults, and how management differs.",
    adult: {
      config: { ...defaultEcgStripConfigForRhythm("svt"), rate: 180 },
      label: "Adult SVT — 180 BPM",
      rateLabel: "180 BPM",
      calloutFeatures: [
        "Rate 150–220 BPM (adult SVT range)",
        "Narrow complex, regular rhythm",
        "P-waves absent or retrograde",
        "ACLS: vagal maneuvers → adenosine 6 mg IV rapid push",
      ],
    },
    pediatric: {
      config: defaultPediatricEcgStripConfig("pediatric_svt", "infant"),
      label: "Infant SVT — 250 BPM",
      rateLabel: "250 BPM",
      calloutFeatures: [
        "Rate 220–300 BPM (infant SVT range)",
        "Narrow complex, extremely rapid",
        "Abrupt onset distinguishes from sinus tachycardia",
        "PALS (stable): ice to face (vagal) → adenosine 0.1 mg/kg IV rapid push",
        "PALS (unstable): synchronized cardioversion 0.5–1 J/kg",
      ],
    },
    pediatricAgeGroup: "infant",
    sharedTeachingPoints: [
      "SVT rate in infants (220–300) is significantly higher than adult SVT (150–220)",
      "The vagal maneuver differs: ice water to face for infants, carotid massage for adults",
      "Adenosine dosing differs: 0.1 mg/kg pediatric vs 6 mg fixed adult dose",
      "Adenosine must be given rapid IV push regardless of age — slow infusion will not terminate",
    ],
    primaryPearl:
      "Infant SVT at 250 BPM is well-tolerated for hours to days before heart failure develops. " +
      "Adult hearts cannot sustain 250 BPM. This is a fundamental physiologic difference.",
    applicableTiers: ["RN", "NP"],
  },

  {
    id: "sinus-tach-vs-svt-infant",
    title: "Sinus Tachycardia vs SVT — Infant",
    objective:
      "Apply the clinical decision rule to distinguish sinus tachycardia from SVT in an infant — " +
      "the most critical pediatric rhythm identification task.",
    adult: {
      config: { ...defaultEcgStripConfigForRhythm("sinus_tachycardia"), rate: 190 },
      label: "Infant Sinus Tachycardia — 190 BPM (sepsis/fever)",
      rateLabel: "190 BPM (sinus tach)",
      calloutFeatures: [
        "Rate gradually changes with stimulation and fever treatment",
        "Rate 190 BPM in an infant with fever = likely sinus tachycardia",
        "P-waves visible with sinus morphology",
        "DO NOT cardiovert sinus tachycardia — treat the cause",
      ],
    },
    pediatric: {
      config: defaultPediatricEcgStripConfig("pediatric_svt", "infant"),
      label: "Infant SVT — 240 BPM (abrupt onset)",
      rateLabel: "240 BPM (SVT)",
      calloutFeatures: [
        "Rate fixed regardless of stimulation or soothing",
        "Abrupt onset reported by caregiver",
        "P-waves absent or retrograde",
        "PALS: vagal maneuvers → adenosine 0.1 mg/kg",
      ],
    },
    pediatricAgeGroup: "infant",
    sharedTeachingPoints: [
      "Key discriminator is NOT rate — it is onset character (gradual vs abrupt) and rate variability",
      "Sinus tachycardia rate changes with fever, crying, and activity; SVT rate is fixed",
      "ECG alone cannot always distinguish in infants — clinical context is essential",
      "When uncertain: assess hemodynamics. Stable → adenosine trial. Unstable → synchronized cardioversion",
    ],
    primaryPearl:
      "In infants, 'HR > 220 + abrupt onset + no identifiable cause = SVT until proven otherwise.' " +
      "This clinical rule prevents both under-treatment (missing SVT) and over-treatment " +
      "(cardioverting sinus tachycardia from sepsis).",
    applicableTiers: ["RN", "NP"],
  },

  // ─── Arrest rhythm comparisons ────────────────────────────────────────────────

  {
    id: "vf-adult-vs-pediatric",
    title: "Ventricular Fibrillation — Adult vs Child",
    objective:
      "Compare adult and pediatric VF to understand why pediatric defibrillation energy " +
      "is weight-based (2 J/kg) not fixed, and why VF is less common in children.",
    adult: {
      config: defaultEcgStripConfigForRhythm("ventricular_fibrillation"),
      label: "Adult VF — chaotic, no organized QRS",
      rateLabel: "No measurable rate",
      calloutFeatures: [
        "Chaotic waveform, no organized complexes",
        "Primary cause: coronary artery disease",
        "ACLS: immediate defibrillation 200 J (biphasic)",
        "CPR between shocks",
      ],
    },
    pediatric: {
      config: defaultPediatricEcgStripConfig("normal_sinus_rhythm", "child", {
        rhythmKey: "ventricular_fibrillation",
        rate: 0,
        regularity: "chaotic",
        pWavePattern: "absent",
        prIntervalPattern: "not_measurable",
        qrsWidth: 0,
        features: { hasOrganizedQrs: false, hasRecurringQrs: false },
      }),
      label: "Pediatric VF — same chaotic morphology, different management",
      rateLabel: "No measurable rate",
      calloutFeatures: [
        "Same chaotic morphology as adult VF",
        "Primary cause in children: hypoxia, not coronary disease",
        "PALS: immediate defibrillation at 2 J/kg (may increase to 4 J/kg)",
        "Prevent VF in children by early recognition of respiratory distress",
      ],
    },
    pediatricAgeGroup: "child",
    sharedTeachingPoints: [
      "VF morphology is the same in children and adults — chaotic, no organized QRS",
      "Defibrillation energy differs: adult fixed vs pediatric weight-based (2 J/kg)",
      "Pediatric VF is rare compared to adults — often preceded by hypoxic arrest",
      "After ROSC in children: avoid hyperoxia (target SpO₂ 94–99%), prevent hyperthermia",
    ],
    primaryPearl:
      "Pediatric cardiac arrest is usually ASPHYXIAL (hypoxia/respiratory failure), not primary " +
      "cardiac. Prevent it by recognizing early respiratory deterioration — VF is a late event.",
    applicableTiers: ["RN", "NP"],
  },

  // ─── RSA comparison ───────────────────────────────────────────────────────────

  {
    id: "rsa-child-vs-adult-irregular",
    title: "Respiratory Sinus Arrhythmia vs Irregular Rhythm",
    objective:
      "Identify respiratory sinus arrhythmia (RSA) as a normal pediatric finding and " +
      "distinguish it from pathologic irregular rhythms (AFib, PACs).",
    adult: {
      config: defaultEcgStripConfigForRhythm("atrial_fibrillation"),
      label: "Adult AFib — irregularly irregular (pathologic)",
      rateLabel: "Irregular ~80 BPM average",
      calloutFeatures: [
        "Irregularly irregular R-R intervals (no pattern)",
        "No organized P-waves — fibrillatory baseline",
        "Requires anticoagulation assessment, rate/rhythm control",
        "Pathologic — requires treatment decision",
      ],
    },
    pediatric: {
      config: defaultPediatricEcgStripConfig("respiratory_sinus_arrhythmia", "child"),
      label: "Child Respiratory Sinus Arrhythmia — normal variant",
      rateLabel: "Varies 60–100 BPM with breathing",
      calloutFeatures: [
        "Rate increases with inspiration, decreases with expiration",
        "Consistent sinus P-waves throughout (RSA is still sinus rhythm)",
        "Narrow regular QRS complexes",
        "NORMAL — reflects healthy vagal tone; do not treat",
      ],
    },
    pediatricAgeGroup: "child",
    sharedTeachingPoints: [
      "Both strips show beat-to-beat rate variation, but the mechanism is completely different",
      "RSA: P-wave morphology is consistently sinus throughout; AFib has no organized P-waves",
      "RSA correlates with the respiratory cycle; AFib variation has no consistent pattern",
      "RSA is more pronounced in children and athletes — do not mistake it for AFib on telemetry",
    ],
    primaryPearl:
      "RSA disappears in sick children — its absence may indicate autonomic dysfunction or severe illness. " +
      "Conversely, vigorous RSA in a well child is a reassuring sign of vagal tone.",
    applicableTiers: ["RN", "PN", "RPN", "NP"],
  },
];

// ─── Accessor functions ─────────────────────────────────────────────────────────

/** All comparison IDs for navigation and testing. */
export const ECG_COMPARISON_IDS: ReadonlyArray<string> =
  ECG_ADULT_PEDIATRIC_COMPARISONS.map((c) => c.id);

export function getEcgComparison(id: string): EcgAdultPediatricComparison | undefined {
  return ECG_ADULT_PEDIATRIC_COMPARISONS.find((c) => c.id === id);
}

/** Return comparisons applicable to the given learner tier. */
export function getComparisonsForTier(
  tier: "RN" | "PN" | "RPN" | "NP",
): ReadonlyArray<EcgAdultPediatricComparison> {
  return ECG_ADULT_PEDIATRIC_COMPARISONS.filter((c) =>
    c.applicableTiers.includes(tier),
  );
}

/** Return all comparisons for a specific pediatric age group. */
export function getComparisonsByAgeGroup(
  ageGroup: PediatricAgeGroup,
): ReadonlyArray<EcgAdultPediatricComparison> {
  return ECG_ADULT_PEDIATRIC_COMPARISONS.filter((c) => c.pediatricAgeGroup === ageGroup);
}

/** Return all comparisons featuring a specific adult rhythm key. */
export function getComparisonsByAdultRhythm(
  rhythmKey: string,
): ReadonlyArray<EcgAdultPediatricComparison> {
  return ECG_ADULT_PEDIATRIC_COMPARISONS.filter(
    (c) => c.adult.config.rhythmKey === rhythmKey,
  );
}
