/**
 * Ventilator Waveform Template Library
 *
 * Authoritative preset registry for every teaching scenario.
 * Each template bundles:
 *   - A VentWaveformConfig (the physiology parameters)
 *   - Educational metadata (what to look for, why it matters, NCLEX/RT traps)
 *   - Profession scope (which learner pathways this template surfaces in)
 *
 * Templates are categorized into:
 *   1. Normal mode library — reference waveforms per ventilator mode
 *   2. Condition library — pathophysiology changes (resistance, compliance, leaks)
 *   3. Asynchrony library — patient-ventilator dyssynchrony patterns
 *
 * Template keys are stable identifiers used in routes, lesson content, and analytics.
 */

import type { VentWaveformConfig, VentMode, VentCondition, VentAsynchrony } from "./vent-waveform-generator";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type VentTemplateCategory =
  | "normal_mode"
  | "condition"
  | "asynchrony";

export type VentTemplateProfession =
  | "rt"      // Respiratory Therapist — full waveform analysis
  | "rn"      // Registered Nurse — recognition + escalation
  | "new_grad"
  | "np"      // Nurse Practitioner — interpretation + management
  | "critical_care"
  | "emergency"
  | "paramedic";

export type VentTemplate = {
  key: string;
  label: string;
  category: VentTemplateCategory;
  config: VentWaveformConfig;

  // ── Educational metadata ──────────────────────────────────────────────────────
  /** One-sentence description of what this waveform represents */
  summary: string;
  /** What to look for on the waveform */
  recognitionCriteria: string[];
  /** Underlying physiology */
  physiology: string;
  /** What the patient is experiencing */
  patientExperience: string;
  /** Clinical interventions to consider */
  interventions: string[];
  /** Common NCLEX/RT exam traps for this pattern */
  examTraps: string[];
  /** Danger level — guides visual urgency in the UI */
  urgency: "routine" | "monitor" | "act_now" | "emergency";

  professions: VentTemplateProfession[];
  /** Difficulty for learner routing */
  difficulty: "basic" | "intermediate" | "advanced";
  /** Whether this is a reference standard (appears in normal waveform library) */
  isReference?: boolean;
};

// ─── Helper ─────────────────────────────────────────────────────────────────────

function tpl(
  key: string,
  label: string,
  category: VentTemplateCategory,
  config: VentWaveformConfig,
  meta: Omit<VentTemplate, "key" | "label" | "category" | "config">,
): VentTemplate {
  return { key, label, category, config, ...meta };
}

// ─── 1. Normal Mode Library ─────────────────────────────────────────────────────

const vcSquare = tpl(
  "vc_square_normal",
  "Volume Control — Square Flow",
  "normal_mode",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 12,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "none",
  },
  {
    summary: "Volume control with constant square-wave inspiratory flow — the most common ICU mode.",
    recognitionCriteria: [
      "Pressure: step up at breath start (resistive), linear rise during inspiration, sharp drop at expiration",
      "Flow: flat square top during inspiration, exponential curve during expiration",
      "Volume: linear rise to set Vt, exponential return to zero",
      "PEEP line clearly visible at baseline",
    ],
    physiology:
      "The ventilator delivers a fixed flow rate throughout inspiration. Airway pressure rises as volume " +
      "accumulates against lung compliance. The step-up at the very start of inspiration reflects the " +
      "instantaneous resistive pressure (P = Flow × Raw).",
    patientExperience: "Fully ventilated patient with no respiratory drive. Passive inflation and deflation.",
    interventions: [],
    examTraps: [
      "The initial pressure step is caused by RESISTANCE, not compliance — key clinical distinction.",
      "Ppeak − Pplat = resistive pressure. Pplat − PEEP = elastic pressure (driving pressure).",
      "If Ppeak rises but Pplat stays the same → resistance problem (secretions, bronchospasm).",
      "If both Ppeak and Pplat rise → compliance problem (ARDS, pulmonary edema, pneumothorax).",
    ],
    urgency: "routine",
    professions: ["rt", "rn", "new_grad", "np", "critical_care", "emergency"],
    difficulty: "basic",
    isReference: true,
  },
);

const vcDecelerating = tpl(
  "vc_decel_normal",
  "Volume Control — Decelerating Flow",
  "normal_mode",
  {
    mode: "volume_control",
    flowPattern: "decelerating",
    peep: 5,
    tidalVolume: 500,
    rr: 12,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "none",
  },
  {
    summary: "Volume control with linearly decelerating (ramp-down) inspiratory flow — improves distribution.",
    recognitionCriteria: [
      "Flow: peaks at start of inspiration then ramps down to zero — triangular shape",
      "Pressure: rises and then levels off toward Ppeak as flow decreases",
      "Volume: curves upward (non-linear) then plateaus",
    ],
    physiology:
      "Peak flow is highest at the start of inspiration (resistive phase), tapering to zero at end-inspiration. " +
      "Lower mean flow improves gas distribution and may reduce peak pressures vs square wave.",
    patientExperience: "Same as square flow in a passive patient — patient cannot distinguish flow patterns.",
    interventions: [],
    examTraps: [
      "Decelerating flow does NOT change delivered Vt — same Vt, different flow profile.",
      "Peak pressure may be lower than with square flow (lower mean flow), but Pplat is unchanged.",
    ],
    urgency: "routine",
    professions: ["rt", "np", "critical_care"],
    difficulty: "intermediate",
    isReference: true,
  },
);

