#!/usr/bin/env node
/**
 * Writes rn-nclex-infection-control-expansion-catalog.json
 * Run: node scripts/generate-rn-infection-control-expansion-catalog.mjs (from nursenest-core)
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../src/content/pathway-lessons/rn-nclex-infection-control-expansion-catalog.json");

const HUB = `[Canada RN hub](/canada/rn/nclex-rn/lessons) · [US RN hub](/us/rn/nclex-rn/lessons)`;
const ISO = `[isolation precautions in practice](LESSON:isolation-precautions-in-practice)`;
const SEPSIS = `[sepsis early recognition](LESSON:sepsis-early-recognition-hy)`;
const HIVPEP = `[HIV confidentiality & PEP basics](LESSON:hiv-confidentiality-pep-basics)`;
const WOUND = `[wound infection vs colonization](LESSON:wound-infection-vs-colonization)`;
const PPE = `[PPE & transmission basics](LESSON:ppe-transmission-basics)`;
const CDIFF = `[C. diff infection control](LESSON:c-diff-infection-control)`;
const TBREF = `[TB isolation compliance](LESSON:tb-isolation-compliance)`;

/** [slug, title, flavor: general|isolation|hai|organism|exposure|stewardship|sepsis|priority|wound] */
const META = [
  ["chain-of-infection-nclex-rn", "Chain of Infection", "general"],
  ["standard-precautions-deep-dive-nclex-rn", "Standard Precautions Deep Dive", "isolation"],
  ["hand-hygiene-aseptic-technique-nclex-rn", "Hand Hygiene and Aseptic Technique", "general"],
  ["ppe-donning-doffing-sequence-nclex-rn", "PPE Donning and Doffing", "isolation"],
  ["contact-precautions-nursing-nclex-rn", "Contact Precautions", "isolation"],
  ["droplet-precautions-nursing-nclex-rn", "Droplet Precautions", "isolation"],
  ["airborne-precautions-nursing-nclex-rn", "Airborne Precautions", "isolation"],
  ["neutropenic-protective-precautions-nclex-rn", "Protective/Neutropenic Precautions", "isolation"],
  ["transmission-based-precautions-room-ppe-nclex-rn", "Transmission-Based Precautions: Which Room, Which PPE?", "priority"],
  ["healthcare-associated-infections-nclex-rn", "Healthcare-Associated Infections", "hai"],
  ["cauti-prevention-bundle-nclex-rn", "CAUTI Prevention", "hai"],
  ["clabsi-prevention-bundle-nclex-rn", "CLABSI Prevention", "hai"],
  ["vap-prevention-bundle-nclex-rn", "VAP Prevention", "hai"],
  ["surgical-site-infection-prevention-nclex-rn", "Surgical Site Infection Prevention", "hai"],
  ["c-difficile-contact-precautions-nclex-rn", "C. difficile Infection Control", "organism"],
  ["mrsa-vre-contact-precautions-nclex-rn", "MRSA and VRE Precautions", "organism"],
  ["tuberculosis-isolation-negative-pressure-nclex-rn", "Tuberculosis Isolation and Compliance", "organism"],
  ["meningitis-droplet-precautions-nclex-rn", "Meningitis Precautions", "organism"],
  ["influenza-respiratory-droplet-precautions-nclex-rn", "Influenza and Respiratory Virus Precautions", "organism"],
  ["covid-19-viral-infection-control-nclex-rn", "COVID-19 and Viral Infection Control", "organism"],
  ["needlestick-bloodborne-pathogen-exposure-nclex-rn", "Needlestick Injury and Bloodborne Pathogen Exposure", "exposure"],
  ["hiv-hbv-hcv-exposure-follow-up-nclex-rn", "HIV, Hepatitis B, and Hepatitis C Exposure Follow-Up", "exposure"],
  ["post-exposure-prophylaxis-basics-nclex-rn", "Post-Exposure Prophylaxis Basics", "exposure"],
  ["antibiotic-stewardship-nursing-nclex-rn", "Antibiotic Stewardship", "stewardship"],
  ["culture-collection-before-antibiotics-nclex-rn", "Culture Collection Before Antibiotics", "stewardship"],
  ["fever-infection-workup-nclex-rn", "Fever and Infection Workup", "general"],
  ["immunocompromised-infection-risk-nclex-rn", "Immunocompromised Patient Infection Risk", "general"],
  ["sepsis-screening-escalation-nclex-rn", "Sepsis Screening and Escalation", "sepsis"],
  ["septic-shock-nursing-priorities-nclex-rn", "Septic Shock Nursing Priorities", "sepsis"],
  ["wound-infection-colonization-dehiscence-nclex-rn", "Wound Infection, Colonization, and Dehiscence", "wound"],
  ["cleaning-disinfection-sterilization-nclex-rn", "Cleaning, Disinfection, and Sterilization", "general"],
  ["patient-placement-cohorting-nclex-rn", "Patient Placement and Cohorting", "isolation"],
  ["infection-control-priority-first-action-nclex-rn", "Infection Control Priority Questions: What Do You Do First?", "priority"],
  ["which-infection-control-patient-unstable-ngn", "Which Infection Control Patient Is Unstable?", "priority"],
  ["ngn-infection-control-case-studies-nclex-rn", "NGN Infection Control Case Studies", "priority"],
];

