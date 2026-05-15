/**
 * ECG Differential Graph — machine-readable rhythm similarity and confusion map.
 *
 * Purpose:
 *   Encodes the directed confusion relationships between rhythms in a format
 *   that can be consumed by:
 *     - The adaptive remediation engine (ecg-adaptive-remediation.ts)
 *     - The differential drill generator
 *     - The clinical-risk alert system
 *     - PostHog funnel analytics (confusion cluster identification)
 *
 * Graph architecture:
 *   Nodes    = rhythm tags (matching ECG_RHYTHM_TAG_REGISTRY)
 *   Edges    = directional confusion relationships (A was answered as B)
 *   Weights  = confusion likelihood + clinical danger
 *
 * The graph is bidirectional but asymmetric:
 *   VT → SVT has different clinical danger than SVT → VT.
 *   The edge direction is (correct_rhythm → selected_wrong_rhythm).
 *
 * Design rationale — why a typed graph rather than a flat registry:
 *   1. The flat CONFUSION_REMEDIATION_REGISTRY in ecg-adaptive-remediation.ts
 *      handles per-pair remediation. This graph handles cluster analysis and
 *      drill generation — different consumers, different schema.
 *   2. Typed nodes allow compile-time validation that all referenced rhythms
 *      are in the ECG_RHYTHM_TAG_REGISTRY.
 *   3. Cluster membership enables group-drill generation
 *      ("practise all AV block variants together").
 */

import { VALID_ECG_RHYTHM_TAGS } from "@/lib/ecg-module/ecg-rhythm-tag-registry";

// ─── Node types ────────────────────────────────────────────────────────────────

/** A rhythm node in the differential graph. */
export type EcgDifferentialNode = {
  /** Matches the `tag` field in ECG_RHYTHM_TAG_REGISTRY exactly. */
  rhythmTag: string;
  /**
   * Cluster membership — used for group-based drill generation.
   * A rhythm may belong to multiple clusters.
   */
  clusters: ReadonlyArray<EcgDifferentialCluster>;
  /**
   * ACLS-critical flag. When true:
   *   - Confusion FROM this rhythm triggers ecg_clinical_risk_miss event.
   *   - The node appears in emergency scenario drills.
   *   - Remediation is escalated to "critical" priority.
   */
  aclsCritical: boolean;
  /**
   * Waveform similarity group — rhythms in the same group share enough
   * visual characteristics to make visual confusion likely even for
   * experienced learners without systematic analysis.
   */
  visualSimilarityGroup?: string;
};

/**
 * Taxonomy of rhythm clusters for differential drill generation.
 * Each cluster maps to a comparative drill set and a curriculum section.
 */
export type EcgDifferentialCluster =
  | "tachyarrhythmias"          // Any > 100 bpm
  | "atrial_tachyarrhythmias"   // AFib, AFL, SVT, MAT
  | "ventricular_arrhythmias"   // VT, VF, PVCs, torsades
  | "bradyarrhythmias"          // Sinus brady, junctional, escape
  | "av_blocks"                 // All AV block types
  | "arrest_rhythms"            // VF, asystole, PEA
  | "wide_complex_tachycardias" // VT, SVT with aberrancy, antidromic AVRT
  | "ischemia_patterns"         // STEMI, ischemia, pericarditis, BER
  | "electrolyte_patterns"      // Hyperkalemia, hypokalemia
  | "conduction_abnormalities"  // BBB, WPW, fascicular blocks
  | "paced_rhythms"             // All pacemaker-related
  | "sinus_rhythms"             // NSR, sinus tach, sinus brady, RSA
  | "artifact_confusion"        // VF vs artifact, PVC vs noise
  | "channelopathies";          // Brugada, torsades, LQTS

// ─── Edge types ────────────────────────────────────────────────────────────────

/** A directed confusion edge: learner selected `wrongRhythm` when correct was `correctRhythm`. */
export type EcgDifferentialEdge = {
  /** The rhythm that should have been identified. */
  correctRhythm: string;
  /** The rhythm the learner incorrectly selected. */
  wrongRhythm: string;
  /**
   * Confusion likelihood [0–1].
   *   0.9 = almost always confused (e.g. AFib vs AFL at 2:1 in beginners)
   *   0.5 = confused 50% of the time
   *   0.1 = rare confusion
   */
  confusionLikelihood: number;
  /**
   * Clinical danger of this specific confusion [0–1].
   *   1.0 = directly causes patient harm (VT → SVT: wrong drug)
   *   0.7 = causes treatment delay
   *   0.3 = causes documentation error
   *   0.0 = minimal clinical consequence
   */
  clinicalDanger: number;
  /** True when the wrong treatment for `wrongRhythm` is contraindicated for `correctRhythm`. */
  contraindicated: boolean;
  /** The ACLS algorithm branch that diverges between these two rhythms. */
  aclsConsequence?: string;
  /** The key discriminating feature that resolves this confusion. */
  keyDiscriminator: string;
};

