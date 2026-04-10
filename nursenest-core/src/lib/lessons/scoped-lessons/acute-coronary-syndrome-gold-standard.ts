/**
 * Acute coronary syndrome / chest pain — nursing recognition, orders, escalation.
 * Remediation wave 2: cardio system + management_of_care prioritization.
 */
import type {
  PathwayLessonOmittedPremiumSection,
  PathwayLessonQuizItem,
  PathwayLessonRelatedRef,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";
import {
  ensurePremiumSeoDescription,
  PATHWAY_EXAM_LABEL,
  pathwayIdToTierGeo,
  synthesizeGoldPremiumSections,
} from "@/lib/lessons/scoped-lessons/gold-premium-synthesis";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export const ACS_GOLD_SLUG = "acute-coronary-syndrome-gold" as const;

type AcsVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, AcsVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
  "us-np-whnp": "us_np",
  "us-np-pnp-pc": "us_np",
  "ca-np-cnple": "us_np",
};

const SHARED_CORE_BODY = `**ACS as an exam construct**  
**Acute coronary syndrome** spans **unstable angina**, **NSTEMI**, and **STEMI** patterns in vignettes. Nursing items reward **time-sensitive recognition** (crushing/substernal pressure, radiation, diaphoresis, dyspnea, nausea, syncope, sudden fatigue—especially in women and older adults), **immediate assessment**, **12-lead ECG acquisition when ordered**, **labs**, **oxygen per indication/order**, **aspirin if ordered**, **nitroglycerin cautions**, and **morphine sparingly per modern teaching in stems**.

**Nitroglycerin traps**  
Avoid NTG when stems flag **SBP below prescribed threshold**, **RV infarct suspicion**, **recent PDE-5 inhibitor**, or **severe aortic stenosis**—items test **contraindication recognition**.

**Scope**  
**Interpretation** of ECG belongs to authorized roles in the stem; your job is often **obtain**, **notify**, **prepare for reperfusion pathway**, and **continuous monitoring** (rhythm, pain, vitals, bleeding if anticoagulated).`;

const ACS_LABS_DIAGNOSTICS = `**12-lead ECG and timing**  
ACS items expect you to **obtain the ECG promptly when ordered** and **recognize patterns that trigger reperfusion pathways** in the vignette (STEMI patterns versus ischemia that still demands urgent evaluation). Nursing stems may test whether you **prepare the client**, **repeat vitals**, **keep the client NPO when appropriate**, and **avoid delays** disguised as comfort measures.

**Cardiac biomarkers**  
**Troponin** protocols—often **serial testing** when the stem references a protocol—help **rule in myocardial injury** and **track trajectory**. Your nursing actions align with **orders** and **institution pathways**: **labs drawn on schedule**, **monitor for bleeding** if anticoagulated, and **report new arrhythmias or recurrent pain** immediately.

**Risk integration**  
Combine the **story**, **risk factors**, and **first ECG abnormalities** before you choose teaching, discharge, or low-acuity tasks. Items punish **premature reassurance** when data still point to **unstable ischemia** or an **evolving syndrome**.`;

