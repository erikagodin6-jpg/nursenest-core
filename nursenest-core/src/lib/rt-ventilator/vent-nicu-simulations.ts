/**
 * Phase 3C — NICU Respiratory Therapy Simulations
 *
 * 15 neonatal simulations targeting:
 *   - SickKids NICU level clinical accuracy
 *   - Canadian Neonatal Network practices
 *   - ILCOR Neonatal Resuscitation Program (NRP) 2021
 *   - ERS/ESPR Surfactant Guidelines 2019
 *   - AAP Committee on Fetus and Newborn position statements
 *
 * Clinical references:
 *   - Sweet DG et al: European Consensus Guidelines on RDS 2022
 *   - Goldsmith/Karotkin: Assisted Ventilation of the Neonate 6th ed
 *   - Martin RJ et al: Fanaroff & Martin's Neonatal-Perinatal Medicine 11th ed
 */

import type { AdvancedSimulation, ConsequenceOfInaction } from "./vent-advanced-simulation-engine";
import { adv, step, makeSimulation } from "./vent-advanced-simulation-engine";
import { neonatalVentConfig } from "./vent-waveform-generator";

// ─── Helper ────────────────────────────────────────────────────────────────────

const noAction = (desc: string, events: ConsequenceOfInaction["timeline"], outcome: string, pearl: string): ConsequenceOfInaction =>
  ({ description: desc, timeline: events, finalOutcome: outcome, clinicalPearl: pearl });

// ─── 1. Neonatal RDS (28-weeker) ──────────────────────────────────────────────

export const nicu_rds_28wk: AdvancedSimulation = makeSimulation(
  "nicu_rds_28wk",
  {
    category: "nicu",
    title: "Neonatal RDS — 28-Week Premature Infant",
    summary: "Extremely premature infant with severe surfactant deficiency — initial stabilization, surfactant decision, ventilator management.",
    patient: "Male infant, 28+2 weeks, 1050g. Delivered by caesarean for maternal pre-eclampsia. Apgar 4/7.",
    difficulty: "advanced",
    estimatedMinutes: 10,
    competencies: ["NRP resuscitation", "CPAP vs intubation decision", "Surfactant therapy", "Neonatal vent settings"],
  },
  [
    step("initial_stab", {
      context: "Delivery room: 28-weeker, 1050g. Weak cry, poor tone. HR 86. Respiratory effort: gasping only. SpO₂ probe placed on right wrist (pre-ductal): SpO₂ 52%. Team preparing for respiratory support.",
      waveformConfig: neonatalVentConfig("rds_28wk"),
      vitals: { hr: 86, spo2: 52, rr: 8, bp: "42/24", temp: 36.2 },
      question: "According to NRP 2021 guidelines, what is the INITIAL respiratory support for this infant?",
      choices: [
        adv("a", "CPAP 6 cmH₂O via T-piece resuscitator or neonatal mask — avoid immediate intubation if any respiratory effort present", true,
          "CORRECT. NRP 2021 and ERS Guidelines: infants ≥ 25 weeks with any spontaneous respiratory effort should receive CPAP first (CPAP 5–8 cmH₂O). Immediate intubation is reserved for: no respiratory effort, HR < 60 despite PPV, or CPAP failure. CPAP reduces surfactant requirement, BPD incidence, and mechanical ventilation duration (COIN trial, SUPPORT trial)."),
        adv("b", "Immediate intubation and mechanical ventilation — 28-weekers always need intubation", false,
          "Evidence shows outcomes are equivalent or better with CPAP first for 28-weekers with spontaneous effort. Routine immediate intubation is no longer recommended (NRP 2021)."),
        adv("c", "100% FiO₂ by mask until SpO₂ improves — avoid CPAP in extremely premature infants", false,
          "CRITICAL. 100% FiO₂ without CPAP provides no alveolar distending pressure — the surfactant-deficient lung collapses. Also: hyperoxia causes retinopathy of prematurity and BPD. Target SpO₂ 85–90% at 1 min, 80–90% at 2–3 min, 85–90% at 4 min (NRP 2021 target table)."),
        adv("d", "Bag-mask PPV at 60 breaths/min — the HR is only 86, which requires positive pressure", false,
          "NRP 2021: PPV is indicated if HR < 100 after initial steps. With HR 86: begin PPV. BUT the preferred device is CPAP via T-piece (PEEP-providing device), not simple mask. Also: FiO₂ should start at 30% (not 100%) for preterms."),
      ],
      nextKey: "surfactant",
      keyLearning: "28-weeker with any respiratory effort: CPAP 6 cmH₂O first. FiO₂ 21–30% initially (not 100%). CPAP reduces need for mechanical ventilation and improves outcomes vs immediate intubation.",
      consequenceOfInaction: noAction(
        "Unventilated 28-weeker with gasping respirations: progressive respiratory failure.",
        [
          { timeframe: "5 minutes", event: "SpO₂ < 40%, HR declining below 60 — indication for chest compressions.", vitalsChange: { spo2: 38, hr: 58 } },
          { timeframe: "10 minutes", event: "Hypoxic-ischemic encephalopathy begins. Cardiac arrest.", vitalsChange: { sbp: 0 } },
        ],
        "Death or severe HIE.",
        "NRP PRINCIPLE: Ventilation is the SINGLE most important step in neonatal resuscitation. Most neonates respond to effective PPV alone.",
      ),
    }),
    step("surfactant", {
      context: "Infant on CPAP 6, FiO₂ 35%. 20 minutes later: SpO₂ 82% (target 88–95%), FiO₂ requirement increasing to 50%. CXR: bilateral ground-glass, air bronchograms — classic RDS.",
      waveformConfig: neonatalVentConfig("rds_28wk"),
      vitals: { hr: 158, spo2: 82, rr: 65, bp: "42/22", fio2: 50 },
      imaging: "CXR: bilateral uniform ground-glass opacity, air bronchograms, low lung volumes. Classic RDS (hyaline membrane disease).",
      question: "FiO₂ 50% on CPAP 6 with SpO₂ 82%. Does this infant need surfactant? What technique?",
      choices: [
        adv("a", "Yes — FiO₂ > 30% on CPAP = CPAP failure. LISA (Less Invasive Surfactant Administration) technique: insert thin feeding catheter into trachea under direct laryngoscopy (no intubation) while infant breathes on CPAP, instill Poractant alfa 200 mg/kg", true,
          "CORRECT. CPAP failure criteria: FiO₂ > 30% on CPAP ≥ 6 cmH₂O = surfactant indication. LISA/MIST is the preferred technique (SickKids/ERS 2022 recommendation): a thin catheter is passed through the vocal cords while maintaining CPAP; surfactant is instilled without intubation. Reduces BPD and mechanical ventilation duration compared to INSURE. Poractant alfa (Curosurf) 200 mg/kg provides the largest single-dose benefit."),
        adv("b", "No — wait until FiO₂ > 60% before committing to surfactant", false,
          "Waiting for FiO₂ > 60% delays surfactant past the optimal therapeutic window. ERS 2022 guidelines: surfactant when FiO₂ > 30% on CPAP ≥ 6 in infants < 30 weeks."),
        adv("c", "Yes — INSURE technique: intubate, instill surfactant, immediately extubate back to CPAP (standard technique)", false,
          "INSURE is effective and still used widely. However, LISA has been shown in multiple RCTs (NINSAPP, AMV) to reduce rates of mechanical ventilation and BPD in very premature infants. At centers with LISA capability: LISA is preferred over INSURE."),
        adv("d", "No — manage with high-flow nasal cannula (HFNC) at 4 L/min instead", false,
          "HFNC delivers inconsistent CPAP and is not equivalent to bubble CPAP or T-piece CPAP for RDS management. Surfactant is indicated — do not substitute a less effective respiratory support."),
      ],
      nextKey: "post_surfactant",
      keyLearning: "CPAP failure (FiO₂ > 30% on CPAP ≥ 6 cmH₂O): give surfactant. LISA/MIST is preferred for < 30 weeks at centers with capability. Poractant alfa 200 mg/kg (superior dose per evidence).",
      consequenceOfInaction: noAction(
        "Delayed surfactant in RDS = progressive alveolar collapse and hypoxemia.",
        [
          { timeframe: "1–2 hours", event: "Progressive atelectasis. FiO₂ requirement rises to 70–80%. Intubation required.", vitalsChange: { spo2: 75 } },
          { timeframe: "Hours–days", event: "Prolonged mechanical ventilation requirement. BPD risk increases with each hour of high-pressure ventilation." },
          { timeframe: "Weeks", event: "BPD: oxygen dependency at 36 weeks corrected gestational age." },
        ],
        "Bronchopulmonary Dysplasia (BPD) from delayed surfactant and prolonged ventilation.",
        "TIME IS LUNG in RDS. Early surfactant (within 2 hours of birth) reduces BPD. Every hour of delay = increased BPD risk. Give surfactant when indicated, don't wait.",
      ),
    }),
    step("post_surfactant", {
      context: "Post-LISA surfactant: FiO₂ drops from 50% to 28% in 20 minutes. Infant continues on CPAP 6. Now 2 hours later: increasing apnea, desaturations to 78% with 15-second apnea spells.",
      waveformConfig: neonatalVentConfig("rds_28wk"),
      vitals: { hr: 162, spo2: 78, rr: 40, bp: "40/22", fio2: 28 },
      question: "Apnea of prematurity causing desaturations despite good SpO₂ between episodes. Best management?",
      choices: [
        adv("a", "Caffeine citrate 20 mg/kg IV loading dose — first-line pharmacotherapy for apnea of prematurity in < 34 weeks", true,
          "CORRECT. Caffeine is first-line for apnea of prematurity (AOP) in premature infants. Loading dose: caffeine citrate 20 mg/kg IV. Maintenance: 5–10 mg/kg/day. Mechanism: adenosine receptor antagonism → respiratory drive stimulation. Benefits: reduces AOP, reduces BPD, reduces death/NDI in the CAP trial. Give caffeine to all infants < 28 weeks regardless of AOP (prophylactic)."),
        adv("b", "Intubate and mechanically ventilate — apnea requires definitive airway management", false,
          "Intubation for AOP when the infant is otherwise stable between episodes is a last resort. Caffeine resolves most AOP. Reserve intubation for: caffeine failure, refractory apnea, worsening RDS requiring surfactant redosing."),
        adv("c", "Increase CPAP to 10 cmH₂O — the higher pressure will stent the airway and prevent obstructive apnea", false,
          "CPAP 8–10 may help for obstructive apnea, but AOP in 28-weekers is primarily CENTRAL (not obstructive). Caffeine is the appropriate treatment for central apnea. Excessive CPAP pressure risks overdistension."),
        adv("d", "Stimulation only — vigorous tactile stimulation after each apnea spell", false,
          "Tactile stimulation terminates individual spells but does not prevent recurrence. Caffeine reduces the frequency of apnea events. Use both (stimulation for acute episodes, caffeine for prevention), but caffeine is the primary intervention."),
      ],
      nextKey: "end",
      keyLearning: "Apnea of prematurity in < 34 weeks: caffeine citrate 20 mg/kg IV loading. Prophylactic caffeine for all < 28 weekers. Reduces AOP, BPD, and neurodevelopmental impairment.",
    }),
  ],
);

