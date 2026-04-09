/**
 * Clinical casebook lessons (part B): electrolytes, maternal/newborn, pediatric fever, mental health safety.
 * @see case-study-casebook-specs-a.ts for sepsis, ACS, respiratory, glucose.
 */
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { CaseStudyLessonSpec } from "@/lib/lessons/scoped-lessons/case-study-casebook-shared";
import { rel } from "@/lib/lessons/scoped-lessons/launch-wave-1-rel";

const qt = (items: PathwayLessonQuizItem[]) => items;

const npStub = {
  title: "NP placeholder",
  seoTitle: "placeholder",
  seoDescription: "placeholder",
  scenarioSetup: "",
  clinical_meaning: "",
  exam_relevance: "",
  whatMattersMostEscalation: "",
  prioritizationNextActions: "",
  rationaleDecisions: "",
  escalationSafetyTeaching: "",
  takeaways: "",
};

const { relatedSlugs: rElectrolyte, relatedTitlesBySlug: tElectrolyte } = rel("fluids", "cj", "sepsis", "shock");

const rOb = {
  relatedSlugs: [
    "ob-emergencies-gold-standard",
    "clinical-judgment-prioritization-gold",
    "shock-emergencies-gold",
    "fluids-electrolytes-emergencies-gold",
  ],
  relatedTitlesBySlug: {
    "ob-emergencies-gold-standard": "OB emergencies",
    "clinical-judgment-prioritization-gold": "Clinical judgment & prioritization",
    "shock-emergencies-gold": "Shock emergencies",
    "fluids-electrolytes-emergencies-gold": "Fluids & electrolyte emergencies",
  },
};

const rPeds = {
  relatedSlugs: [
    "pediatric-triage-emergencies-gold-standard",
    "clinical-judgment-prioritization-gold",
    "fluids-electrolytes-emergencies-gold",
    "sepsis-early-recognition-gold",
  ],
  relatedTitlesBySlug: {
    "pediatric-triage-emergencies-gold-standard": "Pediatric triage emergencies",
    "clinical-judgment-prioritization-gold": "Clinical judgment & prioritization",
    "fluids-electrolytes-emergencies-gold": "Fluids & electrolyte emergencies",
    "sepsis-early-recognition-gold": "Sepsis early recognition",
  },
};

const { relatedSlugs: rMh, relatedTitlesBySlug: tMh } = rel("cj", "ham", "stroke", "acs");