function bodies(slug, title, flavor) {
  const isIsolation = flavor === "isolation";
  const isHai = flavor === "hai";
  const isOrganism = flavor === "organism";
  const isExposure = flavor === "exposure";
  const isStewardship = flavor === "stewardship";
  const isSepsis = flavor === "sepsis";
  const isWound = flavor === "wound";
  const isPriority = flavor === "priority";

  let meaning = `**${title}** supports NCLEX-RN **infection prevention and control**: you break the **chain of infection**, apply **standard precautions** to every patient, add **transmission-based** layers when indicated, and escalate **sepsis** or **exposure** concerns without delay. Canadian stems may reference **PHAC**-aligned language and **metric** vitals; US items test the same **first action** and **PPE** logic.\n\nBoards reward **policy-faithful** sequencing—**soap and water** after **C. diff** care, **N95** and **negative pressure** for **airborne** pathogens when the stem signals it, and **rapid response** or **provider notification** when instability appears.\n\nLink ${ISO}, ${PPE}, ${SEPSIS}, and ${HUB}.`;

  if (isIsolation) {
    meaning = `**${title}** focuses on **transmission-based precautions** layered on **standard precautions**: correct **room** engineering (negative pressure for **airborne**), **PPE** selection (**N95** vs surgical mask), **donning/doffing** without self-contamination, and **visitor**/transport discipline. NCLEX punishes **wrong mask type**, **doffing** that contaminates the face, or **cohorting** incompatible organisms.\n\nIntegrate ${ISO}, ${PPE}, ${CDIFF}, and ${HUB}.`;
  }
  if (isHai) {
    meaning = `**${title}** addresses **healthcare-associated infection (HAI)** prevention bundles: **indication** for devices, **aseptic insertion**, **daily necessity review**, **maintenance** practices (**scrub the hub**, closed **urinary** systems, **oral care** and **HOB** for ventilated clients), and **surgical** **prophylaxis** timing themes when the stem includes OR clients. Nursing judgment ties **early device removal** to risk reduction.\n\nPair ${SEPSIS}, ${ISO}, ${WOUND}, and ${HUB}.`;
  }
  if (isOrganism) {
    meaning = `**${title}** applies **pathogen-specific** precautions and surveillance: **contact** for **C. diff** and **multidrug-resistant** organisms, **droplet** for **respiratory** spread patterns, **airborne** for **TB**-style nuclei, and **public health** reporting themes when applicable. Expect **hand hygiene** method traps (**soap and water** for **C. diff** spores).\n\nConnect ${CDIFF}, ${TBREF}, ${ISO}, ${SEPSIS}, and ${HUB}.`;
  }
  if (isExposure) {
    meaning = `**${title}** covers **occupational** blood and body fluid exposure: **immediate** washing, **reporting** to **occupational health**, **source** and **exposed worker** testing pathways, and **post-exposure prophylaxis** timing windows for **HIV** when ordered. Confidentiality and **non-judgmental** support are threaded through exam vignettes.\n\nUse ${HIVPEP}, ${ISO}, ${SEPSIS}, and ${HUB}.`;
  }
  if (isStewardship) {
    meaning = `**${title}** ties **antimicrobial stewardship** to nursing practice: **cultures before antibiotics** when feasible and the patient is not crashing, **indication** review, **de-escalation** when sensitivities return, and **adverse effect** monitoring. NCLEX rewards **not delaying** antibiotics in **septic shock** while still prioritizing **culture discipline** when safe.\n\nLink ${SEPSIS}, ${ISO}, ${HUB}.`;
  }
  if (isSepsis) {
    meaning = `**${title}** bridges **infection control** with **deterioration** recognition: **qSOFA**-style screening cues, **lactate** and **perfusion** themes, **Hour-1** bundle elements as the item frames them, and **escalation** to **provider** or **rapid response** when criteria are met. Avoid teaching or routine tasks ahead of **resuscitation** priorities.\n\nAnchor with ${SEPSIS}, ${ISO}, ${HUB}.`;
  }
  if (isWound) {
    meaning = `**${title}** differentiates **colonization** from **true infection**, recognizes **dehiscence** and **evisceration** red flags, and reinforces **aseptic** dressing technique and **culture** of **tissue** or **purulent** material when ordered—not swabbing **non-purulent** chronic wounds inappropriately. Infection control overlaps with **contact** precautions for **draining** wounds with resistant organisms.\n\nPair ${WOUND}, ${ISO}, ${SEPSIS}, and ${HUB}.`;
  }
  if (isPriority) {
    meaning = `**${title}** trains **NGN-style prioritization** for infection scenarios: unstable **sepsis**, **airway** compromise with **hemoptysis**, **wrong isolation** leaving others exposed, **needlestick** reporting windows, **C. diff** outbreaks, or **post-op fever** with **rigidity** outrank stable teaching. Pick the client with **objective** high risk first.\n\nAnchor with ${SEPSIS}, ${ISO}, ${PPE}, ${HUB}.`;
  }

  let exam = `Examiners use **first**, **priority**, and **most important** language. Eliminate answers that **delay cultures** in **stable** patients when the stem rewards culture-first discipline, or that **delay antibiotics** in **shock**. Watch **PPE** sequence, **room type**, and **hand hygiene** method mismatches.`;

  if (isIsolation) exam += ` Airborne vs droplet vs contact distinctions appear every cycle.`;
  if (isHai) exam += ` Device bundles test **indication**, **maintenance**, and **removal**.`;
  if (isOrganism) exam += ` **C. diff** and **TB** traps are high yield.`;
  if (isExposure) exam += ` **Timely occupational health** notification beats completing paperwork first.`;
  if (isStewardship) exam += ` Balance **culture timing** with **urgency** of sepsis.`;
  if (isSepsis) exam += ` **Lactate** trends and **MAP** targets appear with escalation cues.`;
  if (isWound) exam += ` **Evisceration** → **cover**, **NPO**, **notify**, **prepare** OR—classic sequence.`;
  if (isPriority) exam += ` Multi-patient matrices reward **one unstable infection** client first.`;

  let core = `- **Learning objectives:** match **pathogen** and **route** to **precautions**; execute **hand hygiene** per indication; protect **self**, **patients**, and **visitors**.\n- **Nursing priorities:** correct **PPE**; maintain **negative pressure** integrity when assigned; **cluster** care thoughtfully without delaying **urgent** needs.\n- **Red flags / safety:** **doffing** errors; **wrong room** for **TB**; **continuing** alcohol-only hand hygiene after **C. diff** care when policy requires soap and water.\n- **Patient teaching:** respiratory hygiene; **isolation** rationale; **when to seek care** for fever or spreading redness.\n- **Clinical reasoning:** **assess → protect → notify** before low-yield tasks when instability is present.`;

  if (isIsolation)
    core = `- **Contact:** gloves + gown; dedicated equipment; **C. diff** → soap and water handwashing.\n- **Droplet:** surgical mask within **1–2 m**; private room or cohort **same pathogen**.\n- **Airborne:** fit-tested **N95** (or PAPR per policy); **AIIR**; door closed.\n- **Neutropenic protective:** **HL** menus, fresh flowers avoidance themes, visitor screening per policy.\n- **Transport:** mask type on patient per precaution category.`;
  if (isHai)
    core = `- **CAUTI:** sterile insertion; closed drainage; bag below bladder; **daily** catheter necessity review.\n- **CLABSI:** maximal sterile barrier at insertion; **scrub the hub**; assess **dressing**; remove when unnecessary.\n- **VAP:** **HOB 30–45°**; oral care; **SED** vacation per orders; subglottic suction when device present.\n- **SSI:** pre-op **skin** prep themes; **glycemic** control; **normothermia**; **hair removal** clippers not razors when tested.\n- **Surveillance:** report **clusters** to infection prevention.`;
  if (isOrganism)
    core = `- **C. diff:** contact precautions; **bleach**-compatible environmental cleaning themes; antibiotic risk reduction teaching.\n- **MRSA/VRE:** contact precautions; **decolonization** only when stem and orders support—not assumed.\n- **TB:** suspect **airborne** until ruled out per policy; **fit testing** documentation themes.\n- **Meningitis:** droplet until **pathogen** and duration rules per policy; **public health** notification.\n- **Influenza/COVID:** droplet/contact per current facility policy framing in the item—follow the stem.`;
  if (isExposure)
    core = `- **Wash** exposed site with soap and water; **do not** squeeze or **suck** wound.\n- **Report** immediately to supervisor and **occupational health**.\n- **HIV PEP:** time window themes—**sooner is better** within **72 hours**.\n- **HBV:** vaccine **status** and **HBIG** themes when item provides history.\n- **Documentation:** incident report without **blaming** tone; factual timeline.`;
  if (isStewardship)
    core = `- **Obtain cultures** before first dose when **safe** and patient not in **immediate** collapse.\n- **Renal** dose adjustments when stem provides **CrCl**.\n- **Narrow** therapy when sensitivities return.\n- **Duration** stewardship for uncomplicated UTIs when item frames outpatient care.\n- **Teach** completion of prescribed courses for susceptible infections when appropriate.`;
  if (isSepsis)
    core = `- **Screen** with **vitals**, **mentation**, **perfusion**, **source** clues.\n- **Escalate** with **SBAR** and objective trends.\n- **Fluids** and **antibiotics** per orders and bundles when shock is implied.\n- **MAP** and **lactate** reassessment themes.\n- **Avoid** delegating **unstable** reassessment to UAP.`;
  if (isWound)
    core = `- **Colonization** may show positive swab without **clinical** infection signs.\n- **Infection:** increasing pain, **purulence**, spreading **erythema**, fever.\n- **Dehiscence:** wound **edges** separate; **evisceration** is **emergent**—cover with **sterile** saline-moist dressing per policy, **NPO**, **notify**.\n- **Dressing:** **aseptic** technique; **wound** isolation when **MDRO** drainage.\n- **Photograph**/measure per policy—not assumed scope.`;
  if (isPriority)
    core = `- **Airway** and **hemodynamic** collapse beat **charting**.\n- **Suspected TB** in shared space → **airborne** isolation beats finishing **admission** questions.\n- **Needlestick** from **HIV-risk** source → **immediate** chain of reporting beats end-of-shift **incident** form only.\n- **C. diff** outbreak → **contact** + **environmental** escalation per policy.\n- **Delegate** stable tasks only after **unstable** clients covered.`;

  let scenario = `**Patient vignette.** A hospitalized adult with concerns related to **${title}** develops **fever** and **tachycardia** during your shift. You notice **hypotension** when standing and **confusion** new for this client.\n\n**Fork:** **Repeat vitals**, **apply oxygen** if ordered, **obtain** **lactate** and **cultures** per protocol, **notify the provider** with **SBAR**, and **initiate isolation** precautions if **source** clues suggest **transmissible** risk—not routine hygiene alone first.`;

  if (isIsolation)
    scenario = `**Patient vignette.** A client is **admitted** with **productive cough**, **night sweats**, and **weight loss** while **awaiting** **TB** rule-out. They are currently in a **semi-private** bay.\n\n**Fork:** **Airborne precautions** and **AIIR** per policy—**mask** the client for transport, **notify** infection prevention/provider, **do not** leave in **open** multi-bed space when stem implies **pulmonary TB** suspicion.`;
  if (isHai)
    scenario = `**Patient vignette.** **POD 3** post **abdominal surgery**, the client has **increasing** incision **pain**, **serosanguinous** drainage with **new** purulence, and **temperature** **38.9 °C**.\n\n**Fork:** **Assess** wound with **sterile** technique per policy, **notify surgeon/provider**, obtain **wound culture** if ordered, **monitor** for **sepsis**—not **reinforce** dressing blindly without reporting **infection** signs.`;
  if (isOrganism)
    scenario = `**Patient vignette.** A client with **three** watery stools after **clindamycin** therapy has **abdominal cramping**. Roommate is **neutropenic**.\n\n**Fork:** **Contact precautions**, **soap and water** hand hygiene after care, **dedicated** equipment, **notify provider**, **stool** testing per orders, and **cohorting** only if policy allows—**not** moving to roommate without **precaution** plan.`;
  if (isExposure)
    scenario = `**Patient vignette.** You sustain a **needlestick** from a **used** **insulin** needle during **disposal**. The source patient has **HBV** and **HIV** on chart.\n\n**Fork:** **Wash** site **immediately**, **notify** supervisor, **report to occupational health** for **risk assessment** and **PEP** timing—**not** delaying **hours** to finish med pass.`;
  if (isStewardship)
    scenario = `**Patient vignette.** A **febrile** client is **hemodynamically stable** enough for **two** blood culture sets. The provider orders **broad-spectrum** antibiotics.\n\n**Fork:** **Obtain cultures before first dose** when **feasible** per bundle—if **delay** would exceed safe window, follow **sepsis urgency** framing in the stem; document times clearly.`;
  if (isSepsis)
    scenario = `**Patient vignette.** **Lactate** **4.2 mmol/L**, **MAP** **62 mmHg** after **fluid bolus**, **new** **agitation**.\n\n**Fork:** **Escalate** along **sepsis** pathway—**notify provider**, prepare for **vasopressor** orders, **continuous monitoring**, **recheck lactate** per protocol—not routine **bed linen** change first.`;
  if (isWound)
    scenario = `**Patient vignette.** Abdominal **wound** **edges** **separate** with **visceral** **bulge** noted when dressing removed.\n\n**Fork:** **Cover** with **sterile** saline-moist dressing per policy, **NPO**, **call for help**, **notify surgeon** immediately—**classic evisceration** emergency sequence.`;
  if (isPriority)
    scenario = `**Patient vignette.** Four clients: (A) **febrile** **neutropenic** with **rigors**, (B) **stable** **isolation** teaching request, (C) **needlestick** **2 hours ago** not yet reported, (D) routine **vitals** on stable post-op.\n\n**Fork:** **See Client A first** for **febrile neutropenia** emergency pathway; then **C** for **PEP** window; then **D**; then **B** with **clear communication**.`;

  const takeaways = `- **Standard + transmission-based** layers stack—never drop standard precautions.\n- **Sepsis** and **isolation** mistakes both harm—tie **vitals** to **action**.\n- **Synthesis:** infection control is **everyone’s** job; **objective** escalation wins on boards.\n\n**Related:** ${ISO} · ${SEPSIS} · ${PPE} · ${HUB}.`;

  return { meaning, exam, core, scenario, takeaways };
}