const pcNormal = tpl(
  "pc_normal",
  "Pressure Control — Normal",
  "normal_mode",
  {
    mode: "pressure_control",
    pip: 20,
    peep: 5,
    rr: 14,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "none",
  },
  {
    summary: "Pressure control ventilation — a constant pressure is delivered; volume varies with compliance.",
    recognitionCriteria: [
      "Pressure: rapid rise to set PIP, flat plateau across all of inspiration, sharp drop at expiration",
      "Flow: peaks immediately at breath start then decelerates exponentially — characteristic 'shark fin'",
      "Volume: rises in a curved (exponential) fashion, reflecting passive lung inflation",
      "Tidal volume is NOT fixed — it varies with compliance and resistance",
    ],
    physiology:
      "The ventilator maintains a set airway pressure. Inspiratory flow is driven by the pressure gradient " +
      "between circuit and lungs, decelerating as lung volume (and pressure) rises toward set PIP. " +
      "Volume delivered = Cst × (PIP − PEEP) × (1 − e^−t/τ).",
    patientExperience: "Passive, fully ventilated patient. Comfortable for patients with active drive if PS is added.",
    interventions: ["Monitor Vt — if compliance drops, Vt falls with same pressure setting."],
    examTraps: [
      "In PC mode, if lung compliance decreases (ARDS worsening), Vt DECREASES — must be monitored closely.",
      "The decelerating flow shape is NORMAL in pressure control — not a sign of problem.",
      "If Vt is too low, the clinician must INCREASE the pressure (PIP/driving pressure), not add volume.",
    ],
    urgency: "routine",
    professions: ["rt", "rn", "np", "critical_care", "emergency"],
    difficulty: "basic",
    isReference: true,
  },
);

const psNormal = tpl(
  "ps_normal",
  "Pressure Support — Normal",
  "normal_mode",
  {
    mode: "pressure_support",
    pressureSupport: 10,
    peep: 5,
    rr: 14,
    ti: 0.9,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "none",
  },
  {
    summary: "Pressure support ventilation — patient-triggered, pressure-targeted, flow-cycled breathing.",
    recognitionCriteria: [
      "Every breath is patient-triggered — look for a small pressure dip at the start of each breath",
      "Pressure: rises to PEEP + PS, held there, then drops when flow falls to ~25% of peak",
      "Flow: decelerating shape (like PC), but shorter and variable depending on patient effort",
      "Variable rate and Vt — changes with patient effort and respiratory drive",
    ],
    physiology:
      "The patient triggers each breath by generating a negative pressure or flow trigger. The ventilator " +
      "applies a set pressure boost above PEEP. The breath cycles off when inspiratory flow falls to the " +
      "cycling criterion (~25–30% of peak flow). This makes PS highly responsive to patient effort.",
    patientExperience:
      "Active participation — patient controls rate and, to a degree, Vt. More comfortable than controlled modes.",
    interventions: [
      "Adjust PS level to achieve target Vt (typically 6–8 mL/kg IBW).",
      "Too high PS → large Vt, dysynchrony; too low → fatigue.",
    ],
    examTraps: [
      "PS is flow-cycled, NOT time-cycled — the ventilator does NOT use a set Ti.",
      "If PS is too high, the patient may double-trigger or breath-stack.",
      "PS of 0 over CPAP = essentially unassisted spontaneous breathing through the circuit.",
    ],
    urgency: "routine",
    professions: ["rt", "rn", "np", "critical_care"],
    difficulty: "intermediate",
    isReference: true,
  },
);

const simvNormal = tpl(
  "simv_normal",
  "SIMV — Mandatory + Spontaneous",
  "normal_mode",
  {
    mode: "simv",
    tidalVolume: 500,
    pressureSupport: 8,
    peep: 5,
    rr: 10,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "none",
  },
  {
    summary: "Synchronized Intermittent Mandatory Ventilation — alternating mandatory and spontaneous breaths.",
    recognitionCriteria: [
      "Alternating breath morphology: mandatory breaths (larger, consistent Vt) vs spontaneous breaths (smaller, variable)",
      "Mandatory breaths: square flow (if VC-SIMV) with set Vt",
      "Spontaneous breaths: decelerating flow with PS support, smaller volume",
      "Rate lower than AC modes — patient must generate spontaneous breaths between mandatory ones",
    ],
    physiology:
      "The ventilator delivers a set number of mandatory breaths synchronized to patient effort. Between " +
      "mandatory breaths, the patient breathes spontaneously (often with PS added). SIMV is used for " +
      "weaning but has largely been replaced by PS-only modes in evidence-based practice.",
    patientExperience: "Mixed — mandatory breaths are fixed, spontaneous breaths feel more natural.",
    interventions: [],
    examTraps: [
      "SIMV does NOT prevent respiratory muscle work between mandatory breaths — muscles must work spontaneously.",
      "Studies show SIMV weaning is SLOWER than PS weaning for most patients.",
      "If spontaneous rate > set rate, the patient is doing significant work — may indicate need to wean PS up.",
    ],
    urgency: "routine",
    professions: ["rt", "rn", "np", "critical_care"],
    difficulty: "intermediate",
    isReference: true,
  },
);

