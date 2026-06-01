/**
 * Phase 3A — Waveform Detective Mode
 *
 * 15 clinical waveform identification cases. Each presents an abnormal waveform
 * and asks the learner to: identify the abnormality → explain the physiology →
 * select the intervention → see the corrected waveform.
 *
 * Clinical accuracy validated against:
 *   - Cairo JM, Pilbeam SP: Mosby's Respiratory Care Equipment (10th ed)
 *   - Tobin MJ: Principles and Practice of Mechanical Ventilation (3rd ed)
 *   - AARC Clinical Practice Guidelines
 *   - Hamilton Health Sciences RT Protocol Library
 */

import type { DetectiveCase, AdvancedSimChoice, ConsequenceOfInaction } from "./vent-advanced-simulation-engine";
export type { DetectiveCase } from "./vent-advanced-simulation-engine";
import type { VentWaveformConfig } from "./vent-waveform-generator";

// ─── Helper ────────────────────────────────────────────────────────────────────

function ch(id: string, text: string, correct: boolean, feedback: string, danger?: AdvancedSimChoice["danger"]): AdvancedSimChoice {
  return { id, text, correct, feedback, danger };
}

function noAction(description: string, events: ConsequenceOfInaction["timeline"], outcome: string, pearl: string): ConsequenceOfInaction {
  return { description, timeline: events, finalOutcome: outcome, clinicalPearl: pearl };
}

// ─── 1. Auto-PEEP ─────────────────────────────────────────────────────────────

export const detective_auto_peep: DetectiveCase = {
  id: "detective_auto_peep",
  title: "Auto-PEEP / Air Trapping",
  difficulty: "intermediate",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 22, ti: 1.0,
    compliance: 70, resistance: 20, autoPeep: 4,
    condition: "auto_peep", asynchrony: "none",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 70, resistance: 20,
    condition: "normal", asynchrony: "none",
  },
  showPvLoop: false,
  showFvLoop: true,
  findingTraces: ["flow", "fv_loop"],
  identifyQuestion: "What abnormality does the FLOW trace reveal?",
  identifyChoices: [
    ch("a", "Expiratory flow does not return to zero before the next breath begins", true,
      "CORRECT. The pathognomonic sign of auto-PEEP: the expiratory flow curve is still descending (gas still moving out) when the next inspiratory cycle begins. This proves incomplete lung emptying."),
    ch("b", "Inspiratory flow is higher than expected for the set tidal volume", false,
      "Inspiratory flow is determined by Vt/Ti — it is unchanged by auto-PEEP. Focus on the EXPIRATORY limb."),
    ch("c", "The pressure baseline has risen above the set PEEP level", false,
      "Elevated pressure baseline requires an expiratory hold maneuver to detect — it is not directly visible on the routine waveform without occlusion."),
    ch("d", "There is a saw-tooth pattern on the flow trace", false,
      "Saw-tooth on flow = water in the circuit. Auto-PEEP shows a smooth expiratory flow that simply doesn't reach zero."),
  ],
  physiologyQuestion: "Why does the expiratory flow fail to reach zero?",
  physiologyChoices: [
    ch("a", "The expiratory time is shorter than 3× the respiratory time constant (Te < 3τ), so passive emptying is incomplete", true,
      "CORRECT. τ = Raw × Cst. When Te < 3τ, lung volume at end-expiration is still above FRC. The residual volume creates intrinsic PEEP (PEEPi). Formula: PEEPi = V_residual / Cst."),
    ch("b", "The exhalation valve is partially stuck closed, trapping gas", false,
      "A stuck exhalation valve would produce a different alarm pattern (high PEEP reading, mechanical failure). The mechanism here is physiological — the time constant is too long for the expiratory time."),
    ch("c", "The set PEEP is too low, allowing alveolar collapse during expiration", false,
      "Low PEEP causes alveolar de-recruitment, not incomplete emptying. Auto-PEEP is caused by airflow obstruction + insufficient Te."),
    ch("d", "The patient is actively exhaling into the circuit", false,
      "Active expiration would show a more rapid initial flow peak. Passive exponential decay that doesn't reach zero is the fingerprint of long time constants."),
  ],
  interventionQuestion: "Which intervention MOST directly addresses the auto-PEEP?",
  interventionChoices: [
    ch("a", "Decrease respiratory rate from 22 to 12–14 to lengthen expiratory time", true,
      "CORRECT. More expiratory time = more time for passive emptying. This is the primary intervention. Te = (60/RR) − Ti; at RR 12, Ti 1.0: Te = 4.0s vs 1.73s at RR 22. Also consider reducing Ti or treating the underlying airway obstruction."),
    ch("b", "Increase tidal volume to wash out the trapped gas", false,
      "Increasing Vt delivers MORE gas per breath into already-hyperinflated lungs — it worsens air trapping and increases auto-PEEP."),
    ch("c", "Add 10 cmH₂O of extrinsic PEEP to counterbalance", false,
      "Adding extrinsic PEEP equal to or greater than auto-PEEP can worsen hyperinflation. The correct use is adding extrinsic PEEP ~80% of measured PEEPi to improve triggering — but only AFTER lengthening Te to reduce auto-PEEP first."),
    ch("d", "Switch to pressure control mode", false,
      "Mode change alone doesn't fix the timing mismatch. The time constant and expiratory time relationship is mode-independent."),
  ],
  consequenceOfInaction: noAction(
    "Unrecognized auto-PEEP causes progressive dynamic hyperinflation — each breath stacks gas on trapped gas.",
    [
      { timeframe: "5–10 minutes", event: "Functional residual capacity rises. Diaphragm flattens into a disadvantageous mechanical position. WOB increases." },
      { timeframe: "10–20 minutes", event: "Rising intrathoracic pressure compresses great veins. Venous return to right heart decreases. BP begins to fall.", vitalsChange: { sbp: 95 } },
      { timeframe: "20–30 minutes", event: "Severe hyperinflation. Elevated Ppeak triggers high-pressure alarms. SpO₂ may drop from V/Q mismatch. Risk of barotrauma rises.", vitalsChange: { spo2: 88, sbp: 82 } },
      { timeframe: ">30 minutes", event: "Tension physiology: mediastinal compression, hemodynamic collapse, pulseless electrical activity (PEA) cardiac arrest.", vitalsChange: { sbp: 0 } },
    ],
    "PEA cardiac arrest from tension hyperinflation — indistinguishable from tension pneumothorax on exam.",
    "Auto-PEEP causes PEA arrest. If a ventilated patient has PEA, disconnect from the vent and allow passive exhalation for 30 seconds before ACLS. This is diagnostic and therapeutic.",
  ),
  teachingPoints: [
    "Flow trace is the PRIMARY detection tool — not pressure",
    "Expiratory flow not at zero before next breath = auto-PEEP until proven otherwise",
    "Measure quantitatively with end-expiratory hold (EEH) maneuver",
    "Time constant τ = Raw × Cst — high Raw (COPD, bronchospasm) = long τ",
  ],
  keyLearning: "Auto-PEEP is detected on the FLOW trace (not pressure). Flow not returning to zero = incomplete emptying = dynamic hyperinflation. Fix with longer Te (lower RR). Untreated → PEA arrest.",
};

// ─── 2. Flow Starvation ────────────────────────────────────────────────────────

export const detective_flow_starvation: DetectiveCase = {
  id: "detective_flow_starvation",
  title: "Flow Starvation",
  difficulty: "intermediate",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 18, ti: 1.0,
    compliance: 55, resistance: 7, condition: "patient_agitation", asynchrony: "flow_starvation",
  },
  correctedConfig: {
    mode: "pressure_control", pip: 22,
    peep: 5, rr: 18, ti: 1.0,
    compliance: 55, resistance: 7, condition: "normal", asynchrony: "none",
  },
  showPvLoop: true, showFvLoop: false,
  findingTraces: ["pressure", "pv_loop"],
  identifyQuestion: "The PRESSURE waveform has an unusual shape during inspiration. What is it?",
  identifyChoices: [
    ch("a", "The pressure curve is concave (scooped inward) during inspiration — the waveform dips below the expected linear rise", true,
      "CORRECT. Flow starvation produces a 'scalloped' or concave pressure waveform. The patient's inspiratory demand exceeds the set flow — their muscular effort pulls the pressure down below what the physiology alone would produce."),
    ch("b", "The pressure rises sharply at the start of inspiration — a spike above expected peak", false,
      "A pressure spike at breath onset in VC = high resistance (resistive pressure component). Scooping = patient demand exceeding flow."),
    ch("c", "The pressure fails to reach the expected Ppeak — it plateaus early", false,
      "Premature plateau = circuit leak (gas escaping). Flow starvation produces a concave shape, not a blunted peak."),
    ch("d", "Pressure oscillates irregularly throughout inspiration", false,
      "Irregular oscillations = secretions or water in circuit. Flow starvation is a smooth, predictable concavity."),
  ],
  physiologyQuestion: "Why does the pressure waveform scoop inward during VC inspiration?",
  physiologyChoices: [
    ch("a", "The patient's respiratory muscles generate negative pleural pressure exceeding the vent's fixed flow delivery — lowering airway pressure", true,
      "CORRECT. In VC, flow is fixed. If the patient's neural inspiratory drive demands more flow than set, the diaphragm contracts against partially inflated lungs, dropping pleural pressure. This negative pressure propagates to the airway sensor, creating the scoop."),
    ch("b", "The ETT is partially kinked, increasing resistance and reducing delivered pressure", false,
      "ETT kink raises pressure (like bronchospasm). The scoop represents REDUCED pressure from patient effort exceeding set flow."),
    ch("c", "The compliance is too low — the lungs resist inflation, pulling pressure down", false,
      "Low compliance raises peak pressure. It does not cause the concave waveform shape of flow starvation."),
    ch("d", "The trigger sensitivity is too sensitive, causing premature cycling", false,
      "Trigger sensitivity affects breath initiation, not the mid-inspiratory pressure shape."),
  ],
  interventionQuestion: "Best intervention for flow starvation?",
  interventionChoices: [
    ch("a", "Switch to pressure control or pressure support — pressure modes auto-deliver demand-matched flow", true,
      "CORRECT. PC/PS have no fixed flow limit — the ventilator delivers whatever flow is needed to maintain set pressure. Patient demand is automatically matched. The scooping disappears because there's no flow ceiling."),
    ch("b", "Increase the set flow rate (from 40 to 80 L/min) in VC mode", false,
      "Increasing flow rate in VC helps but may not fully solve flow starvation if respiratory drive is very high. Also shortens Ti if Vt is delivered faster. Mode switch is the more definitive fix. This is an acceptable but less complete answer."),
    ch("c", "Increase sedation to suppress respiratory drive", false,
      "Treating a ventilator mismatch with sedation is second-line only. Fix the mechanical problem first. Oversedation has its own risks."),
    ch("d", "Increase PEEP to reduce respiratory drive", false,
      "PEEP does not directly reduce respiratory drive from sepsis, metabolic acidosis, or pain."),
  ],
  consequenceOfInaction: noAction(
    "Flow starvation forces the patient to work against the ventilator on every breath — continuous, exhausting.",
    [
      { timeframe: "15–30 minutes", event: "Increased WOB per breath. Patient tachypneic, accessory muscle use visible. Diaphoresis." },
      { timeframe: "30–60 minutes", event: "Respiratory muscle fatigue accelerates. PaCO₂ begins to rise. SpO₂ may drop." },
      { timeframe: "1–2 hours", event: "Respiratory muscle exhaustion. CO₂ retention, acidosis. Risk of complete decompensation." },
    ],
    "Respiratory failure from exhaustion — requiring emergency intervention.",
    "Flow starvation is often mismanaged by increasing sedation. The primary fix is ALWAYS the ventilator — either increase flow or switch modes. Check the pressure waveform shape every time a patient appears to fight the vent.",
  ),
  teachingPoints: [
    "Scalloped/concave PRESSURE waveform in VC = flow starvation",
    "Pressure modes (PC/PS) self-adjust flow to match demand — eliminate starvation",
    "P-V loop: wider loop in flow starvation (more resistive work)",
    "Distinguish from high resistance: high resistance → HIGH peak, normal shape; starvation → CONCAVE shape",
  ],
  keyLearning: "Concave pressure waveform in VC = flow starvation. Patient demand exceeds fixed flow. Switch to PC/PS to eliminate the mismatch.",
};

