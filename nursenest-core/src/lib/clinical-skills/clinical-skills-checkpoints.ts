import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { getClinicalSkillBySlug } from "@/lib/clinical-skills/clinical-skills-catalog";

export type ClinicalSkillCheckpoint = PathwayLessonQuizItem & { id: string };

type Q = { id: string; question: string; options: string[]; correct: number; rationale: string };

export const CLINICAL_SKILL_MIN_MCQ_COUNT = 7;

const BANK: Record<string, Q[]> = {
  "sterile-dressing-change": [
    {
      id: "sdc-1",
      question: "When removing an old wound dressing, which approach best preserves sterile technique?",
      options: [
        "Touch only the outer dressing layer with clean gloves, then reglove before wound contact",
        "Use the same gloves to remove the dressing and prep the wound",
        "Peel the dressing slowly without discarding used supplies from the field",
        "Skip hand hygiene if gloves are worn throughout",
      ],
      correct: 0,
      rationale:
        "Treat the old dressing as contaminated. Reglove (or use sterile technique per policy) before any wound contact to avoid introducing organisms into the sterile field.",
    },
    {
      id: "sdc-2",
      question: "Where should the sterile field be established relative to the wound?",
      options: [
        "Adjacent at waist level within reach without leaning over non-sterile surfaces",
        "On the bed rail next to soiled linens",
        "On the floor if the tray is too large for the overbed table",
        "Inside the patient's bathroom for privacy",
      ],
      correct: 0,
      rationale:
        "A stable, waist-level field within reach reduces breaks in technique from reaching across contaminated zones.",
    },
    {
      id: "sdc-3",
      question: "After wound assessment, what is the priority before applying new dressing materials?",
      options: [
        "Confirm ordered dressing type and perform hand hygiene / sterile reglove per protocol",
        "Apply any available dressing to cover quickly",
        "Document first and leave the wound open until charting is done",
        "Have the patient apply the dressing to increase autonomy",
      ],
      correct: 0,
      rationale:
        "Match the provider order, maintain sterility, then apply materials deliberately — speed never overrides correct product and technique.",
    },
    {
      id: "sdc-4",
      question: "Which finding should prompt escalation during a dressing change?",
      options: [
        "Purulent drainage with increasing pain, erythema, or fever",
        "Dry edges on a healing surgical incision",
        "Slight pink granulation tissue",
        "Patient preference for fabric tape",
      ],
      correct: 0,
      rationale:
        "Infection signs require provider notification, culture considerations per policy, and possible hold on routine dressing until assessed.",
    },
  ],
  "subcutaneous-injection": [
    {
      id: "sq-1",
      question: "Before a subcutaneous injection, what must be verified first?",
      options: [
        "Rights of medication administration including route, dose, time, and allergies",
        "Only the medication color in the vial",
        "Whether the patient prefers the left or right arm only",
        "If the charge nurse is available to watch",
      ],
      correct: 0,
      rationale: "Rights and allergy screening prevent wrong-drug and anaphylaxis events — the foundation of safe injection practice.",
    },
    {
      id: "sq-2",
      question: "Typical needle angle for a standard subcutaneous injection is:",
      options: ["45–90 degrees depending on tissue and medication", "15 degrees", "180 degrees flat", "Insert parallel to skin only"],
      correct: 0,
      rationale: "SQ injections use 45–90° based on pinch technique, adipose thickness, and product guidance.",
    },
    {
      id: "sq-3",
      question: "Why is site rotation critical for subcutaneous medications such as insulin?",
      options: [
        "It reduces lipodystrophy and unpredictable absorption",
        "It allows faster disposal of sharps",
        "It eliminates the need to document the site",
        "It prevents the need for aspiration",
      ],
      correct: 0,
      rationale: "Repeated sites thicken tissue and alter absorption — rotation maps protect therapeutic effect.",
    },
    {
      id: "sq-4",
      question: "After injection, safe sharps handling includes:",
      options: [
        "Activate safety device immediately and dispose in approved sharps container at point of use",
        "Recap needles with two hands if busy",
        "Place uncapped syringes on the bedside table for later",
        "Leave the needle attached for the next nurse",
      ],
      correct: 0,
      rationale: "One-handed, no-recap discipline and immediate disposal prevent needlestick injuries.",
    },
  ],
  "intramuscular-injection": [
    {
      id: "im-1",
      question: "Landmarking before an IM injection primarily prevents:",
      options: [
        "Striking nerves, vessels, or bone by confirming muscle mass",
        "Needing to document the site",
        "Using a filter needle",
        "Patient education",
      ],
      correct: 0,
      rationale: "Correct landmarks (deltoid, ventrogluteal, vastus lateralis per policy) keep the needle in intended muscle.",
    },
    {
      id: "im-2",
      question: "Z-track technique is used to:",
      options: [
        "Trap medication in muscle and reduce staining/tracking along subcutaneous tissue",
        "Speed up injection time",
        "Avoid selecting needle gauge",
        "Eliminate aspiration",
      ],
      correct: 0,
      rationale: "Displacing skin before injection then releasing creates a zig-zag path that limits surface tracking of irritating drugs.",
    },
    {
      id: "im-3",
      question: "When policy requires aspiration during IM injection, you should:",
      options: [
        "Pull back gently after insertion; if blood returns, remove needle and discard dose per protocol",
        "Never aspirate for any IM medication",
        "Inject immediately while aspirating for 30 seconds",
        "Ask the patient to hold their breath instead",
      ],
      correct: 0,
      rationale: "Blood return suggests vascular placement — discard and restart per organizational policy and medication guidance.",
    },
    {
      id: "im-4",
      question: "Post-IM injection care includes:",
      options: [
        "Apply gentle pressure, observe for reaction, document site and patient teaching",
        "Massage vigorously to improve absorption always",
        "Apply heat pack before verifying order",
        "Skip observation if the patient feels fine",
      ],
      correct: 0,
      rationale: "Monitor for bleeding, allergic response, and teach expected effects — documentation closes the safety loop.",
    },
  ],
  "foley-catheter-insertion-female": [
    {
      id: "fc-1",
      question: "Before inserting an indwelling urinary catheter, priority nursing actions include:",
      options: [
        "Confirm indication, allergies to latex, and obtain consent cues per policy",
        "Inflate the balloon to test equipment on the tray",
        "Use the largest catheter available for all patients",
        "Skip perineal prep to save time",
      ],
      correct: 0,
      rationale: "Catheters are invasive — indications, allergy screening, and informed consent protect dignity and safety.",
    },
    {
      id: "fc-2",
      question: "The catheter balloon should be inflated:",
      options: [
        "Only after urine return confirms bladder placement",
        "Before insertion to check balloon integrity inside the patient",
        "After insertion regardless of urine return",
        "Only if the patient requests it",
      ],
      correct: 0,
      rationale: "Inflating without bladder confirmation risks urethral trauma and false placement.",
    },
    {
      id: "fc-3",
      question: "Maintaining closed drainage after insertion means:",
      options: [
        "Keep the bag below bladder level and avoid breaking the closed system unnecessarily",
        "Disconnect tubing hourly for comfort",
        "Place the bag above the bladder when ambulating",
        "Clamp tubing continuously to measure output",
      ],
      correct: 0,
      rationale: "Dependent drainage and a closed system reduce CAUTI risk — breaks require sterile technique if unavoidable.",
    },
    {
      id: "fc-4",
      question: "Which finding during catheterization requires stopping and notifying the provider?",
      options: [
        "Resistance, bleeding, or inability to advance after gentle attempt",
        "Clear yellow urine in the drainage bag",
        "Patient anxiety relieved with explanation",
        "Appropriate-sized catheter selected",
      ],
      correct: 0,
      rationale: "Forced insertion can injure tissue — stop, reassess, and escalate per protocol.",
    },
  ],
  "tracheostomy-care": [
    {
      id: "tr-1",
      question: "First priority when approaching a patient with a tracheostomy is:",
      options: [
        "Assess airway patency, oxygenation, and suction need",
        "Change inner cannula on every entry",
        "Remove dressing to air out stoma",
        "Deflate cuff without order for comfort",
      ],
      correct: 0,
      rationale: "Patency and gas exchange come before routine hygiene — recognize obstruction or distress early.",
    },
    {
      id: "tr-2",
      question: "Inner cannula cleaning or replacement should follow:",
      options: ["Agency policy and provider orders using sterile or clean technique as designated", "Visitor preference", "Once per shift only regardless of secretions", "Never — leave original cannula indefinitely"],
      correct: 0,
      rationale: "Protocols balance infection control with patency — never improvise outside approved steps.",
    },
    {
      id: "tr-3",
      question: "Emergency preparedness for tracheostomy patients includes:",
      options: [
        "Bedside spare trach, obturator, ties, and suction setup per policy",
        "Removing all equipment to reduce clutter",
        "Taping the speaking valve permanently closed",
        "Avoiding humidification",
      ],
      correct: 0,
      rationale: "Decannulation or plug obstruction requires immediate supplies and trained response.",
    },
    {
      id: "tr-4",
      question: "Excessive stoma bleeding or new subcutaneous emphysema should:",
      options: ["Be reported promptly — may signal infection, erosion, or airway leak", "Be ignored if the patient is talking", "Be treated only with topical powder by nursing alone", "Wait until next physician round"],
      correct: 0,
      rationale: "These signs can indicate serious complications requiring medical evaluation.",
    },
  ],
  "wound-assessment-documentation": [
    {
      id: "wa-1",
      question: "A complete wound assessment documents:",
      options: [
        "Location, size, tissue type, drainage, odor, periwound skin, and pain",
        "Only whether a dressing is present",
        "Patient room number",
        "Brand of tape used",
      ],
      correct: 0,
      rationale: "Structured description supports trending, billing accuracy, and escalation of infection.",
    },
    {
      id: "wa-2",
      question: "Wound measurement should be:",
      options: ["Consistent method (length × width × depth) with same clock orientation each time", "Estimated visually without tools", "Skipped if the wound is improving", "Recorded only once per admission"],
      correct: 0,
      rationale: "Consistent technique makes comparative notes meaningful for the care team.",
    },
    {
      id: "wa-3",
      question: "Which periwound finding suggests infection?",
      options: ["Increasing erythema, warmth, maceration with purulent drainage", "Intact dry skin 5 cm away", "Hair growth nearby on extremity", "Previous surgical scar elsewhere"],
      correct: 0,
      rationale: "Spreading erythema, purulence, and malodor are classic infection cues requiring provider involvement.",
    },
    {
      id: "wa-4",
      question: "Photography in wound documentation requires:",
      options: ["Policy-compliant consent, labeling, and storage — never casual phone use if prohibited", "Posting to social media with PHI removed", "Flash photography only", "No patient identification ever on any clinical photo"],
      correct: 0,
      rationale: "Follow institutional media policy to protect privacy while supporting interdisciplinary review.",
    },
  ],
  "nasogastric-tube-checks": [
    {
      id: "ng-1",
      question: "Before administering medication or feed through an NG tube, you must:",
      options: ["Verify placement per protocol stack — never assume prior shift confirmation", "Flush with soda if blocked", "Use any tube if the patient is NPO", "Skip checks if the patient denies pain"],
      correct: 0,
      rationale: "Misplaced tubes can cause aspiration — follow pH, X-ray, or approved multimodal verification.",
    },
    {
      id: "ng-2",
      question: "A patient with an NG tube reports sudden coughing and respiratory distress. You should:",
      options: ["Stop infusion/meds, assess placement and airway, notify provider immediately", "Increase feed rate to push past obstruction", "Remove the tube without an order always", "Document and recheck in 8 hours"],
      correct: 0,
      rationale: "Acute respiratory change may indicate displacement or aspiration — treat as urgent.",
    },
    {
      id: "ng-3",
      question: "Securing an NG tube includes:",
      options: ["Tape at nares with mark on tube at nostril and periodic integrity checks", "Looping tube around the bed rail for tension", "Cutting excess tube length daily at bedside", "Leaving securing device loose to prevent pressure injury only"],
      correct: 0,
      rationale: "Secure without tension, document mark, and inspect nares for pressure injury.",
    },
    {
      id: "ng-4",
      question: "Residual checks (when ordered) help the nurse:",
      options: ["Assess gastric emptying before feeding — follow provider parameters", "Replace laboratory electrolytes", "Eliminate the need for head-of-bed elevation", "Confirm tube color"],
      correct: 0,
      rationale: "Gastric residual guides hold/feed decisions per protocol — not a substitute for placement verification.",
    },
  ],
  "focused-neurological-assessment": [
    {
      id: "neuro-1",
      question: "The first component of a focused neurological screen is typically:",
      options: ["Level of consciousness and orientation (AVPU or GCS elements)", "Reflex hammer testing only", "CT scan review", "Family interview alone"],
      correct: 0,
      rationale: "Mental status changes may be the earliest sign of deterioration — start broad, then deepen exam.",
    },
    {
      id: "neuro-2",
      question: "New unilateral weakness in an extremity should:",
      options: ["Trigger stroke protocol activation per facility guidelines", "Be reassessed next shift", "Be attributed to fatigue without further workup", "Be treated with massage only"],
      correct: 0,
      rationale: "Focal neuro deficits are time-sensitive — rapid escalation improves outcomes.",
    },
    {
      id: "neuro-3",
      question: "Pupil assessment documents:",
      options: ["Size, equality, and reactivity to light", "Only color of iris", "Whether patient wears glasses", "Eyelash length"],
      correct: 0,
      rationale: "PERRLA or documented exceptions help detect herniation, drugs, or nerve injury trends.",
    },
    {
      id: "neuro-4",
      question: "When documenting a focused neuro exam, you should:",
      options: ["Use precise, comparable terms and time — avoid vague 'neuro intact'", "Write 'WNL' without specifics", "Copy prior shift note verbatim", "Omit speech assessment"],
      correct: 0,
      rationale: "Specific findings (e.g., slurred speech, drift) support handoff and escalation decisions.",
    },
  ],
};