function quizPair(title) {
  return {
    preTest: [
      {
        question: `For ${title}, which action best matches NCLEX-RN infection control priorities?`,
        options: [
          "Complete non-urgent charting before reporting suspected sepsis with hypotension",
          "Reassess vitals and perfusion, follow sepsis/isolation protocols per orders, and notify the provider with objective data when criteria are met",
          "Discontinue isolation without provider or infection prevention direction",
          "Delegate unstable assessment to the nursing assistant alone",
        ],
        correct: 1,
        rationale:
          "Infection-related deterioration requires reassessment, protocol-aligned interventions, and timely communication before deferrable tasks.",
      },
      {
        question: `After caring for a client with suspected C. difficile diarrhea, which hand hygiene practice is most appropriate?`,
        options: [
          "Alcohol-based hand rub alone because it is faster",
          "Soap and water when spore-forming organism precautions are indicated per policy",
          "Skip hand hygiene until end of shift",
          "Only wash if visible soil is present",
        ],
        correct: 1,
        rationale:
          "Clostridioides difficile spores are not reliably inactivated by alcohol-based rub alone; soap and water friction is required after care when policy indicates.",
      },
    ],
    postTest: [
      {
        question: `Which finding most urgently requires escalation in an infection control context for ${title}?`,
        options: [
          "Mild dry cough in afebrile client",
          "MAP 58 mmHg with rising lactate and new confusion in a febrile client",
          "Request for an extra blanket",
          "Chronic osteoarthritis pain unchanged from baseline",
        ],
        correct: 1,
        rationale:
          "Hypotension with rising lactate and altered mental status in a febrile patient suggests sepsis/septic shock until evaluated and requires immediate escalation.",
      },
      {
        question: `When is detailed patient teaching about ${title} most appropriate?`,
        options: [
          "During active hemodynamic instability",
          "After stabilization when the client is alert and able to participate",
          "Only at home without follow-up",
          "Before any assessment to save time",
        ],
        correct: 1,
        rationale:
          "Education is most effective after acute threats are stabilized and the patient can engage safely.",
      },
    ],
  };
}

function buildLesson(slug, title, flavor) {
  const { meaning, exam, core, scenario, takeaways } = bodies(slug, title, flavor);
  return {
    slug,
    title,
    topic: "Infection Control",
    topicSlug: "infection-control",
    bodySystem: "Infection control",
    system: "infection-control",
    previewSectionCount: 1,
    seoTitle: `${title} | NCLEX-RN | NurseNest`,
    seoDescription: `NCLEX-RN infection control review: ${title} — isolation, PPE, HAI prevention, sepsis escalation, exposures, stewardship, Canada- and US-aligned clinical judgment.`,
    relatedLessonRefs: [
      { slug: "isolation-precautions-in-practice", titleHint: "Isolation precautions" },
      { slug: "sepsis-early-recognition-hy", titleHint: "Sepsis early recognition" },
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
  source: "scripts/generate-rn-infection-control-expansion-catalog.mjs",
  pathways: {
    "ca-rn-nclex-rn": lessons,
    "us-rn-nclex-rn": JSON.parse(JSON.stringify(lessons)),
  },
};

writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log("Wrote", outPath, "lessons:", lessons.length);
