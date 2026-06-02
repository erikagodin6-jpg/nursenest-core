/**
 * Phase 3B — Ventilator Emergency Series
 *
 * 15 high-acuity emergency simulations (3 steps each).
 * Each covers: Recognition → Immediate Response → Escalation/Debrief.
 *
 * Clinical standards: Hamilton Health Sciences ICU Emergency Protocols,
 * ACLS/BLS, AARC Clinical Practice Guidelines, UpToDate Critical Care.
 */

import type { AdvancedSimulation, AdvancedSimStep, ConsequenceOfInaction } from "./vent-advanced-simulation-engine";
import { adv, step, makeSimulation } from "./vent-advanced-simulation-engine";
import type { VentWaveformConfig } from "./vent-waveform-generator";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const noAction = (desc: string, events: ConsequenceOfInaction["timeline"], outcome: string, pearl: string): ConsequenceOfInaction =>
  ({ description: desc, timeline: events, finalOutcome: outcome, clinicalPearl: pearl });

const NORMAL_VC: VentWaveformConfig = {
  mode: "volume_control", flowPattern: "square",
  peep: 5, tidalVolume: 500, rr: 12, ti: 1.0,
  compliance: 60, resistance: 7, condition: "normal", asynchrony: "none",
};

// ─── 1. Accidental Extubation ─────────────────────────────────────────────────

export const emerg_accidental_extubation: AdvancedSimulation = makeSimulation(
  "emerg_accidental_extubation",
  {
    category: "emergency",
    title: "Accidental Extubation",
    summary: "ETT found in the pharynx — SpO₂ falling, patient agitated.",
    patient: "72 M, ARDS day 3, sedated but agitated. Found with ETT at 10 cm at teeth.",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    competencies: ["Extubation recognition", "BVM", "Re-intubation preparation", "Escalation"],
  },
  [
    step("recognize", {
      context: "You enter the room to a HIGH PRESSURE alarm. The ETT is visible in the pharynx at 10 cm marking. No chest rise. SpO₂ 88% and falling. Patient is agitated.",
      waveformConfig: { ...NORMAL_VC, condition: "circuit_disconnect", peep: 0 },
      vitals: { hr: 130, spo2: 88, rr: 0, bp: "118/76", fio2: 100 },
      question: "Immediate first action?",
      choices: [
        adv("a", "Remove the dislodged ETT completely and ventilate with 100% FiO₂ BVM — call for airway team stat", true,
          "CORRECT. The ETT is already out functionally — it must be removed from the pharynx immediately (aspiration risk from a foreign body in the hypopharynx). Provide BVM ventilation with 100% O₂. Call for anesthesia/intensivist for urgent re-intubation. This sequence: Remove → Oxygenate → Re-intubate."),
        adv("b", "Push the ETT back in to the original depth (21 cm at teeth) and confirm with auscultation", false,
          "Never blindly readvance a dislodged ETT — it may enter the esophagus, right mainstem, or pharynx without going into the trachea. This can cause gastric insufflation, regurgitation, and aspiration. Remove the tube and use BVM."),
        adv("c", "Obtain urgent CXR to confirm ETT position before any intervention", false,
          "SpO₂ 88% and falling — waiting for CXR is not safe. Intervene first, image after stabilization."),
        adv("d", "Increase FiO₂ to 100% on the ventilator and reassess in 2 minutes", false,
          "The circuit is disconnected from the trachea — increasing vent FiO₂ ventilates nothing. BVM is the bridge."),
      ],
      nextKey: "reoxygenate",
      keyLearning: "Accidental extubation: REMOVE → BVM → re-intubate. Never blindly readvance without direct visualization.",
      consequenceOfInaction: noAction(
        "A conscious or semi-conscious patient with a dislodged ETT will desaturate and is at severe aspiration risk.",
        [
          { timeframe: "30 seconds", event: "SpO₂ < 80%. Agitation worsens. Risk of vomiting and aspiration.", vitalsChange: { spo2: 75 } },
          { timeframe: "2–3 minutes", event: "SpO₂ < 70%. Hypoxic bradycardia begins.", vitalsChange: { spo2: 65, hr: 48 } },
          { timeframe: "3–5 minutes", event: "Cardiac arrest from hypoxia.", vitalsChange: { sbp: 0 } },
        ],
        "Hypoxic cardiac arrest.",
        "Remove the failed ETT FIRST — it is not helping and is a foreign body aspiration risk. BVM is always faster than re-intubation.",
      ),
    }),
    step("reoxygenate", {
      context: "ETT removed. You are bag-mask ventilating at 100% O₂. SpO₂ recovering to 93%. The patient is vomiting. Anesthesia is 3 minutes away.",
      waveformConfig: NORMAL_VC,
      vitals: { hr: 118, spo2: 93, rr: 0, bp: "122/80", fio2: 100 },
      question: "The patient is actively vomiting during BVM ventilation. What is your PRIORITY?",
      choices: [
        adv("a", "Turn the patient laterally (left lateral decubitus), suction the oropharynx with Yankauer, hold BVM ventilation until suctioned", true,
          "CORRECT. Active vomiting during BVM: position → suction → ventilate. The lateral position uses gravity to move vomitus away from the larynx. Suction before ventilating — otherwise you will insufflate vomitus into the lungs. This is the foundation of airway aspiration prevention."),
        adv("b", "Continue bag-mask ventilation at the same rate — the O₂ will wash out the vomit", false,
          "Continuing ventilation into an airway containing vomit inflates vomit directly into the lungs. Stop, position, suction, then ventilate."),
        adv("c", "Insert a laryngeal mask airway (LMA) to protect the airway from aspiration", false,
          "LMA does not reliably protect against aspiration — the cuff does not seal the esophagus or glottis adequately. For an actively vomiting patient, suction and positioning are the immediate actions."),
        adv("d", "Perform a Heimlich maneuver to expel the vomit from the airway", false,
          "Heimlich is for solid airway foreign bodies (choking). It does not work for liquid/semi-solid aspiration risk."),
      ],
      nextKey: "reintubation",
      keyLearning: "Vomiting during airway management: position lateral, suction first, then ventilate. Never ventilate into a contaminated airway.",
    }),
    step("reintubation", {
      context: "Patient suctioned and oxygenated. SpO₂ 96%. Anesthesia arrives. RSI with succinylcholine 1.5 mg/kg IV. ETT advanced — you hear gurgling over the epigastrium.",
      waveformConfig: { ...NORMAL_VC, condition: "circuit_disconnect", peep: 0 },
      vitals: { hr: 112, spo2: 94, rr: 0, bp: "118/74", fio2: 100 },
      question: "Gurgling over epigastrium immediately after intubation. What happened and what do you do?",
      choices: [
        adv("a", "Esophageal intubation — immediately remove ETT, resume BVM ventilation, attempt re-intubation with video laryngoscopy", true,
          "CORRECT. Gurgling over epigastrum = esophageal intubation until proven otherwise. Remove ETT IMMEDIATELY — continued ventilation into the esophagus causes gastric insufflation → regurgitation → aspiration. Ventilate with BVM, then re-attempt with video laryngoscope (VL) for direct confirmation. Confirm tracheal placement with waveform capnography (gold standard)."),
        adv("b", "Advance the ETT 2 cm deeper — it may have entered the piriform sinus", false,
          "Advancing an esophageally placed ETT is dangerous. The sound is definitive evidence of esophageal placement — remove it."),
        adv("c", "Obtain a portable CXR stat to confirm tube position before any action", false,
          "Esophageal intubation with ongoing ventilation will cause aspiration before the CXR is obtained. This is an airway emergency — act immediately."),
        adv("d", "Connect to the ventilator — capnography will confirm position after the first breath", false,
          "While capnography is the gold standard, you already have clinical evidence (gastric gurgling) of esophageal placement. Remove the ETT NOW. Don't wait for the ventilator."),
      ],
      nextKey: "end",
      keyLearning: "Esophageal intubation: gurgling over epigastrum. Remove immediately, resume BVM. Confirm tracheal position ONLY with waveform capnography. Video laryngoscopy reduces esophageal intubation rates.",
    }),
  ],
);

// ─── 2. Right Mainstem Intubation ─────────────────────────────────────────────

export const emerg_mainstem_intubation: AdvancedSimulation = makeSimulation(
  "emerg_mainstem_intubation",
  {
    category: "emergency",
    title: "Right Mainstem Intubation",
    summary: "Post-intubation hypoxemia — one-lung ventilation causing right-side hyperinflation and left collapse.",
    patient: "54 F, severe CAP, emergently intubated. SpO₂ 82% post-intubation despite 100% FiO₂.",
    difficulty: "basic",
    estimatedMinutes: 6,
    competencies: ["Mainstem recognition", "ETT repositioning", "One-lung physiology"],
  },
  [
    step("recognize", {
      context: "Post-intubation. ETT at 26 cm at teeth. SpO₂ 82% on FiO₂ 100%. You auscultate: loud breath sounds right, absent left. Peak pressure 42 cmH₂O (was 28 pre-intubation).",
      waveformConfig: { ...NORMAL_VC, compliance: 30, resistance: 8, condition: "mainstem_intubation" },
      vitals: { hr: 124, spo2: 82, rr: 20, bp: "140/88", fio2: 100 },
      imaging: "CXR pending. Right lung appears hyperinflated on examination. Left hemithorax dull.",
      question: "What has occurred and what is your immediate intervention?",
      choices: [
        adv("a", "Right mainstem intubation — pull ETT back to 21–23 cm at teeth, re-auscultate bilaterally, confirm with waveform capnography", true,
          "CORRECT. ETT at 26 cm in an average adult is too deep — the carina is at approximately 25 cm in women, 27 cm in men. At 26 cm the ETT has likely entered the right mainstem bronchus (right takes off at a less acute angle from the carina — ETTs preferentially enter the right). Pull back to 21–23 cm at teeth, then auscultate bilaterally and obtain CXR."),
        adv("b", "Tension pneumothorax — perform immediate needle decompression of the right side", false,
          "Tension pneumothorax causes absent breath sounds on the AFFECTED side with hypoxemia. Here: absent LEFT, loud RIGHT. ETT at 26 cm → mainstem intubation is the more likely cause. Needle decompression of hyperventilated right lung would be catastrophic."),
        adv("c", "Add PEEP 15 cmH₂O to recruit the left lung", false,
          "Higher PEEP cannot ventilate an airway that doesn't receive gas. The ETT must be repositioned first."),
        adv("d", "Switch to pressure control to reduce peak pressures", false,
          "PC reduces pressure but the fundamental problem (ETT in right mainstem = left lung gets no gas) is not addressed by mode change."),
      ],
      nextKey: "reposition",
      keyLearning: "ETT too deep + absent left breath sounds + high Ppeak = right mainstem intubation. Pull back to 21–23 cm, auscultate, confirm with CXR.",
      consequenceOfInaction: noAction(
        "One-lung ventilation causes progressive left lung atelectasis and right-lung overdistension.",
        [
          { timeframe: "Minutes", event: "Left lung collapses entirely. SpO₂ worsens despite 100% FiO₂.", vitalsChange: { spo2: 72 } },
          { timeframe: "10–30 minutes", event: "Right lung overdistension from full minute ventilation to one lung. Barotrauma risk (pneumothorax)." },
          { timeframe: "Hours", event: "Left lung atelectasis becomes consolidated. Difficult to re-expand." },
        ],
        "Right-sided barotrauma (pneumothorax) + left-lung atelectasis.",
        "Standard ETT depth: tip at 3–4 cm above carina. In adults: 21 cm at teeth for women, 23 cm for men (rule of thumb). Always confirm depth after any patient movement.",
      ),
    }),
    step("reposition", {
      context: "You pull ETT to 22 cm. Bilateral breath sounds now present. SpO₂ improving to 91%.",
      waveformConfig: { ...NORMAL_VC, compliance: 45, resistance: 7 },
      vitals: { hr: 112, spo2: 91, rr: 20, bp: "138/84", fio2: 100 },
      question: "SpO₂ 91% on FiO₂ 100%. Left lung has been collapsed for ~10 minutes. Next step?",
      choices: [
        adv("a", "Increase PEEP to 10 cmH₂O to help re-recruit the collapsed left lung, then titrate FiO₂ down", true,
          "CORRECT. After repositioning, the left lung has atelectasis from the period of non-ventilation. PEEP recruits collapsed alveoli — increases FRC, reduces shunt. Titrate FiO₂ down as SpO₂ improves. Obtain CXR to confirm ETT position and assess left lung re-expansion."),
        adv("b", "Perform bronchoscopy to directly suction the left main bronchus", false,
          "Bronchoscopy is not indicated for atelectasis from mainstem intubation alone (no secretions or plug suspected). PEEP + repositioning re-expand most cases."),
        adv("c", "Maintain current settings — the left lung will spontaneously expand within hours", false,
          "Passive expectation for re-expansion prolongs the hypoxemia. Active recruitment with PEEP is the standard approach."),
        adv("d", "Add prone positioning immediately", false,
          "Prone positioning is a significant intervention requiring planning and multiple staff. For a 10-minute atelectasis from mainstem intubation, PEEP increase is the appropriate first step."),
      ],
      nextKey: "end",
      keyLearning: "After repositioning: recruit collapsed lung with PEEP. Confirm ETT position with CXR. Titrate FiO₂ as oxygenation improves.",
    }),
  ],
);

