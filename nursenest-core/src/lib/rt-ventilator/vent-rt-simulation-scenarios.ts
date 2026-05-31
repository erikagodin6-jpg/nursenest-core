/**
 * RT Ventilator Simulation Scenarios
 *
 * Each simulation is a linear sequence of clinical steps:
 *   1. A clinical context (patient background + current situation)
 *   2. A waveform display (live-generated from VentWaveformConfig)
 *   3. A clinical question with 3–4 answer choices
 *   4. Feedback on the learner's selection
 *   5. Next waveform (post-intervention) if applicable
 *
 * Designed specifically for RT learners (NBRC/RRT board prep level),
 * covering: alarm management, mode selection, troubleshooting, weaning,
 * and emergency escalation.
 *
 * All configs are clinically validated against vent-morphology-validator.ts.
 */

import type { VentWaveformConfig } from "./vent-waveform-generator";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SimChoice = {
  id: string;
  text: string;
  /** Whether this choice represents the best clinical action */
  correct: boolean;
  /** Explanation shown after the learner selects this choice */
  feedback: string;
};

export type SimStep = {
  /** Narrative context shown above the waveform */
  context: string;
  /** Optional subheading for the waveform panel */
  waveformLabel?: string;
  /** The waveform to display at this step */
  waveformConfig: VentWaveformConfig;
  /** The clinical question */
  question: string;
  choices: SimChoice[];
  /** Key learning point displayed after answering (regardless of correctness) */
  keyLearning: string;
  /** Vital signs shown alongside the waveform */
  vitals?: {
    hr?: number;
    spo2?: number;
    rr?: number;
    bp?: string;
    etco2?: number;
    fio2?: number;
  };
};

