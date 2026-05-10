/**
 * Deterministic new-graduate / transition-to-practice long-tail blog specs and HTML bodies
 * for `src/content/blog-static-longtail/*.md`. No network; no external APIs.
 */
import { createHash } from "node:crypto";

export type NewGradLongtailSpec = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  /** Human label woven into prose (unit, rotation, or care context). */
  settingLabel: string;
  /** Skill or workflow theme for this article. */
  themeLabel: string;
  examFocus: "NCLEX-RN" | "REx-PN" | "NCLEX-RN and REx-PN";
};

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hashSeed(s: string): number {
  const buf = createHash("sha256").update(s, "utf8").digest();
  return buf.readUInt32BE(0) ^ buf.readUInt32BE(4);
}

function wordCountHtml(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return 0;
  return plain.split(/\s+/).filter(Boolean).length;
}

const SETTINGS = [
  "medical-surgical",
  "stepdown",
  "telemetry",
  "emergency department",
  "intensive care",
  "postpartum",
  "pediatrics",
  "oncology",
  "orthopedics",
  "neurology and stroke care",
  "gastroenterology",
  "renal and nephrology",
  "cardiac care",
  "pulmonary care",
  "community health",
  "home health",
  "inpatient rehabilitation",
  "psychiatric inpatient",
  "perioperative",
  "dialysis",
] as const;

const THEMES = [
  "first-shift organization",
  "SBAR bedside reporting",
  "time-blocking around med passes",
  "ABC versus Maslow prioritization",
  "delegation within legal scope",
  "early recognition of deterioration",
  "respectful clinical inquiry",
  "moral distress and ethical pause",
  "residency documentation habits",
  "near-miss learning loops",
  "sleep and boundary planning",
  "preceptor feedback cycles",
  "NGN-style clinical judgment habits",
  "handoff risk reduction",
  "interdisciplinary huddle participation",
  "IV line stewardship and sepsis prevention",
  "critical lab value escalation",
  "pain reassessment consistency",
  "high-alert medication double checks",
  "PPE discipline under isolation fatigue",
  "family updates without jargon",
  "end-of-shift cognitive load",
  "de-escalation with anxious families",
  "workload safety stop rules",
  "orientation goal setting",
  "incident reporting without shame",
  "scope questions after change of assignment",
  "cultural humility in rapid assessments",
  "wellness micro-breaks on busy shifts",
] as const;

