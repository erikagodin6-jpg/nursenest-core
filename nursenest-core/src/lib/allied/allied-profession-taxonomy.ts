/**
 * Profession-specific lesson taxonomies for allied marketing hubs (SEO + filtering).
 * Categories are disjoint per profession; titles/descriptions include the profession so SERPs do not collide.
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/** Query param for taxonomy drill on allied pathway lesson hubs (alongside `alliedProfession`). */
export const ALLIED_TAXONOMY_QUERY_PARAM = "alliedTaxonomy" as const;

/** Minimum categories per profession (product guard + audit). */
export const MIN_ALLIED_PROFESSION_TAXONOMY_CATEGORIES = 9;

export type AlliedProfessionTaxonomyCategory = {
  slug: string;
  label: string;
  /** One-line SERP description; must mention the role so it is unique across professions. */
  seoDescription: string;
};

export type AlliedTaxonomyCluster = {
  slug: string;
  label: string;
  count: number;
};

export type AlliedLessonTaxonomyAssignment = {
  primary: string;
  secondaries: string[];
};

function cat(slug: string, label: string, seoDescription: string): AlliedProfessionTaxonomyCategory {
  return { slug, label, seoDescription };
}

/** Curated categories per profession (≥9 each). Slugs are stable URL segments. */
export const ALLIED_PROFESSION_TAXONOMIES: Record<string, AlliedProfessionTaxonomyCategory[]> = {
  pta: [
    cat("therapeutic-exercise", "Therapeutic exercise", "PTA-style exercise progressions, dosing, and contraindications for US allied exam prep."),
    cat("mobility-gait", "Mobility and gait", "Transfers, gait training, and assistive devices in PTA scope for certification study."),
    cat("orthopedic-rehab", "Orthopedic rehab", "Post-op protocols, joint protection, and common MSK scenarios for assistant-level exams."),
    cat("neurologic-rehab", "Neurologic rehab", "Stroke, balance, and coordination interventions framed for PTA authorization."),
    cat("cardiopulmonary-rehab", "Cardiopulmonary rehab", "Vital trends, activity tolerance, and safety pacing for PTA-track learners."),
    cat("modalities-basics", "Modalities basics", "Heat/cold/e-stim boundaries, safety checks, and documentation expectations for PTAs."),
    cat("data-collection", "Data collection", "Goniometry, MMT basics, and functional measures assistants collect for the PT."),
    cat("safety-infection", "Safety and infection control", "PPE, wound precautions, and clinic safety sequencing for PTA settings."),
    cat("ethics-delegation", "Ethics and delegation", "Supervision lines, scope, and professional boundaries on PTA exams."),
    cat("patient-education", "Patient education", "Teaching home programs, adherence cues, and teach-back within PTA scope."),
  ],
  ota: [
    cat("adls-iadls", "ADLs and IADLs", "Occupational performance, ADL retraining, and IADL strategies for OTA certification prep."),
    cat("cognition-perception", "Cognition and perception", "Functional cognition, safety judgment, and perceptual supports for OTAs."),
    cat("pediatrics-ota", "Pediatrics", "School and clinic pediatric frames for OTA-level authorization and documentation."),
    cat("mental-health-ota", "Mental health contexts", "Recovery-oriented routines, structure, and therapeutic use of self for OTAs."),
    cat("orthotics-adaptive", "Orthotics and adaptive equipment", "Splinting awareness, DME training, and environmental modifications for OTAs."),
    cat("ergonomics-work", "Ergonomics and work programs", "Return-to-work pacing, body mechanics education, and job-site basics."),
    cat("groups-activity", "Groups and activity analysis", "Group leadership basics and activity grading for OTA exam vignettes."),
    cat("safety-documentation", "Safety and documentation", "Incident prevention, SOAP-style clarity, and delegation boundaries for OTAs."),
    cat("ethics-scope-ota", "Ethics and scope", "Ethical dilemmas, consent, and OTA/OT collaboration on certification items."),
    cat("community-programming", "Community programming", "Home-health and community mobility contexts framed for OTA scope."),
  ],
  mlt: [
    cat("hematology", "Hematology", "CBC interpretation, cell morphology cues, and MLT-style hematology vignettes for allied exam prep."),
    cat("microbiology", "Microbiology", "Culture workflow, contamination control, and organism significance in the lab assistant/MLT lane."),
    cat("clinical-chemistry", "Clinical chemistry", "Enzymes, electrolytes, and chemistry troubleshooting framed for MLS/MLT exams."),
    cat("transfusion", "Transfusion medicine", "ABO/Rh, compatibility checks, and transfusion reaction awareness for lab certification."),
    cat("urinalysis-body-fluids", "Urinalysis and body fluids", "UA microscopy basics, CSF/serous fluid handling, and QC-minded interpretation."),
    cat("hemostasis", "Hemostasis and coagulation", "PT/INR, PTT, mixing studies at conceptual level for MLT-track items."),
    cat("lab-safety-qc", "Lab safety and QC", "Biosafety levels, QC rules, and error investigation patterns for laboratory exams."),
    cat("poct-instrumentation", "POCT and instrumentation", "Waived vs moderate complexity awareness and analyzer maintenance concepts."),
    cat("specimens-preanalytics", "Specimens and preanalytics", "Draw order, hemolysis, stability, and chain-of-custody edges for MLT prep."),
    cat("immunohematology-basics", "Immunohematology basics", "Antibody screen concepts and transfusion service workflows at MLT depth."),
  ],
  imaging: [
    cat("patient-positioning", "Patient positioning", "Positioning goals, comfort, and teamwork cues for imaging technologist exams."),
    cat("radiation-safety-alara", "Radiation safety (ALARA)", "Shielding, dose awareness, and pregnancy precautions for imaging tracks."),
    cat("contrast-media", "Contrast media", "Premedication, contraindications, and reaction recognition for contrast-enhanced studies."),
    cat("image-quality", "Image quality", "Exposure factors, artifacts, and repeat criteria framed for technologist judgment."),
    cat("cross-sectional-basics", "Cross-sectional basics", "CT/MRI safety screening and workflow language for allied imaging prep."),
    cat("fluoroscopy-interventional", "Fluoroscopy awareness", "Time, distance, shielding concepts without radiologist-level prescribing."),
    cat("pediatric-imaging", "Pediatric imaging", "Gonadal shielding, family communication, and immobilization ethics."),
    cat("infection-imaging", "Infection control in imaging", "Equipment disinfection, isolation transport, and department flow."),
    cat("documentation-handoff", "Documentation and handoff", "Exam completion documentation and critical finding escalation paths."),
    cat("equipment-qa", "Equipment QA", "QC phantoms, calibration awareness, and service escalation for technologists."),
  ],
  respiratory: [
    cat("ventilation", "Mechanical ventilation", "Modes, alarms, and weaning concepts for RRT-style certification study."),
    cat("abgs", "ABGs and gas exchange", "Interpretation drills, compensation patterns, and oxygenation indices for respiratory exams."),
    cat("oxygen-therapy", "Oxygen therapy", "Devices, flows, humidification, and titration language for RT tracks."),
    cat("pulmonary-disease", "Pulmonary disease", "COPD, asthma, and restrictive disease management edges for RT items."),
    cat("airway-clearance", "Airway clearance", "Techniques, indications, and contraindications for secretion management."),
    cat("equipment-alarms-rt", "Equipment and alarms", "Ventilator checks, circuit issues, and escalation when unstable."),
    cat("infectious-pulmonary", "Infectious pulmonary care", "Isolation, PPE, and transmission precautions in respiratory care."),
    cat("pulmonary-diagnostics", "Pulmonary diagnostics", "PFT patterns, bedside spirometry support, and test quality basics."),
    cat("neonatal-pediatric-respiratory", "Neonatal and pediatric respiratory", "Surfactant-era NICU language at conceptual RT exam depth."),
    cat("ethics-escalation-rt", "Ethics and escalation", "Goals-of-care communication and RT scope boundaries on exam vignettes."),
  ],
  paramedic: [
    cat("airway", "Airway management", "Prehospital airway algorithms, device choice, and capnography use for paramedic exams."),
    cat("trauma", "Trauma", "Mechanism, triage, and hemorrhage control priorities for field certification items."),
    cat("cardiology", "Cardiology", "ACS, dysrhythmia recognition, and 12-lead acquisition concepts for paramedic prep."),
    cat("shock", "Shock and perfusion", "Shock types, fluid decisions within scope, and perfusion assessment in EMS contexts."),
    cat("medical-emergencies", "Medical emergencies", "Stroke, sepsis, and respiratory failure field stabilization scenarios."),
    cat("toxicology-environmental", "Toxicology and environmental", "Overdose, heat illness, and hazmat awareness for EMS exams."),
    cat("obstetric-neonatal-field", "Obstetric and neonatal field care", "Field delivery complications, APGAR support, and transport decisions."),
    cat("operations-communications", "Operations and communications", "MCI triage, radio discipline, and scene safety command basics."),
    cat("pharmacology-field", "Field pharmacology", "Routes, dosing safeguards, and scope-limited medication scenarios for paramedics."),
    cat("documentation-ems", "EMS documentation", "PCR expectations, legal sensitivity, and QA-friendly charting habits."),
  ],
  "pharmacy-tech": [
    cat("calculations", "Pharmacy calculations", "Dose, ratio-proportion, and alligation-style items for pharmacy technician exams."),
    cat("sterile-compounding", "Sterile compounding", "USP <797> awareness, aseptic technique, and beyond-use dating at tech depth."),
    cat("medication-safety-tech", "Medication safety", "Look-alike/sound-alike, high-alert meds, and error prevention for technicians."),
    cat("inventory-management", "Inventory management", "Ordering, receiving, recalls, and controlled substance handling rules."),
    cat("community-retail-workflow", "Community pharmacy workflow", "Workflow, counseling support, and OTC triage boundaries for techs."),
    cat("hospital-distribution", "Hospital distribution", "Pyxis basics, cart fill, and STAT delivery patterns on tech exams."),
    cat("regulatory-law", "Regulatory law", "DEA schedules, HIPAA, and technician scope questions for US prep."),
    cat("non-sterile-compounding", "Non-sterile compounding", "Ointments, suspensions, and labeling expectations for tech certification."),
    cat("informatics-billing-support", "Informatics and billing support", "Sig parsing, insurance basics, and data entry accuracy drills."),
    cat("top-200-drugs", "Top 200 drugs", "Brand/generic, classes, and counseling cues technicians must recognize."),
  ],
  "social-work": [
    cat("crisis", "Crisis intervention", "De-escalation, safety planning, and mobile crisis patterns for social work licensing prep."),
    cat("mental-health", "Mental health practice", "Assessment, diagnosis-in-context, and care planning language for BSW/MSW exams."),
    cat("addictions", "Addictions", "Motivational interviewing edges, harm reduction, and referral pathways for SW exams."),
    cat("ethics", "Ethics and boundaries", "Confidentiality, dual relationships, and mandated reporting scenarios for social work tests."),
    cat("assessment-care-planning", "Assessment and care planning", "Biopsychosocial assessments and measurable goals on SW vignettes."),
    cat("documentation-legal", "Documentation and legal context", "Court reports, progress notes, and liability-aware documentation."),
    cat("groups-families", "Groups and families", "Family systems, group facilitation basics, and conflict mediation items."),
    cat("healthcare-navigation", "Healthcare navigation", "Benefits, access barriers, and care coordination for SW exam cases."),
    cat("community-population", "Community and population health", "Outreach, advocacy, and upstream prevention framing for SW tracks."),
    cat("diversity-equity", "Diversity and equity", "Cultural humility, implicit bias awareness, and equitable service delivery."),
  ],
  "psw-hca": [
    cat("adls", "ADLs", "Bathing, dressing, toileting, and dignity-preserving assistance for PSW/HCA certification prep."),
    cat("dementia", "Dementia care", "Behavior support, wandering risk, and communication strategies for support worker exams."),
    cat("safety", "Safety and mobility", "Transfers, lifts, and home hazards for PSW-style testing."),
    cat("infection-control", "Infection control", "PPE sequences, outbreak basics, and isolation precautions for support workers."),
    cat("nutrition-hydration", "Nutrition and hydration", "Aspiration precautions, thickened liquids, and intake/output reporting."),
    cat("skin-integrity", "Skin integrity", "Pressure injury prevention, turning schedules, and reporting changes promptly."),
    cat("palliative-comfort", "Palliative and comfort care", "Comfort measures, family support, and scope boundaries on PSW items."),
    cat("challenging-behaviors", "Challenging behaviors", "Aggression, refusal, and de-escalation within PSW authorization."),
    cat("reporting-delegation", "Reporting and delegation", "What to report vs. nurse, incident reporting, and handoff clarity."),
    cat("home-care-context", "Home and residential care", "Home safety, lone-worker awareness, and client-centered routines."),
  ],
  "community-health-worker": [
    cat("outreach-enrollment", "Outreach and enrollment", "Community entry, trust-building, and program enrollment for CHW exams."),
    cat("health-education", "Health education", "Teach-back, literacy-aware materials, and measurable learning goals."),
    cat("care-coordination", "Care coordination", "Referrals, follow-up, and navigation for CHW certification contexts."),
    cat("chronic-disease-support", "Chronic disease support", "Hypertension, diabetes, and medication adherence coaching at CHW depth."),
    cat("maternal-child-chw", "Maternal and child health", "Prenatal/postpartum support cues and safe escalation for CHWs."),
    cat("behavioral-health-chw", "Behavioral health integration", "Screening basics, warm handoffs, and stigma reduction for CHWs."),
    cat("data-privacy-chw", "Data and privacy", "Consent, HIPAA basics, and field documentation expectations for CHWs."),
    cat("advocacy-policy", "Advocacy and policy", "Social determinants, policy literacy, and ethical advocacy on CHW tests."),
    cat("emergency-preparedness-chw", "Emergency preparedness", "Community messaging, shelter basics, and crisis support roles."),
    cat("evaluation-quality", "Evaluation and quality", "Process metrics, feedback loops, and quality improvement language."),
  ],
  "mental-health-addictions": [
    cat("assessment-mh", "Assessment", "Mental status exam basics, risk tiers, and safety planning for worker-level exams."),
    cat("crisis-mh", "Crisis services", "Triage, voluntary vs involuntary pathways awareness, and de-escalation drills."),
    cat("substance-use", "Substance use", "Withdrawal recognition, MAT support roles, and harm reduction framing."),
    cat("trauma-informed", "Trauma-informed care", "Triggers, re-traumatization avoidance, and stabilization skills."),
    cat("groups-milieu", "Groups and milieu", "Facilitation basics, boundaries, and documentation in residential settings."),
    cat("documentation-mh", "Documentation", "Progress notes, treatment planning support, and legal sensitivity."),
    cat("ethics-mh", "Ethics and boundaries", "Confidentiality, dual relationships, and scope in mental health support roles."),
    cat("suicide-self-harm", "Suicide and self-harm safety", "Screening, means reduction language, and immediate escalation."),
    cat("children-youth-mh", "Children and youth", "Assent, guardian involvement, and school-linked care edges."),
    cat("co-occurring", "Co-occurring disorders", "Integrated treatment awareness and referral patterns for support exams."),
  ],
  "medical-assistant": [
    cat("office-clinical-flow", "Office clinical flow", "Rooming, vitals, and chief-complaint capture for MA certification prep."),
    cat("minor-procedures", "Minor procedures", "Sterile setup, assisting suturing, and wound care support within MA scope."),
    cat("phlebotomy-specimen", "Phlebotomy and specimens", "Order of draw, labeling, and patient identification for MA exams."),
    cat("ekg-basics-ma", "EKG basics", "Lead placement assistance, artifact recognition, and escalation when abnormal."),
    cat("pharmacology-ma", "Pharmacology support", "Routes, rights, and medication administration safeguards for MAs."),
    cat("chronic-care-ma", "Chronic care panels", "Diabetes, HTN follow-up support, and patient coaching at MA depth."),
    cat("regulatory-compliance-ma", "Regulatory compliance", "OSHA, CLIA-waived testing, and scope reminders for MA tests."),
    cat("patient-communication-ma", "Patient communication", "Difficult news support, chaperoning, and teach-back."),
    cat("infection-control-ma", "Infection control", "PPE, sterilization, and room turnover for outpatient clinics."),
    cat("admin-documentation-ma", "Administrative documentation", "Prior auth support, referrals, and EHR accuracy items."),
  ],
  "dental-assistant": [
    cat("chairside-four-handed", "Chairside four-handed dentistry", "Instrument transfer, suctioning, and ergonomics for DA exams."),
    cat("infection-dental", "Infection control in dentistry", "Sterilization monitoring, spatter control, and dental unit waterlines."),
    cat("radiography-dental", "Dental radiography", "Paralleling technique, safety, and retake criteria for dental assistants."),
    cat("materials-impressions", "Materials and impressions", "Mixing, setting times, and bite registration support."),
    cat("preventive-dental", "Preventive procedures", "Polishing, sealants, and fluoride within DA authorization."),
    cat("oral-path-basics", "Oral pathology awareness", "Lesion recognition, documentation, and escalation to dentist."),
    cat("pharmacology-dental", "Dental office pharmacology", "Anesthetics, antibiotics support roles, and allergy checks."),
    cat("specialties-dental", "Specialty rotations", "Ortho, pedo, perio awareness items common on DA tests."),
    cat("front-office-dental", "Front office support", "Scheduling, records release, and HIPAA in dental settings."),
    cat("emergency-dental", "Dental office emergencies", "Syncope, bleeding, and airway support until EMS arrives."),
  ],
  "dental-hygiene": [
    cat("periodontal-assessment", "Periodontal assessment", "Charting, probing, and staging support for hygiene board prep."),
    cat("preventive-education", "Preventive education", "OHI, tobacco cessation, and caries risk counseling for hygienists."),
    cat("instrumentation", "Instrumentation", "Scaler selection, adaptation, and sharpening awareness at exam depth."),
    cat("radiology-hygiene", "Radiology for hygiene", "Selection criteria, safety, and quality for hygiene licensure items."),
    cat("pharmacology-hygiene", "Pharmacology for hygiene", "Local anesthesia support roles, contraindications, and medical histories."),
    cat("medical-emergencies-dental", "Medical emergencies in dental", "VS, syncope, and emergency drug kit awareness."),
    cat("ethics-law-hygiene", "Ethics and law", "Scope, advertising, and professional conduct for dental hygiene boards."),
    cat("special-populations-hygiene", "Special populations", "Pregnancy, diabetes, and immunocompromise considerations."),
    cat("orthodontic-support", "Orthodontic support", "Appliance care, debond assistance, and hygiene maintenance."),
    cat("public-health-dental", "Public health dental", "Community programs, fluoride varnish, and screening ethics."),
  ],
  "dietetic-technician": [
    cat("mnt-support", "Medical nutrition therapy support", "Screening, care plan support, and nutrient-focused interventions."),
    cat("foodservice-safety", "Foodservice safety", "HACCP basics, temp logs, and allergen control for technician exams."),
    cat("nutritional-science", "Nutritional science", "Macros, metabolism, and lab correlation at DTR depth."),
    cat("documentation-dtr", "Documentation", "ADIME-style support notes and calorie counts for technician scope."),
    cat("enteral-parenteral-awareness", "Enteral support awareness", "Formula handling, tube care support roles, and escalation."),
    cat("community-nutrition", "Community nutrition", "WIC-style programs, education, and outreach items."),
    cat("regulatory-menu", "Regulatory and menu standards", "Labeling, nutrient claims, and school meal rules."),
    cat("quality-improvement-dtr", "Quality improvement", "Audit cycles, corrective actions, and KPI basics."),
    cat("pediatric-nutrition", "Pediatric nutrition", "Growth charts, feeding issues, and family coaching support."),
    cat("renal-diabetes-nutrition", "Renal and diabetes nutrition", "Diet modifications and monitoring support for tech exams."),
  ],
  emt: [
    cat("scene-safety", "Scene safety", "MECHANIC, BSI, hazards, and staging for EMT certification prep."),
    cat("primary-assessment", "Primary assessment", "ABCDE, DCAP-BTLS, and rapid transport decisions for BLS exams."),
    cat("airway-bls", "Airway (BLS)", "OPA/NPA, BVM, and airway adjunct sequencing for EMT items."),
    cat("circulation-hemorrhage", "Circulation and hemorrhage", "Bleeding control, shock recognition, and perfusion checks."),
    cat("medical-emergencies-emt", "Medical emergencies", "Stroke, hypoglycemia, and respiratory distress at EMT depth."),
    cat("trauma-emt", "Trauma", "Splinting, helmet removal judgment, and MCI triage basics."),
    cat("special-populations-emt", "Special populations", "Pediatrics, geriatrics, and pregnancy considerations in EMS."),
    cat("operations-ems", "EMS operations", "Radio, documentation, and refusal capacity items."),
    cat("environmental-toxic", "Environmental and toxicological", "Heat/cold, bites, and overdose support until ALS."),
    cat("transport-legal", "Transport and legal", "Consent, custody, and destination decisions on EMT exams."),
  ],
  sonography: [
    cat("ultrasound-physics", "Ultrasound physics", "Knobology, artifacts, and bioeffects for sonography registry prep."),
    cat("abdomen-small-parts", "Abdomen and small parts", "Organ windows, measurements, and pathology recognition at tech depth."),
    cat("ob-gyn-sono", "OB/GYN sonography", "Trimester scans, biometry, and safety language for allied sonography tracks."),
    cat("vascular-sono", "Vascular ultrasound", "Doppler basics, ABI support, and quality criteria."),
    cat("echocardiography-basics", "Echocardiography basics", "Views, function metrics awareness, and emergent findings escalation."),
    cat("patient-care-sono", "Patient care in sonography", "Consent, modesty, and difficult patient communication."),
    cat("infection-sono", "Infection prevention", "Probe disinfection, gel, and transducer handling for sonographers."),
    cat("quality-assurance-sono", "Quality assurance", "Image optimization, repeat criteria, and peer review language."),
    cat("MSK-sono", "MSK ultrasound", "Joint scanning support roles and ergonomic injury prevention."),
    cat("pediatric-sono", "Pediatric sonography", "Sedation alternatives, family-centered scanning, and safety."),
  ],
  radiography: [
    cat("positioning-rad", "Radiographic positioning", "Projections, landmarks, and CR/DR receptor handling for radiography exams."),
    cat("radiation-protection", "Radiation protection", "Shielding, collimation, and dose awareness for technologist prep."),
    cat("image-analysis-rad", "Image analysis", "Critique, artifacts, and repeat decision rules on radiography tests."),
    cat("fluoro-rad", "Fluoroscopy support", "Time/distance/shielding and patient coaching during fluoro."),
    cat("trauma-portable", "Trauma and portable", "Trauma series priorities and portable CXR workflow."),
    cat("contrast-rad", "Contrast procedures", "Premedication checks and reaction readiness for radiography tracks."),
    cat("pediatric-rad", "Pediatric imaging", "Gonadal shielding, immobilization ethics, and dose reduction."),
    cat("orthopedic-rad", "MSK imaging", "Long bone series, joint lines, and fracture visibility items."),
    cat("quality-rad", "Quality and QA", "QC tools, reject analysis, and accreditation-minded habits."),
    cat("professional-rad", "Professional practice", "Ethics, scope, and interprofessional communication."),
  ],
  "lab-assistant": [
    cat("phlebotomy-mla", "Phlebotomy", "Venipuncture order, patient ID, and complication recognition for MLA exams."),
    cat("specimen-processing", "Specimen processing", "Centrifugation, aliquoting, and storage rules for lab assistants."),
    cat("micro-specimen", "Microbiology specimen prep", "Culture setup, plating, and contamination avoidance at assistant depth."),
    cat("urinalysis-mla", "Urinalysis", "UA processing, dipstick QC awareness, and reporting pathways."),
    cat("hematology-mla", "Hematology support", "Smear prep, slide staining support, and diff QC awareness."),
    cat("chemistry-mla", "Chemistry support", "Reagent handling, calibrations support roles, and delta checks."),
    cat("inventory-supplies", "Inventory and supplies", "Requisitions, lot tracking, and temperature monitoring."),
    cat("safety-mla", "Safety", "PPE, spills, and sharps for laboratory assistant certification."),
    cat("informatics-lab", "Lab informatics", "LIS result routing, critical value call-outs support, and downtime procedures."),
    cat("point-of-care-mla", "Point-of-care testing", "Waived testing workflows and QC documentation for assistants."),
  ],
};

