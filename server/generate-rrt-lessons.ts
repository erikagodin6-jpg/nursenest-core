import crypto from "crypto";
import pg from "pg";
import type OpenAI from "openai";

const PROD_URL = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
if (!PROD_URL) {
  console.error("[RRT-Lessons] No DATABASE_URL configured");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: PROD_URL });

async function getOpenAI(): Promise<OpenAI> {
  const OpenAIConstructor = (await import("openai")).default;
  return new OpenAIConstructor({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

interface ClinicalVignette {
  scenario: string;
  question: string;
  answer: string;
}

interface LessonContent {
  overview: string;
  cardiopulmonaryPhysiology: string;
  pathophysiology: string;
  clinicalPresentation: string;
  assessment: string;
  abgInterpretation: string;
  respiratoryInterventions: string;
  ventilatorManagement: string;
  complications: string;
  clinicalPearls: string[];
  clinicalVignettes?: ClinicalVignette[];
  keyTerms?: string[];
  examTrapWarning?: string;
  decisionTree?: string;
}

interface FlashcardData {
  cardType: "definition" | "clinical_decision" | "red_flag";
  front: string;
  back: string;
  rationale: string;
  clinicalPearl: string;
}

interface LinkedQuestion {
  questionId: string;
  stem: string;
  source: "exam_questions" | "allied_questions";
}

interface RRTLessonTopic {
  slug: string;
  title: string;
  domain: string;
  bodySystem: string;
  topic: string;
  subtopic: string;
  difficulty: number;
  seoTitle: string;
  seoDescription: string;
  imageKeywords: string[];
}

const RRT_LESSON_TOPICS: RRTLessonTopic[] = [
  { slug: "copd-exacerbation-management", title: "COPD Exacerbation Management", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "COPD", subtopic: "Acute Exacerbation", difficulty: 3, seoTitle: "COPD Exacerbation: RRT Exam Guide", seoDescription: "Master COPD exacerbation assessment and management for the Canadian RRT licensing exam.", imageKeywords: ["copd", "oxygen delivery", "ventilator"] },
  { slug: "ards-pathophysiology-ventilation", title: "Acute Respiratory Distress Syndrome (ARDS)", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "ARDS", subtopic: "Pathophysiology and Ventilation", difficulty: 4, seoTitle: "ARDS Management for Respiratory Therapists", seoDescription: "Comprehensive ARDS guide covering Berlin criteria, lung-protective ventilation, and prone positioning.", imageKeywords: ["ventilator", "lung anatomy"] },
  { slug: "mechanical-ventilation-modes", title: "Mechanical Ventilation Modes", domain: "Mechanical Ventilation", bodySystem: "Respiratory", topic: "Mechanical Ventilation", subtopic: "Ventilation Modes", difficulty: 4, seoTitle: "Ventilator Modes: AC, SIMV, PSV & More", seoDescription: "Complete guide to mechanical ventilation modes including AC, SIMV, PSV, and advanced modes for RRT exam prep.", imageKeywords: ["ventilator", "ventilator waveforms"] },
  { slug: "abg-interpretation-comprehensive", title: "ABG Interpretation Comprehensive Guide", domain: "ABGs & Acid-Base", bodySystem: "Respiratory", topic: "ABG Interpretation", subtopic: "Systematic Approach", difficulty: 3, seoTitle: "ABG Interpretation for RRT Exam", seoDescription: "Step-by-step ABG interpretation with clinical cases, compensation rules, and acid-base disorders.", imageKeywords: ["abg", "acid-base"] },
  { slug: "oxygen-delivery-devices-selection", title: "Oxygen Delivery Devices & Selection", domain: "Oxygen Therapy", bodySystem: "Respiratory", topic: "Oxygen Therapy", subtopic: "Device Selection", difficulty: 2, seoTitle: "Oxygen Delivery Systems: RRT Study Guide", seoDescription: "Master oxygen delivery device selection from nasal cannula to HFNC for the respiratory therapy exam.", imageKeywords: ["oxygen delivery"] },
  { slug: "airway-management-intubation", title: "Airway Management & Intubation", domain: "Airway & Emergencies", bodySystem: "Respiratory", topic: "Airway Management", subtopic: "Intubation Techniques", difficulty: 4, seoTitle: "Airway Management for Respiratory Therapists", seoDescription: "Comprehensive airway management guide covering ETT intubation, difficult airway algorithms, and emergency airways.", imageKeywords: ["tracheostomy", "lung anatomy"] },
  { slug: "neonatal-respiratory-care", title: "Neonatal Respiratory Care", domain: "Neonatal/Pediatric RT", bodySystem: "Respiratory", topic: "Neonatal Care", subtopic: "Respiratory Support", difficulty: 4, seoTitle: "Neonatal Respiratory Care for RRT Exam", seoDescription: "Neonatal respiratory distress syndrome, surfactant therapy, and neonatal ventilation strategies.", imageKeywords: ["oxygen delivery", "ventilator"] },
  { slug: "pulmonary-function-testing", title: "Pulmonary Function Testing (PFTs)", domain: "Diagnostics", bodySystem: "Respiratory", topic: "PFT", subtopic: "Spirometry and Lung Volumes", difficulty: 3, seoTitle: "PFT Interpretation Guide for RRTs", seoDescription: "Pulmonary function testing interpretation including spirometry, lung volumes, and DLCO for RRT exam.", imageKeywords: ["lung anatomy"] },
  { slug: "sleep-apnea-niv-therapy", title: "Sleep Apnea & Non-Invasive Ventilation", domain: "Sleep & NIV", bodySystem: "Respiratory", topic: "Sleep Apnea", subtopic: "CPAP/BiPAP Therapy", difficulty: 3, seoTitle: "Sleep Apnea & NIV: RRT Study Guide", seoDescription: "Obstructive and central sleep apnea management with CPAP, BiPAP, and titration protocols.", imageKeywords: ["ventilator", "oxygen delivery"] },
  { slug: "bronchoscopy-procedures", title: "Bronchoscopy Procedures & Assistance", domain: "Diagnostics", bodySystem: "Respiratory", topic: "Bronchoscopy", subtopic: "Procedure Assistance", difficulty: 3, seoTitle: "Bronchoscopy for Respiratory Therapists", seoDescription: "Bronchoscopy procedure types, RRT roles, patient preparation, and post-procedure monitoring.", imageKeywords: ["lung anatomy"] },
  { slug: "pneumothorax-management", title: "Pneumothorax Management", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "Pneumothorax", subtopic: "Assessment and Treatment", difficulty: 3, seoTitle: "Pneumothorax Management for RRT Exam", seoDescription: "Tension and simple pneumothorax assessment, chest tube management, and ventilator considerations.", imageKeywords: ["chest tube", "lung anatomy"] },
  { slug: "asthma-exacerbation-treatment", title: "Asthma Exacerbation Treatment", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "Asthma", subtopic: "Acute Exacerbation", difficulty: 3, seoTitle: "Asthma Exacerbation: RRT Clinical Guide", seoDescription: "Status asthmaticus assessment, bronchodilator protocols, and escalation pathways for respiratory therapists.", imageKeywords: ["asthma", "oxygen delivery"] },
  { slug: "pulmonary-embolism-respiratory", title: "Pulmonary Embolism: Respiratory Considerations", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "Pulmonary Embolism", subtopic: "Respiratory Assessment", difficulty: 4, seoTitle: "Pulmonary Embolism for Respiratory Therapists", seoDescription: "PE recognition, V/Q mismatch pathophysiology, ABG findings, and respiratory support strategies.", imageKeywords: ["abg", "lung anatomy"] },
  { slug: "weaning-mechanical-ventilation", title: "Weaning from Mechanical Ventilation", domain: "Mechanical Ventilation", bodySystem: "Respiratory", topic: "Mechanical Ventilation", subtopic: "Weaning Protocols", difficulty: 4, seoTitle: "Ventilator Weaning Protocols for RRT Exam", seoDescription: "Readiness assessment, SBT protocols, extubation criteria, and post-extubation management.", imageKeywords: ["ventilator", "ventilator waveforms"] },
  { slug: "high-flow-nasal-cannula-therapy", title: "High-Flow Nasal Cannula (HFNC) Therapy", domain: "Oxygen Therapy", bodySystem: "Respiratory", topic: "HFNC", subtopic: "Indications and Management", difficulty: 3, seoTitle: "HFNC Therapy Guide for RRTs", seoDescription: "High-flow nasal cannula therapy including ROX index, physiological benefits, and clinical applications.", imageKeywords: ["oxygen delivery"] },
  { slug: "chest-tube-management-rrt", title: "Chest Tube Management for RRTs", domain: "Critical Care RT", bodySystem: "Respiratory", topic: "Chest Tubes", subtopic: "Management and Troubleshooting", difficulty: 3, seoTitle: "Chest Tube Management for Respiratory Therapists", seoDescription: "Chest drainage systems, troubleshooting air leaks, and RRT roles in chest tube management.", imageKeywords: ["chest tube"] },
  { slug: "aerosol-drug-delivery", title: "Aerosol Drug Delivery Systems", domain: "Aerosol & Medication Delivery", bodySystem: "Respiratory", topic: "Aerosol Therapy", subtopic: "Delivery Devices", difficulty: 2, seoTitle: "Aerosol Drug Delivery for RRT Exam", seoDescription: "MDI, DPI, SVN, and mesh nebulizer comparison with drug delivery optimization techniques.", imageKeywords: ["asthma"] },
  { slug: "ecmo-basics-respiratory", title: "ECMO Basics for Respiratory Therapists", domain: "Critical Care RT", bodySystem: "Respiratory", topic: "ECMO", subtopic: "Fundamentals", difficulty: 5, seoTitle: "ECMO Fundamentals for RRTs", seoDescription: "VV-ECMO and VA-ECMO basics, cannulation, gas exchange management, and RRT responsibilities.", imageKeywords: ["ventilator", "lung anatomy"] },
  { slug: "pulmonary-rehabilitation-program", title: "Pulmonary Rehabilitation", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "Pulmonary Rehab", subtopic: "Exercise and Education", difficulty: 2, seoTitle: "Pulmonary Rehabilitation for RRT Exam", seoDescription: "Pulmonary rehab program design, exercise prescription, and patient education for chronic lung disease.", imageKeywords: ["copd", "lung anatomy"] },
  { slug: "cystic-fibrosis-management", title: "Cystic Fibrosis Management", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "Cystic Fibrosis", subtopic: "Airway Clearance", difficulty: 3, seoTitle: "Cystic Fibrosis: RRT Management Guide", seoDescription: "CF airway clearance techniques, inhaled therapies, and pulmonary monitoring for respiratory therapists.", imageKeywords: ["lung anatomy"] },
  { slug: "ventilator-waveform-analysis", title: "Ventilator Waveform Analysis", domain: "Mechanical Ventilation", bodySystem: "Respiratory", topic: "Ventilator Waveforms", subtopic: "Interpretation", difficulty: 4, seoTitle: "Ventilator Waveform Analysis for RRTs", seoDescription: "Pressure, flow, and volume waveform interpretation with asynchrony detection and troubleshooting.", imageKeywords: ["ventilator waveforms", "ventilator"] },
  { slug: "respiratory-pharmacology-bronchodilators", title: "Respiratory Pharmacology: Bronchodilators", domain: "Aerosol & Medication Delivery", bodySystem: "Respiratory", topic: "Pharmacology", subtopic: "Bronchodilators", difficulty: 3, seoTitle: "Bronchodilator Pharmacology for RRT Exam", seoDescription: "Beta-2 agonists, anticholinergics, and combination therapies for bronchospasm management.", imageKeywords: ["asthma", "copd"] },
  { slug: "tracheostomy-care-management", title: "Tracheostomy Care & Management", domain: "Airway & Emergencies", bodySystem: "Respiratory", topic: "Tracheostomy", subtopic: "Care and Emergencies", difficulty: 3, seoTitle: "Tracheostomy Care for Respiratory Therapists", seoDescription: "Tracheostomy tube types, routine care, decannulation protocols, and emergency management.", imageKeywords: ["tracheostomy"] },
  { slug: "acid-base-disorders-mixed", title: "Mixed Acid-Base Disorders", domain: "ABGs & Acid-Base", bodySystem: "Respiratory", topic: "Acid-Base", subtopic: "Mixed Disorders", difficulty: 5, seoTitle: "Mixed Acid-Base Disorders for RRT Exam", seoDescription: "Triple acid-base disorders, anion gap analysis, and Winter's formula application.", imageKeywords: ["abg", "acid-base"] },
  { slug: "ventilator-associated-pneumonia", title: "Ventilator-Associated Pneumonia Prevention", domain: "Infection Control", bodySystem: "Respiratory", topic: "VAP", subtopic: "Prevention Bundle", difficulty: 3, seoTitle: "VAP Prevention for Respiratory Therapists", seoDescription: "VAP prevention bundle, oral care protocols, and evidence-based ventilator management.", imageKeywords: ["ventilator", "pneumonia"] },
  { slug: "respiratory-failure-types", title: "Types of Respiratory Failure", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "Respiratory Failure", subtopic: "Type I and Type II", difficulty: 3, seoTitle: "Respiratory Failure Types: RRT Study Guide", seoDescription: "Type I hypoxemic and Type II hypercapnic respiratory failure differentiation and management.", imageKeywords: ["abg", "ventilator", "oxygen delivery"] },
  { slug: "patient-ventilator-asynchrony", title: "Patient-Ventilator Asynchrony", domain: "Mechanical Ventilation", bodySystem: "Respiratory", topic: "Ventilator Asynchrony", subtopic: "Detection and Correction", difficulty: 4, seoTitle: "Ventilator Asynchrony Detection for RRTs", seoDescription: "Auto-triggering, double triggering, flow starvation, and breath stacking identification and correction.", imageKeywords: ["ventilator waveforms", "ventilator"] },
  { slug: "cpap-bipap-titration", title: "CPAP & BiPAP Titration Protocols", domain: "Sleep & NIV", bodySystem: "Respiratory", topic: "NIV", subtopic: "Titration Protocols", difficulty: 3, seoTitle: "CPAP/BiPAP Titration for RRT Exam", seoDescription: "Non-invasive ventilation setup, titration protocols, mask fitting, and patient coaching techniques.", imageKeywords: ["ventilator", "oxygen delivery"] },
  { slug: "hemodynamic-monitoring-rrt", title: "Hemodynamic Monitoring for RRTs", domain: "Critical Care RT", bodySystem: "Cardiovascular", topic: "Hemodynamics", subtopic: "Monitoring Techniques", difficulty: 4, seoTitle: "Hemodynamic Monitoring for Respiratory Therapists", seoDescription: "Arterial lines, CVP, PA catheter data interpretation, and hemodynamic impact of ventilation.", imageKeywords: ["ventilator"] },
  { slug: "capnography-etco2-monitoring", title: "Capnography & EtCO2 Monitoring", domain: "Diagnostics", bodySystem: "Respiratory", topic: "Capnography", subtopic: "Waveform Interpretation", difficulty: 3, seoTitle: "Capnography Guide for Respiratory Therapists", seoDescription: "End-tidal CO2 monitoring, capnogram waveform interpretation, and clinical applications.", imageKeywords: ["ventilator waveforms", "abg"] },
  { slug: "oxygen-toxicity-complications", title: "Oxygen Toxicity & Complications", domain: "Oxygen Therapy", bodySystem: "Respiratory", topic: "Oxygen Toxicity", subtopic: "Prevention and Recognition", difficulty: 3, seoTitle: "Oxygen Toxicity for RRT Exam", seoDescription: "FiO2 thresholds, absorption atelectasis, ROP, and strategies to minimize oxygen toxicity.", imageKeywords: ["oxygen delivery", "lung anatomy"] },
  { slug: "chest-xray-interpretation-rrt", title: "Chest X-Ray Interpretation for RRTs", domain: "Diagnostics", bodySystem: "Respiratory", topic: "Chest X-Ray", subtopic: "Systematic Interpretation", difficulty: 3, seoTitle: "Chest X-Ray Reading for Respiratory Therapists", seoDescription: "Systematic CXR interpretation approach including ETT placement, pneumothorax, and effusion identification.", imageKeywords: ["lung anatomy", "pneumonia", "chest tube"] },
  { slug: "pediatric-respiratory-emergencies", title: "Pediatric Respiratory Emergencies", domain: "Neonatal/Pediatric RT", bodySystem: "Respiratory", topic: "Pediatric RT", subtopic: "Emergencies", difficulty: 4, seoTitle: "Pediatric Respiratory Emergencies for RRTs", seoDescription: "Croup, epiglottitis, bronchiolitis, and foreign body aspiration management for respiratory therapists.", imageKeywords: ["oxygen delivery", "lung anatomy"] },
  { slug: "airway-clearance-techniques", title: "Airway Clearance Techniques", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "Airway Clearance", subtopic: "Techniques and Devices", difficulty: 2, seoTitle: "Airway Clearance Techniques for RRT Exam", seoDescription: "CPT, PEP therapy, oscillatory devices, and suctioning techniques for secretion management.", imageKeywords: ["lung anatomy"] },
  { slug: "lung-protective-ventilation", title: "Lung-Protective Ventilation Strategies", domain: "Mechanical Ventilation", bodySystem: "Respiratory", topic: "ARDS Ventilation", subtopic: "Lung-Protective Strategy", difficulty: 4, seoTitle: "Lung-Protective Ventilation for RRT Exam", seoDescription: "Low tidal volume ventilation, driving pressure, PEEP optimization, and ARDSNet protocol.", imageKeywords: ["ventilator", "ventilator waveforms", "lung anatomy"] },
  { slug: "respiratory-assessment-skills", title: "Respiratory Assessment Skills", domain: "Respiratory Physiology", bodySystem: "Respiratory", topic: "Patient Assessment", subtopic: "Physical Examination", difficulty: 2, seoTitle: "Respiratory Assessment for RRTs", seoDescription: "Inspection, palpation, percussion, auscultation techniques, and breath sound interpretation.", imageKeywords: ["lung anatomy"] },
  { slug: "inhaled-corticosteroids-therapy", title: "Inhaled Corticosteroids & Anti-Inflammatory Therapy", domain: "Aerosol & Medication Delivery", bodySystem: "Respiratory", topic: "Pharmacology", subtopic: "Corticosteroids", difficulty: 3, seoTitle: "Inhaled Corticosteroids for RRT Exam", seoDescription: "ICS pharmacology, dosing, device selection, and oral candidiasis prevention strategies.", imageKeywords: ["asthma", "copd"] },
  { slug: "smoke-inhalation-injury", title: "Smoke Inhalation Injury", domain: "Airway & Emergencies", bodySystem: "Respiratory", topic: "Smoke Inhalation", subtopic: "Assessment and Treatment", difficulty: 4, seoTitle: "Smoke Inhalation Injury Management for RRTs", seoDescription: "Upper and lower airway burns, carbon monoxide poisoning, cyanide toxicity, and airway management.", imageKeywords: ["burn", "oxygen delivery"] },
  { slug: "ventilation-perfusion-matching", title: "Ventilation-Perfusion (V/Q) Matching", domain: "Respiratory Physiology", bodySystem: "Respiratory", topic: "V/Q Matching", subtopic: "Physiology and Pathology", difficulty: 4, seoTitle: "V/Q Matching for Respiratory Therapists", seoDescription: "V/Q ratio physiology, West zones, shunt vs dead space, and clinical implications.", imageKeywords: ["lung anatomy", "abg"] },
  { slug: "humidification-systems", title: "Humidification Systems in Respiratory Care", domain: "Equipment & Safety", bodySystem: "Respiratory", topic: "Humidification", subtopic: "Active and Passive Systems", difficulty: 2, seoTitle: "Humidification Systems for RRT Exam", seoDescription: "HME vs heated humidifiers, ISB, optimal humidity targets, and selection criteria.", imageKeywords: ["ventilator", "oxygen delivery"] },
  { slug: "prone-positioning-protocol", title: "Prone Positioning Protocol", domain: "Critical Care RT", bodySystem: "Respiratory", topic: "Prone Positioning", subtopic: "Protocol and Physiology", difficulty: 4, seoTitle: "Prone Positioning for ARDS: RRT Guide", seoDescription: "PROSEVA trial evidence, prone positioning technique, monitoring, and contraindications.", imageKeywords: ["ventilator", "lung anatomy"] },
  { slug: "arterial-line-sampling", title: "Arterial Line Sampling & Point-of-Care Testing", domain: "Diagnostics", bodySystem: "Cardiovascular", topic: "Arterial Lines", subtopic: "ABG Sampling", difficulty: 3, seoTitle: "Arterial Line ABG Sampling for RRTs", seoDescription: "Arterial blood gas sampling technique, Allen's test, pre-analytical errors, and POCT analyzers.", imageKeywords: ["abg"] },
  { slug: "interstitial-lung-disease", title: "Interstitial Lung Disease", domain: "Respiratory Disorders", bodySystem: "Respiratory", topic: "ILD", subtopic: "Assessment and Support", difficulty: 4, seoTitle: "Interstitial Lung Disease for RRT Exam", seoDescription: "IPF, sarcoidosis, and hypersensitivity pneumonitis pathophysiology, PFT patterns, and oxygen management.", imageKeywords: ["lung anatomy"] },
  { slug: "respiratory-medications-mucolytics", title: "Mucolytics & Airway Hydrators", domain: "Aerosol & Medication Delivery", bodySystem: "Respiratory", topic: "Pharmacology", subtopic: "Mucolytics", difficulty: 2, seoTitle: "Mucolytic Therapy for Respiratory Therapists", seoDescription: "Acetylcysteine, dornase alfa, hypertonic saline indications, dosing, and administration techniques.", imageKeywords: ["lung anatomy"] },
  { slug: "neonatal-surfactant-therapy", title: "Neonatal Surfactant Therapy", domain: "Neonatal/Pediatric RT", bodySystem: "Respiratory", topic: "Surfactant", subtopic: "Administration and Monitoring", difficulty: 4, seoTitle: "Surfactant Therapy for Neonatal RRT Exam", seoDescription: "RDS pathophysiology, surfactant types, INSURE and LISA techniques, and post-administration monitoring.", imageKeywords: ["lung anatomy", "oxygen delivery"] },
  { slug: "emergency-airway-algorithms", title: "Emergency Airway Algorithms", domain: "Airway & Emergencies", bodySystem: "Respiratory", topic: "Difficult Airway", subtopic: "Emergency Algorithms", difficulty: 5, seoTitle: "Emergency Airway Algorithms for RRTs", seoDescription: "Cannot-intubate-cannot-oxygenate pathway, cricothyrotomy, LMA rescue, and team communication.", imageKeywords: ["tracheostomy", "lung anatomy"] },
  { slug: "ventilator-graphics-troubleshooting", title: "Ventilator Graphics Troubleshooting", domain: "Mechanical Ventilation", bodySystem: "Respiratory", topic: "Ventilator Graphics", subtopic: "Troubleshooting", difficulty: 4, seoTitle: "Ventilator Troubleshooting with Graphics", seoDescription: "Using pressure-volume and flow-time loops to diagnose circuit leaks, auto-PEEP, and compliance changes.", imageKeywords: ["ventilator waveforms", "ventilator"] },
  { slug: "nitric-oxide-therapy", title: "Inhaled Nitric Oxide Therapy", domain: "Critical Care RT", bodySystem: "Respiratory", topic: "iNO", subtopic: "Administration and Monitoring", difficulty: 4, seoTitle: "Inhaled Nitric Oxide for Respiratory Therapists", seoDescription: "iNO mechanism, delivery systems, dose titration, methemoglobin monitoring, and weaning strategies.", imageKeywords: ["ventilator", "oxygen delivery"] },
  { slug: "anion-gap-metabolic-acidosis", title: "Anion Gap & Metabolic Acidosis", domain: "ABGs & Acid-Base", bodySystem: "Respiratory", topic: "Metabolic Acidosis", subtopic: "Anion Gap Analysis", difficulty: 4, seoTitle: "Anion Gap Analysis for RRT Exam", seoDescription: "MUDPILES mnemonic, delta-delta ratio, non-anion gap acidosis, and respiratory compensation.", imageKeywords: ["abg", "acid-base"] },
  { slug: "suctioning-techniques-protocols", title: "Suctioning Techniques & Protocols", domain: "Airway & Emergencies", bodySystem: "Respiratory", topic: "Suctioning", subtopic: "Open and Closed Systems", difficulty: 2, seoTitle: "Suctioning Protocols for RRT Exam", seoDescription: "Open vs closed suctioning systems, catheter sizing, suction pressure guidelines, and complications.", imageKeywords: ["tracheostomy"] },
];

const IMAGE_REF_MAP: Record<string, { ref: string; alt: string; caption: string }[]> = {
  "ventilator": [{ ref: "image_ref:ventilator_settings_chart", alt: "Ventilator settings reference chart", caption: "Common ventilator settings and initial parameters" }],
  "ventilator waveforms": [{ ref: "image_ref:ventilator_waveform_analysis", alt: "Ventilator waveform patterns", caption: "Pressure, flow, and volume waveforms in mechanical ventilation" }],
  "lung anatomy": [{ ref: "image_ref:lung_anatomy_diagram", alt: "Lung anatomy diagram", caption: "Pulmonary anatomy with bronchial tree and alveolar structure" }],
  "abg": [{ ref: "image_ref:abg_interpretation_chart", alt: "ABG interpretation reference chart", caption: "Arterial blood gas interpretation algorithm" }],
  "acid-base": [{ ref: "image_ref:acid_base_chart", alt: "Acid-base balance chart", caption: "Acid-base disorders classification and compensation rules" }],
  "oxygen delivery": [{ ref: "image_ref:oxygen_delivery_devices", alt: "Oxygen delivery devices comparison", caption: "Low-flow and high-flow oxygen delivery device FiO2 ranges" }],
  "copd": [{ ref: "image_ref:copd_pathophysiology", alt: "COPD pathophysiology diagram", caption: "Emphysema and chronic bronchitis pathological changes" }],
  "asthma": [{ ref: "image_ref:asthma_pathophysiology", alt: "Asthma airway changes diagram", caption: "Bronchospasm, inflammation, and mucus plugging in asthma" }],
  "chest tube": [{ ref: "image_ref:chest_drainage_system", alt: "Chest drainage system diagram", caption: "Three-chamber chest drainage system components" }],
  "tracheostomy": [{ ref: "image_ref:tracheostomy_tube_anatomy", alt: "Tracheostomy tube placement diagram", caption: "Tracheostomy tube types and anatomical placement" }],
  "pneumonia": [{ ref: "image_ref:pneumonia_cxr_pattern", alt: "Pneumonia chest X-ray patterns", caption: "Lobar and interstitial pneumonia radiographic findings" }],
  "burn": [{ ref: "image_ref:inhalation_injury_zones", alt: "Inhalation injury zones diagram", caption: "Upper and lower airway burn injury zones" }],
};

const RRT_LESSON_SYSTEM_PROMPT = `You are a senior respiratory therapy educator creating comprehensive clinical lessons for Canadian RRT licensing exam preparation (CBRC, NBRC TMC/CSE).

Each lesson must follow this EXACT structure with ALL sections:

1. **Overview** - 150-200 word introduction to the topic with clinical relevance and exam importance
2. **Cardiopulmonary Physiology** - Underlying physiological mechanisms, gas exchange principles, hemodynamic considerations relevant to the topic
3. **Pathophysiology** - Disease mechanisms, structural and functional changes, progression patterns
4. **Clinical Presentation** - Signs, symptoms, patient history patterns, physical examination findings with specific vital sign ranges and clinical vignettes
5. **Assessment** - Systematic assessment approach, diagnostic criteria, clinical scoring systems, laboratory values with normal ranges
6. **ABG Interpretation** - Expected ABG patterns for this condition, compensation mechanisms, oxygenation indices (P/F ratio, A-a gradient, OI), clinical ABG case examples with interpretation
7. **Respiratory Interventions** - Specific respiratory therapy interventions, medication administration (drug names, doses, routes), airway management techniques, aerosol therapy, oxygen therapy selection
8. **Ventilator Management** - Ventilator mode selection, initial settings (TV, RR, FiO2, PEEP), parameter adjustments, troubleshooting, weaning considerations specific to this condition
9. **Complications** - Potential complications, prevention strategies, early recognition signs, emergency interventions
10. **Clinical Pearls** - 8-10 high-yield exam pearls formatted as bullet points, focusing on commonly tested concepts, exam traps, and must-know facts

REQUIREMENTS:
- Total lesson length: 2000-3000 words
- Include at least 2 clinical vignette examples with specific patient data (age, vitals, ABG values, ventilator settings)
- Reference Canadian RRT exam relevance throughout
- Include specific ventilator parameters (tidal volume in mL/kg IBW, rate, FiO2, PEEP in cmH2O)
- Include specific ABG values with interpretations (pH, PaCO2, PaO2, HCO3, SaO2)
- Use evidence-based guidelines (ARDSNet, GOLD, GINA, CTS) where applicable
- Include image reference placeholders using the format: [IMAGE_REF: description_keyword]

FORMAT your output as valid JSON:
{
  "overview": "...",
  "cardiopulmonaryPhysiology": "...",
  "pathophysiology": "...",
  "clinicalPresentation": "...",
  "assessment": "...",
  "abgInterpretation": "...",
  "respiratoryInterventions": "...",
  "ventilatorManagement": "...",
  "complications": "...",
  "clinicalPearls": ["pearl1", "pearl2", ...],
  "clinicalVignettes": [
    {
      "scenario": "Patient description with vitals and data",
      "question": "Clinical question",
      "answer": "Correct approach with rationale"
    }
  ],
  "keyTerms": ["term1", "term2", ...],
  "examTrapWarning": "Common exam trap for this topic",
  "decisionTree": "Step-by-step clinical decision algorithm"
}`;

const FLASHCARD_SYSTEM_PROMPT = `You are a respiratory therapy exam prep flashcard creator. Generate high-quality flashcards for Canadian RRT licensing exam preparation.

For each lesson topic, generate exactly 8 flashcards in these categories:
- 3 "definition" cards: Key terminology, physiological concepts, or drug information
- 3 "clinical_decision" cards: Clinical scenarios requiring decision-making
- 2 "red_flag" cards: Critical safety concerns, emergency recognition, or dangerous values

FORMAT your output as valid JSON:
{
  "flashcards": [
    {
      "cardType": "definition|clinical_decision|red_flag",
      "front": "Question or prompt (clear and specific)",
      "back": "Answer with concise explanation",
      "rationale": "Brief rationale or clinical reasoning",
      "clinicalPearl": "High-yield exam pearl related to this card"
    }
  ]
}`;

function generateContentHash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 32);
}

const MIN_LESSON_WORD_COUNT = 2000;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface ValidationResult {
  valid: boolean;
  reasons: string[];
  wordCount: number;
}

function validateLessonContent(content: LessonContent): ValidationResult {
  const reasons: string[] = [];
  const requiredSections: (keyof LessonContent)[] = [
    "overview", "pathophysiology", "cardiopulmonaryPhysiology", "clinicalPresentation",
    "assessment", "abgInterpretation", "respiratoryInterventions", "ventilatorManagement",
    "complications", "clinicalPearls"
  ];

  const missingSections = requiredSections.filter((s) => !content[s]);
  if (missingSections.length > 0) {
    reasons.push(`missing_sections: ${missingSections.join(", ")}`);
  }

  const allText = requiredSections
    .map((s) =>
      typeof content[s] === "string"
        ? content[s]
        : Array.isArray(content[s])
          ? (content[s] as string[]).join(" ")
          : ""
    )
    .join(" ");
  const wc = wordCount(allText);

  if (wc < MIN_LESSON_WORD_COUNT) {
    reasons.push(`word_count_too_low: ${wc} (minimum ${MIN_LESSON_WORD_COUNT})`);
  }

  if (!content.clinicalPearls || !Array.isArray(content.clinicalPearls) || content.clinicalPearls.length < 5) {
    reasons.push("insufficient_clinical_pearls");
  }

  return { valid: reasons.length === 0, reasons, wordCount: wc };
}

function getImageRefsForLesson(topic: RRTLessonTopic): { ref: string; alt: string; caption: string }[] {
  const refs: { ref: string; alt: string; caption: string }[] = [];
  const seen = new Set<string>();
  for (const keyword of topic.imageKeywords) {
    const images = IMAGE_REF_MAP[keyword];
    if (images) {
      for (const img of images) {
        if (!seen.has(img.ref)) {
          refs.push(img);
          seen.add(img.ref);
        }
      }
    }
  }
  return refs;
}

async function generateLessonContent(openai: OpenAI, topic: RRTLessonTopic): Promise<LessonContent> {
  const userPrompt = `Generate a comprehensive respiratory therapy lesson on: "${topic.title}"

Domain: ${topic.domain}
Body System: ${topic.bodySystem}
Topic: ${topic.topic}
Subtopic: ${topic.subtopic}
Difficulty Level: ${topic.difficulty}/5

This lesson is for Canadian RRT licensing exam preparation. Focus on clinical application and exam-relevant content.

Include image reference placeholders for: ${topic.imageKeywords.join(", ")}

Return valid JSON with all required sections.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: RRT_LESSON_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 8192,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content || "{}";
  return JSON.parse(raw) as LessonContent;
}

async function generateFlashcards(openai: OpenAI, topic: RRTLessonTopic, lessonContent: LessonContent): Promise<FlashcardData[]> {
  const userPrompt = `Generate 8 flashcards for the respiratory therapy lesson: "${topic.title}"

Key concepts to cover:
- ${topic.topic} / ${topic.subtopic}
- Domain: ${topic.domain}
- Clinical pearls from the lesson: ${(lessonContent.clinicalPearls || []).slice(0, 3).join("; ")}

Generate exactly 8 flashcards (3 definition, 3 clinical_decision, 2 red_flag).
Return valid JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: FLASHCARD_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw) as { flashcards?: FlashcardData[]; cards?: FlashcardData[] };
  return parsed.flashcards || parsed.cards || [];
}

