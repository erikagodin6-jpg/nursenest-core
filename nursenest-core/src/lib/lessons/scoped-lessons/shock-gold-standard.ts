/**
 * Shock recognition & stabilization support — types, perfusion, escalation beyond sepsis alone.
 * Remediation wave 3: cardiovascular / perfusion + physiological adaptation.
 */
import type { PathwayLessonQuizItem, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export const SHOCK_GOLD_SLUG = "shock-emergencies-gold" as const;

type ShockVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, ShockVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**Shock as perfusion failure**  
Shock means **inadequate tissue perfusion** relative to metabolic need. Exams cluster **hypotension (or relative hypotension)**, **tachycardia**, **altered mentation**, **oliguria**, **cool/clammy or warm/flushed skin** (depending on type), **lactate** when shown, and **rising oxygen needs**. Nursing rewards **early recognition**, **ABC support**, **large-bore access when ordered**, **fluid/blood product administration per protocol**, **vasopressor safety**, and **frequent reassessment**—not “single vital normal = stable.”

**Types (exam forks)**  
• **Hypovolemic/hemorrhagic**: bleeding, dehydration, burns—fluids/blood per orders; control external bleeding with pressure.  
• **Cardiogenic**: cold, clammy, JVD, pulmonary congestion cues, poor cardiac output—avoid fluid boluses that worsen overload unless stem says otherwise.  
• **Obstructive**: tension pneumothorax, massive PE, tamponade—stems test **recognition + activation**, not DIY needle decompression unless protocol-trained in item.  
• **Distributive**: **septic**, **anaphylactic**, **neurogenic**—warm flushed skin may appear in some distributive pictures; **vasopressor titration** and **source control** themes accompany sepsis.

**Monitoring & safety**  
Trend **MAP/BP**, **HR**, **RR**, **SpO₂**, **UOP**, **mental status**, **skin**, **cap refill**, **bleeding** on anticoagulation, and **infusion site** integrity for vasopressors.`;

function pack(
  variant: ShockVariant,
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

const VARIANTS: Record<ShockVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "Shock cues & perfusion support (NCLEX-PN, US)",
      seoTitle: "Shock recognition | NCLEX-PN US | NurseNest",
      seoDescription: "US PN: hypovolemic vs cardiogenic cues, stay-with-client, fluids per order, and rapid escalation.",
      clinical_meaning: `**PN scope**  
You **recognize patterns**, **stay with unstable clients**, **obtain vitals and I&O**, **administer IV fluids/blood per order**, **support oxygen**, **elevate legs only when appropriate per stem**, and **notify RN** immediately when perfusion worsens. You **do not** independently titrate vasopressors unless the item defines extended IV therapy competency.`,
      exam_relevance: `Traps: **routine meds** during **MAP crashing**, **giving large fluid boluses** when stem screams **cardiogenic pulmonary edema**, or **ignoring** **anaphylaxis** after new medication. Items test **type awareness** at a **nursing exam** depth.`,
      clinical_scenario: `**Vignette — med-surg**  
Post-op client **pale**, **tachycardic**, **BP dropping**, **dressing soaked**; earlier stable.

**Fork**  
**Apply pressure**, **notify RN**, **prepare for ordered fluids/blood**, **monitor vitals frequently**—not “finish the group exercise class.”`,
      takeaways: `• **Trends** trump one “okay” reading minutes ago.  
• **Bleeding + tachycardia + hypotension** = hemorrhagic shock pattern until proven otherwise.  
• **Scope**: execute orders, report, support—do not improvise pressor doses.`,
    },
    {
      preTest: [
        {
          question: "Which client should the PN report first?",
          options: [
            "Stable ambulating client.",
            "Client with hypotension, tachycardia, cool clammy skin, and decreased urine output.",
            "Client requesting nail trim, stable.",
            "Client reading, asymptomatic.",
          ],
          correct: 1,
          rationale: "Classic shock perfusion cluster requires immediate RN/provider attention and monitoring.",
        },
        {
          question: "After bee sting, client has stridor, hypotension, and hives. PN thinks?",
          options: [
            "Seasonal cold.",
            "Anaphylactic shock concern—emergency activation and epinephrine per protocol/order.",
            "Ignore stridor.",
            "Give oral diphenhydramine only always.",
          ],
          correct: 1,
          rationale: "Airway compromise with hypotension and urticaria is anaphylaxis until treated.",
        },
        {
          question: "Why monitor urine output in shock concern?",
          options: [
            "It is irrelevant.",
            "Kidney perfusion falls early—oliguria signals worsening shock.",
            "It replaces blood pressure.",
            "Only pediatrics need I&O.",
          ],
          correct: 1,
          rationale: "UOP reflects end-organ perfusion in shock teaching.",
        },
      ],
      postTest: [
        {
          question: "Which finding better fits cardiogenic than hypovolemic shock in exam stems?",
          options: [
            "Dry mucosa with clear lungs.",
            "Crackles, JVD, cool extremities with low cardiac output picture.",
            "Massive external hemorrhage.",
            "Heat stroke only.",
          ],
          correct: 1,
          rationale: "Pulmonary congestion with poor forward flow suggests cardiogenic shock pattern.",
        },
        {
          question: "PN notes norepinephrine IV site blanching and pain. Action?",
          options: [
            "Ignore.",
            "Stop infusion per policy, notify RN, assess extravasation risk—vasopressors are tissue-toxic.",
            "Speed up infusion.",
            "Move patient to chair unsupervised.",
          ],
          correct: 1,
          rationale: "Vasopressor extravasation is an emergency pattern requiring protocol-driven response.",
        },
        {
          question: "Why might neurogenic shock present differently than septic shock?",
          options: [
            "They are always identical.",
            "Neurogenic may show bradycardia with hypotension after spinal injury—warm dry skin early.",
            "Neurogenic always has fever.",
            "Septic shock never has tachycardia.",
          ],
          correct: 1,
          rationale: "Spinal shock patterns are distinct high-yield exam contrasts.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "Shock cues & perfusion support (REx-PN, Canada)",
      seoTitle: "Shock recognition | REx-PN Canada | NurseNest",
      seoDescription: "Canadian PN: metric vitals, hemorrhagic and anaphylaxis forks, collaboration, and infusion safety.",
      clinical_meaning: `**RPN**  
Use **SI labs** and **mmHg BP** carefully in stems. Your role is **continuous observation**, **accurate I&O**, **ordered fluid/blood support**, **oxygen therapy per order**, and **immediate escalation** when **perfusion declines**—with **clear SBAR-style** reporting to RN/NP/physician.`,
      exam_relevance: `Canadian items still punish **delay** for **routine tasks** when **MAP is falling** and reward **interprofessional activation**. Watch **scope**: **no independent vasopressor titration** unless extended role is explicit in the stem.`,
      clinical_scenario: `**Vignette**  
Client **MAP 58 mmHg**, **HR 122**, **lactate 4.2 mmol/L** in lab strip, **mottled skin** after suspected infection.

**Fork**  
Escalate sepsis/shock pathway elements per orders; increase monitoring frequency; do not defer for non-urgent care.`,
      takeaways: `• **Lactate + hypotension + infection** cues activate sepsis/shock teaching together.  
• **Document trends** and **exact times** for handoff.  
• **Anaphylaxis** and **hemorrhage** are shock types you must not confuse with “anxiety.”`,
    },
    {
      preTest: [
        {
          question: "Which finding should prompt immediate RPN notification?",
          options: [
            "Stable BP after fluids.",
            "Sudden confusion with hypotension and rising heart rate after GI bleed history.",
            "Client finished lunch.",
            "Normal SpO₂ on RA without symptoms.",
          ],
          correct: 1,
          rationale: "Altered perfusion with hemorrhage context is an emergency escalation pattern.",
        },
        {
          question: "Why is Trendelenburg not always correct in shock items?",
          options: [
            "Position never matters.",
            "Some shock types (e.g., cardiogenic respiratory failure) worsen with certain positions—follow orders.",
            "Always contraindicated for everyone.",
            "Only for children.",
          ],
          correct: 1,
          rationale: "Positioning must match physiology and orders in exam vignettes.",
        },
        {
          question: "RPN role during rapid transfusion protocol support includes?",
          options: [
            "Choosing blood type independently.",
            "Monitoring vitals, watching for transfusion reactions, and reporting changes per policy.",
            "Stopping transfusion silently without telling anyone.",
            "Skipping identity checks.",
          ],
          correct: 1,
          rationale: "Reaction surveillance and communication are core nursing responsibilities during blood support.",
        },
      ],
      postTest: [
        {
          question: "Which symptom cluster suggests obstructive shock from tension pneumothorax?",
          options: [
            "Bilateral clear breath sounds.",
            "Sudden hypotension, distended neck veins, unilateral absent breath sounds, tracheal shift if described.",
            "Warm flushed skin only always.",
            "Isolated ankle edema.",
          ],
          correct: 1,
          rationale: "Obstructive shock from tension PTX is a classic recognition item.",
        },
        {
          question: "Why warm blankets alone are insufficient in shock teaching?",
          options: [
            "Comfort never matters.",
            "Perfusion failure needs medical therapy and monitoring—warmth is adjunct, not treatment of cause.",
            "Blankets fix all shock.",
            "Only hypothermia exists.",
          ],
          correct: 1,
          rationale: "Treat underlying shock type and follow orders; comfort measures are supportive.",
        },
        {
          question: "Best documentation during shock resuscitation?",
          options: [
            "Patient fine.",
            "Serial vitals, interventions, responses, I&O, and mental status with timestamps.",
            "Only initial BP once.",
            "Guess numbers.",
          ],
          correct: 1,
          rationale: "Objective trending supports safe handoffs and legal standards.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "Shock resuscitation: RN acute management (NCLEX-RN, US)",
      seoTitle: "Shock nursing care | NCLEX-RN US | NurseNest",
      seoDescription: "NCLEX-RN: fluid responsiveness, vasopressor titration per protocol, cardiogenic vs septic forks, transfusion.",
      clinical_meaning: `**RN**  
You **prioritize** among patients when **one is in shock**, **establish/maintain access**, **administer boluses/blood per protocol**, **titrate vasopressors** when authorized, **monitor lactate/ScvO₂** if stem includes advanced monitoring, **recognize refractory shock** (add second pressor, steroids in septic refractory per Surviving Sepsis teaching), and **stop harmful fluids** in **cardiogenic** pictures.`,
      exam_relevance: `Forks: **which shock type**, **first vasopressor** in septic shock teaching, **fluid choice** in hemorrhage, **DO NOT** fluid overload in **flash pulmonary edema**, **anaphylaxis** epinephrine IM vs IV per scenario, **PE/obstructive** activation.`,
      clinical_scenario: `**Vignette — ICU step-down**  
Septic client on **norepinephrine**; **MAP still <65** after fluid bolus per protocol.

**Fork**  
Follow **second-line vasopressor** teaching in item (e.g., vasopressin) and **notify provider**—not “keep bolusing forever” if refractory pattern.`,
      takeaways: `• **MAP goals** and **UOP** track resuscitation response.  
• **Type-specific** therapy: fluids vs inotropes vs drainage vs antihistamines/pressors.  
• **Delegation**: stable tasks out; unstable needs RN eyes.`,
    },
    {
      preTest: [
        {
          question: "Which client should the RN assess first?",
          options: [
            "Stable client due for routine dressing change.",
            "Client with MAP 55, lactate rising, mottled skin after infection source.",
            "Ambulatory client.",
            "Client requesting Wi-Fi password.",
          ],
          correct: 1,
          rationale: "Refractory perfusion failure outranks routine procedural tasks.",
        },
        {
          question: "Why might RN pause fluid bolus in acute decompensated HF with pulmonary edema?",
          options: [
            "Fluids always help.",
            "Additional volume may worsen cardiogenic pulmonary edema—follow diuresis/inotrope orders.",
            "HF never causes shock.",
            "Only diuretics are contraindicated always.",
          ],
          correct: 1,
          rationale: "Cardiogenic shock management differs from hypovolemic resuscitation.",
        },
        {
          question: "Epinephrine in anaphylaxis—exam priority theme?",
          options: [
            "Avoid epinephrine always.",
            "Early epinephrine per protocol for airway/vascular collapse—delay increases mortality teaching.",
            "Only steroids matter.",
            "Oral antihistamine alone for stridor.",
          ],
          correct: 1,
          rationale: "Epinephrine is first-line for anaphylactic shock in exam algorithms.",
        },
      ],
      postTest: [
        {
          question: "Which assessment supports fluid responsiveness vs ongoing shock?",
          options: [
            "Single BP 10 minutes ago only.",
            "MAP/UOP/mental status/lactate trends after bolus—dynamic assessment.",
            "Temperature alone.",
            "Pain score only.",
          ],
          correct: 1,
          rationale: "Resuscitation requires serial endpoints, not one snapshot.",
        },
        {
          question: "RN delegating frequent vitals during shock—appropriate if?",
          options: [
            "Assistive personnel interpret swan numbers.",
            "Unlicensed assistive staff measure and report immediately per protocol with RN interpreting trends.",
            "No vitals during shock.",
            "Delegate vasopressor titration to visitor.",
          ],
          correct: 1,
          rationale: "Delegation preserves RN oversight for high-risk titration decisions.",
        },
        {
          question: "Tamponade suspicion in stem (muffled heart sounds, JVD, hypotension)—RN should?",
          options: [
            "Give large fluid bolus always without assessment.",
            "Activate emergent evaluation—pericardiocentesis/surgery per orders, not delay.",
            "Ignore JVD.",
            "Send client home.",
          ],
          correct: 1,
          rationale: "Obstructive tamponade is a time-critical activation pattern.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "Shock resuscitation (NCLEX-RN, Canada)",
      seoTitle: "Shock nursing care | NCLEX-RN Canada | NurseNest",
      seoDescription: "Canadian RN: septic/cardiogenic/anaphylactic forks, metric lactate, collaborative resuscitation.",
      clinical_meaning: `**Canadian RN**  
You integrate **Surviving Sepsis–style** teaching when stems reference it, use **metric lactate** and **mmHg MAP** targets, and **collaborate** with **rapid response / ICU** teams. **Transfusion** and **massive hemorrhage protocols** follow **blood bank** safety checks and **reaction** monitoring.`,
      exam_relevance: `Same clinical spine as US RN with **Canadian unit** traps and **college-standard** language for **delegation** during **unstable** clients—wrong answers still **fluid-bolus** everyone or **delay** **epinephrine** in **anaphylaxis**.`,
      clinical_scenario: `**Vignette**  
Post-MVA client **tachycardic**, **hypotensive**, **distended abdomen**, **dropping Hgb** in stem.

**Fork**  
Think **hemorrhagic shock**—activate **massive transfusion/trauma** elements per orders, **type and screen** readiness, **surgical consult** themes—not routine analgesic-only focus.`,
      takeaways: `• **Source control** matters in septic and hemorrhagic shock teaching.  
• **Reassess** after every bolus and pressor change.  
• **Family communication** stays calm and factual during chaos.`,
    },
    {
      preTest: [
        {
          question: "Which lab trend supports septic shock over simple infection?",
          options: [
            "Normal lactate always.",
            "Rising lactate with hypotension despite fluids per protocol.",
            "Stable WBC only.",
            "Negative culture always rules out sepsis.",
          ],
          correct: 1,
          rationale: "Perfusion and metabolic markers define shock beyond fever alone.",
        },
        {
          question: "Canadian RN sees peanut allergy client with wheeze and BP 80/50 mmHg. First-line teaching?",
          options: [
            "Wait for rash to fade.",
            "Epinephrine per anaphylaxis protocol plus airway support and activation.",
            "Only oral antihistamine.",
            "Send to walk outside.",
          ],
          correct: 1,
          rationale: "Hypotension and airway involvement demand epinephrine-focused emergency care.",
        },
        {
          question: "Why monitor glucose during shock resuscitation?",
          options: [
            "Glucose never shifts.",
            "Stress and therapies alter glucose; hypoglycemia worsens brain injury.",
            "It replaces hemoglobin.",
            "Only type 1 diabetes matters.",
          ],
          correct: 1,
          rationale: "Glycemic monitoring is integrated into critical care resuscitation items.",
        },
      ],
      postTest: [
        {
          question: "Which finding suggests neurogenic shock after spinal cord injury?",
          options: [
            "Fever and warm flushed skin always.",
            "Hypotension with bradycardia and warm dry skin early in some stems.",
            "Hypertension always.",
            "Stridor from allergy.",
          ],
          correct: 1,
          rationale: "Neurogenic shock has distinct hemodynamic patterns versus sepsis.",
        },
        {
          question: "RN priority when pulmonary edema worsens during fluid challenge in HF client?",
          options: [
            "Continue bolus blindly.",
            "Stop challenge, notify provider, anticipate diuretic/inotrope orders per presentation.",
            "Ignore lungs.",
            "Discharge.",
          ],
          correct: 1,
          rationale: "Iatrogenic fluid overload in cardiogenic pictures is a tested error pattern.",
        },
        {
          question: "Why pair antibiotics early in septic shock teaching?",
          options: [
            "Antibiotics never matter.",
            "Source control plus early appropriate antibiotics improves outcomes in sepsis bundles.",
            "Only after full recovery.",
            "Replace fluids entirely.",
          ],
          correct: 1,
          rationale: "Time-to-antibiotics is a recurring sepsis quality metric in items.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "Shock risk & escalation in ambulatory settings (NP, US)",
      seoTitle: "Shock triage | NP US | NurseNest",
      seoDescription: "NP: sepsis appearance, anaphylaxis, GI bleed hypotension—ED referral and safety netting.",
      clinical_meaning: `**NP**  
Outpatient items test **who cannot stay in clinic**: **toxic appearance**, **MAP hypotension**, **syncope**, **massive GI bleeding**, **stridor**, **altered mentation**, and **pregnancy with hemorrhage**. You **activate EMS**, **give IM epinephrine** when in-office anaphylaxis kit applies, and **avoid** “drive yourself to ED” for **unstable** clients.`,
      exam_relevance: `Trap: **oral antibiotics alone** for **febrile hypotensive** client, or **scheduling colonoscopy next month** for **acute BRBPR with orthostasis**.`,
      clinical_scenario: `**Vignette — urgent care**  
Patient **febrile**, **confused**, **BP 88/52**, **tachypneic** after UTI symptoms.

**Fork**  
**EMS/ED**—not “increase PO fluids at home and recheck next week.”`,
      takeaways: `• **Ambulatory shock** = emergency services, not reassurance.  
• **Anaphylaxis** kits and training are office-safety content.  
• **Follow-up** plans only after stabilization.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs EMS activation from clinic?",
          options: [
            "Mild URI without fever.",
            "Hypotension, tachypnea, altered mentation, and suspected infection.",
            "Stable HTN refill.",
            "Rash without systemic symptoms.",
          ],
          correct: 1,
          rationale: "Septic shock cannot be managed as routine outpatient illness.",
        },
        {
          question: "NP office sees anaphylaxis after injection. Priority?",
          options: [
            "Schedule allergy testing next month.",
            "Epinephrine per protocol, airway support, EMS if severe.",
            "Only topical steroid.",
            "Send patient to drive alone.",
          ],
          correct: 1,
          rationale: "Anaphylaxis is treated immediately with epinephrine-focused care.",
        },
        {
          question: "Why is orthostasis with melena concerning in NP triage?",
          options: [
            "GI bleeding never causes shock.",
            "Volume loss can progress to hypovolemic shock—ED evaluation.",
            "Melena is always benign.",
            "Only pain score matters.",
          ],
          correct: 1,
          rationale: "Upper GI bleed with orthostasis signals significant hemorrhage risk.",
        },
      ],
      postTest: [
        {
          question: "Which phrase documents appropriate NP escalation?",
          options: [
            "Patient sent home unstable.",
            "EMS activated for MAP <65 with toxic appearance; interventions per protocol documented.",
            "No vitals taken.",
            "Advised to wait 48 hours silently.",
          ],
          correct: 1,
          rationale: "Documentation of instability and activation shows standard-of-care triage.",
        },
        {
          question: "Pregnant patient with bleeding and hypotension—NP thinks?",
          options: [
            "Routine prenatal visit.",
            "Obstetric hemorrhage emergency—ED/hospital activation.",
            "Only bed rest advice.",
            "Ignore vitals.",
          ],
          correct: 1,
          rationale: "Obstetric shock etiologies are high-stakes exam content.",
        },
        {
          question: "Why teach adrenaline auto-injector use in allergy visits?",
          options: [
            "Patients never need devices.",
            "Early self-treatment bridges time to emergency care in anaphylaxis.",
            "Devices replace ED always.",
            "Only for children.",
          ],
          correct: 1,
          rationale: "Epinephrine auto-injector education reduces fatal anaphylaxis delay.",
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
    title: `Shock risk & escalation in ambulatory settings (${suf})`,
    seoTitle: `Shock triage | ${lab} US | NurseNest`,
    seoDescription: `NP shock/sepsis triage for ${lab}: ED referral, anaphylaxis, and bleeding risk.`,
  };
}

export function shockGoldHubListInput(pathwayId: string): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getShockGoldLessonInput(pathwayId);
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

export function getShockGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const key = PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  let v = VARIANTS[key];
  if (key === "us_np") v = npTitles(pathwayId, v);
  return {
    slug: SHOCK_GOLD_SLUG,
    title: v.title,
    topic: "Shock",
    topicSlug: "shock",
    bodySystem: "Cardiovascular",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: v.seoDescription,
    sections: [
      { id: "clinical_meaning", heading: "What this means clinically", kind: "clinical_meaning", body: v.clinical_meaning },
      { id: "exam_relevance", heading: "Why this appears on your exam", kind: "exam_relevance", body: v.exam_relevance },
      { id: "core_concept", heading: "Core concept — shock types & perfusion", kind: "core_concept", body: SHARED_CORE_BODY },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: v.clinical_scenario },
      { id: "takeaways", heading: "Key takeaways", kind: "takeaways", body: v.takeaways },
    ],
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
