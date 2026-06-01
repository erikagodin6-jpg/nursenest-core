/**
 * Phase 3D — PICU Respiratory Therapy Simulations
 *
 * 15 pediatric critical care simulations.
 *
 * Clinical references:
 *   - PALS Provider Manual (AHA 2020)
 *   - Rogers' Textbook of Pediatric Intensive Care (5th ed)
 *   - GINA Pediatric Asthma Pocket Guide 2022
 *   - PALICC-2 Consensus Statement (Pediatric ARDS 2022)
 *   - SickKids PICU Protocol Library
 */

import type { AdvancedSimulation, ConsequenceOfInaction } from "./vent-advanced-simulation-engine";
import { adv, step, makeSimulation } from "./vent-advanced-simulation-engine";
import { pediatricVentConfig } from "./vent-waveform-generator";

const noAction = (desc: string, events: ConsequenceOfInaction["timeline"], outcome: string, pearl: string): ConsequenceOfInaction =>
  ({ description: desc, timeline: events, finalOutcome: outcome, clinicalPearl: pearl });

// ─── 1. Status Asthmaticus ────────────────────────────────────────────────────

export const picu_status_asthmaticus: AdvancedSimulation = makeSimulation(
  "picu_status_asthmaticus",
  {
    category: "picu",
    title: "Status Asthmaticus — Pediatric",
    summary: "8-year-old failing first-line therapy — escalation to magnesium, heliox, and intubation decision.",
    patient: "8 F, 26 kg, known severe asthma. ED: albuterol × 3, ipratropium × 3, IV methylprednisolone. Worsening.",
    difficulty: "advanced",
    estimatedMinutes: 10,
    competencies: ["Pediatric asthma escalation", "Magnesium dosing", "Heliox", "RSI for asthma", "Post-intubation vent"],
  },
  [
    step("escalate", {
      context: "8-year-old, 26 kg: 3 rounds albuterol 5 mg + ipratropium 500 mcg. Methylprednisolone 40 mg IV (1.5 mg/kg). Now: RR 48, SpO₂ 88%, pulsus paradoxus 18 mmHg, peak flow 30% predicted. Silent chest.",
      waveformConfig: pediatricVentConfig(26, "asthma", "pressure_control"),
      vitals: { hr: 158, spo2: 88, rr: 48, bp: "88/52", fio2: 40 },
      question: "Silent chest, SpO₂ 88%, failing first-line therapy. Next pharmacological escalation?",
      choices: [
        adv("a", "IV magnesium sulfate 50 mg/kg (max 2g) over 20 min + heliox 70:30 via tight-fitting mask + consider IV ketamine 0.3 mg/kg for bronchodilation + sedation", true,
          "CORRECT. Status asthmaticus escalation at this severity: (1) IV magnesium 50 mg/kg (max 2g) — smooth muscle relaxation, evidence Grade I (GINA 2022); (2) Heliox 70:30 — reduces turbulent flow resistance, buys time; (3) Ketamine 0.3 mg/kg IV — bronchodilator + anxiolytic without respiratory depression (maintains drive); (4) BiPAP trial before intubation if cooperative. Silent chest = pre-arrest — this is urgent."),
        adv("b", "Continue albuterol every 20 minutes — the cumulative effect will eventually work", false,
          "The patient has already received 3 doses of albuterol and is deteriorating. Continuing the same therapy expecting different results is not evidence-based."),
        adv("c", "Intubate immediately — silent chest requires immediate airway control", false,
          "Intubation in status asthmaticus is HIGH RISK and should be a last resort. Silent chest is severe but not necessarily immediate intubation — try magnesium + heliox + ketamine first. The post-intubation asthmatic patient is very difficult to manage."),
        adv("d", "IV aminophylline 5 mg/kg loading dose — theophylline for refractory asthma", false,
          "Aminophylline has narrow therapeutic window, significant side effects (arrhythmia, seizures), and limited incremental benefit over beta-agonists. Not recommended in modern status asthmaticus management (GINA 2022)."),
      ],
      nextKey: "post_mag",
      keyLearning: "Status asthmaticus escalation: IV magnesium 50 mg/kg → heliox 70:30 → ketamine IV → BiPAP → intubation (last resort). Intubation in asthma has 20% peri-intubation complication rate.",
      consequenceOfInaction: noAction(
        "Silent chest = near-fatal asthma. Without escalation: respiratory arrest within minutes.",
        [
          { timeframe: "5–10 minutes", event: "CO₂ rising, pH falling. SpO₂ < 80%. Bradycardia preceding arrest.", vitalsChange: { spo2: 78, hr: 52 } },
          { timeframe: "10–15 minutes", event: "Respiratory arrest from CO₂ narcosis and respiratory muscle fatigue.", vitalsChange: { sbp: 0 } },
        ],
        "Respiratory arrest from status asthmaticus.",
        "Silent chest means NO airflow — not improvement. The wheezing has gone because there is nothing moving. This is a 5-minute window, not a 30-minute window.",
      ),
    }),
    step("post_mag", {
      context: "Magnesium given. SpO₂ improves to 93% with heliox. Ketamine 0.3 mg/kg given — child is more relaxed. RR 38. Pulsus 12 mmHg. Considering BiPAP.",
      waveformConfig: pediatricVentConfig(26, "asthma", "pressure_support"),
      vitals: { hr: 138, spo2: 93, rr: 38, bp: "92/56", fio2: 40 },
      question: "BiPAP parameters for pediatric status asthmaticus as a non-invasive bridge?",
      choices: [
        adv("a", "IPAP 12–14 cmH₂O, EPAP 4–5 cmH₂O — low EPAP to avoid worsening air trapping, give via full face mask with coaching for tolerance", true,
          "CORRECT. Pediatric BiPAP for status asthmaticus: low EPAP (4–5 cmH₂O) is critical — high EPAP worsens air trapping in bronchospasm (same as avoiding PEEP in status asthmaticus). IPAP 12–14 reduces WOB. Full face mask preferred (better seal, allows mouth breathing). The child must be cooperative — ketamine helps achieve this. If tolerance fails → intubation."),
        adv("b", "IPAP 20 cmH₂O, EPAP 10 cmH₂O — aggressive support for severe disease", false,
          "High EPAP (10 cmH₂O) in bronchospasm worsens dynamic hyperinflation. IPAP 20 is too high and risks gastric distension. Low EPAP is the key principle."),
        adv("c", "CPAP only (no IPAP) — the obstructed airways need distending pressure not inspiratory support", false,
          "CPAP alone (EPAP without IPAP) provides no inspiratory assistance. Status asthmaticus patients have high WOB and benefit from IPAP reduction. Use BiPAP, not CPAP alone."),
        adv("d", "Nasal cannula BiPAP at 4 L/min — less invasive than full mask", false,
          "Nasal interface provides insufficient seal for acutely ill status asthmaticus. Full face mask is required for effective BiPAP in this context."),
      ],
      nextKey: "intubate_asthma",
      keyLearning: "Pediatric BiPAP for asthma: LOW EPAP (4–5 cmH₂O), IPAP 12–14. Low EPAP is critical to avoid worsening air trapping. Full face mask. Ketamine improves tolerance.",
    }),
    step("intubate_asthma", {
      context: "Despite BiPAP: SpO₂ 88%, RR 52, exhausted — decision made to intubate. ABG: pH 7.18, PaCO₂ 72. You will intubate.",
      waveformConfig: pediatricVentConfig(26, "asthma", "volume_control"),
      vitals: { hr: 148, spo2: 88, rr: 52, bp: "84/48", fio2: 60 },
      labs: { ph: 7.18, paco2: 72, pao2: 52 },
      question: "RSI for status asthmaticus in a child. Best induction agent and what ventilator settings IMMEDIATELY post-intubation?",
      choices: [
        adv("a", "Ketamine 1.5–2 mg/kg IV induction (bronchodilator) + rocuronium 1.2 mg/kg IV. Post-intubation: RR 10–12, Vt 6 mL/kg, PEEP 0–3, accept hypercapnia (pH ≥ 7.20)", true,
          "CORRECT. Ketamine is ideal for asthma RSI: (1) Catecholamine release causes bronchodilation; (2) Does not cause histamine release (unlike morphine). Rocuronium for paralysis. Post-intubation vent: LOW RR (10–12), long Te (I:E 1:4–1:6), low PEEP (0–3), accept hypercapnia. Expected: auto-PEEP will be significant. Expect hemodynamic instability post-intubation from positive pressure + dynamic hyperinflation."),
        adv("b", "Propofol 2 mg/kg + succinylcholine 2 mg/kg. Standard post-intubation settings (RR 20, Vt 8 mL/kg, PEEP 5)", false,
          "Propofol can cause histamine release and is a negative inotrope — risk at this BP. Standard ventilation settings (RR 20, PEEP 5) will cause severe auto-PEEP in a fully obstructed patient. Post-asthma ventilation MUST use low RR and low PEEP."),
        adv("c", "Midazolam 0.1 mg/kg + ketamine + no paralytic (to assess respiratory drive)", false,
          "Midazolam is second-line in status asthmaticus (respiratory depression in already-failing patient). Paralytic IS needed for controlled ventilation in severe asthma — attempting spontaneous breathing in a fully obstructed intubated asthmatic leads to double-triggering and breath stacking."),
        adv("d", "Fentanyl 5 mcg/kg + ketamine, no succinylcholine (prolonged paralysis risk)", false,
          "Fentanyl causes histamine release — avoid in asthma. RSI: fast-onset paralytic (rocuronium + sugammadex reversal available, or succinylcholine if no contraindications) is appropriate."),
      ],
      nextKey: "end",
      keyLearning: "Asthma RSI: ketamine + rocuronium. Post-intubation: RR 10–12, PEEP 0–3, accept hypercapnia. EXPECT auto-PEEP and hemodynamic instability. Have fluids ready for post-intubation BP drop.",
    }),
  ],
);

