/**
 * Canadian RPN (REx-PN) high-yield slice — scope, collaboration, delegation, and safe practice.
 * Remediation wave 3: practical nursing exam depth with Canadian regulatory framing; other pathways get collaboration/delegation overlays.
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

export const CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG = "canadian-rpn-scope-collaboration-gold" as const;

type RpnSliceVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, RpnSliceVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**Why this lesson exists**  
**Registered Practical Nurses (RPNs)** in Canada practice under **provincial regulation**, **employer policy**, and **interprofessional standards**. REx-PN items reward knowing what you **can do with a valid order**, when you **must collaborate** before acting, how to **prioritize** when multiple clients need you, and how to **document and report** unsafe situations—without confusing **US LPN** scope language with **Canadian RPN** authority where the stem is Canada-specific.

**High-yield clusters**  
• **Medication administration**: right client/drug/dose/route/time/reason; **high-alert** meds; **IV therapy** only when competency and policy authorize; **never independent prescription** or **reinterpreting** unclear orders without clarification.  
• **Assessment & reporting**: trends in vitals, neuro, pain, wounds, infection—**notify RN/NP/physician** when thresholds crossed.  
• **Delegation to others**: RPN may receive delegated tasks from RN; **UCP** support must stay within **their** role—RPN remains accountable for **supervised** tasks assigned to them.  
• **Safety & ethics**: **refuse** unsafe assignments with **appropriate escalation**; **cultural safety** and **therapeutic communication** in conflict.

**Exam tip**  
When the stem says **Canada** or **RPN**, select answers that show **collaboration**, **clear orders**, and **policy**—not independent medical decision-making unless the item explicitly defines extended authority.`;

const RPN_SCOPE_LABS_OMIT_REASON =
  "This lesson targets scope, delegation, and interprofessional collaboration rather than standalone laboratory interpretation; apply fluids, sepsis, and electrolyte lessons when stems quote critical labs.";

function pack(
  variant: RpnSliceVariant,
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

const VARIANTS: Record<RpnSliceVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "Practical nursing scope: US PN vs Canadian RPN ideas (NCLEX-PN, US)",
      seoTitle: "PN scope & collaboration | NCLEX-PN US | NurseNest",
      seoDescription:
        "US PN: compare safe scope patterns with Canadian RPN stems—orders, clarification, escalation, and no independent diagnosis.",
      clinical_meaning: `**US PN lens**  
Your NCLEX-PN scope parallels many **RPN** themes: **carry out orders**, **assess within role**, **teach**, **delegate appropriate tasks to CNA** when authorized, and **escalate** unclear or unsafe situations. When a stem is **Canadian**, expect **RPN** titles and **metric** labs—apply the **same safety spine**: **no independent prescriptive changes**, **verify orders**, **protect clients**.`,
      exam_relevance: `Traps: **choosing independent dose changes**, **silently skipping** a **contraindicated** med instead of **clarifying**, or **accepting** **RN’s entire assignment** when **unsafe** given your competency. Canadian-flavored items still test **prioritization** and **communication**.`,
      clinical_scenario: `**Vignette — comparative stem**  
“Canadian RPN” asked to **give extra insulin** because “patient looks fine,” but **glucose not checked** and **order is sliding scale only**.

**Fork**  
**Assess per order**, **clarify** if parameters missing—do **not** invent a dose outside the protocol.`,
      takeaways: `• **Orders + assessment data** together guide safe administration.  
• **Clarify** rather than guess—applies in US and Canada.  
• **Unsafe assignment** → **chain of command**, not silent non-compliance or unsafe compliance.`,
    },
    {
      preTest: [
        {
          question: "Which action fits PN scope when the insulin order is unclear after meal?",
          options: [
            "Guess the dose from yesterday.",
            "Clarify the order with the RN/provider and obtain required blood glucose per protocol.",
            "Skip insulin without telling anyone.",
            "Give double dose to catch up.",
          ],
          correct: 1,
          rationale: "Medication safety requires clarity and assessment data—never independent guessing.",
        },
        {
          question: "Why might Canadian RPN stems emphasize collaboration?",
          options: [
            "RPN never acts alone.",
            "Interprofessional model expects reporting and shared accountability within each role’s authority.",
            "RPN replaces physician.",
            "Collaboration means no documentation.",
          ],
          correct: 1,
          rationale: "Canadian nursing exams reflect team-based care and clear role boundaries.",
        },
        {
          question: "PN asked to perform a task never trained for. Best response?",
          options: [
            "Attempt it quietly.",
            "Refuse unsafe task and notify supervisor per policy; request appropriate training or reassignment.",
            "Delegate to a visitor.",
            "Leave the unit.",
          ],
          correct: 1,
          rationale: "Competency boundaries protect patients and licenses in both countries.",
        },
      ],
      postTest: [
        {
          question: "Which statement shows appropriate delegation understanding?",
          options: [
            "CNA interprets ECG independently.",
            "PN assigns vitals to CNA while PN performs assessments and meds per order within scope.",
            "CNA prescribes PRN oxycodone.",
            "PN ignores CNA reports.",
          ],
          correct: 1,
          rationale: "Delegation matches competency; licensed nurse retains accountability for delegated tasks.",
        },
        {
          question: "US PN preparing for Canada-themed items should remember?",
          options: [
            "Ignore metric units.",
            "Read mmol/L and mmHg carefully; scope language may say RPN instead of LPN.",
            "Canadian exams never test prioritization.",
            "RPN always prescribes independently.",
          ],
          correct: 1,
          rationale: "Unit and title differences are surface; safety and prioritization logic align.",
        },
        {
          question: "Why document wound changes objectively?",
          options: [
            "Documentation is optional.",
            "Legal and continuity of care require measurable descriptors and notifications when worsening.",
            "Only physicians read charts.",
            "Avoid describing drainage.",
          ],
          correct: 1,
          rationale: "Objective wound documentation triggers timely escalation when infection suspected.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "REx-PN high yield: scope, meds & collaboration (Canada)",
      seoTitle: "RPN scope & REx-PN | NurseNest Canada",
      seoDescription:
        "Canadian RPN: college-aligned scope, IV and medication boundaries, frequent reassessment and objective reporting, SBAR escalation to RN or NP, infection control, unsafe assignment pushback, and documentation that shows trajectory.",
      clinical_meaning: `**RPN in Canada**  
You practice within your **college** standards and **employer policies**. Items test **safe medication administration** (including **controlled drugs** per protocol), **IV therapy** only when **authorized and competent**, **wound care** within scope, **sterile technique** when required, and **immediate RN/NP/physician notification** for unstable clients. You **do not** diagnose or prescribe unless the exam stem explicitly places you in an **extended** authorized role.`,
      exam_relevance: `Top traps: **acting on verbal orders** without **policy-compliant** confirmation, **withholding** critical findings, **accepting** **unsafe RN ratios** without **appropriate reporting**, or **performing** **controlled acts** outside authorization. Items love **SBAR**, **infection outbreaks**, **falls risk**, and **elder abuse** reporting duties.`,
      clinical_scenario: `**Vignette — acute floor**  
RN asks you to **sign off a new heparin infusion rate** you did not witness and **bag is unlabeled**.

**Fork**  
**Refuse unsafe practice**, **verify label and order**, **follow medication safety policy**—not “save time and run it.”`,
      takeaways: `• **Five (or six) rights** + **policy** beat speed.  
• **Controlled acts** require **explicit authority**—do not assume.  
• **Whistleblowing** pathways exist for **unsafe care**—exams reward **patient-first** reporting.`,
    },
    {
      preTest: [
        {
          question: "Which action shows appropriate RPN response to an unclear physician order?",
          options: [
            "Choose the dose you prefer.",
            "Clarify the order with the prescriber or delegate RN per policy before administering.",
            "Administer then chart later.",
            "Ask the client’s family to decide.",
          ],
          correct: 1,
          rationale: "Unclear orders must be clarified before medication administration.",
        },
        {
          question: "RPN discovers another staff member charting care not performed. Priority?",
          options: [
            "Ignore to stay friendly.",
            "Report per employer policy—falsification risks patient safety.",
            "Copy the same behavior.",
            "Delete charts silently.",
          ],
          correct: 1,
          rationale: "Fraudulent documentation is unethical and dangerous; policy-driven reporting is correct.",
        },
        {
          question: "Why use SBAR when calling RN about deteriorating client?",
          options: [
            "SBAR is optional always.",
            "Structured communication reduces error and speeds appropriate interventions.",
            "Only physicians deserve facts.",
            "SBAR replaces assessment.",
          ],
          correct: 1,
          rationale: "Handoff frameworks are exam-tested communication standards.",
        },
      ],
      postTest: [
        {
          question: "Which task is inappropriate for RPN without IV certification in a typical stem?",
          options: [
            "Administering oral meds per order.",
            "Initiating peripheral IV cannulation when not competent/authorized.",
            "Reporting pain score changes.",
            "Measuring vitals.",
          ],
          correct: 1,
          rationale: "IV insertion is a controlled act requiring specific authorization and competency in many jurisdictions.",
        },
        {
          question: "RPN assigned six acute clients while orienting a student—unsafe. Best action?",
          options: [
            "Work faster without breaks.",
            "Escalate staffing concern to charge RN/manager using chain of command.",
            "Send student to care for unstable client alone.",
            "Refuse all care silently.",
          ],
          correct: 1,
          rationale: "Unsafe staffing requires assertive escalation—not silent overload or unsafe delegation.",
        },
        {
          question: "Which finding requires mandatory reporting beyond immediate clinical care in many Canadian stems?",
          options: [
            "Mild dry skin.",
            "Suspected abuse or neglect of vulnerable adult with objective indicators.",
            "Client requests extra pillow.",
            "Routine stable vitals.",
          ],
          correct: 1,
          rationale: "Abuse/neglect triggers legal and ethical reporting obligations in exam scenarios.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "Supervising practical nurses: delegation & safety (NCLEX-RN, US)",
      seoTitle: "LPN delegation | NCLEX-RN US | NurseNest",
      seoDescription: "US RN: assign tasks within LPN scope, verify competencies, Canadian RPN collaboration concepts for comparative stems.",
      clinical_meaning: `**RN**  
You **assign** tasks that match **LPN/RPN** competency and **state/provincial** rules when stems cross borders. **Accountability** stays with you for **overall plan**; you **verify** **high-risk** tasks, **clarify orders** for the team, and **do not delegate** **assessment requiring RN judgment** to **UAP** when the item forbids it. **Canadian comparative** items may reference **RPN**—think **same safety**: **appropriate task**, **adequate supervision**.`,
      exam_relevance: `Forks: **five rights of delegation**, **unstable client** cannot go to **UAP**, **LPN cannot titrate** vasopressors unless stem extends role, **float RN** unfamiliar with unit still **responsible** to **verify** assignments.`,
      clinical_scenario: `**Vignette**  
Charge RN floats **LPN** to **step-down** with **dopamine titration** patients.

**Fork**  
**Reassign** titration to **RN** or **ensure** LPN has **legal authority** in stem—do not assume all regions allow.`,
      takeaways: `• **Match task to license** every shift.  
• **Supervise** without micromanaging stable delegated work.  
• **Escalate** system issues (unsafe ratios) up the chain.`,
    },
    {
      preTest: [
        {
          question: "Which task is inappropriate to delegate to UAP?",
          options: [
            "Bed making on stable client.",
            "Initial assessment of new post-op client with epidural.",
            "Ambulation with stable client.",
            "Vital signs on stable client per protocol.",
          ],
          correct: 1,
          rationale: "Initial assessment of high-risk post-op client requires RN judgment.",
        },
        {
          question: "RN accountability after delegating med pass to LPN includes?",
          options: [
            "No follow-up ever.",
            "Ensuring appropriate order, competency, and supervision; following up on reported issues.",
            "Blaming LPN for all errors.",
            "Avoiding chart review.",
          ],
          correct: 1,
          rationale: "Delegating nurse retains oversight responsibility for delegated nursing care.",
        },
        {
          question: "Why clarify Canadian RPN scope in travel nursing stem?",
          options: [
            "All countries identical.",
            "Scope varies by province and employer—verify before assignment.",
            "RPN never gives meds.",
            "Ignore policy.",
          ],
          correct: 1,
          rationale: "Regulatory variation is a realistic safety theme in comparative items.",
        },
      ],
      postTest: [
        {
          question: "Which phrase reflects effective interprofessional communication?",
          options: [
            "Vague “client worse.”",
            "SBAR with vitals, changes, concerns, and clear request for orders/review.",
            "Yelling only.",
            "Avoiding physician contact.",
          ],
          correct: 1,
          rationale: "Structured communication improves outcomes in delegation scenarios.",
        },
        {
          question: "LPN reports possible med error. RN should?",
          options: [
            "Ignore to protect colleague.",
            "Assess client, follow incident protocol, notify provider as indicated, document factually.",
            "Hide the vial.",
            "Blame pharmacy only without assessment.",
          ],
          correct: 1,
          rationale: "Patient safety and transparent reporting supersede cover-up impulses.",
        },
        {
          question: "Which assignment matches stable LPN scope in typical med-surg stem?",
          options: [
            "Independent diagnosis of new murmur.",
            "Administering scheduled PO/IV meds per order with assessments within LPN role.",
            "Prescribing antibiotics.",
            "Discharging client independently.",
          ],
          correct: 1,
          rationale: "Medication administration within order and role fits LPN practice in most jurisdictions.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "Collaborating with RPNs: assignment & accountability (NCLEX-RN, Canada)",
      seoTitle: "RN–RPN collaboration | NCLEX-RN Canada | NurseNest",
      seoDescription:
        "Canadian RN: RPN scope support, shared care, clear reassessment and reporting expectations, SBAR-style escalation to NP or physician, assignment rebalancing when acuity exceeds practical-nurse support, and documentation of unsafe staffing concerns.",
      clinical_meaning: `**Canadian RN**  
You **coordinate** care with **RPNs** in shared models: **clear orders**, **appropriate assignment**, **supervision** of delegated tasks, and **joint response** to deterioration. Items test **accountability** when both roles are present—who performs **controlled acts**, who assesses **acute change**, and how **documentation** reflects each contributor.`,
      exam_relevance: `Traps: **dumping** unstable clients on an **RPN** without support, **assuming** an RPN can titrate **all IV meds**, or **failing** to escalate an **unsafe RPN assignment** from management. **Metric vitals** and Canadian **terminology** appear frequently.`,
      clinical_scenario: `**Vignette**  
Unit short-staffed; an **RPN** is assigned **two unstable post-ops** plus **new admissions**.

**Fork**  
The **RN rebalances** the assignment, **calls for help**, and **documents** the staffing concern—not silent acceptance of an unsafe load.`,
      takeaways: `• **Patient acuity** drives assignment, not convenience.  
• **Mentor** junior RPNs **within policy**.  
• **College standards** guide both roles—know each scope the stem describes.`,
    },
    {
      preTest: [
        {
          question: "Which situation requires RN to adjust RPN assignment?",
          options: [
            "Stable clients with routine meds.",
            "RPN given multiple new unstable clients beyond safe scope/support.",
            "RPN completing routine dressing.",
            "Stable discharge teaching.",
          ],
          correct: 1,
          rationale: "Acuity and scope must align; RN leads safe workload distribution.",
        },
        {
          question: "RN observes RPN about to administer wrong route med. Action?",
          options: [
            "Wait to see what happens.",
            "Intervene immediately to prevent error, follow incident process if needed.",
            "Blame RPN publicly only.",
            "Ignore if busy.",
          ],
          correct: 1,
          rationale: "Immediate prevention of harm is the priority before process follow-up.",
        },
        {
          question: "Why document RN and RPN contributions in shared notes?",
          options: [
            "Duplication wastes time.",
            "Clear accountability and communication reduce errors and legal ambiguity.",
            "Only RN charts exist.",
            "RPN never documents.",
          ],
          correct: 1,
          rationale: "Interprofessional documentation standards support continuity of care.",
        },
      ],
      postTest: [
        {
          question: "Which task typically stays with RN in acute deterioration?",
          options: [
            "Recording I&O on stable client.",
            "Complex titration and interpretation requiring RN scope per policy.",
            "Bed bath on stable client.",
            "Routine glucose on stable diabetic per protocol.",
          ],
          correct: 1,
          rationale: "High-risk titration and interpretation generally remain RN accountability.",
        },
        {
          question: "Canadian RN supporting new graduate RPN should?",
          options: [
            "Avoid answering questions.",
            "Offer coaching, verify critical tasks, and foster psychological safety within policy.",
            "Assign only unstable clients.",
            "Delegate all assessments away.",
          ],
          correct: 1,
          rationale: "Precepting and support reduce errors and build competence.",
        },
        {
          question: "Which phrase shows culturally safe collaboration with RPN and client?",
          options: [
            "Dismiss family interpreter needs.",
            "Ask client preference for involvement, use interpreter services, respect traditions within care plan.",
            "Assume English only.",
            "Rush discharge without teaching.",
          ],
          correct: 1,
          rationale: "Cultural safety is embedded in Canadian nursing competencies.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "Team-based care with LPN/RPN support (NP, US)",
      seoTitle: "NP & practical nursing | NP US | NurseNest",
      seoDescription:
        "NP team leadership: parameter-rich orders for LPN and RPN execution, scope boundaries and collaborative agreements, telephone triage documentation, comparative Canadian RPN items with employer policy language, and escalation when practical nurses report acute change.",
      clinical_meaning: `**NP**  
You **write clear orders**, **define parameters** for PRN meds, **respect LPN/RPN scope** in your setting, and **avoid ambiguous instructions** that force guessing. In **comparative Canadian items**, an **RPN** may administer meds you order—ensure **route, dose, and monitoring** match **employer policy** and provincial rules when the stem references them.`,
      exam_relevance: `Traps: a vague **“give if needed” insulin** order **without parameters**; expecting an **LPN** to **order labs**; or **ignoring state collaborative agreement** rules where the exam tests NP–RN–LPN relationships.`,
      clinical_scenario: `**Vignette — primary care**  
An **LPN calls**: “Can I give **extra Lasix** because **ankles look bad**?”

**Fork**  
The **NP obtains data** (weight, BP, symptoms), then issues a **specific order or visit plan**—not informal dose changes by proxy.`,
      takeaways: `• Orders must be **specific enough** for safe execution at the bedside—vague **PRN** instructions that force unsupervised titration are classic wrong answers.  
• **Telephone encounters** still require **documentation** and **assessment** when therapy changes; have practical nurses **repeat back vitals and symptoms** before you adjust high-alert meds.  
• Know **who can administer what** under your **practice agreement**; when an **RPN** reports **instability**, choose **stop-and-assess** and **direct escalation** over **delegating clinical judgment downward**.`,
    },
    {
      preTest: [
        {
          question: "Which order is safest for LPN to execute without clarification?",
          options: [
            "Give potassium IV push prn.",
            "Metformin 500 mg PO BID with meals as written with no contraindications in chart.",
            "Insulin sliding scale without glucose parameters.",
            "Heparin without route or rate.",
          ],
          correct: 1,
          rationale: "Complete, standard PO orders within scope are safer than incomplete high-risk orders.",
        },
        {
          question: "NP learns clinic LPN is performing tasks outside state scope. Action?",
          options: [
            "Ignore if outcomes okay.",
            "Align roles with policy/legal scope; retrain; escalate to leadership.",
            "Expand scope verbally only.",
            "Fire without process.",
          ],
          correct: 1,
          rationale: "NP leadership includes ensuring team practice stays within legal scope.",
        },
        {
          question: "Why specify monitoring after starting new antihypertensive in order set?",
          options: [
            "Monitoring never needed.",
            "Orthostasis and adverse effects need nursing surveillance—especially with practical nursing support.",
            "Only inpatient matters.",
            "NP never responsible.",
          ],
          correct: 1,
          rationale: "Order clarity guides safe nursing follow-up in ambulatory models.",
        },
      ],
      postTest: [
        {
          question: "Canadian comparative stem: RPN cannot start medication NP just prescribed orally. Likely issue?",
          options: [
            "RPN never gives meds.",
            "Specific controlled act or route may require RN or different authorization in that province/policy.",
            "NP order invalid always.",
            "Only physicians administer.",
          ],
          correct: 1,
          rationale: "Provincial scope varies; exams test awareness of role boundaries.",
        },
        {
          question: "Which documentation helps LPN/RPN implement NP plan safely?",
          options: [
            "Verbal only forever.",
            "Written orders with indication, parameters, monitoring, and follow-up plan.",
            "Text emoji instructions.",
            "Avoid indications.",
          ],
          correct: 1,
          rationale: "Complete orders reduce misinterpretation at the bedside.",
        },
        {
          question: "NP supervising community team should prioritize for practical nurses?",
          options: [
            "Maximum speed only.",
            "Clear protocols, competency checks, and accessible consultation for gray-zone decisions.",
            "No training.",
            "Avoid contact.",
          ],
          correct: 1,
          rationale: "Support structures reduce scope errors in the field.",
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
    title: `Team-based care with LPN/RPN support (${suf})`,
    seoTitle: `NP & practical nursing | ${lab} US | NurseNest`,
    seoDescription: `NP collaboration with practical nurses for ${lab}: clear orders, scope boundaries, safe escalation, and team communication.`,
  };
}

export function canadianRpnHighYieldGoldHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getCanadianRpnHighYieldGoldLessonInput(pathwayId);
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

export function getCanadianRpnHighYieldGoldLessonInput(pathwayId: string): LessonInputShape | null {
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
    labsOmitReason: RPN_SCOPE_LABS_OMIT_REASON,
    relatedSlugs: [
      "clinical-judgment-prioritization-gold",
      "high-alert-medications-safety-gold",
      "sepsis-early-recognition-gold",
      "fluids-electrolytes-emergencies-gold",
    ],
    relatedTitlesBySlug: {
      "clinical-judgment-prioritization-gold": "Clinical judgment & prioritization",
      "high-alert-medications-safety-gold": "High-alert medication safety",
      "sepsis-early-recognition-gold": "Sepsis early recognition",
      "fluids-electrolytes-emergencies-gold": "Fluids & electrolyte emergencies",
    },
  });
  return {
    slug: CANADIAN_RPN_HIGH_YIELD_GOLD_SLUG,
    title: v.title,
    topic: "Delegation & collaboration",
    topicSlug: "delegation",
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