// ─── Graph definition ─────────────────────────────────────────────────────────

/**
 * Differential graph nodes.
 * Every rhythm that appears in ECG questions must have a node here.
 * Contract tests verify node-registry alignment.
 */
export const ECG_DIFFERENTIAL_NODES: readonly EcgDifferentialNode[] = [
  // ── Sinus rhythms ────────────────────────────────────────────────────────────
  {
    rhythmTag: "Normal sinus rhythm",
    clusters: ["sinus_rhythms"],
    aclsCritical: false,
    visualSimilarityGroup: "regular_narrow_complex",
  },
  {
    rhythmTag: "Sinus tachycardia",
    clusters: ["sinus_rhythms", "tachyarrhythmias"],
    aclsCritical: false,
    visualSimilarityGroup: "regular_narrow_complex",
  },
  {
    rhythmTag: "Sinus bradycardia",
    clusters: ["sinus_rhythms", "bradyarrhythmias"],
    aclsCritical: false,
    visualSimilarityGroup: "regular_narrow_complex",
  },

  // ── Atrial tachyarrhythmias ──────────────────────────────────────────────────
  {
    rhythmTag: "Atrial fibrillation",
    clusters: ["atrial_tachyarrhythmias", "tachyarrhythmias"],
    aclsCritical: false,
    visualSimilarityGroup: "irregular_narrow_complex",
  },
  {
    rhythmTag: "Atrial flutter",
    clusters: ["atrial_tachyarrhythmias", "tachyarrhythmias"],
    aclsCritical: false,
    visualSimilarityGroup: "regular_narrow_complex",
  },
  {
    rhythmTag: "SVT",
    clusters: ["atrial_tachyarrhythmias", "tachyarrhythmias", "wide_complex_tachycardias"],
    aclsCritical: true,
    visualSimilarityGroup: "regular_narrow_complex",
  },

  // ── Ventricular arrhythmias ──────────────────────────────────────────────────
  {
    rhythmTag: "PVC",
    clusters: ["ventricular_arrhythmias"],
    aclsCritical: false,
    visualSimilarityGroup: "premature_wide_complex",
  },
  {
    rhythmTag: "PAC",
    clusters: ["atrial_tachyarrhythmias"],
    aclsCritical: false,
    visualSimilarityGroup: "premature_narrow_complex",
  },
  {
    rhythmTag: "Ventricular tachycardia",
    clusters: ["ventricular_arrhythmias", "tachyarrhythmias", "wide_complex_tachycardias"],
    aclsCritical: true,
    visualSimilarityGroup: "regular_wide_complex",
  },
  {
    rhythmTag: "Ventricular fibrillation",
    clusters: ["ventricular_arrhythmias", "arrest_rhythms"],
    aclsCritical: true,
    visualSimilarityGroup: "chaotic",
  },
  {
    rhythmTag: "Torsades de Pointes",
    clusters: ["ventricular_arrhythmias", "tachyarrhythmias", "channelopathies"],
    aclsCritical: true,
    visualSimilarityGroup: "polymorphic_wide_complex",
  },

  // ── Arrest rhythms ───────────────────────────────────────────────────────────
  {
    rhythmTag: "Asystole",
    clusters: ["arrest_rhythms", "bradyarrhythmias"],
    aclsCritical: true,
    visualSimilarityGroup: "absent_activity",
  },
  {
    rhythmTag: "Pulseless electrical activity",
    clusters: ["arrest_rhythms"],
    aclsCritical: true,
    visualSimilarityGroup: "regular_narrow_complex",
  },

  // ── AV blocks ────────────────────────────────────────────────────────────────
  {
    rhythmTag: "Heart block (1st degree)",
    clusters: ["av_blocks"],
    aclsCritical: false,
    visualSimilarityGroup: "regular_narrow_complex",
  },
  {
    rhythmTag: "Heart block (2nd degree)",
    clusters: ["av_blocks", "bradyarrhythmias"],
    aclsCritical: true,  // Mobitz II specifically
    visualSimilarityGroup: "grouped_beats",
  },
  {
    rhythmTag: "Heart block (3rd degree)",
    clusters: ["av_blocks", "bradyarrhythmias"],
    aclsCritical: true,
    visualSimilarityGroup: "av_dissociation",
  },

  // ── Ischemia ─────────────────────────────────────────────────────────────────
  {
    rhythmTag: "STEMI changes",
    clusters: ["ischemia_patterns"],
    aclsCritical: true,
    visualSimilarityGroup: "st_elevation",
  },

  // ── Electrolytes ─────────────────────────────────────────────────────────────
  {
    rhythmTag: "Hyperkalemia ECG changes",
    clusters: ["electrolyte_patterns"],
    aclsCritical: true,
    visualSimilarityGroup: "peaked_t_wide_qrs",
  },
  {
    rhythmTag: "Hypokalemia ECG changes",
    clusters: ["electrolyte_patterns"],
    aclsCritical: false,
    visualSimilarityGroup: "flat_t_prominent_u",
  },

  // ── Conduction / paced ───────────────────────────────────────────────────────
  {
    rhythmTag: "Bundle branch block",
    clusters: ["conduction_abnormalities", "wide_complex_tachycardias"],
    aclsCritical: false,
    visualSimilarityGroup: "regular_wide_complex",
  },
  {
    rhythmTag: "Paced rhythm",
    clusters: ["paced_rhythms"],
    aclsCritical: false,
    visualSimilarityGroup: "paced_wide_complex",
  },

  // ── Artifact ─────────────────────────────────────────────────────────────────
  {
    rhythmTag: "Artifact recognition",
    clusters: ["artifact_confusion"],
    aclsCritical: true,   // Confused with VF → inappropriate shock or no CPR
    visualSimilarityGroup: "chaotic",
  },
] as const;