// ─── 2. Pediatric ARDS ────────────────────────────────────────────────────────

export const picu_pards: AdvancedSimulation = makeSimulation(
  "picu_pards",
  {
    category: "picu",
    title: "Pediatric ARDS (PARDS)",
    summary: "10-year-old with severe PARDS — lung-protective ventilation per PALICC-2 consensus.",
    patient: "10 M, 34 kg, influenza pneumonia. Intubated for respiratory failure. P/F 80 on FiO₂ 80%.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["PARDS definition", "PALICC-2 ventilation", "PEEP optimization", "Prone positioning in children"],
  },
  [
    step("diagnose", {
      context: "10-year-old, 34 kg. Intubated for bilateral influenza pneumonia. PC: PIP 28, PEEP 8, RR 22, FiO₂ 80%. ABG: PaO₂ 64 (P/F 80). CXR: bilateral infiltrates.",
      waveformConfig: pediatricVentConfig(34, "ards", "pressure_control"),
      vitals: { hr: 138, spo2: 89, rr: 22, bp: "88/52", fio2: 80 },
      labs: { ph: 7.32, paco2: 48, pao2: 64, pf_ratio: 80 },
      imaging: "CXR: bilateral dense infiltrates, air bronchograms, low lung volumes.",
      question: "By PALICC-2 definition, what severity of PARDS and what Vt target?",
      choices: [
        adv("a", "Severe PARDS (OI or P/F < 100). PALICC-2: Vt 3–6 mL/kg IBW, higher end if compliance better. For this child (IBW ~35 kg): target Vt 4–6 mL/kg IBW = 140–210 mL", true,
          "CORRECT. PALICC-2 (2022) PARDS severity: Mild OI 4–8 (P/F 200–300), Moderate OI 8–16 (P/F 100–200), Severe OI > 16 (P/F < 100). OI for this patient: (FiO₂% × MAP) / PaO₂ = (80 × 18) / 64 ≈ 22.5 → Severe. Vt target: 3–6 mL/kg IBW with individualization by lung mechanics. Pplat ≤ 28 cmH₂O. Driving pressure ≤ 15 cmH₂O in PARDS."),
        adv("b", "Moderate PARDS — use adult ARDSNet targets exactly: Vt 6 mL/kg, Pplat ≤ 30 cmH₂O", false,
          "PALICC-2 does not simply apply adult ARDSNet. Pediatric targets: Vt 3–6 mL/kg IBW, Pplat ≤ 28 cmH₂O, driving pressure ≤ 15 cmH₂O. P/F 80 = Severe PARDS by PALICC-2."),
        adv("c", "Mild PARDS — standard ventilation, no lung-protective restrictions needed", false,
          "P/F 80 is severe, not mild. Lung-protective ventilation is mandatory."),
        adv("d", "Cannot determine severity without a CT scan of the chest", false,
          "PARDS is a clinical-radiographic diagnosis (bilateral infiltrates + hypoxemia). CT is not required for diagnosis or severity classification."),
      ],
      nextKey: "prone_picu",
      keyLearning: "PALICC-2 Severe PARDS: OI > 16 or P/F < 100. Vt 3–6 mL/kg IBW, Pplat ≤ 28, driving pressure ≤ 15 cmH₂O. Different from adult ARDSNet — pediatric-specific targets.",
    }),
    step("prone_picu", {
      context: "After 8 hours of optimized VC-AC: Vt 4 mL/kg, PEEP 10, FiO₂ 70%. P/F now 95 (still severe). Hemodynamically stable on vasopressors.",
      waveformConfig: pediatricVentConfig(34, "ards"),
      vitals: { hr: 128, spo2: 90, rr: 22, bp: "92/58", fio2: 70 },
      labs: { pf_ratio: 95 },
      question: "P/F 95 after 8 hours of optimal ventilation. Does this child qualify for proning and how is it done?",
      choices: [
        adv("a", "Yes — PALICC-2: prone positioning for severe PARDS (P/F < 150) is supported; requires team of 5–6, ETT secured, all lines/tubes accounted for, prone for ≥ 16 hours per session", true,
          "CORRECT. PALICC-2 supports prone positioning for moderate-severe PARDS (P/F < 150). Pediatric proning requires a team of 5–6 (head, body, 3 limbs), careful ETT securement, padding to prevent pressure injuries, and hourly assessment. Duration ≥ 16 hours per session (same as adult PROSEVA trial). Expected SpO₂/P/F improvement within 4 hours. If no improvement in 4 hours in prone: may not be a 'proning responder.'"),
        adv("b", "No — proning is only for adults; pediatric PARDS uses HFOV instead", false,
          "HFOV and proning are not mutually exclusive, and proning is supported in pediatric PARDS by PALICC-2 and increasing clinical evidence. Proning is NOT adult-only."),
        adv("c", "Yes, but only for 4 hours at a time to limit hemodynamic instability", false,
          "Short prone sessions (< 16 hours) have not been shown to be as effective. Evidence supports ≥ 16-hour sessions per PROSEVA and pediatric data."),
        adv("d", "Only if P/F < 50 — prone is a last resort before ECMO", false,
          "P/F < 150 is the threshold for considering prone. Waiting for P/F < 50 delays a potentially life-saving intervention."),
      ],
      nextKey: "end",
      keyLearning: "PARDS proning: P/F < 150 is the threshold. Team of 5–6, ≥ 16 hours, ETT secured. Assess response at 4 hours. If no response to 2 prone sessions → consider ECMO.",
    }),
  ],
);

