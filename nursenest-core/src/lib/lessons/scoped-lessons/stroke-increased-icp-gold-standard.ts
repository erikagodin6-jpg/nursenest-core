/**
 * Stroke recognition & increased ICP — nursing assessment, time-critical escalation, neuro protection.
 * Remediation wave 3: neurological system + management_of_care / safety.
 */
import type { PathwayLessonQuizItem, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export const STROKE_ICP_GOLD_SLUG = "stroke-increased-icp-gold" as const;

type StrokeVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, StrokeVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**Stroke as an exam construct**  
Items reward **sudden focal neuro deficit** recognition (facial droop, arm drift, speech disturbance, visual field loss, sudden severe headache, ataxia, neglect) and **time-zero thinking**: activate the **stroke pathway / EMS** per setting, **avoid delays** for routine tasks, and **support ABCs** while **preparing for ordered imaging and interventions**.

**ICP / mass-effect overlap**  
**Increased intracranial pressure** patterns in stems may include **worsening headache**, **vomiting**, **altered LOC**, **unequal pupils**, **posturing**, **Cushing response** (hypertension + bradycardia + irregular respirations when described), or **seizure**. Nursing priorities center on **airway protection**, **positioning and activity per order**, **neuro checks per protocol**, **seizure safety**, **avoiding harmful nursing actions** (no lumbar puncture before imaging when stem implies mass effect), and **rapid notification**.

**Reperfusion & BP teaching (exam-level)**  
Stems test **blood pressure targets** around **thrombolysis eligibility** and **post-tPA** monitoring without expecting you to prescribe—follow **the order and protocol in the item**. Avoid **hypotension** that worsens perfusion in acute stroke workups when the vignette emphasizes it.`;

function pack(
  variant: StrokeVariant,
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

const VARIANTS: Record<StrokeVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "Stroke cues & neuro emergencies: PN actions (NCLEX-PN, US)",
      seoTitle: "Stroke & ICP recognition | NCLEX-PN US | NurseNest",
      seoDescription:
        "US PN: FAST-like recognition, stay-with-client, EMS activation, seizure safety, and scope-safe neuro support.",
      clinical_meaning: `**PN scope**  
You **stay with the client**, **obtain vitals and glucose when ordered**, **note time last known well** if asked, **support airway and safety**, **administer ordered meds**, and **notify RN/911** immediately for sudden focal deficits or rapid neuro decline. You **do not** independently interpret CT or authorize thrombolysis; you **recognize urgency** and **activate the team**.`,
      exam_relevance: `Traps: **finishing linens** during **new unilateral weakness**, **minimizing slurred speech** as “tired,” **delaying report** to complete vitals on stable clients first, or **leaving** a seizing client alone. Items love **time-sensitive** prioritization over **routine**.`,
      clinical_scenario: `**Vignette — floor**  
Client suddenly **droops on one side**, **slurred speech**, **arm weakness**; symptoms started **35 minutes ago** per family.

**Fork**  
**Call for RN/activate emergency response**, **stay**, **protect airway**, **time documentation**, **prepare for ordered diagnostics**—not “finish the bath first.”`,
      takeaways: `• **Sudden focal neuro change** = treat as stroke until proven otherwise in exam logic.  
• **Last known well** and **onset time** matter for pathway items.  
• **Seizure** after stroke: protect, time, notify, follow orders—never unsafe restraint.`,
    },
    {
      preTest: [
        {
          question: "Which client should the PN report first?",
          options: [
            "Stable client requesting magazines.",
            "Client with new facial droop, slurred speech, and arm weakness.",
            "Client watching TV with chronic mild neuropathy unchanged.",
            "Client asking for ice chips, stable vitals.",
          ],
          correct: 1,
          rationale: "Acute focal neuro deficits suggest stroke until evaluated—immediate escalation beats routine tasks.",
        },
        {
          question: "Why document time of symptom onset in stroke concern?",
          options: [
            "It is optional decoration.",
            "Reperfusion and imaging pathways are time-dependent; onset anchors eligibility teaching in items.",
            "It replaces neuro exam.",
            "Only needed for pediatric clients.",
          ],
          correct: 1,
          rationale: "Time-last-known-well drives acute stroke protocols in exam vignettes.",
        },
        {
          question: "Best immediate action when a client begins seizing at bedside?",
          options: [
            "Leave to finish another task.",
            "Protect from injury, call for help, time the event, follow seizure protocol and orders.",
            "Force objects into the mouth.",
            "Walk the client in the hall.",
          ],
          correct: 1,
          rationale: "Safety, timing, and activation of emergency support are standard nursing priorities.",
        },
      ],
      postTest: [
        {
          question: "Which finding should raise ICP concern in exam stems?",
          options: [
            "Stable chronic headache pattern unchanged for years.",
            "Worsening headache with vomiting, declining LOC, or pupil changes as described.",
            "Mild dry skin only.",
            "Normal mood without neuro symptoms.",
          ],
          correct: 1,
          rationale: "Rising ICP patterns combine neuro decline with headache/vomiting/pupil or posturing cues.",
        },
        {
          question: "PN role during suspected stroke activation includes?",
          options: [
            "Independent CT interpretation.",
            "Supporting monitoring, carrying out orders, and rapid communication with objective data.",
            "Discharging client home.",
            "Withholding oxygen always.",
          ],
          correct: 1,
          rationale: "Scope-appropriate support and communication align with PN practice in acute neuro events.",
        },
        {
          question: "Why might sudden severe headache with neck stiffness differ from simple migraine in items?",
          options: [
            "They are always identical.",
            "Subarachnoid hemorrhage and other emergencies can mimic; rapid evaluation is tested.",
            "Headaches never need escalation.",
            "Only children need assessment.",
          ],
          correct: 1,
          rationale: "Thunderclap headache patterns trigger cannot-miss neurovascular workups in exam logic.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "Stroke cues & neuro emergencies (REx-PN, Canada)",
      seoTitle: "Stroke & ICP recognition | REx-PN Canada | NurseNest",
      seoDescription: "Canadian PN: metric vitals, interprofessional stroke response, seizure safety, and clear escalation.",
      clinical_meaning: `**RPN**  
Canadian items emphasize **collaboration** with RN/NP/physician and **clear handoff** using **objective neuro findings** and **timestamps**. Read **SI glucose** and **metric BP** carefully when stems include them; your role remains **assessment support**, **ordered interventions**, and **immediate escalation** for acute focal deficits.`,
      exam_relevance: `Same prioritization spine as US PN: **routine** versus **new hemiparesis or aphasia**—wrong answers delay activation. Watch **scope** traps: **independent withholding** of antihypertensives or **interpreting imaging** beyond your role unless the stem defines extended competency.`,
      clinical_scenario: `**Vignette**  
Client **sudden left-sided weakness**, **speech garbled**, **BP 188/96 mmHg**, **capillary glucose 6.2 mmol/L** in stem.

**Fork**  
Notify RN, activate emergency response per facility, continuous observation, prepare for transfer/imaging per orders—before non-urgent tasks.`,
      takeaways: `• **Focal neuro deficit** + **acute onset** = stroke pathway until proven otherwise.  
• **Objective communication** (time, vitals, glucose, symptoms) speeds care.  
• **Never minimize** speech or weakness changes as “anxiety” without assessment.`,
    },
    {
      preTest: [
        {
          question: "Which statement shows appropriate RPN escalation?",
          options: [
            "Finish charting before telling anyone.",
            "Report new unilateral weakness and speech change immediately with vitals and onset time.",
            "Tell family to wait until morning rounds.",
            "Assume sleepiness is normal without assessment.",
          ],
          correct: 1,
          rationale: "Acute neuro change requires immediate notification with objective data.",
        },
        {
          question: "Why is seizure timing important?",
          options: [
            "It never matters.",
            "Duration guides medication and emergency interventions per protocol.",
            "Only for billing.",
            "Replaces neuro checks.",
          ],
          correct: 1,
          rationale: "Prolonged seizures and recurrence patterns change management in exam scenarios.",
        },
        {
          question: "RPN finds unequal pupils with declining LOC after head injury in stem. Priority?",
          options: [
            "Reposition and observe only forever.",
            "Emergency notification—possible herniation/ICP emergency until evaluated.",
            "Give food by mouth.",
            "Send client to walk alone.",
          ],
          correct: 1,
          rationale: "Pupil and LOC changes after trauma raise ICP/herniation concern—urgent escalation.",
        },
      ],
      postTest: [
        {
          question: "Which task fits RPN scope in acute stroke support?",
          options: [
            "Prescribing tPA independently.",
            "Carrying out ordered monitoring, glucose checks, and assisting with positioning per protocol.",
            "Discontinuing all antihypertensives without order.",
            "Interpreting CT alone as “normal.”",
          ],
          correct: 1,
          rationale: "Ordered monitoring and supportive care fit practical nursing scope; prescribing and imaging interpretation do not.",
        },
        {
          question: "Why avoid neck flexion or Trendelenburg in some ICP stems?",
          options: [
            "Position never matters.",
            "Some positions may impede venous drainage or airway—follow neuro positioning orders.",
            "Always increases BP harmfully.",
            "Only applies to pediatrics.",
          ],
          correct: 1,
          rationale: "Neuro positioning is protocol-driven to optimize perfusion and ICP dynamics.",
        },
        {
          question: "Best teaching for family during acute stroke workup?",
          options: [
            "Guarantee full recovery.",
            "Explain that team is evaluating urgently and where to wait; avoid false reassurance.",
            "Send them away with no updates.",
            "Share unverified diagnoses.",
          ],
          correct: 1,
          rationale: "Honest, calm communication without overpromising matches therapeutic communication items.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "Stroke & elevated ICP: RN acute care (NCLEX-RN, US)",
      seoTitle: "Stroke & ICP nursing | NCLEX-RN US | NurseNest",
      seoDescription: "NCLEX-RN: NIHSS concepts at exam level, reperfusion readiness, BP parameters per order, ICP nursing bundle.",
      clinical_meaning: `**RN**  
You **coordinate the hyperacute pathway**: **neuro assessment frequency**, **NIHSS when trained/ordered**, **two large-bore IVs** when stem expects it, **lab draw**, **CT readiness**, **tPA bundle elements per protocol**, and **post-tPA neuro checks**. For **ICP**, implement **head-of-bed**, **osmotic therapy**, **sedation/analgesia**, **CSF drainage** per orders, and **avoid interventions** that spike ICP when the item tests that (straining, inappropriate positioning).`,
      exam_relevance: `High-yield forks: **who to assess first** among multiple clients (acute neuro change wins), **BP management** around **thrombolysis** teaching, **seizure** versus **stroke mimic**, **posterior circulation** symptoms (vertigo, diplopia), and **do-not** answers such as **delaying** activation for paperwork.`,
      clinical_scenario: `**Vignette — ED**  
Client **tPA candidate window**, **BP above protocol threshold** in stem before bolus.

**Fork**  
Follow **ordered antihypertensive plan** and **reassess**—not “give tPA anyway” or ignore BP when the item centers eligibility.`,
      takeaways: `• **Protocol + order-driven** BP and neuro checks in stroke items.  
• **ICP**: trend neuro, pupils, posturing; prepare for emergent orders.  
• **Mimics** (hypoglycemia, seizure postictal) appear—glucose and history matter when shown.`,
    },
    {
      preTest: [
        {
          question: "Which client should the RN assess first?",
          options: [
            "Stable post-op requesting pain med due in 30 minutes.",
            "Client with sudden aphasia, right-sided weakness, onset 20 minutes ago.",
            "Client watching TV, stable telemetry.",
            "Client asking for phone charger.",
          ],
          correct: 1,
          rationale: "Acute stroke symptoms within therapeutic windows outrank stable comfort requests.",
        },
        {
          question: "Post-tPA, client develops sudden severe headache and neuro decline. RN should?",
          options: [
            "Ignore as anxiety.",
            "Activate emergency evaluation—possible hemorrhagic complication until ruled out.",
            "Give more tPA independently.",
            "Discharge.",
          ],
          correct: 1,
          rationale: "Post-thrombolysis neuro decline raises intracranial hemorrhage concern—urgent workup.",
        },
        {
          question: "Why check glucose early in acute neuro change?",
          options: [
            "It never changes presentation.",
            "Hypoglycemia can mimic stroke; treat per protocol when indicated.",
            "It replaces CT.",
            "Only for diabetics.",
          ],
          correct: 1,
          rationale: "Hypoglycemia is a reversible stroke mimic tested frequently.",
        },
      ],
      postTest: [
        {
          question: "Cushing triad in a stem suggests?",
          options: [
            "Stable recovery.",
            "Late sign of severe ICP—emergent intervention context.",
            "Normal third trimester.",
            "Benign headache only.",
          ],
          correct: 1,
          rationale: "Cushing response signals critical ICP elevation in exam teaching.",
        },
        {
          question: "Which intervention is inappropriate if stem implies brain herniation risk before imaging?",
          options: [
            "Maintaining airway support.",
            "Lumbar puncture before ruling out mass effect when contraindicated by presentation.",
            "Notifying provider immediately.",
            "Preparing for emergent imaging per orders.",
          ],
          correct: 1,
          rationale: "LP before mass-effect exclusion is a classic contraindication pattern.",
        },
        {
          question: "RN delegating neuro checks during tPA infusion should ensure?",
          options: [
            "Unlicensed staff interpret CT.",
            "Competent personnel per policy perform ordered frequency checks and report changes immediately.",
            "Checks stop after first hour always.",
            "Only vitals, never neuro.",
          ],
          correct: 1,
          rationale: "Delegation must match competency and policy; escalation paths stay intact.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "Stroke & elevated ICP (NCLEX-RN, Canada)",
      seoTitle: "Stroke & ICP nursing | NCLEX-RN Canada | NurseNest",
      seoDescription: "Canadian RN: hyperacute stroke pathway, metric vitals, collaborative language, ICP bundle per orders.",
      clinical_meaning: `**Canadian RN**  
Practice mirrors US acute neuro nursing with **Canadian collaborative** documentation and **metric** values in stems. You **lead bedside execution** of **stroke protocol elements**, **seizure management**, and **ICP-related orders** while **communicating** with **neurology/intervention** teams as the vignette describes.`,
      exam_relevance: `Watch **BP in mmHg** around **thrombolysis teaching**, **glucose in mmol/L**, and **EMS activation** language. Wrong answers still **delay** neuro imaging or **undertreat** airway compromise during declining LOC.`,
      clinical_scenario: `**Vignette**  
Client with **worsening headache**, **small reactive then sluggish pupil change**, **BP rising**, **bradycardia** in stem.

**Fork**  
Treat as **neuro emergency**—notify, prepare for **ordered ICP interventions**, avoid **harmful delay**; follow **airway** priorities.`,
      takeaways: `• **Pupil + LOC + vital pattern** can signal herniation—seconds matter.  
• **Team coordination** and **clear orders** beat improvisation.  
• **Family updates** stay factual and non-speculative.`,
    },
    {
      preTest: [
        {
          question: "Which finding best supports posterior circulation stroke suspicion?",
          options: [
            "Isolated chronic knee pain.",
            "Sudden vertigo, diplopia, dysarthria, or ataxia cluster.",
            "Stable anxiety without focal signs.",
            "Seasonal allergies.",
          ],
          correct: 1,
          rationale: "Posterior circulation syndromes are exam favorites and easy to miss.",
        },
        {
          question: "Canadian RN stroke education for public should stress?",
          options: [
            "Wait overnight to see if it resolves.",
            "Call emergency services for sudden focal neuro deficits—time-sensitive care.",
            "Drive self while symptomatic.",
            "Only call if pain is 10/10.",
          ],
          correct: 1,
          rationale: "Early EMS activation aligns with stroke outcome teaching.",
        },
        {
          question: "Why monitor glucose during acute stroke care?",
          options: [
            "Glucose is irrelevant.",
            "Hyperglycemia may worsen injury; hypoglycemia mimics stroke—manage per protocol.",
            "It replaces blood pressure.",
            "Only post discharge.",
          ],
          correct: 1,
          rationale: "Glycemic control and mimic exclusion are integrated into stroke pathways.",
        },
      ],
      postTest: [
        {
          question: "Which nursing action supports ICP management when head-of-bed elevation is ordered?",
          options: [
            "Flat supine always.",
            "Maintain ordered elevation, avoid neck vein compression, keep head midline when indicated.",
            "Trendelenburg without assessment.",
            "Rapid neck rotation exercises.",
          ],
          correct: 1,
          rationale: "Positioning follows neuro protocol to optimize venous drainage and airway.",
        },
        {
          question: "RN notes new onset confusion and weakness in client on anticoagulation. Think?",
          options: [
            "Always benign.",
            "Hemorrhagic stroke risk until imaging—urgent escalation per orders.",
            "Stop all care.",
            "Ignore anticoagulation history.",
          ],
          correct: 1,
          rationale: "Anticoagulation raises hemorrhagic stroke probability in sudden neuro change vignettes.",
        },
        {
          question: "Best documentation after acute stroke activation?",
          options: [
            "Vague “neuro okay.”",
            "Time last known well, baseline and evolving deficits, vitals, interventions, and responses.",
            "Only family quotes.",
            "No vitals.",
          ],
          correct: 1,
          rationale: "Objective timed documentation supports continuity and legal standards.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "TIA & stroke red flags in ambulatory care (NP, US)",
      seoTitle: "Stroke red flags | NP US | NurseNest",
      seoDescription: "NP: TIA cannot-miss, ED referral, BP and anticoagulation counseling, time-sensitive teaching.",
      clinical_meaning: `**NP**  
Outpatient items test **TIA/stroke risk** recognition: **sudden focal deficits that resolve** still need **urgent evaluation** (ABCD²-style risk concepts when referenced). You **avoid false reassurance**, **coordinate ED transfer** for **acute symptoms**, and **manage chronic risk** (HTN, AFib anticoagulation counseling, diabetes) without replacing **hyperacute** hospital protocols.`,
      exam_relevance: `Trap: **“symptoms resolved—schedule follow-up in a month”** for **recent TIA focal deficits**. Also: **minimizing** **AFib** in **young patient** with **palpitations and neuro symptoms**.`,
      clinical_scenario: `**Vignette — clinic**  
Patient had **20 minutes of slurred speech and hand weakness** yesterday, now asymptomatic.

**Fork**  
**Same-day ED/workup** or **urgent stroke-prevention pathway** per guideline teaching in stem—not “observe at home indefinitely.”`,
      takeaways: `• **Resolved neuro symptoms** can still be **TIA**—risk stratification and urgent workup.  
• **Anticoagulation adherence** and **BP control** are long-game teaching points.  
• **Acute neuro symptoms now** → **911/ED**, not clinic tweaks.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs ED evaluation today?",
          options: [
            "Resolved mild ankle sprain last week.",
            "Transient slurred speech and unilateral weakness yesterday, now resolved.",
            "Stable chronic HTN follow-up without acute symptoms.",
            "Routine vaccine visit.",
          ],
          correct: 1,
          rationale: "Recent focal TIA symptoms warrant urgent evaluation for stroke risk.",
        },
        {
          question: "NP teaching for AFib and stroke prevention emphasizes?",
          options: [
            "Stroke never relates to AFib.",
            "Anticoagulation when indicated per risk tools and shared decision-making.",
            "Stopping all exercise.",
            "Ignoring CHA2DS2-VASc when stem provides it.",
          ],
          correct: 1,
          rationale: "Stroke prevention in AFib is high-yield ambulatory content.",
        },
        {
          question: "Why is “watchful waiting” wrong for acute onset aphasia at rest?",
          options: [
            "Aphasia is always benign.",
            "Acute stroke requires time-critical emergency care—delay harms outcomes.",
            "Only elderly have strokes.",
            "Speech changes never need imaging.",
          ],
          correct: 1,
          rationale: "Hyperacute stroke is an emergency across ages.",
        },
      ],
      postTest: [
        {
          question: "Which phrase shows appropriate safety netting after TIA workup planning?",
          options: [
            "Never call 911.",
            "Return immediately for new weakness, speech trouble, vision loss, or worst headache.",
            "Stop all medications without guidance.",
            "Drive long distances if dizzy.",
          ],
          correct: 1,
          rationale: "Clear return precautions reduce recurrent event harm.",
        },
        {
          question: "NP considers migraine with aura versus TIA when?",
          options: [
            "They are identical always.",
            "Sudden focal motor deficit or aphasia leans stroke/TIA workup; gradual visual scintillations may fit migraine when stem supports.",
            "Never assess further.",
            "Only CT at home.",
          ],
          correct: 1,
          rationale: "Distinguishing mimics is tested with careful history timing and features.",
        },
        {
          question: "Why review antiplatelets before neuraxial procedures in items?",
          options: [
            "They never matter.",
            "Bleeding risk interacts with procedures—hold per guideline and multidisciplinary plan.",
            "Always double dose before procedures.",
            "Only warfarin matters.",
          ],
          correct: 1,
          rationale: "Periprocedural antithrombotic management appears in safety-focused NPs items.",
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
    title: `TIA & stroke red flags in ambulatory care (${suf})`,
    seoTitle: `Stroke red flags | ${lab} US | NurseNest`,
    seoDescription: `NP stroke/TIA triage for ${lab}: ED referral, risk factors, and safety netting.`,
  };
}

export function strokeIcpGoldHubListInput(pathwayId: string): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getStrokeIcpGoldLessonInput(pathwayId);
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

export function getStrokeIcpGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const key = PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  let v = VARIANTS[key];
  if (key === "us_np") v = npTitles(pathwayId, v);
  return {
    slug: STROKE_ICP_GOLD_SLUG,
    title: v.title,
    topic: "Neurological",
    topicSlug: "neurological",
    bodySystem: "Neurological",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: v.seoDescription,
    sections: [
      { id: "clinical_meaning", heading: "What this means clinically", kind: "clinical_meaning", body: v.clinical_meaning },
      { id: "exam_relevance", heading: "Why this appears on your exam", kind: "exam_relevance", body: v.exam_relevance },
      { id: "core_concept", heading: "Core concept — stroke & ICP", kind: "core_concept", body: SHARED_CORE_BODY },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: v.clinical_scenario },
      { id: "takeaways", heading: "Key takeaways", kind: "takeaways", body: v.takeaways },
    ],
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