const TOPIC_TO_TAXONOMY: Record<string, Record<string, { primary: string; secondaries?: string[] }>> = {
  mlt: {
    "lab-values": { primary: "clinical-chemistry", secondaries: ["hematology", "urinalysis-body-fluids"] },
    "infection-control": { primary: "microbiology", secondaries: ["lab-safety-qc"] },
    "medical-terminology": { primary: "specimens-preanalytics", secondaries: ["clinical-chemistry"] },
    "clinical-documentation": { primary: "lab-safety-qc", secondaries: ["specimens-preanalytics"] },
  },
  paramedic: {
    "patient-assessment": { primary: "medical-emergencies", secondaries: ["airway"] },
    "vital-signs": { primary: "shock", secondaries: ["cardiology"] },
    "emergency-response": { primary: "trauma", secondaries: ["operations-communications"] },
    "patient-communication": { primary: "operations-communications", secondaries: ["documentation-ems"] },
    "clinical-documentation": { primary: "documentation-ems", secondaries: ["operations-communications"] },
  },
  respiratory: {
    "patient-assessment": { primary: "abgs", secondaries: ["oxygen-therapy"] },
    "vital-signs": { primary: "oxygen-therapy", secondaries: ["pulmonary-disease"] },
    "emergency-response": { primary: "ventilation", secondaries: ["airway-clearance"] },
    "infection-control": { primary: "infectious-pulmonary", secondaries: ["equipment-alarms-rt"] },
    "human-physiology": { primary: "pulmonary-disease", secondaries: ["abgs"] },
  },
  "social-work": {
    "patient-communication": { primary: "mental-health", secondaries: ["crisis"] },
    "clinical-documentation": { primary: "documentation-legal", secondaries: ["ethics"] },
    "healthcare-teamwork": { primary: "healthcare-navigation", secondaries: ["community-population"] },
    "medical-ethics": { primary: "ethics", secondaries: ["documentation-legal"] },
  },
  "psw-hca": {
    "patient-assessment": { primary: "adls", secondaries: ["reporting-delegation"] },
    "vital-signs": { primary: "reporting-delegation", secondaries: ["safety"] },
    "patient-communication": { primary: "dementia", secondaries: ["challenging-behaviors"] },
    "infection-control": { primary: "infection-control", secondaries: ["home-care-context"] },
    "healthcare-teamwork": { primary: "reporting-delegation", secondaries: ["home-care-context"] },
  },
  pta: {
    "patient-assessment": { primary: "data-collection", secondaries: ["safety-infection"] },
    "human-anatomy": { primary: "orthopedic-rehab", secondaries: ["neurologic-rehab"] },
    "human-physiology": { primary: "cardiopulmonary-rehab", secondaries: ["therapeutic-exercise"] },
    "vital-signs": { primary: "cardiopulmonary-rehab", secondaries: ["data-collection"] },
    "patient-communication": { primary: "patient-education", secondaries: ["ethics-delegation"] },
  },
  ota: {
    "patient-assessment": { primary: "adls-iadls", secondaries: ["safety-documentation"] },
    "patient-communication": { primary: "mental-health-ota", secondaries: ["groups-activity"] },
    "clinical-documentation": { primary: "safety-documentation", secondaries: ["ethics-scope-ota"] },
    "human-anatomy": { primary: "orthotics-adaptive", secondaries: ["adls-iadls"] },
    "human-physiology": { primary: "cognition-perception", secondaries: ["ergonomics-work"] },
  },
  imaging: {
    "imaging-basics": { primary: "image-quality", secondaries: ["radiation-safety-alara"] },
    "patient-assessment": { primary: "patient-positioning", secondaries: ["documentation-handoff"] },
    "vital-signs": { primary: "patient-positioning", secondaries: ["infection-imaging"] },
    "medical-terminology": { primary: "documentation-handoff", secondaries: ["equipment-qa"] },
  },
  "pharmacy-tech": {
    "medication-safety": { primary: "medication-safety-tech", secondaries: ["top-200-drugs"] },
    "pharmacology-basics": { primary: "top-200-drugs", secondaries: ["calculations"] },
    "medical-terminology": { primary: "informatics-billing-support", secondaries: ["non-sterile-compounding"] },
    "clinical-documentation": { primary: "inventory-management", secondaries: ["regulatory-law"] },
  },
  "community-health-worker": {
    "healthcare-teamwork": { primary: "care-coordination", secondaries: ["advocacy-policy"] },
    "patient-communication": { primary: "health-education", secondaries: ["outreach-enrollment"] },
    "medical-ethics": { primary: "data-privacy-chw", secondaries: ["advocacy-policy"] },
    "patient-assessment": { primary: "chronic-disease-support", secondaries: ["outreach-enrollment"] },
  },
  "mental-health-addictions": {
    "patient-communication": { primary: "trauma-informed", secondaries: ["assessment-mh"] },
    "clinical-documentation": { primary: "documentation-mh", secondaries: ["ethics-mh"] },
    "healthcare-teamwork": { primary: "groups-milieu", secondaries: ["assessment-mh"] },
    "medical-ethics": { primary: "ethics-mh", secondaries: ["documentation-mh"] },
  },
  "medical-assistant": {
    "medication-safety": { primary: "pharmacology-ma", secondaries: ["regulatory-compliance-ma"] },
    "vital-signs": { primary: "office-clinical-flow", secondaries: ["infection-control-ma"] },
    "clinical-documentation": { primary: "admin-documentation-ma", secondaries: ["office-clinical-flow"] },
    "patient-assessment": { primary: "office-clinical-flow", secondaries: ["phlebotomy-specimen"] },
  },
  "dental-assistant": {
    "infection-control": { primary: "infection-dental", secondaries: ["radiography-dental"] },
    "patient-communication": { primary: "chairside-four-handed", secondaries: ["front-office-dental"] },
    "medical-terminology": { primary: "oral-path-basics", secondaries: ["materials-impressions"] },
    "vital-signs": { primary: "emergency-dental", secondaries: ["chairside-four-handed"] },
  },
  "dental-hygiene": {
    "medical-ethics": { primary: "ethics-law-hygiene", secondaries: ["preventive-education"] },
    "human-anatomy": { primary: "periodontal-assessment", secondaries: ["radiology-hygiene"] },
    "pharmacology-basics": { primary: "pharmacology-hygiene", secondaries: ["medical-emergencies-dental"] },
    "infection-control": { primary: "preventive-education", secondaries: ["instrumentation"] },
  },
  "dietetic-technician": {
    "healthcare-teamwork": { primary: "community-nutrition", secondaries: ["mnt-support"] },
    "human-physiology": { primary: "nutritional-science", secondaries: ["renal-diabetes-nutrition"] },
    "medical-terminology": { primary: "documentation-dtr", secondaries: ["regulatory-menu"] },
    "clinical-documentation": { primary: "documentation-dtr", secondaries: ["quality-improvement-dtr"] },
  },
  emt: {
    "emergency-response": { primary: "trauma-emt", secondaries: ["medical-emergencies-emt"] },
    "patient-assessment": { primary: "primary-assessment", secondaries: ["scene-safety"] },
    "vital-signs": { primary: "circulation-hemorrhage", secondaries: ["primary-assessment"] },
    "human-anatomy": { primary: "special-populations-emt", secondaries: ["airway-bls"] },
  },
  sonography: {
    "imaging-basics": { primary: "ultrasound-physics", secondaries: ["image-quality"] },
    "patient-assessment": { primary: "patient-care-sono", secondaries: ["abdomen-small-parts"] },
    "human-physiology": { primary: "abdomen-small-parts", secondaries: ["ob-gyn-sono"] },
    "medical-terminology": { primary: "quality-assurance-sono", secondaries: ["patient-care-sono"] },
  },
  radiography: {
    "imaging-basics": { primary: "positioning-rad", secondaries: ["image-analysis-rad"] },
    "lab-values": { primary: "contrast-rad", secondaries: ["quality-rad"] },
    "human-physiology": { primary: "trauma-portable", secondaries: ["orthopedic-rad"] },
    "infection-control": { primary: "professional-rad", secondaries: ["radiation-protection"] },
  },
  "lab-assistant": {
    "lab-values": { primary: "chemistry-mla", secondaries: ["hematology-mla"] },
    "infection-control": { primary: "safety-mla", secondaries: ["micro-specimen"] },
    "clinical-documentation": { primary: "informatics-lab", secondaries: ["specimen-processing"] },
    "medical-terminology": { primary: "specimen-processing", secondaries: ["urinalysis-mla"] },
  },
};