const cpapNormal = tpl(
  "cpap_normal",
  "CPAP — Normal Spontaneous",
  "normal_mode",
  {
    mode: "cpap",
    peep: 8,
    rr: 14,
    ti: 0.9,
    tidalVolume: 400,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "none",
  },
  {
    summary: "Continuous Positive Airway Pressure — PEEP maintained; all breaths are spontaneous.",
    recognitionCriteria: [
      "Pressure oscillates around PEEP level — no set inspiratory pressure",
      "Flow: sinusoidal spontaneous pattern, no square or decelerating profile",
      "Volume: smaller, variable tidal volumes reflecting spontaneous effort",
      "Baseline pressure never drops to zero — PEEP maintained throughout",
    ],
    physiology:
      "CPAP maintains a constant positive pressure in the airway throughout the breathing cycle. " +
      "No mandatory breaths are delivered. The patient breathes entirely spontaneously against the PEEP baseline. " +
      "Increases FRC, recruits alveoli, improves V/Q matching.",
    patientExperience: "Awake and breathing spontaneously. May feel increased work of breathing if CPAP is too high.",
    interventions: ["Monitor for fatigue — if RR > 30 or SpO₂ declining, may need pressure support added."],
    examTraps: [
      "CPAP alone provides NO inspiratory assistance — unlike BiPAP or PS which add inspiratory pressure.",
      "CPAP is appropriate for sleep apnea, mild-moderate hypoxemia, weaning trials.",
      "On the ventilator: CPAP mode = PEEP only, no PS. BiPAP adds an inspiratory pressure level.",
    ],
    urgency: "routine",
    professions: ["rt", "rn", "np", "critical_care", "emergency"],
    difficulty: "basic",
    isReference: true,
  },
);

const bipapNormal = tpl(
  "bipap_normal",
  "BiPAP — Normal",
  "normal_mode",
  {
    mode: "bipap",
    pip: 18,
    pressureSupport: 10,
    peep: 5,
    rr: 14,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "none",
  },
  {
    summary: "Bilevel Positive Airway Pressure — two pressure levels (IPAP and EPAP) for NIV.",
    recognitionCriteria: [
      "Pressure oscillates between two levels: IPAP (inspiratory) and EPAP (expiratory/PEEP)",
      "Flow: decelerating during inspiration, passive expiration",
      "Variable Vt depending on driving pressure (IPAP − EPAP) and compliance",
    ],
    physiology:
      "BiPAP cycles between a higher inspiratory pressure (IPAP) and lower expiratory pressure (EPAP). " +
      "The difference (IPAP − EPAP) = pressure support. Used for NIV in COPD exacerbation, hypoxemic " +
      "respiratory failure, and post-extubation support.",
    patientExperience: "Mask interface — requires patient cooperation and tolerance.",
    interventions: [
      "Adjust IPAP for adequate Vt (5–7 mL/kg).",
      "Adjust EPAP for oxygenation (like PEEP).",
      "Minimize mask leak — use appropriate mask sizing.",
    ],
    examTraps: [
      "BiPAP IPAP ≈ CPAP + PS. EPAP = PEEP. The PS-equivalent is IPAP − EPAP.",
      "BiPAP does not require intubation — it is a non-invasive support mode.",
      "Contraindications: inability to protect airway, facial trauma, active vomiting.",
    ],
    urgency: "routine",
    professions: ["rt", "rn", "np", "emergency", "paramedic"],
    difficulty: "basic",
    isReference: true,
  },
);

const aprvNormal = tpl(
  "aprv_normal",
  "APRV — Airway Pressure Release Ventilation",
  "normal_mode",
  {
    mode: "aprv",
    pip: 25,
    peep: 0,
    rr: 10,
    ti: 5.0,
    compliance: 30,
    resistance: 5,
    condition: "ards",
    asynchrony: "none",
  },
  {
    summary: "APRV — long T_High hold with brief T_Low release. Used in severe ARDS for alveolar recruitment.",
    recognitionCriteria: [
      "Long high-pressure plateau (T_High 4–6 seconds) with small spontaneous oscillations superimposed",
      "Brief rapid pressure release (T_Low 0.4–0.8 s) — exponential expiratory flow",
      "T_Low is terminated before flow returns to zero — prevents de-recruitment",
    ],
    physiology:
      "APRV uses a prolonged high-pressure phase (T_High at P_High) interrupted by brief releases to P_Low. " +
      "Most ventilation occurs during the release phase. High mean airway pressure recruits collapsed " +
      "alveoli in ARDS. Spontaneous breathing during T_High improves distribution.",
    patientExperience:
      "Unusual breathing pattern. Spontaneous efforts during T_High are beneficial. Sedation requirements vary.",
    interventions: [
      "Set T_Low to terminate at 75% of peak expiratory flow (prevents de-recruitment).",
      "Monitor for auto-PEEP during T_Low.",
    ],
    examTraps: [
      "APRV T_Low is NOT 'breathing out fully' — it is deliberately cut short to maintain alveolar recruitment.",
      "P_Low is often set to ZERO in APRV (unlike standard PEEP) — the release drives the exhalation.",
      "Not appropriate for obstructive disease — insufficient T_Low time causes dangerous air trapping.",
    ],
    urgency: "monitor",
    professions: ["rt", "np", "critical_care"],
    difficulty: "advanced",
    isReference: true,
  },
);

