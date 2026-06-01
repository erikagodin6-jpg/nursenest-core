/**
 * Phase 3F — Transport Respiratory Therapy Simulations
 *
 * 10 transport RT simulations covering ground, helicopter, and fixed-wing transport.
 *
 * Clinical references:
 *   - CAMTS (Commission on Accreditation of Medical Transport Systems) Standards
 *   - Air & Surface Transport Nurses Association (ASTNA) Core Curriculum
 *   - Transport Medicine (Martinez & Wachsmuth)
 *   - Hamilton Health Sciences Transport Team Protocol Library
 */

import type { AdvancedSimulation, ConsequenceOfInaction } from "./vent-advanced-simulation-engine";
import { adv, step, makeSimulation } from "./vent-advanced-simulation-engine";
import type { VentWaveformConfig } from "./vent-waveform-generator";

const noAction = (desc: string, events: ConsequenceOfInaction["timeline"], outcome: string, pearl: string): ConsequenceOfInaction =>
  ({ description: desc, timeline: events, finalOutcome: outcome, clinicalPearl: pearl });

const TRANSPORT_VC: VentWaveformConfig = {
  mode: "volume_control",
  flowPattern: "square",
  peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
  compliance: 60, resistance: 7, condition: "normal", asynchrony: "none",
};

// ─── 1. Altitude Physiology ───────────────────────────────────────────────────

