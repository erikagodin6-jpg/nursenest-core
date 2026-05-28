export type ClinicalSkillCompetencyTier = "foundation" | "proficiency" | "simulation_ready";
export type ClinicalSkillRoleTrack = "rn" | "rpn_lpn" | "np";

export type ClinicalSkillStep = {
  title: string;
  detail: string;
};

export type ClinicalSkillDefinition = {
  slug: string;
  categoryId: string;
  title: string;
  summary: string;
  competencyTier: ClinicalSkillCompetencyTier;
  roleTracks?: readonly ClinicalSkillRoleTrack[];
  competencyDomain?: string;
  simulationFocus?: string;
  relatedSystems?: readonly string[];
  estimatedMinutes: number;
  steps: ClinicalSkillStep[];
};

export type ClinicalSkillCategory = {
  id: string;
  title: string;
  summary: string;
};

const CATEGORIES: ClinicalSkillCategory[] = [
  {
    id: "infection_sterile",
    title: "Infection control and sterile technique",
    summary: "Protect patients with deliberate sterile fields, dressings, and aseptic discipline.",
  },
  {
    id: "medication_delivery",
    title: "Medication delivery",
    summary: "Safe injection fundamentals aligned with nursing competency checkpoints.",
  },
  {
    id: "devices_procedures",
    title: "Devices and procedures",
    summary: "High-acuity skills that combine psychomotor precision with ongoing monitoring.",
  },
  {
    id: "assessment",
    title: "Assessment and monitoring",
    summary: "Structured assessment flows that translate into documentation-ready judgments.",
  },
  {
    id: "emergency_escalation",
    title: "Emergency and escalation",
    summary: "Time-sensitive response skills for deterioration, safety threats, and urgent communication.",
  },
  {
    id: "documentation_communication",
    title: "Documentation and communication",
    summary: "Charting, handoff, teaching, and closed-loop communication skills that protect continuity of care.",
  },
];

function steps(...pairs: [string, string][]): ClinicalSkillStep[] {
  return pairs.map(([title, detail]) => ({ title, detail }));
}