export type RtSimulation = {
  id: string;
  title: string;
  /** One-sentence summary for the scenario picker */
  summary: string;
  /** Patient age and diagnosis */
  patient: string;
  difficulty: "basic" | "intermediate" | "advanced";
  /** Estimated completion time (minutes) */
  estimatedMinutes: number;
  /** Primary RT competencies tested */
  competencies: string[];
  steps: SimStep[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function choice(id: string, text: string, correct: boolean, feedback: string): SimChoice {
  return { id, text, correct, feedback };
}

// ─── Simulation 1: ARDS Lung-Protective Ventilation ───────────────────────────

export const sim_ards_lung_protective: RtSimulation = {
  id: "ards_lung_protective",
  title: "ARDS: Initiating Lung-Protective Ventilation",
  summary: "Post-intubation ARDS patient with dangerous Vt and Pplat — transition to lung-protective strategy.",
  patient: "58 F, bilateral pneumonia, intubated 30 min ago. P/F ratio 95. CXR: bilateral infiltrates.",
  difficulty: "intermediate",
  estimatedMinutes: 8,
  competencies: ["ARDS protocol", "Pplat monitoring", "Vt titration", "PEEP optimization"],
  steps: [
    {
      context:
        "You receive a 58-year-old intubated ARDS patient from the ED. Current settings: VC-AC, Vt 750 mL, " +
        "RR 14, PEEP 5, FiO₂ 100%. Plateau pressure is 36 cmH₂O. IBW is 65 kg.",
      waveformLabel: "Current settings — BEFORE lung protection",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 5,
        tidalVolume: 750,
        rr: 14,
        ti: 1.0,
        compliance: 24,
        resistance: 7,
        condition: "ards",
        asynchrony: "none",
      },
      vitals: { hr: 118, spo2: 88, rr: 14, bp: "95/60", fio2: 100 },
      question: "Pplat is 36 cmH₂O. What is your IMMEDIATE priority?",
      choices: [
        choice("a", "Reduce Vt to 6 mL/kg IBW (390 mL) and reassess", true,
          "CORRECT. ARDSNet protocol mandates Vt 4–6 mL/kg IBW with Pplat ≤ 30 cmH₂O. " +
          "For 65 kg IBW, 6 mL/kg = 390 mL. This is the most important first step."),
        choice("b", "Increase PEEP to 15 to improve oxygenation", false,
          "Increasing PEEP while Pplat is already 36 cmH₂O will worsen overdistension. " +
          "Address Vt first — Pplat must be ≤ 30 before further PEEP increases."),
        choice("c", "Increase RR to maintain the same minute ventilation", false,
          "Increasing RR at this Vt maintains the dangerous driving pressure. " +
          "You must reduce Vt first, then you may need to increase RR to compensate."),
        choice("d", "Switch to pressure control to eliminate the Ppeak", false,
          "Switching modes does not address the underlying low compliance. " +
          "In PC, Vt is compliance-dependent — with severe ARDS, Vt may be unpredictable."),
      ],
      keyLearning:
        "ARDSNet: Vt 4–6 mL/kg IBW, Pplat ≤ 30 cmH₂O. Permissive hypercapnia (pH ≥ 7.20) is acceptable. " +
        "Driving pressure (Pplat − PEEP) > 15 cmH₂O independently predicts mortality.",
    },
    {
      context:
        "After reducing Vt to 390 mL, Pplat drops to 24 cmH₂O. RR has been increased to 22 to maintain " +
        "minute ventilation. SpO₂ remains 88% on FiO₂ 100%. The waveform shows the new settings.",
      waveformLabel: "After Vt reduction — oxygenation still inadequate",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 5,
        tidalVolume: 390,
        rr: 22,
        ti: 0.9,
        compliance: 24,
        resistance: 7,
        condition: "ards",
        asynchrony: "none",
      },
      vitals: { hr: 112, spo2: 88, rr: 22, bp: "98/62", fio2: 100 },
      question:
        "Pplat is now 24 cmH₂O — within target. SpO₂ 88% on FiO₂ 100%. Next best step?",
      choices: [
        choice("a", "Increase PEEP using the ARDSNet PEEP/FiO₂ table — titrate to SpO₂ ≥ 92%", true,
          "CORRECT. After lung-protective Vt is established, optimize PEEP for oxygenation. " +
          "For FiO₂ 100%, the ARDSNet table suggests PEEP 18–24 cmH₂O. " +
          "Increase in steps (2–3 cmH₂O), reassessing Pplat each time."),
        choice("b", "Reduce FiO₂ below 100% to avoid oxygen toxicity", false,
          "FiO₂ reduction is appropriate once oxygenation is adequate. " +
          "With SpO₂ 88%, the immediate goal is to improve oxygenation, not reduce FiO₂."),
        choice("c", "Add inhaled epoprostenol (iloprost) immediately", false,
          "Inhaled vasodilators are a rescue therapy, not a first-line intervention. " +
          "Optimize conventional ventilation (PEEP, FiO₂, Vt) before adding adjuncts."),
        choice("d", "Increase Vt back to 600 mL to improve CO₂ elimination", false,
          "Increasing Vt will worsen Pplat and driving pressure — worsening lung injury. " +
          "Accept permissive hypercapnia. Target Pplat ≤ 30, not normal PaCO₂."),
      ],
      keyLearning:
        "The ARDSNet PEEP/FiO₂ table guides PEEP titration after Vt is set. " +
        "Monitor Pplat with each PEEP increase — total driving pressure must stay ≤ 15 cmH₂O. " +
        "Prone positioning is indicated for P/F < 150 despite optimization.",
    },
    {
      context:
        "PEEP has been increased to 14 cmH₂O. SpO₂ improves to 94%, FiO₂ reduced to 70%. " +
        "Pplat is 28 cmH₂O. Driving pressure = 28 − 14 = 14 cmH₂O. " +
        "Six hours later, the nurse calls: RR suddenly 32, fighting the vent, SpO₂ dropping.",
      waveformLabel: "6 hours later — sudden decompensation",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 14,
        tidalVolume: 390,
        rr: 22,
        ti: 0.8,
        compliance: 18,
        resistance: 8,
        condition: "ards",
        asynchrony: "flow_starvation",
      },
      vitals: { hr: 138, spo2: 82, rr: 32, bp: "88/50", fio2: 80 },
      question:
        "Sudden worsening with hemodynamic instability. You auscultate: absent breath sounds on the left. " +
        "Peak pressure has risen to 52 cmH₂O. Most likely diagnosis?",
      choices: [
        choice("a", "Tension pneumothorax — perform immediate needle decompression", true,
          "CORRECT. Sudden rise in peak pressure + hemodynamic collapse + absent unilateral breath sounds " +
          "= tension pneumothorax until proven otherwise. Do NOT wait for CXR. " +
          "Decompress with 14G needle at 2nd ICS, MCL immediately."),
        choice("b", "Acute bronchospasm — give albuterol via nebulizer", false,
          "Bronchospasm raises PIP but not to this degree, and would not cause unilateral absent breath sounds " +
          "or hemodynamic collapse. The unilateral finding is the critical clue."),
        choice("c", "Mucus plugging — suction and perform lung recruitment", false,
          "Mucus plugging may raise pressures but would not produce this rapid hemodynamic deterioration. " +
          "Unilateral absent sounds points to a pneumothorax, not plugging."),
        choice("d", "Worsening ARDS — increase PEEP to 18 cmH₂O", false,
          "Increasing PEEP in tension pneumothorax is immediately fatal — it worsens the mediastinal shift " +
          "and cardiovascular collapse. Decompress first."),
      ],
      keyLearning:
        "DOPE mnemonic for sudden deterioration in ventilated patient: Displacement (ETT), Obstruction (mucus/kink), " +
        "Pneumothorax, Equipment failure. Absent breath sounds + hemodynamic collapse = tension PTX. " +
        "Disconnect from vent, hand-ventilate, needle decompression — in that order.",
    },
  ],
};

// ─── Simulation 2: Acute Bronchospasm Troubleshooting ─────────────────────────