function buildLessonMarkdown(content: LessonContent, imageRefs: { ref: string; alt: string; caption: string }[]): string {
  const sections: string[] = [];

  if (content.overview) sections.push(`## Overview\n\n${content.overview}`);
  if (content.cardiopulmonaryPhysiology) sections.push(`## Cardiopulmonary Physiology\n\n${content.cardiopulmonaryPhysiology}`);
  if (content.pathophysiology) sections.push(`## Pathophysiology\n\n${content.pathophysiology}`);
  if (content.clinicalPresentation) sections.push(`## Clinical Presentation\n\n${content.clinicalPresentation}`);
  if (content.assessment) sections.push(`## Assessment\n\n${content.assessment}`);
  if (content.abgInterpretation) sections.push(`## ABG Interpretation\n\n${content.abgInterpretation}`);
  if (content.respiratoryInterventions) sections.push(`## Respiratory Interventions\n\n${content.respiratoryInterventions}`);
  if (content.ventilatorManagement) sections.push(`## Ventilator Management\n\n${content.ventilatorManagement}`);
  if (content.complications) sections.push(`## Complications\n\n${content.complications}`);

  if (content.clinicalPearls && Array.isArray(content.clinicalPearls)) {
    sections.push(`## Clinical Pearls\n\n${content.clinicalPearls.map((p: string) => `- ${p}`).join("\n")}`);
  }

  if (content.clinicalVignettes && Array.isArray(content.clinicalVignettes)) {
    const vignettes = content.clinicalVignettes.map((v: ClinicalVignette, i: number) =>
      `### Clinical Vignette ${i + 1}\n\n**Scenario:** ${v.scenario}\n\n**Question:** ${v.question}\n\n**Answer:** ${v.answer}`
    ).join("\n\n");
    sections.push(`## Clinical Vignettes\n\n${vignettes}`);
  }

  if (imageRefs.length > 0) {
    const imgSection = imageRefs.map(img => `[${img.ref}]: ${img.alt} - ${img.caption}`).join("\n");
    sections.push(`## Image References\n\n${imgSection}`);
  }

  return sections.join("\n\n---\n\n");
}