export const transport_altitude: AdvancedSimulation = makeSimulation(
  "transport_altitude",
  {
    category: "transport",
    title: "Helicopter Transport — Altitude Physiology",
    summary: "How cabin altitude affects ventilated patients — FiO₂, cuff pressure, gas volume changes.",
    patient: "54 F, ARDS (P/F 160) on VC ventilation. Helicopter transport from community hospital to tertiary center at 3,000 ft altitude.",
    difficulty: "intermediate",
    estimatedMinutes: 8,
    competencies: ["Altitude physiology", "Dalton's law", "Boyle's law", "ETT cuff management at altitude"],
  },
  [
    step("alveolar_gas", {
      context: "Takeoff at 3,000 feet cabin altitude equivalent. Patient on FiO₂ 60%. SpO₂ was 94% on the ground. 15 minutes into flight: SpO₂ 88%. No equipment alarms.",
      waveformConfig: TRANSPORT_VC,
      vitals: { hr: 118, spo2: 88, rr: 14, bp: "112/68", fio2: 60 },
      question: "Why does SpO₂ drop at altitude even with the same FiO₂ setting on the ventilator?",
      choices: [
        adv("a", "At 3,000 ft cabin altitude, barometric pressure is lower (~697 mmHg vs 760 mmHg at sea level). FiO₂ 60% delivers LESS oxygen per breath because: PAO₂ = FiO₂ × (PB − PH₂O) − PaCO₂/R. Lower PB → lower PAO₂ → lower PaO₂.", true,
          "CORRECT. Dalton's Law and the alveolar gas equation: PAO₂ = FiO₂ × (PB − 47) − (PaCO₂ / 0.8). At sea level: PB = 760 mmHg. At 3,000 ft: PB ≈ 697 mmHg. At FiO₂ 0.60: PAO₂ decreases by approximately 38 mmHg. In an ARDS patient with already limited reserve, this translates directly to SpO₂ desaturation. FIX: increase FiO₂ to compensate for altitude (target same PAO₂)."),
        adv("b", "The transport vent blends differently at altitude — actual delivered FiO₂ is lower than displayed", false,
          "Modern transport ventilators are calibrated for altitude-independent FiO₂ delivery. The set FiO₂ represents the fraction of O₂ in the gas mixture, which doesn't change. What changes is the PARTIAL PRESSURE of that O₂ due to lower ambient pressure."),
        adv("c", "Turbulence at altitude causes airway derecruitment — PEEP is less effective", false,
          "PEEP effectiveness is not diminished by turbulence — it is a pressure-based lung mechanics intervention. The SpO₂ drop is from reduced alveolar PO₂ at altitude."),
        adv("d", "Hypothermia from the helicopter cabin causes peripheral vasoconstriction — SpO₂ pulse oximetry reads falsely low", false,
          "While cold extremities can impair peripheral SpO₂ accuracy, the MECHANISM of desaturation at altitude is reduced alveolar PO₂ — a real physiological effect, not a measurement artifact."),
      ],
      nextKey: "cuff_altitude",
      keyLearning: "Altitude physiology: lower PB → lower PAO₂ → lower PaO₂. Alveolar gas equation: PAO₂ = FiO₂ × (PB - 47) - PaCO₂/0.8. Increase FiO₂ to compensate. Know your cabin altitude.",
      consequenceOfInaction: noAction(
        "Progressive hypoxemia from altitude-related PAO₂ reduction in an ARDS patient.",
        [
          { timeframe: "15–30 minutes", event: "SpO₂ continues to fall. Tachycardia from hypoxemia.", vitalsChange: { spo2: 82 } },
          { timeframe: "30–60 minutes", event: "Severe hypoxemia → cardiac arrhythmia.", vitalsChange: { sbp: 85 } },
        ],
        "Hemodynamic compromise from altitude-induced hypoxemia.",
        "TRANSPORT RULE: Anticipate altitude effects BEFORE takeoff. Increase FiO₂ 10–15% above ground level to pre-compensate for altitude. Reassess SpO₂ at cruising altitude and adjust.",
      ),
    }),
    step("cuff_altitude", {
      context: "SpO₂ improved to 93% after FiO₂ increased to 75%. Now: the transport RT notices the ETT cuff pressure was set at 25 cmH₂O on the ground. At altitude, cuff pressure must be reassessed.",
      waveformConfig: TRANSPORT_VC,
      vitals: { hr: 112, spo2: 93, rr: 14, bp: "114/70", fio2: 75 },
      question: "Why does ETT cuff pressure change at altitude, and what adjustment do you make?",
      choices: [
        adv("a", "Boyle's Law: at lower pressure (altitude), gas in the cuff EXPANDS — same amount of air occupies MORE volume, INCREASING cuff pressure. Must check and DEFLATE the cuff slightly at altitude to maintain 20–30 cmH₂O.", true,
          "CORRECT. Boyle's Law: P₁V₁ = P₂V₂. At altitude (lower barometric pressure), the air in the ETT cuff expands (same moles of air → larger volume at lower external pressure → higher effective cuff pressure against the tracheal wall). This INCREASES tracheal mucosal pressure — risk of ischemia and aspiration due to over-inflation. FIX: deflate cuff slightly to bring pressure back to 20–30 cmH₂O at altitude. Use a cuff pressure manometer."),
        adv("b", "Cuff pressure decreases at altitude because lower atmospheric pressure reduces the cuff-to-trachea pressure differential", false,
          "The cuff inflating pressure (from the compressed air inside it) INCREASES at altitude because Boyle's law causes gas expansion. The tracheal wall pressure from the cuff INCREASES, not decreases."),
        adv("c", "Cuff pressure does not change at medical transport altitudes (< 10,000 ft)", false,
          "Boyle's law effects begin at ANY altitude above sea level. While the effect is smaller at low altitude transports, it is still clinically significant in patients already at the upper limit of cuff pressure (30 cmH₂O)."),
        adv("d", "Fill the cuff with saline instead of air before transport — saline does not compress", false,
          "Saline filling is used in some specialized protocols (e.g., high-altitude military transport > 20,000 ft). It is not standard practice for medical transport altitudes. Air-filled cuffs with monitored pressure are appropriate."),
      ],
      nextKey: "gas_volume",
      keyLearning: "Altitude → gas expands (Boyle's Law). ETT cuff OVER-inflates at altitude → tracheal ischemia risk. Monitor cuff pressure at cruising altitude. Deflate to maintain 20–30 cmH₂O.",
    }),
    step("gas_volume", {
      context: "Cuff adjusted. Now 45 minutes into flight: the patient has a chest tube (pneumothorax from ARDS). Water seal drainage system.",
      waveformConfig: TRANSPORT_VC,
      vitals: { hr: 108, spo2: 94, rr: 14, bp: "118/72", fio2: 70 },
      question: "With a chest tube and water-seal drainage at altitude, what Boyle's Law effect must you manage?",
      choices: [
        adv("a", "Any residual pleural air EXPANDS at altitude — risk of tension pneumothorax development or enlargement of a stable pneumothorax. Ensure the chest tube is on water seal (not clamped) to allow gas expansion to drain freely.", true,
          "CORRECT. Any gas-containing cavity (pneumothorax, chest tube, pneumoperitoneum, air splint) expands at altitude per Boyle's Law. A chest tube patient: ensure the water seal is unclamped and FUNCTIONAL throughout the flight — expanding air must be able to drain. Never clamp a chest tube during altitude changes. If a patient has a known pneumothorax (even small) without a chest tube: consider placing one BEFORE transport — small PTX may become tension at altitude."),
        adv("b", "Altitude has no effect on pleural air — chest tube management is unchanged", false,
          "Boyle's law applies to ALL gas-containing spaces. A 20% increase in altitude-related volume change at 3,000 ft cabin equivalent is clinically significant for pneumothorax."),
        adv("c", "Clamp the chest tube during ascent to prevent water from siphoning back into the pleural space", false,
          "Clamping a chest tube during altitude ascent is dangerous — trapped expanding gas → tension PTX. The water seal prevents backflow; do not clamp the tube."),
        adv("d", "Replace the water-seal system with a one-way Heimlich valve for transport — water seals are not altitude stable", false,
          "Heimlich valves are appropriate for transport INSTEAD of water-seal systems (they are more portable and not gravity-dependent). However, the critical point here is to ensure UNOBSTRUCTED drainage — not whether the specific device is a water seal or flutter valve."),
      ],
      nextKey: "end",
      keyLearning: "Gas expansion at altitude (Boyle's Law): PTX, bowel gas, air splints, ETT cuffs ALL expand. Chest tubes: never clamp during ascent. Small PTX → place chest tube BEFORE air transport.",
    }),
  ],
);