function generatedSkillMcqs(slug: string, existingCount: number): Q[] {
  const skill = getClinicalSkillBySlug(slug);
  if (!skill) return [];
  const title = skill.title.toLowerCase();
  const firstStep = skill.steps[0]?.title.toLowerCase() ?? "verify the patient, explain the skill, and assess safety";
  const midpoint = skill.steps[Math.floor(skill.steps.length / 2)]?.title.toLowerCase() ?? "pause and reassess patient tolerance";
  const finalStep = skill.steps.at(-1)?.title.toLowerCase() ?? "document and reassess the patient response";
  const all: Q[] = [
    {
      id: `${slug}-core-1`,
      question: `Before performing ${title}, which nursing action best protects patient safety?`,
      options: [
        `Verify the patient, explain the skill, assess baseline status, and confirm the ordered or policy-supported indication`,
        "Begin the procedure quickly so the patient spends less time waiting",
        "Ask another staff member to complete the skill without reviewing the patient",
        "Document the skill before it is performed so charting is not forgotten",
      ],
      correct: 0,
      rationale:
        `Safe ${skill.title} starts with identity, explanation, baseline assessment, and a valid indication. Skipping this setup risks performing the right technique on the wrong patient, missing instability, or carrying out an action that is not appropriate for the current condition.`,
    },
    {
      id: `${slug}-core-2`,
      question: `During ${title}, which finding should make the nurse pause and reassess before continuing?`,
      options: [
        "New distress, unexpected pain, bleeding, hypoxia, contamination, or a sudden change from baseline",
        "The patient asks a relevant question about what is happening",
        "The supplies are arranged on a clean work surface",
        "The nurse needs to repeat normal teaching in plain language",
      ],
      correct: 0,
      rationale:
        `A sudden change from baseline or a break in safety means the skill is no longer routine. The nurse should stop, reassess, correct the safety issue when possible, and escalate if the patient may be deteriorating.`,
    },
    {
      id: `${slug}-core-3`,
      question: `Which step best reflects safe progression for ${title}?`,
      options: [
        `Start with ${firstStep}, continue through the skill deliberately, then finish with ${finalStep}`,
        "Skip preparation if the nurse has performed this skill many times",
        "Complete documentation only if the patient has a complication",
        "Focus only on task completion rather than patient response",
      ],
      correct: 0,
      rationale:
        `Clinical skills are not just task checklists. Preparation, deliberate sequencing, and documentation/reassessment create a closed safety loop and help the next clinician understand what was done and how the patient responded.`,
    },
    {
      id: `${slug}-core-4`,
      question: `Which part of ${title} requires licensed nursing judgment rather than simple task completion?`,
      options: [
        "Interpreting abnormal findings, deciding whether to stop, and determining whether escalation is needed",
        "Carrying unopened supplies to the bedside",
        "Raising the bed to a comfortable working height",
        "Discarding trash after the nurse completes assessment",
      ],
      correct: 0,
      rationale:
        `Supplies and setup may be assisted, but interpretation and escalation require nursing judgment. Delegating the thinking portion of ${skill.title} can delay recognition of patient harm.`,
    },
    {
      id: `${slug}-core-5`,
      question: `What should the nurse do if ${title} cannot be completed safely as planned?`,
      options: [
        "Stop, keep the patient safe, reassess, seek help or clarification, and document the reason",
        "Continue because stopping may look unprepared",
        "Ask the patient to decide whether the skill should continue",
        "Chart the skill as completed and try again later",
      ],
      correct: 0,
      rationale:
        `Stopping is a safety action when conditions change. The nurse should protect the patient, reassess the barrier, get appropriate help or orders, and document accurately rather than forcing an unsafe completion.`,
    },
    {
      id: `${slug}-core-6`,
      question: `After ${title}, which follow-up action is most important?`,
      options: [
        "Reassess the patient response and document objective findings, teaching, tolerance, and any escalation",
        "Leave immediately once supplies are removed",
        "Document only that the patient tolerated the skill without details",
        "Wait until the end of shift to decide whether reassessment is needed",
      ],
      correct: 0,
      rationale:
        `Reassessment confirms whether the skill helped, harmed, or revealed new concerns. Objective documentation supports continuity, legal defensibility, and timely escalation when the patient response is not expected.`,
    },
    {
      id: `${slug}-core-7`,
      question: `Which patient-teaching approach is safest during ${title}?`,
      options: [
        "Use plain language, explain what the patient should report, and confirm understanding with teach-back",
        "Give all teaching at discharge only",
        "Use technical terms to sound professional",
        "Avoid teaching because the skill is the nurse's responsibility",
      ],
      correct: 0,
      rationale:
        `Teaching during a skill helps the patient participate in safety. Teach-back confirms the patient knows what is expected and what symptoms or problems should be reported promptly.`,
    },
    {
      id: `${slug}-core-8`,
      question: `The nurse is midway through ${title}. Which action best demonstrates bedside prioritization?`,
      options: [
        `Pause at the ${midpoint} phase if the patient becomes unstable, then address airway, breathing, circulation, or safety before continuing`,
        "Finish the remaining steps first because the checklist has already started",
        "Ask an unlicensed assistant to decide whether the patient is stable",
        "Delay reassessment until documentation is complete",
      ],
      correct: 0,
      rationale:
        `Procedure flow never outranks patient stability. If the patient becomes unstable during ${skill.title}, the nurse prioritizes ABCs, safety, reassessment, and escalation before returning to routine steps.`,
    },
  ];
  return all.slice(0, Math.max(0, CLINICAL_SKILL_MIN_MCQ_COUNT - existingCount));
}

export function getClinicalSkillCheckpoints(slug: string): ClinicalSkillCheckpoint[] {
  const baseRows = BANK[slug] ?? [];
  const rows = baseRows.length >= CLINICAL_SKILL_MIN_MCQ_COUNT
    ? baseRows
    : [...baseRows, ...generatedSkillMcqs(slug, baseRows.length)];
  return rows.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correct: q.correct,
    rationale: q.rationale,
  }));
}

export function clinicalSkillCheckpointsToQuizItems(slug: string): PathwayLessonQuizItem[] {
  return getClinicalSkillCheckpoints(slug);
}