// ─── 3. Tension Pneumothorax ──────────────────────────────────────────────────

export const emerg_tension_ptx: AdvancedSimulation = makeSimulation(
  "emerg_tension_ptx",
  {
    category: "emergency",
    title: "Tension Pneumothorax in Ventilated Patient",
    summary: "ARDS patient: sudden peak pressure rise + hemodynamic collapse — DOPE workup reveals tension PTX.",
    patient: "41 M, ARDS (P/F 140), VC-AC PEEP 14, on day 4 of ventilation.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["DOPE mnemonic", "Tension PTX recognition", "Needle decompression", "Chest tube"],
  },
  [
    step("recognize", {
      context: "Suddenly: high pressure alarm (PIP 65, was 38). SpO₂ drops from 90% to 72%. BP 62/38. HR 148. You auscultate: absent breath sounds RIGHT, shifted trachea to the left.",
      waveformConfig: { ...NORMAL_VC, pip: 38, compliance: 14, resistance: 10, condition: "pneumothorax", peep: 14, tidalVolume: 390 },
      vitals: { hr: 148, spo2: 72, rr: 20, bp: "62/38", fio2: 80 },
      question: "What is the diagnosis and what is your IMMEDIATE action (before CXR)?",
      choices: [
        adv("a", "Tension pneumothorax — immediate needle decompression at RIGHT 2nd ICS, MCL, 14G angiocath, then thoracostomy tube", true,
          "CORRECT. CLINICAL DIAGNOSIS — do not wait for CXR. Triad: absent breath sounds RIGHT + hemodynamic collapse + sudden rise in BOTH Ppeak and Pplat (compliance loss) with high PEEP = tension PTX. Needle decompression: 2nd ICS, midclavicular line, right side. Rush of air confirms diagnosis. Immediately follow with chest tube (32–36 Fr) as needle decompression is temporary."),
        adv("b", "Disconnect from ventilator — dynamic hyperinflation causing PEA shock", false,
          "Dynamic hyperinflation causes BILATERAL findings and gradual onset. Unilateral absent breath sounds + tracheal deviation = pneumothorax, not hyperinflation. Disconnecting doesn't treat a pneumothorax."),
        adv("c", "Suction ETT — mucous plug causing sudden compliance loss", false,
          "Mucous plug causes resistance (high Ppeak, normal Pplat) and unilateral findings but not this degree of hemodynamic collapse at this speed. Tracheal deviation is not a feature of mucous plugging."),
        adv("d", "Order portable CXR and await before any intervention", false,
          "Tension PTX is a clinical emergency. Waiting for CXR in hemodynamic collapse kills the patient. Treat immediately.", { danger: "fatal" }),
      ],
      nextKey: "decompress",
      keyLearning: "Tension PTX in ventilated patients: sudden Ppeak rise + compliance loss + hemodynamic collapse + unilateral absent sounds. TREAT CLINICALLY — don't wait for CXR.",
      consequenceOfInaction: noAction(
        "Tension pneumothorax without decompression progresses to cardiac arrest within minutes.",
        [
          { timeframe: "0–2 minutes", event: "Progressive mediastinal shift compresses IVC/SVC and right heart. Preload falls to zero.", vitalsChange: { sbp: 40 } },
          { timeframe: "2–5 minutes", event: "PEA cardiac arrest from complete obstruction of venous return.", vitalsChange: { sbp: 0 } },
          { timeframe: "CPR without decompression", event: "ACLS is ineffective — the mechanical obstruction prevents cardiac output regardless of compressions." },
        ],
        "PEA cardiac arrest refractory to ACLS.",
        "TENSION PTX TRIAD in ventilated patients: (1) Sudden peak pressure rise, (2) Hemodynamic collapse, (3) Unilateral absent breath sounds. Never wait for CXR. Your clinical assessment IS the diagnosis.",
      ),
    }),
    step("decompress", {
      context: "Needle decompression performed: 14G angiocath at right 2nd ICS, MCL. RUSH OF AIR heard. BP improves to 88/54. SpO₂ rising to 84%.",
      waveformConfig: { ...NORMAL_VC, compliance: 28, resistance: 8, peep: 14, tidalVolume: 390 },
      vitals: { hr: 128, spo2: 84, rr: 20, bp: "88/54", fio2: 80 },
      question: "Needle decompression confirmed tension PTX — rush of air heard, hemodynamics improving. Next definitive treatment?",
      choices: [
        adv("a", "Insert a thoracostomy tube (32–36 Fr) in the RIGHT 4th–5th ICS, anterior axillary line, connected to water seal/suction", true,
          "CORRECT. Needle decompression is temporizing — the needle can kink or be inadequate for a large ongoing air leak. A thoracostomy (chest) tube provides definitive drainage. Standard insertion: 4th–5th ICS, anterior axillary line (avoids pectoralis, avoids diaphragm). Connect to −20 cmH₂O suction. Confirm expansion on CXR."),
        adv("b", "Remove the needle — the rush of air confirms treatment is complete", false,
          "Removing the needle leaves the pneumothorax potentially re-accumulating. The ongoing air leak from the injured visceral pleura (especially in a ventilated patient with PEEP 14) will rapidly re-tension without ongoing drainage."),
        adv("c", "Increase PEEP to 18 cmH₂O to tamponade the air leak against the lung", false,
          "Higher PEEP drives more gas through the pleural breach — worsening the pneumothorax. Reduce PEEP as tolerated after chest tube placement."),
        adv("d", "Bronchoscopy to identify and seal the bronchopleural fistula", false,
          "Bronchoscopic fistula sealing is a specialized procedure for chronic BPF — not for acute tension pneumothorax. Chest tube first."),
      ],
      nextKey: "postdrain",
      keyLearning: "Needle decompression is temporary. Chest tube (32–36 Fr, 4th–5th ICS, AAL) is definitive. Place it immediately after confirming the diagnosis with needle decompression.",
    }),
    step("postdrain", {
      context: "Chest tube placed with immediate drainage of air. SpO₂ improving to 91%. BP 108/68. Now: post-pneumothorax management on the ventilator.",
      waveformConfig: { ...NORMAL_VC, compliance: 22, resistance: 8, peep: 14, tidalVolume: 390, condition: "ards" },
      vitals: { hr: 108, spo2: 91, rr: 20, bp: "108/68", fio2: 80 },
      question: "After chest tube placement, the Ppeak is still 58 cmH₂O and Pplat 32 cmH₂O. Driving pressure = 18 cmH₂O. What do you do with the ventilator?",
      choices: [
        adv("a", "Reduce Vt to 350 mL (5.6 mL/kg IBW 62 kg) to bring driving pressure < 15 cmH₂O — accept permissive hypercapnia", true,
          "CORRECT. The remaining lung (and contralateral lung with possible contusion) now has reduced compliance from the ARDS plus trauma. Driving pressure 18 cmH₂O is above the safe threshold. Reduce Vt stepwise, accept CO₂ rise if pH ≥ 7.20. Continue lung-protective strategy."),
        adv("b", "Increase PEEP to 18 cmH₂O to improve oxygenation", false,
          "Higher PEEP after tension PTX risks driving gas through the pleural breach if the fistula persists — worsening air leak. Optimize PEEP cautiously and only after chest tube drainage is confirmed adequate."),
        adv("c", "Switch to pressure control at PIP 38 cmH₂O (pre-PTX settings)", false,
          "The lung mechanics have changed dramatically from the PTX event. The pre-event settings are no longer appropriate. Reassess from scratch."),
        adv("d", "Continue current settings — the chest tube will handle the pressure issue", false,
          "A chest tube drains pleural air but does not change lung mechanics or reduce driving pressure. The Vt must be adjusted independently."),
      ],
      nextKey: "end",
      keyLearning: "Post-PTX: reduce Vt to manage driving pressure. Lung mechanics worsen after barotrauma. Continue lung-protective strategy independently of chest tube management.",
    }),
  ],
);

// ─── 4. ETT Obstruction ───────────────────────────────────────────────────────

