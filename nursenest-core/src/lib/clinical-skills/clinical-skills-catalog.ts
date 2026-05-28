export type ClinicalSkillCompetencyTier = "foundation" | "proficiency" | "simulation_ready";

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
];

function steps(...pairs: [string, string][]): ClinicalSkillStep[] {
  return pairs.map(([title, detail]) => ({ title, detail }));
}

/** Bounded catalog — lightweight payloads only (no large JSON on hot paths). */
const SKILLS: ClinicalSkillDefinition[] = [
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