export const CASE_STUDY_SPECS_B: CaseStudyLessonSpec[] = [
  {
    slug: "clinical-casebook-electrolyte-crisis-gold",
    topic: "Electrolyte emergency — clinical case study",
    topicSlug: "fluids-electrolytes",
    bodySystem: "Fluids & electrolytes",
    npTitleStem: "Electrolyte crisis case study — K, Na, Ca",
    npSeoDescription:
      "NP ambulatory case: severe hyperkalemia/hyponatremia framing, ECG integration themes, and ED referral—without guessing independent replacement rates outside the stem.",
    pathophysiologyCore: `**Why electrolytes dominate exams**  
**Potassium, sodium, calcium, and magnesium** alter **membrane stability**, **neuromuscular function**, and **cardiac conduction**. Boards embed **ECG changes**, **reflexes**, **mental status**, and **volume status** to force prioritization.

**Mechanistic anchors**  
**Hyperkalemia** risks **fatal arrhythmias**. **Hyponatremia** risks **cerebral edema** when acute/severe (especially with rapid shifts). **Hypocalcemia** increases **seizure/tetany** risk and **QT** issues.

**Trajectory**  
Items reward **repeating ECG**, **protecting airway**, **continuous monitoring**, and **preparing therapies per order** rather than “finishing tasks.”`,
    sharedKeyFindings: `**Hyperkalemia (when tested)**  
**Peaked T waves**, **widened QRS**, **sinus patterns progressing to instability**, **muscle weakness**, **paresthesias**.

**Hyponatremia**  
**Nausea**, **headache**, **confusion**, **seizures** when severe; **volume status** clues (hypovolemic vs euvolemic vs hypervolemic) change management **families** in advanced items.

**Hypocalcemia**  
**Trousseau/Chvostek** themes, **QT prolongation**, **seizures**, **laryngospasm** risk in severe cases.`,
    labsDiagnostics: `**Labs (stem-dependent)**  
**Basic metabolic panel**, **magnesium**, **ECG**, **ABG/VBG** when acid–base interplay matters. **Point-of-care** electrolytes may appear in ED/hospital vignettes.

**Integration**  
Never interpret **one number** without **clinical context** and **trends**.`,
    relatedSlugs: rElectrolyte,
    relatedTitlesBySlug: tElectrolyte,
    variants: {
      us_pn: {
        title: "Electrolyte crisis case study (NCLEX-PN, US)",
        seoTitle: "Electrolyte crisis case study | NCLEX-PN US | NurseNest",
        seoDescription:
          "US PN: electrolyte emergency vignette—monitoring, ECG prep, calcium gluconate themes per order, and escalation.",
        scenarioSetup: `A **client on hemodialysis** complains of **numbness** and **weakness**. **SpO₂ 96%**, **HR 52** then pauses on monitor, **BP 162/88**. The **telemetry** shows **peaked T waves** and **widening QRS**. **Potassium** reported as **6.9 mEq/L** (if shown).`,
        clinical_meaning: `This is **life-threatening hyperkalemia** until treated. PN priorities: **continuous monitoring**, **notify RN/provider immediately**, **prepare** **calcium therapy**, **insulin/dextrose**, **albuterol**, **kayexalate**—**only per orders**—and **avoid** independent dosing.`,
        exam_relevance: `PN traps: **routine vitals q4h** when **ECG is worsening**, **walking** the client, or **delaying** notification.`,
        whatMattersMostEscalation: `**What matters most** is **stabilizing cardiac conduction risk** and **lowering potassium** through **ordered, monitored therapies**—not paperwork.`,
        prioritizationNextActions: `1) **Stay at bedside**; ensure **continuous cardiac monitoring**.  
2) **Notify** provider **STAT** with **objective ECG + lab** data.  
3) **Prepare** medications **as ordered** (calcium gluconate commonly tested as cardioprotective).  
4) **IV access** per protocol; verify **labs** repeat timing.  
5) **Reassess ECG and vitals** after interventions per policy.`,
        rationaleDecisions: `**Why not “recheck K in the morning”**  
**ECG progression** implies **imminent** arrhythmia risk. **Why not give insulin alone** without protocol and glucose monitoring  
Hypoglycemia risk—follow the stem’s safe bundle.`,
        escalationSafetyTeaching: `**Escalation**  
If **unstable rhythm** develops, **code/rapid response** per policy.

**Teaching**  
After stabilization, teach **dietary potassium** awareness **as aligned** to renal education.`,
        takeaways: `• **ECG + K** together outrank routine tasks.  
• Pair with **fluids/electrolytes** gold lesson.`,
      },
      ca_rpn: {
        title: "Electrolyte crisis case study (REx-PN, Canada)",
        seoTitle: "Electrolyte crisis case study | REx-PN Canada | NurseNest",
        seoDescription: "Canada RPN: hyperkalemia vignette—metric labs and collaborative escalation.",
        scenarioSetup: `**K+ 6.8 mmol/L** in a **dialysis** client with **malaise** and **paresthesias**. **ECG** shows **peaked T waves**.`,
        clinical_meaning: `Severe **hyperkalemia** with **ECG changes** requires **urgent collaboration** and **preparation** for stabilization therapies per orders.`,
        exam_relevance: `Traps: **minimizing ECG**, **delaying** team activation.`,
        whatMattersMostEscalation: `**What matters most** is **immediate escalation** and **therapy readiness**.`,
        prioritizationNextActions: `1) **Continuous monitoring**.  
2) **Notify** provider.  
3) **Prepare** therapies per order.  
4) **Repeat** labs/ECG per protocol.  
5) **Document** times and responses.`,
        rationaleDecisions: `**Distractors**  
Completing unrelated tasks first is unsafe.`,
        escalationSafetyTeaching: `**Escalation**  
**Wide complex rhythm** = emergency response.`,
        takeaways: `• **mmol/L** labs—same judgment pattern.  
• Pair with **fluids/electrolytes** gold.`,
      },
      us_rn: {
        title: "Electrolyte crisis case study (NCLEX-RN, US)",
        seoTitle: "Electrolyte crisis case study | NCLEX-RN US | NurseNest",
        seoDescription: "US RN: hyperkalemia inpatient—calcium, insulin/dextrose, albuterol, dialysis prep.",
        scenarioSetup: `A **client** with **AKI** develops **peaked T waves**, **K+ 7.1 mEq/L**, **HR** irregular, **BP 98/60**. **Monitor** shows **widening QRS**.`,
        clinical_meaning: `**Instability + hyperkalemia** requires **rapid sequence care**: **cardiac membrane stabilization**, **shift K intracellularly**, **eliminate K** (diuretics/dialysis) per orders, with **glucose monitoring** when insulin is used.`,
        exam_relevance: `RN traps: **single interventions** without **monitoring**, **missing** glucose checks with insulin, or **delaying** provider notification.`,
        whatMattersMostEscalation: `**What matters most** is **interrupting arrhythmia risk** and **reducing serum K** using **protocol-driven bundles**.`,
        prioritizationNextActions: `1) **Continuous telemetry**; **two IV lines** if needed.  
2) **Administer** ordered **calcium** for ECG instability patterns.  
3) **Insulin + dextrose** per protocol with **q15–30 min glucose** checks when ordered.  
4) **Albuterol** per order; **kayexalate** when appropriate—follow stem.  
5) **Prepare** dialysis if indicated; **repeat** ECG/labs.`,
        rationaleDecisions: `**Why calcium first (often)**  
Membrane stabilization while other therapies work. **Why monitor glucose**  
Insulin drives **hypoglycemia** risk.`,
        escalationSafetyTeaching: `**Escalation**  
**VT/VF** or **loss of pulses** → **ACLS** pathway.`,
        takeaways: `• **Hyperkalemia management is a sequence**, not one drug.  
• Pair with **renal** and **fluids/electrolytes** lessons.`,
      },
      ca_rn: {
        title: "Electrolyte crisis case study (NCLEX-RN, Canada)",
        seoTitle: "Electrolyte crisis case study | NCLEX-RN Canada | NurseNest",
        seoDescription: "Canada RN: electrolyte emergency—monitoring and therapy preparation.",
        scenarioSetup: `A client with **HF** on **diuretics** becomes **confused** with **seizure-like activity**. **Na+ 118 mmol/L** (acute change implied).`,
        clinical_meaning: `**Severe hyponatremia** can cause **neurogenic** catastrophe. Priorities: **protect airway**, **monitor neuro**, **notify**, **prepare** for **carefully paced correction** per orders—**avoid rapid overcorrection** themes when tested.`,
        exam_relevance: `Traps: **free water bolus** in inappropriate contexts, **ignoring** neuro changes.`,
        whatMattersMostEscalation: `**What matters most** is **neuro protection** and **ordered correction** with **frequent monitoring**.`,
        prioritizationNextActions: `1) **Airway/neuro** assessment; **seizure precautions**.  
2) **Notify** provider; **prepare** labs/imaging as ordered.  
3) **Strict I/O**; monitor **neuro status** frequently.  
4) **Avoid** independent fluid orders—follow **protocol**.  
5) **Reassess** after each intervention.`,
        rationaleDecisions: `**Why rapid correction is dangerous**  
**Osmotic demyelination** themes appear as traps—follow the stem.`,
        escalationSafetyTeaching: `**Escalation**  
**Coma** or **respiratory failure** from brainstem issues requires **ICU** care.`,
        takeaways: `• **Na + neuro** = high stakes.  
• Pair with **fluids/electrolytes** gold.`,
      },
      us_np: {
        ...npStub,
        scenarioSetup: `A **72-year-old** with **CKD** reports **weakness** and **palpitations**. **K+ 6.2 mEq/L**, **ECG** shows **peaked T waves** in clinic.`,
        clinical_meaning: `NP ambulatory decision: **ED referral** for **ECG-positive hyperkalemia** versus attempting outpatient tricks—most items favor **urgent evaluation** with **continuous monitoring** capability.`,
        exam_relevance: `NP traps: **oral kayexalate alone** as sole plan for **severe** changes; **ignoring** ECG.`,
        whatMattersMostEscalation: `**What matters most** is **safe disposition** and **explicit monitoring** during therapy.`,
        prioritizationNextActions: `1) **Direct to ED** when **ECG changes** + **severe K**—per common teaching.  
2) **Document** **allergies**, **meds that raise K** (ACE/ARB, NSAIDs), **dialysis schedule**.  
3) **Coordinate** handoff with **EMS** if unstable.  
4) **Avoid** casual outpatient observation when **instability** is present.`,
        rationaleDecisions: `**Why ED**  
**Telemetry-capable** environment for **therapy + repeat ECG**.`,
        escalationSafetyTeaching: `**Safety netting**  
Teach **diet**, **med review**, and **when to call EMS** for palpitations/syncope.`,
        takeaways: `• **ECG-positive hyperkalemia** is an escalation trigger.  
• Pair with **fluids/electrolytes** gold.`,
      },
    },
    preTest: qt([
      {
        question: "Which ECG finding is classically associated with hyperkalemia progression?",
        options: [
          "Peaked T waves progressing to QRS widening and conduction abnormalities.",
          "ST elevation in a single territory only without other causes.",
          "Prolonged PR only with normal QRS always.",
          "Normal sinus rhythm without any changes ever.",
        ],
        correct: 0,
        rationale:
          "Hyperkalemia can produce peaked T waves and progress to widened QRS and dangerous arrhythmias; integrate ECG with labs.",
      },
      {
        question: "Why is glucose monitored when insulin is used to shift potassium intracellularly?",
        options: [
          "Insulin can cause hypoglycemia; glucose is co-administered and monitored per protocol.",
          "Insulin raises glucose always.",
          "Glucose is unrelated.",
          "Insulin is never used for hyperkalemia.",
        ],
        correct: 0,
        rationale:
          "Insulin drives potassium into cells but can drop blood glucose; monitoring prevents hypoglycemia during treatment.",
      },
      {
        question: "Which symptom cluster should raise concern for severe hyponatremia?",
        options: [
          "Acute confusion, seizures, or decreased LOC with low sodium.",
          "Chronic mild fatigue without neuro change.",
          "Isolated knee pain.",
          "Stable hypertension without labs.",
        ],
        correct: 0,
        rationale:
          "Neurologic deterioration with hyponatremia suggests severe CNS complication risk and requires urgent evaluation.",
      },
    ]),
    postTest: qt([
      {
        question: "A dialysis client develops widened QRS with K+ 7.2 mEq/L. What is the priority nursing theme?",
        options: [
          "Immediate escalation, continuous monitoring, and preparation/administration of emergent therapies per protocol.",
          "Finish bedside linen change first.",
          "Send the client to wait in the lobby alone.",
          "Hold all monitoring to reduce alarm fatigue.",
        ],
        correct: 0,
        rationale:
          "Hyperkalemia with conduction changes on ECG is life-threatening; prioritize stabilization and team activation.",
      },
      {
        question: "Why might calcium be administered in severe hyperkalemia with ECG changes?",
        options: [
          "To stabilize cardiac membrane and reduce immediate arrhythmia risk while other therapies work—per orders.",
          "To permanently remove potassium from the body alone.",
          "To treat hypocalcemia only.",
          "To replace dietary calcium only.",
        ],
        correct: 0,
        rationale:
          "Calcium therapy is commonly used for cardioprotection in hyperkalemia with ECG changes; follow the stem and orders.",
      },
      {
        question: "What is a key teaching point for preventing recurrent hyperkalemia in CKD?",
        options: [
          "Review medications and diet that raise potassium and follow nephrology/dialysis plans.",
          "Encourage unlimited potassium-rich foods always.",
          "Stop all BP medications regardless of risk.",
          "Ignore dialysis appointments.",
        ],
        correct: 0,
        rationale:
          "Medication review, dietary counseling, and adherence to dialysis plans reduce recurrence risk.",
      },
    ]),
  },

  {
    slug: "clinical-casebook-maternal-newborn-emergency-gold",
    topic: "Maternal / newborn emergency — clinical case study",
    topicSlug: "maternity",
    bodySystem: "Maternity",
    npTitleStem: "Maternal emergency case study — bleeding & preeclampsia",
    npSeoDescription:
      "NP women’s health case: third-trimester bleeding and severe-range BP themes, ED/L&D triage language, and safety netting—stem-scoped.",
    pathophysiologyCore: `**Exam frames**  
**Obstetric emergencies** cluster around **bleeding** (abruption, previa, uterine rupture, PPH themes), **hypertensive disorders** (preeclampsia with severe features), and **fetal compromise** patterns.

**Why boards test this**  
Delayed recognition of **hemorrhage** or **eclampsia risk** is catastrophic. Items reward **triage language**, **fetal monitoring themes**, **magnesium safety**, and **activation** of obstetric resources.

**Trajectory**  
**Worsening pain**, **non-reassuring fetal status**, **coagulopathy clues**, or **neuro changes** escalate priority.`,
    sharedKeyFindings: `**Antepartum bleeding**  
**Painless bright red bleeding** suggests **previa** patterns; **painful bleeding** suggests **abruption**—the stem decides.

**Preeclampsia**  
**BP thresholds**, **proteinuria** when shown, **RUQ pain**, **headache**, **visual changes**, **hyperreflexia**.

**Postpartum hemorrhage**  
**Tone** (boggy uterus), **trauma**, **tissue**, **thrombin**—exam may emphasize **fundal massage** only when appropriate and **massive transfusion** activation themes.`,
    relatedSlugs: rOb.relatedSlugs,
    relatedTitlesBySlug: rOb.relatedTitlesBySlug,
    variants: {
      us_pn: {
        title: "Maternal emergency case study (NCLEX-PN, US)",
        seoTitle: "Maternal emergency case study | NCLEX-PN US | NurseNest",
        seoDescription: "US PN: antepartum bleeding vignette—monitoring, reporting, and scope.",
        scenarioSetup: `A **36-week pregnant** client arrives with **heavy vaginal bleeding** and **mild abdominal tightening**. **BP 118/74**, **HR 112**, **fetal HR** **110** with **late decelerations** on the monitor strip (if shown).`,
        clinical_meaning: `**Third-trimester bleeding + fetal distress** is an **obstetric emergency**. PN priorities: **activate RN/provider**, **monitor vitals and FHR per protocol**, **prepare** for urgent evaluation—**no independent decisions** about delivery mode.`,
        exam_relevance: `PN traps: **reassurance alone**, **delaying** notification, **ambulating** a bleeding pregnant client.`,
        whatMattersMostEscalation: `**What matters most** is **immediate obstetric evaluation** and **continuous fetal monitoring** when available.`,
        prioritizationNextActions: `1) **Stay** with client; **left lateral** positioning if tolerated.  
2) **Notify** RN/obstetric team **STAT**.  
3) **Prepare** IV/labs per order; **type & screen** themes.  
4) **Monitor** bleeding amount objectively (pads, clots).  
5) **NPO** per protocol if surgery possible.`,
        rationaleDecisions: `**Why not “wait for physician rounds”**  
Bleeding + **late decels** = **urgent** pathway.`,
        escalationSafetyTeaching: `**Escalation**  
**Massive bleeding** or **maternal instability** → **massive transfusion** activation per facility.`,
        takeaways: `• **Bleeding + fetal category II/III** patterns = escalate.  
• Pair with **OB emergencies** gold lesson.`,
      },
      ca_rpn: {
        title: "Maternal emergency case study (REx-PN, Canada)",
        seoTitle: "Maternal emergency case study | REx-PN Canada | NurseNest",
        seoDescription: "Canada RPN: hypertensive disorder vignette—reporting and monitoring.",
        scenarioSetup: `A **client** at **34 weeks** has **BP 162/104 mmHg**, **headache**, and **RUQ pain**. **Urinalysis** shows **3+ protein** if given.`,
        clinical_meaning: `**Severe-range BP** with **symptoms** suggests **preeclampsia with severe features** until evaluated—prioritize **urgent obstetric evaluation** and **seizure prophylaxis themes** per orders.`,
        exam_relevance: `Traps: **dismissing headache** as tension, **delaying** care.`,
        whatMattersMostEscalation: `**What matters most** is **maternal-fetal safety** via **timely escalation** and **monitoring**.`,
        prioritizationNextActions: `1) **Notify** provider; **frequent BP** and **symptom checks**.  
2) **Prepare** for **labs**, **magnesium** if ordered—**monitor** reflexes and **respirations** per protocol.  
3) **Fetal monitoring** per order.  
4) **Seizure precautions**.  
5) **Strict I/O** if magnesium.`,
        rationaleDecisions: `**Distractors**  
“Sleep it off” is unsafe with **neuro** and **RUQ** symptoms.`,
        escalationSafetyTeaching: `**Escalation**  
**Seizure** or **uncontrolled BP** → emergent care.`,
        takeaways: `• **Headache + visual + RUQ** cluster = red flags.  
• Pair with **OB emergencies** gold.`,
      },
      us_rn: {
        title: "Maternal emergency case study (NCLEX-RN, US)",
        seoTitle: "Maternal emergency case study | NCLEX-RN US | NurseNest",
        seoDescription: "US RN: postpartum hemorrhage case—uterine tone, meds, transfusion activation.",
        scenarioSetup: `**Immediate postpartum**, the client is **pale**, **tachycardic**, and **soaking pads**. **Fundus** is **boggy** above the umbilicus. **BP 88/52**. **Estimated blood loss** rising.`,
        clinical_meaning: `This is **postpartum hemorrhage** with **uterine atony** as a leading theme. RN priorities: **fundal massage per protocol**, **uterotonic medications per order**, **large-bore IV access**, **labs**, **activation** of massive hemorrhage protocols, and **continuous monitoring**.`,
        exam_relevance: `RN traps: **routine newborn bath** first, **delaying** blood products, **minimizing** blood loss estimates.`,
        whatMattersMostEscalation: `**What matters most** is **stopping bleeding** and **restoring perfusion**—team activation and **quantified** loss reporting.`,
        prioritizationNextActions: `1) **Call for help**; **two large-bore IVs**.  
2) **Uterotonic therapy** per order after atony management.  
3) **Labs**: **CBC**, **coags**, **type & cross**; **transfuse** per protocol.  
4) **Monitor** **UO**, **mentation**, **vitals** q5–15 min during instability.  
5) **Prepare** for **OR** if bleeding continues.`,
        rationaleDecisions: `**Why quantification matters**  
Underestimating **EBL** delays **resuscitation**.`,
        escalationSafetyTeaching: `**Escalation**  
**Coagulopathy** signs → escalate **massive transfusion** pathways.`,
        takeaways: `• **Boggy fundus + hypotension** = atony hemorrhage until proven otherwise.  
• Pair with **OB emergencies** gold.`,
      },
      ca_rn: {
        title: "Maternal emergency case study (NCLEX-RN, Canada)",
        seoTitle: "Maternal emergency case study | NCLEX-RN Canada | NurseNest",
        seoDescription: "Canada RN: antepartum bleeding—metric vitals and team activation.",
        scenarioSetup: `**37 weeks**, **painless bright red bleeding** moderate volume, **fetal tachycardia** on strip. **BP 122/78 mmHg** initially.`,
        clinical_meaning: `**Painless bleeding** near term raises **previa** concern; **fetal tachycardia** suggests **compromise**. Priorities: **avoid** digital cervical exams unless cleared, **urgent obstetric evaluation**, **continuous monitoring**.`,
        exam_relevance: `Traps: **vaginal exams** in unconfirmed placenta location, **delaying** care.`,
        whatMattersMostEscalation: `**What matters most** is **protecting mother and fetus** with **urgent OB management**—often **preparing for delivery** if indicated.`,
        prioritizationNextActions: `1) **Notify** obstetrics **STAT**.  
2) **Monitor** vitals and **FHR**.  
3) **IV access** per order; **labs** and **T&S**.  
4) **Prepare** for **OR** if emergent cesarean indicated.  
5) **NPO** per protocol.`,
        rationaleDecisions: `**Why avoid routine cervical checks**  
**Previa** risk—follow stem and provider direction.`,
        escalationSafetyTeaching: `**Escalation**  
**Maternal shock** or **fetal bradycardia** → **immediate** delivery pathways.`,
        takeaways: `• **Painless bleeding** + **fetal compromise** = obstetric emergency.  
• Pair with **OB emergencies** gold.`,
      },
      us_np: {
        ...npStub,
        scenarioSetup: `A **32-week** client has **BP 158/102**, **new edema**, **headache**, and **scotomata**. **Urinalysis** shows **protein**; **reflexes** brisk.`,
        clinical_meaning: `NP ambulatory/women’s health framing: **preeclampsia with severe features** requires **urgent evaluation**—not “follow-up in a month.” Items test **ED/L&D triage**, **BP management themes**, and **fetal assessment** coordination.`,
        exam_relevance: `NP traps: **outpatient watchful waiting** for **neuro visual symptoms**; **NSAIDs** in late pregnancy without context—follow stem.`,
        whatMattersMostEscalation: `**What matters most** is **timely escalation** to **higher-acuity obstetric care**.`,
        prioritizationNextActions: `1) **Direct** to **L&D/ED** for **severe features** per common teaching.  
2) **Order/arrange** **labs** as indicated (CBC, LFTs, renal function, proteinuria quantification themes).  
3) **Fetal monitoring** when in appropriate setting.  
4) **Magnesium** for **eclampsia prevention** in inpatient contexts—**per protocol**.  
5) **Document** **maternal-fetal** risk discussion.`,
        rationaleDecisions: `**Why not “reassure”**  
**Visual changes** are **cannot-miss** red flags.`,
        escalationSafetyTeaching: `**Safety netting**  
Return for **worsening headache**, **RUQ pain**, **decreased fetal movement**, **bleeding**.`,
        takeaways: `• **Headache + visual changes** in pregnancy = urgent pathway.  
• Pair with **OB emergencies** gold.`,
      },
    },
    preTest: qt([
      {
        question: "Which third-trimester presentation most strongly suggests urgent obstetric evaluation?",
        options: [
          "Heavy vaginal bleeding with fetal heart rate abnormalities.",
          "Mild Braxton Hicks without bleeding or fetal concerns.",
          "Routine prenatal visit at term without symptoms.",
          "Chronic heartburn without other changes.",
        ],
        correct: 0,
        rationale:
          "Antepartum bleeding with non-reassuring fetal status is an obstetric emergency requiring urgent evaluation.",
      },
      {
        question: "What is a priority nursing action in suspected postpartum hemorrhage with a boggy uterus?",
        options: [
          "Activate help, fundal massage per protocol, uterotonic medications per order, and large-bore IV access with close monitoring.",
          "Send the client to shower alone.",
          "Delay assessment to finish paperwork.",
          "Encourage vigorous exercise immediately.",
        ],
        correct: 0,
        rationale:
          "Postpartum hemorrhage with uterine atony requires rapid team response, uterine management per protocol, and resuscitation readiness.",
      },
      {
        question: "Which symptom cluster raises concern for preeclampsia with severe features?",
        options: [
          "Severe-range BP with headache, visual changes, RUQ pain, or neuro symptoms.",
          "Mild ankle edema alone at 38 weeks without other findings.",
          "Chronic seasonal allergies.",
          "Stable BP with no proteinuria ever.",
        ],
        correct: 0,
        rationale:
          "Hypertensive disorders with neurologic or epigastric symptoms suggest severe features and need urgent evaluation.",
      },
    ]),
    postTest: qt([
      {
        question: "Why might digital vaginal exams be unsafe in unconfirmed third-trimester bleeding?",
        options: [
          "If placenta previa is possible, an exam can worsen bleeding—follow provider guidance and facility protocol.",
          "Exams always stop bleeding.",
          "Exams are unrelated to bleeding risk.",
          "Exams are only unsafe in the first trimester.",
        ],
        correct: 0,
        rationale:
          "In possible previa, avoid procedures that increase bleeding risk unless cleared in the appropriate setting.",
      },
      {
        question: "What should be monitored closely during magnesium sulfate therapy for eclampsia prevention?",
        options: [
          "Respiratory rate, deep tendon reflexes, urine output, and oxygenation per protocol.",
          "Only the client’s shoe size.",
          "Only the TV channel.",
          "No monitoring is needed.",
        ],
        correct: 0,
        rationale:
          "Magnesium toxicity risk requires frequent clinical monitoring per protocol.",
      },
      {
        question: "Which finding suggests fetal compromise during antepartum bleeding?",
        options: [
          "Late decelerations, bradycardia, or loss of variability compared with a reassuring strip.",
          "Stable category I tracing with normal variability.",
          "Normal fetal movement without monitoring.",
          "Mild maternal hunger only.",
        ],
        correct: 0,
        rationale:
          "Non-reassuring fetal heart rate patterns increase urgency in antepartum bleeding scenarios.",
      },
    ]),
  },

  {
    slug: "clinical-casebook-pediatric-fever-dehydration-gold",
    topic: "Pediatric fever / dehydration — clinical case study",
    topicSlug: "pediatrics",
    bodySystem: "Pediatrics",
    npTitleStem: "Pediatric fever case study — dehydration & sepsis",
    npSeoDescription:
      "NP pediatric primary care case: fever without source, dehydration assessment, bronchiolitis overlap, and ED thresholds—stem-scoped.",
    pathophysiologyCore: `**Pediatric exam lens**  
Children compensate until they crash. Boards test **behavior**, **cap refill**, **fontanelle** (infants), **urine output**, **RR for age**, and **sepsis** patterns in neonates.

**Fever**  
Focus on **age-based thresholds** (newborns vs older infants), **meningitis** red flags, **respiratory distress**, and **dehydration**.

**Dehydration**  
**Dry mucosa**, **sunken eyes**, **decreased tears**, **oliguria**, **tachycardia**—use **oral rehydration** when mild/moderate and **escalate** when severe.`,
    sharedKeyFindings: `**Vitals by age**  
**Tachypnea** thresholds differ for **bronchiolitis/pneumonia** suspicion.

**Appearance**  
**Toxic vs non-toxic** appearance drives triage.

**Meningitis red flags**  
**Bulging fontanelle**, **neck stiffness**, **petechial rash** (when shown), **altered responsiveness**.`,
    relatedSlugs: rPeds.relatedSlugs,
    relatedTitlesBySlug: rPeds.relatedTitlesBySlug,
    variants: {
      us_pn: {
        title: "Pediatric fever / dehydration case study (NCLEX-PN, US)",
        seoTitle: "Pediatric fever / dehydration case study | NCLEX-PN US | NurseNest",
        seoDescription: "US PN: pediatric dehydration vignette—ORT, escalation, parental teaching.",
        scenarioSetup: `A **18-month-old** has **diarrhea** × **2 days**, **few wet diapers**, **dry lips**, **cries without tears**. **HR 168**, **RR 36**, **cap refill 4 seconds**. **Weight down** from baseline per parent.`,
        clinical_meaning: `This suggests **moderate-to-severe dehydration**. PN priorities: **notify RN/provider**, **NPO vs ORT per order**, **monitor vitals**, **prepare** for **IV therapy** if severe.`,
        exam_relevance: `PN traps: **routine play therapy** first, **giving plain water alone** in infants without guidance, **delaying** escalation.`,
        whatMattersMostEscalation: `**What matters most** is **perfusion**: prolonged **cap refill** + **tachycardia** requires **urgent evaluation**.`,
        prioritizationNextActions: `1) **Stay** with child and caregiver; **assess ABCs**.  
2) **Notify** provider with **objective** dehydration findings.  
3) **ORT** per protocol if appropriate; **small frequent** volumes.  
4) **Prepare** for **IV** if **unable to tolerate PO** or **worsening**.  
5) **Teach** **red flags** to parents.`,
        rationaleDecisions: `**Why not “discharge home alone”**  
**Hemodynamic** compromise in pediatrics can evolve quickly.`,
        escalationSafetyTeaching: `**Escalation**  
**Lethargy**, **mottling**, **bilious vomiting**, or **no urine** → **emergency**.`,
        takeaways: `• **Cap refill + HR** beat “looks tired.”  
• Pair with **pediatric triage** gold.`,
      },
      ca_rpn: {
        title: "Pediatric fever / dehydration case study (REx-PN, Canada)",
        seoTitle: "Pediatric fever / dehydration case study | REx-PN Canada | NurseNest",
        seoDescription: "Canada RPN: pediatric fever—metric temps and collaboration.",
        scenarioSetup: `A **child** has **T 39.2°C**, **RR** fast for age, **fatigue**, and **decreased PO intake**.`,
        clinical_meaning: `Assess **respiratory** and **hydration** status; **collaborate** early for **toxic appearance** or **respiratory distress**.`,
        exam_relevance: `Traps: **minimizing tachypnea**, **antipyretics alone** without evaluation when **toxic**.`,
        whatMattersMostEscalation: `**What matters most** is **safe triage** and **escalation** when **red flags** appear.`,
        prioritizationNextActions: `1) **Vitals** and **SpO₂** per protocol.  
2) **Notify** RN/provider.  
3) **Antipyretics** per order.  
4) **Hydration** plan per order.  
5) **Parent teaching** with **specific** return precautions.`,
        rationaleDecisions: `**Distractors**  
“Wait three days” for **ill-appearing** child is unsafe.`,
        escalationSafetyTeaching: `**Escalation**  
**Neck stiffness**, **non-blanching rash**, **respiratory distress** → urgent care.`,
        takeaways: `• **Toxic appearance** changes everything.  
• Pair with **pediatric triage** gold.`,
      },
      us_rn: {
        title: "Pediatric fever / dehydration case study (NCLEX-RN, US)",
        seoTitle: "Pediatric fever / dehydration case study | NCLEX-RN US | NurseNest",
        seoDescription: "US RN: pediatric sepsis suspicion—labs, antibiotics themes, monitoring.",
        scenarioSetup: `A **neonate** **10 days old** has **T 38.2°C** rectal, **feeding poorly**, **lethargic**. **HR 190**, **RR 66**.`,
        clinical_meaning: `**Fever in young infant** is a **high-risk infection** scenario. RN priorities: **urgent evaluation**, **sepsis workup themes**, **monitoring**, **IV access**, **antibiotics per order**—not “viral illness reassurance only.”`,
        exam_relevance: `RN traps: **routine discharge** home without workup in **neonatal fever** items.`,
        whatMattersMostEscalation: `**What matters most** is **timely emergency evaluation** and **treatment** pathways for **serious bacterial infection** risk.`,
        prioritizationNextActions: `1) **Continuous monitoring**; **IV access**.  
2) **Labs/cultures** per protocol; **antibiotics** per order after evaluation pathway.  
3) **Antipyretics** per order with **weight-based** dosing.  
4) **Educate** parents on **worsening signs**.  
5) **Isolation** precautions per protocol when indicated.`,
        rationaleDecisions: `**Why ED**  
Neonatal fever items often test **full evaluation** rather than watchful waiting.`,
        escalationSafetyTeaching: `**Escalation**  
**Apnea**, **cyanosis**, **seizure** → resuscitation pathways.`,
        takeaways: `• **Neonatal fever** = different rules than older kids.  
• Pair with **pediatric triage** and **sepsis** gold.`,
      },
      ca_rn: {
        title: "Pediatric fever / dehydration case study (NCLEX-RN, Canada)",
        seoTitle: "Pediatric fever / dehydration case study | NCLEX-RN Canada | NurseNest",
        seoDescription: "Canada RN: bronchiolitis-style distress—oxygen and monitoring.",
        scenarioSetup: `A **6-month-old** has **wheezing**, **nasal flaring**, **SpO₂ 89%** on **RA**, **RR 62/min**.`,
        clinical_meaning: `**Respiratory distress** in infant requires **oxygen**, **frequent reassessment**, and **escalation** if **hypoxia** persists.`,
        exam_relevance: `Traps: **routine feeding** attempts that **exhaust** a distressed infant.`,
        whatMattersMostEscalation: `**What matters most** is **oxygenation** and **respiratory support** per order.`,
        prioritizationNextActions: `1) **Monitor SpO₂**; **oxygen** per order.  
2) **Notify** provider; prepare **possible** higher care.  
3) **Suction** as indicated; **head elevated** positioning.  
4) **IV** if **dehydrated** and **unable** to feed.  
5) **Strict** I/O.`,
        rationaleDecisions: `**Why not “force PO”**  
**Increased work of breathing** can worsen fatigue and aspiration risk.`,
        escalationSafetyTeaching: `**Escalation**  
**Apnea**, **grunting**, **cyanosis** → emergency.`,
        takeaways: `• **Infant hypoxia** = escalate.  
• Pair with **pediatric triage** gold.`,
      },
      us_np: {
        ...npStub,
        scenarioSetup: `A **15-month-old** has **fever** and **runny nose**, but parents report **decreased urine**, **no tears**, and **only one wet diaper in 24 hours**. **Appears fatigued** but **arousable**.`,
        clinical_meaning: `NP primary care: **dehydration severity** assessment, **ORT plan**, **ED referral** if **severe**, and **parent teaching** with **specific** return precautions.`,
        exam_relevance: `NP traps: **IV fluids** in clinic for mild dehydration; **missing** **red flags**.`,
        whatMattersMostEscalation: `**What matters most** is **correct disposition** and **clear safety netting**.`,
        prioritizationNextActions: `1) **Assess** perfusion: **HR**, **cap refill**, **mental status**, **mucous membranes**.  
2) **ORT** with **weight-based** volumes if mild/moderate per guidelines.  
3) **ED referral** for **severe** dehydration or **toxic** appearance.  
4) **Antipyretics** per weight when appropriate.  
5) **Document** **parent education**.`,
        rationaleDecisions: `**Why ED**  
**Prolonged cap refill** + **minimal urine** often exceeds safe outpatient management.`,
        escalationSafetyTeaching: `**Safety netting**  
Return for **no urine**, **lethargy**, **fast breathing**, **blue lips**.`,
        takeaways: `• **Dehydration disposition** is a premium ambulatory skill.  
• Pair with **pediatric triage** gold.`,
      },
    },
    preTest: qt([
      {
        question: "Which finding best suggests clinically significant dehydration in a toddler?",
        options: [
          "Prolonged capillary refill, tachycardia, decreased tears/urine, and dry mucous membranes.",
          "One extra wet diaper compared with baseline.",
          "Mild cough without other symptoms.",
          "Normal playful behavior with normal vitals.",
        ],
        correct: 0,
        rationale:
          "Objective perfusion and hydration markers help stratify dehydration severity beyond caregiver impression alone.",
      },
      {
        question: "Why is fever in a young neonate treated as higher risk in many exam vignettes?",
        options: [
          "Neonates can deteriorate quickly and may require urgent evaluation for serious bacterial infection.",
          "Neonates never get infections.",
          "Fever is always viral without evaluation.",
          "Temperature is irrelevant in neonates.",
        ],
        correct: 0,
        rationale:
          "Age-based risk stratification is central; neonatal fever often triggers emergency evaluation pathways in exam items.",
      },
      {
        question: "What is a priority before pushing oral fluids in a child with severe respiratory distress?",
        options: [
          "Stabilize breathing and oxygenation; oral feeding may be unsafe until distress improves.",
          "Force a large bottle immediately.",
          "Ignore oxygen saturation.",
          "Send the child to run laps.",
        ],
        correct: 0,
        rationale:
          "In severe respiratory distress, prioritize airway and breathing support; PO intake can wait or be unsafe until stabilized.",
      },
    ]),
    postTest: qt([
      {
        question: "Which symptom cluster should prompt fastest escalation in a febrile infant?",
        options: [
          "Mottled skin, lethargy, apnea, or cyanosis compared with mild fever and playful behavior.",
          "Mild nasal congestion only.",
          "Stable appetite and normal wet diapers.",
          "A request for a toy.",
        ],
        correct: 0,
        rationale:
          "Toxic appearance and signs of respiratory failure or shock require emergency evaluation.",
      },
      {
        question: "Why is oral rehydration preferred for mild-moderate gastroenteritis in many cases?",
        options: [
          "It replaces losses safely when the child can tolerate PO and does not require IV therapy yet.",
          "It replaces IV therapy always in every child.",
          "It stops all infections immediately.",
          "It is never appropriate.",
        ],
        correct: 0,
        rationale:
          "ORT is effective for many mild-moderate dehydration cases when tolerated; severe cases need escalated care.",
      },
      {
        question: "What teaching should parents receive about fever red flags?",
        options: [
          "Seek urgent care for breathing difficulty, persistent lethargy, decreased urine, neck stiffness, non-blanching rash, or signs of dehydration.",
          "Ignore all fevers for 2 weeks automatically.",
          "Never use antipyretics.",
          "Avoid all medical care for children.",
        ],
        correct: 0,
        rationale:
          "Return precautions should be specific and actionable, focusing on danger signs and dehydration.",
      },
    ]),
  },

  {
    slug: "clinical-casebook-mental-health-safety-gold",
    topic: "Mental health & safety — clinical case study",
    topicSlug: "mental-health",
    bodySystem: "Mental health / safety",
    npTitleStem: "Mental health case study — suicide risk & safety planning",
    npSeoDescription:
      "NP PMHNP-adjacent case: suicide risk assessment, involuntary hold themes as facility/policy dependent, med safety, and warm handoff—stem-scoped.",
    pathophysiologyCore: `**Safety-first frame**  
Mental health items on nursing exams still prioritize **immediate harm reduction**: **suicide**, **homicide**, **inability to care for basic needs**, **substance intoxication** with **respiratory depression**.

**Exam skill**  
Use **direct questions** about **ideation/plan/intent**, **means access**, **protective factors**, and **collateral** information when available.

**Trauma-informed tone**  
Stabilize **environment**, **remove means** when possible, and **activate** appropriate resources.`,
    sharedKeyFindings: `**Suicide risk**  
**Plan**, **intent**, **means**, **prior attempts**, **hopelessness**, **command hallucinations** (if shown), **substance use**, **acute stressors**.

**Aggression / harm**  
**Escalating agitation**, **threats**, **weapon access**.

**Capacity**  
Impaired judgment from **mania**, **psychosis**, or **intoxication** changes safety planning.`,
    relatedSlugs: rMh,
    relatedTitlesBySlug: tMh,
    variants: {
      us_pn: {
        title: "Mental health & safety case study (NCLEX-PN, US)",
        seoTitle: "Mental health & safety case study | NCLEX-PN US | NurseNest",
        seoDescription: "US PN: suicide risk vignette—1:1 observation, reporting, and scope.",
        scenarioSetup: `A **client** with **depression** tells you, **“I have a plan to end it tonight.”** The client is **calm**, **cooperative**, and **has pills** at home. You are on an inpatient unit.`,
        clinical_meaning: `This is **active suicidal ideation with plan**—an **immediate safety emergency**. PN priorities: **do not leave** the client alone, **notify RN/provider**, **remove/secure** means per policy, and **follow** **1:1** observation orders.`,
        exam_relevance: `PN traps: **promising confidentiality** over **safety**, **leaving** to get coffee, **minimizing** statements as “attention-seeking.”`,
        whatMattersMostEscalation: `**What matters most** is **immediate protection** and **activation** of **safety protocols**—not processing psychotherapy in the hallway.`,
        prioritizationNextActions: `1) **Stay** with client; **activate** **1:1** per policy.  
2) **Notify** RN/provider **STAT**.  
3) **Remove** **belongings** that could be harmful per protocol.  
4) **Prepare** for **evaluation** for **higher level of observation** or **transfer** as ordered.  
5) **Document** statements **verbatim** when possible.`,
        rationaleDecisions: `**Why not “privacy first”**  
**Imminent harm** overrides **confidentiality** in safety contexts. **Why not leave**  
**Constant observation** prevents **impulsive** harm.`,
        escalationSafetyTeaching: `**Escalation**  
If **agitation** escalates or **weapon** appears, follow **behavioral emergency** protocols.`,
        takeaways: `• **Plan + intent** = **safety activation**.  
• Pair with **clinical judgment** gold.`,
      },
      ca_rpn: {
        title: "Mental health & safety case study (REx-PN, Canada)",
        seoTitle: "Mental health & safety case study | REx-PN Canada | NurseNest",
        seoDescription: "Canada RPN: agitation vignette—team safety and collaboration.",
        scenarioSetup: `A **client** becomes **agitated**, **pacing**, and **threatens** staff. Other clients are nearby.`,
        clinical_meaning: `**Environmental safety** and **team communication** are priorities. RPN responsibilities: **de-escalation within training**, **call for help**, **protect others**, follow **policy**.`,
        exam_relevance: `Traps: **isolating** with the client alone without backup, **minimizing threats**.`,
        whatMattersMostEscalation: `**What matters most** is **preventing harm** to **clients and staff** with **team response**.`,
        prioritizationNextActions: `1) **Call** for assistance per policy.  
2) **Clear** the area if possible.  
3) **Maintain** safe distance; use **calm voice**.  
4) **Medications/restraints** only **per order** and **policy**.  
5) **Document** behaviors objectively.`,
        rationaleDecisions: `**Distractors**  
**Arguing** or **shaming** worsens agitation.`,
        escalationSafetyTeaching: `**Escalation**  
**Weapon present** or **violence** → **security/police** per facility policy.`,
        takeaways: `• **Safety** > pride.  
• Pair with **high-alert meds** if chemical restraint themes.`,
      },
      us_rn: {
        title: "Mental health & safety case study (NCLEX-RN, US)",
        seoTitle: "Mental health & safety case study | NCLEX-RN US | NurseNest",
        seoDescription: "US RN: suicide precautions—Q15 checks, milieu safety, communication.",
        scenarioSetup: `An **adolescent** is **placed on suicide precautions** after **overdose attempt**. The parent asks you to **turn off** monitoring to let them sleep unsupervised.`,
        clinical_meaning: `**Safety protocols** exist because **risk persists**. RN priorities: **empathetic boundaries**, **explain** **need for observation**, **follow** **precaution level**, **collaborate** with psychiatry.`,
        exam_relevance: `RN traps: **agreeing** to **remove precautions** due to **family pressure**.`,
        whatMattersMostEscalation: `**What matters most** is **maintaining** **life-safety measures** until **provider** clears changes.`,
        prioritizationNextActions: `1) **Maintain** **continuous/interval** observation per order.  
2) **Remove** **ligature risks** from environment.  
3) **Assess** **SI** each shift with **direct questions**.  
4) **Involve** **psych** and **social work** for **aftercare planning**.  
5) **Document** **interventions** and **responses**.`,
        rationaleDecisions: `**Why not unsupervised sleep**  
**Highest risk** periods can include **nighttime** and **impulsivity**.`,
        escalationSafetyTeaching: `**Escalation**  
**New self-harm** behaviors → **increase** precaution level per order.`,
        takeaways: `• **Family pressure** does not change **medical necessity**.  
• Pair with **clinical judgment** gold.`,
      },
      ca_rn: {
        title: "Mental health & safety case study (NCLEX-RN, Canada)",
        seoTitle: "Mental health & safety case study | NCLEX-RN Canada | NurseNest",
        seoDescription: "Canada RN: substance intoxication—ABC and monitoring.",
        scenarioSetup: `A **client** is **unresponsive** with **unknown substance** use, **RR 8**, **SpO₂ 85%**.`,
        clinical_meaning: `**Respiratory depression** from **overdose** is a **medical emergency**. Priorities: **airway**, **oxygen/ventilation support**, **naloxone** if **opioid** suspected per protocol, **monitoring**.`,
        exam_relevance: `Traps: **walking** the client, **delaying** EMS.`,
        whatMattersMostEscalation: `**What matters most** is **reversing respiratory failure** and **transport** to **higher acuity** care.`,
        prioritizationNextActions: `1) **Airway**; **assist ventilation** per BLS.  
2) **Call** **EMS** if outpatient; **code/RRT** if inpatient.  
3) **Naloxone** per protocol when **opioid** suspected.  
4) **Monitor** for **re-sedation**.  
5) **Protect** **c-spine** if trauma coexists when hinted.`,
        rationaleDecisions: `**Why naloxone isn’t “punishment”**  
It’s **life-saving** in opioid toxicity when indicated.`,
        escalationSafetyTeaching: `**Escalation**  
**Re-sedation** after naloxone requires **continued monitoring**.`,
        takeaways: `• **RR 8 + hypoxia** = emergency.  
• Pair with **high-alert meds** gold.`,
      },
      us_np: {
        ...npStub,
        scenarioSetup: `A **client** with **MDD** reports **passive death wishes** but **denies plan** today; however, they **recently bought a firearm** and **feel hopeless** after job loss.`,
        clinical_meaning: `NP mental health visit: **risk stratification**—**means**, **recent stressor**, **hopelessness**—and **safety planning**: **means restriction counseling**, **warm handoff**, **crisis lines**, **possible ED** if **high risk** per framework in stem.`,
        exam_relevance: `NP traps: **“contract for safety”** as a substitute for **means reduction**; **no follow-up**; **missing** **lethal means**.`,
        whatMattersMostEscalation: `**What matters most** is **reducing imminent risk** and **documenting** **plan** for **follow-up** and **escalation**.`,
        prioritizationNextActions: `1) **Direct** questions on **ideation/plan/intent**; **access to means**.  
2) **Collaborate** on **means restriction** (firearm storage with trusted person, etc.) when appropriate.  
3) **Crisis resources** (988, local crisis) per practice.  
4) **ED referral** if **imminent risk**—**stem-dependent**.  
5) **Document** **decision** and **safety plan**.`,
        rationaleDecisions: `**Why firearm access matters**  
**Means** increases **lethality** of impulsive attempts.`,
        escalationSafetyTeaching: `**Safety**  
Clear **return** if **worsening ideation**, **intent**, or **psychosis**.`,
        takeaways: `• **Means + hopelessness** changes triage.  
• Pair with **clinical judgment** gold.`,
      },
    },
    preTest: qt([
      {
        question: "A client states they have a suicide plan and intent. What is the immediate priority?",
        options: [
          "Activate safety protocols, maintain continuous observation, notify provider, and remove/secure harmful items per policy.",
          "Promise complete confidentiality and take no further action.",
          "Leave the client alone to respect privacy.",
          "Discuss long-term career counseling first.",
        ],
        correct: 0,
        rationale:
          "Imminent suicide risk requires immediate safety measures, observation, and team activation; confidentiality does not override safety.",
      },
      {
        question: "Why is naloxone relevant in suspected opioid overdose with respiratory depression?",
        options: [
          "It can reverse opioid effects and restore breathing when indicated—per protocol and training.",
          "It treats all overdoses including stimulants only.",
          "It replaces intubation always.",
          "It is contraindicated in all unresponsive patients.",
        ],
        correct: 0,
        rationale:
          "Naloxone reverses opioid-induced respiratory depression in many exam scenarios; follow airway management and monitoring for re-sedation.",
      },
      {
        question: "Which question best assesses suicide risk in a structured way?",
        options: [
          "Ask directly about thoughts, plan, intent, means, and prior attempts.",
          "Avoid the topic to prevent ideas.",
          "Ask only about sleep hygiene.",
          "Assume risk is zero if the client smiles.",
        ],
        correct: 0,
        rationale:
          "Direct, non-judgmental questioning is the standard approach to assess suicidal ideation and risk factors.",
      },
    ]),
    postTest: qt([
      {
        question: "A family requests removing suicide precautions for convenience. What is the best RN response?",
        options: [
          "Explain that precautions follow provider orders for safety and involve the treatment team for any changes.",
          "Agree immediately without assessment.",
          "Turn off monitoring secretly.",
          "Discharge the client against medical advice without evaluation.",
        ],
        correct: 0,
        rationale:
          "Suicide precautions are not negotiable based on convenience; follow orders and escalate to the provider for clinical reassessment.",
      },
      {
        question: "After naloxone administration, what monitoring priority is most important?",
        options: [
          "Watch for re-sedation and recurrent respiratory depression; maintain readiness to re-dose/support breathing per protocol.",
          "Discharge immediately without observation.",
          "Ignore oxygen saturation.",
          "Assume full recovery permanently after one dose.",
        ],
        correct: 0,
        rationale:
          "Opioids can outlast naloxone; continued monitoring addresses re-sedation risk.",
      },
      {
        question: "Which environmental intervention supports suicide safety on an inpatient unit?",
        options: [
          "Removing ligature risks and sharps, maintaining observation levels per order, and using break-resistant fixtures when applicable.",
          "Providing belts and razors for independence.",
          "Leaving the client alone in a bathroom indefinitely.",
          "Removing all documentation requirements.",
        ],
        correct: 0,
        rationale:
          "Environmental modifications and observation levels reduce opportunities for self-harm in acute settings.",
      },
    ]),
  },
];