export const emerg_ett_obstruction: AdvancedSimulation = makeSimulation(
  "emerg_ett_obstruction",
  {
    category: "emergency",
    title: "ETT Obstruction — Complete",
    summary: "Cannot pass suction catheter, Ppeak skyrocketing — complete ETT obstruction requiring emergent exchange.",
    patient: "66 F, COPD exacerbation, intubated 5 days. Thick secretions noted previously.",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    competencies: ["ETT obstruction", "Catheter limits", "ETT exchange", "BVM bridge"],
  },
  [
    step("recognize", {
      context: "PIP alarm: 72 cmH₂O (was 38). Cannot pass suction catheter — meets solid resistance at 15 cm. No wheeze audible. Patient cyanotic. SpO₂ 74%.",
      waveformConfig: { ...NORMAL_VC, resistance: 45, condition: "secretion_obstruction" },
      vitals: { hr: 138, spo2: 74, rr: 20, bp: "165/98", fio2: 80 },
      question: "Catheter cannot pass. Ppeak 72 cmH₂O. What does this indicate and what is your FIRST action?",
      choices: [
        adv("a", "Complete ETT obstruction (mucous plug or blood clot at ETT tip) — remove ETT and ventilate with BVM while preparing for emergent re-intubation", true,
          "CORRECT. If a suction catheter cannot pass the ETT, the ETT is completely obstructed. No amount of suctioning will clear this obstruction from outside. The ETT must be removed. Provide BVM ventilation. Prepare for immediate re-intubation with video laryngoscopy. A fresh ETT will be unobstructed."),
        adv("b", "Instill 10 mL of saline and try suctioning again with maximal force", false,
          "Forcing a catheter against complete obstruction risks airway perforation. Instilling saline into a completely obstructed tube goes nowhere. Remove the ETT."),
        adv("c", "Perform chest compressions — the patient is in cardiac arrest from hypoxia", false,
          "The patient still has a BP and pulse. Compressions before securing the airway are premature. The problem is the obstructed ETT — fix it."),
        adv("d", "Switch to pressure control mode at lower PIP to reduce barotrauma while arranging transfer to bronchoscopy suite", false,
          "Lower PIP in PC with a completely obstructed ETT delivers no gas at all — it just pressurizes the obstructed dead space. The ETT must be removed immediately.", { danger: "harmful" }),
      ],
      nextKey: "bvm_bridge",
      keyLearning: "Catheter meets resistance at ETT tip = complete obstruction. Remove ETT. BVM bridge. Re-intubate. Never force the catheter.",
      consequenceOfInaction: noAction(
        "Complete ETT obstruction with no gas exchange is equivalent to apnea.",
        [
          { timeframe: "30–60 seconds", event: "SpO₂ approaches 60%. Cardiac arrhythmia begins.", vitalsChange: { spo2: 62, hr: 150 } },
          { timeframe: "2–3 minutes", event: "VF or asystole from profound hypoxemia.", vitalsChange: { sbp: 0 } },
        ],
        "Hypoxic cardiac arrest.",
        "Complete ETT obstruction is a 2-minute emergency. The only correct action is ETT removal + BVM. Every second spent suctioning a completely obstructed tube is a second of zero gas exchange.",
      ),
    }),
    step("bvm_bridge", {
      context: "ETT removed. BVM ventilation initiated. SpO₂ recovering to 88%. Video laryngoscope being prepared. Anesthesia is 60 seconds away.",
      waveformConfig: NORMAL_VC,
      vitals: { hr: 124, spo2: 88, rr: 0, bp: "148/88", fio2: 100 },
      question: "During BVM ventilation, you notice high resistance to bag compression and difficulty achieving chest rise. What do you suspect?",
      choices: [
        adv("a", "The upper airway may be partially obstructed — ensure head-tilt chin-lift, insert oropharyngeal airway adjunct, consider two-person BVM technique", true,
          "CORRECT. BVM difficulty after ETT removal may indicate upper airway obstruction (edema, tongue falling back, secretions). Optimize airway maneuvers: head-tilt chin-lift, jaw thrust, OPA or NPA. Two-person technique: one creates airway seal, one squeezes bag. This is a common and correctable issue."),
        adv("b", "The patient has developed a pneumothorax from the high pressures — prepare for needle decompression", false,
          "Pneumothorax is possible but less likely in this 60-second window. Try airway optimization first before assuming barotrauma."),
        adv("c", "The BVM has a manufacturing defect — switch to a different bag", false,
          "Always check technique before equipment. The most common cause of BVM difficulty is poor mask seal or airway position."),
        adv("d", "Lung compliance has dropped from hypoxia-induced pulmonary edema — expect high resistance to all ventilation", false,
          "Acute hypoxic pulmonary vasoconstriction doesn't produce compliance changes acute enough to explain BVM resistance in 60 seconds."),
      ],
      nextKey: "reintubate",
      keyLearning: "BVM difficulty: optimize airway maneuvers first. OPA/NPA, head-tilt chin-lift, two-person technique. Check for upper airway obstruction before assuming pulmonary pathology.",
    }),
    step("reintubate", {
      context: "Re-intubation successful with video laryngoscope (8.0 ETT, 22 cm at teeth). SpO₂ 94%. The obstruction in the extracted ETT is a 3 cm thick mucoid cast.",
      waveformConfig: { ...NORMAL_VC, resistance: 10, condition: "normal" },
      vitals: { hr: 108, spo2: 94, rr: 16, bp: "140/84", fio2: 70 },
      question: "After successful re-intubation, what preventive measures do you implement?",
      choices: [
        adv("a", "Increase humidification (heated active humidifier if using HME), increase suctioning frequency, ensure adequate systemic hydration, consider N-acetylcysteine nebulization", true,
          "CORRECT. Mucoid cast formation indicates inadequate humidification and hydration. Heated active humidifiers (37°C, 44 mg H₂O/L) are superior to HME for high-secretion patients. Increase suctioning frequency. Systemic hydration thins secretions. N-acetylcysteine (NAC) is a mucolytic with some evidence in COPD exacerbation."),
        adv("b", "Place a smaller ETT (6.0 mm ID) — smaller tube has less dead space and lower resistance", false,
          "A smaller ETT has HIGHER resistance (Poiseuille: R ∝ 1/r⁴). This worsens the work of breathing and is more prone to occlusion. Size 7.5–8.0 for adults."),
        adv("c", "Limit suctioning to every 8 hours to avoid mucosal trauma and further secretion stimulation", false,
          "In a patient who just had a complete mucoid cast obstruction, reducing suctioning frequency risks re-accumulation. Suction more frequently — minimum every 2–4 hours."),
        adv("d", "Switch to a tracheostomy tube — ETT is more prone to obstruction", false,
          "Tracheostomy is appropriate for prolonged ventilation, not specifically for mucoid cast obstruction from a correctable humidification deficit. Fix the underlying cause first."),
      ],
      nextKey: "end",
      keyLearning: "Mucoid cast obstruction = humidification failure. Switch to heated humidifier, increase suctioning, systemic hydration. Prevention is the priority after the emergency.",
    }),
  ],
);

// ─── 5. Severe Bronchospasm (near-fatal) ──────────────────────────────────────

export const emerg_severe_bronchospasm: AdvancedSimulation = makeSimulation(
  "emerg_severe_bronchospasm",
  {
    category: "emergency",
    title: "Near-Fatal Bronchospasm — Status Asthmaticus",
    summary: "Escalating bronchospasm despite first-line therapy — silent chest, rising PaCO₂, preparing for emergency management.",
    patient: "28 F, severe asthma, mechanically ventilated 6 hours. Despite albuterol, PIP now 65 cmH₂O.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["Severe asthma ventilation", "Heliox", "Magnesium", "Permissive hypercapnia", "Near-fatal asthma"],
  },
  [
    step("recognize", {
      context: "PIP 65 (Pplat 18). ABG: pH 7.21, PaCO₂ 72, PaO₂ 68. Silent chest (no wheeze = no airflow). SpO₂ 88%. Patient appears exhausted.",
      waveformConfig: {
        mode: "volume_control", flowPattern: "square",
        peep: 0, tidalVolume: 460, rr: 10, ti: 0.8,
        compliance: 70, resistance: 38, autoPeep: 8,
        condition: "bronchospasm", asynchrony: "none",
      },
      vitals: { hr: 138, spo2: 88, rr: 10, bp: "148/94", fio2: 60 },
      labs: { ph: 7.21, paco2: 72, pao2: 68, hco3: 28, be: 0 },
      question: "Silent chest + rising PaCO₂ + pH 7.21 = near-fatal asthma. Immediate medication interventions (select all that apply by choosing the most complete answer)?",
      choices: [
        adv("a", "IV magnesium sulfate 2g over 20 min + nebulized albuterol/ipratropium continuous + IV methylprednisolone 125 mg + consider IV ketamine 0.3–0.5 mg/kg for bronchodilation", true,
          "CORRECT. Near-fatal asthma pharmacological escalation: (1) IV magnesium — relaxes smooth muscle, Class I evidence in severe asthma; (2) Continuous bronchodilators; (3) High-dose IV steroids; (4) Ketamine — dissociative anesthetic + potent bronchodilator — appropriate here because it maintains respiratory drive and provides sedation. Heliox (70:30) via the ventilator circuit can reduce turbulent resistance."),
        adv("b", "Increase albuterol frequency to q5 min and observe for further response", false,
          "Maximum albuterol has been tried for 6 hours. Escalation to IV magnesium, ketamine, and heliox is required when standard bronchodilators fail."),
        adv("c", "Paralyze with cisatracurium to allow controlled ventilation and reduce muscle O₂ consumption", false,
          "NMB in status asthmaticus is dangerous without adequate bronchodilation first — loss of respiratory muscle contribution with obstructed airways dramatically worsens dead-space ventilation. Try pharmacological bronchodilation first."),
        adv("d", "Intubate immediately with ketamine + succinylcholine RSI", false,
          "This patient IS already intubated. Ketamine is indicated, but for ongoing bronchodilation — not induction."),
      ],
      nextKey: "vent_management",
      keyLearning: "Silent chest = near-fatal asthma. Escalate: IV magnesium, ketamine, heliox. Steroids are mandatory. Keep permissive hypercapnia (pH ≥ 7.20) — don't chase the CO₂.",
      consequenceOfInaction: noAction(
        "Near-fatal asthma with PaCO₂ 72 and pH 7.21 — progressive respiratory acidosis and cardiac arrest.",
        [
          { timeframe: "15–30 minutes", event: "PaCO₂ rises further. pH falls to 7.10.", vitalsChange: { spo2: 80 } },
          { timeframe: "30–60 minutes", event: "Severe acidosis impairs cardiac function. Arrythmia (VF preferred environment: acidosis + hypoxemia).", vitalsChange: { sbp: 80 } },
          { timeframe: ">60 minutes", event: "Cardiac arrest — VF in the context of severe acidosis, hypoxemia, and dynamic hyperinflation." },
        ],
        "VF cardiac arrest from respiratory acidosis and hypoxemia.",
        "In status asthmaticus: pH ≥ 7.20 is acceptable (permissive hypercapnia). Do NOT increase RR to chase CO₂ — this worsens auto-PEEP. Lower RR (10–12), long Te (1:4–1:6 I:E), let CO₂ rise.",
      ),
    }),
    step("vent_management", {
      context: "Magnesium given. Ketamine infusion started at 0.3 mg/kg/hr. After 20 minutes: PIP 55 cmH₂O. AutoPEEP measured 12 cmH₂O. RR set at 10.",
      waveformConfig: {
        mode: "volume_control", flowPattern: "square",
        peep: 0, tidalVolume: 460, rr: 10, ti: 0.8,
        compliance: 70, resistance: 28, autoPeep: 8, condition: "bronchospasm",
      },
      vitals: { hr: 122, spo2: 90, rr: 10, bp: "138/88", fio2: 55 },
      labs: { ph: 7.23, paco2: 68, pao2: 74 },
      question: "Auto-PEEP 12 cmH₂O measured. Set PEEP is currently 0. Should you add extrinsic PEEP?",
      choices: [
        adv("a", "Add extrinsic PEEP 8–10 cmH₂O (approximately 80% of auto-PEEP) ONLY if the patient has spontaneous breathing effort with ineffective triggers — NOT if fully controlled", true,
          "CORRECT. The role of extrinsic PEEP in asthma is limited to improving trigger work in spontaneously breathing patients where auto-PEEP prevents effective triggering. In a CONTROLLED ventilation scenario (set rate, no spontaneous efforts), adding extrinsic PEEP above auto-PEEP INCREASES total PEEP and worsens hyperinflation. Set PEEP 0 is appropriate for fully controlled asthma ventilation."),
        adv("b", "Add PEEP 12 cmH₂O to exactly match and eliminate the auto-PEEP", false,
          "Adding extrinsic PEEP = auto-PEEP means total effective PEEP doubles. In a passive patient, this dramatically worsens dynamic hyperinflation and can cause cardiac arrest."),
        adv("c", "Do not add extrinsic PEEP — the set PEEP 0 is correct for controlled ventilation in status asthmaticus", false,
          "Partially correct — but the answer doesn't address the spontaneous-trigger scenario. The nuanced answer is: use extrinsic PEEP only if the patient is making ineffective trigger attempts."),
        adv("d", "Increase RR to 16 to reduce auto-PEEP by delivering more frequent breaths", false,
          "Increasing RR SHORTENS Te — worsening auto-PEEP. In status asthmaticus, RR should be as low as necessary to maintain minimum minute ventilation (pH ≥ 7.20). Target 10–12/min."),
      ],
      nextKey: "extracorporeal",
      keyLearning: "In controlled asthma ventilation: set PEEP 0, very low RR (10–12), long I:E (1:4 to 1:6). Extrinsic PEEP only for spontaneous trigger work, not for controlled ventilation.",
    }),
    step("extracorporeal", {
      context: "After 2 hours: pH 7.18 despite RR 10, Vt 460, PEEP 0. SpO₂ 86% on FiO₂ 80%. Ketamine + magnesium given. No improvement. Epinephrine IV started.",
      waveformConfig: {
        mode: "volume_control", flowPattern: "square",
        peep: 0, tidalVolume: 460, rr: 10, ti: 0.8,
        compliance: 70, resistance: 35, autoPeep: 14, condition: "bronchospasm",
      },
      vitals: { hr: 144, spo2: 86, rr: 10, bp: "118/72", fio2: 80 },
      labs: { ph: 7.18, paco2: 82, pao2: 60 },
      question: "pH 7.18, refractory to all therapy. What is the definitive rescue intervention?",
      choices: [
        adv("a", "VV-ECMO consultation — the patient has ECMO-refractory bronchospasm with life-threatening acidosis and hypoxemia", true,
          "CORRECT. ECMO for status asthmaticus is a life-saving rescue when conventional therapy fails. VV-ECMO removes CO₂ (the primary problem) and supports oxygenation while the bronchospasm resolves. International literature: ECMO rescue in near-fatal asthma has excellent survival rates (>80%) because the underlying disease is reversible. This is bridge-to-recovery ECMO."),
        adv("b", "Sodium bicarbonate 100 mEq IV to correct the acidosis", false,
          "Bicarbonate generates CO₂ (HCO₃ + H⁺ → CO₂ + H₂O). In a ventilated patient who cannot eliminate CO₂, adding bicarbonate WORSENS PaCO₂ and intracellular acidosis. Do not use sodium bicarbonate for respiratory acidosis."),
        adv("c", "Heliox 70:30 — last rescue option before stopping", false,
          "Heliox should have been started earlier (Step 1). At pH 7.18 with refractory disease, ECMO is the appropriate next step, not heliox alone."),
        adv("d", "Tracheostomy for better secretion management", false,
          "Tracheostomy does not treat bronchospasm and is a semi-elective procedure. ECMO is the appropriate emergent escalation."),
      ],
      nextKey: "end",
      keyLearning: "Refractory status asthmaticus: VV-ECMO is the rescue therapy. ECMO eliminates CO₂ while the bronchospasm resolves. Excellent outcomes — disease is reversible. NEVER give bicarbonate for respiratory acidosis.",
    }),
  ],
);