// ─── 3. Double Triggering ─────────────────────────────────────────────────────

export const detective_double_triggering: DetectiveCase = {
  id: "detective_double_triggering",
  title: "Double Triggering",
  difficulty: "advanced",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 12, tidalVolume: 420, rr: 20, ti: 0.7,
    compliance: 24, resistance: 8, condition: "ards", asynchrony: "double_triggering",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 12, tidalVolume: 420, rr: 20, ti: 1.2,
    compliance: 24, resistance: 8, condition: "ards", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: false,
  findingTraces: ["pressure", "flow", "volume"],
  identifyQuestion: "What pattern do you see on the VOLUME and PRESSURE traces?",
  identifyChoices: [
    ch("a", "Two consecutive breaths occur with near-zero expiratory time between them — a double breath", true,
      "CORRECT. Double triggering: the patient's neural inspiratory effort persists beyond the ventilator's set Ti. When the vent cycles off, the patient's diaphragm is still contracting — triggering a second mandatory breath immediately. Volume trace shows stacked breaths."),
    ch("b", "The pressure trace shows a scalloped shape during inspiration — flow starvation", false,
      "Flow starvation produces a concave inspiratory pressure shape within one breath. Double triggering produces paired breaths with near-zero inter-breath gap."),
    ch("c", "The volume trace shows a gradual upsloping baseline — progressive hyperinflation", false,
      "Baseline volume drift = breath stacking from auto-PEEP. Double triggering produces discrete paired breaths, not a gradual rise."),
    ch("d", "The respiratory rate on the display is higher than the set rate", false,
      "While true (patient triggering above set rate), this is a consequence, not the specific waveform finding. The paired breath morphology is the diagnostic pattern."),
  ],
  physiologyQuestion: "What is the mechanism of double triggering?",
  physiologyChoices: [
    ch("a", "The ventilator's Ti is shorter than the patient's neural inspiratory time — the patient's effort continues after cycling and triggers a second breath", true,
      "CORRECT. Ti mismatch is the mechanism. Neural Ti > set Ti. After the vent cycles off, the patient's inspiratory motor output is still active — reaching and exceeding the flow trigger threshold to demand another breath immediately."),
    ch("b", "The trigger sensitivity is too sensitive — the ventilator detects cardiac-induced flow oscillations as breaths", false,
      "Auto-triggering from cardiac oscillations causes breaths not linked to patient effort. Double triggering is linked to patient effort — the neural Ti simply exceeds the ventilator Ti."),
    ch("c", "The set Vt is too large — the lungs overfill and the Hering-Breuer reflex re-triggers inspiration", false,
      "The Hering-Breuer reflex inhibits inspiration (lung stretch → STOP breathing). It would not trigger a second inspiratory effort."),
    ch("d", "High PEEP is causing pressure oscillations that are sensed as trigger events", false,
      "PEEP baseline changes affect trigger threshold but do not explain the paired-breath morphology."),
  ],
  interventionQuestion: "This patient has severe ARDS with P/F = 80. Stacked Vt is ~840 mL — 12 mL/kg. Most urgent intervention?",
  interventionChoices: [
    ch("a", "Initiate neuromuscular blockade (cisatracurium 0.15 mg/kg/h) immediately — patient effort is causing VILI", true,
      "CORRECT. In severe ARDS with double triggering causing 2× Vt stacking, NMB eliminates respiratory drive entirely, preventing the repeated triggering. ACURASYS trial: NMB for 48 hours in P/F < 150 reduces 90-day mortality. This is the definitive intervention."),
    ch("b", "Lengthen the set Ti from 0.7s to 1.2s to match patient neural Ti", false,
      "Lengthening Ti is the correct FIRST attempt when double triggering is mild. But with severe ARDS and P/F 80, Vt 840 mL causing Pplat > 40 cmH₂O, the urgency requires NMB now. Ti lengthening alone is too slow for this acuity."),
    ch("c", "Increase RR to 30 to match the patient's spontaneous rate", false,
      "Increasing RR shortens the cycle and worsens Te — making each breath more likely to double-trigger. This worsens the problem."),
    ch("d", "Decrease Vt to 200 mL — if each double breath delivers 400 mL total, that will be safer", false,
      "Decreasing Vt does NOT prevent double triggering. The patient will still trigger twice; 200 mL × 2 = 400 mL — still problematic at ARDS compliance. The mechanism must be eliminated."),
  ],
  consequenceOfInaction: noAction(
    "Every stacked breath delivers 2× Vt — 840 mL — into ARDS-injured lungs with compliance < 25 mL/cmH₂O.",
    [
      { timeframe: "Immediate", event: "Each stacked breath: Pplat reaches 40–50+ cmH₂O. Driving pressure far exceeds 15 cmH₂O safe threshold." },
      { timeframe: "Minutes to hours", event: "Cyclic volutrauma and barotrauma from repeated overdistension. VILI accelerates lung injury — worsening ARDS." },
      { timeframe: "Hours", event: "Pulmonary interstitial emphysema. Pneumothorax or pneumomediastinum risk markedly elevated.", vitalsChange: { spo2: 82, sbp: 90 } },
      { timeframe: "Hours–Days", event: "Worsening gas exchange despite optimal PEEP. ECMO may become the only option.", vitalsChange: { spo2: 75 } },
    ],
    "Progressive VILI from repeated tidal volume doubling — ARDS-to-ECMO escalation.",
    "Double triggering is the most dangerous asynchrony in ARDS. Every paired breath is a Vt overdose. Treat immediately — lengthen Ti first, then NMB if double triggering persists.",
  ),
  teachingPoints: [
    "Two consecutive breaths with near-zero expiratory gap = double triggering",
    "Volume trace: stacked volume (second breath adds to first) is the dangerous finding",
    "Mechanism: ventilator Ti < patient neural Ti",
    "In ARDS: double triggering = immediate VILI risk. NMB is justified at P/F < 150",
  ],
  keyLearning: "Double triggering doubles effective Vt. In ARDS this causes VILI. Lengthen Ti first; NMB if it persists with P/F < 150.",
};

// ─── 4. Ineffective Triggering ────────────────────────────────────────────────

export const detective_ineffective_trigger: DetectiveCase = {
  id: "detective_ineffective_trigger",
  title: "Ineffective Triggering",
  difficulty: "advanced",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 480, rr: 14, ti: 1.0,
    compliance: 65, resistance: 22, autoPeep: 6,
    condition: "auto_peep", asynchrony: "ineffective_triggering",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 10, tidalVolume: 480, rr: 12, ti: 0.9,
    compliance: 65, resistance: 22,
    condition: "normal", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: true,
  findingTraces: ["pressure", "flow"],
  identifyQuestion: "Between two mandatory breaths, what does the PRESSURE and FLOW trace reveal?",
  identifyChoices: [
    ch("a", "A brief downward pressure deflection + small upward flow deflection during expiration — with NO subsequent breath", true,
      "CORRECT. Ineffective triggering: the patient generates an effort during expiration but fails to reach the trigger threshold. The effort briefly deflects pressure downward and creates a small transient flow increase — but the ventilator does not respond with a breath."),
    ch("b", "A second complete breath is triggered, producing back-to-back inspiratory waveforms", false,
      "That is double triggering — two full breaths occur. Ineffective triggering is a FAILED trigger — a deflection without a subsequent breath."),
    ch("c", "The expiratory flow returns to zero immediately after each breath — premature emptying", false,
      "Rapid return to zero = fast time constant (low Raw or low Cst). Ineffective triggering typically occurs in the context of prolonged expiratory flow (auto-PEEP context)."),
    ch("d", "The flow trace shows continuous positive flow (inspiration) throughout expiration", false,
      "Continuous inspiratory flow during expiration would indicate a completely different mechanical problem. Ineffective triggering shows the opposite: failed effort deflections during expiratory negative flow."),
  ],
  physiologyQuestion: "Why do the patient's inspiratory efforts fail to trigger a breath?",
  physiologyChoices: [
    ch("a", "Auto-PEEP raises the effective trigger threshold — the patient must first overcome PEEPi before the net pressure change reaches the trigger level", true,
      "CORRECT. To trigger a breath, airway pressure must drop by the set trigger sensitivity (e.g., −2 cmH₂O) from the baseline. But if PEEPi = 6 cmH₂O, the patient must first overcome 6 cmH₂O of intrinsic PEEP PLUS the trigger threshold = 8 cmH₂O total effort. Most efforts fall short."),
    ch("b", "The trigger sensitivity is set too high (insensitive) — the threshold is above normal inspiratory effort", false,
      "While incorrect trigger sensitivity can cause this, the MOST COMMON cause in a patient with high resistance and auto-PEEP is the PEEPi threshold. Check for auto-PEEP first."),
    ch("c", "The patient's respiratory drive is suppressed by over-sedation", false,
      "Over-sedation reduces the rate of attempts, not the specific on-off threshold. You can see multiple efforts here — the issue is threshold, not frequency."),
    ch("d", "The ETT is too large, creating excessive resistance to flow sensing", false,
      "ETT resistance is minimal compared to PEEPi-induced threshold elevation."),
  ],
  interventionQuestion: "Best approach to eliminate the ineffective triggering?",
  interventionChoices: [
    ch("a", "Add extrinsic PEEP to ~80% of measured auto-PEEP level (add 5 cmH₂O), AND reduce RR to lengthen Te", true,
      "CORRECT. Adding extrinsic PEEP counterbalances the PEEPi threshold — the patient now needs to overcome only the remaining difference. Also lengthen Te to reduce auto-PEEP over time. This is the dual-pronged approach from ACCP/ATS guidelines for COPD with PEEPi-related ineffective triggering."),
    ch("b", "Increase trigger sensitivity by reducing the threshold to −0.5 cmH₂O", false,
      "Making the trigger more sensitive without addressing auto-PEEP risks auto-triggering from cardiac oscillations. The root cause (PEEPi) must be addressed, not just the threshold."),
    ch("c", "Increase respiratory rate to provide more mandatory breaths and reduce the work of spontaneous triggering", false,
      "Increasing RR shortens Te → worsens auto-PEEP → worsens ineffective triggering. This is the OPPOSITE of what's needed."),
    ch("d", "Switch to assist-control with pressure support only", false,
      "Simply switching modes doesn't address the underlying auto-PEEP. In PS mode, PEEPi-related ineffective triggering is even harder to manage because all breaths must be patient-triggered."),
  ],
  consequenceOfInaction: noAction(
    "Ineffective triggering is invisible to the ventilator — the displayed RR is lower than the patient's actual neural rate.",
    [
      { timeframe: "Immediate", event: "Each failed trigger is wasted inspiratory muscle work. WOB per effective breath increases." },
      { timeframe: "30–60 minutes", event: "Respiratory muscle fatigue accumulates. The patient's effort-to-result ratio worsens as auto-PEEP worsens." },
      { timeframe: "1–3 hours", event: "Respiratory muscle exhaustion. PaCO₂ rises. Patient appears tachypneic on observation but vent shows normal or low RR — clinical-vent mismatch." },
      { timeframe: "Hours", event: "Respiratory failure. Emergent deepening of sedation or NMB required." },
    ],
    "Respiratory muscle exhaustion from repeated failed triggering — CO₂ retention and emergency re-sedation.",
    "RULE: If observed RR > displayed vent RR → assume ineffective triggering until proven otherwise. Count the patient's actual respiratory efforts visually or by palpation.",
  ),
  teachingPoints: [
    "Deflection in expiration WITHOUT a subsequent breath = ineffective trigger",
    "Auto-PEEP is the #1 cause in COPD/obstructive patients",
    "Add extrinsic PEEP ~80% of measured auto-PEEP to reduce threshold",
    "Patient's true RR > vent-displayed RR — always count patient's actual efforts",
  ],
  keyLearning: "Ineffective triggering = failed effort visible as expiratory deflection with no breath. Auto-PEEP is the main cause. Add extrinsic PEEP + lengthen Te.",
};