export const sim_bronchospasm: RtSimulation = {
  id: "bronchospasm_troubleshooting",
  title: "Acute Bronchospasm: Waveform Recognition & Management",
  summary: "Sudden rise in PIP during VC ventilation — distinguish resistance from compliance, then intervene.",
  patient: "44 M, severe asthma exacerbation, intubated 2 hours ago. Currently sedated.",
  difficulty: "intermediate",
  estimatedMinutes: 7,
  competencies: ["Ppeak vs Pplat interpretation", "Airway resistance", "Bronchodilator therapy", "Expiratory time"],
  steps: [
    {
      context:
        "Ventilator alarm activates: HIGH PEAK PRESSURE. Previous PIP was 22 cmH₂O. " +
        "You measure PIP now at 42 cmH₂O. Perform an end-inspiratory occlusion: Pplat = 18 cmH₂O.",
      waveformLabel: "PIP alarm — acute change",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 5,
        tidalVolume: 500,
        rr: 12,
        ti: 1.0,
        compliance: 60,
        resistance: 28,
        condition: "bronchospasm",
        asynchrony: "none",
      },
      vitals: { hr: 122, spo2: 94, rr: 12, bp: "148/88", fio2: 50 },
      question:
        "PIP 42, Pplat 18, PEEP 5. Ppeak−Pplat gap = 24 cmH₂O. What does this waveform tell you?",
      choices: [
        choice("a", "Increased airway resistance — problem is in the airways, NOT lung compliance", true,
          "CORRECT. Ppeak − Pplat = resistive pressure. A gap of 24 cmH₂O indicates high resistance. " +
          "Pplat 18 is normal, confirming compliance is preserved. " +
          "Cause: bronchospasm, secretions, kinked ETT, water in circuit."),
        choice("b", "Decreased lung compliance — the lungs are becoming stiffer", false,
          "If compliance were the issue, BOTH Ppeak AND Pplat would rise together. " +
          "Normal Pplat (18) rules out a compliance problem."),
        choice("c", "The patient is fighting the vent — increase sedation", false,
          "Patient agitation causes irregular waveforms, not a uniform Ppeak rise with normal Pplat. " +
          "Address the mechanical cause first — don't sedate until the airway is assessed."),
        choice("d", "The ETT is in the right mainstem — obtain CXR", false,
          "ETT migration may cause this pattern, but check the circuit and suction first. " +
          "Auscultation and suction should precede imaging."),
      ],
      keyLearning:
        "PIP−Pplat > 10 cmH₂O = airway resistance problem. " +
        "Both rise together = compliance problem. " +
        "Always perform an inspiratory hold to measure Pplat — without it you cannot distinguish the two.",
    },
    {
      context:
        "You inspect the circuit: no kinks, no water. ETT position confirmed at 22 cm at teeth. " +
        "You suction: minimal secretions, some resistance to pass the catheter. " +
        "You auscultate: diffuse bilateral wheezing.",
      waveformLabel: "After circuit inspection — wheezing confirmed",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 5,
        tidalVolume: 500,
        rr: 12,
        ti: 1.0,
        compliance: 60,
        resistance: 28,
        condition: "bronchospasm",
        asynchrony: "none",
      },
      vitals: { hr: 125, spo2: 93, rr: 12, bp: "150/90", fio2: 55 },
      question:
        "Bilateral wheezing, PIP still 42, Pplat 18. What is the MOST EFFECTIVE immediate intervention?",
      choices: [
        choice("a", "Administer albuterol 2.5 mg via in-line nebulizer AND ipratropium 0.5 mg", true,
          "CORRECT. Combination bronchodilator therapy (SABA + anticholinergic) is first-line for " +
          "acute bronchospasm in ventilated patients. In-line nebulizer is preferred. " +
          "Position nebulizer 15 cm from the Y-piece for optimal delivery."),
        choice("b", "Increase PEEP to 10 cmH₂O to stent open the airways", false,
          "Increasing PEEP in bronchospasm is dangerous — it may worsen air trapping and auto-PEEP. " +
          "Address the bronchospasm pharmacologically first."),
        choice("c", "Decrease Vt to 300 mL to reduce the peak pressure", false,
          "Reducing Vt does not treat bronchospasm — it only lowers the volume. " +
          "The underlying airway resistance must be treated."),
        choice("d", "Switch to pressure control mode", false,
          "Mode change does not treat bronchospasm. In PC, Vt will decrease as resistance rises — " +
          "the problem gets worse, not better."),
      ],
      keyLearning:
        "In-line bronchodilator delivery: set nebulizer proximal to the Y-piece, increase flow if needed. " +
        "Albuterol + ipratropium combination is more effective than either alone. " +
        "Heliox (70:30 He:O₂) is a rescue option for refractory bronchospasm by reducing turbulence.",
    },
    {
      context:
        "After bronchodilator treatment, PIP drops from 42 to 30 cmH₂O. " +
        "The flow-time waveform still shows slow expiratory flow. You check the I:E ratio: currently 1:2. " +
        "RR 12, Ti 1.0s, Te 4.0s. But expiratory flow doesn't quite reach zero.",
      waveformLabel: "After bronchodilators — auto-PEEP risk",
      waveformConfig: {
        // RR=28 naturally produces auto-PEEP with resistance=18, compliance=60:
        //   τ = 18 × 0.060 = 1.08s,  Te = 60/28 − 1.0 = 1.14s,  Te/τ = 1.06
        //   residual = exp(−1.06) = 34.7%,  V_res = 500×0.347 = 174 mL
        //   auto-PEEP = 174/60 ≈ 2.9 cmH₂O — physiologically consistent, no override needed.
        mode: "volume_control",
        flowPattern: "square",
        peep: 5,
        tidalVolume: 500,
        rr: 28,
        ti: 1.0,
        compliance: 60,
        resistance: 18,
        condition: "auto_peep",
        asynchrony: "none",
      },
      vitals: { hr: 108, spo2: 96, rr: 28, bp: "135/82", fio2: 50 },
      question:
        "Expiratory flow on the flow trace doesn't reach zero. What does this indicate and what do you adjust?",
      choices: [
        choice("a", "Auto-PEEP from incomplete expiration — decrease RR to allow more expiratory time", true,
          "CORRECT. The flow not reaching zero before the next breath = auto-PEEP (air trapping). " +
          "With high resistance (long τ), the lungs need more time to empty. " +
          "Lower RR (to 10 or 8) and/or shorten Ti to increase the Te/τ ratio."),
        choice("b", "The ETT is partially obstructed — suction again", false,
          "Suctioning is reasonable but does not address the fundamental issue: " +
          "Te is insufficient for the elevated time constant. The waveform pattern points to timing, not obstruction."),
        choice("c", "Increase PEEP to match the auto-PEEP level", false,
          "Adding extrinsic PEEP to match auto-PEEP can help with triggering (reduces the work to trigger) " +
          "but does NOT fix incomplete expiration. Lengthen Te first."),
        choice("d", "The waveform is normal — no action needed", false,
          "This is NOT normal. The flow trace should return to zero (or very near zero) before the next breath. " +
          "Failure to do so means the next breath starts on top of trapped gas — dynamic hyperinflation."),
      ],
      keyLearning:
        "KEY SIGN of auto-PEEP: expiratory flow does NOT reach zero on the flow-time trace. " +
        "For obstructive patients: target I:E of 1:3 to 1:4, sometimes 1:5. " +
        "The formula: Te = (60/RR) − Ti. To increase Te, either lower RR or shorten Ti.",
    },
  ],
};