// ─── 2. Surfactant Administration — LISA Technique ────────────────────────────

export const nicu_surfactant_lisa: AdvancedSimulation = makeSimulation(
  "nicu_surfactant_lisa",
  {
    category: "nicu",
    title: "Surfactant Administration — LISA vs INSURE",
    summary: "Decision-making and technique for surfactant delivery in premature RDS.",
    patient: "30+1 week, 1,320g female. RDS on CPAP 7, FiO₂ 35%.",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    competencies: ["Surfactant indications", "LISA vs INSURE technique", "Post-surfactant monitoring", "FiO₂ weaning"],
  },
  [
    step("decision", {
      context: "30-weeker on CPAP 7 cmH₂O, FiO₂ 35% at 2 hours of age. CXR: bilateral ground-glass, low lung volumes. Infant has weak cry, minimal work of breathing.",
      waveformConfig: neonatalVentConfig("rds_32wk"),
      vitals: { hr: 172, spo2: 88, rr: 72, bp: "46/28", fio2: 35 },
      question: "This infant meets surfactant criteria. LISA vs INSURE — which is preferred and why?",
      choices: [
        adv("a", "LISA preferred in infants < 32 weeks with spontaneous respiratory effort — avoids intubation, reduces mechanical ventilation duration, reduces BPD rates vs INSURE", true,
          "CORRECT. Multiple RCTs (NINSAPP 2016, AMV trial, Take Care trial) demonstrate LISA superiority: (1) Reduces need for mechanical ventilation within 72 hours; (2) Reduces BPD at 36 weeks; (3) Reduces intubation complications. Prerequisites for LISA: spontaneous respiratory effort, competent laryngoscopist, 2mg/kg premedication (oral sucrose, not routinely sedation — sedation can suppress respiratory drive needed for LISA)."),
        adv("b", "INSURE preferred — intubation gives certainty of correct drug delivery", false,
          "INSURE is effective and is the backup if LISA fails. However, evidence consistently shows LISA reduces the duration of mechanical ventilation. INSURE is second-line at centers with LISA capability."),
        adv("c", "Neither — at 30 weeks, CPAP alone is sufficient; surfactant only for < 28 weeks", false,
          "ERS guidelines: surfactant indicated for RDS at any gestational age when FiO₂ > 30% on CPAP ≥ 6 cmH₂O. 30-weekers with FiO₂ 35% clearly meet criteria."),
        adv("d", "INSURE preferred — 30-weekers have developed respiratory drive adequate for spontaneous reintubation risk", false,
          "At 30 weeks, LISA is preferred over INSURE when spontaneous breathing is present. The decision is based on the evidence, not on gestational age."),
      ],
      nextKey: "technique",
      keyLearning: "LISA preferred at < 32 weeks with spontaneous effort. Reduces BPD and mechanical ventilation compared to INSURE. Prerequisites: spontaneous effort + competent laryngoscopist.",
    }),
    step("technique", {
      context: "LISA planned. You use a 16G vascular catheter as the LISA catheter. Poractant alfa 200 mg/kg = 264 mg (2 mL). The infant is given oral sucrose 0.2 mL for pain management.",
      waveformConfig: neonatalVentConfig("rds_32wk"),
      vitals: { hr: 168, spo2: 87, rr: 68, bp: "44/26", fio2: 35 },
      question: "During LISA, the infant's SpO₂ drops to 72% and HR falls to 110 during catheter insertion. What do you do?",
      choices: [
        adv("a", "Continue CPAP via mask during the procedure — the SpO₂ dip is expected; optimize CPAP seal, allow 10–15 seconds for stabilization before proceeding", true,
          "CORRECT. Transient desaturation during laryngoscopy for LISA is common and expected. Management: optimize CPAP mask seal (maintain PEEP during the procedure), use a two-person technique, allow brief stabilization. HR 110 is acceptable. If SpO₂ < 70% or HR < 100 despite maintained CPAP: abort, stabilize with BVM, then retry."),
        adv("b", "Immediately intubate and switch to INSURE technique", false,
          "Transient desaturation during LISA is expected and not an automatic indication to intubate. Abort criteria: SpO₂ < 70% or HR < 100 despite corrective steps."),
        adv("c", "Give 100% FiO₂ through the mask — the O₂ will resolve the desaturation", false,
          "Simply increasing FiO₂ without ensuring the mask seal is adequate doesn't help. CPAP seal is more important than FiO₂ at this moment."),
        adv("d", "Complete the surfactant administration rapidly regardless of the desaturation — the surfactant will improve oxygenation faster than stopping", false,
          "Rushing through LISA during significant instability risks placing the catheter incorrectly or causing further physiological stress. Stabilize first."),
      ],
      nextKey: "post_lisa",
      keyLearning: "LISA transient desaturation is expected. Abort criteria: SpO₂ < 70% or HR < 100 despite maintained CPAP. Two-person technique and optimized CPAP seal are critical.",
    }),
    step("post_lisa", {
      context: "LISA successful: 200 mg/kg poractant alfa administered. 30 minutes post-LISA: FiO₂ drops from 35% to 22%. SpO₂ 93%. CPAP 7.",
      waveformConfig: neonatalVentConfig("rds_32wk"),
      vitals: { hr: 162, spo2: 93, rr: 62, bp: "46/28", fio2: 22 },
      question: "FiO₂ 22% post-surfactant — can you wean CPAP level now?",
      choices: [
        adv("a", "Wean FiO₂ first to 21% while maintaining CPAP 6–7 cmH₂O — do NOT wean CPAP until FiO₂ is 21% and infant is clinically stable for ≥ 2 hours", true,
          "CORRECT. Post-surfactant weaning sequence: FiO₂ → CPAP → flow. Rationale: CPAP provides the alveolar distending pressure that the surfactant needs to work. Premature CPAP weaning removes the splinting pressure and causes alveolar collapse (re-atelectasis). Wean FiO₂ to 21% first, then gradually reduce CPAP (6 → 5 → 4 cmH₂O) as tolerated. Minimum CPAP duration: 12–24 hours post-surfactant."),
        adv("b", "Wean CPAP from 7 to 4 cmH₂O now — FiO₂ 22% shows the lungs are well-recruited", false,
          "FiO₂ improvement reflects surfactant function but the lungs still need CPAP distending pressure. Early CPAP weaning leads to atelectasis and re-intubation."),
        adv("c", "Keep CPAP 7 and FiO₂ 22% unchanged for 24 hours — no weaning until fully stable", false,
          "FiO₂ weaning CAN and should begin now. Holding FiO₂ at 22% when 21% would maintain SpO₂ is unnecessary hyperoxia — a risk for ROP in preterms."),
        adv("d", "Remove CPAP and trial on high-flow nasal cannula at 2 L/min", false,
          "HFNC provides inconsistent CPAP equivalent. Post-surfactant, maintain CPAP (known PEEP) for 12–24 hours before transitioning. HFNC is appropriate later in the weaning process."),
      ],
      nextKey: "end",
      keyLearning: "Post-surfactant weaning: FiO₂ first (to 21%), then CPAP (slowly over 12–24 hours). Premature CPAP weaning causes re-atelectasis. Hyperoxia (FiO₂ > 21%) causes ROP in preterms.",
    }),
  ],
);