// ─── 5. Reverse Triggering ────────────────────────────────────────────────────

export const detective_reverse_triggering: DetectiveCase = {
  id: "detective_reverse_triggering",
  title: "Reverse Triggering",
  difficulty: "advanced",
  abnormalConfig: {
    mode: "pressure_control", pip: 22,
    peep: 12, rr: 20, ti: 1.0,
    compliance: 22, resistance: 8, condition: "ards", asynchrony: "reverse_triggering",
  },
  correctedConfig: {
    mode: "pressure_control", pip: 22,
    peep: 12, rr: 20, ti: 1.0,
    compliance: 22, resistance: 8, condition: "ards", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: false,
  findingTraces: ["pressure", "flow", "volume"],
  identifyQuestion: "Late in the INSPIRATORY phase, the pressure drops and flow direction briefly reverses. What is this?",
  identifyChoices: [
    ch("a", "Reverse triggering — the mandatory breath reflexively triggers a diaphragmatic contraction late in inspiration", true,
      "CORRECT. Reverse triggering is a neurally-mediated phenomenon. The mandatory breath (passive lung inflation) reflexively activates the phrenic nerve, causing the diaphragm to contract DURING the mandatory inspiratory phase — creating an expiratory-direction flow deflection mid-inspiration."),
    ch("b", "The patient is double-triggering — beginning a spontaneous breath during the mandatory one", false,
      "Double triggering creates a SECOND COMPLETE breath immediately after the first. Reverse triggering creates a brief mid-inspiratory expiratory effort within the ongoing mandatory breath."),
    ch("c", "The ETT is migrating during the breath — causing intermittent partial obstruction", false,
      "ETT migration would produce irregular high-pressure spikes, not the rhythmic mid-inspiratory effort pattern of reverse triggering."),
    ch("d", "The ventilator is auto-cycling due to circuit leak-induced flow oscillations", false,
      "Auto-cycling produces extra breaths, not internal deflections within a mandatory breath."),
  ],
  physiologyQuestion: "What neural mechanism produces reverse triggering?",
  physiologyChoices: [
    ch("a", "The lung inflation stretch reflex (entrainment) activates phrenic motoneurons in phase with the mandatory breath rhythm", true,
      "CORRECT. Reverse triggering occurs when ventilator-driven lung inflation (stretch of pulmonary mechanoreceptors) triggers descending neural output to the diaphragm via brainstem-spinal cord entrainment. It is most common in deeply sedated patients at 1–3 breaths/min below minimum consciousness — not truly unconscious, not truly awake."),
    ch("b", "The patient's respiratory center becomes synchronized with the ventilator and drives inspiration simultaneously", false,
      "This would cause patient-triggered breaths aligning WITH mandatory breaths (entrainment in-phase), not mid-inspiratory expiratory effort. The diaphragm in reverse triggering contracts while the vent is still inflating."),
    ch("c", "Metabolic alkalosis suppresses respiratory drive, causing rhythmic diaphragm spasm", false,
      "Metabolic alkalosis reduces respiratory drive — it does not produce entrained, rhythmic diaphragm contraction linked to vent cycles."),
    ch("d", "Sedation wears off mid-breath, causing the patient to actively try to exhale", false,
      "Sedation fluctuations would produce irregular, not entrained, patterns. Reverse triggering is reproducible cycle-to-cycle."),
  ],
  interventionQuestion: "This patient has ARDS, P/F 110, on deep sedation with propofol. What do you do?",
  interventionChoices: [
    ch("a", "Consider neuromuscular blockade to eliminate the diaphragmatic contraction and prevent VILI from unconstrained effort", true,
      "CORRECT. Reverse triggering in ARDS causes effort-induced VILI — the diaphragm's contraction during a mandatory breath creates a pendelluft effect (gas redistribution from non-dependent to dependent lung zones) and potentially doubles the delivered mechanical energy to the lung. NMB is indicated in severe ARDS with uncontrolled reverse triggering. NEJM 2013 (Doorduin): prevalence 30–40% in deeply sedated ARDS patients."),
    ch("b", "Increase sedation depth to abolish all neural drive", false,
      "Paradoxically, reverse triggering occurs most often at intermediate sedation depth. Increasing sedation may help but full abolition of the reflex typically requires NMB."),
    ch("c", "Reduce RR — fewer vent breaths reduce the number of reflex-triggering inflations", false,
      "While reducing RR does reduce the frequency of reverse triggering events, each event that occurs may still cause VILI. At P/F 110, this is not acceptable management."),
    ch("d", "Switch to pressure support to allow the patient to control their own neural Ti", false,
      "PS depends on patient-initiated inspiration. Reverse triggering is a reflex response to PASSIVE inflation — switching to PS does not address this mechanism and may worsen asynchrony if the patient cannot reliably trigger each breath."),
  ],
  consequenceOfInaction: noAction(
    "Reverse triggering causes diaphragm contraction against a passively inflating lung — high mechanical stress to both lung and diaphragm.",
    [
      { timeframe: "Each affected breath", event: "Pendelluft redistribution of gas from non-dependent to dependent lung zones — high cyclic mechanical stress to injured lung tissue." },
      { timeframe: "Hours", event: "Effort-induced VILI accelerates. ARDS worsens despite optimal settings. P/F may continue declining." },
      { timeframe: "1–3 days", event: "Progressive VILI may require escalation to ECMO despite optimal conventional ventilation." },
    ],
    "Refractory ARDS progression from uncontrolled effort-induced VILI.",
    "Reverse triggering is under-recognized because it is subtle and patients appear 'calm.' The clinical clue: rhythmic mid-inspiratory flow deflections at exactly the vent rate — not random. Screen ARDS patients with esophageal balloons if available.",
  ),
  teachingPoints: [
    "Reverse triggering = mandatory breath triggers diaphragm contraction (reflex)",
    "Most common at 'intermediate' sedation — not fully unconscious",
    "Pendelluft from reverse triggering causes VILI independently of Vt/Pplat",
    "Diagnosis requires careful waveform review — missed in most ICUs without active surveillance",
  ],
  keyLearning: "Reverse triggering is a phrenic nerve reflex triggered by lung stretch. It causes VILI through pendelluft. Screen for it in ARDS and consider NMB.",
};

// ─── 6. Circuit Leak ──────────────────────────────────────────────────────────

export const detective_circuit_leak: DetectiveCase = {
  id: "detective_circuit_leak",
  title: "Circuit Leak",
  difficulty: "basic",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 8, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 6, condition: "circuit_leak", asynchrony: "none",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 8, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 6, condition: "normal", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: false,
  findingTraces: ["pressure", "volume"],
  identifyQuestion: "What does the volume trace reveal compared to normal?",
  identifyChoices: [
    ch("a", "Expiratory volume is lower than inspiratory volume — a volume discrepancy indicating leak", true,
      "CORRECT. In a sealed circuit, inspired Vt = expired Vt. When inspired Vt > expired Vt, gas is leaving the circuit without passing through the expiratory limb sensor. The difference = leak volume per breath. Also: PEEP cannot be maintained."),
    ch("b", "Inspiratory volume is lower than expected for the set Vt", false,
      "A reduced inspiratory volume would indicate a circuit obstruction or leak on the inspiratory limb before delivery. The typical circuit leak shows normal inspiration with reduced expiration."),
    ch("c", "Both inspiratory and expiratory volumes are reduced equally", false,
      "Equal reduction would suggest calibration drift or sensor failure. Leak shows asymmetric volume — insp > exp."),
    ch("d", "The volume baseline drifts upward with each breath — progressive hyperinflation", false,
      "Progressive baseline drift = auto-PEEP/breath stacking. Leak shows the opposite: incomplete return of gas."),
  ],
  physiologyQuestion: "Why does a circuit leak cause PEEP loss?",
  physiologyChoices: [
    ch("a", "Gas continuously escapes through the leak during the expiratory hold phase — the ventilator cannot maintain the set pressure against ongoing loss", true,
      "CORRECT. PEEP is maintained by the exhalation valve holding a set back-pressure. If gas is leaking from a different path (disconnection, loose fitting, cracked tubing), the ventilator cannot build up the required pressure in the circuit. PEEP reads lower than set."),
    ch("b", "The leak causes back-pressure that forces the exhalation valve open prematurely", false,
      "A leak lowers circuit pressure — it does not create back-pressure to open the exhalation valve."),
    ch("c", "Reduced inspired Vt means less gas delivered, reducing lung pressure", false,
      "In a typical circuit leak, the ventilator delivers the set Vt (inspired limb is intact). The problem is on the expiratory limb or connection."),
    ch("d", "The exhalation valve is malfunctioning due to moisture condensation", false,
      "Exhalation valve malfunction would produce HIGH PEEP (valve stuck closed) or variable PEEP. A simple circuit leak lowers PEEP."),
  ],
  interventionQuestion: "How do you find and fix a circuit leak?",
  interventionChoices: [
    ch("a", "Systematically inspect all circuit connections, humidifier, Y-piece, and ETT — reconnect or replace the leaking component", true,
      "CORRECT. Systematic circuit inspection: Y-piece → ETT connector → HME/humidifier → inspiratory limb → expiratory limb. Also check: cuff pressure (< 20 cmH₂O = cuff leak), nebulizer connections, ventilator circuit port seals. Reconnect any disconnected component; replace cracked tubing."),
    ch("b", "Increase the set PEEP by the amount of PEEP loss to compensate", false,
      "Compensating for a leak by raising set PEEP does not fix the leak — it masks it while gas continues to escape. Fix the source."),
    ch("c", "Increase the set tidal volume to compensate for the lost volume", false,
      "Increasing Vt compensates partially for lost gas delivery but does not address the underlying problem and risks over-pressurization once the leak is fixed."),
    ch("d", "Switch to pressure control mode — PC will auto-adjust to maintain pressure despite the leak", false,
      "PC mode cannot compensate for a major circuit disconnection. It will attempt to maintain pressure but the gas still escapes; patient receives inadequate ventilation."),
  ],
  consequenceOfInaction: noAction(
    "An untreated circuit leak progressively reduces PEEP and effective ventilation.",
    [
      { timeframe: "Minutes", event: "PEEP falls below set level. Alveolar de-recruitment begins. FRC decreases.", vitalsChange: { spo2: 92 } },
      { timeframe: "5–15 minutes", event: "V/Q mismatch from de-recruited alveoli. SpO₂ drops. CO₂ rises from reduced minute volume.", vitalsChange: { spo2: 86 } },
      { timeframe: "15–30 minutes", event: "In ARDS patients: loss of recruitment → severe hypoxemia. In routine post-op: significant desaturation." },
      { timeframe: ">30 minutes (large leak)", event: "Near-complete loss of ventilation if disconnection is total. Hypoxic cardiac arrest.", vitalsChange: { spo2: 60, sbp: 0 } },
    ],
    "Hypoxic cardiac arrest from complete ventilator disconnection.",
    "Volume discrepancy is the earliest sign of a leak — caught before SpO₂ drops. The ventilator's spirometry catches leaks before clinical deterioration if you look.",
  ),
  teachingPoints: [
    "Inspired Vt > expired Vt = leak (not obstruction)",
    "PEEP cannot be maintained with a significant circuit leak",
    "Systematic inspection protocol: always start at the Y-piece",
    "ETT cuff leak is the most commonly missed source — check cuff pressure q8h",
  ],
  keyLearning: "Volume discrepancy (insp Vt > exp Vt) + PEEP loss = circuit leak. Inspect systematically from Y-piece to ventilator. Fix the source; don't compensate with higher settings.",
};

// ─── 7. Water in Circuit ──────────────────────────────────────────────────────

export const detective_water_in_circuit: DetectiveCase = {
  id: "detective_water_in_circuit",
  title: "Water in Circuit (Condensation)",
  difficulty: "basic",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 8, condition: "water_in_circuit", asynchrony: "none",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 8, condition: "normal", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: false,
  findingTraces: ["flow", "pressure"],
  identifyQuestion: "What pattern do you observe on the FLOW and PRESSURE traces?",
  identifyChoices: [
    ch("a", "Irregular high-frequency oscillations (saw-tooth pattern) superimposed on both traces", true,
      "CORRECT. Water pooling in dependent circuit loops creates turbulence as gas moves through. This turbulence generates irregular, high-frequency oscillations on the flow sensor — transmitted to the pressure trace. The pattern looks like a jagged 'saw-tooth' on top of the normal waveform shape."),
    ch("b", "The peak pressure rises progressively over several breaths", false,
      "Progressive Ppeak rise = increasing resistance (secretion accumulation, progressive bronchospasm). Water in circuit causes immediate oscillations, not a gradual pressure rise."),
    ch("c", "The pressure waveform has a concave shape during inspiration", false,
      "Concave pressure = flow starvation. Water in circuit produces superimposed oscillations on an otherwise normal waveform shape."),
    ch("d", "The flow trace shows persistently positive flow during expiration", false,
      "Persistently positive flow during expiration = ETT cuff leak or circuit leak. Water in circuit produces oscillations, not unidirectional flow reversal."),
  ],
  physiologyQuestion: "How does water in the circuit produce the saw-tooth pattern?",
  physiologyChoices: [
    ch("a", "Condensed water pools in dependent loops, creating bubble turbulence and intermittent partial obstruction to gas flow", true,
      "CORRECT. Heated gas in the circuit meets cooler ambient air. Water condenses and pools, especially in dependent U-bends. As gas flows, it must displace or pass through the water column — creating bubbles, turbulence, and rapid pressure fluctuations that appear as the saw-tooth pattern on the waveform."),
    ch("b", "Water in the circuit reacts chemically with O₂ and N₂ to create oscillating pressure waves", false,
      "No chemical reaction occurs. The mechanism is purely physical — turbulent flow through a partially water-occluded tube."),
    ch("c", "Water conducts electricity from the heating element, causing electrical artefact on the sensor", false,
      "Electrical artefact from water contact would manifest differently (sudden signal loss or spikes, not the rhythmic saw-tooth). The mechanism is flow turbulence."),
    ch("d", "Water reduces the circuit compliance, causing pressure oscillations with each breath", false,
      "Circuit compliance changes would affect peak and plateau pressure, not create the high-frequency oscillating superimposition of the saw-tooth."),
  ],
  interventionQuestion: "What is the immediate action for water in the circuit?",
  interventionChoices: [
    ch("a", "Drain all water traps (water traps/condensation collectors) and tip the circuit so water flows away from patient and vent", true,
      "CORRECT. Immediately drain the water traps. Do NOT allow water to drain TOWARD the patient (aspiration risk) or TOWARD the ventilator (sensor damage, nosocomial contamination). Tilt the circuit so water flows away from both. Consider HME filter as humidification alternative to reduce condensation."),
    ch("b", "Increase the set flow rate to blow the water through the circuit", false,
      "Higher flow makes the turbulence worse and risks aspirating the water into the patient's airway. Drain first."),
    ch("c", "Switch to a heated wire circuit to eliminate condensation permanently", false,
      "Heated wire circuits do reduce condensation — this is a longer-term solution. The immediate action is drainage. Cannot switch circuits while the patient is actively ventilated without preparation."),
    ch("d", "Suction the patient — the pattern may represent secretions", false,
      "Suctioning the patient when the problem is in the circuit is ineffective and exposes the patient to unnecessary procedure. Water-in-circuit oscillations are external to the patient."),
  ],
  consequenceOfInaction: noAction(
    "Water in the circuit is a compliance, infection, and aspiration risk.",
    [
      { timeframe: "Minutes–hours", event: "Progressive condensation accumulates. Partial circuit obstruction increases resistance → rising peak pressures. High-pressure alarms trigger." },
      { timeframe: "Hours", event: "Stagnant water becomes heavily colonized (Pseudomonas, Stenotrophomonas). Ventilator-associated pneumonia (VAP) risk rises with every breathing circuit that pools water." },
      { timeframe: "Single event risk", event: "Water aspiration into the airway if circuit is tipped toward the patient — immediate chemical/infectious pneumonitis." },
    ],
    "VAP from chronically pooled circuit condensate.",
    "VAP prevention: drain circuit water traps every 4 hours or per protocol. Never drain toward patient. Heated wire circuits reduce, but do not eliminate, condensation. HME filters eliminate it entirely but can increase dead space.",
  ),
  teachingPoints: [
    "Saw-tooth oscillation on flow + pressure = water in circuit or secretions",
    "Distinguish from secretions: suction clears secretion saw-tooth; water saw-tooth cleared only by draining circuit",
    "Drain AWAY from patient and ventilator",
    "Water in circuit = VAP risk — infection control priority",
  ],
  keyLearning: "Saw-tooth waveform oscillations = water in circuit or secretions. Drain circuit traps away from patient. Rule out secretions first by suctioning.",
};

// ─── 8. Mucous Plug / Secretion Obstruction ───────────────────────────────────

export const detective_mucous_plug: DetectiveCase = {
  id: "detective_mucous_plug",
  title: "Mucous Plug / Secretion Obstruction",
  difficulty: "intermediate",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 22, condition: "secretion_obstruction", asynchrony: "none",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 8, condition: "normal", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: false,
  findingTraces: ["pressure"],
  identifyQuestion: "The peak pressure has gradually risen from 22 to 38 cmH₂O over 2 hours. Pplat remains 16 cmH₂O. What does this tell you?",
  identifyChoices: [
    ch("a", "Increased airway resistance (Ppeak–Pplat gap widened to 22 cmH₂O) — secretions, mucous plug, or ETT obstruction", true,
      "CORRECT. Ppeak − Pplat = resistive pressure. A gap of 22 cmH₂O indicates high resistance. Pplat 16 is normal — compliance is preserved. The GRADUAL rise over hours suggests progressive secretion accumulation rather than sudden bronchospasm."),
    ch("b", "Decreased lung compliance — both Ppeak and Pplat should be rising equally", false,
      "If compliance dropped, both Ppeak AND Pplat would rise proportionally. Only Ppeak rising (with stable Pplat) = resistance problem."),
    ch("c", "The patient is fighting the vent — agitation raises peak pressures", false,
      "Patient fighting the vent produces irregular waveforms and variable breath-to-breath pressures. Consistent gradual Ppeak rise with stable Pplat = resistance, not agitation."),
    ch("d", "Auto-PEEP is developing — the baseline pressure is rising", false,
      "Auto-PEEP raises the effective PEEP (baseline pressure), not specifically Ppeak with stable Pplat. And auto-PEEP appears on the FLOW trace (incomplete expiratory return)."),
  ],
  physiologyQuestion: "How do secretions in the ETT or large airways specifically raise Ppeak while leaving Pplat unchanged?",
  physiologyChoices: [
    ch("a", "Secretions narrow the ETT lumen — at the same inspiratory flow rate, more pressure is needed to overcome the increased turbulent/viscous resistance (Poiseuille's law)", true,
      "CORRECT. Poiseuille's law: resistance ∝ 1/r⁴. Halving the ETT radius increases resistance 16-fold. Secretion coating reduces the effective diameter. During inspiration, this resistance is felt as an increased Ppeak (inspiratory pressure to push gas through). During plateau (zero flow), resistance doesn't contribute — Pplat reflects only elastic recoil."),
    ch("b", "Secretions absorb gas during inspiration, reducing the delivered volume and requiring higher pressure to maintain volume", false,
      "Secretions don't absorb gas. They create mechanical resistance to flow."),
    ch("c", "Secretions increase alveolar surface tension, reducing compliance", false,
      "That's the mechanism of RDS/surfactant deficiency. Secretions in the airway cause upper airway resistance, not alveolar surface tension changes."),
    ch("d", "Secretions activate airway inflammation that contracts smooth muscle, causing bronchospasm", false,
      "While secretions CAN trigger reflex bronchospasm, the DIRECT mechanism for Ppeak rise with stable Pplat is the mechanical resistance from the secretion mass itself."),
  ],
  interventionQuestion: "You cannot pass the suction catheter past 20 cm — it meets resistance at the ETT tip. What next?",
  interventionChoices: [
    ch("a", "Instill 5 mL NS via catheter, apply suction while withdrawing, then bronchoscopy if unsuccessful", true,
      "CORRECT. Saline instillation softens the plug. If suction fails after 2 attempts: emergency bronchoscopy for direct visualization and extraction. For a complete mucous plug causing total lobe/lung collapse, bronchoscopy is required. Time-critical — do not delay."),
    ch("b", "Increase tidal volume to 800 mL to blow the plug distally", false,
      "This is dangerous — high pressure behind a complete obstruction risks barotrauma (pneumothorax). Never use high-volume ventilation to try to dislodge a suspected mucous plug."),
    ch("c", "Change the ETT to a larger size immediately", false,
      "ETT exchange is a high-risk procedure. Try secretion management first. If the plug is distal to the ETT tip, exchanging the tube doesn't help."),
    ch("d", "Add heliox to reduce turbulent resistance and wait for the plug to loosen spontaneously", false,
      "Heliox reduces turbulence and can help bypass a partial obstruction but will not dislodge a complete plug. Bronchoscopy is required for complete obstruction."),
  ],
  consequenceOfInaction: noAction(
    "A mucous plug can progress from partial to complete obstruction — collapsing an entire lobe or lung.",
    [
      { timeframe: "Hours", event: "Progressive lobar atelectasis from mucous plugging. Increasing FiO₂ requirement. Rising peak pressures.", vitalsChange: { spo2: 90 } },
      { timeframe: "Hours–days", event: "Complete lobar collapse. Absent breath sounds over the affected lobe. CXR: lobar opacity/white-out.", vitalsChange: { spo2: 82 } },
      { timeframe: "Complete obstruction", event: "Unventilated lung segment → intrapulmonary shunt → refractory hypoxemia. Risk of bacterial superinfection in the atelectatic segment." },
    ],
    "Total lobar atelectasis and refractory hypoxemia requiring bronchoscopy.",
    "CRITICAL SUCTION RULE: If the catheter meets resistance before the full catheter length — STOP, do not force. You may be meeting a complete obstruction. Switch to bronchoscopy. Forcing a catheter against complete obstruction can perforate the airway.",
  ),
  teachingPoints: [
    "Rising Ppeak + stable Pplat = resistance (secretions, bronchospasm, kink, mucous plug)",
    "Gradual Ppeak rise = secretions; sudden Ppeak rise = bronchospasm or mucous plug",
    "Suction catheter resistance = complete/near-complete obstruction",
    "Bronchoscopy is diagnostic AND therapeutic for complete mucous plugging",
  ],
  keyLearning: "Gradually rising Ppeak with stable Pplat = secretion accumulation. Treat with suction. If catheter meets resistance → bronchoscopy. Never force ventilation against complete obstruction.",
};

// ─── 9. Bronchospasm (waveform pattern) ──────────────────────────────────────

export const detective_bronchospasm: DetectiveCase = {
  id: "detective_bronchospasm",
  title: "Bronchospasm — Waveform Pattern",
  difficulty: "intermediate",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 480, rr: 12, ti: 1.0,
    compliance: 60, resistance: 30, condition: "bronchospasm", asynchrony: "none",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 480, rr: 12, ti: 1.0,
    compliance: 60, resistance: 8, condition: "normal", asynchrony: "none",
  },
  showPvLoop: true, showFvLoop: true,
  findingTraces: ["pressure", "flow", "fv_loop"],
  identifyQuestion: "What does the combination of PRESSURE and FLOW traces reveal about this patient's respiratory mechanics?",
  identifyChoices: [
    ch("a", "Markedly elevated Ppeak with normal Pplat, AND a prolonged scalloped expiratory flow curve — classic bronchospasm pattern", true,
      "CORRECT. Two diagnostic findings together: (1) High Ppeak with normal Pplat = resistive problem (Ppeak−Pplat gap = Raw × Flow). (2) Prolonged expiratory flow decay = high time constant (τ = Raw × Cst) — lungs empty slowly. The combination is pathognomonic for airway obstruction."),
    ch("b", "Elevated Ppeak AND elevated Pplat with rapid expiratory flow — decreased compliance", false,
      "Both Ppeak and Pplat rising = compliance problem (ARDS, pulmonary edema). Rapid expiratory flow = normal or low time constant. This is the OPPOSITE of bronchospasm."),
    ch("c", "Normal Ppeak with prolonged expiratory flow — indicates a compliant lung with high resistance expiration only", false,
      "Bronchospasm raises Ppeak AND prolongs expiratory flow. A normal Ppeak would suggest the resistance is only mild or the condition is during expiration only (unlikely in acute bronchospasm)."),
    ch("d", "The F-V loop shows a sudden drop in expiratory flow mid-exhalation — suggesting a mucous plug", false,
      "A mucous plug in a major airway would produce a sudden flow drop (obstructive pattern). Bronchospasm produces a smooth curvilinear expiratory limb (scooped appearance on F-V loop) from diffuse small airway narrowing."),
  ],
  physiologyQuestion: "On the F-V loop, the expiratory limb appears scooped or concave. What does this indicate?",
  physiologyChoices: [
    ch("a", "Flow-limited expiration: small airway narrowing causes progressive dynamic compression — peak expiratory flow is reduced and the expiratory curve decelerates rapidly", true,
      "CORRECT. In bronchospasm, small airways narrow from smooth muscle contraction. During forced expiration, these airways are subject to dynamic compression (intrapleural pressure > airway pressure → airway collapse). This limits peak expiratory flow and creates the concave (scooped) expiratory limb on the F-V loop — identical to what's seen in spirometry for obstructive disease."),
    ch("b", "The expiratory pressure has been set too low, preventing adequate gas expulsion", false,
      "Expiratory pressure (PEEP) affects the volume axis but not the flow-limitation pattern. Scooping of the expiratory F-V loop indicates airway resistance, not PEEP."),
    ch("c", "The patient is actively exhaling too forcefully, causing airway collapse", false,
      "In mechanically ventilated patients, expiration is passive. Active exhalation (expiratory muscle effort) would appear differently."),
    ch("d", "Reduced lung compliance means less elastic recoil to drive expiratory flow", false,
      "Reduced compliance INCREASES expiratory driving pressure (stiffer lungs recoil harder). If anything, low compliance produces higher peak expiratory flow, not a scooped pattern."),
  ],
  interventionQuestion: "PIP is 48 cmH₂O, Pplat 18 cmH₂O. SpO₂ 91%. What is your priority sequence?",
  interventionChoices: [
    ch("a", "Albuterol 2.5 mg + ipratropium 0.5 mg via in-line nebulizer → IV methylprednisolone 125 mg → lengthen Te if auto-PEEP present", true,
      "CORRECT. Three simultaneous actions: (1) Bronchodilators — combination SABA + anticholinergic is superior to either alone (AARC CPG). (2) IV steroids for sustained bronchodilation (peak effect 4–6 hours). (3) If expiratory flow doesn't return to zero: lower RR to lengthen Te, reducing auto-PEEP risk. If PIP continues to rise despite bronchodilators: consider IV magnesium sulfate 2g or ketamine 0.5 mg/kg for bronchodilation."),
    ch("b", "Increase PEEP to 12 cmH₂O to stent open the airways", false,
      "Increasing PEEP in bronchospasm with auto-PEEP worsens dynamic hyperinflation. PEEP should not be increased until bronchospasm is treated and auto-PEEP quantified."),
    ch("c", "Increase Vt to 700 mL — larger tidal volume will help overcome the obstruction", false,
      "Larger Vt against high airway resistance increases Ppeak further, risking barotrauma. Target is to REDUCE resistance, not overcome it with higher volumes."),
    ch("d", "Switch to pressure control — PC will limit peak pressures automatically", false,
      "PC limits peak pressure but at the cost of reducing Vt when resistance is high. In acute severe bronchospasm, Vt in PC can drop dangerously. The resistance MUST be treated."),
  ],
  consequenceOfInaction: noAction(
    "Untreated acute severe bronchospasm progresses to respiratory failure and cardiac arrest.",
    [
      { timeframe: "5–15 minutes", event: "Peak pressures continue to rise. Auto-PEEP develops from air trapping. Venous return begins to decrease.", vitalsChange: { spo2: 88, sbp: 95 } },
      { timeframe: "15–30 minutes", event: "Dynamic hyperinflation. Diaphragm flattened. Accessory ventilatory muscles ineffective. CO₂ rises (ventilation failure)." },
      { timeframe: "30–60 minutes", event: "Near-fatal asthma physiology: silent chest (no wheeze = no airflow), respiratory acidosis, impending arrest.", vitalsChange: { spo2: 80, sbp: 80 } },
      { timeframe: ">60 minutes", event: "PEA or VF cardiac arrest from hypoxemia, acidosis, and dynamic hyperinflation.", vitalsChange: { sbp: 0 } },
    ],
    "Silent chest → cardiac arrest. Once wheeze disappears, it means no airflow — not improvement.",
    "SILENT CHEST = EMERGENCY. No wheeze in severe asthma = complete obstruction, not improvement. Escalate immediately to heliox, IV magnesium, ketamine, and prepare for cardiac arrest.",
  ),
  teachingPoints: [
    "Ppeak-Pplat gap > 10 cmH₂O = airway resistance problem",
    "Prolonged expiratory flow + auto-PEEP = high time constant bronchospasm",
    "F-V loop: scooped expiratory limb = flow-limited obstruction",
    "Combination bronchodilators + steroids are the cornerstone treatment",
  ],
  keyLearning: "Bronchospasm waveform: high Ppeak + normal Pplat + prolonged expiratory decay. F-V loop: scooped expiratory limb. Treat: SABA + anticholinergic + IV steroids.",
};