// ─── 2. Transport Vent Failure ─────────────────────────────────────────────────

export const transport_vent_failure: AdvancedSimulation = makeSimulation(
  "transport_vent_failure",
  {
    category: "transport",
    title: "Transport Ventilator Failure",
    summary: "Ventilator fails mid-transport — BVM bridge and abort criteria.",
    patient: "67 M, COPD exacerbation, intubated. Ground transport. Transport vent screen goes blank at 40 minutes.",
    difficulty: "basic",
    estimatedMinutes: 5,
    competencies: ["Transport vent failure", "BVM manual ventilation", "Abort criteria", "O₂ cylinder calculation"],
  },
  [
    step("failure", {
      context: "40 minutes into 75-minute transport. Transport vent goes blank — all power lost. Patient: COPD, intubated, FiO₂ 35%, on O₂ cylinder #1 (2200 PSI). Cylinder #2 backup (2000 PSI) available.",
      waveformConfig: TRANSPORT_VC,
      vitals: { hr: 102, spo2: 92, rr: 12, bp: "138/82", fio2: 35 },
      question: "Transport vent failed with 35 minutes of transport remaining. Decision sequence?",
      choices: [
        adv("a", "BVM ventilation via cylinder O₂ immediately → determine if vent can be power-cycled (restart) → if not, calculate if O₂ supply is adequate to complete transport via BVM vs abort to nearest facility", true,
          "CORRECT. Transport vent failure sequence: (1) BVM IMMEDIATELY — never leave a ventilated patient unventilated; (2) Attempt quick power cycle (some vents restart); (3) Calculate O₂ duration: E-cylinder at 2200 PSI × 0.28 / flow rate (L/min). If BVM requires 15 L/min O₂: 2200 × 0.28 / 15 = 41 min + 2000 × 0.28 / 15 = 37 min = 78 min total → sufficient for 35 remaining minutes. (4) Contact receiving hospital and ground medical control. (5) If O₂ insufficient for BVM completion → divert to nearest ER."),
        adv("b", "Pull over and call for backup — wait for a replacement ventilator", false,
          "Waiting for a replacement vent could take 30–60+ minutes. The patient needs ventilation NOW via BVM while the situation is assessed."),
        adv("c", "Complete transport as planned — the BVM is adequate for 35 more minutes", false,
          "This is a valid decision IF O₂ supply is confirmed adequate. But 'complete as planned' should not be the automatic response — calculate, confirm, then decide. For a COPD patient requiring careful CO₂ management, BVM ventilation for 35 minutes with careful rate monitoring is feasible."),
        adv("d", "Stop ventilation until a vent is available — the patient may have adequate spontaneous drive", false,
          "Never assume adequate spontaneous drive in an intubated patient who was placed on a ventilator for respiratory failure. Continue mechanical/manual ventilation."),
      ],
      nextKey: "bvm_copd",
      keyLearning: "Transport vent failure: BVM immediately, then assess. Calculate O₂ supply. Contact medical control. Divert if O₂ insufficient. For COPD: BVM at rate 12–14, careful not to overventilate (COPD CO₂ retention target pH ≥ 7.30 not normal CO₂).",
    }),
    step("bvm_copd", {
      context: "BVM ventilation initiated. O₂ supply confirmed adequate for 35 remaining minutes at 15 L/min. Patient: COPD, known CO₂ retainer (baseline PaCO₂ 55). Current BVM rate: 20 breaths/min.",
      waveformConfig: TRANSPORT_VC,
      vitals: { hr: 98, spo2: 93, rr: 20, bp: "136/80", fio2: 40 },
      question: "BVM rate 20/min for a COPD CO₂ retainer. What is wrong with this?",
      choices: [
        adv("a", "OVERVENTILATION — rate 20/min removes too much CO₂. For a COPD patient with baseline PaCO₂ 55, targeting PaCO₂ 40 causes acute pH change. Target BVM rate 10–12/min to maintain the patient's usual hypercapnic baseline.", true,
          "CORRECT. COPD CO₂ retainer management: the danger is acute CO₂ lowering. This patient's baseline PaCO₂ is 55 mmHg. Ventilating at 20/min will drive CO₂ down rapidly → metabolic alkalosis → dysrhythmia, seizure risk. Target: BVM rate to MAINTAIN baseline PaCO₂ (use pre-transport ABG as guide). If no baseline ABG: target normal rate (12/min) and accept mild hypercapnia. The worst outcome: hyperventilating a CO₂ retainer → severe alkalosis → VF."),
        adv("b", "Rate 20/min is appropriate — BVM is less efficient than mechanical ventilation, so higher rate compensates", false,
          "BVM efficiency varies but the CO₂ management target is the same regardless of device. For a CO₂ retainer, lower rate is required."),
        adv("c", "Rate 20/min is correct — COPD patients need higher respiratory rates to overcome airway obstruction", false,
          "Higher rate in COPD → shorter expiratory time → worsening auto-PEEP (already a risk). And the CO₂ lowering is dangerous. Lower rate is required."),
        adv("d", "The rate should be determined by SpO₂ only — adjust to maintain SpO₂ > 95%", false,
          "SpO₂ guidance is appropriate for oxygenation (FiO₂ adjustment). CO₂ management requires rate (and Vt) adjustment. SpO₂ alone does not guide ventilation rate."),
      ],
      nextKey: "end",
      keyLearning: "COPD CO₂ retainer + BVM: target rate 10–12/min. Avoid overventilation — acute CO₂ lowering causes alkalosis and dysrhythmia. Target patient's BASELINE CO₂, not normal CO₂.",
    }),
  ],
);

