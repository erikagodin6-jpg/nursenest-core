/**
 * Obstetric emergencies — hemorrhage, hypertensive crisis, fetal distress patterns, cord prolapse recognition.
 * Remediation wave 4: maternity high-stakes recognition, escalation, and scope-safe nursing actions.
 */
import type { PathwayLessonQuizItem, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import {
  ensurePremiumSeoDescription,
  PATHWAY_EXAM_LABEL,
} from "@/lib/lessons/scoped-lessons/gold-premium-synthesis";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export const OB_EMERGENCIES_GOLD_SLUG = "ob-emergencies-gold-standard" as const;

type ObVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, ObVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**High-stakes OB patterns exams love**  
Items cluster **postpartum hemorrhage** (soft uterus + heavy lochia, vs retained tissue picture), **antepartum bleeding** with pain (abruption suspicion), **preeclampsia progression** (BP, headache, visual changes, RUQ pain, reflexes when Mg is in play), **eclampsia** (seizure in pregnancy/puerperium), **prolapsed cord** (cord visible, fetal bradycardia—knee-chest, elevate presenting part, STAT delivery team), and **late decelerations / minimal variability** as **uteroplacental insufficiency** until proven otherwise.

**Nursing actions (exam spine)**  
**Assess and trend**: BP, HR, RR, SpO₂, pain, bleeding amount (pads, clots, fundal tone), FHR pattern, reflexes if magnesium, urine output if ordered. **Carry out orders**: uterotonic administration, Mg bolus/maintenance per protocol, large-bore access prep, type & screen readiness, oxygen per order. **Escalate** for **uncontrolled bleeding**, **seizure**, **non-reassuring FHR**, **severe-range BP with neuro symptoms**, or **cord prolapse**—not “reassure and wait.”

**Safety rails**  
Do **not** substitute **comfort measures** for **hemodynamic collapse**. Know **Mg toxicity** cues (respiratory depression, absent reflexes) versus expected sedation. **Hydralazine / antihypertensives** in severe preeclampsia require **BP monitoring** per stem—avoid maternal hypotension that worsens placental flow.`;

function pack(
  variant: ObVariant,
  meta: {
    title: string;
    seoTitle: string;
    seoDescription: string;
    clinical_meaning: string;
    exam_relevance: string;
    clinical_scenario: string;
    takeaways: string;
  },
  quizzes: { preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] },
) {
  return { variant, ...meta, quizzes };
}

const VARIANTS: Record<ObVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "OB emergency cues & escalation (NCLEX-PN, US)",
      seoTitle: "Obstetric emergencies | NCLEX-PN US | NurseNest",
      seoDescription:
        "US PN: postpartum hemorrhage, preeclampsia red flags, cord prolapse recognition, and safe escalation within scope.",
      clinical_meaning: `**PN scope in L&D/postpartum**  
You **measure and report bleeding**, **fundal tone and height**, **vital trends**, **FHR when delegated**, and **I&O**; **administer ordered uterotonics/fluids**; **support oxygen**; and **stay with unstable clients** while **activating RN/MD**. You **do not** independently titrate magnesium or interpret strips beyond your role unless the item defines extended competency.`,
      exam_relevance: `Traps: **routine newborn bath** during **soaking pad + hypotension**, **walking away** from **prolapsed cord**, or **delaying report** when **BP is severe** with **visual changes**. Items reward **objective data + immediate notification**.`,
      clinical_scenario: `**Vignette — postpartum**  
Client **pale**, **HR 118**, **BP 88/52**, **uterus boggy**, **peripad saturated in 15 minutes**.

**Fork**  
**Massage fundus per protocol**, **notify RN now**, **prepare for ordered uterotonics**—not “encourage breastfeeding only.”`,
      takeaways: `• **Boggy uterus + heavy bleeding** = hemorrhage pattern until team intervenes.  
• **Cord at introitus + fetal bradycardia** = prolapse emergency—position + team.  
• **Scope**: support orders, observe, report—do not improvise high-risk meds.`,
    },
    {
      preTest: [
        {
          question: "Which postpartum finding should the PN report first?",
          options: [
            "Stable fundus, minimal lochia.",
            "Boggy uterus with heavy bleeding and rising heart rate.",
            "Request for ice chips.",
            "Visitor at bedside.",
          ],
          correct: 1,
          rationale: "Hemorrhage with hypoperfusion signs requires immediate RN/provider activation and intervention support.",
        },
        {
          question: "Cord is visible at the vaginal opening and FHR drops suddenly. Best immediate theme?",
          options: [
            "Ambulate the client.",
            "Relieve cord compression per protocol—knee-chest or Trendelenburg, elevate presenting part, call team STAT.",
            "Wait for next scheduled assessment.",
            "Give oral fluids only.",
          ],
          correct: 1,
          rationale: "Prolapsed cord is an obstetric emergency requiring immediate maneuvers and delivery team activation.",
        },
        {
          question: "Client on magnesium sulfate reports new visual blurring and BP 168/104. PN should?",
          options: [
            "Ignore until morning.",
            "Report immediately—severe-range BP with neuro symptoms is an escalation trigger in preeclampsia teaching.",
            "Turn off monitor alarms.",
            "Encourage sleep without assessment.",
          ],
          correct: 1,
          rationale: "Worsening neuro status with hypertension signals severe features and needs urgent evaluation.",
        },
      ],
      postTest: [
        {
          question: "Why monitor respirations closely during magnesium therapy?",
          options: [
            "Mg has no respiratory risk.",
            "Respiratory depression is a toxicity sign requiring urgent provider attention.",
            "RR replaces BP monitoring.",
            "Only needed after discharge.",
          ],
          correct: 1,
          rationale: "Magnesium toxicity includes respiratory compromise; frequent assessment is standard teaching.",
        },
        {
          question: "Which task can wait when another client has uncontrolled postpartum hemorrhage?",
          options: [
            "Applying pressure to fundus per order and documenting blood loss.",
            "Routine paperwork for a stable client.",
            "Notifying the charge nurse about hemorrhage.",
            "Preparing ordered blood products per protocol.",
          ],
          correct: 1,
          rationale: "Non-urgent tasks yield to life-threatening instability and hemorrhage response.",
        },
        {
          question: "PN priority when assigned to observe a client after eclamptic seizure?",
          options: [
            "Leave for break.",
            "Airway patency, safety, frequent vitals per order, and ongoing monitoring for recurrence.",
            "Discharge planning only.",
            "Remove oxygen to assess room air.",
          ],
          correct: 1,
          rationale: "Post-seizure monitoring focuses on airway, safety, vitals, and recurrence risk per orders.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "OB emergency cues & escalation (REx-PN, Canada)",
      seoTitle: "Obstetric emergencies | REx-PN Canada | NurseNest",
      seoDescription:
        "Canadian PN: metric vitals, PPH, severe hypertension, interprofessional activation, and scope-safe maternity support.",
      clinical_meaning: `**RPN in maternity**  
Use **SI units** and **mmHg BP** as shown. You **quantify blood loss**, **assess tone**, **trend vitals**, **communicate in clear SBAR style** to RN/NP/physician, and **execute controlled acts** only within your **provincial scope**. **Magnesium** and **oxytocin** safety are high-yield collaboration topics.`,
      exam_relevance: `Canadian stems still punish **delay** for **admin tasks** when **PPH** or **eclampsia** is evolving. Watch **language**: **report vs independently prescribe** therapies.`,
      clinical_scenario: `**Vignette**  
Third trimester client **BP 162/104 mmHg**, **RUQ pain**, **new headache**, **reflexes brisk** in stem.

**Fork**  
Escalate **severe features**—not “offer acetaminophen and reassess tomorrow.”`,
      takeaways: `• **RUQ pain + headache + severe BP** = preeclampsia severity until evaluated.  
• **PPH** requires **quantified loss** and **timed** reporting.  
• **Collaboration** with RN/NP is explicit in Canadian practice items.`,
    },
    {
      preTest: [
        {
          question: "Which finding should prompt immediate RPN reporting in pregnancy?",
          options: [
            "Mild ankle edema without other symptoms.",
            "Severe headache with visual changes and elevated BP.",
            "Routine prenatal vitamin question.",
            "Stable fetal movement reported.",
          ],
          correct: 1,
          rationale: "Neurologic symptoms with hypertension suggest severe preeclampsia features requiring urgent evaluation.",
        },
        {
          question: "RPN role during suspected abruption with vaginal bleeding and tetanic uterus?",
          options: [
            "Send client home.",
            "Continuous monitoring support, vitals, prepare for emergent orders, escalate immediately.",
            "Delay report to finish charting.",
            "Ambulate for comfort.",
          ],
          correct: 1,
          rationale: "Abruptio is life-threatening; nursing focuses on monitoring, preparation, and rapid escalation.",
        },
        {
          question: "Why document pad counts and clots in postpartum bleeding?",
          options: [
            "Documentation is optional.",
            "Quantifies hemorrhage severity and guides transfusion/uterotonic decisions.",
            "Only for research.",
            "Replaces vital signs.",
          ],
          correct: 1,
          rationale: "Objective blood loss data drives obstetric emergency management.",
        },
      ],
      postTest: [
        {
          question: "Late decelerations with minimal variability in labor—exam teaching?",
          options: [
            "Ignore until delivery.",
            "Non-reassuring pattern—notify provider, increase surveillance per protocol, anticipate intervention.",
            "Routine only.",
            "Stop fetal monitoring.",
          ],
          correct: 1,
          rationale: "Uteroplacental insufficiency patterns require escalation and close monitoring.",
        },
        {
          question: "RPN notes absent patellar reflexes on magnesium. Action?",
          options: [
            "Continue without telling anyone.",
            "Stop infusion per protocol and notify RN/provider—toxicity concern.",
            "Increase rate.",
            "Give sedatives independently.",
          ],
          correct: 1,
          rationale: "Loss of reflexes signals magnesium toxicity risk and requires urgent provider involvement.",
        },
        {
          question: "Which statement reflects safe delegation during OB hemorrhage?",
          options: [
            "UAP interprets fetal strip alone.",
            "RPN performs ordered tasks and reports trends; fetal interpretation stays with qualified clinician unless scope extends.",
            "No communication needed.",
            "UAP titrates oxytocin.",
          ],
          correct: 1,
          rationale: "High-risk OB care keeps assessment interpretation and titration within licensed scope.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "OB emergencies: RN stabilization & protocols (NCLEX-RN, US)",
      seoTitle: "Obstetric emergencies nursing | NCLEX-RN US | NurseNest",
      seoDescription:
        "NCLEX-RN: PPH bundle elements, magnesium safety, fetal distress, abruption, and prioritization in L&D/postpartum.",
      clinical_meaning: `**RN**  
You **lead bedside stabilization** within orders: **uterotonic administration**, **IV access/blood bank readiness**, **Mg protocol execution** with **reflex and respiratory monitoring**, **FHR interpretation collaboration**, **oxygen**, **positioning**, and **emergency delivery preparation**. You **prioritize** among patients when **one is hemorrhaging** or **non-reassuring strip**.`,
      exam_relevance: `Forks: **first action in PPH**, **Mg toxicity vs therapeutic**, **prolapsed cord**, **eclampsia seizure** management sequence, **BP meds** that risk **uteroplacental hypoperfusion**, **disseminated intravascular coagulation** cues after hemorrhage.`,
      clinical_scenario: `**Vignette — L&D**  
Term labor: **sudden prolonged deceleration**, **loss of variability**, **vaginal bleeding**, **tetanic uterus**.

**Fork**  
**Activate team**, **maternal vitals + fetal monitoring**, **IV/lab readiness**—think **abruption** until evaluated, not “routine labor support only.”`,
      takeaways: `• **Painful bleeding + uterine hypertonus** = abruption suspicion.  
• **Second-line uterotonics** and **surgical rescue** are team decisions—your job is **early recognition + protocol support**.  
• **Family updates** happen after **safety actions** are underway.`,
    },
    {
      preTest: [
        {
          question: "Which client should the RN assess first?",
          options: [
            "Stable post-op dressing change due in 2 hours.",
            "Laboring client with acute fetal bradycardia and suspected cord prolapse.",
            "Client requesting snack.",
            "Stable couplet room teaching.",
          ],
          correct: 1,
          rationale: "Acute fetal compromise with prolapse concern is the highest immediate priority.",
        },
        {
          question: "First-line nursing priority during eclamptic seizure?",
          options: [
            "Start oral magnesium.",
            "Safety, airway support, timing seizure, notify provider, prepare for ordered Mg/benzodiazepine per protocol.",
            "Ambulate client.",
            "Discharge instructions.",
          ],
          correct: 1,
          rationale: "Seizure safety and activation precede long-term planning; magnesium is per protocol after stabilization steps.",
        },
        {
          question: "PPH with continued bleeding after ordered uterotonic—RN thinks?",
          options: [
            "Stop all monitoring.",
            "Escalate for additional interventions (second-line meds, balloon, surgery) per hemorrhage protocol.",
            "Send to shower.",
            "Ignore fundus.",
          ],
          correct: 1,
          rationale: "Refractory hemorrhage requires escalation beyond first-line uterotonics.",
        },
      ],
      postTest: [
        {
          question: "Hydralazine given for severe hypertension in preeclampsia—priority assessment?",
          options: [
            "Only fetal heart rate once.",
            "Frequent maternal BP and fetal status to avoid maternal hypotension compromising perfusion.",
            "Discontinue all monitoring.",
            "Pain score only.",
          ],
          correct: 1,
          rationale: "Antihypertensives in pregnancy need balanced BP control and placental perfusion monitoring.",
        },
        {
          question: "Why is type and screen critical in active antepartum hemorrhage?",
          options: [
            "Never needed.",
            "Prepares for rapid transfusion if surgical or medical hemorrhage management is required.",
            "Replaces ultrasound.",
            "Only postpartum.",
          ],
          correct: 1,
          rationale: "Massive hemorrhage protocols depend on ready blood products.",
        },
        {
          question: "RN delegating during OB emergency—appropriate?",
          options: [
            "Delegate FHR interpretation to UAP.",
            "Delegate stable tasks with clear parameters; retain assessment, titration, and emergency interpretation.",
            "No help allowed.",
            "Delegate magnesium bolus to family.",
          ],
          correct: 1,
          rationale: "Delegation preserves RN accountability for high-risk assessments and medication titration.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "OB emergencies (NCLEX-RN, Canada)",
      seoTitle: "Obstetric emergencies nursing | NCLEX-RN Canada | NurseNest",
      seoDescription:
        "Canadian RN: maternity emergencies, metric labs, collaborative hemorrhage response, and fetal surveillance escalation.",
      clinical_meaning: `**Canadian RN**  
Integrate **national/provincial maternity safety** language with **NCLEX-style** judgment: **quantified blood loss**, **lactate** when shown in mmol/L, **Mg toxicity** monitoring, and **rapid response** activation. **Interprofessional** models emphasize **clear escalation** and **documentation timestamps**.`,
      exam_relevance: `Same forks as US RN with **metric** traps and **Canadian** scope wording for **LPN/RPN** collaboration during **PPH**.`,
      clinical_scenario: `**Vignette**  
Postpartum **HR 124**, **BP 86/50 mmHg**, **fundus displaced**, **heavy lochia**.

**Fork**  
Think **uterine atony + hypovolemia**—**fundal massage per protocol**, **large-bore IV**, **notify**, **prepare for ordered blood**—not delayed routine care.`,
      takeaways: `• **Hypotension + tachycardia + bleeding** = shock until resuscitated.  
• **Canadian exams** still test **prioritization** identically—language differs, physiology does not.  
• **Seizure** in pregnancy remains **eclampsia** until proven otherwise.`,
    },
    {
      preTest: [
        {
          question: "Which cluster suggests magnesium toxicity?",
          options: [
            "RR 16, reflexes +2.",
            "RR 8, absent reflexes, decreased consciousness.",
            "Mild headache only.",
            "BP 120/70.",
          ],
          correct: 1,
          rationale: "Respiratory depression with absent reflexes signals magnesium toxicity.",
        },
        {
          question: "Canadian RN priority with prolapsed cord?",
          options: [
            "Viginal exam by RN without orders always.",
            "Relieve compression, call team, prepare for emergent delivery per protocol—avoid cord compression.",
            "Send client to cafeteria.",
            "Wait for physician rounds.",
          ],
          correct: 1,
          rationale: "Cord prolapse demands immediate maneuvers and obstetric rescue.",
        },
        {
          question: "Why trend urine output in severe preeclampsia?",
          options: [
            "It is irrelevant.",
            "Renal perfusion and end-organ involvement are monitored via UOP when ordered.",
            "It replaces BP.",
            "Only for diabetes.",
          ],
          correct: 1,
          rationale: "Oliguria can reflect worsening end-organ dysfunction in preeclampsia.",
        },
      ],
      postTest: [
        {
          question: "Which finding best supports DIC concern after massive PPH?",
          options: [
            "Isolated mild anemia.",
            "Oozing from IV sites, dropping platelets, prolonged PT/INR in stem.",
            "Stable coags always after birth.",
            "Bradycardia only.",
          ],
          correct: 1,
          rationale: "Consumptive coagulopathy presents with bleeding and abnormal coagulation studies.",
        },
        {
          question: "Late decelerations after epidural—first nursing action theme?",
          options: [
            "Ignore as epidural artifact always.",
            "Reposition, oxygen per order, IV fluid bolus if ordered, notify provider—rule out uteroplacental insufficiency.",
            "Ambulate immediately.",
            "Stop all monitoring.",
          ],
          correct: 1,
          rationale: "FHR changes require corrective measures and provider communication even after neuraxial analgesia.",
        },
        {
          question: "Why avoid vaginal exams with suspected placenta previa?",
          options: [
            "No reason.",
            "Risk of provoking hemorrhage—ultrasound and provider-directed evaluation.",
            "Exam cures previa.",
            "Only in first trimester.",
          ],
          correct: 1,
          rationale: "Digital exams can trigger catastrophic bleeding in previa until placenta location is clarified.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "OB red flags & emergency referral (NP, US)",
      seoTitle: "Obstetric emergency triage | FNP US | NurseNest",
      seoDescription:
        "NP: preeclampsia severe features, third-trimester bleeding, decreased fetal movement—ED/L&D referral and safety netting.",
      clinical_meaning: `**NP (primary care / women’s health exposure)**  
Outpatient items test **who cannot stay in clinic**: **severe-range BP** with symptoms, **third-trimester bleeding**, **decreased fetal movement**, **ROM with prolapse concern**, **postpartum fever with foul lochia**, and **suicidal ideation in perinatal period** (overlap item). You **activate EMS/L&D**, **do not** manage **eclampsia** in the office, and **document** **objective triggers** for referral.`,
      exam_relevance: `Trap: **“recheck BP next week”** for **160/110 + headache**; **oral NSAIDs** as sole plan for **third-trimester bleeding**; **reassurance** for **absent fetal movement** without evaluation.`,
      clinical_scenario: `**Vignette — office**  
36 weeks: **BP 164/108**, **scotomata**, **RUQ pain**.

**Fork**  
**Direct to L&D/ED**—not “start home BP log only.”`,
      takeaways: `• **Severe features** = emergency obstetric evaluation.  
• **Vaginal bleeding in third trimester** needs **urgent ultrasound/fetal assessment** pathway.  
• **Postpartum** chest pain, SOB, unilateral leg swelling → **thromboembolism** differential in boards.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs same-day L&D evaluation?",
          options: [
            "Mild Braxton Hicks without other symptoms.",
            "Term pregnancy with severe headache, visual changes, and BP 162/104.",
            "Routine pap follow-up normal.",
            "Stable URI.",
          ],
          correct: 1,
          rationale: "Preeclampsia with severe features requires immediate obstetric assessment.",
        },
        {
          question: "Third-trimester bright red bleeding without pain—NP first action?",
          options: [
            "Schedule next month.",
            "Urgent obstetric evaluation for possible placenta previa or abruption until ruled out.",
            "Recommend long drive home alone.",
            "Start aspirin only.",
          ],
          correct: 1,
          rationale: "Painless bleeding near term is a high-risk obstetric presentation.",
        },
        {
          question: "Postpartum client calls with soaking pad hourly and dizziness. NP advises?",
          options: [
            "Wait 48 hours.",
            "Emergency evaluation for hemorrhage—EMS if unstable symptoms.",
            "Only increase fluids at home.",
            "Ignore dizziness.",
          ],
          correct: 1,
          rationale: "Heavy bleeding with orthostasis signals emergent postpartum hemorrhage risk.",
        },
      ],
      postTest: [
        {
          question: "Which documentation supports appropriate NP referral?",
          options: [
            "Patient fine.",
            "BP 168/110, headache, scotomata, sent to L&D via EMS with notification documented.",
            "No vitals.",
            "Advised herbs only.",
          ],
          correct: 1,
          rationale: "Objective data and activation pathway demonstrate standard-of-care triage.",
        },
        {
          question: "Decreased fetal movement at 38 weeks—NP teaching?",
          options: [
            "Ignore until due date.",
            "Same-day fetal testing/L&D per protocol—decreased movement is a red flag.",
            "Only if no kicks for 24 hours always.",
            "Start exercise class.",
          ],
          correct: 1,
          rationale: "Reduced fetal movement warrants timely evaluation in third trimester.",
        },
        {
          question: "Why is NST/BPP not a substitute for ED when stem shows eclampsia?",
          options: [
            "Office tests replace hospital always.",
            "Seizure and severe end-organ involvement require inpatient magnesium and multidisciplinary care.",
            "NP treats eclampsia alone always.",
            "No referral needed.",
          ],
          correct: 1,
          rationale: "Eclampsia management is inpatient and beyond outpatient scope.",
        },
      ],
    },
  ),
};