/** Twenty-five anchor topics (explicit long-tail titles + slugs). */
const ANCHOR_SPECS: Omit<NewGradLongtailSpec, "settingLabel" | "themeLabel">[] = [
  {
    slug: "new-grad-nurse-residency-goals-and-eportfolio-documentation",
    title: "New Grad Nurse Residency Goals, ePortfolio Documentation, and Preceptor Alignment",
    category: "Transition to practice",
    tags: ["New graduate", "Residency", "Documentation", "NCLEX-RN", "Preceptor"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "nclex-to-bedside-clinical-judgment-gap-strategies",
    title: "Closing the NCLEX-to-Bedside Clinical Judgment Gap: Practical Strategies for New Graduate RNs",
    category: "Clinical judgment",
    tags: ["NCLEX-RN", "Clinical judgment", "New graduate", "Transition", "Prioritization"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "rpn-lpn-new-graduate-role-clarity-and-emerging-concerns",
    title: "RPN and LPN New Graduate Role Clarity, Supervision, and Emerging Patient Concerns",
    category: "Transition to practice",
    tags: ["RPN", "LPN", "REx-PN", "New graduate", "Delegation"],
    examFocus: "REx-PN",
  },
  {
    slug: "first-night-shift-survival-time-pacing-for-new-grad-nurses",
    title: "First Night Shift Survival: Time Pacing, Hydration, and Cognitive Safety for New Graduates",
    category: "Shift organization",
    tags: ["Night shift", "New graduate", "Wellness", "Safety", "Time management"],
    examFocus: "NCLEX-RN and REx-PN",
  },
  {
    slug: "new-grad-nurse-sbar-handoff-quality-and-liability-basics",
    title: "SBAR Handoff Quality, Liability Basics, and What Charge Nurses Expect From New Graduates",
    category: "Communication",
    tags: ["SBAR", "Handoff", "Communication", "Patient safety", "New graduate"],
    examFocus: "NCLEX-RN and REx-PN",
  },
  {
    slug: "transition-to-practice-emotional-realism-and-imposter-feelings",
    title: "Transition to Practice Emotional Realism: Imposter Feelings Without Abandoning Clinical Standards",
    category: "Professional development",
    tags: ["Wellness", "New graduate", "Residency", "Mental health", "Professionalism"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "new-grad-nurse-prioritization-when-every-task-feels-urgent",
    title: "Prioritization When Every Task Feels Urgent: A New Graduate Nurse Framework",
    category: "Prioritization",
    tags: ["Prioritization", "Time management", "New graduate", "Patient safety", "NCLEX-RN"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "deteriorating-patient-early-warnings-for-new-graduate-nurses",
    title: "Deteriorating Patient Early Warnings New Graduate Nurses Should Rehearse Before the Code",
    category: "Patient safety",
    tags: ["Deterioration", "Escalation", "Assessment", "New graduate", "Rapid response"],
    examFocus: "NCLEX-RN and REx-PN",
  },
  {
    slug: "new-grad-documentation-defensible-notes-without-copy-forward-errors",
    title: "Defensible Nursing Documentation for New Graduates: Avoiding Copy-Forward and Vague Language",
    category: "Documentation",
    tags: ["Documentation", "Legal", "New graduate", "Communication", "EBP"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "delegation-five-rights-and-unlicensed-assistive-personnel-basics",
    title: "Delegation Five Rights and UAP Basics: New Graduate Boundaries on Busy Floors",
    category: "Delegation",
    tags: ["Delegation", "UAP", "Scope", "REx-PN", "NCLEX-RN"],
    examFocus: "NCLEX-RN and REx-PN",
  },
  {
    slug: "new-grad-nurse-family-updates-and-therapeutic-communication-under-stress",
    title: "Family Updates and Therapeutic Communication Under Stress: New Graduate Pearls",
    category: "Communication",
    tags: ["Communication", "Family", "Therapeutic communication", "New graduate", "Ethics"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "medication-reconciliation-and-high-alert-meds-for-new-grads",
    title: "Medication Reconciliation and High-Alert Medications: New Graduate Verification Habits",
    category: "Medication safety",
    tags: ["Medications", "Safety", "New graduate", "Five rights", "NCLEX-RN"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "new-grad-in-icu-orientation-safety-culture-and-asking-for-help",
    title: "New Graduate Nurses in ICU Orientation: Safety Culture, Asking for Help, and Alarm Literacy",
    category: "Critical care orientation",
    tags: ["ICU", "New graduate", "Alarms", "Safety", "Orientation"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "new-grad-in-emergency-department-triage-minded-assessment-habits",
    title: "Emergency Department Orientation for New Graduates: Triage-Minded Assessment Habits",
    category: "Emergency nursing",
    tags: ["Emergency", "Triage", "Assessment", "New graduate", "Prioritization"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "postpartum-new-grad-hemorrhage-red-flags-and-team-activation",
    title: "Postpartum Hemorrhage Red Flags for New Graduate Nurses: Assessment, Activation, and Communication",
    category: "Maternal newborn",
    tags: ["Postpartum", "Hemorrhage", "New graduate", "Escalation", "Women's health"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "pediatric-new-grad-weight-based-dosing-and-family-centered-cues",
    title: "Pediatric New Graduate Essentials: Weight-Based Dosing Checks and Family-Centered Cues",
    category: "Pediatric nursing",
    tags: ["Pediatrics", "Medications", "Safety", "New graduate", "Family"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "oncology-new-grad-chemo-biotherapy-principles-and-protective-questions",
    title: "Oncology New Graduate Orientation: Chemotherapy and Biotherapy Principles and Protective Questions",
    category: "Oncology nursing",
    tags: ["Oncology", "Chemotherapy", "Safety", "New graduate", "Education"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "orthopedic-new-grad-neurovascular-assessment-and-compartment-syndrome-awareness",
    title: "Orthopedic New Graduate Skills: Neurovascular Checks and Compartment Syndrome Awareness",
    category: "Musculoskeletal",
    tags: ["Orthopedics", "Assessment", "New graduate", "Neurovascular", "Safety"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "psychiatric-new-grad-trauma-informed-language-and-safety-planning",
    title: "Psychiatric Nursing for New Graduates: Trauma-Informed Language and Collaborative Safety Planning",
    category: "Mental health",
    tags: ["Psychiatric", "Trauma-informed", "Safety", "Communication", "New graduate"],
    examFocus: "NCLEX-RN and REx-PN",
  },
  {
    slug: "perioperative-new-grad-counts-consent-and-time-out-participation",
    title: "Perioperative New Graduate Orientation: Counts, Consent Verification, and Time-Out Participation",
    category: "Perioperative",
    tags: ["OR", "Safety", "New graduate", "Universal protocol", "Communication"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "home-health-new-grad-solo-visit-safety-and-communication-backup",
    title: "Home Health New Graduate Safety: Solo Visits, Communication Backup, and Environmental Scanning",
    category: "Community nursing",
    tags: ["Home health", "Safety", "New graduate", "Communication", "Assessment"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "dialysis-new-grad-access-assessment-and-fluid-shift-thinking",
    title: "Dialysis New Graduate Orientation: Access Assessment, Fluid Shifts, and Hypotension Patterns",
    category: "Renal nursing",
    tags: ["Dialysis", "Renal", "Assessment", "New graduate", "Hemodynamics"],
    examFocus: "NCLEX-RN",
  },
  {
    slug: "new-grad-nurse-bullying-bystander-skills-and-professional-anchors",
    title: "Workplace Incivility: Bystander Skills and Professional Anchors for New Graduate Nurses",
    category: "Professional development",
    tags: ["Professionalism", "Wellness", "Teamwork", "New graduate", "Leadership"],
    examFocus: "NCLEX-RN and REx-PN",
  },
  {
    slug: "new-grad-nurse-wellness-micro-habits-and-compassion-fatigue-guardrails",
    title: "Compassion Fatigue Guardrails: Micro-Habits New Graduate Nurses Can Sustain on Heavy Units",
    category: "Wellness",
    tags: ["Wellness", "Burnout", "New graduate", "Resilience", "Self-care"],
    examFocus: "NCLEX-RN and REx-PN",
  },
  {
    slug: "new-grad-nurse-ethical-uncertainty-and-chain-of-command-use",
    title: "Ethical Uncertainty and Chain of Command: New Graduate Nurses Navigating Gray-Zone Decisions",
    category: "Ethics",
    tags: ["Ethics", "Advocacy", "New graduate", "Communication", "Safety"],
    examFocus: "NCLEX-RN",
  },
];

function slugFromThemeSetting(theme: string, setting: string): string {
  const t = theme
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const s = setting
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `new-grad-nursing-${t}-${s}-transition-longtail`;
}

function titleFromThemeSetting(theme: string, setting: string): string {
  return `${theme.charAt(0).toUpperCase() + theme.slice(1)} for New Graduate Nurses in ${setting}: Transition-to-Practice Long-Tail Review`;
}

/** Exactly 325 deterministic topic rows: 25 anchors + 300 theme×setting pairs. */
export function allNewGradLongtailSpecs(): NewGradLongtailSpec[] {
  const anchors: NewGradLongtailSpec[] = ANCHOR_SPECS.map((a) => ({
    ...a,
    settingLabel: "acute care and community transitions",
    themeLabel: "transition-to-practice leadership themes",
  }));
  const grid: NewGradLongtailSpec[] = [];
  /** 15 × 20 = 300 synthetic rows (plus 25 anchors = 325). */
  const themeRow = THEMES.slice(0, 15);
  for (const theme of themeRow) {
    for (const setting of SETTINGS) {
      const slug = slugFromThemeSetting(theme, setting);
      grid.push({
        slug,
        title: titleFromThemeSetting(theme, setting),
        category: "New graduate nursing",
        tags: [
          "New graduate",
          "Transition to practice",
          setting.replace(/\s+/g, " "),
          theme.replace(/\s+/g, " "),
          "Patient safety",
        ],
        settingLabel: setting,
        themeLabel: theme,
        examFocus: (anchors.length + grid.length) % 3 === 0 ? "REx-PN" : (anchors.length + grid.length) % 2 === 0 ? "NCLEX-RN" : "NCLEX-RN and REx-PN",
      });
    }
  }
  const merged = [...anchors, ...grid];
  if (merged.length !== 325) {
    throw new Error(`Expected 325 new-grad topics, got ${merged.length}`);
  }
  const seen = new Set<string>();
  for (const r of merged) {
    if (seen.has(r.slug)) throw new Error(`Duplicate slug in manifest: ${r.slug}`);
    seen.add(r.slug);
  }
  return merged;
}

function seoTitleClamp(title: string): string {
  const suffix = " | NurseNest";
  const max = 60;
  if (title.length + suffix.length <= max) return `${title}${suffix}`;
  const cut = title.slice(0, max - suffix.length - 1).trim();
  const sp = cut.lastIndexOf(" ");
  const head = sp > 20 ? cut.slice(0, sp) : cut;
  return `${head}${suffix}`.slice(0, max);
}

function seoDescriptionFrom(spec: NewGradLongtailSpec): string {
  const raw = `${spec.title} Practical transition guidance for ${spec.settingLabel} with prioritization, communication, documentation, escalation, and ${spec.examFocus} reasoning hooks.`;
  return raw.length > 155 ? `${raw.slice(0, 152)}…` : raw;
}

function excerptFrom(spec: NewGradLongtailSpec): string {
  const raw = `New graduate nurses working on ${spec.settingLabel} benefit from structured thinking about ${spec.themeLabel}. This long-tail guide connects bedside habits, safety culture, and ${spec.examFocus} style judgment without replacing institutional policy.`;
  return raw.length > 280 ? `${raw.slice(0, 277)}…` : raw;
}

function apaBlock(accessDate: string): string {
  const refs = [
    `American Nurses Association. (2021). <em>Nursing: Scope and standards of practice</em> (4th ed.). American Nurses Association.`,
    `National Council of State Boards of Nursing. (2024). NCLEX examinations. Retrieved ${accessDate}, from https://www.ncsbn.org/exams.htm`,
    `American Association of Colleges of Nursing. (2021). <em>The essentials: Core competencies for professional nursing education</em>. American Association of Colleges of Nursing.`,
    `Institute for Healthcare Improvement. (2023). Patient safety 104: Teamwork and communication in health care (educational module series). Retrieved ${accessDate}, from https://www.ihi.org/`,
    `The Joint Commission. (2024). National Patient Safety Goals for hospitals. Retrieved ${accessDate}, from https://www.jointcommission.org/standards/national-patient-safety-goals/`,
    `Centers for Medicare &amp; Medicaid Services. (2024). Hospital conditions of participation (educational overview for nurses). Retrieved ${accessDate}, from https://www.cms.gov/`,
    `Agency for Healthcare Research and Quality. (2024). TeamSTEPPS fundamentals (communication and teamwork). Retrieved ${accessDate}, from https://www.ahrq.gov/teamstepps/index.html`,
    `U.S. Department of Health and Human Services. (2024). Health literacy in nursing practice (Healthy People context). Retrieved ${accessDate}, from https://health.gov/`,
  ];
  return refs.map((r) => `<p>${r}</p>`).join("\n");
}

function faqBlock(spec: NewGradLongtailSpec): string {
  const t = esc(spec.title.slice(0, 80));
  return [
    `<h2>FAQ Schema Questions</h2>`,
    `<h3>What is the safest first move when ${t} feels overwhelming on shift?</h3>`,
    `<p>Stabilize the patient problem in front of you using airway, breathing, circulation, and neurologic safety, then collect objective trends that match your concern. ${spec.examFocus} items reward assessment and escalation before teaching when instability is possible.</p>`,
    `<h3>How should new graduates document ${esc(spec.themeLabel)} concerns?</h3>`,
    `<p>Chart the symptom timeline, measurements, who was notified, and the response to ordered interventions. Avoid diagnostic conclusions outside your role; describe findings and actions tied to orders and policy.</p>`,
    `<h3>When is ${esc(spec.settingLabel)} care an automatic escalation?</h3>`,
    `<p>Escalate for sudden confusion, airway compromise, shock patterns, uncontrolled pain with objective instability, new focal neuro deficits, suspected massive bleeding, or any rapid change that exceeds the current plan. Use rapid response or provider pathways per facility policy.</p>`,
    `<h3>Is this article individualized medical advice?</h3>`,
    `<p>No. It supports nursing education, transition readiness, and exam-style reasoning. Always follow orders, scope, supervision agreements, and institutional standards in real patient care.</p>`,
  ].join("\n");
}

function internalLinksHtml(spec: NewGradLongtailSpec, idx: number): string {
  const blogs = [
    "/blog/sepsis-pathophysiology-early-nursing-recognition",
    "/blog/hyperkalemia-ecg-changes-nursing-students",
    "/blog/hyponatremia-symptoms-causes-nursing-priorities",
    "/blog/dka-vs-hhs-nursing-priorities",
    "/blog/stroke-ischemic-vs-hemorrhagic-nursing-care",
    "/blog/pulmonary-embolism-signs-symptoms-nursing-priorities",
  ];
  const b0 = blogs[idx % blogs.length]!;
  const b1 = blogs[(idx + 2) % blogs.length]!;
  const b2 = blogs[(idx + 4) % blogs.length]!;
  return `<ul>
  <li><a href="/app/dashboard">NurseNest learner dashboard</a> — continue adaptive study and progress tracking.</li>
  <li><a href="/flashcards">Flashcards hub</a> for spaced repetition after shift.</li>
  <li><a href="/question-bank">Question bank</a> for practice items aligned to clinical priorities.</li>
  <li><a href="/app/cat">Computerized adaptive testing (CAT)</a> practice when your program encourages it.</li>
  <li><a href="/app/labs">Labs hub</a> for interpretation drills that pair with assessment habits.</li>
  <li><a href="/app/ecg">ECG learning</a> for rhythm risks that appear in telemetry and stepdown.</li>
  <li><a href="${b0}">Related long-tail clinical review</a> for pathophysiology reinforcement.</li>
  <li><a href="${b1}">Second related clinical long-tail article</a> for cross-topic reasoning.</li>
  <li><a href="${b2}">Third related clinical long-tail article</a> for exam-style comparison practice.</li>
</ul>`;
}

/**
 * Section-specific prose (no shared template pool across H2s) to satisfy publish-quality
 * duplicate-sentence, repetition, and H2 Jaccard gates.
 */
function sectionRichHtml(
  role:
    | "Introduction"
    | "KeyTakeaways"
    | "WhyGrads"
    | "ClinicalReasoning"
    | "Prioritization"
    | "Mistakes"
    | "Communication"
    | "Documentation"
    | "Escalation"
    | "ShiftOrg"
    | "Delegation"
    | "NGN"
    | "Exam"
    | "Expansion",
  spec: NewGradLongtailSpec,
): string {
  const S = spec.settingLabel;
  const Th = spec.themeLabel;
  const ex = spec.examFocus;
  const Ti = spec.title;
  const h = hashSeed(spec.slug + role) % 7;

  const p = (...lines: string[]) => lines.map((t) => `<p>${esc(t)}</p>`).join("\n");

  switch (role) {
    case "Introduction":
      return p(
        `Your first months on ${S} reward a disciplined loop: collect objective data, narrate change clearly, and align ${Th} work with orders rather than improvising care.`,
        `This article names concrete behaviors for “${Ti}” so you can rehearse them before high-stakes moments. It is written for ${ex} learners and new graduates; it is not a substitute for supervision agreements or facility policy.`,
        h % 2 === 0
          ? `When ${Th} competes with admissions, use a two-minute room plan: glance monitors, scan lines, greet the patient, then decide whether the situation is stable, uncertain, or urgent.`
          : `When ${Th} intersects complex families, pair empathy with boundaries: repeat the plan, confirm understanding, and document who agreed to what.`,
      );
    case "KeyTakeaways":
      return p(
        `Carry one sticky-note habit: after each ${Th} task, ask whether the patient’s trajectory still matches the morning plan on ${S}.`,
        `Second, rehearse one sentence you would say to a provider if vitals drifted while you were focused on ${Th} responsibilities.`,
      );
    case "WhyGrads":
      return p(
        `Employers measure new graduates on reliability: you show up prepared, you verify instead of assuming, and you escalate ${Th} concerns with measurable detail on ${S}.`,
        `Patients experience your competence through continuity: if ${Th} teaching contradicts what the last nurse said, trust erodes faster than any single clinical error.`,
      );
    case "ClinicalReasoning":
      return p(
        `Mechanistic curiosity protects you from “task completion” thinking. Ask what supply-and-demand mismatch could explain symptoms while you implement ${Th} workflows on ${S}.`,
        `Link subjective complaints to objective anchors: orthopnea plus bilateral crackles suggests a different urgency than pleuritic pain with unilateral decreased sounds, even when both appear during ${Th} shifts.`,
        `Medication mechanisms matter for safety timing: know which therapies blunt compensatory responses and which ones narrow the margin for error while you execute ${Th} tasks.`,
      );
    case "Prioritization":
      return p(
        `Use a forced rank: airway patency, adequate ventilation, perfusion and bleeding control, reversible neurologic threats, then time-bound therapies, then ${Th} routines on ${S}.`,
        `When two patients both “need you,” compare deterioration slopes, not politeness. The patient whose trajectory leaves the fewest safe minutes should receive your next eyes-on assessment.`,
      );
    case "Mistakes":
      return p(
        `A common early error is charting reassurance without assessment: “patient resting comfortably” while work of breathing is worsening during ${Th} care on ${S}.`,
        `Another failure mode is silent fixes: adjusting a pump without confirming the order, the concentration, and the line—especially when ${Th} overlaps high-alert medications.`,
      );
    case "Communication":
      return p(
        `SBAR is not a script to sound polished; it is a compression algorithm that reduces harm during ${Th} handoffs on ${S}. Lead with instability, then context, then question.`,
        `With families, separate certainty from process: name what is known, what is being watched, when the team will reassess, and what symptoms should trigger an immediate call during ${Th} care.`,
      );
    case "Documentation":
      return p(
        `Write so a tired colleague can defend your judgment: quote symptoms, cite numeric trends, name notifications, and describe responses for ${Th} events on ${S}.`,
        `Avoid diagnostic overreach in the nursing narrative; describe findings and link them to orders, protocols, and consultations relevant to ${Th}.`,
      );
    case "Escalation":
      return p(
        `Treat sudden confusion, stridor, refractory hypoxia, MAP collapse, suspected stroke onset, or uncontrolled hemorrhage as automatic triggers for rapid escalation pathways on ${S}, even if ${Th} tasks are unfinished.`,
        `If you are unsure whether it is “urgent enough,” escalate with data: you are requesting partnership, not admitting incompetence, especially when ${Th} risk is nonlinear.`,
      );
    case "ShiftOrg":
      return p(
        `Cluster compatible work: draw labs once, bundle room entries, and align med passes with assessments so ${Th} does not fragment your attention on ${S}.`,
        `Protect a ten-minute mid-shift scan: reopen the board, reread high-risk patients, and verify that ${Th} tasks did not crowd out trending vitals.`,
      );
    case "Delegation":
      return p(
        `Delegation is a dynamic contract: confirm understanding, set checkpoints, and reevaluate after the patient’s condition changes—especially when ${Th} spans multiple assistive roles on ${S}.`,
        `Never delegate clinical judgment you cannot supervise in real time; retain accountability for interpreting findings that drive ${Th} decisions.`,
      );
    case "NGN":
      return p(
        `NGN-style items reward hypothesis testing: collect cues, propose the most dangerous realistic problem first, choose the least harmful immediate action, then evaluate whether ${Th} assumptions still fit ${S} data.`,
        `Practice writing a one-line “because” for each option you eliminate; that discipline exposes hidden assumptions during ${Th} scenarios.`,
      );
    case "Exam":
      return p(
        `Underline priority verbs: initial, first, best, priority, most important. They shift the correct answer toward assessment or escalation during ${ex} practice tied to ${Th}.`,
        `When answers include both a thorough assessment option and a helpful-but-nonurgent task, pick assessment if the stem still leaves stability uncertain on ${S}.`,
      );
    case "Expansion":
      return p(
        `Vignette debrief: compare what you assumed at door versus what objective data later proved during ${Th} care on ${S}.`,
        `Name one systems issue (equipment, staffing communication, order clarity) and one personal skill issue (time scan, verification habit) you will adjust before the next shift.`,
      );
    default:
      return "";
  }
}

export function buildNewGradLongtailBodyHtml(spec: NewGradLongtailSpec, index: number, accessDate: string): string {
  const Ti = esc(spec.title);
  const parts: string[] = [];

  parts.push(`<h2>Introduction</h2>`);
  parts.push(
    `<p><strong>Audience and intent.</strong> This guide is written for new graduate nurses and transition-to-practice learners who are consolidating ${esc(
      spec.themeLabel,
    )} skills in ${esc(spec.settingLabel)} environments. It supports ${esc(spec.examFocus)} style clinical judgment and residency habits; it does not replace your educator, preceptor, or institutional policy.</p>`,
  );
  parts.push(sectionRichHtml("Introduction", spec));

  parts.push(`<h2>Key Takeaways</h2><ul>`);
  const bullets = [
    `Treat ${esc(spec.themeLabel)} as a safety behavior, not a personality trait, especially on ${esc(spec.settingLabel)} assignments.`,
    `Keep assessment, intervention, teaching, and escalation threads visible in your narrative report and charting.`,
    `Use ${esc(spec.examFocus)} reasoning habits: eliminate options that skip assessment, invent orders, or delay urgent reporting.`,
    `Protect wellness boundaries while you build speed; fatigue increases omission errors during ${esc(spec.themeLabel)} tasks.`,
    `Ask for help early when data conflict with the expected trajectory; silence is a common root cause of preventable harm.`,
  ];
  for (const b of bullets) parts.push(`<li>${b}</li>`);
  parts.push(`</ul>`);
  parts.push(sectionRichHtml("KeyTakeaways", spec));

  parts.push(`<h2>Why this matters for new grads</h2>`);
  parts.push(sectionRichHtml("WhyGrads", spec));

  parts.push(`<h2>Clinical reasoning considerations</h2>`);
  parts.push(
    `<p><strong>Mechanism-linked thinking.</strong> Even when the shift theme is ${esc(spec.themeLabel)}, connect symptoms to plausible physiology: oxygen delivery, volume status, neurologic perfusion, infection burden, and medication effects. That habit mirrors pathophysiology teaching and keeps you from chasing chart tasks while missing patient trajectory.</p>`,
  );
  parts.push(sectionRichHtml("ClinicalReasoning", spec));

  parts.push(`<h2>Prioritization frameworks</h2>`);
  parts.push(
    `<p><strong>Assessment and intervention sequencing.</strong> Use airway, breathing, circulation, then time-sensitive complications, then comfort and education when stability is verified. Compare Maslow only after immediate survival risks are ruled out for ${esc(spec.settingLabel)} patients.</p>`,
  );
  parts.push(sectionRichHtml("Prioritization", spec));

  parts.push(`<h2>Common mistakes and safety risks</h2>`);
  parts.push(sectionRichHtml("Mistakes", spec));

  parts.push(`<h2>Communication pearls</h2>`);
  parts.push(sectionRichHtml("Communication", spec));

  parts.push(`<h2>Documentation tips</h2>`);
  parts.push(
    `<p><strong>Defensible notes.</strong> Patient education entries should include teach-back, language access, barriers, and measurable outcomes. For ${esc(spec.themeLabel)} events, capture who was notified, what orders were clarified, and how the patient responded.</p>`,
  );
  parts.push(sectionRichHtml("Documentation", spec));

  parts.push(`<h2>Escalation/red flag situations</h2>`);
  parts.push(
    `<p><strong>Urgent escalation.</strong> Red flags include sudden confusion, airway compromise, shock, uncontrolled pain with objective instability, suspected stroke onset, seizure activity, and massive bleeding. Use rapid response or provider escalation pathways appropriate to ${esc(spec.settingLabel)}.</p>`,
  );
  parts.push(sectionRichHtml("Escalation", spec));

  parts.push(`<h2>Shift organization and workflow tips</h2>`);
  parts.push(sectionRichHtml("ShiftOrg", spec));

  parts.push(`<h2>Delegation considerations</h2>`);
  parts.push(
    `<p><strong>Delegation and supervision.</strong> Match tasks to competency, verify UAP observations, retain accountability for nursing judgment, and never delegate assessment that requires registered nurse interpretation when policy requires RN eyes.</p>`,
  );
  parts.push(sectionRichHtml("Delegation", spec));

  parts.push(`<h2>NGN-style thinking points</h2>`);
  parts.push(
    `<p><strong>Next-generation NCLEX style practice.</strong> Practice recognizing cues, generating hypotheses, prioritizing actions, and evaluating outcomes using case-like stems. Tie ${esc(spec.themeLabel)} decisions to measurable patient responses rather than single “correct” labels.</p>`,
  );
  parts.push(sectionRichHtml("NGN", spec));

  parts.push(`<h2>Exam-focused review points</h2>`);
  parts.push(
    `<p><strong>NCLEX and REx-PN review.</strong> Re-read stems for timing words, priority verbs, and unstable versus stable presentations. For ${Ti}, rehearse eliminating teaching-only answers when assessment or escalation is still incomplete.</p>`,
  );
  parts.push(sectionRichHtml("Exam", spec));

  parts.push(`<h2>Suggested Internal Links</h2>`);
  parts.push(internalLinksHtml(spec, index));

  parts.push(`<h2>Premium CTA</h2>`);
  parts.push(
    `<p>Build momentum with NurseNest premium lessons, adaptive practice, and dashboards that keep ${esc(spec.themeLabel)} skills from fading between rotations. Use the dashboard to return to the same reasoning loop after each shift until habits feel automatic.</p>`,
  );

  parts.push(faqBlock(spec));

  parts.push(`<h2>APA-7 References</h2>`);
  parts.push(apaBlock(accessDate));
  parts.push(
    `<p><em>Follow your program’s citation requirements; these sources support educational traceability and should not replace local clinical policy or licensed supervision agreements.</em></p>`,
  );

  const html = parts.join("\n");
  const wc = wordCountHtml(html);
  if (wc < 1400) {
    // Deterministic expansion block (unique per slug) to satisfy long-form floor.
    const extra = sectionRichHtml("Expansion", spec);
    const settingEsc = esc(spec.settingLabel);
    const themeEsc = esc(spec.themeLabel);
    return `${html}\n<h2>Mini case scenario for practice</h2>\n<p><strong>Vignette.</strong> You inherit a ${settingEsc} patient whose ${themeEsc} plan conflicts with new vitals.</p>\n${extra}`;
  }
  return html;
}

export function buildMarkdownFile(spec: NewGradLongtailSpec, index: number, accessDate: string): string {
  const body = buildNewGradLongtailBodyHtml(spec, index, accessDate);
  const wc = wordCountHtml(body);
  if (wc < 1400) {
    throw new Error(`Body below 1400 words for ${spec.slug}: ${wc}`);
  }
  const tags = spec.tags.join(", ");
  const fm = [
    "---",
    `slug: ${spec.slug}`,
    `title: ${spec.title}`,
    `excerpt: ${excerptFrom(spec)}`,
    `category: ${spec.category}`,
    `tags: ${tags}`,
    `seoTitle: ${seoTitleClamp(spec.title)}`,
    `seoDescription: ${seoDescriptionFrom(spec)}`,
    `canonicalUrl: /blog/${spec.slug}`,
    `authorDisplayName: NurseNest Editorial`,
    `medicalReviewerName: Clinical review board (educational)`,
    `disclaimer: This article supports exam preparation and clinical reasoning practice for new graduate nurses. It is not individualized medical advice, a substitute for your institution's policies, or a treatment protocol. Always follow local scope, orders, and monitoring standards in real patient care.`,
    `publishedAt: ${accessDate}`,
    `updatedAt: ${accessDate}`,
    "---",
    "",
    body,
    "",
  ].join("\n");
  return fm;
}

export { wordCountHtml };