// ─── 3. Oxygen Supply Calculation ─────────────────────────────────────────────

export const transport_o2_calculation: AdvancedSimulation = makeSimulation(
  "transport_o2_calculation",
  {
    category: "transport",
    title: "O₂ Supply Calculation for Transport",
    summary: "Calculate O₂ duration for a 90-minute fixed-wing transport with multiple scenarios.",
    patient: "Ventilated ARDS patient. FiO₂ 80% (40 L/min at PEEP 12 pressure). 90-minute fixed-wing transfer.",
    difficulty: "basic",
    estimatedMinutes: 6,
    competencies: ["O₂ cylinder duration formula", "H-cylinder vs E-cylinder", "Reserve calculation", "Transport planning"],
  },
  [
    step("calculate", {
      context: "You have: 3 × H-cylinders (2,400 PSI each). Transport vent uses 40 L/min at current settings. Flight is 90 minutes. Factor: H-cylinder = 3.14 L/PSI.",
      waveformConfig: TRANSPORT_VC,
      vitals: { hr: 112, spo2: 92, rr: 20, bp: "102/62", fio2: 80 },
      question: "H-cylinder at 2400 PSI, 40 L/min flow. How many minutes per cylinder, and is 3 cylinders enough for 90 minutes?",
      choices: [
        adv("a", "Single H-cylinder: 2400 × 3.14 / 40 = 188 minutes. Three cylinders = 564 minutes total. 90-min flight needs 90 + 30 min buffer = 120 min. 3 H-cylinders FAR exceeds requirement — 1.5 cylinders would suffice.", true,
          "CORRECT. Formula: Duration = (PSI × cylinder factor) / flow rate (L/min). H-cylinder factor = 3.14. 2400 × 3.14 / 40 = 188 minutes per cylinder. 3 cylinders = 564 minutes. TRANSPORT RULE: always bring 3× the calculated need. For 90 minutes you need 1 full H-cylinder with 2 full backups. Having 3 H-cylinders at 2400 PSI is appropriate and safe."),
        adv("b", "2400 × 0.28 / 40 = 16.8 minutes per cylinder. 3 cylinders = 50 minutes. NOT ENOUGH for 90 minutes.", false,
          "0.28 is the E-cylinder factor. H-cylinder factor is 3.14. Using the wrong factor gives a dangerously wrong answer. Difference: E-cylinder ≈ 680L content; H-cylinder ≈ 7500L content at full pressure."),
        adv("c", "Cannot calculate without knowing the specific cylinder volume rating from the manufacturer label", false,
          "The standardized formula uses cylinder factors that account for the standard gas volume at standard pressure. E-cylinder = 0.28, H-cylinder = 3.14 — these are universally applicable to standard medical O₂ cylinders."),
        adv("d", "H-cylinders are rated for 100 minutes each — 3 provides 300 minutes, easily sufficient", false,
          "This is a made-up number. Always calculate using the formula. 'Rated for X minutes' varies entirely with flow rate — a cylinder lasts longer at lower flow."),
      ],
      nextKey: "reserve",
      keyLearning: "O₂ duration: (PSI × factor) / flow. E-cylinder factor = 0.28, H-cylinder = 3.14. ALWAYS calculate. ALWAYS bring 3× calculated need. Wrong cylinder factor = dangerous planning error.",
    }),
    step("reserve", {
      context: "50 minutes into the flight: cylinder 1 reads 1,200 PSI. Flow unchanged at 40 L/min. Expected duration remaining: 1200 × 3.14 / 40 = 94 minutes. Flight has 40 minutes remaining.",
      waveformConfig: TRANSPORT_VC,
      vitals: { hr: 108, spo2: 93, rr: 18, bp: "106/64", fio2: 80 },
      question: "Cylinder 1 at 1200 PSI with 40 minutes of flight remaining. Do you switch to cylinder 2?",
      choices: [
        adv("a", "Not yet — cylinder 1 has 94 minutes remaining (1200 × 3.14 / 40). Landing in 40 minutes. However: SWITCH NOW anyway if below 500 PSI is your hospital protocol (some use 500 PSI as mandatory changeover threshold).", true,
          "CORRECT. Mathematical answer: 1200 PSI provides 94 minutes at 40 L/min — more than the 40 minutes remaining. However: many transport programs mandate cylinder changeover at 500 PSI or 25% remaining as a safety buffer. If your protocol mandates ≥ 500 PSI minimum, switch now. If not, monitor closely and plan switch point. Key: KNOW YOUR PROTOCOL and calculate CONTINUOUSLY throughout transport — don't assume 'full cylinder = fine.'"),
        adv("b", "Switch to cylinder 2 immediately — any cylinder below 50% should be changed during transport", false,
          "50% rule is a rough guideline, not a universal standard. Use the formula to calculate actual remaining duration, then apply protocol thresholds. Mathematical calculation gives a more reliable answer than arbitrary percentage thresholds."),
        adv("c", "Cannot switch mid-flight — changing cylinders risks gas supply interruption", false,
          "Switching cylinders is a routine transport skill. The changeover takes seconds and the vent's built-in reservoir (and backup cylinders) prevents any supply interruption. Practice cylinder changes on the ground so it is reflexive in flight."),
        adv("d", "Stay on cylinder 1 — it has 94 minutes remaining and the flight is only 40 minutes", false,
          "Technically correct mathematically, but safety margins matter in transport. Apply your protocol's changeover threshold. 1200 PSI with 40 minutes remaining is adequate mathematically but check protocol requirements."),
      ],
      nextKey: "end",
      keyLearning: "O₂ monitoring: calculate continuously. Protocol changeover threshold (often 500 PSI) may differ from mathematical minimum. Know your protocol AND the formula. Practice cylinder changes until reflexive.",
    }),
  ],
);

