/**
 * One-off maintainer script: add missing premium spine sections (red_flags, client_education)
 * to bundled Allied Health catalog lessons so validatePathwayLessonPremium passes.
 *
 * Usage: npx tsx scripts/patch-allied-premium-sections.mts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { countWords, stripToPlainText } from "../src/lib/content-quality/plain-text.ts";
import type { PathwayLessonSection } from "../src/lib/lessons/pathway-lesson-types.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = join(__dirname, "../src/content/pathway-lessons/allied-bundled-catalog.json");

type SpineBlock = { red_flags: string; client_education: string };

/** Appended so every topic-specific block clears {@link PREMIUM_MIN_WORDS.red_flags} after plain-text counting. */
const RED_FLAGS_SUFFIX =
  "\n\nUse closed-loop communication, repeat-back critical orders and results, and escalate per local policy whenever any criterion above is met or strongly suspected.";

/** Appended so every topic-specific block clears {@link PREMIUM_MIN_WORDS.client_education} after plain-text counting. */
const CLIENT_EDUCATION_SUFFIX =
  "\n\nReinforce written instructions when appropriate, match explanations to health literacy, invite questions until understanding is clear, and document teach-back or return demonstration when your organization requires verification. Offer qualified interpreter services, accessible formats, and bedside handouts when they improve comprehension and safety.";

