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

Boards also test **postoperative bleeding** pathways: a sudden **cessation of chest tube output** with instability can be **clot obstruction**, not improvement—communicate early. **Takeaways:** tie **neck veins + BP + heart sounds + procedure context** into one working diagnosis; pick **escalation + monitoring** over isolated comfort measures; rehearse **SBAR** with objective numbers. **Related lessons:** [pericarditis ECG clues](LESSON:pericarditis-ecg-clues) · [shock recognition](LESSON:shock-recognition-fluids) · [heart failure priorities](LESSON:heart-failure-nursing-priorities-hy) · [pathway hub](/canada/rn/nclex-rn/lessons).`,
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

**Takeaways:** memorize the **landmark** as a safety anchor; narrate **position + transducer height** whenever you call a provider about invasive numbers; avoid treating a **single snapshot** without trend context. **Related lessons:** [ABG basics](LESSON:abg-interpretation-basics-hy) · [ARDS ventilation basics](LESSON:ards-ventilation-basics) · [fluid balance acute care](LESSON:fluid-balance-acute-care) · [US RN hub](/usa/rn/nclex-rn/lessons).`,
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

**Takeaways:** pair **SpO₂ + work of breathing + mentation**; document **position**, **oxygen device**, and **response to therapy**; use [respiratory infection hubs](LESSON:pneumonia-oxygenation) and [PE clues](LESSON:pulmonary-embolism-clues) when differential diagnosis matters. **Related:** [ABG basics](LESSON:abg-interpretation-basics-hy) · [asthma status](LESSON:asthma-status-asthmaticus) · [US RN lesson hub](/usa/rn/nclex-rn/lessons).`,
      },
    ],
  },
};