// ─── 3. PPHN — Persistent Pulmonary Hypertension of the Newborn ───────────────

export const nicu_pphn: AdvancedSimulation = makeSimulation(
  "nicu_pphn",
  {
    category: "nicu",
    title: "PPHN — Persistent Pulmonary Hypertension",
    summary: "Term infant with cyanosis and pre-ductal/post-ductal SpO₂ gradient — diagnosis and escalating management.",
    patient: "Term infant, 3.8 kg, 39 weeks. Born by emergency C/S for fetal distress. Apgar 5/8. Now cyanotic at 2 hours of age.",
    difficulty: "advanced",
    estimatedMinutes: 10,
    competencies: ["PPHN diagnosis", "Pre/post ductal SpO₂", "iNO therapy", "ECMO threshold"],
  },
  [
    step("diagnose", {
      context: "Term infant: right wrist SpO₂ (pre-ductal) 82%, left foot SpO₂ (post-ductal) 64%. FiO₂ 100% on CPAP 6. CXR: clear lung fields (no parenchymal disease).",
      waveformConfig: neonatalVentConfig("pphn"),
      vitals: { hr: 168, spo2: 82, rr: 72, bp: "54/32", fio2: 100 },
      imaging: "CXR: clear lung fields, normal lung volumes, prominent pulmonary vasculature.",
      question: "Pre-ductal SpO₂ 82%, post-ductal 64% on FiO₂ 100%. Clear CXR. What is the diagnosis?",
      choices: [
        adv("a", "Persistent Pulmonary Hypertension of the Newborn (PPHN) — right-to-left shunting at the ductus arteriosus and foramen ovale, bypassing the lungs", true,
          "CORRECT. Pre/post ductal SpO₂ gradient > 10% = PPHN signature. Blood preferentially shunts right-to-left through the PDA (pre-ductal blood = better oxygenated; post-ductal = largely deoxygenated shunted blood). Clear CXR with hypoxemia rules out parenchymal disease (RDS, pneumonia) as the primary cause. Confirm with echocardiogram: dilated right heart, flattened septum, right-to-left PDA flow."),
        adv("b", "Cyanotic congenital heart disease — transposition of the great arteries (TGA)", false,
          "TGA produces hypoxemia with HYPEROXIA test failure (PaO₂ < 150 on 100% FiO₂) but does NOT typically produce a PRE/POST ductal gradient in the same way as PPHN. Echo is required to differentiate. The gradient pattern favors PPHN."),
        adv("c", "Respiratory distress syndrome — CXR shows ground-glass opacity not yet visible", false,
          "RDS: CXR shows ground-glass opacity and low lung volumes. Clear CXR on 100% FiO₂ with pre/post ductal gradient is PPHN, not RDS."),
        adv("d", "Pneumothorax — air leak causing unilateral blood flow reduction", false,
          "Pneumothorax would produce unilateral breath sound differences, respiratory distress, and CXR findings. It would not produce a bilateral pre/post ductal SpO₂ gradient."),
      ],
      nextKey: "ino_therapy",
      keyLearning: "Pre/post ductal SpO₂ gradient > 10% + clear CXR + hypoxemia = PPHN. Confirm with echocardiogram. Urgently escalate — PPHN can be fatal.",
      consequenceOfInaction: noAction(
        "PPHN without treatment: progressive hypoxemia from right-to-left shunting.",
        [
          { timeframe: "Hours", event: "Persistent hypoxemia causes pulmonary vasoconstriction → worsening shunting (vicious cycle).", vitalsChange: { spo2: 60 } },
          { timeframe: "Hours–days", event: "Metabolic acidosis from hypoxemia. Myocardial dysfunction. RV failure.", vitalsChange: { sbp: 0 } },
        ],
        "Cardiac arrest from refractory hypoxemia and right heart failure.",
        "PPHN is a medical emergency. The pulmonary hypertension creates a vicious cycle: hypoxemia → vasoconstriction → more shunting → more hypoxemia. Interrupt the cycle with iNO and optimization of ventilation.",
      ),
    }),
    step("ino_therapy", {
      context: "PPHN confirmed on echo: RV dilation, right-to-left PDA flow, TR jet 4.2 m/s (RVSP ~71 mmHg). Infant intubated, on PC ventilation: PIP 22, PEEP 4, RR 50, FiO₂ 100%. Pre-ductal SpO₂ 72%.",
      waveformConfig: { ...neonatalVentConfig("pphn", "pressure_control"), pip: 22, peep: 4, rr: 50 },
      vitals: { hr: 174, spo2: 72, rr: 50, bp: "52/30", fio2: 100 },
      question: "RVSP 71 mmHg (near-systemic). Starting inhaled nitric oxide (iNO). What is the initial dose and monitoring parameter?",
      choices: [
        adv("a", "iNO 20 ppm — start at 20 ppm (FDA-approved dose), monitor pre-ductal SpO₂ for response within 30–60 minutes, check methemoglobin at 1 and 4 hours", true,
          "CORRECT. FDA/HC approved dose for term/near-term infants: 20 ppm. Starting higher (40, 80 ppm) does not improve outcomes and increases methemoglobin risk. Response: pre-ductal SpO₂ improvement ≥ 10–15% within 30–60 min = positive response. Monitor: methemoglobin (target < 2.5%; at 20 ppm typically < 1%), NO₂ levels. Non-response at 30 min: assess for cGMP antagonism, consider sildenafil addition."),
        adv("b", "iNO 80 ppm — higher dose for more severe pulmonary hypertension", false,
          "Higher doses (40–80 ppm) are not superior to 20 ppm and significantly increase methemoglobin. Use 20 ppm."),
        adv("c", "iNO 5 ppm — start low to avoid rebound pulmonary hypertension", false,
          "5 ppm may be insufficient for acute PPHN management. 20 ppm is the effective starting dose. Weaning occurs in steps (20 → 15 → 10 → 5 → 1 ppm) over days."),
        adv("d", "Don't start iNO — give IV sildenafil instead as it has fewer side effects", false,
          "IV sildenafil is a second-line agent. iNO is first-line for PPHN requiring mechanical ventilation with pre-ductal SpO₂ < 85% on FiO₂ 100%. Sildenafil is added if iNO is insufficient."),
      ],
      nextKey: "ecmo_threshold",
      keyLearning: "iNO for PPHN: start at 20 ppm. Higher doses (40–80 ppm) no more effective. Monitor methemoglobin. Response at 30 min: SpO₂ improvement ≥ 10%. Non-response → add sildenafil or escalate.",
    }),
    step("ecmo_threshold", {
      context: "After 4 hours: iNO 20 ppm + sildenafil. Pre-ductal SpO₂ 72% (unchanged). OI (Oxygenation Index) = 42. The infant is deteriorating.",
      waveformConfig: neonatalVentConfig("pphn", "pressure_control"),
      vitals: { hr: 182, spo2: 72, rr: 50, bp: "48/28", fio2: 100 },
      labs: { ph: 7.25, paco2: 42, pao2: 38, lactate: 4.8 },
      question: "OI = 42, unresponsive to maximal conventional therapy. What is the threshold for ECMO referral?",
      choices: [
        adv("a", "OI > 40 on two consecutive measurements AND failing maximal medical management = ECMO threshold. Refer immediately to ECMO center", true,
          "CORRECT. ECMO criteria for PPHN (varies by center, general guidance): OI > 40 on two consecutive measurements at least 30 minutes apart, or OI > 25 with clinical deterioration (acidosis, cardiac dysfunction). This infant meets criteria. ECMO is bridge-to-recovery — PPHN is reversible; the ECMO supports oxygenation while pulmonary vascular resistance normalizes."),
        adv("b", "OI > 80 — wait for further deterioration before ECMO referral", false,
          "OI > 80 represents a critically late point for ECMO initiation. Outcomes are significantly better when ECMO is started at OI 40–60, not after severe deterioration. Early referral is essential."),
        adv("c", "ECMO is not indicated for PPHN — it is only for surgical cardiac conditions", false,
          "PPHN is one of the MOST COMMON ECMO indications in neonates. Reversibility is excellent — most PPHN cases on ECMO wean successfully as the pulmonary vasculature matures and responds."),
        adv("d", "OI > 20 for 2 hours — refer immediately to maximize survival", false,
          "OI > 20 is elevated but may not represent ECMO threshold (20–25 is a 'watch closely' zone). At OI 20, maximize conventional therapy (iNO, sildenafil, HFOV, prone). ECMO at OI > 40 (or > 25 with deterioration)."),
      ],
      nextKey: "end",
      keyLearning: "PPHN ECMO threshold: OI > 40 on two readings. Formula: OI = (FiO₂% × MAP) / PaO₂. Early referral at OI 40 gives better outcomes than waiting for OI > 80. PPHN has excellent ECMO outcomes (disease is reversible).",
    }),
  ],
);

