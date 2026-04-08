/**
 * Gold-standard clinical judgment / prioritization lesson — shared core + pathway overlays.
 * Remediation wave 1: management_of_care proxy + exam prioritization spine.
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

export const CLINICAL_JUDGMENT_GOLD_SLUG = "clinical-judgment-prioritization-gold" as const;

type CjVariant = "us_pn_nclex_pn" | "ca_rpn_rex_pn" | "us_rn_nclex_rn" | "ca_rn_nclex_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, CjVariant> = {
  "us-lpn-nclex-pn": "us_pn_nclex_pn",
  "ca-rpn-rex-pn": "ca_rpn_rex_pn",
  "us-rn-nclex-rn": "us_rn_nclex_rn",
  "ca-rn-nclex-rn": "ca_rn_nclex_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**Unstable versus “important but not first”**  
Examiners reward recognizing **life threats**, **acute changes**, and **safety failures** before comfort, teaching, or routine tasks. Think in layers: **airway/breathing/circulation** when relevant, then **infection/neuro compromise**, then **pain**—always bounded by **scope** and **orders**.

**Prioritization heuristics (exam-style)**  
• **First**: abnormal vitals with **acute mental status change**, **hypoxia despite therapy**, **uncontrolled bleeding**, **chest pain suggesting ischemia**, **sudden neuro deficit**, **severe allergic reaction**, **suicidal ideation with plan**, or **new fetal distress pattern** (when maternity).  
• **Not first**: scheduled meds without acute risk, routine paperwork, non-urgent hygiene, or “nice to do” teaching when another client is decompensating.

**Delegation discipline**  
Match the task to the **role in the stem**. Practical nurses reinforce, report, and carry out ordered interventions; RNs synthesize assessment, coordinate, and initiate many nursing orders; NPs/advanced roles add diagnostic and prescriptive reasoning where the item allows. When unsure, choose **escalation/collaboration** over **silent heroics**.`;

function t(
  variant: CjVariant,
  blocks: {
    clinical_meaning: string;
    exam_relevance: string;
    clinical_scenario: string;
    takeaways: string;
    title: string;
    seoTitle: string;
    seoDescription: string;
  },
  quizzes: { preTest: PathwayLessonQuizItem[]; postTest: PathwayLessonQuizItem[] },
) {
  return { variant, ...blocks, quizzes };
}

const VARIANTS: Record<CjVariant, ReturnType<typeof t>> = {
  us_pn_nclex_pn: t(
    "us_pn_nclex_pn",
    {
      title: "Clinical judgment: prioritization (NCLEX-PN, US)",
      seoTitle: "Prioritization & delegation | NCLEX-PN US | NurseNest",
      seoDescription:
        "US PN/LVN: who to see first, what to report, safe delegation, and traps that confuse LPN scope with RN triage.",
      clinical_meaning: `**What NCLEX-PN tests**  
You are expected to **recognize acute change**, **act within your role**, and **escalate** when findings exceed stable monitoring. Items often pair a “sick” client with others who have **routine** or **comfort** needs.

**Scope line**  
Stay with **data collection you are assigned**, **ordered interventions**, **reinforcement of teaching**, and **immediate reporting** of instability. Avoid **independent prescribing**, **diagnosing beyond nursing data**, or **RN-level triage decisions** unless the stem clearly authorizes you under protocol.`,
      exam_relevance: `Look for **four clients / four tasks** patterns, **assignment changes**, and **who is unsafe if ignored**. Traps: choosing **a long task** because it was “due first,” **routine insulin** before **hypoglycemia symptoms**, or **silencing alarms** without assessment.`,
      clinical_scenario: `**Vignette — busy med-surg (US)**  
Client A: post-op, **RR 32**, **confused**, **SpO₂ 86%** on prior oxygen.  
Client B: stable, asking for a **warm blanket**.  
Client C: **scheduled PO med** for stable chronic condition.  
Client D: wants **discharge teaching today** but vitals are stable.

**PN fork**  
Address **airway/oxygen and acute change** for Client A with **assessment + escalation per policy** while keeping others safe. The error is **blanket first** or **scheduled med** while A is decompensating.`,
      takeaways: `• **Acute ABCs / acute change** outrank comfort and routine.  
• **Report**; do not “wait out” critical desaturation or new confusion.  
• **Delegation questions** punish **tasks outside scope** or **abandoning unstable clients**.  
• Pair with **question-bank** multi-patient sets filtered to **prioritization**.`,
    },
    {
      preTest: [
        {
          question: "Which client should the PN check first?",
          options: [
            "Stable client requesting ice chips.",
            "Client with new confusion, rising respiratory rate, and dropping SpO₂ despite oxygen.",
            "Client due for a routine vitamin.",
            "Client who wants the TV channel changed.",
          ],
          correct: 1,
          rationale:
            "Acute change in oxygenation and mentation is an immediate safety priority over routine or comfort requests.",
        },
        {
          question: "Which action best fits PN scope when a client suddenly becomes confused and hypoxic?",
          options: [
            "Start a new antihypertensive prescription you believe is appropriate.",
            "Assess, ensure safety, and notify the RN or provider per facility policy.",
            "Ignore it because confusion is normal after surgery.",
            "Discharge the client to reduce workload.",
          ],
          correct: 1,
          rationale: "Assessment, safety, and timely escalation align with PN role; prescribing and discharge are outside PN scope here.",
        },
        {
          question: "A delegatee asks you to sign off on a task you were not trained to perform. Best response?",
          options: [
            "Perform it anyway to help the team.",
            "Refuse and clarify training/supervision per policy; notify the nurse in charge if needed.",
            "Ask an unlicensed peer to teach you on the spot.",
            "Document that someone else should have done it.",
          ],
          correct: 1,
          rationale: "Patient safety and scope compliance require refusing tasks without competency and using chain of command.",
        },
      ],
      postTest: [
        {
          question: "Which task is least appropriate to delegate to AP during an unstable post-op period?",
          options: [
            "Recording intake and output.",
            "Interpreting a sudden change in oxygen saturation without reporting it.",
            "Assisting with ambulation after RN clears stability.",
            "Bringing fresh water after swallow evaluation is cleared.",
          ],
          correct: 1,
          rationale:
            "Interpretation of acute changes and failure to report are not delegable; data collection with reporting can be.",
        },
        {
          question: "Why is ‘completion of paperwork’ a common trap on prioritization items?",
          options: [
            "Because charting is never important.",
            "Because it can distract from life-threatening changes that must be addressed first.",
            "Because only physicians chart.",
            "Because PNs never document.",
          ],
          correct: 1,
          rationale: "Examiners test whether you protect clients before administrative tasks when risk is unequal.",
        },
        {
          question: "Which statement reflects safe escalation?",
          options: [
            "I will watch SpO₂ 78% for another hour to confirm a trend.",
            "I will stay with the client, support breathing, and notify the RN immediately with objective data.",
            "I will turn off alarms so the client can rest.",
            "I will tell the family it is normal.",
          ],
          correct: 1,
          rationale: "Severe hypoxemia requires immediate intervention and notification, not delayed observation or silenced alarms.",
        },
      ],
    },
  ),

  ca_rpn_rex_pn: t(
    "ca_rpn_rex_pn",
    {
      title: "Clinical judgment: prioritization (REx-PN, Canada)",
      seoTitle: "Prioritization & scope | REx-PN Canada | NurseNest",
      seoDescription:
        "Canadian practical nursing: metric data, college scope, who to assess first, and safe collaboration.",
      clinical_meaning: `**REx-PN framing**  
You prioritize using **Canadian practice context**: **SI/metric** values when shown, **interprofessional collaboration**, and **college standards** for what a practical nurse may initiate independently.

**Clinical meaning**  
**Acute deterioration** (new confusion, hypoxia, chest pain, hemorrhage, sepsis cues) requires **immediate nursing actions you are authorized to take** plus **timely notification** of the RN/NP/physician.`,
      exam_relevance: `Expect **multi-client** stems and **therapeutic communication**. Traps mirror US items: **routine tasks** before **unstable vitals**, or **acting outside scope** (prescribing, unsupervised major titration).`,
      clinical_scenario: `**Vignette — acute floor (Canada)**  
Client A: **RR 30**, **new confusion**, **SpO₂ 88%** on ordered oxygen.  
Client B: wants **linens changed**—stable.  
Client C: **scheduled dressing**—stable.

**RPN fork**  
Stabilize and escalate for Client A per protocol; do not defer for linens. Choose **collaboration** over **silent oxygen changes** unless a standing order/protocol authorizes you.`,
      takeaways: `• **Instability first** across provinces—exam logic is consistent even when employer policies differ.  
• **Report** abnormal trends early; document objectively.  
• Pair with **REx-PN** practice sets on **assignment**.`,
    },
    {
      preTest: [
        {
          question: "Which finding should the RPN address first?",
          options: [
            "Stable client finishing lunch.",
            "Client with acute confusion, tachypnea, and hypoxemia on therapy.",
            "Client asking for extra juice (stable).",
            "Client requesting a shower later today.",
          ],
          correct: 1,
          rationale: "Acute ABC-related change with altered cognition is the highest immediate priority.",
        },
        {
          question: "An RPN notes SpO₂ 85% on current oxygen with increased work of breathing. Best action?",
          options: [
            "Reassess delivery and client, notify RN per policy, prepare for escalation.",
            "Ignore because COPD clients always sit low.",
            "Stop oxygen to stimulate breathing.",
            "Send the client home.",
          ],
          correct: 0,
          rationale: "Reassessment, support, and timely RN notification align with safe RPN practice.",
        },
        {
          question: "Which task illustrates appropriate delegation awareness?",
          options: [
            "Asking AP to interpret ABGs and change orders.",
            "Having AP measure vitals and report abnormalities to the nurse.",
            "Delegating nursing diagnosis documentation to family.",
            "Delegating assessment of a new post-op bleed to housekeeping.",
          ],
          correct: 1,
          rationale: "Data collection with reporting pathways is appropriate; clinical interpretation and prescribing are not.",
        },
      ],
      postTest: [
        {
          question: "Why might metric lab values change your urgency in a stem?",
          options: [
            "They never matter on exams.",
            "They can signal critical thresholds—pair numbers with client presentation.",
            "They are always typos.",
            "They replace assessment entirely.",
          ],
          correct: 1,
          rationale: "Read SI values carefully and integrate with clinical findings.",
        },
        {
          question: "Which choice reflects therapeutic communication during conflict over priorities?",
          options: [
            "I am too busy; deal with it.",
            "I hear this is frustrating—right now I must address acute breathing changes, then I will return.",
            "Your family can figure it out.",
            "I cannot help anyone today.",
          ],
          correct: 1,
          rationale: "Acknowledge feelings while maintaining safety priorities.",
        },
        {
          question: "A stable client demands you abandon another client who is desaturating. Best response?",
          options: [
            "Abandon the unstable client.",
            "Call for help, delegate a safe task if appropriate, and prioritize the unstable client.",
            "Argue loudly.",
            "Hide in the supply room.",
          ],
          correct: 1,
          rationale: "Use resources and maintain safety for the highest-acuity need.",
        },
      ],
    },
  ),

  us_rn_nclex_rn: t(
    "us_rn_nclex_rn",
    {
      title: "Clinical judgment: prioritization (NCLEX-RN, US)",
      seoTitle: "Prioritization for NCLEX-RN | US | NurseNest",
      seoDescription:
        "NCLEX-RN: multi-patient prioritization, unsafe practice recognition, delegation, first-action clinical judgment, and common board-style traps.",
      clinical_meaning: `**NCLEX-RN clinical judgment**  
You integrate **assessment**, **risk prediction**, and **intervention sequencing**. The exam rewards **protecting clients from harm** and **using resources** (call for help, delegate appropriate tasks, cluster care when safe).

**RN scope**  
You may **assess**, **plan**, **implement**, **evaluate**, and **delegate** using the **nursing process**—while respecting **orders**, **policies**, and **supervision** rules in the stem.`,
      exam_relevance: `Classic patterns: **four clients**, **first action**, **phone call priority**, **assignment changes**, and **ethical/legal** forks. Traps: **routine** before **unstable**, **false reassurance**, or **tasks beyond competency**.`,
      clinical_scenario: `**Vignette — ED holding**  
Client 1: **STEMI concern** with ongoing chest pain and diaphoresis.  
Client 2: **ankle sprain** waiting for x-ray, stable.  
Client 3: **suicidal ideation** with a stated plan and access.  
Client 4: **routine antibiotic** due for stable admission.

**RN fork**  
Address **time-sensitive threats** using stem cues: chest pain syndrome, **imminent self-harm**, then others. The trap is **antibiotic on time** while ignoring **chest pain** or **suicide plan**.`,
      takeaways: `• **Threat-to-life** and **time-sensitive organ risk** lead.  
• **Mental health safety** can be first when plan/access/immediacy are present.  
• **Delegate** data collection, not clinical judgment, when appropriate.  
• Run **timed** NCLEX-style blocks after this lesson.`,
    },
    {
      preTest: [
        {
          question: "Which client should the RN assess first?",
          options: [
            "Stable admission waiting for routine morning meds.",
            "Client with crushing chest pain, diaphoresis, and tachycardia.",
            "Client requesting a toothbrush.",
            "Client watching television with stable vitals.",
          ],
          correct: 1,
          rationale: "Possible acute coronary syndrome is an immediate priority over routine or comfort needs.",
        },
        {
          question: "Client states they will overdose tonight and shows a plan. What is the priority?",
          options: [
            "Finish chart checks first.",
            "Initiate immediate safety precautions and follow facility protocol for imminent self-harm.",
            "Tell them they are attention-seeking.",
            "Leave to get coffee before shift change.",
          ],
          correct: 1,
          rationale: "Imminent self-harm requires immediate safety intervention and protocol activation.",
        },
        {
          question: "Which task is appropriate to delegate to competent AP?",
          options: [
            "Analyzing trends and deciding to stop ordered telemetry.",
            "Measuring vitals on a stable client and reporting abnormalities.",
            "Teaching a new insulin regimen from scratch without verification.",
            "Counseling on legal guardianship decisions.",
          ],
          correct: 1,
          rationale: "Vital signs with reporting fit delegation; clinical decisions and advanced teaching typically do not.",
        },
      ],
      postTest: [
        {
          question: "Why is ‘call the provider’ sometimes wrong on NCLEX?",
          options: [
            "Providers should never be notified.",
            "If an immediate nursing intervention exists (e.g., airway, bleeding control, safety), do that first while activating help.",
            "Nurses never call providers.",
            "It is always the first action.",
          ],
          correct: 1,
          rationale: "Some scenarios require immediate bedside nursing action alongside notification.",
        },
        {
          question: "Which choice reflects safe prioritization during a sudden fire alarm on the unit?",
          options: [
            "Finish a non-urgent dressing first.",
            "Follow RACE/department emergency procedures and protect clients per protocol.",
            "Ignore alarms as false.",
            "Lock all doors from outside.",
          ],
          correct: 1,
          rationale: "Emergency procedures and client protection supersede non-urgent tasks.",
        },
        {
          question: "A new nurse is overwhelmed. Best supportive action by the RN team lead?",
          options: [
            "Publicly shame them.",
            "Triage tasks, redistribute safe work, and co-assess unstable clients.",
            "Ignore unstable clients to finish paperwork.",
            "Tell them to quit.",
          ],
          correct: 1,
          rationale: "Leadership prioritizes patient safety and team support.",
        },
      ],
    },
  ),

  ca_rn_nclex_rn: t(
    "ca_rn_nclex_rn",
    {
      title: "Clinical judgment: prioritization (NCLEX-RN, Canada)",
      seoTitle: "Prioritization | NCLEX-RN Canada | NurseNest",
      seoDescription:
        "Canadian NCLEX-RN context: same judgment spine with metric framing and Canadian acute-care language.",
      clinical_meaning: `**Canadian NCLEX-RN**  
Judgment mirrors US RN items with **Canadian terminology** and **metric/SI** data when presented. Your **nursing process** and **safety-first sequencing** remain the same.

**Collaboration**  
Use **healthcare provider** language as stems do; follow **employer emergency** and **consent** frameworks shown in the item.`,
      exam_relevance: `Prioritize **unstable airway/breathing/circulation**, **obstetric emergencies** when present, **suicide risk**, **sepsis cues**, and **bleeding** before **routine** tasks. Traps are identical in structure to US items.`,
      clinical_scenario: `**Vignette — medical ward (Canada)**  
Client A: **38.8 °C**, **hypotensive**, **tachycardic**, **new confusion** post-op.  
Client B: stable, wants **discharge paperwork** soon.  
Client C: **routine dressing**—stable.

**RN fork**  
Sepsis/shock concern for Client A outranks paperwork and routine dressing. Initiate **assessment + escalation + ordered interventions** while keeping others safe.`,
      takeaways: `• **Numbers**: read **°C**, **mmol/L**, and **metric** dosing carefully.  
• **Stability first** is universal.  
• Pair with **Canada RN** timed sets.`,
    },
    {
      preTest: [
        {
          question: "Which client should the RN see first?",
          options: [
            "Stable client requesting a snack.",
            "Post-op client with fever, hypotension, tachycardia, and new confusion.",
            "Client with stable vitals finishing a book.",
            "Client asking for a pillow fluff.",
          ],
          correct: 1,
          rationale: "Possible sepsis or shock pattern is an immediate assessment priority.",
        },
        {
          question: "Which action reflects appropriate delegation in acute care?",
          options: [
            "Delegate interpretation of sudden hemodynamic collapse to AP alone.",
            "Delegate vitals and intake/output while RN assesses unstable clients.",
            "Delegate prescribing to AP.",
            "Delegate restraint orders without assessment.",
          ],
          correct: 1,
          rationale: "Appropriate tasks are data collection; clinical interpretation remains RN accountability.",
        },
        {
          question: "A client with SI and a plan is alone in a room. Priority?",
          options: [
            "Complete medication reconciliation for another client first.",
            "Immediate safety measures per protocol and continuous precautions until evaluated.",
            "Ignore because they smiled once.",
            "Send them outside unsupervised.",
          ],
          correct: 1,
          rationale: "Imminent self-harm risk requires immediate safety intervention.",
        },
      ],
      postTest: [
        {
          question: "Why might discharge teaching wait?",
          options: [
            "Teaching is never important.",
            "When another client has an acute life threat, stabilize first unless the stem says otherwise.",
            "Canadian nurses do not teach.",
            "Discharge is illegal.",
          ],
          correct: 1,
          rationale: "Acute instability takes precedence over routine discharge tasks.",
        },
        {
          question: "Which finding best suggests reassessment before routine meds?",
          options: [
            "Stable walk from parking.",
            "New unilateral leg swelling with pleuritic chest pain and tachypnea.",
            "Request for a magazine.",
            "Normal sleep pattern.",
          ],
          correct: 1,
          rationale: "Possible VTE/PE red flags require urgent nursing assessment and escalation.",
        },
        {
          question: "Team conflict about priorities. Best leadership move?",
          options: [
            "Yell at the newest nurse.",
            "Re-ground the team on objective instability data and redistribute tasks safely.",
            "Abandon post-op checks.",
            "Hide unstable vitals from the charge nurse.",
          ],
          correct: 1,
          rationale: "Lead with data and safety-focused coordination.",
        },
      ],
    },
  ),

  us_np: t(
    "us_np",
    {
      title: "Clinical judgment in ambulatory care (NP, US)",
      seoTitle: "Ambulatory prioritization | NP US | NurseNest",
      seoDescription:
        "NP-level synthesis: who needs same-day evaluation, red-flag triage, and safe escalation in primary care.",
      clinical_meaning: `**NP / advanced practice framing**  
Items test **risk stratification**, **differential urgency**, and **appropriate site-of-care** decisions (office today vs urgent care vs ED). You still **prioritize life threats** and **time-sensitive diagnoses** (ACS, PE, sepsis, ectopic pregnancy, stroke, airway compromise).

**Collaboration**  
Even with expanded scope, choose **safe escalation** when the presentation exceeds outpatient management or diagnostics available in the vignette.`,
      exam_relevance: `Look for **red flags**, **missing data that must be obtained**, and **unsafe “watchful waiting”** when objective risk is high. Traps: **antibiotics for viral illness** without indication, **ignoring ECG symptoms**, or **delaying ED referral** for classic emergent patterns.`,
      clinical_scenario: `**Vignette — same-day clinic**  
A 54-year-old with **diabetes** reports **pleuritic chest pain**, **unilateral calf swelling**, and **tachypnea** after travel.

**NP fork**  
This pattern requires **urgent evaluation for VTE/PE** (and **ACS** remains in differential). The error is **routine follow-up in weeks** or **only ordering oral antibiotics** without addressing cardiopulmonary risk.`,
      takeaways: `• **Red-flag clusters** beat convenience.  
• **Document** risk discussion and follow-up instructions.  
• Pair with **NP** case-style questions that test **management synthesis**.`,
    },
    {
      preTest: [
        {
          question: "Which presentation most warrants same-day ED referral?",
          options: [
            "Mild allergic rhinitis without respiratory distress.",
            "Pleuritic chest pain with unilateral leg swelling and tachypnea.",
            "Routine follow-up of stable hypothyroidism.",
            "Request for a work note without acute symptoms.",
          ],
          correct: 1,
          rationale: "Possible VTE/PE (and ACS) requires urgent evaluation, not routine outpatient deferral.",
        },
        {
          question: "A client with fever, hypotension, and confusion is on the phone. Best advice?",
          options: [
            "Take a nap and call next month.",
            "Seek emergency care now—this may be life-threatening sepsis.",
            "Double the NSAID dose.",
            "Avoid all fluids.",
          ],
          correct: 1,
          rationale: "Sepsis red flags require emergency evaluation.",
        },
        {
          question: "Which pattern suggests escalating beyond ‘viral URI’ management?",
          options: [
            "Clear rhinorrhea, afebrile, normal work of breathing.",
            "Toxic appearance, trismus, unilateral severe throat swelling, and muffled voice.",
            "Mild sore throat with voice use.",
            "Seasonal allergies with sneezing.",
          ],
          correct: 1,
          rationale: "Airway-compromising infections need urgent escalation.",
        },
      ],
      postTest: [
        {
          question: "Why is polypharmacy review part of prioritization for NPs?",
          options: [
            "Medications never matter.",
            "Drug interactions and adverse effects can mimic new diagnoses and change urgency.",
            "NPs never prescribe.",
            "Only pharmacists assess meds.",
          ],
          correct: 1,
          rationale: "Medication context changes risk and differential.",
        },
        {
          question: "Client with classic TIAs needs what next?",
          options: [
            "Ignore because symptoms resolved.",
            "Urgent evaluation for stroke risk—same-day workup/ED per protocol.",
            "Only recommend vitamins.",
            "Defer for annual physical in 12 months.",
          ],
          correct: 1,
          rationale: "TIA is a stroke warning and requires timely evaluation.",
        },
        {
          question: "Which documentation element supports safe NP triage?",
          options: [
            "No vitals, no follow-up plan.",
            "Objective data, differential considerations, red-flag instructions, and follow-up interval.",
            "Only billing codes.",
            "Guess without assessment.",
          ],
          correct: 1,
          rationale: "Clear data and safety-netting reduce harm.",
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

function applyNpTitles(pathwayId: string, v: ReturnType<typeof t>): ReturnType<typeof t> {
  if (v.variant !== "us_np") return v;
  const lab = npExamLabel(pathwayId);
  const suf = npPrimaryCareTitleSuffix(pathwayId);
  return {
    ...v,
    title: `Clinical judgment in ambulatory care (${suf})`,
    seoTitle: `Ambulatory prioritization | ${lab} US | NurseNest`,
    seoDescription: `NP-level synthesis for ${lab}: same-day risk, red flags, and safe escalation in primary care.`,
  };
}

export function clinicalJudgmentVariantForPathway(pathwayId: string): CjVariant | undefined {
  return PATHWAY_VARIANT[pathwayId];
}

export function clinicalJudgmentHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getClinicalJudgmentGoldLessonInput(pathwayId);
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

export function getClinicalJudgmentGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const variantKey = PATHWAY_VARIANT[pathwayId];
  if (!variantKey) return null;
  let v = VARIANTS[variantKey];
  v = applyNpTitles(pathwayId, v);
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
    labsOmitReason:
      "Prioritization spine: laboratory interpretation is covered in disease-specific lessons (for example sepsis, shock, and electrolyte emergencies) when stems quote values.",
    relatedSlugs: [
      "sepsis-early-recognition-gold",
      "shock-emergencies-gold",
      "fluids-electrolytes-emergencies-gold",
      "high-alert-medications-safety-gold",
    ],
    relatedTitlesBySlug: {
      "sepsis-early-recognition-gold": "Sepsis early recognition",
      "shock-emergencies-gold": "Shock emergencies",
      "fluids-electrolytes-emergencies-gold": "Fluids & electrolyte emergencies",
      "high-alert-medications-safety-gold": "High-alert medication safety",
    },
  });
  return {
    slug: CLINICAL_JUDGMENT_GOLD_SLUG,
    title: v.title,
    topic: "Prioritization & delegation",
    topicSlug: "prioritization-delegation",
    bodySystem: "General",
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
