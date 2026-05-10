import type { RtLongtailTopic } from "./types";

const STEMS: Array<{ stem: string; cluster: RtLongtailTopic["cluster"]; focus: string; titleBase: string }> = [
  { stem: "abg-acid-base-pairs-practical", cluster: "abg", focus: "acid-base pairs and practical ABG interpretation", titleBase: "ABG acid-base pairs for RT students" },
  { stem: "abg-anion-gap-clinical-context", cluster: "abg", focus: "anion gap context alongside respiratory disorders", titleBase: "Anion gap and ABG interpretation in RT practice" },
  { stem: "mixed-acid-base-disturbances-overview", cluster: "abg", focus: "mixed acid-base disturbances and layered compensation", titleBase: "Mixed acid-base disturbances: an RT overview" },
  { stem: "copd-type-ii-respiratory-failure-oxygen", cluster: "oxygen", focus: "COPD-related hypoventilation and oxygen titration concepts", titleBase: "COPD type II respiratory failure and oxygen concepts" },
  { stem: "asthma-monitoring-peak-flow-concepts", cluster: "cardiopulmonary", focus: "asthma monitoring and peak expiratory flow teaching", titleBase: "Asthma monitoring and peak flow concepts for RT" },
  { stem: "pneumonia-oxygenation-ventilation-readiness", cluster: "vent", focus: "pneumonia oxygenation support and escalation awareness", titleBase: "Pneumonia oxygenation and ventilation readiness concepts" },
  { stem: "ards-peep-titration-education", cluster: "vent", focus: "ARDS physiology and PEEP titration as an educational framework", titleBase: "ARDS PEEP titration concepts for RT learners" },
  { stem: "driving-pressure-educational-overview", cluster: "vent", focus: "driving pressure as a teaching concept without protocol dosing", titleBase: "Driving pressure concepts for respiratory therapy exams" },
  { stem: "plateau-pressure-meaning-measurement", cluster: "vent", focus: "plateau pressure measurement and safety implications", titleBase: "Plateau pressure meaning and measurement for RT students" },
  { stem: "flow-trigger-vs-pressure-trigger-vent", cluster: "vent", focus: "trigger types and patient-ventilator interaction", titleBase: "Flow trigger versus pressure trigger on the ventilator" },
  { stem: "niv-leak-compensation-mask-fit", cluster: "vent", focus: "noninvasive ventilation leaks and mask fit troubleshooting", titleBase: "NIV leak compensation and mask fit fundamentals" },
  { stem: "active-humidification-hme-tradeoffs", cluster: "vent", focus: "humidification strategies and contraindication awareness", titleBase: "Active humidification and HME tradeoffs for RT" },
  { stem: "ett-cuff-pressure-manometry-basics", cluster: "airway", focus: "endotracheal tube cuff pressure assessment fundamentals", titleBase: "ETT cuff pressure and manometry basics" },
  { stem: "closed-suction-open-suction-infection", cluster: "infection", focus: "suction systems and infection prevention priorities", titleBase: "Closed suction versus open suction infection concepts" },
  { stem: "bronchoscopy-ventilation-assist-overview", cluster: "airway", focus: "bronchoscopy support and ventilation coordination concepts", titleBase: "Bronchoscopy ventilation assist overview for RT" },
  { stem: "hfnc-monitoring-and-oxygenation-goals", cluster: "oxygen", focus: "high-flow nasal cannula monitoring and goals of therapy", titleBase: "HFNC monitoring and oxygenation goals for RT exams" },
  { stem: "inhaled-no-principles-safety-education", cluster: "pharmacology", focus: "inhaled nitric oxide principles and safety education", titleBase: "Inhaled nitric oxide principles for RT students" },
  { stem: "chest-tube-air-leak-basics-rt", cluster: "cardiopulmonary", focus: "chest tube air leak language and RT communication", titleBase: "Chest tube air leak basics for respiratory therapists" },
  { stem: "postural-drainage-contraindications-review", cluster: "education", focus: "postural drainage contraindications and patient selection", titleBase: "Postural drainage contraindications review" },
  { stem: "flutter-acapella-pep-device-comparison", cluster: "education", focus: "oscillatory PEP devices and patient teaching", titleBase: "Flutter valve, Acapella, and PEP device comparison" },
  { stem: "mdi-spacer-technique-teaching-points", cluster: "pharmacology", focus: "metered-dose inhaler and spacer teaching", titleBase: "MDI and spacer technique teaching points" },
  { stem: "svn-timing-continuous-ventilation", cluster: "pharmacology", focus: "small volume nebulizer timing with mechanical ventilation", titleBase: "SVN timing with continuous mechanical ventilation" },
  { stem: "aerosol-particle-size-deposition-basics", cluster: "pharmacology", focus: "aerosol deposition and particle size basics", titleBase: "Aerosol particle size and deposition basics" },
  { stem: "ventilator-scalar-graphs-loops", cluster: "vent", focus: "scalar graphs and pressure-volume loops for learners", titleBase: "Ventilator scalar graphs and loops for RT students" },
  { stem: "auto-peep-dynamic-hyperinflation", cluster: "vent", focus: "auto-PEEP and dynamic hyperinflation recognition", titleBase: "Auto-PEEP and dynamic hyperinflation concepts" },
  { stem: "inverse-ratio-ventilation-educational", cluster: "vent", focus: "inverse ratio ventilation as a teaching topic", titleBase: "Inverse ratio ventilation educational overview" },
  { stem: "aprv-high-level-concepts-only", cluster: "vent", focus: "airway pressure release ventilation at a conceptual level", titleBase: "APRV high-level concepts for RT exam prep" },
  { stem: "liberation-readiness-indices-overview", cluster: "vent", focus: "weaning readiness indices without prescribing thresholds", titleBase: "Liberation readiness indices overview for RT" },
  { stem: "cuff-leak-stridor-post-extubation-concept", cluster: "airway", focus: "cuff leak testing and post-extubation stridor concepts", titleBase: "Cuff leak and post-extubation stridor concepts" },
  { stem: "bronchoprovocation-testing-concepts", cluster: "pft", focus: "bronchoprovocation testing indications and safety", titleBase: "Bronchoprovocation testing concepts for RT" },
  { stem: "dlco-diffusion-basics-pft", cluster: "pft", focus: "DLCO interpretation basics for learners", titleBase: "DLCO diffusion capacity basics on PFT" },
  { stem: "six-minute-walk-test-role-rt", cluster: "pft", focus: "six-minute walk test and functional assessment", titleBase: "Six-minute walk test role for respiratory therapy" },
  { stem: "arterial-line-sampling-correlation-abg", cluster: "abg", focus: "arterial line sampling correlation with ABG quality", titleBase: "Arterial line sampling correlation with ABG quality" },
  { stem: "neonatal-oxygen-saturation-target-concepts", cluster: "neonatal", focus: "neonatal oxygen saturation targets as concepts", titleBase: "Neonatal oxygen saturation target concepts" },
  { stem: "rds-surfactant-replacement-principles", cluster: "neonatal", focus: "RDS and surfactant replacement principles", titleBase: "RDS and surfactant replacement principles for RT" },
];