// ─── 4. Meconium Aspiration Syndrome ─────────────────────────────────────────

export const nicu_mas: AdvancedSimulation = makeSimulation(
  "nicu_mas",
  {
    category: "nicu",
    title: "Meconium Aspiration Syndrome (MAS)",
    summary: "Term infant born through thick meconium-stained amniotic fluid — tracheal management and ventilation of MAS.",
    patient: "Term male, 3.9 kg, 41 weeks. Born through thick meconium MSAF. Apgar 3/6.",
    difficulty: "intermediate",
    estimatedMinutes: 9,
    competencies: ["MAS management", "NRP meconium protocol", "Air trapping ventilation", "Surfactant in MAS"],
  },
  [
    step("delivery", {
      context: "Delivery: thick meconium-stained amniotic fluid (MSAF). Infant is not vigorous: HR 88, limp, poor respiratory effort. Meconium visible at the mouth.",
      waveformConfig: neonatalVentConfig("mas"),
      vitals: { hr: 88, spo2: 50, rr: 8, bp: "40/22", fio2: 100 },
      question: "Non-vigorous newborn with MSAF. Per NRP 2021 — should you suction the trachea?",
      choices: [
        adv("a", "YES — NRP 2021 EXCEPTION: non-vigorous infant with MSAF AND direct visualization of meconium below the cords warrants direct tracheal suctioning with meconium aspirator before PPV", true,
          "CORRECT. NRP 2021 refined guidance: routine intubation/suction for MSAF is NOT indicated for VIGOROUS infants. However, for NON-VIGOROUS infants (poor tone, HR < 100, poor respiratory effort) with visible meconium below the cords: direct tracheal suctioning is warranted. The goal is to prevent further distal aspiration. Use meconium aspirator attached to laryngoscope/suction device."),
        adv("b", "NO — NRP 2021 removed tracheal suctioning for all MSAF deliveries", false,
          "NRP 2021 removed ROUTINE intubation for MSAF but retained tracheal suctioning for NON-VIGOROUS infants with meconium visible below the cords. The key distinction: vigorous (no suction) vs non-vigorous (suction if meconium visible below cords)."),
        adv("c", "Suction with a bulb syringe at the mouth and nose — do not intubate", false,
          "Bulb syringe is insufficient for thick meconium below the cords. Direct tracheal suctioning with a meconium aspirator is the appropriate technique for non-vigorous infants with subglottic meconium."),
        adv("d", "Immediate intubation for all MSAF deliveries — prevent aspiration before first breath", false,
          "NRP 2021: routine intubation for MSAF is NOT recommended regardless of MSAF thickness. Tracheal suctioning only if: (1) non-vigorous AND (2) meconium visible below the cords."),
      ],
      nextKey: "vent_mas",
      keyLearning: "MAS NRP 2021: Non-vigorous + meconium visible below cords = tracheal suctioning. Vigorous infants: standard care (no intubation). Do NOT suction routinely for all MSAF.",
    }),
    step("vent_mas", {
      context: "After tracheal suctioning: meconium retrieved. PPV initiated, HR rises to 148. On CPAP 6, infant's SpO₂ 85% on FiO₂ 50%. CXR: bilateral patchy infiltrates, hyperinflation, 'snowstorm' pattern.",
      waveformConfig: neonatalVentConfig("mas"),
      vitals: { hr: 148, spo2: 85, rr: 68, bp: "50/30", fio2: 50 },
      imaging: "CXR: bilateral irregular infiltrates (atelectasis + hyperinflation), patchy consolidation, pneumomediastinum suspected.",
      question: "MAS on CPAP with hyperinflation on CXR. What ventilation strategy is critical for MAS?",
      choices: [
        adv("a", "LOW PEEP (3–4 cmH₂O) to avoid worsening air trapping from already-obstructed airways — target adequate FRC without overdistension", true,
          "CORRECT. MAS unique physiology: ball-valve meconium obstructs small airways → gas enters but cannot exit (air trapping). PEEP worsens this by adding additional back-pressure to airways that are already obstructed. Use low PEEP (3–4 cmH₂O) in MAS — unlike RDS where PEEP 5–6 is standard. Also: long expiratory time (rate 30–40/min, I:E 1:2 to 1:3) to allow passive emptying."),
        adv("b", "High PEEP (8–10 cmH₂O) to recruit atelectatic areas", false,
          "High PEEP in MAS worsens the already-present air trapping from ball-valve obstruction. This can cause pneumothorax. The hyperinflation on CXR warns you: DO NOT use high PEEP."),
        adv("c", "Standard RDS PEEP settings (5–6 cmH₂O) — RDS and MAS have similar physiology", false,
          "MAS physiology is the OPPOSITE of RDS. RDS: low compliance, needs high PEEP for recruitment. MAS: normal compliance but high resistance + air trapping → low PEEP to avoid worsening obstruction."),
        adv("d", "HFOV immediately — MAS is always best managed with high-frequency ventilation", false,
          "HFOV is used for severe MAS refractory to conventional ventilation, not first-line. Conventional PC with low PEEP and long Te is the initial strategy."),
      ],
      nextKey: "surfactant_mas",
      keyLearning: "MAS ventilation: LOW PEEP (3–4 cmH₂O) to avoid worsening air trapping. Long Te. Rate 30–40/min. MAS physiology ≠ RDS physiology — don't use RDS PEEP strategy.",
    }),
    step("surfactant_mas", {
      context: "On PC ventilation with PEEP 3, rate 40, FiO₂ 65%. SpO₂ 87%. PaO₂ 58. Meconium continues to appear on suctioning. Considering surfactant.",
      waveformConfig: neonatalVentConfig("mas"),
      vitals: { hr: 162, spo2: 87, rr: 40, bp: "52/32", fio2: 65 },
      labs: { ph: 7.32, pao2: 58, paco2: 42 },
      question: "Is surfactant indicated in MAS, and at what dose?",
      choices: [
        adv("a", "Yes — surfactant 200 mg/kg (Poractant alfa/Curosurf) treats the secondary surfactant deficiency caused by meconium inactivation of endogenous surfactant", true,
          "CORRECT. Meconium directly inactivates endogenous surfactant (contains phospholipase, free fatty acids). This creates a secondary surfactant deficiency on top of the mechanical obstruction. Exogenous surfactant (200 mg/kg Poractant alfa) at OI > 15 or FiO₂ > 40% reduces severity and duration of MAS. ACMENA trial and other data support surfactant lavage in some centers (bronchoalveolar lavage with dilute surfactant 5 mg/kg to wash out meconium), but this remains experimental."),
        adv("b", "No — surfactant is contraindicated in MAS; it makes the meconium more viscous", false,
          "Surfactant does NOT make meconium more viscous. Exogenous surfactant partially restores the inactivated surfactant pool and is beneficial in moderate-severe MAS."),
        adv("c", "Yes, but at 100 mg/kg only — the lower dose avoids worsening airway flooding", false,
          "The therapeutic dose for MAS is the same as RDS: 200 mg/kg Poractant alfa. Lower doses are less effective."),
        adv("d", "Only if the infant requires HFOV — surfactant is a rescue agent for severe MAS only", false,
          "Evidence supports surfactant for moderate MAS (OI > 15 or FiO₂ > 40% on conventional ventilation) before escalation to HFOV. Early surfactant may prevent the need for HFOV/ECMO."),
      ],
      nextKey: "end",
      keyLearning: "MAS: secondary surfactant deficiency from meconium inactivation. Give 200 mg/kg Poractant alfa at OI > 15 or FiO₂ > 40%. Reduces severity and progression to HFOV/ECMO.",
    }),
  ],
);