// ─── 10. ARDS Compliance Change ───────────────────────────────────────────────

export const detective_ards_compliance: DetectiveCase = {
  id: "detective_ards_compliance",
  title: "ARDS — Acute Compliance Loss",
  difficulty: "intermediate",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 10, tidalVolume: 400, rr: 22, ti: 0.8,
    compliance: 20, resistance: 7, condition: "ards", asynchrony: "none",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 12, tidalVolume: 380, rr: 22, ti: 0.8,
    compliance: 22, resistance: 7, condition: "ards", asynchrony: "none",
  },
  showPvLoop: true, showFvLoop: false,
  findingTraces: ["pressure", "pv_loop"],
  identifyQuestion: "Both Ppeak AND Pplat are elevated (Ppeak 38, Pplat 32 cmH₂O) on your lung-protective settings. What does this mean?",
  identifyChoices: [
    ch("a", "Decreased lung compliance — BOTH elastic and resistive pressures are elevated. The Ppeak−Pplat gap is normal, confirming compliance rather than resistance is the issue.", true,
      "CORRECT. When BOTH Ppeak and Pplat rise proportionally: the problem is compliance (stiffness). Pplat − PEEP = driving pressure = Vt/Cst. Here: 32 − 10 = 22 cmH₂O driving pressure with Vt 400 mL → Cst = 400/22 = 18 mL/cmH₂O (severely reduced)."),
    ch("b", "High airway resistance — the Ppeak−Pplat gap is the diagnostic clue", false,
      "If resistance were the only problem, Pplat would remain normal. When BOTH rise, compliance is implicated. Ppeak−Pplat here is 6 cmH₂O — normal (< 10 cmH₂O expected)."),
    ch("c", "The patient is double-triggering, stacking tidal volumes", false,
      "Double triggering would show on the waveform as paired breaths. Here the waveform shows consistent single breaths with uniformly high Pplat."),
    ch("d", "The ventilator is malfunctioning and over-pressurizing the circuit", false,
      "Ventilator malfunction would produce irregular, inconsistent pressures and fail-safe alarms. Consistent high Ppeak and Pplat point to patient physiology."),
  ],
  physiologyQuestion: "On the P-V loop, the inflation limb has shifted rightward compared to baseline. What does this indicate?",
  physiologyChoices: [
    ch("a", "More pressure is needed for the same volume — rightward shift reflects worsened compliance (stiffer lung)", true,
      "CORRECT. P-V loop interpretation: if the inflation limb shifts right (more pressure for same volume), compliance has decreased. The slope of the inflation limb = dynamic compliance. Rightward shift + flatter slope = stiffer lung. Possible causes: worsening ARDS, pneumothorax, mucous plug, progressive pulmonary edema."),
    ch("b", "Less pressure is needed for the same volume — the lung has become more recruitable", false,
      "A leftward shift = improved compliance/recruitment. Rightward = worse. Context: this is ARDS worsening."),
    ch("c", "The loop area has increased — indicating more resistive work of breathing", false,
      "Loop area = resistive work. The slope (compliance) and loop position (compliance) are separate from loop area (resistance). Here the issue is slope/position."),
    ch("d", "The upper inflection point is no longer visible — indicating loss of recruitable lung units", false,
      "The upper inflection point indicates overdistension onset. Loss of recruitable units would appear as reduced total volume excursion, not necessarily UIP disappearance."),
  ],
  interventionQuestion: "Pplat 32 cmH₂O, driving pressure 22 cmH₂O. Vt is 400 mL (6.5 mL/kg IBW 62 kg). SpO₂ 88% on FiO₂ 70%. Next step?",
  interventionChoices: [
    ch("a", "Reduce Vt to 360 mL (5.8 mL/kg) to bring Pplat ≤ 30 cmH₂O, and increase PEEP per ARDSNet table for FiO₂ 70%", true,
      "CORRECT. ARDSNet targets: Pplat ≤ 30 cmH₂O, Vt 4–6 mL/kg IBW. Driving pressure ≤ 15 cmH₂O independently predicts mortality. Reduce Vt by 1 mL/kg increments, keeping pH ≥ 7.20 (permissive hypercapnia). At FiO₂ 70%, ARDSNet table suggests PEEP 12–14 cmH₂O. Increase PEEP to improve oxygenation."),
    ch("b", "Increase Vt to 500 mL to compensate for worsened gas exchange", false,
      "Increasing Vt in a patient already at 32 cmH₂O Pplat will push Pplat above 35 cmH₂O — dangerous VILI territory. Oxygenation is improved by PEEP and FiO₂, not larger tidal volumes."),
    ch("c", "Switch to pressure control mode at PIP 38 cmH₂O to maintain the same volumes", false,
      "Setting PC at the same PIP maintains Vt only if compliance stays constant. If compliance worsens further, Vt will decrease unpredictably. VC allows you to guarantee Vt delivery while monitoring Pplat."),
    ch("d", "Initiate prone positioning immediately as first-line treatment for worsening hypoxemia", false,
      "Prone positioning is indicated for P/F < 150 after 12–16 hours of optimization of conventional ventilation. Optimize Vt, PEEP, and FiO₂ first. Prone is adjunctive, not first-line."),
  ],
  consequenceOfInaction: noAction(
    "ARDS with Pplat 32 and driving pressure 22: already at the boundary of safe ventilation.",
    [
      { timeframe: "Hours", event: "Continued VILI from high driving pressure. Each breath delivers excessive mechanical energy (mechanical power) to already-injured alveoli." },
      { timeframe: "6–24 hours", event: "Worsening hypoxemia as previously open alveoli collapse from overstretch injury. Diffuse alveolar damage propagates.", vitalsChange: { spo2: 82 } },
      { timeframe: "24–72 hours", event: "P/F < 100 refractory to conventional management. ECMO may be the only remaining option." },
    ],
    "ECMO escalation for refractory ARDS from VILI.",
    "Driving pressure (Pplat − PEEP) > 15 cmH₂O is independently associated with 90-day mortality in ARDS (Amato et al, NEJM 2015). Driving pressure reduction, not just Vt reduction, should guide management.",
  ),
  teachingPoints: [
    "Ppeak and Pplat BOTH rising = compliance problem (not resistance)",
    "P-V loop: rightward inflation limb shift = worsened compliance",
    "Driving pressure (Pplat − PEEP) = Vt/Cst — independent mortality predictor",
    "Target: Pplat ≤ 30, driving pressure ≤ 15 cmH₂O in ARDS",
  ],
  keyLearning: "Both Ppeak and Pplat rising = decreased compliance. P-V loop shifts right. In ARDS: reduce Vt to keep Pplat ≤ 30 and driving pressure ≤ 15 cmH₂O.",
};

