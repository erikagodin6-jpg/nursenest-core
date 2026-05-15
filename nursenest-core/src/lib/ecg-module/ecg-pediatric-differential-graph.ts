/**
 * Pediatric ECG Differential Graph
 *
 * Maps confusion pairs specific to PEDIATRIC rhythm interpretation.
 * Separate from the adult differential graph (ecg-differential-graph.ts)
 * for two reasons:
 *
 *   1. Age-specific rate thresholds change the clinical significance of confusion.
 *      SVT vs sinus tachycardia at 220 bpm means something different in a 3-month-old
 *      than the same confusion at 180 bpm in an adult.
 *
 *   2. PALS management algorithms diverge from ACLS. Confusing VT with SVT in a
 *      child leads to wrong drug AND wrong energy dosing.
 *
 * Clinical danger scores are calibrated for the pediatric context:
 *   1.0 = immediately causes harm in a deteriorating child (wrong drug, wrong energy)
 *   0.8 = significant treatment delay in a time-critical scenario
 *   0.5 = incorrect family education or monitoring escalation error
 *
 * Architecture:
 *   - All rhythm tags reference PEDIATRIC_ECG_RHYTHM_REGISTRY (no adult tag mixing)
 *   - `palsConsequence` replaces `aclsConsequence` from adult graph
 *   - Governance: contract tests verify no pediatric nodes appear in adult graph
 */

import {
  VALID_PEDIATRIC_RHYTHM_TAGS,
  type PediatricAgeGroup,
} from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";

// ─── Node types ─────────────────────────────────────────────────────────────────

export type PediatricDifferentialCluster =
  | "pals_tachyarrhythmias"         // SVT, VT, sinus tach — PALS tachycardia algorithm
  | "pals_arrest_rhythms"           // VF, asystole, PEA — PALS arrest algorithm
  | "pals_bradyarrhythmias"         // Sinus brady, hypoxic brady — PALS bradycardia algorithm
  | "pediatric_conduction_disorders"// CHB, 2nd-degree, JET — surgical/congenital context
  | "pediatric_normal_variants"     // RSA, isolated PAC/PVC — benign vs significant
  | "pediatric_channelopathies"     // LQTS, WPW — sudden death risk
  | "electrolyte_arrhythmias"       // Hyperkalemia patterns in children
  | "hemodynamic_deterioration";    // Rhythms associated with clinical deterioration

export type PediatricDifferentialNode = {
  /** Exact tag from PEDIATRIC_ECG_RHYTHM_REGISTRY. */
  rhythmTag: string;
  clusters: ReadonlyArray<PediatricDifferentialCluster>;
  /** True = confusion FROM this node triggers clinical risk alert. */
  palsCritical: boolean;
  /** Age groups where this node is most clinically relevant. */
  primaryAgeGroups: ReadonlyArray<PediatricAgeGroup>;
};

export type PediatricDifferentialEdge = {
  correctRhythm: string;
  wrongRhythm: string;
  confusionLikelihood: number;
  clinicalDanger: number;
  contraindicated: boolean;
  /** The PALS algorithm step that diverges between these two rhythms. */
  palsConsequence?: string;
  keyDiscriminator: string;
  /**
   * Age group where this confusion is most hazardous.
   * Some confusions are more dangerous in infants (SVT vs sinus tach)
   * than in adolescents.
   */
  mostDangerousInAgeGroup?: PediatricAgeGroup;
};

// ─── Graph nodes ────────────────────────────────────────────────────────────────