const ANGLES = [
  { suffix: "rt-exam-prep", angleLabel: "exam preparation framing" },
  { suffix: "bedside-assessment", angleLabel: "bedside assessment emphasis" },
  { suffix: "equipment-monitoring", angleLabel: "equipment and monitoring emphasis" },
  { suffix: "documentation-quality", angleLabel: "documentation and communication quality" },
  { suffix: "infection-prevention", angleLabel: "infection prevention emphasis" },
  { suffix: "safety-alarms-escalation", angleLabel: "safety, alarms, and escalation" },
  { suffix: "interprofessional-teamwork", angleLabel: "interprofessional teamwork" },
  { suffix: "transport-and-mobility", angleLabel: "transport and mobility considerations" },
] as const;

function titleCaseAngle(s: string): string {
  return s
    .split("-")
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildGridTopics(): RtLongtailTopic[] {
  const out: RtLongtailTopic[] = [];
  for (const row of STEMS) {
    for (const ang of ANGLES) {
      const slug = `rt-${row.stem}-${ang.suffix}`;
      const title = `${row.titleBase}: ${titleCaseAngle(ang.suffix)}`;
      const excerpt = `Respiratory therapy education on ${row.focus}, framed for ${ang.angleLabel}, credential study, and safe clinical reasoning.`;
      out.push({
        slug,
        title,
        excerpt,
        category: "Respiratory Therapy",
        tags: ["Respiratory Therapy", "RT Student", "NBRC", "Exam Prep", "Clinical Education", "Patient Safety"],
        cluster: row.cluster,
        focusPhrase: row.focus,
      });
    }
  }
  return out;
}

/** Twenty flagship anchors (user-requested breadth); slugs chosen to avoid collision with grid `rt-${stem}-${angle}` pattern. */
const ANCHOR_TOPICS: RtLongtailTopic[] = [
  {
    slug: "rt-abg-interpretation-arterial-blood-gas-exam-mastery",
    title: "RT ABG Interpretation: Arterial Blood Gas Exam Mastery",
    excerpt: "A structured ABG approach for respiratory therapy students: oxygenation, ventilation, acid-base status, compensation limits, and common exam traps.",
    category: "Respiratory Therapy",
    tags: ["ABG", "Arterial Blood Gas", "RT Student", "NBRC", "Acid-Base", "Exam Prep"],
    cluster: "abg",
    focusPhrase: "arterial blood gas interpretation for RT credential preparation",
  },
  {
    slug: "rt-mechanical-ventilation-modes-volume-pressure-hybrid-study-guide",
    title: "Mechanical Ventilation Modes: Volume, Pressure, and Hybrid RT Study Guide",
    excerpt: "Compare volume, pressure, and hybrid modes with patient-ventilator interaction language suitable for exams and clinical orientation.",
    category: "Respiratory Therapy",
    tags: ["Mechanical Ventilation", "Ventilator Modes", "RT Student", "ICU", "Exam Prep"],
    cluster: "vent",
    focusPhrase: "mechanical ventilation modes and breath delivery types",
  },
  {
    slug: "rt-copd-oxygen-therapy-co2-retention-concepts",
    title: "COPD Oxygen Therapy: CO2 Retention Concepts for RT Students",
    excerpt: "Educational overview of oxygen titration themes in chronic hypercapnic risk, assessment, monitoring, and protocol-bound practice.",
    category: "Respiratory Therapy",
    tags: ["COPD", "Oxygen Therapy", "CO2 Retention", "RT Student", "Exam Prep"],
    cluster: "oxygen",
    focusPhrase: "COPD oxygen therapy and hypoventilation risk education",
  },
  {
    slug: "rt-ards-ventilator-management-peep-recruitment-education",
    title: "ARDS Ventilator Management: PEEP and Recruitment Educational Framework",
    excerpt: "ARDS physiology, lung-protective language, PEEP concepts, and monitoring priorities for RT learners without prescribing patient-specific settings.",
    category: "Respiratory Therapy",
    tags: ["ARDS", "PEEP", "Mechanical Ventilation", "RT Student", "Critical Care"],
    cluster: "vent",
    focusPhrase: "ARDS ventilator management concepts and monitoring",
  },
  {
    slug: "rt-niv-bipap-cpap-indications-monitoring-contraindications",
    title: "NIV for RT Students: CPAP, BiPAP, Indications, Monitoring, and Contraindications",
    excerpt: "Noninvasive ventilation education covering interfaces, leak management, monitoring, escalation awareness, and patient selection language.",
    category: "Respiratory Therapy",
    tags: ["NIV", "BiPAP", "CPAP", "RT Student", "Exam Prep", "Patient Safety"],
    cluster: "vent",
    focusPhrase: "noninvasive ventilation indications and monitoring",
  },
  {
    slug: "rt-pulmonary-function-testing-spirometry-bronchodilator-response",
    title: "Pulmonary Function Testing: Spirometry and Bronchodilator Response for RT",
    excerpt: "Spirometry quality, interpretation language, bronchodilator response, and common testing pitfalls for credential study.",
    category: "Respiratory Therapy",
    tags: ["PFT", "Spirometry", "RT Student", "NBRC", "Diagnostics"],
    cluster: "pft",
    focusPhrase: "pulmonary function testing and spirometry quality",
  },
  {
    slug: "rt-acid-base-compensation-chronic-respiratory-disorders",
    title: "Acid-Base Compensation in Chronic Respiratory Disorders: RT Review",
    excerpt: "Chronic CO2 retention, renal compensation, and how RT assessments complement laboratory interpretation in education.",
    category: "Respiratory Therapy",
    tags: ["Acid-Base", "ABG", "RT Student", "Pathophysiology", "Exam Prep"],
    cluster: "abg",
    focusPhrase: "acid-base compensation in chronic respiratory disorders",
  },
  {
    slug: "rt-difficult-airway-preoxygenation-apneic-oxygenation-concepts",
    title: "Difficult Airway Concepts: Preoxygenation and Apneic Oxygenation for RT",
    excerpt: "Preoxygenation goals, denitrogenation language, apneic oxygenation concepts, and team roles in airway preparation education.",
    category: "Respiratory Therapy",
    tags: ["Airway", "Preoxygenation", "RT Student", "Critical Care", "Teamwork"],
    cluster: "airway",
    focusPhrase: "preoxygenation and difficult airway preparation concepts",
  },
  {
    slug: "rt-endotracheal-suctioning-sterile-technique-complications",
    title: "Endotracheal Suctioning: Sterile Technique, Monitoring, and Complication Awareness",
    excerpt: "Suction depth language, sterile technique themes, hypoxemia prevention concepts, and monitoring loops for RT students.",
    category: "Respiratory Therapy",
    tags: ["Suctioning", "Airway", "Infection Control", "RT Student", "Patient Safety"],
    cluster: "airway",
    focusPhrase: "endotracheal suctioning technique and monitoring",
  },
  {
    slug: "rt-chest-physiotherapy-percussion-vibration-pep-overview",
    title: "Chest Physiotherapy: Percussion, Vibration, and PEP Therapy Overview",
    excerpt: "Airway clearance techniques, patient selection, contraindications, and teaching strategies for bronchial hygiene education.",
    category: "Respiratory Therapy",
    tags: ["Chest Physiotherapy", "Airway Clearance", "RT Student", "Exam Prep"],
    cluster: "education",
    focusPhrase: "chest physiotherapy and airway clearance techniques",
  },
  {
    slug: "rt-oxygen-delivery-devices-from-nasal-cannula-to-high-flow",
    title: "Oxygen Delivery Devices: From Nasal Cannula to High-Flow for RT Exams",
    excerpt: "Device capabilities, humidity needs, patient comfort, monitoring, and escalation awareness across common oxygen interfaces.",
    category: "Respiratory Therapy",
    tags: ["Oxygen Therapy", "HFNC", "RT Student", "Equipment", "Exam Prep"],
    cluster: "oxygen",
    focusPhrase: "oxygen delivery devices and monitoring priorities",
  },
  {
    slug: "rt-ventilator-alarms-high-low-pressure-apnea-interpretation",
    title: "Ventilator Alarms: High Pressure, Low Pressure, and Apnea Interpretation",
    excerpt: "Alarm categories, common causes, assessment sequences, and safe escalation language aligned with team-based ICU care.",
    category: "Respiratory Therapy",
    tags: ["Ventilator Alarms", "Mechanical Ventilation", "RT Student", "ICU", "Patient Safety"],
    cluster: "vent",
    focusPhrase: "ventilator alarm interpretation and assessment",
  },
  {
    slug: "rt-weaning-spontaneous-breathing-trial-readiness",
    title: "Weaning Readiness and Spontaneous Breathing Trial Concepts for RT",
    excerpt: "Readiness assessment language, SBT framing, monitoring during trials, and criteria communication without replacing physician orders.",
    category: "Respiratory Therapy",
    tags: ["Weaning", "SBT", "Mechanical Ventilation", "RT Student", "Critical Care"],
    cluster: "vent",
    focusPhrase: "weaning readiness and spontaneous breathing trials",
  },
  {
    slug: "rt-asthma-pathophysiology-bronchodilator-therapy-education",
    title: "Asthma Pathophysiology and Bronchodilator Therapy Education for RT",
    excerpt: "Inflammation and bronchospasm language, medication delivery, response monitoring, and emergency escalation awareness for learners.",
    category: "Respiratory Therapy",
    tags: ["Asthma", "Bronchodilator", "Aerosol", "RT Student", "Exam Prep"],
    cluster: "pharmacology",
    focusPhrase: "asthma pathophysiology and aerosolized therapy education",
  },
  {
    slug: "rt-pneumonia-oxygenation-ventilatory-support-pathways",
    title: "Pneumonia: Oxygenation and Ventilatory Support Pathways for RT Students",
    excerpt: "Consolidation physiology, oxygen needs, secretion management themes, and VAP prevention language as interdisciplinary education.",
    category: "Respiratory Therapy",
    tags: ["Pneumonia", "Oxygen", "Ventilation", "RT Student", "Infection Control"],
    cluster: "vent",
    focusPhrase: "pneumonia oxygenation and ventilatory support education",
  },
  {
    slug: "rt-incentive-spirometry-postoperative-teaching-and-adherence",
    title: "Incentive Spirometry: Postoperative Teaching and Adherence Strategies",
    excerpt: "Evidence-informed teaching language, technique coaching, goal setting, and documentation pearls for perioperative RT roles.",
    category: "Respiratory Therapy",
    tags: ["Incentive Spirometry", "Postoperative", "RT Student", "Education"],
    cluster: "education",
    focusPhrase: "incentive spirometry teaching and adherence",
  },
  {
    slug: "rt-tracheostomy-care-inner-cannula-suctioning-speaking-valve",
    title: "Tracheostomy Care: Inner Cannula, Suctioning, and Speaking Valve Basics",
    excerpt: "Routine care concepts, humidification needs, cuff management language, and safety checks for RT-oriented education.",
    category: "Respiratory Therapy",
    tags: ["Tracheostomy", "Airway", "RT Student", "Patient Safety", "Exam Prep"],
    cluster: "airway",
    focusPhrase: "tracheostomy care and airway maintenance education",
  },
  {
    slug: "rt-peak-flow-monitoring-zones-and-action-plans",
    title: "Peak Flow Monitoring: Zones, Technique, and Action Plan Education",
    excerpt: "Personal best concepts, technique errors, zone systems when prescribed, and patient communication for asthma self-management support.",
    category: "Respiratory Therapy",
    tags: ["Peak Flow", "Asthma", "RT Student", "Patient Education"],
    cluster: "cardiopulmonary",
    focusPhrase: "peak flow monitoring and patient education",
  },
  {
    slug: "rt-neonatal-respiratory-distress-cpap-and-surfactant-concepts",
    title: "Neonatal Respiratory Distress: CPAP and Surfactant Concepts for RT",
    excerpt: "RDS pathophysiology language, noninvasive support themes, surfactant replacement principles, and NICU safety culture for learners.",
    category: "Respiratory Therapy",
    tags: ["Neonatal", "RDS", "CPAP", "RT Student", "NICU"],
    cluster: "neonatal",
    focusPhrase: "neonatal respiratory distress and support concepts",
  },
  {
    slug: "rt-infection-control-aerosol-therapy-and-airborne-precautions",
    title: "Infection Control for RT: Aerosol Therapy, PPE, and Airborne Precautions",
    excerpt: "PPE selection language, aerosol generation awareness, environmental controls, and hand hygiene integration for RT practice education.",
    category: "Respiratory Therapy",
    tags: ["Infection Control", "PPE", "RT Student", "CDC", "Patient Safety"],
    cluster: "infection",
    focusPhrase: "infection control during aerosol therapy and respiratory procedures",
  },
];

export function getRtLongtailTopicManifest(): RtLongtailTopic[] {
  const grid = buildGridTopics();
  const anchorSlugs = new Set(ANCHOR_TOPICS.map((t) => t.slug));
  const dedupGrid = grid.filter((g) => !anchorSlugs.has(g.slug));
  if (ANCHOR_TOPICS.length + dedupGrid.length !== 300) {
    throw new Error(
      `Expected 300 topics; got anchors=${ANCHOR_TOPICS.length} + grid=${dedupGrid.length}. Adjust STEMS/ANGLES/ANCHORS.`,
    );
  }
  return [...ANCHOR_TOPICS, ...dedupGrid];
}
