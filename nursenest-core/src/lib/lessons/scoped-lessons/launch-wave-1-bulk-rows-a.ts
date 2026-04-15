/**
 * Launch Wave 1 bulk rows (part A of B) — PE + cardio/resp/GI/renal/CNS topics.
 */
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { BulkRow } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-builder";

const qt = (items: PathwayLessonQuizItem[]) => items;

export const ROWS_A: BulkRow[] = [
  {
    slug: "pulmonary-embolism-recognition-gold",
    shortTitle: "Pulmonary embolism: recognition",
    topic: "Pulmonary embolism",
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular / respiratory",
    npTitleStem: "PE — recognition & escalation",
    npSeoDescription:
      "NP-level PE risk stratification, ED versus outpatient workup framing, anticoagulation themes, and bleeding precautions aligned to protocols.",
    sharedCore: `**What PE is**  
**Pulmonary embolism (PE)** is **pulmonary artery obstruction**, usually from **thrombus** that traveled from **venous** sources. Exams reward linking **sudden hypoxemia**, **tachycardia**, **pleuritic pain**, and **risk factors** (immobility, surgery, malignancy, estrogen, prior VTE) to **priority actions** and **safe monitoring**—not memorizing a single test in isolation.

**Why it matters on the exam**  
PE overlaps **ACS**, **pneumothorax**, **sepsis**, and **anxiety** vignettes. Writers test whether you **stabilize first**, **communicate critical findings**, **prepare the client for time-sensitive diagnostics**, and **monitor for anticoagulation-related bleeding** when therapy is in play.

**Nursing spine**  
Assess **ABC**, **pain pattern**, **hemodynamic stability**, **bleeding risk**, and **neurologic status** when hypoxemia is profound. Avoid **routine tasks** ahead of **unstable perfusion** or **escalation** when the stem implies massive or submassive patterns.`,
    labsDiagnostics: `**Common diagnostics (stem-dependent)**  
**D-dimer** may appear in low-risk workups; **CT pulmonary angiography** is common when suspicion is high. **V/Q scanning** appears when CT is contraindicated in some stems. **Troponin** may be elevated from **right heart strain**—integrate with the full picture, not one lab line.

**Nursing integration**  
Your role is **timely preparation**, **continuous monitoring**, **bleeding precautions**, **oxygen therapy per order**, and **clear reporting**—not choosing anticoagulant type independently outside your role.`,
    pn: `**NCLEX-PN**  
Focus on **recognizing instability**, **reporting**, **oxygen per order**, **preparing for tests**, and **monitoring for bleeding** on anticoagulation. Avoid **independent anticoagulant dosing** or **diagnosing** beyond assessment data.`,
    caRpn: `**REx-PN / Canadian RPN**  
Emphasize **collaboration**, **objective reporting**, and **policy-aligned actions**. Canadian stems may include **metric** values—translate reasoning, not memorized US-only cutoffs.`,
    usRn: `**NCLEX-RN**  
Expect **prioritization** among multiple clients, **hemodynamic monitoring**, and **patient education** about **anticoagulation safety** and **when to seek urgent care** for bleeding signs.`,
    caRn: `**Canada RN**  
Match US judgment with **Canadian** labels/units when shown. Prioritize **life threats** first; use **interprofessional communication** with concise objective data.`,
    np: `**US NP tracks**  
Items may test **risk stratification**, **shared decision-making**, **contraindications to anticoagulation**, **follow-up planning**, and **cannot-miss** alternative diagnoses (ACS, aortic catastrophe) when red flags appear.`,
    examRelevance: `Traps include **routine paperwork** during **unstable vitals**, **minimizing pleuritic pain** in a postoperative client, or **choosing reassurance** when **hypoxemia** and **tachycardia** suggest PE until evaluated.`,
    scenario: `**Vignette**  
Postoperative client with **sudden dyspnea**, **pleuritic chest pain**, **SpO₂ 88%**, **HR 118**, recent **immobility**. Skin cool, anxious, no fever.

**Fork**  
**Stabilize and escalate** per protocol: oxygen per order, **continuous monitoring**, **notify provider**, **prepare for diagnostics**, and **avoid sedating** undifferentiated respiratory distress.`,
    takeaways: `• **Risk + sudden cardiopulmonary change** → treat as serious until evaluated.  
• **Overlap** with ACS—use the stem’s clues, not one buzzword.  
• **Anticoagulation safety** teaching: bleeding signs, head trauma precautions, adherence.  
• Pair with **ACS** and **clinical judgment** gold lessons.`,
    related: ["acs", "cj", "copd", "shock"],
    preTest: qt([
      {
        question: "Which finding most strongly increases suspicion for PE in a postoperative client?",
        options: [
          "Sudden pleuritic chest pain with hypoxemia and tachycardia after immobility.",
          "Gradual chronic fatigue over months without acute change.",
          "Localized knee arthritis pain without respiratory symptoms.",
          "Stable SpO₂ 98% on room air after walking.",
        ],
        correct: 0,
        rationale:
          "Acute cardiopulmonary symptoms with VTE risk factors increase suspicion; chronic non-respiratory pain patterns are lower yield for PE in classic stems.",
      },
      {
        question: "Before diagnostic imaging is available, what is the RN’s best priority for suspected PE with significant hypoxemia?",
        options: [
          "Finish discharge paperwork.",
          "Stabilize with oxygen per order, monitor closely, notify provider, and prepare for urgent evaluation.",
          "Tell the client to walk to calm anxiety.",
          "Delay reporting until the next routine round.",
        ],
        correct: 1,
        rationale:
          "Stabilize and escalate; documentation and reassurance walking are unsafe delays when perfusion and oxygenation are threatened.",
      },
      {
        question: "Why might troponin be elevated in PE?",
        options: [
          "PE cannot affect troponin.",
          "Right ventricular strain/injury can release troponin—do not automatically label ACS without the full clinical picture.",
          "Troponin elevation proves renal failure only.",
          "Troponin is unrelated to any cardiac structures.",
        ],
        correct: 1,
        rationale:
          "Right heart strain patterns can elevate troponin; the stem often tests integration, not single-lab fixation.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on anticoagulation for PE develops black stools and dizziness. What is the best immediate nursing action?",
        options: [
          "Encourage high-fiber diet only.",
          "Assess hemodynamic status, notify provider urgently, and prepare for emergency evaluation per protocol.",
          "Discontinue all fluids.",
          "Tell the client this is normal.",
        ],
        correct: 1,
        rationale:
          "GI bleeding with dizziness suggests hemodynamic compromise—urgent evaluation and team communication are priorities.",
      },
      {
        question: "Which statement reflects safe patient education for anticoagulation after PE?",
        options: [
          "Stop the medication whenever you feel tired.",
          "Seek urgent care for head injury, uncontrolled bleeding, or black stools—know your specific warning signs.",
          "Use NSAIDs freely for pain unless allergic.",
          "Skip follow-up labs because you feel fine.",
        ],
        correct: 1,
        rationale:
          "Bleeding precautions and follow-up are central; NSAIDs may increase bleeding risk depending on regimen—teaching must match clinician guidance.",
      },
      {
        question: "Why is immobility a PE risk factor?",
        options: [
          "Immobility increases venous stasis and thrombosis risk.",
          "Immobility prevents all blood flow permanently.",
          "Immobility only matters in children.",
          "Immobility is unrelated to VTE.",
        ],
        correct: 0,
        rationale:
          "Venous stasis contributes to DVT formation, which can embolize to the lungs.",
      },
    ]),
  },
  {
    slug: "atrial-fibrillation-stroke-prevention-gold",
    shortTitle: "Atrial fibrillation: stroke prevention",
    topic: "Atrial fibrillation",
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular",
    npTitleStem: "AFib — stroke prevention & anticoagulation themes",
    npSeoDescription:
      "NP-level CHA₂DS₂-VASc-style reasoning themes, bleeding risk, rate versus rhythm framing, and patient-centered anticoagulation counseling without independent dosing games.",
    sharedCore: `**What atrial fibrillation is (exam framing)**  
**Atrial fibrillation (AFib)** is a **supraventricular arrhythmia** with **disorganized atrial activity** and often **irregular ventricular response**. Boards care whether you connect **palpitations**, **tachycardia**, **fatigue**, **syncope/near-syncope**, and **thromboembolic risk** to **monitoring**, **safety**, and **timely escalation**—not independent medication selection unless the stem gives a protocol.

**Why stroke prevention appears**  
AFib can permit **atrial stasis** and **thrombus formation**; **ischemic stroke** risk is a central teaching point. Items test **education**, **adherence**, **bleeding precautions**, and **when to seek urgent care** for neurologic changes.

**Nursing implications**  
Trend **vitals**, **rhythm**, **symptoms**, and **signs of hypoperfusion**; protect **fall risk** when rate is fast or mentation changes; support **anticoagulation safety** teaching and lab monitoring when ordered; communicate **acute neuro deficits** immediately.`,
    labsDiagnostics: `**Common testing themes**  
**ECG** shows **irregularly irregular** rhythm without organized P waves in classic teaching. **Thyroid** tests may appear if secondary causes are hinted. **Renal function** and **CBC** often matter for therapy decisions in real care—follow the stem’s labs.

**Nursing integration**  
Your role is **accurate monitoring**, **patient identification during procedures**, **education**, and **escalation** for **unstable tachycardia**, **chest pain**, or **stroke symptoms**—not choosing anticoagulant type independently.`,
    pn: `**NCLEX-PN**  
Emphasize **vital signs**, **reporting chest pain or neuro changes**, **fall precautions**, and **reinforcing teaching** from the RN/provider. Avoid **independent anticoagulant changes** or **interpreting rhythm strips** beyond your role.`,
    caRpn: `**REx-PN**  
Focus on **collaboration**, **objective reporting**, and **safe administration** of ordered therapies. Canadian stems may use **metric** units—read carefully.`,
    usRn: `**NCLEX-RN**  
Expect **prioritization** with concurrent clients, **telemetry monitoring themes**, **pre/post cardioversion preparation** when applicable, and **patient education** that differentiates **rate control** versus **rhythm control** as provider decisions.`,
    caRn: `**Canada RN**  
Same prioritization spine with **Canadian** context when shown; emphasize **interprofessional communication** and **clear escalation** for unstable rhythms or neuro deficits.`,
    np: `**NP**  
Items may test **stroke risk stratification concepts**, **bleeding risk**, **shared decision-making**, **DOAC education**, and **when ED evaluation** is mandatory for rapid AFib with instability.`,
    examRelevance: `Traps include **focusing on comfort** while ignoring **new unilateral weakness**, **minimizing anticoagulation bleeding education**, or **choosing independent dose changes** outside the stem’s authority.`,
    scenario: `**Vignette**  
Client with **known AFib** reports **sudden word-finding difficulty** and **right arm weakness** for 20 minutes, HR irregularly irregular, BP stable.

**Fork**  
Treat as **possible stroke** until evaluated—**activate emergency response** per facility policy, **monitor ABCs**, and **avoid** routine meds that delay escalation.`,
    takeaways: `• **Acute neuro deficit** + AFib → time-sensitive pathway.  
• **Bleeding + anticoagulation** education is a board staple.  
• **Do not confuse** “stable BP” with “safe to wait” when neuro symptoms are acute.  
• Pair with **stroke** gold lesson.`,
    related: ["stroke", "acs", "cj", "ham"],
    preTest: qt([
      {
        question: "Which symptom cluster most urgently changes priority in a client with AFib?",
        options: [
          "Mild ankle edema after a long shift.",
          "Sudden focal weakness or speech difficulty suggesting stroke.",
          "Request for an extra pillow.",
          "Chronic fatigue without acute change.",
        ],
        correct: 1,
        rationale:
          "Acute neurologic deficits require emergency evaluation; chronic edema or comfort requests do not outrank stroke symptoms.",
      },
      {
        question: "Why is anticoagulation education emphasized in AFib care?",
        options: [
          "AFib never causes clots.",
          "Stasis and abnormal atrial activity increase thromboembolic risk; education supports safe therapy and bleeding precautions.",
          "Anticoagulation is only cosmetic.",
          "Education is irrelevant if the client feels fine.",
        ],
        correct: 1,
        rationale:
          "Stroke prevention and bleeding safety are central themes in AFib management teaching.",
      },
      {
        question: "Which finding best matches classic AFib on monitoring education?",
        options: [
          "Regular sinus rhythm with clear P waves before every QRS.",
          "Irregularly irregular rhythm with absent organized P waves in typical teaching examples.",
          "Consistent PR interval prolongation only.",
          "Uniform wide-complex rhythm at a fixed rate always.",
        ],
        correct: 1,
        rationale:
          "Classic teaching emphasizes irregularly irregular rhythm; stems may still vary—follow the vignette.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on anticoagulation for AFib hits their head. What is the priority nursing action?",
        options: [
          "Ignore unless there is a visible wound.",
          "Assess neuro status, follow head-injury precautions per policy, notify provider urgently, and prepare for evaluation.",
          "Give PRN sedatives to sleep.",
          "Encourage vigorous exercise.",
        ],
        correct: 1,
        rationale:
          "Head trauma on anticoagulation is high risk for intracranial bleeding—urgent evaluation pathways apply.",
      },
      {
        question: "Which client should the nurse assess first?",
        options: [
          "Stable AFib client watching TV.",
          "AFib client with new chest pressure, diaphoresis, and hypotension.",
          "Client requesting ice chips with stable vitals.",
          "Client asking for a blanket with normal SpO₂.",
        ],
        correct: 1,
        rationale:
          "Unstable chest pain and hypotension suggest urgent cardiopulmonary pathology.",
      },
      {
        question: "Teaching about DOACs/ warfarin should include which element?",
        options: [
          "Stop all anticoagulation without talking to your clinician if you bruise once.",
          "Know bleeding warning signs and follow-up lab/monitoring plans as prescribed.",
          "Use aspirin for pain without asking.",
          "Double doses when you miss one without guidance.",
        ],
        correct: 1,
        rationale:
          "Bleeding precautions and adherence follow clinician guidance; arbitrary changes are unsafe.",
      },
    ]),
  },
  {
    slug: "pneumonia-cap-nursing-gold",
    shortTitle: "Pneumonia (CAP): nursing priorities",
    topic: "Pneumonia",
    topicSlug: "pneumonia",
    bodySystem: "Respiratory / infection",
    npTitleStem: "Pneumonia — outpatient versus inpatient framing",
    npSeoDescription:
      "NP-level CAP triage, comorbidity and hypoxemia themes, antibiotic stewardship concepts, and return precautions for sepsis red flags.",
    sharedCore: `**What pneumonia is (exam framing)**  
**Pneumonia** is **lung parenchymal infection**—community-acquired (CAP) and hospital-associated patterns appear on exams. Nursing items reward **oxygenation assessment**, **infection cues** (fever, purulent sputum, focal breath sounds), **sepsis awareness**, and **isolation/precautions** when indicated—not guessing the exact bug without data.

**Why it matters**  
Pneumonia can progress to **sepsis** and **respiratory failure**. Boards test **prioritization** (ABC first), **trending vitals**, **preparing cultures before antibiotics when the stem demands it**, and **patient education** on **return precautions**.

**Nursing management spine**  
Monitor **RR**, **SpO₂**, **work of breathing**, **mental status**, and **perfusion**; support **oxygen delivery per order**; maintain **hydration** when appropriate; administer **ordered antimicrobials** on time; use **infection control** practices; escalate for **hypotension**, **new confusion**, or **rising oxygen requirements**.`,
    labsDiagnostics: `**Common diagnostics**  
**Chest imaging** may show infiltrates; **CBC** may show leukocytosis; **lactate** appears in sepsis pathways; **blood cultures** may be ordered before antibiotics in some protocols. Follow the **stem’s sequence**—exams test whether you **protect time-sensitive steps** without inventing independent orders.`,
    pn: `**NCLEX-PN**  
Focus on **vitals**, **oxygen therapy per order**, **oral care/incentive spirometry when ordered**, **infection precautions**, and **reporting** deterioration. Avoid **choosing antibiotics** independently.`,
    caRpn: `**REx-PN**  
Emphasize **collaboration** and **policy**; **metric** units may appear in labs.`,
    usRn: `**NCLEX-RN**  
Expect **prioritization** among multiple patients, **sepsis bundle themes**, **patient education**, and **safe delegation** with clear reporting.`,
    caRn: `**Canada RN**  
Same judgment with **Canadian** context when shown; escalate for **acute change** in mentation or perfusion.`,
    np: `**NP**  
May test **severity scoring themes**, **site-of-care decisions**, **comorbidity interplay**, and **follow-up** with explicit safety netting.`,
    examRelevance: `Traps include **routine tasks** during **rising lactate**, **hypotension**, or **new confusion**; also **teaching** that minimizes red-flag symptoms.`,
    scenario: `**Vignette**  
Older adult with **fever**, **productive cough**, **RR 30**, **SpO₂ 89%** on RA, **BP borderline low**.

**Fork**  
Prioritize **oxygenation and escalation** for possible sepsis—**monitor closely**, **notify provider**, prepare for **orders/diagnostics**, avoid **routine grooming** first.`,
    takeaways: `• **Pneumonia + shock physiology** → think sepsis pathway.  
• **Return precautions** for worsening breathlessness or confusion.  
• Pair with **sepsis** gold lesson.`,
    related: ["sepsis", "copd", "cj", "fluids"],
    preTest: qt([
      {
        question: "Which assessment finding should prompt urgent escalation in suspected pneumonia?",
        options: [
          "Stable SpO₂ 98% after oxygen per order.",
          "New confusion with hypotension and rising respiratory rate.",
          "Mild dry cough without fever.",
          "Client reading with normal vitals.",
        ],
        correct: 1,
        rationale:
          "Sepsis and respiratory failure patterns require urgent escalation; stable oxygenation after therapy is reassuring.",
      },
      {
        question: "Why is incentive spirometry or deep breathing often emphasized when appropriate?",
        options: [
          "It replaces antibiotics.",
          "It supports secretion clearance and lung expansion as part of supportive care.",
          "It is only for postoperative clients.",
          "It eliminates pneumonia risk entirely.",
        ],
        correct: 1,
        rationale:
          "Supportive pulmonary hygiene complements medical therapy; it does not replace infection treatment.",
      },
      {
        question: "Which intervention matches oxygen priority in hypoxemic pneumonia?",
        options: [
          "Withhold oxygen to encourage deeper breaths spontaneously in every case.",
          "Apply oxygen per order/protocol and reassess work of breathing and SpO₂.",
          "Only offer oxygen if the client requests it.",
          "Use room air exclusively for all older adults.",
        ],
        correct: 1,
        rationale:
          "Hypoxemia is treated with oxygen per orders and reassessment; policies guide delivery devices and targets.",
      },
    ]),
    postTest: qt([
      {
        question: "A client with pneumonia develops cool, clammy skin and MAP trending down. What is the best nursing priority?",
        options: [
          "Complete routine bath first.",
          "Recognize possible sepsis, monitor closely, notify provider, and prepare for urgent interventions per protocol.",
          "Encourage large oral fluid boluses without orders in all cases.",
          "Delay assessment to finish charting.",
        ],
        correct: 1,
        rationale:
          "Hemodynamic deterioration suggests sepsis—urgent assessment and escalation outrank routine care.",
      },
      {
        question: "Which statement is appropriate patient education at discharge for pneumonia recovery?",
        options: [
          "Return if breathing worsens, fever returns, or you feel confused or faint.",
          "Stop antibiotics when you feel better without asking your clinician.",
          "Ignore new chest pain as normal.",
          "Avoid all activity forever.",
        ],
        correct: 0,
        rationale:
          "Return precautions should name red-flag symptoms; arbitrary antibiotic cessation is unsafe.",
      },
      {
        question: "Why might droplet precautions be used?",
        options: [
          "For all clients regardless of diagnosis.",
          "When infection transmission risk matches facility policy for respiratory pathogens—follow the stem and orders.",
          "Only for wound care.",
          "Never in hospital settings.",
        ],
        correct: 1,
        rationale:
          "Precautions follow diagnosis and policy; respiratory infections often involve droplet measures when indicated.",
      },
    ]),
  },
  {
    slug: "upper-gi-bleed-prioritization-gold",
    shortTitle: "Upper GI bleed: priorities",
    topic: "Upper GI bleeding",
    topicSlug: "gastrointestinal",
    bodySystem: "Gastrointestinal",
    npTitleStem: "Upper GI bleed — stabilization & referral",
    npSeoDescription:
      "NP-level triage for melena/hematemesis, hemodynamic instability, transfusion themes, and urgent endoscopy referral without replacing facility protocols.",
    sharedCore: `**What upper GI bleeding is (exam framing)**  
**Upper GI bleeding** often presents as **hematemesis** (bright red or coffee-ground) and/or **melena** (tarry stools) from sources like **esophageal**, **gastric**, or **duodenal** pathology. Exams reward recognizing **hypovolemia**, **tachycardia**, **hypotension**, **pallor**, and **altered mentation** as **instability** requiring **rapid stabilization** and **escalation**.

**Why it matters**  
GI bleeding can decompensate quickly. Items test **two large-bore IV access themes**, **type & screen** readiness, **monitoring**, **NPO** when appropriate, and **avoiding medications that worsen bleeding** unless ordered.

**Nursing spine**  
Assess **perfusion** and **mental status**; monitor **vitals and trends**; maintain **IV access**; give **ordered blood products** with **safe administration practices**; watch for **transfusion reactions**; prepare the client for **endoscopy** when indicated; provide **calm, concise education** about what to report.`,
    labsDiagnostics: `**Labs you may see**  
**Hemoglobin/hematocrit** may lag acute loss—follow trends. **BUN** may be elevated relative to creatinine in some upper GI bleeding teaching patterns. **Coagulation studies** may be relevant. Nursing focuses on **timely draws**, **pre-transfusion checks**, and **reporting critical values**.`,
    pn: `**NCLEX-PN**  
Emphasize **monitoring vitals**, **reporting acute changes**, **maintaining access**, and **supporting ordered interventions**. Avoid **independent transfusion decisions**.`,
    caRpn: `**REx-PN**  
Collaborate promptly; use **objective reporting** for hemodynamic change.`,
    usRn: `**NCLEX-RN**  
Expect **prioritization**, **massive transfusion protocol themes** when the stem hints, and **patient safety** during procedures.`,
    caRn: `**Canada RN**  
Same prioritization with **Canadian** context when shown.`,
    np: `**NP**  
May test **risk stratification**, **ICU transfer criteria**, and **medication history** (NSAIDs, anticoagulants) in triage vignettes.`,
    examRelevance: `Traps include **routine meds** before **stabilization**, **eating/drinking** during acute bleeding, or **delaying escalation** with hypotension.`,
    scenario: `**Vignette**  
Client with **coffee-ground emesis**, **HR 124**, **BP 88/60**, **cool skin**.

**Fork**  
**Stabilize and escalate**—large-bore access per protocol, **notify provider**, prepare for **labs/blood products**, continuous monitoring.`,
    takeaways: `• **Shock physiology** outranks paperwork.  
• **Melena/hematemesis** + instability = emergency pathway.  
• Pair with **shock** gold lesson.`,
    related: ["shock", "fluids", "cj", "acs"],
    preTest: qt([
      {
        question: "Which finding suggests significant GI bleeding with hypovolemia?",
        options: [
          "Tachycardia, hypotension, cool clammy skin, altered mentation.",
          "Stable HR and BP with pink cheeks.",
          "Mild heartburn without vitals change.",
          "Normal mentation with brisk walking tolerance.",
        ],
        correct: 0,
        rationale:
          "Hypovolemic shock patterns include tachycardia, hypotension, poor perfusion, and altered mentation.",
      },
      {
        question: "Why might hemoglobin appear near-normal early in brisk bleeding?",
        options: [
          "Hemoglobin always rises during bleeding.",
          "Hemodilution and timing can lag—trend labs and assess perfusion.",
          "Labs are never repeated.",
          "Bleeding does not affect hemoglobin.",
        ],
        correct: 1,
        rationale:
          "Acute bleeding may not immediately reflect in lab values; clinical perfusion matters.",
      },
      {
        question: "Which action is highest priority during acute hemodynamic instability from GI bleeding?",
        options: [
          "Schedule routine discharge teaching first.",
          "Stabilize perfusion, establish/maintain access, notify provider, prepare for urgent interventions per orders.",
          "Offer a full meal to keep strength.",
          "Encourage vigorous activity.",
        ],
        correct: 1,
        rationale:
          "Stabilization and escalation precede routine tasks when shock is suspected.",
      },
    ]),
    postTest: qt([
      {
        question: "A client receives a blood transfusion and develops chills and fever during the infusion. What should the nurse do first?",
        options: [
          "Speed up the infusion to finish faster.",
          "Stop the transfusion per protocol, monitor vitals, notify provider, and maintain IV access for supportive care.",
          "Ignore unless the client faints.",
          "Disconnect all IVs without assessment.",
        ],
        correct: 1,
        rationale:
          "Transfusion reaction protocols prioritize stopping the infusion, monitoring, and urgent evaluation.",
      },
      {
        question: "Which instruction is appropriate for a client with acute upper GI bleeding who is NPO?",
        options: [
          "You may eat crackers if hungry.",
          "Stay NPO unless your provider clears oral intake—report new vomiting or dizziness immediately.",
          "Drink extra water to clear blood.",
          "Take NSAIDs for discomfort without asking.",
        ],
        correct: 1,
        rationale:
          "NPO status and provider guidance protect against worsening bleeding; NSAIDs may worsen bleeding risk.",
      },
      {
        question: "Why is orthostatic assessment useful in GI bleeding risk stratification?",
        options: [
          "It is never useful.",
          "It can reveal hypovolemia when supine vitals look acceptable.",
          "It replaces all labs.",
          "It diagnoses the bleeding source definitively.",
        ],
        correct: 1,
        rationale:
          "Orthostatic changes suggest intravascular volume depletion; follow the stem and orders.",
      },
    ]),
  },
  {
    slug: "acute-kidney-injury-nursing-gold",
    shortTitle: "Acute kidney injury: nursing surveillance",
    topic: "Acute kidney injury",
    topicSlug: "renal-gu",
    bodySystem: "Renal",
    npTitleStem: "AKI — drug & perfusion review",
    npSeoDescription:
      "NP-level medication review for nephrotoxins, contrast risk counseling themes, and outpatient follow-up for creatinine changes—without replacing nephrology decisions.",
    sharedCore: `**What AKI is (exam framing)**  
**Acute kidney injury (AKI)** is a **rapid rise in creatinine** and/or **oliguria** reflecting **sudden filtration decline** from **prerenal**, **intrinsic**, or **postrenal** mechanisms. Exams reward recognizing **hypovolemia**, **nephrotoxins**, **obstruction**, **contrast-associated risk**, and **sepsis** as triggers—then choosing **assessment**, **monitoring**, and **escalation** that match the role.

**Why it matters**  
AKI worsens **fluid balance**, **electrolytes** (especially **K⁺**), and **medication clearance**. Boards test **strict I/O**, **weight trends**, **avoiding nephrotoxins unless ordered**, and **early provider notification** when urine output drops.

**Nursing spine**  
Measure **I/O**, assess **edema versus hypovolemia**, monitor **vitals**, **lung sounds**, and **electrolyte results**, protect **Foley** indications when present, and **teach** patients to report **decreased urine**, **chest pain**, or **neurologic changes** from hyperkalemia.`,
    labsDiagnostics: `**Labs / diagnostics (AKI surveillance)**  
Follow **creatinine and BUN as trends**, not one-off values—boards love a **rising creatinine with falling urine output** as an AKI signal. **Potassium** can climb quickly; treat unexpected hyperkalemia as urgent and repeat levels after therapy when ordered, using your facility’s **critical value** process. **Urinalysis** may hint at **casts**, **protein**, or **infection** patterns that support intrinsic injury when the stem includes results. **Imaging** (often ultrasound) may assess **postrenal obstruction**; nursing contributes **prep**, **safety**, and clear communication about **contrast** or **hydration** orders. After **iodinated contrast** or other **nephrotoxin** exposure, expect **tighter creatinine surveillance** and report **new oliguria** early. Pair labs with **strict intake/output**, **daily weights**, and **vitals** so trends tell one coherent story.`,
    pn: `**NCLEX-PN**  
Focus on **I/O**, **reporting abnormal findings**, **administering fluids/meds per order**, and **patient safety** with mobility if confused.`,
    caRpn: `**REx-PN**  
Collaborate for **order clarification** when urine output drops sharply; use **metric** labs when shown.`,
    usRn: `**NCLEX-RN**  
Expect **prioritization**, **fluid balance management themes**, **cardiac monitoring** when hyperkalemia risk is high, and **patient education** on nephrotoxins.`,
    caRn: `**Canada RN**  
Same spine with **Canadian** labels/units when shown.`,
    np: `**NP**  
May test **medication reconciliation**, **contrast precautions** in ambulatory frames, and **referral** thresholds.`,
    examRelevance: `Traps include **giving nephrotoxic OTC meds** without assessment, **ignoring oliguria**, or **routine tasks** during **hyperkalemia** risk.`,
    scenario: `**Vignette**  
Post-contrast client with **oliguria**, **creatinine rising**, **K⁺ 5.8**, **EKG changes** hinted.

**Fork**  
**Escalate** for **life-threatening hyperkalemia patterns**—follow **telemetry/monitoring orders**, **notify provider urgently**, prepare for **emergent therapy per protocol**.`,
    takeaways: `• **Oliguria + rising creatinine** → treat as serious.  
• **Potassium** is a rhythm emergency when high.  
• Pair with **fluids/electrolytes** gold lesson.`,
    related: ["fluids", "sepsis", "cj", "shock"],
    preTest: qt([
      {
        question: "Which finding most urgently elevates priority in AKI with suspected hyperkalemia?",
        options: [
          "Mild ankle edema without EKG changes.",
          "Peaked T waves, widened QRS, or other emergent EKG changes with high potassium.",
          "Stable HR 72 without symptoms.",
          "Normal urine color.",
        ],
        correct: 1,
        rationale:
          "Severe hyperkalemia can cause fatal arrhythmias—emergent therapy and monitoring are priorities.",
      },
      {
        question: "Why is strict intake/output monitoring emphasized in AKI?",
        options: [
          "It replaces creatinine testing.",
          "It guides fluid therapy and detects oliguria early when renal function is changing.",
          "It is only for comfort.",
          "It prevents all kidney injury.",
        ],
        correct: 1,
        rationale:
          "I/O tracks perfusion response and renal output trends that drive clinical decisions.",
      },
      {
        question: "Which medication class is classically flagged as nephrotoxic risk in teaching vignettes?",
        options: [
          "NSAIDs in volume-depleted states",
          "Plain water",
          "Room air",
          "Physical therapy alone",
        ],
        correct: 0,
        rationale:
          "NSAIDs can reduce renal perfusion; exam stems often pair them with risk states—follow provider guidance.",
      },
    ]),
    postTest: qt([
      {
        question: "A client’s urine output is <30 mL/hr for several hours post-op with trending creatinine. What is the best nursing action?",
        options: [
          "Wait 24 hours silently.",
          "Assess perfusion, review orders, notify provider, and monitor closely for AKI progression.",
          "Push large oral fluids without orders in every case.",
          "Remove IV access to encourage oral intake.",
        ],
        correct: 1,
        rationale:
          "Oliguria with rising creatinine needs assessment and escalation—not silent waiting.",
      },
      {
        question: "Which patient education statement is appropriate for AKI risk after contrast?",
        options: [
          "Ignore hydration instructions.",
          "Follow your team’s hydration plan and report decreased urine, chest pain, or swelling promptly.",
          "Take NSAIDs for headache without asking.",
          "Skip follow-up labs.",
        ],
        correct: 1,
        rationale:
          "Follow-up and symptom reporting reduce harm; NSAIDs may be inappropriate depending on renal risk.",
      },
      {
        question: "Why might a provider hold nephrotoxic medications during AKI?",
        options: [
          "Medications never affect kidneys.",
          "To reduce additional renal injury and allow recovery when alternatives exist.",
          "To increase creatinine on purpose.",
          "Because labs are unnecessary.",
        ],
        correct: 1,
        rationale:
          "Medication adjustments aim to protect kidney recovery—nursing supports monitoring and communication.",
      },
    ]),
  },
  {
    slug: "meningitis-emergency-recognition-gold",
    shortTitle: "Meningitis: emergency recognition",
    topic: "Meningitis",
    topicSlug: "neurological",
    bodySystem: "Neurological / infection",
    npTitleStem: "Meningitis — ED referral & precautions",
    npSeoDescription:
      "NP-level red-flag headache fever patterns, lumbar puncture timing as team decisions, and antibiotic themes without replacing emergency workflows.",
    sharedCore: `**What meningitis is (exam framing)**  
**Meningitis** is **inflammation of the meninges** from **infectious** (bacterial, viral) or other causes in advanced items. Boards reward recognizing **fever**, **neck stiffness**, **photophobia**, **headache**, **altered mentation**, and sometimes **petechial rash** (depending on organism/stem) as **time-sensitive** emergencies.

**Why it matters**  
**Bacterial meningitis** can progress rapidly to **septic shock** and **neurologic injury**. Items test **isolation precautions** when indicated, **rapid provider notification**, **preparation for diagnostics**, and **family communication** without false reassurance.

**Nursing spine**  
Monitor **neuro status**, **vitals**, **glucose** when relevant, **seizure precautions** if ordered, **quiet environment** for photophobia, and **strict infection control** per policy. Avoid **delaying escalation** when **acute neuro deficits** evolve.`,
    labsDiagnostics: `**Diagnostics (team-driven)**  
**Lumbar puncture** timing and **blood cultures** are provider decisions—your role is **preparation**, **monitoring**, and **support**. **CT** may precede LP in select presentations when the stem indicates.`,
    pn: `**NCLEX-PN**  
Focus on **neuro checks**, **reporting deterioration**, **comfort within orders**, and **infection precautions**. Avoid **interpreting LP results** beyond scope.`,
    caRpn: `**REx-PN**  
Collaborate quickly; **public health** themes may appear in community exposures—follow the stem.`,
    usRn: `**NCLEX-RN**  
Expect **isolation**, **sepsis overlap**, **family teaching**, and **priority** when fever + neuro signs cluster.`,
    caRn: `**Canada RN**  
Same prioritization spine with **Canadian** context when shown.`,
    np: `**NP**  
May test **cannot-miss** headache fever red flags in ambulatory triage and **referral** urgency.`,
    examRelevance: `Traps include **routine tasks** during **focal neuro deficits**, **delaying notification** with **rapid neuro decline**, or **minimizing fever + neck stiffness** in high-risk clients.`,
    scenario: `**Vignette**  
Young adult with **fever**, **severe headache**, **neck stiffness**, **photophobia**, **confusion**.

**Fork**  
**Emergency pathway**—monitor closely, **notify provider**, **prepare for diagnostics**, **isolation precautions per policy**, avoid **sedation** that masks neuro exams unless ordered.`,
    takeaways: `• **Fever + meningeal signs + confusion** → emergency until proven otherwise.  
• **Sepsis overlap** is common—pair with sepsis lesson.  
• **Precautions** follow policy and suspected etiology.`,
    related: ["sepsis", "stroke", "cj", "fluids"],
    preTest: qt([
      {
        question: "Which cluster most strongly suggests meningitis in classic exam vignettes?",
        options: [
          "Fever with headache, neck stiffness, and photophobia.",
          "Chronic low back pain without fever.",
          "Seasonal allergies without neuro signs.",
          "Stable chronic migraine pattern unchanged for years.",
        ],
        correct: 0,
        rationale:
          "Meningeal irritation signs with systemic infection cues form classic teaching patterns—follow the stem.",
      },
      {
        question: "Why is altered mental status concerning in suspected meningitis?",
        options: [
          "It is always benign.",
          "It can reflect increased intracranial pressure, sepsis, or advanced infection—needs urgent evaluation.",
          "It rules out infection.",
          "It indicates only anxiety.",
        ],
        correct: 1,
        rationale:
          "Neurologic deterioration raises urgency and may change diagnostic sequencing.",
      },
      {
        question: "Which nursing action matches infection control priorities in suspected bacterial meningitis?",
        options: [
          "Ignore isolation until discharge.",
          "Follow facility droplet/contact precautions as ordered for the suspected organism and setting.",
          "Cluster all visitors at the bedside without limits.",
          "Discontinue monitoring to let the client rest.",
        ],
        correct: 1,
        rationale:
          "Precautions reduce transmission and protect staff and visitors—follow policy and orders.",
      },
    ]),
    postTest: qt([
      {
        question: "A client with suspected meningitis develops a new seizure. What is the priority nursing response?",
        options: [
          "Leave the room to complete charting.",
          "Protect airway per seizure protocol, ensure safety, notify provider, and prepare for emergent interventions.",
          "Give oral food during the event.",
          "Restrain without assessment.",
        ],
        correct: 1,
        rationale:
          "Seizure emergencies require airway protection, safety, and urgent team response.",
      },
      {
        question: "Which statement is appropriate family teaching while evaluation is ongoing?",
        options: [
          "We are monitoring closely and the team is working urgently—ask questions and report any sudden changes.",
          "There is definitely nothing serious.",
          "You should not ask any questions.",
          "Leave and do not return.",
        ],
        correct: 0,
        rationale:
          "Calm, honest communication avoids false reassurance while supporting collaboration.",
      },
      {
        question: "Why might blood cultures be drawn before antibiotics in some protocols?",
        options: [
          "Cultures are never needed.",
          "To identify the organism and guide therapy when the clinical scenario supports that sequence per orders.",
          "To delay treatment intentionally.",
          "To replace lumbar puncture always.",
        ],
        correct: 1,
        rationale:
          "Timing of cultures and antibiotics is protocol-driven—exams test team-based sequencing awareness.",
      },
    ]),
  },
];