type LessonInputShape = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  preTest: PathwayLessonQuizItem[];
  postTest: PathwayLessonQuizItem[];
};

function npTitles(pathwayId: string, v: (typeof VARIANTS)["us_np"]) {
  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);
  return {
    ...v,
    title: `OB red flags & emergency referral (${suf})`,
    seoTitle: `Obstetric emergency triage | ${lab} US | NurseNest`,
    seoDescription: `NP obstetric red flags for ${lab}: L&D referral, bleeding, and severe hypertension.`,
  };
}

export function obEmergenciesGoldHubListInput(pathwayId: string): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getObEmergenciesGoldLessonInput(pathwayId);
  if (!full) return null;
  return {
    slug: full.slug,
    title: full.title,
    topic: full.topic,
    topicSlug: full.topicSlug,
    bodySystem: full.bodySystem,
    previewSectionCount: full.previewSectionCount,
    seoTitle: full.seoTitle,
    seoDescription: full.seoDescription,
  };
}

export function getObEmergenciesGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const key = PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  let v = VARIANTS[key];
  if (key === "us_np") v = npTitles(pathwayId, v);
  return {
    slug: OB_EMERGENCIES_GOLD_SLUG,
    title: v.title,
    topic: "Maternity",
    topicSlug: "maternity",
    bodySystem: "Obstetric",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: ensurePremiumSeoDescription(v.seoDescription, PATHWAY_EXAM_LABEL[pathwayId] ?? pathwayId),
    sections: [
      { id: "clinical_meaning", heading: "What this means clinically", kind: "clinical_meaning", body: v.clinical_meaning },
      { id: "exam_relevance", heading: "Why this appears on your exam", kind: "exam_relevance", body: v.exam_relevance },
      { id: "core_concept", heading: "Core concept — OB emergency patterns", kind: "core_concept", body: SHARED_CORE_BODY },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: v.clinical_scenario },
      { id: "takeaways", heading: "Key takeaways", kind: "takeaways", body: v.takeaways },
    ],
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