function slugSetForProfession(professionKey: string): Set<string> {
  return new Set((ALLIED_PROFESSION_TAXONOMIES[professionKey] ?? []).map((c) => c.slug));
}

export function getAlliedProfessionTaxonomyCategories(professionKey: string): AlliedProfessionTaxonomyCategory[] {
  const k = professionKey.trim().toLowerCase();
  return ALLIED_PROFESSION_TAXONOMIES[k] ?? [];
}

export function assertAlliedTaxonomyDepthOrThrow(): void {
  for (const [prof, cats] of Object.entries(ALLIED_PROFESSION_TAXONOMIES)) {
    if (cats.length < MIN_ALLIED_PROFESSION_TAXONOMY_CATEGORIES) {
      throw new Error(`Allied taxonomy too shallow for ${prof}: ${cats.length} < ${MIN_ALLIED_PROFESSION_TAXONOMY_CATEGORIES}`);
    }
  }
}

/** Normalize taxonomy slug from query string; returns null if unknown for profession. */
export function normalizeAlliedTaxonomySlugForProfession(
  professionKey: string,
  raw: string | undefined,
): string | null {
  if (!raw?.trim()) return null;
  const s = raw.trim().toLowerCase();
  const allowed = slugSetForProfession(professionKey);
  return allowed.has(s) ? s : null;
}