// ─── 2. Condition Library ────────────────────────────────────────────────────────

const highResistance = tpl(
  "high_resistance",
  "High Airway Resistance — Bronchospasm",
  "condition",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 12,
    ti: 1.0,
    compliance: 60,
    resistance: 22,
    condition: "bronchospasm",
    asynchrony: "none",
  },
  {
    summary: "Bronchospasm causing high airway resistance — elevated Ppeak, normal Pplat, prolonged expiration.",
    recognitionCriteria: [
      "Pressure: HIGH Ppeak (may be 35–45 cmH₂O), but Pplat within normal range",
      "Large PIP–Pplat gap (> 10 cmH₂O) indicates resistance, not compliance",
      "Expiratory flow: prolonged, slow return to zero — long time constant",
      "Volume: normal inspiratory fill; prolonged expiratory decay",
    ],
    physiology:
      "Airway resistance is elevated (bronchospasm, secretions, kinked ETT). The resistive pressure drop " +
      "(Ppeak − Pplat) increases proportionally with resistance × flow. Expiratory time constant " +
      "τ = Raw × Cst is prolonged, slowing expiration and risking auto-PEEP.",
    patientExperience: "Increased work of breathing, wheezing, respiratory distress. May trigger fighting the ventilator.",
    interventions: [
      "Bronchodilators (albuterol, ipratropium) via MDI or nebulizer",
      "Consider systemic steroids",
      "Increase Te — lower RR or decrease Ti",
      "Ensure ETT is not kinked or obstructed — suction if secretions suspected",
    ],
    examTraps: [
      "High Ppeak alone does NOT mean ARDS — check Pplat to distinguish resistance vs compliance.",
      "If Pplat is normal with high Ppeak: RESIST the urge to decrease Vt — the problem is RESISTANCE.",
      "Bronchospasm waveform: prolonged exp flow is the FLOW trace finding, not just the pressure.",
    ],
    urgency: "act_now",
    professions: ["rt", "rn", "np", "critical_care", "emergency"],
    difficulty: "intermediate",
  },
);

const secretionObstruction = tpl(
  "secretion_obstruction",
  "Secretion Obstruction",
  "condition",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 12,
    ti: 1.0,
    compliance: 60,
    resistance: 18,
    condition: "secretion_obstruction",
    asynchrony: "none",
  },
  {
    summary: "Partial ETT/airway obstruction from secretions — gradual Ppeak rise, preserved Pplat.",
    recognitionCriteria: [
      "Gradually rising Ppeak over serial breaths",
      "Normal or mildly elevated Pplat — confirms resistance, not compliance issue",
      "Saw-tooth pattern may appear on pressure trace as secretions shift",
      "Expiratory flow prolonged, possibly irregular",
    ],
    physiology:
      "Secretions partially obstruct the ETT or large airways, increasing resistance. Unlike fixed bronchospasm, " +
      "secretion obstruction may show irregular waveform changes as mucus shifts with breaths.",
    patientExperience: "Increased secretion burden, ineffective cough through ETT.",
    interventions: [
      "Suction via ETT (inline or open)",
      "Increase humidification",
      "Chest physiotherapy",
      "Consider bronchoscopy if suction unsuccessful",
    ],
    examTraps: [
      "Saw-tooth waveform (irregular oscillations on flow trace) = secretions or water in circuit.",
      "Distinguish from bronchospasm: secretions may respond immediately to suction.",
    ],
    urgency: "act_now",
    professions: ["rt", "rn", "np", "critical_care"],
    difficulty: "intermediate",
  },
);