// ─── 4. Neonatal Transport ────────────────────────────────────────────────────

export const transport_neonatal: AdvancedSimulation = makeSimulation(
  "transport_neonatal",
  {
    category: "transport",
    title: "Neonatal Transport — Premature Infant",
    summary: "Stabilizing a 28-weeker before interfacility transport to a NICU.",
    patient: "28-week infant at a community hospital without NICU. RDS on CPAP. Needs transport to Level III NICU.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["Neonatal transport physiology", "Thermal management", "Neonatal vent transport", "Family communication"],
  },
  [
    step("stabilize", {
      context: "28-weeker, 1050g. CPAP 6, FiO₂ 35%. SpO₂ 88%. Glucose 2.2 mmol/L. Temperature 36.4°C. Transport team 60 minutes away.",
      vitals: { hr: 168, spo2: 88, rr: 65, bp: "38/20", temp: 36.4, fio2: 35 },
      question: "Priority stabilization tasks in the 60 minutes before transport team arrives?",
      choices: [
        adv("a", "SIMULTANEOUSLY: (1) Warm transport incubator to 36–37°C; (2) Glucose bolus D10W 2 mL/kg IV → D10W infusion 80 mL/kg/day; (3) Optimize CPAP (increase to 7 if SpO₂ < 90%); (4) IV access; (5) Place NG tube (avoid BVM mask issues); (6) Document maternal/delivery information.", true,
          "CORRECT. Neonatal transport 'STABILE' framework: Sugar (glucose ≥ 2.5 mmol/L), Temperature (36.5–37.5°C axillary), Airway (CPAP/intubation as needed), Blood pressure, Lab work, Emotional support (family), Emotional support (family). Multiple critical issues simultaneously: glucose 2.2 is hypoglycemic (neurotoxic) → immediate D10W bolus + infusion. Temperature 36.4 is hypothermic → pre-warm incubator + active warming. SpO₂ 88% → optimize CPAP."),
        adv("b", "Wait for transport team to arrive — they will stabilize on arrival", false,
          "60 minutes of untreated hypoglycemia causes irreversible neuronal injury in a 28-weeker. Stabilization must begin IMMEDIATELY with the community hospital team. Do not wait."),
        adv("c", "Intubate the infant immediately — CPAP is inadequate for transport", false,
          "CPAP is appropriate for a 28-weeker with any respiratory effort. Intubation is not required unless CPAP fails (FiO₂ > 40% or clinical deterioration). Intubation adds risk and is not automatically required for transport."),
        adv("d", "Administer surfactant immediately — all 28-weekers need surfactant before transport", false,
          "Surfactant at FiO₂ 35% on CPAP 6 is borderline — not yet meeting clear criteria (FiO₂ > 30% on CPAP ≥ 6). The transport team should assess and decide on surfactant. Delay surfactant does not cause immediate harm in 60 minutes of an otherwise stable infant."),
      ],
      nextKey: "family",
      keyLearning: "Neonatal pre-transport: STABILE framework. Glucose, temperature, airway, BP — all must be addressed BEFORE transport. Hypoglycemia in a 28-weeker: treat in minutes, not hours.",
    }),
    step("family", {
      context: "Infant stabilized. Transport team arriving in 20 minutes. Parents are present: distraught, asking if their baby will survive. SpO₂ now 92%.",
      vitals: { hr: 162, spo2: 92, rr: 60, bp: "40/22", temp: 36.8, fio2: 32 },
      question: "Family communication before a high-risk neonatal transport — what is your approach?",
      choices: [
        adv("a", "Honest, compassionate, age-specific information: acknowledge severity, explain the transport process, name the receiving hospital and their specific NICU capabilities, offer for one parent to accompany if transport vehicle allows, provide direct phone numbers for both units.", true,
          "CORRECT. Neonatal transport family communication principles: (1) Be honest without being brutal — 'very sick, needs specialized care, we are doing everything possible'; (2) Explain the transport process step by step (parents imagine the worst); (3) Name the destination (reassures that a plan exists); (4) Allow parent to accompany if space permits (rotor wing often cannot; ground transport usually can); (5) Give direct contact numbers for both sending and receiving units; (6) Document the conversation."),
        adv("b", "Don't discuss survival statistics — give only the most optimistic information to reduce parental distress", false,
          "Parents deserve honest information. Studies show that families given accurate information, even when concerning, report better coping than those given falsely reassuring information. Avoidance of the truth is a violation of family-centered care principles."),
        adv("c", "Defer all family communication to the transport team — you are the community hospital RT and it is not your role", false,
          "The 20 minutes before transport arrive is a critical communication window. The family needs support now — from whoever is present. Family communication is a shared professional responsibility, not exclusively the transport team's role."),
        adv("d", "Focus only on explaining the medical condition — don't mention survival prospects", false,
          "Parents will ask about survival. Refusing to engage with this question leaves them with only their fears. Compassionate, honest engagement — even if the answer is 'we don't yet know' — is better than avoidance."),
      ],
      nextKey: "end",
      keyLearning: "Neonatal transport family communication: honest + compassionate + specific. Name the destination, explain the process, offer accompaniment if possible, provide contact numbers. Families need information to trust the plan.",
    }),
  ],
);