async function linkExistingQuestions(lessonSlug: string, lessonId: string, topic: RRTLessonTopic): Promise<LinkedQuestion[]> {
  const searchTerms = [topic.bodySystem, topic.topic, topic.subtopic].filter(Boolean);
  const linked: LinkedQuestion[] = [];

  for (const term of searchTerms) {
    try {
      const result = await pool.query(
        `SELECT id, stem FROM exam_questions
         WHERE career_type IN ('respiratory_therapy', 'rrt')
         AND status = 'published'
         AND (body_system ILIKE $1 OR topic ILIKE $1 OR subtopic ILIKE $1)
         LIMIT 5`,
        [`%${term}%`]
      );
      for (const row of result.rows) {
        if (!linked.find(l => l.questionId === row.id)) {
          linked.push({ questionId: row.id, stem: row.stem, source: "exam_questions" });
        }
      }
    } catch (err: any) {
      console.error(`  [Question Link Error] exam_questions search for "${term}" failed: ${err.message?.substring(0, 100)}`);
    }
  }

  try {
    const result = await pool.query(
      `SELECT id, stem FROM allied_questions
       WHERE career_type = 'rrt'
       AND status != 'rejected'
       AND (blueprint_category ILIKE $1 OR subtopic ILIKE $2)
       LIMIT 5`,
      [`%${topic.domain}%`, `%${topic.subtopic}%`]
    );
    for (const row of result.rows) {
      if (!linked.find(l => l.questionId === row.id)) {
        linked.push({ questionId: row.id, stem: row.stem, source: "allied_questions" });
      }
    }
  } catch (err: any) {
    console.error(`  [Question Link Error] allied_questions search failed: ${err.message?.substring(0, 100)}`);
  }

  const finalLinks = linked.slice(0, 10);

  if (finalLinks.length > 0) {
    const questionLinks = JSON.stringify(finalLinks.map(q => ({
      questionId: q.questionId,
      stem: q.stem.substring(0, 200),
      source: q.source,
    })));
    await pool.query(
      `UPDATE allied_lessons SET checkpoint_questions = $1 WHERE id = $2`,
      [questionLinks, lessonId]
    );
  }

  return finalLinks;
}