// ─── 6. Pulmonary Hemorrhage ──────────────────────────────────────────────────

export const emerg_pulmonary_hemorrhage: AdvancedSimulation = makeSimulation(
  "emerg_pulmonary_hemorrhage",
  {
    category: "emergency",
    title: "Massive Pulmonary Hemorrhage",
    summary: "Bright red blood from ETT — immediate airway management and hemorrhage control.",
    patient: "68 M, lung biopsy 30 min ago, now active bleeding from ETT suction.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["Pulmonary hemorrhage", "Hemorrhage control", "Selective intubation", "ICB bronchoscopy"],
  },
  [
    step("recognize", {
      context: "You suction the ETT: frank bright red blood, 80 mL returned in 30 seconds. SpO₂ dropping 98% → 82%. PIP rising. Bilateral auscultation: wet gurgling sounds throughout.",
      waveformConfig: { ...NORMAL_VC, condition: "pulmonary_hemorrhage", resistance: 18 },
      vitals: { hr: 136, spo2: 82, rr: 20, bp: "148/88", fio2: 100 },
      question: "Massive blood from ETT. What are your SIMULTANEOUS first actions?",
      choices: [
        adv("a", "Suction continuously → position patient with bleeding side DOWN → increase PEEP to 12–15 cmH₂O to tamponade the source → STAT call for bronchoscopy + interventional radiology", true,
          "CORRECT. Four-part simultaneous response: (1) Continuous suction to keep airway patent; (2) Lateral positioning: bleeding-side DOWN uses gravity to isolate blood to the bleeding lung (protects the contralateral lung); (3) PEEP increase: mechanical compression tamponades the bleeding source; (4) Call bronchoscopy + IR (bronchial artery embolization is definitive treatment for massive hemoptysis)."),
        adv("b", "Give protamine sulfate to reverse heparin — the patient may be anticoagulated from the biopsy", false,
          "First: secure the airway and apply hemorrhage control. Anticoagulation reversal is a concurrent consideration but the first priority is maintaining oxygenation and stopping active airway flooding."),
        adv("c", "Hyperventilate to wash out blood with high gas flow", false,
          "High flow doesn't clear blood — it moves it further into smaller airways. Suction clears blood. Positioning isolates it."),
        adv("d", "Remove the ETT and use face mask at 100% FiO₂", false,
          "Removing the ETT with massive airway hemorrhage eliminates the only means of suctioning and controlled ventilation. The ETT must be maintained."),
      ],
      nextKey: "selective",
      keyLearning: "Pulmonary hemorrhage: suction + bleed-side-DOWN positioning + PEEP tamponade + bronchoscopy + IR. Never remove the ETT during active airway hemorrhage.",
      consequenceOfInaction: noAction(
        "Massive pulmonary hemorrhage floods the airways — both lungs within minutes.",
        [
          { timeframe: "Minutes", event: "Blood floods contralateral lung. Bilateral lung consolidation from blood.", vitalsChange: { spo2: 65 } },
          { timeframe: "5–10 minutes", event: "Drowning physiology: no gas exchange possible. PaO₂ critically low.", vitalsChange: { spo2: 40, sbp: 80 } },
          { timeframe: "10 minutes", event: "Hypoxic cardiac arrest.", vitalsChange: { sbp: 0 } },
        ],
        "Bilateral lung hemorrhage → hypoxic cardiac arrest.",
        "POSITIONING IS LIFE-SAVING: bleeding-side DOWN prevents blood from flooding the contralateral (good) lung. This single positioning decision can be the difference between bilateral vs unilateral hemorrhage.",
      ),
    }),
    step("selective", {
      context: "PEEP 15 applied. Patient positioned right-side-down (bleeding lung is right). SpO₂ stabilizes at 87%. Bronchoscopy team arriving in 5 minutes. Bleeding continues.",
      waveformConfig: { ...NORMAL_VC, condition: "pulmonary_hemorrhage", resistance: 15, peep: 15 },
      vitals: { hr: 128, spo2: 87, rr: 20, bp: "142/84", fio2: 100 },
      question: "Bleeding continues despite PEEP. How do you protect the left (good) lung while awaiting bronchoscopy?",
      choices: [
        adv("a", "Advance the ETT into the LEFT mainstem bronchus (selective left-lung intubation) to isolate and ventilate only the good lung while protecting it from blood", true,
          "CORRECT. Selective main stem intubation is the emergency procedure to protect the contralateral lung from blood flooding. Advance the ETT past the carina to the left mainstem (turn head right to assist). This isolates the good lung for ventilation while blood is contained in the right (bleeding) side. A better option when available: double-lumen ETT or Univent tube."),
        adv("b", "Pack the ETT with vasoconstrictive gauze to stop blood from returning", false,
          "Packing the ETT blocks ventilation entirely. The ETT must remain patent for continued ventilation."),
        adv("c", "Administer vasopressin IV to cause bronchospasm and tamponade at the source", false,
          "Vasopressin/terlipressin is used for esophageal variceal bleeding (vasoconstriction of splanchnic circulation). It has no direct role in pulmonary hemorrhage and does not cause bronchospasm."),
        adv("d", "Continue current management and wait for bronchoscopy — further intervention risks worsening", false,
          "With ongoing blood flooding, waiting without isolating the good lung risks bilateral involvement. Take action now."),
      ],
      nextKey: "bronchoscopy",
      keyLearning: "Selective intubation of the good (left) lung isolates the bleeding lung. This is the emergency bridge before definitive bronchoscopy and bronchial artery embolization.",
    }),
    step("bronchoscopy", {
      context: "Left mainstem selective intubation performed. SpO₂ improves to 93%. Bronchoscopy confirms: right upper lobe bleeding post-biopsy. Interventional Radiology available for bronchial artery embolization.",
      waveformConfig: { ...NORMAL_VC, compliance: 50, peep: 15 },
      vitals: { hr: 108, spo2: 93, rr: 18, bp: "138/80", fio2: 80 },
      question: "Definitive hemostasis is achieved via bronchial artery embolization (BAE). Now repositioning the patient. What ventilator concern must you address?",
      choices: [
        adv("a", "Reassess ETT position — selective left-mainstem ETT must be pulled back above the carina before both lungs are re-ventilated, to prevent ongoing right-lung exclusion", true,
          "CORRECT. The ETT was advanced selectively into the left mainstem as an emergency maneuver. Once hemostasis is achieved and both lungs are to be ventilated, the ETT must be pulled back to the standard position (above the carina). Confirm position with CXR. If the ETT remains in the left mainstem post-hemostasis: the right lung (even if the hemorrhage is controlled) will not be ventilated."),
        adv("b", "Immediately wean PEEP to 5 cmH₂O — the hemorrhage tamponade function is no longer needed", false,
          "PEEP reduction should be gradual, not immediate. The hemorrhaged lung has consolidation from blood — PEEP helps keep these regions from de-recruiting. Wean over hours, not immediately."),
        adv("c", "Administer tranexamic acid 1g IV now that hemostasis is achieved", false,
          "Tranexamic acid prevents clot lysis — it is useful in ongoing hemorrhage, not after hemostasis is confirmed. It's most effective early in the hemorrhage (first 3 hours from onset)."),
        adv("d", "Keep the patient in the right-lateral-decubitus position permanently to prevent re-hemorrhage", false,
          "Permanent positioning is not feasible or necessary post-BAE. Standard repositioning protocols apply with care."),
      ],
      nextKey: "end",
      keyLearning: "After selective intubation and hemostasis: pull ETT back above carina before re-ventilating both lungs. Confirm position with CXR. Wean PEEP gradually — do not abruptly remove hemorrhage tamponade.",
    }),
  ],
);

// ─── 7. Cardiac Arrest on Ventilator ─────────────────────────────────────────