export function assignAlliedLessonTaxonomy(
  professionKey: string,
  topicSlug: string | undefined | null,
): AlliedLessonTaxonomyAssignment {
  const pk = professionKey.trim().toLowerCase();
  const cats = ALLIED_PROFESSION_TAXONOMIES[pk];
  const fallback = cats?.[0]?.slug ?? "general";
  const t = (topicSlug ?? "").trim().toLowerCase();
  const map = TOPIC_TO_TAXONOMY[pk]?.[t];
  if (map) {
    const allowed = slugSetForProfession(pk);
    const primary = allowed.has(map.primary) ? map.primary : fallback;
    const secondaries = (map.secondaries ?? []).filter((s) => allowed.has(s) && s !== primary);
    return { primary, secondaries };
  }
  return { primary: fallback, secondaries: [] };
}

export function lessonMatchesAlliedTaxonomyFilter(
  professionKey: string,
  lesson: Pick<PathwayLessonRecord, "topicSlug">,
  taxonomySlugsIn: string[] | undefined,
): boolean {
  if (!taxonomySlugsIn?.length) return true;
  const want = new Set(taxonomySlugsIn.map((s) => s.trim().toLowerCase()).filter(Boolean));
  if (want.size === 0) return true;
  const { primary, secondaries } = assignAlliedLessonTaxonomy(professionKey, lesson.topicSlug);
  if (want.has(primary)) return true;
  return secondaries.some((s) => want.has(s));
}