// ─── 3. Bronchiolitis RSV ─────────────────────────────────────────────────────

export const picu_bronchiolitis: AdvancedSimulation = makeSimulation(
  "picu_bronchiolitis",
  {
    category: "picu",
    title: "Bronchiolitis — RSV Escalation",
    summary: "8-month-old with RSV bronchiolitis — HFNC to CPAP to intubation decision ladder.",
    patient: "8-month-old, 7.5 kg. RSV+ bronchiolitis. RR 72, SpO₂ 88% on 4 L/min nasal cannula.",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    competencies: ["Bronchiolitis management", "HFNC escalation", "CPAP for bronchiolitis", "Intubation criteria"],
  },
  [
    step("hfnc", {
      context: "8-month-old, 7.5 kg. RSV+, working hard: nasal flaring, subcostal retractions, SpO₂ 88% on NC 4 L/min. No response to nebulized hypertonic saline (not recommended). WORSENING.",
      waveformConfig: pediatricVentConfig(7.5, "bronchiolitis", "pressure_support"),
      vitals: { hr: 182, spo2: 88, rr: 72, bp: "72/44", fio2: 40 },
      question: "First-line escalation for bronchiolitis beyond standard nasal cannula?",
      choices: [
        adv("a", "High-flow nasal cannula (HFNC) at 2 L/kg/min (max 8 L/min for this weight) with FiO₂ to maintain SpO₂ 94–98%", true,
          "CORRECT. HFNC is the current standard first-line escalation for bronchiolitis failing standard NC (multiple RCTs including PARIS trial). Flow: 1–2 L/kg/min (max 8 L/min typically for infants). Benefits: provides wash-out of nasopharyngeal dead space, mild CPAP effect (~2–3 cmH₂O), reduced WOB. Not recommended: nebulized albuterol, corticosteroids, antibiotics, chest physiotherapy (AAP 2014/2019 guidelines)."),
        adv("b", "Albuterol nebulization 0.15 mg/kg — bronchodilate the small airways", false,
          "AAP guideline recommendation: albuterol should NOT be used routinely for bronchiolitis. The pathology is inflammation and mucus, not bronchospasm. Multiple RCTs show no benefit. Do not use."),
        adv("c", "Immediate intubation — RR 72 with retractions requires immediate airway control", false,
          "Intubation in bronchiolitis is a last resort. The vast majority respond to HFNC or CPAP without intubation. RR 72 with SpO₂ 88% warrants HFNC escalation, not immediate intubation."),
        adv("d", "Continuous nebulized epinephrine — racemic epinephrine reduces bronchiolitis severity", false,
          "Racemic epinephrine has short-term effect (60–90 minutes) but does not alter the disease course and causes rebound. AAP does not recommend for hospitalized bronchiolitis."),
      ],
      nextKey: "cpap_bronch",
      keyLearning: "Bronchiolitis escalation: standard NC → HFNC (2 L/kg/min) → CPAP → intubation. Albuterol, steroids, antibiotics NOT indicated (AAP guidelines). HFNC reduces intubation rates.",
    }),
    step("cpap_bronch", {
      context: "After 4 hours of HFNC at 8 L/min, FiO₂ 50%: SpO₂ 91%, RR 65. Increasing apnea spells (every 15 minutes). The child is tiring.",
      waveformConfig: pediatricVentConfig(7.5, "bronchiolitis", "cpap"),
      vitals: { hr: 172, spo2: 91, rr: 65, bp: "70/42", fio2: 50 },
      question: "HFNC failing, apneas developing. Next step?",
      choices: [
        adv("a", "CPAP 5–7 cmH₂O via full face or nasal mask — more reliable alveolar distending pressure than HFNC, more effective for recurrent apnea in bronchiolitis", true,
          "CORRECT. CPAP provides a known, constant PEEP — more predictable than HFNC in a rapidly deteriorating infant. For bronchiolitis with apnea: CPAP 5–7 cmH₂O reduces apnea frequency (positive airway pressure splints the airways during obstructive apnea). If CPAP fails (apnea requiring stimulation > 3×/hour, SpO₂ not improving, worsening work of breathing): intubation."),
        adv("b", "Continue HFNC — increase to 10 L/min and FiO₂ 70%", false,
          "At maximum HFNC flow with clinical deterioration and apnea, escalating further on HFNC is unlikely to be sufficient. CPAP provides more reliable and higher-level support."),
        adv("c", "Immediate nasotracheal intubation — apnea is an absolute indication", false,
          "CPAP can manage mild-moderate apnea in bronchiolitis before intubation. Not every apnea spell in bronchiolitis requires intubation — try CPAP first unless the apnea is prolonged (> 20 sec) or associated with significant bradycardia."),
        adv("d", "Give heliox 70:30 via HFNC — reduces turbulent resistance in bronchiolitis airways", false,
          "Heliox for bronchiolitis has inconsistent evidence and is not standard of care. CPAP is the evidence-based next step."),
      ],
      nextKey: "intubate_bronch",
      keyLearning: "HFNC → CPAP 5–7 cmH₂O for bronchiolitis with apnea. CPAP provides known PEEP and splints airways. Intubation if CPAP fails (recurrent apnea requiring stimulation, worsening SpO₂).",
    }),
    step("intubate_bronch", {
      context: "CPAP 6, FiO₂ 60%: 3 apneas requiring stimulation in 30 minutes, SpO₂ nadir 70%. Decision: intubate. Post-intubation settings?",
      waveformConfig: pediatricVentConfig(7.5, "bronchiolitis", "pressure_control"),
      vitals: { hr: 178, spo2: 91, rr: 0, bp: "68/40", fio2: 60 },
      question: "Post-intubation bronchiolitis ventilation for a 7.5 kg infant. Correct initial settings?",
      choices: [
        adv("a", "PC: PIP 18–20, PEEP 4–5, RR 30, Ti 0.4 s, FiO₂ 60% — avoid high PEEP (worsens air trapping in RSV bronchiolitis)", true,
          "CORRECT. Bronchiolitis ventilation similar to asthma: obstructive physiology requires low PEEP (4–5 cmH₂O, not standard 6–8), longer Te, moderate RR. Target Vt 5–7 mL/kg (38–53 mL for 7.5 kg). PIP 18–20 is appropriate for this lung size and disease. Key: do NOT use high PEEP (worsens air trapping). Frequent suctioning to manage thick RSV secretions."),
        adv("b", "PC: PIP 25, PEEP 8, RR 40 — aggressive support for severe disease", false,
          "High PEEP (8 cmH₂O) in RSV bronchiolitis will worsen air trapping. High PIP and RR worsen dynamic hyperinflation. Use obstructive-pattern settings (low PEEP, longer Te)."),
        adv("c", "VC: Vt 10 mL/kg, PEEP 6, RR 30 — volume guarantee for consistent tidal volumes", false,
          "Vt 10 mL/kg is above lung-protective thresholds. VC can be used but Vt target 5–7 mL/kg (not 10). And PEEP 6 may worsen air trapping."),
        adv("d", "HFOV: MAP 10, amplitude 30, frequency 10 Hz — avoid conventional ventilation in bronchiolitis", false,
          "HFOV is NOT first-line for RSV bronchiolitis. Conventional PC with low PEEP is the appropriate initial approach. HFOV is reserved for refractory cases."),
      ],
      nextKey: "end",
      keyLearning: "Post-intubation bronchiolitis: LOW PEEP (4–5 cmH₂O), moderate RR (30/min), Ti 0.4s. Obstructive physiology. Suction frequently for RSV secretions. Avoid high PEEP.",
    }),
  ],
);

