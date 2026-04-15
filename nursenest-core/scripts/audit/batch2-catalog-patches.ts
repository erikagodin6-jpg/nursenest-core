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

Connect hemodynamic monitoring to [shock recognition](LESSON:shock-recognition-fluids), [heart failure priorities](LESSON:heart-failure-nursing-priorities-hy), and [pulmonary embolism](LESSON:pulmonary-embolism-nclex-rn) when mixed shock pictures appear.`,
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
        body: `**Patient vignette.** A 70-year-old client with a **PA catheter** has the head of bed raised from **flat to 45°** for breathing comfort. Their **PAOP** suddenly looks “better,” but urine output falls and blood pressure drifts down.

**Fork:** Before charting “improved filling pressures,” **re-level the transducer** to the phlebostatic reference at the new torso position and confirm the waveform. A falsely low wedge from **height error** can prompt **inappropriate diuresis** or **fluid restriction** when the client actually needs different therapy. Pair numbers with **exam** (lung sounds, perfusion, lactate trends if available) and **notify** the provider with the **measurement method** included.`,
      },
      {
        id: "exam_tips",
        heading: "Exam tips",
        kind: "exam_tips",
        body: `Classic items ask: “readings are inconsistent after repositioning—what should the nurse do first?” The defensible answer is **re-level/re-zero** per protocol, not bolus fluids blindly or silence alarms. Another trap is choosing **routine bathing** while **damped waveforms** suggest **line failure**—fix **measurement integrity** first.