const ardsLowCompliance = tpl(
  "ards_low_compliance",
  "ARDS — Low Compliance",
  "condition",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 10,
    tidalVolume: 420,
    rr: 20,
    ti: 0.8,
    compliance: 22,
    resistance: 6,
    condition: "ards",
    asynchrony: "none",
  },
  {
    summary: "ARDS with severely reduced compliance — high peak AND plateau pressures with low Vt.",
    recognitionCriteria: [
      "Both Ppeak AND Pplat are elevated (> 30 cmH₂O Pplat in severe ARDS)",
      "Ppeak − Pplat difference may be NORMAL (resistance not elevated)",
      "Higher PEEP setting (lung-protective strategy)",
      "Smaller tidal volumes (4–6 mL/kg IBW target)",
      "Volume trace shows reduced expiratory return — stiff lungs retain less volume",
    ],
    physiology:
      "ARDS causes widespread alveolar flooding and collapse, dramatically reducing lung compliance. " +
      "The same volume requires much higher pressure. Plateau pressure > 30 cmH₂O risks ventilator-induced " +
      "lung injury (VILI). ARDSNet protocol: Vt 6 mL/kg, Pplat ≤ 30, PEEP titrated per FiO₂/SpO₂.",
    patientExperience: "Severe hypoxemia, bilateral infiltrates. Profoundly ill patient in respiratory failure.",
    interventions: [
      "Lung-protective ventilation: Vt 4–6 mL/kg IBW",
      "Keep Pplat ≤ 30 cmH₂O",
      "Optimize PEEP (FiO₂/PEEP table or bedside titration)",
      "Prone positioning for P/F ratio < 150",
      "Neuromuscular blockade if severe dyssynchrony",
    ],
    examTraps: [
      "In ARDS, you DECREASE Vt, accept permissive hypercapnia (pH > 7.20).",
      "Driving pressure (Pplat − PEEP) > 15 cmH₂O is independently associated with ARDS mortality.",
      "High PEEP in ARDS is THERAPEUTIC, not a problem — it prevents de-recruitment.",
    ],
    urgency: "emergency",
    professions: ["rt", "np", "critical_care"],
    difficulty: "advanced",
  },
);

const pneumothorax = tpl(
  "pneumothorax",
  "Pneumothorax",
  "condition",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 12,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    condition: "pneumothorax",
    asynchrony: "none",
  },
  {
    summary: "Tension pneumothorax developing — sudden rise in pressures, asymmetric breath sounds.",
    recognitionCriteria: [
      "Sudden rise in Ppeak AND Pplat (acute decrease in compliance)",
      "Waveform amplitude decreases on affected side (if unilateral monitoring)",
      "Rapidly rising peak pressure over sequential breaths",
      "Volume-pressure loop would show right-shift (more pressure for same volume)",
    ],
    physiology:
      "Air in the pleural space compresses the lung, reducing compliance. In tension pneumothorax, the mediastinum " +
      "shifts, compromising cardiac output as well. This is a life-threatening emergency requiring immediate needle " +
      "decompression.",
    patientExperience: "Sudden hemodynamic deterioration, tracheal deviation (late sign), hypotension, hypoxia.",
    interventions: [
      "Immediate needle decompression (2nd ICS, MCL) if tension PTX suspected",
      "Chest tube placement",
      "Disconnect from ventilator briefly if tension PTX during bag-mask ventilation",
    ],
    examTraps: [
      "Tension PTX causes BOTH resistance AND compliance changes — both Ppeak and Pplat rise.",
      "In ventilated patient: sudden rise in peak pressure + hemodynamic collapse = tension PTX until proven otherwise.",
      "Do NOT wait for CXR if hemodynamically unstable — treat empirically.",
    ],
    urgency: "emergency",
    professions: ["rt", "rn", "np", "critical_care", "emergency"],
    difficulty: "advanced",
  },
);

const circuitLeak = tpl(
  "circuit_leak",
  "Circuit Leak",
  "condition",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 12,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    condition: "circuit_leak",
    asynchrony: "none",
  },
  {
    summary: "Circuit leak — inspiratory volume > expiratory return, PEEP cannot be maintained.",
    recognitionCriteria: [
      "Volume: inspiratory volume ≠ expiratory volume (discrepancy = leak size)",
      "Pressure: baseline drifts below set PEEP — PEEP not maintained",
      "Flow: expiratory flow does not fully return to zero (air escaping)",
      "High-pressure alarm may NOT trigger — pressure can be low",
    ],
    physiology:
      "A leak in the circuit (disconnection, loose fitting, ETT cuff leak) allows delivered volume to " +
      "escape without passing through the expiratory limb sensor. The exhaled Vt reads lower than set Vt. " +
      "PEEP cannot be maintained in significant leaks.",
    patientExperience: "Audible air leak. May hear hissing from the mouth (ETT cuff leak). May desaturate.",
    interventions: [
      "Inspect entire circuit — all connections, humidifier, Y-piece",
      "Assess ETT cuff — measure cuff pressure (20–30 cmH₂O target)",
      "Reinflate cuff if needed (minimum occluding volume technique)",
      "Replace circuit if breach found",
    ],
    examTraps: [
      "Volume discrepancy on the waveform: exp Vt < insp Vt = LEAK (not airway obstruction).",
      "A slow cuff leak may only manifest as gradual PEEP loss and increasing high-RR alarms.",
      "ETT cuff leak is particularly common after repositioning or head of bed changes.",
    ],
    urgency: "act_now",
    professions: ["rt", "rn", "np", "critical_care"],
    difficulty: "intermediate",
  },
);