// ─── 5–15: Additional neonatal simulations ────────────────────────────────────

export const nicu_neonatal_ptx: AdvancedSimulation = makeSimulation(
  "nicu_neonatal_ptx",
  {
    category: "nicu",
    title: "Pneumothorax in the Newborn",
    summary: "Premature infant on CPAP with sudden deterioration — transillumination and needle aspiration.",
    patient: "29-week infant on CPAP 7. Sudden desaturation, HR drop, decreased breath sounds left.",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    competencies: ["Neonatal PTX recognition", "Transillumination", "Needle aspiration", "Chest tube in neonates"],
  },
  [
    step("recognize", {
      context: "29-weeker on CPAP 7: sudden SpO₂ drop to 68%, HR 94 from baseline 165. Chest: decreased breath sounds left. CXR takes 10 minutes.",
      waveformConfig: neonatalVentConfig("rds_28wk"),
      vitals: { hr: 94, spo2: 68, rr: 80, bp: "38/20", fio2: 55 },
      question: "Cannot wait 10 minutes for CXR. Immediate bedside diagnosis?",
      choices: [
        adv("a", "Transillumination — apply fiberoptic light to chest wall: bright glow on the affected side = pneumothorax (air transmits more light than aerated lung)", true,
          "CORRECT. Transillumination is the bedside immediate test for neonatal pneumothorax. Technique: darken the room, apply a cold fiberoptic light (Chun-gun) firmly to the chest wall. Normal aerated lung: dull glow limited to the probe contact area. Pneumothorax: bright glow spreading across the ipsilateral hemithorax. Sensitivity ~90% in thin-walled neonatal chest. Treat based on transillumination if the infant is deteriorating — don't wait for CXR."),
        adv("b", "Needle aspiration at the left 2nd ICS MCL — treat empirically if clinical signs are present", false,
          "While empirical needle aspiration is appropriate for a hemodynamically unstable neonate, transillumination first (30 seconds) confirms the diagnosis before intervention. Don't poke without confirmation in a conscious, awake neonate."),
        adv("c", "Request STAT portable CXR — proceed when available", false,
          "SpO₂ 68% and HR 94 is not stable enough to wait for CXR. Transilluminate NOW."),
        adv("d", "Auscultate bilaterally and compare — breath sound differences confirm pneumothorax", false,
          "Auscultation in neonates is notoriously unreliable — sounds transmit widely in a small chest. Transillumination is more sensitive and specific than auscultation alone."),
      ],
      nextKey: "aspirate",
      keyLearning: "Neonatal PTX bedside diagnosis: transillumination (bright glow = PTX). Faster than CXR. 30-second test. Act immediately in a deteriorating infant.",
    }),
    step("aspirate", {
      context: "Transillumination: bright glow left hemithorax. Confirmed left pneumothorax. Infant HR 88, SpO₂ 64%. Emergency needle aspiration needed.",
      waveformConfig: neonatalVentConfig("rds_28wk"),
      vitals: { hr: 88, spo2: 64, rr: 80, bp: "36/18", fio2: 70 },
      question: "Needle aspiration of neonatal pneumothorax: site and technique?",
      choices: [
        adv("a", "Insert 23–25G butterfly needle at the 2nd ICS, MCL on the affected side — connect to 10 mL syringe with 3-way stopcock, aspirate air until resistance is felt, repeat as needed", true,
          "CORRECT. Neonatal needle aspiration: 23–25G butterfly needle (smaller than adult to avoid lung laceration). Site: 2nd ICS, MCL. Technique: insert needle, connect syringe via 3-way stopcock (allows repeated aspiration without air re-entry), aspirate in 1–3 mL aliquots. Improvement: HR and SpO₂ should improve within 30–60 seconds of successful air removal."),
        adv("b", "Insert a 14G angiocath (adult needle decompression technique) for rapid aspiration", false,
          "14G is far too large for a neonate — risk of lung laceration is high. Use 23–25G butterfly needle."),
        adv("c", "Use a 30-mL syringe and aspirate in one large pull", false,
          "Large volume aspiration in a single pull can pull lung tissue into the needle. Small-volume aspiration with a 3-way stopcock allows controlled incremental decompression."),
        adv("d", "Wait for a neonatologist to perform the procedure", false,
          "SpO₂ 64% and HR 88 in a neonate is pre-arrest physiology. Every RT should be competent in neonatal needle aspiration. Waiting causes harm."),
      ],
      nextKey: "end",
      keyLearning: "Neonatal PTX needle aspiration: 23–25G butterfly, 2nd ICS MCL, 3-way stopcock. Small-volume aspirations. Improvement expected within 60 seconds. Follow with pigtail/chest tube for ongoing leak.",
    }),
  ],
);