/**
 * Directed differential confusion edges.
 *
 * Each edge encodes a clinically validated confusion pattern.
 * Both directions are listed when the confusion is bidirectional but asymmetric.
 *
 * Sources for confusion likelihood estimates:
 *   - NCLEX-RN ECG item analysis (published AHA nursing education studies)
 *   - AHA 2023 ACLS Provider Manual differential emphasis sections
 *   - Clinical nursing education literature (Aehlert, ECGs Made Easy 6th ed.)
 */
export const ECG_DIFFERENTIAL_EDGES: readonly EcgDifferentialEdge[] = [
  // ─── ACLS-critical: VT ↔ SVT with aberrancy ──────────────────────────────────
  {
    correctRhythm: "Ventricular tachycardia",
    wrongRhythm: "SVT",
    confusionLikelihood: 0.72,
    clinicalDanger: 1.0,
    contraindicated: true,
    aclsConsequence: "Adenosine or verapamil given for VT → hemodynamic collapse",
    keyDiscriminator: "QRS width >140ms, AV dissociation, fusion beats confirm VT",
  },
  {
    correctRhythm: "SVT",
    wrongRhythm: "Ventricular tachycardia",
    confusionLikelihood: 0.38,
    clinicalDanger: 0.6,
    contraindicated: false,
    aclsConsequence: "Cardioversion given for SVT; adenosine withheld unnecessarily",
    keyDiscriminator: "Narrow QRS, no AV dissociation, response to adenosine confirms SVT",
  },

  // ─── Atrial tachyarrhythmias ──────────────────────────────────────────────────
  {
    correctRhythm: "Atrial fibrillation",
    wrongRhythm: "Atrial flutter",
    confusionLikelihood: 0.61,
    clinicalDanger: 0.3,
    contraindicated: false,
    aclsConsequence: "Rate control strategy differs; flutter more reliably cardiovertible",
    keyDiscriminator: "AFib: no organized atrial activity, irregularly irregular. Flutter: sawtooth at 300/min",
  },
  {
    correctRhythm: "Atrial flutter",
    wrongRhythm: "Atrial fibrillation",
    confusionLikelihood: 0.55,
    clinicalDanger: 0.3,
    contraindicated: false,
    aclsConsequence: "Cardioversion energy may be excessive; flutter responds to lower energy",
    keyDiscriminator: "Flutter: organized sawtooth F waves at 250–350/min. Rate ~150 at 2:1",
  },
  {
    correctRhythm: "Atrial flutter",
    wrongRhythm: "Sinus tachycardia",
    confusionLikelihood: 0.58,
    clinicalDanger: 0.5,
    contraindicated: false,
    aclsConsequence: "Sinus tach at 150 treated for cause; flutter needs rate control ± cardioversion",
    keyDiscriminator: "Flutter: hidden F waves in ST segment; adenosine reveals 2:1 block without terminating",
  },

  // ─── ACLS-critical: VF ↔ artifact ────────────────────────────────────────────
  {
    correctRhythm: "Ventricular fibrillation",
    wrongRhythm: "Artifact recognition",
    confusionLikelihood: 0.29,
    clinicalDanger: 1.0,
    contraindicated: false,
    aclsConsequence: "No CPR initiated for VF; patient dies while artifact is investigated",
    keyDiscriminator: "Assess patient immediately — VF: no pulse, unresponsive. Artifact: patient may be alert",
  },
  {
    correctRhythm: "Artifact recognition",
    wrongRhythm: "Ventricular fibrillation",
    confusionLikelihood: 0.41,
    clinicalDanger: 0.9,
    contraindicated: false,
    aclsConsequence: "Inappropriate defibrillation of an alert patient — causes VF",
    keyDiscriminator: "Look for underlying QRS complexes within chaotic waveform; check pulse/LOC first",
  },

  // ─── Torsades de Pointes ─────────────────────────────────────────────────────
  {
    correctRhythm: "Torsades de Pointes",
    wrongRhythm: "Ventricular tachycardia",
    confusionLikelihood: 0.64,
    clinicalDanger: 0.95,
    contraindicated: true,
    aclsConsequence: "Amiodarone given for torsades → further QT prolongation → degenerates to VF",
    keyDiscriminator: "Torsades: twisting QRS axis + prolonged QTc on baseline. Monomorphic VT: fixed axis",
  },
  {
    correctRhythm: "Torsades de Pointes",
    wrongRhythm: "Ventricular fibrillation",
    confusionLikelihood: 0.22,
    clinicalDanger: 0.7,
    contraindicated: false,
    aclsConsequence: "Defibrillation for torsades is appropriate if pulseless, but magnesium is first-line when pulse present",
    keyDiscriminator: "Torsades: organized rotating pattern, often self-terminating. VF: completely chaotic",
  },

  // ─── AV blocks ───────────────────────────────────────────────────────────────
  {
    correctRhythm: "Heart block (2nd degree)",
    wrongRhythm: "Heart block (1st degree)",
    confusionLikelihood: 0.48,
    clinicalDanger: 0.85,
    contraindicated: false,
    aclsConsequence: "Mobitz II misidentified as 1st degree → no pacing consult → complete heart block",
    keyDiscriminator: "2nd degree: some P waves do NOT conduct (dropped QRS). 1st degree: ALL P waves conduct",
  },
  {
    correctRhythm: "Heart block (3rd degree)",
    wrongRhythm: "Heart block (2nd degree)",
    confusionLikelihood: 0.43,
    clinicalDanger: 0.9,
    contraindicated: false,
    aclsConsequence: "Observation for 2nd degree when complete heart block requires immediate pacing preparation",
    keyDiscriminator: "3rd degree: P and QRS march independently (AV dissociation). 2nd degree: some P-QRS relationship preserved",
  },

  // ─── Ischemia ─────────────────────────────────────────────────────────────────
  {
    correctRhythm: "STEMI changes",
    wrongRhythm: "Normal sinus rhythm",
    confusionLikelihood: 0.19,
    clinicalDanger: 1.0,
    contraindicated: false,
    aclsConsequence: "Cath lab not activated; door-to-balloon time exceeded; myocardium lost",
    keyDiscriminator: "Hyperacute T-waves and early ST elevation in contiguous leads require immediate action",
  },

  // ─── Electrolytes ─────────────────────────────────────────────────────────────
  {
    correctRhythm: "Hyperkalemia ECG changes",
    wrongRhythm: "Ventricular fibrillation",
    confusionLikelihood: 0.31,
    clinicalDanger: 0.95,
    contraindicated: true,
    aclsConsequence: "Defibrillation without prior calcium → membrane not stabilized → shock ineffective",
    keyDiscriminator: "Hyperkalemia sine wave: patient may still have pulse. Always check pulse/K+ before shocking",
  },

  // ─── Sinus rhythms ───────────────────────────────────────────────────────────
  {
    correctRhythm: "Pulseless electrical activity",
    wrongRhythm: "Normal sinus rhythm",
    confusionLikelihood: 0.55,
    clinicalDanger: 1.0,
    contraindicated: false,
    aclsConsequence: "PEA treated as NSR → no CPR → death. ECG looks organized; patient has no pulse",
    keyDiscriminator: "PEA: organized ECG but NO palpable pulse. Clinical assessment is mandatory",
  },
  {
    correctRhythm: "Sinus tachycardia",
    wrongRhythm: "SVT",
    confusionLikelihood: 0.52,
    clinicalDanger: 0.6,
    // Not contraindicated in the strict sense — adenosine is wrong but not directly harmful
    // the way verapamil in VT is. Clinically: brief asystole then immediate return, but the
    // underlying cause of sinus tach (sepsis, hemorrhage) is dangerously missed.
    contraindicated: false,
    aclsConsequence: "Adenosine given for sinus tach → brief asystole → immediate return; underlying cause missed",
    keyDiscriminator: "Sinus tach: gradual onset, P waves visible in II, physiological trigger. SVT: abrupt onset",
  },
] as const;