// ─── 5. Cardiac Arrest During Transport ───────────────────────────────────────

export const transport_cardiac_arrest: AdvancedSimulation = makeSimulation(
  "transport_cardiac_arrest",
  {
    category: "transport",
    title: "Cardiac Arrest During Air Transport",
    summary: "VF during helicopter transport — managing ACLS in a moving aircraft.",
    patient: "58 M, post-STEMI, stable post-PCI. Helicopter transfer. 30 min into 60-min flight: VF arrest.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["Transport ACLS", "Defibrillation safety in aircraft", "Crew communication", "Divert decision"],
  },
  [
    step("vf_in_flight", {
      context: "30 minutes into helicopter flight. Monitor alarm: VF. No pulse. SpO₂ lost. Pilot notified. Three crew: transport physician, transport RN, RT.",
      vitals: { hr: 0, spo2: 0, rr: 14, bp: "0/0", fio2: 100 },
      question: "VF in a helicopter. Unique considerations for in-flight defibrillation?",
      choices: [
        adv("a", "Notify pilot BEFORE defibrillation — radio call: 'Defibrillation in 10 seconds.' All crew must be touching only the patient (not metal aircraft structures). Land immediately if possible — ground ACLS is safer. Defibrillate at 200J biphasic.", true,
          "CORRECT. In-flight defibrillation safety: (1) Pilot notification — defibrillation can interfere with aircraft avionics (pilot must know); (2) All personnel must be 'clear' of conductive surfaces (helicopter floor, stretcher rails); (3) Use standard ACLS energy (200J biphasic); (4) LAND if safe landing zone is nearby — in-flight CPR quality is poor (cannot mount properly for compression depth); (5) Limit crew contact with metal during shock delivery."),
        adv("b", "Do not defibrillate in flight — wait until landing. Perform CPR only.", false,
          "VF without defibrillation has near-zero survival after > 3–5 minutes. CPR alone does not convert VF. Defibrillate in flight after pilot notification and safety checks — it is both safe and necessary."),
        adv("c", "Increase altitude immediately — lower temperature and pressure may convert VF spontaneously", false,
          "No physiological mechanism supports altitude-induced VF conversion. The only effective VF treatment is defibrillation."),
        adv("d", "Abort the flight immediately — ACLS requires a flat, stable surface", false,
          "Immediate landing should be sought, but do not delay first defibrillation attempt while arranging landing. Defibrillate, continue ACLS, and land simultaneously."),
      ],
      nextKey: "rosc_inflight",
      keyLearning: "In-flight defibrillation: notify pilot, all-clear of metal, standard ACLS energy. Defibrillate — do NOT wait for landing. Land as soon as safely possible. In-flight CPR quality is limited by space.",
      consequenceOfInaction: noAction(
        "VF without defibrillation: 10% survival decrease per minute.",
        [
          { timeframe: "3 minutes", event: "VF → fine VF → asystole. CPR maintains electrical activity for defibrillation but does not convert VF." },
          { timeframe: "5 minutes", event: "VF degrades to asystole. Survival without prior defibrillation approaches zero." },
        ],
        "Death from untreated VF.",
        "DEFIBRILLATION IS TIME-CRITICAL. Every minute of delay reduces survival by 10%. In-flight defibrillation is safe with proper technique. Waiting for landing is not acceptable.",
      ),
    }),
    step("rosc_inflight", {
      context: "ROSC after 2 shocks + 1 round epinephrine. HR 68, BP 86/52. 20 minutes remaining in flight. Post-ROSC management in the aircraft.",
      vitals: { hr: 68, spo2: 94, rr: 14, bp: "86/52", fio2: 100 },
      question: "ROSC achieved at 20 minutes from destination. Decision: land now or continue to planned destination?",
      choices: [
        adv("a", "Continue to planned PCI-capable destination if hemodynamically stable — post-ROSC STEMI requires re-PCI assessment. If hemodynamically unstable → divert to nearest facility.", true,
          "CORRECT. Post-ROSC STEMI transport: if the patient is stable (BP adequate, SpO₂ maintained), continuing to the PCI-capable center is preferred — re-catheterization is often needed post-arrest STEMI and the nearest facility may not have this capability. If hemodynamically unstable: divert to stabilize. STEMI ROSC guideline: proceed to cath lab even post-arrest if STEMI is the cause of arrest (ACC/AHA 2022)."),
        adv("b", "Land immediately at the nearest facility — any ROSC requires immediate ground care", false,
          "ROSC is not automatically an indication for immediate diversion. If stable, the patient benefits more from reaching the intended PCI-capable center than from a diversion to a potentially less equipped facility."),
        adv("c", "ROSC is unstable — return to origin hospital which knows the patient", false,
          "Returning to origin (20 minutes back) loses 40 minutes of transport time when the patient needs PCI evaluation. The destination PCI center is the appropriate facility."),
        adv("d", "ROSC is stable — no further intervention needed, routine transport resumes", false,
          "Post-ROSC care is active: monitor for re-arrest, target SpO₂ 94–98% (avoid hyperoxia), normocapnia, avoid hypotension. Ongoing active management is required."),
      ],
      nextKey: "end",
      keyLearning: "Post-ROSC transport decision: stable → continue to PCI center. Unstable → nearest capable facility. Post-ROSC STEMI → cath lab assessment. Avoid hyperoxia post-ROSC (SpO₂ 94–98%).",
    }),
  ],
);