export const nicu_apnea_prematurity: AdvancedSimulation = makeSimulation(
  "nicu_apnea_prematurity",
  {
    category: "nicu",
    title: "Apnea of Prematurity",
    summary: "Recurrent apneas in a 30-weeker — caffeine therapy, CPAP optimization, escalation criteria.",
    patient: "30-week female, 1,450g. Day 4 of life. 8 apneas in 12 hours, requiring stimulation.",
    difficulty: "basic",
    estimatedMinutes: 6,
    competencies: ["AOP management", "Caffeine protocol", "Central vs obstructive apnea", "Escalation triggers"],
  },
  [
    step("classify", {
      context: "8 apneas in 12 hours, all requiring stimulation. Some associated with bradycardia to 80. SpO₂ nadir 72%. Infant on room air, no CPAP currently.",
      waveformConfig: neonatalVentConfig("term_normal"),
      vitals: { hr: 158, spo2: 96, rr: 50, bp: "44/26", fio2: 21 },
      question: "Classify: which type of apnea is most common in premature infants and what is the primary treatment?",
      choices: [
        adv("a", "Mixed apnea (central + obstructive components) is most common — treated with caffeine (first-line) + CPAP 4–6 cmH₂O (reduces obstructive component)", true,
          "CORRECT. AOP types: (1) Central (no effort): reduced brainstem respiratory drive — caffeine is first-line; (2) Obstructive (effort present): airway collapse — CPAP; (3) Mixed (most common, 50–60%): both components. Treatment: caffeine loading 20 mg/kg (citrate salt) + CPAP 4–6 cmH₂O for mixed/obstructive component. Caffeine effect begins within 12 hours."),
        adv("b", "Obstructive apnea only — treat with CPAP and position supine with neck extended", false,
          "Purely obstructive AOP is less common (10–20%). Mixed apnea is most common. Treatment should include caffeine regardless."),
        adv("c", "Central apnea only — CPAP is ineffective; use caffeine alone", false,
          "Mixed apnea is most common. Even if central predominates, CPAP reduces the obstructive component and is recommended. Caffeine + CPAP is the combined approach."),
        adv("d", "Periodic breathing — normal pattern in prematures, no treatment needed at this frequency", false,
          "Periodic breathing: regular cycling of 10–15-second apneas alternating with breathing, no desaturation, no bradycardia. This infant has 8 apneas requiring stimulation with bradycardia — this is pathological AOP requiring treatment."),
      ],
      nextKey: "escalation",
      keyLearning: "AOP: mixed apnea is most common. Caffeine 20 mg/kg loading + CPAP 4–6 cmH₂O. Caffeine is THE most evidence-based intervention in neonatology (CAP trial).",
    }),
    step("escalation", {
      context: "Caffeine given + CPAP 5 cmH₂O. 12 hours later: only 2 apneas, no stimulation needed, minimal desaturations. Infant tolerating feeds. No bradycardia.",
      waveformConfig: neonatalVentConfig("term_normal"),
      vitals: { hr: 165, spo2: 96, rr: 52, bp: "44/26", fio2: 21 },
      question: "When would you escalate AOP management beyond caffeine + CPAP?",
      choices: [
        adv("a", "More than 2–3 stimulation-required apneas per day despite caffeine maintenance OR any event requiring BVM resuscitation → intubation + mechanical ventilation", true,
          "CORRECT. Escalation criteria for AOP: (1) > 2–3 severe events per day (requiring stimulation) despite adequate caffeine + CPAP; (2) ANY event requiring PPV/BVM → immediate intubation evaluation; (3) Recurrent bradycardia < 80 bpm. At this infant's trajectory (2 apneas, no stimulation needed), management is working — do not escalate."),
        adv("b", "Any apnea at all — zero tolerance policy for apnea in premature infants", false,
          "Rare, brief apneas in prematures are expected. Zero-tolerance escalation would result in unnecessary intubation. The threshold is recurrent severe events requiring intervention or BVM use."),
        adv("c", "Increase caffeine to 30 mg/kg/day if any apnea persists", false,
          "Standard caffeine maintenance: 5–10 mg/kg/day. Higher doses (10–20 mg/kg/day) in refractory AOP are used in some centers but 30 mg/kg risks toxicity (tachycardia, seizures). Escalate to CPAP optimization or intubation, not supratherapeutic caffeine."),
        adv("d", "If caffeine levels are sub-therapeutic at 48 hours — check a level and dose accordingly", false,
          "Caffeine levels are monitored in some centers (therapeutic range 5–20 mg/L), but dosing by clinical response is the most common approach. Escalation to intubation is based on clinical severity, not serum levels."),
      ],
      nextKey: "end",
      keyLearning: "AOP escalation: > 2–3 events/day requiring stimulation + caffeine fails → intubation. Any BVM event → escalate immediately. Clinical trajectory: 8 → 2 apneas = responding well.",
    }),
  ],
);

