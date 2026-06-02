/**
 * RN lesson fix batch 1 — extra catalog bodies (US/CA RN pathways via shared slugs).
 * Merges with batch-2 patches so one apply pass finishes overlapping editorial work.
 */
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

import { BATCH2_CATALOG_PATCHES } from "./batch2-catalog-patches";

type Patch = { sections: PathwayLessonRecord["sections"] };

export const RN_BATCH1_EXTRA_CATALOG_PATCHES: Record<string, Patch> = {
  "acute-pancreatitis-nursing-care": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Acute pancreatitis** is **inflammation of the pancreas**—often related to **gallstones** or **alcohol**, sometimes **hypertriglyceridemia**, **ERCP**, or **trauma**. It ranges from **mild** (pain + nausea) to **necrotizing** disease with **SIRS**, **organ failure**, and **hypovolemic shock** themes.

NCLEX-RN rewards linking **epigastric pain radiating to the back**, **nausea/vomiting**, **fever**, and **tenderness** with **priority nursing actions**: **NPO**, **IV access**, **aggressive monitoring**, **labs per orders**, and **early escalation** for **hypotension** or **altered mentation**. You are not expected to interpret CT independently, but you must recognize **hemodynamic collapse** and **hypocalcemia** risk patterns when the stem provides data.

Pair with [fluid balance](LESSON:fluid-balance-acute-care), [DKA vs HHS](LESSON:dka-vs-hhs-priorities-hy), and [shock recognition](LESSON:shock-recognition-fluids) when metabolic and perfusion pictures overlap.

**Depth:** Teaching also includes **alcohol cessation support** referrals when pancreatitis is alcohol-related, **gallstone** education when biliary cause is suspected, and **when to return** for **worsening pain**, **new fever**, or **breathing difficulty**—after acute stabilization, not during it.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Boards test **priority**: **NPO status**, **pain control** without masking instability, **frequent vitals**, **strict I&O**, and **recognizing hypovolemia** before routine teaching. Traps include **starting diet early**, **opioids** without monitoring perfusion, or **ignoring new confusion** (possible worsening systemic inflammation or hypoxia).

Medication items may include **proton pump inhibitors**, **antiemetics**, and **IV fluids**—your role is **safe administration**, **monitoring for fluid overload** if cardiac comorbidity exists, and **clear reporting** of **worsening pain**, **rising lactate themes**, or **new oliguria**.

**Synthesis items** often stack **GI bleeding** risk (NSAIDs) against **pain control**—choose the option that follows **orders** and **monitors** for **GI bleed** signs rather than unsupervised OTC counseling.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Presentation**: severe **epigastric** pain (belt-like to back), **nausea/vomiting**, **fever**, **tachycardia**; **Cullen/Grey Turner** are rare exam pearls when shown.
- **Labs (stem-dependent)**: **lipase/amylase**, **CBC**, **BMP**, **glucose**, **calcium**, **triglycerides** themes; **lactate** when sepsis concern.
- **Complications**: **pseudocyst**, **necrosis**, **ARDS**, **AKI**, **hypocalcemia** with tetany—watch **Chvostek/Trousseau** themes.
- **Nursing care**: **NPO**, **IV fluids per orders**, **pain assessment**, **oxygen**, **telemetry** when indicated, **DVT prophylaxis** when safe, **glucose monitoring**, **seizure precautions** if severe hypocalcemia risk.
- **Hemodynamic support**: trend **MAP**, **urine output**, and **mentation**—pancreatitis can evolve into **shock** requiring **ICU**-level resuscitation per protocol.

**Safety:** Avoid **morphine myths** as a trick—follow the stem’s medication story; prioritize **perfusion** and **oxygenation** over paperwork when instability appears.

**Integration:** When the stem adds **hypertriglyceridemia** or **alcohol**, your teaching focus shifts to **long-term risk reduction** after acute care—still not during active instability.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 46-year-old client **reports sudden severe upper abdominal pain** radiating to the **back** with **repeated vomiting**. They appear **diaphoretic**; BP **98/62**, HR **118**, **tender** epigastrium with **guarding**. They **report** dizziness when standing.

**Fork:** Treat as **acute abdomen with shock risk**—**NPO**, **IV access**, **notify provider**, **continuous monitoring**, and **prepare for labs/imaging** per orders. Do **not** offer **oral intake** or **routine ambulation** before stability.

**Clinical application:** Repeat **vitals** after **antiemetics** or **fluids**; watch for **new hypoxia** (ARDS risk) and **decreasing urine output** (renal hypoperfusion). Communicate **objective trends** in **SBAR**.

If **BP falls** or **urine output** drops, escalate early—pancreatitis can progress to **systemic** illness quickly; your documentation should capture **objective trends** for safe handoff.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Severe epigastric pain + vomiting + tachycardia** should be taken seriously—assume **volume depletion** and **complication risk** until evaluation clears you.
- **NPO + monitoring + escalation** beat **oral diet** or **discharge teaching** during acute instability.
- Watch **calcium**, **glucose**, and **renal function** trends—pancreatitis often has **multisystem** impact on exams.

**NCLEX drill:** If two answers both sound “supportive,” pick the one that **secures perfusion and monitoring** (IV access, provider notification, frequent reassessment) before the one that emphasizes **patient education** or **routine tasks** during acute pain with hypotension.

**Closing synthesis:** Pancreatitis items reward **recognizing when a GI complaint is actually a resuscitation problem**—pair abdominal findings with **vitals, urine output, and oxygenation** every time.

**Related:** [gallstone/GI overlap](LESSON:gerd-pud-bleeding-clues) · [AKI prerenal vs intrarenal](LESSON:aki-prerenal-vs-intrarenal) · [sepsis recognition](LESSON:sepsis-early-recognition-hy) · [bowel obstruction](LESSON:bowel-obstruction-vs-paralytic-ileus) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "addisonian-crisis": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Addisonian crisis** is **acute adrenal insufficiency**—a life-threatening deficiency of **cortisol** and often **aldosterone**—triggered by **infection**, **surgery stress**, **missed steroid doses**, or **abrupt steroid withdrawal**. Clients may present with **hypotension refractory to fluids**, **hyponatremia**, **hyperkalemia**, **hypoglycemia**, and **GI symptoms**.

NCLEX-RN tests whether you recognize **shock with salt/water loss** patterns and prioritize **provider notification**, **hemodynamic monitoring**, **IV access**, and **stress-dose steroid themes** as **provider-ordered** rescue—rather than “routine fluids alone” without addressing adrenal crisis suspicion.

**Primary vs secondary AI:** primary destruction of the adrenals may show **hyperpigmentation** and **salt craving** chronically; **pituitary/secondary** failure may lack hyperpigmentation but still produces crisis when **cortisol** collapses—either way, **perfusion and glucose** threats drive triage.

Link to [fluid deficit](LESSON:fluid-volume-deficit), [hypo/hyperkalemia](LESSON:hypo-vs-hyperkalemia-hy), and [shock](LESSON:shock-recognition-fluids) when the stem mixes electrolytes and perfusion.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners punish **delaying steroids** when **refractory hypotension** + **hyperkalemia** + **hyponatremia** suggest adrenal crisis. They reward **history-taking** for **chronic steroid use**, **autoimmune adrenalitis**, or **recent infection**.

Traps: **large crystalloid boluses** without **corticosteroid replacement** when crisis is likely; **insulin** for hyperkalemia without recognizing **hypoglycemia risk** in adrenal crisis—follow the stem’s priorities.

**Synthesis:** Items may pair **fever** + **hypotension** and tempt you toward **sepsis-only** pathways—remember **steroid-dependent** clients can have **both** infection and **adrenal crisis**; communication and **monitoring breadth** matter.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Clues**: fatigue, **hyperpigmentation** (primary chronic AI—may not appear in acute crisis vignette), **salt craving**, **hypotension**, **hyponatremia**, **hyperkalemia**, **hypoglycemia**, **nausea**.
- **Crisis triggers**: missed steroids, infection, trauma/surgery, pituitary/apoplexy themes in secondary AI when tested.
- **Therapy themes**: **IV hydrocortisone** stress dosing per protocol; **fluid resuscitation** with **dextrose** if hypoglycemic—provider-led.
- **Monitoring**: **glucose**, **K⁺**, **Na⁺**, **BP**, **I&O**, **ECG** for **peaked T waves** with hyperkalemia.
- **Cardiac risk**: **hyperkalemia** can **destabilize rhythm**—continuous telemetry when severe; prepare **calcium therapy** per ACLS/policy themes when indicated.
- **Education (stable phase)**: **stress dosing** plans for illness, **injectable hydrocortisone** for emergency use when prescribed, **wear medical identification**.

**Nursing priority:** treat **perfusion and glucose** threats early; avoid **oral steroids alone** in unstable crisis vignettes.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 38-year-old client with known **primary adrenal insufficiency** **reports** **profound weakness**, **nausea**, and **dizziness**. BP **82/50**, HR **122**, glucose **54 mg/dL**, **K⁺ 6.1 mEq/L**, **Na⁺ 126 mEq/L**.

**Fork:** This is **Addisonian crisis until proven otherwise**—**notify provider immediately**, **monitor cardiac rhythm**, **prepare for IV dextrose** per order, and **anticipate stress-dose steroids**—not “finish breakfast” first.

**Clinical application:** Reassess **BP** after **dextrose**; repeat **K⁺** and **ECG** after therapies that shift potassium—communicate **widening QRS** or **peaked T waves** urgently.

**Assessment** should include **orthostatic symptoms**, **recent steroid adherence**, and **infection signs**—communicate clearly in **SBAR**.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Refractory hypotension + hyponatremia + hyperkalemia + hypoglycemia** is a classic **adrenal crisis** cluster—escalate early.
- **Steroid stress dosing** is not independent nursing prescribing—your job is **recognition**, **monitoring**, and **rapid communication**.
- **Hyperkalemia** in this context needs **holistic management**—follow orders; avoid tunnel vision on a single lab line.

**NCLEX drill:** If **hypoglycemia** and **hypotension** coexist with **known adrenal disease**, prioritize **dextrose + steroid pathway communication** over isolated “fluid bolus only” answers that ignore steroid physiology.

**Closing:** Stable clients need **Medic-Alert**, **sick-day steroid instructions**, and **never abrupt steroid cessation**—teach only when acute threats are controlled.

**Related:** [Cushing assessment](LESSON:cushing-syndrome-assessment) · [thyroid storm](LESSON:thyroid-storm-myxedema-clues) · [fluid deficit](LESSON:fluid-volume-deficit) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "aki-prerenal-vs-intrarenal": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Acute kidney injury (AKI)** is a rapid rise in **creatinine** or drop in **urine output** that signals **nephron stress** or damage. **Prerenal AKI** reflects **renal hypoperfusion** from **hypovolemia**, **low cardiac output**, **sepsis with vasodilation**, or **renal artery** problems—tubules are often **still viable** if perfusion is restored quickly. **Intrarenal (intrinsic)** AKI includes **acute tubular necrosis (ATN)** after ischemia or **nephrotoxins**, **glomerular** processes, **AIN**, and **myoglobinuria** themes when the stem provides clues.

NCLEX-RN rewards linking **volume status**, **medication timing** (NSAIDs, ACE inhibitors/ARBs in hypovolemia, aminoglycosides, IV contrast), and **urine/cast clues** with **priority nursing actions**: **perfusion assessment**, **strict I&O**, **avoid stacking nephrotoxins** when orders allow clarification, and **notify** for **creatinine jumps** with **symptoms** or **hyperkalemia** risk.

Use [fluid deficit](LESSON:fluid-volume-deficit), [heart failure priorities](LESSON:heart-failure-nursing-priorities-hy), and [sepsis recognition](LESSON:sepsis-early-recognition-hy) when the driver is systemic rather than “kidneys alone.”`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `When labs provide **fractional excretion** patterns, **low FENa** supports **prerenal** physiology; intrinsic injury may show different indices in specialty stems—but many items stay **clinical**. Examiners punish **continuing NSAIDs** in hypovolemia, **diuretics** when the real problem is **preload**, and **ignoring oliguria** while completing lower-priority tasks.

They reward **holding or clarifying** renin–angiotensin blockers in obvious **hypoperfusion**, **fluid resuscitation** when appropriate, and **cardiac monitoring** when **hyperkalemia** is possible. Traps include **fluid boluses** in **pulmonary edema** without recognizing mixed pictures—read **lung sounds**, **JVP**, and **oxygenation** before choosing volume.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Prerenal**: rising **BUN:creatinine** ratio may appear; **FENa** often **low** when shown; **hyaline casts** possible; **improves** when perfusion is corrected if injury is not yet established.
- **Intrinsic ATN**: **muddy brown granular casts** themes, prolonged **oliguria**, **medication/toxin** exposure; recovery can lag days.
- **Postrenal** obstruction: **BPH**, **stones**, **foley kinks**—fix drainage before labeling intrinsic failure.
- **Nursing monitoring**: **hourly or strict I&O**, **daily weights**, **orthostatic vitals** when safe, **K⁺** and **acid–base** trends, **neuro checks** for uremic symptoms, **skin** for edema vs dehydration, **medication reconciliation** for nephrotoxins, **dialysis access** protection if renal replacement is planned.

**Priority:** If the vignette screams **hypovolemia**, treat **perfusion** first; intrinsic labels require **evidence**, not habit.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 72-year-old client **reports** **dizziness** and **minimal urine** for 12 hours after **two days of vomiting and poor intake**. **Assessment** shows **dry mucous membranes**, **supine BP 88/54**, **HR 112**, **cool extremities**, and **creatinine** above baseline. **Indwelling catheter** output is **15 mL/hr** despite adequate placement.

**Fork:** This is **AKI with prerenal physiology** until proven otherwise—**notify the provider**, **review home meds** (ACE inhibitor, diuretic, NSAID), **document objective volume deficit**, and **prepare for isotonic fluid therapy** per orders—not **scheduled diuretics** or **routine oral fluids** if **NPO** or **unstable**.

**Clinical application:** Reassess **BP**, **heart rate**, and **urine output** after ordered boluses; watch for **crackles** or **rising oxygen needs** if cardiac comorbidity exists. Communicate **worsening potassium** or **mental status changes** immediately—**hyperkalemia** and **uremia** change triage.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Creatinine rise + hypoperfusion data** → **prerenal first**; restore **perfusion** when the stem supports it and orders align.
- **Medications** can convert mild illness into **AKI**—your voice matters for **timing** and **clarification** within scope.
- **Oliguria with rising creatinine** is an **escalation trigger**, not a watch-and-wait finding.

**NCLEX drill:** If two answers both “give fluids,” pick the one paired with **reassessment**, **provider communication**, and **medication review** over the one that **only documents** or **delegates unstable assessment**.

**Related:** [dialysis access care](LESSON:hemodialysis-access-care) · [potassium emergencies](LESSON:hypo-vs-hyperkalemia-hy) · [fluid excess](LESSON:fluid-volume-excess) · [Canada RN hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "alcohol-withdrawal-ciwa": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Alcohol withdrawal** spans **mild tremor and anxiety** to **hallucinations**, **withdrawal seizures**, and **delirium tremens (DT)** with **autonomic instability**—tachycardia, hypertension, fever, and diaphoresis. **CIWA-Ar** (or your facility’s validated tool) standardizes **symptom scoring** so **benzodiazepines** can be **titrated** to objective withdrawal severity rather than guesswork—reducing **undertreatment** (seizures, arrhythmia) and **overtreatment** (respiratory depression), especially with **opioids** or **sedatives** on board.

NCLEX-RN tests **frequent reassessment**, **seizure precautions**, **thiamine before IV glucose** when refeeding risk exists, **electrolyte repletion** (Mg, K, phosphate) awareness, and **environmental safety** (falls, aspiration, elopement). **Airway, breathing, circulation** stay first when **DT** or **seizure** is suspected.

**Urgent** escalation is appropriate when autonomic signs worsen—**avoid** minimizing withdrawal as “just anxiety.” **Monitor** vitals and CIWA trends together; do not rely on a single data point.

Pair with [fluid deficit](LESSON:fluid-volume-deficit) and [GI bleeding](LESSON:gi-bleed-assessment) when **cirrhosis** or **varices** complicate the picture; use [increased ICP](LESSON:increased-icp-positioning) only when neuro stem overlap is explicit.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners punish **sedation without monitoring** and **missing seizure prophylaxis escalation** when scores climb. They reward **CIWA on schedule**, **1:1 observation** when indicated, **low-stimulus environment**, **reorientation**, and **provider notification** for **refractory withdrawal**. **Thiamine before glucose** prevents **Wernicke encephalopathy**—a classic safety trap.

**Beta blockers** or **clonidine** may mask **tachycardia/tremor** and distort scoring—follow the stem’s monitoring plan. Items may stack **infection** or **head injury**—withdrawal does not exclude **sepsis**; **prioritize assessment** that explains **fever** or **focal neuro deficits**.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Timeline**: peak severity often **24–72 hours** after last drink—exact timing is **stem-specific**; co-ingestions or **metabolic stress** can accelerate presentation.
- **Major signs**: **tremor**, **nausea/vomiting**, **diaphoresis**, **hypertension**, **tachycardia**, **agitation**, **hallucinations**, **seizures**—each can worsen rapidly without treatment.
- **DT**: **severe confusion**, **autonomic storm**, **possible fever**—think **ICU**-level monitoring, **airway** readiness, and **1:1** observation themes.
- **CIWA-driven care**: score **per schedule**, treat per order set, reassess after interventions—document **objective** elements (tremor, diaphoresis, orientation) rather than vague “doing okay.”
- **Nursing bundle**: **seizure and fall precautions**, **aspiration precautions** if altered, **IV access**, **rehydration**, **glucose checks**, **electrolyte monitoring**, **thiamine/multivitamin** support per orders, **restraint only** as last resort with continuous monitoring per policy.
- **Environment**: **low stimuli**, **reorientation**, **frequent reassurance within safety**—not a substitute for **medication escalation** when scores climb.
- **Co-ingestions:** **Benzodiazepines** or **opioids** on board increase **respiratory depression** risk—pair **CIWA** with **RR**, **SpO₂**, and **sedation** checks per policy.

**Priority:** Escalate when **scores rise** or **vitals worsen**—withdrawal is a **dynamic** emergency, not a static comfort problem.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 54-year-old client **reports** **shaking**, **nausea**, and **visual hallucinations** 36 hours after **last drink**. **Assessment**: BP **168/94**, HR **118**, **diaphoretic**, **agitated**, **oriented to person only**. CIWA score maps to **high** withdrawal per protocol.

**Fork:** **Increase monitoring frequency**, **notify provider** for **benzodiazepine therapy** per order set, maintain **safety** (consider **1:1**), **dim lights** and **reduce stimuli**, and **stay with the client** during **toileting**. Do **not** choose **routine discharge teaching** or **solo ambulation** while **unstable**.

**Clinical application:** If a **seizure** occurs, implement **seizure precautions**, **protect the airway**, **call for help**, **time the event**, and prepare for **additional orders**. Document **objective CIWA elements** and **response to interventions** for safe handoff.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Autonomic surge + agitation + hallucinations** can progress to **seizure or DT**—treat escalation as **time-sensitive**, not “behavioral only.”
- **CIWA** exists to **drive therapy timing**—pair scores with **vitals** and **neuro status** every pass.
- **Thiamine**, **glucose**, and **electrolytes** are recurring **safety pairs** with alcohol-related admissions.

**NCLEX drill:** When withdrawal competes with **busy unit** distractors, pick **assessment + provider notification + safety** before **delegation** or **routine tasks**.

**Closing synthesis:** Treat alcohol withdrawal as a **toxic-metabolic emergency** that can **seize**, **aspirate**, or **arrest** care teams that focus on paperwork instead of **bedside data**.

**Takeaway drill:** Before leaving the room, ask whether **vitals**, **CIWA trend**, and **airway** status are safer than when you entered—if not, **stay** or **escalate** per policy.

**Related:** [seizure precautions](LESSON:seizure-precautions-rescue-meds) · [liver failure / HE](LESSON:liver-failure-hepatic-encephalopathy) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "anemia-types-transfusion-thresholds": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Anemia** means **reduced oxygen delivery** from **low hemoglobin/hematocrit**—commonly **blood loss**, **decreased marrow production**, **hemolysis**, or **dilution** in fluid resuscitation. Clients may show **fatigue**, **dyspnea on exertion**, **pallor**, **tachycardia**, **chest pain** in **CAD**, or **hypotension** when acute. NCLEX-RN emphasizes **symptom context**, **comorbidity**, and **safe transfusion practice**: **two-person verification**, **baseline vitals**, **continuous presence** during the **first phase** of infusion, **immediate pause** for **reaction** symptoms, and **clear escalation** to provider and blood bank.

**Transfusion thresholds** are **not one number for everyone**—**active bleeding**, **ischemic symptoms**, **hemodynamic instability**, and **oxygenation failure** shift decisions. Your role is **meticulous monitoring**, **objective documentation**, and **reaction management** per protocol—not independent prescribing.

Connect [GI bleeding](LESSON:gi-bleed-assessment), [transfusion reactions](LESSON:transfusion-reaction-recognition), and [hypovolemia](LESSON:fluid-volume-deficit) when hemorrhage or resuscitation drives the stem.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Boards test **acute hemolytic** and **febrile non-hemolytic** reaction recognition: **chills**, **fever**, **flank/back pain**, **hypotension**, **dark urine**, **anxiety**—and the **first action** to **stop the infusion** and **maintain saline**-locked access. They punish **walking away** during the **high-risk window** and **restarting** products after **severe reaction** without explicit orders and investigation.

They also test **chronic anemia teaching**—**oral iron** with **vitamin C** pairing when appropriate, **B₁₂ injection** adherence, **folate** causes—distinct from **emergency transfusion** scenarios. **Massive transfusion** items may add **hypocalcemia**, **hyperkalemia**, and **coagulopathy** monitoring themes.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Mechanism buckets**: **iron deficiency** (chronic loss, pregnancy, poor intake), **B₁₂/folate** (megaloblastic patterns when shown), **hemolytic** (jaundice, elevated LDH themes), **anemia of chronic disease/inflammation**, **aplastic** rare stem clues.
- **Pre-transfusion nursing**: verify **patient identity** and **product** at bedside per policy, confirm **consent**, **baseline vitals**, **patent IV** with **compatible fluid** (usually **normal saline**).
- **During transfusion**: **initial rate** per protocol, **stay** for **early monitoring**, **watch** for **urticaria**, **respiratory** changes, **pain**, **fever**; **slow** only if **mild** and per policy—**stop** if **severe**.
- **After**: monitor **hemoglobin response**, **volume overload** in cardiac clients, **delayed hemolytic** themes, **infection** surveillance per facility education.

**Safety:** **Stop**, **assess**, **notify**, **preserve product and tubing** for lab when directed—**speed** never outweighs **reaction recognition**.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** Ten minutes after starting **packed RBCs**, the client **reports** **sudden chills**, **itching**, and **burning** along the **lower back**. HR **112**, BP **98/60**, **anxious**. You note **flushed skin** and **rigors**.

**Fork:** **Stop the transfusion immediately** per protocol, **keep IV access** with **normal saline** per policy, **notify provider and blood bank**, **monitor vitals** at high frequency, and **stay at bedside**. Do **not** choose **“slow the rate”** as your only action when **hemolysis** is suspected.

**Clinical application:** Document **time of onset**, **vitals**, **symptoms**, and **volume infused**. Prepare for **additional labs** and **urine assessment** if **hemoglobinuria** is a concern. **Reassure** only **after** **life threats** are ruled out and orders are in place.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **New symptom during transfusion** = **pause and assess**—**stop** when **severe** or **protocol indicates**.
- **Verification and monitoring** are **non-negotiable** nursing controls on harm.
- **Chronic anemia** and **acute hemorrhage** are **different teaching tracks**—match education to **stability** and **orders**.

**NCLEX drill:** If **back pain + hypotension + fever** cluster during blood, pick **stop infusion + maintain access + notify** before **antipyretics alone** or **continuing the bag**.

**Longitudinal teaching:** Stable outpatients with **iron deficiency** need **follow-up labs** and **tolerance** checks for oral therapy; transfusion teaching for **home** focuses on **when to return** for **fever**, **dark urine**, or **breathing** changes if future products are planned.

**Related:** [transfusion reaction recognition](LESSON:transfusion-reaction-recognition) · [GI bleed assessment](LESSON:gi-bleed-assessment) · [Canada RN hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "assignment-vs-delegation": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Assignment** is how the nurse leader **distributes clients and tasks** across the team for a shift. **Delegation** is the **RN’s transfer of a specific task** to a **competent caregiver** while **retaining accountability** for **nursing judgment**, **supervision**, and **evaluation** of outcomes. NCLEX-RN uses **NCSBN delegation frameworks**: match **task complexity** to **license/education**, ensure **stable and predictable** situations for **UAP** tasks, and **communicate clear instructions** with **feedback loops**.

You **do not delegate** the **nursing process** pieces that require **RN-level assessment**—initial and ongoing evaluation of **unstable** clients, **teaching that requires RN analysis**, or **clinical decision-making** that cannot be scripted as a routine task.

Pair with [legal / practice act](LESSON:legal-nurse-practice-act) and [QI / safety reporting](LESSON:qi-incident-reporting) when systems or scope conflicts appear in the stem.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners combine **prioritization** with **delegation**: **unstable** vs **stable** clients, **new abnormal findings** vs **chronic maintenance**. Traps include sending a **UAP** to obtain **vitals** on a client with **new chest pain** while the RN finishes **charting**, or delegating **insulin administration** to someone **outside scope**. The **five rights**—**right task, circumstance, person, communication, supervision**—anchor reasoning.

They also test **LPN/LVN** vs **RN** boundaries using **state-style** hints: **wound care with parameters**, **stable medication administration**, **data collection** vs **assessment synthesis**. When the stem emphasizes **teaching** or **evaluation of learning**, the **RN** usually retains ownership.

**Safety language boards expect:** **Avoid** delegating tasks that require **urgent** nursing judgment; **monitor** the client after delegated tasks when instability could emerge.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **UAP-appropriate examples** (when **stable**): **bedmaking**, **ambulation** with assist, **I&O**, **routine feeding** for independent eaters, **specimen** drop-off when not requiring interpretation, **transport** of stable clients.
- **RN retains**: **head-to-toe assessment** for **changes**, **care planning**, **patient education** requiring **evaluation**, **IV pushes** where restricted, **blood administration** oversight, **discharge teaching** for high-risk meds.
- **LPN/LVN** (stem-dependent): **dressing changes** within parameters, **some medication passes**, **focused assessments** per state/facility—**never independent** of RN oversight when **unstable**.
- **Unstable triggers**: **hypotension**, **new hypoxia**, **acute pain** with **peritoneal** signs, **neuro change**, **active bleeding**—**RN at bedside first**.

**Priority:** If delegation would **delay recognition** of deterioration, **do it yourself** or **reprioritize** other work.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A **UAP** asks whether to **ambulate** a **post-op day 1** client who now **reports severe worsening abdominal pain** and appears **diaphoretic** with **guarding**. You are juggling **four** clients.

**Fork:** **Do not delegate ambulation or “reassurance.”** **Go to the client**, perform a **focused assessment**, **notify the surgeon/provider**, and **prepare for possible emergency workup**. Redirect the UAP to **stable tasks** (water for another client, stocking) that do **not** replace **RN assessment**.

**Clinical application:** Document **objective findings**—**vitals**, **pain pattern**, **bowel sounds** if ordered, **incision** if visible—then **communicate in SBAR**. Your **priority** is **identifying surgical emergency** risk, not **finishing charting** first.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Delegation transfers task execution—not accountability** for safe outcomes.
- **Unstable or new findings** reclaim **RN attention**; **busy** never justifies **skipped assessment**.
- **Scope** follows **state rules + facility policy**; NCLEX rewards **safe sequencing** over **efficiency theater**.

**NCLEX drill:** If one answer **delegates assessment** of **new chest pain** and another has the **RN assess first**, pick **RN assessment** unless the stem clearly shows **stable chronic** symptoms.

**Related:** [ethical distress / advocacy](LESSON:ethical-distress-advocacy) · [New Grad transition hub](/us/rn/new-grad-transition/lessons) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "bowel-obstruction-vs-paralytic-ileus": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Mechanical bowel obstruction** is a **physical blockage**—adhesions, hernia, tumor, volvulus—producing **colicky pain**, **abdominal distension**, **vomiting** (earlier and more **bilious** in **proximal** obstruction; **feculent** themes in **distal** severe cases), and often **obstipation**. **Paralytic (adynamic) ileus** is **loss of coordinated peristalsis** without a discrete mechanical lesion—common **post-operatively**, with **opioids**, **electrolyte disturbances** (hypokalemia), **peritonitis**, or **metabolic** stress—often **diffuse distension** with **hypoactive** or **absent** bowel sounds.

NCLEX-RN tests **NPO status**, **nasogastric decompression** when ordered, **strict I&O**, **electrolyte monitoring**, **pain control without masking** **peritoneal catastrophe**, and **early escalation** for **strangulation** or **perforation** (**fever**, **rebound**, **rigid abdomen**, **worsening pain**).

Link [acute pancreatitis](LESSON:acute-pancreatitis-nursing-care) and [hypovolemia](LESSON:fluid-volume-deficit) when vomiting and third-spacing threaten perfusion.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners reward **recognizing surgical abdomen**—**constant pain**, **peritoneal signs**, **tachycardia**, **fever**—over **“routine post-op pain.”** They punish **oral intake** or **gastric feeding** during **unresolved obstruction** workup, and **heavy opioids** without **frequent abdominal reassessment** when **perfusion** is at risk.

**Bowel sounds** alone mislead: **high-pitched tinkling** may suggest **mechanical** obstruction; **ileus** may show **quiet** abdomen—always integrate **pain pattern**, **vitals**, **imaging/labs** when provided. **NG tube** items test **patency**, **suction settings**, **oral care**, and **monitoring for electrolyte loss**.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Mechanical obstruction**: **colicky waves** of pain, **visible peristalsis** rarely tested, **vomiting**, **distension**; **closed-loop** / **strangulation** → **constant pain**, **toxic** appearance—**surgical emergency** themes.
- **Paralytic ileus**: **post-op** timeline, **narcotic** effect, **hypokalemia**; management emphasizes **supportive care**, **correct precipitants**, **mobility** when safe, **minimize ileus-promoting factors** per orders.
- **Nursing bundle**: **NPO**, **IV fluids** per orders, **NG** to **low intermittent suction** when prescribed, **strict I&O**, **daily abdominal inspection**, **electrolyte replacement**, **DVT prophylaxis** when not contraindicated, **prepare OR** if **peritoneal** exam worsens.

**Priority:** **Fever + focal tenderness + instability** outranks **comfort measures**—communicate early.

**Integration:** Compare **proximal** vs **distal** obstruction patterns when the stem provides **emesis** timing and **flatus** history; nursing **red flags** for **strangulation** (**constant pain**, **toxic appearance**, **peritoneal** signs) stay consistent across subtypes.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A client **reports** **waves of cramping pain** and **bilious vomiting** for **24 hours**. Abdomen is **distended**; auscultation reveals **high-pitched** sounds. HR **104**, BP **108/70**, **no flatus**, **last BM** unknown.

**Fork:** **NPO**, **notify provider**, **IV access**, **prepare for imaging/surgical consult**, and **monitor** for **peritoneal** changes. Do **not** administer **oral medications** or **promote PO intake** until **cleared**.

**Clinical application:** If **rebound**, **rigidity**, or **WBC** spike appears, treat as **acute abdomen**—**escalate** and **avoid masking** with **sedation** alone. Document **pain** pattern shift from **colicky** to **constant**—that **red flag** belongs in **handoff**.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Colicky pain + distension + vomiting** → **mechanical obstruction** until imaging rules otherwise; **support decompression** and **monitor perfusion**.
- **Ileus** often improves as **contributors** are corrected—**different** timeline than **strangulation**.
- **Peritoneal signs** and **hemodynamic** shifts define **urgency**—not **bowel sounds** in isolation.

**NCLEX drill:** If **fever + rigid abdomen** appear, pick **notify provider / surgical escalation** before **routine ambulation** or **oral analgesics** alone.

**Takeaway discipline:** Document **pain pattern** (colicky vs constant), **last flatus**, and **emesis** character—those details help **providers** decide between **conservative**, **endoscopic**, or **operative** pathways.

**Related:** [enteral feeding tube safety](LESSON:enteral-feeding-tube-safety) · [acute pancreatitis](LESSON:acute-pancreatitis-nursing-care) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "burn-depth-fluid-resuscitation-basics": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Thermal burns** are classified by **depth** (superficial, partial-thickness, full-thickness patterns), **total body surface area (TBSA)** involved, **mechanism** (flame, scald, chemical, electrical), and **inhalation injury** risk. **Major burns** trigger **systemic inflammation** and **capillary leak**, producing **hypovolemic shock** physiology—**isotonic fluid resuscitation** follows **provider protocols** (Parkland-style formulas are common teaching anchors) with **urine output** as a monitored **endpoint**, not a nurse-calculated independent prescription.

NCLEX-RN emphasizes **airway before everything** when **facial burns**, **soot**, **singed nasal hairs**, **hoarseness**, or **closed-space** fire exposure appear. **Pain**, **infection prevention**, **tetanus**, **hypothermia avoidance** (warm fluids/environment), and **wound protection** layer into recovery phases.

Pair with [shock recognition](LESSON:shock-recognition-fluids), [hypovolemia](LESSON:fluid-volume-deficit), and [wound infection vs colonization](LESSON:wound-infection-vs-colonization) across the care trajectory.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners punish **missed airway** when **voice change**, **stridor**, or **soot** appear, and **hypothermia** from **cold irrigation** without **warming measures**. They reward **high-flow oxygen** when indicated, **carboxyhemoglobin** thinking in **smoke exposure**, and **Foley catheter** for **hourly UOP** tracking in **large burns** per protocol.

Traps include **oral rehydration** for **major TBSA**, **NSAIDs alone** for **severe pain** without **perfusion** assessment, or **tight circumferential** extremity burns without **circulation** monitoring—watch **compartment** and **escharotomy** themes when tested.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Depth**: **erythema** (superficial) → **blistering painful** partial → **waxy/white leathery** insensate full-thickness patterns on exams.
- **Inhalation**: **soot**, **carbonaceous sputum**, **facial burns**, **voice changes** → **advanced airway** may be imminent—**continuous monitoring**.
- **Fluids**: **isotonic resuscitation** per burn center protocol; titrate using **UOP**, **mental status**, **lactate** themes, **base deficit** when shown—**communicate** inadequate endpoints.
- **Nursing monitoring**: **strict I&O**, **hourly UOP**, **core temperature**, **glucose** (stress hyperglycemia), **electrolytes**, **pain reassessment**, **elevate extremities** if ordered, **tetanus**, **infection signs** in later days.

**Electrical burns**: **hidden deep injury**, **dysrhythmia** risk—**telemetry** themes; **chemical burns**: **irrigation** priority per poison center direction.

**Surface care:** **Sterile** technique per unit standards, **avoid** **hypothermia** during **cooling** or **irrigation**, and **document** **TBSA** tools used so **fluid** orders match **assessment**.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A 32-year-old rescued from a **house fire** has **soot around the nares**, **facial burns**, **hoarse voice**, and **sooty sputum**. SpO₂ **93%** on room air; **tachypneic**, **anxious**.

**Fork:** **Airway-first triage**—**notify provider / activate emergency airway resources**, **continuous monitoring**, **avoid PO intake**, prepare for **possible intubation** per policy. This is **inhalation injury** risk, not a **minor topical** burn.

**Clinical application:** Reassess **voice**, **stridor**, **work of breathing**, and **mental status** frequently; **document trends** for **rapid sequence** decision-making. **Pain** and **anxiety** must be managed without **masking** **respiratory failure**.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Smoke exposure + airway symptoms** outrank **wound cosmetics**—think **oxygenation and airway** first.
- **Fluids** follow **protocol and endpoints**—your job is **tight monitoring** and **early reporting** of **inadequate UOP** or **altered perfusion**.
- **Hypothermia** during resuscitation worsens outcomes—**warm** environment and **warmed fluids** per orders.

**NCLEX drill:** If **hoarseness + facial burns + soot** cluster, pick **airway escalation pathway** before **wound dressing** alone.

**Closing:** Major burns are **systemic**—**renal**, **hematologic**, and **infection** risks evolve across days; **shift report** should highlight **UOP trends** and **new fever**, not only **dressing** changes.

**Related:** [pressure injury staging](LESSON:pressure-injury-staging) (different etiology) · [shock](LESSON:shock-recognition-fluids) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "calcium-tetany": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Hypocalcemia** increases **neuromuscular irritability**, producing **perioral paresthesias**, **muscle cramps**, **carpopedal spasm**, **laryngospasm**, **bronchospasm**, and **seizures** in severe cases. **Ionized calcium** is the physiologically active fraction; **albumin** and **pH** shift interpretation on exams. **ECG** may show **prolonged QT**—a pathway to **torsades** when paired with other triggers. Common causes include **post-thyroid/parathyroid surgery**, **vitamin D deficiency**, **chronic kidney disease**, **pancreatitis**, **massive transfusion**, **hyperphosphatemia**, and **magnesium depletion** that impairs PTH secretion or effect.

NCLEX-RN rewards **continuous cardiac monitoring** when **QT prolongation** is present, **airway vigilance** for **stridor**, **seizure precautions**, **IV calcium** preparations per orders for **symptomatic** or **ECG-threatening** hypocalcemia, and **magnesium repletion** when **hypomagnesemia** blocks correction.

Use [magnesium and arrhythmia](LESSON:magnesium-arrhythmia-risk) and [phosphate shifts](LESSON:phosphate-shifts-in-renal) when stems cluster **electrolytes** and **renal** failure.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners highlight **Chvostek** (facial twitch after tapping) and **Trousseau** (carpal spasm with BP cuff inflation) as **supporting** clues—not every client will have classic signs. They punish **prioritizing routine tasks** over **airway** or **telemetry** when **stridor**, **wheezing**, or **QT changes** appear. **QT prolongation** should trigger **arrhythmia precautions** and **provider notification** pathways.

Traps include treating **hypocalcemia** without addressing **magnesium**—boards love **refractory** calcium when **Mg** is low. Also watch **digitalis toxicity** sensitivity when **calcium** administration is nuanced—follow the stem’s medication story.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Presentation ladder**: **numbness/tingling** → **muscle spasms** → **laryngospasm/airway compromise** → **seizures** → **cardiac arrest** in extreme cases.
- **ECG**: **prolonged QT**; **monitor** for **dysrhythmia**; **replete** per ACLS-adjacent protocols when torsades appears—follow orders.
- **Therapy themes**: **IV calcium gluconate or chloride** for acute severe symptoms; **oral calcium + vitamin D** for chronic hypoparathyroid management—**provider-led**.
- **Nursing bundle**: **telemetry**, **airway assessment**, **seizure precautions**, **repeat ionized calcium/magnesium/phosphate**, **stridor** = **emergency** pathway, **document neuro changes** objectively.

- **Phosphate interplay:** **hyperphosphatemia** can **drive calcium** down—**renal failure** and **tumor lysis** themes may pair **both** on labs; therapy stays **order-driven**.

**Rule:** **Correct magnesium** when low—otherwise **PTH/vitamin D** pathways may not restore calcium effectively.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** Post-**thyroidectomy** day 1, a client **reports** **circumoral numbness** and **painful hand spasms**. **Chvostek** is positive; telemetry shows **QTc prolongation**. **Respiratory rate** is slightly elevated; voice sounds **tight**.

**Fork:** **Notify provider immediately**, **maintain continuous cardiac monitoring**, **obtain stat labs** including **ionized calcium** and **magnesium**, **prepare IV calcium** per protocol, and **stay at bedside** for **airway** changes. Do **not** defer assessment to **finish another client’s discharge**.

**Clinical application:** If **stridor** develops, activate **emergency airway** resources per policy; **reassess** after any **calcium bolus** for **rhythm** and **symptom** change.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Neck surgery + perioral tingling + spasms** → **hypocalcemia** until labs say otherwise.
- **QT prolongation** upgrades acuity—**monitoring** and **timely therapy** beat **reassurance**.
- **Magnesium** deficiency can **mimic or worsen** calcium problems—think **paired repletion**.

**NCLEX drill:** When **airway symptoms** and **ECG changes** coexist, pick **monitor + notify + prepare treatment** before **routine ambulation** or **oral diet advancement**.

**Summary discipline:** Repeat **ionized calcium** after therapy, watch **QTc** trends, and align **seizure precautions** with **actual** **neuro** status—not protocol labels alone.

**Related:** [thyroid storm / myxedema clues](LESSON:thyroid-storm-myxedema-clues) · [AKI](LESSON:aki-prerenal-vs-intrarenal) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "cushing-syndrome-assessment": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Cushing syndrome** is sustained **hypercortisolism**—often **exogenous glucocorticoids**, sometimes **endogenous** ACTH-dependent or independent tumors. Classic cues include **truncal obesity**, **moon facies**, **supraclavicular fat**, **buffalo hump**, **purple striae**, **thin skin** with easy **bruising**, **proximal muscle weakness**, **hypertension**, **hyperglycemia**, **mood** lability, **menstrual** changes, **osteopenia**, and **slow wound healing**. Nursing assessment emphasizes **glucose trends**, **blood pressure**, **infection surveillance**, **skin integrity**, **mood safety**, and **mobility** with **fall** precautions.

NCLEX-RN tests **recognition** of steroid-excess complications and **prioritization**—**infection** can be **subtle** when inflammation is suppressed; **hyperglycemia** may present as **polyuria**, **thirst**, or **confusion**. Contrast intentionally with **Addisonian** **hypocortisol** presentations when stems compare clients.

Pair with [Addisonian crisis](LESSON:addisonian-crisis) for **opposite** hemodynamic and electrolyte patterns.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners reward **identifying infection** in clients on **chronic steroids**—**fever** may be blunted, so **wound**, **white count**, **hemodynamic** shifts matter. They test **hyperglycemia management** per orders and **avoid NSAIDs** when **GI bleed**, **renal**, or **platelet** risks are high—choose **acetaminophen** pathways when appropriate per stem.

**Steroid taper** is **provider-directed**—nurses **monitor** for **adrenal insufficiency** symptoms during changes but **do not** adjust doses independently. Psychiatric items may pair **steroids** with **mania** or **depression**—safety first.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Assessment cluster**: **central adiposity** + **proximal weakness** + **striae** + **easy bruising** + **HTN** + **hyperglycemia** → think **cortisol excess** until ruled out.
- **Complications to monitor**: **uncontrolled diabetes**, **hypertensive urgency**, **pathologic fractures**, **DVT/PE** with immobility, **depression/mania**, **poor healing** wounds.
- **Nursing interventions**: **scheduled glucose checks**, **foot inspection** in diabetes, **pressure redistribution**, **fall precautions**, **DVT prophylaxis** when not contraindicated, **balanced nutrition** with **sodium** awareness if ordered, **infection education** (“call for fever, spreading redness, new drainage”).

**Contrast study:** **Addison** shows **hypotension**, **hyperkalemia**, **hyponatremia**—different triage story.

**Follow-up themes:** When **exogenous steroids** taper, **monitor** for **fatigue**, **hypotension**, **salt craving**, or **hyperkalemia** patterns that could signal **adrenal insufficiency**—report promptly per orders.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A client on **high-dose prednisone** for **autoimmune disease** **reports** **increased foot pain** and **purulent drainage** from a **chronic ulcer**. **Temp 38.6°C**, **glucose 340 mg/dL**, **BP 168/96**, **HR 104**.

**Fork:** **Infection and glycemic crisis** compete for priority—**notify provider**, **full wound assessment** with **culture** per orders, **sepsis precautions**, **strict glucose monitoring**, and **insulin therapy** as prescribed. Do **not** delay reporting to **gather supplies** alone.

**Clinical application:** Check **pedal pulses**, **sensation** if neuropathy theme, **signs of spreading cellulitis**. Document **objective wound** traits for **team decision** on **debridement** or **imaging**.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Steroids** blunt **inflammation** but do not erase **infection**—**wound + glucose + vitals** tell the story.
- **Hyperglycemia** and **hypertension** are **ongoing** risks—monitor trends, not single numbers.
- **Endocrine compare/contrast** items reward **fluid, electrolyte, and glucose** patterns—study **Cushing vs Addison** side by side.

**NCLEX drill:** If **immunosuppression + worsening wound + fever** cluster, pick **assessment + provider notification + sepsis-minded monitoring** before **routine discharge teaching**.

**Synthesis:** **Cushing** vignettes stack **metabolic** and **infection** risks—your **closing check** is whether **glucose**, **perfusion**, and **wound** data are **trending safer**, not whether paperwork is complete.

**Recap:** Name **three** objective findings you would **recheck first** after intervention (**glucose**, **BP**, **wound**) and the **single escalation** that matches policy—this mirrors **clinical judgment** “priority” language.

**Related:** [Addisonian crisis](LESSON:addisonian-crisis) · [DKA vs HHS](LESSON:dka-vs-hhs-priorities-hy) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "dka-vs-hhs-priorities-hy": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Diabetic ketoacidosis (DKA)** combines **hyperglycemia**, **ketone production**, and **anion-gap metabolic acidosis**—classically **type 1 diabetes**, but **type 2** under stress can present similarly. **Hyperosmolar hyperglycemic state (HHS)** features **profound hyperglycemia**, **hyperosmolality**, and **dehydration** with **minimal ketosis**, more often in **older adults with T2DM**, sometimes with **altered mentation** or **seizures** from **osmotic** shifts.

NCLEX-RN prioritizes **airway-breathing-circulation**, **aggressive IV fluids** per protocol, **insulin infusion** when appropriate, **frequent point-of-care glucose**, **serum potassium monitoring** before and during insulin, **cardiac telemetry** when **dysrhythmia** risk is high, and **hunting triggers** such as **infection**, **MI**, **stroke**, **new medications**, or **missed insulin**.

Link [hypovolemia](LESSON:fluid-volume-deficit), [ABG interpretation](LESSON:abg-interpretation-basics-hy), and [diabetes self-management](LESSON:diabetes-self-management-teaching) for recovery-phase teaching.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners hammer **potassium**: **insulin** drives **K⁺** into cells—**life-threatening hypokalemia** can develop during treatment even if admission **K⁺** looked high. They punish **starting insulin** when **K⁺** is **contraindicated-low** without **replacement** per protocol, and **fluid choice** errors in **hypovolemic shock** patterns.

**Bicarbonate** is **not automatic** for acidosis—reserve for **select severe** presentations per stem. **Oral fluids** in **altered** clients risk **aspiration**. **HHS** may need **slower sodium correction** themes—avoid **rapid osmotic shifts** that risk **cerebral edema** when tested.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **DKA signature**: **polyuria**, **polydipsia**, **N/V**, **abdominal pain**, **Kussmaul** breathing, **ketones**, **AG acidosis** on labs when shown.
- **HHS signature**: **extreme glucose**, **hyperosmolarity**, **dehydration**, **neuro changes** with **minimal ketones**—still **ICU-level** risk.
- **Treatment themes**: **isotonic** resuscitation first, **insulin infusion** per protocol after **K⁺** safety checks, **q1h glucose** monitoring, **potassium replacement**, **phosphate/magnesium** as indicated, **identify precipitant**.
- **Nursing**: **strict I&O**, **Foley** for accurate output in critical phases, **neuro checks**, **fall and seizure precautions**, **DVT prophylaxis** when safe, **transition plan** to subcutaneous insulin per protocol.

- **Differentiators on boards:** **DKA** more often shows **Kussmaul** breathing and **ketones**; **HHS** may show **extreme osmolality** with **altered mentation** and **minimal ketosis**—both still require **aggressive volume** and **careful insulin** timing.

**Safety:** As **anion gap closes**, watch **hypoglycemia** from **over-aggressive insulin**—titration is team-based.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** A young adult with **T1DM** **reports** **vomiting**, **abdominal pain**, and **polyuria**. **BG 520 mg/dL**, **K⁺ 5.8 mEq/L**, **AG metabolic acidosis**, **moderate/large ketones**. **Dry mucous membranes**, **HR 118**, **BP 98/62**.

**Fork:** **Classic DKA**—**notify provider**, **large-bore IV access**, **fluid bolus/resuscitation** per orders, **verify potassium strategy** before **insulin infusion**, **continuous monitoring**. **NPO** during acute stabilization except **sips** if policy allows **clear liquids**—follow stem.

**Clinical application:** When **insulin** starts, **recheck K⁺** on schedule; **watch for dropping potassium** and **ECG changes**. Communicate **chest pain** or **focal neuro deficits**—search for **MI** or **stroke** triggers.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **DKA/HHS** = **volume resuscitation + insulin strategy + electrolyte surveillance**—sequence matters.
- **Potassium** moves with **insulin**—never treat **hyperglycemia** while ignoring **K⁺** trends.
- **Teach sick-day management** after stability: **never skip basal insulin** without provider plan, **when to seek ER**.

**NCLEX drill:** If **K⁺** is **low-normal** before insulin, pick **replacement/monitoring** pathways over **insulin-first** when the stem forbids it.

**Closing:** After **resolution**, teaching emphasizes **sick-day insulin rules**, **when to seek emergency care**, and **medication adherence**—documentation should show **understanding**, not just **discharge paperwork** completion.

**Related:** [diabetes self-management teaching](LESSON:diabetes-self-management-teaching) · [fluid balance acute care](LESSON:fluid-balance-acute-care) · [Canada RN hub](/canada/rn/nclex-rn/lessons).`,
      },
    ],
  },

  "enteral-feeding-tube-safety": {
    sections: [
      {
        id: "clinical_meaning",
        heading: "Clinical meaning",
        kind: "clinical_meaning",
        body: `**Enteral nutrition** delivers formula through **nasogastric/orogastric** tubes or **percutaneous endoscopic gastrostomy (PEG)** and **jejunostomy** routes when **oral intake** is unsafe or insufficient. Nursing priorities are **correct tube position** before every feed or med pass when policy requires, **head-of-bed elevation** to reduce **aspiration**, **controlled infusion rates**, **gastric residual assessment** when ordered, **intolerance monitoring** (nausea, distension, diarrhea), and **infection prevention** at the **stoma** site for PEG/J tubes.

NCLEX-RN tests **aspiration precautions**, **medication compatibility** (liquid forms, **flushing**, **holding** feeds around certain meds per pharmacy), **clog prevention**, and **refeeding syndrome** vigilance in **malnourished** clients (**phosphate**, **potassium**, **magnesium** shifts).

Pair with [TPN line care](LESSON:tpn-line-care-basics) for route comparison and [fluid balance](LESSON:fluid-balance-acute-care) when **electrolytes** swing.`,
      },
      {
        id: "exam_relevance",
        heading: "Exam relevance",
        kind: "exam_relevance",
        body: `Examiners punish **starting feeds** after **new NG placement** without **radiographic confirmation** when policy demands it, and **large boluses** in **high aspiration** risk clients. They reward **HOB 30–45°** (per policy) during continuous feeds, **oral care** for **intubated** or **NPO** clients, and **stopping feeds** for **vomiting**, **desaturation**, **wet voice**, or **acute abdominal** pain.

**Residual checks** are **order-dependent**—follow the stem on whether to **hold** for **high residual**. **Blue dye** testing is **obsolete**—do not pick it as best practice on modern items.`,
      },
      {
        id: "core_concept",
        heading: "Core concept",
        kind: "core_concept",
        body: `- **Placement verification**: **gastric pH** trends with **aspirate** when protocol allows; **X-ray** when **mandatory**; never trust **air insufflation auscultation** alone.
- **Feed administration**: **pump**-controlled rates, **free water flushes** per orders, **glucose monitoring** in diabetes, **elevate HOB** for **30–60 minutes** after boluses when policy states.
- **Medications**: use **liquid** formulations when possible; **dissolve/crush** only if **appropriate** per pharmacist; **flush** before/after each drug; **separate** incompatible agents.
- **Complications**: **aspiration pneumonia**, **tube migration**, **sinusitis** with long-term NG, **hyperglycemia**, **refeeding syndrome**—monitor **phosphate** and clinical signs in **at-risk** malnutrition.

- **Monitoring cadence:** **initial hour** after rate changes, **routine** assessment for **distension**, **nausea**, **residual** when ordered, and **glucose** in diabetes; **escalate** early when **respiratory** status shifts.

**Safety:** **Stop feeds** and **notify** for **peritoneal** signs, **GI bleeding**, or **respiratory** deterioration.`,
      },
      {
        id: "clinical_scenario",
        heading: "Clinical scenario",
        kind: "clinical_scenario",
        body: `**Patient vignette.** During a **bolus feed** via **NG tube**, the client **develops coughing**, **wet voice**, and **SpO₂ 88%** on prior baseline **94%**. You pause and **assess**.

**Fork:** **Stop the feeding immediately**, **raise HOB**, **suction oral secretions** if indicated, **notify provider**, and **verify tube placement** per policy before **restarting**. Treat as **aspiration risk** until **lung assessment** and **orders** clarify next steps.

**Clinical application:** Auscultate **lung fields**, monitor **work of breathing**, repeat **vitals**, and **document** the **symptom onset** time and **interventions** for **handoff** and **possible imaging**.`,
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: `- **Respiratory change during feeding** demands **pause → assess → escalate**—aspiration may be **silent** or **dramatic**.
- **Tube position** is **not permanent** after **coughing**, **vomiting**, or **transport**—**reverify** per policy.
- **Flushing and med compatibility** prevent **occlusion** and **harmful interactions**—treat **enteral access** with the same discipline as **IV lines**.

**NCLEX drill:** If **wet voice + desaturation** during a feed, pick **stop + airway assessment + provider notification** before **continuing the bolus**.

**Related:** [bowel obstruction vs ileus](LESSON:bowel-obstruction-vs-paralytic-ileus) · [GERD/PUD clues](LESSON:gerd-pud-bleeding-clues) · [US RN hub](/us/rn/nclex-rn/lessons).`,
      },
    ],
  },
};

export const RN_BATCH1_MERGED_CATALOG_PATCHES: Record<string, Patch> = {
  ...BATCH2_CATALOG_PATCHES,
  ...RN_BATCH1_EXTRA_CATALOG_PATCHES,
};