const autoPeepCondition = tpl(
  "auto_peep",
  "Auto-PEEP (Intrinsic PEEP / Air Trapping)",
  "condition",
  {
    // COPD-realistic parameters that naturally produce auto-PEEP:
    //   τ = Raw × Cst = 20 × 0.075 = 1.50 s
    //   Te = 60/20 − 1.0 = 2.0 s  →  Te/τ = 1.33  →  residual frac = exp(−1.33) ≈ 26%
    //   V_residual ≈ 500 × 0.26 = 130 mL  →  auto-PEEP ≈ 130/75 ≈ 1.7 cmH₂O (natural)
    //   autoPeep: 5 forces a larger, teachable display value for educational clarity.
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 20,
    ti: 1.0,
    compliance: 75,
    resistance: 20,
    autoPeep: 5,
    condition: "auto_peep",
    asynchrony: "none",
  },
  {
    summary: "Auto-PEEP from incomplete expiration — expiratory flow doesn't reach zero before next breath.",
    recognitionCriteria: [
      "FLOW trace: expiratory flow still active (not at zero) when next inspiration begins",
      "The flow-time trace shows the key finding: upstroke begins before baseline is reached",
      "Pressure baseline may appear elevated above set PEEP (intrinsic PEEP measurable on end-exp occlusion)",
      "Volume trace: lung volume above FRC at start of each new breath",
    ],
    physiology:
      "When τ (time constant) is long relative to expiratory time, lungs do not fully empty. Residual " +
      "volume creates intrinsic PEEP (auto-PEEP or PEEPi). This increases effective driving pressure " +
      "for triggering, causing ineffective triggers and breath stacking.",
    patientExperience:
      "Dynamic hyperinflation. May feel trapped, unable to trigger breaths. Hemodynamic compromise in severe cases.",
    interventions: [
      "Decrease RR — allow more expiratory time",
      "Shorten Ti (increase I:E toward 1:3 or 1:4)",
      "Treat underlying bronchospasm (bronchodilators)",
      "Consider reducing set PEEP (auto-PEEP is raising effective PEEP)",
      "Measure auto-PEEP with end-expiratory hold maneuver",
    ],
    examTraps: [
      "The MOST important sign of auto-PEEP is flow NOT returning to zero before next breath on the FLOW trace.",
      "Auto-PEEP cannot be seen on pressure trace alone without an expiratory hold.",
      "In COPD patients, auto-PEEP is the #1 cause of ineffective triggering.",
      "Adding extrinsic PEEP up to ~80% of auto-PEEP level can help by opening collapsed airways.",
    ],
    urgency: "act_now",
    professions: ["rt", "rn", "np", "critical_care", "emergency"],
    difficulty: "intermediate",
  },
);

// ─── 3. Asynchrony Library ────────────────────────────────────────────────────────

const flowStarvation = tpl(
  "flow_starvation",
  "Flow Starvation",
  "asynchrony",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 14,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "flow_starvation",
  },
  {
    summary: "Flow starvation — patient's inspiratory demand exceeds the set flow rate, causing pressure scooping.",
    recognitionCriteria: [
      "Pressure trace: SCOOPED or CONCAVE inward shape during inspiration (instead of rising linearly)",
      "The pressure dips below what physics would predict — patient is pulling harder than the vent delivers",
      "Flow: remains at set square-wave level, but patient demands more",
      "Volume: may be adequate but delivered asynchronously",
    ],
    physiology:
      "In VC square flow, the flow rate is fixed. If the patient's neural drive demands a higher flow than " +
      "set, they generate a larger negative pleural pressure. This lowers airway pressure, creating the " +
      "characteristic scooped pressure waveform. The patient is 'fighting the vent.'",
    patientExperience:
      "Dyspnea, air hunger, sensation of insufficient breath. Increased work of breathing. May agitate.",
    interventions: [
      "INCREASE the set flow rate (most direct fix)",
      "Switch to pressure-targeted mode (PC or PS) — pressure-targeted modes auto-adjust flow to demand",
      "Increase set Vt if patient demands larger breaths",
      "Assess and treat underlying cause of increased respiratory drive (pain, anxiety, metabolic acidosis)",
    ],
    examTraps: [
      "Scooped pressure waveform in VC = flow starvation (patient demand > set flow).",
      "Switching from VC to PC eliminates flow starvation because PC auto-adjusts flow.",
      "Flow starvation ≠ under-sedation alone — check vent settings FIRST before sedating.",
    ],
    urgency: "act_now",
    professions: ["rt", "rn", "np", "critical_care"],
    difficulty: "intermediate",
  },
);