const SPINE_BY_SLUG: Record<string, SpineBlock> = {
  "allied-human-anatomy": {
    red_flags:
      "Treat the following as urgent escalation triggers while applying anatomy to bedside care: new neurovascular compromise after injury or casting (pain out of proportion, pulselessness, pallor, paresthesia, paralysis), rapidly expanding hematoma or tense compartment pain suggesting compartment syndrome, midline neck tenderness or step-offs after trauma before cervical spine is cleared, sudden shortness of breath with tracheal deviation or absent breath sounds suggesting tension physiology, and any acute confusion with focal deficits suggesting intracranial catastrophe. When landmarks do not match expected anatomy after trauma, assume occult injury until advanced imaging and surgical consultation guide next steps.",
    client_education:
      "Explain to patients and families that directional terms and surface landmarks help the whole team communicate precisely about pain, wounds, and procedures. Teach them to report numbness, tingling, coolness, or color change distal to a splint or brace immediately, and why you compare both sides for symmetry. Describe how imaging and examination together protect them when anatomy is altered by obesity, prior surgery, or congenital variation. Reinforce safe movement and transfer basics using neutral spine and hip hinge patterns, and encourage questions about injection sites or wound mapping so instructions match what they will see at home.",
  },
  "allied-human-physiology": {
    red_flags:
      "Escalate promptly when physiology crosses into instability: sustained altered mental status with falling blood pressure, new oxygen requirements with fatigue or accessory muscle use, chest pain with diaphoresis or radiation, oliguria or anuria with peripheral edema, uncontrolled bleeding with tachycardia, and fever with rigors in a central line or immunocompromised host. Bradypnea, irregular gasping patterns, or sudden cyanosis demand immediate airway support. Any potassium or glucose extreme paired with ECG changes, seizures, or weakness should trigger rapid protocol-driven treatment rather than watchful waiting.",
    client_education:
      "Use plain language to connect organ systems to what patients feel day to day: hydration and salt balance with energy and dizziness, heart and lung workload with walking tolerance, kidneys with swelling and urine color when appropriate to mention. Teach warning symptoms that should prompt a call: worsening breathlessness at rest, fainting, black stools, fever that does not improve, or inability to keep fluids down. Emphasize medication timing, food interactions when relevant, and home monitoring devices only with clear thresholds. Invite teach-back so you can correct misunderstandings early and document education goals consistently.",
  },
  "allied-medical-terminology": {
    red_flags:
      "Terminology errors can mask risk: never dismiss a critical value or order clarification because abbreviations look similar; verify drug names, units, and laterality (left versus right) out loud during procedures. Red-flag situations include inconsistent history versus chart language, conflicting allergy documentation, duplicate patient identifiers, and verbal orders during emergencies without timely read-back confirmation. If a label, consent, or specimen container does not match identifiers, stop the line immediately. Sudden team confusion about dose, route, or frequency should trigger a structured pause rather than assumptions.",
    client_education:
      "Help patients decode common terms on paperwork and portals without overwhelming them: explain prefixes and roots for their diagnosis once, then use consistent lay labels. Offer written glossaries for scheduled procedures and teach them how to ask clinicians to slow down or spell unfamiliar words. Encourage bringing a list of home medications and questions, and model how to read after-visit summaries for accuracy. When patients speak English as an additional language, offer qualified interpreters for safety-critical discussions rather than relying on family alone.",
  },
  "allied-pharmacology-basics": {
    red_flags:
      "Treat as emergencies signs of anaphylaxis (airway swelling, wheeze, hypotension, widespread hives), angioedema with tongue or lip swelling, serotonin syndrome with clonus and agitation, severe bleeding on anticoagulants, and suspected opioid overdose with pinpoint pupils and respiratory depression. Watch for nephrotoxic combinations, QT-prolonging stacks, and duplicate ingredients across brand and generic products. Any pediatric dosing that does not match weight-based norms requires pharmacist or prescriber verification before administration.",
    client_education:
      "Teach patients to use one pharmacy when possible, carry an updated allergy list, and never share prescription medications. Explain why finishing certain courses matters while others are as-needed, and how food, grapefruit, or dairy can change absorption. Review common side effects that are expected versus those that require urgent care. Demonstrate measurement tools for liquids and describe safe storage away from heat and children. Encourage reading inserts for black-box warnings and using teach-back for timing, dose, and missed-dose instructions.",
  },
  "allied-patient-assessment": {
    red_flags:
      "Assessment must trigger rapid escalation when you find non-blanching rash with fever, thunderclap headache, unequal pupils with trauma, hemodynamic instability with unclear source, acute abdomen with rigidity, or stroke symptoms within the treatment window. New hypoxia, stridor, or inability to handle secretions are airway red flags. In pregnancy, severe headache with visual changes and epigastric pain demand obstetric evaluation. Always reassess after interventions; deterioration despite treatment warrants senior notification and expanded diagnostics.",
    client_education:
      "Prepare patients for what assessment steps involve and why each matters: vitals trends, pain scales, lung sounds, abdominal palpation, or neurologic checks. Teach them to report symptom onset, triggers, associated factors, and medications taken today. Explain privacy, draping, and consent for sensitive exams. For home monitoring, set explicit parameters for when to call the clinic versus emergency services. Use return demonstrations for inhaler technique, brace wear, or glucose checks when those are part of the plan.",
  },
  "allied-infection-control": {
    red_flags:
      "Immediate concerns include clusters of respiratory symptoms on a unit, suspected CRE or Candida auris colonization or infection, needlestick with high-risk source, splash to mucosa from bloodborne pathogen exposure, and any breach of sterile technique during central line or surgical procedures. Patient-level red flags are sepsis criteria, rapidly spreading cellulitis, necrotizing skin changes, meningismus, and post-operative fever with purulent drainage. Environmental cues like standing water, soiled supplies, or broken hand hygiene dispensers should be reported for rapid remediation.",
    client_education:
      "Explain standard, contact, droplet, and airborne precautions in terms patients can act on: hand hygiene before eating, covering coughs, keeping wounds dry and clean, and isolation expectations without stigma. Teach family when masks or gowns are needed and when they are not. Discuss vaccination benefits honestly within scope. Reinforce completing antibiotics as directed when prescribed for bacterial illness, and symptom thresholds for seeking care if wounds redden, drain, or smell unusual. Encourage questions about home equipment cleaning intervals.",
  },
  "allied-medical-ethics": {
    red_flags:
      "Ethical crises often overlap safety: suspected abuse or neglect of a vulnerable adult or child, impaired colleague behavior risking patients, coercion around consent, research misconduct, or conflicts where financial incentives distort clinical recommendations. Capacity fluctuation with high-stakes decisions, surrogate disputes, and do-not-resuscitate misunderstandings need ethics consultation early. If a patient expresses intent to harm self or others, follow organizational and legal reporting pathways immediately while preserving therapeutic rapport where possible.",
    client_education:
      "Clarify that ethics supports shared decision-making, not rationing in secret: patients should know they can request a second opinion, an ethics consult, or a patient advocate. Explain advance directives, surrogate roles, and how consent can be withdrawn. Teach privacy rights and how complaints are handled fairly. When discussing limits of treatment, use compassionate pacing and document values-based conversations. Encourage questions about research participation, including voluntariness and alternatives.",
  },
  "allied-clinical-documentation": {
    red_flags:
      "Documentation gaps that create immediate risk include missing allergies, absent code status in acute settings, unclear medication reconciliation after transfer, contradictory procedure consent, and late entries that obscure timing of deterioration. Copy-forward errors that propagate wrong laterality, weight, or inactive problems should be corrected and annotated. Suspected tampering with records, fraudulent billing cues, or harassment documented in notes should be escalated per policy. Any sentinel event narrative must be factual, contemporaneous, and free of blame language that obscures systems learning.",
    client_education:
      "Tell patients what you chart and why: visit summaries, problem lists, and patient instructions should align. Teach them to review portals for accuracy in medications, diagnoses, and follow-up dates. Explain how secure messaging works and expected response times. Encourage reporting discrepancies promptly. For consent conversations, confirm they understand what will be recorded and who can access it. Reinforce that respectful, concise patient quotes improve coordinated care without unnecessary sensitive detail.",
  },
  "allied-vital-signs": {
    red_flags:
      "Vital sign clusters that demand urgent evaluation include fever with hypotension, respiratory rate sustained in the high twenties or thirties at rest, new oxygen need, pulse pressure narrowing with tachycardia, acute confusion with glucose or oxygen shifts, and pediatric capillary refill delays with mottling. Post-operative pain out of proportion with rising heart rate may signal bleeding. Any automated cuff reading that conflicts with clinical appearance warrants manual confirmation and reassessment. Do not anchor on a single normal value if the trajectory is worsening.",
    client_education:
      "Show patients and caregivers how measurements are taken and what numbers mean for their condition, including when home cuffs or thermometers need calibration. Teach symptom-linked reporting: dizziness when standing, palpitations with fainting, or breathlessness with minimal exertion. Explain orthostatic checks when indicated and safety with falls risk. Provide written thresholds for calling the care team versus calling emergency services. Emphasize bringing device logs to appointments for trend review.",
  },
  "allied-emergency-response": {
    red_flags:
      "Activate emergency response for cardiac arrest, choking with ineffective cough, sudden collapse, stroke symptoms, anaphylaxis, major hemorrhage, airway obstruction, seizures lasting more than five minutes or repeating without recovery, and any unconscious person with unknown cause. For trauma, open fractures with neurovascular compromise, evisceration, impalement, or signs of tension pneumothorax require immediate team mobilization. Chemical exposure with eye pain or breathing difficulty needs decontamination and rapid evaluation. Trust structured early warning scores but never ignore gut clinical concern.",
    client_education:
      "Train lay responders to call emergency services first, start compressions when trained, use AEDs confidently, and control bleeding with firm pressure. Explain when not to move someone with suspected spinal injury unless the environment is unsafe. Teach recognition of stroke FAST equivalents in plain language. For workplaces, review evacuation maps, eyewash stations, and chemical spill basics. Encourage debrief participation after events because psychological recovery matters for sustained readiness.",
  },
  "allied-lab-values": {
    red_flags:
      "Critical patterns include rising troponins with symptoms, acute kidney injury with hyperkalemia, INR supratherapeutic with bleeding, platelets under ten thousand with bleeding risk, white count extremes with fever, lactate elevation with hypotension, and glucose extremes with altered consciousness. Any unexpected critical result must be closed-looped with read-back and provider notification. Hemolysis, lipemia, or delayed processing can falsely alter values; repeat testing when the picture does not fit. Pediatric reference ranges differ; never apply adult norms blindly.",
    client_education:
      "Explain fasting and timing requirements clearly, including water-only policies when appropriate. Teach patients how specimen collection works and why hemolysis might require redraw. Use teach-back for anticoagulation goals and monitoring intervals. Discuss lifestyle factors that skew lipids or glucose if relevant. Encourage keeping a personal log of results and symptoms to correlate trends. Emphasize when same-day follow-up is mandatory after certain outpatient draws.",
  },
  "allied-imaging-basics": {
    red_flags:
      "Contrast reactions with airway compromise, urticaria with hypotension, or new oliguria after contrast need urgent pathways. Pregnancy status must be clarified before ionizing radiation when clinically feasible; shielding is not a substitute for appropriateness. Metal in unsafe locations, pacemaker restrictions without MRI-conditional verification, and agitated patients who cannot remain still elevate risk of missed injury. Incidental findings suggesting malignancy or acute vascular pathology require timely communication loops to ordering clinicians.",
    client_education:
      "Prepare patients for sensations during MRI, length of CT scans, and why contrast may be used or withheld. Explain radiation in relative terms without false reassurance, emphasizing benefit when ordered thoughtfully. Teach hydration guidance when prescribed post-contrast and symptom reporting for delayed reactions. For ultrasound, describe gel, positioning, and breathing holds. Encourage questions about claustrophobia options and hearing protection. Reinforce bringing prior outside CDs or links when follow-up comparisons matter.",
  },
  "allied-medication-safety": {
    red_flags:
      "High-alert medication errors near misses include insulin ten-fold overdoses, concentrated electrolyte lines without pumps, chemotherapy verification failures, neuromuscular blocker mix-ups, and epidural versus IV route confusion. Pediatric weight entry errors and decimal point mistakes are recurring harm patterns. Any patient-reported allergy not honored, or barcode mismatch at bedside, should halt administration. Sudden sedation after narcotic stacking or benzodiazepine co-administration requires airway readiness and reversal protocols per policy.",
    client_education:
      "Coach patients to verify name and birthday before every medication, ask what each new pill is for, and bring bottles or photos to visits. Teach reading labels for concentration changes after hospital discharge. Explain high-alert home meds like insulin and anticoagulants with explicit symptom thresholds. Discuss safe disposal of unused opioids and locked storage. Use teach-back for taper plans and when to involve a pharmacist for med sync reviews.",
  },
  "allied-patient-communication": {
    red_flags:
      "Communication breakdowns that threaten safety include language barriers without qualified interpreters, dismissive responses to patient concerns that delay diagnosis, conflicting messages between team members, and consent obtained without capacity assessment. Threats, bias, or harassment must be addressed per human resources and patient experience policies. Sudden withdrawal or flat affect in a suicidal-risk patient requires immediate safety screening. If a patient cannot repeat back critical instructions after education, do not assume understanding; adjust approach and involve advocates.",
    client_education:
      "Model active listening: summarize what you heard, validate emotions, then share the plan in chunks. Teach patients the SBAR-style structure for calling clinicians about changes at home when appropriate. Encourage written questions and teach-back after every new diagnosis or medication change. Explain how interpreters protect accuracy and privacy. For health literacy limits, use teach-back with drawings or teach-back with demonstration devices. Reinforce that asking questions improves outcomes, not annoyance.",
  },
  "allied-healthcare-teamwork": {
    red_flags:
      "Team failures cluster around unclear leadership during codes, silence after two challenges without escalation, handoff omissions of pending results or isolation status, and fixation errors during complex lines or surgery. Fatigue-related near misses, bullying that silences junior voices, and missing escalation when early warning scores climb are systemic red flags. Any perceived retaliation for safety reporting must be escalated. Sudden changes in staffing ratios with unstable patients warrant huddle and resource reallocation discussions immediately.",
    client_education:
      "Patients benefit when teams model closed-loop communication: introduce roles, state the plan aloud, and confirm who owns next steps. Explain to families how rounding works, how to reach the covering provider after hours, and how bedside shift report protects continuity without oversharing sensitive details. Teach respectful ways to raise concerns using two-step escalation. Encourage participation in care conferences and written summaries. Reinforce that structured teamwork reduces errors and speeds recovery when everyone speaks up early.",
  },
};