async function insertLesson(topic: RRTLessonTopic, content: LessonContent, imageRefs: { ref: string; alt: string; caption: string }[]): Promise<string> {
  const fullContent = buildLessonMarkdown(content, imageRefs);
  const moduleId = `rrt-${topic.domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}`;

  const existingCheck = await pool.query(
    "SELECT id FROM allied_lessons WHERE slug = $1 AND career_type = 'rrt'",
    [topic.slug]
  );

  if (existingCheck.rows.length > 0) {
    await pool.query(
      `UPDATE allied_lessons SET
        content = $1, clinical_reasoning = $2, decision_tree = $3,
        common_mistakes = $4, exam_trap_warning = $5,
        status = 'published'
       WHERE slug = $6 AND career_type = 'rrt'`,
      [
        fullContent,
        content.clinicalVignettes ? JSON.stringify(content.clinicalVignettes) : null,
        content.decisionTree || null,
        content.clinicalPearls ? JSON.stringify(content.clinicalPearls.slice(0, 5)) : null,
        content.examTrapWarning || null,
        topic.slug,
      ]
    );
    return existingCheck.rows[0].id;
  }

  const orderRes = await pool.query(
    "SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM allied_lessons WHERE career_type = 'rrt'"
  );
  const nextOrder = orderRes.rows[0].next_order;

  const result = await pool.query(
    `INSERT INTO allied_lessons (module_id, career_type, slug, title, content, order_index, clinical_reasoning, decision_tree, common_mistakes, exam_trap_warning, status)
     VALUES ($1, 'rrt', $2, $3, $4, $5, $6, $7, $8, $9, 'published')
     RETURNING id`,
    [
      moduleId,
      topic.slug,
      topic.title,
      fullContent,
      nextOrder,
      content.clinicalVignettes ? JSON.stringify(content.clinicalVignettes) : null,
      content.decisionTree || null,
      content.clinicalPearls ? JSON.stringify(content.clinicalPearls.slice(0, 5)) : null,
      content.examTrapWarning || null,
    ]
  );

  return result.rows[0].id;
}