const doubleTriggering = tpl(
  "double_triggering",
  "Double Triggering",
  "asynchrony",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 12,
    ti: 0.8,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "double_triggering",
  },
  {
    summary: "Double triggering — patient effort persists into expiration, triggering a second breath.",
    recognitionCriteria: [
      "Two consecutive breaths with very short interval between them",
      "The second breath begins during or immediately after expiration of the first",
      "Combined Vt of the two breaths may be double the set Vt — dangerous if Pplat is high",
      "On pressure trace: back-to-back inspiratory rises without adequate expiratory time",
    ],
    physiology:
      "Patient's neural Ti (inspiratory effort duration) is longer than the ventilator's set Ti. " +
      "After the first breath cycles off, the patient's neural effort continues and triggers a second " +
      "mandatory breath before full expiration. Delivered Vt can be 2× the set volume.",
    patientExperience: "Dyspnea, dyssynchrony, distress. Patient feels out of sync with ventilator.",
    interventions: [
      "LENGTHEN the ventilator Ti — match ventilator Ti to patient neural Ti",
      "Switch to PC or PS mode — modes adjust to patient effort timing",
      "If Vt stacking is causing high pressures: consider neuromuscular blockade in ARDS",
      "Reassess sedation/analgesia",
    ],
    examTraps: [
      "Double triggering is a TIME MISMATCH — ventilator Ti is too SHORT for patient effort.",
      "Results in breath stacking = large effective Vt = high Ppeak/Pplat = VILI risk.",
      "Double triggering is MOST dangerous in ARDS where you are trying to limit Vt.",
    ],
    urgency: "act_now",
    professions: ["rt", "np", "critical_care"],
    difficulty: "advanced",
  },
);

const ineffectiveTrigger = tpl(
  "ineffective_triggering",
  "Ineffective Triggering",
  "asynchrony",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 12,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    autoPeep: 5,
    condition: "auto_peep",
    asynchrony: "ineffective_triggering",
  },
  {
    summary: "Ineffective triggering — patient effort fails to trigger a breath; visible as deflection in expiratory trace.",
    recognitionCriteria: [
      "Flow trace: small upward deflection during expiration — patient effort that did not trigger",
      "Pressure trace: brief downward deflection during expiration at the trigger attempt",
      "NO breath follows the deflection — the effort is 'wasted'",
      "Rate on the ventilator is lower than the patient's actual breathing rate",
    ],
    physiology:
      "Auto-PEEP raises the effective trigger threshold. To trigger a breath, the patient must first " +
      "overcome auto-PEEP AND then reach the set trigger sensitivity. Efforts below this combined threshold " +
      "fail to trigger. The patient breathes more frequently than the ventilator counts.",
    patientExperience:
      "Extreme dyspnea, frustration, respiratory fatigue. Patient appears to be 'fighting' the vent.",
    interventions: [
      "Address auto-PEEP first — increase Te, reduce RR, add bronchodilators",
      "Add extrinsic PEEP (~80% of measured auto-PEEP) to counterbalance trigger threshold",
      "Increase trigger sensitivity (lower the threshold — but avoid auto-triggering)",
      "Switch to flow triggering if using pressure triggering",
    ],
    examTraps: [
      "Ineffective trigger rate = patient's true respiratory rate minus vent RR reading.",
      "The KEY finding is the expiratory deflection WITHOUT a breath following — a 'near miss.'",
      "Auto-PEEP is the most common cause of ineffective triggering in COPD/obstructive patients.",
    ],
    urgency: "act_now",
    professions: ["rt", "rn", "np", "critical_care"],
    difficulty: "advanced",
  },
);

const delayedCycling = tpl(
  "delayed_cycling",
  "Delayed Cycling",
  "asynchrony",
  {
    mode: "pressure_support",
    pressureSupport: 10,
    peep: 5,
    rr: 14,
    ti: 1.2,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "delayed_cycling",
  },
  {
    summary: "Delayed cycling — ventilator cycles off AFTER the patient's neural Ti ends, causing active exhalation against pressure.",
    recognitionCriteria: [
      "Pressure: spikes upward at the END of inspiration (patient begins exhaling while vent still pushing pressure)",
      "Flow: abrupt direction change in mid-expiration",
      "Sharp pressure peak at inspiratory termination — 'beak' sign on pressure trace",
    ],
    physiology:
      "In PS mode, the cycling criterion (% of peak flow) determines when the vent terminates the breath. " +
      "If the patient's neural Ti ends before the flow drops to the cycling threshold, the patient begins " +
      "active exhalation while the vent is still pressurizing. This creates a pressure spike.",
    patientExperience: "Discomfort, dyspnea, sensation of fighting exhalation.",
    interventions: [
      "INCREASE the cycling criterion (e.g., 25% → 40% of peak flow) — cycles off sooner",
      "Reduce PS level slightly",
      "Check for high resistance (prolonged expiratory flow → late cycling)",
    ],
    examTraps: [
      "Delayed cycling on PS = cycling criterion too LOW — increase the % to cycle off sooner.",
      "The 'pressure spike' at end of inspiration = patient fighting exhalation = active effort vs vent.",
    ],
    urgency: "monitor",
    professions: ["rt", "np", "critical_care"],
    difficulty: "advanced",
  },
);

