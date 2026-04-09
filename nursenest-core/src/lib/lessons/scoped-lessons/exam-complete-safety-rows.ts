/**
 * Exam-complete **safety family** scoped gold rows (Wave1 bulk shape).
 * Complements {@link HIGH_ALERT_MEDS_GOLD_SLUG} via links—does not duplicate high-alert content.
 */
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { BulkRow } from "@/lib/lessons/scoped-lessons/launch-wave-1-bulk-builder";

const qt = (items: PathwayLessonQuizItem[]) => items;

/** Premium builder requires ≥100 words if `labsDiagnostics` is present; omit with reason instead. */
const SAFETY_FAMILY_LABS_OMIT =
  "Labs and diagnostics are covered in sibling hub lessons and clinical case studies where values drive decisions; this safety-family lesson focuses on procedure, policy, human factors, delegation, and escalation. Reference this lesson’s stable slug in question rationales for cross-study links.";

export const SAFETY_FAMILY_ROWS: BulkRow[] = [
  {
    slug: "safety-family-infection-control-gold",
    shortTitle: "Infection control & standard precautions",
    topic: "Infection control",
    topicSlug: "infection-control",
    bodySystem: "Safety / infection prevention",
    npTitleStem: "Infection prevention — PPE & exposure workup",
    npSeoDescription:
      "NP occupational health themes: needlestick protocols, HIV PEP concepts, and return-to-work—facility policy and stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
**Standard precautions** treat **all blood and body fluids** as potentially infectious. **Transmission-based precautions** add **contact**, **droplet**, and **airborne** layers for specific pathogens. Exams test **hand hygiene moments**, **PPE sequence**, **donning/doffing** without contamination, **needlestick** response, **C. diff** **spore** precautions (contact + soap/water handwashing themes), and **TB airborne** isolation when hinted.

**Why it matters**  
Healthcare-associated infections harm clients and staff. Boards punish **reusing** PPE between rooms, **rushing** doffing, or **delaying** source control when **suspected** **airborne** illness is present.

**Nursing integration**  
Lead **environmental cleaning** cues, **visitor policies**, **immunization** education (influenza themes), and **early isolation** when risk is high.`,
    labsOmitReason: SAFETY_FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **hand hygiene**, **PPE use**, **safe sharps handling**, and **reporting exposures**—avoid **shortcuts** that break technique.`,
    caRpn: `**REx-PN**  
Align with **facility policy** and **college standards**; **objective reporting** of breaches or client deterioration.`,
    usRn: `**NCLEX-RN**  
Expect **outbreak protocols**, **staff education**, and **prioritization** when **multiple** isolation needs compete.`,
    caRn: `**Canada RN**  
Same infection prevention spine; **interprofessional** communication for **precaution changes**.`,
    np: `**NP**  
May include **occupational exposure** pathways, **prophylaxis** decisions, and **public health reporting** themes when hinted.`,
    examRelevance: `Traps: **entering** isolation without **appropriate PPE**, or **minimizing** **needlestick** reporting.`,
    scenario: `**Vignette**  
Client with **profuse diarrhea** and **recent antibiotics**; **C. diff** suspected.

**Fork**  
**Contact precautions** + **soap-and-water** hand hygiene themes—**not** alcohol-only if stem emphasizes spores.`,
    takeaways: `• **Technique > intention** on PPE.  
• Pair with **isolation** lesson and **sepsis** for source control.`,
    related: ["safeIso", "sepsis", "cj", "ham"],
    preTest: qt([
      {
        question: "When is hand hygiene required in standard precautions?",
        options: [
          "Before and after client contact, after touching potentially contaminated surfaces, and per policy moments.",
          "Only at the beginning of shift.",
          "Never after gloves.",
          "Only when visibly soiled.",
        ],
        correct: 0,
        rationale: "Hand hygiene indications are frequent and scenario-based on exams.",
      },
      {
        question: "Why is proper needlestick prevention important?",
        options: [
          "Percutaneous injuries can transmit bloodborne pathogens; prevention and rapid reporting reduce harm.",
          "Needlesticks never matter.",
          "Gloves eliminate all risk.",
          "Recapping is always safe.",
        ],
        correct: 0,
        rationale: "Sharps safety and post-exposure pathways are classic exam content.",
      },
      {
        question: "Which statement reflects contact precautions teaching?",
        options: [
          "Use gown and gloves for direct contact, and follow donning/doffing sequence to avoid self-contamination.",
          "Reuse gowns between clients to save time.",
          "Skip gloves if hands were washed.",
          "PPE is optional for MRSA.",
        ],
        correct: 0,
        rationale: "Contact precautions reduce direct and indirect transmission of pathogens.",
      },
    ]),
    postTest: qt([
      {
        question: "After a needlestick exposure, what is the priority nursing action?",
        options: [
          "Wash the site, report per occupational health policy, and follow exposure protocol for bloodborne pathogens.",
          "Ignore if the needle looked clean.",
          "Wait a week to report.",
          "Squeeze the wound without washing.",
        ],
        correct: 0,
        rationale: "Immediate reporting and protocol-driven evaluation reduce transmission risk.",
      },
      {
        question: "Why might alcohol-based hand rub be insufficient alone for C. difficile precautions in many teaching stems?",
        options: [
          "Spores may require soap-and-water washing—follow facility policy and the stem.",
          "Alcohol always kills spores perfectly.",
          "Hand hygiene never matters.",
          "C. diff is never contagious.",
        ],
        correct: 0,
        rationale: "C. diff spore precautions are a common exam distinction between gel and soap-and-water.",
      },
      {
        question: "What is the nurse’s role in environmental infection control?",
        options: [
          "Ensure equipment is cleaned between clients, follow isolation signage, and communicate breaches promptly.",
          "Ignore room cleaning.",
          "Hide contaminated supplies.",
          "Avoid documenting isolation status.",
        ],
        correct: 0,
        rationale: "Environmental cleaning is a team responsibility tied to transmission prevention.",
      },
    ]),
  },
  {
    slug: "safety-family-isolation-precautions-gold",
    shortTitle: "Isolation & transmission precautions",
    topic: "Isolation precautions",
    topicSlug: "infection-control",
    bodySystem: "Safety / infection prevention",
    npTitleStem: "Isolation — indication & discontinuation themes",
    npSeoDescription:
      "NP infection control themes: when to broaden/narrow precautions, return-to-work, and communication with public health—stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
**Droplet** precautions apply to pathogens spread by **large respiratory droplets** (influenza, meningococcal meningitis themes in some contexts). **Airborne** precautions apply to **small particle** pathogens (TB, measles, varicella). **Contact** protects against **skin, wound, and environmental** contact. Exams test **signage**, **PPE**, **transport** of clients, **room assignments**, and **negative pressure** rooms when applicable.

**Why it matters**  
Wrong isolation wastes resources or **exposes** vulnerable clients—especially **immunocompromised** hosts.

**Nursing integration**  
Coordinate **diagnostics**, **medication administration** safely in isolation, and **teach visitors** about PPE and hand hygiene.`,
    labsOmitReason: SAFETY_FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **PPE adherence**, **transport routes**, and **reporting**—avoid **independent** discontinuation of isolation.`,
    caRpn: `**REx-PN**  
Policy-aligned **collaboration** with **IPAC** teams.`,
    usRn: `**NCLEX-RN**  
Expect **cohorting** decisions, **priority** when multiple clients need isolation resources, and **education**.`,
    caRn: `**Canada RN**  
Same spine; **metric** vitals when shown.`,
    np: `**NP**  
May test **discontinuation criteria** concepts, **workplace restrictions**, and **patient education** for home isolation when applicable.`,
    examRelevance: `Traps: **walking** an **airborne** client through open hallways without a mask/plan, or **using** a **positive pressure** room incorrectly.`,
    scenario: `**Vignette**  
Suspected **TB** with **night sweats** and **cavitary** findings on imaging—**airborne isolation** until ruled out.

**Fork**  
**Fit-tested N95** (where required), **negative pressure** room themes, **follow** IPAC.`,
    takeaways: `• **Airborne vs droplet**—match the pathogen.  
• Pair with **infection control** lesson.`,
    related: ["safeInfx", "sepsis", "cj", "copd"],
    preTest: qt([
      {
        question: "Which pathogens classically require airborne precautions in exam teaching?",
        options: [
          "Measles, varicella, and tuberculosis in many stems—follow signage and policy.",
          "Only urinary tract infections.",
          "Only contact dermatitis.",
          "Only hypertension.",
        ],
        correct: 0,
        rationale: "Airborne isolation targets small particle aerosol spread in classic teaching.",
      },
      {
        question: "Why is transport of an isolated client a high-risk moment?",
        options: [
          "Hallway exposure can occur without proper PPE and route planning.",
          "Transport never risks others.",
          "Masks are never needed.",
          "Isolation is only for paperwork.",
        ],
        correct: 0,
        rationale: "Transport and procedural precautions are frequent exam scenarios.",
      },
      {
        question: "What is a key nursing action for droplet precautions?",
        options: [
          "Use a surgical mask on the client during transport when appropriate and follow PPE policy.",
          "No mask needed ever.",
          "Open doors widely without planning.",
          "Ignore visitors.",
        ],
        correct: 0,
        rationale: "Droplet precautions reduce droplet spread during movement and care.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on contact precautions needs a procedure. What should the nurse ensure?",
        options: [
          "PPE for the procedure, clean equipment, and communication with the procedural team about precautions.",
          "Skip PPE to save time.",
          "Mix clean and dirty supplies.",
          "Ignore allergies.",
        ],
        correct: 0,
        rationale: "Procedural infection control requires coordination and consistent PPE.",
      },
      {
        question: "Why might a negative pressure room matter for airborne isolation?",
        options: [
          "To prevent infectious particles from exiting the room into the corridor—per facility engineering.",
          "Negative pressure rooms increase droplet spread.",
          "Rooms never matter.",
          "Airflow is irrelevant.",
        ],
        correct: 0,
        rationale: "Airborne infection isolation rooms are engineered for containment and safe exhaust.",
      },
      {
        question: "When can isolation precautions be discontinued?",
        options: [
          "Per provider orders and infection prevention criteria based on pathogen and clinical status—follow policy.",
          "Whenever the nurse feels like it.",
          "Immediately after one dose of antibiotic always.",
          "Never discontinue.",
        ],
        correct: 0,
        rationale: "Discontinuation is protocol-driven and pathogen-specific.",
      },
    ]),
  },
  {
    slug: "safety-family-falls-prevention-gold",
    shortTitle: "Falls prevention & safety",
    topic: "Falls prevention",
    topicSlug: "safety",
    bodySystem: "Safety / geriatrics",
    npTitleStem: "Falls — risk assessment & bone health",
    npSeoDescription:
      "NP primary care themes: gait assessment, medication review, vitamin D/calcium counseling, and when to image—stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
Falls stem from **intrinsic** risks (balance, vision, cognition, orthostasis) and **extrinsic** hazards (clutter, poor lighting, slippery floors). **Polypharmacy**—especially **sedatives** and **antihypertensives**—raises risk. Exams test **Morse/STRATIFY** risk tools, **non-skid footwear**, **bed/chair alarms** as adjuncts (not substitutes), **hourly rounding**, **toileting schedules**, and **post-fall** assessment for **bleeding** (especially on anticoagulants).

**Why it matters**  
Falls cause **fractures**, **ICH**, and **fear-avoidance** that worsens mobility. Boards punish **leaving** high-risk clients **unattended** in unsafe situations.

**Nursing integration**  
Implement **environmental safety**, **assistive devices**, **PT/OT** collaboration, and **family education** on home hazards.`,
    labsOmitReason: SAFETY_FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **keeping call light within reach**, **safe transfers**, **reporting hazards**, and **reinforcing teaching**—avoid **unsafe transfers** alone.`,
    caRpn: `**REx-PN**  
Collaboration for **mobility aids** and **clear documentation** after falls.`,
    usRn: `**NCLEX-RN**  
Expect **prioritization** with **multiple clients** and **post-fall neuro checks** when head injury suspected.`,
    caRn: `**Canada RN**  
Same spine with **interprofessional** clarity.`,
    np: `**NP**  
May test **bone health**, **medication deprescribing concepts**, **home safety** referrals, and **when to image** after minor head injury.`,
    examRelevance: `Traps: **reassuring** without reassessment after fall, or **using** **restraints** as first-line instead of **risk reduction**.`,
    scenario: `**Vignette**  
Older adult on **warfarin** falls, hits **head**, **GCS 15** but **new headache**.

**Fork**  
**Neuro checks**, **notify provider**, **prepare** for **imaging** per protocol—**not** “just observe.”`,
    takeaways: `• **Anticoagulation + head strike** = high stakes.  
• Pair with **medAnticoag** and **escalation** lessons.`,
    related: ["medAnticoag", "safeEscal", "cj", "ham"],
    preTest: qt([
      {
        question: "Which intervention reduces fall risk in hospitalized older adults?",
        options: [
          "Clear pathways, adequate lighting, non-skid footwear, and assistive devices as needed.",
          "Clutter the room for convenience.",
          "Remove all walking aids to encourage independence.",
          "Turn off all lights at night.",
        ],
        correct: 0,
        rationale: "Environmental modification is a foundational falls prevention strategy.",
      },
      {
        question: "Why might bed alarms be insufficient alone for fall prevention?",
        options: [
          "They are adjuncts; staffing response and mobility plans still matter.",
          "Alarms guarantee safety.",
          "Alarms replace supervision.",
          "Alarms prevent all falls.",
        ],
        correct: 0,
        rationale: "Alarms are adjuncts; holistic care plans address root causes.",
      },
      {
        question: "What should be assessed first after a witnessed fall?",
        options: [
          "Injury, neuro status, vitals, and bleeding risk—per protocol.",
          "Immediately ambulate the client alone.",
          "Ignore the fall if they stand up.",
          "Finish charting first always.",
        ],
        correct: 0,
        rationale: "Immediate assessment after falls prioritizes life threats and injury.",
      },
    ]),
    postTest: qt([
      {
        question: "A client on anticoagulants falls and hits their head. What is a priority concern?",
        options: [
          "Intracranial bleeding risk—follow neuro checks and provider orders for imaging/observation.",
          "Ignore because they talk normally.",
          "Apply heat to the head.",
          "Give aspirin without orders.",
        ],
        correct: 0,
        rationale: "Head trauma on anticoagulation is a high-risk scenario requiring evaluation.",
      },
      {
        question: "Why review sedating medications in fall risk assessment?",
        options: [
          "Sedation and orthostasis increase fall risk—coordinate deprescribing with provider when appropriate.",
          "Sedatives never affect falls.",
          "Only antibiotics matter.",
          "Pain meds never sedate.",
        ],
        correct: 0,
        rationale: "Polypharmacy review is a core falls prevention strategy.",
      },
      {
        question: "What education helps at home after discharge for fall-risk clients?",
        options: [
          "Remove throw rugs, grab bars in bathroom, good lighting, and footwear with non-skid soles.",
          "Encourage clutter for exercise.",
          "Avoid follow-up.",
          "Ignore vision changes.",
        ],
        correct: 0,
        rationale: "Home safety education reduces recurrent falls.",
      },
    ]),
  },
  {
    slug: "safety-family-restraints-alternatives-gold",
    shortTitle: "Restraints & least-restrictive alternatives",
    topic: "Restraints",
    topicSlug: "safety",
    bodySystem: "Safety / ethics",
    npTitleStem: "Restraints — indications & monitoring",
    npSeoDescription:
      "NP themes: chemical restraint minimization, capacity, and documentation of less-restrictive attempts—facility policy and stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
**Restraints** (physical/chemical) restrict **freedom of movement** to **prevent harm** when **less restrictive** options fail. Exams test **indications**, **time limits**, **continuous monitoring**, **orders renewal**, **skin checks**, **toileting**, and **alternatives** (1:1 sitter, **bed lowered**, **environmental**, **delirium** management). **Chemical restraint** is **sedation for behavior control**—distinct from treating underlying conditions.

**Why it matters**  
Restraints increase **aspiration**, **pressure injury**, **deconditioning**, and **trauma**. Boards punish **convenience restraints** and **missing** orders.

**Nursing integration**  
Document **behaviors**, **interventions attempted**, **provider notification**, and **frequent reassessment**—release as soon as safe.`,
    labsOmitReason: SAFETY_FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **safety** within **policy**, **never** restraining without order, **monitoring** and **reporting** complications.`,
    caRpn: `**REx-PN**  
**College-aligned** scope; **collaborative** approach to de-escalation.`,
    usRn: `**NCLEX-RN**  
Expect **ethical** questions, **1:1** vs restraint tradeoffs, and **ED/ICU** contexts.`,
    caRn: `**Canada RN**  
Same prioritization; **rights-based** language.`,
    np: `**NP**  
May test **capacity** and **least restrictive** planning in psychiatric contexts—**policy** heavy.`,
    examRelevance: `Traps: **restraint** for **staff convenience**, **no order**, or **no monitoring** of restrained client.`,
    scenario: `**Vignette**  
Agitated client pulling at **lines**; **order** for **soft wrist restraints** after **less restrictive** attempts documented.

**Fork**  
**Q15 checks**, **skin**, **circulation**, **toileting**, **release** criteria per policy.`,
    takeaways: `• **Restraint = last resort** with monitoring.  
• Pair with **mental health casebook** and **high-alert** meds.`,
    related: ["cj", "ham", "safeEscal", "medPsych"],
    preTest: qt([
      {
        question: "What is required before applying restraints in most exam scenarios?",
        options: [
          "Provider order, documented indication, and monitoring plan per policy.",
          "Nurse discretion alone without order.",
          "Restraints for convenience.",
          "Permanent restraint without reassessment.",
        ],
        correct: 0,
        rationale: "Restraints require orders and policy-driven monitoring.",
      },
      {
        question: "Which alternative is often preferred before physical restraints?",
        options: [
          "1:1 observation, environmental modifications, de-escalation, and treating underlying causes like pain or hypoxia.",
          "Ignoring agitation.",
          "Increasing stimulation.",
          "Leaving the client alone in a busy hallway.",
        ],
        correct: 0,
        rationale: "Least restrictive alternatives are central to ethical restraint use.",
      },
      {
        question: "Why must restrained clients be monitored frequently?",
        options: [
          "To prevent pressure injury, neurovascular compromise, and respiratory depression.",
          "Monitoring is optional.",
          "Restraints are always safe without checks.",
          "Skin checks never matter.",
        ],
        correct: 0,
        rationale: "Frequent monitoring mitigates restraint risks.",
      },
    ]),
    postTest: qt([
      {
        question: "A restrained client becomes more sleepy after PRN antipsychotic. What is the priority?",
        options: [
          "Assess airway, breathing, oxygenation, and follow sedation monitoring protocols; notify provider if oversedation.",
          "Ignore sedation if behavior improved.",
          "Tighten restraints more.",
          "Leave the room for an hour.",
        ],
        correct: 0,
        rationale: "Chemical restraint and sedation can cause respiratory compromise.",
      },
      {
        question: "What documentation is important with restraint use?",
        options: [
          "Behaviors, alternatives attempted, order, time applied, reassessment times, and skin/neurovascular checks.",
          "No documentation needed.",
          "Only the client’s favorite color.",
          "Only vitals once per day.",
        ],
        correct: 0,
        rationale: "Documentation supports legal/ethical standards and continuity of care.",
      },
      {
        question: "When should restraints be discontinued?",
        options: [
          "As soon as the client can be safely managed with less restrictive measures—per reassessment and orders.",
          "Never discontinue.",
          "Only at discharge always.",
          "After 24 hours automatically without assessment.",
        ],
        correct: 0,
        rationale: "Restraints should be reassessed and removed as soon as safe.",
      },
    ]),
  },
  {
    slug: "safety-family-medication-administration-gold",
    shortTitle: "Medication administration & error prevention",
    topic: "Medication administration",
    topicSlug: "medication-safety",
    bodySystem: "Safety / pharmacology",
    npTitleStem: "Med admin — reconciliation & e-prescribing safety",
    npSeoDescription:
      "NP themes: med reconciliation at transitions, duplicate therapy, and patient literacy—complements high-alert medication safety.",
    sharedCore: `**Mechanism & exam framing**  
Safe administration rests on **rights** (patient, medication, dose, route, time, documentation), **barcode scanning** when available, **independent double-checks** for high-risk meds, **allergy verification**, and **liquid measurement** accuracy. **LASA** (look-alike/sound-alike) errors are classic board traps. **Transcription** errors and **decimal** mistakes (e.g., insulin units) cause **10-fold** overdoses.

**Why it matters**  
Medication errors are a **leading preventable harm**. Exams test **refusal** protocols, **crushing** rules, **tube feeding holds**, and **IV compatibility**.

**Nursing integration**  
Teach **open communication** about **what** each medication is for, **how** to take it, and **when** to call for side effects—without replacing the provider’s plan.`,
    labsOmitReason: SAFETY_FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **five/six rights**, **reporting near misses**, and **safe preparation**—avoid **independent** changes.`,
    caRpn: `**REx-PN**  
**Double-check** culture when required; **collaboration** with pharmacy.`,
    usRn: `**NCLEX-RN**  
Expect **med reconciliation** at admission/discharge, **patient education**, and **delegation** to PN correctly.`,
    caRn: `**Canada RN**  
Same spine; **metric** dosing when shown.`,
    np: `**NP**  
May test **e-prescribing** safety, **tapering** plans, and **patient education** for complex regimens.`,
    examRelevance: `Traps: **administering** based on **verbal** order from wrong person, **crushing** **enteric-coated** meds, or **ignoring** **allergy band**.`,
    scenario: `**Vignette**  
Two similar names on the unit; **wrong medication** almost given.

**Fork**  
**Two identifiers**, **barcode**, **stop** when mismatch—**near miss** reporting.`,
    takeaways: `• **Verify identity every time**.  
• Pair with **high-alert medications** and **medication** family lessons.`,
    related: ["ham", "safeDeleg", "cj", "medPain"],
    preTest: qt([
      {
        question: "Which practice reduces LASA medication errors?",
        options: [
          "Tall-man lettering, separate storage, barcode scanning, and independent double-checks when required.",
          "Storing look-alike vials next to each other.",
          "Skipping scanning when busy.",
          "Using only first names.",
        ],
        correct: 0,
        rationale: "LASA error prevention is a standard exam topic.",
      },
      {
        question: "Why is the ‘second nurse check’ used for some high-risk medications?",
        options: [
          "Independent verification reduces wrong-dose and wrong-patient errors.",
          "It is only for convenience.",
          "It replaces the first nurse.",
          "It is never needed.",
        ],
        correct: 0,
        rationale: "Double-checks are common for insulin, heparin, chemo, and other high-risk meds.",
      },
      {
        question: "What should the nurse do if a client refuses a medication?",
        options: [
          "Assess reason, follow rights, notify provider, and document—do not force PO meds outside policy.",
          "Force medications always.",
          "Ignore refusal.",
          "Hide meds in food without consent/policy.",
        ],
        correct: 0,
        rationale: "Rights-based care and policy-driven responses are tested alongside safety.",
      },
    ]),
    postTest: qt([
      {
        question: "A medication is ordered for the wrong route. What should the nurse do?",
        options: [
          "Clarify with the provider before administering; do not assume.",
          "Change route independently.",
          "Administer IV into a peripheral line without checking.",
          "Skip documentation.",
        ],
        correct: 0,
        rationale: "Clarifying ambiguous or unsafe orders prevents route errors.",
      },
      {
        question: "Why is accurate insulin unit measurement critical?",
        options: [
          "Small errors can cause large glucose changes—use correct syringe (U-100 vs U-500 contexts) per order.",
          "Units never matter.",
          "Insulin is harmless.",
          "Any syringe works.",
        ],
        correct: 0,
        rationale: "Insulin dosing errors are common and dangerous.",
      },
      {
        question: "What is the best action after a medication error reaches the client?",
        options: [
          "Assess the client, notify provider, follow facility policy, monitor, and document—support transparent reporting.",
          "Hide the error.",
          "Blame the patient.",
          "Ignore monitoring.",
        ],
        correct: 0,
        rationale: "Transparent reporting and monitoring mitigate harm after errors.",
      },
    ]),
  },
  {
    slug: "safety-family-delegation-supervision-gold",
    shortTitle: "Delegation & supervision",
    topic: "Delegation",
    topicSlug: "delegation",
    bodySystem: "Safety / leadership",
    npTitleStem: "Delegation — NP vs RN scope in teams",
    npSeoDescription:
      "NP leadership themes: team communication, scope clarity, and supervision of staff—distinct from Canadian RPN scope lesson but complementary.",
    sharedCore: `**Mechanism & exam framing**  
**Delegation** assigns **tasks** to appropriate personnel by **scope**, **stability**, and **predictability**. The **RN** remains accountable for **nursing judgment** delegated to **PN/UAP** when allowed. Exams test **what cannot be delegated** (assessment, teaching, planning in many contexts), **supervision** after delegation, and **5 rights of delegation** (right task, circumstance, person, direction/communication, supervision).

**Why it matters**  
Unsafe delegation increases **errors** and **falls**. Boards punish **delegating unstable** clients to **UAP** or **assigning** **assessment** tasks beyond scope.

**Nursing integration**  
Provide **clear instructions**, **expected outcomes**, **timelines**, and **follow-up**; escalate when **conditions change**.`,
    labsOmitReason: "Labs/diagnostics are not central to delegation teaching; this lesson focuses on scope, supervision, and task selection.",
    pn: `**NCLEX-PN**  
Know what you **may** receive as delegated tasks and **when** to **refuse** or **seek clarification** if outside scope or unstable.`,
    caRpn: `**REx-PN**  
Pair with **Canadian RPN scope** lesson: **college standards** and **employer policy** define **what** can be delegated to you.`,
    usRn: `**NCLEX-RN**  
Expect **multiple-patient** assignments with **prioritization** and **delegation** of **stable** tasks only.`,
    caRn: `**Canada RN**  
Same delegation spine with **interprofessional** clarity.`,
    np: `**NP**  
May test **supervision** of clinic staff, **standing orders**, and **collaborative practice agreements**—**stem-dependent**.`,
    examRelevance: `Traps: **delegating** **vital assessment** of a **newly unstable** client to **UAP**, or **no follow-up** after delegation.`,
    scenario: `**Vignette**  
Post-op day 1 **tachycardic** with **dropping BP**; UAP asks to **take vitals** and **report**.

**Fork**  
**RN assesses** instability; **UAP** does not replace **nursing judgment** for **unstable** clients.`,
    takeaways: `• **Stability** determines delegation.  
• Pair with **Canadian RPN** and **clinical judgment** lessons.`,
    related: ["rpnScope", "cj", "safeEscal", "safePrior"],
    preTest: qt([
      {
        question: "Which task is generally inappropriate to delegate to a UAP in a newly unstable client?",
        options: [
          "Initial assessment and clinical judgment of deteriorating vitals—RN responsibility.",
          "Bed making for a stable client.",
          "Ambulate a stable client per plan.",
          "Obtain routine I&O measurements when stable.",
        ],
        correct: 0,
        rationale: "Unstable clients require RN assessment and prioritization beyond UAP scope.",
      },
      {
        question: "What must the nurse provide when delegating?",
        options: [
          "Clear instructions, expected outcomes, supervision, and follow-up.",
          "Vague tasks without timelines.",
          "No follow-up.",
          "Unlimited tasks without assessment.",
        ],
        correct: 0,
        rationale: "The five rights of delegation include communication and supervision.",
      },
      {
        question: "Why can delegation be unsafe during rapid client deterioration?",
        options: [
          "The situation requires RN assessment and intervention beyond routine tasks.",
          "Delegation is always safe.",
          "UAP can diagnose.",
          "Vitals never change.",
        ],
        correct: 0,
        rationale: "Changing conditions require reassessment and may revoke delegation appropriateness.",
      },
    ]),
    postTest: qt([
      {
        question: "A PN asks if they can titrate a heparin drip independently. What is the best RN response?",
        options: [
          "Clarify scope and orders; heparin titration is typically not an independent PN scope action—follow policy and stem.",
          "Encourage independent titration without orders.",
          "Ignore the question.",
          "Assume yes always.",
        ],
        correct: 0,
        rationale: "High-risk medications require protocol and scope clarity.",
      },
      {
        question: "What is the RN’s responsibility after delegating a task?",
        options: [
          "Follow up, evaluate outcomes, and intervene if the client’s condition changes.",
          "No responsibility after delegation.",
          "Only document if something goes wrong.",
          "Delegate everything permanently.",
        ],
        correct: 0,
        rationale: "The delegating nurse retains accountability for appropriate supervision.",
      },
      {
        question: "Which factor supports delegation of a task to a UAP?",
        options: [
          "The task is stable, predictable, within policy, and within the assistant’s training.",
          "The nurse is busy.",
          "The client is unstable.",
          "The task requires nursing diagnosis.",
        ],
        correct: 0,
        rationale: "Stability and predictability are key delegation criteria.",
      },
    ]),
  },
  {
    slug: "safety-family-escalation-notification-gold",
    shortTitle: "Escalation & when to notify",
    topic: "Escalation & reporting",
    topicSlug: "safety",
    bodySystem: "Safety / communication",
    npTitleStem: "Escalation — urgent comms & safety netting",
    npSeoDescription:
      "NP themes: when to send to ED, curbside vs formal consult, and documentation of critical communications—stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
Escalation is **closing the loop** between **abnormal data** and **timely response**: **rapid response**, **provider notification**, **MET activation**, **code** when criteria are met. Exams test **SBAR**, **objective reporting**, **avoiding delay** for **routine tasks** when **vitals** are unstable, and **chain of command** when needed.

**Why it matters**  
Delayed escalation kills—**sepsis**, **MI**, **stroke**, **bleeding**, **respiratory failure**.

**Nursing integration**  
**Call early** with **trends**, **repeat vitals**, **prepare** for orders (labs, ECG, imaging), and **stay** with unstable clients.`,
    labsOmitReason: SAFETY_FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **prompt reporting** to RN/provider with **objective data**—avoid **silent fixes**.`,
    caRpn: `**REx-PN**  
**Collaborative** escalation with **clear documentation**.`,
    usRn: `**NCLEX-RN**  
Expect **rapid response** leadership roles and **family communication** during crises.`,
    caRn: `**Canada RN**  
Same prioritization spine.`,
    np: `**NP**  
May test **when to direct to ED** or **activate EMS** in ambulatory care—**stem-scoped**.`,
    examRelevance: `Traps: **finishing charting** before **calling** for **symptomatic bradycardia**, or **minimizing** **neuro changes**.`,
    scenario: `**Vignette**  
**SpO₂ 84%** on **4 L**, **RR 34**, **new confusion**.

**Fork**  
**Escalate now**—oxygen, **monitor**, **notify**, **prepare** for higher-level care.`,
    takeaways: `• **Trend + trajectory** beat a single “okay” number.  
• Pair with **clinical judgment** gold.`,
    related: ["cj", "ham", "shock", "sepsis"],
    preTest: qt([
      {
        question: "What is the first priority when you notice a sudden change in level of consciousness?",
        options: [
          "Assess airway, breathing, circulation, and activate emergency help per policy when criteria are met.",
          "Finish documentation first.",
          "Leave to get coffee.",
          "Tell the client to sleep it off.",
        ],
        correct: 0,
        rationale: "ABC and early escalation are priorities for acute neuro changes.",
      },
      {
        question: "Why use SBAR when calling a provider?",
        options: [
          "It communicates situation, background, assessment, and recommendation clearly and quickly.",
          "It replaces all assessments.",
          "It is only for billing.",
          "It is never used in hospitals.",
        ],
        correct: 0,
        rationale: "Structured handoff communication reduces errors in urgent scenarios.",
      },
      {
        question: "When should the nurse activate rapid response?",
        options: [
          "When client meets facility criteria for acute deterioration—often vitals, neuro, or perfusion thresholds.",
          "Never.",
          "Only at shift change.",
          "Only if the family asks.",
        ],
        correct: 0,
        rationale: "Rapid response systems exist to bring expertise to the bedside early.",
      },
    ]),
    postTest: qt([
      {
        question: "A client’s BP is 78/48 with altered mental status. What is the best immediate nursing action?",
        options: [
          "Activate emergency response per policy, stabilize airway/breathing/circulation, and notify provider.",
          "Encourage oral fluids only.",
          "Wait for routine rounds.",
          "Send the client to walk.",
        ],
        correct: 0,
        rationale: "Hypotension with altered mentation is a life-threatening emergency.",
      },
      {
        question: "Why is repeating vitals important during escalation?",
        options: [
          "Trends show response to interventions and guide next steps.",
          "Vitals never change.",
          "One set is always enough.",
          "Trends are irrelevant.",
        ],
        correct: 0,
        rationale: "Trajectory assessment is central to emergency nursing care.",
      },
      {
        question: "What should be included in urgent provider notification?",
        options: [
          "Current vitals, recent changes, recent interventions, and what you need next.",
          "Only the client’s name.",
          "Vague statements without numbers.",
          "Personal opinions only.",
        ],
        correct: 0,
        rationale: "Objective data and clear requests improve timely medical decision-making.",
      },
    ]),
  },
  {
    slug: "safety-family-prioritization-uncertainty-gold",
    shortTitle: "Prioritization under uncertainty",
    topic: "Prioritization under uncertainty",
    topicSlug: "prioritization",
    bodySystem: "Safety / clinical judgment",
    npTitleStem: "Uncertainty — differential breadth & safety netting",
    npSeoDescription:
      "NP themes: shared decision-making, watchful waiting vs workup, and documentation when diagnosis is unclear—stem-scoped.",
    sharedCore: `**Mechanism & exam framing**  
Uncertainty is normal; **boards** test whether you **manage risk** with **assessment**, **monitoring**, **time-bound** follow-up, and **escalation** when **red flags** appear. Frameworks: **ABCs** first, **Maslow** for non-urgent vs urgent, **safety** over **comfort**, and **stable vs unstable** sorting. **Therapeutic relationship** does not replace **objective data**.

**Why it matters**  
**Analysis paralysis** and **false reassurance** both harm. The exam rewards **structured** thinking: **what is the worst plausible risk**, **what disproves it**, **what would change management**.

**Nursing integration**  
**Cluster care** without delaying **unstable** findings; **communicate uncertainty** clearly to the team and client with **specific return precautions**.`,
    labsOmitReason: SAFETY_FAMILY_LABS_OMIT,
    pn: `**NCLEX-PN**  
Emphasize **reporting** when uncertain, **stable execution** within orders, and **avoiding** scope creep.`,
    caRpn: `**REx-PN**  
**Collaborative** approach to uncertainty with **college-aligned** boundaries.`,
    usRn: `**NCLEX-RN**  
Expect **multiple clients** with **competing** needs and **ambiguous** stems.`,
    caRn: `**Canada RN**  
Same prioritization spine.`,
    np: `**NP**  
May test **shared decision-making**, **risk communication**, and **documentation** of **differential** considerations when appropriate.`,
    examRelevance: `Traps: **choosing** a **comfort measure** when **vitals** are unstable, or **delaying** notification for **ambiguous** but **worrisome** symptoms.`,
    scenario: `**Vignette**  
New **abdominal pain** with **vague** history, **vitals stable**, but **peritoneal** signs hinted.

**Fork**  
Do not **reassure** through **peritoneal** signs—**escalate** evaluation per provider pathway.`,
    takeaways: `• **Worst-first** thinking under uncertainty.  
• Pair with **clinical judgment** gold.`,
    related: ["cj", "safeEscal", "safeDeleg", "stroke"],
    preTest: qt([
      {
        question: "Which principle helps prioritize when multiple clients need care?",
        options: [
          "Address life threats and unstable vitals before routine tasks.",
          "Always finish paperwork first.",
          "Help the loudest client first regardless of risk.",
          "Ignore abnormal vitals if the client is young.",
        ],
        correct: 0,
        rationale: "Airway, breathing, circulation, and instability outrank routine priorities.",
      },
      {
        question: "Which statement reflects safe management of uncertainty?",
        options: [
          "Monitor closely, communicate clearly, and escalate when red flags appear—per orders.",
          "Ignore abnormal vitals if the client looks comfortable.",
          "Never reassess.",
          "Always diagnose independently.",
        ],
        correct: 0,
        rationale: "Monitoring and escalation pathways are core safety behaviors.",
      },
      {
        question: "Why is ‘treating the worst plausible emergency first’ useful in exams?",
        options: [
          "It prevents missing time-sensitive conditions hidden in vague stems.",
          "It ignores all data.",
          "It only applies to pediatrics.",
          "It replaces assessment.",
        ],
        correct: 0,
        rationale: "Exam writers embed subtle instability that requires worst-case vigilance.",
      },
    ]),
    postTest: qt([
      {
        question: "A client has vague symptoms but new neuro deficits. What is the priority?",
        options: [
          "Treat as time-sensitive until proven otherwise—activate emergency assessment and follow stroke protocols when applicable.",
          "Schedule next month.",
          "Assume anxiety without assessment.",
          "Send home alone.",
        ],
        correct: 0,
        rationale: "Neurologic deficits require urgent evaluation in many exam vignettes.",
      },
      {
        question: "What is the best approach when two answers seem partly correct?",
        options: [
          "Choose the option that addresses the highest-risk problem first and matches your role in the stem.",
          "Pick the longest answer always.",
          "Pick randomly.",
          "Always choose comfort measures.",
        ],
        correct: 0,
        rationale: "Prioritization under uncertainty targets risk reduction and scope alignment.",
      },
      {
        question: "Why are return precautions important when diagnosis is uncertain?",
        options: [
          "They give clients specific triggers to seek urgent care if symptoms worsen.",
          "They replace medical evaluation.",
          "They guarantee diagnosis.",
          "They are never needed.",
        ],
        correct: 0,
        rationale: "Safety netting is a core ambulatory and discharge teaching point.",
      },
    ]),
  },
];