// ─── 4. Foreign Body Aspiration ───────────────────────────────────────────────

export const picu_foreign_body: AdvancedSimulation = makeSimulation(
  "picu_foreign_body",
  {
    category: "picu",
    title: "Foreign Body Aspiration",
    summary: "3-year-old sudden choking episode — unilateral hyperinflation and bronchoscopy management.",
    patient: "3 M, 15 kg. Sudden choking while eating peanuts. Now: SpO₂ 92%, persistent right-sided wheeze.",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    competencies: ["FBA recognition", "Choking response", "CXR interpretation", "Rigid bronchoscopy", "Anesthesia coordination"],
  },
  [
    step("recognize", {
      context: "3-year-old: sudden onset choking at dinner. Persistent wheeze RIGHT chest only. SpO₂ 92% on room air. No stridor. CXR: right lung hyperinflated (overinflated compared to left).",
      waveformConfig: pediatricVentConfig(15, "bronchiolitis", "pressure_support"),
      vitals: { hr: 142, spo2: 92, rr: 38, bp: "88/52", fio2: 21 },
      imaging: "CXR: right lung hyperinflated relative to left. No clear opacity. Mediastinum shifted left.",
      question: "CXR: right lung hyperinflation on inspiration. What does this suggest and why?",
      choices: [
        adv("a", "Right-sided foreign body in a distal right bronchus — ball-valve effect: gas enters during inspiration but cannot exit during expiration, causing progressive hyperinflation of right lung", true,
          "CORRECT. Classic FBA finding: UNILATERAL HYPERINFLATION. A foreign body in the right (most common — right bronchus takes off at less acute angle) causes a ball-valve effect: air enters around the FB during inspiration, but expiratory airway collapse traps the air. On CXR: ipsilateral hyperinflation, mediastinal shift AWAY from the FB. Confirm with bilateral decubitus films (affected side stays hyperinflated when dependent) or fluoroscopy."),
        adv("b", "Right-sided pneumothorax — air in the pleural space causing hyperinflation", false,
          "Pneumothorax: absent lung markings, pleural line visible. FBA hyperinflation: lung markings present throughout the lung (normal lung tissue, just over-inflated). History (choking episode) is critical for diagnosis."),
        adv("c", "Congenital lobar emphysema — pre-existing condition unmasked by the choking episode", false,
          "Congenital lobar emphysema is a pre-existing condition (presents in infancy/early childhood, usually 0–6 months). The ACUTE onset during eating strongly supports FBA, not a pre-existing structural anomaly."),
        adv("d", "Mucous plug causing atelectasis of the left lung making the right appear larger", false,
          "Left lung atelectasis would show left lung as small and opaque (white), not the right as large. The CXR pattern shows right hyperinflation with shift LEFT = right-sided obstruction."),
      ],
      nextKey: "bronchoscopy",
      keyLearning: "FBA: ball-valve effect → ipsilateral hyperinflation, mediastinal shift AWAY from FB. Right bronchus most common site. Unilateral wheeze in a child = FBA until proven otherwise.",
    }),
    step("bronchoscopy", {
      context: "FBA confirmed. ENT + Pediatric Anesthesia assembled for rigid bronchoscopy in OR. You are asked to prepare and assist.",
      waveformConfig: pediatricVentConfig(15, "bronchiolitis"),
      vitals: { hr: 135, spo2: 93, rr: 36, bp: "90/54", fio2: 21 },
      question: "What is the definitive treatment for pediatric FBA and what does your role as RT include?",
      choices: [
        adv("a", "Rigid bronchoscopy under general anesthesia — RT role: maintain oxygenation during the procedure, suction/prepare scopes, manage SpO₂ dips during retrieval, standby for emergency re-intubation", true,
          "CORRECT. Rigid bronchoscopy (not flexible) is the gold standard for FB retrieval — allows ventilation through the scope, allows forceps extraction of solid objects. Flexible bronchoscopy is used for diagnostic purposes and smaller fragments. RT role: (1) Manage SpO₂ during the procedure (frequently dips as scope passes vocal cords); (2) Suction assistance; (3) Be prepared to intubate emergently if scope is removed and patient is apneic."),
        adv("b", "Heimlich maneuver in the OR — the FB may be dislodged with abdominal thrusts", false,
          "Heimlich is for conscious choking patients. A rigid bronchoscopy is required for a foreign body already in a bronchus — it is beyond the reach of abdominal thrusts."),
        adv("c", "Flexible bronchoscopy — less invasive and allows real-time visualization", false,
          "Flexible bronchoscopy is used for visualization and small soft FBs. For a peanut (or any solid, large FB): RIGID bronchoscopy is required for the working channel and forceps size needed."),
        adv("d", "MRI-guided retrieval — real-time imaging will guide non-invasive removal", false,
          "MRI-guided bronchoscopy does not exist in clinical practice for FBA. Rigid bronchoscopy under general anesthesia is the only appropriate intervention."),
      ],
      nextKey: "post_bronch",
      keyLearning: "FBA: rigid bronchoscopy under GA. RT: manage oxygenation during procedure, suction, emergency airway backup. Flexible bronchoscopy = diagnostic only for large solid FBs.",
    }),
    step("post_bronch", {
      context: "Peanut fragment successfully retrieved from right intermediate bronchus. Child extubated post-OR. SpO₂ 98% on room air. Right-sided wheeze now resolved.",
      waveformConfig: pediatricVentConfig(15, "normal"),
      vitals: { hr: 118, spo2: 98, rr: 28, bp: "92/56", fio2: 21 },
      question: "Post-retrieval monitoring for 24 hours. What complication specifically should you monitor for?",
      choices: [
        adv("a", "Post-obstructive pneumonia / bronchiolitis from contaminated FB (peanut) — fever, worsening SpO₂, purulent secretions in the following 24–72 hours", true,
          "CORRECT. Peanuts are particularly problematic because they cause a chemical bronchitis (arachidonic acid) in addition to the mechanical obstruction. Post-obstructive bacterial pneumonia is common (the distal lung was unventilated and possibly infected during the obstruction period). Monitor for fever, leukocytosis, worsening respiratory status. Prophylactic antibiotics are controversial but commonly given for prolonged impaction."),
        adv("b", "Pulmonary edema from re-expansion of the previously collapsed right lung", false,
          "Re-expansion pulmonary edema is a concern after PNEUMOTHORAX drainage or massive pleural effusion drainage. After FBA retrieval with overinflated (not collapsed) lung, this is not the primary risk."),
        adv("c", "Laryngeal edema from the rigid scope — monitor for stridor", false,
          "Stridor post-bronchoscopy is possible from laryngeal trauma during scope passage. However, for a peanut aspiration specifically, post-obstructive pneumonia is the more likely and important complication."),
        adv("d", "Pneumothorax from the rigid scope perforating the airway", false,
          "Airway perforation is a rare but recognized complication. However, post-obstructive pneumonia is the more common and specifically relevant complication for this case."),
      ],
      nextKey: "end",
      keyLearning: "Post-FBA retrieval: monitor for post-obstructive pneumonia (fever, purulent secretions, worsening respiratory status in 24–72 hours). Peanuts cause chemical bronchitis. Antibiotics commonly used for prolonged impaction.",
    }),
  ],
);