export function alliedTaxonomyClustersFromLessons(
  professionKey: string,
  lessons: Pick<PathwayLessonRecord, "topicSlug">[],
): AlliedTaxonomyCluster[] {
  const cats = getAlliedProfessionTaxonomyCategories(professionKey);
  const bySlug = new Map(cats.map((c) => [c.slug, { label: c.label, count: 0 }]));
  for (const lesson of lessons) {
    const { primary, secondaries } = assignAlliedLessonTaxonomy(professionKey, lesson.topicSlug);
    const p = bySlug.get(primary);
    if (p) p.count += 1;
    for (const s of secondaries) {
      const sec = bySlug.get(s);
      if (sec) sec.count += 1;
    }
  }
  return cats
    .map((c) => {
      const row = bySlug.get(c.slug);
      return { slug: c.slug, label: c.label, count: row?.count ?? 0 };
    })
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function alliedProfessionTaxonomyMetaTitle(
  pathway: ExamPathwayDefinition,
  professionH1: string,
  categoryLabel: string,
): string {
  const place = pathwayCountryLabel(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  return `${categoryLabel} · ${professionH1} · ${examName} (${place}) | NurseNest`;
}

export function alliedProfessionTaxonomyMetaDescription(
  pathway: ExamPathwayDefinition,
  professionH1: string,
  category: AlliedProfessionTaxonomyCategory,
): string {
  const place = pathwayCountryLabel(pathway);
  return `${category.seoDescription} ${professionH1} — ${place}.`;
}