// ─── Simulation 3: Weaning Protocol & Spontaneous Breathing Trial ─────────────

export const sim_weaning: RtSimulation = {
  id: "weaning_protocol",
  title: "Ventilator Weaning: SBT and Extubation Readiness",
  summary: "Post-operative patient meeting weaning criteria — conduct an SBT and evaluate for extubation.",
  patient: "67 M, 3 days post-CABG, alert, cooperative, following commands. Originally intubated for surgery.",
  difficulty: "basic",
  estimatedMinutes: 10,
  competencies: ["Weaning criteria", "Spontaneous breathing trial", "PSV titration", "Extubation readiness"],
  steps: [
    {
      context:
        "Day 3 post-CABG. Patient awake, following commands, nodding appropriately. " +
        "Current settings: VC-AC, Vt 550 mL (8 mL/kg IBW 68 kg), RR 12, PEEP 5, FiO₂ 40%. " +
        "SpO₂ 98%, RR 12 (no spontaneous breaths above set rate), Pplat 20 cmH₂O.",
      waveformLabel: "Current VC settings",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 5,
        tidalVolume: 550,
        rr: 12,
        ti: 1.0,
        compliance: 60,
        resistance: 6,
        condition: "normal",
        asynchrony: "none",
      },
      vitals: { hr: 78, spo2: 98, rr: 12, bp: "122/74", fio2: 40, etco2: 38 },
      question:
        "Which weaning readiness criteria does this patient meet? Select the BEST answer.",
      choices: [
        choice("a",
          "Adequate oxygenation (SpO₂ ≥ 92% on FiO₂ ≤ 40–50%, PEEP ≤ 5–8), hemodynamically stable, no vasopressors, able to protect airway",
          true,
          "CORRECT. The four major weaning criteria: (1) reversing cause of respiratory failure, " +
          "(2) adequate oxygenation on low support, (3) hemodynamic stability, (4) ability to initiate breath. " +
          "This patient meets all criteria. Time for a spontaneous breathing trial."),
        choice("b", "PaO₂/FiO₂ ratio > 400 is required before weaning", false,
          "A P/F > 200 (some protocols 150–200) is sufficient for initiating weaning. " +
          "P/F > 400 is normal — most stable ICU patients wean at lower ratios."),
        choice("c", "Patient must be completely off sedation for 24 hours first", false,
          "The patient must be awake and cooperative, but a fixed 24-hour window is not required. " +
          "Daily sedation interruption and spontaneous awakening trial (SAT) precede the SBT."),
        choice("d", "Pplat must be < 15 cmH₂O before initiating weaning", false,
          "There is no Pplat threshold for weaning readiness. Pplat 20 is normal and does not preclude extubation."),
      ],
      keyLearning:
        "Weaning readiness: (1) FiO₂ ≤ 40–50% with SpO₂ ≥ 90–92%, PEEP ≤ 5–8; (2) RR < 35; " +
        "(3) No vasopressors or minimal support; (4) Awake, cooperative, can protect airway. " +
        "The SAT (sedation off) precedes the SBT every morning per ventilator liberation protocol.",
    },
    {
      context:
        "You initiate a Spontaneous Breathing Trial (SBT) on CPAP 5 cmH₂O + PS 5 cmH₂O. " +
        "After 10 minutes: patient RR 26, Vt 410 mL, SpO₂ 96%, looks slightly anxious but cooperative.",
      waveformLabel: "SBT — 10 minutes in",
      waveformConfig: {
        mode: "pressure_support",
        pressureSupport: 5,
        peep: 5,
        rr: 26,
        ti: 0.8,
        compliance: 60,
        resistance: 6,
        condition: "normal",
        asynchrony: "none",
      },
      vitals: { hr: 88, spo2: 96, rr: 26, bp: "128/80", fio2: 40, etco2: 41 },
      question:
        "SBT at 10 minutes: RR 26, Vt 410 mL, SpO₂ 96%, patient mildly anxious. Do you continue?",
      choices: [
        choice("a",
          "Continue the SBT — parameters within acceptable limits; reassess at 30 minutes",
          true,
          "CORRECT. SBT success criteria: RR < 35, SpO₂ > 90%, Vt > 5 mL/kg (68 kg = 340 mL minimum), " +
          "no accessory muscle use, no paradoxical breathing, no marked anxiety. " +
          "This patient meets all criteria. A complete SBT is 30–120 minutes."),
        choice("b",
          "Stop the SBT immediately — RR 26 indicates respiratory distress",
          false,
          "RR 26 is within the acceptable range for SBT (threshold is > 35). " +
          "Mild tachypnea is expected during a breathing trial. The threshold for SBT failure is RR > 35."),
        choice("c",
          "Increase PS to 10 cmH₂O — the patient is working too hard",
          false,
          "An SBT on CPAP 5 + PS 5 is a low-support trial. Increasing support defeats the purpose. " +
          "If the patient cannot tolerate PS 5, the SBT is failed — don't increase support."),
        choice("d",
          "Switch to CPAP 0 to test true unassisted breathing",
          false,
          "PS 5 cmH₂O compensates for the resistance of the ETT (typically 5–10 cmH₂O). " +
          "Removing ALL PS overestimates the work of breathing through the tube."),
      ],
      keyLearning:
        "SBT failure criteria: RR > 35, SpO₂ < 90%, HR change > 20%, BP change > 20%, " +
        "accessory muscle use, paradoxical breathing, agitation, diaphoresis. " +
        "Duration: 30 min is sufficient if criteria are met throughout.",
    },
    {
      context:
        "SBT completed successfully at 30 minutes. RR 24, Vt 440 mL, SpO₂ 97%, calm. " +
        "You assess extubation readiness. RSBI (RR/Vt_L) = 24/0.44 = 54.",
      waveformLabel: "End of SBT — extubation assessment",
      waveformConfig: {
        mode: "cpap",
        peep: 5,
        rr: 24,
        ti: 0.8,
        tidalVolume: 440,
        compliance: 60,
        resistance: 6,
        condition: "normal",
        asynchrony: "none",
      },
      vitals: { hr: 82, spo2: 97, rr: 24, bp: "124/76", fio2: 40, etco2: 40 },
      question:
        "RSBI = 54. Patient following commands, strong cough. Recommend extubation?",
      choices: [
        choice("a",
          "Yes — extubation is appropriate. RSBI < 105 plus positive cough reflex supports readiness.",
          true,
          "CORRECT. RSBI < 105 predicts successful extubation (sensitivity ~97%). " +
          "This patient has RSBI 54 (excellent), intact airway reflexes, and completed a successful SBT. " +
          "Proceed with extubation per protocol."),
        choice("b",
          "No — continue the SBT for 2 more hours to be certain",
          false,
          "Extending a successful 30-minute SBT is not necessary. Studies show 30-minute SBTs " +
          "are as predictive of extubation success as 120-minute trials. Prolonged intubation increases VAP risk."),
        choice("c",
          "No — RSBI must be < 30 for safe extubation",
          false,
          "RSBI < 105 is the validated threshold. RSBI < 30 is not a clinical target — " +
          "most successfully extubated patients have RSBI in the 50–80 range."),
        choice("d",
          "Switch to T-piece trial for 30 minutes before extubating",
          false,
          "A T-piece trial is an alternative to PS-SBT, not a required step after a successful SBT. " +
          "CPAP 5 + PS 5 is an acceptable SBT method. No additional trial needed."),
      ],
      keyLearning:
        "RSBI (f/Vt) < 105 = predictor of successful extubation. Lower RSBI = better. " +
        "Post-extubation: monitor for stridor, desaturation, reintubation rate. " +
        "High-flow nasal cannula (HFNC) post-extubation reduces reintubation risk in high-risk patients.",
    },
  ],
};