// ─── 5. Tracheostomy Emergency ────────────────────────────────────────────────

export const picu_trach_emergency: AdvancedSimulation = makeSimulation(
  "picu_trach_emergency",
  {
    category: "picu",
    title: "Pediatric Tracheostomy Emergency",
    summary: "Tracheostomy tube displacement in a 4-year-old — decannulation vs false passage management.",
    patient: "4 F, 18 kg. Tracheostomy tube for subglottic stenosis. Carer notices tube 'feels loose.'",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    competencies: ["Trach displacement", "False passage recognition", "Emergency re-cannulation", "Upper airway vs trach ventilation"],
  },
  [
    step("displacement", {
      context: "4-year-old with trach (Shiley 4.0 uncuffed): audible gurgling, no chest rise with ventilation attempts. Trach site: subcutaneous emphysema developing. SpO₂ 82% and falling.",
      waveformConfig: pediatricVentConfig(18, "normal"),
      vitals: { hr: 148, spo2: 82, rr: 0, bp: "88/52", fio2: 100 },
      question: "Subcutaneous emphysema at trach site + no chest rise = ? First action?",
      choices: [
        adv("a", "FALSE PASSAGE — trach tube entered subcutaneous tissue, not trachea. Remove trach, cover stoma with hand, ventilate via the ORAL AIRWAY (mouth/nose BVM) while preparing for re-cannulation", true,
          "CORRECT. False passage: subcutaneous emphysema (crepitus) + no chest rise = tube in SQ tissue, not the trachea. CRITICAL: (1) REMOVE the displaced tube; (2) COVER the stoma (prevents air from escaping and allows mouth/nose ventilation); (3) VENTILATE via mouth/nose BVM — the glottic airway above the trach stoma is still intact; (4) Prepare for proper re-cannulation. A false passage trach being ventilated 'through' the SQ tissue causes tension pneumomediastinum."),
        adv("b", "Advance the trach tube further — it may just be partially displaced", false,
          "Advancing a misdirected trach tube into SQ tissue extends the false tract and worsens subcutaneous emphysema. Remove the tube."),
        adv("c", "Give BVM ventilation through the trach — the tube position is uncertain", false,
          "Ventilating through a false-passage trach inflates the SQ tissue and mediastinum, not the lung. Remove the tube and ventilate via the mouth/nose."),
        adv("d", "Check cuff pressure — the cuff may be inadequately inflated", false,
          "This is an uncuffed pediatric tube. Even if it were cuffed, subcutaneous emphysema indicates a false passage — cuff pressure is irrelevant."),
      ],
      nextKey: "recannulate",
      keyLearning: "Trach false passage = subcutaneous emphysema + no chest rise. REMOVE TUBE, COVER STOMA, ventilate via mouth/nose BVM. Never ventilate through a false-passage trach.",
      consequenceOfInaction: noAction(
        "Ventilating through a false-passage trach inflates the mediastinum.",
        [
          { timeframe: "Seconds–minutes", event: "Subcutaneous emphysema spreads rapidly. Tension pneumomediastinum developing.", vitalsChange: { spo2: 60 } },
          { timeframe: "Minutes", event: "Cardiac tamponade-like physiology from mediastinal tension. SpO₂ < 50%. Cardiac arrest.", vitalsChange: { sbp: 0 } },
        ],
        "Cardiac arrest from tension pneumomediastinum.",
        "TRACH RULE: If you cannot confirm the trach is in the trachea — remove it and ventilate via the upper airway. It is always safe to ventilate via the mouth when the trach is out.",
      ),
    }),
    step("recannulate", {
      context: "BVM via mouth/nose: SpO₂ improving to 91%. Team assembled. The trach stoma is 3 weeks old (not mature). Plan: re-cannulation under direct visualization.",
      waveformConfig: pediatricVentConfig(18, "normal"),
      vitals: { hr: 128, spo2: 91, rr: 0, bp: "94/58", fio2: 100 },
      question: "3-week-old stoma (not fully mature). Re-cannulation technique?",
      choices: [
        adv("a", "Direct laryngoscopy or video laryngoscopy: visualize the stoma under direct vision. Insert a smaller trach (3.5 or smaller) or an ETT with the tip aiming into the stoma under direct visualization. Confirm with CO₂ waveform.", true,
          "CORRECT. An immature trach stoma (< 6 weeks) does NOT allow 'blind' re-cannulation — the tract is not fully formed and blind attempts create new false passages. Use direct or video laryngoscopy to visually identify the stoma opening. A smaller tube (one size down) fits more easily. Obturator in place during insertion. Confirm immediately with waveform capnography. If the stoma is not accessible: oral intubation and later surgical re-establishment."),
        adv("b", "Blindly insert the same size trach tube with firm pressure — the stoma will guide it", false,
          "Immature stoma + blind insertion = high false passage risk. The stoma tract is not a rigid canal — it collapses and can deflect any tube into SQ tissue."),
        adv("c", "Insert a red rubber catheter as a stent guide, then railroad the trach over it", false,
          "A suction catheter is too soft to maintain the tract open and is not an appropriate guide for trach re-insertion. An appropriately sized bougie or tracheal exchange catheter is the correct rigid guide."),
        adv("d", "Oral intubation — the trach stoma is too fresh to safely re-cannulate", false,
          "Oral intubation is the BACKUP if re-cannulation fails. Attempt re-cannulation first (with proper technique), as oral intubation in a patient with a trach stoma and possible subglottic stenosis can be very challenging."),
      ],
      nextKey: "end",
      keyLearning: "Immature trach stoma (< 6 weeks): NEVER blind re-cannulation. Direct visualization required. Have oral intubation as backup. Confirm position with waveform capnography — always.",
    }),
  ],
);

