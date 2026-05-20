#!/usr/bin/env node
/**
 * Writes rn-nclex-leadership-delegation-expansion-catalog.json
 * Run: node scripts/generate-rn-leadership-delegation-expansion-catalog.mjs (from nursenest-core)
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../src/content/pathway-lessons/rn-nclex-leadership-delegation-expansion-catalog.json");

const HUB = `[Canada RN hub](/canada/rn/nclex-rn/lessons) · [US RN hub](/us/rn/nclex-rn/lessons)`;
const ASSIGN = `[Assignment vs delegation](LESSON:assignment-vs-delegation)`;
const LEGAL = `[Nurse Practice Act](LESSON:legal-nurse-practice-act)`;
const QI = `[QI & incident reporting](LESSON:qi-incident-reporting)`;
const ETHICAL = `[Ethical distress & advocacy](LESSON:ethical-distress-advocacy)`;

/** [slug, title, flavor: delegation|communication|legal_ethics|qi_safety|leadership_priority] */
const META = [
  ["five-rights-delegation-nclex-rn", "Five Rights of Delegation", "delegation"],
  ["scope-rn-rpn-uap-nclex-rn", "Scope of Practice: RN vs RPN vs UAP", "delegation"],
  ["stable-unstable-delegation-nclex-rn", "Stable vs Unstable Patients in Delegation", "delegation"],
  ["tasks-appropriate-delegation-nclex-rn", "Tasks Appropriate for Delegation", "delegation"],
  ["tasks-never-delegated-nclex-rn", "Tasks That Must NOT Be Delegated", "delegation"],
  ["prioritization-vs-delegation-nclex-rn", "Prioritization vs Delegation: Key Differences", "delegation"],
  ["assigning-patients-acuity-nclex-rn", "Assigning Patients by Acuity", "delegation"],
  ["time-management-nurses-nclex-rn", "Time Management for Nurses", "leadership_priority"],
  ["shift-planning-workflow-nclex-rn", "Shift Planning and Workflow", "leadership_priority"],
  ["charge-nurse-responsibilities-nclex-rn", "Charge Nurse Responsibilities", "leadership_priority"],
  ["team-communication-leadership-nclex-rn", "Team Communication and Leadership", "communication"],
  ["conflict-resolution-healthcare-nclex-rn", "Conflict Resolution in Healthcare", "communication"],
  ["chain-of-command-nclex-rn", "Chain of Command", "communication"],
  ["sbar-communication-tools-nclex-rn", "SBAR and Communication Tools", "communication"],
  ["documentation-legal-accountability-nclex-rn", "Documentation and Legal Accountability", "legal_ethics"],
  ["informed-consent-nurse-responsibility-nclex-rn", "Informed Consent and Nurse Responsibility", "legal_ethics"],
  ["incident-reporting-vs-charting-nclex-rn", "Incident Reporting vs Charting", "legal_ethics"],
  ["patient-advocacy-practice-nclex-rn", "Patient Advocacy in Practice", "legal_ethics"],
  ["ethical-principles-nursing-nclex-rn", "Ethical Principles (Autonomy, Beneficence, Justice, Nonmaleficence)", "legal_ethics"],
  ["moral-distress-burnout-nclex-rn", "Moral Distress and Burnout", "legal_ethics"],
  ["workplace-safety-nurse-protection-nclex-rn", "Workplace Safety and Nurse Protection", "legal_ethics"],
  ["handling-unsafe-orders-nclex-rn", "Handling Unsafe Orders", "legal_ethics"],
  ["refusal-of-assignment-nclex-rn", "Refusal of Assignment", "legal_ethics"],
  ["interprofessional-collaboration-nclex-rn", "Interprofessional Collaboration", "communication"],
  ["cultural-competence-leadership-nclex-rn", "Cultural Competence in Leadership", "communication"],
  ["delegation-emergency-situations-nclex-rn", "Delegation in Emergency Situations", "delegation"],
  ["disaster-leadership-triage-nclex-rn", "Disaster Leadership and Triage Roles", "leadership_priority"],
  ["quality-improvement-patient-safety-nclex-rn", "Quality Improvement and Patient Safety", "qi_safety"],
  ["root-cause-analysis-basics-nclex-rn", "Root Cause Analysis Basics", "qi_safety"],
  ["which-task-delegated-nclex-rn", "Which Task Can Be Delegated?", "leadership_priority"],
  ["which-patient-see-first-leadership-nclex-rn", "Which Patient Should You See First?", "leadership_priority"],
  ["leadership-prioritization-first-action-nclex-rn", "What Do You Do First? Leadership Prioritization", "leadership_priority"],
  ["ngn-leadership-delegation-case-studies-nclex-rn", "NGN Leadership & Delegation Case Studies", "leadership_priority"],
];