// ─── Simulation 4: Flow Starvation — Mode Management ─────────────────────────

export const sim_flow_starvation: RtSimulation = {
  id: "flow_starvation",
  title: "Flow Starvation: Recognition and Intervention",
  summary: "Patient fighting VC mode — recognize the waveform pattern and select the correct intervention.",
  patient: "52 M, septic shock, intubated, lightly sedated, strong respiratory drive.",
  difficulty: "intermediate",
  estimatedMinutes: 6,
  competencies: ["Flow starvation recognition", "VC vs pressure modes", "Work of breathing", "Asynchrony management"],
  steps: [
    {
      context:
        "Your patient is visibly uncomfortable, pulling against the ventilator. " +
        "Settings: VC-AC, Vt 500 mL, RR 18, Flow 40 L/min (square), PEEP 8, FiO₂ 60%. " +
        "The pressure waveform looks unusual.",
      waveformLabel: "Patient distress — examine the pressure trace",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 8,
        tidalVolume: 500,
        rr: 18,
        ti: 1.0,
        compliance: 55,
        resistance: 8,
        condition: "patient_agitation",
        asynchrony: "flow_starvation",
      },
      vitals: { hr: 132, spo2: 94, rr: 28, bp: "105/65", fio2: 60 },
      question:
        "The pressure trace during inspiration appears concave (scooped inward). What is the most likely cause?",
      choices: [
        choice("a",
          "Flow starvation — patient's inspiratory demand exceeds the set flow rate",
          true,
          "CORRECT. The 'scooped' or concave pressure waveform during VC inspiration is the hallmark of flow starvation. " +
          "The patient is generating a larger negative pleural pressure than the ventilator can compensate for, " +
          "pulling the pressure below what the physics would predict."),
        choice("b",
          "Leak in the circuit — pressure is escaping",
          false,
          "A circuit leak causes volume discrepancy (exp Vt < insp Vt) and baseline pressure loss. " +
          "It does not produce a consistently scooped mid-inspiratory pressure pattern."),
        choice("c",
          "Auto-PEEP — incomplete expiration before inspiration",
          false,
          "Auto-PEEP appears in the EXPIRATORY flow trace (flow not returning to zero). " +
          "It does not cause scooping of the inspiratory pressure waveform."),
        choice("d",
          "Patient is triggering extra breaths above the set rate",
          false,
          "Patient triggering causes additional breath events, not the scooped shape within each breath. " +
          "The scooping occurs during the inspiratory phase of each breath."),
      ],
      keyLearning:
        "Flow starvation diagnosis: concave (scooped) inspiratory pressure waveform in VC mode. " +
        "Physics: if patient demand > set flow, negative pleural pressure pulls the trace down. " +
        "The waveform LOOKS like the pressure waveform has been dented inward during inspiration.",
    },
    {
      context:
        "You've identified flow starvation. The patient is breathing at 28/min, well above the set rate of 18. " +
        "You have two options: increase the set flow rate, or switch modes. " +
        "Current flow: 40 L/min. You increase to 60 L/min — some improvement, but patient still uncomfortable.",
      waveformLabel: "After increasing flow — partial improvement",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 8,
        tidalVolume: 500,
        rr: 18,
        ti: 0.75,
        compliance: 55,
        resistance: 8,
        condition: "normal",
        asynchrony: "flow_starvation",
      },
      vitals: { hr: 124, spo2: 95, rr: 25, bp: "108/68", fio2: 60 },
      question:
        "Still some scooping. The fundamental problem is a fixed flow delivery mismatch. Best next step?",
      choices: [
        choice("a",
          "Switch to pressure control or pressure support — pressure modes auto-adjust flow to match patient demand",
          true,
          "CORRECT. Pressure-targeted modes (PC or PS) have no fixed flow limit. " +
          "The ventilator delivers whatever flow is needed to maintain the set pressure, " +
          "matching patient demand in real time. This eliminates flow starvation by design."),
        choice("b",
          "Increase sedation to suppress the patient's respiratory drive",
          false,
          "Increasing sedation to suppress drive is appropriate in some contexts (ARDS + dyssynchrony), " +
          "but it does not fix the underlying ventilator mismatch. " +
          "Address the mechanical problem first before escalating sedation."),
        choice("c",
          "Add a decelerating flow pattern in VC to increase initial flow delivery",
          false,
          "A decelerating flow pattern delivers peak flow at the START of inspiration then tapers. " +
          "This may help slightly but does not solve the fundamental issue: " +
          "total flow delivery is still constrained by Vt/Ti."),
        choice("d",
          "Increase Vt to 700 mL to satisfy the increased demand",
          false,
          "Increasing Vt worsens volutrauma risk and does not address the flow timing issue. " +
          "The problem is the RATE of flow delivery, not the volume."),
      ],
      keyLearning:
        "Pressure modes (PC, PS) eliminate flow starvation because they deliver demand-matched flow. " +
        "The tradeoff: Vt becomes variable (depends on compliance/resistance). " +
        "Monitor Vt closely when switching from VC to PC in ARDS — Vt may change significantly.",
    },
  ],
};