**Takeaways:** memorize the **landmark** as a safety anchor; narrate **position + transducer height** whenever you call a provider about invasive numbers; avoid treating a **single snapshot** without trend context. **Related lessons:** [ABG basics](LESSON:abg-interpretation-basics-hy) · [ARDS ventilation basics](LESSON:ards-ventilation-basics) · [fluid balance acute care](LESSON:fluid-balance-acute-care) · [US RN hub](/us/rn/nclex-rn/lessons).`,
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

This lesson complements the deeper **US RN pulmonary embolism** article where present; here the focus is **exam-style forks** and **nursing surveillance** without independent prescriber decisions. Use [DVT/PE priorities](LESSON:dvt-pe-nursing-priorities) and [fluid resuscitation judgment](LESSON:shock-recognition-fluids) when instability appears.`,
      },
      {
        id: "core",
        heading: "Core concepts",
        kind: "core",
        body: `- **Presentation spectrum**: sudden **dyspnea**, **pleuritic chest pain**, **tachycardia**, **hypoxia**; massive PE may add **hypotension**, **syncope**, or **RV failure** signs.
- **Labs/imaging (stem-dependent)**: **D-dimer** in low-risk workups; **CT pulmonary angiography** when suspicion is high; **V/Q scan** in select contraindications; **troponin/BNP** may rise with RV strain—integrate, do not fixate on one value.
- **Therapy themes**: **anticoagulation** when not contraindicated; **thrombolysis** in selected **unstable** massive PE per protocol; **IVC filter** themes when anticoagulation cannot be used—**provider decisions**.
- **Nursing care**: **SpO₂** and **work of breathing**, **bleeding checks** on anticoagulants, **fall/head injury precautions**, **early ambulation** when safe, **TED/SCD** per orders, and **teaching** on warning signs after discharge when applicable.`,
      },
      {
        id: "clinical_application",
        heading: "Clinical application",
        kind: "clinical_application",
        body: `**Patient vignette.** A 38-year-old postpartum client on estrogen therapy reports **sudden pleuritic pain** and **dyspnea** after a long car ride. They are **tachycardic** to 120s with **SpO₂ 90%** on room air and unilateral **calf swelling**.

**Fork:** Treat as **high-acuity** until evaluated—**oxygen per order**, **continuous monitoring**, **notify provider**, **anticipate imaging**, and **avoid ambulating** them alone. Do not offer **massage** to the painful calf. Document **risk factors** objectively and reassess frequently for **hypotension** or **altered mentation** suggesting massive PE.`,
      },
      {
        id: "exam_tips",
        heading: "Exam tips",
        kind: "exam_tips",
        body: `Traps include **minimizing new dyspnea** after immobility, **choosing education** before **stabilizing oxygenation**, or **delegating** the unstable assessment away from the RN. Boards also test **bleeding + anticoagulation**: gum bleeding, **hematuria**, or **head strike** after starting therapy—know escalation pathways.

**Takeaways:** pair **risk + acute cardiopulmonary change** with **urgent evaluation**; teach **leg swelling + breathlessness** as a **single story**; link out to [atrial fibrillation stroke prevention](LESSON:atrial-fibrillation-nclex-rn) when overlapping arrhythmia items appear. **Related:** [ACS](LESSON:acute-coronary-syndrome-nclex-rn) · [COPD oxygen](LESSON:copd-exacerbation-oxygen) · [pathway hub](/canada/rn/nclex-rn/lessons).`,
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

Your job is to **sequence safely**: confirm **airway patency**, **adequate breathing effort and rate**, then **circulatory adequacy** before teaching or discharge tasks. Use **objective trends** (work of breathing, SpO₂, mental status, skin color) rather than a single number. Connect oxygen decisions to [COPD CO₂ retention themes](LESSON:copd-exacerbation-oxygen) and [ARDS basics](LESSON:ards-ventilation-basics) when the stem hints at complexity.`,
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
- **Safety**: verify **orders** for high-flow/modalities you are not trained to titrate independently; **call RT** per protocol when ventilator or advanced airway issues arise.`,
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

**Takeaways:** pair **SpO₂ + work of breathing + mentation**; document **position**, **oxygen device**, and **response to therapy**; use [respiratory infection hubs](LESSON:pneumonia-oxygenation) and [PE clues](LESSON:pulmonary-embolism-clues) when differential diagnosis matters. **Related:** [ABG basics](LESSON:abg-interpretation-basics-hy) · [asthma status](LESSON:asthma-status-asthmaticus) · [US RN lesson hub](/us/rn/nclex-rn/lessons).`,
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

Traps include **delaying the ECG** for “comfort first,” **routine NSAIDs** that worsen cardiac risk, or **ambulating** a client with unstable vitals to the bathroom.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **STEMI vs NSTEMI framing**: ST elevation → emergent reperfusion pathway when shown; NSTEMI/unstable angina → risk stratification and timed management—follow the stem’s clues.
- **Troponin**: rises over hours; **serial draws** may be ordered—pair with **symptoms** and **ECG**.
- **Complications to monitor**: **VF/VT**, **brady blocks**, **acute MR** murmur, **pericarditis** pain, **reinfarction**, **cardiogenic shock** (hypotension, cool clammy skin, oliguria).
- **Nursing actions**: continuous **telemetry**, **pain reassessment**, **bleeding checks** post-PCI, **groin/radial site** monitoring, **renal protection** themes around contrast, and **patient education** on new antiplatelet regimens when applicable.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 59-year-old client reports **crushing substernal pressure** radiating to the **left arm**, diaphoretic, **HR 104**, BP **160/92**. First troponin is **borderline** but **ST depressions** appear in lateral leads.

**Fork:** Treat as **ACS** until cleared—**continuous monitoring**, **notify provider**, **prepare for serial troponins and repeat ECG**, **avoid solo ambulation**, and follow **oxygen** orders for SpO₂. Choose **assessment + activation** over discharge instructions or routine meals.`,
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

“Large volume bolus” is only correct when **hemorrhage** or **septic hypovolemia** is supported—not for every hypotensive client.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Early sepsis**: fever/hypothermia, tachycardia, tachypnea, glucose elevation, altered mentation—activate sepsis bundles per facility.
- **Anaphylaxis**: airway swelling, urticaria, bronchospasm—**epinephrine IM** is first-line in teaching; position supine with legs elevated unless breathing dictates otherwise.
- **Neurogenic shock**: bradycardia + warm skin after spinal injury themes—distinct from spinal shock management nuances in specialty items.
- **Monitoring**: **MAP goals** when ordered, **urine output**, **repeat lactate** themes, **antibiotic timing** in sepsis.
- **Fluids**: isotonic crystalloids common in sepsis; **reassess lung sounds and perfusion** after boluses.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** After a motor vehicle collision, a 41-year-old client is **tachycardic**, **cool and mottled**, with **MAP 58** despite **two crystalloid boluses**. Lungs are clear, but **neck veins are flat** and **FAST** imaging is pending.

**Fork:** This suggests **ongoing hemorrhagic shock**—escalate to **massive transfusion protocol themes**, **prepare blood products per order**, **keep warming measures**, and **avoid** “just one more liter” without surgical consultation when bleeding is uncontrolled. Communication and **repeat assessments** beat isolated tasks.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Shock type** changes fluid safety—**obstructive** and **cardiogenic** patterns punish blind boluses.
- **Reassess after every intervention**: lungs, perfusion, mentation, urine.
- **Exam synthesis:** When the stem offers **fluids vs pressors vs procedures**, match the **dominant mechanism** (loss vs maldistribution vs pump failure vs obstruction) before you pick an option that “sounds resuscitative” but widens an existing injury (for example, fluids in **tamponade** or **acute severe HF** without orders).

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

Medication items may include **nitroprusside/nicardipine/labetalol** themes as **provider-managed** infusions—your role is **monitoring**, **line safety**, and **reporting adverse trends**.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Emergency signs**: acute pulmonary edema with hypoxia, neurologic deficits, tearing chest pain radiating to the back (dissection suspicion), acute kidney injury with hypertensive retinopathy themes.
- **Urgency**: very high BP with **mild headache** but **no** end-organ findings—oral meds + follow-up.
- **Nursing monitoring**: **q5–15 min** vitals during titration when ordered, **continuous telemetry**, **strict I&O**, **neuro checks**, **fetal monitoring** in pregnancy when applicable.
- **Patient education**: medication adherence, home BP logs, sodium intake—after stabilization.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 48-year-old client presents with **BP 220/130**, **thunderclap headache**, **neck stiffness**, and **new left-sided weakness**.

**Fork:** This is **neurovascular emergency** until proven otherwise—**activate stroke protocol themes**, **notify provider immediately**, **prepare for imaging**, and **avoid** unsupervised ambulation or **eating** before airway assessment. BP management follows **stroke pathway rules** in the stem—do not apply generic “lower fast always.”`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Organ injury** defines emergency—not the number alone.
- **Gradual vs rapid** lowering is diagnosis-dependent—follow the vignette.
- **Synthesis:** Build a quick **organ scan** from the stem—**neuro** (focal deficits, headache), **pulmonary** (crackles, hypoxia), **renal** (oliguria, creatinine), **pregnancy** (fetal status), **vascular** (tearing pain)—because each changes the acceptable pace of BP reduction and the monitoring bundle you prioritize.

**Related:** [AFib](LESSON:atrial-fibrillation-rate-control) · [endocarditis](LESSON:endocarditis-blood-cultures) · [renal case studies in hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },
};
