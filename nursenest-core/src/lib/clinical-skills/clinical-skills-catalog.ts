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
    title: "Infection control & sterile technique",
    summary: "Protect patients with deliberate sterile fields, dressings, and aseptic discipline.",
  },
  {
    id: "medication_delivery",
    title: "Medication delivery",
    summary: "Safe injection fundamentals aligned with nursing competency checkpoints.",
  },
  {
    id: "devices_procedures",
    title: "Devices & procedures",
    summary: "High-acuity skills that combine psychomotor precision with ongoing monitoring.",
  },
  {
    id: "assessment",
    title: "Assessment & monitoring",
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