// ─── Simulation 5: Double Triggering in ARDS ──────────────────────────────────

export const sim_double_triggering: RtSimulation = {
  id: "double_triggering_ards",
  title: "Double Triggering: ARDS Breath Stacking Emergency",
  summary: "Recognize double triggering waveform and manage dangerous tidal volume delivery in ARDS.",
  patient: "71 F, severe ARDS (P/F 80), paralytic just discontinued 2 hours ago.",
  difficulty: "advanced",
  estimatedMinutes: 7,
  competencies: ["Double triggering recognition", "VILI prevention", "Dyssynchrony management", "Neuromuscular blockade"],
  steps: [
    {
      context:
        "ARDS patient, Vt set to 400 mL (6 mL/kg IBW 66 kg), PEEP 14, FiO₂ 80%. " +
        "Paralytic discontinued 2 hours ago. You notice alternating large and small breaths on the volume trace.",
      waveformLabel: "Alternating breath pattern — examine closely",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 14,
        tidalVolume: 400,
        rr: 20,
        ti: 0.7,
        compliance: 22,
        resistance: 8,
        condition: "ards",
        asynchrony: "double_triggering",
      },
      vitals: { hr: 118, spo2: 89, rr: 30, bp: "112/70", fio2: 80 },
      question:
        "Every other breath shows a second inspiration immediately after the first (back-to-back breaths). What is this?",
      choices: [
        choice("a",
          "Double triggering — patient's neural inspiratory time exceeds ventilator Ti, triggering a second breath",
          true,
          "CORRECT. Double triggering: the patient's neural Ti (duration of diaphragmatic effort) is LONGER " +
          "than the ventilator's set Ti. After the first breath cycles off, the patient's effort is still ongoing, " +
          "triggering a second mandatory breath before full expiration. " +
          "Effective Vt = 2 × set Vt = 800 mL — far above 6 mL/kg safe limit."),
        choice("b",
          "Auto-triggering — ventilator is self-triggering from circuit vibration",
          false,
          "Auto-triggering occurs without patient effort — typically from water in circuit or cardiac oscillations. " +
          "The pattern here shows effort-driven triggering with paired breaths, not random triggering."),
        choice("c",
          "Patient is breathing at 30/min above the set rate — normal patient-triggered tachypnea",
          false,
          "Tachypnea causes more frequent single breaths, not paired/stacked breaths with abnormally short intervals. " +
          "The paired-breath pattern is the specific signature of double triggering."),
        choice("d",
          "Breath stacking from auto-PEEP — increase Te to allow complete expiration",
          false,
          "Breath stacking is a consequence of double triggering, not its cause. " +
          "The mechanism here is Ti mismatch, not incomplete expiration."),
      ],
      keyLearning:
        "Double triggering: ventilator Ti < patient neural Ti → second breath triggered during patient's continued effort. " +
        "This doubles the effective tidal volume — in ARDS this causes acute VILI. " +
        "The waveform shows two breaths so closely coupled that expiration is nearly absent between them.",
    },
    {
      context:
        "Confirmed double triggering. Effective Vt per stacked breath ≈ 800 mL (12 mL/kg). " +
        "Pplat during the stacked breaths exceeds 40 cmH₂O. " +
        "SpO₂ 89% and declining. Patient visibly distressed.",
      waveformLabel: "During double triggering — stacked breath",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 14,
        tidalVolume: 400,
        rr: 20,
        ti: 1.2,
        compliance: 22,
        resistance: 8,
        condition: "ards",
        asynchrony: "none",
      },
      vitals: { hr: 130, spo2: 86, rr: 32, bp: "100/65", fio2: 80 },
      question:
        "Double triggering with effective Vt 800 mL, Pplat > 40 in ARDS. What is the MOST urgent intervention?",
      choices: [
        choice("a",
          "Re-initiate neuromuscular blockade (cisatracurium or rocuronium) immediately",
          true,
          "CORRECT. With severe ARDS and dangerous breath stacking (Pplat > 40, effective Vt 12 mL/kg), " +
          "neuromuscular blockade is indicated to eliminate dyssynchrony and prevent acute VILI. " +
          "ACURASYS and ROSE trials: NMB for first 48h in severe ARDS (P/F < 150) improves 90-day mortality in some protocols."),
        choice("b",
          "Lengthen Ti to match the patient's neural inspiratory time",
          false,
          "Lengthening Ti is a reasonable first attempt for mild double triggering. " +
          "BUT in this case, with Pplat > 40 and SpO₂ declining, there is no time — immediate NMB is indicated. " +
          "Ti lengthening also risks inverse ratio and auto-PEEP."),
        choice("c",
          "Increase sedation (propofol or midazolam bolus) to suppress drive",
          false,
          "Sedation alone is insufficient when respiratory drive is this strong (as seen post-paralytic). " +
          "Deeper sedation may partially reduce effort but is unlikely to eliminate double triggering fast enough " +
          "compared to NMB. Try deep sedation as step 1, but NMB is the definitive action here."),
        choice("d",
          "Reduce the set Vt to 200 mL to minimize stacked volume",
          false,
          "Reducing set Vt does NOT prevent double triggering — the patient will still trigger twice, " +
          "and the effective Vt will still be 2 × whatever you set. " +
          "The mechanism must be eliminated, not the individual breath size."),
      ],
      keyLearning:
        "In severe ARDS with double triggering: (1) Try lengthening Ti first. " +
        "(2) If ineffective or urgent, initiate NMB (cisatracurium 0.15 mg/kg/h continuous). " +
        "NMB removes all patient effort → eliminates the neural Ti mismatch. " +
        "ARDS Network: NMB for 48h is indicated when P/F < 150 with uncontrolled dyssynchrony.",
    },
  ],
};