async function insertFlashcards(
  lessonId: string,
  topic: RRTLessonTopic,
  flashcards: FlashcardData[],
  linkedQuestions: LinkedQuestion[]
): Promise<number> {
  let inserted = 0;
  const linkData: Array<Record<string, unknown>> = [{
    lessonTitle: topic.title,
    lessonUrl: `/rrt/lessons/${topic.slug}`,
    relevanceNote: `Related to ${topic.title} lesson`
  }];
  if (linkedQuestions.length > 0) {
    linkData.push({
      linkedQuestionIds: linkedQuestions.slice(0, 5).map(q => q.questionId),
      linkedQuestionCount: linkedQuestions.length
    });
  }
  const lessonLinks = JSON.stringify(linkData);

  for (const card of flashcards) {
    const contentHash = generateContentHash(`rrt:${topic.slug}:${card.front}`);
    try {
      const result = await pool.query(
        `INSERT INTO flashcard_bank (
          tier, front, back, content_hash, status, source_type,
          question_type, rationale_correct, clinical_takeaway, exam_pearl,
          lesson_links, difficulty, body_system, topic, subtopic,
          region_scope, flashcard_enabled, category, career_type, topic_tag
        ) VALUES ('rrt', $1, $2, $3, 'published', 'lesson_generation',
          $4, $5, $6, $7, $8, $9, $10, $11, $12,
          'BOTH', true, $13, 'rrt', $14)
        ON CONFLICT (content_hash) DO NOTHING
        RETURNING id`,
        [
          card.front,
          card.back,
          contentHash,
          card.cardType || "definition",
          card.rationale || "",
          card.clinicalPearl || "",
          card.clinicalPearl || "",
          lessonLinks,
          topic.difficulty,
          topic.bodySystem,
          topic.topic,
          topic.subtopic,
          topic.domain,
          topic.topic,
        ]
      );
      if (result.rowCount && result.rowCount > 0) {
        inserted++;
      }
    } catch (err: any) {
      if (!err.message?.includes("duplicate")) {
        console.error(`  [Flashcard Error] ${err.message.substring(0, 100)}`);
      }
    }
  }

  return inserted;
}