function pack(
  variant: AcsVariant,
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

const VARIANTS: Record<AcsVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "Chest pain & ACS cues: PN actions (NCLEX-PN, US)",
      seoTitle: "ACS recognition | NCLEX-PN US | NurseNest",
      seoDescription: "US PN: chest pain red flags, oxygen and NTG per order, aspirin if ordered, and rapid escalation.",
      clinical_meaning: `**PN**  
You **stay with the client**, **obtain vitals**, **administer ordered meds**, **prepare equipment** (ECG machine readiness), and **notify RN/911** per setting. You **do not** independently decide reperfusion eligibility or interpret ST changes unless the item defines extended competency.`,
      exam_relevance: `Traps: **finishing routine tasks** during **ongoing chest pressure**, **giving NTG** when **SBP is critically low** in the stem, or **delaying activation** of emergency response in outpatient-like vignettes.`,
      clinical_scenario: `**Vignette — clinic or floor**  
Client reports **crushing chest pressure** with **diaphoresis** and **nausea**; BP readable but **not hypotensive** in stem.

**Fork**  
**Stop activity**, **notify RN/provider/EMS per setting**, **O₂ per order/indication**, **aspirin chewable if ordered**, **nitroglycerin if ordered and not contraindicated**, **continuous monitoring**—not “finish paperwork.”`,
      takeaways: `• **Time is muscle**—delays are wrong answers when instability is present.  
• **Reassess pain and vitals** after NTG.  
• **Escalate** new arrhythmias or pain refractory to therapy.`,
    },
    {
      preTest: [
        {
          question: "Which client should the PN report immediately?",
          options: [
            "Stable client requesting socks.",
            "Client with crushing chest pressure, diaphoresis, and nausea.",
            "Client reading a book.",
            "Client with mild itch without cardiopulmonary symptoms.",
          ],
          correct: 1,
          rationale: "Classic ACS symptom cluster requires immediate escalation and assessment.",
        },
        {
          question: "Before nitroglycerin, which assessment is most important in exam stems?",
          options: [
            "Hair color.",
            "Blood pressure and contraindications such as recent PDE-5 inhibitor use when mentioned.",
            "Shoe size.",
            "Last meal only without BP.",
          ],
          correct: 1,
          rationale: "Hypotension and certain drug interactions are classic NTG traps.",
        },
        {
          question: "PN role during suspected STEMI activation includes?",
          options: [
            "Ignoring vital signs.",
            "Staying with client, administering ordered meds, preparing for transfer/cath lab readiness per facility protocol.",
            "Discharging client home.",
            "Stopping all oxygen always.",
          ],
          correct: 1,
          rationale: "Support, orders, and rapid pathway activation fit PN scope.",
        },
      ],
      postTest: [
        {
          question: "Why might women present atypically in ACS items?",
          options: [
            "They never have ACS.",
            "Fatigue, SOB, epigastric pain, or jaw pain may dominate—still treat as time-sensitive.",
            "Only men have MI.",
            "Symptoms are always classic.",
          ],
          correct: 1,
          rationale: "Atypical presentations are high-yield exam content.",
        },
        {
          question: "Client develops VT with pulse during chest pain episode. PN should?",
          options: [
            "Leave the room.",
            "Call for help, follow emergency protocol, prepare for defibrillation/cardioversion per ACLS role.",
            "Finish vitals on another client first.",
            "Encourage walking.",
          ],
          correct: 1,
          rationale: "Unstable arrhythmias require immediate emergency response.",
        },
        {
          question: "Aspirin in ACS teaching is often ordered for?",
          options: [
            "Antiplatelet effect to reduce thrombus progression—when not contraindicated.",
            "Sleep aid.",
            "Pain only without antiplatelet rationale.",
            "Always contraindicated.",
          ],
          correct: 0,
          rationale: "Aspirin antiplatelet effect is central to ACS nursing exam teaching when ordered.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "Chest pain & ACS cues (REx-PN, Canada)",
      seoTitle: "ACS recognition | REx-PN Canada | NurseNest",
      seoDescription:
        "Canadian PN: ischemic chest pain escalation, metric vitals and SpO₂, aspirin and nitroglycerin per order, 12-lead ECG readiness, collaborative ACS pathway support, and EMS activation teaching.",
      clinical_meaning: `**RPN**  
Canadian practice emphasizes **interprofessional response** and **clear escalation** when **cardiac ischemia** is suspected. Your actions mirror US PN with **SI/metric** data when shown.`,
      exam_relevance: `Same prioritization: **chest pain cluster** before **routine** tasks; **NTG/BP** traps persist.`,
      clinical_scenario: `**Vignette**  
Client **diaphoretic**, **substernal pressure**, **HR 118**, **BP 148/88** (stem units), **SpO₂ 93%** RA.

**Fork**  
Oxygen per order/indication, notify RN, ECG per protocol, aspirin/NTG per orders with reassessment.`,
      takeaways: `• **Do not walk clients** with active ischemic symptoms; keep them monitored and supported per orders until higher-acuity help arrives.  
• **Objective handoff** to RN/NP/physician with vitals, pain score, O₂ need, allergies, and last nitro time speeds cath-lab activation.  
• **Teach EMS-first language** for sudden severe rest pain—driving while symptomatic fails Canadian and US exam safety teaching.`,
    },
    {
      preTest: [
        {
          question: "Which finding most supports immediate escalation for suspected ACS?",
          options: [
            "Stable ambulation without distress.",
            "Ongoing chest pressure with diaphoresis and nausea.",
            "Finished breakfast.",
            "Normal mood without symptoms.",
          ],
          correct: 1,
          rationale: "Symptom cluster suggests ischemia until evaluated.",
        },
        {
          question: "Why check BP before NTG?",
          options: [
            "BP is irrelevant.",
            "Hypotension worsens with vasodilation—NTG can be contraindicated below thresholds.",
            "NTG always raises BP.",
            "Only diastolic matters.",
          ],
          correct: 1,
          rationale: "Vasodilator safety depends on perfusion pressure.",
        },
        {
          question: "RPN should teach clients to call EMS when?",
          options: [
            "Never.",
            "Chest pain or SOB at rest not resolving with prescribed nitro protocol, or any stroke-like symptoms.",
            "Only after driving self to hospital.",
            "Only if pain lasts 24 hours.",
          ],
          correct: 1,
          rationale: "Early EMS activation reduces door-to-balloon delays in real life and matches exam teaching.",
        },
      ],
      postTest: [
        {
          question: "Which symptom can mimic ACS and still requires urgent evaluation in exam stems?",
          options: [
            "Only toe pain.",
            "Severe epigastric pain with diaphoresis in older adult.",
            "Mild sunburn itch.",
            "Stable chronic arthritis.",
          ],
          correct: 1,
          rationale: "GI mimic is common; rule-out ischemia is the exam point.",
        },
        {
          question: "After NTG, pain unchanged and BP dropped. RPN should?",
          options: [
            "Give another NTG without telling anyone.",
            "Notify RN immediately with vitals and pain status.",
            "Send client to walk.",
            "Discharge.",
          ],
          correct: 1,
          rationale: "Refractory pain with hypotension needs urgent reassessment.",
        },
        {
          question: "Why continuous cardiac monitoring during ACS workup?",
          options: [
            "Monitoring is decorative.",
            "Reperfusion arrhythmias and ischemia progression can occur suddenly.",
            "Only after discharge.",
            "Only for children.",
          ],
          correct: 1,
          rationale: "Rhythm surveillance is standard during acute cardiac evaluation.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "ACS & chest pain: RN management (NCLEX-RN, US)",
      seoTitle: "ACS nursing care | NCLEX-RN US | NurseNest",
      seoDescription:
        "NCLEX-RN: MONA cautions, 12-lead timing, troponin trends, reperfusion readiness, bleeding risk, and escalation.",
      clinical_meaning: `**RN**  
You **lead bedside stabilization**: **ECG timing**, **serial troponins per orders**, **antiplatelet/anticoagulant administration**, **nitro/morphine per orders and contraindications**, **oxygen only when indicated**, and **prep for PCI/thrombolysis** as the stem describes. Items test **prioritization** among multiple patients and **contraindication** knowledge.`,
      exam_relevance: `STEMI teaching often stresses **reperfusion urgency**; **NTG** traps with **RV infarct** (inferior MI + JVD/hypotension cues); **morphine** cautions with **respiratory depression**; **O₂** not routine if saturations normal in modern stems.`,
      clinical_scenario: `**Vignette — ED**  
STEMI pattern on ECG per stem, **chest pain ongoing**, **hemodynamically stable**.

**Fork**  
**Activate cath lab** pathway per orders, **dual antiplatelet** when ordered, **heparin** per protocol, **monitor for bleeding**, **frequent reassessment**—before social work paperwork.`,
      takeaways: `• **Door-to-balloon** mindset in items = no unnecessary delays.  
• **Inferior MI**: think **RV involvement** before aggressive NTG preload reduction.  
• **Post-PCI**: monitor **access site** and **anticoagulation** effects.`,
    },
    {
      preTest: [
        {
          question: "Which action is highest priority for suspected STEMI in ED per exam teaching?",
          options: [
            "Complete insurance forms first.",
            "Activate reperfusion pathway and continuous monitoring while implementing ordered therapies.",
            "Send client to cafeteria.",
            "Delay ECG to finish triage paperwork.",
          ],
          correct: 1,
          rationale: "Reperfusion time drives outcomes; stabilize and activate pathways.",
        },
        {
          question: "Inferior STEMI with hypotension and clear lungs. RN suspects?",
          options: [
            "Fluid overload only.",
            "RV infarct physiology—avoid aggressive NTG preload reduction; follow orders for fluid bolus.",
            "Asthma only.",
            "Anxiety only.",
          ],
          correct: 1,
          rationale: "RV infarct is a classic NTG trap with inferior MI.",
        },
        {
          question: "Why serial troponins?",
          options: [
            "They never change.",
            "Necrosis marker rises over time—serial testing detects NSTEMI.",
            "They replace ECG.",
            "One negative troponin rules out all ACS always.",
          ],
          correct: 1,
          rationale: "Serial sampling improves sensitivity in evolving ACS.",
        },
      ],
      postTest: [
        {
          question: "Post-thrombolysis, client bleeds from gums. RN should?",
          options: [
            "Ignore.",
            "Assess, notify provider, anticipate reversal/labs per protocol.",
            "Give more anticoagulant independently.",
            "Discharge.",
          ],
          correct: 1,
          rationale: "Bleeding after lysis is an emergency complication pattern.",
        },
        {
          question: "Which client should RN assess first on a floor?",
          options: [
            "Stable post-op walking.",
            "Chest pain 8/10 with ST changes on telemetry.",
            "Client watching TV.",
            "Client asking for charger.",
          ],
          correct: 1,
          rationale: "Active ischemia outranks comfort requests.",
        },
        {
          question: "Oxygen in ACS—exam-style nuance?",
          options: [
            "Always 100% for everyone.",
            "Titrate to SpO₂ goals per orders/protocol; avoid unnecessary hyperoxia if stem reflects current teaching.",
            "Never use oxygen.",
            "Only for COPD clients.",
          ],
          correct: 1,
          rationale: "Many items now test indication-based oxygen use.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "ACS & chest pain (NCLEX-RN, Canada)",
      seoTitle: "ACS nursing care | NCLEX-RN Canada | NurseNest",
      seoDescription:
        "Canadian RN: STEMI and NSTEMI pathways, serial troponin trends, collaborative reperfusion activation, RV infarct nitroglycerin cautions, antithrombotic bleeding surveillance, and metric vital trends.",
      clinical_meaning: `**Canadian RN**  
Same clinical spine with **Canadian acute-care** terminology and **metric** values when presented. **EMS activation** and **catheterization** pathways mirror NCLEX-style urgency.`,
      exam_relevance: `Read **BP in mmHg** before **NTG**; watch **RV infarct** cues with **inferior MI**. **STEMI** items still punish delays to **reperfusion** and **continuous monitoring**—same structure as US stems, with Canadian collaborative language when shown.`,
      clinical_scenario: `**Vignette**  
Client with **ongoing ischemic chest pain** and **diagnostic ECG changes** per stem.

**Fork**  
Immediate collaboration with **cardiology/intervention** team per protocol; implement ordered antithrombotic therapy; monitor for bleeding.`,
      takeaways: `• **Team coordination** is as testable as medications, oxygen therapy, and antithrombotic orders—delays to cardiology or the cath team are wrong-answer patterns.  
• **Reassess pain**, **perfusion**, **rhythm**, and **access-site or bleeding risk** after each intervention and document trends clearly for handoff.  
• **Inferior MI** cues should trigger **RV infarct awareness** before aggressive preload reduction with nitroglycerin when the stem supports that fork.`,
    },
    {
      preTest: [
        {
          question: "Which task can RN delegate during stable post-cath recovery (per stem stability)?",
          options: [
            "Interpreting new ST elevation alone to AP.",
            "Measuring vitals and reporting chest pain recurrence.",
            "Deciding heparin dose independently by AP.",
            "Removing sheaths without competency.",
          ],
          correct: 1,
          rationale: "Data collection with reporting is appropriate delegation when stable.",
        },
        {
          question: "Canadian client with ACS symptoms at home should be taught to?",
          options: [
            "Drive self while symptomatic.",
            "Call emergency services for sudden severe chest pain at rest.",
            "Wait three days.",
            "Exercise through pain.",
          ],
          correct: 1,
          rationale: "EMS reduces delay to definitive care.",
        },
        {
          question: "Why monitor creatinine during ACS care?",
          options: [
            "Creatinine never matters.",
            "Contrast and nephrotoxic risk with PCI imaging; guides hydration and therapy choices per orders.",
            "Only for dialysis patients.",
            "It replaces troponin.",
          ],
          correct: 1,
          rationale: "Renal function affects contrast and medication safety.",
        },
      ],
      postTest: [
        {
          question: "Which finding suggests cardiogenic shock pattern in exam stems?",
          options: [
            "Warm pink skin with normal mentation.",
            "Hypotension, cool extremities, altered mentation, oliguria with ACS context.",
            "Stable BP with walking.",
            "Mild headache only.",
          ],
          correct: 1,
          rationale: "Low cardiac output shock is a time-critical escalation.",
        },
        {
          question: "After PCI, which site assessment is priority?",
          options: [
            "Ignore groin/radial site.",
            "Bleeding, hematoma, distal pulses, pain—per access site protocol.",
            "Only temperature.",
            "Only diet.",
          ],
          correct: 1,
          rationale: "Access site complications are common tested content.",
        },
        {
          question: "Why teach nitroglycerin administration sitting or lying?",
          options: [
            "Position never matters.",
            "Orthostatic hypotension risk after vasodilation.",
            "Only for children.",
            "Increases BP.",
          ],
          correct: 1,
          rationale: "Patient safety during vasodilator use.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "Chest pain triage in primary care (NP, US)",
      seoTitle: "Chest pain triage | NP US | NurseNest",
      seoDescription:
        "NP ambulatory chest pain triage: ACS versus PE and aortic dissection cannot-miss patterns, ECG and risk-stratification documentation, timely ED or EMS activation, and shared decision-making after stabilization.",
      clinical_meaning: `**NP**  
Ambulatory items test **cannot-miss** chest pain: **ACS**, **PE**, **aortic dissection**, **pneumothorax**. “Reassuring” without **ECG and risk stratification** is a trap. You **document** **red flags**, **refer to ED** when appropriate, and avoid **minimizing** **diabetes/autonomic neuropathy** masking angina.`,
      exam_relevance: `Trap: **scheduling stress test next month** for **acute ongoing pain at rest** with risk factors.`,
      clinical_scenario: `**Vignette — same-day slot**  
55-year-old with **HTN**, **DM**, **pressure-like chest pain** now at rest, **diaphoretic**.

**Fork**  
**EMS/ED**—not “increase metformin” or “try antacid first” as sole plan.`,
      takeaways: `• **Acute at-rest pain with diaphoresis, dyspnea, or radiation in a higher-risk patient** means **EMS or ED now**, not a routine follow-up slot.  
• **Document** **HEART**-style elements—history, ECG, age, risk factors, troponin timing—when the stem rewards structured risk language.  
• When the vignette hints at **tearing pain**, **pulse deficit**, or **new neurologic findings**, think **aortic dissection** or **stroke mimic** and escalate accordingly—not antacid-only plans.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs ED now?",
          options: [
            "Stable follow-up HTN without chest symptoms.",
            "Resting chest pressure with diaphoresis and cardiac risk factors.",
            "Routine refill.",
            "Mild ankle edema without chest pain.",
          ],
          correct: 1,
          rationale: "ACS cannot be managed as routine outpatient visit.",
        },
        {
          question: "Why consider PE in pleuritic chest pain with tachycardia?",
          options: [
            "PE never causes chest pain.",
            "PE can mimic ACS; ED evaluation for high-risk presentations.",
            "Only ACS exists.",
            "Tachycardia is always anxiety.",
          ],
          correct: 1,
          rationale: "Dual vascular emergencies are classic differential teaching.",
        },
        {
          question: "NP documents HEART score elements to?",
          options: [
            "Replace clinical judgment.",
            "Structure risk communication and follow-up for low-risk stable presentations when appropriate.",
            "Ignore symptoms.",
            "Guarantee zero MI.",
          ],
          correct: 1,
          rationale: "Risk scores support—but do not replace—escalation for high-risk symptoms.",
        },
      ],
      postTest: [
        {
          question: "Elderly diabetic with “indigestion” and fatigue—NP thinks?",
          options: [
            "Always GERD.",
            "ACS equivalent presentation until evaluated when risk and context fit.",
            "Never cardiac.",
            "Only anxiety.",
          ],
          correct: 1,
          rationale: "Atypical ACS is common in diabetes and older adults.",
        },
        {
          question: "Which phrase shows appropriate safety netting?",
          options: [
            "Ignore new symptoms.",
            "Return to ED for recurrent pain, SOB, syncope, or uncontrolled BP.",
            "Stop all meds.",
            "Avoid all follow-up.",
          ],
          correct: 1,
          rationale: "Clear return precautions reduce harm.",
        },
        {
          question: "Why might NP avoid definitive ACS rule-out in office without resources?",
          options: [
            "Offices always have cath labs.",
            "Serial troponins and monitoring may require ED capabilities—stems test appropriate site of care.",
            "Troponin never helps.",
            "ECG never needed.",
          ],
          correct: 1,
          rationale: "Site-of-care decisions are exam-relevant.",
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
  premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
  relatedLessonRefs?: PathwayLessonRelatedRef[];
};

function npTitles(pathwayId: string, v: (typeof VARIANTS)["us_np"]) {
  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);
  return {
    ...v,
    title: `Chest pain triage in primary care (${suf})`,
    seoTitle: `Chest pain triage | ${lab} US | NurseNest`,
    seoDescription: `NP chest pain triage for ${lab}: ED or EMS when red flags appear, serial ECG and troponin concepts, ACS versus pulmonary embolism and dissection differentials, risk stratification, and safety netting.`,
  };
}

export function acsGoldHubListInput(pathwayId: string): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getAcsGoldLessonInput(pathwayId);
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

export function getAcsGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const key = PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  let v = VARIANTS[key];
  if (key === "us_np") v = npTitles(pathwayId, v);
  const geo = pathwayIdToTierGeo(pathwayId);
  if (!geo) return null;
  const syn = synthesizeGoldPremiumSections({
    sharedCore: SHARED_CORE_BODY,
    clinical_meaning: v.clinical_meaning,
    exam_relevance: v.exam_relevance,
    clinical_scenario: v.clinical_scenario,
    takeaways: v.takeaways,
    tierGeo: geo,
    examLabel: PATHWAY_EXAM_LABEL[pathwayId] ?? "your nursing licensure exam",
    labsDiagnostics: ACS_LABS_DIAGNOSTICS,
    relatedSlugs: [
      "shock-emergencies-gold",
      "stroke-increased-icp-gold",
      "high-alert-medications-safety-gold",
      "fluids-electrolytes-emergencies-gold",
    ],
    relatedTitlesBySlug: {
      "shock-emergencies-gold": "Shock emergencies",
      "stroke-increased-icp-gold": "Stroke & increased ICP",
      "high-alert-medications-safety-gold": "High-alert medication safety",
      "fluids-electrolytes-emergencies-gold": "Fluids & electrolyte emergencies",
    },
  });
  return {
    slug: ACS_GOLD_SLUG,
    title: v.title,
    topic: "Cardiovascular",
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: ensurePremiumSeoDescription(v.seoDescription, PATHWAY_EXAM_LABEL[pathwayId] ?? pathwayId),
    sections: syn.sections,
    premiumOmittedSections: syn.premiumOmittedSections,
    relatedLessonRefs: syn.relatedLessonRefs,
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