export const nicu_hfov: AdvancedSimulation = makeSimulation(
  "nicu_hfov",
  {
    category: "nicu",
    title: "High-Frequency Oscillatory Ventilation (HFOV)",
    summary: "Transitioning a failing neonatal patient from conventional to HFOV — settings, physiology, and monitoring.",
    patient: "32-week infant with ARDS from sepsis. OI 28 on conventional PC ventilation. Conventional ventilation failing.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["HFOV indications", "MAP vs amplitude settings", "CO₂ vs oxygenation targets", "HFOV weaning"],
  },
  [
    step("initiation", {
      context: "32-weeker with OI 28 on PC: PIP 30, PEEP 8, RR 60, FiO₂ 80%. ABG: pH 7.28, PaCO₂ 58, PaO₂ 52. Two doses of surfactant given. Decision made for HFOV.",
      waveformConfig: { ...neonatalVentConfig("rds_32wk", "hfov"), hfovFrequency: 10, hfovAmplitude: 40, peep: 16 },
      vitals: { hr: 172, spo2: 84, rr: 60, bp: "40/22", fio2: 80 },
      labs: { ph: 7.28, paco2: 58, pao2: 52 },
      question: "Starting HFOV. Initial MAP and frequency settings for a 32-weeker with RDS/ARDS?",
      choices: [
        adv("a", "MAP = 2 cmH₂O above conventional PEEP (so MAP 10 if PEEP was 8) — frequency 10–12 Hz — amplitude set to achieve visible chest 'wiggle' at every point of the chest", true,
          "CORRECT. HFOV initiation for RDS: MAP = 2 cmH₂O above optimal conventional MAP (or 2 above PEEP if no plateau available). For 32-weeker with PEEP 8: initial MAP 10 cmH₂O. Frequency 10–12 Hz in neonates (lower for larger/older patients). Amplitude (ΔP): set to achieve visible chest oscillations at clavicles and umbilicus — this ensures adequate Vt delivery. FiO₂ 100% initially then titrate by MAP."),
        adv("b", "MAP = 20 cmH₂O immediately — aggressive recruitment", false,
          "Excessive MAP risks overinflation, pneumothorax, and impaired venous return. Start at MAP 2 cmH₂O above conventional and titrate up by oxygenation response."),
        adv("c", "Frequency 3–5 Hz — lower frequency delivers larger tidal volumes in neonates", false,
          "3–5 Hz is appropriate for ADULT ARDS rescue HFOV (3100B ventilator). In neonates: 10–15 Hz is appropriate. Lower frequency in adults is needed because of larger dead space; neonates have different DCO₂ physics."),
        adv("d", "MAP equal to conventional PIP (30 cmH₂O) — same maximum pressure", false,
          "MAP on HFOV is the mean around which oscillations occur — it is not the same as PIP. MAP 30 would be excessive and cause severe overinflation."),
      ],
      nextKey: "monitoring",
      keyLearning: "HFOV initial settings: MAP = 2 cmH₂O above conventional MAP, frequency 10–12 Hz neonatal, amplitude for visible chest wiggle. Oxygenation = MAP + FiO₂. CO₂ = amplitude × frequency (DCO₂).",
    }),
    step("monitoring", {
      context: "HFOV running: MAP 12, frequency 12 Hz, amplitude 40, FiO₂ 80%. 30 minutes: ABG pH 7.20, PaCO₂ 72 (worsening), PaO₂ 65 (improving).",
      waveformConfig: { ...neonatalVentConfig("rds_32wk", "hfov"), hfovFrequency: 12, hfovAmplitude: 40, peep: 12 },
      vitals: { hr: 168, spo2: 87, rr: 720, bp: "42/24", fio2: 80 },
      labs: { ph: 7.20, paco2: 72, pao2: 65 },
      question: "PaO₂ improving (oxygenation better) but PaCO₂ worsening. Which adjustment specifically targets CO₂ elimination in HFOV?",
      choices: [
        adv("a", "Increase amplitude (ΔP) — CO₂ elimination in HFOV is proportional to amplitude² × frequency (DCO₂ law). Increasing amplitude directly increases CO₂ clearance.", true,
          "CORRECT. HFOV CO₂ physiology: CO₂ elimination (DCO₂) ∝ Vt² × frequency. Vt in HFOV ≈ proportional to amplitude. So DCO₂ ∝ amplitude² × frequency. To INCREASE CO₂ elimination: (1) Increase amplitude (primary) or (2) Decrease frequency (counterintuitively — lower Hz gives larger Vt per oscillation). Oxygenation is controlled SEPARATELY by MAP and FiO₂."),
        adv("b", "Increase MAP — higher MAP will improve both oxygenation and CO₂ elimination", false,
          "MAP controls oxygenation (alveolar recruitment). It does NOT directly control CO₂ elimination. Separate parameters for separate targets: MAP for O₂, amplitude for CO₂."),
        adv("c", "Increase frequency from 12 to 15 Hz — higher frequency = faster CO₂ removal", false,
          "COUNTERINTUITIVE IN HFOV: increasing frequency REDUCES Vt (shorter oscillation time = smaller Vt) and may actually REDUCE CO₂ elimination if the Vt reduction exceeds the frequency gain. Reduce frequency to INCREASE CO₂ elimination."),
        adv("d", "Switch back to conventional ventilation — HFOV cannot manage CO₂ as well as conventional", false,
          "HFOV is capable of excellent CO₂ management — amplitude is the target. If PaCO₂ is rising, the amplitude was set too low. Adjust before giving up on HFOV."),
      ],
      nextKey: "end",
      keyLearning: "HFOV: OXYGENATION controlled by MAP + FiO₂. CO₂ controlled by amplitude + frequency. To lower PaCO₂: increase amplitude (primary) or decrease frequency (secondary). These are INDEPENDENT controls.",
    }),
  ],
);

export const nicu_cdh: AdvancedSimulation = makeSimulation(
  "nicu_cdh",
  {
    category: "nicu",
    title: "Congenital Diaphragmatic Hernia (CDH)",
    summary: "Left-sided CDH with bowel in chest — gentle ventilation strategy and stabilization before surgery.",
    patient: "Term infant, 3.6 kg. Antenatal diagnosis left CDH. Born at 39 weeks, Apgar 5/8.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    competencies: ["CDH ventilation strategy", "Permissive hypercapnia in CDH", "PPHN in CDH", "Surgical timing"],
  },
  [
    step("stabilize", {
      context: "Left CDH confirmed: bowel loops visible in left chest on CXR. Heart shifted to right. Right lung clear. Infant intubated. PC ventilation: PIP 22, PEEP 5, RR 50.",
      waveformConfig: { ...neonatalVentConfig("cdh"), pip: 22, peep: 5, rr: 50 },
      vitals: { hr: 158, spo2: 82, rr: 50, bp: "48/28", fio2: 70 },
      imaging: "CXR: bowel loops in left chest, heart shifted to right, right lung partially compressed.",
      question: "CDH gentle ventilation principles — what is the MOST critical ventilation target?",
      choices: [
        adv("a", "PIP ≤ 25 cmH₂O and Pplat ≤ 25 — avoid barotrauma to the hypoplastic contralateral lung. Accept permissive hypercapnia (pH ≥ 7.20–7.25, PaCO₂ 45–65 mmHg)", true,
          "CORRECT. CDH lung-protective strategy (CDH study group, SickKids protocol): PIP ≤ 25 cmH₂O, Pplat ≤ 25, accept hypercapnia (pH ≥ 7.20). The contralateral lung is hypoplastic — overdistension with high pressures causes alveolar rupture and worsening pulmonary hypertension. Permissive hypercapnia is MANDATORY — do not chase a normal PaCO₂ at the cost of barotrauma."),
        adv("b", "Normalize PaCO₂ to 35–45 mmHg using RR and Vt — respiratory alkalosis reduces pulmonary vascular resistance", false,
          "While mild alkalosis does reduce PVR, achieving normal PaCO₂ with CDH lungs requires pressures that cause VILI. The risk of barotrauma outweighs the benefit. Permissive hypercapnia pH ≥ 7.20 is the CDH standard."),
        adv("c", "BVM hand ventilation at 100% FiO₂ for first 30 minutes — avoid mechanical ventilation initially", false,
          "BVM provides no consistent PEEP and uncontrolled Vt — both are risks in CDH. Intubation and controlled mechanical ventilation with lung-protective settings is the standard."),
        adv("d", "High PEEP (8–10 cmH₂O) to maximally recruit the contralateral lung", false,
          "High PEEP in CDH risks overdistension of the small remaining functional lung and worsening of pulmonary hypertension. PEEP 3–5 cmH₂O is used in CDH — NOT high PEEP."),
      ],
      nextKey: "pphn_cdh",
      keyLearning: "CDH ventilation: PIP ≤ 25, PEEP 3–5, permissive hypercapnia (pH ≥ 7.20). NEVER chase normal CO₂ at the cost of barotrauma. High pressure kills the hypoplastic lung.",
    }),
    step("pphn_cdh", {
      context: "Pre-ductal SpO₂ 85%, post-ductal 62%. Echo: RVSP 75 mmHg (near-systemic pulmonary hypertension). PPHN is a major component of CDH morbidity.",
      waveformConfig: { ...neonatalVentConfig("cdh"), pip: 22 },
      vitals: { hr: 162, spo2: 85, rr: 50, bp: "50/30", fio2: 80 },
      question: "CDH with severe PPHN. Which pulmonary vasodilator is FIRST LINE?",
      choices: [
        adv("a", "iNO 20 ppm — same first-line role as idiopathic PPHN, though response may be partial in CDH", true,
          "CORRECT. iNO is first-line for CDH-associated PPHN. However, CDH PPHN is more refractory than idiopathic PPHN — the pulmonary vasculature is structurally abnormal (medial muscular hypertrophy). Response rates lower. Sildenafil, milrinone, and prostacyclin are commonly added. ECMO is more frequently required in CDH PPHN than idiopathic PPHN."),
        adv("b", "IV sildenafil — CDH PPHN responds better to sildenafil than iNO", false,
          "Sildenafil is used as adjunct or second-line. iNO is first-line for most forms of neonatal PPHN including CDH. Both are often combined."),
        adv("c", "Aggressive PEEP titration to recruit more lung — more lung = less pulmonary vasoconstriction", false,
          "Attempting to recruit CDH lungs with high PEEP causes VILI. The hypoplastic lung has limited recruitability. Pulmonary vasodilators address the vascular component."),
        adv("d", "Proning — prone position reduces pulmonary vascular resistance in CDH", false,
          "Proning is not a standard practice in neonatal CDH management (surgical concerns, positioning challenges). It is used in pediatric/adult ARDS."),
      ],
      nextKey: "end",
      keyLearning: "CDH PPHN: iNO first-line (partial response), sildenafil + milrinone adjuncts. ECMO threshold lower in CDH than idiopathic PPHN. Surgical repair ONLY after PPHN is optimized (delayed repair principle).",
    }),
  ],
);