async function insertContentItem(topic: RRTLessonTopic, content: LessonContent, imageRefs: { ref: string; alt: string; caption: string }[]): Promise<void> {
  const fullContent = buildLessonMarkdown(content, imageRefs);
  const contentJson = JSON.stringify([{
    type: "markdown",
    content: fullContent,
  }]);

  const existingCheck = await pool.query(
    "SELECT id FROM content_items WHERE slug = $1",
    [`rrt-${topic.slug}`]
  );

  if (existingCheck.rows.length > 0) {
    await pool.query(
      `UPDATE content_items SET content = $1, status = 'published', updated_at = NOW() WHERE slug = $2`,
      [contentJson, `rrt-${topic.slug}`]
    );
    return;
  }

  await pool.query(
    `INSERT INTO content_items (title, slug, type, category, body_system, tier, status, tags, summary, content, seo_title, seo_description, seo_keywords, primary_keyword, published_at, updated_by_ai)
     VALUES ($1, $2, 'lesson', $3, $4, 'rrt', 'published', $5, $6, $7, $8, $9, $10, $11, NOW(), true)
     ON CONFLICT (slug) DO UPDATE SET content = $7, status = 'published', updated_at = NOW()`,
    [
      topic.title,
      `rrt-${topic.slug}`,
      topic.domain,
      topic.bodySystem,
      [topic.topic, topic.subtopic, topic.domain, "rrt", "respiratory therapy"].filter(Boolean),
      content.overview ? content.overview.substring(0, 200) : topic.seoDescription,
      contentJson,
      topic.seoTitle,
      topic.seoDescription,
      [topic.topic, topic.subtopic, "RRT", "respiratory therapy"].filter(Boolean),
      topic.topic,
    ]
  );
}

