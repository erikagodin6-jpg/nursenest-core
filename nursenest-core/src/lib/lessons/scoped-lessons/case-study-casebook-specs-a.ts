/**
 * Clinical casebook lessons (part A): sepsis, ACS, respiratory distress, glucose emergencies.
 * @see case-study-casebook-specs-b.ts for electrolytes, OB, pediatrics, mental health.
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

const { relatedSlugs: rSepsis, relatedTitlesBySlug: tSepsis } = rel("sepsis", "shock", "cj", "fluids");
const { relatedSlugs: rAcs, relatedTitlesBySlug: tAcs } = rel("acs", "cj", "copd", "stroke");
const { relatedSlugs: rResp, relatedTitlesBySlug: tResp } = rel("copd", "sepsis", "cj", "acs");

const rGlucose = {
  relatedSlugs: [
    "dka-hhs-hyperglycemic-emergencies-gold",
    "fluids-electrolytes-emergencies-gold",
    "clinical-judgment-prioritization-gold",
    "high-alert-medications-safety-gold",
  ],
  relatedTitlesBySlug: {
    "dka-hhs-hyperglycemic-emergencies-gold": "DKA & HHS hyperglycemic emergencies",
    "fluids-electrolytes-emergencies-gold": "Fluids & electrolyte emergencies",
    "clinical-judgment-prioritization-gold": "Clinical judgment & prioritization",
    "high-alert-medications-safety-gold": "High-alert medication safety",
  },
};

export const CASE_STUDY_SPECS_A: CaseStudyLessonSpec[] = [
  {
    slug: "clinical-casebook-sepsis-rapid-response-gold",
    topic: "Sepsis — clinical case study",
    topicSlug: "sepsis",
    bodySystem: "Infection / shock",
    npTitleStem: "Sepsis case study — escalation & bundle themes",
    npSeoDescription:
      "NP-style case vignette: sepsis recognition, risk framing, time-sensitive diagnostics, and safe site-of-care language aligned to protocols—without guessing independent orders outside the stem.",
    pathophysiologyCore: `**Mechanism (exam lens)**  
**Sepsis** is **life-threatening organ dysfunction** caused by a **dysregulated host response** to infection. Early teaching frames **microvascular leak**, **vasodilation**, and **inadequate perfusion** relative to metabolic demand—so the client can look “not that sick” until **compensation fails**.

**Why boards love this**  
Writers pair **subtle infection sources** (UTI, pneumonia, abdominal, line-related) with **trending vitals** and **mental status change**. The trap is choosing **routine comfort** or **delayed reporting** when **perfusion and oxygenation** are threatened.

**Trajectory language**  
Expect questions about **lactate** when shown, **blood pressure response to fluid**, **antibiotic timing themes**, and **escalation** when hypotension persists—your pathway determines whether you **execute within orders**, **activate rapid response**, or **reason about diagnostics and disposition**.`,
    sharedKeyFindings: `**Objective data cluster (case)**  
You are given **fever or hypothermia**, **tachycardia**, **tachypnea**, and often **hypotension or narrowed pulse pressure**—plus **acute confusion** in older adults. Skin may be **warm early** and **cool late**; urine output may fall before BP crashes.

**Labs / monitoring cues when present**  
**Leukocytosis or left shift**, **bandemia**, **elevated lactate**, **acute kidney injury**, **hyperglycemia from stress**, and **acidosis patterns** may appear. None replaces bedside **perfusion and breathing** assessment.

**Source clues**  
Listen for **new cough**, **burning dysuria**, **abdominal rigidity**, **wound erythema**, **recent procedures**, or **indwelling devices**—the stem often hides the “why now” in one sentence.`,
    labsDiagnostics: `**Diagnostics (stem-dependent)**  
**Blood cultures before antibiotics** is a classic teaching theme when the vignette is time-critical—paired with **lactate** and **baseline labs**. Imaging and **urinalysis** may be ordered based on presentation.

**Your lane**  
PN items emphasize **preparation**, **timely reporting**, and **monitoring**; RN items add **coordination**, **closed-loop communication**, and **rapid response activation** when criteria are met; NP items may frame **risk**, **differential breadth**, and **follow-up** when the case is ambulatory—**read the role line**.`,
    relatedSlugs: rSepsis,
    relatedTitlesBySlug: tSepsis,
    variants: {
      us_pn: {
        title: "Sepsis case study: rapid response (NCLEX-PN, US)",
        seoTitle: "Sepsis case study: rapid response | NCLEX-PN US | NurseNest",
        seoDescription:
          "US PN: sepsis vignette—objective reporting, oxygen and monitoring within orders, escalation boundaries, and safe scope on NCLEX-PN.",
        scenarioSetup: `You are caring for a **72-year-old** after **elective colectomy**, post-op day 2. The client reports **chills** and **worsening fatigue**. Vitals: **BP 98/58**, **HR 118**, **RR 28**, **SpO₂ 93%** on **2 L** nasal cannula, **T 38.6°C**. The client is **mildly confused** answering orientation questions. The surgical dressing is clean, but the abdomen is **diffusely tender** with **hypoactive bowel sounds**. Urine has been **concentrated and lower volume** than yesterday.`,
        clinical_meaning: `This presentation is **not** “routine post-op discomfort.” **Tachycardia + tachypnea + fever + hypotension** with **new confusion** forms a **sepsis-suspect** pattern until proven otherwise. On **PN** items, the exam rewards **recognizing instability**, **reporting promptly**, **monitoring per order**, and **avoiding independent scope expansion** (silent med changes, delayed escalation).`,
        exam_relevance: `NCLEX-PN traps: **finishing routine tasks first**, **reassuring** without reassessment, or **choosing teaching** while perfusion is threatened. The best answers **communicate objective data**, **stay within orders**, and **prepare** for urgent evaluation.`,
        whatMattersMostEscalation: `**What matters most** is **perfusion + source identification** in motion. Confusion with **tachycardia** and **hypotension** is a **red-flag trajectory**, not a “surgery pain” problem. Escalation belongs **now**: concise provider notification and **activation of emergency resources** per facility policy when criteria are met.`,
        prioritizationNextActions: `1) **Assess ABCs** and repeat **vitals** on a short interval; increase **oxygen** per protocol/order if work of breathing worsens.  
2) **Notify the RN/rapid response/provider** with a tight summary: trend + current vitals + **new neuro change** + surgical context.  
3) **Prepare** for labs/cultures and possible imaging **as ordered**—have supplies ready, verify **two patient identifiers**, maintain **asepsis**.  
4) **Monitor urine output** and mental status; avoid **sedation** that masks deterioration.  
5) **Stay inside scope**: do not start **IV antibiotics independently** unless protocol explicitly authorizes you in the stem.`,
        rationaleDecisions: `**Why “routine pain reassessment only” fails**  
Pain scales do not fix **hypoperfusion**. **Why “wait for rounds” fails**  
Instability needs **immediate** communication. **Why “teach deep breathing first” fails**  
It ignores **possible sepsis physiology** and may delay **medical escalation**. The PN-correct pattern is **objective reporting + monitoring + preparation** aligned to orders, not silent fixes.`,
        escalationSafetyTeaching: `**Escalation**  
If **BP falls further**, **RR rises**, **SpO₂ drops**, or **mentation worsens**, treat as **emergent** until evaluated: repeat vitals, **call for help**, and follow **facility escalation** pathways.

**Safety teaching (when stable enough)**  
Explain **infection signs** and **when to call** for **worsening breathing**, **new confusion**, **faintness**, or **no urine**—use **specific triggers**, not vague “call if worse.”`,
        takeaways: `• **Trend beats snapshot** on boards—compare to baseline.  
• **Confusion + infection concern** = treat as high risk.  
• **PN wins** by **reporting**, **monitoring**, and **preparing**—not improvising meds.  
• Pair with **sepsis early recognition** and **shock** gold lessons.`,
      },
      ca_rpn: {
        title: "Sepsis case study: rapid response (REx-PN, Canada)",
        seoTitle: "Sepsis case study: rapid response | REx-PN Canada | NurseNest",
        seoDescription:
          "Canada RPN: sepsis case vignette—collaborative escalation, metric vitals, college-aligned scope, and objective reporting for REx-PN.",
        scenarioSetup: `You are assigned to a **70-year-old** recovering from **bowel surgery**. The client reports **rigors** and **increasing weakness**. Vitals: **BP 100/60 mmHg**, **HR 120/min**, **RR 30/min**, **SpO₂ 94%** on **2 L** via nasal prongs, **temperature 38.5°C**. The client is **disoriented to place**. Abdomen is **tender** across the lower quadrants; **drain output** looks **cloudy** compared with earlier. You note **oliguria** on the last two voids.`,
        clinical_meaning: `This is a **deteriorating postoperative** picture with **systemic inflammatory** features and **possible source** (abdomen/device/drain). Canadian items still test the **same prioritization spine**: **ABC**, **perfusion**, **infection source**, **timely collaboration**. RPN answers emphasize **standards-aligned assessment**, **clear reporting**, and **safe scope**—not diagnosing independently beyond assessment data.`,
        exam_relevance: `REx-PN traps include **delaying notification** to complete tasks, **minimizing confusion** as “normal for older adults,” or **choosing independent prescription-level actions**. Prefer **objective data**, **prompt communication**, and **ordered interventions**.`,
        whatMattersMostEscalation: `**What matters most** is **early recognition** and **collaborative escalation** when **perfusion and mentation** are threatened. Hypotension with **tachycardia** and **new confusion** should trigger **urgent provider contact** and **preparation** for urgent diagnostics and treatment pathways—without waiting for convenience.`,
        prioritizationNextActions: `1) **Repeat vitals** and assess **work of breathing**, **skin perfusion**, and **neuro status** frequently.  
2) **Notify** the most responsible provider/nurse **immediately** with **concise** SBAR-style reporting including **trends**.  
3) **Prepare** for **labs/cultures/imaging** as ordered; maintain **infection control** with **hand hygiene** and **aseptic technique**.  
4) **Monitor intake/output** closely; report **worsening oliguria**.  
5) **Document** objectively; avoid **minimizing** abnormal findings.`,
        rationaleDecisions: `**Distractor families**  
“Finish documentation first” vs **unstable vitals**—documentation supports care but cannot replace **escalation**. “Reassure the family only” vs **objective deterioration**—communication matters, but **clinical risk** drives priority. **RPN-correct** options **close the safety loop** with **timely collaboration**.`,
        escalationSafetyTeaching: `**Escalation**  
If **BP trends down**, **HR rises**, or **oxygen needs increase**, escalate per **employer policy** and **college standards**.

**Teaching**  
Use **clear return precautions** for **worsening infection signs**; align teaching with **RN/provider** plans once urgency is addressed.`,
        takeaways: `• **Metric units** do not change the priority: **perfusion + breathing + neuro** first.  
• **Cloudy drain** + **sepsis physiology** = **urgent evaluation** theme.  
• Pair with **Canadian RPN scope** and **sepsis** gold lessons.`,
      },
      us_rn: {
        title: "Sepsis case study: rapid response (NCLEX-RN, US)",
        seoTitle: "Sepsis case study: rapid response | NCLEX-RN US | NurseNest",
        seoDescription:
          "US RN: sepsis case vignette—prioritization, rapid response activation, interprofessional communication, and safe sequencing on NCLEX-RN.",
        scenarioSetup: `You are the **primary RN** for a **68-year-old** with **new-onset confusion** on a medical floor. History includes **diabetes** and **recent UTI**. Vitals: **BP 92/58**, **HR 124**, **RR 30**, **SpO₂ 91%** on **4 L**, **T 39.1°C**. Lung fields: **crackles right base**. **Indwelling catheter** urine is **cloudy and foul smelling**. Labs shown: **WBC 18**, **lactate 3.2** (if your item includes labs). The client is **unable to follow commands** consistently.`,
        clinical_meaning: `This vignette is built for **RN clinical judgment**: multiple **SIRS-like** features, **hypotension**, **hypoxemia**, **fever**, and **source clues** (lung + urinary). The meaning is **time-sensitive escalation** and **coordinated resuscitation**—not isolated tasks. The RN must **prioritize stabilization**, **activate resources**, and **communicate** a clear trajectory.`,
        exam_relevance: `NCLEX-RN loves **competing priorities**: another client’s call light vs **unstable sepsis**. The exam expects you to **delegate or defer non-urgent work**, **activate rapid response** when criteria match, and **avoid** “complete admission paperwork first.”`,
        whatMattersMostEscalation: `**What matters most** is **recognizing sepsis as an emergency** and **mobilizing the team**. Hypotension + **lactate elevation** (when shown) + **acute confusion** should push you toward **aggressive monitoring**, **provider notification**, and **preparation for escalation** (ICU transfer themes, broader orders) rather than watchful waiting.`,
        prioritizationNextActions: `1) **Assess and stabilize**: airway/breathing first—optimize **oxygen**, situate **monitoring**, prepare for **non-invasive or advanced airway** only per order and scope.  
2) **Activate rapid response/code sepsis** per policy if thresholds met.  
3) **Notify provider** with **numbers and trends**; request **explicit orders** for **fluid bolus**, **labs**, **cultures**, and **antibiotics** as appropriate—**prepare** administration.  
4) **Two large-bore IVs**, **labs**, **lactate**, **cultures before antibiotics** when ordered and feasible—**document times**.  
5) **Reassess** after each intervention: **BP**, **mental status**, **urine output**, **work of breathing**.`,
        rationaleDecisions: `**Why not “medicate for fever first”?**  
Antipyretics do not fix **perfusion failure**. **Why not “educate about diabetes” first?**  
Teaching is inappropriate while **mentation** and **BP** are failing. **Why rapid response wins** over “finish charting”?**  
**Delayed escalation** increases harm; the exam rewards **life-safety sequencing**.`,
        escalationSafetyTeaching: `**Safety**  
If **MAP remains low** after ordered boluses, expect **escalation** to **vasopressors** in monitored settings—your role is **monitoring**, **preparation**, and **communication**.

**Teaching after stabilization**  
Teach **signs of deterioration** and **when to call**—once immediate threats are addressed.`,
        takeaways: `• **Sepsis is a team sport**—your job is **recognize, escalate, execute, reassess**.  
• **Source control** themes appear as **collaborative** priorities.  
• Pair with **sepsis early recognition** and **clinical judgment** gold lessons.`,
      },
      ca_rn: {
        title: "Sepsis case study: rapid response (NCLEX-RN, Canada)",
        seoTitle: "Sepsis case study: rapid response | NCLEX-RN Canada | NurseNest",
        seoDescription:
          "Canada RN: sepsis case vignette—metric vitals, interprofessional escalation, and the same prioritization spine with Canadian labels.",
        scenarioSetup: `You are caring for a **65-year-old** with **pneumonia** on **IV antibiotics**. Over two hours, **BP drifts** from **118/72** to **96/58 mmHg**, **HR** rises from **96** to **128/min**, **RR** from **22** to **30/min**, **SpO₂** falls from **94%** to **89%** on the same **oxygen**. The client becomes **increasingly sleepy** but is arousable. **Crackles** are worse at the bases. **Temperature 38.9°C**.`,
        clinical_meaning: `This is **worsening sepsis physiology** despite treatment—**not** “expected pneumonia fatigue.” The clinical meaning is **failure to respond** + **new perfusion risk**. Canadian stems may emphasize **collaborative practice** and **clear documentation** when status changes.`,
        exam_relevance: `Canada RN traps mirror US: **routine tasks** vs **instability**, **minimizing neuro change**, or **waiting** for scheduled reassessment. Choose **escalation**, **continuous monitoring**, and **timely provider communication** with **objective trends**.`,
        whatMattersMostEscalation: `**What matters most** is **recognizing decompensation early** and **activating urgent pathways**. A **falling BP** with **rising HR/RR** and **worsening oxygenation** is a **priority emergency** until proven otherwise.`,
        prioritizationNextActions: `1) **Increase monitoring frequency**; ensure **continuous oximetry** if available.  
2) **Notify** provider/rapid response **now** with **trended vitals**.  
3) **Prepare** for **repeat labs**, **cultures**, and **imaging changes** as ordered; anticipate **broadened therapy** discussions.  
4) **Position** for **optimal breathing**; suction if indicated; protect **airway** if sedation risk emerges.  
5) **Involve RT/physician** early for **oxygen escalation** beyond nasal prongs if needed per order.`,
        rationaleDecisions: `**Distractors**  
“Continue routine rounding” ignores **acute trajectory**. “Encourage oral fluids” may be **unsafe** with **respiratory compromise** and **altered mentation**. **Correct RN reasoning** follows **ABC → perfusion → source → treatment evaluation**.`,
        escalationSafetyTeaching: `**Escalation**  
If **SpO₂** remains low despite oxygen escalation per order, or **BP** does not improve, expect **higher level of care** planning.

**Teaching**  
When stable, reinforce **signs of worsening infection** and **when to seek emergency care**—specific and actionable.`,
        takeaways: `• **Trend analysis** is the skill—boards embed it in **numbers over time**.  
• Pair with **sepsis** and **shock** gold lessons for vocabulary consolidation.`,
      },
      us_np: {
        ...npStub,
        scenarioSetup: `An **ambulatory NP** message system flags a **58-year-old** with **fever**, **rigors**, and **dysuria** for 36 hours. They report **lightheadedness** when standing and **only 200 mL urine** since yesterday. Vitals at the clinic: **BP 98/60**, **HR 112**, **RR 22**, **SpO₂ 97%**, **T 38.8°C**. They look **tired but alert**. No chest pain. **PMH**: diabetes, recurrent UTIs.`,
        clinical_meaning: `This case tests whether you treat **febrile UTI** as **uncomplicated ambulatory illness** versus **early sepsis** with **perfusion compromise**. NP-level reasoning includes **risk stratification**, **cannot-miss** alternatives, and **site-of-care** (outpatient management vs urgent ED evaluation) **based on objective data**—not reassurance alone.`,
        exam_relevance: `NP traps: **prescribing oral antibiotics** while ignoring **hypotension**, **tachycardia**, and **oliguria**; **ordering exhaustive testing** without addressing **instability**; or **ambiguous safety netting**. Items reward **clear escalation thresholds** and **specific follow-up**.`,
        whatMattersMostEscalation: `**What matters most** is deciding whether this client is **safe for outpatient therapy** or needs **urgent ED care** for **possible sepsis**—using **vitals**, **perfusion clues**, and **risk features** rather than labels alone.`,
        prioritizationNextActions: `1) **Repeat vitals** including **orthostatic** assessment if appropriate; look for **end-organ hypoperfusion** (mentation, urine, skin).  
2) **Order/arrange** diagnostics aligned to presentation (e.g., **urinalysis/culture**, **CBC**, **CMP**, **lactate** when indicated by policy/presentation).  
3) If **hypotension**, **rising lactate**, **confusion**, or **respiratory compromise**—**escalate to ED** with **transport** as needed rather than “watchful waiting.”  
4) If **mild**, **reliable**, and **hemodynamically stable**, consider **oral therapy** per guidelines **with explicit safety netting** (return for worse BP, confusion, shortness of breath, anuria).  
5) **Document** reasoning: **differential**, **red flags ruled in/out**, **follow-up timing**.`,
        rationaleDecisions: `**Why ED referral can be correct**  
**Hypotension + oliguria** suggests **sepsis risk** beyond simple cystitis. **Why “just send home with antibiotics” can fail**  
It ignores **perfusion** and **severity**. NP answers should show **risk-aware** planning, not **protocol memorization** divorced from the vignette.`,
        escalationSafetyTeaching: `**Safety netting**  
Teach **return now** for **worsening dizziness**, **unable to urinate**, **fever with confusion**, **shortness of breath**, or **BP you cannot keep elevated**.

**Medicolegal tone**  
Document **what would change your mind** and **what you told the client to do** if things worsen.`,
        takeaways: `• **Sepsis can present “soft”**—use **vitals + perfusion + trajectory**.  
• **Ambulatory NP** items test **disposition** as much as **diagnosis**.  
• Pair with **DKA/HHS** and **fluids/electrolytes** lessons when glucose and ketones appear.`,
      },
    },
    preTest: qt([
      {
        question: "In a postoperative client with fever, tachycardia, hypotension, and new confusion, what is the priority concern?",
        options: [
          "Possible sepsis / life-threatening infection until evaluated.",
          "Mild anxiety about surgery pain only.",
          "Need for routine discharge teaching only.",
          "Chronic age-related memory changes without acute illness.",
        ],
        correct: 0,
        rationale:
          "Fever with tachycardia, hypotension, and acute confusion suggests systemic illness and possible sepsis; prioritize escalation and evaluation over reassurance or routine tasks.",
      },
      {
        question: "Which action best fits PN scope in suspected sepsis with unstable vitals?",
        options: [
          "Independently titrate vasopressor infusions without orders.",
          "Notify the provider/RN, monitor closely, prepare for urgent orders/diagnostics, and report objective trends.",
          "Delay reporting until the next scheduled assessment.",
          "Tell the client to sleep it off.",
        ],
        correct: 1,
        rationale:
          "PN items reward timely reporting, monitoring within role, and preparation—not independent advanced therapies or delayed escalation.",
      },
      {
        question: "Why is urine output an important monitoring parameter in sepsis?",
        options: [
          "It reflects perfusion and end-organ function; oliguria can signal worsening shock.",
          "It only matters for comfort.",
          "It is unrelated to hemodynamics.",
          "It should be ignored if the client is awake.",
        ],
        correct: 0,
        rationale:
          "Urine output is a practical perfusion indicator; oliguria with instability raises concern for worsening hypoperfusion.",
      },
    ]),
    postTest: qt([
      {
        question: "A sepsis-suspect client’s BP falls after an initial fluid bolus per order. What is the best next nursing priority?",
        options: [
          "Reassess perfusion and oxygenation, notify provider, and prepare for escalation per protocol (e.g., vasopressor therapy in monitored settings).",
          "Finish computer training modules.",
          "Send the client to walk unassisted.",
          "Discontinue all oxygen to ‘see true saturations.’",
        ],
        correct: 0,
        rationale:
          "Persistent hypotension after fluids requires reassessment, communication, and preparation for higher-level interventions per orders and policy.",
      },
      {
        question: "Which statement reflects safe patient teaching after stabilization for infection?",
        options: [
          "Return precautions should include specific triggers like worsening breathing, confusion, faintness, or no urine.",
          "Avoid all follow-up because antibiotics fix everything.",
          "Stop antibiotics when fever resolves without clinician guidance.",
          "Ignore new symptoms if pain is controlled.",
        ],
        correct: 0,
        rationale:
          "Teaching should include concrete warning signs and follow-up expectations; vague reassurance is a common trap.",
      },
      {
        question: "Why might lactate be measured in sepsis evaluation?",
        options: [
          "It can reflect tissue hypoperfusion and helps risk-stratify severity when shown in the stem.",
          "It diagnoses anxiety.",
          "It replaces vital signs.",
          "It is only for renal failure screening unrelated to perfusion.",
        ],
        correct: 0,
        rationale:
          "When present in the vignette, lactate supports severity assessment alongside clinical findings; integrate it rather than fixate on one number.",
      },
    ]),
  },

  {
    slug: "clinical-casebook-acs-chest-pain-gold",
    topic: "ACS / chest pain — clinical case study",
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular",
    npTitleStem: "ACS case study — risk stratification & escalation",
    npSeoDescription:
      "NP-level ACS vignette: cannot-miss presentations, ECG/lab integration themes, disposition reasoning, and safety netting without independent cath lab decisions outside the stem.",
    pathophysiologyCore: `**Mechanism (exam framing)**  
**Acute coronary syndrome (ACS)** reflects **acute myocardial ischemia** due to **plaque disruption** and **thrombosis**, supply-demand mismatch, or **non-atherosclerotic** causes when hinted. Boards care that you connect **pressure-like pain**, **radiation**, **autonomic symptoms**, and **risk factors** to **time-sensitive pathways**.

**Exam vocabulary**  
STEMI/NSTEMI/unstable angina language may appear. Even without ECG shown, items test **oxygen**, **monitoring**, **labs**, **medications within role**, and **escalation** for **unstable** features.

**Trajectory**  
**Dynamically changing pain**, **hypotension**, **arrhythmia**, or **pulmonary edema** pushes beyond “stable chest pain” into **emergency management**.`,
    sharedKeyFindings: `**History and symptoms**  
Classic cues: **substernal pressure**, **radiation to jaw/left arm/back**, **diaphoresis**, **nausea**, **dyspnea**. Atypical presentations are common in **women**, **older adults**, and people with **diabetes**—**fatigue**, **epigastric discomfort**, **syncope**.

**Exam**  
Look for **hypotension**, **new murmur** (mechanical complications in advanced items), **pulmonary crackles**, **cool clammy skin** suggesting **poor perfusion**.

**Diagnostics when shown**  
**ECG changes** (ST elevation/depression, T-wave inversion), **troponin elevation**, **CXR** for pulmonary edema—integrate, don’t anchor on one finding.`,
    labsDiagnostics: `**Common testing themes**  
**Serial troponins**, **12-lead ECG**, **CXR**, **coags/CBC** may appear depending on the stem. **D-dimer** is not your first move for classic ACS unless the vignette is explicitly pursuing PE workup.

**Role**  
PN: **prepare**, **monitor**, **report**. RN: **coordinate**, **monitor**, **administer ordered therapies**, **recognize instability**. NP: **risk stratification**, **disposition**, **follow-up planning** when ambulatory—**stem-dependent**.`,
    relatedSlugs: rAcs,
    relatedTitlesBySlug: tAcs,
    variants: {
      us_pn: {
        title: "ACS case study: chest pain triage (NCLEX-PN, US)",
        seoTitle: "ACS case study: chest pain triage | NCLEX-PN US | NurseNest",
        seoDescription:
          "US PN: ACS/chest pain vignette—monitoring, ordered meds, escalation, and scope-safe actions on NCLEX-PN.",
        scenarioSetup: `A **64-year-old** with **hypertension** and **tobacco use** reports **crushing substernal pressure** radiating to the **left arm**, with **diaphoresis** and **nausea** for 45 minutes. Vitals: **BP 148/92**, **HR 102**, **RR 20**, **SpO₂ 95%** on room air. The client is **anxious** but awake. You are assisting in an outpatient clinic today.`,
        clinical_meaning: `This is **ACS until proven otherwise**—even if vitals look “okay,” **symptom cluster + risk factors** demand **urgent evaluation**. PN scope focuses on **recognizing red flags**, **activating RN/provider**, **preparing** ECG/meds per order, and **avoiding** “it’s just anxiety” minimization.`,
        exam_relevance: `PN traps: **walking the client to the parking lot**, **giving reassurance alone**, or **delaying** activation of emergency care. Correct answers **obtain help immediately** and **support monitoring** within role.`,
        whatMattersMostEscalation: `**What matters most** is **time**: **activate EMS/ED pathway** for **acute ongoing chest pain** with **ischemic features**. The priority is **evaluation**, **monitoring**, and **preparation** for reperfusion pathways—not routine paperwork.`,
        prioritizationNextActions: `1) **Stay with the client**; place on **monitor** if available per protocol.  
2) **Notify RN/provider immediately**; many settings will **activate 911** for suspected ACS with ongoing symptoms.  
3) **Prepare** **ECG** and **IV access** per order.  
4) **Administer** **aspirin** only if **ordered** and **not contraindicated**—do not independently prescribe.  
5) **Reassess pain and vitals** frequently; report **any arrhythmia**, **hypotension**, or **worsening dyspnea**.`,
        rationaleDecisions: `**Why “teach relaxation first” is wrong**  
ACS can progress to **arrhythmia** or **shock**. **Why “finish intake forms” is wrong**  
Documentation cannot trump **emergent triage**. **PN wins** by **escalation + support within orders**.`,
        escalationSafetyTeaching: `**Escalation**  
If **pain intensifies**, **BP crashes**, or **SpO₂ falls**, treat as **full emergency**—call **EMS** per policy.

**Teaching**  
After acute care is arranged, reinforce **never ignore recurrent pressure-like chest symptoms** and **use EMS** rather than private car when unstable.`,
        takeaways: `• **Pressure + diaphoresis + radiation** = **urgent pathway**.  
• **PN** = **recognize, support, escalate**.  
• Pair with **ACS** and **clinical judgment** gold lessons.`,
      },
      ca_rpn: {
        title: "ACS case study: chest pain triage (REx-PN, Canada)",
        seoTitle: "ACS case study: chest pain triage | REx-PN Canada | NurseNest",
        seoDescription:
          "Canada RPN: ACS vignette—collaborative escalation, objective reporting, and safe scope on REx-PN.",
        scenarioSetup: `A **59-year-old** describes **tight band-like chest discomfort** with **shortness of breath** since this morning. Vitals: **BP 152/88 mmHg**, **HR 108/min**, **RR 24/min**, **SpO₂ 93%** on room air. The client is **pale** and **diaphoretic**. You work in a **community clinic** setting.`,
        clinical_meaning: `This presentation demands **urgent medical evaluation** for possible **ACS**. Canadian RPN items reward **prompt collaboration**, **clear reporting**, and **safe interventions within scope**—not independent diagnosis or prescribing.`,
        exam_relevance: `Traps include **minimizing diaphoresis** as “stress,” **delaying** escalation to finish vitals on another client, or **unsupervised exertion** (walking tests) during active symptoms.`,
        whatMattersMostEscalation: `**What matters most** is **immediate activation** of **emergency assessment** and **continuous monitoring** while awaiting transport or provider evaluation.`,
        prioritizationNextActions: `1) **Do not leave** the client alone if actively symptomatic.  
2) **Notify** RN/physician and **arrange EMS** per protocol.  
3) **Prepare** **ECG** and **oxygen** per order; monitor **rhythm** if available.  
4) **Document** symptoms with **onset time** and **associated features**.  
5) Avoid giving food or fluids if procedures or imaging may be imminent—follow facility policy.`,
        rationaleDecisions: `**Distractors**  
“Schedule next week” is unsafe for **ongoing ACS features**. **RPN-correct** answers align with **standards** and **timely escalation**.`,
        escalationSafetyTeaching: `**Escalation**  
Worsening **pain**, **syncope**, or **hypotension** requires **EMS** and **higher-level care**.

**Teaching**  
Emphasize **specific** symptoms that should trigger **911** (crushing pain, radiation, diaphoresis, syncope, severe SOB).`,
        takeaways: `• **EMS** is appropriate when **ACS is suspected** and unstable features exist.  
• Pair with **ACS** gold lesson.`,
      },
      us_rn: {
        title: "ACS case study: chest pain triage (NCLEX-RN, US)",
        seoTitle: "ACS case study: chest pain triage | NCLEX-RN US | NurseNest",
        seoDescription:
          "US RN: ACS vignette—ECG/oxygen/meds sequencing, rapid response themes, and monitoring priorities.",
        scenarioSetup: `In the **ED**, a **55-year-old** with **known CAD** reports **9/10 chest pressure** with **nausea**. **BP 88/60**, **HR 110**, **RR 26**, **SpO₂ 90%** on **4 L**. **ECG shows ST elevations** in contiguous leads. The client is **cool and clammy**.`,
        clinical_meaning: `This is **STEMI physiology with shock features**—**perfusion failure** and **time-critical reperfusion**. RN priorities: **resuscitation support**, **continuous monitoring**, **medication administration per order**, and **preparation for reperfusion** (PCI vs thrombolysis per protocol).`,
        exam_relevance: `RN traps: **prioritizing paperwork**, **leaving unstable clients** to get equipment alone without handoff, or **delaying** notification. Expect **team coordination** and **reassessment loops**.`,
        whatMattersMostEscalation: `**What matters most** is **immediate cardiology/PCI team activation** (when STEMI) and **hemodynamic support** per protocol—**oxygen**, **IV access**, **anti-ischemic therapy**, and **treating hypotension** as ordered.`,
        prioritizationNextActions: `1) **Continuous cardiac monitoring**; ensure **defibrillator** availability.  
2) **Notify provider** and **activate cath lab** per STEMI protocol.  
3) **Large-bore IV**, **labs**, **prepare** medications per order (e.g., **antiplatelet**, **anticoagulant**, **nitroglycerin** if appropriate and not contraindicated).  
4) **Oxygen** to target saturation per protocol; monitor for **respiratory compromise**.  
5) **Frequent reassessment** of **pain**, **BP**, **rhythm**, and **perfusion**.`,
        rationaleDecisions: `**Why not “send to CT first” as priority**  
STEMI time metrics center on **reperfusion**—follow the pathway the stem emphasizes. **Why team activation beats solo heroics**  
ACS care is **interprofessional**; the exam rewards **closed-loop** actions.`,
        escalationSafetyTeaching: `**Safety**  
Watch for **arrhythmias**, **bleeding** on anticoagulation, and **hypotension** after nitrates/opiates—communicate changes early.

**Teaching**  
After stabilization, teach **med adherence**, **cardiac rehab**, and **when to call EMS** for recurrent symptoms.`,
        takeaways: `• **ST elevation + shockiness** = **emergency reperfusion + support** themes.  
• Pair with **ACS** and **high-alert meds** lessons.`,
      },
      ca_rn: {
        title: "ACS case study: chest pain triage (NCLEX-RN, Canada)",
        seoTitle: "ACS case study: chest pain triage | NCLEX-RN Canada | NurseNest",
        seoDescription:
          "Canada RN: ACS vignette—metric units, interprofessional STEMI pathway language, and monitoring priorities.",
        scenarioSetup: `On a **telemetry unit**, a client with **NSTEMI** suddenly reports **renewed crushing pain** and **sweating**. **BP 76/48 mmHg**, **HR 122/min**, **RR 28/min**, **SpO₂ 88%** on **2 L**. **Rhythm** is **tachycardic** with **frequent ectopy**.`,
        clinical_meaning: `This is **recurrent ischemia with hemodynamic compromise**—a **priority emergency** on the floor. The meaning is **escalation**, **monitoring**, and **preparation for advanced therapies** rather than routine care.`,
        exam_relevance: `Canada RN items test **objective escalation** and **collaboration**—not **independent cath lab decisions**, but **appropriate activation** and **monitoring**.`,
        whatMattersMostEscalation: `**What matters most** is treating this as **unstable ACS** until evaluated: **notify provider**, **increase monitoring**, **prepare for ICU/CCU** transfer themes, and **support ABCs**.`,
        prioritizationNextActions: `1) **Call for help**; stay at bedside.  
2) **High-flow oxygen** per order; continuous **SpO₂** and **telemetry**.  
3) **IV access**; **labs** per order; prepare **anti-ischemic** and **antithrombotic** meds as prescribed.  
4) **Frequent vitals**; watch for **pulmonary edema**, **arrhythmia**, **bleeding**.  
5) **Document** event timing and interventions.`,
        rationaleDecisions: `**Distractors**  
“Encourage walking” is unsafe. **Pain control** matters, but **perfusion and rhythm** drive triage.`,
        escalationSafetyTeaching: `**Escalation**  
If **BP remains low** or **pain persists**, expect **urgent cardiology** involvement and **possible intervention**—your role is **monitoring** and **preparation**.

**Teaching**  
Use **clear** return precautions after discharge planning when applicable.`,
        takeaways: `• **Recurrent pain + hypotension** = **unstable** until proven otherwise.  
• Pair with **ACS** gold lesson.`,
      },
      us_np: {
        ...npStub,
        scenarioSetup: `A **48-year-old** with **HTN** and **family history** reports **episodes of exertional chest tightness** relieved by rest, now **more frequent**. Today **pain occurs at rest** for **20 minutes** with **diaphoresis**. Vitals in office: **BP 132/84**, **HR 88**, **RR 18**, **SpO₂ 98%**. **ECG** shows **nonspecific changes**; first **troponin** pending.`,
        clinical_meaning: `This is **unstable angina / possible ACS** in an **ambulatory** context. NP reasoning focuses on **risk stratification**, **immediate ED referral** when red flags exist, and **avoiding false reassurance** when symptoms escalate to **rest pain with autonomic features**.`,
        exam_relevance: `NP traps: **sending home** with **only PPI** for “GERD” when **ischemic features** dominate; **ordering stress tests** as first step during **ongoing rest pain**; vague follow-up.`,
        whatMattersMostEscalation: `**What matters most** is **disposition**: **ED evaluation** for **unstable symptoms** rather than outpatient watchful waiting.`,
        prioritizationNextActions: `1) **Activate EMS** or **direct ED evaluation** for **ongoing/rest** chest pain with **ischemic features**.  
2) **Do not** rely on a **single negative troponin** to exclude ACS when **high-risk story** persists—follow **protocol-driven** serial testing in the **appropriate setting**.  
3) **Document** **HEART-equivalent reasoning** themes: **risk factors**, **symptom pattern**, **ECG**, **labs**.  
4) **Coordinate** handoff information (allergies, anticoagulant use, prior cath).  
5) **Safety net** any deferred testing with **specific** return precautions—only if truly appropriate.`,
        rationaleDecisions: `**Why ED referral wins**  
**Rest pain + diaphoresis** exceeds stable outpatient angina patterns for many items. **Why “schedule stress next month” fails**  
It delays **rule-out ACS** in **acute** presentations.`,
        escalationSafetyTeaching: `**Safety netting**  
Tell the client to **call EMS** for **crushing pain**, **radiation**, **diaphoresis**, **syncope**, or **severe SOB**.

**Documentation**  
Record **shared decision-making** if applicable and **why** a pathway was chosen.`,
        takeaways: `• **Ambulatory ACS** items test **disposition** and **risk**.  
• Pair with **ACS** gold lesson and **high-alert meds** for antithrombotic themes.`,
      },
    },
    preTest: qt([
      {
        question: "Which symptom cluster most strongly suggests ACS over simple anxiety?",
        options: [
          "Substernal pressure with diaphoresis, nausea, and radiation to arm/jaw with risk factors.",
          "Sharp pleuritic pain that worsens only with deep breath without other features.",
          "Localized reproducible chest wall tenderness without diaphoresis.",
          "Chronic burning only after spicy meals for years without acute change.",
        ],
        correct: 0,
        rationale:
          "Classic ischemic features and risk factors increase ACS suspicion; pleuritic, reproducible, or purely chronic patterns are often alternate diagnoses—follow the stem.",
      },
      {
        question: "In suspected ACS with ongoing chest pain and diaphoresis in an outpatient setting, what is the best immediate action?",
        options: [
          "Activate emergency evaluation/EMS per protocol and follow monitoring/preparation orders.",
          "Send the client home with antacids as the only plan.",
          "Have the client drive themselves to a pharmacy.",
          "Ignore vitals if the client looks calm.",
        ],
        correct: 0,
        rationale:
          "Ongoing ischemic-type chest pain requires urgent evaluation; outpatient reassurance alone is unsafe.",
      },
      {
        question: "Why is aspirin sometimes given early in ACS pathways when ordered?",
        options: [
          "Antiplatelet therapy reduces thrombotic risk in suspected ACS when not contraindicated.",
          "It treats anxiety primarily.",
          "It replaces PCI.",
          "It is only for pain control without anti-platelet effect.",
        ],
        correct: 0,
        rationale:
          "Antiplatelet therapy is a common ACS theme; follow contraindications and orders in the stem.",
      },
    ]),
    postTest: qt([
      {
        question: "A client with STEMI becomes hypotensive and cool. What is the RN’s best priority?",
        options: [
          "Support perfusion and monitoring per protocol, notify provider, and prepare for advanced interventions (e.g., reperfusion and hemodynamic support).",
          "Leave to complete charting elsewhere.",
          "Encourage vigorous exercise.",
          "Discontinue all IV access.",
        ],
        correct: 0,
        rationale:
          "Shock features in ACS require immediate team activation, resuscitation support, and continuous monitoring—not delayed tasks.",
      },
      {
        question: "Which finding should prompt the fastest escalation in chest pain triage?",
        options: [
          "Hypotension with altered perfusion or new arrhythmia compared with mild stable vitals.",
          "Mild anxiety without ECG changes or symptoms.",
          "Chronic orthopedic knee pain.",
          "A request for a blanket.",
        ],
        correct: 0,
        rationale:
          "Hemodynamic instability and dangerous rhythms outrank comfort requests in triage.",
      },
      {
        question: "Why is repeat troponin testing often used in ACS evaluation?",
        options: [
          "Serial troponins help detect myocardial injury over time; one value may be initially negative early.",
          "Troponin diagnoses anxiety.",
          "Troponin replaces physical exam permanently.",
          "Troponin is unrelated to cardiac injury.",
        ],
        correct: 0,
        rationale:
          "Serial testing is a common theme because injury markers can rise over hours; integrate with ECG and symptoms.",
      },
    ]),
  },

  {
    slug: "clinical-casebook-respiratory-distress-gold",
    topic: "Respiratory distress — clinical case study",
    topicSlug: "respiratory",
    bodySystem: "Respiratory",
    npTitleStem: "Respiratory distress case study — oxygen & escalation",
    npSeoDescription:
      "NP ambulatory case: asthma/COPD overlap triage, SpO₂ interpretation, steroid and bronchodilator themes, and ED referral thresholds—stem-scoped.",
    pathophysiologyCore: `**Mechanism**  
**Respiratory distress** means **increased work of breathing** and/or **gas exchange failure**. Boards connect **airway**, **bronchospasm**, **pneumonia**, **PE**, **pneumothorax**, and **pulmonary edema** through **symptom patterns**, **vitals**, and **response to oxygen**.

**Why it matters**  
Writers embed **trending hypoxia**, **silent saturations**, **accessory muscle use**, and **altered mentation** as escalation triggers.

**Exam skill**  
Choose **oxygen delivery** that matches severity, **reassess**, and **escalate** when **SpO₂** or **work of breathing** fails to improve.`,
    sharedKeyFindings: `**Inspection**  
**Tripod positioning**, **nasal flaring** (peds), **accessory muscle use**, **inability to speak in full sentences**, **cyanosis** (late).

**Vitals**  
**Tachypnea**, **tachycardia**, **hypoxemia**; watch for **normobaric sat** with **high CO₂** in some COPD cases when **mental status** changes.

**Focused lung exam**  
**Wheezes** (obstruction), **crackles** (fluid/infection), **unilateral breath sounds** (pneumothorax/effusion) when tested.`,
    relatedSlugs: rResp,
    relatedTitlesBySlug: tResp,
    variants: {
      us_pn: {
        title: "Respiratory distress case study (NCLEX-PN, US)",
        seoTitle: "Respiratory distress case study | NCLEX-PN US | NurseNest",
        seoDescription:
          "US PN: respiratory distress vignette—oxygen per order, monitoring, escalation, and safe scope.",
        scenarioSetup: `A **client with COPD** suddenly has **increased shortness of breath** and can only speak **two-word sentences**. Vitals: **RR 32**, **HR 118**, **SpO₂ 84%** on **2 L** nasal cannula. You hear **diffuse wheezes**. The client is **anxious** and using **neck muscles** to breathe.`,
        clinical_meaning: `This is **acute respiratory compromise**—not “anxiety alone.” PN priorities: **oxygen per protocol/order**, **positioning**, **timely reporting**, and **preparing** nebulizer therapies **as ordered** while monitoring for **fatigue** and **CO₂ retention** signs if hinted.`,
        exam_relevance: `PN traps: **leaving** to get coffee, **walking** the client, or **withholding oxygen** due to COPD myths—follow **orders** and **escalate** when indicated.`,
        whatMattersMostEscalation: `**What matters most** is **reversing hypoxemia** and **reducing work of breathing** quickly while **notifying** the provider for **possible escalation** to higher-level care.`,
        prioritizationNextActions: `1) **Increase oxygen** per protocol/order; monitor **SpO₂** continuously if available.  
2) **Position** upright; loosen tight clothing.  
3) **Notify RN/provider** immediately with vitals and **accessory muscle** use.  
4) **Prepare** nebulizer meds **as ordered**; verify **five rights**.  
5) **Stay** with the client if acutely unstable; do not send them to walk.`,
        rationaleDecisions: `**Why “calm breathing exercises only” fails**  
Severe distress needs **medical escalation** and **oxygen therapy**, not reassurance alone.`,
        escalationSafetyTeaching: `**Escalation**  
If **mentation** worsens, **SpO₂** stays low, or **RR** climbs, activate **emergency** resources per policy.

**Teaching**  
Teach **inhaler technique** later—first stabilize.`,
        takeaways: `• **Two-word sentences + accessory muscles** = urgent.  
• Pair with **COPD** and **clinical judgment** lessons.`,
      },
      ca_rpn: {
        title: "Respiratory distress case study (REx-PN, Canada)",
        seoTitle: "Respiratory distress case study | REx-PN Canada | NurseNest",
        seoDescription: "Canada RPN: respiratory distress vignette—objective reporting and collaborative care.",
        scenarioSetup: `A **client** with **asthma** reports **worsening wheeze** and **chest tightness** after a **viral illness**. **RR 30/min**, **HR 110/min**, **SpO₂ 90%** on **RA**. You observe **suprasternal retractions** and **inability** to complete sentences.`,
        clinical_meaning: `This suggests **moderate-to-severe** bronchospasm with **hypoxemia**. RPN responsibilities center on **assessment**, **timely collaboration**, and **safe administration** of ordered therapies.`,
        exam_relevance: `Traps: **delaying** notification, **minimizing** retractions, or **independent** medication changes.`,
        whatMattersMostEscalation: `**What matters most** is **oxygen**, **ordered bronchodilator therapy**, and **urgent evaluation** if not improving.`,
        prioritizationNextActions: `1) **Apply oxygen** per order; monitor **SpO₂**.  
2) **Notify** provider for **acute asthma** protocol.  
3) **Prepare** nebulizer/spacer treatments as ordered.  
4) **Monitor** for **fatigue** and **silent deterioration**.  
5) **Document** objective findings frequently.`,
        rationaleDecisions: `**Distractors**  
“Wait an hour” is unsafe with **severe work of breathing** and **hypoxemia**.`,
        escalationSafetyTeaching: `**Escalation**  
If **speaking**, **walking**, or **SpO₂** worsen, activate **emergency** pathways.`,
        takeaways: `• **Retractions + hypoxia** = escalate.  
• Pair with **COPD** lesson.`,
      },
      us_rn: {
        title: "Respiratory distress case study (NCLEX-RN, US)",
        seoTitle: "Respiratory distress case study | NCLEX-RN US | NurseNest",
        seoDescription: "US RN: respiratory distress—ABGs when shown, BiPAP/high-flow themes, and rapid response.",
        scenarioSetup: `A **client** post-op develops **sudden dyspnea** and **pleuritic pain**. **SpO₂ 88%** on **4 L**, **RR 34**, **HR 128**, **BP 108/70**. **Unequal breath sounds** are noted on the right. The client is **diaphoretic**.`,
        clinical_meaning: `Think **pulmonary embolism**, **pneumothorax**, **aspiration**, or **acute pulmonary edema** until evaluated—**unequal breath sounds** push toward **pneumothorax** or **mainstem** issues depending on stem. RN priorities: **oxygen**, **monitoring**, **notify**, **prepare** for diagnostics and interventions.`,
        exam_relevance: `RN traps: **routine meds** first, **delayed** provider notification, or **ambulating** unstable clients.`,
        whatMattersMostEscalation: `**What matters most** is **treating hypoxia** and **activating urgent evaluation** for **life-threatening** causes.`,
        prioritizationNextActions: `1) **High-flow oxygen** per order; continuous monitoring.  
2) **Notify provider**; **prepare** for **CXR**, **ABG**, **CT-PE** as ordered.  
3) **IV access**; **labs** as ordered.  
4) **Stay** with client; prepare for **chest tube** if tension pneumothorax suspected per team.  
5) **Pain control** cautiously—avoid masking instability; follow orders.`,
        rationaleDecisions: `**Why unequal breath sounds matters**  
It suggests **localized** pathology requiring **targeted** management—not generic “anxiety.”`,
        escalationSafetyTeaching: `**Escalation**  
**Hypotension** + **distress** may require **RRT** activation.`,
        takeaways: `• **Sudden pleuritic dyspnea** = big differential.  
• Pair with **PE** launch lesson and **COPD** gold.`,
      },
      ca_rn: {
        title: "Respiratory distress case study (NCLEX-RN, Canada)",
        seoTitle: "Respiratory distress case study | NCLEX-RN Canada | NurseNest",
        seoDescription: "Canada RN: respiratory distress vignette—oxygen titration and escalation.",
        scenarioSetup: `A **client** with **HF** develops **orthopnea** and **frothy sputum**. **RR 32/min**, **SpO₂ 86%** on **5 L**, **BP 190/110 mmHg**, **HR 122/min**, **crackles** bilaterally.`,
        clinical_meaning: `This is **acute pulmonary edema / severe HF decompensation** until treated. Priorities: **oxygen**, **positioning**, **IV access**, **medications per order** (e.g., **diuretics**, **nitroglycerin**), and **continuous monitoring**.`,
        exam_relevance: `Canada RN: choose **urgent interventions** over **routine tasks**; use **metric** values carefully.`,
        whatMattersMostEscalation: `**What matters most** is **reducing preload/afterload** and **supporting oxygenation** per protocol—**early escalation** if instability persists.`,
        prioritizationNextActions: `1) **Upright positioning**; **oxygen**; consider **non-invasive positive pressure** per order.  
2) **Notify** provider; **prepare** diuretics/nitrates as ordered.  
3) **Monitor** **SpO₂**, **BP**, **rhythm**, **I/O**.  
4) **Strict** monitoring for **hypotension** after nitrates.  
5) **Reassess** frequently.`,
        rationaleDecisions: `**Distractors**  
“Complete bed bath now” is inappropriate during **acute respiratory failure**.`,
        escalationSafetyTeaching: `**Escalation**  
If **mentation** declines or **SpO₂** fails to improve, **ICU** pathways.`,
        takeaways: `• **Frothy sputum + crackles + hypoxia** = emergent HF management themes.  
• Pair with **fluids/electrolytes** when diuretics feature.`,
      },
      us_np: {
        ...npStub,
        scenarioSetup: `A **35-year-old** with **asthma** uses **SABA** frequently for **3 days** and now has **night symptoms** and **peak flow 50%** of personal best after **bronchodilator**. **SpO₂ 94%**, **RR 26**, **speaking in phrases**, **wheezing** diffusely.`,
        clinical_meaning: `This is **severe asthma exacerbation** risk. NP ambulatory decisions center on **systemic steroids**, **repeat bronchodilator therapy**, **objective monitoring**, and **ED referral** if **severe** features persist—per guidelines and stem.`,
        exam_relevance: `NP traps: **sending home** without **steroids** when **severe**; **undertreating**; vague follow-up.`,
        whatMattersMostEscalation: `**What matters most** is **appropriate escalation**—**ED** if **severe** or **not improving** after initial therapy.`,
        prioritizationNextActions: `1) **Assess** severity objectively (symptoms, **SpO₂**, **RR**, **PEF** if available).  
2) **Administer/arrange** **SABA** per protocol and **systemic steroids** when indicated.  
3) **Reassess** after a short interval; **refer to ED** for **persistent hypoxia**, **inability to speak**, **silent chest**, **cyanosis**, or **deteriorating PEF**.  
4) **Document** decision rules you used.  
5) **Safety net** with **specific** return precautions.`,
        rationaleDecisions: `**Why ED referral can be correct**  
**Severe exacerbation** features require **continuous monitoring** and possible **advanced therapies**.`,
        escalationSafetyTeaching: `**Safety netting**  
Return for **increasing SOB**, **unable to sleep flat**, **peak flow dropping**, or **SABA overuse**.`,
        takeaways: `• **Peak flow** + **night symptoms** = escalation theme.  
• Pair with **COPD** gold and **PE** lesson.`,
      },
    },
    preTest: qt([
      {
        question: "Which finding best indicates increased work of breathing?",
        options: [
          "Accessory muscle use, inability to speak in full sentences, and rising respiratory rate.",
          "Stable conversational speech with normal RR.",
          "Chronic mild fatigue without acute change.",
          "Only mild nasal congestion without respiratory distress.",
        ],
        correct: 0,
        rationale:
          "Increased work of breathing includes accessory muscle recruitment, tachypnea, and inability to speak in full sentences—key escalation cues.",
      },
      {
        question: "Why is continuous pulse oximetry prioritized in severe respiratory distress?",
        options: [
          "It tracks oxygenation trends during interventions and helps detect rapid deterioration.",
          "It replaces nursing assessment.",
          "It is only cosmetic monitoring.",
          "It is unrelated to oxygenation.",
        ],
        correct: 0,
        rationale:
          "Continuous SpO2 monitoring supports timely escalation when oxygenation fails to improve or worsens.",
      },
      {
        question: "In COPD with acute distress, what is a common exam pitfall?",
        options: [
          "Withholding oxygen due to incorrect fear of ‘removing the drive to breathe’ when hypoxemia is present—follow orders/protocols.",
          "Giving oxygen when hypoxemic.",
          "Monitoring RR.",
          "Notifying the provider when distress worsens.",
        ],
        correct: 0,
        rationale:
          "Hypoxemia should be corrected per protocol; CO2 retention is managed with monitoring and ordered therapies—not by tolerating dangerously low SpO2.",
      },
    ]),
    postTest: qt([
      {
        question: "A post-op client has sudden pleuritic pain and unequal breath sounds with hypoxemia. What is the priority?",
        options: [
          "Oxygen, monitoring, urgent provider notification, and preparation for emergent evaluation (e.g., imaging/interventions).",
          "Ambulate to resolve atelectasis immediately.",
          "Delay notification until morning rounds.",
          "Give a PRN sleep aid first.",
        ],
        correct: 0,
        rationale:
          "Sudden hypoxemia with localized exam findings requires urgent evaluation for pneumothorax/PE and other emergencies—not exertion or delays.",
      },
      {
        question: "Which client needs the fastest escalation?",
        options: [
          "SpO2 82% with altered mentation versus SpO2 95% on room air with mild cough.",
          "Mild cough without hypoxia.",
          "Stable chronic pain controlled with meds.",
          "Request for ice chips only.",
        ],
        correct: 0,
        rationale:
          "Hypoxemia with altered mentation suggests imminent respiratory failure risk and requires urgent intervention.",
      },
      {
        question: "Why might non-invasive positive pressure ventilation be used in acute pulmonary edema?",
        options: [
          "It can improve oxygenation and reduce work of breathing while other therapies take effect—per orders and protocols.",
          "It replaces diuretics always.",
          "It is only for sedation.",
          "It is contraindicated in all HF patients.",
        ],
        correct: 0,
        rationale:
          "NIV is a common supportive therapy for respiratory failure from cardiogenic pulmonary edema when indicated—follow the stem and orders.",
      },
    ]),
  },

  {
    slug: "clinical-casebook-glucose-dka-hypoglycemia-gold",
    topic: "Glucose emergencies — clinical case study",
    topicSlug: "endocrine",
    bodySystem: "Endocrine / metabolic",
    npTitleStem: "Glucose emergency case study — DKA vs hypoglycemia",
    npSeoDescription:
      "NP case: hyperglycemic crisis vs hypoglycemia triage, insulin safety, potassium themes, and ED referral—aligned to protocols in the stem.",
    pathophysiologyCore: `**Mechanisms**  
**Hypoglycemia** is **low glucose** with **neuroglycopenic** and **adrenergic** symptoms. **DKA** is **hyperglycemia + ketosis + metabolic acidosis** (type 1 common; type 2 possible). Boards test **recognition**, **monitoring**, **electrolytes**, and **safe insulin administration**.

**Why it matters**  
Mismanagement causes **cerebral injury** (hypoglycemia) or **arrhythmias** (rapid potassium shifts) in DKA therapy.

**Exam lens**  
Separate **fatigue + sweating + tremor** from **polyuria + Kussmaul + fruity breath** patterns.`,
    sharedKeyFindings: `**Hypoglycemia clues**  
**Diaphoresis**, **tremor**, **tachycardia**, **hunger**, **confusion**, **seizure**, **coma**—often **rapid**.

**DKA clues**  
**Polyuria**, **polydipsia**, **nausea/vomiting**, **abdominal pain**, **Kussmaul respirations**, **ketones**, **anion gap acidosis** when labs shown.

**Overlap trap**  
Altered mental status appears in both—use **glucose measurement** as the pivot when available.`,
    relatedSlugs: rGlucose.relatedSlugs,
    relatedTitlesBySlug: rGlucose.relatedTitlesBySlug,
    variants: {
      us_pn: {
        title: "Glucose emergency case study (NCLEX-PN, US)",
        seoTitle: "Glucose emergency case study | NCLEX-PN US | NurseNest",
        seoDescription: "US PN: DKA vs hypoglycemia—monitoring, checks, and escalation within scope.",
        scenarioSetup: `A **young adult with type 1 diabetes** feels **shaky** and **sweaty** after **insulin** and **skipped lunch**. **Fingerstick glucose 52 mg/dL**. **HR 110**, **diaphoretic**, **confused**.`,
        clinical_meaning: `**Hypoglycemia** is an **immediate safety emergency**. PN priorities: **protect airway**, **give fast-acting carbohydrate per order/protocol**, **recheck glucose**, and **notify** provider for persistent symptoms.`,
        exam_relevance: `PN traps: **insulin independent dosing**, **leaving** confused client alone, or **delaying** treatment.`,
        whatMattersMostEscalation: `**What matters most** is **rapid glucose correction** and **frequent reassessment**—then determine **why** it happened (dose/meals/exertion).`,
        prioritizationNextActions: `1) **If conscious and able to swallow**: give **15 g fast carbs** per protocol; **recheck** in ~15 minutes.  
2) **If unable to swallow or severe**: follow **facility protocol** for **glucagon** and **EMS** as applicable.  
3) **Stay** with client; monitor **neuro status**.  
4) **Notify** RN/provider for **recurrent hypoglycemia**.  
5) **Document** times and responses.`,
        rationaleDecisions: `**Why not “give insulin”**  
That worsens hypoglycemia. **Why not ignore confusion**  
Neuroglycopenia can progress to seizures.`,
        escalationSafetyTeaching: `**Escalation**  
**Seizures**, **unresponsiveness**, or **persistent hypoglycemia** = **emergency**.

**Teaching**  
Teach **15/15 rule** patterns and **always carry** fast carbs when applicable.`,
        takeaways: `• **Glucose first** in altered diabetes clients when hypoglycemia suspected.  
• Pair with **DKA/HHS** gold lesson.`,
      },
      ca_rpn: {
        title: "Glucose emergency case study (REx-PN, Canada)",
        seoTitle: "Glucose emergency case study | REx-PN Canada | NurseNest",
        seoDescription: "Canada RPN: glucose emergency vignette—collaboration and monitoring.",
        scenarioSetup: `A client on **basal-bolus insulin** has **tremor**, **pallor**, and **confusion**. **Capillary glucose 3.0 mmol/L**.`,
        clinical_meaning: `**Hypoglycemia** requires **immediate treatment** and **close observation**. RPN actions follow **orders/protocol** with **prompt reporting** for recurrent events.`,
        exam_relevance: `Traps: **delaying** carbs, **unsupervised** ambulation, or **scope** violations.`,
        whatMattersMostEscalation: `**What matters most** is **raising glucose safely** and **monitoring** for rebound issues.`,
        prioritizationNextActions: `1) **Treat** per protocol with **fast glucose**.  
2) **Recheck** per protocol.  
3) **Notify** provider for **orders** if not improving.  
4) **Monitor** vitals and neuro status.  
5) **Document** thoroughly.`,
        rationaleDecisions: `**Distractors**  
“Wait for meal tray” is unsafe with **neuro symptoms**.`,
        escalationSafetyTeaching: `**Escalation**  
If **unable to protect airway**, activate **emergency** response per policy.`,
        takeaways: `• **mmol/L** values—know your **targets** from training.  
• Pair with **DKA/HHS** lesson.`,
      },
      us_rn: {
        title: "Glucose emergency case study (NCLEX-RN, US)",
        seoTitle: "Glucose emergency case study | NCLEX-RN US | NurseNest",
        seoDescription: "US RN: DKA inpatient case—fluids, insulin gtt themes, potassium monitoring.",
        scenarioSetup: `A **client with DKA** has **BG 480 mg/dL**, **pH 7.18**, **K+ 5.6 mEq/L** on admission. **RR 32**, **HR 124**, **dry mucosa**, **fruity breath**. **Insulin infusion** per protocol is starting.`,
        clinical_meaning: `DKA management is **fluid resuscitation**, **insulin therapy**, **electrolyte monitoring**, and **watching for complications** (hypokalemia as insulin drives K intracellularly). RN priorities: **strict monitoring**, **accurate I/O**, **timely labs**, **communication**.`,
        exam_relevance: `Traps: **giving insulin without** addressing **K**, **missing** frequent glucose checks, or **ignoring** fluid balance.`,
        whatMattersMostEscalation: `**What matters most** is **safe correction**—especially **potassium** and **volume status**—not speed without monitoring.`,
        prioritizationNextActions: `1) **Continuous cardiac monitoring** if indicated; frequent **vitals**.  
2) **Insulin per protocol** with **hourly glucose** checks when ordered.  
3) **Replace potassium** per protocol when levels fall—**do not** ignore hypokalemia during insulin therapy.  
4) **Fluids** per order; monitor **I/O**, **mental status**, **breathing pattern**.  
5) **Report** **K**, **glucose**, **anion gap** trends per orders.`,
        rationaleDecisions: `**Why K matters**  
Insulin lowers **serum K**—arrhythmia risk. **Why rapid fixes alone fail**  
DKA correction needs **systematic monitoring**.`,
        escalationSafetyTeaching: `**Escalation**  
**K < critical thresholds**, **arrhythmia**, **worsening pH**, or **unable to protect airway** require urgent intervention.`,
        takeaways: `• **DKA = insulin + fluids + electrolytes** as a set.  
• Pair with **DKA/HHS** and **fluids/electrolytes** gold lessons.`,
      },
      ca_rn: {
        title: "Glucose emergency case study (NCLEX-RN, Canada)",
        seoTitle: "Glucose emergency case study | NCLEX-RN Canada | NurseNest",
        seoDescription: "Canada RN: DKA case—metric labs and monitoring priorities.",
        scenarioSetup: `**BG 28 mmol/L**, **ketones positive**, **bicarbonate low**, **K+ 5.4 mmol/L**. Client **vomiting**, **dehydrated**, **Kussmaul breathing**.`,
        clinical_meaning: `Classic **DKA** presentation. Priorities align with **resuscitation**, **insulin therapy**, and **electrolyte safety**—with **Canadian metric** labs in mind.`,
        exam_relevance: `Traps: **routine tasks** over **monitoring**, **missing** **K** trends.`,
        whatMattersMostEscalation: `**What matters most** is **systematic correction** with **frequent reassessment**.`,
        prioritizationNextActions: `1) **Monitor** **neuro**, **vitals**, **EKG** if indicated.  
2) **Insulin** and **fluids** per orders.  
3) **Recheck** **K** and **glucose** per protocol.  
4) **Report** abnormalities early.  
5) **NPO** if vomiting—follow orders.`,
        rationaleDecisions: `**Distractors**  
Oral diet during **active vomiting** may be inappropriate—follow orders.`,
        escalationSafetyTeaching: `**Escalation**  
**Cerebral edema** signs in peds DKA are high stakes—urgent escalation if hinted.`,
        takeaways: `• **Vomiting + acidosis** = close monitoring.  
• Pair with **DKA/HHS** lesson.`,
      },
      us_np: {
        ...npStub,
        scenarioSetup: `A **patient** on **basal insulin** reports **frequent lows** at night. **SMBG** logs show **50s mg/dL** twice weekly. **A1c** at goal but **hypoglycemia unawareness** is suspected.`,
        clinical_meaning: `NP ambulatory focus: **hypoglycemia risk reduction**, **regimen adjustment** concepts, **CGM** consideration, and **patient safety**—not chasing A1c at the expense of **dangerous lows**.`,
        exam_relevance: `NP traps: **increasing insulin** to fix A1c while ignoring **nocturnal lows**; vague education.`,
        whatMattersMostEscalation: `**What matters most** is **treating hypoglycemia as a sentinel event** and **restructuring therapy** with **specific follow-up**.`,
        prioritizationNextActions: `1) **Review** insulin timing, **basal** appropriateness, **meal patterns**, **alcohol**, **exercise**.  
2) **Consider CGM** or more frequent monitoring when indicated.  
3) **Adjust** therapy per guidelines—**stem-dependent** (often **reduce basal**, **behavioral plans**).  
4) **Teach** **hypoglycemia action plan** with **glucagon** access.  
5) **Document** **shared decision-making**.`,
        rationaleDecisions: `**Why this is not “success”**  
**Severe/recurrent hypoglycemia** is **harm** even if A1c looks good.`,
        escalationSafetyTeaching: `**Safety**  
**Do not drive** until hypoglycemia risk addressed—clear counseling.`,
        takeaways: `• **Hypoglycemia prevention** is a premium ambulatory theme.  
• Pair with **DKA/HHS** lesson.`,
      },
    },
    preTest: qt([
      {
        question: "Which symptom cluster best suggests hypoglycemia in a client with diabetes?",
        options: [
          "Diaphoresis, tremor, tachycardia, confusion with low glucose reading.",
          "Kussmaul respirations and polyuria only.",
          "Painless hematuria without glucose issues.",
          "Chronic joint pain without neuro change.",
        ],
        correct: 0,
        rationale:
          "Adrenergic and neuroglycopenic symptoms with a low glucose reading suggest hypoglycemia; DKA presents differently with hyperglycemia and ketosis patterns.",
      },
      {
        question: "Why is potassium monitored closely during DKA treatment with insulin?",
        options: [
          "Insulin drives potassium into cells and serum potassium can fall, increasing arrhythmia risk.",
          "Potassium is irrelevant in DKA.",
          "Insulin always raises potassium.",
          "Potassium should only be checked once at discharge.",
        ],
        correct: 0,
        rationale:
          "Serum potassium can drop during insulin therapy; monitoring and replacement per protocol are central safety themes.",
      },
      {
        question: "A conscious client has mild hypoglycemia. What is an appropriate first step per common protocols?",
        options: [
          "Give fast-acting carbohydrate and recheck glucose after a short interval.",
          "Give long-acting carbohydrate only.",
          "Give insulin immediately.",
          "Ignore if the client wants to sleep.",
        ],
        correct: 0,
        rationale:
          "The 15/15 style approach treats with fast carbs and reassesses; insulin would worsen hypoglycemia.",
      },
    ]),
    postTest: qt([
      {
        question: "Which finding is more consistent with DKA than isolated hypoglycemia?",
        options: [
          "Hyperglycemia with ketosis and metabolic acidosis patterns when labs are shown.",
          "Glucose 55 mg/dL with rapid improvement after oral carbs.",
          "Normal A1c without acute symptoms.",
          "Localized cellulitis without systemic symptoms.",
        ],
        correct: 0,
        rationale:
          "DKA is a hyperglycemic ketotic state with acidosis; hypoglycemia presents with low glucose and adrenergic/neuro symptoms.",
      },
      {
        question: "What is the best nursing priority if a client becomes unconscious with suspected severe hypoglycemia?",
        options: [
          "Follow emergency protocol (e.g., glucagon/EMS) and protect airway—do not give PO to unconscious clients.",
          "Give orange juice by mouth immediately.",
          "Leave to find family.",
          "Encourage walking to raise glucose.",
        ],
        correct: 0,
        rationale:
          "Unconscious clients cannot safely swallow; emergency treatment and airway protection are priorities per protocol.",
      },
      {
        question: "Why is frequent glucose monitoring emphasized during IV insulin therapy for DKA?",
        options: [
          "To titrate therapy safely and detect rapid changes in glucose and electrolyte-related risks.",
          "To replace ABGs entirely.",
          "To reduce nursing workload.",
          "Because glucose never changes during therapy.",
        ],
        correct: 0,
        rationale:
          "Frequent monitoring supports safe correction and early detection of complications.",
      },
    ]),
  },
];