const prematureCycling = tpl(
  "premature_cycling",
  "Premature Cycling",
  "asynchrony",
  {
    mode: "pressure_support",
    pressureSupport: 10,
    peep: 5,
    rr: 16,
    ti: 0.8,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "premature_cycling",
  },
  {
    summary: "Premature cycling — ventilator terminates inspiration before patient's neural Ti is complete.",
    recognitionCriteria: [
      "Flow: abrupt drop before expected peak flow descent is complete",
      "Short inspiratory time relative to effort",
      "Patient may double-trigger or show secondary effort immediately after cycling",
    ],
    physiology:
      "If the cycling criterion is too HIGH (% peak flow is large), the vent cycles off while the patient " +
      "still wants to inhale. Flow cut-off is premature. Patient may take a second breath to compensate.",
    patientExperience: "Short unsatisfying breaths, air hunger, increased breathing effort.",
    interventions: [
      "DECREASE the cycling criterion (40% → 25% of peak flow) — stays in inspiration longer",
      "Consider increasing PS level",
    ],
    examTraps: [
      "Premature cycling = cycling criterion too HIGH — decrease the % to extend inspiration.",
      "Premature cycling → double triggering is a common progression sequence.",
    ],
    urgency: "monitor",
    professions: ["rt", "np", "critical_care"],
    difficulty: "advanced",
  },
);

const breathStacking = tpl(
  "breath_stacking",
  "Breath Stacking",
  "asynchrony",
  {
    mode: "volume_control",
    flowPattern: "square",
    peep: 5,
    tidalVolume: 500,
    rr: 14,
    ti: 0.8,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "breath_stacking",
  },
  {
    summary: "Breath stacking — successive breaths without complete exhalation; progressive volume accumulation.",
    recognitionCriteria: [
      "Volume trace: end-expiratory volume rises progressively with each breath",
      "Pressure trace: progressive rise in baseline pressure across breaths",
      "Flow: each breath starts before previous exhalation completes",
    ],
    physiology:
      "With each breath, residual volume remains in the lungs. The next inspiration adds to this, " +
      "progressively increasing end-expiratory lung volume. Causes dynamic hyperinflation. " +
      "Particularly dangerous in obstructive disease.",
    patientExperience: "Progressive dyspnea, air hunger, hemodynamic instability in severe cases.",
    interventions: [
      "Reduce RR to allow complete exhalation",
      "Increase Te — adjust Ti/RR ratio",
      "Treat underlying obstruction",
      "Consider disconnecting and allowing manual deflation in extreme cases",
    ],
    examTraps: [
      "Breath stacking = progressive hyperinflation = risk for barotrauma and hemodynamic compromise.",
      "Often seen in asthma patients who are high-RR or high-flow and cannot exhale fully.",
    ],
    urgency: "emergency",
    professions: ["rt", "rn", "np", "critical_care", "emergency"],
    difficulty: "advanced",
  },
);

// ─── Registry ──────────────────────────────────────────────────────────────────

export const VENT_TEMPLATE_REGISTRY: readonly VentTemplate[] = [
  // Normal modes
  vcSquare,
  vcDecelerating,
  pcNormal,
  psNormal,
  simvNormal,
  cpapNormal,
  bipapNormal,
  aprvNormal,
  // Conditions
  highResistance,
  secretionObstruction,
  ardsLowCompliance,
  pneumothorax,
  circuitLeak,
  autoPeepCondition,
  // Asynchrony
  flowStarvation,
  doubleTriggering,
  ineffectiveTrigger,
  delayedCycling,
  prematureCycling,
  breathStacking,
];

export function getVentTemplate(key: string): VentTemplate | undefined {
  return VENT_TEMPLATE_REGISTRY.find((t) => t.key === key);
}

export function getVentTemplatesByCategory(category: VentTemplateCategory): VentTemplate[] {
  return VENT_TEMPLATE_REGISTRY.filter((t) => t.category === category);
}

export function getVentTemplatesByProfession(profession: VentTemplateProfession): VentTemplate[] {
  return VENT_TEMPLATE_REGISTRY.filter((t) => t.professions.includes(profession));
}

export function getVentReferenceTemplates(): VentTemplate[] {
  return VENT_TEMPLATE_REGISTRY.filter((t) => t.isReference === true);
}

export const VENT_NORMAL_MODE_KEYS: string[] = VENT_TEMPLATE_REGISTRY
  .filter((t) => t.category === "normal_mode")
  .map((t) => t.key);

export const VENT_CONDITION_KEYS: string[] = VENT_TEMPLATE_REGISTRY
  .filter((t) => t.category === "condition")
  .map((t) => t.key);

export const VENT_ASYNCHRONY_KEYS: string[] = VENT_TEMPLATE_REGISTRY
  .filter((t) => t.category === "asynchrony")
  .map((t) => t.key);

/** All template keys — stable identifiers for routes and analytics */
export const ALL_VENT_TEMPLATE_KEYS = VENT_TEMPLATE_REGISTRY.map((t) => t.key);

/** Urgency labels for UI display */
export const VENT_URGENCY_LABELS: Record<VentTemplate["urgency"], string> = {
  routine: "Reference",
  monitor: "Monitor",
  act_now: "Act Now",
  emergency: "Emergency",
};

/** Category display labels */
export const VENT_CATEGORY_LABELS: Record<VentTemplateCategory, string> = {
  normal_mode: "Normal Modes",
  condition: "Clinical Conditions",
  asynchrony: "Patient-Ventilator Asynchrony",
};