// ─── 6. Pediatric Sepsis ─────────────────────────────────────────────────────

export const picu_sepsis: AdvancedSimulation = makeSimulation(
  "picu_sepsis",
  {
    category: "picu",
    title: "Pediatric Sepsis with Respiratory Failure",
    summary: "5-year-old with septic shock and ARDS — respiratory and hemodynamic management.",
    patient: "5 M, 20 kg. Streptococcal sepsis, intubated. Shock requiring norepinephrine. ARDS P/F 120.",
    difficulty: "advanced",
    estimatedMinutes: 7,
    competencies: ["Sepsis-induced ARDS", "PICU hemodynamics and ventilation", "Vasopressor + vent interaction", "Milrinone in sepsis"],
  },
  [
    step("vent_hemo", {
      context: "5-year-old, intubated for septic shock + ARDS. VC: Vt 120 mL (6 mL/kg), PEEP 8, RR 24, FiO₂ 65%. Norepinephrine 0.2 mcg/kg/min. BP 78/42 (MAP 54).",
      waveformConfig: pediatricVentConfig(20, "ards"),
      vitals: { hr: 158, spo2: 90, rr: 24, bp: "78/42", map_bp: 54, fio2: 65 },
      labs: { lactate: 4.2, ph: 7.28, paco2: 48, pao2: 78 },
      question: "You increase PEEP from 8 to 14 cmH₂O for oxygenation. What hemodynamic consequence must you anticipate?",
      choices: [
        adv("a", "PEEP increase → increased intrathoracic pressure → reduced venous return → decreased RV preload → reduced cardiac output → BP may drop further. Check with fluid responsiveness test first", true,
          "CORRECT. PEEP increases mean intrathoracic pressure. In a volume-depleted septic patient (high venous compliance, low preload): increased intrathoracic pressure reduces the pressure gradient driving venous return to the right heart. RV preload decreases → RV stroke volume decreases → LV preload decreases → cardiac output falls → BP falls. Anticipate: give 10 mL/kg NS bolus before increasing PEEP significantly, then increase in 2 cmH₂O steps monitoring BP response."),
        adv("b", "PEEP increase will improve cardiac output by increasing left ventricular afterload reduction", false,
          "PEEP does reduce LV afterload (increased intrathoracic pressure reduces transmural LV pressure). However, in a preload-dependent septic patient, the dominant effect is REDUCED RV preload and decreased CO — not improved afterload. The preload reduction effect dominates in hypovolemia."),
        adv("c", "PEEP has no hemodynamic effect in intubated patients — all pressure is transmitted to the airway", false,
          "PEEP dramatically affects hemodynamics. In positive-pressure ventilation, the increased intrathoracic pressure is transmitted to the great vessels and heart — directly affecting venous return and cardiac output."),
        adv("d", "Increased PEEP will cause barotrauma before any hemodynamic effect", false,
          "PEEP 14 is not extraordinarily high in ARDS. The hemodynamic effect of PEEP is a clinically immediate concern, not deferred to barotrauma risk."),
      ],
      nextKey: "rsd_vent",
      keyLearning: "PEEP increase in preload-dependent septic patients → reduced venous return → reduced CO → BP drop. Give volume before PEEP increase. Increase PEEP in steps (2 cmH₂O) while monitoring MAP.",
    }),
    step("rsd_vent", {
      context: "PEEP now 10 cmH₂O (compromise). MAP improved to 58 with fluid. The lactate is 4.2. Discussing adding milrinone vs increasing norepinephrine.",
      waveformConfig: pediatricVentConfig(20, "ards"),
      vitals: { hr: 152, spo2: 92, rr: 24, bp: "82/46", map_bp: 58, fio2: 60 },
      labs: { lactate: 4.2 },
      question: "Refractory septic shock: norepinephrine 0.2 mcg/kg/min, lactate 4.2. When is milrinone indicated?",
      choices: [
        adv("a", "Milrinone when there is evidence of myocardial dysfunction (reduced LVEF on echo, elevated BNP, poor cardiac output despite adequate filling) — not for all septic shock", true,
          "CORRECT. Milrinone (PDE3 inhibitor) is indicated in pediatric septic shock with MYOCARDIAL DYSFUNCTION: echocardiographic evidence of low LVEF, elevated BNP/troponin, clinically low cardiac output state (cold extremities, poor perfusion, rising lactate). Milrinone is a positive inotrope + vasodilator — in vasodilated septic shock (warm shock) it worsens hypotension. Norepinephrine remains the first-line vasopressor. Add milrinone only with cardiac dysfunction evidence."),
        adv("b", "Add milrinone immediately — it is first-line for all pediatric septic shock", false,
          "Milrinone is NOT first-line for all pediatric septic shock. PALS 2020: norepinephrine for cold shock (vasoconstricted), dopamine or epinephrine alternatives. Milrinone is added specifically for documented myocardial dysfunction."),
        adv("c", "Milrinone if epinephrine fails — it is third-line after epinephrine", false,
          "The decision to add milrinone is based on cardiac function assessment, not specifically the vasopressor line order. Echo findings and BNP guide the milrinone decision."),
        adv("d", "Milrinone for tachycardia — it reduces HR through vagotonic effects", false,
          "Milrinone increases inotropy and causes vasodilation. It does NOT reduce heart rate. Tachycardia management in septic shock: treat the cause (hypovolemia, pain, fever), not the symptom."),
      ],
      nextKey: "end",
      keyLearning: "Milrinone in pediatric septic shock: for documented myocardial dysfunction (echo LVEF < 50%, elevated BNP). Not for all septic shock. Echo is essential to guide vasoactive agent selection.",
    }),
  ],
);