export const emerg_cardiac_arrest_vent: AdvancedSimulation = makeSimulation(
  "emerg_cardiac_arrest_vent",
  {
    category: "emergency",
    title: "Cardiac Arrest During Mechanical Ventilation",
    summary: "VF in a ventilated ICU patient — manage ACLS while maintaining ventilation.",
    patient: "59 M, ARDS post-sepsis, VC-AC PEEP 10. Monitor shows VF.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["ACLS on ventilator", "Defibrillation sequence", "Ventilation during CPR", "Reversible causes"],
  },
  [
    step("arrest", {
      context: "Monitor alarm: pulseless VF. Patient is intubated and on the ventilator. No palpable pulse. Team assembling.",
      waveformConfig: { ...NORMAL_VC, condition: "normal" },
      vitals: { hr: 0, spo2: 0, rr: 20, bp: "0/0", fio2: 100 },
      question: "VF in a ventilated patient. What is DIFFERENT from standard ACLS in an intubated patient?",
      choices: [
        adv("a", "Asynchronous CPR (continuous compressions without pause for breaths) + ventilator provides 10 breaths/min — defibrillate at 200J biphasic ASAP + standard ACLS otherwise unchanged", true,
          "CORRECT. In an intubated patient with secure airway: compressions do NOT pause for ventilation (asynchronous CPR). The ventilator maintains RR 10/min during chest compressions. Defibrillation dose: 200J biphasic (or per device recommendation). Disconnect the ventilator or ensure it is in a position that won't be shocked (electrical safety). Standard ACLS: epinephrine 1 mg q3–5 min, amiodarone 300 mg for refractory VF."),
        adv("b", "Stop the ventilator during CPR — compressions will provide adequate gas exchange", false,
          "Compressions provide only 25–30% of normal cardiac output. Active ventilation during CPR improves oxygenation and CO₂ elimination. Continue ventilating at 10 breaths/min in an intubated patient."),
        adv("c", "Perform 30:2 compression-ventilation cycling as per standard BLS protocol", false,
          "30:2 cycling is for non-intubated patients where you must pause compressions to ventilate through an unsealed airway. With a secured airway: ASYNCHRONOUS CPR — continuous compressions without pausing."),
        adv("d", "Defibrillate at 360J monophasic (higher energy for ICU patients)", false,
          "Biphasic defibrillators: 120–200J (manufacturer-specific). Monophasic would be 360J but biphasic is preferred and more common in modern ICUs. Use the device as specified."),
      ],
      nextKey: "post_rosc",
      keyLearning: "Intubated cardiac arrest: ASYNCHRONOUS CPR (no pause), ventilator continues at 10/min, defibrillate at 200J biphasic. Standard ACLS medications unchanged.",
      consequenceOfInaction: noAction(
        "Untreated VF: irreversible anoxic brain injury within 4–6 minutes.",
        [
          { timeframe: "0 seconds", event: "No cardiac output. Brain and cardiac tissue begin ischemia immediately." },
          { timeframe: "4–6 minutes", event: "Anoxic brain injury — threshold for meaningful neurological recovery." },
          { timeframe: ">10 minutes", event: "VF degrades to asystole. Extremely poor survival without prior CPR/defibrillation." },
        ],
        "Asystole — death.",
        "VF is the most survivable cardiac arrest rhythm when treated immediately. Every 1-minute delay in defibrillation reduces survival by 10%. Defibrillate FIRST, then compressions if defibrillation fails.",
      ),
    }),
    step("post_rosc", {
      context: "ROSC achieved after 2 cycles of CPR + 1 defibrillation at 200J. Post-arrest rhythm: sinus at 94 bpm. BP 88/52. SpO₂ 94% on FiO₂ 100%.",
      waveformConfig: { ...NORMAL_VC, peep: 10, compliance: 22, tidalVolume: 390, condition: "ards" },
      vitals: { hr: 94, spo2: 94, rr: 20, bp: "88/52", fio2: 100 },
      question: "Post-ROSC management. What is the target SpO₂ and why?",
      choices: [
        adv("a", "Target SpO₂ 94–98% — avoid hyperoxia (SpO₂ > 98% = PaO₂ > 100 mmHg = free radical injury) AND avoid hypoxia (SpO₂ < 94% = cerebral ischemia)", true,
          "CORRECT. Post-cardiac arrest: SpO₂ 94–98% is the evidence-based target. Hyperoxia (PaO₂ > 300 mmHg) causes free radical injury to ischemia-reperfusion brain — independently associated with worse neurological outcomes. Titrate FiO₂ down from 100% to achieve 94–98% SpO₂. Also: target normocapnia (PaCO₂ 40–45 mmHg) — hypocapnia causes cerebral vasoconstriction."),
        adv("b", "Maintain FiO₂ 100% for 24 hours to maximize brain oxygenation", false,
          "FiO₂ 100% causes hyperoxia. Post-ROSC hyperoxia worsens neurological outcomes. Titrate down as soon as SpO₂ is stable ≥ 94%."),
        adv("c", "Target SpO₂ > 99% — the brain requires maximum oxygen delivery post-arrest", false,
          "SpO₂ > 99% represents significant hyperoxia (PaO₂ likely > 150 mmHg). This is harmful post-arrest due to oxidative injury in ischemia-reperfusion."),
        adv("d", "SpO₂ is less important than MAP — focus on vasopressors to maintain MAP > 85", false,
          "MAP matters, but SpO₂ is a simultaneously important target. Both oxygenation AND perfusion must be optimized post-ROSC. Targeting MAP > 65–85 AND SpO₂ 94–98% concurrently."),
      ],
      nextKey: "ttm",
      keyLearning: "Post-ROSC: SpO₂ 94–98% (avoid hyperoxia). Normocapnia (PaCO₂ 40–45). MAP ≥ 65–85. Then: TTM decision, 12-lead ECG for STEMI evaluation, continuous EEG monitoring.",
    }),
    step("ttm", {
      context: "Patient remains comatose post-ROSC. Non-shockable STEMI not identified on 12-lead. Discussing targeted temperature management (TTM).",
      waveformConfig: { ...NORMAL_VC, peep: 10, compliance: 22, tidalVolume: 390, condition: "ards" },
      vitals: { hr: 82, spo2: 96, rr: 14, bp: "102/62", fio2: 60 },
      question: "What does current evidence recommend for TTM (Targeted Temperature Management) post-cardiac arrest?",
      choices: [
        adv("a", "Target normothermia (36–37°C) actively — fever prevention is the key goal; both 33°C and 37°C have similar neurological outcomes (TTM2 trial 2021)", true,
          "CORRECT. TTM2 trial (NEJM 2021, n=1900): no significant difference in 6-month mortality or neurological outcomes between 33°C (hypothermia) and 37°C (normothermia with fever prevention). Current recommendation: prevent fever (temp > 37.7°C must be treated) regardless of target. Hypothermia at 33°C remains an option per AHA 2022 guidelines but is no longer superior to fever prevention."),
        adv("b", "Cool to 33°C for 24 hours — hypothermia protects the brain (HACA trial 2002 standard)", false,
          "HACA trial (2002) established 33°C as beneficial. However TTM (2013) showed 33°C = 36°C. TTM2 (2021) showed 33°C = 37°C (normothermia). Current standard: fever prevention ≥ normothermia, with hypothermia as an option."),
        adv("c", "No temperature management needed — focus on hemodynamics and ventilation", false,
          "Fever is harmful post-arrest. Even if hypothermia is not targeted, FEVER PREVENTION is mandatory. Temperatures > 37.7°C worsen neurological outcomes."),
        adv("d", "Cool to 28°C for maximum neuroprotection", false,
          "Cooling below 32°C increases cardiac arrhythmia risk (VF threshold lowered at hypothermic temperatures). 28°C is never recommended."),
      ],
      nextKey: "end",
      keyLearning: "Post-arrest TTM: prevent fever (> 37.7°C). Hypothermia at 33°C is an option but not proven superior to normothermia. SpO₂ 94–98%, normocapnia, MAP ≥ 65. 12-lead ECG for STEMI urgently.",
    }),
  ],
);

// ─── 8. Ventilator Failure ────────────────────────────────────────────────────

export const emerg_vent_failure: AdvancedSimulation = makeSimulation(
  "emerg_vent_failure",
  {
    category: "emergency",
    title: "Ventilator Equipment Failure",
    summary: "Ventilator alarms, then goes silent — complete delivery failure requiring immediate backup.",
    patient: "45 F, GBS with respiratory failure, fully vent-dependent, paralyzed.",
    difficulty: "basic",
    estimatedMinutes: 5,
    competencies: ["Ventilator failure", "BVM manual ventilation", "Backup equipment", "Troubleshooting protocol"],
  },
  [
    step("failure", {
      context: "Series of alarms, then the ventilator screen goes black. No gas delivery. Patient: paralyzed, fully vent-dependent. SpO₂ 97% → 92% in 30 seconds.",
      waveformConfig: { ...NORMAL_VC, condition: "circuit_disconnect" },
      vitals: { hr: 88, spo2: 92, rr: 0, bp: "118/74", fio2: 40 },
      question: "Ventilator is dead. Immediate priority?",
      choices: [
        adv("a", "Disconnect patient from the dead ventilator, connect BVM at 100% FiO₂ with supplemental O₂ flowing at 15 L/min — manual ventilation until equipment is resolved", true,
          "CORRECT. Every paralyzed ventilator-dependent patient will die within minutes without manual ventilation. The dead ventilator provides NOTHING — it is dead weight. Immediately: (1) Disconnect from dead vent. (2) BVM with O₂ at 15 L/min. (3) Manual ventilate at rate/volume appropriate for the patient. Call for replacement ventilator and respiratory therapy simultaneously."),
        adv("b", "Troubleshoot the ventilator — check power, alarms, circuit — resolution may take only 1–2 minutes", false,
          "In a fully vent-dependent PARALYZED patient, even 90 seconds of apnea is dangerous. Manual ventilation starts NOW; troubleshoot the vent simultaneously, not instead."),
        adv("c", "Call a code blue and wait for the response team", false,
          "BVM ventilation is the appropriate first action, not calling a code. If you have a BVM, you are the response. Call for help simultaneously while ventilating."),
        adv("d", "Administer reversal agent (sugammadex) for the paralytic — the patient may breathe spontaneously", false,
          "GBS is a PRIMARY NEUROLOGICAL condition — sugammadex does not reverse GBS paralysis. The patient cannot breathe regardless of pharmacological intervention."),
      ],
      nextKey: "backup",
      keyLearning: "Ventilator failure: BVM immediately. Never troubleshoot a dead vent while a paralyzed patient is apneic. Have a BVM at every ventilated bedside — this is why.",
      consequenceOfInaction: noAction(
        "Complete apnea in a paralyzed patient.",
        [
          { timeframe: "30–60 seconds", event: "SpO₂ < 85%. Oxyhemoglobin dissociation accelerates below 85%.", vitalsChange: { spo2: 80 } },
          { timeframe: "2–3 minutes", event: "SpO₂ < 70%. Cardiac arrhythmia.", vitalsChange: { spo2: 65, hr: 150 } },
          { timeframe: "3–5 minutes", event: "Cardiac arrest.", vitalsChange: { sbp: 0 } },
        ],
        "Hypoxic cardiac arrest from preventable apnea.",
        "A BVM should be accessible within 10 seconds of every ventilated bed. JCAHO requires this. Practice BVM technique until it is reflexive — you will not have time to think.",
      ),
    }),
    step("backup", {
      context: "Patient being hand-ventilated at SpO₂ 98%. You have access to: (1) Transport ventilator in the hallway, (2) The broken ICU ventilator, (3) An ICU vent from the neighboring (currently empty) room.",
      waveformConfig: NORMAL_VC,
      vitals: { hr: 84, spo2: 98, rr: 0, bp: "120/76", fio2: 100 },
      question: "Best source of backup ventilation in this scenario?",
      choices: [
        adv("a", "The ICU ventilator from the empty neighboring room — full-featured ICU ventilator, known working, appropriate for a fully vent-dependent GBS patient", true,
          "CORRECT. Transport ventilators have limited modes and alarm systems — acceptable for short-term but not ideal for a complex vent-dependent patient. An ICU ventilator provides the full range of modes, alarms, monitoring, and settings precision required for GBS management. The neighboring room's working vent is the best choice."),
        adv("b", "The transport ventilator — it's already in the hallway, fastest solution", false,
          "Transport vents are designed for short-duration transport with limited monitoring. For a paralyzed GBS patient requiring full ICU ventilatory support, an ICU vent is superior. Adequate as temporary while arranging the ICU vent."),
        adv("c", "Continue manual BVM — avoid mechanical vents until the underlying fault is diagnosed", false,
          "BVM is a bridge, not a solution. Extended manual ventilation causes operator fatigue and inconsistent tidal volumes. Transition to mechanical ventilation as soon as a working vent is available."),
        adv("d", "Repair the broken ventilator on the spot — the control board may need resetting", false,
          "Servicing a ventilator during a clinical emergency is not an RT's role. The biomedical engineering team handles repair. Use an available working vent."),
      ],
      nextKey: "end",
      keyLearning: "Backup vent priority: ICU vent (preferred) > transport vent (temporary) > BVM (bridge only). Never maintain a paralyzed patient on BVM long-term. Always have backup equipment available.",
    }),
  ],
);