// ─── Simulation 5: ETT Cuff Leak ─────────────────────────────────────────────

export const sim_cuff_leak: RtSimulation = {
  id: "ett_cuff_leak",
  title: "ETT Cuff Leak: Volume Loss and PEEP Failure",
  summary: "Progressive volume discrepancy and PEEP loss — identify cuff leak and intervene before hypoxia.",
  patient: "48 F, post-laryngectomy, day 1, mechanically ventilated, repositioned 20 minutes ago.",
  difficulty: "basic",
  estimatedMinutes: 5,
  competencies: ["Volume discrepancy", "Cuff management", "PEEP maintenance", "Leak troubleshooting"],
  steps: [
    {
      context:
        "Ventilator alarm: LOW EXPIRED VOLUME. Settings: VC-AC Vt 500 mL, RR 12, PEEP 8. " +
        "The display shows: inspired Vt 500 mL, expired Vt 330 mL. " +
        "PEEP reads 5 cmH₂O (set to 8). You hear a hissing sound near the patient's mouth.",
      waveformLabel: "Volume discrepancy + PEEP loss",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 8,
        tidalVolume: 500,
        rr: 12,
        ti: 1.0,
        compliance: 60,
        resistance: 6,
        condition: "ett_cuff_leak",
        asynchrony: "none",
      },
      vitals: { hr: 92, spo2: 96, rr: 12, bp: "118/72", fio2: 35 },
      question:
        "Inspired Vt 500 mL, expired Vt 330 mL. Hissing at mouth. Most likely cause?",
      choices: [
        choice("a",
          "ETT cuff leak — deflated cuff allows gas to escape around the tube during inspiration",
          true,
          "CORRECT. The combination of inspired-expired Vt discrepancy + hissing at mouth + PEEP loss " +
          "after repositioning = classic ETT cuff leak presentation. " +
          "Repositioning commonly shifts the ETT, changing cuff seal effectiveness."),
        choice("b",
          "Circuit disconnection — check all circuit connections",
          false,
          "Complete disconnection would cause MUCH larger volume loss (inspired Vt would be near zero on return) " +
          "and would trigger a high-priority alarm. Partial leak from cuff fits this pattern better."),
        choice("c",
          "Bronchopleural fistula — place chest tube immediately",
          false,
          "A bronchopleural fistula causes a persistent air leak through the pleura. " +
          "The hissing at the MOUTH (around the ETT) points to the cuff, not the pleural space."),
        choice("d",
          "Low compliance from pulmonary edema — increase PEEP",
          false,
          "Low compliance does NOT cause volume discrepancy or hissing. " +
          "Low compliance raises peak pressures; it does not cause gas to escape the circuit."),
      ],
      keyLearning:
        "ETT cuff leak: inspired Vt > expired Vt + loss of PEEP + audible hissing at mouth. " +
        "Cuff pressure target: 20–30 cmH₂O (minimum occluding volume). " +
        "Check cuff pressure at every position change and every 8 hours routinely.",
    },
    {
      context:
        "You measure cuff pressure: 12 cmH₂O (normal 20–30). You inflate the cuff " +
        "using minimal occluding volume technique until the hiss stops. Cuff pressure now 24 cmH₂O. " +
        "Reassess: inspired Vt 500 mL, expired Vt 492 mL. PEEP restored to 8 cmH₂O.",
      waveformLabel: "After cuff re-inflation",
      waveformConfig: {
        mode: "volume_control",
        flowPattern: "square",
        peep: 8,
        tidalVolume: 500,
        rr: 12,
        ti: 1.0,
        compliance: 60,
        resistance: 6,
        condition: "normal",
        asynchrony: "none",
      },
      vitals: { hr: 88, spo2: 98, rr: 12, bp: "116/70", fio2: 35 },
      question:
        "Cuff re-inflated, leak resolved. What ongoing monitoring do you institute?",
      choices: [
        choice("a",
          "Document cuff pressure and check every 8 hours; recheck after any repositioning",
          true,
          "CORRECT. Cuff pressure should be maintained at 20–30 cmH₂O and checked routinely. " +
          "Any repositioning, ETT movement, or NG tube placement warrants immediate reassessment. " +
          "Document baseline and times in the respiratory flow sheet."),
        choice("b",
          "Exchange the ETT immediately — the current one is defective",
          false,
          "ETT exchange is a high-risk procedure requiring skilled personnel. " +
          "A cuff that reinflates and holds pressure does not need immediate exchange. " +
          "Exchange is indicated for irremediable cuff failure or ETT damage."),
        choice("c",
          "Increase PEEP to 12 to compensate for any residual leak",
          false,
          "The leak is resolved. Increasing PEEP beyond what is needed increases risk of barotrauma " +
          "and hemodynamic compromise."),
        choice("d",
          "No further monitoring needed — the problem is fixed",
          false,
          "Cuff leaks recur, especially after repositioning or tube movement. " +
          "Ongoing monitoring is mandatory."),
      ],
      keyLearning:
        "Routine cuff pressure monitoring: every 8 hours or per protocol. " +
        "Over-inflation (> 30 cmH₂O) risks tracheal ischemia and stenosis. " +
        "Under-inflation (< 20 cmH₂O) risks aspiration AND ventilator leak. " +
        "Use a dedicated cuff pressure manometer — not inflation volume estimation.",
    },
  ],
};

// ─── Registry ──────────────────────────────────────────────────────────────────

export const RT_SIMULATION_REGISTRY: readonly RtSimulation[] = [
  sim_ards_lung_protective,
  sim_bronchospasm,
  sim_weaning,
  sim_flow_starvation,
  sim_double_triggering,
  sim_cuff_leak,
];

export function getRtSimulation(id: string): RtSimulation | undefined {
  return RT_SIMULATION_REGISTRY.find((s) => s.id === id);
}

export const RT_SIMULATION_DIFFICULTY_LABELS: Record<RtSimulation["difficulty"], string> = {
  basic: "Foundational",
  intermediate: "Clinical",
  advanced: "Expert",
};