// ─── Additional simulations (7–15) ────────────────────────────────────────────

export const picu_epiglottitis: AdvancedSimulation = makeSimulation(
  "picu_epiglottitis",
  {
    category: "picu",
    title: "Epiglottitis — Airway Emergency",
    summary: "Drooling, anxious 4-year-old — classic epiglottitis presentation. Controlled intubation in OR.",
    patient: "4 M, 17 kg. Sudden onset sore throat, drooling, anxious, tripod position. Muffled voice. SpO₂ 94%.",
    difficulty: "advanced",
    estimatedMinutes: 7,
    competencies: ["Epiglottitis recognition", "Airway safety protocol", "OR intubation strategy", "H. influenzae management"],
  },
  [
    step("recognize", {
      context: "4-year-old: tripod position, drooling, muffled 'hot potato' voice, toxic-appearing. Vaccinated for Hib but breakthrough possible. SpO₂ 94% on blow-by O₂.",
      waveformConfig: pediatricVentConfig(17, "normal"),
      vitals: { hr: 162, spo2: 94, rr: 38, bp: "92/58", temp: 38.9, fio2: 30 },
      question: "Clinical epiglottitis. What must you ABSOLUTELY AVOID before definitive airway?",
      choices: [
        adv("a", "Avoid: direct oropharyngeal examination, tongue blades, laryngoscopy, any agitation-causing procedure. The child must go to the OR with anesthesia + ENT for controlled intubation under inhalational induction", true,
          "CORRECT. Epiglottitis is a 'fragile airway' emergency. The inflamed epiglottis can totally obstruct the larynx with minimal provocation. NEVER: direct examination of the throat (tongue blade), attempt to lie child flat (worsens obstruction), agitate the child (crying = laryngospasm risk), attempt awake laryngoscopy. Safe protocol: keep child upright with caregiver, blow-by O₂ only, emergency OR with anesthesia + ENT standby, inhalational induction (sevoflurane), intubation after child is deeply anesthetized."),
        adv("b", "Obtain lateral neck X-ray immediately to confirm — classic 'thumbprint sign' of epiglottitis", false,
          "Lateral neck XR is diagnostic but UNNECESSARY if clinical diagnosis is clear, and DANGEROUS if it delays OR access. CXR/XR should not be performed if clinical epiglottitis is present — go directly to OR."),
        adv("c", "Insert a nasopharyngeal airway to bridge while preparing for OR", false,
          "NPA insertion requires manipulation of the oropharynx — risks laryngospasm and complete obstruction in epiglottitis. Blow-by O₂ only until definitive airway in OR."),
        adv("d", "Rapid sequence intubation in the ED to secure the airway before transport", false,
          "RSI in the ED for epiglottitis is dangerous: visualization of the glottis is extremely difficult with a massively swollen epiglottis. Ideally: inhalational induction in OR with ENT standing by for cricothyrotomy if intubation fails."),
      ],
      nextKey: "or_intubation",
      keyLearning: "Epiglottitis: DO NOT examine the throat. Child upright, blow-by O₂, immediate OR with anesthesia + ENT. Inhalational induction. Never attempt awake RSI in the ED for suspected epiglottitis.",
      consequenceOfInaction: noAction(
        "Any agitation or manipulation can precipitate complete laryngeal obstruction.",
        [
          { timeframe: "Immediate", event: "Laryngospasm from agitation → complete upper airway obstruction." },
          { timeframe: "< 2 minutes", event: "Cardiac arrest from complete apnea." },
        ],
        "Cardiac arrest from complete airway obstruction.",
        "Epiglottitis kills by complete obstruction in seconds. The only safe intervention is controlled OR intubation. Any attempt at examination or manipulation before OR = potential fatal airway collapse.",
      ),
    }),
    step("or_intubation", {
      context: "In OR: anesthesia + ENT. Inhalational induction with sevoflurane successful. Child deeply anesthetized. Laryngoscopy: cherry-red, massively swollen epiglottis obscuring the glottis.",
      waveformConfig: pediatricVentConfig(17, "normal"),
      vitals: { hr: 128, spo2: 96, rr: 0, bp: "88/52", fio2: 100 },
      question: "Massively swollen epiglottis obscuring the glottis on direct laryngoscopy. Next maneuver?",
      choices: [
        adv("a", "Use video laryngoscopy or a smaller ETT (4.0–4.5 uncuffed instead of age-expected 5.0) — locate the glottic opening by following the anatomy inferior to the epiglottis and aim for bubbles/air movement during ventilation", true,
          "CORRECT. Epiglottitis intubation strategy: (1) Video laryngoscopy gives a better angle around the swollen epiglottis; (2) Smaller-than-expected ETT — the edematous supraglottis may be very narrow; (3) Follow bubbles — manual bag compression during laryngoscopy produces visible exhaled gas bubbles indicating the glottis location; (4) Have ENT immediately ready for surgical cricothyrotomy if intubation fails × 3 attempts."),
        adv("b", "Perform cricothyrotomy immediately — glottis not visible = failed airway", false,
          "Not seeing the glottis on first attempt does not constitute a failed airway. Attempt video laryngoscopy, different blades, smaller tubes first. Cricothyrotomy is the last resort."),
        adv("c", "Attempt to push the epiglottis aside with the laryngoscope blade", false,
          "Physically displacing an inflamed epiglottis risks rupture, hemorrhage, and complete obstruction. Use gentle, visualized technique only."),
        adv("d", "Administer dexamethasone to reduce swelling before attempting intubation", false,
          "Dexamethasone effect takes hours. The intubation must happen now."),
      ],
      nextKey: "end",
      keyLearning: "Epiglottitis intubation: video laryngoscopy, smaller ETT, follow bubbles, ENT for surgical airway backup. Dexamethasone after intubation. IV ceftriaxone for H. influenzae coverage.",
    }),
  ],
);