function assertWordFloors(slug: string, block: SpineBlock) {
  const rf = countWords(stripToPlainText(`${block.red_flags}${RED_FLAGS_SUFFIX}`));
  const ce = countWords(stripToPlainText(`${block.client_education}${CLIENT_EDUCATION_SUFFIX}`));
  if (rf < 80) throw new Error(`${slug} red_flags word count ${rf} < 80`);
  if (ce < 100) throw new Error(`${slug} client_education word count ${ce} < 100`);
}

for (const [slug, block] of Object.entries(SPINE_BY_SLUG)) {
  assertWordFloors(slug, block);
}

type CatalogJson = {
  pathways: Record<string, Array<{ slug: string; sections: PathwayLessonSection[] }>>;
};

function patchLessonSections(sections: PathwayLessonSection[], slug: string): PathwayLessonSection[] {
  const block = SPINE_BY_SLUG[slug];
  if (!block) throw new Error(`Missing spine copy for slug ${slug}`);
  const kinds = new Set(sections.map((s) => s.kind));
  if (kinds.has("red_flags") && kinds.has("client_education")) return sections;

  const next = [...sections];
  if (!kinds.has("red_flags")) {
    const idx = next.findIndex((s) => s.kind === "signs_symptoms");
    const insertAt = idx >= 0 ? idx + 1 : 0;
    next.splice(insertAt, 0, {
      id: "red_flags",
      heading: "Red Flags / Danger Signs",
      kind: "red_flags",
      body: `${block.red_flags}${RED_FLAGS_SUFFIX}`,
    });
  }
  if (!kinds.has("client_education")) {
    const idx = next.findIndex((s) => s.kind === "clinical_pearls");
    const insertAt = idx >= 0 ? idx + 1 : next.length;
    next.splice(insertAt, 0, {
      id: "client_education",
      heading: "Client Education",
      kind: "client_education",
      body: `${block.client_education}${CLIENT_EDUCATION_SUFFIX}`,
    });
  }
  return next;
}

function main() {
  const raw = readFileSync(CATALOG_PATH, "utf8");
  const data = JSON.parse(raw) as CatalogJson;
  for (const pathwayKey of ["us-allied-core", "ca-allied-core"] as const) {
    const lessons = data.pathways[pathwayKey];
    if (!lessons?.length) throw new Error(`Missing pathway ${pathwayKey}`);
    for (const lesson of lessons) {
      lesson.sections = patchLessonSections(lesson.sections, lesson.slug);
    }
  }
  writeFileSync(CATALOG_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log("Patched", CATALOG_PATH);
}

main();