function bodies(slug, title, flavor) {
  const isDelegation = flavor === "delegation";
  const isCommunication = flavor === "communication";
  const isLegal = flavor === "legal_ethics";
  const isQi = flavor === "qi_safety";
  const isPriority = flavor === "leadership_priority";

  let meaning = `**${title}** supports NCLEX-RN **management of care** and **safety**: you match **scope**, **acuity**, and **supervision** to every decision, escalate **unsafe orders** through proper channels, and document **facts** clearly. Canadian stems may reference **provincial college** language and **interprofessional** norms; US items test the same **NCSBN-style delegation** and **prioritization** rules.\n\nBoards reward **accountability**—the RN remains responsible for **delegated** outcomes—and **first actions** that protect **unstable** clients before **routine** tasks.\n\nLink ${ASSIGN}, ${LEGAL}, ${QI}, ${ETHICAL}, and ${HUB}.`;

  if (isDelegation) {
    meaning = `**${title}** applies **delegation and assignment** rules: **five rights** (task, circumstance, person, direction/communication, supervision/evaluation), **stable vs unstable** clients, and **RN vs RPN/LPN vs UAP** boundaries per the stem and policy framing. NCLEX punishes **delegating assessment**, **judgment**, or **unstable** care to the wrong role.\n\nAnchor with ${ASSIGN}, ${LEGAL}, ${QI}, and ${HUB}.`;
  }
  if (isCommunication) {
    meaning = `**${title}** strengthens **therapeutic and interprofessional communication**: **SBAR** for urgent handoffs, **chain of command** when immediate managers are unavailable, **constructive** conflict resolution, and **cultural humility** in leadership moments. Items often pit **clarify orders** vs **silent non-compliance**—choose **assertive escalation** that preserves **safety**.\n\nUse ${ASSIGN}, ${ETHICAL}, ${LEGAL}, ${HUB}.`;
  }
  if (isLegal) {
    meaning = `**${title}** ties **legal and ethical accountability** to nursing practice: **documentation** as a communication and legal record, **informed consent** nursing duties (witness vs explainer per policy), **incident/variance reporting** separate from the **chart**, **advocacy**, and **refusal** of **unsafe** assignments with **good faith** follow-up. Expect **moral distress** themes without abandoning **duty to patient**.\n\nConnect ${LEGAL}, ${QI}, ${ETHICAL}, ${ASSIGN}, ${HUB}.`;
  }
  if (isQi) {
    meaning = `**${title}** frames **quality improvement** and **patient safety** systems: **near-miss** and **event** reporting for learning, **RCA** basics as **systems** thinking (not blame charts in the patient record), and **metrics** that drive safer workflows. NCLEX rewards **reporting through channels** and **fixing processes** alongside **immediate bedside** fixes when harm is imminent.\n\nPair ${QI}, ${LEGAL}, ${ASSIGN}, ${HUB}.`;
  }
  if (isPriority) {
    meaning = `**${title}** trains **prioritization** across **multiple patients and tasks**: **Maslow** and **acute vs chronic** framing, **charge** role boundaries, **time management** that does not trade away **assessment**, and **disaster/triage** role clarity when the stem overloads you with options. Pick the **highest risk** client or **scope-correct** action first.\n\nAnchor with ${ASSIGN}, ${QI}, ${ETHICAL}, ${HUB}.`;
  }

  let exam = `Examiners use **first**, **priority**, **best assignment**, and **which task** language. Eliminate answers that **violate scope**, **skip supervision**, or **delay** unstable assessment for **charting** or **convenience**.`;

  if (isDelegation) exam += ` Watch **UAP** traps: **data collection** may be delegable; **interpretation** is not.`;
  if (isCommunication) exam += ` **SBAR** and **escalation** beat **venting** or **chart-only** complaints when safety is at stake.`;
  if (isLegal) exam += ` **Incident report** vs **nursing note** distinction is high yield.`;
  if (isQi) exam += ` **Systems improvement** coexists with **immediate** harm prevention.`;
  if (isPriority) exam += ` **Unstable vitals** or **airway** beats **discharge teaching** every time.`;

  let core = `- **Learning objectives:** apply **five rights**; protect **unstable** clients; use **chain of command** appropriately.\n- **Nursing priorities:** **assess → delegate appropriate tasks → supervise → evaluate**; **document** objectively.\n- **Red flags / safety:** **unsafe orders** without clarification; **abandonment**; **intimidation** that blocks escalation.\n- **Patient teaching:** clear roles of **care team**; when to **call the nurse** for changes.\n- **Clinical reasoning:** if delegation **masks** deterioration risk, **retain** the task or **see the patient first**.`;

  if (isDelegation)
    core = `- **Five rights:** task, circumstance, person, direction/communication, supervision/evaluation.\n- **RN retains:** assessment synthesis, diagnosis/planning (NCLEX framing), **unstable** client oversight, **teaching** that requires evaluation.\n- **RPN/LPN:** stem-dependent tasks within **license** and **facility** policy—often **stable** clients with **predictable** outcomes.\n- **UAP:** ADLs, **routine** vitals on **stable** clients, transport, stocking—**never** independent **clinical judgment**.\n- **Assignment:** match **acuity + competency**; **float** support per policy—not **dumping** unstable workloads.`;
  if (isCommunication)
    core = `- **SBAR:** situation, background, assessment, recommendation—**concise** urgent communication.\n- **Conflict:** focus on **patient safety** and **policy**; involve **charge** or **risk** channels when needed.\n- **Chain of command:** **nurse → charge → supervisor → provider** as the item frames—**not** skipping steps without justification.\n- **Diversity:** **cultural humility**, **interpreter** access, **avoid assumptions** about consent comprehension.\n- **Team leadership:** **closed-loop** communication, **read-backs** for critical values.`;
  if (isLegal)
    core = `- **Documentation:** timely, **objective**, **legible** (EHR standards), **quotes** patient statements when relevant.\n- **Consent:** confirm **understanding** and **voluntariness**; nursing role is often **witness** per policy—not **coercing** signature.\n- **Incident vs chart:** **variance** reports for **system learning**; chart the **care** and **assessment**—avoid **blame** language in the legal chart.\n- **Unsafe orders:** **clarify** with provider; **escalate** if unresolved; **refuse** and **notify chain** when **harm** is imminent per policy.\n- **Assignment refusal:** **good faith** concern, **document**, **stay until relief** where policy requires—**not** patient abandonment.`;
  if (isQi)
    core = `- **QI:** PDSA-style cycles in vignettes—**small tests of change**, **measure**, **adjust**.\n- **RCA:** **systems factors** (communication, staffing, equipment) vs **individual blame** in the **meeting** stem—not a substitute for **immediate** bedside rescue.\n- **Reporting culture:** **near misses** reported to prevent **next** harm.\n- **Patient safety:** **stop the line** themes when **triple check** or **policy** demands it.\n- **Metrics:** run charts and **benchmarks** as background—**nursing action** still follows **clinical priority**.`;
  if (isPriority)
    core = `- **See first:** **airway**, **perfusion**, **neuro decline**, **bleeding**, **suicidal ideation**—per stem cues.\n- **Charge nurse:** **staffing** advocacy, **bed** flow, **support** for **novice** nurses—not **independent** practice outside **scope**.\n- **Time management:** **cluster** when safe; **never** cluster away from **unstable** reassessment.\n- **Disaster/triage:** **START**-style **tags** as item presents—**expectant** only when **resources** and **survival** probability match the frame.\n- **NGN:** pick **one best** row/column—**highest risk** + **legal** + **scope** alignment.`;

  let scenario = `**Patient vignette.** During a busy shift tied to **${title}**, a **UAP** reports that a previously **stable** client now has **new confusion** and **tachypnea**. You still owe **routine** meds on two other clients.\n\n**Fork:** **You** perform a **focused RN assessment** first, **activate** help per policy, and **notify the provider** with **SBAR** if red flags match—**do not** delegate **assessment** of **new instability** to the UAP while you **finish routines**.`;

  if (isCommunication)
    scenario = `**Patient vignette.** A **provider** verbally orders a **double dose** of a **high-alert** medication that conflicts with the **MAR**. The provider is **rushed** and says “just give it.”\n\n**Fork:** **Closed-loop clarification** and **chain of command** if needed—**do not** administer while **uncertain**. Document the **interaction** per policy after **safety** is secured.`;
  if (isLegal)
    scenario = `**Patient vignette.** You witness a **near miss** (wrong-line almost connected). **No harm** occurred, but **process** broke down.\n\n**Fork:** **Immediate patient check** if any risk, then **incident/variance report** per **facility** policy **and** factual charting of **assessment**—avoid **blaming** peers in the **legal** record; use **QI** channels for **systems** follow-up.`;
  if (isQi)
    scenario = `**Patient vignette.** After **two** similar **falls** on the unit in a week, leadership opens a **safety huddle**.\n\n**Fork:** Contribute **objective data**, **trends**, and **non-punitive** improvement ideas—support **RCA** themes when the stem asks for **system** vs **individual** focus while **bedside** prevention continues.`;
  if (isPriority)
    scenario = `**Patient vignette.** Four clients: (A) **MAP 58** with **new** agitation post-op, (B) **stable** **discharge teaching** request, (C) **routine** **dressing** supply restock, (D) **call light** for **pain 2/10** chronic.\n\n**Fork:** **See Client A first**—**perfusion/mentation** risk—then **D**, **B**, **C** unless the stem reframes **safety** (e.g., **suicidal** ideation would trump).`;

  const takeaways = `- **Delegation** never removes **RN accountability** for **appropriate** supervision and **outcomes**.\n- **Communication + documentation** are **safety tools**, not paperwork sidesteps.\n- **Synthesis:** when in doubt, **assess the unstable** client and **escalate** through **policy-aligned** channels.\n\n**Related:** ${ASSIGN} · ${LEGAL} · ${QI} · ${HUB}.`;

  return { meaning, exam, core, scenario, takeaways };
}