interface BatchReport {
  batchNumber: number;
  lessonsGenerated: number;
  lessonsInserted: number;
  lessonsSkipped: number;
  flashcardsCreated: number;
  questionsLinked: number;
  imageRefsAttached: number;
  errors: string[];
  topics: string[];
}

async function processBatch(openai: OpenAI, batchTopics: RRTLessonTopic[], batchNumber: number): Promise<BatchReport> {
  const report: BatchReport = {
    batchNumber,
    lessonsGenerated: 0,
    lessonsInserted: 0,
    lessonsSkipped: 0,
    flashcardsCreated: 0,
    questionsLinked: 0,
    imageRefsAttached: 0,
    errors: [],
    topics: [],
  };

  console.log(`\n=== BATCH ${batchNumber} (${batchTopics.length} lessons) ===`);

  for (let i = 0; i < batchTopics.length; i++) {
    const topic = batchTopics[i];
    console.log(`\n[${batchNumber}.${i + 1}] Generating: ${topic.title}`);
    report.topics.push(topic.title);

    try {
      const lessonContent = await generateLessonContent(openai, topic);
      report.lessonsGenerated++;
      console.log(`  Content generated (sections: ${Object.keys(lessonContent).length})`);

      const validation = validateLessonContent(lessonContent);
      if (!validation.valid) {
        console.log(`  VALIDATION FAILED (${validation.wordCount} words): ${validation.reasons.join("; ")}`);
        report.errors.push(`${topic.slug}: Validation failed - ${validation.reasons.join("; ")}`);
        report.lessonsSkipped++;
        continue;
      }
      console.log(`  Validation passed (${validation.wordCount} words)`);

      const imageRefs = getImageRefsForLesson(topic);
      report.imageRefsAttached += imageRefs.length;

      const lessonId = await insertLesson(topic, lessonContent, imageRefs);
      report.lessonsInserted++;
      console.log(`  Lesson inserted: ${lessonId}`);

      await insertContentItem(topic, lessonContent, imageRefs);
      console.log(`  Content item inserted/updated`);

      let flashcards: FlashcardData[] = [];
      try {
        flashcards = await generateFlashcards(openai, topic, lessonContent);
        console.log(`  Flashcards generated: ${flashcards.length}`);
      } catch (fcErr: any) {
        report.errors.push(`${topic.slug}: Flashcard generation failed: ${fcErr.message.substring(0, 100)}`);
        console.error(`  Flashcard generation error: ${fcErr.message.substring(0, 100)}`);
      }

      const linkedQuestions = await linkExistingQuestions(topic.slug, lessonId, topic);
      report.questionsLinked += linkedQuestions.length;
      console.log(`  Questions linked: ${linkedQuestions.length} (persisted to checkpoint_questions)`);

      if (flashcards.length < 5) {
        console.log(`  WARNING: Only ${flashcards.length} flashcards generated (minimum 5 required), skipping flashcard insert for ${topic.slug}`);
        report.errors.push(`${topic.slug}: Insufficient flashcards generated (${flashcards.length}/5 minimum)`);
      } else if (flashcards.length > 10) {
        flashcards = flashcards.slice(0, 10);
        console.log(`  Trimmed flashcards to 10 (maximum)`);
        const fcInserted = await insertFlashcards(lessonId, topic, flashcards, linkedQuestions);
        report.flashcardsCreated += fcInserted;
        console.log(`  Flashcards inserted (actual): ${fcInserted}`);
      } else {
        const fcInserted = await insertFlashcards(lessonId, topic, flashcards, linkedQuestions);
        report.flashcardsCreated += fcInserted;
        console.log(`  Flashcards inserted (actual): ${fcInserted}`);
      }

      console.log(`  Image refs: ${imageRefs.length}`);

      await new Promise(r => setTimeout(r, 1000));
    } catch (err: any) {
      report.errors.push(`${topic.slug}: ${err.message.substring(0, 200)}`);
      console.error(`  ERROR: ${err.message.substring(0, 200)}`);
    }
  }

  return report;
}