/** Core hand-authored catalog — lightweight payloads only (no large JSON on hot paths). */
const CORE_SKILLS: ClinicalSkillDefinition[] = [
  {
    slug: "sterile-dressing-change",
    categoryId: "infection_sterile",
    title: "Sterile dressing change",
    summary: "Maintain a sterile field while minimizing contamination during wound exposure.",
    competencyTier: "proficiency",
    estimatedMinutes: 22,
    steps: steps(
      ["Gather supplies + explain", "Perform hand hygiene & apply PPE"],
      ["Prepare a sterile field adjacent to the wound", "Remove old dressing with clean→sterile discipline"],
      ["Assess wound per protocol", "Apply ordered dressing materials"],
      ["Secure dressing & label", "Document & restore patient comfort"],
    ),
  },
  {
    slug: "subcutaneous-injection",
    categoryId: "medication_delivery",
    title: "Subcutaneous injection",
    summary: "Angle, depth, and site rotation patterns for reliable SQ absorption.",
    competencyTier: "foundation",
    estimatedMinutes: 14,
    steps: steps(
      ["Verify order & screen allergies", "Select site using rotation map"],
      ["Prepare syringe & expel air cautiously", "Pinch vs spread technique per medication"],
      ["Insert at correct angle", "Inject slowly & withdraw safely"],
      ["Dispose sharps & observe", "Teach self-administration cues when applicable"],
    ),
  },
  {
    slug: "intramuscular-injection",
    categoryId: "medication_delivery",
    title: "Intramuscular injection",
    summary: "Landmark-led IM delivery with z-track when mucosa staining matters.",
    competencyTier: "proficiency",
    estimatedMinutes: 18,
    steps: steps(
      ["Verify order & confirm landmarks", "Position patient for muscle access"],
      ["Prepare needle length/gauge per tissue", "Clean site in expanding circles"],
      ["Insert & aspirate when protocol requires", "Inject & withdraw on same axis"],
      ["Pressure / observe per policy", "Document site & patient education"],
    ),
  },
  {
    slug: "foley-catheter-insertion-female",
    categoryId: "devices_procedures",
    title: "Urinary catheterization (female)",
    summary: "Sterile catheter insertion with dignity-preserving draping and trauma prevention.",
    competencyTier: "simulation_ready",
    estimatedMinutes: 28,
    steps: steps(
      ["Indications + consent cues", "Open sterile tray & prime catheter"],
      ["Perineal prep per protocol", "Advance catheter to urine return"],
      ["Inflate balloon only after confirmation", "Secure tubing & maintain dependent drainage"],
      ["Post-insertion checks", "Document I&O teaching"],
    ),
  },
  {
    slug: "tracheostomy-care",
    categoryId: "devices_procedures",
    title: "Tracheostomy care",
    summary: "Airway patency, inner cannula hygiene, and emergency preparedness.",
    competencyTier: "simulation_ready",
    estimatedMinutes: 26,
    steps: steps(
      ["Assess airway & suction indications", "Gather sterile vs clean supplies"],
      ["Clean stoma & surrounding skin", "Change inner cannula when ordered"],
      ["Replace dressing under tension-free anchors", "Humidification / cuff checks per policy"],
      ["Emergency algorithm readiness", "Patient coaching on covering/cough etiquette"],
    ),
  },
  {
    slug: "wound-assessment-documentation",
    categoryId: "assessment",
    title: "Wound assessment & documentation",
    summary: "Translate wound characteristics into concise, legally defensible notes.",
    competencyTier: "proficiency",
    estimatedMinutes: 20,
    steps: steps(
      ["Inspect under adequate lighting", "Measure & describe tissue layers present"],
      ["Note drainage, odor, and periwound skin", "Photograph per policy"],
      ["Identify infection escalation triggers", "Align dressing plan with orders"],
      ["Document in structured fields + teach-back", "Pair with pain reassessment and follow-up orders"],
    ),
  },
  {
    slug: "nasogastric-tube-checks",
    categoryId: "devices_procedures",
    title: "NG tube placement verification",
    summary: "Multi-modal verification before meds or feeds move downstream.",
    competencyTier: "proficiency",
    estimatedMinutes: 16,
    steps: steps(
      ["Review indication & aspiration risk", "Measure insertion depth"],
      ["Confirm placement per protocol stack", "Observe for respiratory distress"],
      ["Secure & mark insertion site", "Educate on coughing / pulling precautions"],
      ["Document verification method & time", "Report and escalate if placement uncertain or patient deteriorates"],
    ),
  },
  {
    slug: "focused-neurological-assessment",
    categoryId: "assessment",
    title: "Focused neurological assessment",
    summary: "Rapid neuro screening that catches deterioration early.",
    competencyTier: "foundation",
    estimatedMinutes: 18,
    steps: steps(
      ["Level of consciousness & orientation", "Pupils & cranial nerve spot-checks"],
      ["Motor strength ×4 extremities", "Sensation spot testing when indicated"],
      ["Speech & swallow cues", "Summarize findings for escalation"],
    ),
  },
  {
    slug: "ppe-donning-doffing",
    categoryId: "infection_sterile",
    title: "PPE donning and doffing",
    summary: "Put on and remove PPE without contaminating skin, uniform, or surrounding surfaces.",
    competencyTier: "foundation",
    estimatedMinutes: 16,
    steps: steps(
      ["Review isolation signage", "Perform hand hygiene before touching supplies"],
      ["Don gown, mask or respirator, eye protection, and gloves in correct sequence", "Enter room with supplies organized"],
      ["Remove soiled gloves and gown without touching contaminated fronts", "Remove eye protection and mask by straps or ties"],
      ["Perform hand hygiene immediately", "Dispose or reprocess equipment per policy"],
    ),
  },
  {
    slug: "vital-signs-deterioration-check",
    categoryId: "assessment",
    title: "Vital signs and deterioration check",
    summary: "Trend vital signs, recognize instability, and escalate abnormal changes promptly.",
    competencyTier: "foundation",
    estimatedMinutes: 18,
    steps: steps(
      ["Confirm patient identity and baseline", "Measure temperature, pulse, respirations, blood pressure, pain, and oxygen saturation"],
      ["Compare current values with prior trend", "Assess symptoms that explain abnormal values"],
      ["Repeat unexpected readings using correct technique", "Escalate unstable or rapidly changing findings"],
      ["Document values with time and intervention", "Reassess after nursing action"],
    ),
  },
  {
    slug: "blood-glucose-monitoring",
    categoryId: "assessment",
    title: "Blood glucose monitoring",
    summary: "Perform point-of-care glucose checks and respond safely to abnormal results.",
    competencyTier: "foundation",
    estimatedMinutes: 15,
    steps: steps(
      ["Verify order, timing, and patient identity", "Prepare meter, strip, lancet, and PPE"],
      ["Clean site and obtain sample", "Confirm result and compare with symptoms"],
      ["Act on hypoglycemia or hyperglycemia protocol", "Hold or question insulin when parameters are unsafe"],
      ["Document result and intervention", "Recheck according to protocol"],
    ),
  },
  {
    slug: "sbar-handoff-escalation",
    categoryId: "assessment",
    title: "SBAR handoff and escalation",
    summary: "Organize urgent communication so deterioration is escalated clearly and safely.",
    competencyTier: "foundation",
    estimatedMinutes: 17,
    steps: steps(
      ["Identify the immediate concern", "Summarize relevant background briefly"],
      ["State focused assessment findings", "Name the safety risk or change from baseline"],
      ["Request a clear recommendation or order", "Read back critical instructions"],
      ["Document notification and response", "Reassess after the plan changes"],
    ),
  },
  {
    slug: "oxygen-therapy-low-flow",
    categoryId: "assessment",
    title: "Low-flow oxygen therapy",
    summary: "Apply nasal cannula or simple mask oxygen while monitoring response and escalation needs.",
    competencyTier: "proficiency",
    estimatedMinutes: 18,
    steps: steps(
      ["Assess respiratory status and baseline saturation", "Verify oxygen order and delivery device"],
      ["Apply device and set flow rate as ordered", "Check fit, skin, tubing, and humidification needs"],
      ["Reassess work of breathing and saturation", "Escalate persistent hypoxia or increased distress"],
      ["Teach safety around oxygen sources", "Document device, flow rate, and response"],
    ),
  },
  {
    slug: "peripheral-iv-site-assessment",
    categoryId: "devices_procedures",
    title: "Peripheral IV site assessment",
    summary: "Assess patency, infiltration, phlebitis, and medication-safety risks before IV use.",
    competencyTier: "proficiency",
    estimatedMinutes: 16,
    steps: steps(
      ["Trace tubing and verify solution", "Inspect site for redness, swelling, leaking, or pain"],
      ["Assess patency per policy", "Stop infusion if infiltration or phlebitis is suspected"],
      ["Secure tubing without tension", "Escalate vesicant or high-alert medication concerns"],
      ["Document site condition and intervention", "Reassess after restart or site change"],
    ),
  },
  {
    slug: "fall-risk-mobility-transfer",
    categoryId: "assessment",
    title: "Fall-risk mobility transfer",
    summary: "Plan a safe transfer using mobility assessment, equipment, and patient communication.",
    competencyTier: "proficiency",
    estimatedMinutes: 20,
    steps: steps(
      ["Assess mobility, cognition, pain, and lines", "Choose gait belt, assistive device, or additional staff"],
      ["Explain plan and lock bed or chair", "Use body mechanics and cue patient movement"],
      ["Pause if dizziness or weakness occurs", "Return patient safely if instability develops"],
      ["Place call bell and fall precautions", "Document tolerance and assistance level"],
    ),
  },
  {
    slug: "enteral-feeding-safety-check",
    categoryId: "devices_procedures",
    title: "Enteral feeding safety check",
    summary: "Verify tube-feeding safety, aspiration precautions, and intolerance cues before continuing feeds.",
    competencyTier: "simulation_ready",
    estimatedMinutes: 24,
    steps: steps(
      ["Verify tube placement per protocol", "Elevate head of bed unless contraindicated"],
      ["Check formula, rate, flush order, and pump settings", "Assess nausea, distention, coughing, or respiratory change"],
      ["Hold feeding and escalate unsafe findings", "Flush tube per order and medication timing"],
      ["Document intake and patient tolerance", "Reassess aspiration risk"],
    ),
  },
  {
    slug: "oral-suctioning-airway-clearance",
    categoryId: "devices_procedures",
    title: "Oral suctioning and airway clearance",
    summary: "Clear secretions while protecting oxygenation, mucosa, and patient tolerance.",
    competencyTier: "simulation_ready",
    estimatedMinutes: 22,
    steps: steps(
      ["Assess breath sounds, cough, and oxygenation", "Prepare suction setup and PPE"],
      ["Preoxygenate or pause as indicated by policy", "Apply suction only while withdrawing catheter"],
      ["Limit suction duration and monitor tolerance", "Stop for hypoxia, bleeding, or distress"],
      ["Provide oral care and reassess airway", "Document secretion amount, character, and response"],
    ),
  },
];

type SkillSeed = {
  title: string;
  categoryId: string;
  domain: string;
  focus: string;
  roles: readonly ClinicalSkillRoleTrack[];
  systems?: readonly string[];
};