// ─── Registry (8 of 15 — add more below) ─────────────────────────────────────

// ─── 9. Cuff Rupture ──────────────────────────────────────────────────────────

export const emerg_cuff_rupture: AdvancedSimulation = makeSimulation(
  "emerg_cuff_rupture",
  {
    category: "emergency",
    title: "ETT Cuff Rupture — Emergency Airway Exchange",
    summary: "Complete cuff failure — aspiration risk, PEEP loss, emergency ETT exchange required.",
    patient: "55 F, post-cardiac surgery day 2. Sudden massive leak — cuff pressure cannot be maintained.",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    competencies: ["Cuff failure", "ETT exchange over bougie", "Aspiration prevention", "Emergency airway"],
  },
  [
    step("recognize", {
      context: "Cuff pressure manometer cannot maintain any reading — deflates to 0 regardless of inflation. Massive audible hiss at mouth. Expired Vt 80 mL (set 500 mL). PEEP 0 cmH₂O (set 8).",
      waveformConfig: { ...NORMAL_VC, condition: "ett_cuff_leak", peep: 0 },
      vitals: { hr: 104, spo2: 95, rr: 16, bp: "128/76", fio2: 35 },
      question: "Cuff is ruptured — cannot hold any pressure. What is the management pathway?",
      choices: [
        adv("a", "Call anesthesia/airway team stat for ETT exchange over airway exchange catheter (AEC/bougie) — increase FiO₂ to 100% immediately and have suction at bedside", true,
          "CORRECT. Ruptured cuff = irremediable. ETT must be exchanged. The safest technique: exchange over an airway exchange catheter (AEC) — keeps the airway scaffolded while the old ETT is removed and new ETT placed. Call for skilled airway provider (anesthesia). Increase FiO₂ to 100% (oxygenation buffer). Suction ready (aspiration risk with lost cuff seal)."),
        adv("b", "Tracheostomy immediately — the most secure airway solution", false,
          "Tracheostomy takes 20–30 minutes minimum even in experienced hands. The immediate aspiration risk cannot wait. ETT exchange over AEC is faster and appropriate first."),
        adv("c", "Continue ventilating — the volume loss is tolerable, watch SpO₂", false,
          "Without a cuff seal: aspiration risk is continuous and severe (cardiac surgery patient — post-operative aspiration is catastrophic). PEEP cannot be maintained. This patient needs an ETT exchange, not observation."),
        adv("d", "Insert an LMA as a temporary measure until anesthesia arrives", false,
          "LMA does not provide aspiration protection and cannot replace an ETT in this clinical scenario. Also: the existing ETT is still in the trachea — you cannot place an LMA without removing the ETT first."),
      ],
      nextKey: "exchange",
      keyLearning: "Ruptured cuff = ETT exchange. Use airway exchange catheter (AEC) technique to scaffold the airway during exchange. Aspiration risk is immediate — suction ready, FiO₂ 100%.",
    }),
    step("exchange", {
      context: "Anesthesia at bedside. Plan: ETT exchange over AEC (Cook AEC, 14 Fr). Patient pre-oxygenated to SpO₂ 99% on FiO₂ 100%.",
      waveformConfig: NORMAL_VC,
      vitals: { hr: 98, spo2: 99, rr: 16, bp: "124/74", fio2: 100 },
      question: "During the exchange: after inserting the AEC through the existing ETT, what is the correct next step?",
      choices: [
        adv("a", "Remove the old ETT while holding the AEC in position — then railroad the new ETT (8.0 mm) over the AEC into the trachea under direct vision", true,
          "CORRECT. AEC technique: (1) Pass AEC through existing ETT into trachea. (2) Remove old ETT over AEC (hold AEC FIRMLY — it must stay in trachea). (3) Railroad new ETT over AEC through the glottis — direct visualization with video laryngoscope is strongly recommended. (4) Remove AEC. (5) Confirm position: capnography + auscultation. The AEC maintains tracheal access throughout the exchange."),
        adv("b", "Remove both the ETT and AEC together, then re-intubate from scratch with video laryngoscopy", false,
          "Removing the AEC with the old ETT loses tracheal access — you now have a potentially edematous, post-surgery airway with no guide. The entire purpose of the AEC is to maintain the airway during exchange."),
        adv("c", "Use the AEC as a stiff stylet inside the new ETT — insert both together as a unit", false,
          "The AEC is hollow and meant to remain in the trachea as a guide while the tube is exchanged. Bundling the new ETT and AEC together defeats the purpose."),
        adv("d", "Pull the AEC back into the pharynx, then use it as a visual guide for direct laryngoscopy", false,
          "Moving the AEC out of the trachea (even partially back to the pharynx) loses its function as a tracheal rail. Keep it in the trachea until the new ETT is confirmed in position."),
      ],
      nextKey: "end",
      keyLearning: "AEC exchange technique: insert AEC, remove old ETT over AEC, railroad new ETT over AEC, confirm position. NEVER remove the AEC until new ETT is confirmed in trachea by capnography.",
    }),
  ],
);

// ─── 10–15: Additional emergencies (abbreviated for registry completeness) ────

export const emerg_oxygen_failure: AdvancedSimulation = makeSimulation(
  "emerg_oxygen_failure",
  {
    category: "emergency",
    title: "Oxygen Source Failure",
    summary: "Wall oxygen fails — switch to cylinder backup before patient desaturates.",
    patient: "ICU patient, FiO₂ 60%, suddenly dropping SpO₂ as wall O₂ pressure alarm sounds.",
    difficulty: "basic",
    estimatedMinutes: 5,
    competencies: ["O₂ source management", "Cylinder backup", "Duration calculation", "Facilities escalation"],
  },
  [
    step("recognize", {
      context: "WALL O₂ PRESSURE ALARM. SpO₂ dropping: 95% → 88% in 60 seconds. The O₂ supply pressure gauge reads 0 PSI. The ventilator alarms: LOW O₂ SUPPLY PRESSURE.",
      waveformConfig: NORMAL_VC,
      vitals: { hr: 112, spo2: 88, rr: 20, bp: "138/82", fio2: 60 },
      question: "Immediate action?",
      choices: [
        adv("a", "Switch to portable O₂ cylinder backup — open cylinder, connect to ventilator O₂ inlet, verify pressure gauge > 500 PSI, call facilities/engineering for wall O₂ failure", true,
          "CORRECT. Cylinder backup is the immediate solution. Every ICU room should have a backup E-cylinder or H-cylinder. Open the valve, connect to the ventilator, verify adequate pressure (> 500 PSI = > 1 hour of supply). Call facilities engineering simultaneously — wall O₂ failure may affect the entire unit."),
        adv("b", "Lower FiO₂ to 21% on the ventilator to use room air while O₂ is unavailable", false,
          "21% FiO₂ may be insufficient for a critically ill patient requiring 60% FiO₂. Cylinder backup is the solution, not accepting room air."),
        adv("c", "Call the code team and initiate BVM while investigating the O₂ failure", false,
          "A code team is not indicated for equipment failure when the patient has not arrested. Cylinder backup solves the problem within 30 seconds."),
        adv("d", "Transfer the patient to another room with functioning wall O₂", false,
          "Patient transfer is the slowest and most dangerous option. Fix the problem where you are with cylinder backup."),
      ],
      nextKey: "cylinder",
      keyLearning: "Wall O₂ failure: cylinder backup immediately. Know where the backup cylinders are BEFORE you need them. Calculate cylinder duration: (PSI × cylinder factor) / L/min flow.",
      consequenceOfInaction: noAction(
        "Wall O₂ failure without backup results in room air ventilation.",
        [
          { timeframe: "Minutes", event: "FiO₂ drops toward 21% (room air). SpO₂ falls precipitously in patients requiring supplemental O₂.", vitalsChange: { spo2: 72 } },
          { timeframe: "5–10 minutes", event: "Hypoxic cardiac arrest in high-FiO₂-dependent patients." },
        ],
        "Hypoxic cardiac arrest from preventable equipment failure.",
        "CYLINDER DURATION FORMULA: (PSI × cylinder factor) ÷ flow rate (L/min) = minutes remaining. E-cylinder factor = 0.28. H-cylinder factor = 3.14. Always know your backup O₂ status.",
      ),
    }),
    step("cylinder", {
      context: "Cylinder connected, O₂ pressure 1,800 PSI. SpO₂ recovering. Current flow to ventilator: 40 L/min (FiO₂ 60%). How long does the cylinder last?",
      waveformConfig: NORMAL_VC,
      vitals: { hr: 98, spo2: 94, rr: 18, bp: "132/80", fio2: 60 },
      question: "E-cylinder at 1,800 PSI, flow 40 L/min. Cylinder factor = 0.28. Approximately how many minutes of O₂ remain?",
      choices: [
        adv("a", "1800 × 0.28 / 40 = 12.6 minutes — arrange wall O₂ repair or additional cylinders IMMEDIATELY", true,
          "CORRECT. E-cylinder at 1800 PSI × 0.28 factor / 40 L/min = 12.6 minutes. This is critically short. Immediately: (1) Call facilities to restore wall O₂. (2) Request additional full cylinders. (3) Reduce FiO₂ if clinically possible to extend duration. (4) Prepare for potential transfer to another room or ICU."),
        adv("b", "1800 × 0.28 / 40 = 126 minutes — sufficient time to await wall O₂ repair", false,
          "Calculation error. 1800 × 0.28 = 504; 504 / 40 = 12.6 minutes. NOT 126 minutes. This mistake leads to false security and patient death."),
        adv("c", "Cannot calculate without knowing cylinder size", false,
          "The E-cylinder factor (0.28 L/PSI) accounts for the cylinder size. With PSI, factor, and flow rate — you have everything needed."),
        adv("d", "The cylinder reads 1800 PSI which means it is 90% full — 90 minutes at normal use", false,
          "O₂ pressure does not directly indicate volume remaining without knowing flow rate and cylinder factor. Use the formula."),
      ],
      nextKey: "end",
      keyLearning: "E-cylinder duration: PSI × 0.28 / flow (L/min) = minutes. At 40 L/min and 1800 PSI: only 12.6 minutes. CRITICAL — act immediately on wall O₂ restoration or additional cylinders.",
    }),
  ],
);

