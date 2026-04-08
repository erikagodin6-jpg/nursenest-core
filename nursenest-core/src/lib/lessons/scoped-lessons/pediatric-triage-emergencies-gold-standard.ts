/**
 * Pediatric triage — dehydration, respiratory distress, fever risk by age, escalation thresholds.
 * Remediation wave 4: pediatrics + physiological adaptation + safety and infection themes.
 */
import type { PathwayLessonQuizItem, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import { npExamLabel, npPrimaryCareTitleSuffix } from "@/lib/lessons/scoped-lessons/np-pathway-display";

export const PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG = "pediatric-triage-emergencies-gold-standard" as const;

type PedsVariant = "us_pn" | "ca_rpn" | "us_rn" | "ca_rn" | "us_np";

const PATHWAY_VARIANT: Record<string, PedsVariant> = {
  "us-lpn-nclex-pn": "us_pn",
  "ca-rpn-rex-pn": "ca_rpn",
  "us-rn-nclex-rn": "us_rn",
  "ca-rn-nclex-rn": "ca_rn",
  "us-np-fnp": "us_np",
  "us-np-agpcnp": "us_np",
  "us-np-pmhnp": "us_np",
};

const SHARED_CORE_BODY = `**Pediatric triage spine**  
Children compensate then **decompensate quickly**. Exams reward **appearance** (interactive vs lethargic), **work of breathing** (retractions, nasal flaring, grunting, head bobbing, tripod), **circulation** (cap refill, pulses, skin, mental status), and **hydration** (mucosa, tears, urine, fontanelle in infants).

**Dehydration forks**  
Mild/moderate: **oral rehydration** when alert and tolerating; **wrong answers** force **NPO** for routine gastroenteritis or **only IV** when PO is appropriate. **Severe**: **lethargy**, **minimal urine**, **sunken fontanelle**, **mottling** → **IV access**, **ordered boluses**, **frequent vitals**.

**Respiratory distress**  
**Wheeze + accessory muscle use** (asthma/bronchiolitis) vs **stridor at rest** (upper airway) vs **silent chest** (impending failure). **SpO₂** trends and **mental status** determine escalation. **Epinephrine** for **moderate-severe** croup per protocol; **bronchodilators** for reactive airway when ordered.

**Fever & age**  
Young infants (especially **<28 days** and often **<3 months** in items) with fever trigger **sepsis workup / ED** pathways—not “observe at home alone” when stem shows **toxic appearance** or **parent reliable follow-up absent**.`;

function pack(
  variant: PedsVariant,
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

const VARIANTS: Record<PedsVariant, ReturnType<typeof pack>> = {
  us_pn: pack(
    "us_pn",
    {
      title: "Pediatric triage & dehydration cues (NCLEX-PN, US)",
      seoTitle: "Pediatric emergencies triage | NCLEX-PN US | NurseNest",
      seoDescription:
        "US PN: respiratory distress signs, dehydration assessment, fever escalation, and scope-safe pediatric support.",
      clinical_meaning: `**PN scope**  
You **measure vitals including RR** carefully in children, **observe work of breathing**, **report** **grunting** or **nasal flaring**, **administer ordered nebulizers/fluids**, **support family**, and **escalate** when **appearance worsens**. You **do not** independently prescribe antipyretic dosing beyond order or discharge infants with fever without RN/provider direction.`,
      exam_relevance: `Traps: **routine playroom** when **silent chest** is described, **cold baths** as first-line for febrile seizure teaching, or **ignoring** **cap refill >3 seconds** with tachycardia.`,
      clinical_scenario: `**Vignette**  
18-month-old: **RR 52**, **retractions**, **SpO₂ 89%** on RA, **minimal tears**, **lethargic**.

**Fork**  
**Oxygen per order**, **notify RN immediately**, **prepare for ordered therapy**—not “offer juice only.”`,
      takeaways: `• **Tachypnea + retractions + low SpO₂** = respiratory emergency until improved.  
• **Dehydration + altered mental status** beats “stable last hour” thinking.  
• **Parents** need **clear return precautions** when stable enough for home.`,
    },
    {
      preTest: [
        {
          question: "Which toddler finding should the PN report first?",
          options: [
            "Playing with toys, drinking well.",
            "Grunting, nasal flaring, retractions, and SpO₂ 89%.",
            "Mild runny nose, afebrile.",
            "Asking for stickers.",
          ],
          correct: 1,
          rationale: "Severe respiratory distress with hypoxemia requires immediate RN/provider attention.",
        },
        {
          question: "Best indicator of moderate dehydration in a young child?",
          options: [
            "Frequent urination.",
            "Dry mucosa, decreased tears, sunken eyes, delayed cap refill.",
            "Robust tears and wet diaper hourly.",
            "Only adult criteria matter.",
          ],
          correct: 1,
          rationale: "Mucous membranes, tears, and perfusion markers define pediatric dehydration severity.",
        },
        {
          question: "Febrile 2-month-old appears lethargic. PN should?",
          options: [
            "Send home with ibuprofen only.",
            "Notify RN/provider immediately—young infant with ill appearance needs urgent evaluation pathway.",
            "Wait until next shift.",
            "Give cold bath only.",
          ],
          correct: 1,
          rationale: "Young infants with fever and toxic appearance require urgent escalation per exam teaching.",
        },
      ],
      postTest: [
        {
          question: "Why is “silent chest” alarming in asthma exacerbation?",
          options: [
            "It means improvement always.",
            "Fatigue may reduce audible wheeze while obstruction worsens—impending respiratory failure.",
            "It is normal for children.",
            "Only adults have this sign.",
          ],
          correct: 1,
          rationale: "Paradoxical quieting can signal exhaustion and critical narrowing.",
        },
        {
          question: "Oral rehydration is appropriate when?",
          options: [
            "Child is lethargic with no urine for 12 hours.",
            "Mild dehydration, alert, tolerating sips per protocol—often first-line for gastroenteritis.",
            "Never for children.",
            "Only with NG tube always.",
          ],
          correct: 1,
          rationale: "Mild-moderate dehydration with intact mental status supports ORT when orders allow.",
        },
        {
          question: "PN priority during suspected airway foreign body with stridor?",
          options: [
            "Give large meal.",
            "Stay with child, support calm, notify RN/provider, prepare for emergent evaluation per protocol.",
            "Force water.",
            "Leave room.",
          ],
          correct: 1,
          rationale: "Upper airway emergencies need immediate skilled evaluation and supportive monitoring.",
        },
      ],
    },
  ),

  ca_rpn: pack(
    "ca_rpn",
    {
      title: "Pediatric triage & dehydration cues (REx-PN, Canada)",
      seoTitle: "Pediatric emergencies triage | REx-PN Canada | NurseNest",
      seoDescription:
        "Canadian PN: metric vitals, bronchiolitis vs asthma cues, dehydration, and interprofessional escalation.",
      clinical_meaning: `**RPN**  
Use **°C** and **weight kg** when stems show them. You **quantify RR** for age, **document** **retraction severity**, **communicate** **SBAR** to RN/NP/physician, and **support** **family-centered care**. **Pediatric medication** checks require **weight-based** reasoning awareness even when you administer per order.`,
      exam_relevance: `Canadian items emphasize **delay errors** (finishing paperwork while **SpO₂ falls**) and **scope** for **nebulizer** therapy and **IV starts** per provincial standards.`,
      clinical_scenario: `**Vignette**  
6-year-old asthma: **speaking in 1-word sentences**, **RR 40**, **wheezing faint**.

**Fork**  
Escalate **severe exacerbation**—not “repeat albuterol indefinitely without reassessment.”`,
      takeaways: `• **Word sentences + accessory muscles** = severe asthma teaching.  
• **Bronchiolitis** under age 2: **supportive care** focus; **antibiotics** usually wrong unless bacterial coinfection in stem.  
• **SI units** do not change **ABC priority**.`,
    },
    {
      preTest: [
        {
          question: "Which finding should prompt immediate RPN reporting?",
          options: [
            "Child watching tablet, SpO₂ 98%.",
            "Infant with apnea episodes and perioral cyanosis.",
            "Stable toddler eating.",
            "Normal cap refill.",
          ],
          correct: 1,
          rationale: "Apnea with cyanosis suggests critical respiratory compromise.",
        },
        {
          question: "RPN assessing dehydration notes sunken fontanelle in infant. Meaning?",
          options: [
            "Normal variant always.",
            "Significant fluid deficit—urgent provider communication.",
            "Ignore if awake.",
            "Only preemies.",
          ],
          correct: 1,
          rationale: "Sunken fontanelle indicates intravascular volume depletion in infants.",
        },
        {
          question: "Why count RR before other tasks in febrile child?",
          options: [
            "RR never matters.",
            "Tachypnea is an early sepsis and respiratory distress marker in pediatrics.",
            "Only BP matters.",
            "Only for adults.",
          ],
          correct: 1,
          rationale: "Respiratory rate is a sensitive pediatric vital sign for deterioration.",
        },
      ],
      postTest: [
        {
          question: "Croup with stridor at rest and drooling—exam fork?",
          options: [
            "Mild croup only.",
            "Epiglottitis/airway obstruction differential—emergency evaluation, do not agitate child.",
            "Discharge home alone.",
            "Oral exam with tongue blade at bedside always.",
          ],
          correct: 1,
          rationale: "Toxic appearance with stridor and drooling raises supraglottic emergency concern.",
        },
        {
          question: "RPN role during ordered isotonic bolus for dehydrated child?",
          options: [
            "Set rate without orders.",
            "Monitor vitals, watch for fluid overload signs, document response per protocol.",
            "Leave unit.",
            "Stop fluids without reporting.",
          ],
          correct: 1,
          rationale: "Resuscitation requires monitoring for response and complications.",
        },
        {
          question: "Which statement reflects family teaching for gastroenteritis?",
          options: [
            "Stop all fluids.",
            "Small frequent ORS, watch wet diapers, return for no urine, blood, or lethargy.",
            "Only IV therapy at home.",
            "Ignore fever.",
          ],
          correct: 1,
          rationale: "ORT with clear return precautions is standard teaching for mild-moderate GE.",
        },
      ],
    },
  ),

  us_rn: pack(
    "us_rn",
    {
      title: "Pediatric respiratory & fluid emergencies (NCLEX-RN, US)",
      seoTitle: "Pediatric triage nursing | NCLEX-RN US | NurseNest",
      seoDescription:
        "NCLEX-RN: asthma tiers, bronchiolitis support, dehydration resuscitation, febrile neonate pathways, and prioritization.",
      clinical_meaning: `**RN**  
You **triage** among children using **PEWS**-style thinking when stems imply it, **administer** **bronchodilators**, **steroids**, **fluids**, **antipyretics per order**, **oxygen**, **continuous monitoring** for **high-risk** patients, and **educate** parents on **return precautions**. You **recognize** **respiratory failure** and **septic** patterns in **neonates**.`,
      exam_relevance: `Forks: **first med in anaphylaxis** (IM epinephrine), **RSV** supportive care vs unnecessary antibiotics, **DKA** pediatric fluid/insulin teaching when stem includes it, **status asthmaticus** escalation.`,
      clinical_scenario: `**Vignette — ED**  
8-year-old: **unable to speak full sentences**, **retractions**, **SpO₂ 90%** after initial albuterol.

**Fork**  
**Escalate therapy per protocol** (systemic steroid, additional bronchodilator, possible magnesium, BiPAP/ICU themes)—not “send home now.”`,
      takeaways: `• **Persistent hypoxemia** after bronchodilator = escalate.  
• **Neonate fever** items often require **full sepsis evaluation** when appearance or age criteria met.  
• **Fluid resuscitation** in shock uses **isotonic boluses** per order with reassessment.`,
    },
    {
      preTest: [
        {
          question: "Which child should the RN see first?",
          options: [
            "Stable child waiting for school form.",
            "Neonate 10 days old with fever 38.2°C and poor feeding.",
            "Adolescent with splinter.",
            "Well child for sports physical.",
          ],
          correct: 1,
          rationale: "Young infant with fever and poor intake is a high-priority sepsis pathway in exams.",
        },
        {
          question: "Asthma exacerbation: after three back-to-back albuterol treatments, SpO₂ still 89%. Next theme?",
          options: [
            "Discharge.",
            "Notify provider, continue monitoring, anticipate systemic steroid and escalation per protocol.",
            "Stop oxygen.",
            "Send to playground.",
          ],
          correct: 1,
          rationale: "Refractory hypoxemia requires provider notification and advanced therapies.",
        },
        {
          question: "Why use isotonic crystalloid for pediatric hypovolemic shock initial bolus teaching?",
          options: [
            "Hypotonic preferred always.",
            "Isotonic expands intravascular volume safely per resuscitation algorithms.",
            "Colloid only for children.",
            "No boluses in children.",
          ],
          correct: 1,
          rationale: "Isotonic boluses are standard first-line volume resuscitation in shock teaching.",
        },
      ],
      postTest: [
        {
          question: "Febrile seizure resolved—parent education priority?",
          options: [
            "Never seek care again.",
            "Safety during seizure, when to call EMS, follow-up for fever source—not routine cold baths.",
            "Start daily anticonvulsants always.",
            "Ignore first seizure.",
          ],
          correct: 1,
          rationale: "Febrile seizure teaching focuses on protection, observation, and red flags.",
        },
        {
          question: "Bronchiolitis infant with RR 70 and nasal flaring—intervention theme?",
          options: [
            "Routine antibiotics.",
            "Supportive care: suction/nasal hygiene, oxygen per order, hydration, isolation precautions—antibiotics if no bacterial focus.",
            "Discharge without assessment.",
            "Theophylline first-line.",
          ],
          correct: 1,
          rationale: "Bronchiolitis is viral; antibiotics are not routine without bacterial complication in stem.",
        },
        {
          question: "RN delegating pediatric vitals during outbreak—appropriate?",
          options: [
            "UAP reports critical RR without telling RN.",
            "UAP measures and reports immediately; RN interprets trends and escalates.",
            "No vitals on peds.",
            "Delegate parent to titrate oxygen.",
          ],
          correct: 1,
          rationale: "Assistive personnel gather data; RN retains clinical interpretation for unstable children.",
        },
      ],
    },
  ),

  ca_rn: pack(
    "ca_rn",
    {
      title: "Pediatric triage & dehydration (NCLEX-RN, Canada)",
      seoTitle: "Pediatric triage nursing | NCLEX-RN Canada | NurseNest",
      seoDescription:
        "Canadian RN: pediatric early warning concepts, metric labs, bronchiolitis season, and dehydration resuscitation.",
      clinical_meaning: `**Canadian RN**  
Apply **metric** temperatures and **weight-based** dosing frames. **PICU step-down** and **ED** items test **triage** with **identical** ABC logic to US. **Immunization** and **infection control** during **RSV season** appear as **clustering** themes.`,
      exam_relevance: `Watch **Celsius** fever thresholds in neonates and **mmol/L** glucose if DKA stem—**clinical actions** remain the same.`,
      clinical_scenario: `**Vignette**  
Toddler with **10% dehydration** estimate in stem, **tachycardia**, **cap refill 4 seconds**.

**Fork**  
**IV access**, **isotonic bolus per order**, **monitor**—not oral fluids alone when severely dehydrated.`,
      takeaways: `• **Shock** in children presents with **tachycardia** before hypotension.  
• **Cap refill and mental status** are fast bedside tools.  
• **Family presence** during procedures needs **psychosocial** support.`,
    },
    {
      preTest: [
        {
          question: "Which vital trend best signals pediatric shock early?",
          options: [
            "Bradycardia first always.",
            "Tachycardia with prolonged cap refill before hypotension appears.",
            "Stable RR.",
            "Only temperature.",
          ],
          correct: 1,
          rationale: "Children maintain BP through compensatory tachycardia until late decompensation.",
        },
        {
          question: "Canadian RN with croup and increasing stridor after racemic epinephrine wears off?",
          options: [
            "Send home.",
            "Observe per protocol, prepare for repeat treatment or admission if rebound worsens.",
            "Stop all meds.",
            "Ignore stridor.",
          ],
          correct: 1,
          rationale: "Rebound stridor after racemic epinephrine requires monitored observation.",
        },
        {
          question: "Why cluster sick children in separate zone when possible?",
          options: [
            "Infection control and cohorting reduce cross-transmission in viral seasons.",
            "No reason.",
            "Only for billing.",
            "Increases spread.",
          ],
          correct: 1,
          rationale: "Cohorting supports respiratory isolation principles.",
        },
      ],
      postTest: [
        {
          question: "Which finding suggests impending respiratory failure in child with asthma?",
          options: [
            "Loud wheeze everywhere.",
            "Silent chest, fatigue, altered mentation, rising PaCO₂ if ABG in stem.",
            "Mild cough.",
            "Playing video games.",
          ],
          correct: 1,
          rationale: "Quiet chest with fatigue signals exhaustion and need for advanced support.",
        },
        {
          question: "Hypernatremic dehydration teaching—fluid replacement theme?",
          options: [
            "Rapid free water bolus always without caution.",
            "Correct slowly to avoid cerebral edema—follow ordered correction plan.",
            "Ignore sodium.",
            "Only oral free water in severe cases always.",
          ],
          correct: 1,
          rationale: "Rapid correction of hypernatremia risks cerebral edema; rate matters.",
        },
        {
          question: "Why involve child life when feasible during procedures?",
          options: [
            "Never helpful.",
            "Reduces fear, improves cooperation, supports developmental care.",
            "Delays care always.",
            "Only for adults.",
          ],
          correct: 1,
          rationale: "Developmentally supportive care is integrated into pediatric nursing exams.",
        },
      ],
    },
  ),

  us_np: pack(
    "us_np",
    {
      title: "Pediatric urgent triage in primary care (NP, US)",
      seoTitle: "Pediatric triage | FNP US | NurseNest",
      seoDescription:
        "NP: infant fever, respiratory distress, dehydration, and EMS/ED referral thresholds in outpatient setting.",
      clinical_meaning: `**NP**  
Telehealth and clinic items test **who needs ED now**: **<2–3 month fever**, **respiratory distress with hypoxemia**, **signs of dehydration with lethargy**, **purpuric rash with fever**, **neck stiffness**, and **bilious vomiting** in infant. You **prescribe** **evidence-based** outpatient therapy when safe and **safety-net** with **specific return symptoms**.`,
      exam_relevance: `Trap: **“watchful waiting”** for **ill-appearing** infant; **steroids** for **uncomplicated** **viral** URI; **skip** **umbilical stump** **red flags** in newborn.`,
      clinical_scenario: `**Vignette — clinic**  
3-month-old **febrile**, **bulging fontanelle**, **lethargic**.

**Fork**  
**EMS/ED**—not “recheck tomorrow.”`,
      takeaways: `• **Bulging fontanelle + fever** = central nervous system infection concern until ruled out.  
• **ORT protocols** with **weight-based** guidance for mild GE.  
• **Parent literacy** affects **follow-up** reliability—lower threshold to escalate when uncertain.`,
    },
    {
      preTest: [
        {
          question: "Which patient needs direct ED referral from office?",
          options: [
            "Well 5-year-old with URI.",
            "2-month-old with fever, ill appearance, and poor feeding.",
            "Adolescent acne follow-up.",
            "Stable ADHD refill.",
          ],
          correct: 1,
          rationale: "Young febrile infant with toxic appearance requires emergency evaluation.",
        },
        {
          question: "Child with wheeze and SpO₂ 88% in clinic—NP action?",
          options: [
            "Drive home with parents.",
            "Oxygen, treatment per protocol, EMS if not improving—hypoxemic child is not routine outpatient.",
            "Only prescribe cough syrup.",
            "Ignore SpO₂.",
          ],
          correct: 1,
          rationale: "Hypoxemia in pediatric wheeze requires immediate treatment and possible transport.",
        },
        {
          question: "Why teach parents “sick day” insulin for type 1 child?",
          options: [
            "Never change insulin.",
            "Illness increases ketosis risk—monitor glucose/ketones and follow adjustment plan.",
            "Stop insulin when sick always.",
            "Only adults get sick days.",
          ],
          correct: 1,
          rationale: "Intercurrent illness raises DKA risk; sick-day rules are board-relevant.",
        },
      ],
      postTest: [
        {
          question: "Which phrase documents safe NP triage?",
          options: [
            "Patient sent home cyanotic.",
            "SpO₂ 87%, retractions, racemic epinephrine given, EMS activated for transport documented.",
            "No exam.",
            "Advised to wait 1 week silently.",
          ],
          correct: 1,
          rationale: "Objective distress with treatment and transport shows standard care.",
        },
        {
          question: "Petechial rash with fever in child—NP concern?",
          options: [
            "Viral exanthem always benign.",
            "Meningococcemia until evaluated—emergent care.",
            "Only cosmetic.",
            "Treat with topical steroid only always.",
          ],
          correct: 1,
          rationale: "Purpuric rash with fever is a meningococcemia red flag in exam vignettes.",
        },
        {
          question: "Oral rehydration teaching for mild pediatric GE—key point?",
          options: [
            "NPO for 48 hours always.",
            "Continue age-appropriate feeding as tolerated with ORS in small volumes.",
            "Only IV fluids at home.",
            "Avoid all fluids.",
          ],
          correct: 1,
          rationale: "Modern gastroenteritis care emphasizes early ORT over prolonged NPO.",
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
    title: `Pediatric urgent triage in primary care (${suf})`,
    seoTitle: `Pediatric triage | ${lab} US | NurseNest`,
    seoDescription: `NP pediatric urgent triage for ${lab}: ED referral, dehydration, respiratory distress.`,
  };
}

export function pediatricTriageEmergenciesGoldHubListInput(
  pathwayId: string,
): Omit<LessonInputShape, "sections" | "preTest" | "postTest"> | null {
  const full = getPediatricTriageEmergenciesGoldLessonInput(pathwayId);
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

export function getPediatricTriageEmergenciesGoldLessonInput(pathwayId: string): LessonInputShape | null {
  const key = PATHWAY_VARIANT[pathwayId];
  if (!key) return null;
  let v = VARIANTS[key];
  if (key === "us_np") v = npTitles(pathwayId, v);
  return {
    slug: PEDIATRIC_TRIAGE_EMERGENCIES_GOLD_SLUG,
    title: v.title,
    topic: "Pediatrics",
    topicSlug: "pediatrics",
    bodySystem: "General",
    previewSectionCount: 1,
    seoTitle: v.seoTitle,
    seoDescription: v.seoDescription,
    sections: [
      { id: "clinical_meaning", heading: "What this means clinically", kind: "clinical_meaning", body: v.clinical_meaning },
      { id: "exam_relevance", heading: "Why this appears on your exam", kind: "exam_relevance", body: v.exam_relevance },
      { id: "core_concept", heading: "Core concept — pediatric triage", kind: "core_concept", body: SHARED_CORE_BODY },
      { id: "clinical_scenario", heading: "Clinical scenario", kind: "clinical_scenario", body: v.clinical_scenario },
      { id: "takeaways", heading: "Key takeaways", kind: "takeaways", body: v.takeaways },
    ],
    preTest: v.quizzes.preTest,
    postTest: v.quizzes.postTest,
  };
}
