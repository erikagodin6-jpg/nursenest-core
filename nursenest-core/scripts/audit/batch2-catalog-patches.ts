/**
 * Batch 2 catalog body replacements — substantive nursing content (no placeholders).
 * Paired with apply-lesson-batch2-catalog-patches.mts.
 */
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

type Patch = { sections: PathwayLessonRecord["sections"] };

export const BATCH2_CATALOG_PATCHES: Record<string, Patch> = {
  "cardiac-tamponade-nclex-rn": {
    sections: [
      {
        id: "intro",
        heading: "Introduction",
        kind: "intro",
        body: `**Cardiac tamponade** is impaired ventricular filling because fluid (blood, serous fluid, pus, or clots) accumulates in the pericardial space faster than the pericardium can stretch. Pressure rises around the heart, **equalizes with atrial pressures**, and stroke volume falls—often abruptly after trauma, post–cardiac surgery bleeding, malignancy, uremia, or procedural complications.

NCLEX-RN rewards **recognizing hemodynamic patterns**, **prioritizing escalation over routines**, and **protecting perfusion** while preparing for provider-ordered rescue (often **pericardiocentesis** or return to the OR). You are not expected to interpret every ultrasound frame, but you must connect **hypotension + distended neck veins + muffled heart sounds** (when present) with **time-sensitive notification** and **continuous monitoring**.

Pair this lesson with [acute coronary syndrome](LESSON:acute-coronary-syndrome-nclex-rn) for chest-pain overlap, [CABG complications](LESSON:cabg-and-postoperative-cabg-complications-nclex-rn) for mediastinal bleeding context, and [pulmonary embolism](LESSON:pulmonary-embolism-nclex-rn) when dyspnea could mislead.`,
      },
      {
        id: "core",
        heading: "Core concepts",
        kind: "core",
        body: `- **Pathophysiology**: rising intrapericardial pressure collapses thin-walled chambers first; **diastolic filling** drops, then cardiac output falls—classic teaching links **obstructive shock** physiology.
- **Beck triad** (hypotension, JVD, muffled heart sounds) is **supportive** but not always complete—especially if assessments are rushed or sounds are hard to hear in noisy units.
- **Pulsus paradoxus** (exaggerated inspiratory drop in systolic BP) reflects ventricular interdependence; measure carefully when ordered and report abnormal swings.
- **Electrical alternans** on ECG (beat-to-beat QRS amplitude change) suggests a large effusion with swinging heart—helpful when shown, but **do not delay escalation** for a missing ECG finding.
- **Mediastinal/chest tube trends** matter after sternotomy: sudden **drop in drainage** with new hypotension can signal clot obstruction rather than “less bleeding.”
- **Nursing priorities**: frequent **vitals**, **SpO₂**, **EKG/rhythm**, **paired neuro perfusion checks**, **IV access readiness**, **typed-and-crossed blood availability per protocol**, calm **positioning** (often **high Fowler’s** if tolerated), and **clear SBAR** to the provider and rapid-response team when indicated.`,
      },
      {
        id: "clinical_application",
        heading: "Clinical application",
        kind: "clinical_application",
        body: `**Patient vignette.** A 64-year-old client is post–CABG day 1 with a mediastinal tube. Over 30 minutes they become **anxious**, **tachycardic**, **hypotensive**, and **cool and clammy**. You notice **rising JVD** at 30° and **muffled** heart tones compared with earlier rounds. SpO₂ is borderline despite oxygen.

**Fork:** This pattern is **obstructive shock until proven otherwise**—not “anxiety,” not a routine fluid bolus without assessment, and not charting alone. Your sequence is **assess ABC + perfusion**, **call for help**, **notify the surgeon/cardiologist per policy**, **prepare for emergent bedside echo or pericardiocentesis**, and **document objective trends** (vitals, drainage, mentation). Avoid meds that collapse preload when tamponade is suspected unless ordered after evaluation.`,
      },
      {
        id: "exam_tips",
        heading: "Exam tips",
        kind: "exam_tips",
        body: `Examiners love tamponade questions that hide behind **routine tasks**: finishing paperwork, delaying provider contact, or giving **diuretics** for “fluid overload” when the problem is **pericardial constraint** and **preload dependence**. Another trap is choosing **aggressive fluid** without ruling out **tension physiology** or following orders—follow the stem’s hemodynamic story.

Boards also test **postoperative bleeding** pathways: a sudden **cessation of chest tube output** with instability can be **clot obstruction**, not improvement—communicate early. **Takeaways:** tie **neck veins + BP + heart sounds + procedure context** into one working diagnosis; pick **escalation + monitoring** over isolated comfort measures; rehearse **SBAR** with objective numbers. Before you answer a tamponade-style item, name whether the client is **preload dependent**, whether **mediastinal drainage** changed, and what **one escalation** you would request first—boards reward that discipline over single tricks like memorizing Beck triad alone. **Related lessons:** [pericarditis ECG clues](LESSON:pericarditis-ecg-clues) · [shock recognition](LESSON:shock-recognition-fluids) · [heart failure priorities](LESSON:heart-failure-nursing-priorities-hy) · [pathway hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "phlebostatic-axis-nclex-rn": {
    sections: [
      {
        id: "intro",
        heading: "Introduction",
        kind: "intro",
        body: `The **phlebostatic axis** is the reference plane used to **level and zero** invasive hemodynamic transducers (arterial lines, central venous pressure, pulmonary artery catheters) so numeric readings reflect **intravascular pressure** rather than a measurement artifact from a transducer that is too high or too low.

For NCLEX-RN, expect questions on **where to place the transducer**, **when to re-zero after repositioning**, and how **false highs/lows** change management decisions (fluids, vasopressors, diuretics). You must protect **consistency**: the same landmark for leveling across serial readings, especially after **HOB changes**, **proning**, or **transport**.

Connect hemodynamic monitoring to [shock recognition](LESSON:shock-recognition-fluids), [heart failure priorities](LESSON:heart-failure-nursing-priorities-hy), and [pulmonary embolism](LESSON:pulmonary-embolism-nclex-rn) when mixed shock pictures appear.

**Exam habit:** When a number “does not fit the patient,” assume **measurement error first**—especially after **turning, proning, transport, or line changes**—then reassess perfusion and correlate with bedside findings.`,
      },
      {
        id: "core",
        heading: "Core concepts",
        kind: "core",
        body: `- **Landmark (classic teaching)**: the phlebostatic axis is commonly defined at the **fourth intercostal space, mid-axillary line**—approximating **right atrial level** in supine adults; follow unit policy when a different reference is specified.
- **Zeroing** opens the transducer to atmospheric pressure at the reference height so the monitor reads **relative to the chosen axis**, not the floor or the mattress.
- **Transducer too low** versus the heart → falsely **high** pressures; **too high** → falsely **low** pressures—both can mislead fluid and drug decisions.
- **Re-level and re-zero** after meaningful **position changes** (HOB, reverse Trendelenburg, turning) before treating small CVP/PAOP swings as “real” changes.
- **Waveform quality**: **underdamped** (overshoot) vs **overdamped** (rounded, low amplitude) signals—check for **air**, **clots**, **loose connections**, **kinks**, and **fast-flush** tests per policy and with qualified colleagues.
- **Nursing integration**: label lines, maintain **sterile connections**, time-stamp interventions, and **report trends** with the client position documented.`,
      },
      {
        id: "clinical_application",
        heading: "Clinical application",
        kind: "clinical_application",
        body: `**Patient vignette.** A 70-year-old **client reports** lightheadedness after the head of bed was raised from **flat to 45°** for breathing comfort; they have a **PA catheter** for hemodynamic monitoring. Their **PAOP** suddenly looks “better,” but urine output falls and blood pressure drifts down.

**Fork:** Before charting “improved filling pressures,” **re-level the transducer** to the phlebostatic reference at the new torso position and confirm the waveform. A falsely low wedge from **height error** can prompt **inappropriate diuresis** or **fluid restriction** when the client actually needs different therapy. Pair numbers with **exam** (lung sounds, perfusion, lactate trends if available) and **notify** the provider with the **measurement method** included.`,
      },
      {
        id: "exam_tips",
        heading: "Exam tips",
        kind: "exam_tips",
        body: `Classic items ask: “readings are inconsistent after repositioning—what should the nurse do first?” The defensible answer is **re-level/re-zero** per protocol, not bolus fluids blindly or silence alarms. Another trap is choosing **routine bathing** while **damped waveforms** suggest **line failure**—fix **measurement integrity** first.

**Takeaways:** memorize the **landmark** as a safety anchor; narrate **position + transducer height** whenever you call a provider about invasive numbers; avoid treating a **single snapshot** without trend context. Add one more safety habit: whenever you chart a wedge or CVP, **document the bed angle** and whether the transducer was re-leveled—boards love “data looks inconsistent” stems that reward **measurement discipline** over guessing.

Finish with a **summary rule** you can reuse: invasive numbers are only as trustworthy as the **reference height** and **waveform quality** behind them—if either is suspect, **pause interpretation**, **fix the setup**, then **reassess the patient** before chasing orders that rest on bad data. **Related lessons:** [ABG basics](LESSON:abg-interpretation-basics-hy) · [ARDS ventilation basics](LESSON:ards-ventilation-basics) · [fluid balance acute care](LESSON:fluid-balance-acute-care) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "pulmonary-embolism-nclex-rn": {
    sections: [
      {
        id: "intro",
        heading: "Introduction",
        kind: "intro",
        body: `**Pulmonary embolism (PE)** is obstruction of pulmonary arterial flow—most often by **thrombus** from **deep vein thrombosis**—producing **V/Q mismatch**, **hypoxemia**, **tachycardia**, and sometimes **right ventricular strain** or **hemodynamic collapse**. NCLEX-RN tests whether you connect **risk** (immobility, surgery, estrogen, cancer, prior VTE) with **priority actions**: **oxygen**, **monitoring**, **timely diagnostics**, **anticoagulation safety**, and **bleeding precautions**.

This lesson complements the deeper **US RN pulmonary embolism** article where present; here the focus is **exam-style forks** and **nursing surveillance** without independent prescriber decisions. Use [DVT/PE priorities](LESSON:dvt-pe-nursing-priorities) and [fluid resuscitation judgment](LESSON:shock-recognition-fluids) when instability appears.

**Clinical frame:** Think **risk + sudden change**. PE can mimic **ACS**, **anxiety**, **pneumonia**, or **pneumothorax**—your stability assessment (work of breathing, perfusion, oxygenation) decides whether you are in **monitoring + diagnostics** versus **emergency escalation** pathways.`,
      },
      {
        id: "core",
        heading: "Core concepts",
        kind: "core",
        body: `- **Presentation spectrum**: sudden **dyspnea**, **pleuritic chest pain**, **tachycardia**, **hypoxia**; massive PE may add **hypotension**, **syncope**, or **RV failure** signs.
- **Labs/imaging (stem-dependent)**: **D-dimer** in low-risk workups; **CT pulmonary angiography** when suspicion is high; **V/Q scan** in select contraindications; **troponin/BNP** may rise with RV strain—integrate, do not fixate on one value.
- **Therapy themes**: **anticoagulation** when not contraindicated; **thrombolysis** in selected **unstable** massive PE per protocol; **IVC filter** themes when anticoagulation cannot be used—**provider decisions**.
- **Nursing care**: **SpO₂** and **work of breathing**, **bleeding checks** on anticoagulants, **fall/head injury precautions**, **early ambulation** when safe, **TED/SCD** per orders, and **teaching** on warning signs after discharge when applicable.

**Integration:** NCLEX wants you to connect **prevention** (SCDs, early mobility) with **recognition** (sudden dyspnea) and **safe handoff** (clear report of vitals, risk factors, and pending tests).`,
      },
      {
        id: "clinical_application",
        heading: "Clinical application",
        kind: "clinical_application",
        body: `**Patient vignette.** A 38-year-old postpartum client on estrogen therapy reports **sudden pleuritic pain** and **dyspnea** after a long car ride. They are **tachycardic** to 120s with **SpO₂ 90%** on room air and unilateral **calf swelling**.

**Fork:** Treat as **high-acuity** until evaluated—**oxygen per order**, **continuous monitoring**, **notify provider**, **anticipate imaging**, and **avoid ambulating** them alone. Do not offer **massage** to the painful calf. Document **risk factors** objectively and reassess frequently for **hypotension** or **altered mentation** suggesting massive PE.

The client should understand why **sudden breathlessness** plus **unilateral leg findings** is treated as an emergency—not “anxiety”—and why **anticoagulation safety** teaching follows only after life threats are addressed.`,
      },
      {
        id: "exam_tips",
        heading: "Exam tips",
        kind: "exam_tips",
        body: `Traps include **minimizing new dyspnea** after immobility, **choosing education** before **stabilizing oxygenation**, or **delegating** the unstable assessment away from the RN. Boards also test **bleeding + anticoagulation**: gum bleeding, **hematuria**, or **head strike** after starting therapy—know escalation pathways.

**Takeaways:** pair **risk + acute cardiopulmonary change** with **urgent evaluation**; teach **leg swelling + breathlessness** as a **single story**; link out to [atrial fibrillation stroke prevention](LESSON:atrial-fibrillation-nclex-rn) when overlapping arrhythmia items appear. Add a **closing rule**: when VTE risk is present and symptoms are acute, choose **assessment + activation** over reassurance; when stable on therapy, choose **education + bleeding precautions** over ignoring minor symptoms.

Finish with a **documentation habit**: record **onset time**, **associated symptoms**, **risk factors**, and **oxygen response** in objective language—this mirrors how exam vignettes present data and protects you from “pretty charting” distractors. **Related:** [ACS](LESSON:acute-coronary-syndrome-nclex-rn) · [COPD oxygen](LESSON:copd-exacerbation-oxygen) · [pathway hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "respiratory-assessment-ngn": {
    sections: [
      {
        id: "intro",
        heading: "Introduction",
        kind: "intro",
        body: `**Respiratory assessment and oxygenation** questions on NCLEX-RN Clinical Judgment (including NGN item types) usually embed risk in **routine data**: subtle **SpO₂** drift, new **accessory muscle** use, **inability to speak in full sentences**, **delayed capillary refill** with tachypnea, or **altered mentation** with a normal “comfort” appearance.

Your job is to **sequence safely**: confirm **airway patency**, **adequate breathing effort and rate**, then **circulatory adequacy** before teaching or discharge tasks. Use **objective trends** (work of breathing, SpO₂, mental status, skin color) rather than a single number. Connect oxygen decisions to [COPD CO₂ retention themes](LESSON:copd-exacerbation-oxygen) and [ARDS basics](LESSON:ards-ventilation-basics) when the stem hints at complexity.

**Practice frame:** Many stems hide respiratory failure inside **“routine post-op checks”** or **“client wants to sleep.”** If work of breathing is rising or mentation drifts, treat that as **potential respiratory failure** until assessment proves otherwise.`,
      },
      {
        id: "core",
        heading: "Core concepts",
        kind: "core",
        body: `- **Inspection**: nasal flaring, retractions, tripod positioning, asymmetric chest rise (pneumothorax/ETT issues when intubated).
- **Palpation/percussion themes** when tested: tracheal deviation, subcutaneous emphysema clues—pair with provider evaluation.
- **Auscultation**: diminished breath sounds (foreign body, effusion, pneumothorax), crackles (fluid/edema), wheezes (bronchospasm), **silent chest** in severe asthma—**escalate**.
- **Oxygen delivery**: nasal cannula vs simple mask vs non-rebreather—match device to **severity** and **repeat SpO₂** after changes; follow **SpO₂ targets** in the stem.
- **ABG/VBG context** when provided: **hypoxemia**, **hypercapnia**, **acidosis**—integrate with clinical picture; avoid memorizing one “perfect” threshold outside the vignette.
- **Safety**: verify **orders** for high-flow/modalities you are not trained to titrate independently; **call RT** per protocol when ventilator or advanced airway issues arise.

**Escalation cues:** PaO₂/FiO₂ themes, **silent chest** in asthma, **new confusion** with rising CO₂ on ABG, or **inability to maintain SpO₂** despite escalating oxygen—all are exam signals to move beyond “routine monitoring” toward **provider activation** and **preparedness for advanced support** per policy.`,
      },
      {
        id: "clinical",
        heading: "Clinical application",
        kind: "clinical_application",
        body: `**Patient vignette.** A 56-year-old client with pneumonia is on **2 L NC** with SpO₂ **94%**. Two hours later they are **tachypneic** to 32, using **accessory muscles**, and only speaking **two-word sentences**. BP is stable but they look exhausted.

**Fork:** This is **impending respiratory failure** risk—**not** the time for lengthy teaching. **Raise acuity**: reassess full set of vitals, **increase oxygen per protocol/order**, **notify provider**, prepare for **labs/ABG** and possible **escalation** (HFNC/BiPAP themes when ordered). Choose **assessment + escalation** over “reassure” or “complete discharge paperwork.”`,
      },
      {
        id: "examtips",
        heading: "Exam tips",
        kind: "exam_tips",
        body: `NGN traps reward **to-next-step** thinking: pick **assessment** that **closes the data gap** before **intervention** when instability is evolving; pick **intervention** when assessment is already complete and the threat is immediate (e.g., **severe hypoxia**). Avoid **delegating unstable assessments** to UAP.

**Takeaways:** pair **SpO₂ + work of breathing + mentation**; document **position**, **oxygen device**, and **response to therapy**; use [respiratory infection hubs](LESSON:pneumonia-oxygenation) and [PE clues](LESSON:pulmonary-embolism-clues) when differential diagnosis matters.

**Summary drill:** Before you lock an answer, say aloud the **primary threat** (airway, breathing pattern, oxygenation, perfusion) and the **next objective data** you need—if you cannot name both, you are guessing.

**Closing synthesis:** Respiratory items reward **trend thinking**—a stable SpO₂ can still be dangerous if **respiratory rate**, **accessory muscle use**, and **mental status** are worsening; pair devices and liter flow with **repeat assessments** after every change. **Related:** [ABG basics](LESSON:abg-interpretation-basics-hy) · [asthma status](LESSON:asthma-status-asthmaticus) · [US RN lesson hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "heart-failure-nursing-priorities-hy": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Heart failure (HF)** is a syndrome of impaired **cardiac output** and/or **elevated filling pressures**—often framed as **reduced ejection fraction (HFrEF)** or **preserved EF (HFpEF)** on exams. For NCLEX-RN, “HF priorities” means linking **congestion** (lungs, periphery, JVD), **perfusion** (mentation, urine output, cool skin), and **medication effects** (afterload reduction, diuresis, neurohormonal blockade) to **what you assess first** and **what you escalate**.

Canadian stems may show **metric weights** (kg) and **mmol/L labs**; the judgment pattern matches US items—**objective congestion + instability** outranks routine tasks. Use daily weights, strict **I&O**, lung sounds, and orthopnea patterns as **trend tools**, not single snapshots.

Connect HF care to [acute coronary syndrome](LESSON:acute-coronary-syndrome-nclex-rn) and [hypertensive crisis](LESSON:hypertensive-crisis-vs-urgency) when the stem mixes ischemia or BP extremes with congestion.

**NCLEX angle:** Items often stack **comorbidities** (AFib, CKD, COPD) to see whether you still identify **acute congestion** versus chronic baseline findings—compare **new change** against known baselines when the stem provides both.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners test whether you can **prioritize congestion vs perfusion** problems, recognize **medication toxicity** (digoxin, hypotension from ACE/ARB), and avoid **harm** (IV fluids in obvious fluid overload, NSAIDs that worsen retention). “First action” items often hinge on **assessment completeness**—recheck vitals, **SpO₂**, **lung fields**, **JVD**, and **mental status** before teaching or discharge paperwork.

They also probe **patient education**: sodium restriction, daily weights, when to call for **rapid weight gain**, **worsening orthopnea**, or **new edema**—but education is **never** the priority when the client is **hypoxic**, **hypotensive**, or **confused** from poor perfusion.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Congestion signals**: crackles, orthopnea/PND, peripheral edema, JVD, S₃ gallop (when auscultated), hepatojugular reflux themes.
- **Low-output / perfusion signals**: fatigue, oliguria, cool extremities, narrow pulse pressure, restlessness → decreased mentation.
- **Core medication classes (high-yield)**: loop diuretics (furosemide), ACE inhibitors/ARBs/ARNI, beta blockers (when stable), aldosterone antagonists, SGLT2 inhibitors in select HF—**administer on time**, monitor **K⁺/Cr**, **BP**, and **renal function** per orders.
- **Oxygen**: titrate to ordered SpO₂ targets; escalate for respiratory distress.
- **Nutrition/fluid**: sodium restriction teaching; fluid restriction when ordered—avoid extra IV fluids unless the stem supports hypovolemia.
- **Devices**: ICD/CRT themes appear as **education and safety**, not nurse programming.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 72-year-old client with HFrEF gains **2.5 kg overnight**, develops **bilateral crackles** halfway up, and **SpO₂** falls to **88%** on their usual cannula. BP is **102/68**, HR **110**, and they are **anxious** and unable to lie flat.

**Fork:** This is **acute decompensated HF with hypoxemia**—priority is **oxygen + monitoring + provider notification** with objective data (vitals, weight, lung findings, recent I&O). Do **not** choose “finish breakfast tray” or “ambulate now.” Anticipate **diuretic therapy** and possible **additional diagnostics** (BNP trends if used, CXR themes) per orders. Document **escalation triggers** clearly.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Weight + lungs + SpO₂** together beat any single “stable BP” reassurance.
- **Teach-back** is for stable clients—**rescue** is for escalating congestion/hypoxia.
- Pair this lesson with [AFib rate control](LESSON:atrial-fibrillation-rate-control) and [DVT/PE priorities](LESSON:dvt-pe-nursing-priorities) when comorbidities drive the stem.

**Synthesis:** Before you select an answer, run a **three-question loop**: Is **perfusion** threatened (mentation, urine, skin)? Is **congestion** worsening (orthopnea, crackles, JVD)? Did a **new drug, IV fluid, or missed dose** plausibly trigger the change? If any “yes,” prioritize **assessment + notification** over mobility, meals, or teaching.

**Related study links:** [shock recognition](LESSON:shock-recognition-fluids) · [pulmonary embolism](LESSON:pulmonary-embolism-nclex-rn) · [pathway hub](/canada/rn/nclex-rn/lessons) · [US hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "acute-myocardial-infarction-troponin": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Acute myocardial infarction (AMI)** is myocardial necrosis from **acute coronary occlusion** (usually thrombus) or supply–demand mismatch in vulnerable patients. **High-sensitivity troponin** is the biochemical marker of **myocardial injury**—it rises after cellular death and is central to NCLEX-RN “rule in / rule out ACS” reasoning alongside **symptoms** and **ECG**.

Nursing responsibility is **time-sensitive assessment**, **12-lead acquisition when ordered**, **monitoring for arrhythmias**, **preparing for reperfusion** (PCI vs thrombolysis per protocol), and **clear communication**—not independent diagnosis, but **never** ignoring evolving **ST changes** or **hemodynamic collapse**.

Link to [acute coronary syndrome lesson](LESSON:acute-coronary-syndrome-nclex-rn), [AFib](LESSON:atrial-fibrillation-nclex-rn), and [heart failure](LESSON:heart-failure-nursing-priorities-hy) when post-MI complications appear in the stem.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Boards test **MONA-era thinking updated to modern ACS care**: oxygen **when hypoxemic**, **aspirin** per protocol, **nitroglycerin** when appropriate and not contraindicated, **morphine alternatives** for pain when ordered, and **rapid cath lab activation** for STEMI patterns. Troponin timing questions reward knowing **serial testing**—a single negative early value **does not** clear ACS if suspicion remains high.

Traps include **delaying the ECG** for “comfort first,” **routine NSAIDs** that worsen cardiac risk, or **ambulating** a client with unstable vitals to the bathroom.

If the client describes **pressure-like pain** with diaphoresis, treat the pathway as **time-sensitive** even before troponin returns.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **STEMI vs NSTEMI framing**: ST elevation → emergent reperfusion pathway when shown; NSTEMI/unstable angina → risk stratification and timed management—follow the stem’s clues.
- **Troponin**: rises over hours; **serial draws** may be ordered—pair with **symptoms** and **ECG**.
- **Complications to monitor**: **VF/VT**, **brady blocks**, **acute MR** murmur, **pericarditis** pain, **reinfarction**, **cardiogenic shock** (hypotension, cool clammy skin, oliguria).
- **Nursing actions**: continuous **telemetry**, **pain reassessment**, **bleeding checks** post-PCI, **groin/radial site** monitoring, **renal protection** themes around contrast, and **patient education** on new antiplatelet regimens when applicable.

**Depth check:** When the stem adds **diabetes, older age, or female sex**, remember **atypical presentations** are common—still pursue ACS evaluation when the overall story fits.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 59-year-old client reports **crushing substernal pressure** radiating to the **left arm**, diaphoretic, **HR 104**, BP **160/92**. First troponin is **borderline** but **ST depressions** appear in lateral leads.

**Fork:** Treat as **ACS** until cleared—**continuous monitoring**, **notify provider**, **prepare for serial troponins and repeat ECG**, **avoid solo ambulation**, and follow **oxygen** orders for SpO₂. Choose **assessment + activation** over discharge instructions or routine meals.

The nurse should also **recheck pain** after interventions and **compare serial ECGs** when available—small dynamic changes can be the clue in NSTEMI vignettes.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **ECG + troponin + symptoms** are interpreted together—never one lab line in isolation.
- **Reperfusion delays** are a safety event—communicate clearly with concise times and findings.
- **Synthesis:** When two answers both sound “cardiac,” choose the one that **secures monitoring**, **obtains/communicates ECG changes**, and **activates the correct pathway** (PCI vs lysis vs medical management per stem) rather than the one that prioritizes paperwork or routine comfort.

**Related:** [endocarditis cultures](LESSON:endocarditis-blood-cultures) · [pericarditis clues](LESSON:pericarditis-ecg-clues) · [CABG complications](LESSON:cabg-and-postoperative-cabg-complications-nclex-rn).

**Hubs:** [Canada RN](/canada/rn/nclex-rn/lessons) · [US RN](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "shock-recognition-fluids": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Shock** is **inadequate tissue perfusion**—not always hypotension early. NCLEX-RN groups **hypovolemic**, **distributive** (septic, anaphylactic, neurogenic), **cardiogenic**, and **obstructive** (PE, tamponade, tension pneumothorax) patterns. **Fluids** help **select hypovolemic** and some **septic** presentations but can **harm** cardiogenic/obstructive shock if given blindly.

Your role is **trend recognition**: **mental status**, **skin**, **urine output**, **lactate themes** when shown, **BP/HR patterns**, and **oxygenation**—then **follow orders** for fluid type/rate and **escalate** when responses are inadequate.

Pair with [heart failure](LESSON:heart-failure-nursing-priorities-hy) (fluid caution), [PE](LESSON:pulmonary-embolism-nclex-rn), and [tamponade](LESSON:cardiac-tamponade-nclex-rn) when obstructive shock is in the differential.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Items reward **identifying shock category clues** and **first-line stabilization**: airway, **oxygen**, **IV access**, **monitoring**, **labs/blood cultures** in sepsis themes, **epinephrine** in anaphylaxis per orders, and **avoiding fluid overload** when lungs fill or JVD rises with fluids.

“Large volume bolus” is only correct when **hemorrhage** or **septic hypovolemia** is supported—not for every hypotensive client.

If the stem shows **warm skin and bounding pulses** with infection signs, think **distributive** shock pathways; if **cool, mottled skin** with poor urine output, think **hypovolemic or cardiogenic** patterns until proven otherwise.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Early sepsis**: fever/hypothermia, tachycardia, tachypnea, glucose elevation, altered mentation—activate sepsis bundles per facility.
- **Anaphylaxis**: airway swelling, urticaria, bronchospasm—**epinephrine IM** is first-line in teaching; position supine with legs elevated unless breathing dictates otherwise.
- **Neurogenic shock**: bradycardia + warm skin after spinal injury themes—distinct from spinal shock management nuances in specialty items.
- **Monitoring**: **MAP goals** when ordered, **urine output**, **repeat lactate** themes, **antibiotic timing** in sepsis.
- **Fluids**: isotonic crystalloids common in sepsis; **reassess lung sounds and perfusion** after boluses.

**Exam memory hook:** If the stem pairs **infection + hypotension**, your first nursing moves cluster around **oxygen, access, labs, cultures, antibiotics timing themes**, and **frequent reassessment**—not “finish routine tasks first.”`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** After a motor vehicle collision, a 41-year-old client is **tachycardic**, **cool and mottled**, with **MAP 58** despite **two crystalloid boluses**. Lungs are clear, but **neck veins are flat** and **FAST** imaging is pending.

**Fork:** This suggests **ongoing hemorrhagic shock**—escalate to **massive transfusion protocol themes**, **prepare blood products per order**, **keep warming measures**, and **avoid** “just one more liter” without surgical consultation when bleeding is uncontrolled. Communication and **repeat assessments** beat isolated tasks.

The nurse should **reassess perfusion** after each intervention and **report trends**, not single values, because boards test whether you recognize **failure to respond** to fluids as escalation criteria.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Shock type** changes fluid safety—**obstructive** and **cardiogenic** patterns punish blind boluses.
- **Reassess after every intervention**: lungs, perfusion, mentation, urine.
- **Exam synthesis:** When the stem offers **fluids vs pressors vs procedures**, match the **dominant mechanism** (loss vs maldistribution vs pump failure vs obstruction) before you pick an option that “sounds resuscitative” but widens an existing injury (for example, fluids in **tamponade** or **acute severe HF** without orders).

**Closing:** Rehearse one sentence: “What shock pattern fits, what is the next **reassessment** target, and what **escalation** is implied by instability?” If you cannot answer, you are not ready to pick the “best” intervention yet.

**Related:** [hypertensive crisis](LESSON:hypertensive-crisis-vs-urgency) · [DVT/PE](LESSON:dvt-pe-nursing-priorities) · [fluid balance](LESSON:fluid-balance-acute-care).`,
      },
    ],
  },

  "hypertensive-crisis-vs-urgency": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Hypertensive emergency (crisis)** implies **acute end-organ damage** from severe hypertension—examples include **acute pulmonary edema**, **aortic dissection**, **acute kidney injury**, **eclampsia**, **ICH**, or **ACS** with BP extremes. **Hypertensive urgency** is severely elevated BP **without** acute target-organ injury—management is **oral titration** and monitoring, not necessarily ICU drips.

NCLEX-RN tests whether you recognize **red-flag symptoms** that demand **controlled rapid lowering** under orders versus **gradual reduction** over hours–days for urgency.

Link to [ACS](LESSON:acute-coronary-syndrome-nclex-rn) and [HF](LESSON:heart-failure-nursing-priorities-hy) when the stem mixes organ injury; neuro deficits may also pair with [acute MI & troponin](LESSON:acute-myocardial-infarction-troponin) when chest pain coexists.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners punish **dropping BP too fast** in ischemic stroke contexts without a protocol window and **normalizing BP instantly** in every urgency vignette. They reward **assessment first**: neuro checks, chest pain evaluation, **vision changes**, **creatinine trends**, **fetal status** in pregnancy when shown.

Medication items may include **nitroprusside/nicardipine/labetalol** themes as **provider-managed** infusions—your role is **monitoring**, **line safety**, and **reporting adverse trends**.

If the stem centers **pregnancy**, add **fetal assessment** and **magnesium seizure prophylaxis** themes when eclampsia is suggested—follow the vignette’s priorities.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Emergency signs**: acute pulmonary edema with hypoxia, neurologic deficits, tearing chest pain radiating to the back (dissection suspicion), acute kidney injury with hypertensive retinopathy themes.
- **Urgency**: very high BP with **mild headache** but **no** end-organ findings—oral meds + follow-up.
- **Nursing monitoring**: **q5–15 min** vitals during titration when ordered, **continuous telemetry**, **strict I&O**, **neuro checks**, **fetal monitoring** in pregnancy when applicable.
- **Patient education**: medication adherence, home BP logs, sodium intake—after stabilization.

**Boards check discrimination:** **Urgency** clients may feel “fine” aside from elevated BP; **emergency** clients have **new organ dysfunction**—always anchor to symptoms, not the number alone.

**Deeper core:** Nursing care during IV antihypertensive therapy focuses on **frequent vitals**, **continuous cardiac monitoring** when ordered, **strict I&O**, **neurologic checks** for overshoot hypotension, and **clear communication** if symptoms worsen—especially **chest pain**, **acute vision loss**, **seizure**, or **focal deficits**.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 48-year-old client presents with **BP 220/130**, **thunderclap headache**, **neck stiffness**, and **new left-sided weakness**.

**Fork:** This is **neurovascular emergency** until proven otherwise—**activate stroke protocol themes**, **notify provider immediately**, **prepare for imaging**, and **avoid** unsupervised ambulation or **eating** before airway assessment. BP management follows **stroke pathway rules** in the stem—do not apply generic “lower fast always.”

If chest pain dominates instead, pivot to **ACS evaluation** while still managing BP per orders—examiners test whether you can keep **two serious diagnoses** in play without locking in too early.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Organ injury** defines emergency—not the number alone.
- **Gradual vs rapid** lowering is diagnosis-dependent—follow the vignette.
- **Synthesis:** Build a quick **organ scan** from the stem—**neuro** (focal deficits, headache), **pulmonary** (crackles, hypoxia), **renal** (oliguria, creatinine), **pregnancy** (fetal status), **vascular** (tearing pain)—because each changes the acceptable pace of BP reduction and the monitoring bundle you prioritize.

**Closing rule:** If you can name **which organ is threatened**, you can usually eliminate answers that treat hypertension as a **generic number** without addressing the **underlying emergency**.

**Related:** [AFib](LESSON:atrial-fibrillation-rate-control) · [endocarditis](LESSON:endocarditis-blood-cultures) · [renal case studies in hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "atrial-fibrillation-rate-control": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Atrial fibrillation (AFib)** is a **supraventricular tachyarrhythmia** with **disorganized atrial activity** and an **irregularly irregular** ventricular response when conduction through the AV node is variable. **Rate control** aims to keep the ventricular response in a range that preserves **diastolic filling**, **coronary perfusion**, and **symptom tolerance** while you address triggers (pain, infection, alcohol, hyperthyroidism, HF decompensation, PE).

**Stroke risk** is separate from rate control: many clients need **anticoagulation** per CHA₂DS₂-VASc-style reasoning on boards—follow the stem’s risk story. Nursing focus is **continuous assessment** (rhythm, rate, BP, perfusion, bleeding), **safe medication administration** (beta blockers, nondihydropyridine calcium channel blockers, digoxin themes), and **recognizing unstable tachycardia** that needs **electrical cardioversion** pathways rather than “wait and see.”

Pair with [heart failure priorities](LESSON:heart-failure-nursing-priorities-hy), [ACS](LESSON:acute-coronary-syndrome-nclex-rn), and [thyroid emergencies](LESSON:thyroid-storm-myxedema-clues) when rapid AFib is a secondary clue.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `NCLEX-RN items test whether you **prioritize instability**: hypotension, **acute altered perfusion**, **ischemic chest pain with rapid AFib**, or **pre-excitation** patterns when shown—those scenarios push toward **synchronized cardioversion** themes and **urgent provider activation**, not oral rate control alone.

They also test **medication safety**: avoid **verapamil/diltiazem** when **decompensated HF with reduced EF** is suggested unless the stem supports it; watch **bradycardia**, **heart block**, and **hypotension** after AV-nodal blockers; monitor **potassium and renal function** with **digoxin**. Boards love **bleeding + anticoagulation** stories—gum bleeding, hematuria, or head injury after starting DOACs—know escalation and hold parameters per orders.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Assessment**: apical–radial deficit themes, irregular rhythm, symptoms (palpitations, dyspnea, fatigue, syncope), **BP trends**, **lung congestion**, **JVD** when HF coexists.
- **Rate control options (exam themes)**: beta blockers, diltiazem/verapamil, digoxin—**titrate per orders**; IV options appear in acute care stems.
- **Rhythm control** may appear as **cardiology-managed**—your role is monitoring and **pre-procedure** teaching when ablation/cardioversion is planned.
- **Anticoagulation**: align with **stroke risk** and **bleeding risk** in the vignette; reinforce **adherence**, **lab monitoring** when warfarin is used, and **avoid NSAIDs** that increase bleed risk without orders.
- **Nursing actions**: telemetry documentation, **orthostatic vitals** when symptoms suggest, **fall precautions**, **teach warning signs** (worsening dyspnea, syncope, neurologic changes).

**Unstable AFib snapshot:** If the client is **hypotensive** with **altered mentation** or **ischemic pain** and the rhythm is **rapid AFib**, think **emergent cardioversion pathway**—not “finish breakfast” or “med pass later.”`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 76-year-old client with a history of HF **reports sudden palpitations** and **severe dizziness**. Telemetry shows **AFib with RVR** around **150s**; BP is **82/50**, and they are **cool and confused**.

**Fork:** This is **unstable tachycardia** until proven otherwise—**call for help**, **continuous monitoring**, **notify provider immediately**, and **prepare for synchronized cardioversion** per ACLS/policy themes. Do **not** prioritize oral metoprolol alone or routine hygiene tasks.

If instead BP is **128/78** with mild symptoms and stable perfusion, **rate control + monitoring + treating triggers** (pain, fever, volume overload) matches many board pathways—still document **neuro and perfusion checks** after each intervention.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Rate control ≠ stroke prevention**—boards split those decisions; watch anticoagulation cues.
- **Instability** (hypotension, ischemia, shock) changes the answer set toward **urgent rhythm management**, not routine tasks.
- **Reassess after every AV-nodal blocker**: new bradycardia or hypotension can signal **too much rate control** or evolving **heart block**—communicate early.

**Synthesis:** Name **perfusion** first, then **rate**, then **bleeding risk**—that order eliminates many distractors.

**Related:** [acute MI & troponin](LESSON:acute-myocardial-infarction-troponin) · [DVT/PE priorities](LESSON:dvt-pe-nursing-priorities) · [elective cardioversion vs shock](LESSON:defibrillation-vs-synchronized-cardioversion-nclex-rn) · [Canada hub](/canada/rn/nclex-rn/lessons) · [US hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "endocarditis-blood-cultures": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Infective endocarditis (IE)** is infection of the **endocardial surface**, most often **valve leaflets**—commonly involving **Staphylococcus aureus** (IV drug use, devices) or **viridans streptococci** (oral procedures/oral sources) among other organisms. It produces **fever**, **systemic embolic phenomena**, **new murmurs**, and sometimes **destructive valvular lesions** with **heart failure** or **abscess** formation.

**Blood cultures** are the cornerstone of microbiologic diagnosis—typically **multiple sets from separate venipunctures** before antibiotics when safe, so organisms can be identified and sensitivities guide long-term therapy. Nursing responsibilities include **strict aseptic technique**, **correct labeling and timing**, **avoiding culture contamination**, **monitoring for sepsis**, and **protecting vascular access** while coordinating with pharmacy for **timed antibiotic starts** per orders.

Link IE workup to [endocarditis NCLEX hub lesson](LESSON:infective-endocarditis-nclex-rn), [HF](LESSON:heart-failure-nursing-priorities-hy), and [stroke assessment](LESSON:stroke-assessment-tpa-window) when embolic strokes appear in the stem.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Boards reward **culture-before-antibiotics discipline** when the client is **not crashing**—starting broad antibiotics immediately without cultures can be wrong in classic teaching unless **septic shock** forces earlier administration per protocol. Another pattern tests **IE complications**: **Janeway lesions**, **Osler nodes**, **splinter hemorrhages**, **Roth spots**—know these as **supporting clues**, not replacements for cultures and echocardiography themes.

Examiners also test **prophylaxis misconceptions**: routine dental prophylaxis for everyone is not the teaching focus—follow guideline-style stems. Medication items may include **long IV antibiotic courses**, **gentamicin monitoring**, or **warfarin interactions**—watch **renal function** and **ototoxicity** themes.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Classic presentation**: fever + **new murmur** + **embolic events** (stroke, limb ischemia, pulmonary infiltrates from septic emboli when tricuspid involvement in IVDU).
- **Labs**: **positive blood cultures** (often multiple bottles), **elevated inflammatory markers**, **anemia**, **renal dysfunction**; **echo** may show vegetations—**provider interpretation**.
- **Nursing priorities**: hemodynamic monitoring, **strict aseptic line care**, **neuro checks** for embolic stroke, **lung assessment** for HF, **temperature curve**, **pain control** without masking sepsis, **education** on hygiene and follow-up for long-term therapy.
- **Infection control**: follow **MRSA precautions** when indicated; protect **central lines** used for long-term antibiotics.
- **Medication safety**: long courses of **nephrotoxic** or **ototoxic** agents require **renal monitoring** and **symptom surveillance**; teach clients to **report** tinnitus, hearing changes, or decreased urine output when those themes appear.

**Exam trap:** Choosing **discharge teaching** before **stabilizing fever**, **hypotension**, or **new neurologic deficit**—always match priority to acute risk.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 34-year-old client who injects drugs **reports fevers and chills** for a week. Temperature is **39.2°C**, HR **118**, BP **108/64**. You hear a **new harsh murmur** and notice **tender red nodules** on finger pads. Two peripheral IV sites are inflamed.

**Fork:** Suspect **IE with sepsis risk**—**obtain blood cultures per protocol** (often 2–3 sets from separate sites), **notify provider**, **avoid contaminating cultures**, and **prepare for echocardiography** themes. Do **not** delay assessment with routine paperwork or ambulation.

If neuro deficits appear, add **stroke precautions** and **urgent escalation**—embolic phenomena change the urgency timeline.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Cultures first** when feasible—starting broad antibiotics before cultures can obscure the microbiologic diagnosis unless **unstable sepsis** forces earlier therapy per protocol and provider orders.
- **New murmur + fever + risk factors** (IVDU, recent dental work, prosthetic valve, central lines) should trigger **objective escalation**: cultures, **hemodynamic monitoring**, and **clear communication**—not reassurance alone.
- **Embolic complications** (stroke, limb ischemia, pulmonary septic emboli) change **priority**—protect **airway and perfusion**, complete **neuro checks**, and **notify** the team early.
- **Long-term IV antibiotics** require **line stewardship** (dressing integrity, hub scrubbing, **infection signs**), scheduled **labs**, and **patient education** on when to seek emergency care for **fever** or **bleeding**.

**NCLEX drill:** If two answers both sound “infectious,” pick the one that **secures diagnosis/communication** (cultures, monitoring, escalation) before the one that focuses on **routine comfort** or **education** during instability.

**Related:** [pericarditis ECG](LESSON:pericarditis-ecg-clues) · [infective endocarditis NCLEX](LESSON:infective-endocarditis-nclex-rn) · [cardiac tamponade](LESSON:cardiac-tamponade-nclex-rn) · [isolation precautions](LESSON:isolation-precautions-in-practice) · [Canada hub](/canada/rn/nclex-rn/lessons) · [US hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "pericarditis-ecg-clues": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Acute pericarditis** is **inflammation of the pericardium**, classically producing **sharp pleuritic chest pain** that **improves leaning forward** and may accompany a **pericardial friction rub**. On ECG, **diffuse ST elevation** with **PR depression** (often best seen in lead II) is a high-yield pattern—distinct from **STEMI**, which usually shows **regional ST changes** corresponding to a coronary territory.

Nursing integration includes **serial ECG monitoring**, **pain assessment**, **differentiating pericarditis from ACS**, **watching for pericardial effusion** (new hypotension, rising JVD, pulsus paradoxus themes → possible **tamponade**), and **medication teaching** (NSAIDs, colchicine, gastric protection) **per orders**.

Connect to [cardiac tamponade](LESSON:cardiac-tamponade-nclex-rn), [ACS](LESSON:acute-coronary-syndrome-nclex-rn), and [MI troponin](LESSON:acute-myocardial-infarction-troponin) when boards blur chest-pain differentials.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners test **ECG discrimination**: diffuse ST elevation + PR depression suggests **pericarditis**; **regional ST elevation** with reciprocal changes suggests **AMI**. They also test **escalation**: if the client develops **tamponade physiology**, answers shift to **urgent evaluation** (echo/pericardiocentesis themes), not “more NSAIDs alone.”

Boards may include **post-MI Dressler** or **viral** pericarditis stories—your job is **monitoring** and **clear reporting** of **new hemodynamic changes**. Avoid choosing **vigorous exercise** or **ignoring pleuritic pain** as “anxiety” without assessment.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Symptoms**: pleuritic pain, positional change, fever viral prodrome; **friction rub** may be transient—serial auscultation when ordered.
- **ECG**: diffuse concave ST elevations; PR depression; can evolve—**serial tracings** matter when ordered.
- **Labs**: troponin may be mildly elevated with **myopericarditis**—interpret with cardiology; **ESR/CRP** may support inflammation when shown.
- **Management themes (order-driven)**: NSAIDs, colchicine, rest; **avoid anticoagulation** when large effusion/tamponade risk unless carefully managed—follow stem.
- **Nursing care**: position comfort (often **leaning forward**), monitor **vitals**, **SpO₂**, **fluid balance** if HF complicates, **GI protection** with NSAIDs when ordered.

**Differentiation cue:** Pleuritic + **positional** pain with **diffuse ECG** changes points away from single-vessel STEMI patterns unless coexisting disease.

**Nursing focus:** trend **pain**, **vitals**, and **ECG**; teach **NSAID GI protection** when ordered; watch for **pericardial friction rub** coming/going; document **position** and **oxygen** response.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 29-year-old client **reports sharp chest pain** worse when lying flat and better when **sitting forward**. ECG shows **diffuse ST elevation** and **PR depression**. BP is **118/76**, HR **96**, SpO₂ **97%**.

**Fork:** Manage as **acute pericarditis pathway** until cardiology clears—**notify provider**, **obtain serial ECGs** per order, **monitor for effusion signs** (new hypotension, JVD, muffled sounds), and **avoid strenuous activity** themes. Do not assume **STEMI** without territory-consistent changes unless the stem supports ACS.

If **hypotension and JVD** develop, pivot thinking toward **tamponade** and **escalate** per policy.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Diffuse ST elevation + PR depression** is the classic **pericarditis** ECG pattern—contrast with **regional ST changes** that suggest **coronary occlusion** patterns in ACS items.
- **Worsening hemodynamics** (hypotension, rising JVD, muffled heart sounds, new **pulsus paradoxus** themes) should trigger **tamponade suspicion**—urgent imaging and escalation, not “wait for rounds.”
- **Serial monitoring** beats a single ECG snapshot: repeat **vitals**, **pain pattern**, and **ECG** when symptoms evolve—boards love “returned with worse pain” stems.
- **Patient education after stabilization** includes activity limits while inflamed, **medication adherence**, and **warning symptoms** that require emergency re-evaluation.

**NCLEX drill:** If the stem offers **NSAIDs/colchicine** versus **immediate cath lab**, match the **ECG story**—diffuse changes without territory ST elevation usually steers away from **STEMI activation** unless concurrent ACS is supported.

**Related:** [endocarditis cultures](LESSON:endocarditis-blood-cultures) · [cardiac tamponade](LESSON:cardiac-tamponade-nclex-rn) · [ACS](LESSON:acute-coronary-syndrome-nclex-rn) · [PE](LESSON:pulmonary-embolism-nclex-rn) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "dvt-pe-nursing-priorities": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Deep vein thrombosis (DVT)** is **thrombus formation** in deep veins—often **calf or proximal lower extremity**—with risk of **embolization** to the lungs as **pulmonary embolism (PE)**. Nursing priorities center on **recognizing symptoms**, **preventing extension/embolization**, **safe anticoagulation**, **bleeding precautions**, and **mobility planning** that matches orders (bed rest themes only when unstable—many stable clients ambulate with appropriate therapy).

High-yield risks include **immobility**, **surgery**, **malignancy**, **pregnancy/estrogen**, **thrombophilia**, and **prior VTE**. Your assessments pair **unilateral leg swelling**, **pain**, **warmth**, **Homans sign not relied upon alone**, with **respiratory findings** when PE is suspected.

Use [PE lesson](LESSON:pulmonary-embolism-nclex-rn), [immobility prophylaxis](LESSON:immobility-dvt-prophylaxis), and [shock](LESSON:shock-recognition-fluids) when massive PE appears.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `NCLEX tests **prevention** (SCDs, early ambulation, hydration when appropriate) and **acute management** (anticoagulation, **inferior vena cava filter** themes when anticoagulation is contraindicated—provider decision). Traps include **massaging a painful calf** (can dislodge clot), **delaying oxygen** in sudden dyspnea, or **choosing education** before stabilizing **hypoxia/hypotension**.

Items also probe **bleeding on anticoagulation**: gums, **hematuria**, **melena**, **head injury**—know **when to hold** and **who to notify** per policy.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **DVT signs**: unilateral edema, calf tenderness, erythema—compare sides; **D-dimer** in low-risk workups; **compression ultrasound** for diagnosis when indicated.
- **PE signs**: sudden dyspnea, pleuritic pain, tachycardia, hypoxia; **massive PE** → shock, RV strain—**escalate**.
- **Therapy themes**: anticoagulation (heparin bridging, DOACs, warfarin) per orders; **thrombolysis** in select massive PE—**provider-led**.
- **Nursing care**: **bleeding precautions**, **fall safety**, **avoid IM injections** when anticoagulated unless necessary, **TED/SCD** per orders, **early ambulation** when stable, **teach warning signs** for recurrent VTE.
- **Education**: **never stop anticoagulation** without provider guidance; recognize **PE red flags** (sudden dyspnea, pleuritic pain, hemoptysis, syncope) and **bleeding red flags** while on therapy.

**Exam habit:** If the stem pairs **sudden dyspnea** with **unilateral leg findings**, treat as **VTE spectrum** until imaging clears you.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** Five days after hip replacement, a client **reports new left calf pain** and **one-leg swelling**. The calf is **warm** and **3 cm larger** in circumference than the right. SpO₂ is **95%**, HR **104**.

**Fork:** **Do not massage the calf.** Initiate **provider notification**, **prepare for vascular imaging** per protocol, **apply bleeding precautions** if anticoagulation starts, and **monitor for PE symptoms** (sudden dyspnea, pleuritic pain). Avoid **ambulating alone** if unstable or pending evaluation—follow facility policy.

If **hypotension** or **syncope** develops, shift to **PE with shock** pathways—oxygen, monitoring, **rapid team activation** themes.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Unilateral leg pain/swelling** after surgery or immobility is **DVT** until evaluated—compare calves, measure if protocol allows, and **document objective findings**.
- **Never massage** a painful, swollen calf; **mobilize safely** only per orders when **high-risk PE** is still possible.
- **Sudden dyspnea + tachycardia + hypoxia** should trigger **PE precautions** in your mind: **oxygen**, **monitoring**, **notify provider**, **anticipate imaging**, and **bleeding-safe care** if anticoagulation begins.
- **Anticoagulation teaching** includes **bleeding precautions**, **head injury** urgency, **missed dose** instructions per pharmacy, and **when to seek emergency care** for recurrent **chest pain** or **neurologic changes**.

**NCLEX drill:** When the client is **unstable**, choose **assessment + activation** over **education**; when stable on therapy, choose **education + safety** over ignoring mild symptoms.

**Related:** [PE clues](LESSON:pulmonary-embolism-clues) · [pulmonary embolism lesson](LESSON:pulmonary-embolism-nclex-rn) · [DVT prevention](LESSON:deep-vein-thrombosis-dvt-prevention-and-nursing-management-nclex-rn) · [immobility prophylaxis](LESSON:immobility-dvt-prophylaxis) · [Canada hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "abg-interpretation-basics-hy": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Arterial blood gas (ABG)** interpretation links **ventilation** (CO₂ removal), **oxygenation** (PaO₂, SaO₂), and **metabolic** processes (HCO₃⁻, lactate) to **acid–base status** (pH). For NCLEX-RN, you need a **repeatable sequence**: confirm **temperature/ FiO₂ context** if the stem gives it, check **pH**, then decide whether the **primary** process is **respiratory** (PaCO₂) or **metabolic** (HCO₃⁻), and look for **compensation** or **mixed** disorders.

Nursing use is practical: ABGs guide **oxygen therapy**, **ventilator adjustments** (RT/provider), **bicarbonate therapy** controversies, and **recognizing deterioration** (rising lactate, worsening acidemia). You correlate numbers with **the patient**: work of breathing, mentation, perfusion, and underlying disease ([COPD](LESSON:copd-exacerbation-oxygen), [ARDS](LESSON:ards-ventilation-basics), [DKA](LESSON:dka-vs-hhs-priorities-hy)).

**Safety:** ABG draws require **arterial line or radial puncture** skills—follow scope; label samples correctly and **notify** critical values per policy.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Boards love **COPD + CO₂ retention**: avoid **over-oxygenating** chronic retainers when the stem shows **hypercapnia** and **acidosis**—titrate to **ordered SpO₂ targets** rather than 100% in every vignette. Another pattern is **metabolic acidosis** with **anion gap** in **DKA**—insulin and fluids drive management, not “bicarbonate for every low pH.”

Examiners also test **interpretation speed**: **respiratory acidosis** with **acute HCO₃⁻** normal suggests **acute hypoventilation**; **chronic** COPD may show **compensated** patterns. Choose answers that **match the dominant disorder** and **treat the cause** (airway, ventilation, perfusion, toxin, renal failure).`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Oxygenation**: PaO₂; consider **Aa gradient** themes when advanced; **SpO₂** correlates but is not identical—carbon monoxide, poor perfusion, and motion can mislead.
- **Ventilation**: PaCO₂ **↑** = hypoventilation or **CO₂ retention**; **↓** = hyperventilation.
- **Acid–base quick map**: pH **↓** + PaCO₂ **↑** → respiratory acidosis; pH **↓** + HCO₃⁻ **↓** → metabolic acidosis; combine for **mixed** when both move against pH.
- **Compensation**: chronic respiratory disorders shift bicarbonate; metabolic disorders change PaCO₂ predictably—use stem trends, not memorized tables alone.
- **Clinical tie-in**: always ask **why** the ABG looks abnormal—**opioids** vs **asthma** vs **PE** vs **sepsis** change the plan.
- **Compensation check**: chronic respiratory acidosis often shows **elevated bicarbonate**; acute-on-chronic problems may look “mixed”—follow the stem’s timeline and prior baselines when provided.
- **Oxygen vs ventilation**: correcting **SpO₂** alone may be unsafe if **CO₂** is rising and **mentation** is declining—escalate to **noninvasive ventilation** themes when ordered.

**NCLEX habit:** State the **primary disturbance** in one sentence, then pick the intervention that fixes **that mechanism** first.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 68-year-old client with COPD has ABG: **pH 7.25**, **PaCO₂ 68 mmHg**, **HCO₃⁻ 30 mEq/L**. They are **somnolent**, using **accessory muscles**, and **SpO₂ 82%** on 2 L NC.

**Fork:** This is **acute-on-chronic respiratory acidosis** with **hypoxemia**—priority is **support ventilation and oxygen per protocol** (often **BiPAP** themes when ordered), **notify provider**, **avoid sedatives** that worsen CO₂ retention, and **repeat ABG** after interventions. Do not choose **discharge teaching** or **routine sleep** first.

If **pH is severely acidotic** with **rising PaCO₂** despite support, prepare for **escalation** (intubation themes)—communicate trends, not single points.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **ABG interpretation is a sequence**: confirm context (**FiO₂**, device, temperature if given), read **pH**, then identify whether **PaCO₂** or **HCO₃⁻** best explains the acid–base direction, then check for **compensation** or **mixed** disorders.
- **Oxygenation** (PaO₂/SpO₂) can be bad while **ventilation** (PaCO₂) is the primary threat—especially in **COPD exacerbation** with **rising CO₂** and **somnolence**.
- **COPD retainers**: titrate oxygen to **ordered SpO₂ targets**; reassess **mentation** and **ventilation** because **hyperoxia** without adequate **ventilation support** can worsen **hypercapnia** in select clients.
- **Repeat ABG** after meaningful changes to oxygen, ventilation mode, or clinical status—examiners reward **trend-based** decisions, not one-off numbers.

**NCLEX drill:** If **pH is acidotic** and **PaCO₂ is high**, your first thought is **ventilation failure** until the stem proves otherwise—choose **BiPAP/escalation** over “teach pursed-lip breathing” during acute failure.

**Related:** [mixed acid–base](LESSON:mixed-acid-base-patterns) · [COPD oxygen](LESSON:copd-exacerbation-oxygen) · [respiratory assessment](LESSON:respiratory-assessment-ngn) · [ARDS basics](LESSON:ards-ventilation-basics) · [US hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "copd-exacerbation-oxygen": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**COPD exacerbation** is an acute worsening of **dyspnea**, **cough**, and **sputum** (often infectious or pollutant-triggered) requiring therapy change. **Oxygen** is lifesaving for hypoxemia, but in **chronic CO₂ retainers**, **uncontrolled high FiO₂** can worsen **hypercapnia** and **acidosis** by **blunting hypoxic respiratory drive** in select clients—so boards test **titrate to target SpO₂** (often **88–92%** when specified) rather than reflexively maximizing SpO₂.

Nursing priorities: **assess work of breathing**, **oxygen titration per order**, **bronchodilator administration**, **steroids/antibiotics when ordered**, **early BiPAP** for **acute ventilatory failure** themes, and **monitoring mentation** for **CO₂ narcosis**.

Pair with [ABG basics](LESSON:abg-interpretation-basics-hy), [pneumonia oxygenation](LESSON:pneumonia-oxygenation), and [respiratory assessment](LESSON:respiratory-assessment-ngn).`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners punish **“100% non-rebreather for everyone”** when the stem shows **chronic CO₂ retention** and asks for **safest oxygen strategy**. They reward **ventilation support** (BiPAP) when **acidosis and rising PaCO₂** persist despite optimized medical therapy.

Traps include **sedating** an anxious COPD client without addressing **ventilation**, or **high-dose oxygen** without reassessment. Boards also test **infection recognition**: purulent sputum, fever—**antibiotics** when indicated per orders.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Assessment**: accessory muscles, **inability to speak in sentences**, **cyanosis**, **mental status** changes, **cough/sputum** character.
- **Oxygen**: titrate to **ordered SpO₂ range**; **reassess** after changes; coordinate with **RT** for high-flow/BiPAP when ordered.
- **Medications**: **SABA** (albuterol), **ipratropium** combinations, **systemic steroids**, **antibiotics** when bacterial exacerbation suspected—**times and interactions**.
- **Fluids**: cautious—some clients have **right heart strain**; follow hemodynamics in stem.
- **Education**: smoking cessation, **action plan** concepts, **when to seek care**—after stabilization.
- **Infection triggers**: increased **sputum purulence**, fever—antibiotics when indicated per orders; support **nutrition** and **energy conservation** during recovery.

**Exam anchor:** If **somnolence** rises with **rising CO₂** on ABG, **ventilation support** beats “more oxygen alone.”`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 71-year-old client with severe COPD **reports increasing dyspnea** over 24 hours and **cannot complete sentences**. On **4 L NC**, SpO₂ is **93%**, but they are **sleepy** and **difficult to arouse**. Repeat ABG shows **pH 7.22** and **PaCO₂ 78**.

**Fork:** This is **acute hypercapnic respiratory failure**—**notify provider**, **prepare for BiPAP** per order, **avoid sedatives**, and **continuous monitoring**. High-flow oxygen alone may **mask** the ventilation problem—follow protocol for **noninvasive ventilation** when indicated.

Do not prioritize **meal trays** or **ambulation** until ventilation and mentation improve.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **SpO₂ can look “okay”** while **CO₂ retention** and **acidosis** progress—pair oxygen saturation with **mentation**, **work of breathing**, and **ABG** when deterioration is suspected.
- **Targeted oxygen** in chronic retainers follows **ordered SpO₂ ranges** (often mid-high 80s–low 90s when specified)—avoid reflexive **maximal FiO₂** when the stem emphasizes **CO₂ narcosis** risk.
- **BiPAP** is a common rescue step for **acidotic hypercapnic** exacerbations: prioritize **provider notification**, **RT collaboration**, and **frequent reassessment** after initiation.
- **Bronchodilators + steroids + antibiotics (when indicated)** are part of the bundle, but **ventilation strategy** is what prevents intubation in many vignettes.

**NCLEX drill:** If the client is **sleepy** with **rising PaCO₂**, choose **ventilation support** over **sedation** for “anxiety” or **routine meals**.

**Closing:** Reassess **lung sounds**, **mental status**, and **ABG** after every major oxygen or ventilation change—boards reward **trend-based** decisions.

**Related:** [ABG basics](LESSON:abg-interpretation-basics-hy) · [asthma status](LESSON:asthma-status-asthmaticus) · [pneumonia oxygenation](LESSON:pneumonia-oxygenation) · [ARDS](LESSON:ards-ventilation-basics) · [US hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "asthma-status-asthmaticus": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Status asthmaticus** is **severe asthma** that persists despite initial bronchodilator therapy—approaching **respiratory failure**. Airway **inflammation** and **bronchospasm** produce **wheezing**, **accessory muscle use**, **tachypnea**, and sometimes a **silent chest** when air movement is critically reduced (a **red flag**).

Nursing priorities are **rapid assessment**, **repeated inhaled bronchodilators per protocol**, **systemic corticosteroids early**, **oxygen**, **preparedness for magnesium sulfate** or **mechanical ventilation** in life-threatening cases, and **calm coaching** that does not replace objective monitoring.

**Overview for exam use:** treat status asthmaticus as **airway + breathing first**: frequent **vitals**, **SpO₂**, **lung sound** reassessment, and **preparedness to escalate** when **fatigue** appears—because **normalizing wheezing** can mean **worsening obstruction**, not improvement.

Differentiate from [COPD](LESSON:copd-exacerbation-oxygen) (often older smoker, chronic symptoms) though overlap exists—follow the stem’s age and history.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Boards test **silent chest** as impending arrest—**escalate**, not reassurance. They test **medication sequencing**: **continuous nebs** vs **intermittent** per protocol, **steroids early**, **epinephrine** in anaphylaxis overlap when indicated.

Traps: **sedating** the anxious asthmatic, **beta blockers** that worsen bronchospasm when contraindicated, or **discharging** while still **tachypneic** with **accessory muscle use**.

**Clinical application pattern:** choose **oxygen + bronchodilators + steroids** and **activation** before **education**; choose **RSI/airway** themes when **impending arrest** signs appear.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Severity signs**: inability to speak, **RR > 30**, **SpO₂ < 92%** on initial oxygen, **silent chest**, **cyanosis**, **altered mentation**, **rising PaCO₂** (late sign of fatigue).
- **Therapies**: high-dose **SABA**, **ipratropium**, **systemic steroids**, **oxygen**; **magnesium sulfate** IV for severe bronchospasm per orders; **intubation** when exhaustion—**prepare airway supplies**.
- **Monitoring**: **peak flow** when appropriate in stable settings; in acute severe, focus on **vitals**, **lung sounds**, **ABG** if deterioration.
- **Education after stabilization**: trigger avoidance, **inhaler technique**, **written asthma action plan** concepts.
- **Safety**: avoid **sedatives** that reduce respiratory drive during acute bronchospasm unless airway is protected and ordered; watch for **tremor/tachycardia** from beta-agonists and communicate **worsening perfusion**.

**Exam rule:** If the client is **fatiguing** with rising CO₂, **noninvasive ventilation** may be contraindicated or limited—follow advanced airway themes in the stem.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 22-year-old client with asthma **reports severe wheezing** and **cannot speak in full sentences**. Lung sounds are **barely audible** bilaterally (“**silent chest**”). HR **130**, RR **36**, SpO₂ **88%** on **RA**.

**Fork:** Treat as **life-threatening asthma**—**high-flow oxygen per protocol**, **continuous bronchodilator therapy per order**, **early steroids**, **notify provider/rapid response**, **prepare for escalation** to **BiPAP or intubation** when indicated. **Never** leave this client unattended to finish charting elsewhere.

**Clinical application detail:** Establish **continuous monitoring**, keep **airway supplies** available, repeat **lung sound** and **work of breathing** checks frequently, and **document objective trends** (RR, SpO₂, accessory muscle use, mentation). If a **repeat ABG** is ordered and **PaCO₂ rises** while the client fatigues, escalate toward **advanced airway** per policy rather than “watchful waiting.”

If **hypotension** or **bradycardia** appears, anticipate **impending arrest**—**emergency airway** themes.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Silent chest** is an **emergency pattern**: airflow may be so limited that **wheezing disappears**—do not interpret that as improvement.
- **Rising fatigue**, **rising PaCO₂**, or **altered mentation** signals **impending respiratory arrest**—escalate beyond nebulizers alone per protocol.
- **Systemic steroids early** are central in severe exacerbation; inhaled monotherapy is insufficient for **status** presentations in exam vignettes.
- **Continuous therapy** and **frequent reassessment** beat one-time treatments when the client cannot speak, is using **accessory muscles**, or has **persistent hypoxia**.

**NCLEX drill:** If the stem offers **reassurance** versus **rapid response**, pick **rapid response** when **silent chest** + **hypoxia** coexist.

**Related:** [respiratory assessment](LESSON:respiratory-assessment-ngn) · [COPD oxygen](LESSON:copd-exacerbation-oxygen) · [shock](LESSON:shock-recognition-fluids) · [pneumonia oxygenation](LESSON:pneumonia-oxygenation) · [Canada hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "ards-ventilation-basics": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Acute respiratory distress syndrome (ARDS)** is **non-cardiogenic pulmonary edema** from **diffuse alveolar damage**—common triggers include **sepsis**, **aspiration**, **pancreatitis**, **trauma**, and **massive transfusion**. It produces **severe hypoxemia** often refractory to **high-flow oxygen**, with **bilateral infiltrates** on imaging and **low PaO₂/FiO₂ ratios** when tested.

**Mechanical ventilation** strategies in teaching emphasize **lung-protective ventilation**: **low tidal volumes**, **plateau pressure** limits, **PEEP** titration themes, and sometimes **proning** for refractory hypoxemia—**RT and provider driven**. Nursing integrates **sedation/agitation** monitoring, **DVT prophylaxis**, **stress ulcer prophylaxis when ordered**, **aspiration precautions**, and **strict I&O**.

Link to [pneumonia oxygenation](LESSON:pneumonia-oxygenation), [sepsis recognition](LESSON:sepsis-early-recognition-hy), and [ABG](LESSON:abg-interpretation-basics-hy).`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Boards test **nursing scope around ventilators**: you **do not** independently change **FiO₂ or tidal volume** outside standing orders—**collaborate with RT** per protocol. They test **ARDS recognition**: worsening oxygenation despite oxygen, **bilateral crackles**, **non-cardiac** fluid picture.

Traps: **fluid boluses** for “hypotension” when the problem is **non-cardiogenic pulmonary edema**—follow **sepsis vs ARDS** story in stem. Another trap is **high tidal volumes** causing **barotrauma**—choose **lung protection** language when asked what matters.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Clinical picture**: **refractory hypoxemia** despite escalating oxygen, **work of breathing** may be masked if intubated—rely on **SpO₂ trends**, **ABG**, and **ventilator data** when available.
- **Ventilation themes (exam-level)**: **lung-protective** low tidal volumes, **plateau pressure** limits, **adequate PEEP** for recruitment, **prone positioning** for refractory hypoxia when ordered—**RT/provider decisions**.
- **Monitoring**: continuous **SpO₂**, serial **ABG** per orders, **peak/plateau pressures**, **minute ventilation**, and **alarm** investigation (disconnection, mucus plug, bronchospasm, pneumothorax themes).
- **Hemodynamic support**: many clients need **vasopressors** for sepsis—**fluids** are not automatically “always correct” when **non-cardiogenic edema** dominates; follow **sepsis bundles** and **dynamic assessment** in the stem.
- **Complications to anticipate**: **ventilator-associated pneumonia**, **barotrauma**, **O₂ toxicity** with prolonged **FiO₂**, **ICU weakness**, **delirium**, **stress ulcer** risk—address with **bundled nursing care** when ordered.

**Exam cue:** If FiO₂ is **maxed** and SpO₂ is still poor, think **escalation pathways** (prone, inhaled pulmonary vasodilator themes, referral for **ECMO** in specialty stems)—not unsafe tidal-volume increases outside protocol.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 54-year-old client with **septic shock** **reports** worsening **breathlessness** even though they are intubated and receiving **mechanical ventilation**. On your **assessment**, **FiO₂** is **80%** but **SpO₂** remains **86%**; breath sounds are **coarse bilaterally** with **copious secretions**. **Vital signs** show HR **112** and BP **98/58** on a **norepinephrine** infusion.

**Fork:** This matches **severe ARDS physiology**—**notify RT and the provider**, **prepare for proning** per protocol, **suction** as indicated, and **avoid fluid overload** unless sepsis **resuscitation targets** clearly require volume. **Do not** silence ventilator alarms without checking **ETT position**, **circuit integrity**, and **hemodynamic trends**.

**Priority nursing actions** include continuous **oxygenation monitoring**, accurate **I&O**, **sedation assessment** per orders, and a concise **SBAR** update when **oxygenation fails to improve** despite increasing support.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **ARDS** = **oxygen-refractory** hypoxemia with an **inflammatory** diffuse lung injury pattern—do not mistake it for routine pneumonia or “just turn up oxygen.”
- **Ventilator management** is **interprofessional**: nurses **monitor trends and alarms**; **RT and providers** adjust settings per protocol—avoid independent tidal-volume or FiO₂ tweaks outside orders.
- **Bundles** (elevation, oral care, **VAP prevention**, DVT prophylaxis when ordered) are classic exam themes because they reduce **avoidable harm** during long ICU stays.

**NCLEX synthesis:** Before you pick an answer, name whether the primary problem is **oxygenation failure**, **ventilation failure**, **hemodynamic collapse**, or **a line/tube issue**—ARDS items often hide the correct fork inside **alarm** or **sudden desaturation** data.

**Related:** [pneumonia oxygenation](LESSON:pneumonia-oxygenation) · [sepsis early recognition](LESSON:sepsis-early-recognition-hy) · [shock](LESSON:shock-recognition-fluids) · [ABG basics](LESSON:abg-interpretation-basics-hy) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "pneumonia-oxygenation": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Pneumonia** is **lower respiratory tract infection** with **consolidation** on exam/imaging—community-acquired, hospital-acquired, or ventilator-associated patterns appear on boards. **Oxygenation** problems arise from **shunt** and **V/Q mismatch**; nursing priorities are **adequate oxygen delivery**, **airway clearance**, **antibiotic timing per orders**, **culture data before antibiotics when stable**, and **monitoring for sepsis** ([sepsis lesson](LESSON:sepsis-early-recognition-hy)).

Older adults may show **confusion** or **tachypnea** without fever—maintain a **low threshold** for escalation. Pair with [COPD](LESSON:copd-exacerbation-oxygen) when overlap complicates oxygen targets.

**Introductory frame:** pneumonia questions often hide severity in **“stable vitals”**—still watch **work of breathing**, **oxygen response**, and **new confusion** as triggers for escalation.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners test **priority**: **oxygen + monitoring + antibiotics** (when ordered) before **discharge teaching** in acute illness. They test **aspiration precautions** in stroke or GERD clients—**positioning**, **swallow screens**, **oral care**.

Vaccination themes (pneumococcal, influenza) appear as **prevention** items for **stable** clients, not during acute respiratory failure.

**Clinical application emphasis:** when **sepsis** is possible, **time-sensitive antibiotics** and **source control thinking** beat routine tasks—follow the stem’s severity cues.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Assessment**: fever, productive cough, pleuritic pain, **tachypnea**, **crackles/egophony** when tested, **hypoxemia**.
- **Diagnostics**: CXR infiltrates, **procalcitonin** themes optional, **blood cultures** in severe disease per protocol, **sputum culture** when producible.
- **Oxygen**: device selection by severity; **reassess** after changes; watch **CO₂** in COPD comorbidity.
- **Nursing care**: **incentive spirometry** when appropriate, **mobility** as tolerated, **IS/turn/cough**, **hydration** unless contraindicated, **sepsis surveillance**.
- **Isolation**: follow **respiratory precautions** per policy when **TB** or other airborne concerns are in the differential—communicate **travel/exposure** history when relevant to the stem.

**Exam habit:** If **hypotension + pneumonia**, move to **sepsis bundle** thinking—**lactate**, **blood cultures**, **broad antibiotics** timing.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** An 80-year-old client **reports increased confusion** and **tachypnea** to 28; temperature **38.1°C**. Lung exam shows **crackles** in the right base; SpO₂ **89%** on **RA**.

**Fork:** **Apply oxygen per protocol**, **notify provider**, **obtain orders for CXR and labs**, and **monitor closely for sepsis**. Do not attribute confusion solely to “dementia” without treating **acute hypoxia/infection**.

If **hypotension** develops, escalate to **septic shock** pathways with **fluid resuscitation** per orders and **antibiotic urgency** themes.

**Clinical application expansion:** Continue **frequent reassessment** after oxygen starts: repeat **SpO₂**, **respiratory rate**, **blood pressure**, and **mental status**; prepare **sputum** samples only when productive and per orders; coordinate **incentive spirometry** when the client is stable enough to participate safely.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Altered mentation + new respiratory findings** in older adults should be treated as **acute illness first**—hypoxia and infection can mimic or worsen baseline cognitive changes.
- **Oxygen** should be titrated and **reassessed**; **antibiotics** belong in the plan when bacterial pneumonia is likely—**culture strategy** follows severity and protocol.
- **Sepsis surveillance** means trending **vitals**, **labs**, **urine output**, and **perfusion**—not a single “normal enough” SpO₂ snapshot.
- **Teaching and discharge planning** come after **stabilization**; during deterioration, prioritize **assessment + escalation**.

**NCLEX drill:** If the client is **tachypneic** and **hypoxemic**, eliminate answers that prioritize **routine hygiene** or **family phone calls** before **oxygenation and provider communication**.

**Related:** [sepsis recognition](LESSON:sepsis-early-recognition-hy) · [TB isolation](LESSON:tb-isolation-compliance) · [respiratory assessment](LESSON:respiratory-assessment-ngn) · [COPD oxygen](LESSON:copd-exacerbation-oxygen) · [hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "pulmonary-embolism-clues": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `This lesson compresses **high-yield PE clues** for exam speed: **sudden dyspnea**, **pleuritic chest pain**, **tachycardia**, **hypoxemia**, **unilateral leg findings** suggesting **DVT**, and **risk factors** (surgery, immobility, malignancy, estrogen, prior VTE). **Massive PE** adds **hypotension**, **syncope**, **RV strain** on ECG or biomarkers—**obstructive shock** physiology.

Nursing role is **recognition**, **oxygen**, **monitoring**, **activation of diagnostics**, **bleeding-safe anticoagulation** when ordered, and **clear handoffs**. You are not interpreting CTPA independently, but you **must not ignore** a classic story.

Cross-link [pulmonary embolism NCLEX](LESSON:pulmonary-embolism-nclex-rn) and [DVT/PE priorities](LESSON:dvt-pe-nursing-priorities) for the full management frame.

**Overview:** PE items reward connecting **risk** (immobility, surgery, estrogen, cancer, prior VTE) with **acute hypoxia/tachycardia** and **leg asymmetry**—then choosing **safe stabilization** and **timely communication**.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Boards use **PE mimics**—**ACS**, **pneumothorax**, **anxiety**—to test whether you anchor to **risk + acute change**. The best answers **stabilize oxygenation**, **monitor**, and **activate evaluation** rather than reassurance alone.

They also test **contraindications to anticoagulation** (active bleeding, recent surgery nuances)—**IVC filter** themes appear as **provider decisions**.

**Clinical application:** “first action” items often hinge on **oxygen + monitoring + notify** versus **routine tasks**—choose the option that **reduces harm fastest** when instability is evolving.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Wells/PE decision rules** may appear as background—follow the stem’s risk stratification.
- **D-dimer** in **low-risk** clients; **CTPA** when **high suspicion**—don’t anchor on a “normal” D-dimer if pretest probability is high (follow item).
- **Treatment**: anticoagulation when not contraindicated; **thrombolysis** for **massive PE** with hemodynamic compromise—**protocol**.
- **Nursing**: **continuous telemetry** when unstable, **bleeding precautions**, **avoid IM injections**, **early mobility** when safe on therapy.
- **Massive PE**: think **obstructive shock** physiology—**hypotension**, **RV strain** clues—prioritize **resuscitation** and **urgent team activation** per orders.

**Memory:** **Unilateral leg swelling + dyspnea** = **VTE** until cleared.

**Additional depth:** When boards add **pregnancy**, **malignancy**, or **recent travel**, treat those as **risk amplifiers**—your nursing story still centers on **recognition**, **oxygenation**, **monitoring**, **timely communication**, and **bleeding-safe anticoagulation** when ordered.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 45-year-old postoperative client **reports a sharp pleuritic pain** and **sudden shortness of breath** walking to the bathroom. HR **118**, BP **122/70**, SpO₂ **91%** on **RA**, and the **right calf is swollen** compared with the left.

**Fork:** **High suspicion for PE**—**oxygen**, **bed rest per protocol**, **notify provider**, **anticipate imaging**, **avoid massage** to the calf, and **continuous monitoring** for **hypotension**. Do not send them **alone** to radiology if unstable—follow facility escort policies.

If **BP collapses**, switch to **massive PE** resuscitation themes—**small fluid boluses** may help select clients but **thrombolysis** decisions are provider-led.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Postoperative** clients with **new unilateral leg swelling** plus **acute dyspnea** should trigger **VTE suspicion**—treat oxygenation and monitoring as immediate priorities.
- **Oxygen** and **continuous assessment** come before **reassurance**; **anticoagulation** begins only when **contraindications** are considered—follow orders and policy.
- **Never massage** a swollen painful calf when **DVT/PE** is possible—reduce **mobility risk** per protocol until evaluated.
- **Massive PE** can present with **hypotension** and **RV failure** patterns—know escalation and **resuscitation** themes versus stable submassive presentations.

**NCLEX drill:** When two answers both mention **CTPA**, pick the one that also **stabilizes the client** (oxygen, monitoring, escalation) if the stem shows **hypoxia** or **hypotension**.

**Related:** [PE main lesson](LESSON:pulmonary-embolism-nclex-rn) · [DVT/PE priorities](LESSON:dvt-pe-nursing-priorities) · [shock](LESSON:shock-recognition-fluids) · [immobility prophylaxis](LESSON:immobility-dvt-prophylaxis) · [US hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },
};