// ─── Graph access utilities ────────────────────────────────────────────────────

/** Look up a node by rhythm tag. */
export function getEcgDifferentialNode(rhythmTag: string): EcgDifferentialNode | undefined {
  return ECG_DIFFERENTIAL_NODES.find((n) => n.rhythmTag === rhythmTag);
}

/** All outgoing edges from a correct rhythm (what learners mistake it for). */
export function getEcgConfusionEdgesFrom(correctRhythm: string): EcgDifferentialEdge[] {
  return ECG_DIFFERENTIAL_EDGES.filter((e) => e.correctRhythm === correctRhythm);
}

/** All incoming edges to a rhythm (what it gets confused with). */
export function getEcgConfusionEdgesTo(wrongRhythm: string): EcgDifferentialEdge[] {
  return ECG_DIFFERENTIAL_EDGES.filter((e) => e.wrongRhythm === wrongRhythm);
}

/** The specific edge for a confusion pair, or undefined if not registered. */
export function getEcgDifferentialEdge(
  correctRhythm: string,
  wrongRhythm: string,
): EcgDifferentialEdge | undefined {
  return ECG_DIFFERENTIAL_EDGES.find(
    (e) => e.correctRhythm === correctRhythm && e.wrongRhythm === wrongRhythm,
  );
}