export const nicu_weaning: AdvancedSimulation = makeSimulation(
  "nicu_weaning",
  {
    category: "nicu",
    title: "Neonatal Ventilator Weaning",
    summary: "Premature infant recovering from RDS — systematic weaning from PC to CPAP to HFNC.",
    patient: "29-week infant, day 10, recovering RDS. On PC: PIP 18, PEEP 5, RR 35, FiO₂ 28%.",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    competencies: ["Neonatal weaning criteria", "CPAP trial", "Extubation readiness", "Post-extubation support"],
  },
  [
    step("wean_criteria", {
      context: "Day 10, 29-weeker. PC: PIP 18, PEEP 5, RR 35, FiO₂ 28%. SpO₂ 95–98%. ABG: pH 7.38, PaCO₂ 44. Infant making spontaneous respiratory efforts on the vent.",
      waveformConfig: { ...neonatalVentConfig("rds_28wk", "pressure_control"), pip: 18, peep: 5, rr: 35 },
      vitals: { hr: 162, spo2: 96, rr: 35, bp: "42/26", fio2: 28 },
      labs: { ph: 7.38, paco2: 44, pao2: 72 },
      question: "Does this infant meet extubation criteria for a trial of CPAP?",
      choices: [
        adv("a", "Yes — extubation criteria met: FiO₂ ≤ 30%, PIP ≤ 20 cmH₂O, adequate ABG, spontaneous effort present. Plan: extubate to CPAP 6 cmH₂O", true,
          "CORRECT. Neonatal extubation criteria (general): FiO₂ ≤ 30%, PIP ≤ 18–20 cmH₂O, adequate ABGs, spontaneous respiratory effort on the vent, stable hemodynamics, improving or stable CXR. This infant meets all criteria. Post-extubation: CPAP 5–7 cmH₂O (prevents de-recruitment of recently RDS-recovered lungs). Caffeine pre-extubation (reduces post-extubation apnea)."),
        adv("b", "No — wait until FiO₂ ≤ 21% before attempting extubation", false,
          "FiO₂ ≤ 30% is the commonly used threshold for neonatal extubation readiness. Waiting for 21% is overly conservative and prolongs invasive ventilation."),
        adv("c", "No — 29 weeks at day 10 is too premature for extubation; standard threshold is 36 weeks corrected age", false,
          "Gestational age at birth and corrected age are not the primary extubation criteria. Clinical parameters (FiO₂, PIP, effort, ABG) determine readiness, not age."),
        adv("d", "Yes — extubate directly to room air if SpO₂ is maintained", false,
          "Extubating a 29-weeker recovering from RDS to room air without CPAP risks immediate de-recruitment. CPAP 5–7 cmH₂O post-extubation is standard."),
      ],
      nextKey: "post_extubation",
      keyLearning: "Neonatal extubation criteria: FiO₂ ≤ 30%, PIP ≤ 20, adequate ABGs, spontaneous effort. Extubate to CPAP 5–7 cmH₂O (not room air). Pre-extubation caffeine reduces apnea risk.",
    }),
    step("post_extubation", {
      context: "Extubated to CPAP 6, FiO₂ 25%. 4 hours post-extubation: 3 apneas (each lasting 20 seconds, requiring gentle stimulation). SpO₂ nadirs 78–82%. Heart rate maintained.",
      waveformConfig: neonatalVentConfig("term_normal", "cpap"),
      vitals: { hr: 162, spo2: 90, rr: 55, bp: "42/24", fio2: 25 },
      question: "3 apneas requiring stimulation in 4 hours post-extubation. Is this extubation failure?",
      choices: [
        adv("a", "Not yet — 3 stimulation-required apneas is borderline; ensure caffeine is dosed, increase CPAP to 7, observe for another 2 hours before re-intubation decision", true,
          "CORRECT. Post-extubation apnea definition varies: most centers use > 3–4 events requiring stimulation per hour, OR any event requiring PPV, as re-intubation criteria. 3 events in 4 hours = 0.75/hour = borderline. Ensure adequate caffeine (check timing of last dose), try CPAP increase, continue observation. Do not re-intubate prematurely — each intubation/extubation cycle carries risk."),
        adv("b", "Yes — re-intubate immediately for any post-extubation apnea requiring stimulation", false,
          "Not all post-extubation apnea requires re-intubation. Reserve re-intubation for: > 3–4 events/hour, any PPV requirement, hemodynamic instability, worsening FiO₂ requirement."),
        adv("c", "Yes — CPAP cannot manage apnea; switch directly to HFNC for less work of breathing", false,
          "HFNC provides inconsistent CPAP equivalent and variable support. CPAP is superior to HFNC for managing post-extubation apnea in premature infants (HIPSTER trial)."),
        adv("d", "No — post-extubation apnea is expected; accept up to 10 events/hour as normal", false,
          "10 events/hour is far above the threshold for re-intubation. Post-extubation apnea > 3–4/hour requiring stimulation = escalation."),
      ],
      nextKey: "end",
      keyLearning: "Post-extubation apnea re-intubation threshold: > 3–4 events/hour requiring stimulation OR any PPV event. 3 events in 4 hours = 0.75/hour = borderline. Optimize caffeine and CPAP before re-intubating.",
    }),
  ],
);

// ─── Registry ──────────────────────────────────────────────────────────────────

export const NICU_SIMULATIONS: readonly AdvancedSimulation[] = [
  nicu_rds_28wk,
  nicu_surfactant_lisa,
  nicu_pphn,
  nicu_mas,
  nicu_neonatal_ptx,
  nicu_apnea_prematurity,
  nicu_hfov,
  nicu_cdh,
  nicu_weaning,
];

export function getNicuSimulation(id: string): AdvancedSimulation | undefined {
  return NICU_SIMULATIONS.find((s) => s.id === id);
}
