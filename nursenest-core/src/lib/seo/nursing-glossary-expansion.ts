/**
 * Editorial glossary expansion batch — merge into registry; target 200+ via phased editorial review.
 */
import type { NursingGlossaryTerm } from "@/lib/seo/nursing-glossary-registry";

export const NURSING_GLOSSARY_EXPANSION_TERMS: readonly NursingGlossaryTerm[] = [
  {
    slug: "copd",
    term: "COPD",
    definition:
      "Chronic obstructive pulmonary disease — progressive airflow limitation. Nursing priorities include oxygen titration, bronchodilator timing, infection surveillance, and activity pacing.",
    topicSlug: "copd",
  },
  {
    slug: "asthma",
    term: "Asthma",
    definition:
      "Reversible bronchospasm with airway inflammation. Assess peak flow trends, trigger avoidance, and escalation when rescue inhaler use increases.",
    topicSlug: "asthma",
  },
  {
    slug: "pneumonia",
    term: "Pneumonia",
    definition:
      "Alveolar infection with cough, fever, and infiltrates. Monitor oxygenation, fluid balance, antibiotic timing, and aspiration risk in vulnerable patients.",
    topicSlug: "pneumonia",
  },
  {
    slug: "respiratory-failure",
    term: "Respiratory failure",
    definition:
      "Inadequate gas exchange to meet metabolic demand. Nursing actions include airway positioning, oxygen delivery, ventilator coordination, and rapid escalation.",
    topicSlug: "respiratory-failure",
  },
  {
    slug: "shock",
    term: "Shock",
    definition:
      "Inadequate tissue perfusion despite compensatory mechanisms. Classify by etiology (hypovolemic, cardiogenic, distributive) and prioritize perfusion-first interventions.",
    topicSlug: "shock",
  },
  {
    slug: "myocardial-infarction",
    term: "Myocardial infarction",
    definition:
      "Acute coronary occlusion with ischemic injury. Time-sensitive priorities: ECG changes, pain control, antiplatelet/anticoagulant safety, and hemodynamic monitoring.",
    topicSlug: "myocardial-infarction",
  },
  {
    slug: "electrolytes",
    term: "Electrolytes",
    definition:
      "Serum ions (sodium, potassium, calcium, magnesium) that drive neuromuscular and cardiac function. Replacement requires route, rate, and coexisting acid-base context.",
    topicSlug: "electrolytes",
  },
  {
    slug: "acute-kidney-injury",
    term: "Acute kidney injury",
    definition:
      "Sudden decline in kidney function with rising creatinine or oliguria. Protect renal perfusion, avoid nephrotoxins, and track urine output trends.",
    topicSlug: "acute-kidney-injury",
  },
  {
    slug: "siadh",
    term: "SIADH",
    definition:
      "Syndrome of inappropriate antidiuretic hormone — dilutional hyponatremia with euvolemia. Fluid restriction and sodium trends guide nursing surveillance.",
    topicSlug: "siadh",
  },
  {
    slug: "diabetes-mellitus",
    term: "Diabetes mellitus",
    definition:
      "Chronic hyperglycemia from insulin deficiency or resistance. Nursing care spans glucose monitoring, hypoglycemia prevention, foot surveillance, and sick-day planning.",
    topicSlug: "diabetes-mellitus",
  },
  {
    slug: "thyroid-storm",
    term: "Thyroid storm",
    definition:
      "Life-threatening thyrotoxicosis with fever, tachycardia, and altered mental status. Support cooling, beta-blockade coordination, and ICU-level monitoring.",
    topicSlug: "thyroid",
  },
  {
    slug: "anticoagulation",
    term: "Anticoagulation",
    definition:
      "Medications that reduce clot formation (heparin, warfarin, DOACs). Bleeding risk, reversal awareness, and lab monitoring are core nursing safety checks.",
    topicSlug: "anticoagulation",
  },
  {
    slug: "medication-safety",
    term: "Medication safety",
    definition:
      "Rights of medication administration plus high-alert drug protocols. Double-check insulin, anticoagulants, and opioids; verify allergies and renal/hepatic dosing.",
    topicSlug: "medication-safety",
  },
  {
    slug: "prioritization",
    term: "Prioritization",
    definition:
      "Ordering nursing actions by urgency and stability — ABCs and unstable-before-stable. Exam-style SATA items test whether you treat the greatest risk first.",
    topicSlug: "prioritization",
  },
  {
    slug: "delegation",
    term: "Delegation",
    definition:
      "Assigning tasks to qualified personnel while retaining accountability. Match competency, supervision needs, and acuity; never delegate assessment or unstable patients.",
    topicSlug: "delegation",
  },
  {
    slug: "infection-control",
    term: "Infection control",
    definition:
      "Standard and transmission-based precautions to break pathogen spread. Hand hygiene, PPE selection, and isolation adherence protect patients and staff.",
    topicSlug: "infection",
  },
  {
    slug: "metabolic-acidosis",
    term: "Metabolic acidosis",
    definition:
      "Low bicarbonate with acidemia — common in DKA, renal failure, and toxin ingestion. Identify anion gap patterns and treat underlying cause, not only the number.",
    topicSlug: "metabolic-acidosis",
  },
  {
    slug: "stroke",
    term: "Stroke",
    definition:
      "Acute focal neurologic deficit from ischemic or hemorrhagic brain injury. Time-last-known-well drives thrombolysis eligibility; monitor airway and swallow safety.",
    topicSlug: "stroke",
  },
  {
    slug: "seizure",
    term: "Seizure",
    definition:
      "Paroxysmal neurologic event from abnormal cortical activity. Protect airway, prevent injury, time duration, and escalate when status epilepticus is suspected.",
    topicSlug: "seizure",
  },
  {
    slug: "labor-delivery",
    term: "Labor and delivery",
    definition:
      "Intrapartum physiologic process with fetal heart rate and contraction surveillance. Recognize late decelerations, cord compression patterns, and postpartum hemorrhage risk.",
    topicSlug: "labor-delivery",
  },
  {
    slug: "newborn-transition",
    term: "Newborn transition",
    definition:
      "First hours after birth — thermoregulation, glucose stability, and respiratory adaptation. Apgar trends and early feeding support guide nursery priorities.",
    topicSlug: "newborn",
  },
  {
    slug: "suicide-risk",
    term: "Suicide risk assessment",
    definition:
      "Structured evaluation of ideation, plan, means, and protective factors. Maintain therapeutic rapport, remove lethal means, and follow unit safety protocols.",
    topicSlug: "suicide-risk",
  },
  {
    slug: "therapeutic-communication",
    term: "Therapeutic communication",
    definition:
      "Purposeful verbal and nonverbal techniques that support trust and clarity. Active listening and validation reduce escalation in acute psychiatric settings.",
    topicSlug: "mental-health",
  },
  {
    slug: "lactate",
    term: "Lactate",
    definition:
      "Marker of tissue hypoperfusion in sepsis and shock. Rising lactate despite resuscitation signals inadequate perfusion and need for escalation.",
    topicSlug: "sepsis",
  },
  {
    slug: "vasopressors",
    term: "Vasopressors",
    definition:
      "IV agents that increase vascular tone and blood pressure in distributive shock. Require central access when possible and continuous hemodynamic monitoring.",
    topicSlug: "shock",
  },
  {
    slug: "fluid-resuscitation",
    term: "Fluid resuscitation",
    definition:
      "IV crystalloid or colloid boluses to restore intravascular volume. Assess lung sounds, JVD, and urine output to avoid overload in heart failure.",
    topicSlug: "fluid-balance",
  },
  {
    slug: "insulin-protocol",
    term: "Insulin protocol",
    definition:
      "Scheduled and correction insulin for hyperglycemia in hospitalized patients. Coordinate with meal timing, hypoglycemia treatment, and potassium before insulin bolus.",
    topicSlug: "diabetic-ketoacidosis",
  },
  {
    slug: "peak-flow",
    term: "Peak expiratory flow",
    definition:
      "Maximum airflow during forced expiration — useful in asthma action plans. Personal best comparisons guide step-up therapy and when to seek emergency care.",
    topicSlug: "asthma",
  },
  {
    slug: "ventilator-alarm",
    term: "Ventilator alarm",
    definition:
      "Machine alert for high pressure, low volume, or disconnection. Initial nursing response: airway patency, tubing, patient-ventilator synchrony, then notify RT/MD.",
    topicSlug: "respiratory-failure",
  },
  {
    slug: "glasgow-coma-scale",
    term: "Glasgow Coma Scale",
    definition:
      "Standardized consciousness score (eye, verbal, motor). Trending GCS helps detect neurologic deterioration and guides neuro check frequency.",
    topicSlug: "neurologic",
  },
  {
    slug: "therapeutic-level",
    term: "Therapeutic drug level",
    definition:
      "Serum concentration within efficacy and safety window (e.g., digoxin, lithium). Draw levels at consistent times relative to doses and renal function.",
    topicSlug: "pharmacology",
  },
] as const;