export const PEDIATRIC_DIFFERENTIAL_NODES: readonly PediatricDifferentialNode[] = [
  // RSA — physiologic variant; palsCritical=false, must not trigger arrhythmia alerts
  {
    rhythmTag: "Respiratory sinus arrhythmia",
    clusters: ["pediatric_normal_variants"],
    palsCritical: false,
    primaryAgeGroups: ["infant", "toddler", "child", "adolescent"],
  },
  {
    rhythmTag: "Pediatric SVT",
    clusters: ["pals_tachyarrhythmias"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant", "toddler"],
  },
  {
    rhythmTag: "Pediatric sinus tachycardia",
    clusters: ["pals_tachyarrhythmias"],
    palsCritical: false,
    primaryAgeGroups: ["neonate", "infant", "toddler", "child"],
  },
  {
    rhythmTag: "Pediatric VT",
    clusters: ["pals_tachyarrhythmias", "pals_arrest_rhythms"],
    palsCritical: true,
    primaryAgeGroups: ["child", "adolescent"],
  },
  {
    rhythmTag: "Pediatric VF",
    clusters: ["pals_arrest_rhythms"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
  },
  {
    rhythmTag: "Pediatric asystole",
    clusters: ["pals_arrest_rhythms"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
  },
  {
    rhythmTag: "Pediatric PEA",
    clusters: ["pals_arrest_rhythms", "hemodynamic_deterioration"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
  },
  {
    rhythmTag: "Pediatric sinus bradycardia",
    clusters: ["pals_bradyarrhythmias"],
    palsCritical: false,
    primaryAgeGroups: ["neonate", "infant"],
  },
  {
    rhythmTag: "Pediatric hypoxic bradycardia",
    clusters: ["pals_bradyarrhythmias", "hemodynamic_deterioration"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant", "toddler"],
  },
  {
    rhythmTag: "Pediatric complete heart block",
    clusters: ["pediatric_conduction_disorders"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant"],
  },
  {
    rhythmTag: "Respiratory sinus arrhythmia",
    clusters: ["pediatric_normal_variants"],
    palsCritical: false,
    primaryAgeGroups: ["infant", "toddler", "child"],
  },
  {
    rhythmTag: "Pediatric PAC",
    clusters: ["pediatric_normal_variants"],
    palsCritical: false,
    primaryAgeGroups: ["neonate", "infant"],
  },
  {
    rhythmTag: "Pediatric PVC",
    clusters: ["pediatric_normal_variants"],
    palsCritical: false,
    primaryAgeGroups: ["child", "adolescent"],
  },
  {
    rhythmTag: "Pediatric long QT / torsades risk",
    clusters: ["pediatric_channelopathies", "pals_arrest_rhythms"],
    palsCritical: true,
    primaryAgeGroups: ["child", "adolescent"],
  },
  {
    rhythmTag: "Pediatric WPW / pre-excitation",
    clusters: ["pediatric_channelopathies", "pals_tachyarrhythmias"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant", "toddler", "child"],
  },
  {
    rhythmTag: "Pediatric junctional rhythm",
    clusters: ["pediatric_conduction_disorders", "pals_tachyarrhythmias"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant"],
  },
  {
    rhythmTag: "Post-op congenital heart telemetry pattern",
    clusters: ["pediatric_conduction_disorders"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant", "toddler"],
  },
  // Second-degree AV block — confusion target from CHB and post-op patterns
  {
    rhythmTag: "Pediatric second-degree AV block",
    clusters: ["pediatric_conduction_disorders"],
    palsCritical: true,
    primaryAgeGroups: ["neonate", "infant", "toddler", "child"],
  },
];

// ─── Differential confusion edges ───────────────────────────────────────────────

export const PEDIATRIC_DIFFERENTIAL_EDGES: readonly PediatricDifferentialEdge[] = [

  // ── SVT vs sinus tachycardia (THE most important pediatric ECG differential) ──

  {
    correctRhythm: "Pediatric SVT",
    wrongRhythm: "Pediatric sinus tachycardia",
    confusionLikelihood: 0.75,
    clinicalDanger: 0.95,
    contraindicated: false,
    palsConsequence:
      "Failure to recognize SVT means no vagal maneuvers or adenosine — tachycardia persists, " +
      "cardiac output falls, child deteriorates toward shock. In an infant, SVT > 24 hours " +
      "untreated can cause cardiomyopathy.",
    keyDiscriminator:
      "Rate > 220 bpm in infant = SVT until proven otherwise. Sinus tach rate varies " +
      "with crying/stimulation; SVT rate is fixed regardless of state.",
    mostDangerousInAgeGroup: "infant",
  },
  {
    correctRhythm: "Pediatric sinus tachycardia",
    wrongRhythm: "Pediatric SVT",
    confusionLikelihood: 0.45,
    clinicalDanger: 0.85,
    contraindicated: true,
    palsConsequence:
      "Cardioverting sinus tachycardia is dangerous: it sedates the child unnecessarily, " +
      "may worsen hemodynamics, and fails to treat the underlying cause (fever, hypovolemia).",
    keyDiscriminator:
      "Sinus tach has identifiable P-waves before every QRS and rate correlates with distress. " +
      "If rate drops when child settles/is comforted, it is almost certainly sinus.",
    mostDangerousInAgeGroup: "infant",
  },

  // ── Bradycardia: hypoxic vs primary conduction ────────────────────────────────

  {
    correctRhythm: "Pediatric hypoxic bradycardia",
    wrongRhythm: "Pediatric sinus bradycardia",
    confusionLikelihood: 0.60,
    clinicalDanger: 1.0,
    contraindicated: true,
    palsConsequence:
      "Treating hypoxic bradycardia as simple sinus bradycardia means NOT ventilating first. " +
      "Child arrests within minutes if hypoxia is not corrected.",
    keyDiscriminator:
      "Hypoxic bradycardia: SpO₂ falling, respiratory distress, decreasing responsiveness. " +
      "Ventilate first — if bradycardia resolves with oxygenation, the cause was hypoxia.",
    mostDangerousInAgeGroup: "infant",
  },
  {
    correctRhythm: "Pediatric hypoxic bradycardia",
    wrongRhythm: "Pediatric complete heart block",
    confusionLikelihood: 0.30,
    clinicalDanger: 0.80,
    contraindicated: false,
    palsConsequence:
      "Assuming CHB instead of hypoxic etiology leads to pacing workup delay while " +
      "child remains hypoxic. Correct oxygenation first, then evaluate conduction.",
    keyDiscriminator:
      "Hypoxic bradycardia resolves with oxygenation. CHB shows AV dissociation (P-waves march " +
      "at different rate from QRS) and does not respond to O₂.",
    mostDangerousInAgeGroup: "neonate",
  },

  // ── VT vs SVT in children ─────────────────────────────────────────────────────

  {
    correctRhythm: "Pediatric VT",
    wrongRhythm: "Pediatric SVT",
    confusionLikelihood: 0.50,
    clinicalDanger: 0.90,
    contraindicated: false,
    palsConsequence:
      "Adenosine given for VT is less dangerous than in adults (lower dose), but delays " +
      "correct management (amiodarone or defibrillation for pulseless VT).",
    keyDiscriminator:
      "Wide QRS (> 0.09s in neonates, > 0.10s in children) = VT until proven otherwise. " +
      "Narrow-complex tachycardia is more likely SVT.",
    mostDangerousInAgeGroup: "child",
  },
  {
    correctRhythm: "Pediatric VT",
    wrongRhythm: "Pediatric junctional rhythm",
    confusionLikelihood: 0.35,
    clinicalDanger: 0.85,
    contraindicated: true,
    palsConsequence:
      "Post-op JET confused for VT: synchronized cardioversion for JET is ineffective and causes " +
      "unnecessary hemodynamic stress. JET requires cooling and antiarrhythmic, not shock.",
    keyDiscriminator:
      "JET: near-narrow QRS with subtle AV dissociation. History of recent cardiac surgery. " +
      "Does not terminate with adenosine or cardioversion.",
    mostDangerousInAgeGroup: "neonate",
  },

  // ── Arrest rhythms ───────────────────────────────────────────────────────────

  {
    correctRhythm: "Pediatric VF",
    wrongRhythm: "Pediatric asystole",
    confusionLikelihood: 0.30,
    clinicalDanger: 1.0,
    contraindicated: true,
    palsConsequence:
      "Calling VF asystole means NOT defibrillating. Fine VF is shockable and potentially " +
      "reversible. Missing this costs the child their best chance at ROSC.",
    keyDiscriminator:
      "Confirm in two leads. Fine VF has low-amplitude chaotic activity. " +
      "True asystole is flat in all leads.",
    mostDangerousInAgeGroup: "child",
  },
  {
    correctRhythm: "Pediatric PEA",
    wrongRhythm: "Pediatric VF",
    confusionLikelihood: 0.20,
    clinicalDanger: 1.0,
    contraindicated: true,
    palsConsequence:
      "Defibrillating PEA delivers a shock to an already organized but ineffective rhythm " +
      "while delaying CPR. PEA requires CPR + reversible cause treatment.",
    keyDiscriminator:
      "PEA is diagnosed by PULSE CHECK, not the ECG. Always check pulse before deciding to defibrillate.",
    mostDangerousInAgeGroup: "infant",
  },

  // ── Normal variants vs arrhythmias ───────────────────────────────────────────

  {
    correctRhythm: "Respiratory sinus arrhythmia",
    wrongRhythm: "Pediatric second-degree AV block",
    confusionLikelihood: 0.45,
    clinicalDanger: 0.55,
    contraindicated: false,
    palsConsequence:
      "Incorrectly diagnosing RSA as AV block leads to unnecessary monitoring escalation, " +
      "repeat ECGs, cardiology consults, and family anxiety.",
    keyDiscriminator:
      "RSA: P-wave morphology is consistently sinus, rate change is smooth and respiratory-correlated. " +
      "AV block: group beating, dropped QRS, non-respiratory pattern.",
    mostDangerousInAgeGroup: "infant",
  },
  {
    correctRhythm: "Pediatric PAC",
    wrongRhythm: "Pediatric second-degree AV block",
    confusionLikelihood: 0.35,
    clinicalDanger: 0.60,
    contraindicated: false,
    palsConsequence:
      "Misidentifying a blocked PAC as 2nd-degree AV block leads to unnecessary pacing evaluation.",
    keyDiscriminator:
      "Blocked PAC: look for premature P-wave before the pause. Wenckebach: progressive PR, " +
      "then no P-wave before dropped beat.",
    mostDangerousInAgeGroup: "neonate",
  },

  // ── LQTS / channelopathies ────────────────────────────────────────────────────

  {
    correctRhythm: "Pediatric long QT / torsades risk",
    wrongRhythm: "Pediatric VT",
    confusionLikelihood: 0.40,
    clinicalDanger: 0.80,
    contraindicated: false,
    palsConsequence:
      "Treating torsades with amiodarone (for regular VT) is less effective than magnesium. " +
      "IV magnesium is first-line for torsades; amiodarone may worsen QT prolongation.",
    keyDiscriminator:
      "Torsades: polymorphic axis twisting around the isoelectric line. QTc prolonged on " +
      "preceding sinus beats. Monomorphic VT has consistent QRS axis.",
    mostDangerousInAgeGroup: "adolescent",
  },
  {
    correctRhythm: "Pediatric WPW / pre-excitation",
    wrongRhythm: "Pediatric VT",
    confusionLikelihood: 0.40,
    clinicalDanger: 0.85,
    contraindicated: false,
    palsConsequence:
      "Antidromic AVRT (wide-complex WPW SVT) can look like VT. If cardioverted correctly, " +
      "this is fine. The danger is treating AFib with WPW as regular VT and using " +
      "AV-nodal blockers that cause rapid accessory pathway conduction.",
    keyDiscriminator:
      "WPW: short PR + delta wave on baseline ECG. Pre-excited AFib is irregular. " +
      "Antidromic AVRT is regular. VT history in structural heart disease.",
    mostDangerousInAgeGroup: "adolescent",
  },

  // ── RSA vs pathologic rhythms (false-positive escalation pairs) ─────────────
  // clinicalDanger is lower because RSA itself never directly harms the patient.
  // The danger is UNNECESSARY intervention (sedation, cardioversion, workup) or
  // delayed discharge from over-investigation of a normal finding.

  // RSA vs PAC run (most common confuser in ambulatory/outpatient pediatric ECG reads)
  // Note: adult AFib is not a valid PEDIATRIC_ECG_RHYTHM_REGISTRY tag; the confusion
  // is expressed through Pediatric PAC (clustered PACs can mimic irregular rhythm).
  {
    correctRhythm: "Respiratory sinus arrhythmia",
    wrongRhythm: "Pediatric PAC",
    confusionLikelihood: 0.55,
    clinicalDanger: 0.40,
    contraindicated: false,
    palsConsequence:
      "Calling clustered RSA variation 'PACs' or irregular atrial rhythm triggers " +
      "unnecessary monitoring escalation, Holter referral, and family anxiety in a healthy child.",
    keyDiscriminator:
      "RSA: smooth R-R variation tied to respiration, all P-waves identical, no early beats. " +
      "PAC: one beat arrives early with a morphologically distinct P-wave; R-R irregularity is abrupt not gradual.",
    mostDangerousInAgeGroup: "child",
  },
  {
    correctRhythm: "Respiratory sinus arrhythmia",
    wrongRhythm: "Pediatric PAC",
    confusionLikelihood: 0.50,
    clinicalDanger: 0.30,
    contraindicated: false,
    palsConsequence:
      "Calling RSA 'PACs' triggers unnecessary monitoring escalation and cardiac workup. " +
      "Neonatal PAC surveillance protocols may be incorrectly initiated for a healthy child.",
    keyDiscriminator:
      "RSA: all QRS complexes arrive with progressively varying timing; every P-wave is identical. " +
      "PACs: one beat arrives EARLY with a morphologically distinct P-wave.",
    mostDangerousInAgeGroup: "infant",
  },
  {
    correctRhythm: "Respiratory sinus arrhythmia",
    wrongRhythm: "Pediatric second-degree AV block",
    confusionLikelihood: 0.35,
    clinicalDanger: 0.40,
    contraindicated: false,
    palsConsequence:
      "Diagnosing RSA as 2nd-degree AV block triggers pacing evaluation and cardiology consult. " +
      "The key difference: RSA never drops a QRS complex.",
    keyDiscriminator:
      "RSA: no dropped beats — every P-wave is followed by a QRS. " +
      "2nd-degree AV block: P-waves occur without QRS complexes (dropped beats).",
    mostDangerousInAgeGroup: "child",
  },
  {
    correctRhythm: "Respiratory sinus arrhythmia",
    wrongRhythm: "Pediatric sinus bradycardia",
    confusionLikelihood: 0.40,
    clinicalDanger: 0.20,
    contraindicated: false,
    keyDiscriminator:
      "RSA's slowest rate during expiration may be mis-measured as bradycardia. " +
      "Obtain the rate during inspiration — if normal, it is RSA, not bradycardia.",
    mostDangerousInAgeGroup: "adolescent",
  },
  {
    correctRhythm: "Respiratory sinus arrhythmia",
    wrongRhythm: "Post-op congenital heart telemetry pattern",
    confusionLikelihood: 0.20,
    clinicalDanger: 0.35,
    contraindicated: false,
    palsConsequence:
      "Mistaking RSA for post-op rhythm abnormality in a cardiac surgery patient delays " +
      "discharge and may prompt unnecessary intervention.",
    keyDiscriminator:
      "RSA: smooth sinusoidal variation exactly correlated with breathing. " +
      "Post-op rhythms: AV dissociation, junctional rates, or irregular changes not synchronized with respiration.",
    mostDangerousInAgeGroup: "toddler",
  },
];

// ─── PALS-critical contraindicated pairs ────────────────────────────────────────

/**
 * Pairs where the wrong management for `wrongRhythm` is actively CONTRAINDICATED
 * for `correctRhythm`. These pairs trigger P1 clinical risk alerts.
 */
export const PALS_CONTRAINDICATED_CONFUSION_PAIRS = PEDIATRIC_DIFFERENTIAL_EDGES
  .filter((e) => e.contraindicated);

// ─── Validation helpers ─────────────────────────────────────────────────────────

export function validatePediatricDifferentialGraphNodes(): string[] {
  const errors: string[] = [];
  for (const node of PEDIATRIC_DIFFERENTIAL_NODES) {
    if (!VALID_PEDIATRIC_RHYTHM_TAGS.has(node.rhythmTag)) {
      errors.push(
        `Node "${node.rhythmTag}" is not in PEDIATRIC_ECG_RHYTHM_REGISTRY`,
      );
    }
  }
  return errors;
}

export function validatePediatricDifferentialGraphEdges(): string[] {
  const nodeSet = new Set(PEDIATRIC_DIFFERENTIAL_NODES.map((n) => n.rhythmTag));
  const errors: string[] = [];
  for (const edge of PEDIATRIC_DIFFERENTIAL_EDGES) {
    if (!nodeSet.has(edge.correctRhythm)) {
      errors.push(`Edge correctRhythm "${edge.correctRhythm}" has no node in graph`);
    }
    if (!nodeSet.has(edge.wrongRhythm)) {
      errors.push(`Edge wrongRhythm "${edge.wrongRhythm}" has no node in graph`);
    }
    if (edge.clinicalDanger < 0 || edge.clinicalDanger > 1) {
      errors.push(`Edge "${edge.correctRhythm}→${edge.wrongRhythm}" clinicalDanger out of [0,1]`);
    }
  }
  return errors;
}

export function getPediatricDifferentialNode(
  tag: string,
): PediatricDifferentialNode | undefined {
  return PEDIATRIC_DIFFERENTIAL_NODES.find((n) => n.rhythmTag === tag);
}

export function getPediatricConfusionEdgesFrom(
  correctRhythm: string,
): PediatricDifferentialEdge[] {
  return PEDIATRIC_DIFFERENTIAL_EDGES.filter((e) => e.correctRhythm === correctRhythm);
}

/** All rhythm tags in the pediatric differential graph. */
export const PEDIATRIC_GRAPH_RHYTHM_TAGS: ReadonlySet<string> = new Set(
  PEDIATRIC_DIFFERENTIAL_NODES.map((n) => n.rhythmTag),
);