function quizPair(title) {
  return {
    preTest: [
      {
        question: `For ${title}, which choice best reflects safe NCLEX-RN leadership judgment?`,
        options: [
          "Delegate a focused assessment of new chest pain to the UAP while you finish charting",
          "Perform the RN assessment first, delegate only stable routine tasks, and escalate abnormal findings per policy",
          "Ignore chain of command and post concerns only on social media",
          "Document blame against a colleague in the medical record",
        ],
        correct: 1,
        rationale:
          "Assessment of new or unstable findings stays with the RN; UAP roles support routine tasks under clear direction and supervision when circumstances are appropriate.",
      },
      {
        question: `Which statement about accountability in ${title} is most accurate?`,
        options: [
          "The RN is not responsible once a task is delegated",
          "The delegating nurse retains accountability for appropriate delegation, direction, supervision, and follow-up",
          "Incident reports replace the need for factual nursing documentation",
          "Refusal of any assignment is always abandonment",
        ],
        correct: 1,
        rationale:
          "Delegation transfers performance of a task, not professional accountability for safe delegation, communication, and evaluation.",
      },
    ],
    postTest: [
      {
        question: `Which situation most urgently requires you to intervene before other tasks in ${title}?`,
        options: [
          "A stable client requests an extra blanket",
          "A client with new hypotension, confusion, and suspected hemorrhage",
          "A coworker asks to swap a break time",
          "Stocking supplies at the desk",
        ],
        correct: 1,
        rationale:
          "Acute instability and potential life threat take priority over comfort, scheduling, or non-urgent tasks.",
      },
      {
        question: `When is detailed patient teaching about ${title} most appropriate?`,
        options: [
          "During active hemodynamic instability",
          "After stabilization when the client is alert and able to participate",
          "Only after discharge without follow-up",
          "Before any safety assessment to save time",
        ],
        correct: 1,
        rationale:
          "Education is most effective and ethical after immediate threats are addressed and the patient can engage.",
      },
    ],
  };
}