// ─── 11. Delayed Cycling ─────────────────────────────────────────────────────

export const detective_delayed_cycling: DetectiveCase = {
  id: "detective_delayed_cycling",
  title: "Delayed Cycling (Pressure Support)",
  difficulty: "advanced",
  abnormalConfig: {
    mode: "pressure_support", pressureSupport: 12,
    peep: 5, rr: 16, ti: 1.2,
    compliance: 55, resistance: 8, condition: "normal", asynchrony: "delayed_cycling",
  },
  correctedConfig: {
    mode: "pressure_support", pressureSupport: 10,
    peep: 5, rr: 16, ti: 0.9,
    compliance: 55, resistance: 8, condition: "normal", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: false,
  findingTraces: ["pressure", "flow"],
  identifyQuestion: "At the end of inspiration on the PRESSURE trace, there is a sharp upward spike just before expiration. What caused it?",
  identifyChoices: [
    ch("a", "Delayed cycling: the patient begins active exhalation before the ventilator cycles off — diaphragm relaxation and expiratory muscle activation push pressure up against the still-inflating circuit", true,
      "CORRECT. The 'pressure spike' or 'beak sign' at end of inspiration in PSV indicates the patient's neural inspiratory time has ended (they want to exhale) while the vent is still delivering pressure. The expiratory muscles push up against the sustained PS pressure, creating the characteristic end-inspiratory spike."),
    ch("b", "The patient is taking an additional spontaneous breath immediately after the primary PS breath", false,
      "Double triggering would produce a second complete inspiratory cycle immediately after the first. The 'beak' sign appears within the single ongoing breath — at the end of inspiration, not as a separate breath."),
    ch("c", "The PIP alarm threshold has been reached — the vent is limiting pressure delivery", false,
      "Alarm-limited pressure would cause a flat plateau at the alarm threshold, not a spike. The spike is from patient expiratory effort against ongoing PS pressure."),
    ch("d", "Auto-PEEP is creating a brief end-expiratory pressure reversal", false,
      "Auto-PEEP appears at the END of expiration (just before the next breath). The beak sign appears at the END of inspiration — physiologically the opposite timing."),
  ],
  physiologyQuestion: "What is the mechanism of the cycling criterion in PSV, and how does delayed cycling arise?",
  physiologyChoices: [
    ch("a", "PSV cycles off when inspiratory flow drops to a set percentage (typically 25%) of peak flow. Delayed cycling occurs when the patient's effort ends before flow drops to this threshold — e.g., at high PS levels or with increased airway resistance prolonging the flow deceleration curve", true,
      "CORRECT. PSV is flow-cycled. The threshold (cycle-off criterion) is typically 25% of peak inspiratory flow. If the patient's neural Ti ends before flow decelerates to this threshold (common with high PS, high resistance, or high compliance), the patient starts exhaling while the vent continues to deliver flow — causing active exhalation against ongoing PS."),
    ch("b", "PSV is time-cycled, and the set Ti is too long — the vent simply keeps going past the patient's desired inspiratory time", false,
      "PSV is FLOW-cycled, not time-cycled. This is a fundamental mode distinction. The cycling criterion is a flow threshold, not a timer."),
    ch("c", "The trigger sensitivity is too high — the vent starts the next breath too early, creating apparent over-extension of the current one", false,
      "Trigger sensitivity affects breath initiation, not termination. Delayed CYCLING (termination too late) is distinct from early triggering."),
    ch("d", "The patient's respiratory drive is too high, causing the expiratory muscles to activate before the diaphragm has relaxed", false,
      "While expiratory muscle activation does occur in delayed cycling, the fundamental issue is the MISMATCH between neural Ti and vent Ti — not intrinsic respiratory drive per se."),
  ],
  interventionQuestion: "Patient on PSV 12 cmH₂O shows delayed cycling. What is the specific ventilator adjustment?",
  interventionChoices: [
    ch("a", "Increase the flow cycling criterion from 25% to 40–50% of peak flow — the vent will cycle off sooner, before the patient needs to exhale", true,
      "CORRECT. Increasing the cycle-off threshold (e.g., from 25% → 40% of peak flow) terminates the breath earlier in the flow deceleration curve — before the patient's neural Ti ends. This brings vent Ti into alignment with neural Ti and eliminates the beak sign. Also consider reducing PS level slightly (lower PS = faster flow deceleration = earlier cycle-off)."),
    ch("b", "Decrease the flow cycling criterion from 25% to 10% — allow more complete flow delivery before cycling off", false,
      "Decreasing the cycle criterion makes cycling LATER (more delayed). This worsens delayed cycling. The intervention must cycle off SOONER."),
    ch("c", "Increase the PS level — more pressure support will satisfy the patient's demand more quickly", false,
      "Higher PS increases peak flow, which proportionally delays reaching the cycle-off threshold. This may worsen delayed cycling."),
    ch("d", "Switch to volume control — a set Ti will prevent delayed cycling", false,
      "Switching to VC forces a fixed Ti that may not match neural Ti either (causing double triggering or flow starvation). The cycle criterion adjustment is the targeted fix for PSV delayed cycling."),
  ],
  consequenceOfInaction: noAction(
    "Delayed cycling causes active exhalation against ongoing PS pressure — inefficient and uncomfortable.",
    [
      { timeframe: "Each affected breath", event: "Patient exhales against the ventilator — wasted expiratory muscle effort. Dyspnea and discomfort despite 'supported' breathing." },
      { timeframe: "Hours", event: "Increased WOB from expiratory effort. Patient appears distressed despite normal SBT parameters. May fail weaning trial not from respiratory failure but from ventilator mismatch." },
      { timeframe: "Clinical consequence", event: "Premature switch back to full ventilation mode — unnecessarily prolonging mechanical ventilation." },
    ],
    "Failed SBT/weaning attempt from untreated asynchrony — not true respiratory failure.",
    "The beak sign in PSV is a DIAGNOSTIC waveform finding — it tells you exactly where the mismatch is (cycling criterion). Always check PSV cycling criterion when patients show end-inspiratory pressure spikes.",
  ),
  teachingPoints: [
    "Beak sign (end-inspiratory pressure spike) in PSV = delayed cycling",
    "PSV is FLOW-cycled — cycle-off criterion is % of peak flow",
    "Fix: increase cycle criterion (e.g., 25% → 40%) to cycle off sooner",
    "High PS and high resistance both delay cycling by prolonging the flow deceleration curve",
  ],
  keyLearning: "Beak sign in PSV = delayed cycling. PSV is flow-cycled. Increase the cycle-off criterion percentage to terminate the breath earlier and match patient neural Ti.",
};

// ─── 12. Air Trapping ─────────────────────────────────────────────────────────

export const detective_air_trapping: DetectiveCase = {
  id: "detective_air_trapping",
  title: "Air Trapping — Dynamic Hyperinflation",
  difficulty: "intermediate",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 24, ti: 1.0,
    compliance: 70, resistance: 18, autoPeep: 5,
    condition: "auto_peep", asynchrony: "breath_stacking",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 70, resistance: 18,
    condition: "normal", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: true,
  findingTraces: ["flow", "volume", "fv_loop"],
  identifyQuestion: "The VOLUME trace shows an upward-drifting baseline across multiple breaths. The F-V loop's expiratory limb doesn't reach zero volume. What is happening?",
  identifyChoices: [
    ch("a", "Air trapping / dynamic hyperinflation: each breath adds gas to already-incompletely-emptied lungs, progressively increasing end-expiratory lung volume", true,
      "CORRECT. Dynamic hyperinflation: the time constant is longer than the available expiratory time. With each breath, the residual volume at end-expiration increases. The volume trace baseline drifts upward breath-by-breath. F-V loop: the expiratory limb starts at the inspiratory peak but fails to return to the zero-volume axis — it 'floats.'"),
    ch("b", "Breath stacking from double triggering — the volume trace rise represents extra tidal volumes", false,
      "Double triggering produces paired complete breaths with near-zero inter-breath gap. Dynamic hyperinflation produces a GRADUAL upward drift in the volume baseline over multiple breaths."),
    ch("c", "The tidal volume is increasing — the ventilator is in an unstable mode", false,
      "In VC mode, set Vt is constant. The BASELINE is rising, not the tidal volume excursion. This represents progressive volume stacking between breaths."),
    ch("d", "The circuit has a check valve malfunction allowing gas to accumulate", false,
      "Check valve failure would produce sudden large volume discrepancy and alarm. Dynamic hyperinflation is a smooth, progressive process driven by physiology."),
  ],
  physiologyQuestion: "What is the direct clinical danger of progressive dynamic hyperinflation in a mechanically ventilated patient?",
  physiologyChoices: [
    ch("a", "Rising intrathoracic pressure compresses the great veins and right heart, reducing venous return and causing obstructive shock — identical presentation to tension pneumothorax", true,
      "CORRECT. Progressive hyperinflation increases mean intrathoracic pressure. The IVC and superior vena cava are compressed against the elevated lung. Right ventricular preload decreases. CO falls. Clinical presentation: hypotension, tachycardia, JVD, absent breath sounds (bilateral), PEA. Exactly mimics tension pneumothorax. Treatment: disconnect from ventilator and allow passive deflation."),
    ch("b", "Progressive hypocapnia from over-ventilation — the rising lung volumes eliminate more CO₂", false,
      "Hyperinflation is associated with HYPERCAPNIA (increased dead space, V/Q mismatch) rather than hypocapnia."),
    ch("c", "Reduced lung compliance from overdistension — higher Pplat required to deliver each tidal volume", false,
      "While overdistension does reduce compliance, the acute life-threatening danger is the cardiovascular effect (obstructive shock), not compliance alone."),
    ch("d", "Increased shunt fraction from compressed alveoli at the lung bases", false,
      "Dynamic hyperinflation compresses vessels (not alveoli per se). Shunt from compression is less critical than the obstructive shock physiology."),
  ],
  interventionQuestion: "Patient becomes hypotensive (BP 68/42) and you see the dynamic hyperinflation pattern. Immediate action?",
  interventionChoices: [
    ch("a", "Disconnect from the ventilator — allow 30–60 seconds of passive deflation, then reconnect and lower RR/lengthen Te", true,
      "CORRECT. This is the DEFINITIVE emergent treatment for hemodynamic collapse from dynamic hyperinflation. Disconnecting eliminates the pressure source immediately. 30–60 seconds of passive exhalation decompresses the hyperinflated lungs. BP typically recovers dramatically within seconds. Then reconnect with lower RR (allow complete emptying each breath) and treat the underlying cause."),
    ch("b", "Give 2L IV bolus — assume hypovolemia and treat empirically", false,
      "IV fluids for obstructive shock are ineffective and waste critical time. The cause is high intrathoracic pressure blocking venous return — not volume depletion. Decompress first."),
    ch("c", "Increase PEEP to 15 cmH₂O to provide back-pressure against the air trapping", false,
      "Increasing PEEP in dynamic hyperinflation worsens the intrathoracic pressure — this can cause cardiac arrest. Never increase PEEP in hemodynamic collapse from suspected air trapping."),
    ch("d", "Start norepinephrine for hemodynamic support while investigating the cause", false,
      "Vasopressors cannot overcome obstructive physiology — the compression of venous return cannot be pushed through with a pressor. Remove the cause first.", "harmful"),
  ],
  consequenceOfInaction: noAction(
    "Dynamic hyperinflation-induced hemodynamic collapse is rapidly fatal if not recognized.",
    [
      { timeframe: "Minutes", event: "BP continues to fall. HR rises then falls (bradycardia from hypoxia + acidosis).", vitalsChange: { sbp: 60, hr: 140 } },
      { timeframe: "5–10 minutes", event: "PEA cardiac arrest from obstructive shock — no cardiac output despite maintained electrical rhythm.", vitalsChange: { sbp: 0 } },
      { timeframe: "Post-ACLS without recognition", event: "ACLS will be ineffective without ventilator disconnection. CPR through the ventilator perpetuates the compression of venous return." },
    ],
    "PEA arrest — untreatable without ventilator disconnection and recognition of the cause.",
    "DYNAMIC HYPERINFLATION PEA: Disconnect the ventilator. This is the ONLY intervention that works. If you do CPR without disconnecting, you maintain the obstructive physiology and the patient will die.",
  ),
  teachingPoints: [
    "Volume baseline drift upward = progressive air trapping each breath",
    "F-V loop expiratory limb not returning to zero = air trapping",
    "Hemodynamic collapse from hyperinflation: DISCONNECT THE VENTILATOR FIRST",
    "Exactly mimics tension PTX — vent disconnection is both diagnostic and therapeutic",
  ],
  keyLearning: "Volume baseline drift + incomplete F-V loop return = air trapping. Hemodynamic collapse: disconnect vent, deflate, then reconnect at lower RR.",
};

// ─── 13. ETT Cuff Leak (waveform) ────────────────────────────────────────────

export const detective_ett_cuff_leak: DetectiveCase = {
  id: "detective_ett_cuff_leak",
  title: "ETT Cuff Leak — Waveform Pattern",
  difficulty: "basic",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 6, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 6, condition: "ett_cuff_leak", asynchrony: "none",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 6, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 6, condition: "normal", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: false,
  findingTraces: ["pressure", "volume"],
  identifyQuestion: "The inspired Vt is 500 mL. The expired Vt is 310 mL. You hear a hissing sound during inspiration. What is the diagnosis?",
  identifyChoices: [
    ch("a", "ETT cuff leak — gas is escaping around the deflated or ruptured cuff during inspiration", true,
      "CORRECT. The 190 mL volume discrepancy (inspired − expired) is the leak volume per breath. The audible hiss at the mouth during inspiration confirms gas is exiting the upper airway around the ETT cuff. Causes: cuff under-inflated, cuff rupture, ETT positioned at the cricoid (cuff at vocal cords), or tracheomalacia."),
    ch("b", "Circuit disconnect in the expiratory limb — gas escapes after delivery to the patient", false,
      "Expiratory limb disconnect would cause very large volume discrepancy and immediate low-pressure alarm. The hissing would be at the circuit, not at the mouth. ETT cuff leak: the hiss is at the PATIENT's mouth."),
    ch("c", "The patient has a bronchopleural fistula — air is escaping into the pleural space", false,
      "A bronchopleural fistula (BPF) would not produce an audible hiss at the mouth. BPF appears as a persistent air leak in the pleural drainage system. ETT cuff leak produces mouth-level hissing."),
    ch("d", "The flow sensor is malfunctioning and under-reading expired volume", false,
      "Sensor malfunction would not produce an audible hiss at the mouth. Clinical auscultation confirms the leak is at the patient's airway."),
  ],
  physiologyQuestion: "What are the clinical consequences of an untreated ETT cuff leak beyond just volume loss?",
  physiologyChoices: [
    ch("a", "Aspiration risk (subglottic secretions leak into the trachea), PEEP cannot be maintained (alveolar de-recruitment), and increasing FiO₂ requirement", true,
      "CORRECT. Three critical consequences: (1) Subglottic secretion pool drains into trachea → aspiration pneumonitis/VAP. (2) PEEP cannot be maintained → de-recruitment → hypoxemia. (3) The combination requires higher FiO₂. Also: difficult to wean because adequate respiratory support cannot be maintained."),
    ch("b", "The ETT is at risk of displacement upward from the positive pressure escaping", false,
      "ETT displacement risk is from external forces (patient movement, circuit weight) — not from gas escaping a cuff leak."),
    ch("c", "The cuff rupture exposes the tracheal mucosa to direct ETT friction injury", false,
      "While a ruptured cuff does remove the protective cushion, the acute consequence is aspiration and PEEP loss — not mucosal friction."),
    ch("d", "The volume loss elevates PaCO₂ through reduced minute ventilation", false,
      "While reduced effective ventilation can raise CO₂, the cuff leak's leak volume is usually small enough relative to total Vt that CO₂ retention is not the acute primary concern. Aspiration and PEEP loss are more immediate."),
  ],
  interventionQuestion: "Cuff pressure measures 11 cmH₂O (target 20–30 cmH₂O). What is the sequence?",
  interventionChoices: [
    ch("a", "Re-inflate cuff using minimal leak technique or minimum occluding volume → verify cuff pressure 20–30 cmH₂O → measure Vt discrepancy again to confirm leak is resolved", true,
      "CORRECT. Re-inflate with air until hiss disappears (minimum occluding volume) — no more than needed. Verify cuff pressure 20–30 cmH₂O with a calibrated manometer (not by feel). Measure inspired and expired Vt: discrepancy should normalize to < 20 mL. If cuff cannot hold pressure after inflation → cuff rupture → emergency ETT exchange."),
    ch("b", "Intubate a new ETT immediately — the existing cuff is compromised and cannot be trusted", false,
      "Emergency re-intubation for a cuff that simply needs re-inflation is high-risk and unnecessary. Re-inflate first. Only exchange the ETT if the cuff cannot hold pressure after inflation."),
    ch("c", "Increase PEEP by 4 cmH₂O to compensate for the PEEP loss from the leak", false,
      "Compensating PEEP cannot substitute for a sealed cuff — gas will still escape. Fix the cuff first."),
    ch("d", "Transition the patient to a tracheostomy tube — ETT cuff leaks indicate tracheal dilation", false,
      "A simple cuff under-inflation does not indicate tracheal dilation. Tracheostomy is indicated for prolonged ventilation (> 14 days), not for a correctable cuff leak."),
  ],
  consequenceOfInaction: noAction(
    "Untreated ETT cuff leak: aspiration pneumonia, PEEP failure, and impossible-to-maintain ventilation.",
    [
      { timeframe: "Each breath", event: "Pooled subglottic secretions aspirated into the trachea. Aspiration occurs with every inspiration that creates negative subglottic pressure." },
      { timeframe: "Hours", event: "Aspiration pneumonitis. Rapidly progressing to aspiration pneumonia in immunocompromised or critically ill patients." },
      { timeframe: "Hours–days", event: "PEEP failure → de-recruitment → worsening hypoxemia → increasing FiO₂ requirement → oxygen toxicity from sustained high FiO₂." },
    ],
    "VAP and aspiration pneumonia from chronic aspiration through the cuffless airway.",
    "Cuff pressure target: 20–30 cmH₂O (25 cmH₂O is the sweet spot — enough to seal, not enough to ischemia-injure the trachea). Check every 8 hours and after ANY patient repositioning or tube manipulation.",
  ),
  teachingPoints: [
    "Inspired Vt > expired Vt + hissing at mouth = ETT cuff leak",
    "Cuff pressure target: 20–30 cmH₂O — use a calibrated manometer",
    "Aspiration risk is the most dangerous consequence of chronic cuff leak",
    "Check cuff pressure after repositioning, NGT insertion, bronchoscopy",
  ],
  keyLearning: "ETT cuff leak: volume discrepancy + hissing at mouth. Target cuff pressure 20–30 cmH₂O. Re-inflate with minimum occluding volume. Exchange ETT only if cuff cannot hold pressure.",
};

// ─── 14. Premature Cycling ────────────────────────────────────────────────────

export const detective_premature_cycling: DetectiveCase = {
  id: "detective_premature_cycling",
  title: "Premature Cycling (Pressure Support)",
  difficulty: "advanced",
  abnormalConfig: {
    mode: "pressure_support", pressureSupport: 10,
    peep: 5, rr: 20, ti: 0.7,
    compliance: 55, resistance: 7, condition: "normal", asynchrony: "premature_cycling",
  },
  correctedConfig: {
    mode: "pressure_support", pressureSupport: 10,
    peep: 5, rr: 18, ti: 0.9,
    compliance: 55, resistance: 7, condition: "normal", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: false,
  findingTraces: ["flow"],
  identifyQuestion: "The inspiratory FLOW waveform terminates abruptly before fully decelerating. What does this indicate?",
  identifyChoices: [
    ch("a", "Premature cycling: the flow cycling criterion is too high — the vent cycles off before the patient's neural Ti is complete, cutting flow delivery short", true,
      "CORRECT. Normal PSV flow cycling: the decelerating flow curve gradually reaches the cycle-off threshold (e.g., 25% of peak). Premature cycling: the threshold is too HIGH (e.g., 45%), so the vent cycles off much earlier in the deceleration curve — before the patient wanted to stop inhaling. The flow waveform shows abrupt cut-off mid-deceleration."),
    ch("b", "The ETT has a kinked portion that suddenly increases resistance, limiting flow", false,
      "ETT kink would produce a sudden rise in peak pressure and a flow decrease. Premature cycling shows an abrupt NORMAL-appearing flow cut-off at a fixed threshold."),
    ch("c", "The patient is receiving more flow than needed and cycles off voluntarily early", false,
      "Patients don't voluntarily signal early cycling in PSV — the cycling criterion is set by the clinician. Voluntary early exhale would require active muscle effort visible as a pressure spike."),
    ch("d", "Auto-triggering: the ventilator senses circuit vibration and starts a new breath before the first is complete", false,
      "Auto-triggering ADDS breaths — it doesn't terminate them early. Premature cycling cuts short an ongoing breath."),
  ],
  physiologyQuestion: "What is the clinical consequence of premature cycling in a patient with high respiratory drive?",
  physiologyChoices: [
    ch("a", "The patient's inspiratory muscles continue contracting after cycling — attempting to complete the neural Ti through the now-exhalation valve-open circuit. This increases WOB and may trigger a second breath (double triggering)", true,
      "CORRECT. When the vent cycles off before neural Ti ends: the patient's diaphragm is still contracting. The diaphragm continues trying to inhale but now meets expiratory resistance (passive circuit) or immediately meets the trigger threshold → second breath (double trigger). WOB increases significantly as the patient 'fights' to complete each inspiratory cycle."),
    ch("b", "The reduced inspiratory time means less tidal volume is delivered — risk of hypoventilation", false,
      "While reduced Ti may lower Vt in some cases, the more direct consequence is asynchrony and WOB — the patient compensates by increasing respiratory rate and effort."),
    ch("c", "The premature cycling creates reverse triggering — the expiratory flow triggers the diaphragm reflexively", false,
      "Reverse triggering is triggered by INSPIRATION (passive inflation). Premature cycling termination leads to double triggering or increased WOB, not reverse triggering."),
    ch("d", "Lower Vt per breath leads to CO₂ retention and respiratory acidosis over time", false,
      "The primary acute consequence is asynchrony and increased WOB, not CO₂ retention (the patient compensates with higher rate)."),
  ],
  interventionQuestion: "How do you fix premature cycling in PSV?",
  interventionChoices: [
    ch("a", "Decrease the flow cycling criterion from 40% to 25% of peak flow — the vent stays in inspiration longer, matching patient neural Ti", true,
      "CORRECT. Lowering the cycle-off threshold means the vent stays in inspiratory phase until flow decelerates further — allowing more complete delivery of the neural inspiratory cycle. This is the OPPOSITE of delayed cycling management. Note: pneumonia/COPD patients often need higher cycle criteria (they cycle off early naturally from high resistance), while high-drive patients need lower criteria."),
    ch("b", "Increase the PS level to deliver flow faster and complete the breath sooner", false,
      "Higher PS increases peak flow — but the percentage-based criterion means cycle-off is at the same fraction of a higher number. This doesn't necessarily fix premature cycling."),
    ch("c", "Increase the flow cycling criterion from 25% to 40% — cycle off sooner", false,
      "This is the treatment for DELAYED cycling. For premature cycling: DECREASE the criterion to allow longer inspiration."),
    ch("d", "Switch to VC mode with a set Ti that approximates the patient's neural Ti", false,
      "VC with set Ti is a valid alternative, but it requires estimating neural Ti (difficult without esophageal balloon). Adjusting the cycle criterion in PSV is the targeted, evidence-based fix."),
  ],
  consequenceOfInaction: noAction(
    "Premature cycling in a high-drive patient progressively worsens patient comfort and WOB.",
    [
      { timeframe: "Ongoing", event: "Patient uses accessory muscles to supplement inadequate inspiratory time. Sternocleidomastoid, scalenes visibly active." },
      { timeframe: "Hours", event: "Respiratory muscle fatigue from constantly working beyond the vent's assistance. Dyspnea persists despite being 'supported'." },
      { timeframe: "SBT risk", event: "Patient fails spontaneous breathing trial not from insufficient respiratory reserve, but from unsupported post-cycling effort — misidentified as weaning failure." },
    ],
    "False-positive SBT failure — delayed extubation from unrecognized premature cycling.",
    "OPPOSITE INTERVENTIONS: Delayed cycling (beak sign) → INCREASE cycle criterion. Premature cycling (abrupt flow cut-off) → DECREASE cycle criterion. Getting these backwards worsens the patient.",
  ),
  teachingPoints: [
    "Abrupt flow cut-off mid-deceleration in PSV = premature cycling",
    "PSV cycle criteria: delayed cycling → increase %, premature cycling → decrease %",
    "Common in high respiratory drive: sepsis, metabolic acidosis, anxiety",
    "May cause double triggering as a secondary consequence",
  ],
  keyLearning: "Abrupt flow termination mid-deceleration = premature cycling. Decrease the cycle-off criterion % to allow complete neural Ti. Opposite management from delayed cycling.",
};

// ─── 15. Circuit Disconnect ───────────────────────────────────────────────────

export const detective_circuit_disconnect: DetectiveCase = {
  id: "detective_circuit_disconnect",
  title: "Circuit Disconnect",
  difficulty: "basic",
  abnormalConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 6, condition: "circuit_disconnect", asynchrony: "none",
  },
  correctedConfig: {
    mode: "volume_control", flowPattern: "square",
    peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
    compliance: 60, resistance: 6, condition: "normal", asynchrony: "none",
  },
  showPvLoop: false, showFvLoop: false,
  findingTraces: ["pressure", "flow", "volume"],
  identifyQuestion: "ALL three traces (pressure, flow, volume) suddenly collapse toward zero. PEEP cannot be maintained. Which alarm fires first?",
  identifyChoices: [
    ch("a", "LOW PEAK PRESSURE alarm — the circuit pressure drops below the set low-pressure threshold", true,
      "CORRECT. Complete circuit disconnect removes all resistance — the ventilator no longer pressurizes anything meaningful. Circuit pressure drops toward zero. The LOW PRESSURE alarm (set just below expected Ppeak, typically 5–10 cmH₂O below) is the first to fire. THEN: low Vt alarm fires as the expired volume sensor detects near-zero return."),
    ch("b", "HIGH PEAK PRESSURE alarm — sudden pressure change triggers the over-pressure alarm", false,
      "Disconnection causes PRESSURE LOSS, not pressure excess. High-pressure alarms fire in obstruction scenarios (mucous plug, bronchospasm, pneumothorax), not disconnection."),
    ch("c", "APNEA alarm — the vent detects no patient breathing effort", false,
      "Apnea alarm fires after a set period of no spontaneous breaths (typically 20–30 seconds). Low pressure and low volume alarms fire immediately on disconnection."),
    ch("d", "POWER FAILURE alarm — the ventilator senses loss of circuit load and interprets it as a power event", false,
      "Ventilators have separate power monitoring circuits. Circuit disconnect triggers circuit alarms (pressure, volume), not power alarms."),
  ],
  physiologyQuestion: "What are the most dangerous immediate physiological consequences of ventilator disconnection?",
  physiologyChoices: [
    ch("a", "Apnea with progressive hypoxemia and hypercapnia — the patient has no respiratory drive or insufficient drive to maintain oxygenation without mechanical support", true,
      "CORRECT. In a fully ventilator-dependent patient: respiratory drive may be suppressed (sedation, paralysis, neurological injury). Without ventilation: PaO₂ falls rapidly (oxygen stores in FRC are consumed). CO₂ rises. Cardiac arrest from hypoxic VF or hypercapnic respiratory acidosis within 3–5 minutes in a paralyzed patient."),
    ch("b", "Auto-PEEP develops immediately from the disconnected circuit retaining gas", false,
      "Auto-PEEP develops when lungs don't empty — not when the circuit is disconnected. Disconnection causes the opposite: loss of pressure and volume."),
    ch("c", "Pneumothorax from sudden pressure decompression of the lungs", false,
      "Pneumothorax from disconnection would require the lungs to have been at very high pressure AND a sudden pressure differential — this is not the typical mechanism. Pneumothorax causes loss of pressure as well, which is why it's in the differential."),
    ch("d", "Pulmonary edema from loss of PEEP and alveolar flooding", false,
      "Loss of PEEP does promote alveolar de-recruitment, but acute pulmonary edema is not an immediate consequence. Hypoxemia from de-recruitment and apnea are the immediate risks."),
  ],
  interventionQuestion: "You find the patient disconnected from the ventilator. Patient is not breathing. What is your immediate priority sequence?",
  interventionChoices: [
    ch("a", "Manually ventilate with bag-valve-mask (BVM) at 100% FiO₂ while reconnecting or troubleshooting the circuit — call for help simultaneously", true,
      "CORRECT. Remove the immediate threat (apnea + hypoxemia) by providing manual ventilation FIRST. Reconnect the circuit once the patient is being hand-ventilated. If the circuit cannot be reconnected quickly: continue BVM and call for help. NEVER waste time troubleshooting the circuit while the patient is apneic and unventilated."),
    ch("b", "Reconnect the ventilator first — then assess the patient's status", false,
      "If the patient is apneic and hypoxic, reconnecting the vent is important but MANUAL VENTILATION comes first. The vent may need to be reset (it may be in an alarm hold state). Bridge with BVM."),
    ch("c", "Call a code blue immediately while waiting for the team", false,
      "A code blue call is appropriate only if the patient has no pulse or is in arrest. The FIRST action is manual ventilation — which may prevent arrest entirely. Act first; call for help simultaneously."),
    ch("d", "Check SpO₂ and wait 30 seconds to see if the patient has any respiratory drive before intervening", false,
      "A 30-second delay in a sedated/paralyzed patient who is apneic is unacceptable. SpO₂ takes 30–60 seconds to reflect true arterial saturation (pulse oximetry lag). Intervene immediately.", "harmful"),
  ],
  consequenceOfInaction: noAction(
    "Complete ventilator disconnect with a sedated/paralyzed patient: time-critical emergency.",
    [
      { timeframe: "0–60 seconds", event: "FRC oxygen reserve depleted. SpO₂ begins falling.", vitalsChange: { spo2: 90 } },
      { timeframe: "1–3 minutes", event: "Severe hypoxemia. SpO₂ < 80%. Compensatory tachycardia then bradycardia.", vitalsChange: { spo2: 72, hr: 140 } },
      { timeframe: "3–5 minutes", event: "Hypoxic ventricular fibrillation or PEA cardiac arrest.", vitalsChange: { spo2: 40, sbp: 0 } },
      { timeframe: ">5 minutes", event: "Anoxic brain injury begins after 4–6 minutes of complete apnea without resuscitation." },
    ],
    "Cardiac arrest and anoxic brain injury from untreated complete apnea.",
    "DISCONNECT PROTOCOL: BVM FIRST — always. Every RT must be able to perform bag-mask ventilation immediately without equipment preparation. Practice it until it is reflex.",
  ),
  teachingPoints: [
    "ALL traces collapse to zero = circuit disconnect (not patient deterioration)",
    "Low PRESSURE alarm fires first — lowest alarm threshold",
    "IMMEDIATE action: BVM ventilation, then reconnect, then troubleshoot",
    "In paralyzed/sedated patients: 3–5 minutes to cardiac arrest from apnea",
  ],
  keyLearning: "All waveforms flat = disconnect. Low-pressure alarm first. BVM immediately. Never troubleshoot with the patient unventilated.",
};

// ─── Registry ──────────────────────────────────────────────────────────────────

export const WAVEFORM_DETECTIVE_CASES: readonly DetectiveCase[] = [
  detective_auto_peep,
  detective_flow_starvation,
  detective_double_triggering,
  detective_ineffective_trigger,
  detective_reverse_triggering,
  detective_circuit_leak,
  detective_water_in_circuit,
  detective_mucous_plug,
  detective_bronchospasm,
  detective_ards_compliance,
  detective_delayed_cycling,
  detective_air_trapping,
  detective_ett_cuff_leak,
  detective_premature_cycling,
  detective_circuit_disconnect,
];

export function getDetectiveCase(id: string): DetectiveCase | undefined {
  return WAVEFORM_DETECTIVE_CASES.find((c) => c.id === id);
}

export const DETECTIVE_DIFFICULTY_COUNTS = {
  basic: WAVEFORM_DETECTIVE_CASES.filter((c) => c.difficulty === "basic").length,
  intermediate: WAVEFORM_DETECTIVE_CASES.filter((c) => c.difficulty === "intermediate").length,
  advanced: WAVEFORM_DETECTIVE_CASES.filter((c) => c.difficulty === "advanced").length,
};