export const emerg_anaphylaxis_vent: AdvancedSimulation = makeSimulation(
  "emerg_anaphylaxis_vent",
  {
    category: "emergency",
    title: "Anaphylaxis During Mechanical Ventilation",
    summary: "Anaphylaxis post-antibiotic administration — cardiovascular collapse + bronchospasm in a ventilated patient.",
    patient: "44 F, ventilated for pancreatitis. 15 minutes after piperacillin-tazobactam: hypotension + wheezing.",
    difficulty: "advanced",
    estimatedMinutes: 7,
    competencies: ["Anaphylaxis recognition", "Epinephrine dosing", "Airway anaphylaxis", "Antibiotic reaction"],
  },
  [
    step("recognize", {
      context: "5 minutes after piperacillin-tazobactam infusion started: SpO₂ 90% (was 98%), BP 62/38 (was 128/78). Bilateral wheeze. Skin: urticaria and flushing. PIP: 52 cmH₂O.",
      waveformConfig: { ...NORMAL_VC, condition: "bronchospasm", resistance: 26 },
      vitals: { hr: 146, spo2: 90, rr: 20, bp: "62/38", fio2: 60 },
      question: "Anaphylaxis (cardiovascular collapse + bronchospasm + urticaria post-drug) in a ventilated patient. First drug treatment?",
      choices: [
        adv("a", "Epinephrine 0.3–0.5 mg IM (mid-outer thigh) or 0.1 mg IV (1 mL of 1:10,000) — STOP the antibiotic infusion", true,
          "CORRECT. Anaphylaxis = epinephrine is FIRST LINE. IM route: 0.3–0.5 mg 1:1,000 (0.3–0.5 mL) into mid-outer thigh (fastest absorption). If IV access: 0.1 mg (1 mL of 1:10,000 epinephrine) IV — careful with IV dose (cardiac arrhythmia risk at higher doses). STOP the causative agent immediately. Then: 1L NS rapid infusion for vasodilation."),
        adv("b", "Diphenhydramine 50 mg IV — antihistamines are first-line for anaphylaxis", false,
          "CRITICAL ERROR. Antihistamines are SECOND LINE in anaphylaxis. They treat urticaria/itching but do NOT reverse cardiovascular collapse or bronchospasm. Epinephrine first, always.", { danger: "harmful" }),
        adv("c", "Hydrocortisone 500 mg IV — steroids prevent biphasic reaction", false,
          "Steroids are important for prevention of biphasic reaction but are SLOW (hours to peak effect). They are second-line, not first. Epinephrine first.", { danger: "harmful" }),
        adv("d", "Albuterol nebulization — bronchospasm is the primary problem", false,
          "Albuterol addresses bronchospasm only. Epinephrine addresses ALL anaphylaxis components: vasoconstriction (shock), bronchodilation (wheeze), stabilization of mast cells. Albuterol alone is inadequate."),
      ],
      nextKey: "stabilize",
      keyLearning: "Anaphylaxis: epinephrine FIRST. Always. Every time. Stop the causative agent. Antihistamines and steroids are adjunctive only.",
      consequenceOfInaction: noAction(
        "Anaphylaxis without epinephrine progresses to cardiovascular collapse and death.",
        [
          { timeframe: "2–5 minutes", event: "BP continues to fall from massive vasodilation. SpO₂ drops from bronchospasm.", vitalsChange: { spo2: 78, sbp: 45 } },
          { timeframe: "5–10 minutes", event: "PEA cardiac arrest from refractory distributive shock.", vitalsChange: { sbp: 0 } },
        ],
        "Anaphylactic cardiac arrest.",
        "The #1 cause of preventable anaphylaxis death is failure to administer epinephrine promptly. Antihistamines do NOT treat anaphylaxis — they treat allergic reactions. Know the difference.",
      ),
    }),
    step("stabilize", {
      context: "Epinephrine 0.3 mg IM given. BP improving to 88/52. Bronchospasm partially treated. Antibiotic stopped. Now managing the ventilator settings.",
      waveformConfig: { ...NORMAL_VC, condition: "bronchospasm", resistance: 18 },
      vitals: { hr: 128, spo2: 93, rr: 20, bp: "88/52", fio2: 80 },
      question: "The patient is now on PIP 48 cmH₂O (was 28) post-anaphylaxis. Pplat 16 cmH₂O. Auto-PEEP developing. Next ventilator adjustment?",
      choices: [
        adv("a", "Reduce RR to 10 and lower PEEP to 0 to lengthen expiratory time and reduce auto-PEEP — allow permissive hypercapnia", true,
          "CORRECT. Anaphylaxis-induced bronchospasm on a ventilator: manage like status asthmaticus. Lower RR → longer Te → less air trapping. Reduce PEEP → less total PEEP. Accept rising PaCO₂ (permissive hypercapnia pH ≥ 7.20). Also: add bronchodilators via the ventilator circuit."),
        adv("b", "Increase RR to 24 to compensate for the metabolic demands of anaphylaxis", false,
          "Higher RR shortens Te and worsens auto-PEEP in the context of high-resistance bronchospasm. Exactly the wrong direction."),
        adv("c", "Apply PEEP 12 cmH₂O to counterbalance the bronchospasm and improve oxygenation", false,
          "Higher PEEP with bronchospasm worsens dynamic hyperinflation — obstructive physiology + PEEP = exponentially worse air trapping."),
        adv("d", "Switch to pressure control with PIP set at 38 cmH₂O to limit peak pressures", false,
          "In PC with high resistance bronchospasm, Vt may drop dramatically. The resistance is the problem — treat it pharmacologically, not by mode change."),
      ],
      nextKey: "end",
      keyLearning: "Anaphylaxis bronchospasm on vent = status asthmaticus management. Lower RR, reduce PEEP, permissive hypercapnia. Epinephrine addresses the bronchospasm pharmacologically.",
    }),
  ],
);

export const emerg_massive_aspiration: AdvancedSimulation = makeSimulation(
  "emerg_massive_aspiration",
  {
    category: "emergency",
    title: "Massive Aspiration",
    summary: "Regurgitation during intubation attempt — gastric contents in the airway.",
    patient: "67 M, ETOH intoxication, vomits during RSI for respiratory distress.",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    competencies: ["Aspiration management", "Suction priority", "Post-aspiration ventilation", "Aspiration pneumonitis vs pneumonia"],
  },
  [
    step("aspiration", {
      context: "During intubation attempt, patient vomits bilious material. Suction available. SpO₂ 78%. Particulate matter visible at laryngoscope.",
      waveformConfig: { ...NORMAL_VC, condition: "normal" },
      vitals: { hr: 134, spo2: 78, rr: 0, bp: "138/86", fio2: 100 },
      question: "Massive vomiting with particulate matter at the vocal cords. Sequence?",
      choices: [
        adv("a", "SUCTION (Yankauer, maximal) → lateral positioning → intubate with video laryngoscope under direct vision → immediate bronchoscopy for particulate removal", true,
          "CORRECT. Suction first — remove as much aspired material as possible before intubating (pushing the tube through contaminated material worsens aspiration). Lateral position (left lateral decubitus preferably). Intubate under direct/video vision. Immediate bronchoscopy to remove particulates from the trachea/bronchi — the first 60 minutes are critical."),
        adv("b", "Intubate immediately before more aspiration occurs — suction after airway is secured", false,
          "Intubating through active vomiting/contaminated material drives particulate deeper into the airway. Suction first, then intubate."),
        adv("c", "Hold BVM ventilation until the field is completely clear — avoid pushing material deeper", false,
          "SpO₂ 78% — the patient is critically hypoxic. Suction rapidly, then ventilate. Do not delay ventilation indefinitely."),
        adv("d", "Administer activated charcoal immediately to neutralize the gastric acid", false,
          "Activated charcoal is used for ingested toxins, NOT for aspiration management. It cannot be administered to an unconscious patient."),
      ],
      nextKey: "post_aspiration",
      keyLearning: "Massive aspiration: suction FIRST, lateral position, then intubate, then bronchoscopy for particulate removal. Intubating through active emesis drives material deeper.",
    }),
    step("post_aspiration", {
      context: "Successfully intubated. Bronchoscopy: bilious material suctioned from carina and right lower lobe bronchus. Now on VC-AC. ABG in 30 min: PaO₂ 62 on FiO₂ 100% (P/F = 62).",
      waveformConfig: { ...NORMAL_VC, compliance: 28, peep: 8, tidalVolume: 380, rr: 20, condition: "ards" },
      vitals: { hr: 116, spo2: 89, rr: 20, bp: "132/82", fio2: 100 },
      labs: { ph: 7.34, paco2: 42, pao2: 62, pf_ratio: 62 },
      question: "P/F 62 (severe ARDS criteria, < 100) from aspiration pneumonitis. First 6 hours of management?",
      choices: [
        adv("a", "Lung-protective ventilation (6 mL/kg IBW Vt, PEEP titration per ARDSNet table, Pplat ≤ 30) + prone positioning within 12–16 hours if P/F remains < 150", true,
          "CORRECT. Massive aspiration can produce aspiration pneumonitis → ARDS within hours. Manage as ARDS: 6 mL/kg IBW Vt, Pplat ≤ 30, PEEP/FiO₂ table. If P/F < 150 at 12–16 hours despite optimization: prone positioning. Do NOT routinely use antibiotics for aspiration pneumonitis in the first 48 hours unless frank infection signs (fever, purulent secretions, leukocytosis) develop."),
        adv("b", "Immediate broad-spectrum antibiotics — aspiration is always immediately infected", false,
          "Aspiration pneumonitis (chemical injury from gastric acid) is NOT the same as aspiration pneumonia (bacterial infection). Routine prophylactic antibiotics for aspiration pneumonitis are NOT recommended (IDSA/SHEA guidelines). Treat infection only if signs of bacterial pneumonia develop."),
        adv("c", "Glucocorticoids 500 mg methylprednisolone — suppress the inflammatory response", false,
          "Steroids for aspiration pneumonitis showed no benefit in multiple RCTs and may increase infection risk. They are not indicated."),
        adv("d", "Chest physiotherapy and aggressive suctioning to clear all aspirated material", false,
          "Chest physiotherapy is not first-line for acute ARDS/aspiration. Bronchoscopy has already addressed proximal particulate. Avoid excessive suctioning that disrupts recruited alveoli."),
      ],
      nextKey: "end",
      keyLearning: "Aspiration pneumonitis → ARDS: lung-protective ventilation. No prophylactic antibiotics (treat infection if it develops). Prone if P/F < 150 at 12 hours. Steroids are not indicated.",
    }),
  ],
);

// ─── 13. Massive Mucous Plug ──────────────────────────────────────────────────

export const emerg_massive_mucous_plug: AdvancedSimulation = makeSimulation(
  "massive_mucous_plug",
  {
    category: "emergency",
    title: "Massive Mucous Plug — Lobar Collapse",
    summary: "Complete lobar obstruction from inspissated secretions — suction fails, emergent bronchoscopy required.",
    patient: "72 F, post-op thoracotomy day 2. Circuit humidifier failed 12 hours ago.",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    competencies: ["Mucous plug recognition", "Suction vs bronchoscopy", "Humidification", "Ppeak vs Pplat interpretation"],
  },
  [
    step("recognize", {
      context:
        "High pressure alarm. Ppeak 44 cmH₂O (was 22), Pplat 38 cmH₂O (was 18). SpO₂ 84%. " +
        "Left breath sounds absent. No hemodynamic instability. BP stable.",
      waveformConfig: {
        mode: "volume_control", flowPattern: "square",
        peep: 5, tidalVolume: 500, rr: 14, ti: 1.0,
        compliance: 22, resistance: 18, condition: "secretion_obstruction", asynchrony: "none",
      },
      question: "Both Ppeak AND Pplat elevated, absent left sounds, stable BP. This differs from tension PTX because…?",
      choices: [
        adv("a", "Stable hemodynamics — tension PTX always causes obstructive shock. Mucous plug atelectasis: rising pressures + hypoxemia + STABLE BP.", true,
          "CORRECT. Tension PTX = hemodynamic collapse from mediastinal shift. Mucous plug = compliance loss from atelectasis but venous return is preserved. This single finding (BP stable) distinguishes the two — and changes management completely."),
        adv("b", "The pressure rise is gradual — tension PTX rises instantly", false,
          "Both can rise rapidly. Hemodynamic status is the reliable discriminator, not the rate of pressure rise."),
        adv("c", "There is no tracheal deviation in mucous plug", false,
          "Total atelectasis can cause tracheal deviation toward the collapsed side (late sign). Hemodynamic stability is more reliable."),
        adv("d", "SpO₂ is lower in tension PTX than atelectasis", false,
          "SpO₂ does not reliably discriminate. Both can cause severe hypoxemia."),
      ],
      nextKey: "bronchoscopy",
      keyLearning: "Tension PTX = hemodynamic collapse. Mucous plug = stable hemodynamics. Never confuse the two — management is completely different.",
      vitals: { hr: 118, spo2: 84, rr: 14, bp: "116/74", fio2: 65 },
    }),
    step("bronchoscopy", {
      context:
        "Suction catheter meets resistance at the ETT tip — cannot be advanced. Small amount of thick material retrieved. SpO₂ still 84%.",
      question: "Failed suction against complete obstruction. Next step?",
      choices: [
        adv("a", "Instill 5 mL NS, retry suction once, then call for emergent bronchoscopy — complete obstruction requires direct extraction", true,
          "CORRECT. Bronchoscopy is diagnostic AND therapeutic for complete mucous plugging. Saline instillation softens the plug for one more suction attempt. If still failed: bronchoscopy cannot be delayed. Time from obstruction to re-inflation matters for atelectatic injury."),
        adv("b", "Increase Vt to 800 mL to blow plug distally and re-open the airway", false,
          "Forcing ventilation against complete obstruction risks pneumothorax. Never increase pressure/volume against a blocked airway.", { danger: "harmful" }),
        adv("c", "Start heliox to reduce resistance and allow passive airway clearance", false,
          "Heliox reduces turbulence in partial obstruction — it cannot dislodge a complete solid mucous plug."),
        adv("d", "Wait 30 minutes for chest physiotherapy and postural drainage to work", false,
          "Waiting 30 minutes with SpO₂ 84% and complete lobar obstruction is clinically unacceptable."),
      ],
      nextKey: "end",
      keyLearning: "Catheter resistance + failed suction = emergent bronchoscopy. Fix humidification to prevent recurrence: heated humidifier at 37°C at Y-piece.",
      vitals: { hr: 122, spo2: 84, rr: 14, bp: "112/72", fio2: 70 },
    }),
  ],
);