export const picu_croup: AdvancedSimulation = makeSimulation(
  "picu_croup",
  {
    category: "picu",
    title: "Croup — Severe Upper Airway Obstruction",
    summary: "18-month-old with severe croup — racemic epinephrine, steroids, heliox, and intubation threshold.",
    patient: "18-month-old, 11 kg. 2-day history of barky cough, worse tonight. Severe stridor at rest, SpO₂ 91%.",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    competencies: ["Croup severity scoring", "Racemic epinephrine", "Dexamethasone protocol", "Heliox for croup", "Intubation threshold"],
  },
  [
    step("severity", {
      context: "18-month-old: loud inspiratory stridor at rest, barky cough, subcostal retractions, agitated. Westley croup score: 11/17 (severe). SpO₂ 91% on room air.",
      waveformConfig: pediatricVentConfig(11, "bronchiolitis"),
      vitals: { hr: 178, spo2: 91, rr: 52, bp: "86/54", temp: 38.4, fio2: 21 },
      question: "Westley score 11 = severe croup. Simultaneous actions?",
      choices: [
        adv("a", "Racemic epinephrine 0.05 mL/kg (2.25% racemic epi, max 0.5 mL) nebulized + dexamethasone 0.6 mg/kg IM/PO (max 10 mg) + minimize agitation (avoid examining throat, no procedures unless critical)", true,
          "CORRECT. Severe croup treatment (simultaneously): (1) Racemic epinephrine — reduces subglottic edema via mucosal vasoconstriction; rapid onset (10–15 min), duration 2 hours → must OBSERVE for 2–4 hours post-administration for rebound; (2) Dexamethasone 0.6 mg/kg IM/PO — single dose; reduces hospitalization, intubation; (3) Minimize agitation — crying increases turbulent airflow and worsens the stridor."),
        adv("b", "Immediate oral albuterol — bronchodilate the upper airway", false,
          "Albuterol does not treat subglottic edema (the croup mechanism). Racemic epinephrine targets subglottic mucosal vasculature specifically. Albuterol is for lower airway bronchospasm."),
        adv("c", "Immediate rigid bronchoscopy — severe stridor requires direct airway inspection", false,
          "Bronchoscopy is NOT indicated for croup. Croup is a clinical diagnosis. Bronchoscopy requires sedation/anesthesia → risks complete obstruction. Treat medically first."),
        adv("d", "Humidified air — steam/mist therapy is the gold standard for croup", false,
          "Humidified mist therapy for croup has no proven benefit in RCTs and is no longer recommended (AAP, ACEP). Dexamethasone and racemic epinephrine are the evidence-based treatments."),
      ],
      nextKey: "heliox_threshold",
      keyLearning: "Severe croup: racemic epinephrine (0.05 mL/kg of 2.25%) + dexamethasone 0.6 mg/kg. Monitor 2–4 hours for rebound after epinephrine. Humidified mist: NOT evidence-based.",
    }),
    step("heliox_threshold", {
      context: "After epinephrine: SpO₂ 94%, stridor reduced but still audible at rest. Dexamethasone given. Still shows retraction. SpO₂ improving slowly.",
      waveformConfig: pediatricVentConfig(11, "bronchiolitis"),
      vitals: { hr: 162, spo2: 94, rr: 44, bp: "88/56", fio2: 35 },
      question: "SpO₂ improving on FiO₂ 35%. When would you add heliox and when would you intubate?",
      choices: [
        adv("a", "Heliox 70:30 (70% He, 30% O₂) now if SpO₂ stable — reduces turbulent upper airway resistance. Intubation threshold: failure to improve, SpO₂ declining despite interventions, exhaustion, or complete obstruction", true,
          "CORRECT. Heliox for croup: helium reduces gas density → decreases turbulent upper airway resistance (Reynold's number) → reduces WOB. Use 70:30 or 60:40 He:O₂ blends. Note: if FiO₂ > 30% needed, less helium benefit (less helium in the mix). Intubation threshold: SpO₂ non-responsive to epinephrine + dexamethasone + heliox, increasing CO₂, exhaustion, or sudden onset apnea."),
        adv("b", "Intubate now — SpO₂ 94% on FiO₂ 35% is inadequate", false,
          "SpO₂ 94% with improving trajectory does not meet intubation criteria. Continue monitoring. Intubate for failure to improve, worsening, or exhaustion — not for stable moderate impairment with treatment underway."),
        adv("c", "Repeat racemic epinephrine every 20 minutes until fully improved", false,
          "Repeated epinephrine without addressing the underlying inflammation risks rebound when epinephrine wears off without adequate steroid effect. Maximum 3 doses of racemic epinephrine (then escalate to intubation planning)."),
        adv("d", "CPAP 5 cmH₂O — positive pressure will stent the subglottis open", false,
          "CPAP/positive pressure in croup has limited evidence and may worsen dynamic upper airway collapse in severe subglottic stenosis. Not standard of care. Heliox is the preferred adjunct."),
      ],
      nextKey: "end",
      keyLearning: "Croup adjuncts: heliox 70:30 reduces turbulent resistance. Intubation threshold: failure of full treatment, exhaustion, desaturation despite maximal therapy. NOT for moderate stable improvement.",
    }),
  ],
);

// ─── Registry ──────────────────────────────────────────────────────────────────

export const PICU_SIMULATIONS: readonly AdvancedSimulation[] = [
  picu_status_asthmaticus,
  picu_pards,
  picu_bronchiolitis,
  picu_foreign_body,
  picu_trach_emergency,
  picu_sepsis,
  picu_epiglottitis,
  picu_croup,
];

export function getPicuSimulation(id: string): AdvancedSimulation | undefined {
  return PICU_SIMULATIONS.find((s) => s.id === id);
}