async function main() {
  const startIdx = parseInt(process.argv[2] || "0", 10);
  const endIdx = parseInt(process.argv[3] || String(RRT_LESSON_TOPICS.length), 10);
  const topics = RRT_LESSON_TOPICS.slice(startIdx, endIdx);

  console.log(`=== RRT LESSON GENERATION (topics ${startIdx}-${endIdx}, count: ${topics.length}) ===`);
  console.log(`Database: ${PROD_URL?.replace(/\/\/.*@/, "//***@")}`);

  try {
    const dbCheck = await pool.query("SELECT current_database() AS db, NOW() AS ts");
    console.log(`Database verified: ${dbCheck.rows[0].db} at ${dbCheck.rows[0].ts}`);
  } catch (err: any) {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }

  const tableCheck = await pool.query(`
    SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'allied_lessons') AS has_lessons,
           EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'flashcard_bank') AS has_flashcards,
           EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'content_items') AS has_content
  `);
  const tables = tableCheck.rows[0];
  if (!tables.has_lessons || !tables.has_flashcards) {
    console.error("Required tables not found (allied_lessons, flashcard_bank)");
    process.exit(1);
  }

  const openai = await getOpenAI();
  console.log("OpenAI client initialized");

  const BATCH_SIZE = 10;
  const batchReports: BatchReport[] = [];
  const totalBatches = Math.ceil(topics.length / BATCH_SIZE);

  for (let b = 0; b < totalBatches; b++) {
    const batchTopics = topics.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE);
    const batchNum = Math.floor(startIdx / BATCH_SIZE) + b + 1;
    const report = await processBatch(openai, batchTopics, batchNum);
    batchReports.push(report);

    console.log(`\n--- Batch ${batchNum} Summary ---`);
    console.log(`Lessons: ${report.lessonsInserted}/${report.lessonsGenerated}`);
    console.log(`Flashcards: ${report.flashcardsCreated}`);
    console.log(`Questions linked: ${report.questionsLinked}`);
    console.log(`Image refs: ${report.imageRefsAttached}`);
    if (report.errors.length > 0) {
      console.log(`Errors: ${report.errors.length}`);
      report.errors.forEach(e => console.log(`  - ${e}`));
    }

    if (b < totalBatches - 1) {
      console.log("\nWaiting 2 seconds before next batch...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  const totalLessonsInserted = batchReports.reduce((s, r) => s + r.lessonsInserted, 0);
  const totalFlashcardsCreated = batchReports.reduce((s, r) => s + r.flashcardsCreated, 0);
  const totalQuestionsLinked = batchReports.reduce((s, r) => s + r.questionsLinked, 0);
  const totalImageRefs = batchReports.reduce((s, r) => s + r.imageRefsAttached, 0);
  const totalErrors = batchReports.reduce((s, r) => s + r.errors.length, 0);

  const totalLessonsSkipped = batchReports.reduce((s, r) => s + r.lessonsSkipped, 0);

  console.log(`\n=== BATCH RUN COMPLETE (topics ${startIdx}-${endIdx}) ===`);
  console.log(`Lessons Inserted:    ${totalLessonsInserted}`);
  console.log(`Lessons Skipped:     ${totalLessonsSkipped}`);
  console.log(`Flashcards Created:  ${totalFlashcardsCreated}`);
  console.log(`Questions Linked:    ${totalQuestionsLinked}`);
  console.log(`Image Refs:          ${totalImageRefs}`);
  console.log(`Errors:              ${totalErrors}`);

  console.log(`\n=== POST-RUN DB VERIFICATION ===`);

  const targetSlugs = topics.map(t => t.slug);
  const slugVerification = await pool.query(
    `SELECT slug, status,
            (checkpoint_questions IS NOT NULL AND checkpoint_questions::text LIKE '%questionId%') as has_question_links
     FROM allied_lessons WHERE career_type = 'rrt' AND slug = ANY($1)`,
    [targetSlugs]
  );
  const foundSlugs = new Set(slugVerification.rows.map((r: { slug: string }) => r.slug));
  const missingSlugs = targetSlugs.filter(s => !foundSlugs.has(s));
  const unpublished = slugVerification.rows.filter((r: { status: string }) => r.status !== "published");
  const withoutLinks = slugVerification.rows.filter((r: { has_question_links: boolean }) => !r.has_question_links);

  console.log(`Target slugs verified:       ${foundSlugs.size}/${targetSlugs.length}`);
  if (missingSlugs.length > 0) {
    console.error(`FAIL: Missing slugs: ${missingSlugs.join(", ")}`);
  }
  if (unpublished.length > 0) {
    console.error(`FAIL: Unpublished lessons: ${unpublished.map((r: { slug: string }) => r.slug).join(", ")}`);
  }
  console.log(`Lessons without question links: ${withoutLinks.length}`);

  const fcPerLesson = await pool.query(
    `SELECT al.slug, COUNT(fb.id)::int as fc_count
     FROM allied_lessons al
     LEFT JOIN flashcard_bank fb ON fb.career_type = 'rrt'
       AND fb.lesson_links::text LIKE '%' || al.slug || '%'
     WHERE al.career_type = 'rrt' AND al.slug = ANY($1)
     GROUP BY al.slug
     HAVING COUNT(fb.id) < 5`,
    [targetSlugs]
  );
  if (fcPerLesson.rows.length > 0) {
    console.warn(`Lessons with <5 flashcards: ${fcPerLesson.rows.length}`);
    fcPerLesson.rows.forEach((r: { slug: string; fc_count: number }) => console.warn(`  ${r.slug}: ${r.fc_count} flashcards`));
  }

  const dbLessons = await pool.query("SELECT COUNT(*)::int as cnt FROM allied_lessons WHERE career_type = 'rrt' AND status = 'published'");
  const dbFlashcards = await pool.query("SELECT COUNT(*)::int as cnt FROM flashcard_bank WHERE career_type = 'rrt' AND status = 'published'");
  console.log(`\nDB Totals - Lessons (rrt, published): ${dbLessons.rows[0].cnt}`);
  console.log(`DB Totals - Flashcards (rrt, published): ${dbFlashcards.rows[0].cnt}`);

  if (missingSlugs.length > 0 || unpublished.length > 0) {
    console.error("FAIL: Not all target lessons are published in DB.");
    await pool.end();
    process.exit(1);
  }

  console.log("PASS: All target slugs verified in DB.");
  await pool.end();
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
