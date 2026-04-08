/**
 * Gold-standard sepsis / early recognition — nursing assessment + escalation (not MD diagnosis).
 * Remediation wave 1: infection_sepsis system + physiological adaptation.
 */
import type { PathwayLessonQuizItem, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export const SEPSIS_GOLD_SLUG = "sepsis-early-recognition-gold" as const;

type SepVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, SepVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**What “early recognition” means for nurses**  
Sepsis is a **dysregulated host response to infection** that can progress to **shock** and **organ failure**. Exams reward noticing **infection + systemic compromise** (fever or hypothermia, tachycardia, tachypnea, hypotension, altered mentation, oliguria, rising lactate when shown) and **acting + escalating** rather than “watching.”

**Nursing assessment cluster**  
Pair **source cues** (lung, urinary, skin/line, abdominal, postpartum) with **perfusion and ventilation**: mental status, BP/MAP, HR, RR, temperature, SpO₂, urine output, pain pattern, and trends—not a single isolated value.

**Escalation**  
**Notify the RN/provider**, obtain **ordered labs/cultures**, support **oxygenation**, **IV access as ordered**, **sepsis bundles/protocols** when the stem includes them, and **monitor frequency** appropriate to instability.`;

function pack(
  variant: SepVariant,
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

const VARIANTS: Record<SepVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "Sepsis cues & escalation (NCLEX-PN, US)",
      seoTitle: "Sepsis recognition | NCLEX-PN US | NurseNest",
      seoDescription:
        "US PN: infection plus systemic compromise, what to report first, and safe actions within LPN scope.",
      clinical_meaning: `**PN role**  
You **collect and report** objective data, **carry out orders**, **support airway/oxygen**, and **escalate** when trends worsen. You do **not** independently diagnose sepsis, but you **recognize the pattern** and **activate the team**.`,
      exam_relevance: `Traps: **routine meds** before **hypotension + fever + confusion**, **minimizing fever**, or **delaying report** to finish tasks.`,
      clinical_scenario: `**Vignette**  
Post-op client: **T 38.9 °C**, **HR 118**, **RR 28**, **BP trending down**, **new confusion**, **faint mottling**. PN is first to notice.

**Fork**  
Stay with client, **support ABCs per order**, **notify RN immediately**, and prepare for **ordered diagnostics**—not “finish bed bath first.”`,
      takeaways: `• **Trends beat single normals** when infection is suspected.  
• **Altered mentation + infection + instability** = urgent escalation.  
• **Scope**: report and support; let the team authorize major order changes.`,
    },
    {
      preTest: [
        {
          question: "Which finding should the PN report immediately in a client with suspected infection?",
          options: [
            "Stable SpO₂ on room air without symptoms.",
            "New confusion with hypotension and tachypnea.",
            "Request for extra tissues.",
            "Finished breakfast tray.",
          ],
          correct: 1,
          rationale: "Altered perfusion/ventilation with infection concern is an urgent escalation trigger.",
        },
        {
          question: "Best PN action when BP drops and RR rises after new fever?",
          options: [
            "Wait one hour to confirm.",
            "Notify RN/provider with objective data and stay with client per policy.",
            "Turn off oxygen to stimulate breathing.",
            "Encourage sleep only.",
          ],
          correct: 1,
          rationale: "Timely notification with data and continued monitoring align with safe PN practice.",
        },
        {
          question: "Why is urine output tracked in sepsis concern?",
          options: [
            "It never matters.",
            "It reflects perfusion and kidney involvement—trend matters.",
            "It replaces blood pressure.",
            "It proves infection type.",
          ],
          correct: 1,
          rationale: "Oliguria can signal hypoperfusion and organ dysfunction.",
        },
      ],
      postTest: [
        {
          question: "Which statement shows infection prevention teaching during central-line care?",
          options: [
            "Touch the hub with bare hands routinely.",
            "Maintain sterile/aseptic technique per policy and report redness or drainage.",
            "Ignore temperature spikes.",
            "Flush with random household solution.",
          ],
          correct: 1,
          rationale: "Line care and surveillance reduce bloodstream infection risk.",
        },
        {
          question: "PN finds a client shivering, febrile, and confused after chemo. Priority?",
          options: [
            "Finish paperwork.",
            "Assess vitals, ensure safety, notify RN—possible neutropenic fever/sepsis concern.",
            "Give sedatives without order.",
            "Send client walking alone.",
          ],
          correct: 1,
          rationale: "Immunocompromised fever with neuro change is high risk and needs rapid escalation.",
        },
        {
          question: "Which task fits PN scope in suspected sepsis?",
          options: [
            "Silently discontinuing antibiotics.",
            "Obtaining ordered cultures after checks, administering ordered meds, and reporting trends.",
            "Prescribing new antibiotics.",
            "Discharging the client.",
          ],
          correct: 1,
          rationale: "Ordered interventions plus reporting fit PN scope; prescribing and discharge do not.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "Sepsis cues & escalation (REx-PN, Canada)",
      seoTitle: "Sepsis recognition | REx-PN Canada | NurseNest",
      seoDescription: "Canadian PN: metric vitals, infection + systemic compromise, collaboration, and escalation.",
      clinical_meaning: `**RPN**  
Recognize **early deterioration**, use **SI/metric** values carefully, and **collaborate** for diagnostics and therapy changes. Practical nursing items still reward **trend recognition**: temperature trajectory, mental status, perfusion, urine output, and work of breathing—not isolated “single normal” values that hide decline.`,
      exam_relevance: `Same prioritization spine as US PN with **Canadian context** cues in stems. Expect **multi-task** distractions: linens, scheduled meds, or charting versus a client who is **febrile with rising HR/RR** and **soft BP**. Choose **assessment + notification** before routine tasks.`,
      clinical_scenario: `**Vignette**  
Client with UTI history now **febrile**, **tachycardic**, **hypotensive**, **tachypneic**, and **new confusion** on evening shift.

**Fork**  
Escalate immediately; do not defer for routine tasks. Stay with the client, support **oxygen and safety per order**, and bring **objective numbers** (vitals, I&O, recent meds, lines) to the RN so the team can activate sepsis workup elements as authorized.`,
      takeaways: `• **Early escalation saves lives** when infection meets systemic compromise.  
• **Objective report** to RN/NP/physician with trends—not vague “patient looks worse.”  
• **Never minimize** altered mentation with fever and hemodynamic drift.`,
    },
    {
      preTest: [
        {
          question: "Which client needs the RPN to notify the RN first?",
          options: [
            "Afebrile, stable walk in hallway.",
            "Fever, rising HR/RR, BP drop, new confusion.",
            "Client watching TV stable.",
            "Client asking for juice, stable vitals.",
          ],
          correct: 1,
          rationale: "Systemic infection concern with instability is first priority.",
        },
        {
          question: "Why track lactate if shown in a stem?",
          options: [
            "It is decorative.",
            "It can reflect tissue hypoperfusion in sepsis workups—interpret with presentation.",
            "It replaces blood culture.",
            "It proves viral illness.",
          ],
          correct: 1,
          rationale: "Lactate supports perfusion assessment in sepsis pathways when present.",
        },
        {
          question: "Best action when sepsis is suspected?",
          options: [
            "Delay antibiotics until next shift without telling anyone.",
            "Follow sepsis protocol/orders promptly and communicate deterioration.",
            "Stop all fluids always.",
            "Send client home.",
          ],
          correct: 1,
          rationale: "Time-sensitive sepsis care requires protocol-driven action and communication.",
        },
      ],
      postTest: [
        {
          question: "Which finding suggests worsening perfusion?",
          options: [
            "Pink warm skin with stable BP.",
            "Cool extremities, delayed cap refill, BP falling with tachycardia.",
            "Normal mentation with stable SpO₂.",
            "Eating well.",
          ],
          correct: 1,
          rationale: "Cold, mottled, or poorly perfused signs with hypotension need urgent response.",
        },
        {
          question: "Postpartum client febrile with uterine tenderness and tachycardia. RPN should?",
          options: [
            "Ignore as normal.",
            "Report promptly—consider endometritis/sepsis risk and follow orders.",
            "Give herbal tea only.",
            "Discharge early.",
          ],
          correct: 1,
          rationale: "Postpartum infection can progress rapidly; escalation is essential.",
        },
        {
          question: "Why is source control a team concept?",
          options: [
            "Nurses never collaborate.",
            "Removing infected lines/abscess management requires provider plan—nurses support and monitor.",
            "Antibiotics alone always cure without evaluation.",
            "Cultures are optional always.",
          ],
          correct: 1,
          rationale: "Sepsis care integrates diagnostics, antibiotics, and source control per orders.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "Sepsis: recognition & first-line nursing response (NCLEX-RN, US)",
      seoTitle: "Sepsis nursing care | NCLEX-RN US | NurseNest",
      seoDescription: "NCLEX-RN: sepsis bundles, labs, antibiotics timing concepts, perfusion, and prioritization.",
      clinical_meaning: `**RN**  
You **synthesize assessment**, **initiate protocols**, **coordinate diagnostics**, **administer ordered therapies**, and **monitor response**. Items may reference **qSOFA/SIRS-style teaching** as **screening concepts**—follow the **stem’s criteria**.`,
      exam_relevance: `Prioritize **hypotension + infection concern**, **lactate**, **antibiotics after cultures when ordered**, **fluids when indicated**, and **frequent reassessment**. Trap: **routine tasks** during **shock**.`,
      clinical_scenario: `**Vignette — ED**  
Suspected sepsis: **MAP low**, **tachycardia**, **fever**, **lethargy**.  

**Fork**  
Airway/oxygen, **large-bore access**, **labs/lactate/cultures per order**, **fluid bolus if ordered**, **antibiotics on time**, **notify provider** of non-response—before discharge paperwork.`,
      takeaways: `• **Time-sensitive** care: recognition → activation → treatment bundle per policy.  
• Reassess **after each intervention**.`,
    },
    {
      preTest: [
        {
          question: "Which intervention is highest priority initially in suspected septic shock per common protocols?",
          options: [
            "Complete admission demographics only.",
            "Stabilize airway/breathing/circulation and activate sepsis pathway orders.",
            "Schedule routine bath tomorrow.",
            "Hold all fluids always.",
          ],
          correct: 1,
          rationale: "ABC stabilization and sepsis pathway activation address immediate risk.",
        },
        {
          question: "Cultures and antibiotics—typical exam teaching?",
          options: [
            "Never draw cultures.",
            "Draw cultures before antibiotics when feasible without delaying critical antibiotics—follow stem.",
            "Antibiotics never needed.",
            "Cultures replace assessment.",
          ],
          correct: 1,
          rationale: "NCLEX often tests not delaying therapy while still prioritizing diagnostics when ordered.",
        },
        {
          question: "Which client should the RN assess first?",
          options: [
            "Stable client requesting nail trim.",
            "Client with suspected sepsis and MAP below goal with altered mentation.",
            "Client reading with stable vitals.",
            "Client who wants a phone charger.",
          ],
          correct: 1,
          rationale: "Septic shock pattern outranks comfort requests.",
        },
      ],
      postTest: [
        {
          question: "After fluid bolus, BP remains low and lactate elevated. Next?",
          options: [
            "Stop monitoring.",
            "Report and prepare for escalation (e.g., vasopressors per order)—continued resuscitation.",
            "Send client to cafeteria.",
            "Discharge if afebrile for 30 minutes only.",
          ],
          correct: 1,
          rationale: "Persistent shock requires escalation beyond initial bolus.",
        },
        {
          question: "Why is glucose checked in sepsis care?",
          options: [
            "It is never relevant.",
            "Stress hyperglycemia and infection can alter glucose—monitor per orders.",
            "It diagnoses diabetes only.",
            "It replaces blood pressure.",
          ],
          correct: 1,
          rationale: "Metabolic stress affects glucose; monitoring supports safe care.",
        },
        {
          question: "Family asks why antibiotics started before full culture results. Best response?",
          options: [
            "I cannot explain.",
            "Serious infection can worsen quickly; the team starts targeted therapy and adjusts when results return.",
            "Cultures are pointless.",
            "Antibiotics are always wrong.",
          ],
          correct: 1,
          rationale: "Balanced explanation supports understanding without overstepping medical decision detail.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "Sepsis: recognition & nursing response (NCLEX-RN, Canada)",
      seoTitle: "Sepsis nursing care | NCLEX-RN Canada | NurseNest",
      seoDescription: "Canadian RN: sepsis pathways, metric labs, collaboration, and time-sensitive stabilization.",
      clinical_meaning: `**Canadian RN**  
Same **time-sensitive** priorities with **SI labs** and **Canadian acute-care** language in stems. Your role is to **integrate assessment**, **initiate ordered sepsis interventions**, and **communicate failure to respond**—not to substitute protocols shown in another country’s numbers for what this stem provides.`,
      exam_relevance: `Watch **temperature in °C**, **glucose mmol/L**, and **MAP** targets as given. Traps still pair **routine tasks** with **unstable perfusion**: choose **stabilize and escalate** before **discharge teaching** or **non-urgent procedures**.`,
      clinical_scenario: `**Vignette**  
Post-op client **38.6 °C**, **tachycardia**, **hypotension**, **oliguria**, and **increasing confusion** four hours after surgery.

**Fork**  
Sepsis pathway activation, notify provider, support perfusion per orders. Prioritize **airway/oxygen**, **access**, **labs/cultures as ordered**, **antibiotics timing**, and **frequent reassessment**—before routine mobility goals if stability is not established.`,
      takeaways: `• **Early recognition** is cross-border; unstable infection trumps convenience.  
• **Document trends** clearly so the team sees trajectory, not snapshots.  
• **Reassess after interventions** to decide escalation.`,
    },
    {
      preTest: [
        {
          question: "Which client should the RN see first?",
          options: [
            "Stable client finishing a crossword.",
            "Client with fever, hypotension, tachycardia, and decreased urine output after surgery.",
            "Client requesting a magazine.",
            "Client with stable pain control.",
          ],
          correct: 1,
          rationale: "Post-op sepsis concern is immediate priority.",
        },
        {
          question: "Which action supports sepsis bundle elements (per stem orders)?",
          options: [
            "Delay IV access indefinitely.",
            "Obtain lactate and cultures as ordered; administer antibiotics promptly when ordered.",
            "Ignore hypotension.",
            "Stop all monitoring alarms.",
          ],
          correct: 1,
          rationale: "Diagnostics and timely therapy are cornerstone sepsis interventions.",
        },
        {
          question: "Why reassess after fluid resuscitation?",
          options: [
            "Fluids never change vitals.",
            "To determine response and need for escalation.",
            "Reassessment is optional.",
            "Only residents reassess.",
          ],
          correct: 1,
          rationale: "Dynamic assessment guides next interventions.",
        },
      ],
      postTest: [
        {
          question: "Which finding suggests moving beyond oral intake alone?",
          options: [
            "Drinking well with stable vitals.",
            "Hypotension, unable to maintain perfusion orally, needs IV resuscitation per orders.",
            "Mild dry lips only.",
            "Normal mentation.",
          ],
          correct: 1,
          rationale: "Shock states require IV access and resuscitation pathways.",
        },
        {
          question: "Nursing role in family education during sepsis?",
          options: [
            "Provide no updates.",
            "Explain monitoring, expected interventions, and where to ask questions—within privacy limits.",
            "Guarantee outcomes.",
            "Share unrelated client data.",
          ],
          correct: 1,
          rationale: "Therapeutic communication supports coping without violating privacy.",
        },
        {
          question: "Which task can RN delegate during stable phases (not during active shock management)?",
          options: [
            "Interpreting sepsis trajectory alone to AP.",
            "Vital signs with immediate reporting of abnormalities.",
            "Choosing vasopressor doses.",
            "Ordering CT independently.",
          ],
          correct: 1,
          rationale: "Appropriate delegation is data collection with RN interpretation.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "Sepsis risk in outpatient settings (NP, US)",
      seoTitle: "Sepsis risk | NP US | NurseNest",
      seoDescription: "NP: who needs ED now vs close follow-up; red flags; safety-netting.",
      clinical_meaning: `**NP**  
Differentiate **uncomplicated infection** from **sepsis red flags** (hypotension, altered mentation, hypoxia, oliguria, rapidly worsening symptoms). **Safety-net** instructions are exam-relevant.`,
      exam_relevance: `Trap: **oral outpatient management** when **IV resuscitation** and **ED evaluation** are indicated.`,
      clinical_scenario: `**Vignette**  
Adult with UTI symptoms appears **toxic**, **tachycardic**, **hypotensive**, **confused**.

**Fork**  
**Direct to emergency care**—not “increase PO fluids only.”`,
      takeaways: `• **Toxic appearance** + **perfusion/mental status** issues → ED.  
• Document **return precautions**.`,
    },
    {
      preTest: [
        {
          question: "Which client can likely be managed outpatient with close follow-up (when stem supports mild illness)?",
          options: [
            "Hypotensive, confused, febrile, tachypneic.",
            "Afebrile, stable vitals, mild uncomplicated cystitis symptoms without red flags.",
            "Rigors and MAP 55.",
            "New petechiae with fever.",
          ],
          correct: 1,
          rationale: "Stable mild infection may be outpatient; sepsis red flags need emergency care.",
        },
        {
          question: "Best documentation for safety netting?",
          options: [
            "No instructions.",
            "Return precautions, when to call 911, and follow-up timing.",
            "Only billing.",
            "Advice to avoid all care.",
          ],
          correct: 1,
          rationale: "Clear safety netting reduces harm.",
        },
        {
          question: "Elderly with UTI symptoms and acute delirium—priority?",
          options: [
            "Assume dementia only.",
            "Urgent evaluation—infection and delirium can signal sepsis.",
            "Ignore family concerns.",
            "Wait 1 week.",
          ],
          correct: 1,
          rationale: "Delirium with infection concern needs urgent assessment.",
        },
      ],
      postTest: [
        {
          question: "Why might NP order labs before antibiotics in some ambulatory frames?",
          options: [
            "Labs never help.",
            "To risk-stratify when presentation is borderline—while ensuring ED referral if unstable.",
            "To delay all treatment always.",
            "Labs replace exam.",
          ],
          correct: 1,
          rationale: "Risk stratification must not delay care when instability is present.",
        },
        {
          question: "Postpartum fever and uterine pain—NP advice?",
          options: [
            "Ignore.",
            "Urgent evaluation—endometritis/sepsis risk.",
            "Only tea.",
            "Exercise vigorously.",
          ],
          correct: 1,
          rationale: "Obstetric infection can be life-threatening.",
        },
        {
          question: "Which phrase shows shared decision-making?",
          options: [
            "You have no choice.",
            "Given your risk, I recommend ED evaluation now; do you have transport support?",
            "Never explain risks.",
            "I cannot answer questions.",
          ],
          correct: 1,
          rationale: "Respectful clear recommendations with logistics support patient autonomy.",
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
    title: `Sepsis risk & escalation (${suf})`,
    seoTitle: `Sepsis risk | ${lab} US | NurseNest`,
    seoDescription: `NP-level triage for ${lab}: ED vs outpatient, red flags, and safety netting.`,
  };
}

export function sepsisGoldVariantForPathway(pathwayId: string): SepVariant | undefined {
  return PATHWAY_VARIANT[pathwayId];
}

export function sepsisGoldHubListInput(pathwayId: string): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getSepsisGoldLessonInput(pathwayId);
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

export function getSepsisGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const key = PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  let v = VARIANTS[key];
  if (key === "us_np") v = npTitles(pathwayId, v);
  return {
    slug: SEPSIS_GOLD_SLUG,
    title: v.title,
    topic: "Sepsis & infection",
    topicSlug: "sepsis",
    bodySystem: "Infection / sepsis",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: v.seoDescription,
    sections: [
      { id: "clinical_meaning", heading: "What this means clinically", kind: "clinical_meaning", body: v.clinical_meaning },
      { id: "exam_relevance", heading: "Why this appears on your exam", kind: "exam_relevance", body: v.exam_relevance },
      { id: "core_concept", heading: "Core concept — infection meets systemic compromise", kind: "core_concept", body: SHARED_CORE_BODY },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: v.clinical_scenario },
      { id: "takeaways", heading: "Key takeaways", kind: "takeaways", body: v.takeaways },
    ],
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