// ─── 6. Massive Trauma Transport ──────────────────────────────────────────────

export const transport_trauma: AdvancedSimulation = makeSimulation(
  "transport_trauma",
  {
    category: "transport",
    title: "Massive Trauma — Ventilated Transfer",
    summary: "Intubated trauma patient with TBI + pulmonary contusion — ventilation targets during transfer.",
    patient: "22 M, MVC, GCS 6 pre-intubation. CT: bilateral pulmonary contusion, brain hemorrhage. Transfer to trauma center.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["TBI ventilation targets", "Pulmonary contusion", "Competing vent requirements", "Damage control resuscitation"],
  },
  [
    step("tbi_vent", {
      context: "22-year-old MVC, GCS 6. CT: bilateral pulmonary contusion + subdural hematoma + SAH. Intubated. P/F 165 (mild-moderate ARDS from contusion). GCS pre-RSI 6.",
      waveformConfig: { ...TRANSPORT_VC, compliance: 40, resistance: 8 },
      vitals: { hr: 118, spo2: 92, rr: 14, bp: "162/88", fio2: 50 },
      question: "COMPETING requirements: TBI requires normal CO₂ (35–40 mmHg) vs pulmonary contusion may need lung-protective hypercapnia. Which takes priority and why?",
      choices: [
        adv("a", "TBI takes priority for CO₂ management: target PaCO₂ 35–40 mmHg (normocapnia). Hypercapnia in TBI → cerebral vasodilation → ICP rise → herniation. Accept higher Vt/rate if needed to maintain normocapnia, while keeping Pplat ≤ 30 cmH₂O.", true,
          "CORRECT. TBI ventilation principle: normocapnia (PaCO₂ 35–40 mmHg) is mandatory. Hypercapnia causes cerebral vasodilation → increases CBF → raises ICP → herniation risk. Brain Trauma Foundation guidelines: PaCO₂ 35–40 (AVOID < 35 = vasoconstriction = ischemia; AVOID > 45 = vasodilation = ICP). Pulmonary contusion management is secondary — use Vt that achieves normocapnia while keeping Pplat ≤ 30. Permissive hypercapnia is CONTRAINDICATED in TBI."),
        adv("b", "Pulmonary contusion takes priority: use low Vt 6 mL/kg and accept PaCO₂ 55–60 mmHg (permissive hypercapnia)", false,
          "Permissive hypercapnia is DANGEROUS in TBI. It would cause ICP elevation and cerebral herniation — potentially more immediately fatal than the pulmonary contusion."),
        adv("c", "Both requirements are equal — use the lowest FiO₂ to guide management", false,
          "FiO₂ guidance addresses oxygenation, not ventilation (CO₂). The competing requirements are specifically about CO₂ management — oxygenation and ventilation are separate targets."),
        adv("d", "Hyperventilate to PaCO₂ 30 mmHg — maximal CO₂ lowering maximizes cerebral vasoconstriction", false,
          "Hyperventilation (PaCO₂ < 35) causes cerebral VASOCONSTRICTION → ischemia. It was historically used for acute herniation only (PaCO₂ 30–35 × 15–30 minutes as a BRIDGE to neurosurgical intervention). Prophylactic hyperventilation worsens TBI outcomes. BTF guidelines: avoid PaCO₂ < 35 except for impending herniation as a bridge."),
      ],
      nextKey: "hypotension_tbi",
      keyLearning: "TBI + pulmonary contusion competing needs: TBI wins for CO₂ target. Normocapnia (PaCO₂ 35–40) mandatory in TBI — hypercapnia → ICP rise → herniation. Permissive hypercapnia is CONTRAINDICATED in TBI.",
    }),
    step("hypotension_tbi", {
      context: "En route: BP drops to 88/52. Head CT shows expanding SDH. Currently on phenylephrine. Mannitol or hypertonic saline to reduce ICP being considered.",
      waveformConfig: { ...TRANSPORT_VC, compliance: 38, resistance: 8 },
      vitals: { hr: 132, spo2: 91, rr: 14, bp: "88/52", fio2: 55 },
      question: "SBP 88 mmHg + TBI — which hyperosmolar agent is PREFERRED and what is the BP target?",
      choices: [
        adv("a", "3% Hypertonic saline preferred over mannitol if hypotension is present: mannitol causes osmotic diuresis → may worsen hypovolemia and hypotension → worsens cerebral perfusion. Target MAP ≥ 80 mmHg (BTF: SBP ≥ 100 for age 50–69, ≥ 110 for 15–49). Give HTS 3% 1–2 mL/kg IV bolus.", true,
          "CORRECT. TBI hyperosmolar therapy: (1) Mannitol causes osmotic diuresis → volume depletion → hypotension → worsens CPP in already hypotensive patient. (2) Hypertonic saline (3%): raises serum osmolarity + provides volume expansion → no diuretic effect → preferred in hypotensive TBI. BTF 2016 SBP targets: age 15–49 and > 70: ≥ 110 mmHg; age 50–69: ≥ 100 mmHg. MAP target: ≥ 80 to maintain CPP ≥ 60 mmHg. Give HTS for ICP management while treating the hypotension."),
        adv("b", "Mannitol 0.25–1 g/kg IV — standard ICP-lowering agent", false,
          "Mannitol in a hypotensive TBI patient worsens the hypotension through osmotic diuresis. HTS is preferred when hypotension is present."),
        adv("c", "No hyperosmolar agents in transport — leave ICP management to the receiving hospital", false,
          "A patient with expanding SDH and GCS 6 may herniate during transport. If ICP-lowering agents are indicated (clinical signs of herniation: anisocoria, Cushing response), they must be given NOW, not deferred."),
        adv("d", "Lower SBP to < 100 to reduce the intracranial hemorrhage expansion", false,
          "Permissive hypotension (targeting lower BP) is appropriate for penetrating trauma hemorrhage but is DANGEROUS in TBI. Low CPP → cerebral ischemia. Target MAP ≥ 80 in TBI."),
      ],
      nextKey: "end",
      keyLearning: "TBI + hypotension: hypertonic saline preferred over mannitol (no diuresis). MAP target ≥ 80 mmHg. SBP ≥ 110 for 15–49 y/o. Mannitol worsens hypotension through diuresis.",
    }),
  ],
);

// ─── Registry ──────────────────────────────────────────────────────────────────

export const TRANSPORT_SIMULATIONS: readonly AdvancedSimulation[] = [
  transport_altitude,
  transport_vent_failure,
  transport_o2_calculation,
  transport_neonatal,
  transport_cardiac_arrest,
  transport_trauma,
];

export function getTransportSimulation(id: string): AdvancedSimulation | undefined {
  return TRANSPORT_SIMULATIONS.find((s) => s.id === id);
}

// ─── Master registry ──────────────────────────────────────────────────────────

export function getAllTransportSimulations(): readonly AdvancedSimulation[] {
  return TRANSPORT_SIMULATIONS;
}