function buildLesson(slug, title, flavor) {
  const { meaning, exam, core, scenario, takeaways } = bodies(slug, title, flavor);
  return {
    slug,
    title,
    topic: "Leadership & Delegation",
    topicSlug: "leadership",
    bodySystem: "General",
    system: "leadership-delegation",
    previewSectionCount: 1,
    seoTitle: `${title} | NCLEX-RN | NurseNest`,
    seoDescription: `NCLEX-RN leadership & delegation review: ${title} — scope, prioritization, communication, legal accountability, QI, Canada- and US-aligned clinical judgment.`,
    relatedLessonRefs: [
      { slug: "assignment-vs-delegation", titleHint: "Assignment vs delegation" },
      { slug: "legal-nurse-practice-act", titleHint: "Nurse Practice Act" },
    ],
    sections: [
      { id: "clinical_meaning", heading: "Clinical meaning", kind: "clinical_meaning", body: meaning },
      { id: "exam_relevance", heading: "Exam relevance", kind: "exam_relevance", body: exam },
      { id: "core_concept", heading: "Core concept", kind: "core_concept", body: core },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: scenario },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: takeaways },
    ],
    ...quizPair(title),
  };
}

const lessons = META.map(([slug, title, flavor]) => buildLesson(slug, title, flavor));
const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "scripts/generate-rn-leadership-delegation-expansion-catalog.mjs",
  pathways: {
    "ca-rn-nclex-rn": lessons,
    "us-rn-nclex-rn": JSON.parse(JSON.stringify(lessons)),
  },
};

writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log("Wrote", outPath, "lessons:", lessons.length);