const FOUNDATION_SKILL_SEEDS: readonly SkillSeed[] = [
  { title: "Hand hygiene audit and correction", categoryId: "infection_sterile", domain: "Infection prevention", focus: "breaks in hand hygiene workflow", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "flashcards"] },
  { title: "Standard precautions room entry", categoryId: "infection_sterile", domain: "Infection prevention", focus: "routine body-fluid exposure prevention", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Contact isolation setup", categoryId: "infection_sterile", domain: "Infection prevention", focus: "contact precaution workflow and supply placement", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Droplet isolation setup", categoryId: "infection_sterile", domain: "Infection prevention", focus: "mask, eye protection, and patient transport precautions", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Airborne isolation safety check", categoryId: "infection_sterile", domain: "Infection prevention", focus: "respirator seal and negative-pressure awareness", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Clean wound dressing change", categoryId: "infection_sterile", domain: "Wound care", focus: "clean technique and wound observation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Surgical incision observation", categoryId: "assessment", domain: "Postoperative safety", focus: "expected versus unexpected incision findings", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Pressure injury prevention bundle", categoryId: "assessment", domain: "Skin integrity", focus: "turning, offloading, moisture, and nutrition cues", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "flashcards"] },
  { title: "Pain assessment and reassessment", categoryId: "assessment", domain: "Comfort and safety", focus: "pain scale, function, intervention, and reassessment timing", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Pulse oximetry accuracy check", categoryId: "assessment", domain: "Oxygenation", focus: "probe placement and artifact recognition", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "ecg-telemetry"] },
  { title: "Respiratory rate and work-of-breathing assessment", categoryId: "assessment", domain: "Oxygenation", focus: "early respiratory distress cues", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Lung sound focused assessment", categoryId: "assessment", domain: "Oxygenation", focus: "side-to-side auscultation and escalation cues", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Peripheral pulse and capillary refill check", categoryId: "assessment", domain: "Perfusion", focus: "circulation and neurovascular screening", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Intake and output measurement", categoryId: "assessment", domain: "Fluid balance", focus: "accurate totals and concerning output trends", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Daily weight workflow", categoryId: "assessment", domain: "Fluid balance", focus: "same-scale weights and fluid overload recognition", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Orthostatic vital signs", categoryId: "assessment", domain: "Mobility and perfusion", focus: "position-change symptoms and fall prevention", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Focused abdominal assessment", categoryId: "assessment", domain: "Gastrointestinal", focus: "inspection, bowel sounds, pain, and distention cues", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Bowel elimination assessment", categoryId: "assessment", domain: "Gastrointestinal", focus: "constipation, diarrhea, impaction, and medication effects", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Urinary elimination assessment", categoryId: "assessment", domain: "Genitourinary", focus: "retention, dysuria, output, and UTI cues", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Basic mental status screen", categoryId: "assessment", domain: "Neurologic and mental health", focus: "orientation, affect, behavior, and safety risk", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Fall-risk room setup", categoryId: "assessment", domain: "Mobility and safety", focus: "bed height, call bell, footwear, clutter, and alarms", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Gait belt transfer assist", categoryId: "assessment", domain: "Mobility and safety", focus: "safe body mechanics and patient cueing", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Walker and cane safety teaching", categoryId: "documentation_communication", domain: "Patient education", focus: "device positioning and teach-back", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "flashcards"] },
  { title: "Bed bath skin inspection", categoryId: "assessment", domain: "Hygiene and skin integrity", focus: "privacy, dignity, and skin risk recognition", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Oral care aspiration precautions", categoryId: "assessment", domain: "Hygiene and airway", focus: "safe positioning and secretion observation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Specimen collection labeling", categoryId: "documentation_communication", domain: "Diagnostics safety", focus: "two identifiers, timing, and transport requirements", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Urine specimen clean-catch teaching", categoryId: "documentation_communication", domain: "Diagnostics safety", focus: "patient teaching and contamination prevention", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Medication reconciliation interview", categoryId: "medication_delivery", domain: "Medication safety", focus: "home meds, allergies, supplements, and adherence barriers", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Oral medication administration", categoryId: "medication_delivery", domain: "Medication safety", focus: "rights, swallowing safety, and patient education", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Topical medication administration", categoryId: "medication_delivery", domain: "Medication safety", focus: "skin assessment, gloves, and dose-area accuracy", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Eye drop administration", categoryId: "medication_delivery", domain: "Medication safety", focus: "contamination prevention and punctal pressure when indicated", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Ear drop administration", categoryId: "medication_delivery", domain: "Medication safety", focus: "age-appropriate ear positioning and comfort", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Nasal spray administration", categoryId: "medication_delivery", domain: "Medication safety", focus: "positioning, technique, and patient teaching", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Inhaler spacer coaching", categoryId: "medication_delivery", domain: "Respiratory medication safety", focus: "timing, breath hold, and mouth rinse teaching", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Nebulizer treatment setup", categoryId: "devices_procedures", domain: "Respiratory support", focus: "assembly, tolerance, and response evaluation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Compression stocking application", categoryId: "devices_procedures", domain: "Circulation support", focus: "skin check, sizing, and contraindication awareness", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Sequential compression device setup", categoryId: "devices_procedures", domain: "Circulation support", focus: "DVT prevention and skin surveillance", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Safe feeding assistance", categoryId: "assessment", domain: "Nutrition and aspiration safety", focus: "positioning, swallow cues, and intake documentation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Dysphagia screening escalation", categoryId: "assessment", domain: "Nutrition and airway", focus: "coughing, wet voice, neuro changes, and NPO escalation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Patient identification timeout", categoryId: "documentation_communication", domain: "Safety culture", focus: "two identifiers before meds, procedures, and specimens", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Basic discharge teaching", categoryId: "documentation_communication", domain: "Patient education", focus: "medications, warning signs, follow-up, and teach-back", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "flashcards"] },
  { title: "Therapeutic communication for anxiety", categoryId: "documentation_communication", domain: "Communication", focus: "validation, safety, and concise reassurance", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "End-of-shift report basics", categoryId: "documentation_communication", domain: "Handoff", focus: "current status, risks, pending tasks, and follow-up needs", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Charting late entry correction", categoryId: "documentation_communication", domain: "Documentation", focus: "accurate correction without altering the record", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Patient refusal documentation", categoryId: "documentation_communication", domain: "Documentation", focus: "education, risk explanation, and notification", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Call bell and rounding workflow", categoryId: "assessment", domain: "Safety and comfort", focus: "pain, potty, position, possessions, and prevention", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Hypoglycemia symptom recognition", categoryId: "emergency_escalation", domain: "Emergency response", focus: "sweating, confusion, glucose check, and protocol escalation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology", "labs"] },
  { title: "Fever and infection screen", categoryId: "assessment", domain: "Infection recognition", focus: "temperature trend, source cues, and escalation timing", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Basic oxygen safety teaching", categoryId: "documentation_communication", domain: "Oxygenation", focus: "fire risk, tubing safety, and home safety teach-back", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Restraint alternative safety check", categoryId: "assessment", domain: "Ethics and safety", focus: "least-restrictive interventions and reassessment", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Sleep and delirium prevention routine", categoryId: "assessment", domain: "Geriatrics and cognition", focus: "orientation, mobility, hydration, glasses, and hearing aids", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Post-fall immediate assessment", categoryId: "emergency_escalation", domain: "Safety event response", focus: "injury check, neuro cues, provider notification, and documentation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
];

const PROFICIENCY_SKILL_SEEDS: readonly SkillSeed[] = [
  { title: "Peripheral IV insertion preparation", categoryId: "devices_procedures", domain: "IV therapy", focus: "site choice, supplies, patient explanation, and aseptic prep", roles: ["rn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Peripheral IV saline lock flush", categoryId: "devices_procedures", domain: "IV therapy", focus: "patency check, resistance, pain, and infiltration cues", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "IV medication compatibility check", categoryId: "medication_delivery", domain: "Medication safety", focus: "compatibility, line tracing, and pharmacy escalation", roles: ["rn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "IV piggyback setup", categoryId: "medication_delivery", domain: "Medication safety", focus: "secondary tubing, pump setup, and response monitoring", roles: ["rn"], systems: ["clinical-skills", "pharmacology", "med-calculations"] },
  { title: "Blood transfusion precheck", categoryId: "medication_delivery", domain: "Transfusion safety", focus: "consent, type and screen, vitals, and dual verification", roles: ["rn"], systems: ["clinical-skills", "labs"] },
  { title: "Blood transfusion reaction response", categoryId: "emergency_escalation", domain: "Transfusion safety", focus: "stop transfusion, maintain IV access, notify, and documentation", roles: ["rn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Insulin pen administration", categoryId: "medication_delivery", domain: "Diabetes safety", focus: "priming, dose, site rotation, and glucose timing", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Sliding-scale insulin safety check", categoryId: "medication_delivery", domain: "Diabetes safety", focus: "current glucose, meal timing, parameters, and hypoglycemia risk", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs", "pharmacology"] },
  { title: "Anticoagulant bleeding assessment", categoryId: "assessment", domain: "Medication safety", focus: "bleeding cues, fall risk, labs, and escalation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology", "labs"] },
  { title: "Opioid sedation reassessment", categoryId: "assessment", domain: "Medication safety", focus: "respiratory rate, sedation score, pain relief, and naloxone readiness", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "PCA pump safety round", categoryId: "devices_procedures", domain: "Pain management", focus: "settings, sedation, respiratory status, and family teaching", roles: ["rn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Chest pain focused assessment", categoryId: "assessment", domain: "Cardiac assessment", focus: "pain features, vitals, ECG readiness, and rapid escalation", roles: ["rn"], systems: ["clinical-skills", "ecg-telemetry", "clinical-scenarios"] },
  { title: "Heart failure daily assessment", categoryId: "assessment", domain: "Cardiac assessment", focus: "weight, edema, lung sounds, oxygenation, and I/O trends", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Telemetry lead placement check", categoryId: "assessment", domain: "Telemetry", focus: "lead placement, artifact, skin, and escalation of rhythm change", roles: ["rn"], systems: ["clinical-skills", "ecg-telemetry"] },
  { title: "Postoperative respiratory assessment", categoryId: "assessment", domain: "Postoperative safety", focus: "atelectasis cues, incentive spirometry, pain, and oxygenation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Postoperative bleeding assessment", categoryId: "assessment", domain: "Postoperative safety", focus: "dressing, drain, vitals, and shock cues", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Jackson-Pratt drain management", categoryId: "devices_procedures", domain: "Drain care", focus: "bulb compression, output measurement, and infection cues", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Hemovac drain management", categoryId: "devices_procedures", domain: "Drain care", focus: "suction maintenance, output trend, and site assessment", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Ostomy pouch change", categoryId: "devices_procedures", domain: "Ostomy care", focus: "stoma color, skin protection, pouch fit, and teaching", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Ostomy complication recognition", categoryId: "assessment", domain: "Ostomy care", focus: "ischemia, retraction, high output, and dehydration cues", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Enteral medication administration", categoryId: "medication_delivery", domain: "Enteral therapy", focus: "tube verification, flushing, crushing safety, and clog prevention", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Tube-feeding intolerance assessment", categoryId: "assessment", domain: "Enteral therapy", focus: "nausea, distention, aspiration cues, and provider notification", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Central-line dressing observation", categoryId: "infection_sterile", domain: "Central access", focus: "occlusion, drainage, dressing integrity, and escalation", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Central-line infection prevention bundle", categoryId: "infection_sterile", domain: "Central access", focus: "scrub-the-hub, dressing integrity, and line necessity review", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Urinary catheter maintenance bundle", categoryId: "devices_procedures", domain: "CAUTI prevention", focus: "closed system, dependent drainage, securement, and removal readiness", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Bladder scan workflow", categoryId: "devices_procedures", domain: "Urinary retention", focus: "scan technique, volume interpretation, and straight cath escalation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Straight catheterization preparation", categoryId: "devices_procedures", domain: "Urinary procedures", focus: "sterile setup, indication, and trauma prevention", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Sepsis screening workflow", categoryId: "emergency_escalation", domain: "Deterioration recognition", focus: "infection source, vitals, mental status, lactate, and escalation", roles: ["rn"], systems: ["clinical-skills", "labs", "clinical-scenarios"] },
  { title: "Stroke screen escalation", categoryId: "emergency_escalation", domain: "Neurologic emergency", focus: "FAST cues, last-known-well, glucose, and rapid notification", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Delirium prevention and escalation", categoryId: "assessment", domain: "Cognition", focus: "acute change, infection, medication, hypoxia, and safety", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "Suicide safety screening", categoryId: "assessment", domain: "Mental health safety", focus: "direct questions, environment, observation, and escalation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Violence risk de-escalation", categoryId: "documentation_communication", domain: "Mental health safety", focus: "calm stance, exit path, limit setting, and help activation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Critical lab value reporting", categoryId: "documentation_communication", domain: "Diagnostics communication", focus: "read-back, provider notification, and response documentation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs"] },
  { title: "SBAR for respiratory decline", categoryId: "documentation_communication", domain: "Escalation communication", focus: "oxygen requirement, work of breathing, trend, and request", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "SBAR for abnormal ECG", categoryId: "documentation_communication", domain: "Escalation communication", focus: "rhythm, symptoms, vitals, and monitoring request", roles: ["rn"], systems: ["clinical-skills", "ecg-telemetry"] },
  { title: "Delegating hygiene care safely", categoryId: "documentation_communication", domain: "Delegation", focus: "stable patient tasks, instructions, and follow-up evaluation", roles: ["rn"], systems: ["clinical-skills", "prioritization-delegation"] },
  { title: "Delegating vital signs safely", categoryId: "documentation_communication", domain: "Delegation", focus: "when UAP measurement is safe and what must be reported", roles: ["rn"], systems: ["clinical-skills", "prioritization-delegation"] },
  { title: "Admission assessment organization", categoryId: "assessment", domain: "Workflow management", focus: "initial safety, allergies, meds, baseline, and priority risks", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Discharge readiness verification", categoryId: "documentation_communication", domain: "Transitions of care", focus: "meds, follow-up, supplies, transport, and teach-back", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Patient teaching with teach-back", categoryId: "documentation_communication", domain: "Patient education", focus: "plain language, return demonstration, and learning barriers", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Incentive spirometry coaching", categoryId: "documentation_communication", domain: "Postoperative respiratory care", focus: "technique, frequency, splinting, and rationale", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Heat and cold therapy safety", categoryId: "assessment", domain: "Comfort and skin safety", focus: "skin checks, sensation, timing, and contraindications", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Traction skin and neurovascular checks", categoryId: "assessment", domain: "Orthopedic monitoring", focus: "alignment, weights, pulses, sensation, and pain", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Cast care and compartment syndrome screen", categoryId: "assessment", domain: "Orthopedic monitoring", focus: "pain, paresthesia, pulses, pallor, paralysis, and pressure", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Maternal fundal assessment", categoryId: "assessment", domain: "Maternal safety", focus: "fundus tone, position, bleeding, and bladder effect", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Postpartum hemorrhage first response", categoryId: "emergency_escalation", domain: "Maternal emergency", focus: "massage, vitals, bleeding, IV access, and rapid escalation", roles: ["rn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Newborn safety and thermoregulation", categoryId: "assessment", domain: "Pediatrics and newborn", focus: "ID bands, temperature, glucose risk, and safe sleep", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Pediatric respiratory distress check", categoryId: "assessment", domain: "Pediatrics", focus: "retractions, nasal flaring, grunting, color, and fatigue", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Pediatric medication double-check", categoryId: "medication_delivery", domain: "Medication safety", focus: "weight-based dose, concentration, and independent verification", roles: ["rn"], systems: ["clinical-skills", "med-calculations"] },
  { title: "Isolation room discharge cleaning handoff", categoryId: "documentation_communication", domain: "Infection prevention", focus: "equipment handling, linen, waste, and environmental services handoff", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
];

const SIMULATION_READY_SKILL_SEEDS: readonly SkillSeed[] = [
  { title: "Rapid-response activation workflow", categoryId: "emergency_escalation", domain: "Deterioration response", focus: "recognition, call criteria, role clarity, and first assessment", roles: ["rn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Code blue nursing role setup", categoryId: "emergency_escalation", domain: "Resuscitation", focus: "compressions, recorder role, medication support, and safety", roles: ["rn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "ACLS medication support workflow", categoryId: "medication_delivery", domain: "Resuscitation", focus: "closed-loop medication preparation and documentation", roles: ["rn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Defibrillator pad placement support", categoryId: "emergency_escalation", domain: "Resuscitation", focus: "pad placement, clear communication, and rhythm-team support", roles: ["rn"], systems: ["clinical-skills", "ecg-telemetry"] },
  { title: "Airway obstruction first response", categoryId: "emergency_escalation", domain: "Airway emergency", focus: "recognition, positioning, suction, and emergency help activation", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Anaphylaxis response workflow", categoryId: "emergency_escalation", domain: "Medication emergency", focus: "airway, epinephrine support, vitals, and escalation", roles: ["rn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Opioid overdose naloxone response", categoryId: "emergency_escalation", domain: "Medication emergency", focus: "respiratory assessment, naloxone, monitoring, and recurrence risk", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Severe hypoglycemia rescue", categoryId: "emergency_escalation", domain: "Diabetes emergency", focus: "glucose check, oral versus IV rescue, and reassessment", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills", "labs", "pharmacology"] },
  { title: "Hyperkalemia ECG escalation", categoryId: "emergency_escalation", domain: "Electrolyte emergency", focus: "lab trend, ECG risk, cardiac monitoring, and provider notification", roles: ["rn", "np"], systems: ["clinical-skills", "labs", "ecg-telemetry"] },
  { title: "Symptomatic bradycardia escalation", categoryId: "emergency_escalation", domain: "Cardiac emergency", focus: "symptoms, perfusion, monitoring, and rapid notification", roles: ["rn", "np"], systems: ["clinical-skills", "ecg-telemetry"] },
  { title: "Unstable tachycardia escalation", categoryId: "emergency_escalation", domain: "Cardiac emergency", focus: "chest pain, hypotension, altered LOC, and emergency workflow", roles: ["rn", "np"], systems: ["clinical-skills", "ecg-telemetry"] },
  { title: "Chest tube drainage system assessment", categoryId: "devices_procedures", domain: "Thoracic procedures", focus: "water seal, tidaling, air leak, output, and respiratory status", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Chest tube dislodgement response", categoryId: "emergency_escalation", domain: "Thoracic emergency", focus: "occlusive dressing, respiratory assessment, and rapid escalation", roles: ["rn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Wound vac seal failure response", categoryId: "devices_procedures", domain: "Advanced wound care", focus: "seal integrity, therapy interruption, and provider notification", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Central-line suspected air embolism response", categoryId: "emergency_escalation", domain: "Central access emergency", focus: "clamp, position, oxygen, and rapid escalation", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "PICC line occlusion escalation", categoryId: "devices_procedures", domain: "Central access", focus: "do-not-force principles, assessment, and vascular access consult", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "TPN safety verification", categoryId: "medication_delivery", domain: "High-alert nutrition", focus: "central access, glucose monitoring, filter, and infection risk", roles: ["rn"], systems: ["clinical-skills", "labs", "pharmacology"] },
  { title: "Heparin infusion safety check", categoryId: "medication_delivery", domain: "High-alert medication", focus: "pump, weight, labs, bleeding, and dual verification", roles: ["rn"], systems: ["clinical-skills", "labs", "med-calculations"] },
  { title: "Potassium infusion safety check", categoryId: "medication_delivery", domain: "High-alert medication", focus: "concentration, pump, renal function, and cardiac monitoring", roles: ["rn"], systems: ["clinical-skills", "labs", "ecg-telemetry"] },
  { title: "Insulin infusion safety check", categoryId: "medication_delivery", domain: "High-alert medication", focus: "protocol, glucose trend, potassium, and hypoglycemia rescue", roles: ["rn"], systems: ["clinical-skills", "labs", "pharmacology"] },
  { title: "Pediatric dehydration escalation", categoryId: "emergency_escalation", domain: "Pediatrics emergency", focus: "intake, output, mucous membranes, mental status, and perfusion", roles: ["rn", "np"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Pediatric fever sepsis screen", categoryId: "emergency_escalation", domain: "Pediatrics emergency", focus: "age risk, perfusion, behavior, and escalation", roles: ["rn", "np"], systems: ["clinical-skills", "labs"] },
  { title: "OB severe hypertension escalation", categoryId: "emergency_escalation", domain: "Maternal emergency", focus: "BP confirmation, symptoms, seizure precautions, and magnesium safety", roles: ["rn", "np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Magnesium sulfate toxicity assessment", categoryId: "assessment", domain: "Maternal medication safety", focus: "reflexes, respirations, urine output, and calcium gluconate readiness", roles: ["rn", "np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Shoulder dystocia nursing support", categoryId: "emergency_escalation", domain: "Obstetric emergency", focus: "call for help, positioning support, and documentation timing", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Neonatal respiratory distress escalation", categoryId: "emergency_escalation", domain: "Newborn emergency", focus: "grunting, retractions, color, temperature, and glucose risk", roles: ["rn", "np"], systems: ["clinical-skills"] },
  { title: "Stroke alert bedside workflow", categoryId: "emergency_escalation", domain: "Neurologic emergency", focus: "last-known-well, glucose, neuro findings, and transport coordination", roles: ["rn", "np"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Seizure safety response", categoryId: "emergency_escalation", domain: "Neurologic emergency", focus: "protect from injury, airway positioning, timing, and postictal assessment", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Increased ICP nursing precautions", categoryId: "assessment", domain: "Neurologic monitoring", focus: "LOC change, positioning, stimulation, and escalation", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Spinal precautions transfer coordination", categoryId: "devices_procedures", domain: "Trauma care", focus: "alignment, team communication, and neuro checks", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Trauma primary survey nursing support", categoryId: "emergency_escalation", domain: "Trauma care", focus: "airway, breathing, circulation, disability, exposure support", roles: ["rn", "np"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "GI bleed escalation workflow", categoryId: "emergency_escalation", domain: "Hemorrhage recognition", focus: "vitals, stool/emesis, IV access, labs, and provider notification", roles: ["rn", "np"], systems: ["clinical-skills", "labs"] },
  { title: "Compartment syndrome escalation", categoryId: "emergency_escalation", domain: "Orthopedic emergency", focus: "pain out of proportion, neurovascular changes, and rapid escalation", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Severe asthma deterioration response", categoryId: "emergency_escalation", domain: "Respiratory emergency", focus: "silent chest, fatigue, oxygenation, and rapid response criteria", roles: ["rn", "np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "COPD CO2 retention safety assessment", categoryId: "assessment", domain: "Respiratory monitoring", focus: "mental status, respiratory effort, oxygen order, and escalation", roles: ["rn"], systems: ["clinical-skills", "labs"] },
  { title: "BiPAP tolerance and escalation screen", categoryId: "assessment", domain: "Respiratory support", focus: "mask fit, aspiration risk, mental status, and respiratory therapy notification", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Suctioning hypoxia response", categoryId: "emergency_escalation", domain: "Airway support", focus: "stop suction, oxygenate, reassess, and escalate persistent distress", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Tracheostomy decannulation response", categoryId: "emergency_escalation", domain: "Airway emergency", focus: "call help, oxygenate, stoma care, and emergency equipment", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "DKA initial nursing priorities", categoryId: "emergency_escalation", domain: "Endocrine emergency", focus: "fluids, glucose, potassium, mental status, and protocol monitoring", roles: ["rn", "np"], systems: ["clinical-skills", "labs", "pharmacology"] },
  { title: "HHS dehydration and neuro monitoring", categoryId: "assessment", domain: "Endocrine emergency", focus: "mental status, fluid balance, glucose trend, and fall risk", roles: ["rn", "np"], systems: ["clinical-skills", "labs"] },
  { title: "Acute kidney injury safety monitoring", categoryId: "assessment", domain: "Renal emergency", focus: "urine output, nephrotoxins, potassium, and fluid overload", roles: ["rn", "np"], systems: ["clinical-skills", "labs"] },
  { title: "Dialysis access assessment", categoryId: "devices_procedures", domain: "Renal access", focus: "bruit, thrill, infection cues, and no-BP/no-stick precautions", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Peritoneal dialysis exchange safety", categoryId: "devices_procedures", domain: "Renal therapy", focus: "sterile connection, outflow, cloudy drainage, and abdominal pain", roles: ["rn"], systems: ["clinical-skills"] },
  { title: "Neutropenic fever escalation", categoryId: "emergency_escalation", domain: "Oncology emergency", focus: "temperature, ANC awareness, cultures, antibiotics timing, and isolation", roles: ["rn", "np"], systems: ["clinical-skills", "labs"] },
  { title: "Tumor lysis safety monitoring", categoryId: "assessment", domain: "Oncology emergency", focus: "potassium, phosphate, calcium, renal function, and ECG risk", roles: ["rn", "np"], systems: ["clinical-skills", "labs", "ecg-telemetry"] },
  { title: "Chemotherapy extravasation response", categoryId: "emergency_escalation", domain: "Oncology medication safety", focus: "stop infusion, leave access, notify, and follow agent protocol", roles: ["rn"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Behavioral emergency safety huddle", categoryId: "emergency_escalation", domain: "Mental health emergency", focus: "staff safety, observation, de-escalation, and least-restrictive care", roles: ["rn"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "Alcohol withdrawal escalation screen", categoryId: "assessment", domain: "Mental health and medical safety", focus: "tremor, agitation, seizures, vitals, and medication protocol", roles: ["rn", "np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "End-of-life dyspnea comfort workflow", categoryId: "assessment", domain: "Palliative care", focus: "positioning, medication effect, family communication, and goals of care", roles: ["rn", "rpn_lpn", "np"], systems: ["clinical-skills"] },
  { title: "Family crisis communication after deterioration", categoryId: "documentation_communication", domain: "Communication", focus: "calm updates, privacy, role clarity, and team coordination", roles: ["rn", "np"], systems: ["clinical-skills"] },
  { title: "Incident report after medication error", categoryId: "documentation_communication", domain: "Safety reporting", focus: "patient assessment, provider notification, disclosure policy, and objective report", roles: ["rn", "rpn_lpn"], systems: ["clinical-skills"] },
  { title: "Chain-of-command escalation", categoryId: "documentation_communication", domain: "Professional accountability", focus: "unresolved safety concern and progressive escalation", roles: ["rn", "rpn_lpn", "np"], systems: ["clinical-skills"] },
];

const NP_ADVANCED_SKILL_SEEDS: readonly SkillSeed[] = [
  { title: "Focused differential diagnosis interview", categoryId: "assessment", domain: "NP diagnostic reasoning", focus: "chief concern, red flags, risk factors, and competing diagnoses", roles: ["np"], systems: ["clinical-skills", "clinical-scenarios"] },
  { title: "SOAP note assessment synthesis", categoryId: "documentation_communication", domain: "NP documentation", focus: "subjective, objective, assessment, and plan integration", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Guideline-based treatment plan review", categoryId: "documentation_communication", domain: "NP treatment planning", focus: "evidence-based plan, contraindications, and follow-up safety", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Diagnostic test selection rationale", categoryId: "assessment", domain: "NP diagnostics", focus: "why a test changes management and when not to order", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "Imaging result escalation workflow", categoryId: "documentation_communication", domain: "NP diagnostics", focus: "critical imaging result communication and follow-up", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Antibiotic stewardship counseling", categoryId: "medication_delivery", domain: "NP pharmacotherapy", focus: "indication, spectrum, allergy, duration, and resistance risk", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Controlled-substance risk assessment", categoryId: "assessment", domain: "NP prescribing safety", focus: "risk screen, PDMP awareness, agreements, and monitoring", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Shared decision-making visit", categoryId: "documentation_communication", domain: "NP communication", focus: "options, risks, patient goals, and documented consent", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Chronic disease follow-up structure", categoryId: "assessment", domain: "NP longitudinal care", focus: "trend review, adherence, complications, and plan adjustment", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "Medication deprescribing review", categoryId: "medication_delivery", domain: "NP pharmacotherapy", focus: "polypharmacy, risk-benefit, tapering, and monitoring", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Abnormal A1c management visit", categoryId: "assessment", domain: "NP endocrine care", focus: "glycemic trend, medication options, lifestyle, and follow-up", roles: ["np"], systems: ["clinical-skills", "labs", "pharmacology"] },
  { title: "Hypertension medication titration visit", categoryId: "assessment", domain: "NP cardiovascular care", focus: "home BP, adherence, adverse effects, and guideline targets", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Asthma control step-therapy review", categoryId: "assessment", domain: "NP respiratory care", focus: "symptom control, inhaler technique, triggers, and escalation", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "COPD exacerbation outpatient screen", categoryId: "assessment", domain: "NP respiratory care", focus: "severity, oxygenation, antibiotics/steroids, and ED criteria", roles: ["np"], systems: ["clinical-skills"] },
  { title: "UTI uncomplicated treatment reasoning", categoryId: "assessment", domain: "NP primary care", focus: "symptoms, pregnancy risk, culture indications, and antibiotic choice", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "Pyelonephritis escalation decision", categoryId: "emergency_escalation", domain: "NP urgent care", focus: "fever, flank pain, vomiting, sepsis risk, and disposition", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Chest pain outpatient triage", categoryId: "emergency_escalation", domain: "NP urgent care", focus: "red flags, ECG, EMS/ED criteria, and documentation", roles: ["np"], systems: ["clinical-skills", "ecg-telemetry"] },
  { title: "Headache red-flag assessment", categoryId: "assessment", domain: "NP neurologic care", focus: "sudden onset, neuro deficits, fever, pregnancy, and imaging need", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Abdominal pain red-flag assessment", categoryId: "assessment", domain: "NP urgent care", focus: "peritonitis, pregnancy risk, fever, instability, and referral", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Low back pain neurologic screen", categoryId: "assessment", domain: "NP musculoskeletal care", focus: "cauda equina cues, weakness, infection/cancer risk, and imaging", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Depression visit safety planning", categoryId: "assessment", domain: "NP mental health", focus: "suicide risk, treatment options, follow-up, and emergency plan", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Anxiety medication counseling", categoryId: "medication_delivery", domain: "NP mental health", focus: "SSRI onset, side effects, benzodiazepine risk, and follow-up", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Bipolar screening before antidepressant", categoryId: "assessment", domain: "NP mental health", focus: "mania screen and safe prescribing", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Child fever triage visit", categoryId: "assessment", domain: "NP pediatrics", focus: "age, appearance, hydration, respiratory effort, and escalation", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Pediatric otitis media decision", categoryId: "assessment", domain: "NP pediatrics", focus: "diagnostic criteria, observation, antibiotics, and parent teaching", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Well-child developmental screen", categoryId: "assessment", domain: "NP pediatrics", focus: "milestones, growth, immunizations, and referral cues", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Prenatal danger-sign counseling", categoryId: "documentation_communication", domain: "NP women's health", focus: "bleeding, severe headache, swelling, fetal movement, and escalation", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Contraception contraindication screen", categoryId: "assessment", domain: "NP women's health", focus: "migraine, clot risk, smoking, BP, and patient preference", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "STI testing and treatment counseling", categoryId: "documentation_communication", domain: "NP sexual health", focus: "testing, partner treatment, privacy, and follow-up", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "Menopause symptom management visit", categoryId: "assessment", domain: "NP women's health", focus: "risk screen, treatment options, and shared decision-making", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Geriatric falls risk visit", categoryId: "assessment", domain: "NP geriatrics", focus: "medications, gait, vision, orthostatics, and home safety", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Dementia caregiver safety planning", categoryId: "documentation_communication", domain: "NP geriatrics", focus: "safety, support, behavior triggers, and escalation resources", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Advance care planning conversation", categoryId: "documentation_communication", domain: "NP palliative care", focus: "values, goals, surrogate, and documentation", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Opioid use disorder visit", categoryId: "assessment", domain: "NP addiction care", focus: "withdrawal, safety, medication options, and follow-up", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Alcohol withdrawal outpatient risk screen", categoryId: "assessment", domain: "NP addiction care", focus: "seizure risk, vitals, support, and ED criteria", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Skin lesion assessment and referral", categoryId: "assessment", domain: "NP dermatology", focus: "ABCDE cues, history, biopsy/referral need, and documentation", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Cellulitis outpatient management", categoryId: "assessment", domain: "NP urgent care", focus: "severity, borders, systemic symptoms, antibiotics, and follow-up", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Wound culture decision-making", categoryId: "assessment", domain: "NP wound care", focus: "when culture changes management and when colonization misleads", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "Renal dosing medication review", categoryId: "medication_delivery", domain: "NP pharmacotherapy", focus: "eGFR, drug risk, dose adjustment, and monitoring", roles: ["np"], systems: ["clinical-skills", "labs", "pharmacology"] },
  { title: "Liver disease medication safety review", categoryId: "medication_delivery", domain: "NP pharmacotherapy", focus: "hepatotoxicity, bleeding risk, dose cautions, and monitoring", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "Thyroid lab interpretation visit", categoryId: "assessment", domain: "NP endocrine care", focus: "TSH/free T4 pattern, symptoms, medication timing, and follow-up", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "Anemia workup prioritization", categoryId: "assessment", domain: "NP hematology", focus: "CBC pattern, bleeding risk, iron/B12 cues, and referral triggers", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "CKD progression counseling", categoryId: "documentation_communication", domain: "NP renal care", focus: "BP, diabetes, nephrotoxin avoidance, labs, and referral timing", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "Heart failure outpatient decompensation screen", categoryId: "assessment", domain: "NP cardiovascular care", focus: "weight, dyspnea, edema, meds, and ED criteria", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Atrial fibrillation anticoagulation discussion", categoryId: "documentation_communication", domain: "NP cardiovascular care", focus: "stroke risk, bleeding risk, options, and patient preference", roles: ["np"], systems: ["clinical-skills", "pharmacology"] },
  { title: "Immunization catch-up planning", categoryId: "documentation_communication", domain: "NP prevention", focus: "age, risk, contraindications, and schedule planning", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Cancer screening shared decision visit", categoryId: "documentation_communication", domain: "NP prevention", focus: "age, risk, benefits, harms, and follow-up", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Occupational exposure evaluation", categoryId: "emergency_escalation", domain: "NP occupational health", focus: "exposure details, prophylaxis window, labs, and reporting", roles: ["np"], systems: ["clinical-skills", "labs"] },
  { title: "Return-to-work restriction note", categoryId: "documentation_communication", domain: "NP occupational health", focus: "functional limits, safety, and documentation clarity", roles: ["np"], systems: ["clinical-skills"] },
  { title: "Interprofessional case conference leadership", categoryId: "documentation_communication", domain: "NP care coordination", focus: "team goals, risks, accountability, and follow-up plan", roles: ["np"], systems: ["clinical-skills", "clinical-scenarios"] },
];

function slugifySkillTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generatedSkillFromSeed(seed: SkillSeed, competencyTier: ClinicalSkillCompetencyTier, index: number): ClinicalSkillDefinition {
  const prefix = competencyTier === "foundation" ? "foundations" : competencyTier === "proficiency" ? "proficiency" : "simulation";
  const roleLabel =
    seed.roles.length === 1 && seed.roles[0] === "np"
      ? "advanced practice"
      : seed.roles.includes("rn") && seed.roles.includes("rpn_lpn")
        ? "entry-to-practice nursing"
        : seed.roles.includes("rn")
          ? "RN"
          : "practical nursing";

  return {
    slug: `${prefix}-${slugifySkillTitle(seed.title)}`,
    categoryId: seed.categoryId,
    title: seed.title,
    summary: `Simulation-oriented ${roleLabel} competency focused on ${seed.focus}.`,
    competencyTier,
    roleTracks: seed.roles,
    competencyDomain: seed.domain,
    simulationFocus: seed.focus,
    relatedSystems: seed.systems ?? ["clinical-skills"],
    estimatedMinutes:
      competencyTier === "foundation" ? 16 + (index % 5) : competencyTier === "proficiency" ? 20 + (index % 7) : 26 + (index % 9),
    steps: steps(
      ["Prepare and verify context", `Confirm patient identity, orders or policy requirements, baseline status, and the specific risk tied to ${seed.focus}.`],
      ["Perform focused assessment", `Collect the bedside cues needed to decide whether the skill is safe to continue, pause, delegate, or escalate.`],
      ["Carry out the skill deliberately", `Use standard precautions, role-appropriate scope, and closed-loop communication while completing the core action.`],
      ["Recognize unsafe variation", `Stop or escalate if findings suggest deterioration, contamination, medication risk, device failure, or patient intolerance.`],
      ["Document and reinforce retention", `Chart the key finding, action, response, teaching, and follow-up plan; queue flashcards for the highest-risk decision points.`],
    ),
  };
}

function buildExpandedClinicalSkills(): ClinicalSkillDefinition[] {
  const generated = [
    ...FOUNDATION_SKILL_SEEDS.map((seed, index) => generatedSkillFromSeed(seed, "foundation", index)),
    ...PROFICIENCY_SKILL_SEEDS.map((seed, index) => generatedSkillFromSeed(seed, "proficiency", index)),
    ...SIMULATION_READY_SKILL_SEEDS.map((seed, index) => generatedSkillFromSeed(seed, "simulation_ready", index)),
    ...NP_ADVANCED_SKILL_SEEDS.map((seed, index) => generatedSkillFromSeed(seed, "simulation_ready", index + SIMULATION_READY_SKILL_SEEDS.length)),
  ];
  const existing = new Set(CORE_SKILLS.map((skill) => skill.slug));
  return generated.filter((skill) => !existing.has(skill.slug));
}

function defaultRoleTracksForTier(tier: ClinicalSkillCompetencyTier): readonly ClinicalSkillRoleTrack[] {
  return tier === "simulation_ready" ? ["rn"] : ["rn", "rpn_lpn"];
}

function categoryTitle(categoryId: string): string {
  return CATEGORIES.find((category) => category.id === categoryId)?.title ?? "Clinical competency";
}

function withClinicalSkillDefaults(skill: ClinicalSkillDefinition): ClinicalSkillDefinition {
  return {
    ...skill,
    roleTracks: skill.roleTracks ?? defaultRoleTracksForTier(skill.competencyTier),
    competencyDomain: skill.competencyDomain ?? categoryTitle(skill.categoryId),
    simulationFocus: skill.simulationFocus ?? skill.summary,
    relatedSystems: skill.relatedSystems ?? ["clinical-skills", "flashcards", "readiness-analytics"],
  };
}

const SKILLS: ClinicalSkillDefinition[] = [...CORE_SKILLS, ...buildExpandedClinicalSkills()].map(withClinicalSkillDefaults);

const slugIndex = new Map(SKILLS.map((s) => [s.slug, s]));

export function listClinicalSkillCategories(): readonly ClinicalSkillCategory[] {
  return CATEGORIES;
}

export function listClinicalSkills(): readonly ClinicalSkillDefinition[] {
  return SKILLS;
}

export function getClinicalSkillBySlug(slug: string): ClinicalSkillDefinition | null {
  return slugIndex.get(slug.trim()) ?? null;
}

export function clinicalSkillsForCategory(categoryId: string): ClinicalSkillDefinition[] {
  return SKILLS.filter((s) => s.categoryId === categoryId);
}

export function clinicalSkillsForRoleTrack(roleTrack: ClinicalSkillRoleTrack): ClinicalSkillDefinition[] {
  return SKILLS.filter((skill) => skill.roleTracks?.includes(roleTrack));
}

export function clinicalSkillsForCompetencyTier(tier: ClinicalSkillCompetencyTier): ClinicalSkillDefinition[] {
  return SKILLS.filter((skill) => skill.competencyTier === tier);
}