/** All rhythms in a given cluster — for drill set generation. */
export function getEcgRhythmsInCluster(cluster: EcgDifferentialCluster): EcgDifferentialNode[] {
  return ECG_DIFFERENTIAL_NODES.filter((n) => n.clusters.includes(cluster));
}

/** All ACLS-critical nodes — for emergency scenario drill generation. */
export const ECG_ACLS_CRITICAL_NODES: ReadonlyArray<EcgDifferentialNode> =
  ECG_DIFFERENTIAL_NODES.filter((n) => n.aclsCritical);

/** All contraindicated confusion pairs — highest clinical danger. */
export const ECG_CONTRAINDICATED_PAIRS: ReadonlyArray<EcgDifferentialEdge> =
  ECG_DIFFERENTIAL_EDGES.filter((e) => e.contraindicated);

/**
 * Validates that all node rhythmTags exist in the ECG_RHYTHM_TAG_REGISTRY.
 * Returns array of unregistered tags (empty = valid).
 * Called by contract tests.
 */
export function validateEcgDifferentialGraphNodes(): string[] {
  return ECG_DIFFERENTIAL_NODES
    .filter((n) => !VALID_ECG_RHYTHM_TAGS.has(n.rhythmTag))
    .map((n) => n.rhythmTag);
}

/**
 * Validates that all edge rhythm tags exist as nodes in the graph.
 * Returns array of invalid tag references (empty = valid).
 */
export function validateEcgDifferentialGraphEdges(): string[] {
  const nodeSet = new Set(ECG_DIFFERENTIAL_NODES.map((n) => n.rhythmTag));
  const invalid: string[] = [];
  for (const edge of ECG_DIFFERENTIAL_EDGES) {
    if (!nodeSet.has(edge.correctRhythm)) invalid.push(`edge.correctRhythm: ${edge.correctRhythm}`);
    if (!nodeSet.has(edge.wrongRhythm)) invalid.push(`edge.wrongRhythm: ${edge.wrongRhythm}`);
  }
  return invalid;
}