// ─── 14. ARDS Sudden Decompensation ───────────────────────────────────────────

export const emerg_ards_decompensation: AdvancedSimulation = makeSimulation(
  "ards_decompensation",
  {
    category: "emergency",
    title: "ARDS Sudden Decompensation — DOPE Workup",
    summary: "Systematic DOPE evaluation in rapidly deteriorating ARDS patient — identifies tension pneumothorax.",
    patient: "52 F, severe ARDS day 4, PEEP 16, Vt 360 mL, FiO₂ 90%, P/F 82.",
    difficulty: "advanced",
    estimatedMinutes: 7,
    competencies: ["DOPE algorithm", "Systematic workup", "Tension PTX in ARDS", "Post-decompression PEEP management"],
  },
  [
    step("dope", {
      context:
        "Sudden decompensation: SpO₂ 76% (was 88%), Ppeak 58 (was 38), BP 72/40 (was 104/68). " +
        "You apply DOPE: D=Displacement, O=Obstruction, P=Pneumothorax, E=Equipment.",
      waveformConfig: {
        mode: "volume_control", flowPattern: "square",
        peep: 16, tidalVolume: 360, rr: 24, ti: 0.8,
        compliance: 14, resistance: 10, condition: "pneumothorax", asynchrony: "none",
      },
      question: "DOPE evaluation: ETT depth correct. Catheter passes freely. Right breath sounds absent. Trachea deviated LEFT. BP 72/40. What does DOPE tell you?",
      choices: [
        adv("a", "P = Pneumothorax — tension physiology confirmed. Needle decompress RIGHT chest NOW (2nd ICS, MCL).", true,
          "CORRECT. D (Displacement): ETT correct. O (Obstruction): catheter passes = no obstruction. P (Pneumothorax): absent right sounds + tracheal deviation + hemodynamic collapse = tension PTX. E (Equipment): intact. Act on P immediately."),
        adv("b", "O = Obstruction — the absent sounds mean the ETT is obstructed on the right side", false,
          "Catheter passing freely rules out ETT obstruction. Absent sounds with hemodynamic collapse and tracheal deviation = pneumothorax."),
        adv("c", "D = Displacement — ETT has migrated to left mainstem", false,
          "Left mainstem migration would cause absent RIGHT sounds but hemodynamic collapse would not occur at this magnitude. Tracheal deviation is not explained by ETT position."),
        adv("d", "E = Equipment — the high PEEP is causing ventilator malfunction", false,
          "Equipment failure would not cause unilateral absent sounds, tracheal deviation, and hemodynamic collapse simultaneously."),
      ],
      nextKey: "post_ptx",
      keyLearning: "DOPE = Displacement, Obstruction, Pneumothorax, Equipment. Work through systematically. P (Pneumothorax) with hemodynamic collapse = needle decompress immediately.",
      vitals: { hr: 142, spo2: 76, rr: 24, bp: "72/40", fio2: 90 },
    }),
    step("post_ptx", {
      context:
        "Needle decompression RIGHT chest — immediate hiss of air, BP recovers 94/62. Chest tube placed. " +
        "Now: what PEEP adjustment do you make in this ARDS patient post-PTX?",
      question: "ARDS with PEEP 16 caused tension PTX. After chest tube, what is your PEEP strategy?",
      choices: [
        adv("a", "Cautiously reduce PEEP from 16 to 10 — PEEP was contributory to barotrauma. Retitrate using FiO₂/PEEP table while monitoring SpO₂ and Pplat.", true,
          "CORRECT. High PEEP in ARDS is a PTX risk factor. After decompression: reduce PEEP to minimum maintaining SpO₂ ≥ 90%. The remaining lung (left) cannot absorb full Vt at full PEEP without barotrauma risk. Re-titrate cautiously with close Pplat monitoring."),
        adv("b", "Maintain PEEP 16 — ARDS needs high PEEP and the PTX is now drained", false,
          "PEEP 16 caused this PTX. Maintaining it risks recurrence or overdistension of the remaining lung."),
        adv("c", "Increase PEEP to 20 to recruit the partially collapsed right lung post-PTX", false,
          "Increasing PEEP post-PTX risks re-tension if the chest tube becomes occluded. Do not increase PEEP.", { danger: "harmful" }),
        adv("d", "Set PEEP to 0 — eliminate all barotrauma risk until PTX resolves", false,
          "PEEP 0 in severe ARDS causes complete de-recruitment and life-threatening hypoxemia."),
      ],
      nextKey: "end",
      keyLearning: "ARDS + PTX: reduce PEEP after drainage — it was contributory. Re-titrate to minimum effective PEEP. Don't over-pressurize the remaining lung.",
      vitals: { hr: 112, spo2: 89, rr: 24, bp: "94/62", fio2: 90 },
    }),
  ],
);

// ─── 15. Venous Air Embolism ──────────────────────────────────────────────────

export const emerg_air_embolism: AdvancedSimulation = makeSimulation(
  "venous_air_embolism",
  {
    category: "emergency",
    title: "Massive Venous Air Embolism",
    summary: "Air entrainment during central line insertion in a ventilated patient — Durant's maneuver and aspiration.",
    patient: "67 F, ARDS on VC ventilation, PEEP 14. Right subclavian CVC insertion in progress.",
    difficulty: "advanced",
    estimatedMinutes: 6,
    competencies: ["Air embolism recognition", "Durant's maneuver", "CVC aspiration technique", "ETCO₂ interpretation"],
  },
  [
    step("recognition", {
      context:
        "During right subclavian line insertion: sudden hemodynamic collapse. BP 62/38, HR 142. " +
        "Mill-wheel murmur heard on cardiac auscultation. ETCO₂ drops from 38 to 10 mmHg instantly. SpO₂ 72%.",
      question: "Mill-wheel murmur + sudden ETCO₂ drop to 10 + hemodynamic collapse during CVC insertion. Diagnosis?",
      choices: [
        adv("a", "Massive venous air embolism — air entered venous system, blocking right heart outflow. ETCO₂ drop is the earliest finding.", true,
          "CORRECT. Pathognomonic triad: mill-wheel murmur (air in RV) + ETCO₂ precipitous drop (dead space from air blocking pulmonary capillaries) + hemodynamic collapse. ETCO₂ is often the EARLIEST monitor change — before SpO₂ falls or BP drops fully."),
        adv("b", "Tension pneumothorax from the needle — decompress immediately", false,
          "PTX causes absent breath sounds and rising vent pressures. Mill-wheel murmur and ETCO₂ drop are specific to air embolism, not PTX."),
        adv("c", "Cardiac tamponade from SVC perforation — pericardiocentesis", false,
          "Tamponade causes muffled heart sounds, JVD, pulsus paradoxus. Mill-wheel murmur is NOT tamponade."),
        adv("d", "Anaphylaxis to heparin flush — give epinephrine", false,
          "Anaphylaxis causes urticaria and bronchospasm. The mill-wheel murmur and ETCO₂ drop are specific to air embolism."),
      ],
      nextKey: "treatment",
      keyLearning: "ETCO₂ precipitous drop during CVC insertion = venous air embolism until proven otherwise. Mill-wheel murmur confirms it. Act immediately.",
      vitals: { hr: 142, spo2: 72, rr: 16, bp: "62/38", etco2: 10, fio2: 100 },
    }),
    step("treatment", {
      context:
        "Air embolism confirmed. Introducer needle still in right subclavian position.",
      question: "Correct immediate management sequence for massive venous air embolism?",
      choices: [
        adv("a", "Occlude needle hub → left lateral decubitus + Trendelenburg (Durant's maneuver) → aspirate air via any available CVC → FiO₂ 100% → CPR if pulseless", true,
          "CORRECT. (1) Occlude the air entry point first. (2) Durant's maneuver: left lateral (air floats to RV apex, away from outflow) + Trendelenburg (hydrostatic barrier). (3) Aspirate air through CVC if placed. (4) 100% FiO₂ — nitrogen washout shrinks bubbles. (5) CPR if cardiac arrest."),
        adv("b", "Immediately remove the needle and apply firm pressure to the puncture site", false,
          "Removing without occluding first may worsen air entrainment. Occlude hub with finger FIRST, then remove."),
        adv("c", "Increase PEEP to 24 cmH₂O to increase intrathoracic pressure and slow air entrainment", false,
          "Increasing PEEP raises intrathoracic pressure but does not dislodge the air already in the right heart. Durant's maneuver + aspiration addresses the existing embolism.", { danger: "caution" }),
        adv("d", "Start norepinephrine — support blood pressure while air embolism resolves spontaneously", false,
          "Vasopressors cannot overcome obstructive physiology from air in the RV. The air must be removed or repositioned first.", { danger: "harmful" }),
      ],
      nextKey: "end",
      keyLearning: "Air embolism: occlude entry → Durant's maneuver (left lateral + Trendelenburg) → aspirate → FiO₂ 100%. Prevention: avoid non-Trendelenburg for CVC insertion in PEEP patients.",
      vitals: { hr: 138, spo2: 72, rr: 16, bp: "62/38", etco2: 10, fio2: 100 },
    }),
  ],
);

// ─── Full registry (15 simulations) ──────────────────────────────────────────

export const EMERGENCY_SIMULATIONS: readonly AdvancedSimulation[] = [
  emerg_accidental_extubation,
  emerg_mainstem_intubation,
  emerg_tension_ptx,
  emerg_ett_obstruction,
  emerg_severe_bronchospasm,
  emerg_pulmonary_hemorrhage,
  emerg_cardiac_arrest_vent,
  emerg_vent_failure,
  emerg_cuff_rupture,
  emerg_oxygen_failure,
  emerg_anaphylaxis_vent,
  emerg_massive_aspiration,
  emerg_massive_mucous_plug,
  emerg_ards_decompensation,
  emerg_air_embolism,
];

export function getEmergencySimulation(id: string): AdvancedSimulation | undefined {
  return EMERGENCY_SIMULATIONS.find((s) => s.id === id);
}
